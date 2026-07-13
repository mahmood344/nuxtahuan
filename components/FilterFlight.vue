<template>
  <div class="bg-white p-6 shadow-sm rounded-2xl border border-gray-100 w-full max-w-sm">
    <h2 class="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
      فیلترها
    </h2>

    <!-- فیلتر قیمت -->
    <div class="mb-8">
      <h3 class="font-semibold text-gray-700 mb-4">قیمت</h3>{{timeRangeLimits}}
      <UiBaseRangeSlider
       v-model="filters.departureTimeRange"
        :min="timeRangeLimits[0]" 
        :max="timeRangeLimits[1]" 
        :step="30" 
        :formatValue="formatTime"
        :trackColor="'#dbeafe'"  
        :rangeColor="'#2563eb'"
      />
    </div>

    <!-- فیلتر ساعت حرکت -->
    <div class="mb-8">
      <h3 class="font-semibold text-gray-700 mb-6">ساعت حرکت</h3>
      <div class="relative">
        <input type="range" class="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
        <div class="flex justify-between text-[10px] text-gray-400 mt-3 px-1 rotate-[-30deg] origin-top-right">
          <span>صبح</span>
          <span>ظهر</span>
          <span>عصر</span>
          <span>شب</span>
          <span>نیمه شب</span>
        </div>
      </div>
    </div>

    <!-- نوع بلیط -->
    <div class="mb-8">
      <h3 class="font-semibold text-gray-700 mb-4">نوع بلیط</h3>
      <div class="space-y-3">
        <label class="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked />
          <span class="text-gray-600 group-hover:text-blue-600 transition">اکونومی</span>
        </label>
        <label class="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked />
          <span class="text-gray-600 group-hover:text-blue-600 transition">بیزینس</span>
        </label>
      </div>
    </div>

    <!-- نوع پرواز -->
    <div>
      <h3 class="font-semibold text-gray-700 mb-4">نوع پرواز</h3>
      <div class="space-y-3">
        <label class="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked />
          <span class="text-gray-600 group-hover:text-blue-600 transition">چارترى</span>
        </label>
        <label class="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked />
          <span class="text-gray-600 group-hover:text-blue-600 transition">سیستمی</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, defineProps, defineEmits } from 'vue';
// مسیر import را چک کنید، باید به کامپوننت UiRangeSlider اشاره کند


const props = defineProps({
  allFlightsData: { 
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:filters']);

// وضعیت فیلترها (فقط ساعت حرکت، نوع بلیط، نوع پرواز)
const filters = ref({
  departureTimeRange: [0, 2400], // مقدار اولیه برای ساعت حرکت
  ticketType: [], // آرایه برای چک باکس ها (مثلا 1 یا 2)
  flightType: '' // مقدار رشته ای برای نوع پرواز
});

// محاسبه محدوده ساعت حرکت بر اساس داده های دریافتی
const timeRangeLimits = computed(() => {
  if (!props.allFlightsData || props.allFlightsData.length === 0) return [0, 2400];

  const times = props.allFlightsData.map(flight => {
    if (!flight.departure) return 0;
    const dateStr = flight.departure;
    const timePart = dateStr.includes(' ') ? dateStr.split(' ')[1] : dateStr.split('T')[1];
    if (!timePart) return 0; 
    const [hours, minutes] = timePart.split(':');
    return parseInt(hours) * 100 + parseInt(minutes);
  });

  if (times.length === 0) return [0, 2400];

  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  const roundToNearest30 = (timeValue) => {
    const minutes = timeValue % 100;
    const hours = Math.floor(timeValue / 100);
    const totalMinutes = hours * 60 + minutes;
    const roundedTotalMinutes = Math.round(totalMinutes / 30) * 30;
    return Math.floor(roundedTotalMinutes / 60) * 100 + (roundedTotalMinutes % 60);
  };

  return [
    roundToNearest30(minTime),
    roundToNearest30(maxTime)
  ];
});


// فرمت کننده ساعت برای نمایش
const formatTime = (value) => {
  const hours = Math.floor(value / 100);
  const minutes = value % 100;
  const formattedMinutes = String(minutes).padStart(2, '0');
  return `${hours}:${formattedMinutes}`; 
};

// واچ برای ارسال تغییرات فیلتر به کامپوننت والد
watch(filters, (newFilters) => {
  emit('update:filters', newFilters);
}, { deep: true });

onMounted(() => {
  // تنظیم مقدار اولیه اسلایدر ساعت حرکت بر اساس داده های بارگذاری شده
  filters.value.departureTimeRange = timeRangeLimits.value;
});
</script>
