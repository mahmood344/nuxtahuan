
<template>
  <div
    dir="rtl"
    class="route-selector-container flex w-full justify-center"
    :class="compact ? 'p-0' : 'p-4'"
  >
    <div
      class="route-selector relative flex w-full min-w-0 items-center rounded-[12px] border border-gray-300 bg-white"
      :class="compact ? 'h-[44px] max-w-[280px]' : 'h-[54px] max-w-[500px]'"
    >
      <!-- مبدا -->
      <div class="relative h-full min-w-0 flex-1 group">
        <label
          class="route-label absolute -top-3 z-20 whitespace-nowrap bg-white text-gray-400"
          :class="compact ? 'right-3 px-1.5 text-[10px]' : 'right-6 px-2 text-[11px]'"
        >
          مبدا (شهر)
        </label>

        <div
          class="route-field flex h-full w-full min-w-0 items-center text-gray-700"
          :class="compact ? 'px-3' : 'px-6'"
        >
          <i
            v-if="mabda || searchMabda"
            class="bi bi-x shrink-0 cursor-pointer text-xl text-gray-400 hover:text-red-500"
            title="پاک کردن"
            @click.stop="clearMabda"
          ></i>

          <i
            v-else
            class="bi bi-chevron-down shrink-0 text-xs text-gray-400"
          ></i>

          <input
            ref="mabdaInputRef"
            v-model="searchMabda"
            type="text"
            autocomplete="off"
            :placeholder="compact ? 'مبدا' : 'مبدا را تایپ کنید'"
            class="mr-2 h-full w-full min-w-0 bg-transparent text-[13px] font-bold text-gray-700 outline-none placeholder:text-gray-400"
            @focus="openMabda"
            @input="onMabdaInput"
            @keydown.enter.prevent="selectFirstMabda"
            @keydown.esc="isMabdaOpen = false"
          />
        </div>

        <!-- پیشنهادهای مبدا -->
        <div
          v-if="isMabdaOpen"
          class="custom-dropdown"
          :class="{ 'custom-dropdown-compact-origin': compact }"
        >
          <div class="flex items-center justify-between border-b border-gray-100 px-4 py-2 text-[11px] text-gray-400">
            <span>{{ searchMabda.trim() ? 'نتایج جستجو' : 'پرتردد' }}</span>
            <i
              v-if="loadingMabda"
              class="bi bi-arrow-repeat animate-spin"
            ></i>
          </div>

          <div
            v-for="(city, index) in mabdaCities"
            :key="getCityKey(city, index)"
            class="city-item"
            @click="selectMabda(city)"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-[11px] font-bold text-gray-700">
                  {{ getCityDisplayName(city) }}
                </span>

                <span
                  v-if="sendFlightType === 'international'"
                  class="mt-1 truncate text-[10px] text-gray-400"
                >
                  {{ city.cityNicName || city.cityName }}
                  <template v-if="city.countryNicName">
                    - {{ city.countryNicName }}
                  </template>
                </span>
              </div>

              <span
                dir="ltr"
                class="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600"
              >
                {{ getCodeForEmit(city) }}
              </span>
            </div>
          </div>

          <div
            v-if="!loadingMabda && !mabdaCities.length"
            class="px-4 py-5 text-center text-xs text-gray-400"
          >
            شهری یافت نشد
          </div>
        </div>
      </div>

      <!-- دکمه جابه‌جایی -->
      <div
        class="swap-zone relative flex h-full shrink-0 items-center justify-center"
        :class="compact ? 'w-10' : 'w-16'"
      >
        <div class="absolute inset-y-0 w-px bg-gray-300"></div>

        <button
          type="button"
          :disabled="!isFormValid"
          :class="{ disableBtn: !isFormValid }"
          class="relative z-10 flex items-center justify-center rounded-full border border-gray-300 bg-white p-1 shadow-sm transition-all hover:scale-110"
          @click="swapFields"
        >
          <i class="bi bi-arrow-left-right h-5 w-5 text-gray-600"></i>
        </button>
      </div>

      <!-- مقصد -->
      <div class="relative h-full min-w-0 flex-1 group">
        <label
          class="route-label absolute -top-3 z-20 whitespace-nowrap bg-white text-gray-400"
          :class="compact ? 'right-2 px-1.5 text-[10px]' : 'right-1 px-2 text-[11px]'"
        >
          مقصد (شهر)
        </label>

        <div
          class="route-field flex h-full w-full min-w-0 items-center text-gray-700"
          :class="compact ? 'px-3' : 'px-6'"
        >
          <i
            v-if="maghsad || searchMaghsad"
            class="bi bi-x shrink-0 cursor-pointer text-xl text-gray-400 hover:text-red-500"
            title="پاک کردن"
            @click.stop="clearMaghsad"
          ></i>

          <i
            v-else
            class="bi bi-chevron-down shrink-0 text-xs text-gray-400"
          ></i>

          <input
            ref="maghsadInputRef"
            v-model="searchMaghsad"
            type="text"
            autocomplete="off"
            :placeholder="compact ? 'مقصد' : 'مقصد را تایپ کنید'"
            class="mr-2 h-full w-full min-w-0 bg-transparent text-[13px] font-bold text-gray-700 outline-none placeholder:text-gray-400"
            @focus="openMaghsad"
            @input="onMaghsadInput"
            @keydown.enter.prevent="selectFirstMaghsad"
            @keydown.esc="isMaghsadOpen = false"
          />
        </div>

        <!-- پیشنهادهای مقصد -->
        <div
          v-if="isMaghsadOpen"
          class="custom-dropdown"
          :class="{ 'custom-dropdown-compact-destination': compact }"
        >
          <div class="flex items-center justify-between border-b border-gray-100 px-4 py-2 text-[11px] text-gray-400">
            <span>{{ searchMaghsad.trim() ? 'نتایج جستجو' : 'پرتردد' }}</span>
            <i
              v-if="loadingMaghsad"
              class="bi bi-arrow-repeat animate-spin"
            ></i>
          </div>

          <div
            v-for="(city, index) in maghsadCities"
            :key="getCityKey(city, index)"
            class="city-item"
            @click="selectMaghsad(city)"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-[11px] font-bold text-gray-700">
                  {{ getCityDisplayName(city) }}
                </span>

                <span
                  v-if="sendFlightType === 'international'"
                  class="mt-1 truncate text-[10px] text-gray-400"
                >
                  {{ city.cityNicName || city.cityName }}
                  <template v-if="city.countryNicName">
                    - {{ city.countryNicName }}
                  </template>
                </span>
              </div>

              <span
                dir="ltr"
                class="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600"
              >
                {{ getCodeForEmit(city) }}
              </span>
            </div>
          </div>

          <div
            v-if="!loadingMaghsad && !maghsadCities.length"
            class="px-4 py-5 text-center text-xs text-gray-400"
          >
            شهری یافت نشد
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
  onUnmounted,
  nextTick
} from 'vue'

import { useFlightStore } from '@/stores/flights'

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

const emit = defineEmits([
  'update:mabda',
  'update:maghsad',
  'destination-selected'
])

const flightStore = useFlightStore()
const toast = useToast()

const mabda = ref(null)
const maghsad = ref(null)

const searchMabda = ref('')
const searchMaghsad = ref('')

const isMabdaOpen = ref(false)
const isMaghsadOpen = ref(false)

const mabdaInputRef = ref(null)
const maghsadInputRef = ref(null)

const mabdaCities = ref([])
const maghsadCities = ref([])

const loadingMabda = ref(false)
const loadingMaghsad = ref(false)

const internationalPopularCities = ref([])

let mabdaTimer = null
let maghsadTimer = null

let mabdaRequestId = 0
let maghsadRequestId = 0

let mabdaResolveId = 0
let maghsadResolveId = 0

// کد قابل ارسال به والد
function normalizeCode(value) {
  return String(value ?? '')
    .trim()
    .toUpperCase()
}

function getCodeForEmit(city) {
  if (!city) return null

  const cityCode = normalizeCode(city.cityCode)
  const iataCode = normalizeCode(city.iataCode)

  if (props.sendFlightType === 'international') {
    return iataCode || cityCode || null
  }

  return cityCode || iataCode || null
}

// عنوان نمایشی شهر
function getCityDisplayName(city) {
  if (!city) return ''

  if (props.sendFlightType === 'international') {
    return (
      city.nicName ||
      city.cityNicName ||
      city.name ||
      city.cityName ||
      city.iataCode ||
      city.cityCode ||
      ''
    )
  }

  return (
    city.cityNicName ||
    city.nicName ||
    city.cityName ||
    city.name ||
    city.iataCode ||
    city.cityCode ||
    ''
  )
}

function getInputDisplayName(city) {
  if (!city) return ''

  if (props.sendFlightType === 'international') {
    return normalizeCode(
      city.iataCode || city.cityCode
    ) || getCityDisplayName(city)
  }

  return getCityDisplayName(city)
}

function getCityKey(city, index) {
  return `${city?.id || ''}-${getCodeForEmit(city) || index}`
}

// یکسان‌سازی متن برای سرچ
function normalizeText(value) {
  return String(value ?? '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .trim()
    .toLowerCase()
}

// لیست شهرهای پرتردد
const popularCities = computed(() => {
  return props.sendFlightType === 'domestic'
    ? flightStore.popularCities || []
    : internationalPopularCities.value
})

// حذف شهرهای تکراری با حفظ کد معتبر
function uniqueCities(items) {
  const seen = new Set()

  return items.filter(city => {
    const code = getCodeForEmit(city)

    if (!code || seen.has(code)) return false

    seen.add(code)
    return true
  })
}

// سرچ داخلی
function filterDomesticCities(query) {
  const q = normalizeText(query)

  if (!q) {
    return uniqueCities(flightStore.popularCities || [])
  }

  const cities = [
    ...(flightStore.popularCities || []),
    ...(flightStore.iranAirports || [])
  ]

  return uniqueCities(
    cities.filter(city => {
      const values = [
        city.cityNicName,
        city.cityName,
        city.nicName,
        city.name,
        city.cityCode,
        city.iataCode
      ]

      return values.some(value =>
        normalizeText(value).includes(q)
      )
    })
  )
}

// دریافت شهرهای پرتردد خارجی
async function fetchInternationalPopular() {
  try {
    const res = await $fetch(
      'https://api.ahuan.ir/api/BasicInfo/default-airports'
    )

    internationalPopularCities.value =
      Array.isArray(res) ? res : []

  } catch (error) {
    console.error('Popular airports error:', error)
    internationalPopularCities.value = []
    toast.error('خطا در دریافت اطلاعات فرودگاه‌ها')
  }
}

// جستجوی خارجی
async function fetchInternationalCities(query, type) {
  const requestId = type === 'mabda'
    ? ++mabdaRequestId
    : ++maghsadRequestId

  if (type === 'mabda') loadingMabda.value = true
  else loadingMaghsad.value = true

  try {
    const res = await $fetch(
      `https://api.ahuan.ir/api/BasicInfo/airports/${encodeURIComponent(query)}`
    )

    const cities = Array.isArray(res)
      ? res
      : res && typeof res === 'object'
        ? [res]
        : []

    if (type === 'mabda' && requestId === mabdaRequestId) {
      mabdaCities.value = uniqueCities(cities)
    }

    if (type === 'maghsad' && requestId === maghsadRequestId) {
      maghsadCities.value = uniqueCities(cities)
    }

  } catch (error) {
    console.error('Airport search error:', error)

    if (type === 'mabda' && requestId === mabdaRequestId) {
      mabdaCities.value = []
    }

    if (type === 'maghsad' && requestId === maghsadRequestId) {
      maghsadCities.value = []
    }

  } finally {
    if (type === 'mabda' && requestId === mabdaRequestId) {
      loadingMabda.value = false
    }

    if (type === 'maghsad' && requestId === maghsadRequestId) {
      loadingMaghsad.value = false
    }
  }
}

// بارگذاری نتایج مبدا
function searchOriginCities(query) {
  clearTimeout(mabdaTimer)

  // بی‌اعتبار کردن درخواست قبلی
  mabdaRequestId++

  const q = String(query ?? '').trim()

  if (!q) {
    loadingMabda.value = false
    mabdaCities.value = uniqueCities(popularCities.value)
    return
  }

  if (props.sendFlightType === 'domestic') {
    loadingMabda.value = false
    mabdaCities.value = filterDomesticCities(q)
    return
  }

  loadingMabda.value = true

  mabdaTimer = setTimeout(() => {
    fetchInternationalCities(q, 'mabda')
  }, 300)
}

// بارگذاری نتایج مقصد
function searchDestinationCities(query) {
  clearTimeout(maghsadTimer)

  maghsadRequestId++

  const q = String(query ?? '').trim()

  if (!q) {
    loadingMaghsad.value = false
    maghsadCities.value = uniqueCities(popularCities.value)
    return
  }

  if (props.sendFlightType === 'domestic') {
    loadingMaghsad.value = false
    maghsadCities.value = filterDomesticCities(q)
    return
  }

  loadingMaghsad.value = true

  maghsadTimer = setTimeout(() => {
    fetchInternationalCities(q, 'maghsad')
  }, 300)
}

// باز کردن مبدأ
function openMabda() {
  isMabdaOpen.value = true
  isMaghsadOpen.value = false

  if (mabda.value && searchMabda.value === getInputDisplayName(mabda.value)) {
    mabdaCities.value = uniqueCities(popularCities.value)
  } else {
    searchOriginCities(searchMabda.value)
  }
}

// باز کردن مقصد
function openMaghsad() {
  isMaghsadOpen.value = true
  isMabdaOpen.value = false

  if (maghsad.value && searchMaghsad.value === getInputDisplayName(maghsad.value)) {
    maghsadCities.value = uniqueCities(popularCities.value)
  } else {
    searchDestinationCities(searchMaghsad.value)
  }
}

// تایپ در مبدأ
function onMabdaInput() {
  mabda.value = null

  emit('update:mabda', null)

  isMabdaOpen.value = true
  isMaghsadOpen.value = false

  searchOriginCities(searchMabda.value)
}

// تایپ در مقصد
function onMaghsadInput() {
  maghsad.value = null

  emit('update:maghsad', null)

  isMaghsadOpen.value = true
  isMabdaOpen.value = false

  searchDestinationCities(searchMaghsad.value)
}

// انتخاب مبدأ
async function selectMabda(city) {
  const code = getCodeForEmit(city)
  if (!code) return

  clearTimeout(mabdaTimer)
  mabdaRequestId++

  mabda.value = city
  searchMabda.value = getInputDisplayName(city)

  loadingMabda.value = false
  isMabdaOpen.value = false

  emit('update:mabda', code)

  // بعد از انتخاب مبدأ، مقصد آماده انتخاب شود
  if (!maghsad.value) {
    searchMaghsad.value = ''
    maghsadCities.value = uniqueCities(popularCities.value)

    await nextTick()
    maghsadInputRef.value?.focus()
  }
}

// انتخاب مقصد
function selectMaghsad(city) {
  const code = getCodeForEmit(city)
  if (!code) return

  clearTimeout(maghsadTimer)
  maghsadRequestId++

  maghsad.value = city
  searchMaghsad.value = getInputDisplayName(city)

  loadingMaghsad.value = false
  isMaghsadOpen.value = false

  emit('update:maghsad', code)
  emit('destination-selected', code)
}

// انتخاب اولین پیشنهاد با Enter
function selectFirstMabda() {
  if (mabdaCities.value.length) {
    selectMabda(mabdaCities.value[0])
  }
}

function selectFirstMaghsad() {
  if (maghsadCities.value.length) {
    selectMaghsad(maghsadCities.value[0])
  }
}

// پاک کردن مبدأ
async function clearMabda() {
  clearTimeout(mabdaTimer)
  mabdaRequestId++

  mabda.value = null
  searchMabda.value = ''

  emit('update:mabda', null)

  mabdaCities.value = uniqueCities(popularCities.value)
  loadingMabda.value = false

  isMabdaOpen.value = true
  isMaghsadOpen.value = false

  await nextTick()
  mabdaInputRef.value?.focus()
}

// پاک کردن مقصد
async function clearMaghsad() {
  clearTimeout(maghsadTimer)
  maghsadRequestId++

  maghsad.value = null
  searchMaghsad.value = ''

  emit('update:maghsad', null)

  maghsadCities.value = uniqueCities(popularCities.value)
  loadingMaghsad.value = false

  isMaghsadOpen.value = true
  isMabdaOpen.value = false

  await nextTick()
  maghsadInputRef.value?.focus()
}

// اعتبار فرم
const isFormValid = computed(() =>
  !!getCodeForEmit(mabda.value) &&
  !!getCodeForEmit(maghsad.value)
)

// جابه‌جایی مبدا و مقصد
function swapFields() {
  if (!isFormValid.value) return

  const oldMabda = mabda.value
  const oldMaghsad = maghsad.value

  mabda.value = oldMaghsad
  maghsad.value = oldMabda

  searchMabda.value = getInputDisplayName(mabda.value)
  searchMaghsad.value = getInputDisplayName(maghsad.value)

  isMabdaOpen.value = false
  isMaghsadOpen.value = false

  emit('update:mabda', getCodeForEmit(mabda.value))
  emit('update:maghsad', getCodeForEmit(maghsad.value))
}

// یافتن شهر داخلی با cityCode یا iataCode
function findDomesticCityByCode(code) {
  const normalized = normalizeCode(code)
  if (!normalized) return null

  const cities = [
    ...(flightStore.popularCities || []),
    ...(flightStore.iranAirports || [])
  ]

  return cities.find(city =>
    normalizeCode(city.cityCode) === normalized ||
    normalizeCode(city.iataCode) === normalized
  ) || null
}

// یافتن شهر خارجی
async function findInternationalCityByCode(code) {
  const normalized = normalizeCode(code)
  if (!normalized) return null

  const popular = internationalPopularCities.value.find(city =>
    normalizeCode(city.iataCode) === normalized ||
    normalizeCode(city.cityCode) === normalized
  )

  if (popular) return popular

  try {
    const res = await $fetch(
      `https://api.ahuan.ir/api/BasicInfo/airports/${encodeURIComponent(normalized)}`
    )

    const cities = Array.isArray(res)
      ? res
      : res && typeof res === 'object'
        ? [res]
        : []

    return cities.find(city =>
      normalizeCode(city.iataCode) === normalized ||
      normalizeCode(city.cityCode) === normalized
    ) || null

  } catch (error) {
    console.error('Resolve airport error:', error)
    return null
  }
}

// هماهنگی مبدأ با والد
watch(
  [
    () => props.mabda,
    () => props.sendFlightType,
    () => flightStore.popularCities,
    () => flightStore.iranAirports
  ],
  async ([code, type]) => {
    const requestId = ++mabdaResolveId

    if (!code) {
      mabda.value = null
      searchMabda.value = ''
      return
    }

    const city = type === 'international'
      ? await findInternationalCityByCode(code)
      : findDomesticCityByCode(code)

    if (requestId !== mabdaResolveId) return

    if (city) {
      mabda.value = city
      searchMabda.value = getInputDisplayName(city)
    }
  },
  { immediate: true }
)

// هماهنگی مقصد با والد
watch(
  [
    () => props.maghsad,
    () => props.sendFlightType,
    () => flightStore.popularCities,
    () => flightStore.iranAirports
  ],
  async ([code, type]) => {
    const requestId = ++maghsadResolveId

    if (!code) {
      maghsad.value = null
      searchMaghsad.value = ''
      return
    }

    const city = type === 'international'
      ? await findInternationalCityByCode(code)
      : findDomesticCityByCode(code)

    if (requestId !== maghsadResolveId) return

    if (city) {
      maghsad.value = city
      searchMaghsad.value = getInputDisplayName(city)
    }
  },
  { immediate: true }
)

// تغییر نوع پرواز
watch(
  () => props.sendFlightType,
  async type => {
    clearTimeout(mabdaTimer)
    clearTimeout(maghsadTimer)

    mabdaRequestId++
    maghsadRequestId++

    isMabdaOpen.value = false
    isMaghsadOpen.value = false

    if (type === 'international') {
      await fetchInternationalPopular()
    }

    mabdaCities.value = uniqueCities(popularCities.value)
    maghsadCities.value = uniqueCities(popularCities.value)
  },
  { immediate: true }
)

// بستن پیشنهادها با کلیک بیرون
function handleOutsideClick(event) {
  const originContainer = mabdaInputRef.value?.closest('.group')
  const destinationContainer = maghsadInputRef.value?.closest('.group')

  if (isMabdaOpen.value && !originContainer?.contains(event.target)) {
    isMabdaOpen.value = false

    if (mabda.value) {
      searchMabda.value = getInputDisplayName(mabda.value)
    } else {
      searchMabda.value = ''
    }
  }

  if (isMaghsadOpen.value && !destinationContainer?.contains(event.target)) {
    isMaghsadOpen.value = false

    if (maghsad.value) {
      searchMaghsad.value = getInputDisplayName(maghsad.value)
    } else {
      searchMaghsad.value = ''
    }
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', handleOutsideClick)

  clearTimeout(mabdaTimer)
  clearTimeout(maghsadTimer)

  mabdaRequestId++
  maghsadRequestId++
})
</script>

<style scoped>
.route-selector-container {
  container-type: inline-size;
}

.route-selector {
  min-width: 0;
}

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

.disableBtn {
  background: var(--color-gray-200);
  cursor: not-allowed;
}

.custom-dropdown::-webkit-scrollbar {
  width: 4px;
}

.custom-dropdown::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}

@container (max-width: 280px) {
  .route-field {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  .swap-zone {
    width: 36px !important;
  }

  .route-label {
    padding-left: 4px !important;
    padding-right: 4px !important;
    font-size: 9px !important;
  }
}
</style>
