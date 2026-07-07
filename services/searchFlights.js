import { useFlightStore } from '../stores/flights.js'
import { searchNiraFlightForAirline } from './providers/nira.js'
import {
  buildMahanAvailabilityPayload,
  searchMahanAvailability,
  mapMahanOfferToFlight
} from './providers/mahan.js'
// تابع کمکی برای ایجاد محدودیت زمانی در درخواست‌ها
function withTimeout(promise, ms = 8000) {
  let timeoutId;
  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      console.warn(`درخواست ایرلاین بعد از ${ms} میلی‌ثانیه متوقف شد (Timeout).`);
      resolve([]); // در صورت تایم‌اوت، لیست خالی برمی‌گرداند
    }, ms);
  });

  return Promise.race([
    promise.finally(() => clearTimeout(timeoutId)),
    timeoutPromise
  ]);
}

export async function searchAllProviders(searchParams) {
  const flightStore = useFlightStore()

  const fromCode = searchParams.from || searchParams.origin || searchParams.cbSource
  const toCode = searchParams.to || searchParams.destination || searchParams.cbTarget
  const date = searchParams.departureDate || searchParams.date

  const niraAirlines = (flightStore.airlines || []).filter((airline) => {
    return (
      airline?.credentials &&
      airline.credentials.username &&
      airline.credentials.password
    )
  })

  // ۱. ریست کردن وضعیت‌ها در شروع جستجو
  flightStore.loading = true
  flightStore.backgroundLoading = true
  flightStore.searchFinished = false
  flightStore.flights = []

  if (!fromCode || !toCode) {
  flightStore.loading = false
  flightStore.backgroundLoading = false
  flightStore.searchFinished = true
  return []
}

  const allFlights = []
  let firstResultShown = false

  const sortFlights = (list) => {
    return [...list].sort((a, b) => {
      if (a?.disabled && !b?.disabled) return 1
      if (!a?.disabled && b?.disabled) return -1
      return (Number(a?.priceFrom) || 0) - (Number(b?.priceFrom) || 0)
    })
  }

  const tasks = niraAirlines.map(async (airline) => {
    try {
      // استفاده از Timeout برای جلوگیری از گیر کردن لودینگ
      const flights = await withTimeout(
        searchNiraFlightForAirline(airline.code, {
          from: fromCode,
          to: toCode,
          departureDate: date,
          adults: searchParams.adults || 1,
          children: searchParams.children || 0,
          infants: searchParams.infants || 0
        }),
        8000 // ۸ ثانیه فرصت برای هر ایرلاین
      )

      if (Array.isArray(flights) && flights.length > 0) {
        allFlights.push(...flights)
        flightStore.setFlights(sortFlights(allFlights))

        // تغییر لودینگ بزرگ به کوچک پس از اولین دریافت موفق
        if (!firstResultShown) {
          firstResultShown = true
          setTimeout(() => {
            // فقط اگر جستجو هنوز تمام نشده بود، لودینگ بزرگ را بردار و بک‌گراند را روشن بذار
            if (!flightStore.searchFinished) {
              flightStore.loading = false
              flightStore.backgroundLoading = true
            }
          }, 500)
        }
      }
    } catch (error) {
      console.error(`خطا در ایرلاین ${airline.code}:`, error)
    }
  })
const mahanTask = async () => {
  try {
    console.log("ارسال درخواست به ماهان...")

    const mahanCred = {
      userName: "APIAHOVAN",
      password: "AHVN@3298",
      baseUrl: "https://reservations.mahanair.co.ir/webservices/services/AAResWebServices",
      agancyName: "Ahuan"
    }

    const payload = buildMahanAvailabilityPayload({
      searchParams,
      credentials: mahanCred
    })

    const res = await withTimeout(
      searchMahanAvailability(payload),
      8000
    )

    const offers = res?.flightOffers || []

    if (offers.length > 0) {
      const mapped = offers.map(mapMahanOfferToFlight)

      allFlights.push(...mapped)
      flightStore.setFlights(sortFlights(allFlights))
      console.log(allFlights , 'allFlights');
      
      if (!firstResultShown) {
        firstResultShown = true
        setTimeout(() => {
          if (!flightStore.searchFinished) {
            flightStore.loading = false
            flightStore.backgroundLoading = true
          }
        }, 500)
      }
    } else {
      console.log("ماهان پروازی نداشت")
    }

  } catch (err) {
    console.error("خطا ماهان:", err)
  }
}
tasks.push(mahanTask())
  try {
    // منتظر ماندن برای تمام شدن تمام درخواست‌ها (یا تایم‌اوت شدن آن‌ها)
    await Promise.allSettled(tasks)
  } finally {
    console.log('--- تمام درخواست‌ها با موفقیت یا خطا خاتمه یافتند ---')
    
    // ۲. خاموش کردن قطعی تمام لودینگ‌ها در پایان
    flightStore.loading = false
    flightStore.backgroundLoading = false
    flightStore.searchFinished = true
  }

  return sortFlights(allFlights)
}
