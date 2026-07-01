<template>
  <div dir="rtl" class="max-w-5xl mx-auto p-4 md:p-8 font-sans">
    
    <!-- هدر خلاصه مسیر -->{{flightStore.flights}}asas
    <div class="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-6 flex justify-between items-center text-sm">
      <div class="text-gray-700">
        <span>پرواز <strong>{{ route.query.origin }}</strong> به <strong>{{ route.query.destination }}</strong></span>
        <span class="mx-2 text-gray-300">|</span>
        <span>تاریخ: <strong>{{ route.query.departDate }}</strong></span>
        <span class="mx-2 text-gray-300">|</span>
        <span>مسافران: <strong>{{ Number(route.query.adl || 1) }} بزرگسال</strong></span>
      </div>
      <button @click="router.push('/')" class="text-blue-600 font-bold hover:underline">اصلاح جستجو</button>
    </div>

    <!-- وضعیت در حال بارگذاری -->
    <div v-if="flightStore.loading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 text-sm">در حال جستجوی پروازهای لحظه‌ای...</p>
    </div>

    <!-- نمایش لیست پروازها -->
    <div v-else-if="flightStore.flights && flightStore.flights.length > 0">
      <div 
        v-for="flight in flightStore.flights" 
        :key="flight.id" 
        class="border border-gray-100 rounded-2xl p-6 mb-4 shadow-sm hover:shadow-md transition bg-white flex flex-col md:flex-row justify-between items-center gap-4"
        :class="{ 'opacity-60 bg-gray-50': flight.disabled }"
      >
        <!-- اطلاعات ایرلاین -->
        <div class="flex items-center gap-4">
          <div class="text-3xl">✈️</div>
          <div>
            <h3 class="font-bold text-gray-800">{{ flight.airline }} - {{ flight.flightNumber }}</h3>
            <span class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{{ flight.cabin }}</span>
          </div>
        </div>

        <!-- اطلاعات زمان و مسیر -->
        <div class="flex items-center gap-8">
          <div class="text-center">
            <span class="block text-lg font-black text-gray-900">{{ flight.departure }}</span>
            <span class="text-xs text-gray-500 font-bold">{{ flight.origin }}</span>
          </div>
          <div class="text-gray-300 text-lg">➔</div>
          <div class="text-center">
            <span class="block text-lg font-black text-gray-900">{{ flight.arrival }}</span>
            <span class="text-xs text-gray-500 font-bold">{{ flight.destination }}</span>
          </div>
        </div>

        <!-- قیمت و دکمه خرید -->
        <div class="text-left w-full md:w-auto">
          <div class="text-xs text-gray-400">شروع قیمت از:</div>
          <div class="text-xl font-black text-emerald-600 mb-2">
            {{ flight.priceFrom ? flight.priceFrom.toLocaleString() : '---' }} <span class="text-xs text-gray-500">ریال</span>
          </div>
          
          <button 
            @click="selectFlight(flight)"
            :disabled="flight.disabled"
            class="w-full md:w-auto px-6 py-2 rounded-xl text-sm font-bold text-white transition-all"
            :class="flight.disabled ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-blue-600 hover:bg-blue-700'"
          >
            {{ flight.disabled ? flight.statusMessage : 'انتخاب بلیط' }}
          </button>
        </div>
      </div>
    </div>

    <!-- در صورت خالی بودن نتایج -->
    <div v-else class="text-center py-20 border rounded-2xl bg-white">
      <p class="text-gray-600">پروازی متناسب با جستجوی شما یافت نشد. لطفاً تاریخ یا مسیر را تغییر دهید.</p>
    </div>

  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useFlightStore } from '../stores/flights'

const route = useRoute()
const router = useRouter()
const flightStore = useFlightStore()

const loadSearchData = async () => {
  // خواندن ایمن پارامترها و اطمینان از String یا Number بودن آن‌ها (جلوگیری از آبجکت‌های واکنشی)
  const searchParams = {
    from: String(route.query.origin || ''),
    to: String(route.query.destination || ''),
    departureDate: String(route.query.departDate || ''),
    returnDate: route.query.returnDate ? String(route.query.returnDate) : '',
    adults: parseInt(route.query.adl || 1),
    children: parseInt(route.query.chd || 0),
    infants: parseInt(route.query.inf || 0),
    flightType: String(route.query.flightType || 'domestic'),
    travelType: String(route.query.travelType || 'one-way')
  }

  // فرستادن اطلاعات تمیز به استور پینیا جهت فراخوانی APIها
  await flightStore.searchFlights(searchParams)
}

const selectFlight = async (flight) => {
  // ارسال کلون ساده از آبجکت پرواز به جای خود نمونه واکنشی (Reactive) جهت جلوگیری از circular JSON
  const plainFlight = JSON.parse(JSON.stringify(flight))
  await flightStore.loadFlightDetails(plainFlight)
  console.log('Flight Selected:', plainFlight)
}

onMounted(() => {
  loadSearchData()
})
</script>
