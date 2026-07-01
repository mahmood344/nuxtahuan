import { parseNiraClasses, parseNiraPrices } from '../adapters/niraParser.js'
import { useFlightStore } from '../../stores/flights.js' // مسیر استور را در صورت نیاز اصلاح کنید

const BASE_URL = 'https://api.ahuan.ir/api'

/**
 * جستجوی پروازهای نیرا برای یک ایرلاین خاص
 * @param {string} airlineCode - کد دو حرفی ایرلاین (مثلاً VR, Y9)
 * @param {object} params - پارامترهای جستجو
 */
export async function searchNiraFlightForAirline(airlineCode, params) {
  // کنترل پارامترهای ورودی برای جلوگیری از ارسال فیلدهای خالی
  if (!params.from || !params.to) {
    console.warn(`مبدا یا مقصد برای ایرلاین ${airlineCode} ارسال نشده است.`)
    return []
  }

  // پیدا کردن اعتبارنامه مربوط به ایرلاین از روی استور
  const flightStore = useFlightStore()
  const airlineInfo = flightStore.airlines?.find(a => a.code === airlineCode)
  const creds = airlineInfo?.credentials

  // اگر اعتبارنامه یافت نشد، لاگ بزند ولی می‌توانید مقادیر پیش‌فرض بگذارید یا درخواست را رد کنید
  if (!creds || !creds.username || !creds.password) {
    console.warn(`اعتبارنامه معتبری برای ایرلاین ${airlineCode} یافت نشد.`)
    return []
  }

  // فرمت تاریخ ورودی
  const formattedDate = params.departureDate || ''

  try {
    const raw = await $fetch(`${BASE_URL}/Nira/Availability`, {
      method: 'GET',
      params: {
        AirLine: airlineCode, // اعمال داینامیک کد ایرلاین
        OfficeUser: creds.username, // نام کاربری داینامیک از استور
        OfficePass: creds.password, // رمز عبور داینامیک از استور
        cbSource: String(params.from).toUpperCase(),
        cbTarget: String(params.to).toUpperCase(),
        DepartureDate: formattedDate,
        cbAdultQty: String(params.adults || '1'),
        cbChildQty: String(params.children || '0'),
        cbInfantQty: String(params.infants || '0'),
        cbDay1: 0,
        cbMonth1: 0
      }
    })

    if (!Array.isArray(raw)) return []

    return raw.map(f => {
      const classInfo = parseNiraClasses(f.ClassesStatus)
      const priceInfo = parseNiraPrices(f.AdultTotalPrices)

      const hasSeats = classInfo.available && classInfo.seats > 0
      const hasPrice = priceInfo.min > 0

      let disabled = false
      let statusMessage = 'قابل خرید'

      if (!hasSeats) {
        disabled = true
        statusMessage = 'ظرفیت تکمیل'
      } else if (!hasPrice) {
        disabled = true
        statusMessage = 'فاقد نرخ معتبر'
      }

      // تعیین ایرلاین بازگشتی
      const flightAirline = f.Airline || airlineCode

      return {
        id: `NIRA-${flightAirline}-${f.FlightNo}-${f.DepartureDateTime}`,
        provider: 'NIRA',
        airline: flightAirline,
        flightNumber: String(f.FlightNo),
        origin: f.Origin,
        destination: f.Destination,
        departure: f.DepartureDateTime,
        arrival: f.ArrivalDateTime,
        cabin: 'economy',
        capacity: classInfo.seats,
        // اگر قیمت نداشت، ۰ می‌گذاریم تا بعداً در مرتب‌سازی به انتهای لیست هدایت شود
        priceFrom: hasPrice ? priceInfo.min : 0, 
        currency: f.CurrencyCode || 'IRR',
        disabled, // اضافه شدن پروازها حتی اگر غیرفعال باشند
        statusMessage,
        needsFare: true,
        meta: {
          airline: flightAirline,
          route: `${f.Origin}-${f.Destination}`,
          rbd: classInfo.rbd,
          departureDate: formattedDate,
          flightNo: String(f.FlightNo)
        },
        fareDetails: null
      }
    })
  } catch (error) {
    console.error(`خطا در دریافت اطلاعات از سرویس دسترس‌پذیری نیرا برای ایرلاین ${airlineCode}:`, error)
    return []
  }
}

/**
 * تابع کمکی در صورتی که همچنان در بخش‌های دیگر پروژه به متد searchNiraFlights نیاز باشد
 */
export async function searchNiraFlights(params) {
  const defaultAirline = 'VR'
  return searchNiraFlightForAirline(defaultAirline, params)
}
