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
   <div class="mb-6 flex flex-col gap-4">
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
          @input="clearError"
        />
        <UiBaseButton
          :label="travelCardLoading ? 'در حال بررسی...' : 'اعمال'"
          variant="filled"
          color="primary"
          class="!rounded-full px-6 py-2 text-sm font-bold h-auto min-h-0"
          :disabled="travelCardLoading || !travelCardNumber.trim()"
          @click="applyTravelCard"
        />
      </div>
    </transition>
  </div>

  <!-- نمایش پیغام خطای نامعتبر بودن کارت -->
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
      v-if="travelCardApplied"
      class="mb-6 rounded-2xl border border-green-100 bg-green-50/50 p-4 text-right"
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
        <span class="font-bold">{{ formatPrice(travelCardCredit) }}</span>
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
    <div class="flex flex-col gap-4 border-t border-gray-100 pt-6 md:flex-row md:items-end md:justify-between">
      <UiBaseButton
        label="بازگشت به مرحله قبل"
        variant="filled"
        color="primary"
        class="h-[52px] !rounded-full px-8 text-sm font-bold"
        @click="$emit('back')"
      />

      <div class="flex flex-col items-end">
        <div
          v-if="travelCardApplied && Number(originalPrice) !== Number(finalPrice)"
          class="mb-1 flex items-center gap-1 text-right text-sm text-gray-500 line-through"
        >
          <span>{{ formatPrice(originalPrice) }}</span>
          <span>ریال</span>
        </div>

        <div class="mb-1 flex items-center gap-1 text-right text-2xl font-black text-primary">
          <span>{{ formatPrice(finalPrice) }}</span>
          <span class="text-sm font-medium">ریال</span>
        </div>

        <div
          v-if="travelCardApplied && travelCardCredit > 0"
          class="mb-3 text-xs text-green-600"
        >
          مبلغ کسر شده از سفر کارت:
          {{ formatPrice(deductedAmount) }}
          ریال
        </div>

        <UiBaseButton
          :label="submitLabel"
          variant="filled"
          color="primary"
          :disabled="!acceptRules || loading"
          class="h-[52px] !rounded-full px-8 text-sm font-bold"
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
  rulesLabel: { type: String, default: 'قوانین و مقررات را مطالعه کرده و می‌پذیرم' },

  travelCardCredit: { type: [Number, String], default: 0 },
  travelCardLoading: { type: Boolean, default: false },
  travelCardApplied: { type: Boolean, default: false },
  travelCardOwnerName: { type: String, default: '' },
  travelCardErrorMessage: { type: String, default: '' } // اضافه شدن پراپ خطا
})

const emit = defineEmits(['apply-discount', 'apply-travel-card', 'clear-travel-card-error', 'submit', 'back'])

// وقتی شماره کارت را ویرایش کرد، خطا را پاک کند تا پیام خطا ریست شود
const clearError = () => {
  emit('clear-travel-card-error')
}

const discountCode = ref('')
const hasTravelCard = ref(false)
const travelCardNumber = ref('')
const acceptRules = ref(false)

const formatPrice = (value) => new Intl.NumberFormat('fa-IR').format(Number(value || 0))

const deductedAmount = computed(() => {
  const original = Number(props.originalPrice || 0)
  const final = Number(props.finalPrice || 0)
  return Math.max(original - final, 0)
})

watch(hasTravelCard, (newValue) => {
  if (!newValue) {
    travelCardNumber.value = ''
  }
})

const applyDiscount = () => emit('apply-discount', discountCode.value.trim())

const applyTravelCard = () => {
  if (!travelCardNumber.value.trim()) return
  emit('apply-travel-card', travelCardNumber.value.trim())
}

const handlePayment = () => {
  if (!acceptRules.value) return

  emit('submit', {
    discountCode: discountCode.value.trim(),
    hasTravelCard: hasTravelCard.value,
    travelCardNumber: travelCardNumber.value.trim()
  })
}
watch(hasTravelCard, (newValue) => {
  if (!newValue) {
    travelCardNumber.value = ''
    // وقتی تیک برداشته می‌شود، به والد اطلاع می‌دهیم که تخفیف سفر کارت را حذف کند
    emit('reset-travel-card')
  }
})
</script>
