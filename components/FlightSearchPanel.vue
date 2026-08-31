<template>
  <!-- کانتینر اصلی پنل جستجو بدون تصویر هدر -->
  <div class="relative w-full">
    
    <!-- کارت جستجو -->
    <div class="relative border border-gray-200 z-20 mx-auto w-full max-w-[462px] md:max-w-[1246px] bg-white rounded-3xl shadow-xl min-h-[auto] p-6">
      
      <!-- دکمه‌های انتخاب سرویس (مانند بلیط، تور و...) در بالای پنل -->
      <div dir="rtl" class="mt-0 grid grid-cols-2 gap-3">
  <UiBaseButton
    v-for="(s, index) in services"
    :key="s.key"
    :label="s.label"
    :icon="s.icon"
    :variant="activeService === s.key ? 'filled' : 'outline'"
    :color="activeService === s.key ? 'primary' : 'white'"
    :active="activeService === s.key"
    @click="selectService(s.key, index)"
    class="text-[13px] font-black w-full"
    :class="{
      'col-span-2 justify-self-center max-w-[220px]': index === services.length - 1
    }"
  />
</div>

      <!-- خط جداکننده سرویس‌ها -->
      <div class="w-full my-4 h-[1px] bg-[var(--color-gray-300)]"></div>

      <!-- بخش اصلی فرم پرواز -->
      <div dir="rtl" v-if="activeService == 'flight'" id="app" class="flex flex-col justify-center">
        
        <!-- بخش رادیو باتن‌ها: چیدمان دو تایی در یک ردیف -->
        <div class="w-full space-y-4 p-4">
          <!-- ردیف اول: پرواز داخلی و خارجی -->
          <div class="grid grid-cols-2 gap-4 justify-items-center">
            <UiBaseRadio 
              v-model="flightType" 
              value="domestic"
              label="پرواز داخلی" 
              class="text-[13px]" 
            />  
            <UiBaseRadio 
              v-model="flightType" 
              value="international"
              label="پرواز خارجی" 
              class="text-[13px]" 
            />
          </div>

          <!-- ردیف دوم: یک طرفه و رفت و برگشت -->
          <div class="grid grid-cols-2 gap-4 justify-items-center">
            <UiBaseRadio 
              v-model="travelType" 
              value="one-way" 
              label="یک طرفه" 
              class="text-[13px]" 
            />  
            <UiBaseRadio 
              v-model="travelType" 
              value="round-trip"
              label="رفت و برگشت" 
              class="text-[13px]" 
            />  
          </div>
        </div>

        <!-- ورودی‌ها به صورت ستونی زیر هم -->
        <div dir="rtl" class="w-full flex flex-col gap-4 mt-2">
          
          <!-- مبدا و مقصد -->
          <div class="w-full">
            <UiOriginDestinationSelector
              :sendFlightType="flightType"
              v-model:mabda="origin"
              v-model:maghsad="destination"
            />
          </div>
          
          <!-- تاریخ رفت و برگشت -->
          <div class="w-full">
            <UiBaseDatePicker 
              :sendTravelType="travelType"
              v-model:departDate="departDate"
              v-model:returnDate="returnDate"
            />
          </div>
          
          <!-- انتخاب مسافران -->
          <div class="w-full">
            <UiPassengerSelector 
              v-model:adl="adl"
              v-model:chd="chd"
              v-model:inf="inf"
            />
          </div>

          <!-- دکمه جستجو در وسط -->
          <div class="flex justify-center items-center w-full mt-4">
            <UiBaseButton
              class="w-full max-w-[280px] h-[44px] !rounded-4xl text-[13px]" 
              label="جستجو"
              variant="filled"
              color="primary"
              :active="false"
              :disabled="!origin || !destination || !departDate || !adl"
              @click="searchFlights"
            />
          </div>

        </div>
      </div>
      <!-- بخش جستجوی هتل آهوان -->
<div
  v-if="activeService==='hotelAhwan'"
  dir="rtl"
  class="flex flex-col justify-center"
>

  <div
    class="w-full flex flex-col gap-4 p-4 md:p-8"
  >

    <!-- شهر -->
    <div class="w-full mb-4">

      <UiBaseAutocomplete
        label="شهر"
        placeholder="نام شهر را جستجو کنید..."
        :items="hotelCities"
        item-text="name"
        item-value="code"
        v-model="hotelCity"
        clearable
        icon='<i class="bi bi-geo-alt"></i>'
        iconPosition="right"
      />

    </div>



    <!-- تاریخ -->
    <div class="w-full mb-4">

      <UiSingleDatePicker
        v-model="hotelDate"
        label="تاریخ ورود و خروج"
        placeholder="انتخاب تاریخ"
      />

    </div>



    <!-- دکمه -->
    <div class="w-full">

      <UiBaseButton
        label="جستجو"
        variant="filled"
        color="primary"
        :active="false"
        :disabled="!hotelCity || !hotelDate"
        class="w-full max-w-[500px] h-[40px] !rounded-4xl text-[13px]"
        @click="searchAhuanHotel"
      />

    </div>


  </div>

</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'
import {useHotelStore} from '~/stores/hotels'
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
const hotelStore=useHotelStore()

const hotelCity=ref(null)

const hotelDate=ref(null)
const hotelCities=computed(()=>{

 return hotelStore.hotels.map(item=>({

  code:item.id,

  name:item.title

 }))

})
const services = [
  { key: "flight", label: "بلیط هواپیما", icon: "🛫" },
  { key: "package", label: "تور (گروهی)", icon: "🧳" },
  { key: "hotelAhwan", label: "هتل آهوان", icon: "🏩" },
  { key: "train", label: "قطار", icon: "🚄" },
  { key: "bus", label: "اتوبوس", icon: "🚍" },
  { key: "hotel", label: "هتل", icon: "🏝️" },
  { key: "insurance", label: "بیمه سفر", icon: "🛡️" },
]

const activeService = ref("flight")
const currentSlide = ref(0)

const selectService = (serviceKey, index) => {
  activeService.value = serviceKey
  currentSlide.value = index
}
function searchAhuanHotel(){

 if(!hotelCity.value || !hotelDate.value)
  return


 const dates=
 Array.isArray(hotelDate.value)
 ?
 hotelDate.value
 :
 String(hotelDate.value).split(',')



 router.push({

  path:`/hotels/${hotelCity.value}`,

  query:{

   checkIn:dates[0],

   checkOut:dates[1]

  }

 })

}
function searchFlights() {
  router.push({
    path: '/flights',
    query: {
      origin: origin.value,
      destination: destination.value,
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
/* در صورت نیاز به ترنزیشن یا استایل‌های خاص برای کامپوننت */
</style>
