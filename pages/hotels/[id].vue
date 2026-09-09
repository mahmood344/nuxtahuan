<template>
  <div
    class="min-h-screen bg-gray-100 pb-24 md:bg-white md:pb-10 mt-[60px]"
    dir="ltr"
  >
    <!-- ========================= -->
    <!-- Header -->
    <!-- ========================= -->
    <header
      class="hidden md:block relative h-[97px] w-full bg-secondary -mt-10"
    >
      <div
        class="absolute inset-0"
        style="background-image:url('/imgs/flight/header.png')"
      ></div>

      <div
        class="absolute -bottom-15 left-0 right-0 z-10 mx-auto max-w-3xl px-4"
      >
        <Stepper
          :steps="flightSteps"
          :active-step="flightStore.currentStep"
          active-color="#1a237e"
        />
      </div>
    </header>


    <!-- ========================= -->
    <!-- Main -->
    <!-- ========================= -->
    <main
      class="mx-auto mt-0 md:mt-[100px] max-w-7xl px-0 md:px-4"
    >
      <div
        class="grid grid-cols-1 gap-8 lg:grid-cols-12"
      >

        <!-- ========================= -->
        <!-- Sidebar -->
        <!-- ========================= -->
        <aside
 class="hidden lg:block lg:col-span-4 order-1 lg:order-2"
>
 <div class=" top-24 space-y-4 mb-4" v-if="currentStep===0">
    <FlightSearchPanel mode="aside" :showServices="true" />
  </div>
<HotelBookingAside
 :hotel="hotelDisplay"
 :check-in="checkIn"
 :check-out="checkOut"
 :gallery-images="galleryImages"
 @continue="continueBooking"
/>
</aside>


        <!-- ========================= -->
        <!-- Content -->
        <!-- ========================= -->
        <div
          class="lg:col-span-8 order-2 lg:order-1 relative px-2 md:px-0"
        >

          <!-- ========================= -->
          <!-- Loading Hotel -->
          <!-- ========================= -->
          <div
            v-if="loading"
            class="min-h-[400px] flex items-center justify-center"
          >
            <div class="text-center">
              <div
                class="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-t-[var(--color-primary)] animate-spin"
              ></div>

              <p
                class="mt-4 text-[12px] text-gray-500"
              >
                در حال دریافت اطلاعات هتل...
              </p>
            </div>
          </div>


          <!-- ========================= -->
          <!-- Hotel Error -->
          <!-- ========================= -->
          <div
            v-else-if="errorMessage"
            class="min-h-[300px] flex items-center justify-center"
          >
            <p
              class="text-[13px] font-bold text-red-500"
            >
              {{errorMessage}}
            </p>
          </div>


          <!-- ========================= -->
          <!-- Hotel Content -->
          <!-- ========================= -->
        <div
 v-else-if="
  hotel||
  galleryImages.length||
  hotelFacilities.length||
  hasHotelLocation
 "
 class="space-y-7"
 dir="rtl"
>

            <!-- ========================= -->
            <!-- Gallery -->
            <!-- ========================= -->
            <section
              v-if="galleryImages.length && currentStep===0"
              class="flex w-full gap-2"
            >
              <!-- تصویر بزرگ -->
              <div
                class="w-1/2 h-[400px] overflow-hidden rounded-2xl"
              >
                <img
                  :src="getHotelImageUrl(galleryImages[0]?.image)"
                  :alt="hotelDisplay.name"
                  class="block w-full h-full object-cover"
                   @click="openHotelGallery(0)"
                >
              </div>


              <!-- چهار تصویر کوچک -->
              <div
                class="w-1/2 h-[400px] grid grid-cols-2 grid-rows-2 gap-2"
              >
                <div
                  v-for="(image,index) in galleryImages.slice(1,5)"
                  :key="image.id||index"
                  class="relative overflow-hidden rounded-xl"
                  @click="openHotelGallery(index+1)"
                >
                  <img
                    :src="getHotelImageUrl(image.image)"
                    :alt="image.description||hotelDisplay.name"
                    class="block w-full h-full object-cover"
                  >

                  <div
                    v-if="
                      index===3&&
                      remainingImagesCount>0
                    "
                    class="absolute inset-0 flex items-end justify-end p-3"
                  >
                    <button
                      type="button"
                      class="flex items-center gap-2 rounded-xl bg-slate-900/90 px-4 py-2 text-[11px] font-bold text-white"
                      @click="openHotelGallery(5)"
                    >
                      <i
                        class="bi bi-grid-3x3-gap-fill"
                      ></i>

                      {{remainingImagesCount}}
                      تصویر دیگر
                    </button>
                  </div>
                </div>
              </div>
              <Teleport to="body">

<div
 v-if="hotelGalleryModalOpen"
 class="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center p-5"
 @click.self="closeHotelGallery"
 dir="rtl"
>


<div class="relative w-full max-w-5xl">


<button
 class="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-white/20 text-white"
 @click="closeHotelGallery"
>
<i class="bi bi-x-lg"></i>
</button>


<img
 :src="
 getHotelImageUrl(
 sortedHotelImages[hotelGalleryIndex]?.image
 )
 "
 class="w-full max-h-[80vh] object-contain rounded-2xl"
>


<button
 class="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white"
 @click="prevHotelGallery"
>
<i class="bi bi-chevron-right text-xl"></i>
</button>


<button
 class="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white"
 @click="nextHotelGallery"
>
<i class="bi bi-chevron-left text-xl"></i>
</button>


<div
 class="mt-4 text-center text-white text-sm"
>
 {{hotelGalleryIndex+1}}
 /
 {{sortedHotelImages.length}}
</div>


</div>

</div>

</Teleport>
            </section>


            <!-- ========================= -->
            <!-- Hotel Info -->
            <!-- ========================= -->
            <section
 v-if="currentStep===0"
 class="bg-white rounded-2xl p-4 md:p-6"
>
              <h1
                class="text-[20px] md:text-[22px] font-black text-gray-900"
              >
                هتل {{hotelDisplay.name}}
              </h1>


              <!-- Stars -->
              <div
                class="mt-3 flex flex-wrap items-center gap-3"
              >
                <div
                  class="flex items-center gap-1 text-yellow-500"
                  dir="ltr"
                >
                  <i
                    v-for="star in Number(hotelDisplay.star||4)"
                    :key="star"
                    class="bi bi-star-fill"
                  ></i>
                </div>

                <span
                  class="text-[12px] text-gray-500"
                >
                  {{hotelDisplay.star||4}}
                  ستاره
                </span>

                <span
                  v-if="hotelDisplay.score"
                  class="text-[12px] text-gray-500"
                >
                  امتیاز
                  {{hotelDisplay.score}}
                </span>
              </div>


              <!-- Description -->
              <p
 v-if="hotelDescription"
 class="mt-5 text-[12px] leading-8 text-gray-600 text-justify"
>
 {{hotelDescription}}
</p>


              <!-- Extra info -->
              <div
                class="mt-5 flex flex-wrap gap-5 text-[11px] text-gray-500"
              >
                <span
                  v-if="hotelDisplay.checkInTime"
                  class="flex items-center gap-2"
                >
                  <i class="bi bi-clock"></i>

                  ساعت ورود:
                  {{hotelDisplay.checkInTime}}
                </span>

                <span
                  v-if="hotelDisplay.checkOutTime"
                  class="flex items-center gap-2"
                >
                  <i
                    class="bi bi-clock-history"
                  ></i>

                  ساعت خروج:
                  {{hotelDisplay.checkOutTime}}
                </span>

                <span
                  v-if="hotelDisplay.address"
                  class="flex items-center gap-2"
                >
                  <i class="bi bi-geo-alt"></i>

                  {{hotelDisplay.address}}
                </span>
              </div>
            </section>


            <!-- ========================= -->
            <!-- Facilities -->
            <!-- ========================= -->
            <section
              v-if="hotelFacilities.length && currentStep===0"
              class="bg-white rounded-2xl p-4 md:p-6"
            >
              <h2
                class="text-[15px] font-black text-gray-900"
              >
                امکانات هتل
              </h2>

              <div
                class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5"
              >
                <div
                  v-for="facility in hotelFacilities"
                  :key="getFacilityKey(facility)"
                  class="flex items-center gap-2 text-[12px] text-gray-600"
                >
                  <span
                    class="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 text-[var(--color-primary)]"
                  >
                    <i class="bi bi-check2"></i>
                  </span>

                  <span>
                    {{getFacilityTitle(facility)}}
                  </span>
                </div>
              </div>
            </section>


     

<!-- ========================= -->
<!-- Rooms -->
<!-- ========================= -->
<HotelRooms
 v-if="
  currentStep===0&&
  checkIn&&
  checkOut
 "
 :hotel="hotelDisplay"
 :rooms="roomsWithPrice"
 :rooms-loading="roomsLoading"
 :rooms-error="roomsError"
 :display-only="roomsFallbackMode"
 :check-in="checkIn"
 :check-out="checkOut"
 @open-room-modal="openRoomModal"
 @reserve="reserveRoom"
/>
<!-- ========================= -->
<!-- Hotel Location -->
<!-- ========================= -->
<!-- ========================= -->
<!-- Hotel Location -->
<!-- ========================= -->
<section
 v-if="currentStep===0&&hasHotelLocation"
 class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-6"
>
 <!-- Header -->
 <div
  class="mb-5 flex items-center justify-between border-b border-gray-100 pb-4"
 >
  <div class="flex items-center gap-3">
   <!-- <div
    class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-[var(--color-primary)]"
   >
    <i class="bi bi-geo-alt-fill text-lg"></i>
   </div> -->

   <div>
    <h2 class="text-[14px] font-black text-gray-900">
     موقعیت هتل
    </h2>

    <p class="mt-1 text-[11px] text-gray-400">
     هتل {{hotelDisplay.name}}
    </p>
   </div>
  </div>

  <a
   :href="hotelMapLink"
   target="_blank"
   rel="noopener noreferrer"
   class="hidden items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-[11px] font-bold text-gray-600 transition hover:bg-gray-50 md:flex"
  >
   <i class="bi bi-box-arrow-up-left"></i>
   نمایش در نقشه
  </a>
 </div>

 <!-- Map -->
 <div
  class="relative h-[300px] overflow-hidden rounded-xl border border-gray-200 bg-gray-50 md:h-[380px]"
 >
  <iframe
   :src="hotelMapUrl"
   :title="`موقعیت هتل ${hotelDisplay.name}`"
   class="absolute inset-0 h-full w-full border-0"
   loading="lazy"
   allowfullscreen
  ></iframe>
 </div>

 <!-- Footer -->
 <div
  class="mt-4 flex items-center justify-between gap-3"
 >
  <div class="flex items-center gap-2 text-[11px] text-gray-500">
   <i class="bi bi-geo-alt text-[var(--color-primary)]"></i>

   <span v-if="hotelDisplay.address">
    {{hotelDisplay.address}}
   </span>

   <span v-else>
    موقعیت هتل روی نقشه
   </span>
  </div>

  <a
   :href="hotelMapLink"
   target="_blank"
   rel="noopener noreferrer"
   class="flex shrink-0 items-center gap-2 text-[11px] font-bold text-[var(--color-primary)] md:hidden"
  >
   مشاهده نقشه
   <i class="bi bi-chevron-left"></i>
  </a>
 </div>
</section>
<div
 v-else-if="currentStep===1"
 class="space-y-6"
>

<PassengerInfoForm ref="passengerFormRef"/>

<ContactInfoForm
 ref="contactFormRef"
 :loading="continueShoppingLoading"
 @submit="continueHotelBooking"
/>

</div>
<div
 v-else-if="currentStep===2"
 class="space-y-6"
>

<BookingInfoTable
 mode="passengers"
 :flight-type="flightType"
 :passengers="bookingData.passengers"
 @update:passengers="bookingData.passengers=$event"
/>


<BookingInfoTable
 mode="contact"
 :contact="bookingData.contact"
 @update:contact="bookingData.contact=$event"
/>


<PaymentSummary
  :original-price="hotelFinalPrice"
  :final-price="priceAfterTravelCard"
  :loading="paymentLoading"
  :travel-card-credit="travelCardCredit"
  :travel-card-loading="travelCardLoading"
  :travel-card-applied="travelCardApplied"
  :travel-card-owner-name="travelCardOwnerName"
  :travel-card-error-message="travelCardError"
  @back="flightStore.setCurrentStep(1)"
  @submit="handleFinalPayment"
  @apply-travel-card="handleApplyTravelCard"
  @clear-travel-card-error="travelCardError = ''"
  @reset-travel-card="handleResetTravelCard"  
/>
</div>
          </div>

        </div>
      </div>
    </main>
  </div>
  <!-- ====================== -->
<!-- Room Detail Modal -->
<!-- ====================== -->
<Teleport to="body">
  <div
    v-if="roomModalOpen&&selectedRoom"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
    dir="rtl"
    @click.self="closeRoomModal"
  >
    <div
      class="w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
    >
      <!-- Header -->
      <div
        class="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4"
      >
        <div>
          <h3
            class="text-[17px] font-black text-gray-900"
          >
            {{
              selectedRoom.type||
              selectedRoom.name||
              'جزئیات اتاق'
            }}
          </h3>

          <p
            v-if="selectedRoom.name"
            class="mt-1 text-[11px] text-gray-400"
          >
            {{selectedRoom.name}}
          </p>
        </div>

        <button
          type="button"
          class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          @click="closeRoomModal"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>


      <div class="p-5">

        <!-- تصاویر Modal -->
        <div
          v-if="selectedRoom.hotelRoomImages?.length"
          class="grid grid-cols-1 md:grid-cols-3 gap-2"
        >
          <div
            class="md:col-span-2 h-[280px] overflow-hidden rounded-2xl"
          >
            <img
              :src="
                getHotelImageUrl(
                  selectedRoom.hotelRoomImages[
                    getRoomSlideIndex(selectedRoom)
                  ]?.image
                )
              "
              class="w-full h-full object-cover"
              :alt="selectedRoom.type"
            >
          </div>

          <div
            class="grid grid-cols-2 md:grid-cols-1 gap-2"
          >
            <button
              v-for="(image,index) in selectedRoom.hotelRoomImages.slice(0,4)"
              :key="image.id||index"
              type="button"
              class="h-[90px] md:h-[66px] overflow-hidden rounded-xl border-2"
              :class="
                getRoomSlideIndex(selectedRoom)===index
                  ?'border-[var(--color-primary)]'
                  :'border-transparent'
              "
              @click="setRoomSlide(selectedRoom,index)"
            >
              <img
                :src="getHotelImageUrl(image.image)"
                class="w-full h-full object-cover"
                :alt="selectedRoom.type"
              >
            </button>
          </div>
        </div>


        <!-- اطلاعات -->
        <div
          class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          <div
            class="rounded-xl bg-gray-50 p-3"
          >
            <p class="text-[10px] text-gray-400">
              ظرفیت پایه
            </p>

            <p class="mt-1 text-[12px] font-bold">
              {{selectedRoom.capacity||0}}
              نفر
            </p>
          </div>

          <div
            class="rounded-xl bg-gray-50 p-3"
          >
            <p class="text-[10px] text-gray-400">
              حداکثر ظرفیت
            </p>

            <p class="mt-1 text-[12px] font-bold">
              {{selectedRoom.maxCapacity||0}}
              نفر
            </p>
          </div>

          <div
            class="rounded-xl bg-gray-50 p-3"
          >
            <p class="text-[10px] text-gray-400">
              نمای اتاق
            </p>

            <p class="mt-1 text-[12px] font-bold">
              {{selectedRoom.roomView||'-'}}
            </p>
          </div>

          <div
            class="rounded-xl bg-gray-50 p-3"
          >
            <p class="text-[10px] text-gray-400">
              تخت دو نفره
            </p>

            <p class="mt-1 text-[12px] font-bold">
              {{selectedRoom.doubleBedCount||0}}
            </p>
          </div>

          <div
            class="rounded-xl bg-gray-50 p-3"
          >
            <p class="text-[10px] text-gray-400">
              تخت یک نفره
            </p>

            <p class="mt-1 text-[12px] font-bold">
              {{selectedRoom.singleBedCount||0}}
            </p>
          </div>

          <div
            class="rounded-xl bg-gray-50 p-3"
          >
            <p class="text-[10px] text-gray-400">
              کاناپه
            </p>

            <p class="mt-1 text-[12px] font-bold">
              {{selectedRoom.sofaBedCount||0}}
            </p>
          </div>

          <div
            v-if="Number(selectedRoom.extraBed||0)>0"
            class="rounded-xl bg-gray-50 p-3"
          >
            <p class="text-[10px] text-gray-400">
              تخت اضافه
            </p>

            <p class="mt-1 text-[12px] font-bold">
              {{selectedRoom.extraBed}}
            </p>
          </div>

          <div
            v-if="selectedRoom.extraBedService"
            class="rounded-xl bg-gray-50 p-3"
          >
            <p class="text-[10px] text-gray-400">
              نوع تخت اضافه
            </p>

            <p class="mt-1 text-[12px] font-bold">
              {{selectedRoom.extraBedService}}
            </p>
          </div>

          <div
            v-if="Number(selectedRoom.noBed||0)>0"
            class="rounded-xl bg-gray-50 p-3"
          >
            <p class="text-[10px] text-gray-400">
              بدون تخت
            </p>

            <p class="mt-1 text-[12px] font-bold">
              {{selectedRoom.noBed}}
              نفر
            </p>
          </div>

          <div
            v-if="selectedRoom.doubleBedType"
            class="rounded-xl bg-gray-50 p-3"
          >
            <p class="text-[10px] text-gray-400">
              نوع تخت دبل
            </p>

            <p class="mt-1 text-[12px] font-bold">
              {{selectedRoom.doubleBedType}}
            </p>
          </div>
        </div>


        <!-- سرویس تخت اضافه -->
        <div
          v-if="
            selectedRoom.extraBedFrom||
            selectedRoom.extraBedTo
          "
          class="mt-5 rounded-2xl border border-gray-100 p-4"
        >
          <h4
            class="text-[13px] font-black"
          >
            شرایط تخت اضافه
          </h4>

          <p
            class="mt-3 text-[11px] leading-6 text-gray-500"
          >
            تخت اضافه برای سن
            {{selectedRoom.extraBedFrom||'-'}}
            تا
            {{selectedRoom.extraBedTo||'-'}}
            سال قابل ارائه است.

            <template
              v-if="selectedRoom.extraBedService"
            >
              نوع سرویس:
              {{selectedRoom.extraBedService}}
            </template>
          </p>
        </div>


        <!-- بدون تخت -->
        <div
          v-if="
            selectedRoom.noBedFrom||
            selectedRoom.noBedTo
          "
          class="mt-4 rounded-2xl border border-gray-100 p-4"
        >
          <h4
            class="text-[13px] font-black"
          >
            شرایط اقامت بدون تخت
          </h4>

          <p
            class="mt-3 text-[11px] leading-6 text-gray-500"
          >
            اقامت بدون تخت برای سن
            {{selectedRoom.noBedFrom||'-'}}
            تا
            {{selectedRoom.noBedTo||'-'}}
            سال قابل ارائه است.

            <template
              v-if="selectedRoom.noBedService"
            >
              نوع سرویس:
              {{selectedRoom.noBedService}}
            </template>
          </p>
        </div>


        <!-- توضیحات -->
        <div
          v-if="selectedRoom.description"
          class="mt-4 rounded-2xl border border-gray-100 p-4"
        >
          <h4
            class="text-[13px] font-black"
          >
            توضیحات اتاق
          </h4>

          <p
            class="mt-3 text-[11px] leading-7 text-gray-500"
          >
            {{selectedRoom.description}}
          </p>
        </div>

      </div>
    </div>
  </div>
</Teleport>
<form
 ref="formshaparakRef"
 name="PostForm"
 method="POST"
 action="https://ikc.shaparak.ir/iuiv3/IPG/Index"
 class="hidden"
>
 <input
  name="tokenIdentity"
  type="hidden"
  :value="formshaparak.bankToken"
 />
</form>
</template>


<script setup>
import{
 ref,
 reactive,
 computed,
 watch,
 nextTick
}from'vue'

import{
 useRoute,
 useRouter
}from'vue-router'
import moment from 'moment-jalaali'
import{useFlightStore}from'~/stores/flights'
import { useHotelStore } from '~/stores/hotels'
const hotelStore = useHotelStore()
const route=useRoute()
const router=useRouter()
const flightStore=useFlightStore()
const selectedRooms = computed(()=>hotelStore.selectedRooms)
const currentStep = computed(()=>flightStore.currentStep)
const BASE_URL='https://api.ahuan.ir/api'
const HOTEL_IMAGE_BASE='https://panel.ahuan.ir/uploads'
const passengerFormRef=ref(null)
const DEFAULT_HOTEL_DESCRIPTION=
 'هتل آهوان چابکسر از واحدهای اقامتی با سابقه این شهر می‌باشد که در زمینی به مساحت 18 هکتار به بهره‌برداری رسید. هتل ساحلی آهوان دارای سه مجموعه اقامتی با نام‌های گل‌نشان، گل‌افشان و ویلایی است. مجموعه گل‌نشان هتل آهوان شامل 11 ساختمان سه طبقه، مجموعه گل‌افشان دارای یک ساختمان پنج طبقه و مجموعه ویلایی شامل 50 باب ویلا می‌شود. هتل تفریحی ساحلی آهوان مجموعاً مشتمل بر 212 باب سوئیت و ویلا است که با دارا بودن امکانات اقامتی مناسب پذیرای میهمانان و گردشگران محترم در ساحل دریای خزر می‌باشد. مجتمع اقامتی آهوان در 16 کیلومتری جاده رامسر به رودسر واقع شده‌است و 10 کیلومتر بعد از شهر چابکسر قرار دارد. قابل توجه میهمانان گرامی، مجموعه گل‌نشان هتل چهار ستاره آهوان چابکسر فاقد آسانسور است.'
const DEFAULT_HOTEL_LATITUDE=
 37.0155520580034

const DEFAULT_HOTEL_LONGITUDE=
 50.4892617892048


const contactFormRef=ref(null)
const bookingData= ref({
  contact: {
    phone: '',
    email: '',
  },
  passengers: [],
})
const continueShoppingLoading=ref(false)
// =========================
// Hotel
// =========================
const hotel=ref(null)
const hotelImages=ref([])
const hotelFacilities=ref([])
const hotelAvailability=ref(null)
const currentContractData=ref(null)
const paymentLoading=ref(false)
const paymentError=ref('')
const hotelId=computed(()=>
 Number(route.params.id||0)
)

const isAhuanChaboksar=computed(()=>
 hotelId.value===3
)
const hotelDisplay=computed(()=>{

 const isChaboksar=
  isAhuanChaboksar.value

 return{
  id:
   hotel.value?.id||
   hotelId.value||
   0,

  name:String(
   hotel.value?.name||
   (isChaboksar
    ?'آهوان چابکسر'
    :'')
  ).trim(),

  star:Number(
   hotel.value?.star||
   (isChaboksar
    ?4
    :0)
  ),

  score:
   hotel.value?.score||
   null,

  description:String(
   hotel.value?.description||
   (isChaboksar
    ?DEFAULT_HOTEL_DESCRIPTION
    :'')
  ).trim(),

  checkInTime:
   hotel.value?.checkInTime||
   '',

  checkOutTime:
   hotel.value?.checkOutTime||
   '',

  address:
   hotel.value?.address||
   '',

  latitude:Number(
   hotel.value?.latitude||
   (isChaboksar
    ?DEFAULT_HOTEL_LATITUDE
    :0)
  ),

  longitude:Number(
   hotel.value?.longitude||
   (isChaboksar
    ?DEFAULT_HOTEL_LONGITUDE
    :0)
  )
 }

})
const hotelDescription=computed(()=>hotelDisplay.value.description)

const hotelLatitude=computed(()=>{

 const lat=
  Number(
   hotelDisplay.value.latitude
  )

 if(
  Number.isFinite(lat)&&
  lat!==0
 ){
  return lat
 }

 return null

})


const hotelLongitude=computed(()=>{

 const lng=
  Number(
   hotelDisplay.value.longitude
  )

 if(
  Number.isFinite(lng)&&
  lng!==0
 ){
  return lng
 }

 return null

})


const hasHotelLocation=computed(()=>
 Number.isFinite(
  hotelLatitude.value
 )&&
 Number.isFinite(
  hotelLongitude.value
 )
)








const hotelMapUrl=computed(()=>{

 const lat=hotelLatitude.value
 const lng=hotelLongitude.value
 const delta=.008

 const bbox=[
  lng-delta,
  lat-delta,
  lng+delta,
  lat+delta
 ].join(',')

 return(
  'https://www.openstreetmap.org/export/embed.html'+
  `?bbox=${encodeURIComponent(bbox)}`+
  '&layer=mapnik'+
  `&marker=${lat},${lng}`
 )
})


const hotelMapLink=computed(()=>{

 const lat=hotelLatitude.value
 const lng=hotelLongitude.value

 return(
  'https://www.openstreetmap.org/'+
  `?mlat=${lat}&mlon=${lng}`+
  `#map=16/${lat}/${lng}`
 )
})


const PAYMENT_SESSION_KEY='flight_payment_session'

const formshaparakRef=ref(null)

const formshaparak=reactive({
 bankToken:''
})
const loading=ref(false)
const errorMessage=ref('')

// =========================
// Rooms
// =========================
const hotelRooms=ref([])
const roomsLoading=ref(false)
const roomsError=ref('')

// وقتی availability اتاق قابل فروش برنگرداند،
// اتاق‌های عمومی هتل از /Hotel/rooms/{id} فقط برای نمایش دریافت می‌شوند.
const roomsFallbackMode=ref(false)

const selectedRoom=ref(null)
const roomModalOpen=ref(false)
const roomSlideIndexes=ref({})
const selectedRoomCounts=ref({})
const hotelGalleryModalOpen=ref(false)
const hotelGalleryIndex=ref(0)
// =========================
// Route
// =========================
// const hotelId=computed(()=>
//   Number(route.params.id||0)
// )

const checkIn=computed(()=>
  String(route.query.checkIn||'').trim()
)
const totalSelectedPrice=computed(()=>{

  return selectedRooms.value.reduce(
    (sum,item)=>
      sum + Number(item.price||0),
    0
  )

})
function getIssueTime(){

 return new Date()
 .toLocaleTimeString('fa-IR',{
   hour:'2-digit',
   minute:'2-digit'
 })

}
function convertBirthDate(date){

 if(!date)
  return null

 if(date.calendar==='jalali')
  return `${date.year}-${String(date.month).padStart(2,'0')}-${String(date.day).padStart(2,'0')}`

 return date

}
function toIsoBirthDate(birthDate){

 if(!birthDate)
  return ''


 let year =
  birthDate.year

 let month =
  birthDate.month

 let day =
  birthDate.day


 if(!year || !month || !day)
  return ''


 const date =
  `${year}/${String(month).padStart(2,'0')}/${String(day).padStart(2,'0')}`


 const m =
  moment(
    date,
    'jYYYY/jMM/jDD',
    true
  )


 if(!m.isValid())
  return ''


 return m
  .startOf('day')
  .toISOString()

}
function buildHotelContractPayload(
 passenger,
 contact
){
 const passengerInfo =
   Array.isArray(passenger)
   ? passenger[0]
   : passenger

 const room =
   selectedRooms.value[0]


 return {

  id:0,


  customerId:4,


  userName:
    contact.phone,


  issueDate:
    new Date()
      .toISOString()
      .substring(0,10),


  issueTime:
 getIssueTime(),



  confirmStatus:"temp",


  contractType:0,


  contractingPartyType:0,


  hotel:true,


  ticket:false,


  tour:false,


  insurance:false,


  visa:false,


  other:false,


  cruise:false,


  travelVehicle:"هتل تک",


  manualOrAutomatic:true,


  systemOrCharter:false,


  showDetail:false,


  taxType:0,


  ipAddress:"0",



  adultNo:1,


  childExtraBedNo:0,


  childNoBedNo:0,


  infantNo:"0",



  passengersNo:1,



  reduceHotelLoad:1,


  reduceFlightLoad:0,



  ticketStatus:"temp-first",



  contractFlights:[],



  contractPassengers:[{


   id:0,


   contractId:0,


   fName:
    passengerInfo.firstName,


   lName:
    passengerInfo.lastName,


   age:"ADL",


   gender:
    passengerInfo.gender === 'male',


   birthDate:
     toIsoBirthDate(passengerInfo.birthDate),


   codeMelli:
 passengerInfo.nationalCode,


   nationality:
  passengerInfo.nationality,


   description:"",


   price:
    getRoomPrice()

  }],



  contractRoutes:
 selectedRooms.value.map(room=>({

  id:0,
  contractId:0,

  checkIn:
    normalizeDate(checkIn.value),

  checkOut:
    normalizeDate(checkOut.value),

  cityId:Number(route.params.id),

  hotelId:String(hotelId.value),

  roomId:room.roomId,

  nights:calculateNights(),

  description:
    `${room.count} اتاق`

 }))

 }

}
async function continueHotelBooking(){

 try{

  continueShoppingLoading.value=true


  const passengerValid =
    passengerFormRef.value?.validateAll()


  if(!passengerValid)
    return


  const contactValid =
    contactFormRef.value?.validateAll()


  if(!contactValid)
    return



  const passengerData =
    passengerFormRef.value.getData()



  const contactData =
    contactFormRef.value.getData()

bookingData.value.passengers = passengerData

bookingData.value.contact = contactData
await hotelStore.refreshSelectedRoomsPricing()
  const payload =
    buildHotelContractPayload(
      passengerData,
      contactData
    )



  console.log('HOTEL CONTRACT PAYLOAD',payload)



 const response=
 await addHotelContract(payload)

currentContractData.value={
 addPayload:payload,
 addResponse:response
}

bookingData.value.contract=response

console.log(
 'HOTEL BOOKING DATA',
 bookingData.value
)

flightStore.setCurrentStep(2)



 }
 catch(error){

  console.error(
    'Hotel Contract Error',
    error
  )

 }
 finally{

  continueShoppingLoading.value=false

 }

}
async function updateHotelContract(payload){

 try{

  return await $fetch(
   'https://api.ahuan.ir/api/Contract/update',
   {
    method:'PUT',
    body:payload,
    headers:{
     'Content-Type':'application/json'
    }
   }
  )

 }
 catch(error){

  console.error(
   'Contract update error:',
   error
  )

  throw new Error(
   'افزودن اطلاعات به دیتابیس موفقیت‌آمیز نبود.'
  )
 }
}
function buildHotelUpdateContractPayload({
 passengers,
 contact
}){

 const addPayload=
  currentContractData.value?.addPayload||{}

 const addResponse=
  currentContractData.value?.addResponse?.data||
  currentContractData.value?.addResponse||
  {}

 const contractId=
  Number(
   addResponse?.id||
   addResponse?.contractId||
   addPayload?.id||
   0
  )

 const savedPassengers=
  Array.isArray(addResponse?.contractPassengers)
   ?addResponse.contractPassengers
   :[]

 const mappedPassengers=
  passengers.map(passenger=>({
   fName:passenger.firstName||'',
   lName:passenger.lastName||'',
   age:passenger.type||'ADL',
   gender:passenger.gender==='male',
   birthDate:toIsoBirthDate(passenger.birthDate),
   codeMelli:passenger.nationalCode||'',
   nationality:passenger.nationality||''
  }))

 const contractPassengers=
  mappedPassengers.map(
   (passenger,index)=>({
    ...savedPassengers[index],
    ...passenger,
    id:Number(savedPassengers[index]?.id||0),
    contractId
   })
  )

 return{
  ...addPayload,
  ...addResponse,
  id:contractId,

  userName:String(
   contact?.phone||
   contact?.mobile||
   ''
  ).trim(),

  email:String(
   contact?.email||''
  ).trim(),

  contractPassengers
 }
}
function extractHotelContractId(
 updateResponse
){

 const contractId=Number(
  updateResponse?.data?.id||
  updateResponse?.data?.contractId||
  updateResponse?.id||
  updateResponse?.contractId||
  0
 )

 if(
  !Number.isInteger(contractId)||
  contractId<=0
 ){
  console.error(
   'Invalid Contract/update response:',
   updateResponse
  )

  throw new Error(
   'شناسه قرارداد از پاسخ Update دریافت نشد'
  )
 }

 return contractId
}
function getUserData(){

 const userCookie=
  useCookie('user_data')

 let userData=
  userCookie.value

 if(typeof userData==='string'){

  try{
   userData=
    JSON.parse(userData)
  }
  catch{
   userData=null
  }
 }

 return userData
}
function createHotelPaymentData(){

 const totalPrice =
  Number(hotelFinalPrice.value || 0)

 if(
  !Number.isFinite(totalPrice) ||
  totalPrice <= 0
 ){
  throw new Error(
   'مبلغ کل قرارداد معتبر نیست'
  )
 }


 const email = String(
  bookingData.value?.contact?.email ||
  ''
 ).trim()


 const mobile = String(
  bookingData.value?.contact?.mobile ||
  bookingData.value?.contact?.phone ||
  ''
 ).trim()


 /* =========================
    اطلاعات کاربر
 ========================= */

 const userData =
  getUserData()


 /* =========================
    Role
 ========================= */

 const roles =
  Array.isArray(userData?.roles)
   ? userData.roles.map(role =>
      String(role || '')
       .trim()
       .toLowerCase()
     )
   : []


 const isAdmin =
  roles.includes('admin')


 const isHotel =
  roles.includes('hotel')


 /* =========================
    اعتبار کاربر
 ========================= */

 const hasNoLimit =
  userData?.noLimit === true


 const userCredit =
  Number(userData?.credit || 0)


 const hasEnoughCredit =
  userData?.hasCredit === true &&
  Number.isFinite(userCredit) &&
  userCredit >= totalPrice


 /* =========================
    پرداخت اعتباری / آژانسی
 ========================= */

 const isAgency =
  isAdmin ||
  isHotel ||
  hasNoLimit ||
  hasEnoughCredit


 console.log(
  'HOTEL PAYMENT ACCESS',
  {
   roles,
   isAdmin,
   isHotel,
   hasNoLimit,
   userCredit,
   totalPrice,
   hasEnoughCredit,
   isAgency
  }
 )


 /* =========================
    سفرکارت
 ========================= */

 const travelCardUsed =
  travelCardApplied.value === true


 const travelCardNumber =
  travelCardUsed
   ? String(
      appliedTravelCardNumber.value ||
      ''
     ).trim()
   : ''


 const availableCredit =
  Math.max(
   Number(
    travelCardCredit.value || 0
   ),
   0
  )


 const travelCardAmount =
  travelCardUsed
   ? Math.min(
      availableCredit,
      totalPrice
     )
   : 0


 const gatewayAmount =
  Math.max(
   totalPrice - travelCardAmount,
   0
  )


 /* =========================
    Agency
 ========================= */

 if(isAgency){

  return{
   type: 'agency',

   totalPrice,

   payableAmount:
    totalPrice,

   travelCardUsed: false,

   travelCardAmount: 0,

   travelCardNumber: '',

   email,

   mobile
  }
 }


 /* =========================
    پرداخت کامل سفرکارت
 ========================= */

 if(
  travelCardUsed &&
  travelCardAmount >= totalPrice
 ){

  return{
   type: 'travelcard',

   totalPrice,

   payableAmount:
    totalPrice,

   travelCardUsed: true,

   travelCardAmount:
    totalPrice,

   travelCardNumber,

   email,

   mobile
  }
 }


 /* =========================
    سفرکارت + بانک
 ========================= */

 if(
  travelCardUsed &&
  travelCardAmount > 0 &&
  gatewayAmount > 0
 ){

  return{
   type: 'travelcard-gateway',

   totalPrice,

   payableAmount:
    gatewayAmount,

   travelCardUsed: true,

   travelCardAmount,

   travelCardNumber,

   email,

   mobile
  }
 }


 /* =========================
    پرداخت بانکی
 ========================= */

 return{
  type: 'gateway',

  totalPrice,

  payableAmount:
   totalPrice,

  travelCardUsed: false,

  travelCardAmount: 0,

  travelCardNumber: '',

  email,

  mobile
 }
}
function saveHotelPaymentSession({
 contractId,
 paymentData
}){

 if(typeof window==='undefined')
  throw new Error(
   'sessionStorage در دسترس نیست'
  )

 const normalizedContractId=
  Number(contractId)

 if(
  !Number.isInteger(normalizedContractId)||
  normalizedContractId<=0
 ){
  throw new Error(
   'شناسه قرارداد معتبر نیست'
  )
 }

 const paymentSession={

  contractId:
   normalizedContractId,

  type:
   paymentData.type,

  totalPrice:
   Number(paymentData.totalPrice),

  payableAmount:
   Number(paymentData.payableAmount),

  travelCardUsed:
   paymentData.travelCardUsed===true,

  travelCardAmount:
   Number(
    paymentData.travelCardAmount||0
   ),

  travelCardNumber:
   String(
    paymentData.travelCardNumber||''
   ).trim(),

  email:
   String(
    paymentData.email||''
   ).trim(),

  mobile:
   String(
    paymentData.mobile||''
   ).trim(),

  providerResults:[],

  bookingType:'hotel',

  hotel:{
   hotelId:hotelId.value,
   checkIn:checkIn.value,
   checkOut:checkOut.value,
   rooms:selectedRooms.value.map(
    room=>({
     roomId:room.roomId,
     roomName:room.roomName,
     count:room.count,
     unitPrice:Number(
      room.unitPrice||0
     ),
     price:Number(
      room.price||0
     )
    })
   )
  }
 }

 sessionStorage.setItem(
  PAYMENT_SESSION_KEY,
  JSON.stringify(paymentSession)
 )

 return paymentSession
}
async function requestBankToken({
 amount,
 contractId
}){

 try{

  const bankAmount=
   Number(amount)

  if(
   !Number.isFinite(bankAmount)||
   bankAmount<=0
  ){
   throw new Error()
  }

  const revertUrl=
   `${window.location.origin}/verify`+
   `?responseData=${encodeURIComponent(contractId)}&`

  const response=
   await $fetch(
    'https://test.ahuan.ir/api/Tejarat/BankToken',
    {
     method:'POST',
     body:{
      amount:bankAmount,
      revertUrl
     }
    }
   )

  const bankToken=
   typeof response==='string'
    ?response
    :response?.data?.tokenIdentity||
     response?.data?.bankToken||
     response?.data?.token||
     response?.tokenIdentity||
     response?.bankToken||
     response?.token||
     response?.data||
     ''

  if(!bankToken)
   throw new Error()

  return String(bankToken)

 }
 catch(error){

  console.error(
   'BankToken error:',
   error
  )

  throw new Error(
   'ارسال به بانک موفقیت‌آمیز نبود.'
  )
 }
}
async function submitShaparakForm(
 bankToken
){

 formshaparak.bankToken=
  bankToken

 await nextTick()

 const form=
  formshaparakRef.value

 if(!form)
  throw new Error(
   'فرم شاپرک پیدا نشد'
  )

 HTMLFormElement.prototype.submit.call(
  form
 )
}
async function continueHotelPayment(
 paymentSession
){

 switch(paymentSession.type){

  case'agency':

   await router.push({
    path:'/verify',
    query:{
     responseData:
      paymentSession.contractId
    }
   })

   return

  case'travelcard':

   await router.push({
    path:'/verify',
    query:{
     responseData:
      paymentSession.contractId
    }
   })

   return

  case'travelcard-gateway':{

   const bankToken=
    await requestBankToken({
     amount:
      paymentSession.payableAmount,

     contractId:
      paymentSession.contractId
    })

   await submitShaparakForm(
    bankToken
   )

   return
  }

  case'gateway':{

   const bankToken=
    await requestBankToken({
     amount:
      paymentSession.payableAmount,

     contractId:
      paymentSession.contractId
    })

   await submitShaparakForm(
    bankToken
   )

   return
  }

  default:
   throw new Error(
    `نوع پرداخت نامعتبر است: ${paymentSession.type}`
   )
 }
}
async function handleFinalPayment(){

 if(paymentLoading.value)
  return

 try{

  paymentLoading.value=true
  paymentError.value=''

  if(!currentContractData.value)
   throw new Error(
    'اطلاعات قرارداد موجود نیست.'
   )

  /*
   * 1. ساخت payload برای update
   */
 const updatePayload=
 buildHotelUpdateContractPayload({
  passengers:
   bookingData.value.passengers,
  contact:
   bookingData.value.contact
 })

  /*
   * 2. Contract/update
   */
  const updateResponse=
   await updateHotelContract(
    updatePayload
   )

  /*
   * 3. contractId
   */
  const contractId=
   extractHotelContractId(
    updateResponse
   )

  /*
   * 4. محاسبه نوع و مبلغ پرداخت
   */
  const paymentData=
   createHotelPaymentData()

  /*
   * 5. ذخیره Session
   */
  const paymentSession=
   saveHotelPaymentSession({
    contractId,
    paymentData
   })

  console.log(
   'HOTEL PAYMENT SESSION',
   paymentSession
  )

  /*
   * 6. ادامه پرداخت
   */
  await continueHotelPayment(
   paymentSession
  )

 }
 catch(error){

  console.error(
   'handleFinalPayment error:',
   error
  )

  paymentError.value=
   error?.data?.message||
   error?.message||
   'خطا در پرداخت هتل'

 }
 finally{

  paymentLoading.value=false
 }
}
function normalizeDate(date){

 if(!date)
  return null

 return new Date(date)
   .toISOString()
   .split('T')[0]

}
async function addHotelContract(payload){
  try{
    return await $fetch(
      'https://api.ahuan.ir/api/Contract/add',
      {
        method:'POST',
        body:payload,
        headers:{
          'Content-Type':'application/json'
        }
      }
    )
  }
  catch(error){
    console.error(
      'Contract add error:',
      error
    )

    throw new Error(
      'اطلاعات به دیتابیس اضافه نشد.'
    )
  }
}
const hotelFinalPrice=computed(()=>{

 return hotelStore.selectedRooms.reduce(
  (sum,room)=>
   sum+Number(room.price||0),
  0
 )

})
const travelCardCredit=ref(0)
const travelCardApplied=ref(false)
const travelCardLoading=ref(false)
const travelCardOwnerName=ref('')
const travelCardError=ref('')
const travelCardData=ref(null)
const appliedTravelCardNumber=ref('')

const priceAfterTravelCard=computed(()=>{

 const original=
  Number(hotelFinalPrice.value||0)

 const credit=
  Number(travelCardCredit.value||0)

 return Math.max(
  original-credit,
  0
 )
})

const handleResetTravelCard=()=>{

 travelCardCredit.value=0
 travelCardApplied.value=false
 travelCardOwnerName.value=''
 travelCardError.value=''
 travelCardData.value=null
 appliedTravelCardNumber.value=''
}

const handleApplyTravelCard=async(cardNumber)=>{

 try{

  travelCardLoading.value=true
  travelCardApplied.value=false
  travelCardCredit.value=0
  travelCardOwnerName.value=''
  travelCardError.value=''
  travelCardData.value=null
  appliedTravelCardNumber.value=''

  const normalizedCardNumber=
   String(cardNumber||'').trim()

  if(!normalizedCardNumber)
   return

  const response=
   await $fetch(
    `https://api.ahuan.ir/api/SafarCard/${encodeURIComponent(normalizedCardNumber)}`
   )

  if(
   response &&
   response.credit!==undefined
  ){

   travelCardData.value=response

   travelCardCredit.value=
    Number(response.credit||0)

   travelCardOwnerName.value=
    `${response.firstName||''} ${response.lastName||''}`.trim()

   appliedTravelCardNumber.value=
    normalizedCardNumber

   travelCardApplied.value=true

   return
  }

  travelCardError.value=
   'اطلاعات کارت معتبر نیست.'

 }
 catch(error){

  travelCardApplied.value=false
  travelCardCredit.value=0
  travelCardOwnerName.value=''
  travelCardData.value=null
  appliedTravelCardNumber.value=''

  if(
   error?.data &&
   typeof error.data==='string'
  ){
   travelCardError.value=error.data
  }
  else if(error?.data?.message){
   travelCardError.value=
    error.data.message
  }
  else{
   travelCardError.value=
    'چنین شماره کارتی یافت نشد.'
  }

  console.error(
   'Travel card API error:',
   error
  )
 }
 finally{

  travelCardLoading.value=false
 }
}
function getRoomPrice(){

 return selectedRooms.value.reduce(
  (sum,item)=>
    sum +
    Number(item.price||0),
  0
 )

}
function calculateNights(){

 const start =
  new Date(checkIn.value)

 const end =
  new Date(checkOut.value)


 return Math.ceil(
   (end-start) /
   (1000*60*60*24)
 )

}
function formatPersianDate(date){

  if(!date)
    return '-'


  return new Intl.DateTimeFormat(
    'fa-IR',
    {
      year:'numeric',
      month:'long',
      day:'numeric'
    }
  ).format(
    new Date(date)
  )

}
const checkOut=computed(()=>
  String(route.query.checkOut||'').trim()
)

// =========================
// Stepper
// =========================
const flightSteps=computed(()=>[
  {icon:'✈️',label:'انتخاب اتاق'},
  {icon:'📄',label:'تکمیل اطلاعات'},
  {icon:'💳',label:'تایید و پرداخت'},
  {icon:'🎫',label:'دریافت واچر'}
])

// =========================
// Hotel Gallery
// =========================
const sortedHotelImages=computed(()=>
  [...hotelImages.value]
    .filter(item=>item?.image)
    .sort(
      (a,b)=>
        Number(a?.orderId??999)-
        Number(b?.orderId??999)
    )
)

const galleryImages=computed(()=>
  sortedHotelImages.value
)

const remainingImagesCount=computed(()=>
 Math.max(
  sortedHotelImages.value.length-5,
  0
 )
)

// =========================
// Image URL
// =========================
function getHotelImageUrl(image){
  if(!image)return''
  return`${HOTEL_IMAGE_BASE}/${image}`
}

// =========================
// Facility
// =========================
function getFacilityTitle(facility){
  if(typeof facility==='string')return facility

  return String(
    facility?.name||
    facility?.title||
    facility?.facilityName||
    facility?.description||
    ''
  ).trim()
}
function openHotelGallery(index=0){

  hotelGalleryIndex.value=index
  hotelGalleryModalOpen.value=true

}


function closeHotelGallery(){

  hotelGalleryModalOpen.value=false

}


function nextHotelGallery(){

  if(!sortedHotelImages.value.length)
    return

  hotelGalleryIndex.value=
    (hotelGalleryIndex.value+1)
    %
    sortedHotelImages.value.length

}
function reserveRoom(data){

 const room=data?.room
 const count=Number(data?.count||1)

 // اتاق‌های fallback صرفاً جهت معرفی هستند و نباید رزرو شوند.
 if(
  !room||
  room.forShow===true||
  Number(room.calculatedPrice||0)<=0
 ){
  return
 }

 hotelStore.addRoom({
  key:`${room.id||room.roomId}-${Date.now()}`,
  roomId:room.id||room.roomId,
  roomName:room.type||room.name||'اتاق',
  count,
  unitPrice:Number(room.calculatedPrice||0),
  price:Number(room.calculatedPrice||0)*count
 })

 window.scrollTo({
  top:0,
  behavior:'smooth'
 })
}
function removeSelectedRoom(room){

hotelStore.removeRoom(room.key)

}
async  function continueBooking(){
   if(!hotelStore.selectedRooms.length){

  flightStore.setCurrentStep(0)

  return
 }
// await hotelStore.refreshSelectedRoomsPricing()
 flightStore.setCurrentStep(1)

 // مرحله بعد رزرو
 // router.push('/hotels/booking')

}
function prevHotelGallery(){

  if(!sortedHotelImages.value.length)
    return

  hotelGalleryIndex.value=
    (hotelGalleryIndex.value-1+
    sortedHotelImages.value.length)
    %
    sortedHotelImages.value.length

}
function getFacilityKey(facility){
  if(typeof facility==='string')return facility

  return(
    facility?.id||
    facility?.facilityId||
    getFacilityTitle(facility)
  )
}

// =========================
// Room Slider / Modal
// =========================
function getRoomSlideIndex(room){
  return Number(
    roomSlideIndexes.value[room.id]||0
  )
}

function setRoomSlide(room,index){
  const images=room?.hotelRoomImages||[]
  if(!images.length)return

  let newIndex=index

  if(newIndex<0){
    newIndex=images.length-1
  }

  if(newIndex>=images.length){
    newIndex=0
  }

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

function openRoomModal(room){
  selectedRoom.value=room
  roomModalOpen.value=true
}

function closeRoomModal(){
  roomModalOpen.value=false
  selectedRoom.value=null
}

// =========================
// Hotel Images + Facilities
// =========================
async function loadHotelExtras(){
  if(!hotelId.value)return

  try{
    const[
      imagesResponse,
      facilitiesResponse
    ]=await Promise.all([
      $fetch(
        `${BASE_URL}/Hotel/images/${hotelId.value}`
      ),
      $fetch(
        `${BASE_URL}/Hotel/facility/${hotelId.value}`
      )
    ])

    hotelImages.value=
      Array.isArray(imagesResponse)
        ?imagesResponse
        :Array.isArray(imagesResponse?.data)
          ?imagesResponse.data
          :Array.isArray(imagesResponse?.result)
            ?imagesResponse.result
            :[]

    hotelFacilities.value=
      Array.isArray(facilitiesResponse)
        ?facilitiesResponse
        :Array.isArray(facilitiesResponse?.data)
          ?facilitiesResponse.data
          :Array.isArray(facilitiesResponse?.result)
            ?facilitiesResponse.result
            :[]

    console.log(
      'Hotel Images:',
      hotelImages.value
    )

    console.log(
      'Hotel Facilities:',
      hotelFacilities.value
    )
  }catch(error){
    console.error(
      'Hotel extras error:',
      error
    )

    hotelImages.value=[]
    hotelFacilities.value=[]
  }
}

// =========================
// Hotel + Availability + Rooms
// =========================

function normalizeRoomApiResponse(response){
 if(Array.isArray(response))
  return response

 if(Array.isArray(response?.data))
  return response.data

 if(Array.isArray(response?.result))
  return response.result

 return []
}

function isPublicFallbackRoom(room){
 if(!room)
  return false

 const name=String(room?.name||'').trim()
 const type=String(room?.type||'').trim()
 const text=`${name} ${type}`

 // در خروجی فعلی رکورد تست غیرقابل فروش وجود دارد.
 // این رکورد نباید در سایت به کاربر نمایش داده شود.
 if(
  text.includes('تست')||
  text.includes('غیرقابل فروش')||
  type==='ندارد'
 )
  return false

 return true
}

async function loadAllHotelRooms(){

 if(!hotelId.value)
  return false

 try{

  const response=
   await $fetch(
    `${BASE_URL}/Hotel/rooms/${hotelId.value}`
   )

  // تمام اتاق‌هایی که API برمی‌گرداند نمایش داده می‌شوند
  // حتی رکوردهایی مثل «تست غیرقابل فروش»
  const rooms=
   normalizeRoomApiResponse(response)

  roomsFallbackMode.value=true

  hotelRooms.value=
   rooms.map(room=>({
    ...room,

    forShow:true,
    displayOnly:true,

    calculatedPrice:0,
    availableCount:0,

    hotelRoomImages:
     Array.isArray(room?.hotelRoomImages)
      ?room.hotelRoomImages
      :[]
   }))

  console.log(
   'Hotel Rooms Fallback:',
   hotelRooms.value
  )

  console.log(
   'Fallback Room IDs:',
   hotelRooms.value.map(room=>({
    id:room.id,
    name:room.name,
    type:room.type
   }))
  )

  return hotelRooms.value.length>0

 }
 catch(error){

  console.error(
   'Hotel rooms fallback error:',
   error
  )

  hotelRooms.value=[]

  return false
 }

}
function hasSellableAvailabilityRoom(rooms){
 if(!Array.isArray(rooms)||!rooms.length)
  return false

 return rooms.some(room=>{
  const price=getRoomTotalPrice(room)
  const available=getRoomAvailableCount(room)

  return price>0&&available>0
 })
}

async function loadHotelAvailability(){
 if(!hotelId.value){
  errorMessage.value='شناسه هتل معتبر نیست.'
  return
 }

 if(!checkIn.value||!checkOut.value){
  hotelAvailability.value=null
  hotelRooms.value=[]
  roomsFallbackMode.value=false
  roomsError.value=''
  roomsLoading.value=false
  return
 }

 loading.value=true
 roomsLoading.value=true
 errorMessage.value=''
 roomsError.value=''
 hotelRooms.value=[]
 roomsFallbackMode.value=false

 try{
  const response=await $fetch(
   `${BASE_URL}/Hotel/hotel-availability`,
   {
    params:{
     HotelId:hotelId.value,
     CheckIn:checkIn.value,
     CheckOut:checkOut.value
    }
   }
  )

  hotelAvailability.value=response||null

  if(response)
   hotel.value=response

  const availabilityRooms=
   Array.isArray(response?.hotelRooms)
    ?response.hotelRooms
    :[]

  hotelRooms.value=availabilityRooms

  console.log(
   'Hotel Availability:',
   hotelAvailability.value
  )

  console.log(
   'Hotel Availability Rooms:',
   availabilityRooms
  )

  // ابتدا اتاق‌های availability بررسی می‌شوند.
  // فقط اگر هیچ اتاق دارای قیمت و ظرفیت نبود، /Hotel/rooms/{id} صدا زده می‌شود.
  if(!hasSellableAvailabilityRoom(availabilityRooms)){
   const fallbackLoaded=
    await loadAllHotelRooms()

   if(fallbackLoaded){
    roomsError.value=''
   }
   else{
    roomsError.value=
     'در تاریخ انتخابی اتاق قابل رزرو یافت نشد.'
   }
  }
 }
 catch(error){
  console.error(
   'Hotel Availability Error:',
   error
  )

  hotelAvailability.value=null
  hotelRooms.value=[]
  errorMessage.value=''

  // حتی اگر availability خطا بدهد، اطلاعات عمومی اتاق‌ها
  // را فقط برای نمایش امتحان می‌کنیم.
  const fallbackLoaded=
   await loadAllHotelRooms()

  if(fallbackLoaded){
   roomsError.value=''
  }
  else{
   roomsError.value=
    'دریافت اطلاعات اتاق‌ها با خطا مواجه شد.'
  }
 }
 finally{
  loading.value=false
  roomsLoading.value=false
 }
}

// =========================
// Init / Route Changes
// =========================
watch(
  hotelId,
  ()=>{
    loadHotelExtras()
  },
  {immediate:true}
)
watch(
 () => hotelStore.selectedRooms.length,
 (roomsCount) => {

  if(
   roomsCount === 0 &&
   flightStore.currentStep > 0
  ){
   flightStore.setCurrentStep(0)

   nextTick(()=>{
    window.scrollTo({
     top:0,
     behavior:'smooth'
    })
   })
  }

 }
)
watch(
 [hotelId,checkIn,checkOut],
 ()=>{
  if(
   !hotelId.value||
   !checkIn.value||
   !checkOut.value
  ){
   hotelAvailability.value=null
   hotelRooms.value=[]
   roomsFallbackMode.value=false
   roomsError.value=''
   roomsLoading.value=false
   return
  }

  loadHotelAvailability()
 },
 {immediate:true}
)
function getRoomPriceDetails(room){

 const price=
  room?.hotelRoomPrices?.[0]

 if(!price)
  return []

 const details=
  Array.isArray(price.hotelRoomPriceDetails)
   ?price.hotelRoomPriceDetails
   :[]

 const normalizeDate=value=>
  String(value||'')
   .slice(0,10)
   .replaceAll('/','-')

 const start=
  normalizeDate(checkIn.value)

 const end=
  normalizeDate(checkOut.value)

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


function getRoomRule(room){

 if(room?.rule)
  return String(room.rule).padStart(3,'0')

 const capacity=
  Math.max(
   1,
   Number(room?.capacity||1)
  )

 return `${capacity}00`
}

function getRoomTotalPrice(room){

 const details=
  getRoomPriceDetails(room)

 if(!details.length)
  return 0

 const capacity=
  Math.max(
   1,
   Number(room?.capacity||1)
  )

 let roomPrice=0

 for(const detail of details){

  const dbl=
   Number(detail?.dbl||0)

  const extBed=
   Number(detail?.extBed||0)

  if(!dbl)
   continue

  if(room.isStandard===true){

   const rule=
    getRoomRule(room)

   const adultNumber=
    Number(rule.substring(0,1)||0)

   const childNumber=
    Number(rule.substring(1,2)||0)

   const child2Number=
    Number(rule.substring(2,3)||0)

   const infantNumber=
    Number(route.query.inf||0)

   const adultPrice=
    adultNumber%2===0
     ?adultNumber*dbl
     :adultNumber*Number(detail.sgl||dbl)

   roomPrice+=
    adultPrice+
    childNumber*extBed+
    child2Number*Number(detail.noBed||0)+
    infantNumber*Number(detail.inf||0)

   continue
  }

  for(let i=0;i<capacity;i++){

   const isOdd=
    capacity%2

   if(
    isOdd &&
    i===capacity-1
   ){
    roomPrice+=extBed
   }
   else{
    roomPrice+=dbl
   }
  }
 }

 return roomPrice
}

const roomsWithPrice=computed(()=>{

 return hotelRooms.value.map(room=>{

  if(
   roomsFallbackMode.value||
   room?.forShow===true||
   room?.displayOnly===true
  ){
   return{
    ...room,
    forShow:true,
    displayOnly:true,
    calculatedPrice:0,
    availableCount:0,
    nightCount:Math.max(
     0,
     calculateNights()
    )
   }
  }

  const details=
   getRoomPriceDetails(room)

  const price=
   getRoomTotalPrice(room)

  const availableCount=
   getRoomAvailableCount(room)

  console.log(
   'ROOM DEBUG',
   {
    id:room.id,
    type:room.type,
    checkIn:checkIn.value,
    checkOut:checkOut.value,
    detailsCount:details.length,
    details:details.map(x=>({
     date:x.date,
     dbl:x.dbl,
     loadNo:x.loadNo,
     bookNo:x.bookNo
    })),
    price,
    availableCount
   }
  )

  return{
   ...room,
   forShow:false,
   displayOnly:false,
   calculatedPrice:price,
   availableCount,
   nightCount:Math.max(
    0,
    calculateNights()
   )
  }
 })
})

function getRoomNightCount(room){
  return getRoomPriceDetails(room)
    .length
}

function formatPrice(value){
  return Number(value||0)
    .toLocaleString('fa-IR')
}
function getRoomAvailableCount(room){

  const details=
    getRoomPriceDetails(room)


  if(details.length){

    return Math.max(
      0,
      Math.min(
        ...details.map(item=>
          Math.max(
            0,
            Number(item?.loadNo||0)-
            Number(item?.bookNo||0)
          )
        )
      )
    )

  }


  const price=
    room?.hotelRoomPrices?.[0]


  if(price){

    return Math.max(
      0,
      Number(price.loadNo||0)-
      Number(price.bookNo||0)
    )

  }


  return 0
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


  if(current>1){

    selectedRoomCounts.value={
      ...selectedRoomCounts.value,
      [room.id]:current-1
    }

  }

}
</script>


<style>
</style>