import { useFlightStore } from '../../stores/flights.js'

const BASE_URL = 'https://api.ahuan.ir/api'

function normalizeNiraResponse(raw, airlineCode) {
  if (!raw) return null
  if (typeof raw === 'object') return raw
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (trimmed === 'SIGN') return null
    try { return JSON.parse(trimmed) } catch (e) { return null }
  }
  return null
}

function extractAvailableFlights(response) {
  const paths = [response?.AvailableFlights, response?.data?.AvailableFlights, response?.d?.AvailableFlights, response?.result?.AvailableFlights]
  return paths.find(path => Array.isArray(path)) || []
}

/**
 * تبدیل هر آبجکت NIRA به یک یا چند آیتم استاندارد
 */
function mapNiraFlightToStandardFlights(f, index, airlineCode, params) {
  const flightAirline = f.Airline || airlineCode
  const flightNo = f.FlightNo || index
  const adultTotalPrices = f.AdultTotalPrices || f.AdultTotalPrice || ""

  // --- سناریو ۱: پرواز دارای AdultTotalPrices است (پروازهای فعال) ---
  if (adultTotalPrices && typeof adultTotalPrices === 'string' && adultTotalPrices.trim() !== "") {
    const priceParts = adultTotalPrices.trim().split(/\s+/).filter(Boolean)
    
    return priceParts.map(part => {
      const [rbd, rawPrice] = part.split(':').map(s => s?.trim().toUpperCase())
      const numericPrice = Number(rawPrice)
      const hasValidPrice = rawPrice !== '-' && !isNaN(numericPrice) && numericPrice > 0

      return {
        id: `NIRA-${flightAirline}-${flightNo}-${f.DepartureDateTime}-${rbd}`,
        provider: 'NIRA',
        airline: flightAirline,
        flightNumber: String(flightNo),
        origin: f.Origin || params.from,
        destination: f.Destination || params.to,
        departure: f.DepartureDateTime,
        arrival: f.ArrivalDateTime,
        aircraftTypeCode: f.AircraftTypeCode || '',
        aircraftTypeName: f.AircraftTypeName || '',
        bookingClass: rbd,
        rbd: rbd,
        priceFrom: hasValidPrice ? numericPrice : 0,
        currency: f.CurrencyCode || 'IRR',
        disabled: false, // طبق دستور شما: چون در AdultTotalPrices هست، هرگز disable نمی‌شود
        statusMessage: hasValidPrice ? 'قابل خرید' : 'استعلام نرخ',
        needsFare: true,
        meta: { rbd, raw: f }
      }
    })
  }

  // --- سناریو ۲: پرواز فاقد AdultTotalPrices است (پروازهای غیرفعال) ---
  const classesStatus = f.ClassesStatus || ""
  if (classesStatus && typeof classesStatus === 'string') {
    const statusTokens = classesStatus.replace(/\//g, ' ').trim().split(/\s+/).filter(Boolean)
    
    return statusTokens.map(token => {
      // پیدا کردن کد کلاس (حروف اول) و وضعیت (حرف آخر)
      // مثال: YC -> RBD: Y, Status: C
      const rbd = token.substring(0, token.length - 1).toUpperCase()
      const statusChar = token.substring(token.length - 1).toUpperCase()
      
      let statusMessage = 'غیرقابل خرید'
      if (statusChar === 'C') statusMessage = 'کنسل شده'
      else if (statusChar === 'X') statusMessage = 'تکمیل ظرفیت'

      return {
        id: `NIRA-${flightAirline}-${flightNo}-${f.DepartureDateTime}-${rbd || token}`,
        provider: 'NIRA',
        airline: flightAirline,
        flightNumber: String(flightNo),
        origin: f.Origin || params.from,
        destination: f.Destination || params.to,
        departure: f.DepartureDateTime,
        arrival: f.ArrivalDateTime,
        aircraftTypeCode: f.AircraftTypeCode || '',
        aircraftTypeName: f.AircraftTypeName || '',
        bookingClass: rbd || token,
        rbd: rbd || token,
        priceFrom: 0,
        currency: f.CurrencyCode || 'IRR',
        disabled: true, // طبق دستور شما: چون AdultTotalPrices ندارد، disable می‌شود
        statusMessage: statusMessage,
        needsFare: false,
        meta: { rbd, statusChar, raw: f }
      }
    })
  }

  return [] // اگر هیچکدام نبود
}

export async function searchNiraFlightForAirline(airlineCode, params) {
  const flightStore = useFlightStore()
  const creds = flightStore.airlines?.find(a => a.code === airlineCode)?.credentials
  if (!creds?.username || !creds?.password) return []

  try {
    const raw = await $fetch(`${BASE_URL}/Nira/Availability`, {
      method: 'GET',
      params: {
        AirLine: airlineCode,
        OfficeUser: creds.username,
        OfficePass: creds.password,
        cbSource: params.from.toUpperCase(),
        cbTarget: params.to.toUpperCase(),
        DepartureDate: params.departureDate,
        cbAdultQty: params.adults || 1,
        cbChildQty: params.children || 0,
        cbInfantQty: params.infants || 0,
        cbDay1: 0, cbMonth1: 0
      }
    })

    const response = normalizeNiraResponse(raw, airlineCode)
    const availableFlights = extractAvailableFlights(response)
    
    const allTickets = availableFlights.flatMap((f, idx) => 
      mapNiraFlightToStandardFlights(f, idx, airlineCode, params)
    )

    // مرتب‌سازی نهایی
    return allTickets.sort((a, b) => {
      if (a.disabled !== b.disabled) return a.disabled ? 1 : -1
      if (a.priceFrom > 0 && b.priceFrom > 0) return a.priceFrom - b.priceFrom
      return 0
    })

  } catch (error) {
    console.error(`NIRA Error [${airlineCode}]:`, error)
    return []
  }
}

export async function searchNiraFlights(params) {
  return searchNiraFlightForAirline('VR', params)
}
