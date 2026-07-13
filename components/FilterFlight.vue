<template>
  <div class="filter-flight-container">
    <h3 class="filter-title">ساعت حرکت</h3>
    
    <div class="slider-wrapper" v-if="currentFilters.departureTimeRange">
      <!-- اسلایدر بازه زمانی ساعت پرواز -->
      <UiBaseRangeSlider
        v-model="currentFilters.departureTimeRange"
        :min="timeRangeLimits[0]"
        :max="timeRangeLimits[1]"
        :step="30" 
      />
      
      <!-- نمایش متنی بازه انتخاب شده -->
      <div class="time-labels">
        <span>از ساعت: {{ formatTime(currentFilters.departureTimeRange[0]) }}</span>
        <span>تا ساعت: {{ formatTime(currentFilters.departureTimeRange[1]) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';

const props = defineProps({
  // تمام پروازها برای محاسبه داینامیک محدوده اسلایدر
  allFlightsData: { 
    type: Array,
    required: true,
    default: () => []
  },
  // فیلترهای فعال متصل شده از والد با v-model:filters
  filters: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:filters']);

// مدیریت دوطرفه تغییرات فیلترها
const currentFilters = computed({
  get: () => props.filters,
  set: (newFilters) => emit('update:filters', newFilters)
});

// محاسبه کمترین و بیشترین ساعت پروازهای موجود
const timeRangeLimits = computed(() => {
  return [0, 2400];
});

// این تابع کمکی برای پیدا کردن ساعت اولین پرواز و آخرین پرواز جهت مقداردهی اولیه دستگیره‌ها است
const getFlightsActualTimeRange = () => {
  if (!props.allFlightsData || props.allFlightsData.length === 0) {
    return [0, 2400];
  }

  const times = props.allFlightsData.map(flight => {
    if (!flight.departure) return null;
    const dateStr = flight.departure;
    const timePart = dateStr.includes(' ') ? dateStr.split(' ')[1] : dateStr.split('T')[1];
    if (!timePart) return null;
    const [hours, minutes] = timePart.split(':');
    return parseInt(hours, 10) * 100 + parseInt(minutes, 10);
  }).filter(t => t !== null);

  if (times.length === 0) return [0, 2400];

  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  // گرد کردن به نزدیک‌ترین نیم‌ساعت
  const roundTo30 = (v) => {
    const mins = v % 100;
    const hrs = Math.floor(v / 100);
    const total = hrs * 60 + mins;
    const rounded = Math.round(total / 30) * 30;
    return Math.floor(rounded / 60) * 100 + (rounded % 60);
  };

  return [roundTo30(minTime), roundTo30(maxTime)];
};

// فرمت کردن عدد زمان (مثلا 720) به فرمت متنی (مثلا "07:20")
const formatTime = (value) => {
  if (value === undefined || value === null) return '00:00';
  const hours = Math.floor(value / 100);
  const minutes = value % 100;
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}`; 
};

onMounted(() => {
  // زمان لود صفحه، بازه فیلتر را روی ساعت واقعی اولین و آخرین پرواز تنظیم می‌کنیم
  const [actualMin, actualMax] = getFlightsActualTimeRange();
  
  // اگر فیلتر از قبل مقدار پیش‌فرض را دارد، آن را به محدوده واقعی تغییر بده
  if (props.filters.departureTimeRange && 
      props.filters.departureTimeRange[0] === 0 && 
      props.filters.departureTimeRange[1] === 2400) {
    currentFilters.value.departureTimeRange = [actualMin, actualMax];
  }
});
</script>

<style scoped>
.filter-flight-container {
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
.filter-title {
  font-size: 16px;
  margin-bottom: 15px;
}
.slider-wrapper {
  margin-top: 10px;
}
.time-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}
</style>
