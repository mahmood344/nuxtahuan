<template>
  <!-- کانتینر اصلی پنل جستجو بدون تصویر هدر -->
  <div class="relative w-full">
    
    <!-- کارت جستجو -->
    <div class="relative border border-gray-200 z-20 mx-auto w-full max-w-[462px] md:max-w-[1246px] bg-white rounded-3xl shadow-xl min-h-[auto] p-6">
      
      <!-- دکمه‌های انتخاب سرویس (مانند بلیط، تور و...) در بالای پنل -->
      <div dir="rtl" class="mt-0 grid grid-cols-2 gap-3">
  <UiBaseButton
    v-for="(s, index) in services"
    :key="s.key"
    :label="s.label"
    :icon="s.icon"
    :variant="activeService === s.key ? 'filled' : 'outline'"
    :color="activeService === s.key ? 'primary' : 'white'"
    :active="activeService === s.key"
    @click="selectService(s.key, index)"
    class="text-[13px] font-black w-full"
    :class="{
      'col-span-2 justify-self-center max-w-[220px]': index === services.length - 1
    }"
  />
</div>

      <!-- خط جداکننده سرویس‌ها -->
      <div class="w-full my-4 h-[1px] bg-[var(--color-gray-300)]"></div>

      <!-- بخش اصلی فرم پرواز -->
      <div dir="rtl" v-if="activeService == 'flight'" id="app" class="flex flex-col justify-center">
        
        <!-- بخش رادیو باتن‌ها: چیدمان دو تایی در یک ردیف -->
        <div class="w-full space-y-4 p-4">
          <!-- ردیف اول: پرواز داخلی و خارجی -->
          <div class="grid grid-cols-2 gap-4 justify-items-center">
            <UiBaseRadio 
              v-model="flightType" 
              value="domestic"
              label="پرواز داخلی" 
              class="text-[10px]" 
            />  
            <UiBaseRadio 
              v-model="flightType" 
              value="international"
              label="پرواز خارجی" 
              class="text-[10px]" 
            />
          </div>

          <!-- ردیف دوم: یک طرفه و رفت و برگشت -->
          <div class="grid grid-cols-2 gap-4 justify-items-center">
            <UiBaseRadio 
              v-model="travelType" 
              value="one-way" 
              label="یک طرفه" 
              class="text-[10px]" 
            />  
            <UiBaseRadio 
              v-model="travelType" 
              value="round-trip"
              label="رفت و برگشت" 
              class="text-[10px]" 
            />  
          </div>
        </div>

        <!-- ورودی‌ها به صورت ستونی زیر هم -->
        <div dir="rtl" class="w-full flex flex-col gap-4 mt-2">
          
          <!-- مبدا و مقصد -->
          <div class="w-full">
            <UiOriginDestinationSelector
            :compact="isCompactSearch"
              :sendFlightType="flightType"
              v-model:mabda="origin"
              v-model:maghsad="destination"
            />
          </div>
          
          <!-- تاریخ رفت و برگشت -->
          <div class="w-full">
            <UiBaseDatePicker 
            :compact="isCompactSearch"
              :sendTravelType="travelType"
              v-model:departDate="departDate"
              v-model:returnDate="returnDate"
            />
          </div>
          
          <!-- انتخاب مسافران -->
          <div class="w-full">
            <UiPassengerSelector 
            :compact="isCompactSearch"
              v-model:adl="adl"
              v-model:chd="chd"
              v-model:inf="inf"
            />
          </div>

          <!-- دکمه جستجو در وسط -->
          <div class="flex justify-center items-center w-full mt-4">
            <UiBaseButton
              class="w-full max-w-[280px] h-[44px] !rounded-4xl text-[13px]" 
              label="جستجو"
              variant="filled"
              color="primary"
              :active="false"
              :disabled="!origin || !destination || !departDate || !adl"
              @click="searchFlights"
            />
          </div>

        </div>
      </div>
      <!-- بخش جستجوی هتل آهوان -->
<!-- بخش جستجوی هتل آهوان -->
<div
  v-if="activeService === 'hotelAhwan'"
  dir="rtl"
  class="flex w-full flex-col justify-center"
>
  <div
    class="flex w-full flex-col items-center gap-4"
    :class="
      isCompactSearch
        ? 'p-0'
        : 'p-4 md:p-8'
    "
  >

    <!-- شهر -->
    <div
      class="w-full"
      :class="
        isCompactSearch
          ? 'max-w-[280px]'
          : 'max-w-[500px]'
      "
    >
      <UiBaseAutocomplete
        v-model="hotelCity"
        label="شهر"
        placeholder="نام شهر را جستجو کنید..."
        :items="hotelCities"
        item-text="name"
        item-value="code"
        clearable
        icon='<i class="bi bi-geo-alt"></i>'
        iconPosition="right"
        class="w-full"
        :class="{
          'hotel-city-compact': isCompactSearch
        }"
      />
    </div>


    <!-- تاریخ ورود و خروج -->
    <div
      class="w-full"
      :class="
        isCompactSearch
          ? 'max-w-[280px]'
          : 'max-w-[500px]'
      "
    >
      <UiSingleDatePicker
        :compact="isCompactSearch"
        v-model="hotelDate"
        label="تاریخ ورود و خروج"
        placeholder="انتخاب تاریخ"
      />
    </div>


    <!-- دکمه جستجو -->
    <div
      class="flex w-full justify-center"
    >
      <UiBaseButton
        label="جستجو"
        variant="filled"
        color="primary"
        :active="false"
        :disabled="!hotelCity || !hotelDate"
        @click="searchAhuanHotel"
        class="w-full !rounded-4xl text-[13px]"
        :class="
          isCompactSearch
            ? 'max-w-[280px] h-[44px]'
            : 'max-w-[500px] h-[40px]'
        "
      />
    </div>

  </div>
</div>
<!-- بخش‌های در حال توسعه -->
<div
  v-if="!['flight', 'hotelAhwan'].includes(activeService)"
  dir="rtl"
  class="
    flex
    w-full
    min-h-[180px]
    items-center
    justify-center
    p-6
  "
>
  <div
    class="
      flex
      flex-col
      items-center
      justify-center
      gap-3
      text-center
    "
  >
    <i
      class="
        bi
        bi-tools
        text-[32px]
        text-[var(--color-gray-400)]
      "
    ></i>

    <p
      class="
        text-[13px]
        font-bold
        text-[var(--color-gray-500)]
      "
    >
      این قسمت از سایت در حال توسعه می‌باشد...
    </p>
  </div>
</div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  watch
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'
import {useHotelStore} from '~/stores/hotels'
const router = useRouter()
const route = useRoute()
const isHomePage = computed(() => {
  return (
    route.path === '/' ||
    route.path === '/home'
  )
})

const isCompactSearch = computed(() => {
  return !isHomePage.value
})
const origin = ref('')
const destination = ref('')

const departDate = ref('')
const returnDate = ref('')

const adl = ref(1)
const chd = ref(0)
const inf = ref(0)

const flightType = ref('domestic')
const travelType = ref('one-way')
const hotelStore=useHotelStore()
const emit=defineEmits([
 'hotel-search',
 'flight-search'
])
const hotelCity=ref(null)

const hotelDate=ref(null)
const hotelCities=computed(()=>{

 return hotelStore.hotels.map(item=>({

  code:item.id,

  name:item.title

 }))

})
const services = [
  { key: "flight", label: "بلیط هواپیما", icon: "" },
  { key: "package", label: "تور (گروهی)", icon: "" },
  { key: "hotelAhwan", label: "هتل آهوان", icon: "" },
  { key: "train", label: "قطار", icon: "" },
  { key: "bus", label: "اتوبوس", icon: "" },
  { key: "hotel", label: "هتل", icon: "" },
  { key: "insurance", label: "بیمه سفر", icon: "" },
]

const activeService = ref("flight")
const currentSlide = ref(0)

const selectService = (serviceKey, index) => {
  activeService.value = serviceKey
  currentSlide.value = index
}
async function searchAhuanHotel(){

 if(
  !hotelCity.value ||
  !hotelDate.value
 ){
  return
 }


 const dates=
  Array.isArray(hotelDate.value)
   ?hotelDate.value
   :String(hotelDate.value).split(',')


 const checkIn=
  String(dates[0]||'').trim()

 const checkOut=
  String(dates[1]||'').trim()


 if(
  !checkIn ||
  !checkOut
 ){
  return
 }


 const searchData={

  hotelId:
   Number(hotelCity.value),

  checkIn,

  checkOut

 }


 // به صفحه والد اعلام می‌کنیم
 // که یک Search جدید زده شده
 emit(
  'hotel-search',
  searchData
 )


 await router.push({

  path:
   `/hotels/${searchData.hotelId}`,

  query:{
   checkIn:
    searchData.checkIn,

   checkOut:
    searchData.checkOut
  }

 })

}
function syncFlightFormFromRoute() {

  origin.value =
    String(
      route.query.origin || ''
    )

  destination.value =
    String(
      route.query.destination || ''
    )

  departDate.value =
    String(
      route.query.departDate || ''
    )

  returnDate.value =
    String(
      route.query.returnDate || ''
    )

  const adults =
    Number.parseInt(
      String(route.query.adl ?? '1'),
      10
    )

  const children =
    Number.parseInt(
      String(route.query.chd ?? '0'),
      10
    )

  const infants =
    Number.parseInt(
      String(route.query.inf ?? '0'),
      10
    )

  adl.value =
    Number.isFinite(adults)
      ? adults
      : 1

  chd.value =
    Number.isFinite(children)
      ? children
      : 0

  inf.value =
    Number.isFinite(infants)
      ? infants
      : 0

  flightType.value =
    String(
      route.query.flightType ||
      'domestic'
    )

  travelType.value =
    String(
      route.query.travelType ||
      'one-way'
    )

  if (
    travelType.value === 'one-way'
  ) {
    returnDate.value = ''
  }
}
onMounted(() => {

  if (
    route.path.startsWith('/flights')
  ) {

    syncFlightFormFromRoute()
  }

  if (
    route.path.startsWith('/hotels/')
  ) {

    syncHotelFormFromRoute()
  }
})
watch(
  () => [
    route.params.id,
    route.query.checkIn,
    route.query.checkOut
  ],

  () => {

    if (
      route.path.startsWith('/hotels/')
    ) {
      syncHotelFormFromRoute()
    }
  }
)
watch(
  () => [
    route.query.origin,
    route.query.destination,
    route.query.departDate,
    route.query.returnDate,
    route.query.adl,
    route.query.chd,
    route.query.inf,
    route.query.flightType,
    route.query.travelType
  ],

  () => {
    syncFlightFormFromRoute()
  }
)
async function searchFlights() {

  if (
    !origin.value ||
    !destination.value ||
    !departDate.value ||
    !adl.value
  ) {
    return
  }

  const searchData = {
    origin: origin.value,
    destination: destination.value,
    departDate: departDate.value,

    returnDate:
      travelType.value === 'round-trip'
        ? returnDate.value || undefined
        : undefined,

    adl: adl.value,
    chd: chd.value,
    inf: inf.value,

    flightType: flightType.value,
    travelType: travelType.value
  }

  // به Parent اعلام می‌کنیم جستجوی پرواز انجام شد
  emit(
    'flight-search',
    searchData
  )

  await router.push({
    path: '/flights',
    query: searchData
  })
}
function syncHotelFormFromRoute() {

  /*
   * فقط وقتی داخل route هتل هستیم
   */
  if (!route.path.startsWith('/hotels/')) {
    return
  }

  const hotelId =
    Number(route.params.id || 0)

  const checkIn =
    String(
      route.query.checkIn || ''
    ).trim()

  const checkOut =
    String(
      route.query.checkOut || ''
    ).trim()


  /*
   * تب هتل آهوان فعال شود
   */
  activeService.value = 'hotelAhwan'


  /*
   * هتل انتخاب شود
   */
  hotelCity.value =
    hotelId > 0
      ? hotelId
      : null


  /*
   * تاریخ ورود و خروج
   */
  if (checkIn && checkOut) {

    hotelDate.value = [
      checkIn,
      checkOut
    ]

  }
  else {

    hotelDate.value = null
  }
}
</script>

<style scoped>
:deep(.hotel-city-compact input) {
  height: 44px !important;
  min-height: 44px !important;
  font-size: 10px !important;
}

:deep(.hotel-city-compact > div) {
  min-height: 44px !important;
}
/* در صورت نیاز به ترنزیشن یا استایل‌های خاص برای کامپوننت */
</style>
