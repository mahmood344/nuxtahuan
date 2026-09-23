<script setup>
import {
  computed,
  ref,
  watch
} from 'vue'

import { useRoute } from 'vue-router'

const route = useRoute()

/*
 * فقط صفحه Home اندازه قدیمی داشته باشد.
 * سایر صفحات حالت Compact می‌گیرند.
 */
const isHomePage = computed(() =>
  route.path === '/' ||
  route.path === '/home'
)

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: ''
  },

  label: {
    type: String,
    default: 'تاریخ'
  },

  placeholder: {
    type: String,
    default: 'انتخاب تاریخ'
  },

  minDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'update:modelValue',
  'change'
])

const date = ref(
  props.modelValue || ''
)

const showPicker = ref(false)

const styles = {
  'primary-color': 'var(--color-primary)',
  'secondary-color': 'var(--color-primary)',
  'in-range-background': 'var(--color-primary-light)'
}


/* -----------------------
باز کردن تقویم
----------------------- */
const openPicker = () => {
  showPicker.value = true
}


/* -----------------------
پاک کردن تاریخ
----------------------- */
const clearDate = (event) => {

  event?.stopPropagation()

  date.value = ''

  showPicker.value = false
}


/* -----------------------
تبدیل مقدار تاریخ به Array
----------------------- */
const getDates = (value) => {

  if (!value)
    return []

  if (Array.isArray(value)) {

    return value
      .map(item =>
        String(item || '').trim()
      )
      .filter(Boolean)
  }

  return String(value)
    .split(',')
    .map(item =>
      item.trim()
    )
    .filter(Boolean)
}


/* -----------------------
تبدیل اعداد به فارسی
----------------------- */
const toPersianDigits = value =>

  String(value || '').replace(
    /\d/g,
    digit =>
      '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]
  )


/* -----------------------
تبدیل تاریخ به شمسی
----------------------- */
const toJalaliDate = value => {

  const raw =
    String(value || '').trim()

  if (!raw)
    return ''

  const normalized =
    raw.replace(/-/g, '/')

  const parts =
    normalized.split('/')

  if (parts.length !== 3)
    return toPersianDigits(raw)

  const year =
    Number(parts[0])

  const month =
    Number(parts[1])

  const day =
    Number(parts[2])


  /*
   * اگر از قبل شمسی باشد
   */
  if (year < 1700) {

    return toPersianDigits(
      `${String(year).padStart(4, '0')}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`
    )
  }


  /*
   * اگر میلادی باشد
   */
  const dateValue = new Date(
    year,
    month - 1,
    day,
    12,
    0,
    0
  )

  if (
    Number.isNaN(
      dateValue.getTime()
    )
  ) {

    return toPersianDigits(raw)
  }

  return new Intl.DateTimeFormat(
    'fa-IR-u-ca-persian',
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }
  ).format(dateValue)
}


/* -----------------------
مقدار نمایشی داخل Input
----------------------- */
const displayValue = computed(() => {

  const dates =
    getDates(date.value)

  const from =
    String(
      dates[0] || ''
    ).trim()

  const to =
    String(
      dates[1] || ''
    ).trim()


  if (
    from &&
    to
  ) {

    return (
      `از ${toJalaliDate(from)} تا ${toJalaliDate(to)}`
    )
  }


  if (from) {

    return (
      `از ${toJalaliDate(from)}`
    )
  }


  return ''
})


/* -----------------------
Sync از Parent
----------------------- */
watch(
  () => props.modelValue,

  value => {

    date.value =
      value || ''
  },

  {
    deep: true
  }
)


/* -----------------------
Emit تاریخ
----------------------- */
watch(
  date,

  value => {

    const result =
      value || ''

    emit(
      'update:modelValue',
      result
    )

    emit(
      'change',
      result
    )


    const dates =
      getDates(result)


    /*
     * وقتی ورود و خروج
     * هر دو انتخاب شدند،
     * تقویم بسته شود.
     */
    if (
      dates[0] &&
      dates[1]
    ) {

      showPicker.value = false
    }
  },

  {
    deep: true
  }
)
</script>


<template>

  <div
    dir="rtl"
    class="flex w-full justify-center"
  >

    <!--
      Home:
      اندازه قدیمی

      سایر صفحات:
      max-width: 280px
    -->
    <div
      class="relative w-full"
      :class="
        isHomePage
          ? ''
          : 'max-w-[280px]'
      "
    >

      <div
        class="relative cursor-pointer"
        @click="openPicker"
      >

        <UiBaseInput
          :model-value="displayValue"
          :label="label"
          :placeholder="placeholder"
          readonly
          icon='<i class="bi bi-calendar3"></i>'
          icon-position="right"
          input-class="cursor-pointer"
          class="!mb-0 w-full"
          :class="{
            'compact-date-input': !isHomePage
          }"
        />


        <!-- دکمه پاک کردن -->
        <button
          v-if="date"
          type="button"
          class="
            absolute
            top-1/2
            z-30
            -translate-y-1/2
            text-[var(--color-gray-400)]
            transition-colors
            hover:text-[var(--color-red-500)]
          "
          :class="
            isHomePage
              ? 'left-10'
              : 'left-8 text-[12px]'
          "
          @click.stop="clearDate"
        >

          <i class="bi bi-x-lg"></i>

        </button>

      </div>


      <!-- DatePicker -->
      <PersianDatePicker
        v-model="date"
        mode="range"
        class="hidden"
        :styles="styles"
        :show="showPicker"
        :auto-submit="false"
        format="YYYY/MM/DD"
        locale="fa,en"
        :min="minDate || undefined"
        @close="showPicker = false"
      >

        <template #icon></template>

        <template #footer>
          {{ label }}
        </template>

      </PersianDatePicker>

    </div>

  </div>

</template>


<style scoped>

/*
 * فقط خارج از Home اعمال می‌شود
 */
:deep(.compact-date-input input) {

  height: 44px !important;

  min-height: 44px !important;

  font-size: 10px !important;
}


/*
 * اگر UiBaseInput یک Wrapper داخلی
 * با ارتفاع ثابت داشته باشد
 */
:deep(.compact-date-input > div) {

  min-height: 44px !important;
}
:deep(.compact-date-input label) {
  font-size: 10px !important;
}
</style>