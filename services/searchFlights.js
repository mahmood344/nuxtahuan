import { useFlightStore } from '../stores/flights.js'
import { searchNiraFlightForAirline } from './providers/nira.js'
import {
  buildMahanAvailabilityPayload,
  searchMahanAvailability,
  mapMahanOfferToFlight
} from './providers/mahan.js'

function withTimeout(promise, ms = 8000) {
  let timeoutId

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Timeout after ${ms}ms`))
    }, ms)
  })

  return Promise.race([
    promise.finally(() => clearTimeout(timeoutId)),
    timeoutPromise
  ])
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

  flightStore.loading = true
  flightStore.backgroundLoading = false
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

  const showFirstResults = () => {
    if (!firstResultShown && allFlights.length > 0) {
      firstResultShown = true
      flightStore.setFlights(sortFlights(allFlights))
      flightStore.loading = false
      flightStore.backgroundLoading = true
    }
  }

  const appendFlights = (flights) => {
    if (Array.isArray(flights) && flights.length > 0) {
      allFlights.push(...flights)
      flightStore.setFlights(sortFlights(allFlights))
      showFirstResults()
    }
  }

  const providerTasks = []

  // NIRA providers
  for (const airline of niraAirlines) {
    const task = (async () => {
      try {
        const flights = await withTimeout(
          searchNiraFlightForAirline(airline.code, {
            from: fromCode,
            to: toCode,
            departureDate: date,
            adults: searchParams.adults || 1,
            children: searchParams.children || 0,
            infants: searchParams.infants || 0
          }),
          8000
        )

        appendFlights(flights)
      } catch (error) {
        console.error(`خطا در ایرلاین ${airline.code}:`, error)
      }
    })()

    providerTasks.push(task)
  }

  // Mahan provider
  const mahanTask = (async () => {
    try {
      console.log('ارسال درخواست به ماهان...')

      const mahanCred = {
        userName: 'APIAHOVAN',
        password: 'AHVN@3298',
        baseUrl: 'https://reservations.mahanair.co.ir/webservices/services/AAResWebServices',
        agancyName: 'Ahuan'
      }

      const payload = buildMahanAvailabilityPayload({
        searchParams,
        credentials: mahanCred
      })

      console.log('Mahan payload:', payload)

      const res = await withTimeout(
        searchMahanAvailability(payload),
        1500000
      )

      const offers = res?.flightOffers || []
      const mapped = offers.map(mapMahanOfferToFlight)

      appendFlights(mapped)
    } catch (err) {
      console.error('خطا ماهان:', err)
    }
  })()

  providerTasks.push(mahanTask)

  try {
    await Promise.allSettled(providerTasks)
  } finally {
    // اگر هیچ نتیجه‌ای نیامده بود، لودینگ اول را همینجا ببند
    if (!firstResultShown) {
      flightStore.loading = false
    }

    flightStore.backgroundLoading = false
    flightStore.searchFinished = true
  }
console.log(allFlights , 'allFlights');
  return sortFlights(allFlights)
}
