<!-- components/ui/BaseStepper.vue -->
<template>
  <div class="w-full" dir="rtl">
    <div class="mx-auto flex items-center justify-between px-4" :class="maxWidthClass">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="flex flex-col items-center flex-1 relative"
      >
        <!-- دایره آیکون -->
        <div
          class="flex h-[80px] w-[80px] items-center justify-center rounded-full border transition-all duration-300"
          :class="[
            index === activeStep
              ? `shadow-md border-[${activeColor}] bg-[${activeColor}] text-white`
              : 'border-slate-300 bg-white text-slate-500 shadow-sm'
          ]"
          :style="index === activeStep ? { backgroundColor: activeColor, borderColor: activeColor } : {}"
        >
          <span class="text-xl leading-none">{{ step.icon }}</span>
        </div>

        <!-- عنوان -->
        <span
          class="mt-1.5 text-[12px] font-bold transition-colors duration-300"
          :class="index === activeStep ? 'opacity-100' : 'opacity-50 text-slate-600'"
          :style="index === activeStep ? { color: activeColor } : {}"
        >
          {{ step.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // لیست مراحل شامل آیکون و لیبل
  steps: {
    type: Array,
    required: true,
    default: () => []
  },
  // ایندکس مرحله فعال
  activeStep: {
    type: Number,
    default: 0
  },
  // رنگ برند (مثلاً برای پرواز سرمه‌ای، برای هتل شاید طلایی)
  activeColor: {
    type: String,
    default: '#1a237e'
  },
  // کنترل عرض کانتینر
  maxWidthClass: {
    type: String,
    default: 'max-w-2xl'
  }
})
</script>
