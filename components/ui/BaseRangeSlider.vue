<template>
  <div
  class="relative isolate z-0 w-full px-4"
  ref="sliderContainer"
>
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
  ref="handleLeft"
  class="range-handle absolute top-1/2 z-20 h-5 w-5 cursor-grab rounded-full shadow-md"
  :style="{
    left: `${positionLeft}%`,
    borderColor: handleColor
  }"
  @mousedown.prevent="startDrag($event, 'left')"
  @touchstart.prevent="startDrag($event, 'left')"
></div>

<!-- هندل راست -->
<div
  ref="handleRight"
  class="range-handle absolute top-1/2 z-20 h-5 w-5 cursor-grab rounded-full shadow-md"
  :style="{
    left: `${positionRight}%`,
    borderColor: handleColor
  }"
  @mousedown.prevent="startDrag($event, 'right')"
  @touchstart.prevent="startDrag($event, 'right')"
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
    default: 'var(--color-primary)' // blue-600
  },
  handleColor: {
  type: String,
  default: 'var(--color-primary)'
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
const getSliderX = (
 event
) => {

 const rect =
  sliderContainer.value
   ?.getBoundingClientRect()


 if(
  !rect ||
  rect.width <= 0
 ){
  return 0
 }


 const clientX =
  event?.clientX ??
  event?.touches?.[0]?.clientX


 if(
  clientX === undefined
 ){
  return 0
 }


 return Math.max(
  0,
  Math.min(
   clientX - rect.left,
   rect.width
  )
 )

}

// محاسبه مقدار عددی بر اساس موقعیت پیکسل
const valueFromX = (
 x
) => {

 const rect =
  sliderContainer.value
   ?.getBoundingClientRect()

 const width =
  Number(
   rect?.width ||
   0
  )


 if(
  width <= 0 ||
  props.max <= props.min
 ){
  return props.min
 }


 const ratio =
  Math.max(
   0,
   Math.min(
    1,
    x / width
   )
  )


 const rawValue =
  props.min +
  ratio *
  (
   props.max -
   props.min
  )


 /*
  * Step باید نسبت به min محاسبه شود،
  * نه نسبت به صفر.
  */
 const steppedValue =
  props.min +
  Math.round(
   (
    rawValue -
    props.min
   ) /
   props.step
  ) *
  props.step


 return Math.max(
  props.min,
  Math.min(
   props.max,
   steppedValue
  )
 )

}

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
const onDrag = (
 event
) => {

 if(
  !dragging.value
 ){
  return
 }


 if(
  event?.cancelable
 ){
  event.preventDefault()
 }


 const sliderX =
  getSliderX(
   event
  )


 const newValue =
  valueFromX(
   sliderX
  )


 const currentMin =
  Number(
   props.modelValue?.[0] ??
   props.min
  )


 const currentMax =
  Number(
   props.modelValue?.[1] ??
   props.max
  )


 if(
  currentDragging.value ===
  'left'
 ){

  const newMinValue =
   Math.min(
    newValue,
    currentMax -
    props.step
   )


  emit(
   'update:modelValue',
   [
    Math.max(
     props.min,
     newMinValue
    ),
    currentMax
   ]
  )


  return
 }


 if(
  currentDragging.value ===
  'right'
 ){

  const newMaxValue =
   Math.max(
    newValue,
    currentMin +
    props.step
   )


  emit(
   'update:modelValue',
   [
    currentMin,
    Math.min(
     props.max,
     newMaxValue
    )
   ]
  )

 }

}

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
.range-handle {
  border: 3px solid;
  background-color: white;
  transform: translate(-50%, -50%);
  touch-action: none;
  transition:
    box-shadow 0.2s ease,
    scale 0.2s ease;
}

.range-handle:hover {
  scale: 1.1;
  box-shadow: 0 0 0 5px rgb(38 41 166 / 10%);
}

.range-handle:active {
  cursor: grabbing;
  scale: 1.15;
}
</style>
