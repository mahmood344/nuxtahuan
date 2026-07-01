<template>
  <div dir="rtl" class="flex w-full justify-center p-4">
    <div
      class="relative flex w-full max-w-[500px] h-[54px] bg-white border border-gray-300 rounded-[12px] items-center"
    >
      <!-- بخش مبدا -->
      <div class="flex-1 h-full relative group">
        <label class="absolute -top-3 right-6 z-20 bg-white px-2 text-[11px] text-gray-400">
          مبدا (شهر)
        </label>
        
        <!-- نمایش مقدار انتخاب شده -->
        <div 
          @click="isMabdaOpen = !isMabdaOpen; isMaghsadOpen = false"
          class="w-full h-full flex items-center px-6 cursor-pointer text-gray-700"
        >
          <i 
            v-if="mabda"
            @click.stop="clearMabda"
            class="bi bi-x text-gray-400 text-xl hover:text-red-500 transition-colors"
            title="پاک کردن"
          ></i>
          <i 
            v-else
            class="bi bi-chevron-down text-gray-400 text-xs"
          ></i>
          <span v-if="mabda" class="mr-2">{{ mabda.cityNicName }}</span>
          <span v-else class="text-gray-400 font-bold text-[10px] mr-2">انتخاب مبدا</span>
        </div>

        <!-- لیست شهرهای مبدا -->
        <div v-if="isMabdaOpen" class="custom-dropdown">
          <!-- input سرچ -->
          <div class="relative w-full">
            <input
              v-model="searchMabda"
              placeholder="جستجوی شهر..."
              class="w-full px-3 py-2 text-sm border-b border-[var(--color-gray-100)] outline-none"
            />
            <span
              v-if="loadingMabda"
              class="absolute left-3 top-2 animate-spin text-gray-400"
            >
              <i class="bi bi-arrow-repeat"></i>
            </span>
          </div>

          <!-- عنوان پرتردد -->
          <div class="px-4 py-2 text-[11px] text-gray-400 bg-gray-50/50">
            پرتردد
          </div>

          <!-- لیست شهرها -->
          <div 
            v-for="city in (searchMabda ? dropdownCities : popularCities)"
            :key="city.id || city.cityCode || city.iataCode"
            @click="selectMabda(city)"
            class="city-item"
          >
            {{ city.cityNicName }}
          </div>
        </div>
      </div>

      <!-- دکمه جابجایی (با استایل و وسط‌چین دقیق شما) -->
      <div class="flex-shrink-0 flex items-center justify-center w-16 h-full relative">
        <div class="absolute inset-y-0 w-px bg-gray-300"></div>
        <button
          :class="{ disableBtn: !isFormValid }"
          :disabled="!isFormValid"
          @click="swapFields"
          class="p-1 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-300 relative z-10 hover:scale-110 transition-all"
        >
          <i class="bi bi-arrow-left-right w-5 h-5 text-gray-600"></i>
        </button>
      </div>

      <!-- بخش مقصد -->
      <div class="flex-1 h-full relative group">
        <label class="absolute -top-3 right-1 z-20 bg-white px-2 text-[11px] text-gray-400">
          مقصد (شهر)
        </label>
        
        <div 
          @click="isMaghsadOpen = !isMaghsadOpen; isMabdaOpen = false"
          class="w-full h-full flex items-center px-6 cursor-pointer text-gray-700"
        >
          <i 
            v-if="maghsad"
            @click.stop="clearMaghsad"
            class="bi bi-x text-gray-400 text-xl hover:text-red-500 transition-colors"
            title="پاک کردن"
          ></i>
          <i 
            v-else
            class="bi bi-chevron-down text-gray-400 text-xs"
          ></i>
          <span v-if="maghsad" class="mr-2">{{ maghsad.cityNicName }}</span>
          <span v-else class="text-gray-400 font-bold text-[10px] mr-2">انتخاب مقصد</span>
        </div>

        <!-- لیست شهرهای مقصد -->
        <div v-if="isMaghsadOpen" class="custom-dropdown">
          <!-- input سرچ -->
          <div class="relative w-full">
            <input
              v-model="searchMaghsad"
              placeholder="جستجوی شهر..."
              class="w-full px-3 py-2 text-sm border-b border-[var(--color-gray-100)] outline-none"
            />
            <span
              v-if="loadingMaghsad"
              class="absolute left-3 top-2 animate-spin text-gray-400"
            >
              <i class="bi bi-arrow-repeat"></i>
            </span>
          </div>

          <div class="px-4 py-2 text-[11px] text-gray-400 bg-gray-50/50">
            پرتردد
          </div>

          <div 
            v-for="city in (searchMaghsad ? dropdownCities : popularCities)"
            :key="city.id || city.cityCode || city.iataCode"
            @click="selectMaghsad(city)"
            class="city-item"
          >
            {{ city.cityNicName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useFlightStore } from "@/stores/flights"

const props = defineProps({
  sendFlightType: {
    type: String,
    default: "domestic"
  }
})

const emit = defineEmits([
  'update:mabda',
  'update:maghsad',
]);

const flightStore = useFlightStore()

const mabda = ref(null)
const maghsad = ref(null)

const searchMabda = ref("")
const searchMaghsad = ref("")

const isMabdaOpen = ref(false)
const isMaghsadOpen = ref(false)

const dropdownCities = ref([])

const loadingMabda = ref(false)
const loadingMaghsad = ref(false)

const isSelecting = ref(false)

const internationalPopularCities = ref([])
const {public:{baseUrl}} = useRuntimeConfig()
/* -----------------------
استخراج کد مناسب جهت ارسال به والد (Emit)
در پرواز داخلی: cityCode
در پرواز خارجی: iataCode
----------------------- */
const getCodeForEmit = (city) => {
  if (!city) return null
  return props.sendFlightType === "domestic" ? city.cityCode : city.iataCode
}

/* -----------------------
popular cities
----------------------- */
const popularCities = computed(() => {
  if (props.sendFlightType === "domestic") {
    return flightStore.popularCities || []
  }
  return internationalPopularCities.value
})

/* -----------------------
پرتردد خارجی
----------------------- */
const fetchInternationalPopular = async () => {
  try {
    const res = await $fetch(`https://api.ahuan.ir/api/BasicInfo/default-airports`)
    console.log(res , 'res');
    internationalPopularCities.value = res || []
  } catch (err) {
    console.error("popular airports error", err)
  }
}

/* -----------------------
فیلتر داخلی
----------------------- */
const filterDomesticCities = (query) => {
  if (!flightStore?.iranAirports) return []
  return flightStore.iranAirports.filter(city =>
    city.cityNicName.toLowerCase().includes(query.toLowerCase())
  )
}

/* -----------------------
search cities
----------------------- */
const searchCities = async (query, type) => {
  if (!query) {
    dropdownCities.value = []
    return
  }

  if (props.sendFlightType === "domestic") {
    dropdownCities.value = filterDomesticCities(query)
    return
  }

  try {
    if (type === "mabda") loadingMabda.value = true
    if (type === "maghsad") loadingMaghsad.value = true

    const apiUrl = `https://api.ahuan.ir/api/BasicInfo/airports/${query}`
    const res = await $fetch(apiUrl)

    if (Array.isArray(res)) {
      dropdownCities.value = res
    } else if (res && typeof res === 'object') {
      dropdownCities.value = [res]
    } else {
      dropdownCities.value = []
    }
  } catch (err) {
    console.error("Airport search error:", err)
    dropdownCities.value = []
  } finally {
    if (type === "mabda") loadingMabda.value = false
    if (type === "maghsad") loadingMaghsad.value = false
  }
}

/* -----------------------
watch mabda
----------------------- */
watch(searchMabda, (val) => {
  if (isSelecting.value) return

  if (val) {
    searchCities(val, "mabda")
    isMabdaOpen.value = true
  } else {
    dropdownCities.value = popularCities.value
  }
})

/* -----------------------
watch maghsad
----------------------- */
watch(searchMaghsad, (val) => {
  if (isSelecting.value) return

  if (val) {
    searchCities(val, "maghsad")
    isMaghsadOpen.value = true
  } else {
    dropdownCities.value = popularCities.value
  }
})

/* -----------------------
flightType change (تغییر نوع پرواز و پاکسازی ورودی‌ها)
----------------------- */
watch(() => props.sendFlightType, async (type) => {
  if (type === "international") {
    await fetchInternationalPopular()
  }

  // پاک کردن مقادیر و امیت null
  mabda.value = null
  searchMabda.value = ""
  emit('update:mabda', null)

  maghsad.value = null
  searchMaghsad.value = ""
  emit('update:maghsad', null)

  isMabdaOpen.value = false
  isMaghsadOpen.value = false

  dropdownCities.value = popularCities.value
}, { immediate: true })

/* -----------------------
form valid
----------------------- */
const isFormValid = computed(() => {
  return mabda.value && maghsad.value
})

/* -----------------------
swap
----------------------- */
const swapFields = () => {
  if (!isFormValid.value) return

  isSelecting.value = true

  const temp = mabda.value
  mabda.value = maghsad.value
  maghsad.value = temp

  const tempSearch = searchMabda.value
  searchMabda.value = searchMaghsad.value
  searchMaghsad.value = tempSearch

  isMabdaOpen.value = false
  isMaghsadOpen.value = false
  dropdownCities.value = []

  // ارسال کد مناسب جابجا شده به والد
  emit('update:mabda', getCodeForEmit(mabda.value))
  emit('update:maghsad', getCodeForEmit(maghsad.value))

  setTimeout(() => {
    isSelecting.value = false
  }, 100)
}

/* -----------------------
select city
----------------------- */
const selectMabda = (city) => {
  isSelecting.value = true

  mabda.value = city
  searchMabda.value = city.cityNicName

  // ارسال کد مناسب به والد
  emit('update:mabda', getCodeForEmit(city))

  isMabdaOpen.value = false
  dropdownCities.value = []

  setTimeout(() => {
    isSelecting.value = false
  }, 100)
}

const selectMaghsad = (city) => {
  isSelecting.value = true

  maghsad.value = city
  searchMaghsad.value = city.cityNicName

  // ارسال کد مناسب به والد
  emit('update:maghsad', getCodeForEmit(city))

  isMaghsadOpen.value = false
  dropdownCities.value = []

  setTimeout(() => {
    isSelecting.value = false
  }, 100)
}

/* -----------------------
clear
----------------------- */
const clearMabda = () => {
  mabda.value = null
  searchMabda.value = ""
  emit('update:mabda', null)

  dropdownCities.value = popularCities.value
  isMabdaOpen.value = true
}

const clearMaghsad = () => {
  maghsad.value = null
  searchMaghsad.value = ""
  emit('update:maghsad', null)

  dropdownCities.value = popularCities.value
  isMaghsadOpen.value = true
}

/* -----------------------
mounted
----------------------- */
onMounted(async () => {
  if (props.sendFlightType === "international") {
    await fetchInternationalPopular()
  }
  dropdownCities.value = popularCities.value
})
</script>

<style scoped>
/* استایل لیست شهرها */
.custom-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.city-item {
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s;
}

.city-item:last-child {
  border-bottom: none;
}

.city-item:hover {
  background-color: #f9fafb;
}

/* استایل دکمه غیرفعال شما */
.disableBtn {
  background: var(--color-gray-200);
  cursor: not-allowed;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.border-gray-300 {
  border-color: #d1d5db;
}

.w-px {
  width: 1px;
}

/* اسکرول‌بار زیبا برای لیست */
.custom-dropdown::-webkit-scrollbar {
  width: 4px;
}
.custom-dropdown::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
</style>
