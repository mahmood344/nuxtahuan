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
          dir="rtl"
        >
          <div class="top-24 space-y-4">

            <div
              class="rounded-3xl bg-white border border-gray-100 shadow-sm p-5"
            >
              <!-- سرچ هتل بعداً اینجا -->
              <p
                class="text-[13px] font-bold text-gray-700"
              >
                جستجوی هتل
              </p>
            </div>

          </div>
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
            v-else-if="hotel"
            class="space-y-7"
            dir="rtl"
          >

            <!-- ========================= -->
            <!-- Gallery -->
            <!-- ========================= -->
            <section
              v-if="galleryImages.length"
              class="flex w-full gap-2"
            >
              <!-- تصویر بزرگ -->
              <div
                class="w-1/2 h-[400px] overflow-hidden rounded-2xl"
              >
                <img
                  :src="getHotelImageUrl(galleryImages[0]?.image)"
                  :alt="hotel?.name||''"
                  class="block w-full h-full object-cover"
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
                >
                  <img
                    :src="getHotelImageUrl(image.image)"
                    :alt="image.description||hotel?.name||''"
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
            </section>


            <!-- ========================= -->
            <!-- Hotel Info -->
            <!-- ========================= -->
            <section
              class="bg-white rounded-2xl p-4 md:p-6"
            >
              <h1
                class="text-[20px] md:text-[22px] font-black text-gray-900"
              >
                هتل {{hotel.name}}
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
                    v-for="star in Number(hotel.star||0)"
                    :key="star"
                    class="bi bi-star-fill"
                  ></i>
                </div>

                <span
                  class="text-[12px] text-gray-500"
                >
                  {{hotel.star||0}}
                  ستاره
                </span>

                <span
                  v-if="hotel.score"
                  class="text-[12px] text-gray-500"
                >
                  امتیاز
                  {{hotel.score}}
                </span>
              </div>


              <!-- Description -->
              <p
                v-if="hotel.description"
                class="mt-5 text-[12px] leading-8 text-gray-600 text-justify"
              >
                {{hotel.description}}
              </p>


              <!-- Extra info -->
              <div
                class="mt-5 flex flex-wrap gap-5 text-[11px] text-gray-500"
              >
                <span
                  v-if="hotel.checkInTime"
                  class="flex items-center gap-2"
                >
                  <i class="bi bi-clock"></i>

                  ساعت ورود:
                  {{hotel.checkInTime}}
                </span>

                <span
                  v-if="hotel.checkOutTime"
                  class="flex items-center gap-2"
                >
                  <i
                    class="bi bi-clock-history"
                  ></i>

                  ساعت خروج:
                  {{hotel.checkOutTime}}
                </span>

                <span
                  v-if="hotel.address"
                  class="flex items-center gap-2"
                >
                  <i class="bi bi-geo-alt"></i>

                  {{hotel.address}}
                </span>
              </div>
            </section>


            <!-- ========================= -->
            <!-- Facilities -->
            <!-- ========================= -->
            <section
              v-if="hotelFacilities.length"
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
                  :key="facility"
                  class="flex items-center gap-2 text-[12px] text-gray-600"
                >
                  <span
                    class="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 text-[var(--color-primary)]"
                  >
                    <i class="bi bi-check2"></i>
                  </span>

                  <span>
                    {{facility}}
                  </span>
                </div>
              </div>
            </section>


     

<!-- ========================= -->
<!-- Rooms -->
<!-- ========================= -->
<section
  class="rounded-[24px] bg-[#f7f8fd] px-5 py-7 md:px-8 md:py-10"
  dir="rtl"
>
  <div>
    <h2 class="text-[18px] font-black text-gray-900">
      اتاق‌های هتل {{hotel.name}}
    </h2>

    <p class="mt-2 text-[11px] text-gray-400">
      اطلاعات اتاق‌های این مجموعه
    </p>
  </div>

  <h3 class="mt-8 mb-5 text-[17px] font-black text-gray-900">
    اتاق‌ها
  </h3>

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
              v-if="Number(room.extraBed||0)>0"
              class="rounded bg-[#f1f2f7] px-2 py-1 text-[10px]"
            >
              {{room.extraBed}} تخت اضافه
            </span>

            <span
              v-if="Number(room.noBed||0)>0"
              class="rounded bg-[#f1f2f7] px-2 py-1 text-[10px]"
            >
              {{room.noBed}} نفر بدون تخت
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

            <span v-if="room.sofaBedCount">
              {{room.sofaBedCount}} کاناپه
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
    <div
      class="border-t border-gray-200 px-5 py-5 md:px-6"
    >
      <div
        class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
      >
        <!-- تعداد اتاق -->
        <div class="flex items-center gap-4">
          <span
            class="text-[11px] font-bold text-gray-700"
          >
            تعداد اتاق
          </span>

          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-[#5865ff] text-[22px] text-[#5865ff]"
          >
            +
          </button>

          <span
            class="min-w-[15px] text-center text-[13px]"
          >
            ۱
          </span>

          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-400 text-[20px] text-gray-500"
          >
            −
          </button>
        </div>

        <!-- سمت قیمت -->
        <div
          class="flex flex-wrap items-center gap-3"
        >
          <span
            v-if="room.onRequest"
            class="text-[11px] font-bold text-orange-500"
          >
            نیازمند تأیید هتل
          </span>

          <button
            type="button"
            class="rounded-lg bg-red-500 px-5 py-3 text-[11px] font-bold text-white"
            @click="openRoomModal(room)"
          >
            مشاهده جزئیات
          </button>
        </div>
      </div>
    </div>
  </article>
</div>
</section>
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
</template>


<script setup>
import{
  ref,
  computed,
  onMounted
}from'vue'

import{useRoute}from'vue-router'
import{useFlightStore}from'~/stores/flights'
const selectedRoom=ref(null)
const roomModalOpen=ref(false)
const roomSlideIndexes=ref({})

function getRoomSlideIndex(room){
  return Number(
    roomSlideIndexes.value[room.id]||0
  )
}

function setRoomSlide(room,index){
  const images=
    room.hotelRoomImages||[]

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
const route=useRoute()
const flightStore=useFlightStore()

const BASE_URL=
  'https://api.ahuan.ir/api'

const HOTEL_IMAGE_BASE=
  'https://panel.ahuan.ir/uploads'


// =========================
// Hotel
// =========================
const hotel=ref(null)
const hotelImages=ref([])
const hotelFacilities=ref([])

const loading=ref(false)
const errorMessage=ref('')


// =========================
// Rooms
// =========================
const hotelRooms=ref([])
const roomsLoading=ref(false)
const roomsError=ref('')


// =========================
// Availability
// جدا از hotelRooms نگهداری می‌شود
// =========================
const hotelAvailability=ref(null)
const availabilityRooms=ref([])


// =========================
// Route
// =========================
const hotelId=computed(()=>{
  return Number(
    route.params.id||0
  )
})

const checkIn=computed(()=>{
  return String(
    route.query.checkIn||''
  )
})

const checkOut=computed(()=>{
  return String(
    route.query.checkOut||''
  )
})


// =========================
// Stepper
// =========================
const flightSteps=computed(()=>[
  {
    icon:'✈️',
    label:'انتخاب اتاق'
  },
  {
    icon:'📄',
    label:'تکمیل اطلاعات'
  },
  {
    icon:'💳',
    label:'تایید و پرداخت'
  },
  {
    icon:'🎫',
    label:'دریافت واچر'
  }
])


// =========================
// Hotel Gallery
// =========================
const sortedHotelImages=computed(()=>{
  return[
    ...hotelImages.value
  ]
    .filter(
      item=>item?.image
    )
    .sort(
      (a,b)=>
        Number(
          a?.orderId??999
        )-
        Number(
          b?.orderId??999
        )
    )
})

const galleryImages=computed(()=>{
  return sortedHotelImages.value
    .slice(0,5)
})

const remainingImagesCount=computed(()=>{
  return Math.max(
    sortedHotelImages.value.length-5,
    0
  )
})


// =========================
// Image URL
// =========================
function getHotelImageUrl(image){
  if(!image)return ''

  return(
    `${HOTEL_IMAGE_BASE}/${image}`
  )
}


// =========================
// Load Hotel
// =========================
async function loadHotel(){
  if(!hotelId.value){
    errorMessage.value=
      'شناسه هتل معتبر نیست.'

    return
  }

  loading.value=true
  errorMessage.value=''

  try{
    const[
      hotelResponse,
      imagesResponse,
      facilitiesResponse
    ]=await Promise.all([
      $fetch(
        `${BASE_URL}/Hotel/${hotelId.value}`
      ),

      $fetch(
        `${BASE_URL}/Hotel/images/${hotelId.value}`
      ),

      $fetch(
        `${BASE_URL}/Hotel/facility/${hotelId.value}`
      )
    ])

    hotel.value=
      hotelResponse||null


    const images=
      Array.isArray(imagesResponse)
        ?imagesResponse
        :Array.isArray(
            imagesResponse?.data
          )
          ?imagesResponse.data
          :Array.isArray(
              imagesResponse?.result
            )
            ?imagesResponse.result
            :[]

    hotelImages.value=images


    hotelFacilities.value=
      Array.isArray(
        facilitiesResponse
      )
        ?facilitiesResponse
        :[]


    console.log(
      'Hotel:',
      hotel.value
    )

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
      'Hotel detail error:',
      error
    )

    errorMessage.value=
      'دریافت اطلاعات هتل با خطا مواجه شد.'
  }finally{
    loading.value=false
  }
}


// =========================
// Load Rooms
// =========================
async function loadHotelRooms(){
  if(!hotelId.value)return

  roomsLoading.value=true
  roomsError.value=''

  try{
    const response=await $fetch(
      `${BASE_URL}/Hotel/rooms/${hotelId.value}`
    )

    hotelRooms.value=
      Array.isArray(response)
        ?response
        :[]


    console.log(
      'Hotel Rooms:',
      hotelRooms.value
    )
  }catch(error){
    console.error(
      'Hotel Rooms Error:',
      error
    )

    hotelRooms.value=[]

    roomsError.value=
      'دریافت اطلاعات اتاق‌ها با خطا مواجه شد.'
  }finally{
    roomsLoading.value=false
  }
}


// =========================
// Load Availability
// =========================
async function loadHotelAvailability(){
  if(
    !hotelId.value||
    !checkIn.value||
    !checkOut.value
  ){
    return
  }

  try{
    const response=await $fetch(
      `${BASE_URL}/Hotel/hotel-availability`,
      {
        params:{
          HotelId:
            hotelId.value,

          CheckIn:
            checkIn.value,

          CheckOut:
            checkOut.value
        }
      }
    )

    hotelAvailability.value=
      response||null

    availabilityRooms.value=
      Array.isArray(
        response?.hotelRooms
      )
        ?response.hotelRooms
        :[]


    console.log(
      'Hotel Availability:',
      hotelAvailability.value
    )

    console.log(
      'Availability Rooms:',
      availabilityRooms.value
    )
  }catch(error){
    console.error(
      'Hotel Availability Error:',
      error
    )

    hotelAvailability.value=null
    availabilityRooms.value=[]
  }
}


// =========================
// Init
// =========================
onMounted(async()=>{
  await Promise.all([
    loadHotel(),
    loadHotelRooms(),
    loadHotelAvailability()
  ])
})
</script>


<style>
</style>