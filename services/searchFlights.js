import { useFlightStore } from '../stores/flights.js'
import { searchNiraFlightForAirline } from './providers/nira.js'

import {
  buildMahanAvailabilityPayload,
  searchMahanAvailability,
  mapMahanOfferToFlight
} from './providers/mahan.js'

/*
|--------------------------------------------------------------------------
| شناسه آخرین جستجو
|--------------------------------------------------------------------------
| با شروع هر جستجو یک عدد به آن اضافه می‌شود.
| بنابراین پاسخ‌های مربوط به جستجوهای قدیمی دیگر اجازه تغییر Store را ندارند.
*/
let latestSearchId = 0

function withTimeout(promise, ms = 8000) {
  let timeoutId

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Timeout after ${ms}ms`))
    }, ms)
  })

  return Promise.race([
    promise.finally(() => {
      clearTimeout(timeoutId)
    }),
    timeoutPromise
  ])
}

export async function searchAllProviders(searchParams) {
  const flightStore = useFlightStore()

  /*
  |--------------------------------------------------------------------------
  | ساخت شناسه مختص این اجرای تابع
  |--------------------------------------------------------------------------
  */
  const searchId = ++latestSearchId

  const isCurrentSearch = () => {
    return searchId === latestSearchId
  }

  const fromCode =
    searchParams.from ||
    searchParams.origin ||
    searchParams.cbSource

  const toCode =
    searchParams.to ||
    searchParams.destination ||
    searchParams.cbTarget

  const date =
    searchParams.departureDate ||
    searchParams.date

  /*
  |--------------------------------------------------------------------------
  | گرفتن یک Snapshot از پارامترهای همین جستجو
  |--------------------------------------------------------------------------
  | تا اگر آبجکت ورودی بعداً تغییر کرد، درخواست قبلی تحت تأثیر قرار نگیرد.
  */
  const currentSearchParams = {
    ...searchParams,
    from: fromCode,
    to: toCode,
    departureDate: date
  }

  /*
  |--------------------------------------------------------------------------
  | جستجوی جدید، نتایج جستجوی قبلی را پاک می‌کند
  |--------------------------------------------------------------------------
  */
  flightStore.loading = true
  flightStore.backgroundLoading = false
  flightStore.searchFinished = false
  flightStore.flights = []

  if (!fromCode || !toCode || !date) {
    if (isCurrentSearch()) {
      flightStore.loading = false
      flightStore.backgroundLoading = false
      flightStore.searchFinished = true
    }

    return []
  }

  const niraAirlines = (flightStore.airlines || []).filter((airline) => {
    return (
      airline?.credentials &&
      airline.credentials.username &&
      airline.credentials.password
    )
  })

  /*
  |--------------------------------------------------------------------------
  | نتایج تنها متعلق به همین جستجو هستند
  |--------------------------------------------------------------------------
  */
  const allFlights = []

  let firstResultShown = false

  const sortFlights = (list) => {
    return [...list].sort((a, b) => {
      if (a?.disabled && !b?.disabled) return 1
      if (!a?.disabled && b?.disabled) return -1

      const aPrice = Number(a?.priceFrom)
      const bPrice = Number(b?.priceFrom)

      const safeAPrice =
        Number.isFinite(aPrice) && aPrice > 0
          ? aPrice
          : Number.MAX_SAFE_INTEGER

      const safeBPrice =
        Number.isFinite(bPrice) && bPrice > 0
          ? bPrice
          : Number.MAX_SAFE_INTEGER

      return safeAPrice - safeBPrice
    })
  }

  const showFirstResults = () => {
    /*
    |--------------------------------------------------------------------------
    | اگر تاریخ عوض شده، این جستجو دیگر اجازه تغییر Store را ندارد
    |--------------------------------------------------------------------------
    */
    if (!isCurrentSearch()) return

    if (!firstResultShown && allFlights.length > 0) {
      firstResultShown = true

      flightStore.setFlights(sortFlights(allFlights))

      // لودینگ تمام‌صفحه بسته می‌شود
      flightStore.loading = false

      // لودینگ پس‌زمینه تا پایان ماهان و سایر Providerها فعال می‌ماند
      flightStore.backgroundLoading = true
    }
  }

  const appendFlights = (newFlights, providerName = '') => {
    /*
    |--------------------------------------------------------------------------
    | پاسخ قدیمی نباید به تاریخ جدید اضافه شود
    |--------------------------------------------------------------------------
    */
    if (!isCurrentSearch()) {
      console.log(
        `نتیجه قدیمی ${providerName} برای تاریخ ${date} نادیده گرفته شد`
      )

      return
    }

    if (!Array.isArray(newFlights) || newFlights.length === 0) {
      return
    }

    allFlights.push(...newFlights)

    flightStore.setFlights(sortFlights(allFlights))

    showFirstResults()

    console.log(
      `${newFlights.length} پرواز از ${providerName} برای تاریخ ${date} اضافه شد`
    )
  }

  const providerTasks = []

  /*
  |--------------------------------------------------------------------------
  | درخواست‌های نیرا
  |--------------------------------------------------------------------------
  */
  for (const airline of niraAirlines) {
    const task = (async () => {
      try {
        const flights = await withTimeout(
          searchNiraFlightForAirline(airline.code, {
            from: fromCode,
            to: toCode,
            departureDate: date,

            adults: Number(currentSearchParams.adults || 1),
            children: Number(currentSearchParams.children || 0),
            infants: Number(currentSearchParams.infants || 0)
          }),
          8000
        )

        appendFlights(flights, `NIRA-${airline.code}`)
      } catch (error) {
        /*
        |--------------------------------------------------------------------------
        | خطای درخواست قدیمی اهمیتی ندارد
        |--------------------------------------------------------------------------
        */
        if (!isCurrentSearch()) return

        console.error(
          `خطا در ایرلاین ${airline.code} برای تاریخ ${date}:`,
          error
        )
      }
    })()

    providerTasks.push(task)
  }

  /*
  |--------------------------------------------------------------------------
  | درخواست ماهان
  |--------------------------------------------------------------------------
  */
  const mahanTask = (async () => {
    try {
      console.log(`ارسال درخواست ماهان برای تاریخ ${date}`)

      const mahanCred = {
        userName: 'APIAHOVAN',
        password: 'AHVN@3298',
        baseUrl:
          'https://reservations.mahanair.co.ir/webservices/services/AAResWebServices',
        agancyName: 'Ahuan'
      }

      const payload = buildMahanAvailabilityPayload({
        searchParams: currentSearchParams,
        credentials: mahanCred
      })

      const res = await withTimeout(
        searchMahanAvailability(payload),

        /*
        |--------------------------------------------------------------------------
        | 1,500,000 میلی‌ثانیه حدود 25 دقیقه است
        |--------------------------------------------------------------------------
        | بنابراین پاسخ ماهان حتی اگر دیر برسد، برای جستجوی فعلی اضافه می‌شود.
        */
        1500000
      )

      /*
      |--------------------------------------------------------------------------
      | قبل از Map کردن نیز قدیمی بودن درخواست را بررسی می‌کنیم
      |--------------------------------------------------------------------------
      */
      if (!isCurrentSearch()) {
        console.log(
          `پاسخ ماهان تاریخ ${date} رسید، اما چون تاریخ تغییر کرده نادیده گرفته شد`
        )

        return
      }

      const offers = Array.isArray(res?.flightOffers)
        ? res.flightOffers
        : []

      const mappedFlights = offers
        .map(mapMahanOfferToFlight)
        .filter(Boolean)

      appendFlights(mappedFlights, 'MAHAN')
    } catch (error) {
      if (!isCurrentSearch()) return

      console.error(
        `خطای ماهان برای تاریخ ${date}:`,
        error
      )
    }
  })()

  providerTasks.push(mahanTask)

  try {
    await Promise.allSettled(providerTasks)
  } finally {
    /*
    |--------------------------------------------------------------------------
    | جستجوی قبلی نباید Loading جستجوی جدید را ببندد
    |--------------------------------------------------------------------------
    */
    if (isCurrentSearch()) {
      if (!firstResultShown) {
        flightStore.loading = false
      }

      flightStore.backgroundLoading = false
      flightStore.searchFinished = true
    }
  }

  /*
  |--------------------------------------------------------------------------
  | خروجی درخواست قدیمی دیگر مصرف نمی‌شود
  |--------------------------------------------------------------------------
  */
  if (!isCurrentSearch()) {
    return []
  }

  console.log(
    `تمام نتایج جستجوی تاریخ ${date}:`,
    allFlights
  )

  return sortFlights(allFlights)
}
