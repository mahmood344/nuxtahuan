<template>

  <div class="min-h-screen bg-gray-100 pb-24 md:bg-white md:pb-10 mt-[60px]" dir="ltr">

    <!-- همان هدر صفحه پرواز -->

    <header class="hidden md:block relative h-[97px] w-full bg-secondary -mt-10">

      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('/imgs/flight/header.png')"></div>

      <div class="absolute -bottom-15 left-0 right-0 z-10 mx-auto max-w-3xl px-4">

        <Stepper :steps="busSteps" :active-step="currentStep" active-color="#1a237e" />

      </div>

    </header>

    <main class="mx-auto mt-0 md:mt-[100px] max-w-7xl px-0 md:px-4">

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">

        <!-- سایدبار: کامپوننت مشترک با پرواز -->

        <aside class="hidden lg:block lg:col-span-3 order-1 lg:order-2">

          <div class="top-24 space-y-4">

            <FlightSearchPanel mode="aside" :showServices="true" @bus-search="isFilterModalOpen = false" />

            <div v-if="currentStep === 0" class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm" dir="rtl">

              <div class="flex items-center justify-between mb-4">

                <h3 class="text-normal font-bold text-gray-800">فیلترهای اتوبوس</h3>

                <button type="button" class="text-small text-primary" @click="resetFilters">پاک کردن</button>

              </div>

              <label class="flex items-center gap-2 text-normal text-gray-700 mb-4">

                <input v-model="onlyAvailable" type="checkbox" class="accent-primary" />

                فقط سرویس‌های قابل خرید

              </label>

              <label class="flex items-center gap-2 text-normal text-gray-700 mb-4">

                <input v-model="onlyVip" type="checkbox" class="accent-primary" />

                فقط اتوبوس‌های VIP

              </label>

              <p class="text-small text-gray-500 font-bold mb-2">شرکت مسافربری</p>

              <label v-for="company in companies" :key="company" class="flex items-center gap-2 text-small text-gray-600 mb-2">

                <input v-model="selectedCompanies" type="checkbox" :value="company" class="accent-primary" />

                {{ company }}

              </label>

            </div>

          </div>

        </aside>

        <!-- نتایج -->

        <section class="lg:col-span-9 order-2 lg:order-1 relative" dir="rtl">

          <!-- تقویم مشترک با پرواز؛ تاریخ داخلی به میلادی تبدیل شده -->

          <div v-if="currentStep === 0" class="mb-4 md:mb-6 bg-gray-100 md:bg-white px-2 py-3 md:p-2 overflow-hidden rounded-2xl" dir="ltr">

            <DateCarousel

              :days-count="21"

              :start-date="carouselStartDate"

              :selected-date="carouselSelectedDate"

              @date-selected="handleDateChange"

            />

          </div>

          <!-- کنترل‌های موبایل -->

          <div v-if="currentStep === 0" class="lg:hidden mb-4 px-2 flex gap-2">

            <UiBaseButton label="مرتب‌سازی" variant="soft" color="primary" icon="↕️"

              class="!rounded-full bg-white px-5 py-3 text-small shadow-sm" @click="isSortDropdownOpen = !isSortDropdownOpen" />

            <UiBaseButton label="فیلترها" variant="soft" color="primary" icon="⚙️"

              class="!rounded-full bg-white px-5 py-3 text-small shadow-sm" @click="isFilterModalOpen = true" />

            <div v-if="isSortDropdownOpen" class="absolute top-[100px] right-2 z-50 rounded-xl bg-white p-2 shadow-xl">

              <button v-for="option in sortOptions" :key="option" type="button"

                class="block w-full rounded-lg px-4 py-2 text-right text-small hover:bg-gray-100"

                @click="activeTab = option; isSortDropdownOpen = false">{{ option }}</button>

            </div>

          </div>

          <div v-if="currentStep === 0" class="mb-4 text-center text-small text-gray-400 px-2">

            <span v-if="loading">در حال جستجوی اتوبوس‌ها...</span>

            <span v-else>تعداد {{ filteredBuses.length }} اتوبوس یافت شد</span>

          </div>

          <!-- تب‌های مرتب‌سازی مشترک -->

          <div v-if="currentStep === 0" class="hidden lg:flex mb-6 items-center gap-1 rounded-xl p-1 text-small" dir="ltr">

            <UiBaseTabs :items="sortOptions" v-model="activeTab" />

          </div>

          <div v-if="currentStep === 0 && errorMessage" class="mx-2 mb-4 rounded-2xl border border-red-100 bg-red-50 p-5 text-normal text-red-700">

            {{ errorMessage }}

            <button class="mr-3 underline" type="button" @click="loadBuses">تلاش مجدد</button>

          </div>

          <!-- همان کارت برای داده استاتیک و خروجی واقعی API -->

          <div v-if="currentStep === 0 && !loading && !errorMessage && filteredBuses.length" class="space-y-4 px-2 md:px-0">

            <div v-if="useMockBuses" class="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-small leading-6 text-amber-800">

              حالت نمایشی: داده‌های زیر نمونه ثبت‌شده برای ۱۴۰۵/۰۸/۱۷ هستند؛ تاریخ انتخابی URL روی این داده‌های آزمایشی اعمال نمی‌شود و امکان رزرو وجود ندارد.

            </div>

            <BusTicketCard

              v-for="(bus, index) in filteredBuses"

              :key="bus.id || bus.moveCode || index"

              :bus="bus"

              :enable-selection="!useMockBuses"
              @select="chooseBus"

            />

          </div>

          <div v-else-if="currentStep === 0 && !loading && !errorMessage" class="mx-2 rounded-[2rem] border-2 border-dashed border-gray-100 bg-white py-20 text-center">

            <p class="font-bold text-gray-700">اتوبوسی در تاریخ انتخاب‌شده یافت نشد.</p>

            <p class="mt-2 text-small text-gray-400">تاریخ یا مسیر دیگری را انتخاب کنید.</p>

          </div>


          <!-- مرحله دوم: نقشه صندلی + اطلاعات افراد -->
          <div v-if="selectedBus && (currentStep === 1 || currentStep === 2)" v-show="currentStep === 1" class="space-y-4 px-2 md:px-0" dir="rtl">
            <!-- <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4">
              <div>
                <h2 class="text-large font-bold text-gray-800">انتخاب صندلی و اطلاعات مسافران</h2>
                <p class="mt-1 text-small text-gray-500">حداکثر ۱۰ صندلی را انتخاب کنید. اطلاعات هر صندلی جداگانه ثبت می‌شود.</p>
              </div>
              <button type="button" class="rounded-xl border border-gray-200 px-4 py-2 text-normal text-primary" @click="backToBuses">تغییر اتوبوس</button>
            </div> -->
            <BusTicketCard
              :key="selectedBus.id || selectedBus.moveCode"
              :bus="selectedBus"
              :enable-selection="false"
              :seat-selection-mode="true"
              :selected-seats="selectedSeatNumbers"
              @update:selected-seats="updateSelectedSeats"
              @change-bus="backToBuses"
            />
            <div v-if="selectedSeatNumbers.length" class="space-y-4">
              <div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-normal text-primary">
                {{ selectedSeatNumbers.length }} صندلی از ۱۰ انتخاب شده است: {{ selectedSeatNumbers.join('، ') }}
              </div>
              <PassengerInfoForm
                ref="busPassengerFormRef"
                :seat-numbers="selectedSeatNumbers"
              />
              <ContactInfoForm
                ref="busContactFormRef"
                :loading="busContactSubmitting"
                @submit="handleBusContactSubmit"
              />
              <p v-if="busFormMessage" class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-normal text-blue-800">{{ busFormMessage }}</p>
              <p class="text-small text-gray-500">اطلاعات هر مسافر را در فرم صندلی خودش وارد کنید؛ شماره تماس و ایمیل را هم در فرم اطلاعات تماس تکمیل کنید.</p>
            </div>
            <p v-else class="rounded-xl bg-gray-50 p-4 text-normal text-gray-600">برای نمایش فرم مسافران و اطلاعات تماس، ابتدا حداقل یک صندلی انتخاب کنید.</p>
          </div>

          <!-- مرحله سوم: پیش نمایش اطلاعات ثبت شده پیش از پرداخت -->
          <div v-if="currentStep === 2 && busBookingDraft" class="space-y-4 px-2 md:px-0" dir="rtl">
            <!-- <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div>
                <h2 class="text-large font-bold text-gray-800">تأیید اطلاعات و پرداخت</h2>
                <p class="mt-1 text-small text-gray-500">قبل از ادامه، اطلاعات مسافران و شماره تماس را بررسی کنید.</p>
              </div>
              <button type="button" class="rounded-xl border border-gray-200 px-4 py-2 text-normal font-bold text-primary" @click="backToBusPassengerForm">بازگشت به فرم و صندلی‌ها</button>
            </div> -->

            <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <h3 class="mb-4 text-normal font-bold text-gray-800">اطلاعات سفر و صندلی‌ها</h3>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div class="rounded-xl bg-gray-50 px-4 py-3">
                  <p class="mb-1 text-xs text-gray-500">مبدأ</p>
                  <p class="text-sm font-bold text-gray-800">{{ busBookingDraft.bus.originName || busBookingDraft.bus.origin || '—' }}</p>
                </div>
                <div class="rounded-xl bg-gray-50 px-4 py-3">
                  <p class="mb-1 text-xs text-gray-500">مقصد</p>
                  <p class="text-sm font-bold text-gray-800">{{ busBookingDraft.bus.destinationName || busBookingDraft.bus.destination || '—' }}</p>
                </div>
                <div class="rounded-xl bg-gray-50 px-4 py-3">
                  <p class="mb-1 text-xs text-gray-500">پایانه مبدأ</p>
                  <p class="text-sm font-bold text-gray-800">{{ getBusOriginInfo(busBookingDraft.bus).terminal || 'اعلام نشده' }}</p>
                </div>
                <div class="rounded-xl bg-gray-50 px-4 py-3">
                  <p class="mb-1 text-xs text-gray-500">پایانه مقصد</p>
                  <p class="text-sm font-bold text-gray-800">{{ busBookingDraft.bus.getOffPlace || 'اعلام نشده' }}</p>
                </div>
                <div class="rounded-xl bg-gray-50 px-4 py-3">
                  <p class="mb-1 text-xs text-gray-500">تاریخ و ساعت حرکت</p>
                  <p class="text-sm font-bold text-gray-800">{{ formatBusDeparture(busBookingDraft.bus) }}</p>
                </div>
                <div class="rounded-xl bg-gray-50 px-4 py-3">
                  <p class="mb-1 text-xs text-gray-500">شرکت مسافربری</p>
                  <p class="text-sm font-bold text-gray-800">{{ busBookingDraft.bus.companyName || '—' }}</p>
                </div>
                <div class="rounded-xl bg-gray-50 px-4 py-3">
                  <p class="mb-1 text-xs text-gray-500">نوع اتوبوس</p>
                  <p class="text-sm font-bold text-gray-800">{{ busBookingDraft.bus.busType || busBookingDraft.bus.busTypeCode || '—' }}</p>
                </div>
                <div class="rounded-xl bg-gray-50 px-4 py-3">
                  <p class="mb-1 text-xs text-gray-500">تعداد صندلی</p>
                  <p class="text-sm font-bold text-gray-800">{{ busBookingDraft.seats.length.toLocaleString('fa-IR') }} صندلی</p>
                </div>
                <div class="rounded-xl bg-gray-50 px-4 py-3 sm:col-span-2 lg:col-span-3">
                  <p class="mb-2 text-xs text-gray-500">شماره صندلی(ها)</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="seat in busBookingDraft.seats" :key="seat"
                      class="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-primary">
                      {{ seat }}
                    </span>
                    <span v-if="!busBookingDraft.seats.length" class="text-sm text-gray-500">—</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <BookingInfoTable
                mode="passengers"
                :is-bus-booking="true"
                flight-type="domestic"
                :passengers="busBookingDraft.passengers"
                @update:passengers="updateBusDraftPassengers"
              />
            </div>
            <div>
              <BookingInfoTable
                mode="contact"
                :is-bus-booking="true"
                :contact="busBookingDraft.contact"
                @update:contact="updateBusDraftContact"
              />
            </div>

            <!-- استفاده مستقیم از کامپوننت مشترک PaymentSummary -->
            <PaymentSummary
              :unit-price="busUnitPrice"
              :passenger-count="busPassengerCount"
              :original-price="busTotalPrice"
              :loading="busPaymentLoading"
              :final-price="busPriceAfterTravelCard"
              submit-label="تأیید و پرداخت"
              :travel-card-credit="busTravelCardCredit"
              :travel-card-loading="busTravelCardLoading"
              :travel-card-applied="busTravelCardApplied"
              :travel-card-owner-name="busTravelCardOwnerName"
              :travel-card-error-message="busTravelCardError"
              @back="backToBusPassengerForm"
              @submit="handleBusPaymentSubmit"
              @apply-travel-card="handleBusTravelCardApply"
              @reset-travel-card="resetBusTravelCard"
              @clear-travel-card-error="busTravelCardError = ''"
            />
            <p v-if="busPaymentMessage" class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-normal text-amber-800">{{ busPaymentMessage }}</p>
          </div>

        </section>

      </div>

    </main>

    <!-- مودال فیلتر موبایل -->

    <Transition name="fade">

      <div v-if="isFilterModalOpen" class="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-900/50 backdrop-blur-sm lg:hidden" @click.self="isFilterModalOpen = false">

        <div class="flex max-h-[90vh] w-full flex-col rounded-t-[2rem] bg-white shadow-2xl" dir="rtl">

          <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">

            <h3 class="font-bold text-gray-800">جستجو و فیلتر اتوبوس</h3>

            <button type="button" class="text-2xl text-gray-500" @click="isFilterModalOpen = false">×</button>

          </div>

          <div class="flex-1 overflow-y-auto p-4 space-y-5">

            <FlightSearchPanel mode="aside" :showServices="true" @bus-search="isFilterModalOpen = false" />

            <div class="rounded-xl border border-gray-100 p-4 space-y-4">

              <label class="flex gap-2 text-normal"><input v-model="onlyAvailable" type="checkbox" /> فقط سرویس‌های قابل خرید</label>

              <label class="flex gap-2 text-normal"><input v-model="onlyVip" type="checkbox" /> فقط اتوبوس‌های VIP</label>

              <label v-for="company in companies" :key="company" class="flex gap-2 text-small">

                <input v-model="selectedCompanies" type="checkbox" :value="company" /> {{ company }}

              </label>

              <button type="button" class="text-small text-primary" @click="resetFilters">پاک کردن فیلترها</button>

            </div>

          </div>

          <div class="border-t border-gray-100 p-4">

            <UiBaseButton label="اعمال فیلترها" variant="filled" color="primary" class="w-full !rounded-2xl !py-4" @click="isFilterModalOpen = false" />

          </div>

        </div>

      </div>

    </Transition>

    <form ref="busShaparakFormRef" name="PostForm" method="POST" action="https://ikc.shaparak.ir/iuiv3/IPG/Index" class="hidden">
      <input name="tokenIdentity" type="hidden" :value="busShaparak.bankToken" />
    </form>

    <!-- Full Loading همان الگوی پرواز -->

    <Transition name="fade">

      <div v-if="loading" class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/10 backdrop-blur-[3px]">

        <div class="flex flex-col items-center rounded-3xl bg-white p-8 shadow-2xl">

          <div class="relative flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-primary)]">

            <div class="absolute inset-0 animate-spin rounded-full border-4 border-blue-300 border-t-blue-100"></div>

            <img src="/imgs/flight/loading.gif" alt="در حال جستجوی اتوبوس" class="relative z-10 h-[70px] w-[70px] object-contain" />

          </div>

          <h4 class="mt-5 text-normal font-bold text-gray-800" dir="rtl">در حال جستجوی اتوبوس‌ها...</h4>

        </div>

      </div>

    </Transition>

    <Transition name="fade">

      <button v-if="showBackToTop" type="button" aria-label="بازگشت به بالای صفحه"

        class="hidden md:flex fixed bottom-8 right-8 z-[100] h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-xl"

        @click="scrollToTop">↑</button>

    </Transition>

  </div>

</template>

<script setup>

import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import moment from 'moment-jalaali'

import { toGregorian, toJalaali, isValidJalaaliDate } from 'jalaali-js'

import { searchAllBusProviders } from '~/services/searchBuses.js'

import BusTicketCard from '~/components/BusTicketCard.vue'
import BookingInfoTable from '~/components/BookingInfoTable.vue'
import PaymentSummary from '~/components/PaymentSummary.vue'

// برای اتصال به API واقعی، فقط مقدار زیر را false کن.

// نمایش تاریخ سرویس با قالب خوانا بدون تغییر مقدار اصلی API
function formatBusDeparture(bus) {
  const date = String(bus?.departureDate || '').trim()
  const compact = date.replace(/\D/g, '')
  const formattedDate = /^\d{8}$/.test(compact)
    ? `${compact.slice(0, 4)}/${compact.slice(4, 6)}/${compact.slice(6, 8)}`
    : (date || '—')
  const time = String(bus?.departureTime || '').trim()
  return time ? `${formattedDate} - ساعت ${time}` : formattedDate
}

const useMockBuses = false

function mapNiraBus(raw, index) {

  const capacity = Number(raw.capacity ?? 0)

  const priceFrom = Number(raw.tripDestinationFare ?? 0)

  const canceled = /کنسل|لغو|باطل/.test(String(raw.type || '') + ' ' + String(raw.explanation || ''))

  const disabled = canceled || capacity <= 0 || priceFrom <= 0

  return {

    id: `NIRABUS-${raw.moveCode || index}`,

    provider: 'NIRABUS',

    companyCode: raw.companyCode || '',

    companyName: String(raw.companyName || '').trim(),

    companyBrand: raw.rmtO_CompanyBrand || '',

    moveCode: raw.moveCode || '',

    origin: raw.tripOrigin || '',

    originName: raw.tripOriginName || '',

    destination: raw.tripDestination || '',

    destinationName: raw.tripDestinationName || '',

    departureDate: raw.departureDate || '',

    departureTime: raw.hour || '',

    busType: raw.type || '',

    busTypeCode: raw.typeE || '',

    capacity,

    priceFrom,

    currency: 'IRR',

    ridingPlace: raw.ridingPlace || '',

    getOffPlace: raw.getOffPlace || '',

    explanation: raw.explanation || '',

    disabled,

    statusMessage: canceled ? 'کنسل شده' : capacity <= 0 ? 'تکمیل ظرفیت' : priceFrom <= 0 ? 'قیمت نامعتبر' : 'قابل خرید',

    meta: { raw }

  }

}

const route = useRoute()

const router = useRouter()

const buses = ref([])

const loading = ref(false)

const errorMessage = ref('')

const currentStep = ref(0)
const selectedBus = ref(null)
const selectedSeatNumbers = ref([])
const busPassengerFormRef = ref(null)
const busContactFormRef = ref(null)
const busContactSubmitting = ref(false)
const busFormMessage = ref('')
// اطلاعات تاییدشده صرفاً برای ادامه جریان رزرو در صفحه نگهداری می‌شوند.
const busBookingDraft = ref(null)
// نتیجه درخواست Add قرارداد؛ برای جلوگیری از ثبت تکراری نگهداری می‌شود.
const busContractAddResult = ref(null)
const busContractSubmitting = ref(false)
const busPaymentLoading = ref(false)
const busShaparakFormRef = ref(null)
const busShaparak = reactive({ bankToken: '' })
const BUS_PAYMENT_SESSION_KEY = 'flight_payment_session' // قرارداد ذخیره‌سازی مشترک؛ verify هنوز برای اتوبوس بررسی نشده است.
const BUS_PAYMENT_TEST_BEFORE_VERIFY = true // تست مراحل قرارداد و پرداخت، بدون انتقال به درگاه یا verify


function busToEnglishDigits(value) {
  return String(value ?? '')
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 1632))
}

function busLoggedInPhone() {
  const cookie = useCookie('user_data').value
  let user = cookie
  if (typeof user === 'string') {
    try { user = JSON.parse(user) } catch { user = null }
  }
  const phone = busToEnglishDigits(user?.mobile ?? user?.data?.mobile ?? '').replace(/\D/g, '')
  if (!/^09\d{9}$/.test(phone)) throw new Error('برای ثبت قرارداد، ابتدا وارد حساب کاربری شوید.')
  return phone
}

function busBirthDateToIso(birthDate) {
  if (!birthDate) return null
  const parts = typeof birthDate === 'object'
    ? [birthDate.year, birthDate.month, birthDate.day]
    : busToEnglishDigits(birthDate).replace(/-/g, '/').split('/')
  if (parts.length < 3 || parts.some(part => !part)) return null
  const [y, m, d] = parts.map(part => busToEnglishDigits(part).trim())
  const date = `${y.padStart(4, '0')}/${m.padStart(2, '0')}/${d.padStart(2, '0')}`
  const jalali = birthDate?.calendar === 'jalali' || Number(y) < 1700
  const parsed = moment(date, jalali ? 'jYYYY/jMM/jDD' : 'YYYY/MM/DD', true)
  return parsed.isValid() ? parsed.startOf('day').toISOString() : null
}

// همان ساختار ContractPassenger مورد استفاده در ثبت پرواز.
function mapBusContractPassengers(passengers) {
  return passengers.map(passenger => {
    const nationalCode = busToEnglishDigits(passenger.nationalCode).trim()
    return {
      id: 0,
      contractId: 0,
      fName: String(passenger.firstName ?? '').trim(),
      lName: String(passenger.lastName ?? '').trim(),
      age: String(passenger.type || 'ADL').toUpperCase(),
      gender: passenger.gender === 'male' || passenger.gender === true,
      birthDate: busBirthDateToIso(passenger.birthDate),
      codeMelli: nationalCode,
      passportNo: nationalCode,
      passportIssueDate: null,
      passportExpDate: null,
      nationality: 'IR',
      goBusSeatNo: busToEnglishDigits(passenger.seatNo).trim(),
      description: '',
      contractPassengerTaxes: []
    }
  })
}

function busCityId(bus, kind) {
  const source = bus?.meta?.raw || {}
  const names = kind === 'origin'
    ? [bus?.orgCityId, bus?.originCityId, source.orgCityId, source.originCityId]
    : [bus?.dstCityId, bus?.destinationCityId, source.dstCityId, source.destinationCityId]
  const actual = names.find(value => value !== '' && value != null && Number.isInteger(Number(value)) && Number(value) > 0)
  return actual == null ? 0 : Number(actual) // کد متنی نیرا را به‌عنوان CityId ارسال نکن.
}

function normalizeBusLocation(value) {
  return String(value ?? '').trim().replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/\s+/g, ' ')
}

function getBusOriginInfo(bus) {
  const raw = bus?.meta?.raw || {}
  const originName = normalizeBusLocation(raw.tripOriginName || bus?.originName)
  const explicitCity = normalizeBusLocation(raw.tripOriginCity || bus?.originCityName)
  const city = explicitCity || originName.split(' ')[0] || ''
  const explicitTerminal = normalizeBusLocation(bus?.ridingPlace || raw.ridingPlace)
  const suffix = originName.startsWith(`${city} `) ? originName.slice(city.length).trim() : ''
  const terminal = explicitTerminal || (suffix ? `پایانه ${suffix}` : '')
  return { city, terminal }
}

// مانند پرواز، تاریخ قرارداد را به میلادی با قالب YYYY-MM-DD ارسال می‌کنیم.
function formatBusContractDate(value) {
  const date = busToEnglishDigits(value).trim()
  const match = date.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)
    || date.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (!match) throw new Error('فرمت تاریخ حرکت اتوبوس نامعتبر است.')
  const y = Number(match[1]), m = Number(match[2]), d = Number(match[3])
  let gy = y, gm = m, gd = d
  if (y < 1700) {
    if (!isValidJalaaliDate(y, m, d)) throw new Error('تاریخ شمسی حرکت اتوبوس معتبر نیست.')
    const converted = toGregorian(y, m, d)
    gy = converted.gy; gm = converted.gm; gd = converted.gd
  } else {
    const test = new Date(Date.UTC(y, m - 1, d))
    if (test.getUTCFullYear() !== y || test.getUTCMonth() !== m - 1 || test.getUTCDate() !== d)
      throw new Error('تاریخ میلادی حرکت اتوبوس معتبر نیست.')
  }
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`
}

// به تعداد صندلی‌ها ContractBus می‌سازیم؛ DTO فیلد مجزای شماره صندلی ندارد.
function mapBusContractRows(bus, seats, contact) {
  const raw = bus?.meta?.raw || {}
  const originInfo = getBusOriginInfo(bus)
  const mobile = busToEnglishDigits(contact?.recipientPhone || contact?.phone || '').replace(/\D/g, '')
  return seats.map(seat => ({
    id: 0,
    contractId: 0,
    orgCityName: originInfo.city,
    dstCityName: String(raw.tripDestinationCity || bus.destinationName || raw.tripDestinationName || '').trim(),
    orgTerminal: originInfo.terminal,
    dstTerminal: String(bus.getOffPlace || raw.getOffPlace || ''),
    companyName: String(bus.companyName || ''),
    busType: String(bus.busType || raw.type || ''),
    busTypeDetails: String(bus.busTypeCode || raw.typeE || ''),
    finalDestination: String(raw.finalDestinationName || raw.finalDestination || bus.destinationName || ''),
    date: formatBusContractDate(bus.departureDate || raw.departureDate),
    time: String(bus.departureTime || raw.hour || ''),
    description: '',
    providerCode: String(bus.provider || 'NIRABUS'),
    providerOrigin: String(raw.tripOrigin || bus.origin || '').trim(),
    providerDestination: String(raw.finalDestination || bus.finalDestination || raw.tripDestination || bus.destination || '').trim(),
    providerCompanyCode: String(bus.companyCode || raw.companyCode || ''),
    providerMoveCode: String(bus.moveCode || raw.moveCode || ''),
    providerPnr: null,
    providerStatus: null,
    contactCellPhone: mobile,
    direction: 1,
    reservedAt: null,
    providerOperationStatus: null,
    providerPendingAction: null,
    lastProviderError: null
  }))
}

async function addBusContract(bus, seats, passengers, contact) {
  const phone = busLoggedInPhone()
  const unitPrice = Number(bus.priceFrom)
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) throw new Error('قیمت اتوبوس معتبر نیست.')
  if (passengers.length !== seats.length) throw new Error('تعداد مسافران با تعداد صندلی‌ها برابر نیست.')
  const seatKeys = seats.map(seat => busToEnglishDigits(seat).trim())
  const passengerSeatKeys = passengers.map(passenger => busToEnglishDigits(passenger.seatNo).trim())
  if (passengerSeatKeys.some(seat => seat.length > 10)) {
    throw new Error('شماره صندلی نمی‌تواند بیشتر از ۱۰ کاراکتر باشد.')
  }
  if (new Set(seatKeys).size !== seatKeys.length ||
      passengerSeatKeys.some(seat => !seat || !seatKeys.includes(seat)) ||
      new Set(passengerSeatKeys).size !== seatKeys.length) {
    throw new Error('شماره صندلی مسافران با صندلی‌های انتخاب‌شده مطابقت ندارد.')
  }
  if (passengers.some(p => !busBirthDateToIso(p.birthDate))) throw new Error('تاریخ تولد یکی از مسافران معتبر نیست.')
  const raw = bus.meta?.raw || {}
  if (!bus.moveCode || !bus.companyCode || !(raw.tripOrigin || bus.origin) || !(raw.finalDestination || bus.finalDestination || raw.tripDestination || bus.destination)) {
    throw new Error('کدهای سرویس اتوبوس برای ثبت قرارداد کامل نیستند.')
  }
  const payload = {
    id: 0,
    userName: phone,
    email: String(contact.email || '').trim(),
    issueDate: moment().format('YYYY-MM-DD'),
    issueTime: moment().format('HH:mm'),
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
    travelVehicle: 'اتوبوس',
    visa: false,
    totalPrice: unitPrice * seats.length,
    totalPrice2: 0,
    contractFlights: [],
    contractPassengers: mapBusContractPassengers(passengers),
    contractBus: mapBusContractRows(bus, seats, contact)
  }
  const response = await $fetch('https://api.ahuan.ir/api/Contract/add', {
    method: 'POST',
    body: payload,
    headers: { 'Content-Type': 'application/json' }
  })
  if (response?.success === false || response?.isSuccess === false || response?.errors?.length) {
    throw new Error(response?.message || response?.errors?.join('، ') || 'ثبت قرارداد ناموفق بود.')
  }
  return { payload, response }
}

// قیمت «هر صندلی» در خروجی جستجوی سرویس (ریال) است.
const busUnitPrice = computed(() => {
  const price = Number(busBookingDraft.value?.bus?.priceFrom ?? 0)
  return Number.isFinite(price) && price > 0 ? price : 0
})
const busPassengerCount = computed(() => busBookingDraft.value?.seats?.length ?? 0)
const busTotalPrice = computed(() => busUnitPrice.value * busPassengerCount.value)
const busPaymentMessage = ref('')
const busTravelCardError = ref('')
const busTravelCardCredit = ref(0)
const busTravelCardLoading = ref(false)
const busTravelCardApplied = ref(false)
const busTravelCardOwnerName = ref('')
const busTravelCardData = ref(null)
const busAppliedTravelCardNumber = ref('')
// اعتبار مثبت کارت فقط تا سقف مبلغ بلیت‌های انتخاب‌شده لحاظ می‌شود.
const busTravelCardDeduction = computed(() =>
  busTravelCardApplied.value
    ? Math.min(busTotalPrice.value, Math.max(0, Number(busTravelCardCredit.value) || 0))
    : 0
)
const busPriceAfterTravelCard = computed(() => Math.max(0, busTotalPrice.value - busTravelCardDeduction.value))
let busTravelCardRequestId = 0
function resetBusTravelCard() {
  ++busTravelCardRequestId // پاسخ درخواست قدیمی نباید دوباره کارت را اعمال کند.
  busTravelCardCredit.value = 0
  busTravelCardApplied.value = false
  busTravelCardOwnerName.value = ''
  busTravelCardError.value = ''
  busTravelCardData.value = null
  busAppliedTravelCardNumber.value = ''
  busTravelCardLoading.value = false
  busPaymentMessage.value = ''
}
async function handleBusTravelCardApply(cardNumber) {
  const normalizedCardNumber = String(cardNumber ?? '').trim()
  if (!normalizedCardNumber || busTravelCardLoading.value) return
  const requestId = ++busTravelCardRequestId
  busTravelCardLoading.value = true
  busTravelCardApplied.value = false
  busTravelCardCredit.value = 0
  busTravelCardOwnerName.value = ''
  busTravelCardError.value = ''
  busTravelCardData.value = null
  busAppliedTravelCardNumber.value = ''
  busPaymentMessage.value = ''
  try {
    // همان API سفرکارت مورد استفاده در صفحه پرواز.
    const response = await $fetch(`https://api.ahuan.ir/api/SafarCard/${encodeURIComponent(normalizedCardNumber)}`)
    if (requestId !== busTravelCardRequestId) return
    const credit = Number(response?.credit)
    if (!response || response.credit == null || !Number.isFinite(credit) || credit < 0) {
      busTravelCardError.value = 'اطلاعات کارت معتبر نیست.'
      return
    }
    busTravelCardData.value = response
    busTravelCardCredit.value = credit
    busTravelCardOwnerName.value = `${response.firstName || ''} ${response.lastName || ''}`.trim()
    busAppliedTravelCardNumber.value = normalizedCardNumber
    busTravelCardApplied.value = true
  } catch (error) {
    if (requestId !== busTravelCardRequestId) return
    busTravelCardError.value = typeof error?.data === 'string'
      ? error.data
      : error?.data?.message || 'چنین شماره کارتی یافت نشد.'
    console.error('Bus travel card API error:', error)
  } finally {
    if (requestId === busTravelCardRequestId) busTravelCardLoading.value = false
  }
}
function getBusContractId(value) {
  const candidates = [value?.data?.id, value?.data?.contractId, value?.id, value?.contractId, value?.data?.data?.id]
  const id = candidates.map(Number).find(x => Number.isInteger(x) && x > 0)
  if (!id) throw new Error('شناسه قرارداد از پاسخ سرویس دریافت نشد.')
  return id
}
function getBusUserData() {
  let data = useCookie('user_data').value
  if (typeof data === 'string') { try { data = JSON.parse(data) } catch { data = null } }
  return data?.data?.user || data?.data || data?.user || data || {}
}
function getBusRecipientMobile(contact) {
  const login = busLoggedInPhone()
  const phone = contact?.buyForOther ? contact?.recipientPhone : login
  const mobile = busToEnglishDigits(phone).replace(/\D/g, '')
  if (!/^09\d{9}$/.test(mobile)) throw new Error('شماره موبایل دریافت‌کننده بلیت معتبر نیست.')
  return mobile
}
function createBusPaymentData(contact) {
  const totalPrice = busTotalPrice.value
  if (!Number.isFinite(totalPrice) || totalPrice <= 0) throw new Error('مبلغ قرارداد معتبر نیست.')
  const email = String(contact?.email || '').trim()
  const mobile = getBusRecipientMobile(contact)
  const isAgency = getBusUserData()?.noLimit === true
  const travelCardAmount = busTravelCardApplied.value && !isAgency
    ? Math.min(totalPrice, Math.max(0, Number(busTravelCardCredit.value) || 0)) : 0
  const payableAmount = totalPrice - travelCardAmount
  const type = isAgency ? 'agency' : travelCardAmount >= totalPrice ? 'travelcard'
    : travelCardAmount > 0 ? 'travelcard-gateway' : 'gateway'
  return {
    type, totalPrice,
    payableAmount: type === 'agency' || type === 'travelcard' ? totalPrice : payableAmount,
    travelCardUsed: !isAgency && travelCardAmount > 0,
    travelCardAmount,
    travelCardNumber: !isAgency && travelCardAmount > 0 ? String(busAppliedTravelCardNumber.value || '').trim() : '',
    email, mobile
  }
}
function buildBusUpdateContractPayload(contract, draft) {
  const saved = contract.response?.data || contract.response || {}
  const id = getBusContractId(contract.response)
  const rows = Array.isArray(saved.contractBuses) ? saved.contractBuses : []
  const passengers = Array.isArray(saved.contractPassengers) ? saved.contractPassengers : []
  if (rows.length !== draft.seats.length || passengers.length !== draft.passengers.length) {
    throw new Error('اطلاعات اتوبوس یا مسافران در پاسخ Contract/add کامل نیست؛ امکان Update امن وجود ندارد.')
  }
  const mappedPassengers = mapBusContractPassengers(draft.passengers)
  const contractPassengers = mappedPassengers.map((p, i) => {
    const savedPassenger = passengers[i]
    if (!(Number(savedPassenger?.id) > 0)) throw new Error(`شناسه مسافر ${i + 1} در قرارداد معتبر نیست.`)
    return { ...savedPassenger, ...p, id: Number(savedPassenger.id), contractId: id }
  })
  const contractBus = rows.map((row, i) => ({
    ...mapBusContractRows(draft.bus, [draft.seats[i]], draft.contact)[0],
    id: Number(row.id) || 0,
    contractId: id,
    providerPnr: row.providerPnr ?? null,
    providerStatus: row.providerStatus ?? null,
    reservedAt: row.reservedAt ?? null,
    providerOperationStatus: row.providerOperationStatus ?? null,
    providerPendingAction: row.providerPendingAction ?? null,
    lastProviderError: row.lastProviderError ?? null
  }))
  const { contractBuses: _receivedContractBuses, contractBus: _receivedContractBus, ...savedFields } = saved
  return {
    ...contract.payload, ...savedFields, id,
    userName: busLoggedInPhone(),
    email: String(draft.contact?.email || '').trim(),
    contractFlights: [], contractPassengers, contractBus
  }
}
async function updateBusContract(contract, draft) {
  const payload = buildBusUpdateContractPayload(contract, draft)
  const response = await $fetch('https://api.ahuan.ir/api/Contract/update', {
    method: 'PUT', body: payload, headers: { 'Content-Type': 'application/json' }
  })
  if (response?.success === false || response?.isSuccess === false || response?.errors?.length)
    throw new Error(response?.message || response?.errors?.join('، ') || 'آپدیت قرارداد انجام نشد.')
  const updatedId = getBusContractId(response)
  if (updatedId !== payload.id) throw new Error('شناسه قرارداد پس از Update تغییر کرده است.')
  return { response, contractId: updatedId }
}
async function requestBusBankToken(amount, contractId) {
  if (!(Number(amount) > 0)) throw new Error('مبلغ درگاه نامعتبر است.')
  const revertUrl = `${window.location.origin}/verify?responseData=${encodeURIComponent(contractId)}&`
  const response = await $fetch('https://test.ahuan.ir/api/Tejarat/BankToken', {
    method: 'POST', body: { amount: Number(amount), revertUrl }
  })
  const token = typeof response === 'string' ? response :
    response?.data?.tokenIdentity || response?.data?.bankToken || response?.data?.token ||
    response?.tokenIdentity || response?.bankToken || response?.token || response?.data
  if (!token || typeof token === 'object') throw new Error('توکن معتبر درگاه دریافت نشد.')
  return String(token)
}
async function continueBusPayment(session) {
  if (session.type === 'agency' || session.type === 'travelcard') {
    await router.push({ path: '/verify', query: { responseData: session.contractId } })
    return
  }
  const token = await requestBusBankToken(session.payableAmount, session.contractId)
  busShaparak.bankToken = token
  await nextTick()
  if (!busShaparakFormRef.value) throw new Error('فرم درگاه بانکی پیدا نشد.')
  HTMLFormElement.prototype.submit.call(busShaparakFormRef.value)
}
async function handleBusPaymentSubmit() {
  if (busPaymentLoading.value) return
  busPaymentMessage.value = ''
  busPaymentLoading.value = true
  try {
    const draft = busBookingDraft.value
    const contract = busContractAddResult.value
    if (!draft || !contract?.response || !contract?.payload) throw new Error('قرارداد ثبت‌شده موجود نیست.')
    if (draft.seats.length !== draft.passengers.length) throw new Error('تعداد مسافران و صندلی‌ها برابر نیست.')
    const paymentData = createBusPaymentData(draft.contact)
    // در حالت تست، صرفاً تا آماده‌سازی پرداخت پیش می‌رویم؛ هیچ وجهی دریافت نمی‌شود.
    // قبل از پرداخت واقعی، رزرو نیرا و سازگاری verify باید تکمیل و تأیید شوند.
    if (!BUS_PAYMENT_TEST_BEFORE_VERIFY && (!draft.busReservation?.pnr || draft.busReservation?.confirmed !== true))
      throw new Error('رزرو صندلی در نیرا تأیید نشده است؛ پرداخت واقعی مجاز نیست.')
    const updated = await updateBusContract(contract, draft)
    const session = {
      contractId: updated.contractId, ...paymentData,
      bookingType: 'bus', providerCode: 'NIRABUS',
      providerResults: draft.busReservation?.pnr
        ? [{ supplier: 'NIRABUS', pnr: draft.busReservation.pnr,
          moveCode: draft.bus.moveCode, seats: [...draft.seats] }]
        : [],
      busDetails: { moveCode: draft.bus.moveCode, seats: [...draft.seats] }
    }
    sessionStorage.setItem(BUS_PAYMENT_SESSION_KEY, JSON.stringify(session))
    if (BUS_PAYMENT_TEST_BEFORE_VERIFY) {
      busPaymentMessage.value = `تست موفق: Contract/update انجام شد. شماره قرارداد: ${updated.contractId}؛ روش پرداخت: ${paymentData.type}؛ مبلغ: ${paymentData.payableAmount.toLocaleString('fa-IR')} ریال. اطلاعات پرداخت ذخیره شد. انتقال به درگاه و verify در حالت تست غیرفعال است.`
      return
    }
    await continueBusPayment(session)
  } catch (error) {
    busPaymentMessage.value = error?.data?.message || error?.message || 'خطا در آماده‌سازی پرداخت اتوبوس.'
    console.error('Bus payment error:', error)
  } finally { busPaymentLoading.value = false }
}

function updateBusDraftPassengers(passengers) {
  if (!busBookingDraft.value || !Array.isArray(passengers)) return
  busBookingDraft.value = { ...busBookingDraft.value, passengers }
}
function updateBusDraftContact(contact) {
  if (!busBookingDraft.value || !contact) return
  busBookingDraft.value = { ...busBookingDraft.value, contact: { ...busBookingDraft.value.contact, ...contact } }
}
async function handleBusContactSubmit() {
  if (busContactSubmitting.value || busContractSubmitting.value) return
  busFormMessage.value = ''
  if (!selectedBus.value || selectedSeatNumbers.value.length === 0) {
    busFormMessage.value = 'ابتدا حداقل یک صندلی انتخاب کنید.'
    return
  }
  busContactSubmitting.value = true
  busContractSubmitting.value = true
  try {
    const passengersValid = await busPassengerFormRef.value?.validateAll?.()
    const contactValid = await busContactFormRef.value?.validateAll?.()
    if (!passengersValid || !contactValid) {
      busFormMessage.value = 'لطفاً اطلاعات مسافران و اطلاعات تماس را کامل و صحیح وارد کنید.'
      return
    }
    const passengers = busPassengerFormRef.value.getData()
    const contact = busContactFormRef.value.getData()
    const seats = [...selectedSeatNumbers.value]
    // قبل از ورود به پیش‌نمایش، همان Add قرارداد پرواز فراخوانی می‌شود.
    // اگر قبلاً با همین اطلاعات ثبت شده، درخواست تکراری ارسال نکن.
    const signature = JSON.stringify({
      bus: selectedBus.value?.moveCode, seats, passengers, contact
    })
    let contract = busContractAddResult.value
    if (!contract || contract.signature !== signature) {
      contract = { ...(await addBusContract(selectedBus.value, seats, passengers, contact)), signature }
      busContractAddResult.value = contract
    }
    resetBusTravelCard()
    busBookingDraft.value = {
      bus: selectedBus.value,
      seats,
      passengers,
      contact,
      contract: contract.response
    }
    currentStep.value = 2
    await nextTick()
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    console.error('Bus Contract/add error:', error)
    busFormMessage.value = error?.data?.message || error?.response?._data?.message || error?.message || 'ثبت قرارداد اتوبوس ناموفق بود.'
  } finally {
    busContactSubmitting.value = false
    busContractSubmitting.value = false
  }
}

function backToBusPassengerForm() {
  currentStep.value = 1
  nextTick(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}
function chooseBus(bus) {
  if (bus?.disabled || useMockBuses) return
  selectedBus.value = bus
  busContractAddResult.value = null
  selectedSeatNumbers.value = []
  resetBusTravelCard()
  busBookingDraft.value = null
  busPaymentMessage.value = ''
  busTravelCardError.value = ''
  busFormMessage.value = ''
  isSortDropdownOpen.value = false
  isFilterModalOpen.value = false
  currentStep.value = 1
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}
function updateSelectedSeats(numbers) {
  const unique = [...new Set((Array.isArray(numbers) ? numbers : []).map(String))].slice(0, 10)
  selectedSeatNumbers.value = unique
  busContractAddResult.value = null
  resetBusTravelCard()
  busBookingDraft.value = null
  busPaymentMessage.value = ''
  busTravelCardError.value = ''
  busFormMessage.value = ''
}
function backToBuses() {
  currentStep.value = 0
  selectedBus.value = null
  selectedSeatNumbers.value = []
  busContractAddResult.value = null
  resetBusTravelCard()
  busBookingDraft.value = null
  busPaymentMessage.value = ''
  busTravelCardError.value = ''
  busFormMessage.value = ''
}

const activeTab = ref('ارزان‌ترین')

const isFilterModalOpen = ref(false)

const isSortDropdownOpen = ref(false)

const showBackToTop = ref(false)

const onlyAvailable = ref(false)

const onlyVip = ref(false)

const selectedCompanies = ref([])

const sortOptions = ['نام شرکت', 'دیرترین', 'زودترین', 'ارزان‌ترین', 'گران‌ترین']

const busSteps = [

  { icon: '🚌', label: 'انتخاب اتوبوس' },

  { icon: '💺', label: 'انتخاب صندلی و اطلاعات' },

  { icon: '💳', label: 'تأیید و پرداخت' },

  { icon: '🎫', label: 'دریافت بلیط' }

]

const toCompactJalali = value => {

  const clean = String(value || '').replace(/\D/g, '')

  return /^\d{8}$/.test(clean) ? clean : ''

}

const currentDate = computed(() => toCompactJalali(route.query.departDate))

const gregorianDate = computed(() => {

  const d = currentDate.value

  if (!d) return ''

  const y = Number(d.slice(0, 4)), m = Number(d.slice(4, 6)), day = Number(d.slice(6, 8))

  try {

    const date = toGregorian(y, m, day)

    return `${date.gy}-${String(date.gm).padStart(2, '0')}-${String(date.gd).padStart(2, '0')}`

  } catch { return '' }

})

const carouselSelectedDate = computed(() => gregorianDate.value)

const carouselStartDate = computed(() => {

  if (!gregorianDate.value) return moment().subtract(10, 'days').format('YYYY-MM-DD')

  return moment(gregorianDate.value, 'YYYY-MM-DD').subtract(10, 'days').format('YYYY-MM-DD')

})

const companies = computed(() => [...new Set(buses.value.map(b => b.companyName?.trim()).filter(Boolean))])

const filteredBuses = computed(() => {

  const list = buses.value.filter(bus => {

    if (onlyAvailable.value && bus.disabled) return false

    if (onlyVip.value && !/vip|وی\s*آی\s*پی/i.test(bus.busType || '')) return false

    if (selectedCompanies.value.length && !selectedCompanies.value.includes(bus.companyName?.trim())) return false

    return true

  })

  const price = bus => Number(bus.priceFrom || 0)

  const time = bus => String(bus.departureTime || '')

  switch (activeTab.value) {

    case 'گران‌ترین': list.sort((a, b) => price(b) - price(a)); break

    case 'زودترین': list.sort((a, b) => time(a).localeCompare(time(b))); break

    case 'دیرترین': list.sort((a, b) => time(b).localeCompare(time(a))); break

    case 'نام شرکت': list.sort((a, b) => String(a.companyName).localeCompare(String(b.companyName), 'fa')); break

    default: list.sort((a, b) => price(a) - price(b))

  }

  return [...list.filter(b => !b.disabled), ...list.filter(b => b.disabled)]

})

const formatPrice = number => Number(number || 0).toLocaleString('fa-IR')

const resetFilters = () => { onlyAvailable.value = false; onlyVip.value = false; selectedCompanies.value = [] }

const handleWindowScroll = () => { showBackToTop.value = window.scrollY > 400 }

const scrollToTop = async () => { await nextTick(); window.scrollTo({ top: 0, behavior: 'smooth' }) }

async function handleDateChange(dateObj) {
  const text = String(dateObj?.fullDate || '').trim()
  const match = text.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/)
  if (!match) return
  const [year, month, day] = match.slice(1).map(Number)
  if (!Number.isInteger(year) || month < 1 || month > 12 || day < 1 || day > 31) return
  const jalali = year < 1700 ? { jy: year, jm: month, jd: day } : toJalaali(year, month, day)
  const compact = `${jalali.jy}${String(jalali.jm).padStart(2, '0')}${String(jalali.jd).padStart(2, '0')}`
  if (compact === currentDate.value) return
  await router.replace({ query: { ...route.query,
    departDate: `${jalali.jy}/${String(jalali.jm).padStart(2, '0')}/${String(jalali.jd).padStart(2, '0')}`
  } })
}

let searchId = 0

async function loadBuses() {

  const id = ++searchId

  const origin = String(route.query.origin || '').trim()

  const destination = String(route.query.destination || '').trim()

  const departureDate = currentDate.value

  buses.value = []

  errorMessage.value = ''

  if (!origin || !destination || !departureDate) {

    errorMessage.value = 'مبدأ، مقصد یا تاریخ حرکت نامعتبر است'

    loading.value = false

    return

  }

  loading.value = true

  resetFilters()

  try {

    // mockAvailability دقیقاً ساختار {data, error} سرویس نیرا را دارد.

    // در حالت واقعی، searchAllBusProviders از provider استفاده می‌کند.

    const result = useMockBuses

      ? await $fetch('/mock/niraBusAvailability.json').then(response =>

          Array.isArray(response?.data) ? response.data.map(mapNiraBus) : []

        )

      : await searchAllBusProviders({ origin, destination, departureDate, no: 1 })

    if (id !== searchId) return

    buses.value = Array.isArray(result) ? result : []

  } catch (error) {

    if (id !== searchId) return

    errorMessage.value = error?.message || 'خطا در دریافت سرویس‌های اتوبوس'

  } finally {

    if (id === searchId) loading.value = false

  }

}

onMounted(() => { window.addEventListener('scroll', handleWindowScroll, { passive: true }); handleWindowScroll() })

onUnmounted(() => { ++searchId; window.removeEventListener('scroll', handleWindowScroll) })

watch(() => [route.query.origin, route.query.destination, route.query.departDate], () => {
  backToBuses()
  loadBuses()
}, { immediate: true })

</script>

<style scoped>
/* چیدمان این صفحه از کلاس‌های مشترک پروژه استفاده می‌کند. */

</style>
