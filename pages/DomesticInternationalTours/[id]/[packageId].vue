<template>
  <div class="page min-h-screen bg-[#f8f8f8] pb-[90px] md:pb-0" dir="rtl">
    <div v-if="loading" class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <div class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700"></div>
        <p class="mt-4 text-base text-gray-600">در حال دریافت اطلاعات تور...</p>
      </div>
    </div>

    <div v-else-if="errorMessage" class="flex min-h-[500px] items-center justify-center px-4">
      <div class="text-center">
        <p class="text-base font-bold text-red-600">{{ errorMessage }}</p>
        <button type="button" class="mt-4 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white" @click="loadPackage">تلاش مجدد</button>
      </div>
    </div>

    <template v-else-if="packageData">
      <!-- Hero: title is positioned against the RIGHT edge of the full-width image, not inside max-width wrapper. -->
      <section class="relative -mt-[35px] w-full overflow-hidden bg-gray-100">
        <picture v-if="mainImage">
          <source v-if="mobileImage" media="(max-width: 767px)" :srcset="mobileImage" />
          <img :src="mainImage" :alt="packageData.name" class="block h-[340px] w-full object-cover md:h-auto md:min-h-[300px] md:object-contain" />
        </picture>
        <div v-else class="h-[260px] bg-gradient-to-l from-blue-900 to-slate-700"></div>
        <div class="pointer-events-none absolute inset-x-0 top-0 h-[230px] bg-gradient-to-b from-black/75 via-black/30 to-transparent md:h-[300px]"></div>
        <div class="pointer-events-none absolute right-0 top-0 z-10 m-0 max-w-full p-0 text-right" dir="rtl">
          <h1 class="m-0 max-w-full break-words p-0 text-right text-[44px]! font-black leading-[1.2] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] md:text-[70px]! lg:text-[85px]!">
            {{ packageData.name }}
          </h1>
        </div>
      </section>

      <!-- Navigation -->
      <nav class="sticky top-0 z-40 border-b border-gray-200 bg-[#f8f8f8]/95 backdrop-blur-md">
        <div class="mx-auto grid w-full max-w-[1100px] grid-cols-2 gap-2 px-4 py-3 md:flex md:flex-wrap md:justify-center">
          <button v-if="hasPrograms" type="button" :class="tabClass('program')" @click="activeTab = 'program'">برنامه سفر</button>
          <button v-if="hasServices" type="button" :class="tabClass('services')" @click="activeTab = 'services'">خدمات تور</button>
          <button v-if="hasPrices" type="button" :class="tabClass('prices')" @click="activeTab = 'prices'">لیست قیمت</button>
          <button v-if="hasDocs" type="button" :class="tabClass('docs')" @click="activeTab = 'docs'">مدارک مورد نیاز</button>
          <button v-if="hasTips" type="button" :class="tabClass('tips')" @click="activeTab = 'tips'">نکات ضروری</button>
          <button v-if="hasPhotos" type="button" :class="tabClass('gallery')" @click="activeTab = 'gallery'">گالری تصاویر</button>
        </div>
      </nav>

      <main class="mx-auto w-full max-w-[1100px] px-4 py-7 md:px-6 md:py-9">
        <!-- Travel program / flights -->
        <section v-if="activeTab === 'program'" class="rounded-2xl bg-white p-5 shadow-sm md:p-7">
          <h2 class="mb-5 text-[22px] font-black text-blue-900">برنامه سفر</h2>
          <div v-if="airlineNames.length" class="mb-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
            <h3 class="mb-3 text-[18px] font-black text-blue-900">ایرلاین‌های تور</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="airline in airlineNames" :key="airline" class="rounded-full border border-blue-200 bg-white px-4 py-2 text-base font-bold text-blue-800">{{ airline }}</span>
            </div>
          </div>
          <div v-if="packageData.flightDays" class="mb-5 rounded-xl bg-gray-50 p-4 text-base text-gray-700">
            <strong>روزهای پرواز:</strong> {{ packageData.flightDays }}
          </div>
          <div class="mb-6 overflow-hidden rounded-2xl border border-gray-200">
            <h3 class="border-b bg-gray-50 px-4 py-3 text-lg font-black text-gray-800">اطلاعات پرواز</h3>
            <div class="overflow-x-auto">
              <table class="w-full min-w-[850px] border-collapse text-right text-[15px]">
                <thead class="bg-blue-50 text-blue-900">
                  <tr>
                    <th class="px-4 py-3">مسیر پرواز</th>
                    <th class="px-4 py-3">تاریخ</th>
                    <th class="px-4 py-3">ساعت پرواز</th>
                    <th class="px-4 py-3">شماره پرواز</th>
                    <th class="px-4 py-3">فرودگاه مبدأ</th>
                    <th class="px-4 py-3">فرودگاه مقصد</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(flight, index) in packageFlights" :key="flight.id ?? index" class="border-t border-gray-100 even:bg-gray-50">
                    <td class="px-4 py-3">{{ flight.flightPath || '-' }}</td>
                    <td class="px-4 py-3" dir="ltr">{{ flight.depDate || '-' }}</td>
                    <td class="px-4 py-3" dir="ltr">{{ flight.depTime || '-' }}</td>
                    <td class="px-4 py-3" dir="ltr">{{ flight.flightNo || '-' }}</td>
                    <td class="px-4 py-3">{{ flight.originAirport || flight.departureAirport || splitAirports(flight.airportsPath)[0] }}</td>
                    <td class="px-4 py-3">{{ flight.destinationAirport || flight.arrivalAirport || splitAirports(flight.airportsPath)[1] }}</td>
                  </tr>
                  <tr v-if="!packageFlights.length"><td colspan="6" class="px-4 py-7 text-center text-gray-500">اطلاعات دقیق پرواز هنوز ثبت نشده است.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <article v-for="(program, index) in packagePrograms" :key="program.id ?? index" class="mb-5 last:mb-0">
            <h3 v-if="program.title" class="mb-2 text-lg font-bold text-gray-800">{{ program.title }}</h3>
            <div class="html-content text-base leading-9 text-gray-700" v-html="program.program"></div>
          </article>
        </section>

        <!-- Services -->
        <section v-else-if="activeTab === 'services'" class="rounded-2xl bg-white p-5 shadow-sm md:p-7">
          <h2 class="mb-5 text-[22px] font-black text-blue-900">خدمات تور</h2>
          <div v-if="serviceLines.length" class="grid gap-3 md:grid-cols-2">
            <div v-for="(service, index) in serviceLines" :key="index" class="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 text-base leading-8 text-gray-700">
              <span class="mt-1 shrink-0 text-xl font-bold text-blue-700">✓</span>
              <span>{{ service }}</span>
            </div>
          </div>
          <p v-else class="text-base text-gray-500">خدماتی برای این تور ثبت نشده است.</p>
        </section>

        <!-- Prices: use whichever structure is populated by the API -->
        <section v-else-if="activeTab === 'prices'" class="rounded-2xl bg-white p-5 shadow-sm md:p-7">
          <h2 class="mb-2 text-[22px] font-black text-blue-900">لیست قیمت تور</h2>
          <p v-if="packageData.hotel" class="mb-5 text-base font-semibold text-gray-600">اقامت در {{ packageData.hotel }}</p>

          <!-- Kish and other packages: per-hotel prices -->
          <template v-if="hasHotelPrices">
            <!-- <p class="mb-4 text-sm text-gray-500">قیمت‌ها طبق اطلاعات ثبت‌شده برای هر هتل نمایش داده می‌شوند.</p> -->
            <div class="overflow-x-auto rounded-xl border border-gray-200">
              <table class="w-full min-w-[1000px] border-collapse text-center text-[15px]">
                <thead class="bg-blue-50 text-blue-900">
                  <tr>
                    <th class="px-3 py-4">ردیف</th><th class="px-3 py-4">هتل</th><th class="px-3 py-4">ستاره</th><th class="px-3 py-4">موقعیت</th>
                    <th class="px-3 py-4">دو تخته</th><th class="px-3 py-4">یک تخته</th><th class="px-3 py-4">کودک با تخت</th><th class="px-3 py-4">کودک بدون تخت</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(hotel, index) in packageHotelPrices" :key="hotel.id ?? index" class="border-t border-gray-100 even:bg-gray-50">
                    <td class="px-3 py-4">{{ index + 1 }}</td>
                    <td class="px-3 py-4 font-black text-gray-800">{{ hotel.hotel || '-' }}</td>
                    <td class="px-3 py-4">{{ hotel.star || '-' }}</td>
                    <td class="px-3 py-4">{{ hotel.location || '-' }}</td>
                    <td class="px-3 py-4">{{ formatMoney(hotel.dbl) }}</td>
                    <td class="px-3 py-4">{{ formatMoney(hotel.sgl) }}</td>
                    <td class="px-3 py-4">{{ formatMoney(hotel.extBed) }}</td>
                    <td class="px-3 py-4">{{ formatMoney(hotel.noBed) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <!-- Karbala and other packages: per-passenger prices -->
          <template v-else-if="hasPersonPrices">
            <div class="overflow-hidden rounded-xl border border-gray-200">
              <table class="w-full border-collapse text-right text-base">
                <thead class="bg-blue-50 text-blue-900"><tr><th class="px-4 py-4">نوع اتاق / مسافر</th><th class="px-4 py-4">قیمت</th></tr></thead>
                <tbody>
                  <tr v-for="(item, index) in packagePersonPrices" :key="item.id ?? index" class="border-t border-gray-100 even:bg-gray-50">
                    <td class="px-4 py-4">{{ item.title || '-' }}</td>
                    <td class="px-4 py-4 font-black text-blue-900">{{ formatMoney(item.price) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <p v-else class="text-base text-gray-500">قیمتی ثبت نشده است.</p>
        </section>

        <!-- Documents -->
        <section v-else-if="activeTab === 'docs'" class="rounded-2xl bg-white p-5 shadow-sm md:p-7">
          <h2 class="mb-5 text-[22px] font-black text-blue-900">مدارک مورد نیاز</h2>
          <article v-for="(item, index) in packageDocs" :key="item.id ?? index" class="mb-5 last:mb-0">
            <h3 v-if="item.title" class="mb-2 text-lg font-bold text-gray-800">{{ item.title }}</h3>
            <div class="html-content text-base leading-9 text-gray-700" v-html="item.description"></div>
          </article>
        </section>

        <!-- Essential tips -->
        <section v-else-if="activeTab === 'tips'" class="rounded-2xl bg-white p-5 shadow-sm md:p-7">
          <h2 class="mb-5 text-[22px] font-black text-blue-900">نکات ضروری</h2>
          <div class="space-y-4">
            <article v-for="(item, index) in packageEssentialTips" :key="item.id ?? index" class="flex items-start gap-3 text-base leading-9 text-gray-700">
              <span class="mt-3 h-2 w-2 shrink-0 rounded-full bg-red-500"></span>
              <div>
                <strong v-if="item.essentialTitle" class="block text-gray-900">{{ item.essentialTitle }}</strong>
                <div class="html-content" v-html="item.essentialTip"></div>
              </div>
            </article>
          </div>
        </section>

        <!-- Gallery -->
        <section v-else-if="activeTab === 'gallery'" class="rounded-2xl bg-white p-5 shadow-sm md:p-7">
          <h2 class="mb-5 text-[22px] font-black text-blue-900">گالری تصاویر</h2>
          <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            <button v-for="(photo, index) in packagePhotoes" :key="photo.id ?? index" type="button" class="group relative h-[160px] overflow-hidden rounded-xl bg-gray-100" @click="selectedPhoto = photo">
              <img :src="buildImageUrl(photo.photo)" :alt="photo.description || packageData.name" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </button>
          </div>
        </section>

        <section class="mt-8 hidden items-center justify-center rounded-xl bg-white px-5 py-5 text-center shadow-sm md:flex">
          <p class="text-base font-bold text-gray-700">جهت اخذ اطلاعات بیشتر با کارشناسان ما تماس حاصل فرمایید.
            <a href="tel:02141889" class="mr-1 font-black text-blue-700">تلفن: 41889-021</a>
          </p>
        </section>
      </main>

      <div class="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white px-3 py-3 shadow-lg md:hidden">
        <div class="mx-auto flex items-center justify-between gap-3">
          <p class="flex-1 text-sm font-bold leading-6 text-gray-700">برای اطلاعات بیشتر با کارشناسان ما تماس بگیرید.</p>
          <a href="tel:02141889" class="shrink-0 rounded-xl bg-blue-700 px-4 py-3 text-sm font-black text-white">41889-021</a>
        </div>
      </div>

      <div v-if="selectedPhoto" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4" @click.self="selectedPhoto = null">
        <button type="button" class="absolute left-5 top-5 text-4xl text-white" aria-label="بستن تصویر" @click="selectedPhoto = null">×</button>
        <img :src="buildImageUrl(selectedPhoto.photo)" :alt="selectedPhoto.description || ''" class="max-h-[90vh] max-w-full rounded-lg object-contain" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const BASE_URL = 'https://api.ahuan.ir/api'
const IMAGE_BASE_URL = 'https://panel.ahuan.ir/uploads'

const packageData = ref(null)
const loading = ref(false)
const errorMessage = ref('')
const selectedPhoto = ref(null)
const activeTab = ref('program')
const packageId = computed(() => String(route.params.packageId || ''))

function sortItems(items) {
  if (!Array.isArray(items)) return []
  return [...items].sort((a, b) => Number(a?.orderId ?? 9999) - Number(b?.orderId ?? 9999))
}

const packagePrograms = computed(() => sortItems(packageData.value?.packagePrograms))
const packageServices = computed(() => sortItems(packageData.value?.packageServices))
const packageHotelPrices = computed(() => sortItems(packageData.value?.packageHotelPrices))
const packagePersonPrices = computed(() => sortItems(packageData.value?.packagePersonPrices))
const packageDocs = computed(() => sortItems(packageData.value?.packageDocs))
const packageEssentialTips = computed(() => sortItems(packageData.value?.packageEssentialTips))
const packageFlights = computed(() => sortItems(packageData.value?.packageFlights))
const packagePhotoes = computed(() => sortItems(packageData.value?.packagePhotoes))

const airlineNames = computed(() => String(packageData.value?.airlines || '')
  .split(/[,،]/).map(x => x.trim()).filter(Boolean))

// Handles HTML paragraphs and simple hyphen-separated services (e.g. "صبحانه-استقبال فرودگاهی").
const serviceLines = computed(() => packageServices.value.flatMap(item =>
  String(item?.service || '')
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\s*\/\s*p\s*>/gi, '\n')
    .replace(/<\s*p(?:\s[^>]*)?>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .split(/\n|\s+-\s+|(?<=[\u0600-\u06FF])- (?=[\u0600-\u06FF])|(?<=[\u0600-\u06FF])-(?=[\u0600-\u06FF])/u)
    .map(x => x.trim()).filter(Boolean)
))

const hasPrograms = computed(() => packagePrograms.value.length > 0 || packageFlights.value.length > 0 || airlineNames.value.length > 0 || !!packageData.value?.flightDays)
const hasServices = computed(() => packageServices.value.length > 0)
const hasHotelPrices = computed(() => packageHotelPrices.value.length > 0)
const hasPersonPrices = computed(() => packagePersonPrices.value.length > 0)
const hasPrices = computed(() => hasHotelPrices.value || hasPersonPrices.value)
const hasDocs = computed(() => packageDocs.value.length > 0)
const hasTips = computed(() => packageEssentialTips.value.length > 0)
const hasPhotos = computed(() => packagePhotoes.value.length > 0)

function buildImageUrl(image) {
  if (!image) return ''
  if (/^https?:\/\//i.test(image)) return image
  return `${IMAGE_BASE_URL}/${image}`
}
const mainImage = computed(() => buildImageUrl(packageData.value?.backImage || packageData.value?.image || packageData.value?.backImageM || packageData.value?.imageM))
const mobileImage = computed(() => buildImageUrl(packageData.value?.backImageM || packageData.value?.imageM || packageData.value?.backImage || packageData.value?.image))

function splitAirports(value) {
  const parts = String(value || '').split(/\s*(?:→|->|\bTO\b|\s-\s| تا )\s*/i).map(x => x.trim()).filter(Boolean)
  return [parts[0] || '-', parts[1] || '-']
}

// Preserve currency as supplied by API. Numeric hotel amounts have no confirmed currency in sample.
function formatMoney(value) {
  if (value === null || value === undefined || value === '') return '-'
  if (typeof value === 'number') return value.toLocaleString('fa-IR')
  const raw = String(value).trim()
  if (/^\d+$/.test(raw)) return Number(raw).toLocaleString('fa-IR')
  return raw
}

function tabClass(tab) {
  return [
    'w-full whitespace-nowrap rounded-xl px-3 py-3 text-sm font-bold transition md:w-auto md:rounded-full md:px-5 md:py-3',
    activeTab.value === tab ? 'bg-[#7f888d] text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-200'
  ]
}
function setDefaultTab() {
  if (hasPrograms.value) activeTab.value = 'program'
  else if (hasServices.value) activeTab.value = 'services'
  else if (hasPrices.value) activeTab.value = 'prices'
  else if (hasDocs.value) activeTab.value = 'docs'
  else if (hasTips.value) activeTab.value = 'tips'
  else if (hasPhotos.value) activeTab.value = 'gallery'
}

let requestSequence = 0
async function loadPackage() {
  const id = packageId.value
  const sequence = ++requestSequence
  if (!id) {
    packageData.value = null
    errorMessage.value = 'شناسه تور مشخص نیست.'
    loading.value = false
    return
  }
  loading.value = true
  errorMessage.value = ''
  packageData.value = null
  try {
    const response = await $fetch(`${BASE_URL}/package/${encodeURIComponent(id)}`)
    if (sequence !== requestSequence) return
    packageData.value = response?.data || response?.result || response || null
    if (!packageData.value || typeof packageData.value !== 'object') throw new Error('Invalid package response')
    setDefaultTab()
  } catch (error) {
    if (sequence !== requestSequence) return
    console.error('Load Package Error:', error)
    packageData.value = null
    errorMessage.value = 'دریافت اطلاعات پکیج با خطا مواجه شد.'
  } finally {
    if (sequence === requestSequence) loading.value = false
  }
}
watch(packageId, loadPackage, { immediate: true })
</script>

<style scoped>
.overflow-x-auto { scrollbar-width: thin; }
.html-content :deep(p) { margin: 0 0 0.6rem; }
.html-content :deep(ul) { list-style: disc; padding-right: 1.5rem; }
.html-content :deep(ol) { list-style: decimal; padding-right: 1.5rem; }
.page,
.page * {
  font-size: 14px !important;
  font-family: pelak, sans-serif !important;
}
</style>
