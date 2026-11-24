
<template>
  <div
    class="mx-auto w-full max-w-4xl rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
    dir="rtl"
  >
    <!-- بخش کد تخفیف -->
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <p class="text-right text-sm font-medium text-gray-800">
        در صورت داشتن کد تخفیف آن را وارد کنید
      </p>

      <div class="flex w-full overflow-hidden rounded-full bg-gray-100/50 p-1 md:w-[320px]">
        <input
          v-model="discountCode"
          type="text"
          placeholder="کد تخفیف"
          class="flex-1 bg-transparent px-4 py-2 text-right text-sm outline-none"
        />

        <UiBaseButton
          label="اعمال کد"
          variant="filled"
          color="primary"
          class="!rounded-full px-6 py-2 text-sm font-bold h-full min-h-0"
          @click="applyDiscount"
          :disabled="true"
        />
      </div>
    </div>

    <!-- بخش سفر کارت -->
    <div
      v-if="canUseTravelCard"
      class="mb-6 flex flex-col gap-4"
    >
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <UiBaseCheckbox
          v-model="hasTravelCard"
          label="سفر کارت دارم"
        />

        <transition name="fade">
          <div
            v-if="hasTravelCard"
            class="flex w-full overflow-hidden rounded-full bg-gray-100/50 p-1 md:w-[320px]"
          >
            <input
              v-model="travelCardNumber"
              type="text"
              placeholder="شماره سفر کارت"
              class="flex-1 bg-transparent px-4 py-2 text-right text-sm outline-none"
              :disabled="travelCardLoading || loading"
              @input="clearError"
            />

            <UiBaseButton
              :label="travelCardLoading ? 'در حال بررسی...' : 'اعمال'"
              variant="filled"
              color="primary"
              class="!rounded-full px-6 py-2 text-sm font-bold h-auto min-h-0"
              :disabled="travelCardLoading || loading || !travelCardNumber.trim()"
              @click="applyTravelCard"
            />
          </div>
        </transition>
      </div>

      <!-- پیام خطای سفر کارت -->
      <transition name="fade">
        <p
          v-if="travelCardErrorMessage && hasTravelCard"
          class="text-right text-xs font-semibold text-red-500 mt-1 mr-2"
        >
          {{ travelCardErrorMessage }}
        </p>
      </transition>
    </div>

    <!-- اطلاعات سفر کارت -->
    <div
      v-if="canUseTravelCard && travelCardApplied"
      class="mb-6 rounded-2xl border border-green-100 bg-green-50/50 p-4 text-center"
    >
      <p class="text-sm font-bold text-green-600">
        سفر کارت با موفقیت اعمال شد
      </p>

      <p
        v-if="travelCardOwnerName"
        class="mt-1 text-sm text-green-600"
      >
        دارنده کارت: {{ travelCardOwnerName }}
      </p>

      <p class="mt-1 text-sm text-green-600">
        اعتبار سفر کارت:
        <span class="font-bold">
          {{ formatPrice(travelCardCredit) }}
        </span>
        ریال
      </p>
    </div>

    <!-- هشدار -->
    <p class="mb-4 text-right text-xs font-bold text-primary">
      لطفا توجه داشته باشید در صورت تایید اطلاعات، امکان اصلاح وجود ندارد!
    </p>

    <!-- قوانین -->
    <div class="mb-8 flex justify-start">
      <UiBaseCheckbox
        v-model="acceptRules"
        :label="rulesLabel"
      />
    </div>

    <!-- فوتر -->
    <div class="flex flex-col gap-5 border-t border-gray-100 pt-6">

      <!-- قیمت -->
      <div class="flex w-full flex-col items-center text-center md:items-end md:text-right">

        <div
          v-if="
            canUseTravelCard &&
            travelCardApplied &&
            Number(originalPrice) !== Number(displayPrice)
          "
          class="mb-1 flex items-center gap-1 text-right text-sm text-gray-500 line-through"
        >
          <span>{{ formatPrice(originalPrice) }}</span>
          <span>ریال</span>
        </div>

        <div class="mb-1 flex items-center gap-1 text-right text-2xl font-black text-primary">
          <span class="text-[25px]!">
            {{ formatPrice(displayPrice) }}
          </span>

          <span class="text-[20px]! font-medium">
            ریال
          </span>
        </div>

        <div
          v-if="
            canUseTravelCard &&
            travelCardApplied &&
            Number(travelCardCredit) > 0
          "
          class="text-xs text-green-600"
        >
          مبلغ کسر شده از سفر کارت:
          {{ formatPrice(deductedAmount) }}
          ریال
        </div>
      </div>

      <!-- دکمه‌ها -->
      <div class="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">

        <UiBaseButton
          label="بازگشت به مرحله قبل"
          variant="filled"
          color="primary"
          class="h-[52px] w-full !rounded-full px-8 text-sm font-bold md:w-auto"
          :disabled="loading || travelCardLoading"
          @click="$emit('back')"
        />

        <UiBaseButton
          :label="submitLabel"
          variant="filled"
          color="primary"
          :disabled="!acceptRules || loading || travelCardLoading"
          class="h-[52px] w-full !rounded-full px-8 text-sm font-bold md:w-auto"
          @click="handlePayment"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  originalPrice: { type: [Number, String], default: 0 },
  finalPrice: { type: [Number, String], default: 0 },
  loading: { type: Boolean, default: false },
  submitLabel: { type: String, default: 'تایید و پرداخت' },
  rulesLabel: {
    type: String,
    default: 'قوانین و مقررات را مطالعه کرده و می‌پذیرم'
  },

  travelCardCredit: { type: [Number, String], default: 0 },
  travelCardLoading: { type: Boolean, default: false },
  travelCardApplied: { type: Boolean, default: false },
  travelCardOwnerName: { type: String, default: '' },
  travelCardErrorMessage: { type: String, default: '' }
})

const emit = defineEmits([
  'apply-discount',
  'apply-travel-card',
  'clear-travel-card-error',
  'reset-travel-card',
  'submit',
  'back'
])

// دریافت اطلاعات کاربر از کوکی
const userCookie = useCookie('user_data')

const userData = computed(() => {
  try {
    const value = typeof userCookie.value === 'string'
      ? JSON.parse(userCookie.value)
      : userCookie.value

    return value?.data ?? value ?? null
  } catch {
    return null
  }
})

// سفر کارت فقط برای کاربر بدون اعتبار و بدون noLimit
const canUseTravelCard = computed(() => {
  const user = userData.value

  if (!user) return false

  return user.noLimit === false &&
    (user.credit === 0 || user.credit === '0')
})

const discountCode = ref('')
const hasTravelCard = ref(false)
const travelCardNumber = ref('')
const acceptRules = ref(false)

const formatPrice = (value) =>
  new Intl.NumberFormat('fa-IR').format(Number(value || 0))

// مبلغ قابل نمایش
const displayPrice = computed(() => {
  if (canUseTravelCard.value && props.travelCardApplied) {
    return Number(props.finalPrice || 0)
  }

  return Number(props.originalPrice || 0)
})

// مبلغ کسر شده از سفر کارت
const deductedAmount = computed(() => {
  if (!canUseTravelCard.value || !props.travelCardApplied) {
    return 0
  }

  return Math.max(
    Number(props.originalPrice || 0) - displayPrice.value,
    0
  )
})

const clearError = () => {
  emit('clear-travel-card-error')
}

// حذف سفر کارت هنگام برداشتن تیک
watch(hasTravelCard, (newValue) => {
  if (!newValue) {
    travelCardNumber.value = ''
    emit('reset-travel-card')
  }
})

// حذف سفر کارت در صورت تغییر وضعیت حساب
watch(canUseTravelCard, (allowed) => {
  if (!allowed) {
    const wasSelected = hasTravelCard.value

    hasTravelCard.value = false
    travelCardNumber.value = ''

    if (!wasSelected) {
      emit('reset-travel-card')
    }
  }
}, { immediate: true })

const applyDiscount = () => {
  emit('apply-discount', discountCode.value.trim())
}

// اعمال سفر کارت
const applyTravelCard = () => {
  if (
    !canUseTravelCard.value ||
    !hasTravelCard.value ||
    props.loading ||
    props.travelCardLoading ||
    !travelCardNumber.value.trim()
  ) return

  emit('apply-travel-card', travelCardNumber.value.trim())
}

// تایید و پرداخت
const handlePayment = () => {
  if (
    !acceptRules.value ||
    props.loading ||
    props.travelCardLoading
  ) return

  emit('submit', {
    discountCode: discountCode.value.trim(),

    hasTravelCard:
      canUseTravelCard.value && hasTravelCard.value,

    travelCardNumber:
      canUseTravelCard.value && hasTravelCard.value
        ? travelCardNumber.value.trim()
        : ''
  })
}
</script>
