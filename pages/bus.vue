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
            <FlightSearchPanel mode="aside" :showServices="true" @flight-search="isFilterModalOpen = false" />

            <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm" dir="rtl">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold text-gray-800">فیلترهای اتوبوس</h3>
                <button type="button" class="text-xs text-primary" @click="resetFilters">پاک کردن</button>
              </div>
              <label class="flex items-center gap-2 text-sm text-gray-700 mb-4">
                <input v-model="onlyAvailable" type="checkbox" class="accent-primary" />
                فقط سرویس‌های قابل خرید
              </label>
              <label class="flex items-center gap-2 text-sm text-gray-700 mb-4">
                <input v-model="onlyVip" type="checkbox" class="accent-primary" />
                فقط اتوبوس‌های VIP
              </label>
              <p class="text-xs text-gray-500 font-bold mb-2">شرکت مسافربری</p>
              <label v-for="company in companies" :key="company" class="flex items-center gap-2 text-xs text-gray-600 mb-2">
                <input v-model="selectedCompanies" type="checkbox" :value="company" class="accent-primary" />
                {{ company }}
              </label>
            </div>
          </div>
        </aside>

        <!-- نتایج -->
        <section class="lg:col-span-9 order-2 lg:order-1 relative" dir="rtl">
          <!-- تقویم مشترک با پرواز؛ تاریخ داخلی به میلادی تبدیل شده -->
          <div class="mb-4 md:mb-6 bg-gray-100 md:bg-white px-2 py-3 md:p-2 overflow-hidden rounded-2xl" dir="ltr">
            <DateCarousel
              :days-count="21"
              :start-date="carouselStartDate"
              :selected-date="carouselSelectedDate"
              @date-selected="handleDateChange"
            />
          </div>

          <!-- کنترل‌های موبایل -->
          <div class="lg:hidden mb-4 px-2 flex gap-2">
            <UiBaseButton label="مرتب‌سازی" variant="soft" color="primary" icon="↕️"
              class="!rounded-full bg-white px-5 py-3 text-xs shadow-sm" @click="isSortDropdownOpen = !isSortDropdownOpen" />
            <UiBaseButton label="فیلترها" variant="soft" color="primary" icon="⚙️"
              class="!rounded-full bg-white px-5 py-3 text-xs shadow-sm" @click="isFilterModalOpen = true" />
            <div v-if="isSortDropdownOpen" class="absolute top-[100px] right-2 z-50 rounded-xl bg-white p-2 shadow-xl">
              <button v-for="option in sortOptions" :key="option" type="button"
                class="block w-full rounded-lg px-4 py-2 text-right text-xs hover:bg-gray-100"
                @click="activeTab = option; isSortDropdownOpen = false">{{ option }}</button>
            </div>
          </div>

          <div class="mb-4 text-center text-xs text-gray-400 px-2">
            <span v-if="loading">در حال جستجوی اتوبوس‌ها...</span>
            <span v-else>تعداد {{ filteredBuses.length }} اتوبوس یافت شد</span>
          </div>

          <!-- تب‌های مرتب‌سازی مشترک -->
          <div class="hidden lg:flex mb-6 items-center gap-1 rounded-xl p-1 text-xs" dir="ltr">
            <UiBaseTabs :items="sortOptions" v-model="activeTab" />
          </div>

          <div v-if="errorMessage" class="mx-2 mb-4 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
            {{ errorMessage }}
            <button class="mr-3 underline" type="button" @click="loadBuses">تلاش مجدد</button>
          </div>

          <!-- نمایش موقت داده‌ها در خود صفحه، بدون ساخت BusTicketCard -->
          <div v-if="!loading && !errorMessage && filteredBuses.length" class="space-y-4 px-2 md:px-0">
            <div v-for="bus in filteredBuses" :key="bus.id || bus.moveCode"
              class="rounded-2xl border border-gray-100 bg-white p-4 md:p-5 shadow-sm">
              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div>
                  <div class="font-bold text-gray-800">{{ bus.companyName || 'شرکت مسافربری' }}</div>
                  <div class="mt-1 text-xs text-gray-500">{{ bus.busType || 'نوع اتوبوس مشخص نیست' }}</div>
                </div>
                <span class="rounded-full px-3 py-1 text-xs font-bold"
                  :class="bus.disabled ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700'">
                  {{ bus.statusMessage || (bus.disabled ? 'غیرقابل خرید' : 'قابل خرید') }}
                </span>
              </div>
              <div class="grid grid-cols-3 items-center gap-3 py-5">
                <div>
                  <p class="font-black text-lg text-gray-800">{{ bus.departureTime || '--:--' }}</p>
                  <p class="text-sm text-gray-700">{{ bus.originName || bus.origin }}</p>
                </div>
                <div class="text-center text-gray-400 text-xs">🚌 ─────</div>
                <div class="text-left">
                  <p class="font-bold text-gray-800">{{ bus.destinationName || bus.destination }}</p>
                  <p class="mt-1 text-xs text-gray-500">{{ bus.getOffPlace || 'مقصد' }}</p>
                </div>
              </div>
              <div class="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                <div>
                  <span class="text-xs text-gray-500">{{ bus.capacity }} صندلی باقی‌مانده</span>
                  <p class="mt-1 font-bold text-primary">{{ formatPrice(bus.priceFrom) }} <span class="text-xs">ریال</span></p>
                </div>
                <span class="text-xs text-gray-400">مرحله انتخاب صندلی هنوز متصل نشده است</span>
              </div>
            </div>
          </div>

          <div v-else-if="!loading && !errorMessage" class="mx-2 rounded-[2rem] border-2 border-dashed border-gray-100 bg-white py-20 text-center">
            <p class="font-bold text-gray-700">اتوبوسی در تاریخ انتخاب‌شده یافت نشد.</p>
            <p class="mt-2 text-xs text-gray-400">تاریخ یا مسیر دیگری را انتخاب کنید.</p>
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
            <FlightSearchPanel mode="aside" :showServices="true" @flight-search="isFilterModalOpen = false" />
            <div class="rounded-xl border border-gray-100 p-4 space-y-4">
              <label class="flex gap-2 text-sm"><input v-model="onlyAvailable" type="checkbox" /> فقط سرویس‌های قابل خرید</label>
              <label class="flex gap-2 text-sm"><input v-model="onlyVip" type="checkbox" /> فقط اتوبوس‌های VIP</label>
              <label v-for="company in companies" :key="company" class="flex gap-2 text-xs">
                <input v-model="selectedCompanies" type="checkbox" :value="company" /> {{ company }}
              </label>
              <button type="button" class="text-xs text-primary" @click="resetFilters">پاک کردن فیلترها</button>
            </div>
          </div>
          <div class="border-t border-gray-100 p-4">
            <UiBaseButton label="اعمال فیلترها" variant="filled" color="primary" class="w-full !rounded-2xl !py-4" @click="isFilterModalOpen = false" />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Full Loading همان الگوی پرواز -->
    <Transition name="fade">
      <div v-if="loading" class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/10 backdrop-blur-[3px]">
        <div class="flex flex-col items-center rounded-3xl bg-white p-8 shadow-2xl">
          <div class="relative flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-primary)]">
            <div class="absolute inset-0 animate-spin rounded-full border-4 border-blue-300 border-t-blue-100"></div>
            <img
  src="/imgs/flight/loading.gif"
  alt="در حال جستجوی اتوبوس"
  class="relative z-10 h-[70px] w-[70px] object-contain"
/>
          </div>
          <h4 class="mt-5 text-base font-bold text-gray-800" dir="rtl">در حال جستجوی اتوبوس‌ها...</h4>
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment-jalaali'
import { toGregorian, toJalaali } from 'jalaali-js'
import { searchAllBusProviders } from '~/services/searchBuses.js'

const route = useRoute()
const router = useRouter()
const buses = ref([])
const loading = ref(false)
const errorMessage = ref('')
const currentStep = ref(0)
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
function formatBusUrlDate(value) {
  const digits = String(value || '').replace(/\D/g, '')

  if (!/^\d{8}$/.test(digits)) return ''

  return digits.replace(
    /^(\d{4})(\d{2})(\d{2})$/,
    '$1/$2/$3'
  )
}
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
  const date = String(dateObj?.fullDate || '')
  const parts = date.replace(/\//g, '-').split('-').map(Number)
  if (parts.length !== 3 || parts.some(x => !Number.isInteger(x))) return
  let jalali
  if (parts[0] < 1700) jalali = { jy: parts[0], jm: parts[1], jd: parts[2] }
  else jalali = toJalaali(parts[0], parts[1], parts[2])
  const compact = `${jalali.jy}${String(jalali.jm).padStart(2, '0')}${String(jalali.jd).padStart(2, '0')}`
  if (compact === currentDate.value) return
  await router.replace({ query: { ...route.query, departDate: compact } })
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
    const result = await searchAllBusProviders({ origin, destination, departureDate, no: 1 })
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
watch(() => [route.query.origin, route.query.destination, route.query.departDate], loadBuses, { immediate: true })
watch(
  () => route.query.departDate,
  async (date) => {
    const formattedDate = formatBusUrlDate(date)

    if (!formattedDate || formattedDate === date) return

    await router.replace({
      path: '/bus',
      query: {
        ...route.query,
        departDate: formattedDate
      }
    })
  },
  { immediate: true }
)
</script>
