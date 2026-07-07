
export const CabinType = {
  Business: 1,
  First: 2,
  PremiumBusiness: 3,
  PermiumFirst: 4,      // بر اساس املا سی‌شارپ شما (PermiumFirst)
  PremiumEconomy: 5,
  Economy: 6
}

export const PassengerType = {
  Adult: 1,
  Child: 2,
  Infant: 3
}
export function buildMahanAvailabilityPayload({ searchParams, credentials }) {
  const from = searchParams.from || searchParams.origin || searchParams.cbSource
  const to = searchParams.to || searchParams.destination || searchParams.cbTarget
  let date = searchParams.departureDate || searchParams.date

  if (date) {
    date = date.replace(/\//g, '-')
  }

  const departureDate = date.includes('T') ? date : `${date}T00:00:00`

  // تعیین نوع کابین بر اساس جستجو (اگر کاربر انتخاب نکرده بود، پیش‌فرض Economy قرار می‌گیرد)
  const selectedCabin = searchParams.cabinType === 'Business' 
    ? CabinType.Business 
    : CabinType.Economy

  const passengers = []
  const adultQty = Number(searchParams.adults || 1)
  const childQty = Number(searchParams.children || 0)
  const infantQty = Number(searchParams.infants || 0)

  if (adultQty) passengers.push({ Count: adultQty, Type: PassengerType.Adult })
  if (childQty) passengers.push({ Count: childQty, Type: PassengerType.Child })
  if (infantQty) passengers.push({ Count: infantQty, Type: PassengerType.Infant })

  return {
    SearchToken: " ", 
    AvailableRequest: {
      CabinType: selectedCabin, // استفاده از Enum مشخص شده
      IsDomestic: true,
      FlightSteps: [
        {
          Origins: [from],
          Destinations: [to],
          DepartureDate: departureDate
        }
      ],
      Passengers: passengers
    },
    HandlerParameterRequest: {
      ProviderName: "Mahan",
      UserName: credentials.userName,
      Password: credentials.password,
      BaseUrl: credentials.baseUrl,
      AgancyName: credentials.agancyName
    }
  }
}

// صدا زدن API ماهان
export async function searchMahanAvailability(payload) {
  const response = await $fetch("https://api.ahuan.ir/api/Mahan/Search", {
    method: "POST",
    body: payload
  })

  return response
}

// تبدیل خروجی ماهان به ساختار استاندارد پروژه
export function mapMahanOfferToFlight(offer) {
  const itin = offer?.flightItinerary?.[0]
  const seg = itin?.flightSegments?.[0]

  const price =
    Number(offer?.totalFlightPrice?.totalSale) ||
    Number(offer?.totalFlightPrice?.totalFare) ||
    0

  return {
    id: offer?.id,
    provider: "MAHAN",
    airline: seg?.marketingAirline || seg?.operatingAirline,
    flightNumber: seg?.flightNumber,

    origin: itin?.originAirportCode,
    destination: itin?.destinationAirportCode,
    departure: itin?.departureDateTime,
    arrival: itin?.arrivalDateTime,

    rbd: seg?.classCode,
    bookingClass: seg?.classCode,
    cabinType: seg?.cabinType,

    priceFrom: price,
    currency: offer?.totalFlightPrice?.currency || 'IRR',

    disabled: price <= 0 || itin?.capacity <= 0,

    aircraftTypeCode: seg?.airplane?.code,
    aircraftTypeName: seg?.airplane?.title,
    capacity: itin?.capacity,

    statusMessage: price > 0 ? "قابل خرید" : "غیرقابل خرید",
    needsFare: false,

    meta: { raw: offer }
  }
}
