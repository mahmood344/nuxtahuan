// import { useFlightStore } from '../../stores/flights.js'

// const BASE_URL = 'https://api.ahuan.ir/api'

// function normalizeNiraResponse(raw, airlineCode) {
//   if (!raw) return null
//   if (typeof raw === 'object') return raw
//   if (typeof raw === 'string') {
//     const trimmed = raw.trim()
//     if (trimmed === 'SIGN') return null
//     try { return JSON.parse(trimmed) } catch (e) { return null }
//   }
//   return null
// }

// function extractAvailableFlights(response) {
//   const paths = [response?.AvailableFlights, response?.data?.AvailableFlights, response?.d?.AvailableFlights, response?.result?.AvailableFlights]
//   return paths.find(path => Array.isArray(path)) || []
// }

// /**
//  * تبدیل هر آبجکت NIRA به یک یا چند آیتم استاندارد
//  */
// function mapNiraFlightToStandardFlights(f, index, airlineCode, params) {
//   const flightAirline = f.Airline || airlineCode
//   const flightNo = f.FlightNo || index
//   const adultTotalPrices = f.AdultTotalPrices || f.AdultTotalPrice || ""

//   // --- سناریو ۱: پرواز دارای AdultTotalPrices است (پروازهای فعال) ---
//   if (adultTotalPrices && typeof adultTotalPrices === 'string' && adultTotalPrices.trim() !== "") {
//     const priceParts = adultTotalPrices.trim().split(/\s+/).filter(Boolean)
    
//     return priceParts.map(part => {
//       const [rbd, rawPrice] = part.split(':').map(s => s?.trim().toUpperCase())
//       const numericPrice = Number(rawPrice)
//       const hasValidPrice = rawPrice !== '-' && !isNaN(numericPrice) && numericPrice > 0

//       return {
//         id: `NIRA-${flightAirline}-${flightNo}-${f.DepartureDateTime}-${rbd}`,
//         provider: 'NIRA',
//         airline: flightAirline,
//         flightNumber: String(flightNo),
//         origin: f.Origin || params.from,
//         destination: f.Destination || params.to,
//         departure: f.DepartureDateTime,
//         arrival: f.ArrivalDateTime,
//         aircraftTypeCode: f.AircraftTypeCode || '',
//         aircraftTypeName: f.AircraftTypeName || '',
//         bookingClass: rbd,
//         rbd: rbd,
//         priceFrom: hasValidPrice ? numericPrice : 0,
//         currency: f.CurrencyCode || 'IRR',
//         disabled: false, // طبق دستور شما: چون در AdultTotalPrices هست، هرگز disable نمی‌شود
//         statusMessage: hasValidPrice ? 'قابل خرید' : 'استعلام نرخ',
//         needsFare: true,
//         meta: { rbd, raw: f }
//       }
//     })
//   }

//   // --- سناریو ۲: پرواز فاقد AdultTotalPrices است (پروازهای غیرفعال) ---
//   const classesStatus = f.ClassesStatus || ""
//   if (classesStatus && typeof classesStatus === 'string') {
//     const statusTokens = classesStatus.replace(/\//g, ' ').trim().split(/\s+/).filter(Boolean)
    
//     return statusTokens.map(token => {
//       // پیدا کردن کد کلاس (حروف اول) و وضعیت (حرف آخر)
//       // مثال: YC -> RBD: Y, Status: C
//       const rbd = token.substring(0, token.length - 1).toUpperCase()
//       const statusChar = token.substring(token.length - 1).toUpperCase()
      
//       let statusMessage = 'غیرقابل خرید'
//       if (statusChar === 'C') statusMessage = 'کنسل شده'
//       else if (statusChar === 'X') statusMessage = 'تکمیل ظرفیت'

//       return {
//         id: `NIRA-${flightAirline}-${flightNo}-${f.DepartureDateTime}-${rbd || token}`,
//         provider: 'NIRA',
//         airline: flightAirline,
//         flightNumber: String(flightNo),
//         origin: f.Origin || params.from,
//         destination: f.Destination || params.to,
//         departure: f.DepartureDateTime,
//         arrival: f.ArrivalDateTime,
//         aircraftTypeCode: f.AircraftTypeCode || '',
//         aircraftTypeName: f.AircraftTypeName || '',
//         bookingClass: rbd || token,
//         rbd: rbd || token,
//         priceFrom: 0,
//         currency: f.CurrencyCode || 'IRR',
//         disabled: true, // طبق دستور شما: چون AdultTotalPrices ندارد، disable می‌شود
//         statusMessage: statusMessage,
//         needsFare: false,
//         meta: { rbd, statusChar, raw: f }
//       }
//     })
//   }

//   return [] // اگر هیچکدام نبود
// }

// export async function searchNiraFlightForAirline(airlineCode, params) {
//   const flightStore = useFlightStore()
//   const creds = flightStore.airlines?.find(a => a.code === airlineCode)?.credentials
//   if (!creds?.username || !creds?.password) return []

//   try {
//     const raw = await $fetch(`${BASE_URL}/Nira/Availability`, {
//       method: 'GET',
//       params: {
//         AirLine: airlineCode,
//         OfficeUser: creds.username,
//         OfficePass: creds.password,
//         cbSource: params.from.toUpperCase(),
//         cbTarget: params.to.toUpperCase(),
//         DepartureDate: params.departureDate,
//         cbAdultQty: params.adults || 1,
//         cbChildQty: params.children || 0,
//         cbInfantQty: params.infants || 0,
//         cbDay1: 0, cbMonth1: 0
//       }
//     })

//     const response = normalizeNiraResponse(raw, airlineCode)
//     const availableFlights = extractAvailableFlights(response)
    
//     const allTickets = availableFlights.flatMap((f, idx) => 
//       mapNiraFlightToStandardFlights(f, idx, airlineCode, params)
//     )

//     // مرتب‌سازی نهایی
//     return allTickets.sort((a, b) => {
//       if (a.disabled !== b.disabled) return a.disabled ? 1 : -1
//       if (a.priceFrom > 0 && b.priceFrom > 0) return a.priceFrom - b.priceFrom
//       return 0
//     })

//   } catch (error) {
//     console.error(`NIRA Error [${airlineCode}]:`, error)
//     return []
//   }
// }

// export async function searchNiraFlights(params) {
//   return searchNiraFlightForAirline('VR', params)
// }
import{useFlightStore}from'../../stores/flights.js'

const BASE_URL='https://api.ahuan.ir/api'

function normalizeNiraResponse(raw){
  if(!raw)return null
  if(typeof raw==='object')return raw

  if(typeof raw==='string'){
    const trimmed=raw.trim()

    if(!trimmed||trimmed==='SIGN')return null

    try{
      return JSON.parse(trimmed)
    }catch{
      return null
    }
  }

  return null
}

function extractAvailableFlights(response){
  const paths=[
    response?.AvailableFlights,
    response?.data?.AvailableFlights,
    response?.d?.AvailableFlights,
    response?.result?.AvailableFlights
  ]

  return paths.find(Array.isArray)||[]
}

/*
|--------------------------------------------------------------------------
| وضعیت ظرفیت نیرا
|--------------------------------------------------------------------------
|
| A     ظرفیت بیشتر از 9 صندلی
| X     کلاس کنسل شده
| C     ظرفیت کلاس کامل شده
| 0     بدون ظرفیت
| 1-9   ظرفیت دقیق
|
*/
function parseNiraCapacity(statusChar){
  const status=String(statusChar||'')
    .trim()
    .toUpperCase()

  if(status==='A'){
    return{
      capacity:10,
      rawCapacity:'A',
      capacityTitle:'بیشتر از ۹ صندلی',
      disabled:false,
      statusMessage:'قابل خرید'
    }
  }

  if(status==='X'){
    return{
      capacity:0,
      rawCapacity:'X',
      capacityTitle:'کلاس کنسل شده',
      disabled:true,
      statusMessage:'کنسل شده'
    }
  }

  if(status==='C'){
    return{
      capacity:0,
      rawCapacity:'C',
      capacityTitle:'تکمیل ظرفیت',
      disabled:true,
      statusMessage:'تکمیل ظرفیت'
    }
  }

  if(/^[0-9]$/.test(status)){
    const capacity=Number(status)

    return{
      capacity,
      rawCapacity:status,
      capacityTitle:
        capacity>0
          ?`${capacity} صندلی`
          :'بدون ظرفیت',
      disabled:capacity===0,
      statusMessage:
        capacity>0
          ?'قابل خرید'
          :'تکمیل ظرفیت'
    }
  }

  return{
    capacity:0,
    rawCapacity:status,
    capacityTitle:'ظرفیت نامشخص',
    disabled:true,
    statusMessage:'وضعیت ظرفیت نامشخص'
  }
}

function parseNiraPrices(value){
  const result=new Map()

  String(value||'')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .forEach(part=>{
      const separatorIndex=part.indexOf(':')

      if(separatorIndex<=0)return

      const rbd=part
        .slice(0,separatorIndex)
        .trim()
        .toUpperCase()

      const rawPrice=part
        .slice(separatorIndex+1)
        .trim()

      const numericPrice=Number(rawPrice)

      result.set(rbd,{
        rawPrice,
        price:
          rawPrice!=='-'&&
          Number.isFinite(numericPrice)&&
          numericPrice>0
            ?numericPrice
            :0
      })
    })

  return result
}

function parseNiraClassesStatus(value){
  const result=new Map()

  String(value||'')
    .replace(/\//g,' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .forEach(token=>{
      const normalized=String(token)
        .trim()
        .toUpperCase()

      if(normalized.length<2)return

      /*
       * آخرین کاراکتر، وضعیت ظرفیت است.
       *
       * X1:
       * RBD = X
       * ظرفیت = 1
       *
       * YX:
       * RBD = Y
       * وضعیت = X یعنی کنسل شده
       */
      const rbd=normalized.slice(0,-1)
      const statusChar=normalized.slice(-1)

      result.set(rbd,{
        statusChar,
        ...parseNiraCapacity(statusChar)
      })
    })

  return result
}

function parseNiraRefundStatuses(value){
  const result=new Map()

  String(value||'')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .forEach(part=>{
      const separatorIndex=part.indexOf(':')

      if(separatorIndex<=0)return

      const rbd=part
        .slice(0,separatorIndex)
        .trim()
        .toUpperCase()

      const refundStatus=part
        .slice(separatorIndex+1)
        .trim()

      result.set(rbd,refundStatus)
    })

  return result
}

function mapNiraFlightToStandardFlights(
  flight,
  index,
  airlineCode,
  params
){
  const flightAirline=
    flight?.Airline||
    airlineCode

  const flightNo=
    flight?.FlightNo||
    flight?.OperatingFlightNo||
    index

  const priceMap=parseNiraPrices(
    flight?.AdultTotalPrices||
    flight?.AdultTotalPrice||
    ''
  )

  const capacityMap=parseNiraClassesStatus(
    flight?.ClassesStatus||
    ''
  )

  const refundMap=parseNiraRefundStatuses(
    flight?.ClassRefundStatus||
    ''
  )

  /*
   * تمام کلاس‌هایی که حداقل در یکی از فیلدها وجود دارند.
   */
  const rbds=new Set([
    ...priceMap.keys(),
    ...capacityMap.keys(),
    ...refundMap.keys()
  ])

  return[...rbds].map(rbd=>{
    const priceInfo=
      priceMap.get(rbd)||{
        rawPrice:'',
        price:0
      }

    const capacityInfo=
      capacityMap.get(rbd)||{
        statusChar:'',
        capacity:0,
        rawCapacity:'',
        capacityTitle:'ظرفیت نامشخص',
        disabled:true,
        statusMessage:'وضعیت ظرفیت نامشخص'
      }

    const refundStatus=
      refundMap.get(rbd)||''

    const hasPrice=
      priceInfo.price>0

    const disabled=
      capacityInfo.disabled

    let statusMessage=
      capacityInfo.statusMessage

    if(!disabled&&!hasPrice){
      statusMessage='استعلام نرخ'
    }

    if(!disabled&&hasPrice){
      statusMessage='قابل خرید'
    }

    return{
      id:
        `NIRA-${flightAirline}-`+
        `${flightNo}-`+
        `${flight?.DepartureDateTime}-`+
        `${rbd}`,

      provider:'NIRA',
      airline:flightAirline,
      flightNumber:String(flightNo),

      origin:
        flight?.Origin||
        params.from,

      destination:
        flight?.Destination||
        params.to,

      departure:
        flight?.DepartureDateTime,

      arrival:
        flight?.ArrivalDateTime,

      aircraftTypeCode:
        flight?.AircraftTypeCode||
        '',

      aircraftTypeName:
        flight?.AircraftTypeName||
        '',

      bookingClass:rbd,
      rbd,

      priceFrom:
        priceInfo.price,

      currency:
        flight?.CurrencyCode||
        'IRR',

      capacity:
        capacityInfo.capacity,

      rawCapacity:
        capacityInfo.rawCapacity,

      capacityTitle:
        capacityInfo.capacityTitle,

      disabled,
      statusMessage,

      /*
       * منطق قبلی:
       * تمام کلاس‌های قابل خرید باید Fare بگیرند،
       * حتی اگر AdultTotalPrices قیمت اولیه داشته باشد.
       */
      needsFare:
        !disabled,

      refundable:
        String(refundStatus)
          .trim()
          .toLowerCase()==='refundable',

      refundStatus,

      meta:{
        rbd,
        rawPrice:
          priceInfo.rawPrice,

        statusChar:
          capacityInfo.statusChar,

        capacity:
          capacityInfo.capacity,

        rawCapacity:
          capacityInfo.rawCapacity,

        capacityTitle:
          capacityInfo.capacityTitle,

        refundStatus,

        raw:flight
      }
    }
  })
}

export async function searchNiraFlightForAirline(
  airlineCode,
  params
){
  const flightStore=useFlightStore()

  const creds=
    flightStore.airlines?.find(
      airline=>airline.code===airlineCode
    )?.credentials

  if(
    !creds?.username||
    !creds?.password
  ){
    return[]
  }

  try{
    const raw=await $fetch(
      `${BASE_URL}/Nira/Availability`,
      {
        method:'GET',
        params:{
          AirLine:airlineCode,
          OfficeUser:creds.username,
          OfficePass:creds.password,
          cbSource:String(
            params.from||''
          ).toUpperCase(),
          cbTarget:String(
            params.to||''
          ).toUpperCase(),
          DepartureDate:
            params.departureDate,
          cbAdultQty:
            params.adults||1,
          cbChildQty:
            params.children||0,
          cbInfantQty:
            params.infants||0,
          cbDay1:0,
          cbMonth1:0
        }
      }
    )

    const response=
      normalizeNiraResponse(raw)

    const availableFlights=
      extractAvailableFlights(response)

    const allTickets=
      availableFlights.flatMap(
        (flight,index)=>
          mapNiraFlightToStandardFlights(
            flight,
            index,
            airlineCode,
            params
          )
      )

    return allTickets.sort((a,b)=>{
      /*
       * ابتدا کلاس‌های قابل خرید
       */
      if(a.disabled!==b.disabled){
        return a.disabled?1:-1
      }

      /*
       * سپس کلاس‌های دارای قیمت
       */
      if(
        (a.priceFrom>0)!==
        (b.priceFrom>0)
      ){
        return a.priceFrom>0?-1:1
      }

      /*
       * سپس قیمت ارزان‌تر
       */
      if(
        a.priceFrom>0&&
        b.priceFrom>0
      ){
        return a.priceFrom-b.priceFrom
      }

      return 0
    })
  }catch(error){
    console.error(
      `NIRA Error [${airlineCode}]:`,
      error
    )

    return[]
  }
}

export async function searchNiraFlights(params){
  return searchNiraFlightForAirline(
    'VR',
    params
  )
}