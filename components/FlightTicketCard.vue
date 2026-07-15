<template>
  <div 
    class="bg-white rounded-xl border-1 border-[var(--color-gray-100)] overflow-hidden shadow-md transition-opacity"
    :class="cardDisabled ? 'opacity-60 pointer-events-none select-none' : ''"
  >
    <div class="min-h-[200px] flex flex-col md:flex-row-reverse relative z-10 bg-white">
      <div class="flex-1 border-[var(--color-gray-100)] order-2 border-t-2 md:border-t-0 md:border-r-1 border-dashed relative p-3 pb-12 flex flex-col justify-center">
        <div class="flex items-center w-full md:flex-col">
          <template v-if="cardDisabled">
            <div class="w-full text-center py-6">
              <p class="font-bold text-[18px] text-red-500">
                {{ statusMessage }}
              </p>
            </div>
          </template>

          <template v-else>
            <UiBaseButton
            v-if="!props.hideSelectButton"
              label="انتخاب پرواز"
              variant="filled"
              color="primary"
              :active="false"
              :disabled="false"
              class="flex-1 text-[12px] order-1 md:order-2 text-white py-2 !rounded-3xl ml-2 mt-5"
              @click="selectFlight"
            />

            <div class="flex-[3] order-2 text-right md:order-1">
              <p class="font-bold text-[22px] text-[var(--color-primary-dark)]">
                {{ formatPrice(finalPrice) }}
              </p>
              <p class="text-sm text-left font-normal">ریال</p>
            </div>
          </template>
        </div>

        <div class="absolute -bottom-3 right-0 w-full flex justify-center md:justify-start gap-4 p-3 md:hidden">
          <button
            @click="toggleTab('rules')"
            :class="activeTab === 'rules' ? 'text-blue-600 font-bold bg-gray-300' : 'text-gray-500 font-medium'"
            class="text-[12px] hover:text-blue-600 transition-colors duration-300 transition-all rounded-sm py-2 px-2"
          >
            قوانین کنسلی
          </button>
          <button
            @click="toggleTab('info')"
            :class="activeTab === 'info' ? 'text-blue-600 font-bold' : 'text-gray-500 font-medium'"
            class="text-[12px] hover:text-blue-600 transition-colors duration-300 transition-all rounded-sm py-2 px-2"
          >
            اطلاعات پرواز
          </button>
        </div>

        <p
          v-if="!cardDisabled"
          class="hidden absolute bottom-0 w-full text-center text-red-500 pb-2 md:block text-[12px] font-bold"
          dir="rtl"
        >
          {{ capacityText }}
        </p>
      </div>

      <div class="flex-[3] order-1 relative p-3 pb-12 flex flex-col">
        <div class="flex md:flex-col">
          <div class="flex-1 flex justify-start py-4 items-start md:hidden">
            <img
              v-if="airlineLogo"
              :src="airlineLogo"
              class="w-[105px]"
              :alt="airlineName"
              @error="handleLogoError"
            >
          </div>

          <div class="flex-[1] text-end">
            <UiBaseLabel
              class="mr-2 text-[12px]"
              :text="flightTypeLabel"
              color="#2629A6"
            />
            <UiBaseLabel
              class="mr-2 text-[12px]"
              :text="cabinLabel"
              color="#2629A6"
            />
          </div>
        </div>

        <div class="flex gap-5 mt-2">
          <div class="flex-[3]">
            <!-- رفت -->
            <div class="mt-4 flex items-center gap-3 text-gray-400 text-sm">
              <div class="flex items-center gap-1">
                <span class="text-[12px]">مقصد</span>
                <i class="bi bi-geo-alt"></i>
              </div>

              <div class="flex-1 relative flex justify-center items-center">
                <svg
                  class="w-full h-7"
                  viewBox="0 0 346 27"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M1 26C1 26 119.005 0.5 173.5 0.5C227.995 0.5 345 26 345 26"
                    stroke="#B3B3B3"
                    stroke-dasharray="4 4"
                  />
                </svg>
                <i class="bi bi-airplane-fill absolute -top-2 w-5 h-5 -rotate-[90deg] text-gray-400 bg-white text-xl"></i>
              </div>

              <div class="flex flex-row-reverse items-center gap-1">
                <span class="text-[12px]">مبدا</span>
                <i class="bi bi-geo-alt"></i>
              </div>
            </div>

            <div class="mt-4 flex justify-between text-sm text-gray-600">
              <span class="text-[16px] -mt-5">{{ destinationCity }}</span>
              <span class="text-[16px] -mt-5">{{ originCity }}</span>
            </div>

            <div class="mt-1 flex justify-between text-sm text-gray-600">
              <span class="text-[12px]">{{ arrivalTime }}</span>
              <span class="text-[12px]">{{ departureTime }}</span>
            </div>

            <div class="mt-1 flex justify-center text-sm text-gray-500">
              <span dir="rtl" class="text-[12px]">{{ departureDateLabel }}</span>
            </div>

            <!-- برگشت -->
            <template v-if="isRoundTripView">
              <div class="mt-5 flex items-center gap-3 text-gray-400 text-sm">
                <div class="flex items-center gap-1">
                  <span class="text-[12px]">مقصد</span>
                  <i class="bi bi-geo-alt"></i>
                </div>

                <div class="flex-1 relative flex justify-center items-center">
                <svg
                  class="w-full h-7"
                  viewBox="0 0 346 27"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M1 26C1 26 119.005 0.5 173.5 0.5C227.995 0.5 345 26 345 26"
                    stroke="#B3B3B3"
                    stroke-dasharray="4 4"
                  />
                </svg>
                <i class="bi bi-airplane-fill absolute -top-2 w-5 h-5 rotate-[90deg] text-gray-400 bg-white text-xl"></i>
              </div>

                <div class="flex flex-row-reverse items-center gap-1">
                  <span class="text-[12px]">مبدا</span>
                  <i class="bi bi-geo-alt"></i>
                </div>
              </div>

              <div class="mt-4 flex justify-between text-sm text-gray-600">
                <span class="text-[16px]">{{ returnDestinationCity }}</span>
                <span class="text-[16px]">{{ returnOriginCity }}</span>
              </div>

              <div class="mt-1 flex justify-between text-sm text-gray-600">
                <span class="text-[12px]">{{ returnArrivalTime }}</span>
                <span class="text-[12px]">{{ returnDepartureTime }}</span>
              </div>
              <div class="mt-1 flex justify-center text-sm text-gray-500">
              <span dir="rtl" class="text-[12px]">{{ formatFlightDateShort(flight.returnDeparture) }}</span>
            </div>
            </template>
          </div>

          <div class="hidden md:flex md:flex-1 md:justify-end items-center">
            <img
              v-if="airlineLogo"
              :src="airlineLogo"
              class="w-[150px]"
              :alt="airlineName"
              @error="handleLogoError"
            >
          </div>
        </div>

        <p
          v-if="!cardDisabled"
          class="absolute bottom-0 w-full text-center text-red-500 pb-2 font-bold text-[12px] md:hidden"
        >
          {{ capacityText }}
        </p>

        <div class="hidden absolute -bottom-3 left-3 w-full md:flex justify-center md:justify-end p-3">
          <button
            @click="toggleTab('rules')"
            :class="activeTab === 'rules'
              ? 'text-blue-600 font-bold bg-gray-100'
              : 'text-gray-500 font-medium'"
            class="text-[12px] hover:text-blue-600 duration-300 transition-all rounded-t-sm py-2 px-2"
          >
            قوانین کنسلی
          </button>

          <button
            @click="toggleTab('info')"
            :class="activeTab === 'info'
              ? 'text-blue-600 font-bold bg-gray-100'
              : 'text-gray-500 font-medium'"
            class="text-[12px] hover:text-blue-600 transition-colors duration-300 transition-all rounded-t-sm py-2 px-2"
          >
            اطلاعات پرواز
          </button>
        </div>
      </div>
    </div>

        <!-- Wrapper بیرونی کرکره با انیمیشن ارتفاع -->
    <div
      class="grid transition-all duration-300 ease-in-out bg-gray-50"
      :class="activeTab ? 'grid-rows-[1fr] opacity-100 border-t-2 border-gray-200' : 'grid-rows-[0fr] opacity-0'"
    >
      <div class="overflow-hidden">
        <!-- اضافه کردن Transition برای تغییر نرم محتوا -->
        <Transition name="fade-slide" mode="out-in">
          
          <!-- ۱. پنل قوانین کنسلی -->
          <div 
            v-if="activeTab === 'rules'" 
            key="rules-tab"
            class="flex text-[12px] flex-col md:flex-row bg-gray-100"
          >
            <div class="flex-1 order-2 md:order-1 border-white border-t-2 md:border-t-0 border-r-1 border-dashed relative p-3 pb-12 flex flex-col justify-center">
              <template v-if="passengerPrices.length">
                <div class="flex py-2" v-for="(item, index) in passengerPrices" :key="`passenger-${index}`">
                  <p class="flex-1 text-start">{{ formatPrice(item.total) }}</p>
                  <p class="flex-1 flex justify-end">
                    <span class="order-2 px-2">({{ item.count }})</span> 
                    <span class="order-1 font-bold">{{ item.label }}</span>
                  </p>
                </div>
              </template>
              <template v-else>
                <div class="flex py-2">
                  <p class="flex-1 text-start">{{ formatPrice(finalPrice) }}</p>
                  <p class="flex-1 flex justify-end">
                    <span class="order-2 px-2">1</span>
                    <span class="order-1">بزرگسال</span>
                  </p>
                </div>
              </template>
              <p class="flex text-[var(--color-primary-dark)] flex-row-reverse justify-center border-t-1 font-bold pt-4 mt-4">
                <span class="px-2">مجموع</span>
                <span>{{ formatPrice(finalPrice) }}</span>
                <span class="px-2">ریال</span>
              </p>
            </div>

            <div class="flex-[3] order-2 relative p-3 pb-12 flex flex-col">
              <template v-if="loadingRules">
                <div class="flex mt-2 flex-row-reverse">
                  <p class="flex-1 text-[12px] text-gray-500 flex justify-end items-center">
                    در حال دریافت قوانین کنسلی...
                  </p>
                </div>
              </template>
              <template v-else-if="refundPolicies.length > 0">
                <div
                  v-for="(rule, index) in refundPolicies"
                  :key="`refund-rule-${index}`"
                  class="flex mt-2 flex-row-reverse border-b border-gray-200 pb-2 last:border-b-0"
                >
                  <p class="flex-1 text-[12px] flex justify-end items-center text-right">
                    {{ getRuleDescription(rule) }}
                  </p>
                  <p dir="rtl" class="relative flex items-center justify-center gap-1 bg-white px-6 py-2 rounded-xl shadow-sm overflow-hidden after:content-[''] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-2 after:bg-teal-400 text-gray-800 font-medium w-fit">
                    {{ getRulePenalty(rule) }}
                  </p>
                </div>
              </template>
              <template v-else>
                <div class="flex mt-2 flex-row-reverse">
                  <p class="flex-3 text-[12px] text-red-500 flex justify-end items-center">
                    قوانین کنسلی برای این پرواز اعلام نشده است.
                  </p>
                </div>
              </template>
            </div>
          </div>

          <!-- ۲. پنل اطلاعات پرواز -->
          <div 
            v-else-if="activeTab === 'info'" 
            key="info-tab"
            class="flex text-[12px] flex-col md:flex-row bg-gray-100"
          >
            <div class="flex-1 order-2 md:order-1 border-white border-t-2 md:border-t-0 border-r-1 border-dashed relative p-3 pb-12 flex flex-col justify-center">
              <template v-if="passengerPrices.length">
                <div class="flex py-2" v-for="(item, index) in passengerPrices" :key="`passenger-${index}`">
                  <p class="flex-1 text-start">{{ formatPrice(item.total) }}</p>
                  <p class="flex-1 flex justify-end">
                    <span class="order-2 px-2">({{ item.count }})</span> 
                    <span class="order-1 font-bold">{{ item.label }}</span>
                  </p>
                </div>
              </template>
              <template v-else>
                <div class="flex py-2">
                  <p class="flex-1 text-start">{{ formatPrice(finalPrice) }}</p>
                  <p class="flex-1 flex justify-end">
                    <span class="order-2 px-2">1</span>
                    <span class="order-1">بزرگسال</span>
                  </p>
                </div>
              </template>
              <p class="flex text-[var(--color-primary-dark)] flex-row-reverse justify-center border-t-1 font-bold pt-4 mt-4">
                <span class="px-2">مجموع</span>
                <span>{{ formatPrice(finalPrice) }}</span>
                <span class="px-2">ریال</span>
              </p>
            </div>

            <div class="flex-[3] order-1 md:order-2 relative p-3 pb-12 mt-4">
              <div
                v-for="(segment, index) in segments"
                :key="`segment-${index}`"
                class="mb-6 last:mb-0"
              >
                <div v-if="segmentTitle(index)" class="flex flex-col md:flex-row mb-2">
                  <p class="text-center md:flex-1 font-bold">
                    {{ segmentTitle(index) }}
                  </p>
                  <p class="text-center md:flex-1"></p>
                </div>

                <div class="flex flex-col md:flex-row">
                  <p class="text-center md:flex-1 font-bold">
                    {{ formatFlightDate(segment.departure) }}
                  </p>
                  <p class="text-center md:flex-1">
                    {{ formatTime(segment.departure) }}
                  </p>
                </div>

                <div class="flex flex-col md:flex-row">
                  <p class="text-center md:flex-1 font-bold">
                    {{ getCityLabel(segment.origin) }}
                  </p>
                  <p class="text-center md:flex-1">
                    {{ getAirportLabel(segment.origin) }}
                  </p>
                </div>

                <div class="flex flex-col md:flex-row mt-3">
                  <p class="text-center md:flex-1 font-bold">
                    {{ formatFlightDate(segment.arrival) }}
                  </p>
                  <p class="text-center md:flex-1">
                    {{ formatTime(segment.arrival) }}
                  </p>
                </div>

                <div class="flex flex-col md:flex-row">
                  <p class="text-center md:flex-1 font-bold">
                    {{ getCityLabel(segment.destination) }}
                  </p>
                  <p class="text-center md:flex-1">
                    {{ getAirportLabel(segment.destination) }}
                  </p>
                </div>

                <div class="flex flex-col md:flex-row my-3">
                  <p class="text-center md:flex-1 text-[var(--color-primary-dark)] font-bold">
                    {{ getFlightDurationLabel(segment) }}
                  </p>
                  <p class="text-center md:flex-1"></p>
                </div>

                <div class="flex flex-col md:flex-row mt-4">
                  <div class="text-center flex justify-center py-1 md:flex-1">
                    <div class="border-r-1 border-[var(--color-gray-300)] flex flex-col text-center py-4 px-4">
                      <p class="py-2">شماره پرواز</p>
                      <p class="font-bold">{{ segment.flightNumber || '-' }}</p>
                    </div>
                    <div class="flex flex-col text-center py-4 px-4">
                      <p class="py-2">کلاس پرواز</p>
                      <p class="font-bold">{{ segment.bookingClass || segment.rbd || '-' }}</p>
                    </div>
                  </div>
                  <div class="text-center flex flex-col items-center justify-center md:flex-1">
                    <p class="py-2">نوع هواپیما</p>
                    <p class="font-bold">
                      {{ segment.aircraftTypeName || segment.aircraftTypeCode || '-' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </Transition>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFlightStore } from '~/stores/flights'

const props = defineProps({
  flight: {
    type: Object,
    required: true
  },
  airlineInfo: {
    type: Object,
    default: () => ({})
  },
  hideSelectButton: {
    type: Boolean,
    default: false
  }
  // پروپس airports حذف شد؛ حالا از استور خوانده می‌شود
})

const emit = defineEmits(['select'])

// ───────────────── استور ─────────────────
const flightStore = useFlightStore()
const route = useRoute()
const activeTab = ref(null)
const logoFailed = ref(false)
const loadingRules = ref(false)
const niraRules = ref(null)

const isNira = computed(() => String(props.flight.provider || '').toUpperCase() === 'NIRA')
const isMahan = computed(() => String(props.flight.provider || '').toUpperCase() === 'MAHAN') // اضافه کردن computed property برای ماهان

// ───────────────── پیدا کردن ایرلاین از استور ─────────────────
const airlineFromStore = computed(() => {
  if (!props.flight.airline) return null
  return flightStore.airlines.find((a) => a.code === props.flight.airline) || null
})

const airlineName = computed(() => {
  return (
    props.airlineInfo?.name ||
    airlineFromStore.value?.name ||
    props.flight.airline ||
    'ایرلاین'
  )
})

const airlineLogo = computed(() => {
  if (logoFailed.value) return '' // اگر بارگذاری لوگو با خطا مواجه شد، مسیر خالی برگردان

  if (isMahan.value) {
    return '/imgs/flight/airlines/mahan.png' // مسیر لوگو ماهان
  }

  return (
    props.airlineInfo?.logo ||
    props.airlineInfo?.image ||
    airlineFromStore.value?.logo ||
    ''
  )
})

// ───────────────── فرودگاه‌ها از استور ─────────────────
const airports = computed(() => flightStore.iranAirports || [])

function findAirport(code) {
  if (!code) return null
  return airports.value.find((item) => item.iataCode === code || item.cityCode === code) || null
}

// ───────────────── تب‌ها و قوانین ─────────────────
const toggleTab = async (tabName) => {
  if (activeTab.value === tabName) {
    activeTab.value = null
    return
  }

  activeTab.value = tabName

  if (
    tabName === 'rules' &&
    isNira.value &&
    props.flight.needsFare === true &&
    !niraRules.value
  ) {
    await fetchNiraRules()
  }
}

const fetchNiraRules = async () => {
  loadingRules.value = true

  try {
    const departureDate = String(props.flight.departure || '')
      .trim()
      .split(' ')[0]
      .split('T')[0]

    const params = new URLSearchParams({
      AirLine: String(props.flight.airline || '').trim(),
      Route: `${String(props.flight.origin || '').trim()}-${String(props.flight.destination || '').trim()}`,
      RBD: String(props.flight.rbd || props.flight.bookingClass || '').trim(),
      DepartureDate: departureDate,
      FlightNo: String(props.flight.flightNumber || '').trim()
    })

    const url = `https://api.ahuan.ir/api/Nira/Fare?${params.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    // بعضی وقت‌ها API یک JSON string برمی‌گرداند
    niraRules.value = typeof data === 'string' ? JSON.parse(data) : data
  } catch (e) {
    console.error('Error fetching Nira rules:', e)
    niraRules.value = null
  } finally {
    loadingRules.value = false
  }
}

// ───────────────── قیمت ─────────────────
const passengerCounts = computed(() => {
  return {
    adult: Number(route.query.adl || 1),
    child: Number(route.query.chd || 0),
    infant: Number(route.query.inf || 0)
  }
})

const finalPrice = computed(() => {
  // ۱. اگر نیرا بود، از همان قوانین نیرا استفاده کن (درست است)
  if (isNira.value && niraRules.value) {
    return (
      (Number(niraRules.value.AdultTotalPrice || 0) * passengerCounts.value.adult) +
      (Number(niraRules.value.ChildTotalPrice || 0) * passengerCounts.value.child) +
      (Number(niraRules.value.InfantTotalPrice || 0) * passengerCounts.value.infant)
    );
  }

  // ۲. برای ماهان و بقیه، دقیقاً از منطق جمعِ passengerPrices استفاده کن
  // با این کار، هر چقدر در passengerPrices محاسبه کردیم، اینجا هم مجموعش نمایش داده می‌شود
  return passengerPrices.value.reduce((sum, item) => sum + item.total, 0);
});


// ───────────────── قوانین کنسلی ─────────────────
const refundPolicies = computed(() => {
  if (isNira.value && niraRules.value?.CRCNRules) {
    return String(niraRules.value.CRCNRules)
      .split('/')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const parts = item.split(',')
        const title = String(parts[0] || '').trim()
        const penalty = String(parts[1] || '').trim()
        const type = String(parts[2] || '').trim()

        return {
          title,
          penalty,
          type
        }
      })
      .filter((item) => item.title)
  }

  const items =
    props.flight.meta?.raw?.refundPolicyDetails ||
    props.flight.refundPolicyDetails ||
    []

  return Array.isArray(items) ? items : []
})

// ───────────────── رفت و برگشت ─────────────────
const isRoundTripView = computed(() => {
  if (isNira.value) return false

  return Boolean(
    props.flight.isRoundTrip &&
    props.flight.returnDeparture &&
    props.flight.returnArrival
  )
})

const segments = computed(() => {
  const outbound = {
    origin: props.flight.origin,
    destination: props.flight.destination,
    departure: props.flight.departure,
    arrival: props.flight.arrival,
    flightNumber: props.flight.flightNumber,
    bookingClass: props.flight.bookingClass,
    rbd: props.flight.rbd,
    aircraftTypeCode: props.flight.aircraftTypeCode,
    aircraftTypeName: props.flight.aircraftTypeName,
    durationMinutes: props.flight.durationMinutes || props.flight.flightDurationMinutes || null,
    durationText: props.flight.durationText || props.flight.flightDuration || null,
    capacity: props.flight.capacity
  }

  if (!isRoundTripView.value) return [outbound]

  const inbound = {
    origin: props.flight.returnOrigin,
    destination: props.flight.returnDestination,
    departure: props.flight.returnDeparture,
    arrival: props.flight.returnArrival,
    flightNumber: props.flight.returnFlightNumber,
    bookingClass: props.flight.returnBookingClass,
    rbd: props.flight.returnRbd,
    aircraftTypeCode: props.flight.returnAircraftTypeCode,
    aircraftTypeName: props.flight.returnAircraftTypeName,
    durationMinutes: props.flight.returnDurationMinutes || props.flight.returnFlightDurationMinutes || null,
    durationText: props.flight.returnDurationText || props.flight.returnFlightDuration || null,
    capacity: props.flight.returnCapacity
  }

  return [outbound, inbound]
})

// ───────────────── لیبل‌های شهر و زمان ─────────────────
const originCity = computed(() => getCityLabel(props.flight.origin))
const destinationCity = computed(() => getCityLabel(props.flight.destination))
const departureTime = computed(() => formatTime(props.flight.departure))
const arrivalTime = computed(() => formatTime(props.flight.arrival))
const departureDateLabel = computed(() => formatFlightDateShort(props.flight.departure))

const returnOriginCity = computed(() => getCityLabel(props.flight.returnOrigin))
const returnDestinationCity = computed(() => getCityLabel(props.flight.returnDestination))
const returnDepartureTime = computed(() => formatTime(props.flight.returnDeparture))
const returnArrivalTime = computed(() => formatTime(props.flight.returnArrival))

// ───────────────── وضعیت کارت ─────────────────
const isCanceled = computed(() => {
  const status = String(
    props.flight.status ||
    props.flight.availabilityStatus ||
    props.flight.state ||
    props.flight.ticketStatus ||
    ''
  ).toLowerCase()

  const message = String(props.flight.statusMessage || '').toLowerCase()

  return (
    props.flight.canceled === true ||
    props.flight.cancelled === true ||
    status.includes('cancel') ||
    status.includes('باطل') ||
    status.includes('کنسل') ||
    message.includes('cancel') ||
    message.includes('باطل') ||
    message.includes('کنسل')
  )
})

const minCapacity = computed(() => {
  const capacities = segments.value
    .map((item) => Number(item.capacity))
    .filter((item) => Number.isFinite(item))

  if (!capacities.length) return null
  return Math.min(...capacities)
})

const isSoldOut = computed(() => {
  return minCapacity.value !== null && minCapacity.value <= 0
})

const cardDisabled = computed(() => {
  return Boolean(props.flight.disabled || isCanceled.value || isSoldOut.value)
})

const statusMessage = computed(() => {
  if (isCanceled.value) return 'کنسل شده'
  if (isSoldOut.value) return 'تکمیل ظرفیت'
  if (props.flight.statusMessage) return props.flight.statusMessage
  return cardDisabled.value ? 'غیرقابل خرید' : 'قابل خرید'
})

// ───────────────── لیبل کلاس و نوع پرواز ─────────────────
const cabinLabel = computed(() => {
  const map = {
    1: 'فرست کلاس',
    2: 'بیزینس',
    3: 'اکونومی',
    4: 'پریمیوم اکونومی',
    5: 'بیزینس',
    6: 'اکونومی'
  }
  return map[Number(props.flight.cabinType)] || 'اکونومی'
})

const flightTypeLabel = computed(() => {
  const refundable = props.flight.meta?.raw?.isRefundable
  if (refundable === false) return 'چارتر'
  return 'سیستمی'
})

// ───────────────── قیمت مسافران ─────────────────

const passengerPrices = computed(() => {
  const counts = passengerCounts.value;
  const basePrice = Number(props.flight.priceFrom || 0);

  // ۱. منطق اختصاصی نیرا (چون نیرا دیتای قیمت دارد)
  if (props.flight.provider === 'NIRA' && niraRules.value) {
    const prices = [];
    if (counts.adult > 0) prices.push({ label: 'بزرگسال', count: counts.adult, total: Number(niraRules.value.AdultTotalPrice || basePrice) * counts.adult });
    if (counts.child > 0) prices.push({ label: 'کودک', count: counts.child, total: Number(niraRules.value.ChildTotalPrice || Math.round(basePrice * 0.75)) * counts.child });
    if (counts.infant > 0) prices.push({ label: 'نوزاد', count: counts.infant, total: Number(niraRules.value.InfantTotalPrice || Math.round(basePrice * 0.1)) * counts.infant });
    return prices;
  }

  // ۲. منطق محاسباتی برای ماهان (و بقیه) - استفاده از قیمت پایه
  // فقط کافیست یکبار basePrice را ضرب در تعداد و ضرایب کنیم
  return [
    { label: 'بزرگسال', count: counts.adult, total: basePrice * counts.adult },
    { label: 'کودک', count: counts.child, total: Math.round(basePrice * 0.75) * counts.child },
    { label: 'نوزاد', count: counts.infant, total: Math.round(basePrice * 0.1) * counts.infant }
  ].filter(p => p.count > 0);
});






// ───────────────── ظرفیت ─────────────────
const capacityText = computed(() => {
  if (cardDisabled.value) return ''
  if (minCapacity.value == null) return ''
  return `${formatNumber(minCapacity.value)} صندلی مانده`
})

// ───────────────── اکشن‌ها ─────────────────
const selectFlight = () => {
  if (cardDisabled.value) return
  emit('select', props.flight)
}

const handleLogoError = () => {
  logoFailed.value = true
}

const segmentTitle = (index) => {
  if (!isRoundTripView.value) return ''
  return index === 0 ? 'پرواز رفت' : 'پرواز برگشت'
}

// ───────────────── توابع کمکی ─────────────────
function parseDate(value) {
  if (!value) return null
  const normalized = String(value).includes('T') ? String(value) : String(value).replace(' ', 'T')
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return null
  return date
}

function formatTime(value) {
  const date = parseDate(value)
  if (!date) return '-'

  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date)
}

function formatPrice(value) {
  return new Intl.NumberFormat('fa-IR').format(Number(value || 0))
}

function formatNumber(value) {
  return new Intl.NumberFormat('fa-IR').format(Number(value || 0))
}

function formatFlightDate(value) {
  const date = parseDate(value)
  if (!date) return '-'

  const enDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric'
  }).format(date)

  const faDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)

  return `(${enDate}) ${faDate}`
}

function formatFlightDateShort(value) {
  const date = parseDate(value)
  if (!date) return '-'

  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

function getCityLabel(code) {
  const airport = findAirport(code)
  return airport?.cityNicName || code || '-'
}

function getAirportLabel(code) {
  const airport = findAirport(code)
  if (!airport) return '-'
  return `${airport.nicName || '-'} (${airport.name || code})`
}

function getPassengerLabel(type) {
  const labels = {
    'ADT': 'بزرگسال', 'ADULT': 'بزرگسال', 'A': 'بزرگسال',
    'CHD': 'کودک', 'CHILD': 'کودک', 'C': 'کودک',
    'INF': 'نوزاد', 'INFANT': 'نوزاد', 'I': 'نوزاد'
  };
  const normalizedType = String(type || '').toUpperCase().trim();
  return labels[normalizedType] || 'مسافر';
}

function getRuleDescription(rule) {
  if (isNira.value) {
    return rule.title || 'شرایط جریمه'
  }

  return rule.description || rule.title || rule.rule || rule.text || 'شرایط جریمه'
}

function getRulePenalty(rule) {
  if (isNira.value) {
    if (!rule.penalty) return 'نامشخص'
    return `${formatNumber(rule.penalty)}% جریمه`
  }

  const penalty = rule.penaltyPercent ?? rule.percent ?? rule.penalty ?? rule.amount
  if (penalty == null) return 'نامشخص'

  if (rule.penaltyPercent != null || rule.percent != null) {
    return `${formatNumber(penalty)}% جریمه`
  }

  return `${formatPrice(penalty)} ریال`
}

function getFlightDurationLabel(segment) {
  if (segment.durationText) return `مدت پرواز: ${segment.durationText}`

  if (Number.isFinite(Number(segment.durationMinutes)) && Number(segment.durationMinutes) > 0) {
    return `مدت پرواز: ${formatDurationFromMinutes(Number(segment.durationMinutes))}`
  }

  const diffMinutes = getDiffMinutes(segment.departure, segment.arrival)
  if (diffMinutes <= 0) return 'مدت پرواز: -'

  return `مدت پرواز: ${formatDurationFromMinutes(diffMinutes)}`
}

function getDiffMinutes(startTime, endTime) {
  const start = parseDate(startTime)
  const end = parseDate(endTime)
  if (!start || !end) return 0

  const diff = Math.floor((end.getTime() - start.getTime()) / 60000)
  return diff > 0 ? diff : 0
}

function formatDurationFromMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0 && minutes > 0) {
    return `${formatNumber(hours)} ساعت و ${formatNumber(minutes)} دقیقه`
  }

  if (hours > 0) {
    return `${formatNumber(hours)} ساعت`
  }

  return `${formatNumber(minutes)} دقیقه`
}
</script>
<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
