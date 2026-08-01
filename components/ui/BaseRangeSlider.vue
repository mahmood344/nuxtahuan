<template>
  <div class="relative w-full px-4" ref="sliderContainer">
    <!-- نمایشگر مقادیر فعلی -->
    <div class="flex justify-between text-sm text-gray-500 mb-3 px-1">
     
    </div>

    <!-- مسیر اسلایدر -->
    <div 
      class="h-2 rounded-full relative" 
      :style="{ backgroundColor: trackColor }"
      ref="track"
    >
      <!-- ناحیه قابل کلیک و کشیدن -->
      <div 
        class="absolute h-full rounded-full z-10" 
        :style="{ left: `${positionLeft}%`, right: `${100 - positionRight}%`, backgroundColor: rangeColor }"
      ></div>
      
      <!-- هندل چپ -->
      <div 
        class="absolute w-4 h-4 bg-primary rounded-full shadow-md cursor-grab top-1/2 -translate-y-1/2 z-20" 
        :style="{ left: `${positionLeft}%` }"
        @mousedown.prevent="startDrag($event, 'left')"
        @touchstart.prevent="startDrag($event, 'left')"
        ref="handleLeft"
      ></div>

      <!-- هندل راست -->
      <div 
        class="absolute w-4 h-4 bg-primary rounded-full shadow-md cursor-grab top-1/2 -translate-y-1/2 z-20" 
        :style="{ left: `${positionRight}%` }"
        @mousedown.prevent="startDrag($event, 'right')"
        @touchstart.prevent="startDrag($event, 'right')"
        ref="handleRight"
      ></div>
    </div>
     <!-- مقادیر min/max اسمی (اختیاری) -->
     <!-- <div class="flex justify-between text-xs text-gray-400 mt-1 px-1">
       <span>{{ formatValue(min) }}</span>
       <span>{{ formatValue(max) }}</span>
     </div> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

const props = defineProps({
  modelValue: { // آرایه ای از دو مقدار: [minCurrent, maxCurrent]
    type: Array,
    required: true,
    validator: (value) => value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number'
  },
  min: { // حداقل مقدار ممکن برای اسلایدر
    type: Number,
    default: 0
  },
  max: { // حداکثر مقدار ممکن برای اسلایدر
    type: Number,
    default: 100
  },
  step: { // گام افزایش/کاهش مقدار
    type: Number,
    default: 1
  },
  trackColor: { // رنگ مسیر اسلایدر
    type: String,
    default: '#e5e7eb' // gray-200
  },
  rangeColor: { // رنگ ناحیه بین دو هندل
    type: String,
    default: '#2563eb' // blue-600
  },
  handleColor: { // رنگ هندل ها (در حال حاضر از CSS global استفاده شده)
    type: String,
    default: '#2563eb' // blue-600
  },
  formatValue: { // تابعی برای فرمت کردن نمایش مقادیر (مثلا اضافه کردن واحد پول)
    type: Function,
    default: (value) => value.toLocaleString('fa-IR') // فرمت فارسی پیش فرض
  }
});

const emit = defineEmits(['update:modelValue']);

const sliderContainer = ref(null); // ارجاع به div اصلی اسلایدر
const track = ref(null); // ارجاع به div مسیر اسلایدر
const handleLeft = ref(null);
const handleRight = ref(null);

const dragging = ref(false);
const currentDragging = ref(null); // 'left' یا 'right'
const containerWidth = ref(0);
const trackRect = ref({ left: 0, width: 0 });

// محاسبه درصد موقعیت هندل ها بر اساس مقادیر modelValue
const positionLeft = computed(() => {
  const value = Math.max(props.min, props.modelValue[0]);
  return ((value - props.min) / (props.max - props.min)) * 100;
});

const positionRight = computed(() => {
  const value = Math.min(props.max, props.modelValue[1]);
  return ((value - props.min) / (props.max - props.min)) * 100;
});

// تابع برای دریافت موقعیت موس/تاچ نسبت به کانتینر اسلایدر
const getSliderX = (event) => {
  const sliderRect = sliderContainer.value.getBoundingClientRect();
  const clientX = event.clientX || (event.touches && event.touches[0].clientX);
  if (clientX === undefined) return 0;

  // محاسبه موقعیت نسبت به شروع کانتینر اسلایدر
  let sliderX = clientX - sliderRect.left;

  // اطمینان از اینکه مقدار بین 0 و عرض کانتینر است
  sliderX = Math.max(0, Math.min(sliderX, sliderRect.width));
  return sliderX;
};

// محاسبه مقدار عددی بر اساس موقعیت پیکسل
const valueFromX = (x) => {
  const percentage = (x / containerWidth.value) * 100;
  const value = props.min + (percentage / 100) * (props.max - props.min);
  
  // اعمال گام (step)
  const steppedValue = Math.round(value / props.step) * props.step;
  
  // اطمینان از اینکه مقدار بین min و max است
  return Math.max(props.min, Math.min(props.max, steppedValue));
};

// شروع کشیدن هندل
const startDrag = (event, handleType) => {
  dragging.value = true;
  currentDragging.value = handleType;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchmove', onDrag, { passive: false }); // passive: false برای preventDefault
  document.addEventListener('touchend', endDrag);

  // جلوگیری از اسکرول صفحه هنگام کشیدن در موبایل
  if (event.type === 'touchstart') {
    event.preventDefault();
  }
};

// هنگام کشیدن هندل
const onDrag = (event) => {
  if (!dragging.value) return;

  const sliderX = getSliderX(event);
  const newValue = valueFromX(sliderX);
  
  let [currentMin, currentMax] = props.modelValue;

  if (currentDragging.value === 'left') {
    // هندل چپ نباید از هندل راست یا مقدار max عبور کند
    const newMinValue = Math.min(newValue, currentMax - props.step); // اطمینان از حداقل فاصله step
    emit('update:modelValue', [newMinValue, currentMax]);
  } else if (currentDragging.value === 'right') {
    // هندل راست نباید از هندل چپ یا مقدار min عبور کند
    const newMaxValue = Math.max(newValue, currentMin + props.step); // اطمینان از حداقل فاصله step
    emit('update:modelValue', [currentMin, newMaxValue]);
  }
};

// پایان کشیدن هندل
const endDrag = () => {
  dragging.value = false;
  currentDragging.value = null;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', endDrag);
};

// بروزرسانی اندازه کانتینر هنگام تغییر اندازه پنجره
const updateContainerDimensions = () => {
  if (sliderContainer.value) {
    containerWidth.value = sliderContainer.value.offsetWidth;
  }
};

onMounted(() => {
  window.addEventListener('resize', updateContainerDimensions);
  nextTick(() => { // اطمینان از اینکه DOM کاملا رندر شده
      updateContainerDimensions();
  });
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', endDrag);
  window.removeEventListener('resize', updateContainerDimensions);
});

// Watch for external changes to modelValue to ensure internal state is consistent
watch(() => props.modelValue, (newVal) => {
    // Optionally, re-calculate or validate if needed, though computed properties should handle it.
    // Make sure newVal[0] <= newVal[1] and within bounds.
    const [currentMin, currentMax] = newVal;
    if (currentMin > currentMax) {
        console.warn("UiRangeSlider: min value cannot be greater than max value. Adjusting.");
        emit('update:modelValue', [currentMax, currentMin]); // Swap if invalid
    }
    if (currentMin < props.min || currentMax > props.max) {
        console.warn("UiRangeSlider: values out of bounds. Clamping.");
        emit('update:modelValue', [
            Math.max(props.min, Math.min(currentMin, props.max)),
            Math.max(props.min, Math.min(currentMax, props.max))
        ]);
    }
}, { deep: true });

</script>

<style scoped>
.bg-primary {
  /* از متغیرهای CSS تعریف شده در کامپوننت والد استفاده کنید */
  background-color: var(--color-primary, #2563eb); 
}

.cursor-grab {
  cursor: grab;
}
.cursor-grabbing {
  cursor: grabbing;
}

/* استایل هندل ها */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

/* استایل برای تاچ موبایل */
.touch-none {
  touch-action: none;
}
</style>
