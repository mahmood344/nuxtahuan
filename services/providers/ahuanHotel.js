const BASE_URL=
 'https://api.ahuan.ir/api'

const HOTEL_IMAGE_BASE=
 'https://panel.ahuan.ir/uploads'


/*
|--------------------------------------------------------------------------
| Date
|--------------------------------------------------------------------------
*/

function normalizeDate(value){

 return String(
  value||
  ''
 )
 .slice(0,10)
 .replaceAll('/','-')

}


function calculateNights(
 checkIn,
 checkOut
){

 if(
  !checkIn||
  !checkOut
 ){
  return 0
 }

 const start=
  new Date(checkIn)

 const end=
  new Date(checkOut)

 const nights=
  Math.ceil(
   (end-start)/
   (1000*60*60*24)
  )

 return Math.max(
  0,
  nights
 )

}


/*
|--------------------------------------------------------------------------
| Normalize Rooms API
|--------------------------------------------------------------------------
*/

function normalizeRoomApiResponse(
 response
){

 if(
  Array.isArray(response)
 ){
  return response
 }

 if(
  Array.isArray(
   response?.data
  )
 ){
  return response.data
 }

 if(
  Array.isArray(
   response?.result
  )
 ){
  return response.result
 }

 return[]

}


/*
|--------------------------------------------------------------------------
| Room Id
|--------------------------------------------------------------------------
*/

function getRoomId(room){

 return Number(
  room?.id||
  room?.roomId||
  room?.hotelRoomId||
  0
 )

}


/*
|--------------------------------------------------------------------------
| Public fallback room
|--------------------------------------------------------------------------
*/

function isPublicFallbackRoom(
 room
){

 if(!room)
  return false


 const name=
  String(
   room?.name||
   ''
  ).trim()


 const type=
  String(
   room?.type||
   ''
  ).trim()


 const text=
  `${name} ${type}`


 if(
  text.includes('تست')||
  text.includes('غیرقابل فروش')||
  type==='ندارد'
 ){
  return false
 }


 return true

}


/*
|--------------------------------------------------------------------------
| Merge Availability + Rooms
|--------------------------------------------------------------------------
*/

function mergeAhuanRooms({
 availabilityRooms,
 allRooms
}){

 const normalizedAvailability=
  Array.isArray(
   availabilityRooms
  )
   ?availabilityRooms
   :[]


 const normalizedAllRooms=
  Array.isArray(
   allRooms
  )
   ?allRooms
   :[]


 const allRoomsMap=
  new Map(

   normalizedAllRooms
    .map(room=>[
     getRoomId(room),
     room
    ])
    .filter(
     ([id])=>id>0
    )

  )


 const availabilityIds=
  new Set(

   normalizedAvailability
    .map(
     room=>
      getRoomId(room)
    )
    .filter(
     id=>id>0
    )

  )


 /*
 |--------------------------------------------------------------------------
 | Sellable Rooms
 |--------------------------------------------------------------------------
 */

 const sellableRooms=
  normalizedAvailability.map(
   availabilityRoom=>{

    const roomId=
     getRoomId(
      availabilityRoom
     )


    const publicRoom=
     allRoomsMap.get(
      roomId
     )||
     {}


    return{

     ...publicRoom,

     ...availabilityRoom,

     roomId,

     forShow:false,

     displayOnly:false,

     source:'availability',

     hotelRoomImages:

      Array.isArray(
       availabilityRoom
        ?.hotelRoomImages
      )&&
      availabilityRoom
       .hotelRoomImages
       .length

       ?availabilityRoom
         .hotelRoomImages

       :Array.isArray(
         publicRoom
          ?.hotelRoomImages
        )

        ?publicRoom
          .hotelRoomImages

        :[]

    }

   }
  )


 /*
 |--------------------------------------------------------------------------
 | Display Only Rooms
 |--------------------------------------------------------------------------
 */

 const displayOnlyRooms=
  normalizedAllRooms

   .filter(room=>{

    const roomId=
     getRoomId(room)


    if(!roomId)
     return false


    if(
     availabilityIds.has(
      roomId
     )
    ){
     return false
    }


    return(
     isPublicFallbackRoom(
      room
     )
    )

   })

   .map(room=>({

    ...room,

    roomId:
     getRoomId(room),

    forShow:true,

    displayOnly:true,

    source:'rooms',

    hotelRoomImages:
     Array.isArray(
      room?.hotelRoomImages
     )
      ?room.hotelRoomImages
      :[]

   }))


 return[
  ...sellableRooms,
  ...displayOnlyRooms
 ]

}


/*
|--------------------------------------------------------------------------
| Price Details
|--------------------------------------------------------------------------
*/

function getRoomPriceDetails(
 room,
 params
){

 const price=
  room?.hotelRoomPrices?.[0]


 if(!price)
  return[]


 const details=
  Array.isArray(
   price.hotelRoomPriceDetails
  )
   ?price.hotelRoomPriceDetails
   :[]


 const start=
  normalizeDate(
   params.checkIn
  )


 const end=
  normalizeDate(
   params.checkOut
  )


 return details.filter(
  item=>{

   if(
    item?.isActive===false
   ){
    return false
   }


   const date=
    normalizeDate(
     item?.date
    )


   if(!date)
    return false


   return(
    date>=start&&
    date<end
   )

  }
 )

}


/*
|--------------------------------------------------------------------------
| Base Room Price
|--------------------------------------------------------------------------
*/

function getRoomTotalPrice(
 room,
 params
){

 const details=
  getRoomPriceDetails(
   room,
   params
  )


 if(!details.length)
  return 0


 const capacity=
  Math.max(
   1,
   Number(
    room?.capacity||
    1
   )
  )


 let roomPrice=0


 for(
  const detail
  of details
 ){

  const dbl=
   Number(
    detail?.dbl||
    0
   )

  const sgl=
   Number(
    detail?.sgl||
    0
   )

  const trp=
   Number(
    detail?.trp||
    0
   )

  const quad=
   Number(
    detail?.quad||
    0
   )


  if(
   capacity===1
  ){

   roomPrice+=
    sgl||
    dbl

   continue
  }


  if(
   capacity===2
  ){

   roomPrice+=
    dbl*2

   continue
  }


  if(
   capacity===3
  ){

   const price=
    trp||
    dbl

   roomPrice+=
    price*3

   continue
  }


  if(
   capacity>=4
  ){

   const price=
    quad||
    dbl

   roomPrice+=
    price*capacity

  }

 }


 return roomPrice

}


/*
|--------------------------------------------------------------------------
| Availability
|--------------------------------------------------------------------------
*/

function getRoomAvailableCount(
 room,
 params
){

 const details=
  getRoomPriceDetails(
   room,
   params
  )


 if(details.length){

  return Math.max(
   0,

   Math.min(
    ...details.map(
     item=>
      Math.max(
       0,

       Number(
        item?.loadNo||
        0
       )-

       Number(
        item?.bookNo||
        0
       )
      )
    )
   )
  )

 }


 const price=
  room
   ?.hotelRoomPrices
   ?.[0]


 if(price){

  return Math.max(

   0,

   Number(
    price.loadNo||
    0
   )-

   Number(
    price.bookNo||
    0
   )

  )

 }


 return 0

}


/*
|--------------------------------------------------------------------------
| Extra Bed Price
|--------------------------------------------------------------------------
*/

function getExtraBedStayPrice(
 room,
 params
){

 const details=
  getRoomPriceDetails(
   room,
   params
  )


 return details.reduce(
  (sum,item)=>
   sum+
   Number(
    item?.extBed||
    0
   ),
  0
 )

}


/*
|--------------------------------------------------------------------------
| No Bed Price
|--------------------------------------------------------------------------
*/

function getNoBedStayPrice(
 room,
 params
){

 const details=
  getRoomPriceDetails(
   room,
   params
  )


 return details.reduce(
  (sum,item)=>
   sum+
   Number(
    item?.noBed||
    0
   ),
  0
 )

}


/*
|--------------------------------------------------------------------------
| Mapper
|--------------------------------------------------------------------------
*/

export function mapAhuanRoomToStandard({
 room,
 hotel,
 params
}){

 const providerHotelId=
  String(
   hotel?.id||
   room?.hotelId||
   params?.hotelId||
   ''
  )


 const rawRoomId=
  getRoomId(room)


 const providerRoomId=
  String(
   rawRoomId||
   ''
  )


 const displayOnly=
  room?.forShow===true||
  room?.displayOnly===true


 const priceFrom=
  displayOnly
   ?0
   :getRoomTotalPrice(
     room,
     params
    )


 const availableCount=
  displayOnly
   ?0
   :getRoomAvailableCount(
     room,
     params
    )


 const nightCount=
  calculateNights(
   params?.checkIn,
   params?.checkOut
  )


 const extraBedStayPrice=
  getExtraBedStayPrice(
   room,
   params
  )


 const noBedStayPrice=
  getNoBedStayPrice(
   room,
   params
  )


 /*
  * مهم:
  *
  * ...room را فعلاً نگه می‌داریم
  * تا HotelRooms فعلی خراب نشود.
  *
  * بعداً وابستگی UI به ساختار آهوان
  * را کامل حذف می‌کنیم.
  */

 return{

  ...room,


  /*
  |--------------------------------------------------------------------------
  | Identity استاندارد
  |--------------------------------------------------------------------------
  */

  id:
   `AHUAN-${providerHotelId}-${providerRoomId}`,

  provider:
   'AHUAN',

  providerHotelId,

  providerRoomId,


  /*
  * سازگاری با Contract فعلی رزرو
  */
  roomId:
   rawRoomId,


  /*
  |--------------------------------------------------------------------------
  | Hotel
  |--------------------------------------------------------------------------
  */

  hotelId:
   Number(
    hotel?.id||
    room?.hotelId||
    params?.hotelId||
    0
   ),

  hotelName:
   String(
    hotel?.name||
    ''
   ),

  hotelStar:
   Number(
    hotel?.star||
    0
   ),


  /*
  |--------------------------------------------------------------------------
  | Room
  |--------------------------------------------------------------------------
  */

  roomName:
   String(
    room?.name||
    ''
   ),

  roomType:
   String(
    room?.type||
    ''
   ),

  description:
   room?.description||
   '',

  roomView:
   room?.roomView||
   '',


  /*
  |--------------------------------------------------------------------------
  | Capacity
  |--------------------------------------------------------------------------
  */

  capacity:
   Number(
    room?.capacity||
    0
   ),

  maxCapacity:
   Number(
    room?.maxCapacity||
    0
   ),

  doubleBedCount:
   Number(
    room?.doubleBedCount||
    0
   ),

  singleBedCount:
   Number(
    room?.singleBedCount||
    0
   ),

  sofaBedCount:
   Number(
    room?.sofaBedCount||
    0
   ),


  /*
  |--------------------------------------------------------------------------
  | Services
  |--------------------------------------------------------------------------
  */

  extraBed:
   Number(
    room?.extraBed||
    0
   ),

  extraBedService:
   room?.extraBedService||
   '',

  extraBedStayPrice,

  noBed:
   Number(
    room?.noBed||
    0
   ),

  noBedService:
   room?.noBedService||
   '',

  noBedStayPrice,

  breakfastIncluded:
   true,


  /*
  |--------------------------------------------------------------------------
  | Availability
  |--------------------------------------------------------------------------
  */

  availableCount,

  onRequest:
   room?.onRequest===true,

  displayOnly,

  forShow:
   displayOnly,

  disabled:
   displayOnly||
   priceFrom<=0||
   availableCount<=0,


  /*
  |--------------------------------------------------------------------------
  | Price
  |--------------------------------------------------------------------------
  */

  priceFrom,

  calculatedPrice:
   priceFrom,

  currency:
   'IRR',

  nightCount,


  /*
  |--------------------------------------------------------------------------
  | Images استاندارد
  |--------------------------------------------------------------------------
  */

  images:

   Array.isArray(
    room?.hotelRoomImages
   )

    ?room.hotelRoomImages
      .map(
       image=>({

        id:
         image?.id||
         null,

        url:
         image?.image
          ?`${HOTEL_IMAGE_BASE}/${image.image}`
          :'',

        description:
         image?.description||
         ''

       })
      )
      .filter(
       image=>image.url
      )

    :[],


  /*
  |--------------------------------------------------------------------------
  | Provider Data
  |--------------------------------------------------------------------------
  */

  meta:{

   raw:
    room,

   hotel:
    hotel||
    null

  }

 }

}


/*
|--------------------------------------------------------------------------
| Search Ahuan
|--------------------------------------------------------------------------
*/

export async function searchAhuanHotels(
 params
){

 const[
  availabilityResult,
  roomsResult
 ]=
  await Promise.allSettled([

   $fetch(
    `${BASE_URL}/Hotel/hotel-availability`,
    {

     params:{

      HotelId:
       params.hotelId,

      CheckIn:
       params.checkIn,

      CheckOut:
       params.checkOut

     }

    }
   ),


   $fetch(
    `${BASE_URL}/Hotel/rooms/${params.hotelId}`
   )

  ])


 const availabilityResponse=
  availabilityResult.status===
  'fulfilled'
   ?availabilityResult.value
   :null


 const roomsResponse=
  roomsResult.status===
  'fulfilled'
   ?roomsResult.value
   :null


 if(
  availabilityResult.status===
  'rejected'
 ){

  console.error(
   'AHUAN Availability Error:',
   availabilityResult.reason
  )

 }


 if(
  roomsResult.status===
  'rejected'
 ){

  console.error(
   'AHUAN Rooms Error:',
   roomsResult.reason
  )

 }


 const availabilityRooms=
  Array.isArray(
   availabilityResponse
    ?.hotelRooms
  )
   ?availabilityResponse
     .hotelRooms
   :[]


 const allRooms=
  normalizeRoomApiResponse(
   roomsResponse
  )


 const mergedRooms=
  mergeAhuanRooms({

   availabilityRooms,

   allRooms

  })


 const rooms=
  mergedRooms.map(
   room=>
    mapAhuanRoomToStandard({

     room,

     hotel:
      availabilityResponse,

     params

    })
  )


 return{

  provider:
   'AHUAN',

  hotel:
   availabilityResponse,

  rooms

 }

}