const BASE_URL='https://api.ahuan.ir/api'
const PARTO_SESSION_COOKIE='parto_session_id'
let creatingSessionPromise=null
function getPartoSessionCookie(){
  return useCookie(
    PARTO_SESSION_COOKIE,
    {
      sameSite:'lax',
      secure:process.env.NODE_ENV==='production'
    }
  )
}

function getPartoSessionId(){
  const cookie=getPartoSessionCookie()

  return String(
    cookie.value||''
  ).trim()
}

function savePartoSessionId(sessionId){
  const cookie=getPartoSessionCookie()

  cookie.value=String(
    sessionId||''
  ).trim()
}

function clearPartoSessionId(){
  const cookie=getPartoSessionCookie()
  cookie.value=null
}
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

  const sessionId=String(
    response.sessionId
  ).trim()

  savePartoSessionId(
    sessionId
  )

  return sessionId
}

async function getOrCreateParoSession(){
  const currentSessionId=
    getPartoSessionId()

  if(currentSessionId){
    return currentSessionId
  }

  /*
   * جلوگیری از چند create-session همزمان.
   *
   * اگر چند درخواست همزمان وارد این متد شوند،
   * فقط اولین درخواست create-session می‌زند
   * و بقیه منتظر همان Promise می‌مانند.
   */
  if(creatingSessionPromise){
    return await creatingSessionPromise
  }

  creatingSessionPromise=
    createParoSession()

  try{
    return await creatingSessionPromise
  }finally{
    creatingSessionPromise=null
  }
}
function isParoSessionError(error){
  const data=
    error?.data||
    error?.response?._data||
    error?.response?.data||
    null

  const errors=
    data?.errors||{}

  const sessionErrors=[
    ...(Array.isArray(errors?.SessionId)
      ?errors.SessionId
      :[]),

    ...(Array.isArray(errors?.sessionId)
      ?errors.sessionId
      :[])
  ]

  const messages=[
    ...sessionErrors,

    data?.error?.message,
    data?.message,
    data?.title,
    error?.message
  ]
    .filter(Boolean)
    .map(value=>
      String(value)
        .trim()
        .toLowerCase()
    )

  return messages.some(message=>
    message.includes('sessionid')||
    message.includes('session id')||
    message.includes('session expired')||
    message.includes('session has expired')||
    message.includes('invalid session')||
    message.includes('session is invalid')
  )
}
async function executeParoRequest(
  requestFactory
){
  /*
   * درخواست اول:
   * اگر Session در Cookie داریم استفاده می‌کنیم،
   * اگر نداریم ساخته می‌شود.
   */
  let sessionId=
    await getOrCreateParoSession()

  let response

  try{
    response=
      await requestFactory(
        sessionId
      )
  }catch(error){
    /*
     * فقط خطای HTTP مربوط به Session
     */
    if(
      !isParoSessionError(
        error
      )
    ){
      throw error
    }

    console.warn(
      'PARTO INVALID SESSION:',
      sessionId
    )

    /*
     * Session قبلی قطعاً خراب است.
     */
    clearPartoSessionId()

    /*
     * مهم:
     * اینجا دیگر getOrCreate نزن.
     * حتماً Session جدید بساز.
     */
    sessionId=
      await createParoSession()

    console.log(
      'PARTO NEW SESSION:',
      sessionId
    )

    /*
     * Retry دقیقاً با Session جدید
     */
    return await requestFactory(
      sessionId
    )
  }

  /*
   * Parto ممکن است HTTP 200 بدهد
   * ولی داخل Body بگوید Session نامعتبر است.
   */
  if(
    isParoSessionResponseError(
      response
    )
  ){
    console.warn(
      'PARTO INVALID SESSION RESPONSE:',
      sessionId
    )

    clearPartoSessionId()

    /*
     * مستقیم create-session
     */
    sessionId=
      await createParoSession()

    console.log(
      'PARTO NEW SESSION:',
      sessionId
    )

    /*
     * فقط یک Retry
     */
    const retryResponse=
      await requestFactory(
        sessionId
      )

    /*
     * اگر حتی Session جدید هم نامعتبر بود
     * دیگر Retry نکن.
     */
    if(
      isParoSessionResponseError(
        retryResponse
      )
    ){
      clearPartoSessionId()

      throw new Error(
        retryResponse?.error?.message||
        'Session جدید Parto نیز نامعتبر است'
      )
    }

    return retryResponse
  }

  return response
}

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
function isParoSessionResponseError(response){
  const errorId=
    String(
      response?.error?.id||
      ''
    )
      .trim()
      .toLowerCase()

  const message=
    String(
      response?.error?.message||
      ''
    )
      .trim()
      .toLowerCase()

  return(
    errorId==='err0102008'||
    message.includes('invalid sessionid')||
    message.includes('invalid session id')||
    message.includes('session expired')
  )
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
      segment.operatingAirline?.flightNumber||
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
      segment.operatingAirline?.equipment||
      '',

    aircraftTypeName:
      segment.operatingAirline?.equipmentName||
      '',

    journeyDuration:
      segment.journeyDuration||
      '',

    journeyDurationMinutes:Number(
      segment.journeyDurationPerMinute||0
    ),

    connectionTimeMinutes:Number(
      segment.connectionTimePerMinute||0
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
      Array.isArray(segment.technicalStops)
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
    refundable:
  Number(nonRefundableType)!==2,

nonRefundableType,

    refundMethod:
      itinerary?.refundMethod,

    baggage:
      first.baggage||
      '',
    stopQuantity:
  Math.max(
    mappedSegments.length-1,
    0
  ),

isDirect:
  mappedSegments.length===1,
  returnStopQuantity:
  Math.max(
    mappedReturnSegments.length-1,
    0
  ),

returnIsDirect:
  mappedReturnSegments.length===1,
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
export async function searchParoFlights(
  params
){
  const response=
    await executeParoRequest(
      async sessionId=>{
        const payload=
          buildParoAvailabilityPayload(
            params,
            sessionId
          )

        console.log(
          'PARTO REQUEST SESSION:',
          sessionId
        )

        const result=
          await $fetch(
            `${BASE_URL}/PartoAir/search`,
            {
              method:'POST',
              body:payload
            }
          )

        console.log(
          'PARTO RESPONSE:',
          {
            requestSessionId:
              sessionId,

            success:
              result?.success,

            error:
              result?.error
          }
        )

        /*
         * مهم:
         * اینجا throw نکن.
         */
        return result
      }
    )

  /*
   * executeParoRequest قبلاً Session Error
   * را مدیریت کرده.
   *
   * پس اگر هنوز success=false است،
   * خطای واقعی Search است.
   */
  if(
    response?.success===false
  ){
    throw new Error(
      response?.error?.message||
      'خطا در جستجوی Parto'
    )
  }

  const sessionId=
    getPartoSessionId()

  const flights=
    mapParoResponseToFlights(
      response
    )

  return flights.map(
    flight=>({
      ...flight,

      sessionId,

      meta:{
        ...flight.meta,
        sessionId
      }
    })
  )
}
export async function getParoRules({
  fareSourceCode,
  uniqueId=''
}){
  if(!fareSourceCode){
    throw new Error(
      'FareSourceCode پرواز Parto مشخص نیست'
    )
  }

  return executeParoRequest(
    async sessionId=>{
      const response=
        await $fetch(
          `${BASE_URL}/PartoAir/rules`,
          {
            method:'POST',
            body:{
              uniqueId:String(
                uniqueId||''
              ),
              fareSourceCode:String(
                fareSourceCode
              ),
              sessionId
            }
          }
        )

      if(
        response?.success===false&&
        !isParoSessionResponseError(response)
      ){
        throw new Error(
          response?.error?.message||
          'دریافت قوانین کنسلی ناموفق بود'
        )
      }

      return response
    }
  )
}
export async function getParoBaggages(
  fareSourceCode
){
  if(!fareSourceCode){
    throw new Error(
      'FareSourceCode پرواز Parto مشخص نیست'
    )
  }

  return executeParoRequest(
    async sessionId=>{
      const response=
        await $fetch(
          `${BASE_URL}/PartoAir/baggages`,
          {
            method:'POST',
            body:{
              fareSourceCode:
                String(fareSourceCode),
              sessionId
            }
          }
        )

      /*
       * خطای معمولی Parto
       * خطای Session توسط executeParoRequest
       * مدیریت می‌شود.
       */
      if(
        response?.success===false&&
        !isParoSessionResponseError(response)
      ){
        throw new Error(
          response?.error?.message||
          'دریافت بار مجاز ناموفق بود'
        )
      }

      return response
    }
  )
}
export async function getParoCredit(){
  return executeParoRequest(
    async sessionId=>{
      return await $fetch(
        `${BASE_URL}/PartoAir/credit`,
        {
          method:'POST',
          body:{
            sessionId
          }
        }
      )
    }
  )
}

export async function revalidateParoFlight(
  fareSourceCode
){
  if(!fareSourceCode){
    throw new Error(
      'FareSourceCode پرواز Parto مشخص نیست'
    )
  }

  const response=
    await executeParoRequest(
      async sessionId=>{
        return await $fetch(
          `${BASE_URL}/PartoAir/revalidate`,
          {
            method:'POST',
            body:{
              sessionId,
              fareSourceCode:
                String(fareSourceCode),
              isGenuine:true
            }
          }
        )
      }
    )

  if(response?.success!==true){
    throw new Error(
      response?.error?.message||
      'اعتبارسنجی پرواز Parto ناموفق بود'
    )
  }

  return response
}
export async function bookParoFlight(
  payload
){
  const response=
    await executeParoRequest(
      async sessionId=>{
        return await $fetch(
          `${BASE_URL}/PartoAir/book`,
          {
            method:'POST',

            body:{
              ...payload,
              sessionId
            }
          }
        )
      }
    )

  if(response?.success!==true){
    throw new Error(
      response?.error?.message||
      'رزرو پرواز Parto ناموفق بود'
    )
  }

  return response
}