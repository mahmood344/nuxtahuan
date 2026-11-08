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
  'col-span-2 !w-[calc(100%-6px)] justify-self-center px-4':
    s.key === 'insurance'
}"
  />
</div>

      <!-- خط جداکننده سرویس‌ها -->
      <div class="w-full my-4 h-[1px] bg-[var(--color-gray-300)]"></div>

      <!-- بخش اصلی فرم پرواز -->
      <div dir="rtl" v-if="activeService == 'flight'" id="app" class="flex flex-col justify-center">
        
        <!-- بخش رادیو باتن‌ها: چیدمان دو تایی در یک ردیف -->
        <!-- انتخاب نوع و مسیر پرواز -->
<div
  dir="rtl"
class="grid grid-cols-2 w-fit mx-auto gap-x-6 gap-y-4 py-4 md:w-full md:max-w-[500px] md:gap-x-4">
  <UiBaseRadio
    v-model="flightType"
    value="domestic"
    label="پرواز داخلی"
    class="flight-radio-aligned"
  />

  <UiBaseRadio
    v-model="flightType"
    value="international"
    label="پرواز خارجی"
    class="flight-radio-aligned"
  />

  <UiBaseRadio
    v-model="travelType"
    value="one-way"
    label="یک طرفه"
    class="flight-radio-aligned"
  />

  <UiBaseRadio
    v-model="travelType"
    value="round-trip"
    label="رفت و برگشت"
    class="flight-radio-aligned"
  />
</div>

        <!-- ورودی‌ها به صورت ستونی زیر هم -->
        <div dir="rtl" class="w-full flex flex-col gap-4 mt-2">
          
          <!-- مبدا و مقصد -->
          <div ref="flightOriginWrapperRef" class="w-full">
            <UiOriginDestinationSelector
              ref="flightOriginDestinationRef"
              :compact="isCompactSearch"
              :sendFlightType="flightType"
              v-model:mabda="origin"
              v-model:maghsad="destination"
            />
          </div>
          
          <!-- تاریخ رفت و برگشت -->
          <div ref="flightDateWrapperRef" class="w-full">
            <UiBaseDatePicker
              ref="flightDatePickerRef"
              :compact="isCompactSearch"
              :sendTravelType="travelType"
              v-model:departDate="departDate"
              v-model:returnDate="returnDate"
            />
          </div>
          
          <!-- انتخاب مسافران -->
          <div ref="flightPassengerWrapperRef" class="w-full">
            <UiPassengerSelector
              ref="flightPassengerRef"
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
      <div ref="ahuanDateWrapperRef" class="w-full">
      <UiSingleDatePicker
        ref="ahuanDatePickerRef"
        :compact="isCompactSearch"
        v-model="hotelDate"
        label="تاریخ ورود و خروج"
        placeholder="انتخاب تاریخ"
      />
      </div>
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
<!-- بخش جستجوی هتل SnappTrip -->
<div
  v-if="activeService === 'hotel'"
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
    <div
      class="w-full"
      :class="
        isCompactSearch
          ? 'max-w-[280px]'
          : 'max-w-[500px]'
      "
    >
      <UiBaseAutocomplete
        v-model="snappTripCity"
        label="شهر"
        :placeholder="
          hotelStore.snappTripCitiesLoading
            ? 'در حال دریافت شهرها...'
            : 'نام شهر را جستجو کنید...'
        "
        :items="snappTripCities"
        :popular-items="snappTripPopularCities"
        item-text="name"
        item-value="code"
        :disabled="hotelStore.snappTripCitiesLoading"
        clearable
        icon='<i class="bi bi-geo-alt"></i>'
        iconPosition="right"
        class="w-full"
        :class="{
          'hotel-city-compact': isCompactSearch
        }"
      />
    </div>

    <div
      class="w-full"
      :class="
        isCompactSearch
          ? 'max-w-[280px]'
          : 'max-w-[500px]'
      "
    >
      <div ref="snappDateWrapperRef" class="w-full">
      <UiSingleDatePicker
        ref="snappDatePickerRef"
        :compact="isCompactSearch"
        v-model="snappTripDate"
        label="تاریخ ورود و خروج"
        placeholder="انتخاب تاریخ"
      />
      </div>
    </div>

    <div class="flex w-full justify-center">
      <UiBaseButton
        label="جستجو"
        variant="filled"
        color="primary"
        :active="false"
        :disabled="!snappTripCity || !snappTripDate"
        @click="searchSnappTripHotel"
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
<!-- جستجوی بلیت اتوبوس -->
<div
  v-if="activeService === 'bus'"
  dir="rtl"
  class="flex w-full flex-col justify-center"
>
  <div
    class="flex w-full flex-col items-center gap-4"
    :class="isCompactSearch ? 'p-0' : 'p-4 md:p-8'"
  >
    <div class="w-full" :class="isCompactSearch ? 'max-w-[280px]' : 'max-w-[500px]'">
      <UiOriginDestinationSelector
        ref="busOriginDestinationRef"
        :compact="isCompactSearch"
        source="bus"
        :cities="busCities"
        :popular-cities="busPopularCities"
        v-model:mabda="busOrigin"
        v-model:maghsad="busDestination"
      />
    </div>

    <div class="w-full" :class="isCompactSearch ? 'max-w-[280px]' : 'max-w-[500px]'">
      <div ref="busDateWrapperRef" class="w-full">
        <UiSingleDatePicker
          ref="busDatePickerRef"
          :compact="isCompactSearch"
          v-model="busDate"
          label="تاریخ حرکت"
          placeholder="انتخاب تاریخ حرکت"
          :single="true"
        />
      </div>
    </div>

    <div class="flex w-full justify-center">
      <UiBaseButton
        label="جستجو"
        variant="filled"
        color="primary"
        :active="false"
        :disabled="!busOrigin || !busDestination || busOrigin === busDestination || !toBusJalaliDate(busDate)"
        @click="searchBuses"
        class="w-full !rounded-4xl text-[13px]"
        :class="isCompactSearch ? 'max-w-[280px] h-[44px]' : 'max-w-[500px] h-[40px]'"
      />
    </div>
  </div>
</div>
<!-- بخش‌های در حال توسعه -->
<div
  v-if="!['flight', 'hotelAhwan', 'hotel', 'bus'].includes(activeService)"
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
  nextTick,
  onMounted,
  watch
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'
import {useHotelStore} from '~/stores/hotels'
import {useBusStore} from '~/stores/bus'
const router = useRouter()
const route = useRoute()

const props=defineProps({
  snappTripCityId:{
    type:[Number,String],
    default:null
  }
})
const isHomePage = computed(() => {
  return (
    route.path === '/' ||
    route.path === '/home'
  )
})

const isCompactSearch = computed(() => {
  return !isHomePage.value
})
const flightOriginDestinationRef = ref(null)
const flightDatePickerRef = ref(null)
const flightPassengerRef = ref(null)
const flightOriginWrapperRef = ref(null)
const flightDateWrapperRef = ref(null)
const flightPassengerWrapperRef = ref(null)
const busOriginDestinationRef = ref(null)
const busDatePickerRef = ref(null)
const busDateWrapperRef = ref(null)
const ahuanDatePickerRef = ref(null)
const ahuanDateWrapperRef = ref(null)
const snappDatePickerRef = ref(null)
const snappDateWrapperRef = ref(null)

const busOrigin = ref(null)
const busDestination = ref(null)
const busDate = ref(null)
const busCities = computed(() => busStore.cities || [])
const busPopularCities = computed(() => busStore.popularCities || [])

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
const busStore=useBusStore()
const emit=defineEmits([
 'hotel-search',
 'flight-search',
 'bus-search'
])
const hotelCity=ref(null)

const hotelDate=ref(null)
const hotelCities=computed(()=>{

 return hotelStore.hotels.map(item=>({

  code:item.id,

  name:item.title

 }))

})

/* SnappTrip cities: فقط از Store */
const snappTripCity=ref(null)
const snappTripDate=ref(null)
const snappTripCities=computed(()=>{
 const items=Array.isArray(hotelStore.snappTripCities)
  ?hotelStore.snappTripCities
  :[]
 return items.map(item=>({
  code:Number(item?.id||0),
  name:String(item?.title||item?.name||''),
  stateName:String(item?.stateName||''),
  titleEn:String(item?.titleEn||'')
 })).filter(item=>item.code>0&&item.name)
})


const snappTripPopularCities = computed(() => {
  const items = Array.isArray(hotelStore.snappTripPopularCities)
    ? hotelStore.snappTripPopularCities
    : []
  return items.map(item => ({
    code: item.id,
    name: item.title,
    stateName: item.stateName,
    titleEn: item.titleEn
  }))
})

let snappTripCitiesRequest = null

async function ensureSnappTripCities() {

  const items =
    Array.isArray(hotelStore.snappTripCities)
      ? hotelStore.snappTripCities
      : []

  /*
   * اگر Store پر است، Request نزن.
   */
  if(items.length > 0) {
    return
  }


  /*
   * اگر همین الان Request در حال اجراست،
   * همان Request را منتظر بمان.
   */
  if(snappTripCitiesRequest) {
    return await snappTripCitiesRequest
  }


  try {

    snappTripCitiesRequest =
      hotelStore.loadSnappTripCities()

    await snappTripCitiesRequest

  }
  catch(error) {

    console.error(
      'LOAD SNAPPTRIP CITIES ERROR:',
      error
    )

  }
  finally {

    snappTripCitiesRequest = null

  }

}

async function applySnappTripCity(){

  if(
    !route.path.startsWith('/hotels/') ||
    Number(route.params.id||0)===3
  ){
    return
  }

  activeService.value='hotel'

  await ensureSnappTripCities()

  const cityId=
    Number(
      props.snappTripCityId ||
      route.query.cityId ||
      0
    )

  if(cityId<=0){
    snappTripCity.value=null
    return
  }

  const exists=
    snappTripCities.value.some(
      item=>Number(item.code)===cityId
    )

  snappTripCity.value=
    exists
      ?cityId
      :null
}
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

async function selectService(serviceKey, index) {

  activeService.value = serviceKey
  currentSlide.value = index

  /*
   * اگر کاربر وارد بخش هتل شد
   * و Store شهرها خالی بود،
   * دوباره از API دریافت کن.
   */
  if(serviceKey === 'hotel') {
    await ensureSnappTripCities()
  }

}
// جلوگیری از باز شدن تقویم هنگام پر شدن فرم از URL
let routeSyncDepth = 0
async function runRouteSync(action) {
  routeSyncDepth++
  try { await action() }
  finally {
    await nextTick()
    routeSyncDepth--
  }
}

// ابتدا تلاش می‌کنیم از API خود DatePicker استفاده کنیم؛
// اگر expose نشده باشد، روی کنترل داخلیِ قابل کلیک کلیک می‌کنیم.
async function openSingleDatePicker(componentRef, wrapperRef) {
  await nextTick()
  const instance = componentRef.value
  if (typeof instance?.openPicker === 'function') {
    instance.openPicker()
    return
  }
  if (typeof instance?.openDatePicker === 'function') {
    instance.openDatePicker()
    return
  }
  const wrapper = wrapperRef.value
  const target = wrapper?.querySelector('input:not([type="hidden"]), button, [role="button"]')
  target?.click()
}

// زنجیره انتخاب فیلدهای پرواز (داخلی و خارجی)
// در نسخه صفحه اصلی DatePicker از openDepartPicker استفاده می‌کند.
async function invokeChildOrClick(componentRef, methodNames, wrapperRef, selectors) {
  await nextTick()
  const instance = componentRef.value
  for (const name of methodNames) {
    if (typeof instance?.[name] === 'function') {
      await instance[name]()
      return true
    }
  }
  const root = wrapperRef.value
  for (const selector of selectors) {
    const el = root?.querySelector(selector)
    if (el && !el.disabled) {
      el.click()
      return true
    }
  }
  return false
}

async function openNextFlightDestination() {
  return invokeChildOrClick(
    flightOriginDestinationRef,
    ['openDestination'],
    flightOriginWrapperRef,
    ['[data-field="destination"]', '[data-destination]', 'input:nth-of-type(2)']
  )
}

async function openNextFlightDate() {
  return invokeChildOrClick(
    flightDatePickerRef,
    ['openDepartPicker', 'openPicker', 'openDatePicker'],
    flightDateWrapperRef,
    ['input[readonly]', 'input:not([type="hidden"])', 'button:not([disabled])', '[role="button"]']
  )
}

async function openNextFlightPassengers() {
  return invokeChildOrClick(
    flightPassengerRef,
    ['openSelector', 'openPassengerSelector'],
    flightPassengerWrapperRef,
    ['button:not([disabled])', '[role="button"]', 'input[readonly]']
  )
}

watch(origin, async (value, oldValue) => {
  if (routeSyncDepth || activeService.value !== 'flight' || !value || value === oldValue) return
  await openNextFlightDestination()
})
watch(destination, async (value, oldValue) => {
  if (routeSyncDepth || activeService.value !== 'flight' || !value || value === oldValue) return
  await openNextFlightDate()
})
watch(departDate, async (value, oldValue) => {
  if (routeSyncDepth || activeService.value !== 'flight' || !value || value === oldValue || travelType.value === 'round-trip') return
  await openNextFlightPassengers()
})
watch(returnDate, async (value, oldValue) => {
  if (routeSyncDepth || activeService.value !== 'flight' || !value || value === oldValue || travelType.value !== 'round-trip') return
  await openNextFlightPassengers()
})

watch(busOrigin, async (value, oldValue) => {
  if (routeSyncDepth || activeService.value !== 'bus' || !value || value === oldValue) return
  await nextTick()
  busOriginDestinationRef.value?.openDestination?.()
})
watch(busDestination, async (value, oldValue) => {
  if (routeSyncDepth || activeService.value !== 'bus' || !value || value === oldValue) return
  await openSingleDatePicker(busDatePickerRef, busDateWrapperRef)
})
watch(hotelCity, async (value, oldValue) => {
  if (routeSyncDepth || activeService.value !== 'hotelAhwan' || !value || value === oldValue) return
  if (!hotelCities.value.some(item => String(item.code) === String(value))) return
  await openSingleDatePicker(ahuanDatePickerRef, ahuanDateWrapperRef)
})
watch(snappTripCity, async (value, oldValue) => {
  if (routeSyncDepth || activeService.value !== 'hotel' || !value || value === oldValue) return
  if (!snappTripCities.value.some(item => String(item.code) === String(value))) return
  await openSingleDatePicker(snappDatePickerRef, snappDateWrapperRef)
})

// اتوبوس: تنها تاریخ رفت با قالب شمسی YYYYMMDD به صفحه نتایج می‌رود.
function toBusJalaliDate(value) {
  if (!value || Array.isArray(value)) return ''
  const raw = String(value).trim()
    .replace(/[۰-۹]/g, n => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(n)))
    .replace(/[٠-٩]/g, n => String('٠١٢٣٤٥٦٧٨٩'.indexOf(n)))
  if (raw.includes(',')) return ''
  const match = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:T.*)?$/)
    || raw.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (!match) return ''
  const [, y, m, d] = match
  const year = Number(y), month = Number(m), day = Number(d)
  if (month < 1 || month > 12 || day < 1 || day > 31) return ''
  if (year >= 1300 && year < 1500) return `${y}${m.padStart(2, '0')}${d.padStart(2, '0')}`
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return ''
  const parts = new Intl.DateTimeFormat('en-US-u-ca-persian', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC'
  }).formatToParts(date)
  const map = Object.fromEntries(parts.map(item => [item.type, item.value]))
  return `${map.year}${map.month.padStart(2, '0')}${map.day.padStart(2, '0')}`
}

async function searchBuses() {
  const departDate = toBusJalaliDate(busDate.value)
  if (!busOrigin.value || !busDestination.value || busOrigin.value === busDestination.value || !departDate) return
  const searchData = {
    origin: String(busOrigin.value).toUpperCase(),
    destination: String(busDestination.value).toUpperCase(),
    departDate
  }
  emit('bus-search', searchData)
  await router.push({ path: '/bus', query: searchData })
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

/*
|--------------------------------------------------------------------------
| Search SnappTrip Hotel
|--------------------------------------------------------------------------
*/

async function searchSnappTripHotel(){

 if(
  !snappTripCity.value ||
  !snappTripDate.value
 ){
  return
 }

 const dates=
  Array.isArray(snappTripDate.value)
   ?snappTripDate.value
   :String(snappTripDate.value)
     .split(',')

 const checkIn=
  String(
   dates[0]||
   ''
  )
   .trim()

 const checkOut=
  String(
   dates[1]||
   ''
  )
   .trim()

 if(
  !checkIn ||
  !checkOut
 ){
  return
 }

 const searchData={

  cityId:
   Number(
    snappTripCity.value
   ),

  checkIn,

  checkOut

 }

 emit(
  'hotel-search',
  searchData
 )

 await router.push({

  path:
   '/hotels',

  query:{

   cityId:
    searchData.cityId,

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
async function syncSnappTripHotelFormFromRoute(){

 if(route.path!=='/hotels')
  return

 const cityId=
  Number(route.query.cityId||0)

 const checkIn=
  String(route.query.checkIn||'').trim()

 const checkOut=
  String(route.query.checkOut||'').trim()

 activeService.value='hotel'

 await ensureSnappTripCities()

 const exists=
  cityId>0 &&
  snappTripCities.value.some(
   item=>Number(item.code)===cityId
  )

 snappTripCity.value=
  exists
   ?cityId
   :null

 snappTripDate.value=
  (checkIn&&checkOut)
   ?[checkIn,checkOut]
   :null
}

onMounted(async() => {

  if (
    route.path.startsWith('/flights')
  ) {

    await runRouteSync(syncFlightFormFromRoute)
  }

  if (route.path === '/hotels') {
    await runRouteSync(syncSnappTripHotelFormFromRoute)
  }

  if (route.path.startsWith('/hotels/')) {
    await runRouteSync(syncHotelFormFromRoute)
  }

  if (route.path === '/bus') {
    activeService.value = 'bus'
    busOrigin.value = route.query.origin || null
    busDestination.value = route.query.destination || null
    busDate.value = route.query.departDate || null
  }
})
watch(
  () => [
    route.params.id,
    route.query.checkIn,
    route.query.checkOut
  ],

  async() => {

    if (
      route.path.startsWith('/hotels/')
    ) {
      await runRouteSync(syncHotelFormFromRoute)
    }
  }
)
watch(
 () => [
  route.query.cityId,
  route.query.checkIn,
  route.query.checkOut
 ],
 async() => {
  if(route.path==='/hotels'){
   await runRouteSync(syncSnappTripHotelFormFromRoute)
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
    if (route.path.startsWith('/flights')) {
      runRouteSync(syncFlightFormFromRoute)
    }
  }
)

watch(
  () => props.snappTripCityId,

  async() => {

    await runRouteSync(applySnappTripCity)

  },

  {
    immediate:true
  }
)


watch(
  () => [route.query.origin, route.query.destination, route.query.departDate],
  async () => {
    if (route.path !== '/bus') return
    await runRouteSync(() => {
      busOrigin.value = route.query.origin || null
      busDestination.value = route.query.destination || null
      busDate.value = route.query.departDate || null
    })
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
async function syncHotelFormFromRoute() {

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


  const isAhuanHotel =
    hotelId === 3


  if (isAhuanHotel) {

    activeService.value =
      'hotelAhwan'

    hotelCity.value =
      hotelId > 0
        ? hotelId
        : null

    hotelDate.value =
      checkIn && checkOut
        ? [
          checkIn,
          checkOut
        ]
        : null

    return
  }


  /*
   * SnappTrip Detail
   */
  activeService.value =
    'hotel'

  snappTripDate.value =
    checkIn && checkOut
      ? [
        checkIn,
        checkOut
      ]
      : null


  /*
   * بعد از Refresh ابتدا Cities Store را آماده می‌کنیم
   * و سپس cityId واقعی هتل را روی Autocomplete می‌گذاریم.
   */
  await applySnappTripCity()

}
</script>

<style scoped>
:deep(.hotel-city-compact input) {
  height: 44px !important;
  min-height: 44px !important;
  font-size: 13px !important;
  font-weight: bold;
}

:deep(.hotel-city-compact > div) {
  min-height: 44px !important;
}
:deep(.flight-radio-aligned) {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  flex-wrap: nowrap !important;
  min-width: 0;
  width: 100%;
  white-space: nowrap !important;
}

:deep(.flight-radio-aligned label),
:deep(.flight-radio-aligned span) {
  font-size: 13px !important;
  font-weight: 300 !important;
  line-height: 1.6 !important;
  white-space: nowrap !important;
}
/* در صورت نیاز به ترنزیشن یا استایل‌های خاص برای کامپوننت */
</style>
