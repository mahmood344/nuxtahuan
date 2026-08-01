<template>
  <div class="min-h-screen bg-gray-100 pb-24 md:bg-white md:pb-10 mt-[60px]" dir="ltr">
    <!-- هدر/استپر فقط دسکتاپ -->
    <header class="hidden md:block relative h-[97px] w-full bg-secondary -mt-10">
      <div class="absolute inset-0" style="background-image: url('/imgs/flight/header.png');"></div>
      <div class="absolute -bottom-15 left-0 right-0 z-10 mx-auto max-w-3xl px-4">
        <Stepper :steps="flightSteps" :active-step="flightStore.currentStep" active-color="#1a237e" />

      </div>
    </header>
    <!-- {{ flightStore.selectedFlights  }} -->
    <main class="mx-auto mt-0 md:mt-[100px] max-w-7xl px-0 md:px-4">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">

        <!-- سایدبار دسکتاپ -->
        <aside class="hidden lg:block lg:col-span-4 order-1 lg:order-2">
            <!-- sticky -->
  <div class=" top-24 space-y-4">
    <FlightSearchPanel mode="aside" :showServices="true" />
<!-- showSearchResults -->
    <FilterFlight
      v-if="false"
      v-model:filters="activeFilters"
      :allFlightsData="flights"
    />
  </div>
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
                <div class="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 bg-primary mb-4"></div>
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
                  <div v-for="(n , index) in 3" :key="index" class="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
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
          <div v-if="showSearchResults" class="mb-4 md:mb-6 bg-gray-100 md:bg-white px-2 py-3 md:p-2 overflow-hidden rounded-2xl">
            <DateCarousel
              :days-count="21"
              :start-date="getStartDateForCarousel(selectedDate)"
              :selected-date="selectedDate"
              @date-selected="handleDateChange"
            />
          </div>

          <!-- کنترل‌های موبایل -->
          <div class="lg:hidden mb-4 px-2" dir="rtl" v-if="showSearchResults">
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
          <div class="mb-4 text-center text-xs text-gray-400 font-medium px-2" v-if="showSearchResults">
            <span v-if="flightStore.loading">در حال جستجوی پروازها...</span>
            <span v-else>تعداد {{ pricedFlightsCount }} پرواز یافت شد</span>
          </div>

          <!-- Tabs دسکتاپ -->
          <div class="hidden lg:flex mb-6 items-center gap-1 rounded-xl p-1 text-xs" v-if="showSearchResults">
            <UiBaseTabs :items="sortOptions" v-model="activeTab" />
          </div>
           <div v-if="showSelectedSection" class="space-y-4 px-2 md:px-0">
  <div class="rounded-3xl bg-white p-4 shadow-sm border border-gray-100">
    <div class="space-y-4">
      <FlightTicketCard
        v-for="(flight, index) in selectedTicketsForView"
        :key="`selected-${flight.id || index}`"
        :tickets="[flight]"
        :passenger="passengerInfo"
        :hide-select-button="true"
        :is-main-page="true"
        :is-next-page="false"
        :choose-step="1"
        :flight="flight"
        @showDetailes="showFlightDetails"
      />
    </div>

    <div class="mt-3 ml-2 flex items-center justify-between" dir="ltr">
      <UiBaseButton
  :label="editFlightButtonLabel"
  variant="filled"
  color="primary"
  class="!rounded-3xl !px-6 h-12 text-sm"
  @click="handleEditFlight"
/>
    </div>
  </div>

  <div v-if="flightStore.currentStep === formStep" class="space-y-4">
  <PassengerInfoForm
    ref="passengerFormRef"
  />

  <ContactInfoForm
    ref="contactFormRef"
  :loading="flightStore.pricingRefreshLoading"
  @submit="onContinueShopping"
  />
</div>

<div v-else-if="flightStore.currentStep === previewStep" class="space-y-4">
  <BookingInfoTable
    mode="passengers"
    :flight-type="flightType"
    :passengers="bookingData.passengers"
    @update:passengers="bookingData.passengers = $event"
  />

  <BookingInfoTable
    mode="contact"
    :contact="bookingData.contact"
    @update:contact="bookingData.contact = $event"
  />

<PaymentSummary
  :original-price="flightStore.finalBookingPrice"
  :final-price="priceAfterTravelCard"
  :loading="paymentLoading"
  :travel-card-credit="travelCardCredit"
  :travel-card-loading="travelCardLoading"
  :travel-card-applied="travelCardApplied"
  :travel-card-owner-name="travelCardOwnerName"
  :travel-card-error-message="travelCardError"
  @back="flightStore.setCurrentStep(formStep)"
  @submit="handleFinalPayment"
  @apply-travel-card="handleApplyTravelCard"
  @clear-travel-card-error="travelCardError = ''"
  @reset-travel-card="handleResetTravelCard"  
/>
</div>
</div>

          <!-- لیست پروازها -->
          <div v-if="showSearchResults && sortedFlights.length > 0" class="space-y-4 px-2 md:px-0">
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
                :hide-select-button="false"
                @firstChoosed="handleFlightSelect"
                @showDetailes="showFlightDetails"
                :flight="flight"
                @select="handleSelectFlight"
              />
            </TransitionGroup>
          </div>

          <!-- عدم یافتن پرواز -->
          <div
  v-else-if="showSearchResults && searchStarted && flightStore.searchFinished && !flightStore.loading"
  class="text-center py-20 text-gray-500 border-2 border-dashed border-gray-100 rounded-[2rem] bg-white shadow-sm mx-2 md:mx-0"
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
            <UiBaseButton
  label="اعمال فیلترها"
  variant="filled"
  color="primary"
  class="w-full !rounded-2xl !py-4 shadow-lg"
  @click="isFilterModalOpen = false"
/>
          </div>
        </div>
      </div>
    </transition>
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
  </div>
</template>

<script setup>
import moment from 'moment-jalaali'
import { toGregorian } from 'jalaali-js'
import {
  ref,
  reactive,
  computed,
  onMounted,
  watch,
  nextTick
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFlightStore } from '~/stores/flights'
import { searchAllProviders } from '~/services/searchFlights'

moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' })

const route = useRoute()
const router = useRouter()
const flightStore = useFlightStore()

console.log(flightStore.finalBookingPrice, 'flightStore.finalBookingPrice')

const selectedDate = ref('')
const activeTab = ref('ارزان‌ترین')
const searchStarted = ref(false)
const isFilterModalOpen = ref(false)
const isSortDropdownOpen = ref(false)

const sortOptions = ['نام ایرلاین', 'دیرترین', 'زودترین', 'ارزان‌ترین', 'گران‌ترین']

const activeFilters = ref({
  departureTimeRange: [0, 2400]
})
const scrollToTop = async () => {
  await nextTick()
  if (typeof window !== 'undefined') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}
const travelType = computed(() => String(route.query.travelType || 'one-way'))

const flightSteps = computed(() => {
  if (travelType.value === 'round-trip') {
    return [
      { icon: '✈️', label: 'انتخاب پرواز رفت' },
      { icon: '🔁', label: 'انتخاب پرواز برگشت' },
      { icon: '📄', label: 'تکمیل اطلاعات' },
      { icon: '💳', label: 'تایید و پرداخت' },
      { icon: '🎫', label: 'دریافت بلیط' }
    ]
  }

  return [
    { icon: '✈️', label: 'انتخاب پرواز' },
    { icon: '📄', label: 'تکمیل اطلاعات' },
    { icon: '💳', label: 'تایید و پرداخت' },
    { icon: '🎫', label: 'دریافت بلیط' }
  ]
})

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

function handlePassengersSubmit(passengers) {
  console.log(passengers)
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

  return value.replace(/-/g, '/')
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

const showSelectedSection = computed(() => {
  if (travelType.value === 'one-way') {
    return !!flightStore.selectedDepartureFlight
  }

  if (
    flightStore.selectedDepartureFlight?.isRoundTrip &&
    flightStore.selectedDepartureFlight?.provider !== 'NIRA'
  ) {
    return true
  }

  return !!flightStore.selectedDepartureFlight && !!flightStore.selectedReturnFlight
})

const showSearchResults = computed(() => !showSelectedSection.value)

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

const getFlightTimeAsNumber = (departureStr) => {
  if (!departureStr) return null

  const timePart = departureStr.includes(' ')
    ? departureStr.split(' ')[1]
    : departureStr.includes('T')
      ? departureStr.split('T')[1]
      : null

  if (!timePart) return null

  const [hours, minutes] = timePart.split(':')
  const h = parseInt(hours, 10)
  const m = parseInt(minutes, 10)

  if (isNaN(h) || isNaN(m)) return null
  return h * 100 + m
}

const sortedFlights = computed(() => {
  if (!flights.value) return []

  const filteredList = flights.value.filter((flight) => {
    if (!activeFilters.value.departureTimeRange) return true

    const [minTime, maxTime] = activeFilters.value.departureTimeRange

    if (minTime === 0 && maxTime === 2400) return true

    const flightTime = getFlightTimeAsNumber(flight.departure)
    if (flightTime === null) return true

    return flightTime >= minTime && flightTime <= maxTime
  })

  const list = [...filteredList]

  const getOutboundDepartureTime = (flight) => {
    const depTime = flight.departure
    if (!depTime) return 0

    const parsed = new Date(depTime).getTime()
    return Number.isNaN(parsed) ? 0 : parsed
  }

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
      list.sort((a, b) => getOutboundDepartureTime(a) - getOutboundDepartureTime(b))
      break
    case 'دیرترین':
      list.sort((a, b) => getOutboundDepartureTime(b) - getOutboundDepartureTime(a))
      break
  }

  return [
    ...list.filter((f) => !isFlightUnavailable(f)),
    ...list.filter((f) => isFlightUnavailable(f))
  ]
})

const selectedTicketsForView = computed(() => {
  if (
    flightStore.selectedDepartureFlight?.isRoundTrip &&
    flightStore.selectedDepartureFlight?.provider !== 'NIRA'
  ) {
    return [flightStore.selectedDepartureFlight]
  }

  return [flightStore.selectedDepartureFlight, flightStore.selectedReturnFlight].filter(Boolean)
})

const passengerInfo = computed(() => ({
  adults: baseSearchParamsFromRoute.value.adults,
  children: baseSearchParamsFromRoute.value.children,
  infants: baseSearchParamsFromRoute.value.infants
}))

const selectSortOption = (option) => {
  activeTab.value = option
  isSortDropdownOpen.value = false
}

const buildSearchPayload = ({
  from,
  to,
  departureDate,
  returnDate,
  travelType: customTravelType
}) => {
  const base = baseSearchParamsFromRoute.value

  return {
    from,
    to,
    departureDate: normalizeDateForApi(departureDate),
    returnDate: returnDate ? normalizeDateForApi(returnDate) : '',
    adults: base.adults,
    children: base.children,
    infants: base.infants,
    flightType: base.flightType,
    travelType: customTravelType || base.travelType
  }
}

const performSearch = async (payload) => {
  if (!payload?.from || !payload?.to || !payload?.departureDate) return

  searchStarted.value = false

  try {
    await flightStore.searchFlights(payload)
  } finally {
    searchStarted.value = true
  }
}

const handleDateChange = async (dateObj) => {
  const newDate = dateObj?.fullDate
  if (!newDate) return

  const cleanedDate = String(newDate)
    .replace(/\//g, '-')
    .trim()

  selectedDate.value = cleanedDate

  const isSelectingReturnFlight =
    travelType.value === 'round-trip' &&
    flightStore.currentStep === 1 &&
    !!flightStore.selectedDepartureFlight

  await router.replace({
    query: {
      ...route.query,
      ...(isSelectingReturnFlight
        ? { returnDate: cleanedDate }
        : { departDate: cleanedDate })
    }
  })

  if (isSelectingReturnFlight) {
    await performSearch(
      buildSearchPayload({
        from: baseSearchParamsFromRoute.value.to,
        to: baseSearchParamsFromRoute.value.from,
        departureDate: cleanedDate,
        returnDate: '',
        travelType: 'one-way'
      })
    )

    return
  }

  await performSearch(
    buildSearchPayload({
      from: baseSearchParamsFromRoute.value.from,
      to: baseSearchParamsFromRoute.value.to,
      departureDate: cleanedDate,
      returnDate: baseSearchParamsFromRoute.value.returnDate,
      travelType: baseSearchParamsFromRoute.value.travelType
    })
  )
}

const formStep = computed(() => {
  return travelType.value === 'round-trip' ? 2 : 1
})

const previewStep = computed(() => {
  return travelType.value === 'round-trip' ? 3 : 2
})

const handleSelectFlight = async (flight) => {
  const plainFlight = JSON.parse(JSON.stringify(flight))

  flightStore.cancelAllPendingRequests()

  if (travelType.value === 'one-way') {
    flightStore.selectDepartureFlight(plainFlight)
    flightStore.setCurrentStep(1)
    return
  }

  if (
    plainFlight?.isRoundTrip &&
    plainFlight?.provider !== 'NIRA'
  ) {
    flightStore.selectDepartureFlight(plainFlight)
    flightStore.setCurrentStep(formStep.value)
    return
  }

  if (flightStore.currentStep === 0) {
  flightStore.selectDepartureFlight(plainFlight)
  flightStore.setCurrentStep(1)

  const returnFlightDate = String(
    baseSearchParamsFromRoute.value.returnDate || ''
  )
    .replace(/\//g, '-')
    .trim()

  if (!returnFlightDate) {
    throw new Error('تاریخ پرواز برگشت مشخص نیست')
  }

  selectedDate.value = returnFlightDate

  await performSearch(
    buildSearchPayload({
      from: baseSearchParamsFromRoute.value.to,
      to: baseSearchParamsFromRoute.value.from,
      departureDate: returnFlightDate,
      returnDate: '',
      travelType: 'one-way'
    })
  )

  return
}

  flightStore.selectReturnFlight(plainFlight)
  flightStore.setCurrentStep(formStep.value)
}

const handleEditFlight = async () => {
  flightStore.cancelAllPendingRequests()
  flightStore.clearSelectedFlights()
  flightStore.setCurrentStep(0)

  const departureDate = String(
    baseSearchParamsFromRoute.value.departureDate || ''
  )
    .replace(/\//g, '-')
    .trim()

  selectedDate.value = departureDate

  await performSearch(
    buildSearchPayload({
      from: baseSearchParamsFromRoute.value.from,
      to: baseSearchParamsFromRoute.value.to,
      departureDate,
      returnDate: baseSearchParamsFromRoute.value.returnDate,
      travelType: baseSearchParamsFromRoute.value.travelType
    })
  )

  await scrollToTop()
}

const editFlightButtonLabel = computed(() => {
  return selectedTicketsForView.value.length > 1
    ? 'تغییر پروازهای انتخابی'
    : 'تغییر پرواز انتخابی'
})

const isSelectedFlightCard = (flight) => {
  const departureId = flightStore.selectedDepartureFlight?.id
  const returnId = flightStore.selectedReturnFlight?.id

  return flight?.id === departureId || flight?.id === returnId
}

const showFlightDetails = async (flight) => {
  const plainFlight = JSON.parse(JSON.stringify(flight))
  await flightStore.loadFlightDetails(plainFlight)
}

onMounted(async () => {
  const qDate = String(route.query.departDate || '')

  flightStore.clearSelectedFlights()

  if (qDate) {
    selectedDate.value = qDate.replace(/\//g, '-').trim()
  } else {
    selectedDate.value = moment().format('YYYY-MM-DD')
    await router.replace({ query: { ...route.query, departDate: selectedDate.value } })
  }

  await performSearch(
    buildSearchPayload({
      from: baseSearchParamsFromRoute.value.from,
      to: baseSearchParamsFromRoute.value.to,
      departureDate: selectedDate.value,
      returnDate: baseSearchParamsFromRoute.value.returnDate,
      travelType: baseSearchParamsFromRoute.value.travelType
    })
  )
})

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
  async () => {
    const searchParams =
      baseSearchParamsFromRoute.value

    if (
      !searchParams.from ||
      !searchParams.to ||
      !searchParams.departureDate
    ) {
      return
    }

    const isSelectingReturnFlight =
      searchParams.travelType === 'round-trip' &&
      flightStore.currentStep === 1 &&
      !!flightStore.selectedDepartureFlight

    const activeDate = isSelectingReturnFlight
      ? searchParams.returnDate
      : searchParams.departureDate

    selectedDate.value = String(activeDate || '')
      .replace(/\//g, '-')
      .trim()

    flightStore.cancelAllPendingRequests()

    if (isSelectingReturnFlight) {
      await performSearch(
        buildSearchPayload({
          from: searchParams.to,
          to: searchParams.from,
          departureDate: searchParams.returnDate,
          returnDate: '',
          travelType: 'one-way'
        })
      )

      return
    }

    flightStore.clearSelectedFlights()
    flightStore.setCurrentStep(0)

    await performSearch(
      buildSearchPayload({
        from: searchParams.from,
        to: searchParams.to,
        departureDate: searchParams.departureDate,
        returnDate: searchParams.returnDate,
        travelType: searchParams.travelType
      })
    )
  }
)
watch(
  () => flightStore.currentStep,
  () => {
    scrollToTop()
  }
)
const passengerFormRef = ref(null)
const contactFormRef = ref(null)

// توابع کمکی ساخت تاریخ و زمان جاری
function getCurrentDate() {
  return moment().format('YYYY-MM-DD')
}

function getCurrentTime() {
  return moment().format('HH:mm')
}

// تبدیل ارقام فارسی و عربی به انگلیسی
function normalizeDigits(value) {
  const faDigits = '۰۱۲۳۴۵۶۷۸۹'
  const arDigits = '٠١٢٣٤٥٦٧٨٩'

  return String(value ?? '')
    .split('')
    .map((character) => {
      const faIndex = faDigits.indexOf(character)
      if (faIndex !== -1) return String(faIndex)

      const arIndex = arDigits.indexOf(character)
      if (arIndex !== -1) return String(arIndex)

      return character
    })
    .join('')
}

// تبدیل تاریخ تولد به فرمت استاندارد میلادی ISO
function toIsoBirthDate(birthDate) {
  if (!birthDate) return ''

  let year
  let month
  let day

  if (typeof birthDate === 'object') {
    year = normalizeDigits(birthDate.year)
    month = normalizeDigits(birthDate.month)
    day = normalizeDigits(birthDate.day)
  }

  if (typeof birthDate === 'string') {
    const normalizedDate = normalizeDigits(birthDate).trim().replace(/-/g, '/')
    const dateParts = normalizedDate.split('/')
    year = dateParts[0]
    month = dateParts[1]
    day = dateParts[2]
  }

  if (!year || !month || !day) return ''

  const formattedBirthDate = [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0')
  ].join('/')

  const isJalaliDate = Number(year) < 1700

  const parsedDate = isJalaliDate
    ? moment(formattedBirthDate, 'jYYYY/jMM/jDD', true)
    : moment(formattedBirthDate, 'YYYY/MM/DD', true)

  if (!parsedDate.isValid()) {
    console.error('Invalid passenger birth date:', birthDate)
    return ''
  }

  return parsedDate.startOf('day').toISOString()
}

// استخراج مالیات‌های مربوط به هر مسافر
function getFlightPassengerTaxes(flight, passengerType) {
  if (!flight) return []

  const normalizedType = String(passengerType || 'ADL').toUpperCase()
  const taxesByPassengerType =
    flight?.contractPassengerTaxes ||
    flight?.passengerTaxes ||
    flight?.taxesByPassengerType ||
    flight?.pricing?.taxesByPassengerType ||
    null

  if (Array.isArray(taxesByPassengerType)) {
    return taxesByPassengerType.map((tax) => ({
      ...tax,
      id: Number(tax?.id || 0),
      contractPassengerId: Number(tax?.contractPassengerId || 0)
    }))
  }

  const typeTaxes =
    taxesByPassengerType?.[normalizedType] ||
    taxesByPassengerType?.[normalizedType.toLowerCase()] ||
    []

  if (Array.isArray(typeTaxes)) {
    return typeTaxes.map((tax) => ({
      ...tax,
      id: Number(tax?.id || 0),
      contractPassengerId: Number(tax?.contractPassengerId || 0)
    }))
  }

  return []
}

// نگاشت داده‌های مسافران فرم ورودی به ساختار جدول مسافران API
function mapPassengersToPayload(passengers, selectedFlights = []) {
  const mainFlight = selectedFlights[0] || null

  return passengers.map((p) => {
    const passengerType = String(p?.type || 'ADL').toUpperCase()
    const nationalCode = normalizeDigits(p.nationalCode).trim()
    const passportNumber = normalizeDigits(p.passportNumber).trim()
    const nationalityCode = String(p.nationality || 'IR').toUpperCase()

    const isIranianPassenger =
      nationalityCode === 'IR' ||
      nationalityCode === 'IRAN' ||
      nationalityCode === 'ایرانی'

    return {
      id: 0,
      contractId: 0,
      fName: String(p.firstName || '').trim(),
      lName: String(p.lastName || '').trim(),
      age: passengerType,
      gender: p.gender === 'male' || p.gender === true,
      birthDate: toIsoBirthDate(p.birthDate),
      codeMelli: nationalCode,
      passportNo: passportNumber || (isIranianPassenger ? nationalCode : ''),
      nationality: isIranianPassenger ? 'ایرانی' : String(p.nationality || '').trim(),
      description: '',
      contractPassengerTaxes: getFlightPassengerTaxes(mainFlight, passengerType)
    }
  })
}

// فرمت تاریخ پرواز
function formatFlightDate(dateValue) {
  if (!dateValue) return ''

  if (dateValue instanceof Date) {
    const parsed = moment(dateValue)
    return parsed.isValid() ? parsed.format('YYYY-MM-DD') : ''
  }

  if (typeof dateValue === 'number') {
    const parsed = moment(dateValue)
    return parsed.isValid() ? parsed.format('YYYY-MM-DD') : ''
  }

  const normalizedValue = normalizeDigits(String(dateValue)).trim()
  if (!normalizedValue) return ''

  let parsedDate = moment(normalizedValue)
  if (parsedDate.isValid()) {
    return parsedDate.format('YYYY-MM-DD')
  }

  parsedDate = moment(
    normalizedValue,
    [
      'YYYY-MM-DD HH:mm:ss',
      'YYYY/MM/DD HH:mm:ss',
      'YYYY-MM-DD HH:mm',
      'YYYY/MM/DD HH:mm',
      'YYYY-MM-DD',
      'YYYY/MM/DD'
    ],
    true
  )

  if (parsedDate.isValid()) {
    return parsedDate.format('YYYY-MM-DD')
  }

  console.error('Invalid flight date:', dateValue)
  return ''
}

// فرمت ساعت پرواز
function formatFlightTime(dateTimeValue, fallbackTime = '') {
  const value = dateTimeValue || fallbackTime
  if (!value) return ''

  if (value instanceof Date) {
    const parsed = moment(value)
    return parsed.isValid() ? parsed.format('HH:mm') : ''
  }

  if (typeof value === 'number') {
    const parsed = moment(value)
    return parsed.isValid() ? parsed.format('HH:mm') : ''
  }

  const normalizedValue = normalizeDigits(String(value)).trim()
  if (!normalizedValue) return ''

  const timeMatch = normalizedValue.match(/^([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/)
  if (timeMatch) {
    return `${String(timeMatch[1]).padStart(2, '0')}:${timeMatch[2]}`
  }

  let parsedTime = moment(normalizedValue)
  if (parsedTime.isValid()) {
    return parsedTime.format('HH:mm')
  }

  parsedTime = moment(
    normalizedValue,
    [
      'YYYY-MM-DD HH:mm:ss',
      'YYYY/MM/DD HH:mm:ss',
      'YYYY-MM-DD HH:mm',
      'YYYY/MM/DD HH:mm'
    ],
    true
  )

  if (parsedTime.isValid()) {
    return parsedTime.format('HH:mm')
  }

  console.error('Invalid flight time:', value)
  return ''
}

// دریافت شناسه ایرلاین از استور بر اساس کد ایرلاین
function resolveAirlineId(flight) {
  const airlineCode = String(
    flight?.stepfindip ||
    flight?.stepFindIp ||
    flight?.airlineCode ||
    flight?.airline_code ||
    flight?.carrierCode ||
    flight?.marketingAirline ||
    flight?.operatingAirline ||
    flight?.airline?.code ||
    flight?.airline ||
    ''
  ).trim().toUpperCase()

  let mappedAirlineId = 0

  if (typeof flightStore.getAirlineId === 'function') {
    mappedAirlineId = Number(flightStore.getAirlineId(airlineCode))
  }

  if ((!Number.isInteger(mappedAirlineId) || mappedAirlineId <= 0) && flightStore.airlineIdMap) {
    mappedAirlineId = Number(flightStore.airlineIdMap[airlineCode] || 0)
  }

  if (Number.isInteger(mappedAirlineId) && mappedAirlineId > 0) {
    return mappedAirlineId
  }

  const directAirlineId = Number(flight?.airlineId)
  if (Number.isInteger(directAirlineId) && directAirlineId > 0) {
    return directAirlineId
  }

  console.error('Airline ID not found for flight:', flight)
  return 0
}

// نگاشت داده‌های پروازهای انتخابی استور به ساختار جدول پروازهای API
function mapFlightsToPayload(selectedFlights) {
  return selectedFlights.filter(Boolean).map((f) => {
    const departureValue = f?.departure || f?.departureDateTime || f?.depDateTime || ''
    const arrivalValue = f?.arrival || f?.arrivalDateTime || f?.arrDateTime || ''

    const departureDate = f?.depDate || f?.departureDate || departureValue
    const arrivalDate = f?.arrDate || f?.arrivalDate || arrivalValue
    const departureTime = f?.depTime || f?.departureTime || departureValue
    const arrivalTime = f?.arrTime || f?.arrivalTime || arrivalValue

    const airlineId = resolveAirlineId(f)

    return {
      contractId: 0,
      origin: String(f?.origin || f?.from || f?.originCode || '').trim(),
      destination: String(f?.destination || f?.to || f?.destinationCode || '').trim(),
      flightClass: String(f?.cabinClass || f?.flightClass || f?.class || 'X').trim(),
      airlineId: airlineId,
      flightNumber: String(f?.flightNumber || f?.flightNo || '').trim(),
      depDate: formatFlightDate(departureDate),
      depTime: formatFlightTime(departureTime, f?.depTime),
      arrDate: formatFlightDate(arrivalDate),
      arrTime: formatFlightTime(arrivalTime, f?.arrTime),
      airplaneType: String(f?.aircraft || f?.airplaneType || f?.aircraftType || '').trim(),
      charterFlight: f?.isCharter === true || f?.charterFlight === true,
      description: '',
      flightSupplier: String(f?.provider || f?.flightSupplier || '').trim(),
    }
  })
}
async function addContract(payload) {
  try {
    const response = await $fetch('https://api.ahuan.ir/api/Contract/add', {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response
  } catch (error) {
    console.warn('Contract add failed (non-blocking):', error)
    return null
  }
}

// ثبت قرارداد و ادامه خرید
// ثبت قرارداد و ادامه خرید
async function onContinueShopping() {
  const passengerValid = passengerFormRef.value?.validateAll?.() ?? false
  const contactValid = contactFormRef.value?.validateAll?.() ?? false

  if (!passengerValid || !contactValid) return

  if (!flightStore.isLoggedIn) {
    flightStore.openModal()
    flightStore.pendingAction = () => onContinueShopping()
    return
  }

  const passengers = passengerFormRef.value?.getData?.() ?? []
  const contact = contactFormRef.value?.getData?.() ?? {}

  if (!passengers.length) return

  bookingData.value.passengers = passengers
  bookingData.value.contact = contact

  const passengerCounts = {
    adult: passengers.filter((p) => p.type === 'ADL').length,
    child: passengers.filter((p) => p.type === 'CHD').length,
    infant: passengers.filter((p) => p.type === 'INF').length
  }

  try {
    await flightStore.refreshSelectedFlightsPricing(passengerCounts)
  } catch (error) {
    console.error('Error on refreshing fare:', error)
    alert('استعلام قیمت پرواز با خطا مواجه شد. لطفاً دوباره تلاش کنید.')
    return
  }

  const selectedFlights = Array.isArray(flightStore.selectedFlights)
    ? flightStore.selectedFlights.filter(Boolean)
    : [flightStore.selectedDepartureFlight, flightStore.selectedReturnFlight].filter(Boolean)

  const contractFlights = mapFlightsToPayload(selectedFlights)
  const contractPassengers = mapPassengersToPayload(passengers, selectedFlights)

  const payload = {
    id: 0,
    userName: String(contact.phone || contact.mobile || '').trim(),
    email: String(contact.email || '').trim(),
    issueDate: getCurrentDate(),
    issueTime: getCurrentTime(),
    ipAddress: '0',
    confirmStatus: 'temp',
    contractType: 0,
    contractingPartyType: 0,
    cruise: false,
    hotel: false,
    insurance: false,
    manualOrAutomatic: true,
    other: false,
    showDetail: false,
    systemOrCharter: false,
    taxType: 0,
    ticket: true,
    ticketStatus: 'temp-first',
    tour: false,
    travelVehicle: 'هواپیما',
    visa: false,
    contractFlights,
    contractPassengers
  }

  const contractResponse = await addContract(payload)
  
  currentContractData.value = {
    addPayload: payload,
    addResponse: contractResponse
  }
console.log(currentContractData.value.addResponse , 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  flightStore.setCurrentStep(previewStep.value)
}



const flightType = computed(() => {
  return route.query.flightType === 'international'
    ? 'international'
    : 'domestic'
})

const bookingData = ref({
  contact: {
    phone: '',
    email: '',
  },
  passengers: [],
})
const travelCardCredit = ref(0)
const travelCardApplied = ref(false)
const travelCardLoading = ref(false)
const travelCardOwnerName = ref('')
const travelCardError = ref('') 
const travelCardData = ref(null)
const appliedTravelCardNumber = ref('')
const priceAfterTravelCard = computed(() => {
  const original = Number(flightStore.finalBookingPrice || 0)
  const credit = Number(travelCardCredit.value || 0)
  return Math.max(original - credit, 0)
})
const handleResetTravelCard = () => {
  travelCardCredit.value = 0
  travelCardApplied.value = false
  travelCardOwnerName.value = ''
  travelCardError.value = ''
  travelCardData.value = null
  appliedTravelCardNumber.value = ''
  console.log('Travel card reset. Price reverted to original.')
}
const handleApplyTravelCard = async (cardNumber) => {
  try {
    travelCardLoading.value = true
    travelCardApplied.value = false
    travelCardCredit.value = 0
    travelCardOwnerName.value = ''
    travelCardError.value = ''
    travelCardData.value = null
    appliedTravelCardNumber.value = ''

    const normalizedCardNumber =
      String(cardNumber || '').trim()

    const response = await $fetch(
      `https://api.ahuan.ir/api/SafarCard/${encodeURIComponent(normalizedCardNumber)}`
    )

    if (
      response &&
      response.credit !== undefined
    ) {
      travelCardData.value = response
      travelCardCredit.value =
        Number(response.credit)

      travelCardOwnerName.value =
        `${response.firstName || ''} ${response.lastName || ''}`.trim()

      /*
       * شماره‌ای که کاربر وارد کرده و API
       * آن را تأیید کرده است.
       */
      appliedTravelCardNumber.value =
        normalizedCardNumber

      travelCardApplied.value = true
    } else {
      travelCardError.value =
        'اطلاعات کارت معتبر نیست.'
    }
  } catch (error) {
    travelCardApplied.value = false
    travelCardCredit.value = 0
    travelCardOwnerName.value = ''
    travelCardData.value = null
    appliedTravelCardNumber.value = ''

    if (
      error.data &&
      typeof error.data === 'string'
    ) {
      travelCardError.value = error.data
    } else if (error.data?.message) {
      travelCardError.value =
        error.data.message
    } else {
      travelCardError.value =
        'چنین شماره کارتی یافت نشد.'
    }

    console.error(
      'Travel card API error:',
      error
    )
  } finally {
    travelCardLoading.value = false
  }
}


























const currentContractData = ref(null)
const paymentLoading = ref(false)

function getNiraAirlineCode(flight) {
  return String(
    flight?.airlineCode ||
    flight?.carrierCode ||
    flight?.airline?.code ||
    flight?.airline ||
    ''
  ).trim().toUpperCase()
}
function getJalaliDayMonth(dateValue) {
  const formatted = formatFlightDate(dateValue)
  if (!formatted) {
    return { day: '', month: '' }
  }

  const jDate = moment(formatted, 'YYYY-MM-DD').format('jDD/jMM')
  const [day, month] = jDate.split('/')

  return {
    day: day || '',
    month: month || ''
  }
}

function getPassengerGenderTitle(passenger) {
  const isMale = passenger?.gender === 'male' || passenger?.gender === true
  return isMale ? 'MR' : 'MISS'
}
function getPassengerGenderCode(passenger) {
  const isMale = passenger?.gender === 'male' || passenger?.gender === true
  return isMale ? 'M' : 'F'
}
function getPassengerAgeForNira(passenger, referenceDate = null) {
  const birth = parsePassengerBirthDate(passenger?.birthDate)
  if (!birth) return ''

  const ref = referenceDate ? moment(referenceDate) : moment.utc()
  if (!ref.isValid()) return ''

  const ageInYears = ref.diff(birth, 'years')
  return String(Math.max(0, ageInYears))
}
function formatBirthDateForNira(birthDate) {
  return formatNiraDate(birthDate)
}
function buildNiraEdtId(passenger, flightType) {
  const nationality = String(passenger?.nationality || 'IR').toUpperCase()
  const isIranian =
    nationality === 'IR' || nationality === 'IRAN' || nationality === 'ایرانی'

  const isDomestic = flightType === 'domestic'
  const gender = getPassengerGenderCode(passenger)
  const birthDate = formatBirthDateForNira(passenger?.birthDate)

  const nationalId = normalizeDigits(passenger?.nationalCode || '').trim()
  const passportNo = normalizeDigits(passenger?.passportNumber || '').trim()

  const firstName = String(passenger?.firstName || '').trim().toUpperCase()
  const lastName = String(passenger?.lastName || '').trim().toUpperCase()

  if (isIranian && isDomestic) {
    return [
      'I',
      '',
      nationalId,
      '',
      birthDate,
      gender,
      '',
      '',
      ''
    ].join('_')
  }

  return [
    'P',
    isIranian ? 'IRN' : nationality || '',
    passportNo,
    isIranian ? 'IRN' : nationality || '',
    birthDate,
    gender,
    '',
    lastName,
    firstName
  ].join('_')
}
function buildNiraContact(contact) {
  const mobile = normalizeDigits(contact?.phone || contact?.mobile || '').replace(/\D/g, '')
  const email = String(contact?.email || '').trim()

  return [mobile, '', email].filter((item, index) => item || index !== 1).join('|')
}
async function reserveNiraFlight(flight, passengers, contact) {
  const params = new URLSearchParams()
console.log(flight , 'sdsdsdsd');
  params.set('AirLine', getNiraAirlineCode(flight))
  params.set('cbSource', String(flight?.origin || '').trim())
  params.set('cbTarget', String(flight?.destination || '').trim())
  params.set('FlightClass', String(flight?.cabinClass || 'E').trim())
  params.set('FlightNo', String(flight?.flightNumber || '').trim())
  params.set('Day', getJalaliDayMonth(flight?.departure).day)
  params.set('Month', getJalaliDayMonth(flight?.departure).month)
  params.set('DepartureDate', formatFlightDate(flight?.departure))
  params.set('No', String(passengers.length))
  params.set('edtContact', buildNiraContact(contact))

  const passengersInfo = passengers
    .map((passenger, index) => {
      const n = index + 1
      return [
        `edtName${n}=${encodeURIComponent(
          `${String(passenger?.firstName || '').trim()}${getPassengerGenderTitle(passenger)}`
        )}`,
        `edtLast${n}=${encodeURIComponent(
          String(passenger?.lastName || '').trim()
        )}`,
        `edtAge${n}=${encodeURIComponent(
          getPassengerAgeForNira(passenger)
        )}`,
        `edtID${n}=${encodeURIComponent(
          buildNiraEdtId(passenger, flightType.value)
        )}`
      ].join('&')
    })
    .join('&')

  params.set('PassengersInfo', passengersInfo)
  // console.log(passenger , 'passengersInfo');
  const url = `https://api.ahuan.ir/api/Nira/GetReserve?${params.toString()}`
  const response = await $fetch(url, { method: 'GET' })
let parsedResponse = response

if (typeof parsedResponse === 'string') {
  try {
    parsedResponse = JSON.parse(parsedResponse)
  } catch (e) {
    throw new Error('پاسخ رزرو نیرا قابل پردازش نیست')
  }
}

const result = parsedResponse?.AirReserve?.[0]

if (!result) {
  throw new Error('پاسخ رزرو نیرا معتبر نیست')
}

const errorText = String(result?.Error || '').trim()
const pnr = String(result?.PNR || '').trim()

if (errorText && errorText !== 'Success' && errorText !== 'No Err') {
  throw new Error(errorText || 'رزرو نیرا انجام نشد')
}

if (!pnr) {
  throw new Error('PNR از نیرا دریافت نشد')
}

return {
  pnr,
  raw: parsedResponse
}


}

async function reserveNiraFlights(selectedFlights, passengers, contact) {
  const results = []

  for (const flight of selectedFlights) {
    if (!isNiraFlight(flight)) {
      throw new Error('فعلاً فقط رزرو پروازهای NIRA در این متد پیاده‌سازی شده است')
    }

    const reserveResult = await reserveNiraFlight(flight, passengers, contact)
    results.push({
      flightId: flight?.id || null,
      airline: getNiraAirlineCode(flight),
      pnr: reserveResult.pnr,
      reserveResponse: reserveResult.raw
    })
  }

  return results
}

async function saveOrUpdateContract(payload) {
  console.log(payload , 'aasdasdasdasdasdasdasdasd');
  return await $fetch('https://api.ahuan.ir/api/Contract/update', {
    method: 'PUT',
    body: payload,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}




function formatNiraDate(dateInput) {
  const m = parsePassengerBirthDate(dateInput)
  if (!m) return ''

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const day = String(m.date()).padStart(2, '0')
  const month = monthNames[m.month()]
  const year = String(m.year()).slice(-2)

  return `${day}${month}${year}`
}




async function checkNiraCredit(selectedFlights) {
  const flights = Array.isArray(selectedFlights)
    ? selectedFlights.filter(Boolean)
    : []

  const finalPricingItems = Array.isArray(
    flightStore.selectedFlightsFinalPricing
  )
    ? flightStore.selectedFlightsFinalPricing
    : []

  const niraFlights = flights.filter(
    (flight) =>
      String(flight?.provider || '')
        .trim()
        .toUpperCase() === 'NIRA'
  )

  if (!niraFlights.length) {
    return []
  }

  if (!finalPricingItems.length) {
    throw new Error(
      'قیمت نهایی پروازها هنوز دریافت نشده است'
    )
  }

  /*
   * گروه‌بندی بر اساس airline
   *
   * HH + HH => یک درخواست اعتبار
   * HH + PA => دو درخواست اعتبار
   */
  const airlineGroups = new Map()

  for (const flight of niraFlights) {
    const airlineCode = String(
      flight?.airline || ''
    )
      .trim()
      .toUpperCase()

    if (!airlineCode) {
      throw new Error(
        `کد ایرلاین پرواز ${
          flight?.flightNumber || ''
        } مشخص نیست`
      )
    }

    /*
     * قیمت نهایی همین پرواز را از
     * selectedFlightsFinalPricing پیدا می‌کنیم.
     */
    const pricingItem =
      finalPricingItems.find(
        (item) =>
          item?.flightId === flight?.id
      )

    if (!pricingItem) {
      console.error(
        'Final pricing item not found:',
        {
          flight,
          finalPricingItems
        }
      )

      throw new Error(
        `قیمت نهایی پرواز ${
          flight?.flightNumber || ''
        } پیدا نشد`
      )
    }

    const flightPrice = Number(
      pricingItem?.totalPrice || 0
    )

    if (
      !Number.isFinite(flightPrice) ||
      flightPrice <= 0
    ) {
      throw new Error(
        `قیمت نهایی پرواز ${
          flight?.flightNumber || ''
        } معتبر نیست`
      )
    }

    if (!airlineGroups.has(airlineCode)) {
      airlineGroups.set(
        airlineCode,
        {
          airlineCode,
          requiredAmount: 0,
          flights: []
        }
      )
    }

    const group =
      airlineGroups.get(airlineCode)

    group.requiredAmount += flightPrice

    group.flights.push({
      flightId:
        flight?.id || null,

      flightNumber:
        flight?.flightNumber || '',

      origin:
        flight?.origin || '',

      destination:
        flight?.destination || '',

      price:
        flightPrice
    })
  }

  const results = []

  /*
   * برای هر ایرلاین فقط یک درخواست CRD
   */
  for (const group of airlineGroups.values()) {
    const response = await $fetch(
      'https://api.ahuan.ir/api/Nira/Command',
      {
        method: 'GET',

        query: {
          AirLine:
            group.airlineCode,

          Command:
            'CRD'
        }
      }
    )

    const responseText =
      typeof response === 'string'
        ? response
        : String(
            response?.AirNRSCommand
              ?.Response || ''
          )

    const creditMatch =
      responseText.match(
        /CREDIT\s*:\s*([\d,]+)\s*IRR/i
      )

    if (!creditMatch) {
      console.error(
        'Invalid Nira credit response:',
        {
          airlineCode:
            group.airlineCode,
          response
        }
      )

      throw new Error(
        `مبلغ اعتبار ایرلاین ${group.airlineCode} دریافت نشد`
      )
    }

    const credit = Number(
      creditMatch[1].replace(/,/g, '')
    )

    if (!Number.isFinite(credit)) {
      throw new Error(
        `مبلغ اعتبار ایرلاین ${group.airlineCode} معتبر نیست`
      )
    }

    /*
     * اعتبار کمتر از مجموع قیمت پروازهای
     * همان ایرلاین باشد، ادامه متوقف می‌شود.
     */
    if (credit < group.requiredAmount) {
      throw new Error(
        `اعتبار ایرلاین ${group.airlineCode} کافی نیست. ` +
        `اعتبار موجود: ${credit.toLocaleString('en-US')} ریال، ` +
        `مبلغ موردنیاز: ${group.requiredAmount.toLocaleString('en-US')} ریال`
      )
    }

    results.push({
      airlineCode:
        group.airlineCode,

      credit,

      requiredAmount:
        group.requiredAmount,

      remainingCredit:
        credit -
        group.requiredAmount,

      flights:
        group.flights,

      raw:
        response
    })
  }

  return results
}

function parsePassengerBirthDate(birthDate) {
  if (!birthDate) return null

  if (
    typeof birthDate === 'object' &&
    birthDate.calendar === 'jalali' &&
    birthDate.year &&
    birthDate.month &&
    birthDate.day
  ) {
    const jy = Number(birthDate.year)
    const jm = Number(birthDate.month)
    const jd = Number(birthDate.day)

    const g = toGregorian(jy, jm, jd)
    const parsed = moment.utc(`${g.gy}-${g.gm}-${g.gd}`, 'YYYY-M-D', true)
    return parsed.isValid() ? parsed : null
  }

  if (typeof birthDate === 'string') {
    const parsed = moment.utc(birthDate)
    return parsed.isValid() ? parsed : null
  }

  return null
}


















function getFlightSupplier(flight) {
  return String(
    flight?.provider ||
    flight?.flightSupplier ||
    ''
  ).trim().toUpperCase()
}
function isNiraFlight(flight) {
  return getFlightSupplier(flight) === 'NIRA'
}

function isMahanFlight(flight) {
  return getFlightSupplier(flight) === 'MAHAN'
}
function getMahanRawFlight(flight) {
  return flight?.meta?.raw || {}
}

function getMahanItineraries(flight) {
  const raw = getMahanRawFlight(flight)
  return Array.isArray(raw?.flightItinerary) ? raw.flightItinerary : []
}

function isMahanRoundTrip(flight) {
  return Boolean(
    flight?.isRoundTrip ||
    getMahanItineraries(flight).length > 1
  )
}
function getMahanPassengerType(passenger) {
  const type = String(
    passenger?.type ||
    passenger?.passengerType ||
    passenger?.PassengerType ||
    ''
  ).trim().toLowerCase()

  if (type === 'infant' || type === 'inf' || type === '3') return 3
  if (type === 'child' || type === 'chd' || type === '2') return 2
  return 1
}

function getMahanGender(gender) {
  const value = String(gender || '').trim().toLowerCase()

  if (
    value === 'female' ||
    value === 'f' ||
    value === '2' ||
    value === 'زن'
  ) {
    return 2
  }

  return 1
}

function getMahanDocType(passenger) {
  if (passenger?.passportNumber) return 2
  return 1
}

function toMahanIsoDate(value) {
  const isoDate = toIsoBirthDate(value)
  return isoDate || null
}

function mapPassengerToMahan(passenger, contactInfo = {}) {
  return {
    firstName: passenger?.firstNameEn || passenger?.englishName || passenger?.firstName || '',
    persianFirstName: passenger?.firstNameFa || passenger?.persianName || '',
    lastName: passenger?.lastNameEn || passenger?.englishFamily || passenger?.lastName || '',
    persianLastName: passenger?.lastNameFa || passenger?.persianFamily || '',
    docId: passenger?.passportNumber || passenger?.nationalCode || '',
    docType: getMahanDocType(passenger),
    birthDate: toMahanIsoDate(
      passenger?.birthDateGregorian ||
      passenger?.birthDateIso ||
      passenger?.birthDate
    ),
    passengerType: getMahanPassengerType(passenger),
    passportExpireDate: toMahanIsoDate(
      passenger?.passportExpireDateGregorian ||
      passenger?.passportExpireDateIso ||
      passenger?.passportExpireDate
    ),
    phoneNumber: contactInfo?.mobile || passenger?.mobile || '',
    email: contactInfo?.email || passenger?.email || '',
    gender: getMahanGender(passenger?.gender),
    passportIssueCountry: passenger?.passportIssueCountry || 'IR',
    issueCountry: passenger?.issueCountry || 'IR'
  }
}
function buildMahanReservePayload({
  flight,
  passengers,
  contactInfo,
  credentials
}) {
  const raw = getMahanRawFlight(flight)

  const searchToken =
    raw?.searchToken ||
    flight?.searchToken ||
    ''

  const threshold =
    raw?.threshold ||
    flight?.threshold ||
    ''

  const officialFactorId =
    raw?.officialFactorId ||
    flight?.officialFactorId ||
    ''

  const flightId =
    flight?.id ||
    raw?.id ||
    ''

  if (!flightId) {
    throw new Error('شناسه پرواز ماهان برای رزرو موجود نیست')
  }

  return {
    //  request:{
    searchToken,
    reserveRequest: {
      searchToken,
      flightId,
      threshold,
      officialFactorId,
      passengers: (passengers || []).map((passenger) =>
        mapPassengerToMahan(passenger, contactInfo)
      )
    },
    handlerParameterRequest: {
      providerName: raw?.providerName || 'Mahan',
      userName: credentials?.userName || '',
      password: credentials?.password || '',
      baseUrl: credentials?.baseUrl || '',
      agancyName: raw?.agancyName || credentials?.agancyName || 'Ahuan'
    }
    //  }
    
  }
}
async function reserveMahanFlight(flight, passengers, contactInfo) {
  if (!flight || !isMahanFlight(flight)) {
    throw new Error('پرواز ماهان برای رزرو معتبر نیست')
  }

  const payload = buildMahanReservePayload({
    flight,
    passengers,
    contactInfo,
    credentials: {
       userName: 'APIAHOVAN',
        password: 'AHVN@3298',
        baseUrl:
          'https://reservations.mahanair.co.ir/webservices/services/AAResWebServices',
        agancyName: 'Ahuan'
    }
  })

  const response = await $fetch('https://api.ahuan.ir/api/Mahan/Reserve', {
    method: 'POST',
    body: payload,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const reserveInfo = Array.isArray(response?.reserveInfos)
    ? response.reserveInfos[0]
    : null

  if (!reserveInfo) {
    throw new Error('پاسخ رزرو ماهان خالی است')
  }

  if (reserveInfo?.error?.code && reserveInfo.error.code !== 0) {
    throw new Error(
      reserveInfo?.error?.message ||
      'رزرو ماهان با خطا مواجه شد'
    )
  }

  const pnr =
    reserveInfo?.airlinePnr ||
    reserveInfo?.providerPnr ||
    reserveInfo?.pnr ||
    ''

  if (!pnr) {
    throw new Error('PNR رزرو ماهان دریافت نشد')
  }

  return {
    pnr,
    reserveResponse: response
  }
}
async function reserveFlightByProvider(flight, passengers, contactInfo) {
  const supplier = getFlightSupplier(flight)

  if (supplier === 'NIRA') {
    const result = await reserveNiraFlight(flight, passengers, contactInfo)

    return {
      flightId: flight?.id || null,
      supplier: 'NIRA',
      airline: flight?.airline || '',
      pnr: result?.pnr || '',
      reserveResponse: result?.reserveResponse || result?.raw || result
    }
  }

  if (supplier === 'MAHAN') {
    const result = await reserveMahanFlight(flight, passengers, contactInfo)

    return {
      flightId: flight?.id || null,
      supplier: 'MAHAN',
      airline: flight?.airline || 'W5',
      pnr: result?.pnr || '',
      reserveResponse: result?.reserveResponse || result?.raw || result
    }
  }

  throw new Error(`تامین‌کننده پشتیبانی نمی‌شود: ${supplier || 'UNKNOWN'}`)
}
async function reserveFlights(flights, passengers, contactInfo) {
  const safeFlights = Array.isArray(flights) ? flights.filter(Boolean) : []

  const results = []

  for (const flight of safeFlights) {
    const result = await reserveFlightByProvider(
      flight,
      passengers,
      contactInfo
    )

    results.push(result)
  }

  return results
}
const paymentError = ref('')
async function handleFinalPayment() {
  if (paymentLoading.value) {
    return
  }

  try {
    paymentLoading.value = true
    paymentError.value = ''

    const selectedFlights =
      Array.isArray(
        flightStore.selectedFlights
      )
        ? flightStore.selectedFlights.filter(
            Boolean
          )
        : [
            flightStore.selectedDepartureFlight,
            flightStore.selectedReturnFlight
          ].filter(Boolean)

    if (!selectedFlights.length) {
      throw new Error(
        'هیچ پروازی برای رزرو انتخاب نشده است'
      )
    }

    if (hasNiraFlights(selectedFlights)) {
      await checkNiraCredit(selectedFlights)
    }

    const passengers =
      Array.isArray(
        bookingData.value?.passengers
      )
        ? bookingData.value.passengers
        : []

    if (!passengers.length) {
      throw new Error(
        'اطلاعات مسافران موجود نیست'
      )
    }

    const contactInfo = {
      mobile:
        bookingData.value?.contact?.mobile ||
        bookingData.value?.contact?.phone ||
        '',

      email:
        bookingData.value?.contact?.email ||
        ''
    }

    /*
     * ۱. رزرو پرواز
     */
    const reserveResults =
      await reserveFlights(
        selectedFlights,
        passengers,
        contactInfo
      )

    /*
     * ۲. ساخت Payload آپدیت قرارداد
     */
    const updateContractPayload =
      buildUpdateContractPayload({
        currentContractData:
          currentContractData.value,

        selectedFlights,
        reserveResults,
        passengers,
        contactInfo
      })

    /*
     * ۳. ابتدا Contract/update
     */
    const updateResponse =
      await saveOrUpdateContract(
        updateContractPayload
      )

    /*
     * ۴. دریافت contractId
     */
    const contractId =
      extractContractIdFromUpdate(
        updateResponse
      )

    /*
     * ۵. بعد از Update،
     * اطلاعات پرداخت ساخته می‌شود.
     */
    const paymentData =
      createPaymentData()

    /*
     * ۶. ذخیره در sessionStorage
     */
    const paymentSession =
      savePaymentSession({
        contractId,
        paymentData
      })

    /*
     * ۷. ادامه مراحل براساس نوع پرداخت
     */
    await continuePaymentAfterUpdate(
      paymentSession
    )
  } catch (error) {
    console.error(
      'handleFinalPayment error:',
      error
    )

    paymentError.value =
      error?.response?.data?.message ||
      error?.data?.message ||
      error?.message ||
      'خطا در رزرو و پرداخت'

    alert(paymentError.value)
  } finally {
    paymentLoading.value = false
  }
}

function buildUpdateContractPayload({
  currentContractData,
  selectedFlights,
  reserveResults,
  passengers,
  contactInfo,
  
}) {
  const addPayload = currentContractData?.addPayload || {}
  const addResponse = currentContractData?.addResponse || {}

  const contractId =
    addResponse?.data?.id ||
    addResponse?.id ||
    addPayload?.id ||
    0

  const contractFlights = (selectedFlights || []).map((flight) => {
    const reserve = (reserveResults || []).find(
      (item) => item?.flightId === flight?.id
    )

    return {
      contractId,
      origin: flight?.origin || flight?.from || flight?.originCode || '',
      destination: flight?.destination || flight?.to || flight?.destinationCode || '',
      flightClass:
        flight?.cabinClass ||
        flight?.flightClass ||
        flight?.class ||
        flight?.bookingClass ||
        'X',
      airlineId: resolveAirlineId(flight),
      flightNumber: flight?.flightNumber || flight?.flightNo || '',
      depDate: formatFlightDate(
        flight?.departure || flight?.departureDateTime || flight?.depDate || ''
      ),
      depTime: formatFlightTime(
        flight?.departure || flight?.departureDateTime || flight?.depTime || ''
      ),
      arrDate: formatFlightDate(
        flight?.arrival || flight?.arrivalDateTime || flight?.arrDate || ''
      ),
      arrTime: formatFlightTime(
        flight?.arrival || flight?.arrivalDateTime || flight?.arrTime || ''
      ),
      airplaneType:
        flight?.aircraft ||
        flight?.airplaneType ||
        flight?.aircraftType ||
        flight?.aircraftTypeCode ||
        '',
      charterFlight:
        flight?.isCharter === true ||
        flight?.charterFlight === true,
      description: '',
      destination: flight?.destination || flight?.to || flight?.destinationCode || '',
      flightSupplier: flight?.provider || flight?.flightSupplier || '',
      pnr: reserve?.pnr || '',
      reserveResponse: reserve?.reserveResponse || null
    }
  })

 const contractPassengers = mapPassengersToPayload(
  passengers || [],
  selectedFlights || []
).map((passenger) => ({
  ...passenger,
  contractId
}))

  return {
    ...addPayload,

  id: contractId,

  userName: String(
    contactInfo?.mobile ||
    contactInfo?.phone ||
    ''
  ).trim(),

  email: String(
    contactInfo?.email || ''
  ).trim(),

contractDesc:
  addPayload?.contractDesc || '',

  contractFlights,
  contractPassengers
  }
}


function hasNiraFlights(flights) {
  return (flights || []).some(isNiraFlight)
}








const PAYMENT_SESSION_KEY = 'flight_payment_session'

const formshaparakRef = ref(null)

const formshaparak = reactive({
  bankToken: ''
})
function getUserData() {
  const userCookie = useCookie('user_data')

  let userData = userCookie.value

  if (typeof userData === 'string') {
    try {
      userData = JSON.parse(userData)
    } catch {
      userData = null
    }
  }

  return userData
}

function createPaymentData() {
  const totalPrice = Number(
    flightStore.finalBookingPrice || 0
  )

  if (
    !Number.isFinite(totalPrice) ||
    totalPrice <= 0
  ) {
    throw new Error('مبلغ کل قرارداد معتبر نیست')
  }
const email = String(
    bookingData.value?.contact?.email || ''
  ).trim()

  const mobile = String(
    bookingData.value?.contact?.mobile ||
    bookingData.value?.contact?.phone ||
    ''
  ).trim()
  const userData = getUserData()

  const isAgency =
    userData?.noLimit === true

  const travelCardUsed =
    travelCardApplied.value === true

const travelCardNumber =
  travelCardUsed
    ? String(
        appliedTravelCardNumber.value || ''
      ).trim()
    : ''

  const availableTravelCardCredit = Math.max(
    Number(travelCardCredit.value || 0),
    0
  )

  const travelCardAmount =
    travelCardUsed
      ? Math.min(
          availableTravelCardCredit,
          totalPrice
        )
      : 0

  const gatewayAmount = Math.max(
    totalPrice - travelCardAmount,
    0
  )

  /*
   * آژانس:
   * مبلغ قرارداد در هر دو فیلد ذخیره می‌شود،
   * ولی به درگاه بانکی نمی‌رود.
   */
  if (isAgency) {
    return {
      type: 'agency',
      totalPrice,
      payableAmount: totalPrice,
      travelCardUsed: false,
      travelCardAmount: 0,
      travelCardNumber:'',
        email, // اضافه شد
        mobile 
    }
  }

  /*
   * کل مبلغ با سفرکارت پرداخت شده است.
   *
   * payableAmount همچنان مبلغ کل قرارداد است؛
   * تصمیم عدم انتقال به بانک براساس type است.
   */
  if (
    travelCardUsed &&
    travelCardAmount >= totalPrice
  ) {
    return {
      type: 'travelcard',
      totalPrice,
      payableAmount: totalPrice,
      travelCardUsed: true,
      travelCardAmount: totalPrice,
      travelCardNumber,
        email, // اضافه شد
        mobile 
    }
  }

  /*
   * بخشی با سفرکارت و باقی‌مانده با درگاه.
   */
  if (
    travelCardUsed &&
    travelCardAmount > 0 &&
    gatewayAmount > 0
  ) {
    return {
      type: 'travelcard-gateway',
      totalPrice,
      payableAmount: gatewayAmount,
      travelCardUsed: true,
      travelCardAmount,
      travelCardNumber,
        email, // اضافه شد
        mobile 
    }
  }

  /*
   * کل مبلغ با درگاه پرداخت می‌شود.
   */
  return {
    type: 'gateway',
    totalPrice,
    payableAmount: totalPrice,
    travelCardUsed: false,
    travelCardAmount: 0,
    travelCardNumber:'',
      email, // اضافه شد
      mobile 
  }
}
function savePaymentSession({
  contractId,
  paymentData
}) {
  if (typeof window === 'undefined') {
    throw new Error(
      'sessionStorage در دسترس نیست'
    )
  }

  const normalizedContractId =
    Number(contractId)

  if (
    !Number.isInteger(normalizedContractId) ||
    normalizedContractId <= 0
  ) {
    throw new Error(
      'شناسه قرارداد معتبر نیست'
    )
  }

  const paymentSession = {
    contractId: normalizedContractId,
    type: paymentData.type,
    totalPrice: Number(
      paymentData.totalPrice
    ),
    payableAmount: Number(
      paymentData.payableAmount
    ),
    travelCardUsed:
      paymentData.travelCardUsed === true,
    travelCardAmount: Number(
      paymentData.travelCardAmount || 0
    ),
     travelCardNumber: String(
    paymentData.travelCardNumber || ''
  ).trim(),
   email: String(
    paymentData.email || ''
  ).trim(),

  mobile: String(
    paymentData.mobile || ''
  ).trim()
  }

  sessionStorage.setItem(
    PAYMENT_SESSION_KEY,
    JSON.stringify(paymentSession)
  )

  return paymentSession
}
function extractContractIdFromUpdate(
  updateResponse
) {
  const contractId = Number(
    updateResponse?.data?.id ||
    updateResponse?.data?.contractId ||
    updateResponse?.id ||
    updateResponse?.contractId ||
    0
  )

  if (
    !Number.isInteger(contractId) ||
    contractId <= 0
  ) {
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

async function requestBankToken({
  amount,
  contractId
}) {
  const bankAmount = Number(amount)

  if (
    !Number.isFinite(bankAmount) ||
    bankAmount <= 0
  ) {
    throw new Error(
      'مبلغ ارسالی به درگاه معتبر نیست'
    )
  }

  const revertUrl =
    `${window.location.origin}/verify` +
    `?responseData=${encodeURIComponent(contractId)}&`

  const response = await $fetch(
    'https://test.ahuan.ir/api/Tejarat/BankToken',
    {
      method: 'POST',

      body: {
        amount: bankAmount,
        revertUrl
      }
    }
  )

  const bankToken =
    typeof response === 'string'
      ? response
      : response?.data?.tokenIdentity ||
        response?.data?.bankToken ||
        response?.data?.token ||
        response?.tokenIdentity ||
        response?.bankToken ||
        response?.token ||
        response?.data ||
        ''

  if (!bankToken) {
    console.error(
      'Invalid BankToken response:',
      response
    )

    throw new Error(
      'توکن درگاه بانکی دریافت نشد'
    )
  }

  return String(bankToken)
}
async function submitShaparakForm(
  bankToken
) {
  formshaparak.bankToken = bankToken

  await nextTick()

  const form = formshaparakRef.value

  if (!form) {
    throw new Error(
      'فرم شاپرک پیدا نشد'
    )
  }

  HTMLFormElement.prototype.submit.call(
    form
  )
}
async function continuePaymentAfterUpdate(
  paymentSession
) {
  switch (paymentSession.type) {
    /*
     * آژانس به درگاه بانکی نمی‌رود.
     */
    case 'agency':
      await router.push({
        path: '/verify',
        query: {
          responseData:
            paymentSession.contractId
        }
      })

      return

    /*
     * پرداخت کامل سفرکارت هم
     * به درگاه بانکی نمی‌رود.
     */
    case 'travelcard':
      await router.push({
        path: '/verify',
        query: {
          responseData:
            paymentSession.contractId
        }
      })

      return

    /*
     * فقط مبلغ باقی‌مانده به بانک می‌رود.
     */
    case 'travelcard-gateway': {
      const bankToken =
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

    /*
     * کل مبلغ قرارداد به بانک می‌رود.
     */
    case 'gateway': {
      const bankToken =
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

</script>




<style>
.list-enter-active,
.list-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.35s ease;
  will-change: transform, opacity;
}

.list-move {
  transition: transform 2s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(18px) scale(0.97);
  filter: blur(4px);
}

.list-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

.list-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-14px) scale(0.98);
  filter: blur(3px);
}

.list-leave-active {
  position: absolute;
  width: 100%;
  pointer-events: none;
  z-index: 0;
}

.animate-enter {
  animation: ticketIn 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.animate-leave {
  animation: ticketOut 0.25s ease forwards;
}

@keyframes ticketIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.96);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes ticketOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
  to {
    opacity: 0;
    transform: translateY(-12px) scale(0.98);
    filter: blur(3px);
  }
}

</style> 