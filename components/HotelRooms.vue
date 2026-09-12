<template>

<section
  class="rounded-[24px]"
  :class="
    selectedView
      ? 'bg-transparent p-0'
      : 'bg-[#f7f8fd] px-5 py-7 md:px-8 md:py-10'
  "
  dir="rtl"
>

  <!-- ========================= -->
  <!-- Header -->
  <!-- ========================= -->

  <div v-if="selectedView">

    <h2
      class="mb-5 text-[18px] font-black text-gray-900"
    >
      اتاق انتخاب شده
    </h2>

  </div>


  <template v-else>

    <div>

      <h2
        class="text-[18px] font-black text-gray-900"
      >
        اتاق‌های هتل {{hotel.name}}
      </h2>

      <p
        class="mt-2 text-[11px] text-gray-400"
      >
        اطلاعات اتاق‌های این مجموعه
      </p>

    </div>


    <h3
      class="mt-8 mb-5 text-[17px] font-black text-gray-900"
    >
      اتاق‌ها
    </h3>

  </template>

  <!-- Loading -->
  <div
    v-if="roomsLoading"
    class="min-h-[180px] rounded-2xl bg-white flex items-center justify-center"
  >
    <div class="text-center">
      <div
        class="mx-auto w-8 h-8 rounded-full border-4 border-gray-200 border-t-[var(--color-primary)] animate-spin"
      ></div>

      <p class="mt-3 text-[12px] text-gray-400">
        در حال دریافت اتاق‌ها...
      </p>
    </div>
  </div>

  <!-- Error -->
  <div
    v-else-if="roomsError"
    class="min-h-[160px] rounded-2xl bg-white flex items-center justify-center"
  >
    <p class="text-[12px] text-red-500">
      {{roomsError}}
    </p>
  </div>

  <!-- Empty -->
  <div
    v-else-if="!hotelRooms.length"
    class="min-h-[180px] rounded-2xl bg-white flex flex-col items-center justify-center"
  >
    <i class="bi bi-door-closed text-[30px] text-gray-300"></i>

    <p class="mt-3 text-[13px] font-bold text-gray-600">
      اتاقی پیدا نشد
    </p>
  </div>

 
  <!-- Rooms List -->
<div
  v-else
  class="space-y-4"
>
  <article
    v-for="room in hotelRooms"
    :key="room.id"
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
  >
    <!-- بخش بالای کارت -->
    <div class="p-5 md:p-6">
      <div
        class="flex flex-col md:flex-row md:items-start md:justify-between gap-5"
      >
        <!-- اطلاعات -->
        <div class="flex-1">

          <h4
            class="text-[15px] font-black text-gray-900"
          >
            {{room.type||room.name||'اتاق'}}
          </h4>

          <div
            class="mt-3 flex flex-wrap items-center gap-2"
          >
            <span
              v-if="room.capacity"
              class="rounded bg-[#f1f2f7] px-2 py-1 text-[10px]"
            >
              <i class="bi bi-person-fill ml-1"></i>
              {{room.capacity}} نفر
            </span>

            <span
              v-if="room.name"
              class="rounded bg-[#f1f2f7] px-2 py-1 text-[10px]"
            >
              {{room.name}}
            </span>

            <span
              v-if="room.roomView"
              class="rounded bg-[#f1f2f7] px-2 py-1 text-[10px]"
            >
              نمای {{room.roomView}}
            </span>

           <span
 v-if="
  hasRoomCapacity(room) &&
  Number(room.extraBed||0)>0
 "
 class="rounded bg-[#f1f2f7] px-2 py-1 text-[10px]"
>
 {{room.extraBed}} تخت اضافه
</span>

            <span
 v-if="
  hasRoomCapacity(room) &&
  Number(room.noBed||0)>0
 "
 class="rounded bg-[#f1f2f7] px-2 py-1 text-[10px]"
>
 {{room.noBed}} نفر بدون تخت
</span>
<span
 class="rounded bg-[#f1f2f7] px-2 py-1 text-[10px]"
>
 <i class="bi bi-cup-hot ml-1"></i>
 اقامت + صبحانه
</span>
          </div>

          <div
            class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-gray-500"
          >
            <span v-if="room.doubleBedCount">
              <i class="bi bi-bed ml-1"></i>
              {{room.doubleBedCount}} تخت دبل
            </span>

            <span v-if="room.singleBedCount">
              {{room.singleBedCount}} تخت سینگل
            </span>

           <span
 v-if="
  hasRoomCapacity(room) &&
  Number(room.sofaBedCount||0)>0
 "
>
 {{room.sofaBedCount}}
 کاناپه تختخواب‌شو
</span>

          </div>

          <p
            v-if="room.description"
            class="mt-4 text-[11px] leading-6 text-gray-500"
          >
            {{room.description}}
          </p>
        </div>

        <!-- جزئیات -->
        <button
          type="button"
          class="shrink-0 text-[11px] font-medium text-[#5865ff]"
          @click="openRoomModal(room)"
        >
          جزئیات اتاق و قوانین
          <i class="bi bi-chevron-left mr-1"></i>
        </button>
      </div>


      <!-- اسلایدر عکس -->
      <div
        v-if="room.hotelRoomImages?.length"
        class="relative mt-5 h-[220px] overflow-hidden rounded-2xl bg-gray-100"
      >
        <img
          :src="
            getHotelImageUrl(
              room.hotelRoomImages[
                getRoomSlideIndex(room)
              ]?.image
            )
          "
          :alt="room.type||room.name"
          class="absolute inset-0 h-full w-full object-cover"
        >

        <!-- قبلی -->
        <button
          v-if="room.hotelRoomImages.length>1"
          type="button"
          class="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
          @click="prevRoomSlide(room,$event)"
        >
          <i class="bi bi-chevron-right"></i>
        </button>

        <!-- بعدی -->
        <button
          v-if="room.hotelRoomImages.length>1"
          type="button"
          class="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
          @click="nextRoomSlide(room,$event)"
        >
          <i class="bi bi-chevron-left"></i>
        </button>

        <!-- شمارنده -->
        <div
          v-if="room.hotelRoomImages.length>1"
          class="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[10px] text-white"
        >
          {{getRoomSlideIndex(room)+1}}
          /
          {{room.hotelRoomImages.length}}
        </div>
      </div>
    </div>


    <!-- پایین کارت -->
    <!-- ========================= -->
<!-- پایین کارت -->
<!-- ========================= -->
<!-- ========================= -->
<!-- حالت اتاق انتخاب‌شده -->
<!-- ========================= -->

<div
 v-if="selectedView"
 class="border-t border-gray-200 px-5 py-5 md:px-6"
>

 <div
  class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
 >

  <!-- انتخاب‌های کاربر -->
  <div class="flex flex-wrap gap-2">

   <span
    class="rounded-lg bg-gray-100 px-3 py-2 text-[11px] font-bold text-gray-600"
   >
    {{Number(room.count||1)}}
    اتاق
   </span>


   <span
    v-if="Number(room.extraBedCount||0)>0"
    class="rounded-lg bg-gray-100 px-3 py-2 text-[11px] font-bold text-gray-600"
   >
    {{room.extraBedCount}}
    تخت اضافه
   </span>


   <span
    v-if="Number(room.noBedCount||0)>0"
    class="rounded-lg bg-gray-100 px-3 py-2 text-[11px] font-bold text-gray-600"
   >
    {{room.noBedCount}}
    بدون تخت
   </span>

  </div>


  <!-- قیمت نهایی -->
  <div
   class="flex items-end gap-1"
   dir="rtl"
  >
 <p
     class="text-[10px] text-gray-400"
    >
     قیمت نهایی برای
     {{room.nightCount}}
     شب
    </p>
   <span
    class="text-[18px] font-black text-gray-900"
   >
    {{formatPrice(room.price)}}
   </span>

   <span
    class="pb-[2px] text-[10px] text-gray-500"
   >
    ریال
   </span>

  </div>

 </div>

</div>
<div
v-else
 class="border-t border-gray-200 px-5 py-5 md:px-6"
>
 <div
  class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
 >

  <!-- ========================= -->
  <!-- سمت راست: تعداد و سرویس‌ها -->
  <!-- ========================= -->

  <div class="flex flex-col gap-4">

   <!-- ========================= -->
   <!-- تعداد اتاق -->
   <!-- ========================= -->

   <div class="flex items-center gap-4">

    <div class="min-w-[140px]">

     <span
      class="text-[11px] font-bold text-gray-700"
     >
      تعداد اتاق
     </span>

     <p
      class="mt-1 text-[10px] text-gray-400"
     >
      موجودی:
      {{getRoomAvailableCount(room)}}
      اتاق
     </p>

    </div>


    <button
     type="button"
     class="flex h-9 w-9 items-center justify-center rounded-lg border text-[22px]"
     :class="
      getSelectedRoomCount(room)>=getRoomAvailableCount(room)
       ?'cursor-not-allowed border-gray-300 text-gray-300'
       :'border-[#5865ff] text-[#5865ff]'
     "
     :disabled="
      getSelectedRoomCount(room)>=getRoomAvailableCount(room)
     "
     @click="increaseRoom(room)"
    >
     +
    </button>


    <span
     class="min-w-[20px] text-center text-[13px] font-bold"
    >
     {{getSelectedRoomCount(room)}}
    </span>


    <button
     type="button"
     class="flex h-9 w-9 items-center justify-center rounded-lg border text-[20px]"
     :class="
      getSelectedRoomCount(room)<=1
       ?'cursor-not-allowed border-gray-300 text-gray-300'
       :'border-gray-400 text-gray-500'
     "
     :disabled="
      getSelectedRoomCount(room)<=1
     "
     @click="decreaseRoom(room)"
    >
     −
    </button>

   </div>


   <!-- ========================= -->
   <!-- سرویس‌های اضافه -->
   <!-- این DIV حتماً flex-col بماند -->
   <!-- ========================= -->

   <div
 v-if="
  hasRoomCapacity(room) &&
  (
   Number(room.extraBed||0)>0 ||
   Number(room.noBed||0)>0
  )
 "
 class="flex flex-col gap-3"
>

    <!-- ========================= -->
    <!-- تخت اضافه -->
    <!-- ========================= -->

    <div
     v-if="Number(room.extraBed||0)>0"
     class="flex items-center gap-4"
    >

     <div class="min-w-[140px]">

      <span
       class="text-[11px] font-bold text-gray-700"
      >
       {{room.extraBedService || 'تخت اضافه'}}
      </span>

      <p
       v-if="getExtraBedTotalPrice(room)>0"
       class="mt-1 text-[10px] text-gray-400"
      >
       {{formatPrice(getExtraBedTotalPrice(room))}}
       ریال
      </p>

     </div>


     <button
      type="button"
      class="flex h-9 w-9 items-center justify-center rounded-lg border text-[22px]"
      :class="
       getSelectedExtraBedCount(room)>=getExtraBedLimit(room)
        ?'cursor-not-allowed border-gray-300 text-gray-300'
        :'border-[#5865ff] text-[#5865ff]'
      "
      :disabled="
       getSelectedExtraBedCount(room)>=getExtraBedLimit(room)
      "
      @click="increaseExtraBed(room)"
     >
      +
     </button>


     <span
      class="min-w-[20px] text-center text-[13px] font-bold"
     >
      {{getSelectedExtraBedCount(room)}}
     </span>


     <button
      type="button"
      class="flex h-9 w-9 items-center justify-center rounded-lg border text-[20px]"
      :class="
       getSelectedExtraBedCount(room)<=0
        ?'cursor-not-allowed border-gray-300 text-gray-300'
        :'border-gray-400 text-gray-500'
      "
      :disabled="
       getSelectedExtraBedCount(room)<=0
      "
      @click="decreaseExtraBed(room)"
     >
      −
     </button>

    </div>


    <!-- ========================= -->
    <!-- بدون تخت -->
    <!-- دقیقاً زیر تخت اضافه -->
    <!-- ========================= -->

    <div
     v-if="Number(room.noBed||0)>0"
     class="flex items-center gap-4"
    >

     <div class="min-w-[140px]">

      <span
       class="text-[11px] font-bold text-gray-700"
      >
       {{room.noBedService || 'بدون تخت'}}
      </span>

      <p
       v-if="getNoBedTotalPrice(room)>0"
       class="mt-1 text-[10px] text-gray-400"
      >
       {{formatPrice(getNoBedTotalPrice(room))}}
       ریال
      </p>

     </div>


     <button
      type="button"
      class="flex h-9 w-9 items-center justify-center rounded-lg border text-[22px]"
      :class="
       getSelectedNoBedCount(room)>=getNoBedLimit(room)
        ?'cursor-not-allowed border-gray-300 text-gray-300'
        :'border-[#5865ff] text-[#5865ff]'
      "
      :disabled="
       getSelectedNoBedCount(room)>=getNoBedLimit(room)
      "
      @click="increaseNoBed(room)"
     >
      +
     </button>


     <span
      class="min-w-[20px] text-center text-[13px] font-bold"
     >
      {{getSelectedNoBedCount(room)}}
     </span>


     <button
      type="button"
      class="flex h-9 w-9 items-center justify-center rounded-lg border text-[20px]"
      :class="
       getSelectedNoBedCount(room)<=0
        ?'cursor-not-allowed border-gray-300 text-gray-300'
        :'border-gray-400 text-gray-500'
      "
      :disabled="
       getSelectedNoBedCount(room)<=0
      "
      @click="decreaseNoBed(room)"
     >
      −
     </button>

    </div>

   </div>

  </div>


  <!-- ========================= -->
  <!-- سمت چپ: قیمت و رزرو -->
  <!-- ========================= -->

  <div
   class="flex flex-wrap items-center justify-end gap-4"
  >

   <!-- قیمت -->
   <div
    v-if="
     Number(room.calculatedPrice||0)>0 &&
     getRoomAvailableCount(room)>0
    "
    class="text-left"
    dir="rtl"
   >

    <p
     class="text-[10px] text-gray-400"
    >
     قیمت نهایی برای
     {{room.nightCount}}
     شب
    </p>


    <div
     class="mt-1 flex items-end gap-1"
    >

     <span
      class="text-[18px] font-black text-gray-900"
     >
      {{formatPrice(getRoomFinalPrice(room))}}
     </span>

     <span
      class="pb-[2px] text-[10px] text-gray-500"
     >
      ریال
     </span>

    </div>

   </div>


   <!-- قیمت موجود نیست -->
   <div
    v-if="
     getRoomAvailableCount(room)>0 &&
     Number(room.calculatedPrice||0)<=0
    "
    class="text-[11px] font-bold text-gray-400"
   >
    قیمت موجود نیست
   </div>


   <!-- واچر -->
   <span
    v-if="
     room.onRequest &&
     getRoomAvailableCount(room)>0
    "
    class="text-[11px] font-bold text-orange-500"
   >
    واچر بعد از تایید هتل ارسال میشود
   </span>


   <!-- رزرو -->
   <button
    type="button"
    class="rounded-lg px-5 py-3 text-[11px] font-bold text-white"
    :class="
     getRoomAvailableCount(room)>0
      ?'bg-red-500'
      :'bg-gray-400 cursor-not-allowed'
    "
    :disabled="
     getRoomAvailableCount(room)===0
    "
    @click="reserveRoom(room)"
   >
    {{
     getRoomAvailableCount(room)>0
      ?'رزرو اتاق'
      :'تکمیل ظرفیت'
    }}
   </button>

  </div>

 </div>
</div>
  </article>
</div>
</section>


</template>

<script setup>

import {ref,computed} from 'vue'
import { useHotelStore } from '~/stores/hotels'
const hotelStore = useHotelStore()

const props=defineProps({
selectedView:{
 type:Boolean,
 default:false
},
 hotel:{
  type:Object,
  default:null
 },

 rooms:{
  type:Array,
  default:()=>[]
 },

 roomsLoading:{
  type:Boolean,
  default:false
 },

 roomsError:{
  type:String,
  default:''
 },

 checkIn:{
  type:String,
  default:''
 },

 checkOut:{
  type:String,
  default:''
 }

})

const hotelRooms = computed(()=>props.rooms)
const emit=defineEmits([
 'openRoomModal',
 'reserve'
])


const selectedRoomCounts=ref({})
const selectedExtraBedCounts=ref({})
const selectedNoBedCounts=ref({})
const roomSlideIndexes=ref({})


const HOTEL_IMAGE_BASE=
'https://panel.ahuan.ir/uploads'



function getHotelImageUrl(image){

 if(!image)
  return ''

 return `${HOTEL_IMAGE_BASE}/${image}`

}
function hasRoomCapacity(room){

 return getRoomAvailableCount(room)>0

}
function getSelectedNoBedCount(room){

 return Number(
  selectedNoBedCounts.value[room.id]||0
 )

}


function getNoBedLimit(room){

 const perRoom=
  Math.max(
   0,
   Number(room?.noBed||0)
  )

 return (
  perRoom*
  getSelectedRoomCount(room)
 )

}


function getNoBedTotalPrice(room){

 const details=
  getRoomPriceDetails(room)

 if(!details.length)
  return 0

 return details.reduce(
  (sum,item)=>
   sum+
   Number(item?.noBed||0),
  0
 )

}


function increaseNoBed(room){

 const current=
  getSelectedNoBedCount(room)

 const max=
  getNoBedLimit(room)

 if(current>=max)
  return

 selectedNoBedCounts.value={
  ...selectedNoBedCounts.value,
  [room.id]:current+1
 }

}


function decreaseNoBed(room){

 const current=
  getSelectedNoBedCount(room)

 if(current<=0)
  return

 selectedNoBedCounts.value={
  ...selectedNoBedCounts.value,
  [room.id]:current-1
 }

}

function getRoomSlideIndex(room){

 return Number(
   roomSlideIndexes.value[room.id]||0
 )

}



function setRoomSlide(room,index){

 const images=
   room.hotelRoomImages||[]


 if(!images.length)
   return


 let newIndex=index


 if(newIndex<0)
  newIndex=images.length-1


 if(newIndex>=images.length)
  newIndex=0



 roomSlideIndexes.value={
  ...roomSlideIndexes.value,
  [room.id]:newIndex
 }

}



function nextRoomSlide(room,event){

 event?.stopPropagation()

 setRoomSlide(
  room,
  getRoomSlideIndex(room)+1
 )

}



function prevRoomSlide(room,event){

 event?.stopPropagation()

 setRoomSlide(
  room,
  getRoomSlideIndex(room)-1
 )

}



function getSelectedRoomCount(room){

 return selectedRoomCounts.value[room.id] || 1

}



function increaseRoom(room){

 const current=
  getSelectedRoomCount(room)


 const available=
  getRoomAvailableCount(room)


 if(current < available){

 selectedRoomCounts.value={
  ...selectedRoomCounts.value,
  [room.id]:current+1
 }

 }

}



function decreaseRoom(room){

 const current=
  getSelectedRoomCount(room)

 if(current<=1)
  return


 const newCount=
  current-1


 selectedRoomCounts.value={
  ...selectedRoomCounts.value,
  [room.id]:newCount
 }


 // =====================
 // کنترل تخت اضافه
 // =====================

 const maxExtraBed=
  Number(room?.extraBed||0)*
  newCount

 const currentExtraBed=
  getSelectedExtraBedCount(room)

 if(currentExtraBed>maxExtraBed){

  selectedExtraBedCounts.value={
   ...selectedExtraBedCounts.value,
   [room.id]:maxExtraBed
  }

 }


 // =====================
 // کنترل بدون تخت
 // =====================

 const maxNoBed=
  Number(room?.noBed||0)*
  newCount

 const currentNoBed=
  getSelectedNoBedCount(room)

 if(currentNoBed>maxNoBed){

  selectedNoBedCounts.value={
   ...selectedNoBedCounts.value,
   [room.id]:maxNoBed
  }

 }

}

function getSelectedExtraBedCount(room){

 return Number(
  selectedExtraBedCounts.value[room.id]||0
 )

}


function getExtraBedLimit(room){

 const perRoom=
  Math.max(
   0,
   Number(room?.extraBed||0)
  )

 return (
  perRoom *
  getSelectedRoomCount(room)
 )

}


function getExtraBedTotalPrice(room){

 const details=
  getRoomPriceDetails(room)

 if(!details.length)
  return 0

 return details.reduce(
  (sum,item)=>
   sum+
   Number(item?.extBed||0),
  0
 )

}


function increaseExtraBed(room){

 const current=
  getSelectedExtraBedCount(room)

 const max=
  getExtraBedLimit(room)

 if(current>=max)
  return

 selectedExtraBedCounts.value={
  ...selectedExtraBedCounts.value,
  [room.id]:current+1
 }

}


function decreaseExtraBed(room){

 const current=
  getSelectedExtraBedCount(room)

 if(current<=0)
  return

 selectedExtraBedCounts.value={
  ...selectedExtraBedCounts.value,
  [room.id]:current-1
 }

}


function getRoomFinalPrice(room){

 const roomCount=
  getSelectedRoomCount(room)

 const basePrice=
  Number(room?.calculatedPrice||0)*
  roomCount


 const extraBedPrice=
  getExtraBedTotalPrice(room)*
  getSelectedExtraBedCount(room)


 const noBedPrice=
  getNoBedTotalPrice(room)*
  getSelectedNoBedCount(room)


 return (
  basePrice+
  extraBedPrice+
  noBedPrice
 )

}

function getRoomAvailableCount(room){

 const details=
  getRoomPriceDetails(room)

 if(!details.length)
  return 0

 return Math.max(
  0,
  Math.min(
   ...details.map(item=>
    Math.max(
     0,
     Number(item.loadNo||0)-
     Number(item.bookNo||0)
    )
   )
  )
 )
}



function getRoomPriceDetails(room){

 const price=
  room?.hotelRoomPrices?.[0]

 if(!price)
  return []

 const details=
  Array.isArray(
   price.hotelRoomPriceDetails
  )
   ?price.hotelRoomPriceDetails
   :[]

 const normalizeDate=value=>
  String(value||'')
   .slice(0,10)
   .replaceAll('/','-')

 const start=
  normalizeDate(props.checkIn)

 const end=
  normalizeDate(props.checkOut)

 return details.filter(item=>{

  if(item?.isActive===false)
   return false

  const date=
   normalizeDate(item?.date)

  if(!date)
   return false

  return (
   date>=start &&
   date<end
  )
 })
}



function getRoomPriceKey(room){

 if(room?.sgl)
  return 'sgl'

 if(room?.dbl)
  return 'dbl'

 if(room?.trp)
  return 'trp'

 if(room?.quad)
  return 'quad'


 const capacity=
  Number(room?.capacity||0)


 if(capacity===1)
  return 'sgl'

 if(capacity===2)
  return 'dbl'

 if(capacity===3)
  return 'trp'

 if(capacity>=4)
  return 'quad'


 return 'roomPrice'

}



function getRoomNightCount(room){

 const details=
  getRoomPriceDetails(room)

 if(details.length)
  return details.length

 if(
  !props.checkIn ||
  !props.checkOut
 )
  return 0

 const start=
  new Date(props.checkIn)

 const end=
  new Date(props.checkOut)

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


function getRoomDailyPrice(room,detail){

 if(!detail)
  return 0

 if(
  detail.roomPrice!==null &&
  detail.roomPrice!==undefined &&
  Number(detail.roomPrice)>0
 ){
  return Number(detail.roomPrice)
 }

 const key=
  getRoomPriceKey(room)

 return Number(
  detail?.[key]||0
 )
}


function getRoomTotalPrice(room){

 const persons=
  Math.max(
   1,
   Number(room?.capacity||1)
  )

 const nights=
  getRoomNightCount(room)

 const details=
  getRoomPriceDetails(room)

 if(details.length){

  const baseTotal=
   details.reduce(
    (sum,item)=>
     sum+
     getRoomDailyPrice(
      room,
      item
     ),
    0
   )

  return baseTotal*persons
 }


 const price=
  room?.hotelRoomPrices?.[0]

 if(!price)
  return 0


 let basePrice=0

 if(
  price.roomPrice!==null &&
  price.roomPrice!==undefined &&
  Number(price.roomPrice)>0
 ){
  basePrice=
   Number(price.roomPrice)
 }
 else{

  const key=
   getRoomPriceKey(room)

  basePrice=
   Number(
    price?.[key]||0
   )
 }


 if(
  !basePrice ||
  !nights
 )
  return 0


 return (
  basePrice*
  nights*
  persons
 )
}




function getBookingNightCount(){

 if(
  !props.checkIn ||
  !props.checkOut
 ){
  return 1
 }


 const start=
  new Date(props.checkIn)

 const end=
  new Date(props.checkOut)


 const nights=
  Math.ceil(
   (end-start)/
   (1000*60*60*24)
  )


 return Math.max(
  1,
  nights
 )
}






function formatPrice(value){

 return Number(value||0)
 .toLocaleString('fa-IR')

}



function reserveRoom(room){

 if(
  !room||
  room.forShow===true||
  Number(room.calculatedPrice||0)<=0
 ){
  return
 }


 const count=
  getSelectedRoomCount(room)


 // =====================
 // قیمت پایه
 // =====================

 const basePrice=
  Number(room.calculatedPrice||0)*
  count


 // =====================
 // تخت اضافه
 // =====================

 const extraBedCount=
  getSelectedExtraBedCount(room)

 const extraBedUnitPrice=
  getExtraBedTotalPrice(room)

 const extraBedPrice=
  extraBedUnitPrice*
  extraBedCount


 // =====================
 // بدون تخت
 // =====================

 const noBedCount=
  getSelectedNoBedCount(room)

 const noBedUnitPrice=
  getNoBedTotalPrice(room)

 const noBedPrice=
  noBedUnitPrice*
  noBedCount


 // =====================
 // ارسال به والد
 // =====================

 emit('reserve',{

  room,

  count,

  basePrice,

  extraBedCount,

  extraBedService:
   room?.extraBedService||
   'تخت اضافه',

  extraBedUnitPrice,

  extraBedPrice,

  noBedCount,

  noBedService:
   room?.noBedService||
   'بدون تخت',

  noBedUnitPrice,

  noBedPrice,

  finalPrice:
   basePrice+
   extraBedPrice+
   noBedPrice

 })

}



function openRoomModal(room){

 emit(
  'openRoomModal',
  room
 )

}


</script>

