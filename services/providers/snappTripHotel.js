const BASE_URL=
 'https://api.ahuan.ir/api'


/*
|--------------------------------------------------------------------------
| Normalize Response
|--------------------------------------------------------------------------
*/

function normalizeResponse(
 response
){

 let items=[]


 if(
  Array.isArray(
   response
  )
 ){
  items=
   response
 }
 else if(
  Array.isArray(
   response?.data
  )
 ){
  items=
   response.data
 }
 else if(
  Array.isArray(
   response?.result
  )
 ){
  items=
   response.result
 }


 return items
  .flat(
   Infinity
  )

}


/*
|--------------------------------------------------------------------------
| Nights
|--------------------------------------------------------------------------
*/

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
  new Date(
   checkIn
  )


 const end=
  new Date(
   checkOut
  )


 if(
  Number.isNaN(
   start.getTime()
  )||
  Number.isNaN(
   end.getTime()
  )
 ){
  return 0
 }


 return Math.max(
  0,

  Math.ceil(
   (end-start)/
   (
    1000*
    60*
    60*
    24
   )
  )
 )

}


/*
|--------------------------------------------------------------------------
| Facilities
|--------------------------------------------------------------------------
*/

function mapFacilities(
 facilitiesTags
){

 if(
  !Array.isArray(
   facilitiesTags
  )
 ){
  return[]
 }


 return facilitiesTags.flatMap(
  group=>{

   if(
    !Array.isArray(
     group?.facilities
    )
   ){
    return[]
   }


   return group.facilities.map(
    facility=>({

     icon:
      String(
       facility?.icon||
       ''
      ),

     title:
      String(
       facility?.title||
       ''
      )

    })
   )

  }
 )

}


/*
|--------------------------------------------------------------------------
| Mapper
|--------------------------------------------------------------------------
*/

export function mapSnappTripRoomToStandard({
 item,
 params
}){

 /*
 |--------------------------------------------------------------------------
 | Raw Objects
 |--------------------------------------------------------------------------
 */

 const hotel=
  item?.hotel||
  {}

 const room=
  item?.room||
  {}


 /*
 |--------------------------------------------------------------------------
 | Hotel Identity
 |--------------------------------------------------------------------------
 */

 const hotelId=
  Number(
   hotel?.id||
   0
  )

 const roomId=
  Number(
   room?.id||
   0
  )

 const cityId=
  Number(
   item?.city_id||
   params?.cityId||
   0
  )

 const providerHotelId=
  String(
   hotelId||
   ''
  )

 const providerRoomId=
  String(
   roomId||
   ''
  )


 /*
 |--------------------------------------------------------------------------
 | Hotel
 |--------------------------------------------------------------------------
 */

 const hotelName=
  String(
   hotel?.title||
   ''
  )
   .trim()

 const hotelStar=
  Number(
   hotel?.stars||
   0
  )

 const hotelAddress=
  String(
   hotel?.address||
   ''
  )
   .trim()

 const accommodationTitle=
  String(
   hotel?.accommodation_title||
   ''
  )
   .trim()

 const accommodationType=
  String(
   hotel?.accommodation_type||
   ''
  )
   .trim()


 /*
 |--------------------------------------------------------------------------
 | Room
 |--------------------------------------------------------------------------
 */

 const roomName=
  String(
   room?.title||
   ''
  )
   .trim()

 const description=
  String(
   item?.description||
   ''
  )
   .trim()


 /*
 |--------------------------------------------------------------------------
 | Board Type
 |--------------------------------------------------------------------------
 */

 const boardType=
  String(
   item?.board_type||
   ''
  )
   .trim()

 const normalizedBoardType=
  boardType
   .toLowerCase()


 /*
 |--------------------------------------------------------------------------
 | Breakfast
 |--------------------------------------------------------------------------
 */

 const breakfastIncluded=
  [
   'bb',
   'hb',
   'fb',
   'bed_breakfast',
   'half_board',
   'full_board'
  ].includes(
   normalizedBoardType
  )||
  normalizedBoardType
   .includes(
    'breakfast'
   )||
  boardType
   .includes(
    'صبحانه'
   )


/*
|--------------------------------------------------------------------------
| Price
|--------------------------------------------------------------------------
|
| SnappTrip Price = تومان
| Standard Price = ریال
|
| تومان × 10 = ریال
|
|--------------------------------------------------------------------------
*/

const TOMAN_TO_RIAL=
 10


const originalPrice=
 Number(
  room?.price||
  0
 )*
 TOMAN_TO_RIAL


const priceOff=
 Number(
  room?.price_off||
  0
 )*
 TOMAN_TO_RIAL


const discountPercent=
 Number(
  room?.discount_percent||
  0
 )


const childPrice=
 Number(
  room?.child_price||
  0
 )*
 TOMAN_TO_RIAL


const extraBedPrice=
 Number(
  room?.extra_bed_price||
  0
 )*
 TOMAN_TO_RIAL

 /*
 |--------------------------------------------------------------------------
 | Final Price
 |--------------------------------------------------------------------------
 |
 | price_off قیمت نهایی بعد از تخفیف است.
 | اگر price_off نداشت، price استفاده می‌شود.
 |
 |--------------------------------------------------------------------------
 */

 const priceFrom=
  priceOff>0
   ?priceOff
   :originalPrice


 /*
 |--------------------------------------------------------------------------
 | Capacity
 |--------------------------------------------------------------------------
 */

 const adults=
  Number(
   item?.adults||
   0
  )

 const children=
  Number(
   item?.children||
   room?.children||
   0
  )

 const extraBed=
  Number(
   item?.extra_bed||
   0
  )

 const capacity=
  Math.max(
   1,
   adults+
   children
  )

 const maxCapacity=
  capacity+
  extraBed


 /*
 |--------------------------------------------------------------------------
 | Cover
 |--------------------------------------------------------------------------
 */

 const coverUrl=
  String(
   item?.cover?.url||
   ''
  )
   .trim()

 const coverTitle=
  String(
   item?.cover?.title||
   ''
  )
   .trim()

 const coverDescription=
  String(
   item?.cover?.description||
   ''
  )
   .trim()


 /*
 |--------------------------------------------------------------------------
 | Images
 |--------------------------------------------------------------------------
 */

 const images=
  coverUrl
   ?[
     {
      id:null,

      url:
       coverUrl,

      title:
       coverTitle,

      description:
       coverDescription||
       coverTitle
     }
    ]
   :[]


 /*
 |--------------------------------------------------------------------------
 | Facilities
 |--------------------------------------------------------------------------
 |
 | برای FilterHotel مهم است.
 |
 |--------------------------------------------------------------------------
 */

 const facilities=[]

 const facilityKeys=
  new Set()


 if(
  Array.isArray(
   item?.facilities_tags
  )
 ){

  for(
   const group
   of item.facilities_tags
  ){

   const groupFacilities=
    Array.isArray(
     group?.facilities
    )
     ?group.facilities
     :[]


   for(
    const facility
    of groupFacilities
   ){

    if(!facility)
     continue


    const facilityId=
     facility?.id??
     facility?.facility_id??
     null


    const title=
     String(
      facility?.title||
      facility?.name||
      facility?.title_fa||
      facility?.label||
      ''
     )
      .trim()


    const icon=
     String(
      facility?.icon||
      facility?.icon_url||
      ''
     )
      .trim()


    /*
    |--------------------------------------------------------------------------
    | Duplicate Key
    |--------------------------------------------------------------------------
    */

    const facilityKey=
     String(
      facilityId||
      title||
      ''
     )
      .trim()


    if(!facilityKey)
     continue


    if(
     facilityKeys.has(
      facilityKey
     )
    ){
     continue
    }


    facilityKeys.add(
     facilityKey
    )


    facilities.push({

     /*
     |--------------------------------------------------------------------------
     | Standard Fields
     |--------------------------------------------------------------------------
     */

     id:
      facilityId,

     title,

     name:
      title,

     icon,


     /*
     |--------------------------------------------------------------------------
     | Provider Data
     |--------------------------------------------------------------------------
     */

     hotelId:
      Number(
       group?.hotel_id||
       hotelId||
       0
      ),

     raw:
      facility

    })

   }

  }

 }


 /*
 |--------------------------------------------------------------------------
 | Nights
 |--------------------------------------------------------------------------
 */

 const nightCount=
  calculateNights(
   params?.checkIn,
   params?.checkOut
  )


 /*
 |--------------------------------------------------------------------------
 | Availability
 |--------------------------------------------------------------------------
 |
 | Response فعلی SnappTrip تعداد واقعی موجودی اتاق را نداده.
 | بنابراین عدد ساختگی موجودی نمایش نمی‌دهیم.
 |
 |--------------------------------------------------------------------------
 */

 const availableCount=
  null

 const disabled=
  priceFrom<=0


 /*
 |--------------------------------------------------------------------------
 | Unique Id
 |--------------------------------------------------------------------------
 */

 const id=[
  'SNAPPTRIP',
  providerHotelId,
  providerRoomId,
  normalizedBoardType||
   'NA',
  adults,
  children,
  priceFrom
 ].join('-')


 /*
 |--------------------------------------------------------------------------
 | Result
 |--------------------------------------------------------------------------
 */

 return{

  /*
  |--------------------------------------------------------------------------
  | Identity
  |--------------------------------------------------------------------------
  */

  id,

  provider:
   'SNAPPTRIP',

  source:
   String(
    item?.source||
    'snapp'
   ),

  providerHotelId,

  providerRoomId,

  cityId,


  /*
  |--------------------------------------------------------------------------
  | Hotel
  |--------------------------------------------------------------------------
  */

  hotelId,

  hotelName,

  hotelStar,

  hotelAddress,

  accommodationTitle,

  accommodationType,


  /*
  |--------------------------------------------------------------------------
  | Room
  |--------------------------------------------------------------------------
  */

  roomId,

  roomName,

  name:
   roomName,

  roomType:
   roomName,

  type:
   roomName,

  roomView:
   '',

  description,


  /*
  |--------------------------------------------------------------------------
  | Capacity
  |--------------------------------------------------------------------------
  */

  capacity,

  maxCapacity,

  adults,

  children,

  extraBed,


  /*
  |--------------------------------------------------------------------------
  | Bed
  |--------------------------------------------------------------------------
  |
  | چون API فعلاً تعداد تخت‌ها را Structured نمی‌دهد،
  | این‌ها را صفر نگه می‌داریم.
  | توضیح تخت داخل description موجود است.
  |
  |--------------------------------------------------------------------------
  */

  doubleBedCount:
   0,

  singleBedCount:
   0,

  sofaBedCount:
   0,


  /*
  |--------------------------------------------------------------------------
  | Board / Meal
  |--------------------------------------------------------------------------
  */

  boardType,

  breakfastIncluded,


  /*
  |--------------------------------------------------------------------------
  | Extra Bed
  |--------------------------------------------------------------------------
  */

  extraBedService:
   extraBed>0
    ?'تخت اضافه'
    :'',

  extraBedPrice,

  extraBedStayPrice:
   extraBedPrice,


  /*
  |--------------------------------------------------------------------------
  | Child
  |--------------------------------------------------------------------------
  */

  childPrice,


  /*
  |--------------------------------------------------------------------------
  | No Bed
  |--------------------------------------------------------------------------
  */

  noBed:
   0,

  noBedService:
   '',

  noBedStayPrice:
   0,


  /*
  |--------------------------------------------------------------------------
  | Availability
  |--------------------------------------------------------------------------
  */

  availableCount,

  onRequest:
   false,

  displayOnly:
   false,

  forShow:
   false,

  disabled,


  /*
  |--------------------------------------------------------------------------
  | Price
  |--------------------------------------------------------------------------
  */

  originalPrice,

  price:
   originalPrice,

  priceOff,

  priceFrom,

  calculatedPrice:
   priceFrom,

  discountPercent,

  currency:
   'IRR',

  nightCount,


  /*
  |--------------------------------------------------------------------------
  | Cover
  |--------------------------------------------------------------------------
  */

  cover:{

   url:
    coverUrl,

   title:
    coverTitle,

   description:
    coverDescription

  },


  /*
  |--------------------------------------------------------------------------
  | Images
  |--------------------------------------------------------------------------
  */

  image:
   coverUrl||
   null,

  images,

  hotelRoomImages:
   images.map(
    image=>({

     id:
      image.id,

     image:
      image.url,

     title:
      image.title,

     description:
      image.description

    })
   ),


  /*
  |--------------------------------------------------------------------------
  | Facilities
  |--------------------------------------------------------------------------
  */

  facilities,


  /*
  |--------------------------------------------------------------------------
  | Rating
  |--------------------------------------------------------------------------
  |
  | در Response فعلی SnappTrip وجود ندارد.
  |
  |--------------------------------------------------------------------------
  */

  rating:
   null,

  reviewScore:
   null,

  reviewsCount:
   null,


  /*
  |--------------------------------------------------------------------------
  | Compatibility
  |--------------------------------------------------------------------------
  */

  contractPassengers:
   [],

  contractRoutes:
   [],

  hotel:
   null,

  isStandard:
   false,

  showDetail:
   true,


  /*
  |--------------------------------------------------------------------------
  | Provider Raw
  |--------------------------------------------------------------------------
  */

  meta:{

   raw:
    item,

   hotel,

   room,

   facilitiesTags:
    Array.isArray(
     item?.facilities_tags
    )
     ?item.facilities_tags
     :[],

   cover:
    item?.cover||
    null

  }

 }

}


/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

export async function searchSnappTripHotels(
 params
){

 if(
  !params?.cityId||
  !params?.checkIn||
  !params?.checkOut
 ){

  return{

   provider:
    'SNAPPTRIP',

   rooms:[]

  }

 }


 /*
 |--------------------------------------------------------------------------
 | Payload
 |--------------------------------------------------------------------------
 */

//  const occupancies=
//   Array.isArray(
//    params?.occupancies
//   )&&
//   params.occupancies.length

//    ?params.occupancies

//    :[
//      {
//       adultsNo:1,
//       childsNo:0,
//       childsAges:[]
//      }
//     ]


 const payload={

 cityId:
  Number(
   params.cityId
  ),

 checkIn:
  String(
   params.checkIn
  ),

 checkOut:
  String(
   params.checkOut
  ),

 roomsNo:
  1,

 occupancies:[
  {
   adultsNo:1,
   childsNo:0,
   childsAges:[]
  }
 ],

 from:
  0,

 to:
  0

}


 console.log(
  'SNAPPTRIP SEARCH PAYLOAD:',
  payload
 )


 /*
 |--------------------------------------------------------------------------
 | Call API
 |--------------------------------------------------------------------------
 */

 const response=
  await $fetch(
   `${BASE_URL}/SnappTrip/search/city`,
   {

    method:'POST',

    body:
     payload

   }
  )


 console.log(
  'SNAPPTRIP RAW RESPONSE:',
  response
 )


 /*
 |--------------------------------------------------------------------------
 | Normalize
 |--------------------------------------------------------------------------
 */

 const items=
  normalizeResponse(
   response
  )


 /*
 |--------------------------------------------------------------------------
 | Map
 |--------------------------------------------------------------------------
 */

 const rooms=
  items

   .filter(
    item=>
     item?.hotel&&
     item?.room
   )

   .map(
    item=>
     mapSnappTripRoomToStandard({

      item,

      params

     })
   )


 console.log(
  'SNAPPTRIP STANDARD ROOMS:',
  rooms
 )


 return{

  provider:
   'SNAPPTRIP',

  rooms,

  raw:
   response

 }

}