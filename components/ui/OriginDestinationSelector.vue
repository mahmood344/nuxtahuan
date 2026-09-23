<template>

  <div
    dir="rtl"
    class="route-selector-container flex w-full justify-center"
    :class="compact ? 'p-0' : 'p-4'"
  >

    <div

      class="
        route-selector
        relative
        flex
        w-full
        min-w-0
        items-center
        rounded-[12px]
        border
        border-gray-300
        bg-white
      "
      :class="
        compact
          ? 'h-[44px] max-w-[280px]'
          : 'h-[54px] max-w-[500px]'
      "

    >

      <!-- بخش مبدا -->

      <div class="relative h-full min-w-0 flex-1 group">

        <label class="route-label absolute -top-3 z-20 whitespace-nowrap bg-white text-gray-400"
        :class="
          compact
            ? 'right-3 px-1.5 text-[10px]'
            : 'right-6 px-2 text-[11px]'
        ">

          مبدا (شهر)

        </label>

        <!-- نمایش مقدار انتخاب شده -->

        <div 

          @click="isMabdaOpen = !isMabdaOpen; isMaghsadOpen = false"

          class="route-field flex h-full w-full min-w-0 cursor-pointer items-center text-gray-700"
          :class="compact ? 'px-3' : 'px-6'"

        >

          <i 

            v-if="mabda"

            @click.stop="clearMabda"

            class="bi bi-x shrink-0 text-xl text-gray-400 transition-colors hover:text-red-500"

            title="پاک کردن"

          ></i>

          <i 

            v-else

            class="bi bi-chevron-down shrink-0 text-xs text-gray-400"

          ></i>

          <span v-if="mabda" class="mr-2 min-w-0 truncate text-[11px]">

  {{

    sendFlightType === 'international'

      ? mabda.iataCode

      : mabda.cityNicName

  }}

</span>

          <span v-else class="mr-2 min-w-0 truncate text-[10px] font-bold text-gray-400">انتخاب مبدا</span>

        </div>

        <!-- لیست شهرهای مبدا -->

        <div v-if="isMabdaOpen" class="custom-dropdown" :class="{ 'custom-dropdown-compact-origin': compact }">

          <!-- input سرچ -->

          <div class="relative w-full">

            <input

              v-model="searchMabda"

              placeholder="جستجوی شهر..."

              class="w-full px-3 py-2 text-sm border-b border-[var(--color-gray-100)] outline-none"

            />

            <span

              v-if="loadingMabda"

              class="absolute left-3 top-2 animate-spin text-gray-400"

            >

              <i class="bi bi-arrow-repeat"></i>

            </span>

          </div>

          <!-- عنوان پرتردد -->

          <div class="px-4 py-2 text-[11px] text-gray-400 bg-gray-50/50">

            پرتردد

          </div>

          <!-- لیست شهرها -->

          <div 

  v-for="city in (searchMabda ? dropdownCities : popularCities)"

  :key="city.id || city.iataCode"

  @click="selectMabda(city)"

  class="city-item"

>

  <template v-if="sendFlightType==='international'">

    <div class="flex items-center justify-between gap-3">

      <div class="flex flex-col">

        <span class="font-bold text-gray-700 text-[11px]">

          {{ city.nicName || city.cityNicName }}

        </span>

        <span class="mt-1 text-[11px] text-gray-400">

          {{ city.cityNicName }} - {{ city.countryNicName }}

        </span>

      </div>

      <span

        dir="ltr"

        class="shrink-0 rounded-md text-[9px] bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600"

      >

        {{ city.iataCode }}

      </span>

    </div>

  </template>

  <template v-else>

    {{ city.cityNicName }}

  </template>

</div>

        </div>

      </div>

      <!-- دکمه جابجایی (با استایل و وسط‌چین دقیق شما) -->

      <div class="swap-zone relative flex h-full shrink-0 items-center justify-center"
          :class="compact ? 'w-10' : 'w-16'">

        <div class="absolute inset-y-0 w-px bg-gray-300"></div>

        <button

          :class="{ disableBtn: !isFormValid }"

          :disabled="!isFormValid"

          @click="swapFields"

          class="p-1 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-300 relative z-10 hover:scale-110 transition-all"

        >

          <i class="bi bi-arrow-left-right w-5 h-5 text-gray-600"></i>

        </button>

      </div>

      <!-- بخش مقصد -->

      <div class="relative h-full min-w-0 flex-1 group">

        <label class="route-label absolute -top-3 z-20 whitespace-nowrap bg-white text-gray-400"
        :class="
          compact
            ? 'right-2 px-1.5 text-[10px]'
            : 'right-1 px-2 text-[11px]'
        ">

          مقصد (شهر)

        </label>

        <div 

          @click="isMaghsadOpen = !isMaghsadOpen; isMabdaOpen = false"

          class="route-field flex h-full w-full min-w-0 cursor-pointer items-center text-gray-700"
          :class="compact ? 'px-3' : 'px-6'"

        >

          <i 

            v-if="maghsad"

            @click.stop="clearMaghsad"

            class="bi bi-x shrink-0 text-xl text-gray-400 transition-colors hover:text-red-500"

            title="پاک کردن"

          ></i>

          <i 

            v-else

            class="bi bi-chevron-down shrink-0 text-xs text-gray-400"

          ></i>

          <span v-if="maghsad" class="mr-2 min-w-0 truncate text-[11px]">

  {{

    sendFlightType === 'international'

      ? maghsad.iataCode

      : maghsad.cityNicName

  }}

</span>

          <span v-else class="mr-2 min-w-0 truncate text-[10px] font-bold text-gray-400">انتخاب مقصد</span>

        </div>

        <!-- لیست شهرهای مقصد -->

        <div v-if="isMaghsadOpen" class="custom-dropdown" :class="{ 'custom-dropdown-compact-destination': compact }">

          <!-- input سرچ -->

          <div class="relative w-full">

            <input

              v-model="searchMaghsad"

              placeholder="جستجوی شهر..."

              class="w-full px-3 py-2 text-sm border-b border-[var(--color-gray-100)] outline-none"

            />

            <span

              v-if="loadingMaghsad"

              class="absolute left-3 top-2 animate-spin text-gray-400"

            >

              <i class="bi bi-arrow-repeat"></i>

            </span>

          </div>

          <div class="px-4 py-2 text-[11px] text-gray-400 bg-gray-50/50">

            پرتردد

          </div>

          <div 

  v-for="city in (searchMaghsad ? dropdownCities : popularCities)"

  :key="city.id || city.iataCode"

  @click="selectMaghsad(city)"

  class="city-item"

>

  <template v-if="sendFlightType==='international'">

    <div class="flex items-center justify-between gap-3">

      <div class="flex flex-col">

        <span class="font-bold text-gray-700 text-[11px]">

          {{ city.nicName || city.cityNicName }}

        </span>

        <span class="mt-1 text-[11px] text-gray-400">

          {{ city.cityNicName }} - {{ city.countryNicName }}

        </span>

      </div>

      <span

        dir="ltr"

        class="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-xs font-bold text-[10px] text-gray-600"

      >

        {{ city.iataCode }}

      </span>

    </div>

  </template>

  <template v-else>

    {{ city.cityNicName }}

  </template>

</div>

        </div>

      </div>

    </div>

  </div>

</template>

<script setup>

import {

  ref,

  computed,

  watch,

  onMounted,

  nextTick

} from "vue"

import { useFlightStore } from "@/stores/flights"
const route = useRoute()

const props = defineProps({
compact: {
    type: Boolean,
    default: false
  },
  sendFlightType: {

    type: String,

    default: 'domestic'

  },

  mabda: {

    type: [String, Number],

    default: null

  },

  maghsad: {

    type: [String, Number],

    default: null

  }

})

const toast=useToast()

const emit = defineEmits([

  'update:mabda',

  'update:maghsad',

  'destination-selected'

])

const flightStore = useFlightStore()




const mabda = ref(null)

const maghsad = ref(null)

const searchMabda = ref("")

const searchMaghsad = ref("")

const isMabdaOpen = ref(false)

const isMaghsadOpen = ref(false)

const dropdownCities = ref([])

const loadingMabda = ref(false)

const loadingMaghsad = ref(false)

const isSelecting = ref(false)

const internationalPopularCities = ref([])

const {public:{baseUrl}} = useRuntimeConfig()

/* -----------------------

استخراج کد مناسب جهت ارسال به والد (Emit)

در پرواز داخلی: cityCode

در پرواز خارجی: iataCode

----------------------- */

const getCodeForEmit = (city) => {

  if (!city) return null

  return props.sendFlightType === "domestic" ? city.cityCode : city.iataCode

}

const normalizeCode = (value) => {

  return String(value || '')

    .trim()

    .toUpperCase()

}

const findDomesticCityByCode = (code) => {

  const normalizedCode =

    normalizeCode(code)

  if (!normalizedCode)

    return null

  const cities = [

    ...(flightStore.popularCities || []),

    ...(flightStore.iranAirports || [])

  ]

  return (

    cities.find(city =>

      normalizeCode(city?.cityCode) === normalizedCode ||

      normalizeCode(city?.iataCode) === normalizedCode

    ) || null

  )

}

const findInternationalCityByCode =

  async (code) => {

    const normalizedCode =

      normalizeCode(code)

    if (!normalizedCode)

      return null

    try {

      const res = await $fetch(

        `https://api.ahuan.ir/api/BasicInfo/airports/${normalizedCode}`

      )

      const items =

        Array.isArray(res)

          ? res

          : res

            ? [res]

            : []

      return (

        items.find(city =>

          normalizeCode(city?.iataCode) === normalizedCode

        ) ||

        items[0] ||

        null

      )

    }

    catch (error) {

      console.error(

        'Resolve airport error:',

        error

      )

      return null

    }

  }

  watch(

  [

    () => props.mabda,

    () => props.sendFlightType

  ],

  async ([code, type]) => {

    if (!code) {

      mabda.value = null

      searchMabda.value = ''

      isMabdaOpen.value = false

      return

    }

    let city = null

    if (type === 'international') {

      city =

        await findInternationalCityByCode(code)

    }

    else {

      city =

        findDomesticCityByCode(code)

    }

    if (!city) return

    isSelecting.value = true

    mabda.value = city

    searchMabda.value =

      city.nicName ||

      city.cityNicName ||

      ''

    isMabdaOpen.value = false

    await nextTick()

    isSelecting.value = false

  },

  {

    immediate: true

  }

)

watch(

  [

    () => props.maghsad,

    () => props.sendFlightType

  ],

  async ([code, type]) => {

    if (!code) {

      maghsad.value = null

      searchMaghsad.value = ''

      isMaghsadOpen.value = false

      return

    }

    let city = null

    if (type === 'international') {

      city =

        await findInternationalCityByCode(code)

    }

    else {

      city =

        findDomesticCityByCode(code)

    }

    if (!city) return

    isSelecting.value = true

    maghsad.value = city

    searchMaghsad.value =

      city.nicName ||

      city.cityNicName ||

      ''

    isMaghsadOpen.value = false

    await nextTick()

    isSelecting.value = false

  },

  {

    immediate: true

  }

)

/* -----------------------

popular cities

----------------------- */

const popularCities = computed(() => {

  if (props.sendFlightType === "domestic") {

    return flightStore.popularCities || []

  }

  return internationalPopularCities.value

})

/* -----------------------

پرتردد خارجی

----------------------- */

const fetchInternationalPopular=async()=>{

  try{

    const res=

      await $fetch(

        'https://api.ahuan.ir/api/BasicInfo/default-airports'

      )

    if(

      !Array.isArray(res)||

      !res.length

    ){

      throw new Error(

        'اطلاعاتی دریافت نشد'

      )

    }

    internationalPopularCities.value=

      res

  }catch(err){

    console.error(

      'popular airports error:',

      err

    )

    internationalPopularCities.value=[]

    toast.error(

      'خطا در دریافت اطلاعات'

    )

  }

}

/* -----------------------

فیلتر داخلی

----------------------- */

const filterDomesticCities = (query) => {

  if (!flightStore?.iranAirports) return []

  return flightStore.iranAirports.filter(city =>

    city.cityNicName.toLowerCase().includes(query.toLowerCase())

  )

}

/* -----------------------

search cities

----------------------- */

const searchCities = async (query, type) => {

  if (!query) {

    dropdownCities.value = []

    return

  }

  if (props.sendFlightType === "domestic") {

    dropdownCities.value = filterDomesticCities(query)

    return

  }

  try {

    if (type === "mabda") loadingMabda.value = true

    if (type === "maghsad") loadingMaghsad.value = true

    const apiUrl = `https://api.ahuan.ir/api/BasicInfo/airports/${query}`

    const res = await $fetch(apiUrl)

    if (Array.isArray(res)) {

      dropdownCities.value = res

    } else if (res && typeof res === 'object') {

      dropdownCities.value = [res]

    } else {

      dropdownCities.value = []

    }

  } catch (err) {

    console.error("Airport search error:", err)

    dropdownCities.value = []

  } finally {

    if (type === "mabda") loadingMabda.value = false

    if (type === "maghsad") loadingMaghsad.value = false

  }

}

/* -----------------------

watch mabda

----------------------- */

watch(searchMabda, (val) => {

  if (isSelecting.value) return

  if (val) {

    searchCities(val, "mabda")

    isMabdaOpen.value = true

  } else {

    dropdownCities.value = popularCities.value

  }

})

/* -----------------------

watch maghsad

----------------------- */

watch(searchMaghsad, (val) => {

  if (isSelecting.value) return

  if (val) {

    searchCities(val, "maghsad")

    isMaghsadOpen.value = true

  } else {

    dropdownCities.value = popularCities.value

  }

})

/* -----------------------

flightType change (تغییر نوع پرواز و پاکسازی ورودی‌ها)

----------------------- */

watch(

  () => props.sendFlightType,

  async (type) => {

    if (type === 'international') {

      await fetchInternationalPopular()

    }

    isMabdaOpen.value = false

    isMaghsadOpen.value = false

    dropdownCities.value =

      popularCities.value

  },

  {

    immediate: true

  }

)

/* -----------------------

form valid

----------------------- */

const isFormValid = computed(() => {

  return mabda.value && maghsad.value

})

/* -----------------------

swap

----------------------- */

const swapFields = () => {

  if (!isFormValid.value) return

  isSelecting.value = true

  const temp = mabda.value

  mabda.value = maghsad.value

  maghsad.value = temp

  const tempSearch = searchMabda.value

  searchMabda.value = searchMaghsad.value

  searchMaghsad.value = tempSearch

  isMabdaOpen.value = false

  isMaghsadOpen.value = false

  dropdownCities.value = []

  // ارسال کد مناسب جابجا شده به والد

  emit('update:mabda', getCodeForEmit(mabda.value))

  emit('update:maghsad', getCodeForEmit(maghsad.value))

  setTimeout(() => {

    isSelecting.value = false

  }, 100)

}

/* -----------------------

select city

----------------------- */

const selectMabda = async (city) => {

  isSelecting.value = true

  mabda.value = city

  searchMabda.value =

    city.cityNicName

  emit(

    'update:mabda',

    getCodeForEmit(city)

  )

  // مبدا بسته شود

  isMabdaOpen.value = false

  // داده‌های مقصد آماده شود

  searchMaghsad.value = ""

  dropdownCities.value =

    popularCities.value

  await nextTick()

  // مقصد خودکار باز شود

  isMaghsadOpen.value = true

  setTimeout(() => {

    isSelecting.value = false

  }, 100)

}

const selectMaghsad = (city) => {

  isSelecting.value = true

  maghsad.value = city

  searchMaghsad.value =

    city.cityNicName

  const code =

    getCodeForEmit(city)

  emit(

    'update:maghsad',

    code

  )

  isMaghsadOpen.value = false

  dropdownCities.value = []

  // به والد می‌گوییم مقصد انتخاب شد

  emit(

    'destination-selected',

    code

  )

  setTimeout(() => {

    isSelecting.value = false

  }, 100)

}

/* -----------------------

clear

----------------------- */

const clearMabda = () => {

  mabda.value = null

  searchMabda.value = ""

  emit('update:mabda', null)

  dropdownCities.value = popularCities.value

  isMabdaOpen.value = true

}

const clearMaghsad = () => {

  maghsad.value = null

  searchMaghsad.value = ""

  emit('update:maghsad', null)

  dropdownCities.value = popularCities.value

  isMaghsadOpen.value = true

}

/* -----------------------

mounted

----------------------- */

onMounted(async () => {

  if (props.sendFlightType === "international") {

    await fetchInternationalPopular()

  }

  dropdownCities.value = popularCities.value

})

</script>

<style scoped>

.route-selector-container {
  container-type: inline-size;
}

.route-selector {
  min-width: 0;
}

/* اگر حتی در حالت compact خود Parent از 280px هم کوچک‌تر شد */
@container (max-width: 280px) {
  .route-field {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  .swap-zone {
    width: 36px !important;
  }

  .route-field span {
    margin-right: 4px;
    font-size: 9px;
  }

  .route-label {
    padding-left: 4px !important;
    padding-right: 4px !important;
    font-size: 9px !important;
  }
}

/* استایل لیست شهرها */

.custom-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.custom-dropdown-compact-origin,
.custom-dropdown-compact-destination {
  width: min(280px, calc(100vw - 32px));
}

.custom-dropdown-compact-origin {
  right: 0;
}

.custom-dropdown-compact-destination {
  right: auto;
  left: 0;
}

.city-item {

  padding: 12px 16px;

  font-size: 14px;

  color: #374151;

  cursor: pointer;

  border-bottom: 1px solid #f3f4f6;

  transition: background 0.2s;

}

.city-item:last-child {

  border-bottom: none;

}

.city-item:hover {

  background-color: #f9fafb;

}

/* استایل دکمه غیرفعال شما */

.disableBtn {

  background: var(--color-gray-200);

  cursor: not-allowed;

}

.shadow-sm {

  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

}

.border-gray-300 {

  border-color: #d1d5db;

}

.w-px {

  width: 1px;

}

/* اسکرول‌بار زیبا برای لیست */

.custom-dropdown::-webkit-scrollbar {

  width: 4px;

}

.custom-dropdown::-webkit-scrollbar-thumb {

  background: #e5e7eb;

  border-radius: 10px;

}

</style>