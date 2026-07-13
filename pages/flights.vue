<template>
  <div class="min-h-screen bg-[#f4f4f4] pb-24 md:bg-white md:pb-10 mt-[60px]" dir="ltr">
    <!-- هدر/استپر فقط دسکتاپ -->
    <header class="hidden md:block relative h-[97px] w-full bg-[var(--color-secondary)] -mt-10">
      <div class="absolute inset-0" style="background-image: url('/imgs/flight/header.png');"></div>
      <div class="absolute -bottom-15 left-0 right-0 z-10 mx-auto max-w-3xl px-4">
        <Stepper :steps="flightSteps" :active-step="0" active-color="#1a237e" />
      </div>
    </header>
    <!-- {{ flightStore.flights }} -->
    <main class="mx-auto mt-0 md:mt-[100px] max-w-7xl px-0 md:px-4">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">

        <!-- سایدبار دسکتاپ -->
        <aside class="hidden lg:block lg:col-span-4 order-1 lg:order-2">
           <!-- <div class="sticky top-24"> -->
             <FlightSearchPanel mode="aside" :showServices="true" />
           <!-- </div> -->
           <FilterFlight 
      v-model:filters="activeFilters" 
      :allFlightsData="flights" 
    />
        </aside>

        <!-- نتایج -->
        <div class="lg:col-span-8 order-2 lg:order-1 relative">

          <!-- Full loading -->
          <transition name="fade">
            <div
              v-if="flightStore.loading"
              class="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/10 backdrop-blur-[3px] transition-all duration-300"
            >
              <div class="bg-white/95 p-8 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center text-center max-w-sm mx-4">
                <div class="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-[#1a237e] mb-4"></div>
                <h4 class="font-bold text-gray-800 text-base">در حال جستجوی پروازها...</h4>
                <p class="text-xs text-gray-500 mt-2 leading-relaxed">
                  نتایج به صورت تدریجی در حال اضافه شدن هستند.
                </p>
                <div class="mt-4 bg-blue-50 text-blue-700 text-xs px-4 py-2 rounded-full font-bold">
                  تاکنون {{ pricedFlightsCount }} پرواز دارای قیمت پیدا شده است
                </div>
              </div>
            </div>
          </transition>

          <!-- Sticky loading -->
          <transition name="fade">
            <div
              v-if="flightStore.backgroundLoading && !flightStore.loading"
              class="sticky top-3 z-40 mb-4"
            >
              <div class="bg-blue-50 border border-blue-200 text-blue-700 text-xs md:text-sm px-4 py-3 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div class="flex items-center w-full justify-center gap-2">
                  <div v-for="(n , index) in 3" :key="index" class="w-2.5 h-2.5 rounded-full bg-[#1a237e] animate-pulse"></div>
                  <span class="font-medium font-bold">
                    جستجو هنوز در حال انجام است
                  </span>
                </div>
                <!-- <span class="font-bold">
                  {{ pricedFlightsCount }} پرواز دارای قیمت
                </span> -->
              </div>
            </div>
          </transition>

          <!-- تاریخ -->
          <div class="mb-4 md:mb-6 bg-gray-100 md:bg-white px-2 py-3 md:p-2 overflow-hidden rounded-2xl">
            <DateCarousel
              :days-count="21"
              :start-date="getStartDateForCarousel(selectedDate)"
              :selected-date="selectedDate"
              @date-selected="handleDateChange"
            />
          </div>

          <!-- کنترل‌های موبایل -->
          <div class="lg:hidden mb-4 px-2" dir="rtl">
            <div class="flex items-center justify-start gap-2">
              <div class="relative">
                <UiBaseButton
                  @click="isSortDropdownOpen = !isSortDropdownOpen"
                  label="مرتب‌سازی"
                  variant="soft"
                  color="primary"
                  class="inline-flex items-center justify-end gap-1.5 !rounded-full bg-white shadow-xl px-5 py-4 text-[12px] font-bold text-gray-600 border border-gray-100 shadow-sm"
                  icon="↕️"
                />
                <transition name="fade">
                  <div
                    v-if="isSortDropdownOpen"
                    class="absolute right-0 top-full mt-2 z-50 min-w-[160px] rounded-2xl bg-white p-2 shadow-xl"
                  >
                    <button
                      v-for="tab in sortOptions"
                      :key="tab"
                      @click="selectSortOption(tab)"
                      class="w-full text-right rounded-xl px-3 py-2 text-[11px] font-bold transition-all"
                      :class="activeTab === tab ? 'bg-[var(--color-primary-dark)] text-white' : 'text-gray-600 hover:bg-gray-50'"
                      type="button"
                    >
                      {{ tab }}
                    </button>
                  </div>
                </transition>
              </div>
              <UiBaseButton
                @click="isFilterModalOpen = true"
                label="فیلترها"
                variant="soft"
                color="primary"
                class="inline-flex items-center justify-end gap-1.5 !rounded-full bg-white px-5 py-4 text-[12px] shadow-xl font-bold text-gray-600 border border-gray-100 shadow-sm"
                icon="⚙️"
              />
            </div>
          </div>


          <!-- شمارش -->
          <div class="mb-4 text-center text-xs text-gray-400 font-medium px-2">
            <span v-if="flightStore.loading">در حال جستجوی پروازها...</span>
            <span v-else>تعداد {{ pricedFlightsCount }} پرواز یافت شد</span>
          </div>

          <!-- Tabs دسکتاپ -->
          <div class="hidden lg:flex mb-6 items-center gap-1 rounded-xl p-1 text-xs">
            <UiBaseTabs :items="sortOptions" v-model="activeTab" />
          </div>

          <!-- لیست پروازها -->
          <div v-if="sortedFlights.length > 0" class="space-y-4 px-2 md:px-0">
            <!-- استفاده از TransitionGroup برای انیمیشن لیست -->
            <TransitionGroup
              name="list"
              tag="div"
              class="space-y-4"
              enter-active-class="animate-enter"
              leave-active-class="animate-leave"
            >
              <FlightTicketCard
                v-for="(flight, index) in sortedFlights"
                :key="flight.id || index"  
                :tickets="[flight]"
                :passenger="passengerInfo"
                :is-main-page="true"
                :is-next-page="false"
                :choose-step="1"
                @firstChoosed="handleFlightSelect"
                @showDetailes="showFlightDetails"
                :flight="flight"
                @select="handleSelectFlight"
              />
            </TransitionGroup>
          </div>

          <!-- عدم یافتن پرواز -->
          <div
            v-else-if="searchStarted && flightStore.searchFinished && !flightStore.loading"
            class="text-center py-20 text-gray-500 border-2 border-dashed border-gray-150 rounded-[2rem] bg-white shadow-sm mx-2 md:mx-0"
          >
            <p class="font-bold text-gray-700">پروازی در تاریخ انتخاب‌شده یافت نشد.</p>
            <p class="text-xs text-gray-400 mt-2">لطفاً تاریخ یا مسیر دیگری را امتحان کنید.</p>
          </div>
        </div>
      </div>
    </main>

    <!-- مودال فیلتر موبایل -->
    <transition name="fade">
      <div
        v-if="isFilterModalOpen"
        class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm lg:hidden"
        @click.self="isFilterModalOpen = false"
      >
        <div class="w-full bg-white rounded-t-[2.5rem] p-6 max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col" dir="rtl">
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <h3 class="font-black text-gray-800 text-lg">فیلترهای جستجو</h3>
            <button @click="isFilterModalOpen = false" class="text-2xl text-gray-400 font-bold">&times;</button>
          </div>

          <div class="space-y-6">
            <FlightSearchPanel mode="aside" :showServices="true" />
            <button
              @click="isFilterModalOpen = false"
              class="w-full rounded-2xl bg-[#1a237e] py-4 text-sm font-bold text-white shadow-lg active:scale-95 transition-all"
            >
              اعمال فیلترها
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import moment from 'moment-jalaali'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFlightStore } from '~/stores/flights'
import { searchAllProviders } from '~/services/searchFlights'

moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' })

const route = useRoute()
const router = useRouter()
const flightStore = useFlightStore()

const selectedDate = ref('')
const activeTab = ref('ارزان‌ترین')
const searchStarted = ref(false)
const isFilterModalOpen = ref(false)
const isSortDropdownOpen = ref(false)

const sortOptions = ['نام ایرلاین', 'دیرترین', 'زودترین', 'ارزان‌ترین', 'گران‌ترین']

const flightSteps = [
  { icon: '✈️', label: 'انتخاب پرواز' },
  { icon: '📄', label: 'تکمیل اطلاعات' },
  { icon: '💳', label: 'تایید و پرداخت' },
  { icon: '🎫', label: 'دریافت بلیط' }
]

const getStartDateForCarousel = (dateStr) => {
  if (!dateStr) return moment().format('YYYY-MM-DD')

  const parsed = moment(String(dateStr).replace(/\//g, '-').trim(), 'YYYY-MM-DD', true)

  if (!parsed.isValid()) {
    const fallbackParsed = moment(
      String(dateStr).replace(/\//g, '-').trim(),
      ['YYYY-MM-DD', 'YYYY/MM/DD', 'jYYYY/jMM/jDD']
    )
    if (fallbackParsed.isValid()) {
      return fallbackParsed.subtract(10, 'days').format('YYYY-MM-DD')
    }
    return moment().format('YYYY-MM-DD')
  }

  return parsed.subtract(10, 'days').format('YYYY-MM-DD')
}

const baseSearchParamsFromRoute = computed(() => {
  return {
    from: String(route.query.origin || ''),
    to: String(route.query.destination || ''),
    departureDate: String(route.query.departDate || ''),
    returnDate: route.query.returnDate ? String(route.query.returnDate) : '',
    adults: Number.parseInt(route.query.adl || 1, 10),
    children: Number.parseInt(route.query.chd || 0, 10),
    infants: Number.parseInt(route.query.inf || 0, 10),
    flightType: String(route.query.flightType || 'domestic'),
    travelType: String(route.query.travelType || 'one-way')
  }
})

const flights = computed(() => flightStore.flights || [])

const hasValidPrice = (price) => {
  if (price === null || price === undefined || price === '' || price === '-') return false
  const parsedPrice = Number(price)
  return !Number.isNaN(parsedPrice) && parsedPrice > 0
}

const pricedFlightsCount = computed(() => {
  return flights.value.filter((flight) => hasValidPrice(flight?.priceFrom)).length
})

function isFlightUnavailable(flight) {
  const text = [
    flight?.status,
    flight?.availabilityStatus,
    flight?.state,
    flight?.ticketStatus,
    flight?.statusMessage,
    flight?.description
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const price = Number(flight?.priceFrom)
  const capacity = Number(flight?.capacity)
  const returnCapacity = Number(flight?.returnCapacity)

  const isCanceled =
    flight?.canceled === true ||
    flight?.cancelled === true ||
    text.includes('cancel') ||
    text.includes('canceled') ||
    text.includes('cancelled') ||
    text.includes('کنسل') ||
    text.includes('باطل')

  const isSoldOut =
    flight?.disabled === true ||
    text.includes('sold out') ||
    text.includes('soldout') ||
    text.includes('unavailable') ||
    text.includes('full') ||
    text.includes('تکمیل') ||
    text.includes('تکمیل ظرفیت') ||
    text.includes('غیرقابل خرید') ||
    (Number.isFinite(capacity) && capacity <= 0) ||
    (Number.isFinite(returnCapacity) && returnCapacity <= 0)

  const invalidPrice = !Number.isFinite(price) || price <= 0

  return isCanceled || isSoldOut || invalidPrice
}
const activeFilters = ref({
  departureTimeRange: [0, 2400],
  // در صورت نیاز سایر فیلترها (مانند ایرلاین، قیمت و...) را اینجا اضافه کنید
});
const getFlightTimeAsNumber = (departureStr) => {
  if (!departureStr) return null;
  
  const timePart = departureStr.includes(' ') 
    ? departureStr.split(' ')[1] 
    : departureStr.includes('T') ? departureStr.split('T')[1] 
    : null;

  if (!timePart) return null;

  const [hours, minutes] = timePart.split(':');
  const h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);

  if (isNaN(h) || isNaN(m)) return null;
  return h * 100 + m;
};
const sortedFlights = computed(() => {
  if (!flights.value) return [];

  // فیلتر کردن
  const filteredList = flights.value.filter(flight => {
    // اگر فیلتر مقداری ندارد یا روی حالت پیش‌فرض (0 تا 2400) است، فیلتر اعمال نشود
    if (!activeFilters.value.departureTimeRange) return true;
    
    const [minTime, maxTime] = activeFilters.value.departureTimeRange;
    
    // اگر فیلتر روی کل بازه (سراسر شبانه‌روز) تنظیم شده است، فیلتر را رد کن
    if (minTime === 0 && maxTime === 2400) return true;

    const flightTime = getFlightTimeAsNumber(flight.departure);
    if (flightTime === null) return true; // پروازهای بدون زمان حذف نشوند

    return flightTime >= minTime && flightTime <= maxTime;
  });

  // کپی برای مرتب‌سازی
  const list = [...filteredList];

  // مرتب‌سازی اصلی بر اساس تب فعال
  switch (activeTab.value) {
    case 'ارزان‌ترین':
      list.sort((a, b) => Number(a.priceFrom || 0) - Number(b.priceFrom || 0))
      break

    case 'گران‌ترین':
      list.sort((a, b) => Number(b.priceFrom || 0) - Number(a.priceFrom || 0))
      break

    case 'نام ایرلاین':
      list.sort((a, b) =>
        String(a.airlineName || a.airline || '').localeCompare(
          String(b.airlineName || b.airline || ''),
          'fa'
        )
      )
      break

    case 'زودترین':
      list.sort((a, b) =>
        String(a.departure || '').localeCompare(String(a.departure || ''))
      )
      break

    case 'دیرترین':
      list.sort((a, b) =>
        String(b.departure || '').localeCompare(String(a.departure || ''))
      )
      break
  }

  // تفکیک پروازهای موجود از ناموجود
  return [
    ...list.filter(f => !isFlightUnavailable(f)),
    ...list.filter(f => isFlightUnavailable(f))
  ];
});

const selectSortOption = (option) => {
  activeTab.value = option
  isSortDropdownOpen.value = false
}

const formatPrice = (value) => {
  if (!value) return '۰'
  return Number(value).toLocaleString('fa-IR')
}

const normalizeDateForApi = (dateValue) => {
  if (!dateValue) return ''

  const faDigits = '۰۱۲۳۴۵۶۷۸۹'
  const arDigits = '٠١٢٣٤٥٦٧٨٩'

  let value = String(dateValue).trim()

  value = value
    .split('')
    .map((ch) => {
      const faIndex = faDigits.indexOf(ch)
      if (faIndex > -1) return String(faIndex)

      const arIndex = arDigits.indexOf(ch)
      if (arIndex > -1) return String(arIndex)

      return ch
    })
    .join('')

  value = value.replace(/-/g, '/')
  return value
}

const performSearch = async (dateStr) => {
  const base = baseSearchParamsFromRoute.value
  if (!base.from || !base.to) return

  const finalDate = normalizeDateForApi(dateStr || base.departureDate)
  if (!finalDate) return

  searchStarted.value = false

  try {
    await searchAllProviders({
      from: base.from,
      to: base.to,
      departureDate: finalDate,
      returnDate: base.returnDate,
      adults: base.adults,
      children: base.children,
      infants: base.infants,
      flightType: base.flightType,
      travelType: base.travelType
    })
  } finally {
    searchStarted.value = true
  }
}

const handleDateChange = async (dateObj) => {
  const newDate = dateObj?.fullDate
  if (!newDate) return

  const cleanedDate = String(newDate).replace(/\//g, '-').trim()
  selectedDate.value = cleanedDate

  await router.replace({
    query: {
      ...route.query,
      departDate: cleanedDate
    }
  })

  await performSearch(cleanedDate)
}

const selectFlight = async (flight) => {
  const plainFlight = JSON.parse(JSON.stringify(flight))
  await flightStore.loadFlightDetails(plainFlight)
}

onMounted(async () => {
  const qDate = String(route.query.departDate || '')

  if (qDate) {
    selectedDate.value = qDate.replace(/\//g, '-').trim()
  } else {
    selectedDate.value = moment().format('YYYY-MM-DD')
    await router.replace({ query: { ...route.query, departDate: selectedDate.value } })
  }

  await performSearch(selectedDate.value)
})

watch(
  () => route.query.departDate,
  async (newQueryDate) => {
    if (newQueryDate) {
      const cleanDate = String(newQueryDate).replace(/\//g, '-').trim()
      if (cleanDate !== selectedDate.value) {
        selectedDate.value = cleanDate
        await performSearch(cleanDate)
      }
    }
  }
)
</script>

<style>
/* انیمیشن‌های ورود و خروج برای TransitionGroup */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease; /* مدت زمان و نوع انیمیشن */
}

/* حالت اولیه هنگام ورود آیتم */
.list-enter-from {
  opacity: 0;
  transform: translateX(30px); /* شروع از سمت راست */
}

/* حالت نهایی هنگام خروج آیتم */
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px); /* پایان در سمت چپ */
}

/* انیمیشن جابجایی آیتم‌ها وقتی جایشان در لیست تغییر می‌کند */
.list-move {
  transition: transform 1s ease;
}

/* مهم: برای اینکه آیتم‌های در حال خروج، فضای خالی را بلافاصله اشغال نکنند */
.list-leave-active {
  position: absolute;
}

/* انیمیشن ورود دلخواه (اختیاری) */
.animate-enter {
  opacity: 0;
  transform: scale(0.9);
}

/* انیمیشن خروج دلخواه (اختیاری) */
.animate-leave {
  opacity: 0;
  transf: scale(1.1);
}

/* اگر از انیمیشن‌های CSS پیچیده‌تر استفاده می‌کنید، می‌توانید keyframes تعریف کنید */
/*
@keyframes slideIn {
  from { transform: translateX(30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOut {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(-30px); opacity: 0; }
}
.list-enter-active { animation: slideIn 0.5s ease; }
.list-leave-active { animation: slideOut 0.5s ease; position: absolute; }
*/

/* کلاس‌های fade اصلی که برای مودال‌ها استفاده می‌شود */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
