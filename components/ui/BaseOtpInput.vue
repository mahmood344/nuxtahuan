<!-- components/auth/OtpInput.vue -->
<template>
  <div class="flex flex-row-reverse justify-center gap-3 ltr" dir="ltr">
    <input
      v-for="(digit, index) in length"
      v-bind="$attrs"
      :key="index"
      :ref="(el) => (inputRefs[index] = el)"
      type="text"
      inputmode="numeric"
      maxlength="1"
      :value="digits[index] || ''"
      @input="handleInput($event, index)"
      @keydown="handleKeyDown($event, index)"
      @paste="handlePaste"
      class="w-14 h-14 text-center text-2xl font-bold rounded-xl border border-gray-300 bg-white text-primary-dark transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary-light focus:scale-105"
      placeholder="-"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  length: {
    type: Number,
    default: 4
  }
})

const emit = defineEmits(['update:modelValue'])

const digits = ref(Array(props.length).fill(''))
const inputRefs = ref([])

// همگام‌سازی بیرونی به درونی (اگر خارج از کامپوننت مقدار ریست شود)
watch(
  () => props.modelValue,
  (newVal) => {
    const val = String(newVal || '').slice(0, props.length)
    for (let i = 0; i < props.length; i++) {
      digits.value[i] = val[i] || ''
    }
  },
  { immediate: true }
)

// فوکوس خودکار روی خانه اول هنگام لود کامپوننت
onMounted(() => {
  if (inputRefs.value[0]) {
    inputRefs.value[0].focus()
  }
})

const emitValue = () => {
  const code = digits.value.join('')
  emit('update:modelValue', code)
}

const handleInput = (event, index) => {
  const value = event.target.value
  // فقط اعداد مجاز هستند
  const numericValue = value.replace(/[^0-9]/g, '')

  digits.value[index] = numericValue.slice(-1)
  emitValue()

  // اگر کاربر تایپ کرد، برو فیلد بعدی
  if (numericValue && index < props.length - 1) {
    inputRefs.value[index + 1]?.focus()
  }
}

const handleKeyDown = (event, index) => {
  if (event.key === 'Backspace') {
    if (!digits.value[index] && index > 0) {
      // اگر خالی بود و backspace زد، برگرده فیلد قبلی و پاکش کنه
      digits.value[index - 1] = ''
      emitValue()
      inputRefs.value[index - 1]?.focus()
    } else {
      // فقط فیلد فعلی را پاک کنه
      digits.value[index] = ''
      emitValue()
    }
    event.preventDefault()
  } else if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  } else if (event.key === 'ArrowRight' && index < props.length - 1) {
    inputRefs.value[index + 1]?.focus()
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text')
  const numericData = pastedData.replace(/[^0-9]/g, '').slice(0, props.length)

  for (let i = 0; i < props.length; i++) {
    digits.value[i] = numericData[i] || ''
  }
  emitValue()

  // فوکوس روی آخرین خانه پر شده یا فیلد آخر
  const nextFocusIndex = Math.min(numericData.length, props.length - 1)
  inputRefs.value[nextFocusIndex]?.focus()
}
</script>
