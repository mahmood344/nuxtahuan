<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { toGregorian, toJalaali, isValidJalaaliDate } from 'jalaali-js'

const route = useRoute()
const isHomePage = computed(() => route.path === '/' || route.path === '/home')
const isMobileCalendar = ref(false)
let mobileMediaQuery = null

function syncCalendarMode(event) {
  if (typeof window === 'undefined') return
  isMobileCalendar.value = event?.matches ?? window.innerWidth < 768
}
onMounted(() => {
  mobileMediaQuery = window.matchMedia('(max-width: 767px)')
  syncCalendarMode(mobileMediaQuery)
  if (mobileMediaQuery.addEventListener) mobileMediaQuery.addEventListener('change', syncCalendarMode)
  else mobileMediaQuery.addListener?.(syncCalendarMode)
})
onBeforeUnmount(() => {
  if (!mobileMediaQuery) return
  if (mobileMediaQuery.removeEventListener) mobileMediaQuery.removeEventListener('change', syncCalendarMode)
  else mobileMediaQuery.removeListener?.(syncCalendarMode)
})

const props = defineProps({
  modelValue: { type: [String, Array], default: '' },
  label: { type: String, default: 'تاریخ' },
  placeholder: { type: String, default: 'انتخاب تاریخ' },
  minDate: { type: String, default: '' },
  single: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'change'])
const showPicker = ref(false)
const styles = {
  'primary-color': 'var(--color-primary)',
  'secondary-color': 'var(--color-primary)',
  'in-range-background': 'var(--color-primary-light)'
}

function latinDigits(value) {
  return String(value ?? '')
    .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
}
function normalizeOneDate(value) {
  const raw = latinDigits(value).trim()
  if (!raw) return ''
  const match = raw.match(/^(\d{4})[/-]?(\d{2})[/-]?(\d{2})$/)
  if (!match) return raw
  let year = Number(match[1]), month = Number(match[2]), day = Number(match[3])
  // For backwards-compatible input: a Jalali date becomes Gregorian internally.
  if (year >= 1300 && year < 1500) {
    if (!isValidJalaaliDate(year, month, day)) return raw
    const g = toGregorian(year, month, day)
    year = g.gy; month = g.gm; day = g.gd
  }
  const check = new Date(Date.UTC(year, month - 1, day))
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return raw
  return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`
}
function getDates(value) {
  const list = Array.isArray(value) ? value : String(value || '').split(',')
  return list.map(normalizeOneDate).filter(Boolean)
}
function normalizeValue(value) {
  const dates = getDates(value)
  return props.single ? (dates[0] || '') : dates.join(',')
}

const date = ref(normalizeValue(props.modelValue))
const toPersianDigits = value => String(value || '').replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])
function displayJalali(value) {
  const normalized = normalizeOneDate(value)
  const parts = normalized.match(/^(\d{4})\/(\d{2})\/(\d{2})$/)
  if (!parts) return toPersianDigits(normalized)
  const year = +parts[1], month = +parts[2], day = +parts[3]
  if (year < 1700) return toPersianDigits(normalized)
  const j = toJalaali(year, month, day)
  return toPersianDigits(`${j.jy}/${String(j.jm).padStart(2, '0')}/${String(j.jd).padStart(2, '0')}`)
}
const displayValue = computed(() => {
  const [from, to] = getDates(props.modelValue)
  if (props.single) return from ? displayJalali(from) : ''
  if (from && to) return `از ${displayJalali(from)} تا ${displayJalali(to)}`
  return from ? `از ${displayJalali(from)}` : ''
})
function disablePastDates(value) {
  const normalized = normalizeOneDate(value)
  const match = normalized.match(/^(\d{4})\/(\d{2})\/(\d{2})$/)
  if (!match) return false
  const selected = Date.UTC(+match[1], +match[2] - 1, +match[3])
  const today = new Date()
  const midnight = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  return selected < midnight
}
function openPicker() {
  date.value = normalizeValue(props.modelValue)
  showPicker.value = true
}
function clearDate(event) {
  event?.stopPropagation()
  showPicker.value = false
  date.value = ''
  emit('update:modelValue', '')
  emit('change', '')
}
// Parent/URL updates should not echo back as user selections.
watch(() => props.modelValue, value => {
  const normalized = normalizeValue(value)
  if (date.value !== normalized) date.value = normalized
}, { deep: true, flush: 'sync' })

// Only a selection while the popup is open is sent to the parent.
watch(date, value => {
  if (!showPicker.value) return
  const normalized = normalizeValue(value)
  if (normalized !== normalizeValue(props.modelValue)) {
    emit('update:modelValue', normalized)
    emit('change', normalized)
  }
  const dates = getDates(normalized)
  if (props.single ? !!dates[0] : !!(dates[0] && dates[1])) showPicker.value = false
}, { flush: 'sync' })
watch(() => props.single, () => { date.value = normalizeValue(props.modelValue) })
defineExpose({ openPicker })
</script>

<template>
  <div dir="rtl" class="flex w-full justify-center">
    <div class="relative w-full" :class="isHomePage ? '' : 'max-w-[280px]'">
      <div class="relative cursor-pointer" @click="openPicker">
        <UiBaseInput
          :model-value="displayValue"
          :label="label"
          :placeholder="placeholder"
          readonly
          icon='<i class="bi bi-calendar3"></i>'
          icon-position="right"
          input-class="cursor-pointer"
          class="!mb-0 w-full"
          :class="{ 'compact-date-input': !isHomePage }"
        />
        <button
          v-if="normalizeValue(props.modelValue)" type="button"
          class="absolute top-1/2 z-30 -translate-y-1/2 text-[var(--color-gray-400)] transition-colors hover:text-[var(--color-red-500)]"
          :class="isHomePage ? 'left-10' : 'left-8 text-[12px]'"
          @click.stop="clearDate"
        ><i class="bi bi-x-lg"></i></button>
      </div>
      <PersianDatePicker
        v-model="date"
        :mode="single ? 'single' : 'range'"
        class="hidden"
        :styles="styles"
        :show="showPicker"
        :modal="isMobileCalendar"
        :auto-submit="true"
        format="YYYY/MM/DD"
        :disable="disablePastDates"
        locale="fa,en"
        :min="minDate ? normalizeOneDate(minDate) : undefined"
        @close="showPicker = false"
      >
        <template #icon></template>
        <template #footer>{{ label }}</template>
      </PersianDatePicker>
    </div>
  </div>
</template>

<style scoped>
:deep(.compact-date-input input) { height: 44px !important; min-height: 44px !important; font-size: 11px !important; font-weight: bold; }
:deep(.compact-date-input > div) { min-height: 44px !important; }
:deep(.compact-date-input label) { font-size: 10px !important; }
</style>
