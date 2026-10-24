
<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useCookie } from '#app'

const route = useRoute()

const isHotelBooking = computed(() =>
  route.path.startsWith('/hotels')
)

const emit = defineEmits(['submit'])

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const contactDescription = computed(() =>
  isHotelBooking.value
    ? 'لطفا توجه داشته باشید که لینک دانلود واچر به این اطلاعات تماس ارسال خواهد شد.'
    : 'لطفا توجه داشته باشید که لینک دانلود بلیط به این اطلاعات تماس ارسال خواهد شد.'
)

// اطلاعات فرم
const phone = ref('')
const email = ref('')

const phoneEdited = ref(false)

const errors = ref({
  phone: '',
  email: ''
})

// دریافت اطلاعات کاربر از کوکی
const userCookie = useCookie('user_data', {
  default: () => null
})

// تبدیل اعداد فارسی و عربی به انگلیسی
function toEnglishDigits(value) {
  return String(value ?? '')
    .replace(/[۰-۹]/g, digit =>
      String(digit.charCodeAt(0) - 1776)
    )
    .replace(/[٠-٩]/g, digit =>
      String(digit.charCodeAt(0) - 1632)
    )
}

// استخراج شماره موبایل از کوکی
function getMobileFromCookie(cookieValue) {
  if (!cookieValue) return ''

  try {
    let user = cookieValue

    if (typeof user === 'string') {
      user = JSON.parse(user)
    }

    // پشتیبانی از ساختار مستقیم یا data
    const mobile =
      user?.mobile ??
      user?.data?.mobile ??
      ''

    return toEnglishDigits(mobile)
      .trim()
      .replace(/\s+/g, '')
  } catch (error) {
    console.warn('Error parsing user_data cookie:', error)
    return ''
  }
}

// اعتبارسنجی شماره موبایل
function isValidPhone(value) {
  const normalized = toEnglishDigits(value)
    .trim()
    .replace(/\s+/g, '')

  return /^09\d{9}$/.test(normalized)
}

// اعتبارسنجی ایمیل
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(value ?? '').trim()
  )
}

// پر کردن خودکار شماره موبایل از کوکی
watch(
  userCookie,
  (value) => {
    if (phoneEdited.value) return

    const mobile = getMobileFromCookie(value)

    if (isValidPhone(mobile)) {
      phone.value = mobile
      errors.value.phone = ''
    }
  },
  {
    immediate: true
  }
)

// تغییر شماره موبایل توسط کاربر
function onPhoneChange(value) {
  phoneEdited.value = true

  const rawValue =
    value?.target?.value ??
    value?.value ??
    value ??
    ''

  phone.value = toEnglishDigits(rawValue)
    .replace(/[^\d]/g, '')
    .slice(0, 11)

  errors.value.phone = ''
}

// تغییر ایمیل
function onEmailChange(value) {
  const rawValue =
    value?.target?.value ??
    value?.value ??
    value ??
    ''

  email.value = String(rawValue)
  errors.value.email = ''
}

// اعتبارسنجی کل فرم
function validateAll() {
  const nextErrors = {
    phone: '',
    email: ''
  }

  if (!String(phone.value ?? '').trim()) {
    nextErrors.phone = 'شماره موبایل الزامی است'
  } else if (!isValidPhone(phone.value)) {
    nextErrors.phone = 'شماره موبایل معتبر نیست'
  }

  if (!String(email.value ?? '').trim()) {
    nextErrors.email = 'ایمیل الزامی است'
  } else if (!isValidEmail(email.value)) {
    nextErrors.email = 'ایمیل معتبر نیست'
  }

  errors.value = nextErrors

  return !nextErrors.phone && !nextErrors.email
}

// دریافت اطلاعات برای کامپوننت والد
function getData() {
  return {
    phone: toEnglishDigits(phone.value).trim(),
    email: String(email.value ?? '').trim()
  }
}

// ارسال فرم
function onSubmit() {
  emit('submit')
}

defineExpose({
  validateAll,
  getData
})
</script>

<template>
  <section
    dir="rtl"
    class="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm"
  >
    <div class="mb-6">
      <h2 class="text-lg font-bold text-gray-800">
        اطلاعات تماس
      </h2>

      <div class="mt-3 flex items-start gap-2 text-sm text-gray-600">
        <i
          class="bi bi-info-circle mt-0.5 text-lg text-gray-800"
        ></i>

        <p>
          {{ contactDescription }}
        </p>
      </div>
    </div>

    <div
      class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_auto] lg:gap-4"
    >
      <!-- شماره موبایل -->
      <UiBaseInput
        :model-value="phone"
        label="شماره موبایل"
        placeholder="شماره موبایل"
        :rtl="true"
        :error="errors.phone"
        @update:model-value="onPhoneChange"
      />

      <!-- ایمیل -->
      <UiBaseInput
        :model-value="email"
        label="ایمیل"
        placeholder="ایمیل"
        :rtl="true"
        :error="errors.email"
        @update:model-value="onEmailChange"
      />

      <!-- دکمه ادامه -->
      <div class="w-full lg:w-auto lg:pt-[3px]">
        <UiBaseButton
          :label="
            props.loading
              ? 'در حال دریافت قیمت نهایی...'
              : 'ادامه فرایند خرید'
          "
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
