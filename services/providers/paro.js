import{useFlightStore}from'../../stores/flights.js'
const BASE_URL='https://api.ahuan.ir/api'
export async function createParoSession(){
  const response=await $fetch(
    `${BASE_URL}/PartoAir/create-session`,
    {
      method:'POST'
    }
  )

  if(
    !response?.success||
    !response?.sessionId
  ){
    throw new Error(
      response?.error?.message||
      response?.error||
      'دریافت SessionId ناموفق بود'
    )
  }

  return response.sessionId
}

async function getOrCreateParoSession(){
  const flightStore=useFlightStore()

  if(flightStore.partoSessionId){
    return flightStore.partoSessionId
  }

  const sessionId=
    await createParoSession()

  flightStore.setPartoSessionId(
    sessionId
  )

  return sessionId
}
function isParoSessionError(error){
  const data=
    error?.data||
    error?.response?._data||
    error?.response?.data||
    null

  const errors=
    data?.errors||{}

  const sessionErrors=
    errors?.SessionId||
    errors?.sessionId||
    []

  if(
    Array.isArray(sessionErrors)&&
    sessionErrors.some(message=>
      String(message)
        .toLowerCase()
        .includes('sessionid')
    )
  ){
    return true
  }

  const message=String(
    data?.title||
    data?.message||
    error?.message||
    ''
  ).toLowerCase()

  return(
    message.includes('sessionid')||
    message.includes('session id')
  )
}
async function executeParoRequest(
  requestFactory
){
  const flightStore=useFlightStore()

  let sessionId=
    await getOrCreateParoSession()

  try{
    return await requestFactory(
      sessionId
    )
  }catch(error){
    if(!isParoSessionError(error)){
      throw error
    }

    /*
     * Session خراب/منقضی/ارسال نشده
     */
    flightStore.clearPartoSessionId()

    sessionId=
      await getOrCreateParoSession()

    /*
     * فقط یک Retry
     */
    return await requestFactory(
      sessionId
    )
  }
}
// export async function createParoSession(){
//   const response=await $fetch(
//     `${BASE_URL}/PartoAir/create-session`,
//     {
//       method:'POST'
//     }
//   )

//   if(
//     !response?.success||
//     !response?.sessionId
//   ){
//     throw new Error(
//       response?.error||
//       'دریافت SessionId از PartoAir ناموفق بود'
//     )
//   }

//   return response.sessionId
// }
function normalizeDate(value){
  if(!value)return ''

  return String(value)
    .trim()
    .replace(/\//g,'-')
    .split('T')[0]
}

function getAirTripType(travelType){
  return String(travelType||'one-way')
    .toLowerCase()==='round-trip'
      ?2
      :1
}

function buildOriginDestinations(params){
  const result=[
    {
      departureDateTime:normalizeDate(
        params.departureDate
      ),
      originLocationCode:String(
        params.from||''
      ).toUpperCase(),
      originType:2,
      destinationLocationCode:String(
        params.to||''
      ).toUpperCase(),
      destinationType:2
    }
  ]

  if(
    String(params.travelType)
      .toLowerCase()==='round-trip'&&
    params.returnDate
  ){
    result.push({
      departureDateTime:normalizeDate(
        params.returnDate
      ),
      originLocationCode:String(
        params.to||''
      ).toUpperCase(),
      originType:2,
      destinationLocationCode:String(
        params.from||''
      ).toUpperCase(),
      destinationType:2
    })
  }

  return result
}

export function buildParoAvailabilityPayload(
  params,
  sessionId
){
  return{
    adultCount:Number(
      params.adults||1
    ),

    sessionId,

    childCount:Number(
      params.children||0
    ),

    infantCount:Number(
      params.infants||0
    ),

    isGenuine:true,

    originDestinationInformations:
      buildOriginDestinations(params),

    pricingSourceType:0,
    requestOption:0,

    travelPreference:{
      cabinType:100,
      maxStopsQuantity:Number(
        params.maxStopsQuantity??0
      ),
      airTripType:
        getAirTripType(
          params.travelType
        ),
      vendorExcludeCodes:[],
      vendorPreferenceCodes:[]
    }
  }
}

function getPassengerPrice(
  pricingInfo,
  passengerType
){
  const items=
    pricingInfo
      ?.ptcFareBreakdown||[]

  const item=items.find(
    x=>
      Number(
        x?.passengerTypeQuantity
          ?.passengerType
      )===passengerType
  )

  if(!item)return null

  return{
    type:passengerType,

    count:Number(
      item?.passengerTypeQuantity
        ?.quantity||0
    ),

    baseFare:Number(
      item?.passengerFare
        ?.baseFare||0
    ),

    totalFare:Number(
      item?.passengerFare
        ?.totalFare||0
    ),

    tax:Number(
      item?.passengerFare
        ?.taxes
        ?.reduce(
          (sum,tax)=>
            sum+
            Number(tax?.amount||0),
          0
        )||0
    ),

    serviceTax:Number(
      item?.passengerFare
        ?.serviceTax||0
    ),

    currency:
      item?.passengerFare
        ?.currency||
      'IRR'
  }
}

function mapParoSegment(segment){
  if(!segment)return null

  return{
    airline:
      segment.marketingAirlineCode||
      segment.operatingAirline?.code||
      '',

    operatingAirline:
      segment.operatingAirline?.code||
      '',

    flightNumber:String(
      segment.flightNumber||
      segment.operatingAirline
        ?.flightNumber||
      ''
    ),

    origin:
      segment.departureAirportLocationCode||
      '',

    destination:
      segment.arrivalAirportLocationCode||
      '',

    departure:
      segment.departureDateTime,

    arrival:
      segment.arrivalDateTime,

    rbd:
      segment.resBookDesigCode||
      '',

    bookingClass:
      segment.resBookDesigCode||
      '',

    cabinType:
      segment.cabinClassCode,

    capacity:Number(
      segment.seatsRemaining||0
    ),

    baggage:
      segment.baggage||
      '',

    aircraftTypeCode:
      segment.operatingAirline
        ?.equipment||
      '',

    aircraftTypeName:
      segment.operatingAirline
        ?.equipmentName||
      '',

    stopQuantity:Number(
      segment.stopQuantity||0
    ),

    journeyDuration:
      segment.journeyDuration||
      '',

    journeyDurationMinutes:Number(
      segment.journeyDurationPerMinute||
      0
    ),

    departureTerminal:
      segment.departureTerminal,

    arrivalTerminal:
      segment.arrivalTerminal,

    isCharter:
      segment.isCharter===true,

    isReturn:
      segment.isReturn===true,

    technicalStops:
      Array.isArray(
        segment.technicalStops
      )
        ?segment.technicalStops
        :[]
  }
}

export function mapParoItineraryToFlight(
  itinerary,
  index=0
){
  const pricingInfo=
    itinerary?.airItineraryPricingInfo

  const totalFare=
    pricingInfo?.itinTotalFare

  const options=
    itinerary
      ?.originDestinationOptions||[]

  /*
   * تمام segmentهای رفت.
   */
  const outboundSegments=
    options
      .flatMap(
        option=>
          Array.isArray(
            option?.flightSegments
          )
            ?option.flightSegments
            :[]
      )
      .filter(
        segment=>segment?.isReturn!==true
      )

  /*
   * تمام segmentهای برگشت.
   */
  const returnSegments=
    options
      .flatMap(
        option=>
          Array.isArray(
            option?.flightSegments
          )
            ?option.flightSegments
            :[]
      )
      .filter(
        segment=>segment?.isReturn===true
      )

  const first=
    outboundSegments[0]

  const last=
    outboundSegments[
      outboundSegments.length-1
    ]

  if(!first||!last){
    return null
  }

  const mappedSegments=
    outboundSegments
      .map(mapParoSegment)
      .filter(Boolean)

  const mappedReturnSegments=
    returnSegments
      .map(mapParoSegment)
      .filter(Boolean)

  const firstReturn=
    mappedReturnSegments[0]

  const lastReturn=
    mappedReturnSegments[
      mappedReturnSegments.length-1
    ]

  const price=Number(
    totalFare?.totalFare||0
  )

  const capacities=
    mappedSegments
      .map(x=>Number(x.capacity))
      .filter(Number.isFinite)

  const capacity=
    capacities.length
      ?Math.min(...capacities)
      :0

  const returnCapacities=
    mappedReturnSegments
      .map(x=>Number(x.capacity))
      .filter(Number.isFinite)

  const returnCapacity=
    returnCapacities.length
      ?Math.min(...returnCapacities)
      :null

  const disabled=
    price<=0||
    capacity<=0||
    (
      mappedReturnSegments.length>0&&
      Number(returnCapacity)<=0
    )||
    itinerary?.isClosed===true

  const adultPrice=
    getPassengerPrice(
      pricingInfo,
      1
    )

  const childPrice=
    getPassengerPrice(
      pricingInfo,
      2
    )

  const infantPrice=
    getPassengerPrice(
      pricingInfo,
      3
    )

  /*
   * طبق نمونه‌ای که فرستادی:
   * nonRefundableType = 0
   *
   * فعلاً این مقدار را نگه می‌داریم.
   * اگر enum دقیق Paro را داری
   * refundable را بعداً دقیق می‌کنیم.
   */
  const nonRefundableType=
    itinerary?.nonRefundableType

  return{
    id:
      `PARO-${itinerary?.fareSourceCode||index}`,

    provider:'PARTO',

    airline:
      first.marketingAirlineCode||
      first.operatingAirline?.code||
      itinerary?.validatingAirlineCode||
      '',

    flightNumber:String(
      first.flightNumber||
      ''
    ),

    origin:
      first.departureAirportLocationCode,

    destination:
      last.arrivalAirportLocationCode,

    departure:
      first.departureDateTime,

    arrival:
      last.arrivalDateTime,

    rbd:
      first.resBookDesigCode||
      '',

    bookingClass:
      first.resBookDesigCode||
      '',

    cabinType:
      first.cabinClassCode,

    priceFrom:price,

    currency:
      totalFare?.currency||
      'IRR',

    capacity,

    rawCapacity:String(
      capacity
    ),

    capacityTitle:
      capacity>0
        ?`${capacity} صندلی`
        :'تکمیل ظرفیت',

    disabled,

    statusMessage:
      disabled
        ?'غیرقابل خرید'
        :'قابل خرید',

    needsFare:false,

    /*
     * فعلاً null چون معنی enum
     * nonRefundableType را هنوز
     * قطعی نکرده‌ایم.
     */
    refundable:null,

    nonRefundableType,

    refundMethod:
      itinerary?.refundMethod,

    baggage:
      first.baggage||
      '',

    aircraftTypeCode:
      first.operatingAirline
        ?.equipment||
      '',

    aircraftTypeName:
      first.operatingAirline
        ?.equipmentName||
      '',

    durationMinutes:Number(
      options[0]
        ?.journeyDurationPerMinute||
      first.journeyDurationPerMinute||
      0
    ),

    durationText:
      first.journeyDuration||
      '',

    stopQuantity:
      Math.max(
        mappedSegments.length-1,
        0
      ),

    isDirect:
      mappedSegments.length===1,

    isCharter:
      mappedSegments.some(
        x=>x.isCharter
      ),

    isPassportMandatory:
      itinerary
        ?.isPassportMandatory===true,

    isPassportIssueDateMandatory:
      itinerary
        ?.isPassportIssueDateMandatory===true,

    isDestinationAddressMandatory:
      itinerary
        ?.isDestinationAddressMandatory===true,

    isMealServiceMandatory:
      itinerary
        ?.isMealServiceMandatory===true,

    isSeatServiceMandatory:
      itinerary
        ?.isSeatServiceMandatory===true,

    fareSourceCode:
      itinerary?.fareSourceCode,

    validatingAirlineCode:
      itinerary
        ?.validatingAirlineCode,

    labels:
      itinerary?.labels||[],

    labelsFa:
      itinerary?.labelsFa||[],

    segments:
      mappedSegments,

    /*
     * برگشت
     */
    isRoundTrip:
      mappedReturnSegments.length>0,

    returnOrigin:
      firstReturn?.origin,

    returnDestination:
      lastReturn?.destination,

    returnDeparture:
      firstReturn?.departure,

    returnArrival:
      lastReturn?.arrival,

    returnFlightNumber:
      firstReturn?.flightNumber,

    returnRbd:
      firstReturn?.rbd,

    returnBookingClass:
      firstReturn?.bookingClass,

    returnCabinType:
      firstReturn?.cabinType,

    returnCapacity,

    returnAircraftTypeCode:
      firstReturn?.aircraftTypeCode,

    returnAircraftTypeName:
      firstReturn?.aircraftTypeName,

    returnSegments:
      mappedReturnSegments,

    passengerPrices:{
      adult:adultPrice,
      child:childPrice,
      infant:infantPrice
    },

    meta:{
      fareSourceCode:
        itinerary?.fareSourceCode,

      fareType:
        pricingInfo?.fareType,

      baseFare:Number(
        totalFare?.baseFare||0
      ),

      totalFare:price,

      totalTax:Number(
        totalFare?.totalTax||0
      ),

      serviceTax:Number(
        totalFare?.serviceTax||0
      ),

      totalCommission:Number(
        totalFare?.totalCommission||0
      ),

      capacity,

      nonRefundableType,

      refundMethod:
        itinerary?.refundMethod,

      segments:
        mappedSegments,

      returnSegments:
        mappedReturnSegments,

      raw:itinerary
    }
  }
}

export function mapParoResponseToFlights(response){
  const items=
    Array.isArray(
      response?.pricedItineraries
    )
      ?response.pricedItineraries
      :[]

  return items
    .map(
      (item,index)=>
        mapParoItineraryToFlight(
          item,
          index
        )
    )
    .filter(Boolean)
}

/*
 * آدرس endpoint را از API خودت اینجا قرار بده.
 * چون endpoint Paro در کدی که فرستادی وجود نداشت،
 * عمداً حدس نزدم.
 */
export async function searchParoFlights(params){
  return executeParoRequest(
    async sessionId=>{
      const payload=
        buildParoAvailabilityPayload(
          params,
          sessionId
        )

      const response=
        await $fetch(
          `${BASE_URL}/PartoAir/search`,
          {
            method:'POST',
            body:payload
          }
        )

      const flights=
        mapParoResponseToFlights(
          response
        )

      return flights.map(flight=>({
        ...flight,

        sessionId,

        meta:{
          ...flight.meta,
          sessionId
        }
      }))
    }
  )
}