<template>
  <div
    class="
      min-h-screen
      bg-gray-100
      pb-24
      md:bg-white
      md:pb-10
      mt-[60px]
    "
    dir="ltr"
  >

    <!--
    |--------------------------------------------------------------------------
    | Header / Stepper
    |--------------------------------------------------------------------------
    -->

    <header
      class="
        hidden
        md:block
        relative
        h-[97px]
        w-full
        bg-secondary
        -mt-10
      "
    >
      <div
        class="absolute inset-0"
        style="background-image: url('/imgs/flight/header.png');"
      ></div>

      <div
        class="
          absolute
          -bottom-15
          left-0
          right-0
          z-10
          mx-auto
          max-w-3xl
          px-4
        "
      >
        <Stepper
          :steps="hotelSteps"
          :active-step="flightStore.currentStep"
          active-color="#1a237e"
        />
      </div>
    </header>


    <!--
    |--------------------------------------------------------------------------
    | Main
    |--------------------------------------------------------------------------
    -->

    <main
      class="
        mx-auto
        mt-0
        md:mt-[100px]
        max-w-7xl
        px-0
        md:px-4
      "
    >
      <div
        class="
          grid
          grid-cols-1
          gap-8
          lg:grid-cols-12
        "
      >

        <!--
        |--------------------------------------------------------------------------
        | Sidebar
        |--------------------------------------------------------------------------
        -->

        <aside
          class="
            hidden
            lg:block
            lg:col-span-3
            order-1
            lg:order-2
          "
        >
          <div class="top-24 space-y-4 mt-7 ">

            <FlightSearchPanel
              @hotel-search="handleHotelSearch"
            />
<FilterHotelSnap
 v-if="
  flightStore.currentStep===0 &&
  hotels.length
 "
 v-model:filters="activeHotelFilters"
 :hotels="hotels"
/>
          </div>
        </aside>


        <!--
        |--------------------------------------------------------------------------
        | Content
        |--------------------------------------------------------------------------
        -->

        <div
          class="
            lg:col-span-9
            order-2
            lg:order-1
            relative
          "
        >

          <!--
          |--------------------------------------------------------------------------
          | Full Loading
          |--------------------------------------------------------------------------
          -->

          <transition name="fade">
            <div
              v-if="hotelStore.loading"
              class="
                fixed
                inset-0
                z-[999]
                flex
                items-center
                justify-center
                bg-slate-900/10
                backdrop-blur-[3px]
                transition-all
                duration-300
              "
            >
              <div
                class="
                  bg-white/95
                  p-8
                  rounded-3xl
                  shadow-2xl
                  border
                  border-gray-100
                  flex
                  flex-col
                  items-center
                  text-center
                  max-w-sm
                  mx-4
                "
              >
                <div
                  class="
                    animate-spin
                    rounded-full
                    h-14
                    w-14
                    border-4
                    border-blue-200
                    bg-primary
                    mb-4
                  "
                ></div>

                <h4
                  class="
                    font-bold
                    text-gray-800
                    text-base
                  "
                >
                  در حال جستجوی هتل‌ها...
                </h4>

                <p
                  class="
                    text-xs
                    text-gray-500
                    mt-2
                    leading-relaxed
                  "
                >
                  نتایج در حال دریافت هستند.
                </p>

                <div
                  v-if="hotels.length"
                  class="
                    mt-4
                    bg-blue-50
                    text-blue-700
                    text-xs
                    px-4
                    py-2
                    rounded-full
                    font-bold
                  "
                >
                  تاکنون
                  {{ hotels.length }}
                  هتل پیدا شده است
                </div>
              </div>
            </div>
          </transition>


          <!--
          |--------------------------------------------------------------------------
          | Background Loading
          |--------------------------------------------------------------------------
          -->

          <transition name="fade">
            <div
              v-if="
                hotelStore.backgroundLoading &&
                !hotelStore.loading
              "
              class="
                sticky
                top-3
                z-40
                mb-4
              "
            >
              <div
                class="
                  bg-blue-50
                  border
                  border-blue-200
                  text-blue-700
                  text-xs
                  md:text-sm
                  px-4
                  py-3
                  rounded-2xl
                  shadow-sm
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <div
                  v-for="n in 3"
                  :key="n"
                  class="
                    w-2.5
                    h-2.5
                    rounded-full
                    bg-primary
                    animate-pulse
                  "
                ></div>

                <span class="font-bold">
                  جستجو هنوز در حال انجام است
                </span>
              </div>
            </div>
          </transition>


          <!--
          |--------------------------------------------------------------------------
          | Mobile Search Button
          |--------------------------------------------------------------------------
          -->

          <div
            v-if="flightStore.currentStep === 0"
            class="
              lg:hidden
              mt-4
              mb-4
              px-2
            "
            dir="rtl"
          >
            <UiBaseButton
              label="تغییر جستجو"
              variant="soft"
              color="primary"
              icon="🔎"
              class="
                inline-flex
                items-center
                !rounded-full
                bg-white
                px-5
                py-4
                text-[12px]
                font-bold
                text-gray-600
                border
                border-gray-100
                shadow-xl
              "
              @click="isSearchModalOpen = true"
            />
          </div>


          <!--
          |--------------------------------------------------------------------------
          | STEP 0
          | Hotel List
          |--------------------------------------------------------------------------
          -->

          <template
            v-if="flightStore.currentStep === 0"
          >

            <!-- Result Count -->

            <div
              v-if="searchStarted"
              class="
                mb-4
                text-center
                text-xs
                text-gray-400
                font-medium
                px-2
              "
              dir="rtl"
            >
              <span v-if="hotelStore.loading">
                در حال جستجوی هتل‌ها...
              </span>

              <span v-else>
                تعداد
                {{ filteredHotels.length }}
                هتل یافت شد
              </span>
            </div>


            <!-- Hotel Cards -->

            <div
              v-if="
                searchStarted &&
                filteredHotels.length > 0
              "
              class="
                space-y-4
                px-2
                md:px-0
              "
            >
              <TransitionGroup
                name="list"
                tag="div"
                class="space-y-4"
              >
               <HotelCard
 v-for="hotel in filteredHotels"
 :key="hotel.key"
 :hotel="hotel"
 :check-in="searchParams.checkIn"
 :check-out="searchParams.checkOut"
 @select="handleHotelSelect"
/>
              </TransitionGroup>
            </div>


            <!-- Empty -->

            <div
              v-else-if="
                searchStarted &&
                hotelStore.searchFinished &&
                !hotelStore.loading
              "
              class="
                text-center
                py-20
                text-gray-500
                border-2
                border-dashed
                border-gray-100
                rounded-[2rem]
                bg-white
                shadow-sm
                mx-2
                md:mx-0
              "
              dir="rtl"
            >
              <i
                class="
                  bi
                  bi-building-x
                  text-[42px]
                  text-gray-300
                "
              ></i>

              <p
                class="
                  mt-4
                  font-bold
                  text-gray-700
                "
              >
                هتلی در تاریخ انتخاب‌شده یافت نشد.
              </p>

              <p
                class="
                  text-xs
                  text-gray-400
                  mt-2
                "
              >
                لطفاً تاریخ یا شهر دیگری را امتحان کنید.
              </p>
            </div>

          </template>


          <!--
          |--------------------------------------------------------------------------
          | STEP 1
          | Room List
          |--------------------------------------------------------------------------
          -->

          <template
            v-else-if="
              flightStore.currentStep === 1
            "
          >
            <div
              v-if="selectedHotel"
              class="
                space-y-4
                px-2
                md:px-0
              "
              dir="rtl"
            >

              <!-- Selected Hotel -->

              <div
                class="
                  overflow-hidden
                  rounded-3xl
                  border
                  border-gray-100
                  bg-white
                  shadow-sm
                "
              >
                <div
                  class="
                    flex
                    flex-col
                    md:flex-row
                  "
                >

                  <div
                    class="
                      h-[160px]
                      w-full
                      shrink-0
                      bg-gray-100
                      md:w-[220px]
                    "
                  >
                    <img
                      v-if="selectedHotel.image"
                      :src="selectedHotel.image"
                      :alt="selectedHotel.hotelName"
                      class="
                        h-full
                        w-full
                        object-cover
                      "
                    >
                  </div>


                  <div
                    class="
                      flex
                      flex-1
                      items-center
                      justify-between
                      gap-4
                      p-5
                    "
                  >
                    <div>
                      <div
                        class="
                          text-[10px]
                          text-gray-400
                        "
                      >
                        هتل انتخاب‌شده
                      </div>

                      <h2
                        class="
                          mt-1
                          text-[18px]
                          font-black
                          text-gray-800
                        "
                      >
                        {{ selectedHotel.hotelName }}
                      </h2>

                      <div
                        class="
                          mt-2
                          flex
                          items-center
                          gap-3
                        "
                      >
                        <span
                          v-if="selectedHotel.accommodationTitle"
                          class="
                            text-[11px]
                            text-gray-500
                          "
                        >
                          {{ selectedHotel.accommodationTitle }}
                        </span>

                        <span
                          v-if="selectedHotel.hotelStar"
                          class="
                            text-[11px]
                            text-amber-400
                          "
                        >
                          <span
                            v-for="star in selectedHotel.hotelStar"
                            :key="star"
                          >
                            ★
                          </span>
                        </span>
                      </div>

                      <div
                        v-if="selectedHotel.hotelAddress"
                        class="
                          mt-2
                          text-[11px]
                          text-gray-500
                        "
                      >
                        {{ selectedHotel.hotelAddress }}
                      </div>
                    </div>


                    <UiBaseButton
                      label="تغییر هتل"
                      variant="outline"
                      color="primary"
                      :active="false"
                      class="
                        !rounded-3xl
                        !px-6
                        h-10
                        text-[11px]
                      "
                      @click="backToHotels"
                    />

                  </div>

                </div>
              </div>


              <!-- Count -->

              <div
                class="
                  text-center
                  text-xs
                  text-gray-400
                "
              >
                تعداد
                {{ selectedHotel.rooms.length }}
                اتاق یافت شد
              </div>


              <!-- Room Cards -->

              <div class="space-y-4">

                <div
                  v-for="room in selectedHotel.rooms"
                  :key="room.id"
                  class="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-gray-100
                    bg-white
                    shadow-sm
                  "
                >
                  <div
                    class="
                      flex
                      flex-col
                      md:flex-row
                    "
                  >

                    <!-- Image -->

                    <div
                      class="
                        h-[190px]
                        w-full
                        shrink-0
                        bg-gray-100
                        md:w-[250px]
                      "
                    >
                      <img
                        v-if="getRoomImage(room)"
                        :src="getRoomImage(room)"
                        :alt="
                          room.roomName ||
                          room.name
                        "
                        class="
                          h-full
                          w-full
                          object-cover
                        "
                      >

                      <div
                        v-else
                        class="
                          flex
                          h-full
                          w-full
                          items-center
                          justify-center
                          text-gray-300
                        "
                      >
                        <i
                          class="
                            bi
                            bi-image
                            text-[40px]
                          "
                        ></i>
                      </div>
                    </div>


                    <!-- Info -->

                    <div
                      class="
                        flex
                        min-h-[190px]
                        flex-1
                        flex-col
                        p-5
                      "
                    >
                      <div>

                        <h3
                          class="
                            text-[16px]
                            font-black
                            text-gray-800
                          "
                        >
                          {{
                            room.roomName ||
                            room.name
                          }}
                        </h3>


                        <p
                          v-if="room.description"
                          class="
                            mt-3
                            whitespace-pre-line
                            text-[11px]
                            leading-6
                            text-gray-500
                          "
                        >
                          {{ room.description }}
                        </p>


                        <div
                          class="
                            mt-3
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >

                          <span
                            v-if="room.capacity"
                            class="
                              rounded-full
                              bg-gray-50
                              px-3
                              py-1
                              text-[10px]
                              text-gray-500
                            "
                          >
                            ظرفیت:
                            {{ room.capacity }}
                            نفر
                          </span>


                          <span
                            v-if="room.adults"
                            class="
                              rounded-full
                              bg-gray-50
                              px-3
                              py-1
                              text-[10px]
                              text-gray-500
                            "
                          >
                            بزرگسال:
                            {{ room.adults }}
                          </span>


                          <span
                            v-if="room.children"
                            class="
                              rounded-full
                              bg-gray-50
                              px-3
                              py-1
                              text-[10px]
                              text-gray-500
                            "
                          >
                            کودک:
                            {{ room.children }}
                          </span>


                          <span
                            v-if="room.extraBed"
                            class="
                              rounded-full
                              bg-gray-50
                              px-3
                              py-1
                              text-[10px]
                              text-gray-500
                            "
                          >
                            تخت اضافه:
                            {{ room.extraBed }}
                          </span>


                          <span
                            v-if="room.breakfastIncluded"
                            class="
                              rounded-full
                              bg-green-50
                              px-3
                              py-1
                              text-[10px]
                              text-green-700
                            "
                          >
                            صبحانه
                          </span>


                          <span
                            v-if="room.boardType"
                            class="
                              rounded-full
                              bg-blue-50
                              px-3
                              py-1
                              text-[10px]
                              text-blue-700
                            "
                          >
                            {{
                              getBoardTypeLabel(
                                room.boardType
                              )
                            }}
                          </span>

                        </div>

                      </div>


                      <!-- Footer -->

                      <div
                        class="
                          mt-auto
                          flex
                          items-end
                          justify-between
                          gap-4
                          border-t
                          border-gray-100
                          pt-4
                        "
                      >

                        <div>

                          <div
                            v-if="
                              hasDiscount(
                                room
                              )
                            "
                            class="
                              mb-1
                              flex
                              items-center
                              gap-2
                            "
                          >
                            <span
                              class="
                                text-[10px]
                                text-gray-400
                                line-through
                              "
                            >
                              {{
                                formatPrice(
                                  room.originalPrice
                                )
                              }}
                              ریال
                            </span>

                            <span
                              v-if="
                                room.discountPercent
                              "
                              class="
                                rounded-full
                                bg-red-50
                                px-2
                                py-1
                                text-[9px]
                                font-bold
                                text-red-500
                              "
                            >
                              {{
                                room.discountPercent
                              }}٪
                            </span>
                          </div>


                          <div
                            class="
                              text-[18px]
                              font-black
                              text-primary
                            "
                          >
                            {{
                              formatPrice(
                                getRoomPrice(
                                  room
                                )
                              )
                            }}

                            <span
                              class="
                                mr-1
                                text-[10px]
                                font-normal
                                text-gray-500
                              "
                            >
                              ریال
                            </span>
                          </div>

                        </div>


                        <UiBaseButton
                          label="انتخاب اتاق"
                          variant="filled"
                          color="primary"
                          :active="false"
                          :disabled="
                            room.disabled === true
                          "
                          class="
                            !rounded-3xl
                            !px-6
                            h-11
                            text-[12px]
                          "
                          @click="
                            handleRoomSelect(
                              room
                            )
                          "
                        />

                      </div>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          </template>


          <!--
          |--------------------------------------------------------------------------
          | STEP 2
          | Passenger Info
          |--------------------------------------------------------------------------
          -->

          <template
            v-else-if="
              flightStore.currentStep === 2
            "
          >
            <div
              class="
                space-y-4
                px-2
                md:px-0
              "
              dir="rtl"
            >

              <!-- Selected Reservation -->

              <div
                class="
                  rounded-3xl
                  border
                  border-gray-100
                  bg-white
                  p-5
                  shadow-sm
                "
              >
                <div
                  class="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div>

                    <div
                      class="
                        text-[10px]
                        text-gray-400
                      "
                    >
                      رزرو انتخاب‌شده
                    </div>

                    <div
                      class="
                        mt-1
                        font-black
                        text-gray-800
                      "
                    >
                      {{ selectedHotel?.hotelName }}
                    </div>

                    <div
                      v-if="selectedRoom"
                      class="
                        mt-1
                        text-[11px]
                        text-gray-500
                      "
                    >
                      {{
                        selectedRoom.roomName ||
                        selectedRoom.name
                      }}
                    </div>

                  </div>


                  <UiBaseButton
                    label="تغییر اتاق"
                    variant="outline"
                    color="primary"
                    class="
                      !rounded-3xl
                      text-[11px]
                    "
                    @click="backToRooms"
                  />

                </div>
              </div>


              <!--
              |--------------------------------------------------------------------------
              | Passenger Form
              |--------------------------------------------------------------------------
              |
              | فرم هتل را بعداً اینجا قرار می‌دهیم.
              |
              -->

              <div
                class="
                  rounded-3xl
                  border
                  border-gray-100
                  bg-white
                  p-8
                  text-center
                  shadow-sm
                "
              >
                <i
                  class="
                    bi
                    bi-person-vcard
                    text-[40px]
                    text-gray-300
                  "
                ></i>

                <h3
                  class="
                    mt-4
                    font-black
                    text-gray-700
                  "
                >
                  تکمیل اطلاعات مسافران
                </h3>

                <p
                  class="
                    mt-2
                    text-[11px]
                    text-gray-400
                  "
                >
                  فرم اطلاعات رزرو هتل در این قسمت قرار می‌گیرد.
                </p>
              </div>

            </div>
          </template>


          <!--
          |--------------------------------------------------------------------------
          | STEP 3
          | Payment
          |--------------------------------------------------------------------------
          -->

          <template
            v-else-if="
              flightStore.currentStep === 3
            "
          >
            <div
              class="
                rounded-3xl
                border
                border-gray-100
                bg-white
                p-8
                text-center
                shadow-sm
              "
              dir="rtl"
            >
              <i
                class="
                  bi
                  bi-credit-card
                  text-[40px]
                  text-gray-300
                "
              ></i>

              <h3
                class="
                  mt-4
                  font-black
                  text-gray-700
                "
              >
                تایید و پرداخت
              </h3>
            </div>
          </template>


          <!--
          |--------------------------------------------------------------------------
          | STEP 4
          | Voucher
          |--------------------------------------------------------------------------
          -->

          <template
            v-else-if="
              flightStore.currentStep === 4
            "
          >
            <div
              class="
                rounded-3xl
                border
                border-gray-100
                bg-white
                p-8
                text-center
                shadow-sm
              "
              dir="rtl"
            >
              <i
                class="
                  bi
                  bi-ticket-perforated
                  text-[40px]
                  text-gray-300
                "
              ></i>

              <h3
                class="
                  mt-4
                  font-black
                  text-gray-700
                "
              >
                دریافت واچر هتل
              </h3>
            </div>
          </template>

        </div>
      </div>
    </main>


    <!--
    |--------------------------------------------------------------------------
    | Mobile Search Modal
    |--------------------------------------------------------------------------
    -->

    <transition name="fade">
      <div
        v-if="isSearchModalOpen"
        class="
          fixed
          inset-0
          z-[9999]
          flex
          items-end
          justify-center
          bg-slate-900/50
          backdrop-blur-sm
          lg:hidden
        "
        @click.self="
          isSearchModalOpen = false
        "
      >
        <div
          dir="rtl"
          class="
            flex
            max-h-[90vh]
            w-full
            flex-col
            rounded-t-[2rem]
            bg-white
            shadow-2xl
          "
        >

          <!-- Header -->

          <div
            class="
              flex
              items-center
              justify-between
              border-b
              border-gray-100
              px-5
              py-4
            "
          >
            <div>
              <h3
                class="
                  text-[16px]
                  font-black
                  text-gray-800
                "
              >
                تغییر جستجو
              </h3>

              <p
                class="
                  mt-1
                  text-[11px]
                  text-gray-400
                "
              >
                شهر یا تاریخ اقامت را تغییر دهید
              </p>
            </div>

            <button
              type="button"
              class="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-gray-100
                text-2xl
                text-gray-500
              "
              @click="
                isSearchModalOpen = false
              "
            >
              ×
            </button>
          </div>


          <!-- Search + Filter -->

          <div
            class="
              flex-1
              overflow-y-auto
              p-4
            "
          >
            <div class="space-y-4">

              <FlightSearchPanel
                @hotel-search="handleHotelSearch"
              />

              <FilterHotelSnap
                v-if="
                  flightStore.currentStep===0 &&
                  hotels.length
                "
                v-model:filters="activeHotelFilters"
                :hotels="hotels"
              />

            </div>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>


<script setup>

import{
  ref,
  computed,
  onMounted,
  watch
}from'vue'

import{
  useRoute,
  useRouter
}from'vue-router'

import{
  useHotelStore
}from'~/stores/hotels'

import{
  useFlightStore
}from'~/stores/flights'

import{
  searchAllHotelProviders
}from'~/services/searchHotels'

import HotelCard from '~/components/HotelCard.vue'


/*
|--------------------------------------------------------------------------
| Route / Stores
|--------------------------------------------------------------------------
*/

const route=
  useRoute()
const router=
  useRouter()
const hotelStore=
  useHotelStore()

const flightStore=
  useFlightStore()


/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const searchStarted=
  ref(false)

const isSearchModalOpen=
  ref(false)

const selectedHotel=
  ref(null)


/*
|--------------------------------------------------------------------------
| Steps
|--------------------------------------------------------------------------
*/

const hotelSteps=[
  {
    icon:'🏨',
    label:'انتخاب هتل'
  },
  {
    icon:'🛏️',
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
]


/*
|--------------------------------------------------------------------------
| Search Params From Route
|--------------------------------------------------------------------------
*/

const searchParams=
  computed(()=>({

    cityId:
      Number(
        route.query.cityId||
        0
      ),

    checkIn:
      String(
        route.query.checkIn||
        ''
      )
        .trim()
        .replaceAll(
          '/',
          '-'
        ),

    checkOut:
      String(
        route.query.checkOut||
        ''
      )
        .trim()
        .replaceAll(
          '/',
          '-'
        )

  }))


/*
|--------------------------------------------------------------------------
| Facility Key
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| Group Rooms By Hotel
|--------------------------------------------------------------------------
|
| SnappTrip به ازای هر Room یک رکورد برمی‌گرداند.
|
| اینجا:
|
| Room
| Room
| Room
|
| تبدیل می‌شود به:
|
| Hotel
|   Rooms[]
|
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Accommodation Priority
|--------------------------------------------------------------------------
*/

function normalizeAccommodation(
 value
){

 return String(
  value||
  ''
 )
  .trim()
  .replaceAll('ي','ی')
  .replaceAll('ك','ک')
  .replaceAll('\u200c',' ')
  .replace(/\s+/g,' ')
  .toLowerCase()

}


function getAccommodationPriority(
 hotel
){

 const title=
  normalizeAccommodation(
   hotel?.accommodationTitle
  )

 const type=
  normalizeAccommodation(
   hotel?.accommodationType
  )


 /*
 |--------------------------------------------------------------------------
 | Hotel
 |--------------------------------------------------------------------------
 |
 | مهم:
 | اول هتل آپارتمان را بررسی نمی‌کنیم چون عبارت آن شامل "هتل" هم هست.
 |
 |--------------------------------------------------------------------------
 */

 if(
  title==='هتل'||
  type==='hotel'
 ){
  return 1
 }


 /*
 |--------------------------------------------------------------------------
 | Apartment Hotel
 |--------------------------------------------------------------------------
 */

 if(
  title.includes(
   'هتل آپارتمان'
  )||
  title.includes(
   'هتل اپارتمان'
  )||
  type.includes(
   'apartmenthotel'
  )||
  type.includes(
   'apartment hotel'
  )
 ){
  return 2
 }


 /*
 |--------------------------------------------------------------------------
 | Guest House
 |--------------------------------------------------------------------------
 */

 if(
  title.includes(
   'مسافرخانه'
  )||
  title.includes(
   'مهمانپذیر'
  )||
  title.includes(
   'مهمان پذیر'
  )||
  type.includes(
   'guesthouse'
  )||
  type.includes(
   'guest house'
  )
 ){
  return 3
 }


 /*
 |--------------------------------------------------------------------------
 | Traditional
 |--------------------------------------------------------------------------
 */

 if(
  title.includes(
   'اقامتگاه سنتی'
  )||
  title.includes(
   'سنتی'
  )||
  type.includes(
   'traditional'
  )
 ){
  return 4
 }


 /*
 |--------------------------------------------------------------------------
 | Hostel
 |--------------------------------------------------------------------------
 */

 if(
  title.includes(
   'هاستل'
  )||
  type.includes(
   'hostel'
  )
 ){
  return 5
 }


 /*
 |--------------------------------------------------------------------------
 | Eco Lodge
 |--------------------------------------------------------------------------
 */

 if(
  title.includes(
   'بوم گردی'
  )||
  title.includes(
   'بوم‌گردی'
  )||
  type.includes(
   'ecolodge'
  )||
  type.includes(
   'eco lodge'
  )
 ){
  return 6
 }


 /*
 |--------------------------------------------------------------------------
 | Others
 |--------------------------------------------------------------------------
 */

 return 99

}
const hotels=
 computed(()=>{

  const rooms=
   Array.isArray(
    hotelStore.searchRooms
   )
    ?hotelStore.searchRooms
    :[]


  const map=
   new Map()


  for(
   const room
   of rooms
  ){

   if(!room)
    continue


   const provider=
    String(
     room?.provider||
     ''
    )
     .trim()
     .toUpperCase()


   const hotelId=
    String(
     room?.providerHotelId||
     room?.hotelId||
     ''
    )


   if(!hotelId)
    continue


   const key=
    `${provider}-${hotelId}`


   if(
    !map.has(key)
   ){

    map.set(
     key,
     {

      key,

      provider,

      providerHotelId:
       hotelId,

      hotelId:
       room?.hotelId,

      hotelName:
       room?.hotelName||
       '',

      accommodationTitle:
       room?.accommodationTitle||
       '',

      accommodationType:
       room?.accommodationType||
       '',

      hotelStar:
       Number(
        room?.hotelStar||
        0
       ),

      hotelAddress:
       room?.hotelAddress||
       '',

      image:
       room?.image||
       room?.cover?.url||
       '',

      facilities:
       Array.isArray(
        room?.facilities
       )
        ?room.facilities
        :[],

      rooms:[]

     }
    )

   }


   const hotel=
    map.get(key)


   hotel.rooms.push(
    room
   )


   /*
   |--------------------------------------------------------------------------
   | Facilities Merge
   |--------------------------------------------------------------------------
   */

   if(
    Array.isArray(
     room?.facilities
    )
   ){

    const currentIds=
     new Set(
      hotel.facilities.map(
       facility=>
        getFacilityKey(
         facility
        )
      )
     )


    for(
     const facility
     of room.facilities
    ){

     const facilityKey=
      getFacilityKey(
       facility
      )


     if(
      facilityKey&&
      !currentIds.has(
       facilityKey
      )
     ){

      hotel.facilities.push(
       facility
      )

      currentIds.add(
       facilityKey
      )

     }

    }

   }

  }


 return[
 ...map.values()
]
 .map(
  hotel=>{

   const prices=
 hotel.rooms

  .map(
   room=>
    getRoomOriginalPriceRial(
     room
    )
  )

  .filter(
   price=>
    Number.isFinite(price)&&
    price>0
  )


  return{

 ...hotel,

 displayPrice:
  prices.length
   ?Math.min(
     ...prices
    )
   :0

}

  }
 )

 .sort(
  (a,b)=>{

   /*
   |--------------------------------------------------------------------------
   | اول نوع اقامتگاه
   |--------------------------------------------------------------------------
   */

   const typeDiff=
    getAccommodationPriority(
     a
    )-
    getAccommodationPriority(
     b
    )


   if(
    typeDiff!==0
   ){
    return typeDiff
   }


   /*
   |--------------------------------------------------------------------------
   | اگر نوع یکسان بود، ستاره بیشتر اول
   |--------------------------------------------------------------------------
   */

   const starDiff=
    Number(
     b?.hotelStar||
     0
    )-
    Number(
     a?.hotelStar||
     0
    )


   if(
    starDiff!==0
   ){
    return starDiff
   }


   /*
   |--------------------------------------------------------------------------
   | اگر ستاره هم برابر بود، قیمت کمتر اول
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
    aPrice>0
     ?aPrice
     :Number.MAX_SAFE_INTEGER


   const safeBPrice=
    bPrice>0
     ?bPrice
     :Number.MAX_SAFE_INTEGER


   return(
    safeAPrice-
    safeBPrice
   )

  }
 )

})


/*
|--------------------------------------------------------------------------
| Selected Room
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Filtered Hotels
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Original Price
|--------------------------------------------------------------------------
*/

function getHotelOriginalPrice(
 hotel
){

 const rooms=
  Array.isArray(
   hotel?.rooms
  )
   ?hotel.rooms
   :[]


 const prices=
  rooms

   .map(
    room=>
     getRoomOriginalPriceRial(
      room
     )
   )

   .filter(
    price=>
     Number.isFinite(
      price
     )&&
     price>0
   )


 return prices.length
  ?Math.min(
    ...prices
   )
  :0

}


/*
|--------------------------------------------------------------------------
| Facility Key
|--------------------------------------------------------------------------
*/

function getHotelFacilityKey(
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


/*
|--------------------------------------------------------------------------
| Accommodation Normalize
|--------------------------------------------------------------------------
*/

function normalizeHotelAccommodation(
 value
){

 return String(
  value||
  ''
 )
  .trim()
  .replaceAll(
   'ي',
   'ی'
  )
  .replaceAll(
   'ك',
   'ک'
  )
  .replaceAll(
   '\u200c',
   ' '
  )
  .replace(
   /\s+/g,
   ' '
  )
  .toLowerCase()

}


/*
|--------------------------------------------------------------------------
| Accommodation Priority
|--------------------------------------------------------------------------
*/

function getHotelAccommodationPriority(
 hotel
){

 const title=
  normalizeHotelAccommodation(
   hotel?.accommodationTitle
  )


 const type=
  normalizeHotelAccommodation(
   hotel?.accommodationType
  )


 /*
 |--------------------------------------------------------------------------
 | Hotel
 |--------------------------------------------------------------------------
 */

 if(
  title==='هتل'||
  type==='hotel'
 ){
  return 1
 }


 /*
 |--------------------------------------------------------------------------
 | Apartment Hotel
 |--------------------------------------------------------------------------
 */

 if(
  title.includes(
   'هتل آپارتمان'
  )||
  title.includes(
   'هتل اپارتمان'
  )||
  type.includes(
   'apartment hotel'
  )||
  type.includes(
   'apartmenthotel'
  )
 ){
  return 2
 }


 /*
 |--------------------------------------------------------------------------
 | Guest House
 |--------------------------------------------------------------------------
 */

 if(
  title.includes(
   'مسافرخانه'
  )||
  title.includes(
   'مهمانپذیر'
  )||
  title.includes(
   'مهمان پذیر'
  )||
  type.includes(
   'guest house'
  )||
  type.includes(
   'guesthouse'
  )
 ){
  return 3
 }


 /*
 |--------------------------------------------------------------------------
 | Traditional
 |--------------------------------------------------------------------------
 */

 if(
  title.includes(
   'اقامتگاه سنتی'
  )||
  title.includes(
   'سنتی'
  )||
  type.includes(
   'traditional'
  )
 ){
  return 4
 }


 /*
 |--------------------------------------------------------------------------
 | Hostel
 |--------------------------------------------------------------------------
 */

 if(
  title.includes(
   'هاستل'
  )||
  type.includes(
   'hostel'
  )
 ){
  return 5
 }


 /*
 |--------------------------------------------------------------------------
 | Eco Lodge
 |--------------------------------------------------------------------------
 */

 if(
  title.includes(
   'بوم گردی'
  )||
  title.includes(
   'بوم‌گردی'
  )||
  type.includes(
   'eco lodge'
  )||
  type.includes(
   'ecolodge'
  )
 ){
  return 6
 }


 return 99

}
const filteredHotels=
 computed(()=>{

  const filters=
   activeHotelFilters.value


  return hotels.value

   .filter(
    hotel=>{

     /*
     |--------------------------------------------------------------------------
     | Accommodation Type
     |--------------------------------------------------------------------------
     */

     if(
      filters
       .accommodationTypes
       .length
     ){

      const type=
       String(
        hotel
         ?.accommodationTitle||
        ''
       )
        .trim()


      if(
       !filters
        .accommodationTypes
        .includes(type)
      ){
       return false
      }

     }


     /*
     |--------------------------------------------------------------------------
     | Stars
     |--------------------------------------------------------------------------
     */

     if(
      filters
       .stars
       .length
     ){

      const star=
       Number(
        hotel
         ?.hotelStar||
        0
       )


      if(
       !filters
        .stars
        .map(Number)
        .includes(star)
      ){
       return false
      }

     }


     /*
     |--------------------------------------------------------------------------
     | Original Price
     |--------------------------------------------------------------------------
     */

     const price=
      getHotelOriginalPrice(
       hotel
      )


     const priceRange=
      filters
       ?.originalPriceRange


     if(
      Array.isArray(
       priceRange
      )&&
      priceRange.length===2
     ){

      const minPrice=
       Number(
        priceRange[0]
       )

      const maxPrice=
       Number(
        priceRange[1]
       )


      if(
       !Number.isFinite(price)||
       price<=0
      ){
       return false
      }


      if(
       Number.isFinite(minPrice)&&
       price<minPrice
      ){
       return false
      }


      if(
       Number.isFinite(maxPrice)&&
       price>maxPrice
      ){
       return false
      }

     }


     /*
     |--------------------------------------------------------------------------
     | Facilities
     |--------------------------------------------------------------------------
     */

     if(
      filters
       .facilities
       .length
     ){

      const hotelFacilities=
       new Set(

        (
         hotel?.facilities||
         []
        )

         .map(
          facility=>
           getHotelFacilityKey(
            facility
           )
         )

         .filter(Boolean)

       )


      /*
      |--------------------------------------------------------------------------
      | همه امکانات انتخاب‌شده باید در هتل وجود داشته باشند
      |--------------------------------------------------------------------------
      */

      const hasAll=
       filters
        .facilities
        .every(
         facility=>
          hotelFacilities
           .has(
            facility
           )
        )


      if(!hasAll){
       return false
      }

     }


     return true

    }
   )


   /*
   |--------------------------------------------------------------------------
   | Accommodation Ordering
   |--------------------------------------------------------------------------
   |
   | هتل
   | هتل آپارتمان
   | مسافرخانه / مهمانپذیر
   | اقامتگاه سنتی
   | ...
   |
   |--------------------------------------------------------------------------
   */

   .sort(
    (a,b)=>
     getHotelAccommodationPriority(
      a
     )-
     getHotelAccommodationPriority(
      b
     )
   )

 })
const activeHotelFilters=
 ref({

  originalPriceRange:null,

  accommodationTypes:[],

  stars:[],

  withBreakfast:true,

  withoutBreakfast:true,

  facilities:[]

 })
const selectedRoom=
  computed(()=>{

    const rooms=
      Array.isArray(
        hotelStore.selectedRooms
      )
        ?hotelStore.selectedRooms
        :[]

    return rooms[0]||
      null

  })
function normalizeBoardType(
 value
){

 return String(
  value||
  ''
 )
  .trim()
  .toLowerCase()

}


function isBreakfastRoom(
 room
){

 const boardType=
  normalizeBoardType(
   room?.boardType||
   room?.meta?.raw?.board_type
  )


 return[
  'bed_breakfast',
  'bb',
  'half_board',
  'hb',
  'full_board',
  'fb'
 ].includes(
  boardType
 )

}


function isRoomOnlyRoom(
 room
){

 const boardType=
  normalizeBoardType(
   room?.boardType||
   room?.meta?.raw?.board_type
  )


 return[
  'room_only',
  'ro'
 ].includes(
  boardType
 )

}

/*
|--------------------------------------------------------------------------
| Hotel Image
|--------------------------------------------------------------------------
*/

function getHotelImage(
  room
){

  return(
    room?.images?.[0]?.url||
    room?.image||
    room?.cover?.url||
    room?.meta?.raw?.cover?.url||
    room?.meta?.cover?.url||
    room?.hotelRoomImages?.[0]?.image||
    ''
  )

}


/*
|--------------------------------------------------------------------------
| Room Image
|--------------------------------------------------------------------------
*/

function getRoomImage(
  room
){

  return(
    room?.images?.[0]?.url||
    room?.image||
    room?.cover?.url||
    room?.meta?.raw?.cover?.url||
    room?.hotelRoomImages?.[0]?.image||
    selectedHotel.value?.image||
    ''
  )

}


/*
|--------------------------------------------------------------------------
| SnappTrip Original Price -> Rial
|--------------------------------------------------------------------------
*/

function getRoomOriginalPriceRial(
 room
){

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
| Room Price
|--------------------------------------------------------------------------
*/

function getRoomPrice(
  room
){

  const provider=
    String(
      room?.provider||
      ''
    )
      .trim()
      .toUpperCase()


  if(
    provider==='SNAPPTRIP'
  ){
    return getRoomOriginalPriceRial(
      room
    )
  }


  const price=
    Number(
      room?.priceFrom||
      room?.calculatedPrice||
      room?.price||
      room?.unitPrice||
      0
    )


  return(
    Number.isFinite(
      price
    )
      ?price
      :0
  )

}


/*
|--------------------------------------------------------------------------
| Safe Price
|--------------------------------------------------------------------------
*/

function safePrice(
  value
){

  const price=
    Number(
      value||
      0
    )


  return(
    Number.isFinite(
      price
    )&&
    price>0
  )
    ?price
    :Number.MAX_SAFE_INTEGER

}


/*
|--------------------------------------------------------------------------
| Has Discount
|--------------------------------------------------------------------------
*/

function hasDiscount(
  room
){

  const provider=
    String(
      room?.provider||
      ''
    )
      .trim()
      .toUpperCase()

  if(
    provider==='SNAPPTRIP'
  ){
    return false
  }


  const originalPrice=
    Number(
      room?.originalPrice||
      0
    )

  const finalPrice=
    getRoomPrice(
      room
    )


  return(
    originalPrice>0&&
    finalPrice>0&&
    originalPrice>finalPrice
  )

}


/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

async function performSearch(){

  const params=
    searchParams.value


  if(
    !params.cityId||
    !params.checkIn||
    !params.checkOut
  ){

    hotelStore.setSearchRooms(
      []
    )

    hotelStore.loading=
      false

    hotelStore.backgroundLoading=
      false

    hotelStore.searchFinished=
      true

    searchStarted.value=
      true

    return
  }


  searchStarted.value=
    false


  try{

    await searchAllHotelProviders(
      params
    )

  }
  catch(error){

    console.error(
      'HOTEL SEARCH ERROR:',
      error
    )

  }
  finally{

    searchStarted.value=
      true

  }

}


/*
|--------------------------------------------------------------------------
| Search Event From FlightSearchPanel
|--------------------------------------------------------------------------
|
| خود FlightSearchPanel آدرس Route را تغییر می‌دهد.
| Watcher پایین Search اصلی را اجرا می‌کند.
|
|--------------------------------------------------------------------------
*/

function handleHotelSearch(){

  isSearchModalOpen.value=
    false

}


/*
|--------------------------------------------------------------------------
| Select Hotel
|--------------------------------------------------------------------------
*/

async function handleHotelSelect(
  hotel
){

  if(!hotel)
    return


  const hotelId=
    Number(
      hotel?.providerHotelId||
      hotel?.hotelId||
      hotel?.id||
      0
    )


  if(!hotelId){
    return
  }


  const checkIn=
    String(
      searchParams.value.checkIn||
      ''
    )
      .trim()
      .replaceAll(
        '-',
        '/'
      )


  const checkOut=
    String(
      searchParams.value.checkOut||
      ''
    )
      .trim()
      .replaceAll(
        '-',
        '/'
      )


  hotelStore.clearRooms()

  flightStore.setCurrentStep(
    0
  )


  await router.push({

    path:
      `/hotels/${hotelId}`,

    query:{
      checkIn,
      checkOut
    }

  })

}


/*
|--------------------------------------------------------------------------
| Select Room
|--------------------------------------------------------------------------
*/

function handleRoomSelect(
  room
){

  if(
    !room||
    room?.disabled===true
  ){
    return
  }


  const price=
    getRoomPrice(
      room
    )


  const selectedRoomData={

    ...JSON.parse(
      JSON.stringify(
        room
      )
    ),

    hotelId:
      selectedHotel.value
        ?.hotelId||
      room?.hotelId,

    hotelName:
      selectedHotel.value
        ?.hotelName||
      room?.hotelName,

    hotelStar:
      selectedHotel.value
        ?.hotelStar||
      room?.hotelStar,

    hotelAddress:
      selectedHotel.value
        ?.hotelAddress||
      room?.hotelAddress,

    accommodationTitle:
      selectedHotel.value
        ?.accommodationTitle||
      room?.accommodationTitle,

    count:
      1,

    unitPrice:
      price,

    basePrice:
      price,

    price:
      price

  }


  hotelStore.clearRooms()


  hotelStore.addRoom(
    selectedRoomData
  )


  flightStore.setCurrentStep(
    2
  )

}


/*
|--------------------------------------------------------------------------
| Back To Hotels
|--------------------------------------------------------------------------
*/

function backToHotels(){

  hotelStore.clearRooms()

  selectedHotel.value=
    null

  flightStore.setCurrentStep(
    0
  )

}


/*
|--------------------------------------------------------------------------
| Back To Rooms
|--------------------------------------------------------------------------
*/

function backToRooms(){

  hotelStore.clearRooms()

  flightStore.setCurrentStep(
    1
  )

}


/*
|--------------------------------------------------------------------------
| Provider Label
|--------------------------------------------------------------------------
*/

function getProviderLabel(
  provider
){

  const value=
    String(
      provider||
      ''
    )
      .trim()
      .toUpperCase()


  switch(value){

    case'SNAPPTRIP':
      return'اسنپ‌تریپ'

    case'SNAPP':
      return'اسنپ‌تریپ'

    case'AHUAN':
      return'آهوان'

    case'EGHAMAT24':
      return'اقامت ۲۴'

    default:
      return value

  }

}


/*
|--------------------------------------------------------------------------
| Board Type
|--------------------------------------------------------------------------
*/

function getBoardTypeLabel(
  value
){

  const type=
    String(
      value||
      ''
    )
      .trim()
      .toLowerCase()


  switch(type){

    case'bed_breakfast':
    case'bb':
      return'اقامت با صبحانه'

    case'half_board':
    case'hb':
      return'هالف برد'

    case'full_board':
    case'fb':
      return'فول برد'

    case'room_only':
    case'ro':
      return'فقط اتاق'

    default:
      return value

  }

}


/*
|--------------------------------------------------------------------------
| Format Price
|--------------------------------------------------------------------------
*/

function formatPrice(
  value
){

  const price=
    Number(
      value||
      0
    )


  if(
    !Number.isFinite(
      price
    )||
    price<=0
  ){
    return'-'
  }


  return price.toLocaleString(
    'fa-IR'
  )

}


/*
|--------------------------------------------------------------------------
| Reset Booking Flow
|--------------------------------------------------------------------------
*/

function resetBookingFlow(){

  selectedHotel.value=
    null


  hotelStore.clearRooms()


  flightStore.setCurrentStep(
    0
  )

}


/*
|--------------------------------------------------------------------------
| Mounted
|--------------------------------------------------------------------------
*/

onMounted(
  async()=>{

    resetBookingFlow()


    /*
    |--------------------------------------------------------------------------
    | Cities
    |--------------------------------------------------------------------------
    */

    try{

      await hotelStore
        .loadSnappTripCities()

    }
    catch(error){

      console.error(
        'LOAD SNAPPTRIP CITIES ERROR:',
        error
      )

    }


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    await performSearch()

  }
)


/*
|--------------------------------------------------------------------------
| Route Watch
|--------------------------------------------------------------------------
|
| FlightSearchPanel فقط URL را تغییر می‌دهد:
|
| /hotels
| ?cityId=...
| &checkIn=...
| &checkOut=...
|
| با تغییر URL این Watcher Search جدید را اجرا می‌کند.
|
|--------------------------------------------------------------------------
*/

watch(
  ()=>[
    route.query.cityId,
    route.query.checkIn,
    route.query.checkOut
  ],

  async(
    newValue,
    oldValue
  )=>{

    if(
      JSON.stringify(
        newValue
      )===
      JSON.stringify(
        oldValue
      )
    ){
      return
    }


    resetBookingFlow()


    await performSearch()

  }
)


/*
|--------------------------------------------------------------------------
| Step Watch
|--------------------------------------------------------------------------
*/

watch(
  ()=>flightStore.currentStep,

  ()=>{

    if(
      typeof window===
      'undefined'
    ){
      return
    }


    window.scrollTo({
      top:0,
      behavior:'smooth'
    })

  }
)

</script>


<style scoped>

.fade-enter-active,
.fade-leave-active{
  transition:
    opacity .25s ease;
}

.fade-enter-from,
.fade-leave-to{
  opacity:0;
}


.list-enter-active{
  transition:
    all .35s ease;
}

.list-enter-from{
  opacity:0;
  transform:
    translateY(12px);
}

.list-leave-active{
  transition:
    all .2s ease;
}

.list-leave-to{
  opacity:0;
  transform:
    translateY(-8px);
}

</style>