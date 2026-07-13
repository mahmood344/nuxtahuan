export const CabinType = {
  Business: 1,
  First: 2,
  PremiumBusiness: 3,
  PermiumFirst: 4,
  PremiumEconomy: 5,
  Economy: 6
}

export const PassengerType = {
  Adult: 1,
  Child: 2,
  Infant: 3
}

function normalizeDate(value) {
  if (!value) return null

  const date = String(value).replace(/\//g, '-')

  return date.includes('T')
    ? date
    : `${date}T00:00:00`
}

function resolveCabinType(cabinType) {
  if (typeof cabinType === 'number' && Object.values(CabinType).includes(cabinType)) {
    return cabinType
  }

  return CabinType[cabinType] || CabinType.Economy
}

export function buildMahanAvailabilityPayload({ searchParams, credentials }) {
  const from =
    searchParams.from ||
    searchParams.origin ||
    searchParams.cbSource

  const to =
    searchParams.to ||
    searchParams.destination ||
    searchParams.cbTarget

  const departureDate = normalizeDate(
    searchParams.departureDate ||
    searchParams.date
  )

  const returnDate = normalizeDate(
    searchParams.returnDate ||
    searchParams.arrivalDate ||
    searchParams.backDate ||
    searchParams.returnDepartureDate
  )

  if (!from || !to || !departureDate) {
    throw new Error('مبدا، مقصد و تاریخ رفت برای جستجوی ماهان الزامی است')
  }

  const adultQty = Number(searchParams.adults ?? 1)
  const childQty = Number(searchParams.children ?? 0)
  const infantQty = Number(searchParams.infants ?? 0)

  const passengers = []

  if (adultQty > 0) {
    passengers.push({
      Count: adultQty,
      Type: PassengerType.Adult
    })
  }

  if (childQty > 0) {
    passengers.push({
      Count: childQty,
      Type: PassengerType.Child
    })
  }

  if (infantQty > 0) {
    passengers.push({
      Count: infantQty,
      Type: PassengerType.Infant
    })
  }

  const flightSteps = [
    {
      Origins: [from],
      Destinations: [to],
      DepartureDate: departureDate
    }
  ]

  // در صورت وجود تاریخ برگشت، مسیر برگشت را اضافه می‌کنیم.
  if (returnDate) {
    flightSteps.push({
      Origins: [to],
      Destinations: [from],
      DepartureDate: returnDate
    })
  }

  return {
    SearchToken: '',
    AvailableRequest: {
      CabinType: resolveCabinType(searchParams.cabinType),
      IsDomestic: true,
      FlightSteps: flightSteps,
      Passengers: passengers
    },
    HandlerParameterRequest: {
      ProviderName: 'Mahan',
      UserName: credentials.userName,
      Password: credentials.password,
      BaseUrl: credentials.baseUrl,
      AgancyName: credentials.agancyName
    }
  }
}

// صدا زدن API ماهان
export async function searchMahanAvailability(payload) {
  return await $fetch('https://api.ahuan.ir/api/Mahan/Search', {
    method: 'POST',
    body: payload
  })
}

// تبدیل خروجی ماهان به ساختار استاندارد پروژه
export function mapMahanOfferToFlight(offer) {
  const itineraries = offer?.flightItinerary || []

  const outboundItinerary = itineraries[0]
  const outboundSegment = outboundItinerary?.flightSegments?.[0]

  const returnItinerary = itineraries[1]
  const returnSegment = returnItinerary?.flightSegments?.[0]

  const price =
    Number(offer?.totalFlightPrice?.totalSale) ||
    Number(offer?.totalFlightPrice?.totalFare) ||
    0

  const outboundCapacity = Number(outboundItinerary?.capacity)
  const returnCapacity = Number(returnItinerary?.capacity)

  const hasNoCapacity =
    outboundCapacity <= 0 ||
    (returnItinerary && returnCapacity <= 0)

  return {
    id: offer?.id,
    provider: 'MAHAN',

    airline:
      outboundSegment?.marketingAirline ||
      outboundSegment?.operatingAirline,

    flightNumber: outboundSegment?.flightNumber,

    origin: outboundItinerary?.originAirportCode,
    destination: outboundItinerary?.destinationAirportCode,
    departure: outboundItinerary?.departureDateTime,
    arrival: outboundItinerary?.arrivalDateTime,

    rbd: outboundSegment?.classCode,
    bookingClass: outboundSegment?.classCode,
    cabinType: outboundSegment?.cabinType,

    // اطلاعات مسیر برگشت
    isRoundTrip: Boolean(returnItinerary),
    returnOrigin: returnItinerary?.originAirportCode,
    returnDestination: returnItinerary?.destinationAirportCode,
    returnDeparture: returnItinerary?.departureDateTime,
    returnArrival: returnItinerary?.arrivalDateTime,
    returnFlightNumber: returnSegment?.flightNumber,
    returnRbd: returnSegment?.classCode,
    returnBookingClass: returnSegment?.classCode,
    returnCabinType: returnSegment?.cabinType,

    priceFrom: price,
    currency: offer?.totalFlightPrice?.currency || 'IRR',

    disabled: price <= 0 || hasNoCapacity,

    aircraftTypeCode: outboundSegment?.airplane?.code,
    aircraftTypeName: outboundSegment?.airplane?.title,
    capacity: outboundItinerary?.capacity,

    returnAircraftTypeCode: returnSegment?.airplane?.code,
    returnAircraftTypeName: returnSegment?.airplane?.title,
    returnCapacity: returnItinerary?.capacity,

    statusMessage:
      price > 0 && !hasNoCapacity
        ? 'قابل خرید'
        : 'غیرقابل خرید',

    needsFare: false,
    meta: { raw: offer }
  }
}
