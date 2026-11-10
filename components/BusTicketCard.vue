<template>
  <article class="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" dir="rtl">
    <!-- نوع اتوبوس در گوشه بالا سمت راست کارت -->
    <span class="hidden md:inline-flex absolute right-3 top-2 z-10 max-w-[calc(100%-24px)] rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-600">
      {{ shortBusType }}
    </span>

    <!-- نمای موبایل مشابه کارت پرواز -->
    <div class="md:hidden">
      <!-- سربرگ: نوع اتوبوس در راست، لوگوی شرکت در چپ -->
      <div class="flex min-h-[68px] items-start justify-between gap-3 px-3 pt-3" dir="rtl">
        <div class="flex flex-wrap justify-start gap-1.5 pt-0.5">
          <span class="rounded-md bg-gray-100 px-2.5 py-1.5 text-[11px] font-semibold text-gray-600">
            {{ shortBusType }}
          </span>
        </div>
        <div class="flex min-w-[90px] max-w-[125px] flex-col items-center justify-center gap-0.5">
          <img
            v-if="companyLogo && !logoFailed"
            :src="companyLogo"
            :alt="displayCompany"
            class="h-[42px] max-w-[120px] object-contain"
            @error="logoFailed = true"
          />
          <i v-else class="bi bi-bus-front-fill text-[30px] text-[var(--color-primary,#1a237e)]"></i>
          <span class="text-center text-[10px] font-bold leading-4 text-gray-700">{{ displayCompany }}</span>
        </div>
      </div>

      <!-- مسیر: مبدا راست، مقصد چپ، خط چین صاف و اتوبوس وسط -->
      <div class="grid grid-cols-[minmax(0,1fr)_minmax(95px,1.65fr)_minmax(0,1fr)] items-start gap-1 px-3 pt-3" dir="rtl">
        <div class="min-w-0 text-right">
          <p class="flex items-center gap-1 text-[11px] text-gray-400"><i class="bi bi-geo-alt"></i> مبدأ</p>
          <p class="mt-0.5 text-[16px] font-bold text-gray-800">{{ originCity }}</p>
          <p class="text-[11px] leading-5 text-gray-500">{{ originTerminal || 'پایانه اعلام نشده' }}</p>
          <p class="mt-0.5 text-[12px] font-semibold tabular-nums text-gray-600" dir="ltr" style="text-align:right">{{ bus.departureTime || raw.hour || '--:--' }}</p>
        </div>
        <div class="flex min-w-0 items-center pt-[30px] text-gray-400" aria-hidden="true">
          <span class="bus-route-dashes h-[2px] min-w-0 flex-1"></span>
          <i class="bi bi-bus-front-fill mx-1 shrink-0 text-[20px] leading-none"></i>
          <span class="bus-route-dashes h-[2px] min-w-0 flex-1"></span>
        </div>
        <div class="min-w-0 text-left" dir="rtl" style="text-align:left">
          <p class="flex items-center justify-start gap-1 text-[11px] text-gray-400"><i class="bi bi-geo-alt"></i> مقصد</p>
          <p class="mt-0.5 text-[16px] font-bold text-gray-800">{{ destinationCity }}</p>
          <p class="text-[11px] leading-5 text-gray-500">{{ destinationTerminal || 'پایانه اعلام نشده' }}</p>
        </div>
      </div>

      <!-- تاریخ و وضعیت ظرفیت -->
      <div class="flex flex-col items-center justify-center gap-0.5 px-3 pb-3 pt-1 text-center">
        <p v-if="displayDate" class="text-[12px] font-bold text-gray-600">{{ departureWeekday }} {{ displayDate }}</p>
        <p class="text-[12px] font-extrabold text-red-500">{{ statusText }}</p>
      </div>

      <!-- مبلغ و دکمه در یک ردیف با جداکننده خط‌چین -->
      <div class="flex items-center justify-between gap-3 border-t-2 border-dashed border-gray-100 px-3 py-3" dir="rtl">
        <div class="flex min-w-0 flex-wrap items-baseline gap-1">
          <strong class="text-[19px] font-black tabular-nums text-[var(--color-primary,#1a237e)]">{{ formatPrice(priceToman) }}</strong>
          <span class="text-[10px] text-gray-500">تومان</span>
        </div>
        <button
          type="button"
          :disabled="isUnavailable || !enableSelection"
          :title="!enableSelection ? 'رزرو و انتخاب صندلی هنوز فعال نشده است' : undefined"
          class="min-h-[38px] min-w-[116px] shrink-0 rounded-lg bg-[var(--color-primary,#1a237e)] px-3 text-[12px] font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          @click="emit('select', bus)"
        >{{ isUnavailable ? 'غیرقابل خرید' : 'انتخاب بلیت' }}</button>
      </div>

      <!-- تب ها در پایین موبایل -->
      <nav class="flex w-full items-center justify-center gap-0 px-1" dir="rtl" aria-label="جزئیات بلیت اتوبوس">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="min-w-0 rounded-t-md px-2 py-2 text-[11px] transition-colors"
          :class="openedPanel === tab.key ? 'bg-gray-100 font-bold text-blue-600' : 'bg-transparent font-medium text-gray-500 hover:text-blue-600'"
          :aria-expanded="openedPanel === tab.key"
          @click="togglePanel(tab.key)"
        >{{ tab.label }}</button>
      </nav>
    </div>

    <!-- دسکتاپ: قیمت سمت چپ | شرکت و مسیر سمت راست -->
    <div class="hidden md:flex md:flex-row" dir="ltr">
      <!-- قیمت بالای دکمه؛ ظرفیت فقط پایین کارت -->
      <aside
        class="order-2 flex shrink-0 flex-col items-center border-t border-gray-100 bg-white px-4 py-3 md:order-1 md:w-[185px] md:border-r md:border-t-0 md:border-dashed"
        dir="rtl"
      >
        <div class="flex w-full flex-1 flex-col items-center justify-center gap-2 py-1">
          <div class="flex items-baseline justify-center gap-1">
            <strong class="text-[21px] font-black tabular-nums text-[var(--color-primary,#1a237e)]">{{ formatPrice(priceToman) }}</strong>
            <span class="text-[11px] text-gray-500">تومان</span>
          </div>
          <button
            type="button"
            :disabled="isUnavailable || !enableSelection"
            :title="!enableSelection ? 'رزرو و انتخاب صندلی هنوز فعال نشده است' : undefined"
            class="flex min-h-9 w-full max-w-[150px] items-center justify-center rounded-full bg-[var(--color-primary,#1a237e)] px-3 text-[12px] font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            @click="emit('select', bus)"
          >
            {{ isUnavailable ? 'غیرقابل خرید' : 'انتخاب بلیت' }}
          </button>
        </div>
        <p
          class="mt-auto w-full pt-1 text-center text-[11px] font-bold leading-5"
          :class="isUnavailable ? 'text-red-500' : 'text-gray-500'"
        >
          {{ statusText }}
        </p>
      </aside>

      <!-- بخش اصلی: شرکت و مسیر کنار هم، لینک‌ها گوشه پایین راست -->
      <div class="order-1 flex min-w-0 flex-1 flex-col md:order-2" dir="rtl">
        <div class="flex flex-col md:flex-row md:items-center">
          <!-- شرکت مسافربری: سمت راست، مانند لوگوی ایرلاین -->
          <aside class="flex shrink-0 items-center justify-center gap-2 px-3 pt-10 md:w-[145px] md:flex-col md:gap-1 md:pt-[68px] md:pb-3">
            <div class="flex h-[48px] w-[88px] items-center justify-center text-[var(--color-primary,#1a237e)] md:h-[60px] md:w-[110px]">
              <img
                v-if="companyLogo && !logoFailed"
                :src="companyLogo"
                :alt="displayCompany"
                class="max-h-full max-w-full object-contain"
                @error="logoFailed = true"
              />
              <i v-else class="bi bi-bus-front-fill text-[30px]"></i>
            </div>
            <h3 class="text-center text-[12px] font-extrabold leading-5 text-gray-800">{{ displayCompany }}</h3>
          </aside>

          <!-- مسیر و تاریخ: مبدأ و مقصد در مرکز فضای کارت -->
          <section class="flex min-w-0 flex-1 flex-col justify-center px-3 pt-2 md:px-4 md:pt-2">
            <div class="mx-auto w-full max-w-[500px] px-2 sm:px-4">
              <div class="mt-2 grid grid-cols-[minmax(0,1fr)_minmax(105px,1.7fr)_minmax(0,1fr)] items-start gap-1 sm:grid-cols-[minmax(0,1fr)_minmax(150px,1.8fr)_minmax(0,1fr)] sm:gap-2" dir="rtl">
                <!-- مبدأ -->
                <div class="min-w-0 text-center">
                  <p class="mb-1 flex items-center justify-center gap-1 text-[11px] text-gray-400"><i class="bi bi-geo-alt"></i> مبدأ</p>
                  <p class="text-[16px] font-extrabold text-gray-800">{{ originCity }}</p>
                  <p class="mt-0.5 break-words text-[11px] leading-5 text-gray-500">{{ originTerminal || 'پایانه اعلام نشده' }}</p>
                  <p class="mt-1 text-center text-[14px] font-bold tabular-nums text-gray-700" dir="ltr">{{ bus.departureTime || raw.hour || '--:--' }}</p>
                </div>

                <!-- خط‌چین صاف، بلند و از ابتدا تا انتهای فاصله میان شهرها -->
                <div class="flex min-w-0 w-full items-center self-start pt-[40px] text-gray-400" aria-hidden="true">
                  <span class="bus-route-dashes h-[2px] min-w-0 flex-1"></span>
                  <i class="bi bi-bus-front-fill mx-1.5 shrink-0 text-[23px] leading-none"></i>
                  <span class="bus-route-dashes h-[2px] min-w-0 flex-1"></span>
                </div>

                <!-- مقصد: بدون ساعت رسیدن -->
                <div class="min-w-0 text-center">
                  <p class="mb-1 flex items-center justify-center gap-1 text-[11px] text-gray-400"><i class="bi bi-geo-alt"></i> مقصد</p>
                  <p class="text-[16px] font-extrabold text-gray-800">{{ destinationCity }}</p>
                  <p class="mt-0.5 break-words text-[11px] leading-5 text-gray-500">{{ destinationTerminal || 'پایانه اعلام نشده' }}</p>
                </div>
              </div>
              <div v-if="displayDate" class="mt-1 text-center text-[11px] font-bold text-gray-600">{{ departureWeekday }} {{ displayDate }}</div>
            </div>
          </section>
        </div>

        <!-- تب‌های جزئیات: راست‌چین، بدون خط بالا، مطابق تب‌های پرواز -->
        <nav
          class="mt-auto flex w-full flex-wrap items-end justify-start gap-0 px-0 pb-0 pt-1 text-right"
          dir="rtl"
          aria-label="جزئیات بلیت اتوبوس"
        >
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="rounded-t-md first:rounded-tr-none px-3 py-2 text-[13px] transition-colors duration-200"
            :class="openedPanel === tab.key
              ? 'bg-gray-100 font-bold text-blue-600'
              : 'bg-transparent font-medium text-gray-500 hover:text-blue-600'"
            :aria-expanded="openedPanel === tab.key"
            @click="togglePanel(tab.key)"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <div v-if="openedPanel" class="border-t border-gray-100 bg-gray-50/50 px-5 py-4 text-xs leading-7 text-gray-600" dir="rtl">
      <template v-if="openedPanel === 'info'">
        <div class="rounded-xl border border-gray-100 bg-white p-4">
          <template v-if="intermediateDestinations.length">
            <h3 class="text-[13px] font-black text-gray-800">توقف در شهرهای:</h3>
            <div class="mt-2 flex flex-wrap gap-2">
              <span v-for="stop in intermediateDestinations" :key="stop.code" class="rounded-full bg-[var(--color-primary-light,#eef2ff)] px-3 py-1.5 text-[11px] font-bold text-[var(--color-primary-dark,#1a237e)]">{{ stop.name }}</span>
            </div>
          </template>
          <div v-if="finalDestinationName" :class="{ 'mt-4 border-t border-gray-100 pt-3': intermediateDestinations.length }">
            <h3 class="text-[13px] font-black text-gray-800">مقصد نهایی اتوبوس:</h3>
            <span class="mt-2 inline-flex rounded-full bg-[var(--color-primary-light,#eef2ff)] px-3 py-1.5 text-[11px] font-bold text-[var(--color-primary-dark,#1a237e)]">{{ finalDestinationName }}</span>
          </div>
        </div>
      </template>
      <template v-else-if="openedPanel === 'seats'">
        <BusSeatMap
          :data="serviceDetail"
          :loading="serviceDetailLoading"
          :error="serviceDetailError"
          :is-mock="useMockServiceDetail"
          :service-mismatch="serviceDetailMismatch"
        />
      </template>
      <!-- قوانین و شرایط: نمایش در موبایل و دسکتاپ -->
      <template v-else-if="openedPanel === 'rules'">
        <div class="grid grid-cols-1 bg-white sm:grid-cols-2" dir="rtl">
          <div class="flex flex-col items-center justify-center px-4 py-4 text-center sm:border-l sm:border-gray-200">
            <h3 class="text-[16px] font-bold text-red-500">۱۰٪ جریمه</h3>
            <p class="mt-2 text-[12px] text-gray-700">از زمان صدور تا ۱ ساعت قبل از حرکت</p>
          </div>
          <div class="flex flex-col items-center justify-center border-t border-gray-200 px-4 py-4 text-center sm:border-t-0">
            <h3 class="text-[16px] font-bold text-red-500">۵۰٪ جریمه حضوری</h3>
            <p class="mt-2 text-[12px] text-gray-700">از ۱ ساعت قبل از حرکت تا پس از آن</p>
          </div>
        </div>
      </template>
    </div>
  </article>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useBusStore } from '~/stores/bus'
import { toGregorian, isValidJalaaliDate } from 'jalaali-js'
import BusSeatMap from '~/components/BusSeatMap.vue'

const props = defineProps({
  bus: { type: Object, required: true },
  enableSelection: { type: Boolean, default: false }
})

const emit = defineEmits(['select'])
const busStore = useBusStore()
const openedPanel = ref('')
const tabs = [
  { key: 'seats', label: 'نقشه صندلی‌ها' },
  { key: 'info', label: 'اطلاعات اتوبوس و سفر' },
  { key: 'rules', label: 'قوانین و شرایط' }
]
const logoFailed = ref(false)

// حالت تست: جزئیات سرویس از فایل public/mock خوانده می‌شود.
// بعد از فعال شدن وب‌سرویس، آن را false کن.
const raw = computed(() => props.bus.meta?.raw || props.bus)
const useMockServiceDetail = false
const serviceDetail = ref(null)
const serviceDetailLoading = ref(false)
const serviceDetailError = ref('')
let detailRequestId = 0

const serviceParams = computed(() => ({
  origin: String(props.bus.searchOrigin || props.bus.origin || raw.value.tripOrigin || '').trim().toLowerCase().replace(/^th[absep]$/, 'thr'),
  destination: String(raw.value.tripDestination || props.bus.destination || '').trim().toLowerCase(),
  co: String(raw.value.companyCode || props.bus.companyCode || '').trim(),
  seg: String(raw.value.moveCode || props.bus.moveCode || '').trim()
}))

const serviceKey = computed(() => JSON.stringify(serviceParams.value))
const serviceDetailMismatch = computed(() =>
  !!(useMockServiceDetail && serviceDetail.value?.moveCode &&
    serviceParams.value.seg && serviceDetail.value.moveCode !== serviceParams.value.seg)
)

watch(serviceKey, () => {
  detailRequestId++
  serviceDetail.value = null
  serviceDetailError.value = ''
  serviceDetailLoading.value = false
  if (openedPanel.value === 'seats') loadServiceDetail()
})

async function loadServiceDetail() {
  if (serviceDetailLoading.value || serviceDetail.value) return
  const requestId = ++detailRequestId
  serviceDetailLoading.value = true
  serviceDetailError.value = ''
  try {
    const params = serviceParams.value
    if (!useMockServiceDetail && (!params.origin || !params.destination || !params.co || !params.seg)) {
      throw new Error('اطلاعات لازم برای دریافت نقشه صندلی‌ها کامل نیست.')
    }
    const response = useMockServiceDetail
      ? await $fetch('/mock/niraBusServiceDetail.json')
      : await $fetch('https://api.ahuan.ir/api/nira-bus/service-detail', {
          query: params
        })
    if (requestId !== detailRequestId) return
    if (!response?.data || !Array.isArray(response.data.seats)) {
      throw new Error(response?.error || 'پاسخ نقشه صندلی‌ها معتبر نیست.')
    }
    serviceDetail.value = response.data
  } catch (error) {
    if (requestId !== detailRequestId) return
    serviceDetailError.value = error?.data?.error || error?.message || 'دریافت نقشه صندلی‌ها ناموفق بود.'
  } finally {
    if (requestId === detailRequestId) serviceDetailLoading.value = false
  }
}

function togglePanel(name) {
  openedPanel.value = openedPanel.value === name ? '' : name
  if (openedPanel.value === 'seats') loadServiceDetail()
}

// پشتیبانی از داده استاتیک و خروجی API


const capacity = computed(() =>
  Number(props.bus.capacity ?? raw.value.capacity ?? 0)
)

// قیمت مقصد انتخاب‌شده مسافر
const priceRial = computed(() =>
  Number(raw.value.tripDestinationFare ?? props.bus.priceFrom ?? 0)
)

const priceToman = computed(() =>
  Math.max(0, priceRial.value / 10)
)

const isCanceled = computed(() =>
  /کنسل|لغو|باطل/.test(
    [
      props.bus.busType,
      props.bus.explanation,
      raw.value.type
    ].join(' ')
  )
)

const isUnavailable = computed(() =>
  props.bus.disabled === true ||
  capacity.value <= 0 ||
  priceRial.value <= 0 ||
  isCanceled.value
)

const statusText = computed(() =>
  isCanceled.value
    ? 'سرویس کنسل شده'
    : capacity.value <= 0
      ? 'تکمیل ظرفیت'
      : priceRial.value <= 0
        ? 'قیمت نامعتبر'
        : `${capacity.value.toLocaleString('fa-IR')} صندلی باقی‌مانده`
)

// اطلاعات شرکت از Store
const company = computed(() => {
  const code = String(
    raw.value.rmtO_CompanyBrand ||
    props.bus.companyBrand ||
    ''
  ).trim().toLowerCase()

  const items = Array.isArray(busStore.companies)
    ? busStore.companies
    : []

  const byCode = items.find(item =>
    String(item.code || '').trim().toLowerCase() === code
  )
  if (byCode) return byCode

  const providerName = normalizeFa(raw.value.companyName || props.bus.companyName)
  return items.find(item => normalizeFa(item.name) === providerName) || null
})

const displayCompany = computed(() =>
  String(
    company.value?.name ||
    props.bus.companyName ||
    raw.value.companyName ||
    'شرکت مسافربری'
  ).trim()
)

// لوگو منحصراً از تصویر تعریف‌شده در companies استور دریافت می‌شود.
const companyLogo = computed(() => {
  const image = company.value?.image
  return typeof image === 'string' && image.trim() ? image.trim() : null
})

// با تغییر شرکت، خطای تصویر شرکت قبلی برای لوگوی جدید باقی نمی‌ماند.
watch(companyLogo, () => { logoFailed.value = false })

const companySubtitle = computed(() =>
  company.value ? '' : String(raw.value.companyName || '').trim()
)

const isVip = computed(() =>
  /vip|وی\s*آی\s*پی/i.test(
    props.bus.busType || raw.value.type || ''
  ) ||
  ['V25', 'S25', 'DR4'].includes(
    String(
      props.bus.busTypeCode ||
      raw.value.typeE ||
      ''
    ).toUpperCase()
  )
)

const shortBusType = computed(() => {
  const full = String(
    props.bus.busType || raw.value.type || ''
  ).trim()

  const clean = full.split(/[-–]/)[0].trim()

  return clean && clean.length <= 38
    ? clean
    : isVip.value
      ? 'VIP'
      : 'اتوبوس معمولی'
})

// شهرها
const cityList = computed(() =>
  Array.isArray(busStore.cities) ? busStore.cities : []
)

const lookupPlace = code => {
  const place = cityList.value.find(
    item =>
      String(item.code || '').toUpperCase() ===
      String(code || '').toUpperCase()
  )

  return String(place?.name || '').trim()
}

function normalizeFa(text) {
  return String(text || '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\s+/g, ' ')
    .trim()
}

const cityNameFromPlace = text => {
  const name = normalizeFa(text)
  if (!name) return ''
  return name.split(' ')[0]
}

const originFullName = computed(() =>
  String(
    raw.value.tripOriginName ||
    props.bus.originName ||
    lookupPlace(raw.value.tripOrigin) ||
    ''
  ).trim()
)

const originCity = computed(() =>
  cityNameFromPlace(originFullName.value) || 'مبدأ'
)

const selectedDestinationName = computed(() =>
  String(
    raw.value.tripDestinationName ||
    props.bus.destinationName ||
    lookupPlace(raw.value.tripDestination) ||
    'مقصد'
  ).trim()
)

const selectedDestinationCode = computed(() =>
  String(
    raw.value.tripDestination ||
    props.bus.destination ||
    ''
  ).trim().toUpperCase()
)

const finalDestinationName = computed(() =>
  String(
    raw.value.finalDestinationName ||
    props.bus.finalDestinationName ||
    ''
  ).trim()
)

const finalDestinationCode = computed(() =>
  String(
    raw.value.finalDestination ||
    props.bus.finalDestination ||
    ''
  ).trim().toUpperCase()
)

// شهرهای میانی بدون تکرار و بدون مقصد انتخاب‌شده و مقصد نهایی
const intermediateDestinations = computed(() => {
  const stops = []
  const seen = new Set()

  for (let i = 1; i <= 5; i++) {
    const code = String(
      raw.value[`middleDestination${i}`] || ''
    ).trim().toUpperCase()

    const name = String(
      raw.value[`middleDestination${i}Name`] || ''
    ).trim()

    if (
      !code ||
      !name ||
      code === selectedDestinationCode.value ||
      code === finalDestinationCode.value ||
      seen.has(code)
    ) {
      continue
    }

    seen.add(code)
    stops.push({ code, name })
  }

  return stops
})

const destinationCity = computed(() =>
  cityNameFromPlace(selectedDestinationName.value) || 'مقصد'
)

// تشخیص نام پایانه
function extractTerminal(place, city) {
  const title = normalizeFa(place)
  const c = normalizeFa(city)

  if (!title || !c || title === c) return ''

  const detail = title.startsWith(`${c} `)
    ? title.slice(c.length).trim()
    : ''

  if (!detail) return ''

  return /پایانه|ترمینال/.test(detail)
    ? detail
    : `پایانه ${detail}`
}

const originTerminal = computed(() => {
  const fromName = extractTerminal(
    originFullName.value,
    originCity.value
  )

  const riding = normalizeFa(
    raw.value.ridingPlace || props.bus.ridingPlace
  )

  return fromName || riding || ''
})

const destinationTerminal = computed(() => {
  const direct = extractTerminal(
    selectedDestinationName.value,
    destinationCity.value
  )

  if (direct) return direct

  const finalPlace = String(
    raw.value.finalDestinationName || ''
  ).trim()

  if (
    cityNameFromPlace(finalPlace) === destinationCity.value
  ) {
    const terminal = extractTerminal(
      finalPlace,
      destinationCity.value
    )

    if (terminal) return terminal
  }

  const possible = new Set()

  for (let i = 1; i <= 5; i++) {
    const place = String(
      raw.value[`middleDestination${i}Name`] || ''
    ).trim()

    if (
      cityNameFromPlace(place) !== destinationCity.value
    ) {
      continue
    }

    const terminal = extractTerminal(
      place,
      destinationCity.value
    )

    if (terminal) possible.add(terminal)
  }

  if (possible.size === 1) {
    return [...possible][0]
  }

  return ''
})

// تاریخ شمسی
const displayDate = computed(() => {
  const digits = String(
    props.bus.departureDate ||
    raw.value.departureDate ||
    ''
  )
    .replace(
      /[۰-۹]/g,
      char => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(char))
    )
    .replace(/\D/g, '')

  if (!/^\d{8}$/.test(digits)) return ''

  return `${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6, 8)}`
})

// روز هفته
const departureWeekday = computed(() => {
  if (!displayDate.value) return ''

  const [year, month, day] = displayDate.value
    .split('/')
    .map(Number)

  if (!isValidJalaaliDate(year, month, day)) return ''

  const { gy, gm, gd } = toGregorian(year, month, day)

  return new Intl.DateTimeFormat('fa-IR', {
    weekday: 'long',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(gy, gm - 1, gd)))
})

const formatPrice = value =>
  Number(value || 0).toLocaleString('fa-IR', {
    maximumFractionDigits: 0
  })
</script>

<style scoped>
/* خط‌چین درشت و یکدست، از ابتدای فاصلهٔ میان شهرها */
.bus-route-dashes {
  background-image: repeating-linear-gradient(to left, #9ca3af 0 7px, transparent 7px 12px);
}
</style>
