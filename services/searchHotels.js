import{
 useHotelStore
}from'../stores/hotels.js'

import{
 searchAhuanHotels
}from'./providers/ahuanHotel.js'


let latestSearchId=0


function withTimeout(
 promise,
 ms=15000
){

 let timeoutId


 const timeoutPromise=
  new Promise(
   (_,reject)=>{

    timeoutId=
     setTimeout(()=>{

      reject(
       new Error(
        `Timeout after ${ms}ms`
       )
      )

     },ms)

   }
  )


 return Promise.race([

  promise.finally(()=>{

   clearTimeout(
    timeoutId
   )

  }),

  timeoutPromise

 ])

}
export async function searchAllHotelProviders(
 searchParams
){

 const hotelStore=
  useHotelStore()


 /*
 |--------------------------------------------------------------------------
 | Search Id
 |--------------------------------------------------------------------------
 */

 const searchId=
  ++latestSearchId


 const isCurrentSearch=()=>{

  return(
   searchId===
   latestSearchId
  )

 }


 /*
 |--------------------------------------------------------------------------
 | Search Params
 |--------------------------------------------------------------------------
 */

 const params={

  ...searchParams,

  hotelId:
   Number(
    searchParams?.hotelId||
    searchParams?.id||
    0
   ),

  cityId:
   Number(
    searchParams?.cityId||
    0
   ),

  checkIn:
   String(
    searchParams?.checkIn||
    ''
   ).trim(),

  checkOut:
   String(
    searchParams?.checkOut||
    ''
   ).trim(),

  adults:
   Number(
    searchParams?.adults||
    1
   ),

  children:
   Number(
    searchParams?.children||
    0
   )

 }


 console.log(
  'HOTEL SEARCH PARAMS:',
  params
 )


 /*
 |--------------------------------------------------------------------------
 | Reset Store
 |--------------------------------------------------------------------------
 */

 hotelStore.loading=true

 hotelStore.backgroundLoading=false

 hotelStore.searchFinished=false

 hotelStore.setSearchRooms([])


 /*
 |--------------------------------------------------------------------------
 | Validation
 |--------------------------------------------------------------------------
 */

 if(
  !params.checkIn||
  !params.checkOut
 ){

  if(isCurrentSearch()){

   hotelStore.loading=false

   hotelStore.backgroundLoading=false

   hotelStore.searchFinished=true

  }


  return[]

 }


 /*
 |--------------------------------------------------------------------------
 | Results
 |--------------------------------------------------------------------------
 */

 const allRooms=[]

 let firstResultShown=false


 /*
 |--------------------------------------------------------------------------
 | Sort Rooms
 |--------------------------------------------------------------------------
 */

 const sortRooms=list=>{

  return[
   ...list
  ].sort((a,b)=>{


   /*
   |--------------------------------------------------------------------------
   | اول اتاق قابل رزرو
   |--------------------------------------------------------------------------
   */

   if(
    a?.disabled===true&&
    b?.disabled!==true
   ){
    return 1
   }


   if(
    a?.disabled!==true&&
    b?.disabled===true
   ){
    return-1
   }


   /*
   |--------------------------------------------------------------------------
   | بعد اتاق دارای موجودی
   |--------------------------------------------------------------------------
   */

   const aAvailable=
    Number(
     a?.availableCount||
     0
    )


   const bAvailable=
    Number(
     b?.availableCount||
     0
    )


   if(
    aAvailable<=0&&
    bAvailable>0
   ){
    return 1
   }


   if(
    aAvailable>0&&
    bAvailable<=0
   ){
    return-1
   }


   /*
   |--------------------------------------------------------------------------
   | بعد قیمت
   |--------------------------------------------------------------------------
   */

   const aPrice=
    Number(
     a?.priceFrom||
     0
    )


   const bPrice=
    Number(
     b?.priceFrom||
     0
    )


   const safeAPrice=
    Number.isFinite(
     aPrice
    )&&
    aPrice>0

     ?aPrice

     :Number.MAX_SAFE_INTEGER


   const safeBPrice=
    Number.isFinite(
     bPrice
    )&&
    bPrice>0

     ?bPrice

     :Number.MAX_SAFE_INTEGER


   return(
    safeAPrice-
    safeBPrice
   )

  })

 }


 /*
 |--------------------------------------------------------------------------
 | Show First Results
 |--------------------------------------------------------------------------
 */

 const showFirstResults=()=>{

  if(!isCurrentSearch())
   return


  if(
   !firstResultShown&&
   allRooms.length>0
  ){

   firstResultShown=true


   hotelStore.setSearchRooms(
    sortRooms(
     allRooms
    )
   )


   hotelStore.loading=false

   hotelStore.backgroundLoading=true

  }

 }


 /*
 |--------------------------------------------------------------------------
 | Append Provider Rooms
 |--------------------------------------------------------------------------
 */

 const appendRooms=(
  newRooms,
  providerName=''
 )=>{

  if(!isCurrentSearch()){

   console.log(
    `نتیجه قدیمی ${providerName} نادیده گرفته شد`
   )

   return

  }


  if(
   !Array.isArray(
    newRooms
   )||
   newRooms.length===0
  ){

   console.log(
    `${providerName} اتاقی برنگرداند`
   )

   return

  }


  /*
  |--------------------------------------------------------------------------
  | جلوگیری از Duplicate
  |--------------------------------------------------------------------------
  */

  for(
   const room
   of newRooms
  ){

   if(!room)
    continue


   const exists=
    allRooms.some(
     item=>
      String(
       item?.id||
       ''
      )===
      String(
       room?.id||
       ''
      )
    )


   if(!exists){

    allRooms.push(
     room
    )

   }

  }


  /*
  |--------------------------------------------------------------------------
  | Update Store
  |--------------------------------------------------------------------------
  */

  hotelStore.setSearchRooms(
   sortRooms(
    allRooms
   )
  )


  showFirstResults()


  console.log(
   `${newRooms.length} اتاق از ${providerName} دریافت شد`
  )


  console.log(
   'HOTEL AGGREGATED ROOMS:',
   {
    provider:
     providerName,

    providerRooms:
     newRooms.length,

    allRooms:
     allRooms.length,

    storeRooms:
     hotelStore.searchRooms.length
   }
  )

 }


 /*
 |--------------------------------------------------------------------------
 | Provider Tasks
 |--------------------------------------------------------------------------
 */

 const providerTasks=[]


 /*
 |--------------------------------------------------------------------------
 | AHUAN
 |--------------------------------------------------------------------------
 */

 if(params.hotelId){

  const ahuanTask=
   (async()=>{

    try{

     console.log(
      'START AHUAN HOTEL SEARCH:',
      params
     )


     const result=
      await withTimeout(

       searchAhuanHotels(
        params
       ),

       15000

      )


     /*
     |--------------------------------------------------------------------------
     | Search قدیمی
     |--------------------------------------------------------------------------
     */

     if(!isCurrentSearch()){

      console.log(
       'AHUAN HOTEL RESULT IS OLD'
      )

      return

     }


     console.log(
      'AHUAN HOTEL RESPONSE:',
      result
     )


     /*
     |--------------------------------------------------------------------------
     | Rooms
     |--------------------------------------------------------------------------
     */

     const rooms=
      Array.isArray(
       result?.rooms
      )

       ?result.rooms

       :[]


     /*
     |--------------------------------------------------------------------------
     | Append
     |--------------------------------------------------------------------------
     */

     appendRooms(
      rooms,
      'AHUAN'
     )


     console.log(
      'AHUAN ROOMS APPENDED:',
      {
       providerRooms:
        rooms.length,

       allRooms:
        allRooms.length,

       storeRooms:
        hotelStore.searchRooms.length
      }
     )

    }
    catch(error){

     if(!isCurrentSearch())
      return


     console.error(
      'AHUAN HOTEL ERROR:',
      error
     )

    }

   })()


  providerTasks.push(
   ahuanTask
  )

 }


 /*
 |--------------------------------------------------------------------------
 | SNAPPTRIP
 |--------------------------------------------------------------------------
 |
 | بعداً:
 |
 | const snappTripTask=
 |  (async()=>{
 |
 |   try{
 |
 |    const result=
 |     await withTimeout(
 |      searchSnappTripHotels(params),
 |      15000
 |     )
 |
 |    if(!isCurrentSearch())
 |     return
 |
 |    appendRooms(
 |     result?.rooms,
 |     'SNAPPTRIP'
 |    )
 |
 |   }
 |   catch(error){
 |
 |    if(!isCurrentSearch())
 |     return
 |
 |    console.error(
 |     'SNAPPTRIP HOTEL ERROR:',
 |     error
 |    )
 |
 |   }
 |
 |  })()
 |
 |
 | providerTasks.push(
 |  snappTripTask
 | )
 |
 |--------------------------------------------------------------------------
 */


 /*
 |--------------------------------------------------------------------------
 | EGHAMAT24
 |--------------------------------------------------------------------------
 |
 | بعداً دقیقاً مشابه SnappTrip
 |
 |--------------------------------------------------------------------------
 */


 /*
 |--------------------------------------------------------------------------
 | هیچ Provider فعال نیست
 |--------------------------------------------------------------------------
 */

 if(
  providerTasks.length===0
 ){

  if(isCurrentSearch()){

   hotelStore.loading=false

   hotelStore.backgroundLoading=false

   hotelStore.searchFinished=true

   hotelStore.setSearchRooms([])

  }


  return[]

 }


 /*
 |--------------------------------------------------------------------------
 | Wait All Providers
 |--------------------------------------------------------------------------
 */

 try{

  await Promise.allSettled(
   providerTasks
  )

 }
 finally{

  if(isCurrentSearch()){

   if(
    !firstResultShown
   ){

    hotelStore.loading=false

   }


   hotelStore.backgroundLoading=false

   hotelStore.searchFinished=true

  }

 }


 /*
 |--------------------------------------------------------------------------
 | Search قبلی بوده
 |--------------------------------------------------------------------------
 */

 if(!isCurrentSearch()){

  return[]

 }


 /*
 |--------------------------------------------------------------------------
 | Final Sort
 |--------------------------------------------------------------------------
 */

 const finalRooms=
  sortRooms(
   allRooms
  )


 /*
 |--------------------------------------------------------------------------
 | Final Store
 |--------------------------------------------------------------------------
 */

 hotelStore.setSearchRooms(
  finalRooms
 )


 hotelStore.loading=false

 hotelStore.backgroundLoading=false

 hotelStore.searchFinished=true


 /*
 |--------------------------------------------------------------------------
 | Debug
 |--------------------------------------------------------------------------
 */

 console.log(
  'ALL HOTEL ROOMS:',
  finalRooms
 )


 console.log(
  'FINAL HOTEL SEARCH:',
  {
   count:
    finalRooms.length,

   storeCount:
    hotelStore.searchRooms.length,

   providers:
    [
     ...new Set(
      finalRooms.map(
       room=>
        room?.provider
      )
     )
    ]
  }
 )


 /*
 |--------------------------------------------------------------------------
 | Return
 |--------------------------------------------------------------------------
 */

 return finalRooms

}