<script setup>

import { ref } from 'vue'

const emit = defineEmits(['submit'])

const phone = ref('')
const email = ref('')

const errors = ref({
  phone: '',
  email: '',
})
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
function toEnglishDigits(str) {
  return String(str || '')
    .replace(/۰/g, '0')
    .replace(/۱/g, '1')
    .replace(/۲/g, '2')
    .replace(/۳/g, '3')
    .replace(/۴/g, '4')
    .replace(/۵/g, '5')
    .replace(/۶/g, '6')
    .replace(/۷/g, '7')
    .replace(/۸/g, '8')
    .replace(/۹/g, '9')
}

function isValidPhone(value) {
  const v = toEnglishDigits(String(value || '').trim()).replace(/\s+/g, '')
  return /^09\d{9}$/.test(v)
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

function validateAll() {
  const nextErrors = {
    phone: '',
    email: '',
  }

  if (!String(phone.value || '').trim()) {
    nextErrors.phone = 'شماره موبایل الزامی است'
  } else if (!isValidPhone(phone.value)) {
    nextErrors.phone = 'شماره موبایل معتبر نیست'
  }

  if (!String(email.value || '').trim()) {
    nextErrors.email = 'ایمیل الزامی است'
  } else if (!isValidEmail(email.value)) {
    nextErrors.email = 'ایمیل معتبر نیست'
  }

  errors.value = nextErrors

  return !nextErrors.phone && !nextErrors.email
}

function getData() {
  return {
    phone: toEnglishDigits(phone.value).trim(),
    email: String(email.value || '').trim(),
  }
}

function clearFieldError(field) {
  errors.value[field] = ''
}

function onSubmit() {
  emit('submit')
}

defineExpose({
  validateAll,
  getData,
})
</script>

<template>
  <section dir="rtl" class="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
    <div class="mb-6">
      <h2 class="text-lg font-bold text-gray-800">اطلاعات تماس</h2>

      <div class="mt-3 flex items-start gap-2 text-sm text-gray-600">
        <i class="bi bi-info-circle mt-0.5 text-lg text-gray-800"></i>
        <p>لطفا توجه داشته باشید که لینک دانلود بلیط به این اطلاعات تماس ارسال خواهد شد.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_auto] lg:gap-4">
      <UiBaseInput
        :model-value="phone"
        label="شماره موبایل"
        placeholder="شماره موبایل"
        :rtl="true"
        :error="errors.phone"
        @update:model-value="phone = $event; clearFieldError('phone')"
      />

      <UiBaseInput
        :model-value="email"
        label="ایمیل"
        placeholder="ایمیل"
        :rtl="true"
        :error="errors.email"
        @update:model-value="email = $event; clearFieldError('email')"
      />

      <div class="w-full lg:w-auto lg:pt-[3px]">
        <UiBaseButton
  :label="props.loading ? 'در حال دریافت قیمت نهایی...' : 'ادامه فرایند خرید'"
  variant="solid"
  color="primary"
  :disabled="props.loading"
  class="h-12 w-full px-8 text-sm font-bold !rounded-3xl whitespace-nowrap lg:w-auto"
  @click="onSubmit"
/>
      </div>
    </div>
  </section>
</template>
