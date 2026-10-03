<template>
  <div
    dir="rtl"
    class="
      overflow-hidden
      rounded-[20px]
      border
      border-[var(--color-gray-200)]
      bg-white
      shadow-sm
      transition-all
      duration-300
      hover:shadow-md
    "
  >
    <div
      class="
        flex
        flex-col
        lg:flex-row
      "
    >
     <!--
|--------------------------------------------------------------------------
| Image
|--------------------------------------------------------------------------
-->

<div
  class="
    relative
    h-[240px]
    w-full
    shrink-0
    overflow-hidden
    bg-[var(--color-gray-100)]

    lg:h-auto
    lg:w-[310px]
    lg:self-stretch
  "
>

  <img
    v-if="hotelImage"
    :src="hotelImage"
    :alt="hotelName"
    class="
      absolute
      inset-0
      h-full
      w-full
      object-cover
    "
    loading="lazy"
  >


  <div
    v-else
    class="
      absolute
      inset-0
      flex
      h-full
      w-full
      items-center
      justify-center
      text-[var(--color-gray-300)]
    "
  >

    <i
      class="
        bi
        bi-building
        text-[52px]
      "
    ></i>

  </div>

</div>


      <!--
      |--------------------------------------------------------------------------
      | Hotel Info
      |--------------------------------------------------------------------------
      -->

      <div
        class="
          flex
          min-w-0
          flex-1
          flex-col
          p-5
          lg:border-l
          lg:border-[var(--color-gray-200)]
        "
      >
        <!-- Name -->

        <div
          class="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >
          <h3
            class="
              text-[16px]
              font-black
              text-[var(--color-gray-800)]
              md:text-[18px]
            "
          >
            {{ hotelName }}
          </h3>

          <!-- Accommodation type -->

          <span
            v-if="accommodationTitle"
            class="
              rounded-md
              bg-[var(--color-gray-100)]
              px-2
              py-1
              text-[10px]
              font-bold
              text-[var(--color-gray-500)]
            "
          >
            {{ accommodationTitle }}
          </span>
        </div>


        <!-- Stars -->

        <div
          v-if="hotelStar>0"
          class="
            mt-2
            flex
            items-center
            gap-2
          "
        >
          <div
            class="
              flex
              items-center
              gap-[2px]
              text-[var(--color-secondary)]
            "
            dir="ltr"
          >
            <i
              v-for="star in hotelStar"
              :key="star"
              class="bi bi-star-fill text-[12px]"
            ></i>
          </div>

          <span
            class="
              text-[10px]
              text-[var(--color-gray-400)]
            "
          >
            {{ hotelStar }}
            ستاره
          </span>
        </div>


        <!-- Facilities -->

        <div
          v-if="visibleFacilities.length"
          class="
            mt-5
            flex
            flex-wrap
            gap-x-4
            gap-y-3
          "
        >
          <div
            v-for="facility in visibleFacilities"
            :key="getFacilityKey(facility)"
            class="
              flex
              items-center
              gap-1.5
              text-[10px]
              text-[var(--color-gray-500)]
            "
          >
            <i
              class="
                bi
                bi-check2
                text-[var(--color-primary)]
              "
            ></i>

            <span>
              {{ getFacilityTitle(facility) }}
            </span>
          </div>

          <span
            v-if="remainingFacilities>0"
            class="
              text-[10px]
              font-bold
              text-[var(--color-primary)]
            "
          >
            +{{ remainingFacilities }}
            امکانات دیگر
          </span>
        </div>


        <!-- Address -->

        <div
          v-if="hotelAddress"
          class="
            mt-auto
            flex
            items-start
            gap-1.5
            pt-5
            text-[10px]
            leading-6
            text-[var(--color-primary)]
          "
        >
          <i class="bi bi-geo-alt-fill mt-1"></i>

          <span>
            {{ hotelAddress }}
          </span>
        </div>


        <!-- Room count -->

        <!-- <div
          v-if="roomCount>0"
          class="
            mt-2
            flex
            items-center
            gap-1.5
            text-[10px]
            text-[var(--color-gray-400)]
          "
        >
          <i class="bi bi-door-open"></i>

          <span>
            {{ roomCount }}
            نوع اتاق
          </span>
        </div> -->
      </div>


      <!--
      |--------------------------------------------------------------------------
      | Cheapest Room / Price
      |--------------------------------------------------------------------------
      -->

      <div
        class="
          flex
          w-full
          shrink-0
          flex-col
          justify-between
          border-t
          border-[var(--color-gray-200)]
          p-5
          lg:w-[235px]
          lg:border-t-0
        "
      >
        <div v-if="cheapestRoom">
          <!-- Room name -->

          <div
            class="
              text-[11px]
              font-bold
              leading-6
              text-[var(--color-gray-700)]
            "
          >
            {{
              cheapestRoom.roomName ||
              cheapestRoom.name ||
              'اتاق'
            }}
          </div>


          <!-- Board -->

          <div
            class="
              mt-2
              flex
              items-center
              gap-1.5
              text-[10px]
              text-[var(--color-gray-500)]
            "
          >
            <i
              :class="
                cheapestRoom.breakfastIncluded
                  ? 'bi bi-cup-hot-fill'
                  : 'bi bi-cup-hot'
              "
            ></i>

            <span>
              {{ boardTypeLabel }}
            </span>
          </div>


          <!-- Capacity -->

          <div
            v-if="Number(cheapestRoom.capacity||0)>0"
            class="
              mt-2
              flex
              items-center
              gap-1.5
              text-[10px]
              text-[var(--color-gray-500)]
            "
          >
            <i class="bi bi-people"></i>

            <span>
              ظرفیت
              {{ cheapestRoom.capacity }}
              نفر
            </span>
          </div>


          <!-- Nights -->

          <div
            v-if="nights>0"
            class="
              mt-4
              text-[13px]
              font-black
              text-[var(--color-gray-700)]
            "
          >
            {{ nights }}
            شب
          </div>
        </div>


        <!-- Price + button -->

        <div class="mt-5">
          <div
            class="
              text-[10px]
              text-[var(--color-gray-400)]
            "
          >
            شروع قیمت
          </div>

          <div
            class="
              mt-1
              text-[18px]
              font-black
              text-[var(--color-gray-800)]
            "
          >
       {{
  formatRial(
    displayPrice
  )
}}

<span
  class="
    text-[10px]
    font-normal
    text-[var(--color-gray-600)]
  "
>
  ریال
</span>
          </div>

          <div
            v-if="nights>0"
            class="
              mt-1
              text-[9px]
              text-[var(--color-gray-400)]
            "
          >
            قیمت برای
            {{ nights }}
            شب
          </div>

          <UiBaseButton
            label="مشاهده اتاق‌ها و رزرو"
            variant="filled"
            color="primary"
            :active="false"
            class="
              mt-5
              h-[42px]
              w-full
              !rounded-xl
              text-[11px]
              font-bold
            "
            @click="selectHotel"
          />
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>

import{
  computed
}from'vue'


/*
|--------------------------------------------------------------------------
| Props
|--------------------------------------------------------------------------
*/

const props=
  defineProps({

    hotel:{
      type:Object,
      required:true
    },

    checkIn:{
      type:String,
      default:''
    },

    checkOut:{
      type:String,
      default:''
    },

    facilitiesLimit:{
      type:Number,
      default:5
    }

  })


/*
|--------------------------------------------------------------------------
| Emits
|--------------------------------------------------------------------------
*/

const emit=
  defineEmits([
    'select'
  ])


/*
|--------------------------------------------------------------------------
| Hotel
|--------------------------------------------------------------------------
*/

const hotelName=
  computed(
    ()=>
      String(
        props.hotel?.hotelName||
        props.hotel?.name||
        ''
      )
  )


const accommodationTitle=
  computed(
    ()=>
      String(
        props.hotel?.accommodationTitle||
        ''
      )
  )


const hotelStar=
  computed(
    ()=>
      Number(
        props.hotel?.hotelStar||
        props.hotel?.star||
        0
      )
  )


const hotelAddress=
  computed(
    ()=>
      String(
        props.hotel?.hotelAddress||
        props.hotel?.address||
        ''
      )
  )


/*
|--------------------------------------------------------------------------
| Image
|--------------------------------------------------------------------------
*/

const hotelImage=
  computed(()=>{

    return(
      props.hotel?.image||
      props.hotel?.images?.[0]?.url||
      props.hotel?.cover?.url||
      ''
    )

  })


/*
|--------------------------------------------------------------------------
| Rooms
|--------------------------------------------------------------------------
*/

const hotelRooms=
  computed(()=>{

    return Array.isArray(
      props.hotel?.rooms
    )
      ?props.hotel.rooms
      :[]

  })


const roomCount=
  computed(
    ()=>
      hotelRooms.value.length
  )


/*
|--------------------------------------------------------------------------
| Cheapest Room
|--------------------------------------------------------------------------
*/

const cheapestRoom=
 computed(()=>{

  const validRooms=
   hotelRooms.value
    .filter(
     room=>
      getDisplayPrice(
       room
      )>0
    )
    .sort(
     (a,b)=>
      getDisplayPrice(a)-
      getDisplayPrice(b)
    )


  return validRooms[0]||
   null

})
const displayPrice=
 computed(()=>{

 const price=
  Number(
   props.hotel?.displayPrice||
   cheapestRoom.value?.originalPrice||
   0
  )


 return(
  Number.isFinite(price)&&
  price>0
 )
  ?price
  :0

})

/*
|--------------------------------------------------------------------------
| Price
|--------------------------------------------------------------------------
*/

const priceFrom=
  computed(()=>{

    const hotelPrice=
      Number(
        props.hotel?.displayPrice||
        0
      )


    if(
      Number.isFinite(hotelPrice)&&
      hotelPrice>0
    ){
      return hotelPrice
    }


    return getRoomPrice(
      cheapestRoom.value
    )

  })


/*
|--------------------------------------------------------------------------
| Booking Price
|--------------------------------------------------------------------------
|
| برای محاسبات داخلی / رزرو
|
|--------------------------------------------------------------------------
*/

function getRoomPrice(
 room
){

 if(!room)
  return 0


 const price=
  Number(
   room?.priceFrom||
   room?.calculatedPrice||
   room?.priceOff||
   room?.price||
   0
  )


 return Number.isFinite(
  price
 )
  ?price
  :0

}


/*
|--------------------------------------------------------------------------
| Display Price
|--------------------------------------------------------------------------
|
| تمام قیمت‌هایی که کاربر در UI می‌بیند
| فقط originalPrice
|
|--------------------------------------------------------------------------
*/

function getDisplayPrice(
 room
){

 if(!room)
  return 0


 const rawPrice=
  Number(
   room?.originalPrice||
   room?.raw?.pricing?.original_sell_price||
   room?.meta?.pricing?.original_sell_price||
   0
  )


 if(
  !Number.isFinite(rawPrice)||
  rawPrice<=0
 ){
  return 0
 }


 const provider=
  String(
   room?.provider||
   props.hotel?.provider||
   ''
  )
   .trim()
   .toUpperCase()


 if(
  provider==='SNAPPTRIP'
 ){

  if(
   String(
    room?.currency||
    ''
   )
    .trim()
    .toUpperCase()==='IRR'
  ){
   return rawPrice
  }

  return rawPrice*10
 }


 return rawPrice

}


/*
|--------------------------------------------------------------------------
| Facilities
|--------------------------------------------------------------------------
*/

const facilities=
  computed(()=>{

    const list=
      Array.isArray(
        props.hotel?.facilities
      )
        ?props.hotel.facilities
        :[]


    const result=[]
    const keys=
      new Set()


    for(
      const facility
      of list
    ){

      const key=
        getFacilityKey(
          facility
        )


      const title=
        getFacilityTitle(
          facility
        )


      if(
        !key||
        !title||
        keys.has(key)
      ){
        continue
      }


      keys.add(key)

      result.push(
        facility
      )

    }


    return result

  })


const visibleFacilities=
  computed(
    ()=>
      facilities.value.slice(
        0,
        props.facilitiesLimit
      )
  )


const remainingFacilities=
  computed(
    ()=>
      Math.max(
        0,
        facilities.value.length-
        props.facilitiesLimit
      )
  )


function getFacilityKey(
  facility
){

  if(
    facility===null||
    facility===undefined
  ){
    return''
  }


  if(
    typeof facility==='string'
  ){
    return facility.trim()
  }


  return String(
    facility?.id||
    facility?.facilityId||
    facility?.facility_id||
    facility?.title||
    facility?.name||
    facility?.label||
    ''
  )
    .trim()

}


function getFacilityTitle(
  facility
){

  if(
    facility===null||
    facility===undefined
  ){
    return''
  }


  if(
    typeof facility==='string'
  ){
    return facility.trim()
  }


  return String(
    facility?.title||
    facility?.name||
    facility?.titleFa||
    facility?.title_fa||
    facility?.label||
    ''
  )
    .trim()

}


/*
|--------------------------------------------------------------------------
| Board Type
|--------------------------------------------------------------------------
*/

const boardTypeLabel=
  computed(
    ()=>
      getBoardTypeLabel(
        cheapestRoom.value
      )
  )


function getBoardTypeLabel(
  room
){

  if(!room)
    return''


  const type=
    String(
      room?.boardType||
      ''
    )
      .trim()
      .toLowerCase()


  switch(type){

    case'bed_breakfast':
    case'bb':
      return'با صبحانه'

    case'half_board':
    case'hb':
      return'صبحانه و یک وعده غذا'

    case'full_board':
    case'fb':
      return'صبحانه، ناهار و شام'

    case'room_only':
    case'ro':
      return'بدون صبحانه'

    default:
      return room?.breakfastIncluded
        ?'با صبحانه'
        :'بدون صبحانه'

  }

}


/*
|--------------------------------------------------------------------------
| Nights
|--------------------------------------------------------------------------
*/

const nights=
  computed(()=>{

    const roomNightCount=
      Number(
        cheapestRoom.value
          ?.nightCount||
        0
      )


    if(
      Number.isFinite(
        roomNightCount
      )&&
      roomNightCount>0
    ){
      return roomNightCount
    }


    if(
      !props.checkIn||
      !props.checkOut
    ){
      return 0
    }


    const start=
      new Date(
        String(
          props.checkIn
        ).replaceAll(
          '/',
          '-'
        )
      )


    const end=
      new Date(
        String(
          props.checkOut
        ).replaceAll(
          '/',
          '-'
        )
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


    const diff=
      Math.ceil(
        (
          end.getTime()-
          start.getTime()
        )/
        (
          1000*
          60*
          60*
          24
        )
      )


    return Math.max(
      0,
      diff
    )

  })


/*
|--------------------------------------------------------------------------
| Price -> Rial
|--------------------------------------------------------------------------
*/

function formatRial(
  value
){

  const rial=
    Number(
      value||
      0
    )


  if(
    !Number.isFinite(rial)||
    rial<=0
  ){
    return'-'
  }


  return Math.round(
    rial
  ).toLocaleString(
    'fa-IR'
  )

}


/*
|--------------------------------------------------------------------------
| Select
|--------------------------------------------------------------------------
*/

function selectHotel(){

  emit(
    'select',
    props.hotel
  )

}

</script>
