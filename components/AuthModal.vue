<!-- components/auth/AuthModal.vue -->
<template>
  <div
    v-if="flightStore.isAuthModalOpen"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm rtl"
    dir="rtl"
  >
    <Transition
      appear
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-10 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-10 scale-95"
    >
      <div
        class="relative overflow-hidden w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl border border-gray-100"
      >
        <!-- دایره‌های تزیینی با رنگ‌های سازمانی برند -->
        <div class="absolute -right-5 -bottom-1 h-[50px] w-[50px] bg-primary-light rounded-full opacity-60"></div>
        <div class="absolute right-40 -bottom-7 h-[50px] w-[150px] bg-primary-light rounded-full opacity-40"></div>
        <div class="absolute -left-5 top-0 h-[50px] w-[50px] bg-secondary/20 rounded-full"></div>

        <!-- دکمه بستن -->
        <button
          type="button"
          @click="handleClose"
          class="absolute right-4 top-4 text-3xl leading-none text-primary hover:text-primary-dark transition-colors duration-200"
        >
          ×
        </button>

        <!-- هدر با فونت rokh -->
        <div class="mb-5 text-center">
          <h3 class="text-xl font-bold font-rokh text-primary-dark">
            {{ stepTitle }}
          </h3>

          <p class="mt-2 text-sm text-gray-500">
            {{ stepDescription }}
          </p>
        </div>

        <!-- مرحله 1: ورود شماره موبایل -->
        <div v-if="flightStore.authStep === 'mobile'" class="space-y-5">
          <UiBaseInput
            v-model="mobile"
            label="شماره موبایل"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            inputClass="!rounded-4xl text-center ltr font-bold tracking-widest focus:border-primary focus:ring-1 focus:ring-primary"
          />

          <UiBaseButton
            @click="handleCheckMobile"
            :loading="flightStore.authLoading"
            :disabled="flightStore.authLoading"
            label="مرحله بعدی"
            class="w-full !rounded-full !py-4 bg-primary hover:bg-primary-dark text-white font-bold"
            variant="filled"
          />
        </div>

        <!-- مرحله 2: ثبت‌نام -->
        <div v-else-if="flightStore.authStep === 'register'" class="space-y-4">
          <UiBaseInput
            v-model="regData.firstName"
            label="نام"
            placeholder="نام"
          />

          <UiBaseInput
            v-model="regData.lastName"
            label="نام خانوادگی"
            placeholder="نام خانوادگی"
          />

          <UiBaseInput
            v-model="regData.nationalCode"
            label="کد ملی"
            placeholder="کد ملی ۱۰ رقمی"
            inputClass="text-center ltr font-bold tracking-wider"
          />

          <UiBaseInput
            v-model="mobile"
            label="شماره موبایل"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            inputClass="text-center ltr font-bold tracking-widest"
          />

          <div class="text-center text-sm text-gray-600">
            قبلاً ثبت نام کرده‌اید؟
            <button
              type="button"
              class="font-semibold text-primary hover:text-primary-dark underline"
              @click="goToOtpDirectly"
            >
              وارد شوید
            </button>
          </div>

          <UiBaseButton
            @click="handleRegister"
            :loading="flightStore.authLoading"
            :disabled="flightStore.authLoading"
            label="ثبت‌نام و دریافت کد تأیید"
            class="w-full !rounded-full !py-4 bg-primary hover:bg-primary-dark text-white font-bold"
            variant="filled"
          />
        </div>

        <!-- مرحله 3: ورود کد تایید (۴ خانه مجزا در یک ردیف) -->
        <div v-else-if="flightStore.authStep === 'otp'" class="space-y-5">
          
          <div class="flex flex-row justify-center items-center gap-3 ltr py-2" dir="ltr">
            <div v-for="(digit, index) in otpLength" :key="index" class="w-14">
              <UiBaseInput
                :ref="(el) => { if (el) inputRefs[index] = el }"
                v-model="digits[index]"
                type="text"
                inputmode="numeric"
                maxlength="1"
                placeholder="-"
                class="!mb-0"
                inputClass="!h-14 !w-14 !p-0 text-center text-xl font-bold rounded-xl border border-gray-300 bg-white text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary-light transition-all duration-200"
                @input="handleOtpInput($event, index)"
                @keydown="handleOtpKeyDown($event, index)"
                @paste="handleOtpPaste"
              />
            </div>
          </div>

          <div class="rounded-xl bg-primary-light/50 border border-primary-light p-3 text-center text-sm text-gray-700">
            کد ارسال‌شده به شماره
            <span class="font-bold ltr inline-block text-primary-dark">
              {{ displayMobile }}
            </span>
            را وارد کنید.
          </div>

          <div class="flex gap-2">
            <UiBaseButton
              @click="handleVerifyOtp"
              :loading="flightStore.authLoading"
              :disabled="flightStore.authLoading || enteredOtpCode.length < otpLength"
              label="ورود"
              class="w-full !rounded-full !py-4 bg-primary hover:bg-primary-dark text-white font-bold"
              variant="filled"
            />

            <UiBaseButton
              @click="handleResendOtp"
              :loading="resendLoading"
              :disabled="resendLoading || flightStore.authLoading"
              label="ارسال مجدد"
              class="w-full !rounded-full !py-4 border border-primary text-primary hover:bg-primary-light font-bold"
              variant="outlined"
            />
          </div>

          <button
            type="button"
            class="w-full text-sm text-gray-500 hover:text-primary underline transition-colors"
            @click="backToMobileStep"
          >
            تغییر شماره موبایل
          </button>
        </div>

        <!-- پیام موفقیت با رنگ سبز بهینه شده -->
        <p
          v-if="flightStore.successMessage"
          class="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-center text-xs font-bold text-green-700 animate-pulse"
        >
          {{ flightStore.successMessage }}
        </p>

        <!-- پیام خطا با رنگ red تم پروژه -->
        <p
          v-if="flightStore.error"
          class="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-center text-xs font-bold text-red-500"
        >
          {{ flightStore.error }}
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useFlightStore } from '~/stores/flights'


const flightStore = useFlightStore()

const mobile = ref('')
const resendLoading = ref(false)

// مدیریت فیلد‌های ورودی کد تایید (OTP)
const otpLength = 4
const digits = ref(Array(otpLength).fill(''))
const inputRefs = ref([])

const enteredOtpCode = computed(() => {
  return digits.value.join('')
})

const regData = ref({
  firstName: '',
  lastName: '',
  nationalCode: ''
})

const userFullName = computed(() => {
  const firstName = flightStore.userData?.firstName || ''
  const lastName = flightStore.userData?.lastName || ''
  return `${firstName} ${lastName}`.trim()
})

const normalize = (value) => String(value || '').trim()

const displayMobile = computed(() => {
  return flightStore.mobile || normalize(mobile.value)
})

const stepTitle = computed(() => {
  if (flightStore.authStep === 'register') {
    return 'تکمیل ثبت‌نام'
  }
  if (flightStore.authStep === 'otp') {
    return 'ورود به حساب کاربری'
  }
  return 'ثبت نام / ورود به حساب کاربری'
})

const stepDescription = computed(() => {
  if (flightStore.authStep === 'register') {
    return 'برای این شماره موبایل حساب کاربری یافت نشد. لطفاً اطلاعات خود را تکمیل کنید.'
  }
  if (flightStore.authStep === 'otp') {
    return 'کد تأیید ارسال‌شده را وارد نمایید.'
  }
  return 'لطفاً شماره موبایل خود را وارد نمایید.'
})

// فوکوس روی فیلد ورودی اول کد تأیید
const focusInput = async (index) => {
  await nextTick()
  const comp = inputRefs.value[index]
  if (comp) {
    const el = comp.$el.querySelector('input')
    el?.focus()
    el?.select()
  }
}

watch(
  () => flightStore.isAuthModalOpen,
  async (isOpen) => {
    if (isOpen) {
      mobile.value = flightStore.mobile || ''
      digits.value = Array(otpLength).fill('')
      flightStore.error = ''
      flightStore.successMessage = ''
      if (flightStore.authStep === 'otp') {
        focusInput(0)
      }
    }
  }
)

watch(
  () => flightStore.authStep,
  (newStep) => {
    if (newStep === 'otp') {
      digits.value = Array(otpLength).fill('')
      focusInput(0)
    }
  }
)

watch(
  () => flightStore.mobile,
  (newMobile) => {
    if (newMobile) {
      mobile.value = newMobile
    }
  }
)

function validateMobile(value) {
  const normalized = normalize(value)
  if (!/^09\d{9}$/.test(normalized)) {
    flightStore.error = 'لطفاً شماره موبایل ۱۱ رقمی معتبر وارد کنید.'
    return false
  }
  return true
}

function resetMessages() {
  flightStore.error = ''
  flightStore.successMessage = ''
}

function handleClose() {
  resetLocalState()
  flightStore.closeModal()
}

function resetLocalState() {
  mobile.value = ''
  digits.value = Array(otpLength).fill('')
  regData.value = {
    firstName: '',
    lastName: '',
    nationalCode: ''
  }
  resendLoading.value = false
}

// هدایت مستقیم به مرحله OTP
function goToOtpDirectly() {
  resetMessages()
  if (!validateMobile(mobile.value)) return
  flightStore.mobile = normalize(mobile.value)
  flightStore.authStep = 'otp'
}

function backToMobileStep() {
  resetMessages()
  digits.value = Array(otpLength).fill('')
  flightStore.authStep = 'mobile'
}

async function handleCheckMobile() {
  resetMessages()
  const normalizedMobile = normalize(mobile.value)
  if (!validateMobile(normalizedMobile)) return
  await flightStore.checkMobile(normalizedMobile)
}

async function handleRegister() {
  resetMessages()
  const normalizedMobile = normalize(mobile.value)
  const firstName = normalize(regData.value.firstName)
  const lastName = normalize(regData.value.lastName)
  const nationalCode = normalize(regData.value.nationalCode)

  if (!validateMobile(normalizedMobile)) return

  if (!firstName || !lastName) {
    flightStore.error = 'لطفاً نام و نام خانوادگی را کامل وارد کنید.'
    return
  }

  await flightStore.register({
    mobile: normalizedMobile,
    firstName,
    lastName,
    nationalCode
  })
}

// توابع رویدادهای OTP برای جابجایی فوکوس
function handleOtpInput(event, index) {
  const value = event.target.value
  const numericValue = value.replace(/[^0-9]/g, '')

  digits.value[index] = numericValue.slice(-1)

  if (numericValue && index < otpLength - 1) {
    focusInput(index + 1)
  }
}

function handleOtpKeyDown(event, index) {
  if (event.key === 'Backspace') {
    if (!digits.value[index] && index > 0) {
      digits.value[index - 1] = ''
      focusInput(index - 1)
    } else {
      digits.value[index] = ''
    }
    event.preventDefault()
  } else if (event.key === 'ArrowLeft' && index > 0) {
    focusInput(index - 1)
  } else if (event.key === 'ArrowRight' && index < otpLength - 1) {
    focusInput(index + 1)
  }
}

function handleOtpPaste(event) {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text')
  const numericData = pastedData.replace(/[^0-9]/g, '').slice(0, otpLength)

  for (let i = 0; i < otpLength; i++) {
    digits.value[i] = numericData[i] || ''
  }

  const nextFocusIndex = Math.min(numericData.length, otpLength - 1)
  focusInput(nextFocusIndex)
}

async function handleVerifyOtp() {
  resetMessages()
  const code = normalize(enteredOtpCode.value)

  if (code.length < otpLength) {
    flightStore.error = 'کد تأیید را کامل وارد کنید.'
    return
  }

  const result = await flightStore.verifyOtp(code)
  if (!result?.success) return

  const name = normalize(userFullName.value) || 'کاربر'
  flightStore.successMessage = `${name} خوش آمدی`

  await nextTick()

  // تاخیر ۳ ثانیه‌ای جهت نمایش انیمیشن و پیام خوش‌آمدگویی به کاربر
  setTimeout(async () => {
    flightStore.closeModal()
    flightStore.successMessage = ''

    if (flightStore.pendingAction) {
      const action = flightStore.pendingAction
      flightStore.pendingAction = null
      await nextTick()
      action()
    }
  }, 3000)
}

async function handleResendOtp() {
  resetMessages()
  const normalizedMobile = flightStore.mobile || normalize(mobile.value)
  if (!validateMobile(normalizedMobile)) return

  try {
    resendLoading.value = true
    await flightStore.checkMobile(normalizedMobile)
    flightStore.authStep = 'otp'
    digits.value = Array(otpLength).fill('')
    focusInput(0)
    flightStore.successMessage = 'کد تأیید مجدداً ارسال شد.'
  } finally {
    resendLoading.value = false
  }
}
</script>
