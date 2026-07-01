import { useFlightStore } from '../stores/flights.js'
import { searchNiraFlightForAirline } from './providers/nira.js'

export async function searchAllProviders(searchParams) {
  const flightStore = useFlightStore()
  
  // ۱. فیلتر کردن ایرلاین‌هایی که فقط اعتبارنامه ورود دارند
  const niraAirlines = flightStore.airlines?.filter(
    airline => airline.credentials && airline.credentials.username
  ) || []

  if (niraAirlines.length === 0) {
    console.warn('هیچ ایرلاینی با اطلاعات ورود معتبر در استور یافت نشد.')
    return []
  }

  const fromCode = searchParams.origin || searchParams.from || searchParams.cbSource
  const toCode = searchParams.destination || searchParams.to || searchParams.cbTarget
  const date = searchParams.departDate || searchParams.departureDate || searchParams.date

  // ۲. ارسال مستقیم کد ایرلاین (رشته) به عنوان ورودی اول
  const promises = niraAirlines.map(airline => {
    return searchNiraFlightForAirline(airline.code, {
      from: fromCode,
      to: toCode,
      departureDate: date,
      adults: searchParams.adl || searchParams.adults || '1',
      children: searchParams.chd || searchParams.children || '0',
      infants: searchParams.inf || searchParams.infants || '0'
    })
  })

  if ('loading' in flightStore) flightStore.loading = true

  const results = await Promise.allSettled(promises)
  const allFlights = []

  results.forEach((result, index) => {
    const airlineName = niraAirlines[index].name
    if (result.status === 'fulfilled') {
      if (Array.isArray(result.value)) {
        allFlights.push(...result.value)
      }
    } else {
      console.error(`خطا در دریافت پروازهای ایرلاین ${airlineName}:`, result.reason)
    }
  })

  // ۳. مرتب‌سازی: پروازهای فعال صعودی بر اساس قیمت، پروازهای غیرفعال (disabled) در انتهای لیست
  const sortedFlights = allFlights.sort((a, b) => {
    if (a.disabled && !b.disabled) return 1
    if (!a.disabled && b.disabled) return -1
    return a.priceFrom - b.priceFrom
  })

  // ذخیره در استور
  if ('flights' in flightStore) {
    flightStore.flights = sortedFlights
  } else if (typeof flightStore.setFlights === 'function') {
    flightStore.setFlights(sortedFlights)
  }

  if ('loading' in flightStore) flightStore.loading = false

  return sortedFlights
}
