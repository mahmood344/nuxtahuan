import { useFlightStore } from '../stores/flights.js'
import { searchNiraFlightForAirline } from './providers/nira.js'
import { searchParoFlights } from './providers/paro.js'

import {
  buildMahanAvailabilityPayload,
  searchMahanAvailability,
  mapMahanOfferToFlight
} from './providers/mahan.js'

/*
|--------------------------------------------------------------------------
| شناسه آخرین جستجو
|--------------------------------------------------------------------------
*/
let latestSearchId=0

function withTimeout(promise,ms=8000){
  let timeoutId

  const timeoutPromise=new Promise((_,reject)=>{
    timeoutId=setTimeout(()=>{
      reject(
        new Error(
          `Timeout after ${ms}ms`
        )
      )
    },ms)
  })

  return Promise.race([
    promise.finally(()=>{
      clearTimeout(timeoutId)
    }),
    timeoutPromise
  ])
}

export async function searchAllProviders(searchParams){
  const flightStore=useFlightStore()

  /*
  |--------------------------------------------------------------------------
  | Search Id
  |--------------------------------------------------------------------------
  */
  const searchId=++latestSearchId

  const isCurrentSearch=()=>{
    return searchId===latestSearchId
  }

  /*
  |--------------------------------------------------------------------------
  | پارامترهای جستجو
  |--------------------------------------------------------------------------
  */
  const fromCode=
    searchParams.from||
    searchParams.origin||
    searchParams.cbSource

  const toCode=
    searchParams.to||
    searchParams.destination||
    searchParams.cbTarget

  const date=
    searchParams.departureDate||
    searchParams.date

  const currentSearchParams={
    ...searchParams,
    from:fromCode,
    to:toCode,
    departureDate:date
  }

  /*
  |--------------------------------------------------------------------------
  | نوع پرواز
  |--------------------------------------------------------------------------
  */
  const flightType=
    String(
      currentSearchParams.flightType||
      'domestic'
    )
      .trim()
      .toLowerCase()

  const isInternational=
    flightType==='international'

  const isDomestic=
    flightType==='domestic'

  console.log(
    'Flight search type:',
    flightType
  )

  console.log(
    'Flight search params:',
    currentSearchParams
  )

  /*
  |--------------------------------------------------------------------------
  | Reset Store
  |--------------------------------------------------------------------------
  */
  flightStore.loading=true
  flightStore.backgroundLoading=false
  flightStore.searchFinished=false
  flightStore.flights=[]

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */
  if(
    !fromCode||
    !toCode||
    !date
  ){
    if(isCurrentSearch()){
      flightStore.loading=false
      flightStore.backgroundLoading=false
      flightStore.searchFinished=true
    }

    return[]
  }

  /*
  |--------------------------------------------------------------------------
  | نتایج همین Search
  |--------------------------------------------------------------------------
  */
  const allFlights=[]

  let firstResultShown=false

  /*
  |--------------------------------------------------------------------------
  | Sort
  |--------------------------------------------------------------------------
  */
  const sortFlights=list=>{
    return[...list].sort((a,b)=>{
      if(
        a?.disabled&&
        !b?.disabled
      ){
        return 1
      }

      if(
        !a?.disabled&&
        b?.disabled
      ){
        return-1
      }

      const aPrice=
        Number(a?.priceFrom)

      const bPrice=
        Number(b?.priceFrom)

      const safeAPrice=
        Number.isFinite(aPrice)&&
        aPrice>0
          ?aPrice
          :Number.MAX_SAFE_INTEGER

      const safeBPrice=
        Number.isFinite(bPrice)&&
        bPrice>0
          ?bPrice
          :Number.MAX_SAFE_INTEGER

      return safeAPrice-safeBPrice
    })
  }

  /*
  |--------------------------------------------------------------------------
  | نمایش اولین نتیجه
  |--------------------------------------------------------------------------
  */
  const showFirstResults=()=>{
    if(!isCurrentSearch())return

    if(
      !firstResultShown&&
      allFlights.length>0
    ){
      firstResultShown=true

      flightStore.setFlights(
        sortFlights(allFlights)
      )

      flightStore.loading=false
      flightStore.backgroundLoading=true
    }
  }

  /*
  |--------------------------------------------------------------------------
  | اضافه کردن Provider
  |--------------------------------------------------------------------------
  */
  const appendFlights=(
    newFlights,
    providerName=''
  )=>{
    if(!isCurrentSearch()){
      console.log(
        `نتیجه قدیمی ${providerName} نادیده گرفته شد`
      )

      return
    }

    if(
      !Array.isArray(newFlights)||
      newFlights.length===0
    ){
      return
    }

    allFlights.push(
      ...newFlights
    )

    flightStore.setFlights(
      sortFlights(allFlights)
    )

    showFirstResults()

    console.log(
      `${newFlights.length} پرواز از ${providerName} اضافه شد`
    )
  }

  /*
  |--------------------------------------------------------------------------
  | INTERNATIONAL
  |--------------------------------------------------------------------------
  | فقط PartoAir
  |--------------------------------------------------------------------------
  */
  if(isInternational){
    try{
      console.log(
        `ارسال درخواست PARTO برای ${fromCode}-${toCode} در تاریخ ${date}`
      )

      const partoFlights=
        await withTimeout(
          searchParoFlights(
            currentSearchParams
          ),
          60000
        )

      appendFlights(
        partoFlights,
        'PARTO'
      )
    }catch(error){
      if(isCurrentSearch()){
        console.error(
          `خطای PARTO برای تاریخ ${date}:`,
          error
        )
      }
    }finally{
      if(isCurrentSearch()){
        flightStore.loading=false
        flightStore.backgroundLoading=false
        flightStore.searchFinished=true
      }
    }

    if(!isCurrentSearch()){
      return[]
    }

    console.log(
      'تمام نتایج PARTO:',
      allFlights
    )

    return sortFlights(
      allFlights
    )
  }

  /*
  |--------------------------------------------------------------------------
  | اگر نوع پرواز Domestic نیست
  |--------------------------------------------------------------------------
  */
  if(!isDomestic){
    if(isCurrentSearch()){
      flightStore.loading=false
      flightStore.backgroundLoading=false
      flightStore.searchFinished=true
    }

    return[]
  }

  /*
  |--------------------------------------------------------------------------
  | DOMESTIC
  |--------------------------------------------------------------------------
  | فقط NIRA + MAHAN
  |--------------------------------------------------------------------------
  */

  const niraAirlines=
    (flightStore.airlines||[])
      .filter(airline=>{
        return(
          airline?.credentials&&
          airline.credentials.username&&
          airline.credentials.password
        )
      })

  const providerTasks=[]

  /*
  |--------------------------------------------------------------------------
  | NIRA
  |--------------------------------------------------------------------------
  */
  for(const airline of niraAirlines){
    const task=(async()=>{
      try{
        const flights=
          await withTimeout(
            searchNiraFlightForAirline(
              airline.code,
              {
                from:fromCode,
                to:toCode,
                departureDate:date,

                adults:Number(
                  currentSearchParams.adults||1
                ),

                children:Number(
                  currentSearchParams.children||0
                ),

                infants:Number(
                  currentSearchParams.infants||0
                )
              }
            ),
            8000
          )

        appendFlights(
          flights,
          `NIRA-${airline.code}`
        )
      }catch(error){
        if(!isCurrentSearch()){
          return
        }

        console.error(
          `خطا در ایرلاین ${airline.code} برای تاریخ ${date}:`,
          error
        )
      }
    })()

    providerTasks.push(
      task
    )
  }

  /*
  |--------------------------------------------------------------------------
  | MAHAN
  |--------------------------------------------------------------------------
  */
  const mahanTask=(async()=>{
    try{
      console.log(
        `ارسال درخواست ماهان برای تاریخ ${date}`
      )

      const mahanCred={
        userName:'APIAHOVAN',
        password:'AHVN@3298',

        baseUrl:
          'https://reservations.mahanair.co.ir/webservices/services/AAResWebServices',

        agancyName:'Ahuan'
      }

      const payload=
        buildMahanAvailabilityPayload({
          searchParams:
            currentSearchParams,

          credentials:
            mahanCred
        })

      const res=
        await withTimeout(
          searchMahanAvailability(
            payload
          ),
          1500000
        )

      if(!isCurrentSearch()){
        console.log(
          `پاسخ ماهان تاریخ ${date} قدیمی است و نادیده گرفته شد`
        )

        return
      }

      const offers=
        Array.isArray(
          res?.flightOffers
        )
          ?res.flightOffers
          :[]

      const mappedFlights=
        offers
          .map(
            mapMahanOfferToFlight
          )
          .filter(Boolean)

      appendFlights(
        mappedFlights,
        'MAHAN'
      )
    }catch(error){
      if(!isCurrentSearch()){
        return
      }

      console.error(
        `خطای ماهان برای تاریخ ${date}:`,
        error
      )
    }
  })()

  providerTasks.push(
    mahanTask
  )

  /*
  |--------------------------------------------------------------------------
  | انتظار برای پایان Providerهای داخلی
  |--------------------------------------------------------------------------
  */
  try{
    await Promise.allSettled(
      providerTasks
    )
  }finally{
    if(isCurrentSearch()){
      if(!firstResultShown){
        flightStore.loading=false
      }

      flightStore.backgroundLoading=false
      flightStore.searchFinished=true
    }
  }

  /*
  |--------------------------------------------------------------------------
  | اگر Search قدیمی شده
  |--------------------------------------------------------------------------
  */
  if(!isCurrentSearch()){
    return[]
  }

  console.log(
    `تمام نتایج جستجوی داخلی تاریخ ${date}:`,
    allFlights
  )

  return sortFlights(
    allFlights
  )
}