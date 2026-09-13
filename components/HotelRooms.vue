<template>

<section
  class="rounded-[24px]"
  :class="
    selectedView
      ? 'bg-transparent p-0'
      : 'bg-[var(--color-gray-100)] px-5 py-7 md:px-8 md:py-10'
  "
  dir="rtl"
>

  <!-- ========================= -->
  <!-- Header -->
  <!-- ========================= -->

  <div v-if="selectedView">

    <h2
      class="mb-5 text-[18px] font-black text-[var(--color-gray-800)]"
    >
      اتاق انتخاب شده
    </h2>

  </div>


  <template v-else>

    <div>

      <h2
        class="text-[18px] font-black text-[var(--color-gray-800)]"
      >
        اتاق‌های هتل {{hotel.name}}
      </h2>

      <p
        class="mt-2 text-[11px] text-[var(--color-gray-400)]"
      >
        اطلاعات اتاق‌های این مجموعه
      </p>

    </div>


    <h3
      class="mt-8 mb-5 text-[17px] font-black text-[var(--color-gray-800)]"
    >
      اتاق‌ها
    </h3>

  </template>

  <!-- Loading -->
  <template v-if="roomsLoading">
    <transition name="fade" appear>
      <div
        class="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/10 backdrop-blur-[3px] transition-all duration-300"
      >
        <div
          class="bg-white/95 p-8 rounded-3xl shadow-2xl border border-[var(--color-gray-100)] flex flex-col items-center text-center max-w-sm mx-4"
        >
          <div
            class="animate-spin rounded-full h-14 w-14 border-4 border-[var(--color-primary-light)] bg-[var(--color-primary)] mb-4"
          ></div>

          <h4 class="font-bold text-[var(--color-gray-800)] text-base">
            در حال دریافت اتاق‌ها...
          </h4>

          <p class="text-xs text-[var(--color-gray-500)] mt-2 leading-relaxed">
            اطلاعات و قیمت اتاق‌ها در حال بارگذاری است.
          </p>
        </div>
      </div>
    </transition>
  </template>

  <!-- Error -->
  <div
    v-else-if="roomsError"
    class="min-h-[160px] rounded-2xl bg-white flex items-center justify-center"
  >
    <p class="text-[12px] text-[var(--color-red-500)]">
      {{roomsError}}
    </p>
  </div>

  <!-- Empty -->
  <div
    v-else-if="!hotelRooms.length"
    class="min-h-[180px] rounded-2xl bg-white flex flex-col items-center justify-center"
  >
    <i class="bi bi-door-closed text-[30px] text-[var(--color-gray-300)]"></i>

    <p class="mt-3 text-[13px] font-bold text-[var(--color-gray-600)]">
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
    class="overflow-hidden rounded-2xl border border-[var(--color-gray-200)] bg-white shadow-sm"
  >
    <!-- بخش بالای کارت -->
    <div class="p-5 md:p-6">
      <div
        class="relative flex flex-col md:flex-row md:items-start md:justify-between gap-5"
      >
        <!-- اطلاعات -->
        <div class="flex-1">

          <h4
            class="text-[15px] font-black text-[var(--color-gray-800)]"
          >
            {{room.type||room.name||'اتاق'}}
          </h4>

          <div
            class="mt-3 flex flex-wrap items-center gap-2"
          >
            <UiBaseLabel
              v-if="room.capacity"
              :text="`${room.capacity} نفر`"
              color="var(--color-primary)"
              icon='<i class="bi bi-person-fill"></i>'
            style="zoom:0.78"
            />

            <UiBaseLabel
              v-if="hasRoomCapacity(room) && Number(room.extraBed||0)>0"
              :text="`${room.extraBed} تخت اضافه`"
              color="var(--color-primary)"
              icon='<i class="bi bi-plus-circle"></i>'
            style="zoom:0.78"
            />

            <UiBaseLabel
              v-if="hasRoomCapacity(room) && Number(room.noBed||0)>0"
              :text="`${room.noBed} نفر بدون تخت`"
              color="var(--color-secondary)"
              icon='<i class="bi bi-person"></i>'
            style="zoom:0.78"
            />

            <UiBaseLabel
              :text="room.breakfastIncluded === false ? 'بدون صبحانه' : 'اقامت + صبحانه'"
              color="var(--color-primary-dark)"
              icon='<i class="bi bi-cup-hot"></i>'
            style="zoom:0.78"
            />

            <UiBaseLabel
              v-if="room.doubleBedCount"
              :text="`${room.doubleBedCount} تخت دبل`"
              color="var(--color-gray-600)"
              icon='<i class="bi bi-bed"></i>'
            style="zoom:0.78"
            />

            <UiBaseLabel
              v-if="room.singleBedCount"
              :text="`${room.singleBedCount} تخت سینگل`"
              color="var(--color-gray-600)"
              icon='<i class="bi bi-bed"></i>'
            style="zoom:0.78"
            />

            <UiBaseLabel
              v-if="hasRoomCapacity(room) && Number(room.sofaBedCount||0)>0"
              :text="`${room.sofaBedCount} کاناپه تختخواب‌شو`"
              color="var(--color-gray-600)"
              icon='<i class="bi bi-house-door"></i>'
            style="zoom:0.78"
            />
          </div>

          <div
            v-if="room.name || room.roomView"
            class="mt-3 flex flex-wrap items-center gap-2"
          >
            <span
              v-if="room.name"
              class="rounded bg-[var(--color-gray-100)] px-2 py-1 text-[10px] text-[var(--color-gray-700)]"
            >
              {{room.name}}
            </span>

            <span
              v-if="room.roomView"
              class="rounded bg-[var(--color-gray-100)] px-2 py-1 text-[10px] text-[var(--color-gray-700)]"
            >
              نمای {{room.roomView}}
            </span>
          </div>

          <p
            v-if="room.description"
            class="mt-4 text-[11px] leading-6 text-[var(--color-gray-500)]"
          >
            {{room.description}}
          </p>
        </div>

        <!-- جزئیات -->
        <UiBaseButton
          label="جزئیات اتاق و قوانین"
          variant="soft"
          color="primary"
          icon='<i class="bi bi-chevron-left"></i>'
          class="absolute left-0 top-0 shrink-0 !bg-transparent !border-0 !shadow-none !rounded-none !px-0 !py-0 text-[11px] font-medium md:static"
          @click="openRoomModal(room)"
        />
      </div>


      <!-- اسلایدر عکس -->
      <div
 v-if="
  !selectedView &&
  room.hotelRoomImages?.length
 "
        class="relative mt-5 h-[220px] overflow-hidden rounded-2xl bg-[var(--color-gray-100)]"
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

<!-- ========================= -->
<!-- خلاصه اتاق انتخاب شده -->
<!-- ========================= -->

<div
 v-if="selectedView"
 class="border-t border-[var(--color-gray-100)] bg-gradient-to-b from-white to-[var(--color-gray-100)] px-5 py-5 md:px-6"
>

 <!-- اطلاعات اصلی -->
 <div
  class="grid grid-cols-2 gap-3 md:grid-cols-4"
 >

  <!-- تعداد اتاق -->
  <div
   class="rounded-2xl border border-[var(--color-gray-100)] bg-white p-4"
  >
   <div
    class="mb-2 flex items-center gap-2 text-[var(--color-gray-400)]"
   >
    <i class="bi bi-door-open text-[15px]"></i>

    <span class="text-[10px]">
     تعداد اتاق
    </span>
   </div>

   <p
    class="text-[13px] font-black text-[var(--color-gray-800)]"
   >
    {{Number(room.count||1)}}
    اتاق
   </p>
  </div>


  <!-- تعداد شب -->
  <div
   class="rounded-2xl border border-[var(--color-gray-100)] bg-white p-4"
  >
   <div
    class="mb-2 flex items-center gap-2 text-[var(--color-gray-400)]"
   >
    <i class="bi bi-moon-stars text-[15px]"></i>

    <span class="text-[10px]">
     مدت اقامت
    </span>
   </div>

   <p
    class="text-[13px] font-black text-[var(--color-gray-800)]"
   >
    {{getRoomNightCount(room)}}
    شب
   </p>
  </div>


  <!-- ظرفیت -->
  <div
   class="rounded-2xl border border-[var(--color-gray-100)] bg-white p-4"
  >
   <div
    class="mb-2 flex items-center gap-2 text-[var(--color-gray-400)]"
   >
    <i class="bi bi-people text-[15px]"></i>

    <span class="text-[10px]">
     ظرفیت اتاق
    </span>
   </div>

   <UiBaseLabel
    :text="`${Number(room.capacity||0)} نفر`"
    color="var(--color-primary)"
    icon='<i class="bi bi-people"></i>'
   style="zoom:0.78"
   />
  </div>


  <!-- نوع اقامت -->
  <div
   class="rounded-2xl border border-[var(--color-gray-100)] bg-white p-4"
  >
   <div
    class="mb-2 flex items-center gap-2 text-[var(--color-gray-400)]"
   >
    <i class="bi bi-cup-hot text-[15px]"></i>

    <span class="text-[10px]">
     نوع اقامت
    </span>
   </div>

   <UiBaseLabel
    :text="room.breakfastIncluded === false ? 'بدون صبحانه' : 'با صبحانه'"
    color="var(--color-primary-dark)"
    icon='<i class="bi bi-cup-hot"></i>'
   style="zoom:0.78"
   />
  </div>

 </div>


 <!-- سرویس‌های اضافه -->
 <div
  v-if="
   Number(room.extraBedCount||0)>0 ||
   Number(room.noBedCount||0)>0
  "
  class="mt-4 flex flex-wrap gap-2"
 >

  <UiBaseLabel
   v-if="Number(room.extraBedCount||0)>0"
   :text="`${room.extraBedCount} تخت اضافه`"
   color="var(--color-primary)"
   icon='<i class="bi bi-plus-circle"></i>'
  style="zoom:0.78"
  />


  <UiBaseLabel
   v-if="Number(room.noBedCount||0)>0"
   :text="`${room.noBedCount} نفر بدون تخت`"
   color="var(--color-secondary)"
   icon='<i class="bi bi-person"></i>'
  style="zoom:0.78"
  />

 </div>


 <!-- تاریخ اقامت -->
 <div
  v-if="checkIn&&checkOut"
  class="mt-4 flex flex-col gap-3 rounded-2xl border border-[var(--color-gray-100)] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
 >

  <div class="flex items-center gap-3">

   <div
    class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-gray-100)] text-[var(--color-gray-500)]"
   >
    <i class="bi bi-calendar-check"></i>
   </div>

   <div>

    <p class="text-[10px] text-[var(--color-gray-400)]">
     تاریخ ورود
    </p>

    <p
     class="mt-1 text-[12px] font-bold text-[var(--color-gray-700)]"
     dir="ltr"
    >
     {{checkIn}}
    </p>

   </div>

  </div>


  <div
   class="hidden h-px flex-1 bg-[var(--color-gray-100)] sm:block"
  ></div>


  <div class="flex items-center gap-3">

   <div
    class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-gray-100)] text-[var(--color-gray-500)]"
   >
    <i class="bi bi-calendar-x"></i>
   </div>

   <div>

    <p class="text-[10px] text-[var(--color-gray-400)]">
     تاریخ خروج
    </p>

    <p
     class="mt-1 text-[12px] font-bold text-[var(--color-gray-700)]"
     dir="ltr"
    >
     {{checkOut}}
    </p>

   </div>

  </div>

 </div>


 <!-- مبلغ نهایی -->
 <div
  class="mt-4 flex flex-col items-center gap-4 rounded-2xl bg-[var(--color-primary-light)] p-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-right"
 >

  <div>

   <p
    class="text-[11px] font-bold text-[var(--color-gray-500)]"
   >
    مبلغ نهایی اقامت
   </p>

   <p class="mt-1 text-[10px] text-[var(--color-gray-400)]">
    برای
    {{Number(room.count||1)}}
    اتاق و
    {{Number(room.nightCount||0)}}
    شب
   </p>

  </div>


  <div
   class="flex items-end justify-center gap-1 sm:justify-start"
   dir="rtl"
  >

   <span
    class="text-[22px] font-black text-[var(--color-primary-dark)]"
   >
    {{formatPrice(room.price)}}
   </span>

   <span
    class="pb-1 text-[10px] font-bold text-[var(--color-gray-500)]"
   >
    ریال
   </span>

  </div>

 </div>

</div>
<div
v-else
 class="border-t border-[var(--color-gray-200)] px-5 py-5 md:px-6"
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
      class="text-[11px] font-bold text-[var(--color-gray-700)]"
     >
      تعداد اتاق
     </span>

     <p
      class="mt-1 text-[10px] text-[var(--color-gray-400)]"
     >
      موجودی:
      {{getRoomAvailableCount(room)}}
      اتاق
     </p>

    </div>


        <UiBaseButton
     label="+"
     variant="outline"
     color="primary"
     class="!h-9 !w-9 !min-w-0 !rounded-lg !p-0 text-[22px]"
     :disabled="
      getSelectedRoomCount(room)>=getRoomAvailableCount(room)
     "
     @click="increaseRoom(room)"
    />


    <span
     class="min-w-[20px] text-center text-[13px] font-bold"
    >
     {{getSelectedRoomCount(room)}}
    </span>


        <UiBaseButton
     label="−"
     variant="outline"
     color="primary"
     class="!h-9 !w-9 !min-w-0 !rounded-lg !p-0 text-[20px]"
     :disabled="
      getSelectedRoomCount(room)<=1
     "
     @click="decreaseRoom(room)"
    />

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
       class="text-[11px] font-bold text-[var(--color-gray-700)]"
      >
       {{room.extraBedService || 'تخت اضافه'}}
      </span>

      <p
       v-if="getExtraBedTotalPrice(room)>0"
       class="mt-1 text-[10px] text-[var(--color-gray-400)]"
      >
       {{formatPrice(getExtraBedTotalPrice(room))}}
       ریال
      </p>

     </div>


          <UiBaseButton
      label="+"
      variant="outline"
      color="primary"
      class="!h-9 !w-9 !min-w-0 !rounded-lg !p-0 text-[22px]"
      :disabled="
       getSelectedExtraBedCount(room)>=getExtraBedLimit(room)
      "
      @click="increaseExtraBed(room)"
     />


     <span
      class="min-w-[20px] text-center text-[13px] font-bold"
     >
      {{getSelectedExtraBedCount(room)}}
     </span>


          <UiBaseButton
      label="−"
      variant="outline"
      color="primary"
      class="!h-9 !w-9 !min-w-0 !rounded-lg !p-0 text-[20px]"
      :disabled="
       getSelectedExtraBedCount(room)<=0
      "
      @click="decreaseExtraBed(room)"
     />

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
       class="text-[11px] font-bold text-[var(--color-gray-700)]"
      >
       {{room.noBedService || 'بدون تخت'}}
      </span>

      <p
       v-if="getNoBedTotalPrice(room)>0"
       class="mt-1 text-[10px] text-[var(--color-gray-400)]"
      >
       {{formatPrice(getNoBedTotalPrice(room))}}
       ریال
      </p>

     </div>


          <UiBaseButton
      label="+"
      variant="outline"
      color="primary"
      class="!h-9 !w-9 !min-w-0 !rounded-lg !p-0 text-[22px]"
      :disabled="
       getSelectedNoBedCount(room)>=getNoBedLimit(room)
      "
      @click="increaseNoBed(room)"
     />


     <span
      class="min-w-[20px] text-center text-[13px] font-bold"
     >
      {{getSelectedNoBedCount(room)}}
     </span>


          <UiBaseButton
      label="−"
      variant="outline"
      color="primary"
      class="!h-9 !w-9 !min-w-0 !rounded-lg !p-0 text-[20px]"
      :disabled="
       getSelectedNoBedCount(room)<=0
      "
      @click="decreaseNoBed(room)"
     />

    </div>

   </div>

  </div>


  <!-- ========================= -->
  <!-- سمت چپ: قیمت و رزرو -->
  <!-- ========================= -->

  <div
   class="flex min-w-[210px] flex-col items-stretch gap-3"
  >

   <!-- قیمت نهایی؛ همیشه بالای دکمه رزرو -->
   <div
    v-if="
     Number(room.calculatedPrice||0)>0 &&
     getRoomAvailableCount(room)>0
    "
    class="text-right"
    dir="rtl"
   >

    <p
     class="text-[11px] font-bold text-[var(--color-gray-700)]"
    >
     قیمت نهایی برای
     {{getRoomNightCount(room)}}
     شب
    </p>

    <div
     class="mt-1 flex items-end justify-center gap-1"
    >
     <span
      class="text-[19px] font-black text-[var(--color-primary-dark)]"
     >
      {{formatPrice(getRoomFinalPrice(room))}}
     </span>

     <span
      class="pb-[2px] text-[10px] text-[var(--color-gray-600)]"
     >
      ریال
     </span>
    </div>
   </div>

   <!-- قیمت موجود نیست -->
   <div
    v-else-if="
     getRoomAvailableCount(room)>0 &&
     Number(room.calculatedPrice||0)<=0
    "
    class="rounded-xl bg-[var(--color-gray-100)] px-4 py-3 text-center text-[11px] font-bold text-[var(--color-gray-500)]"
   >
    قیمت موجود نیست
   </div>

   <!-- واچر -->
   <UiBaseLabel
    v-if="room.onRequest && getRoomAvailableCount(room)>0"
    text="واچر بعد از تایید هتل ارسال می‌شود"
    color="var(--color-red-500)"
    icon='<i class="bi bi-info-circle"></i>'
   style="zoom:0.78"
   />

   <!-- رزرو -->
   <UiBaseButton
    :label="
     getRoomAvailableCount(room)>0
      ?'رزرو اتاق'
      :'تکمیل ظرفیت'
    "
    variant="filled"
    color="primary"
    class="w-full !rounded-3xl !px-6 h-12 text-sm font-bold"
    :disabled="getRoomAvailableCount(room)===0"
    @click="reserveRoom(room)"
   />

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

