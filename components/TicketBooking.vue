<template>
  <!-- کانتینر اصلی صفحه -->
  <div class="relative w-full">
    
    <!-- هدر (تصویر) -->
    <div class="h-[404px] w-[full]">
      <!-- موبایل -->
      <div class="md:hidden text-[22px] bg-[var(--color-gray-100)] w-full h-full pt-[100px]">
        <h2 class="text-center text-[var(--color-primary)] font-rokh">آژانس گردشگری آهوان</h2>
      </div>
      <!-- دسکتاپ -->
      <div class="max-w-[1297px] hidden md:block mx-auto h-[519px] border border-gray-300 rounded-2xl">
        <img class="w-full h-full object-cover rounded-2xl" :src="currentImage" alt="Hero">
      </div>
    </div>

    <!-- کارت جستجو (که روی هدر قرار می‌گیره) -->
    <!-- در موبایل با margin-top منفی میاد بالا و در دسکتاپ هم همینطور -->
   <div class=" relative border border-l-gray-200 border-r-gray-200 border-b-gray-200 border-t-gray-50 z-20 mx-auto -mt-[250px] 0 md:mt-20 w-[95%] max-w-[462px] md:max-w-[1246px] bg-white rounded-3xl shadow-xl min-h-[auto] p-6">
    <div dir="rtl" class="mt-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-7 gap-3 md:-mt-[50px]">
      <UiBaseButton
        v-for="(s, index) in services"
        :key="s.key"
        :label="s.label"
        :icon="s.icon"
        :variant="activeService === s.key ? 'filled' : 'outline'"
        :color="activeService === s.key ? 'primary' : 'white'"  
        :active="activeService === s.key"
        @click="selectService(s.key, index)"
        class="text-[13px] font-black"
        :class="{
          'col-span-2 md:col-start-2 md:col-span-1 xl:col-span-1 xl:col-start-auto':
            index === services.length - 1
        }"
      />
    </div>
    <div class="w-full my-4 h-[1px] bg-[var(--color-gray-300)] md:hidden"></div>
     <div dir="rtl" v-if="activeService == 'flight'" id="app" class="flex flex-col justify-center">
    <!-- والد شما -->
   <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 justify-center p-4 md:p-8 gap-4 md:gap-6">
  <!-- UiBaseRadio items -->
  <UiBaseRadio 
    v-model="flightType" 
    value="domestic"
    label="پرواز داخلی" 
    class="mr-2 text-[13px]" 
  />  
  <UiBaseRadio 
    v-model="flightType" 
    value="international"
    label="پرواز خارجی" 
    class="mr-2 text-[13px]" 
  />  
  <UiBaseRadio 
    value="one-way"
    v-model="travelType" 
    label="یک طرفه" 
    class="mr-2 text-[13px]" 
  />  
  <UiBaseRadio 
    value="round-trip"
  v-model="travelType" 
    label="رفت و برگشت" 
    class="mr-2 text-[13px]" 
  />  
</div>
<div dir="rtl" class=" w-full flex flex-col-reverse xl:flex-row xl:flex-reverse">
  <!-- آیتم‌ها را به ترتیب دلخواه بنویسید، چون flex-reverse ترتیب را معکوس می‌کند -->
  <!-- در حالت lg، w-1/4 باعث می‌شود هر کدام 25% عرض را بگیرند -->
  <div class="order-4 xl:order-1 w-full xl:w-1/2 xl:basis-auto">
  <UiOriginDestinationSelector
  :sendFlightType="flightType"
  v-model:mabda="origin"
  v-model:maghsad="destination"
></UiOriginDestinationSelector></div>
  <div class="order-3 xl:order-2 w-full xl:w-1/3 xl:basis-auto">
  <UiBaseDatePicker :sendTravelType="travelType"
  v-model:departDate="departDate"
  v-model:returnDate="returnDate"></UiBaseDatePicker></div>
  <div class="order-2 xl:order-3 w-full xl:w-1/3 xl:basis-auto">
  <UiPassengerSelector v-model:adl="adl"
  v-model:chd="chd"
  v-model:inf="inf"></UiPassengerSelector></div>
  <div class="order-1 xl:order-4 flex justify-center items-center w-full xl:w-1/6 xl:basis-auto">
   <UiBaseButton
          class="w-full max-w-[500px] xl:max-w-[500px] h-[40px] !rounded-4xl text-[13px]" 
          label="جستجو"
          variant="filled"
          color="primary"
          :active="false"
:disabled="!origin || !destination || !departDate || !adl"
@click="searchFlights"
/></div>
</div>
  </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()
const origin = ref(null)
const destination = ref(null)
const departDate = ref(null)
const returnDate = ref(null)
const adl = ref(1)
const chd = ref(0)
const inf = ref(0)
const flightType = ref('domestic');
const travelType = ref('one-way')
const flightOptions = ref([
  {id: 'round-trip' },
  {id: 'one-way' },
  {id: 'international' },
  {id: 'domestic' },
]);
const images = [
  '/imgs/ticketbooking/flightbackground.png',
  '/imgs/ticketbooking/flightbackground2.png',
  '/imgs/ticketbooking/flightbackground3.png',
  '/imgs/ticketbooking/flightbackground4.png',
  '/imgs/ticketbooking/flightbackground5.png',
  '/imgs/ticketbooking/flightbackground6.png',
  '/imgs/ticketbooking/flightbackground7.png'
]

const services = [
  { key: "flight", label: "بلیط هواپیما", icon: "🛫" },
  { key: "package", label: "تور (گروهی)", icon: "🧳" },
  { key: "hotel", label: "هتل آهوان", icon: "🏩" },
  { key: "train", label: "قطار", icon: "🚄" },
  { key: "bus", label: "اتوبوس", icon: "🚍" },
  { key: "hotelAhwan", label: "هتل", icon: "🏝️" },
  { key: "insurance", label: "بیمه سفر", icon: "🛡️" },
]

const activeService = ref("flight")
const currentSlide = ref(0)

const currentImage = computed(() => images[currentSlide.value] || images[0])

const selectService = (serviceKey, index) => {
  activeService.value = serviceKey
  currentSlide.value = index
  resetAutoSlide()
}

// تایمر برای اسلاید خودکار
let autoSlideTimer = null

// شروع اسلاید خودکار
const startAutoSlide = () => {
  stopAutoSlide()
  autoSlideTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % images.length
    // به‌روزرسانی activeService بر اساس اسلاید فعلی
    activeService.value = services[currentSlide.value % services.length].key
  }, 5000) // هر 5 ثانیه تغییر کند
}

// توقف اسلاید خودکار
const stopAutoSlide = () => {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer)
    autoSlideTimer = null
  }
}

// ریست تایمر
const resetAutoSlide = () => {
  stopAutoSlide()
  // startAutoSlide()
}

// وقتی کامپوننت سوار می‌شود، اسلاید خودکار شروع شود
onMounted(() => {
  // startAutoSlide()
})

// وقتی کامپوننت از بین می‌رود، تایمر را متوقف کنیم
onUnmounted(() => {
  stopAutoSlide()
})
function searchFlights() {

  router.push({
    path: '/flights',
    query: {
      origin: origin.value || origin.value,
      destination: destination.value || destination.value,
      departDate: departDate.value,
      returnDate: travelType.value === 'round-trip' ? returnDate.value : null,
      adl: adl.value,
      chd: chd.value,
      inf: inf.value,
      flightType: flightType.value,
      travelType: travelType.value
    }
  })

}
</script>

<style scoped>
/* اگر می‌خوای فونت روخ داشته باشی */

/* انیمیشن تغییر تصویر */
img {
  transition: opacity 0.5s ease-in-out;
}

</style>