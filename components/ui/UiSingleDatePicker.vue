<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

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
  isMobileCalendar.value = mobileMediaQuery.matches
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
const date = ref(props.modelValue || '')
const showPicker = ref(false)
const styles = {
  'primary-color': 'var(--color-primary)',
  'secondary-color': 'var(--color-primary)',
  'in-range-background': 'var(--color-primary-light)'
}
const disablePastDates = value => {
  const selected = new Date(value)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  selected.setHours(0, 0, 0, 0)
  return selected < today
}
const getDates = value => !value ? [] : (Array.isArray(value) ? value : String(value).split(','))
  .map(item => String(item || '').trim()).filter(Boolean)
const normalizeValue = value => props.single ? (getDates(value)[0] || '') : (value || '')
const toPersianDigits = value => String(value || '').replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)])
function toJalaliDate(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  const parts = raw.replace(/-/g, '/').split('/')
  if (parts.length !== 3) return toPersianDigits(raw)
  const [year, month, day] = parts.map(Number)
  if (year < 1700) return toPersianDigits(`${String(year).padStart(4, '0')}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`)
  const dateValue = new Date(year, month - 1, day, 12)
  if (Number.isNaN(dateValue.getTime())) return toPersianDigits(raw)
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(dateValue)
}
const displayValue = computed(() => {
  const [from, to] = getDates(date.value)
  if (props.single) return from ? toJalaliDate(from) : ''
  if (from && to) return `از ${toJalaliDate(from)} تا ${toJalaliDate(to)}`
  return from ? `از ${toJalaliDate(from)}` : ''
})
function openPicker() { showPicker.value = true }
function clearDate(event) { event?.stopPropagation(); date.value = ''; showPicker.value = false }
watch(() => props.modelValue, value => {
  const normalized = normalizeValue(value)
  if (JSON.stringify(date.value) !== JSON.stringify(normalized)) date.value = normalized
}, { deep: true })
watch(date, value => {
  const result = normalizeValue(value)
  if (JSON.stringify(result) !== JSON.stringify(value)) {
    date.value = result
    return
  }
  if (JSON.stringify(result) !== JSON.stringify(props.modelValue)) {
    emit('update:modelValue', result)
    emit('change', result)
  }
  const dates = getDates(result)
  if (props.single ? !!dates[0] : !!(dates[0] && dates[1])) showPicker.value = false
}, { deep: true })
watch(() => props.single, () => { date.value = normalizeValue(date.value) })
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
          v-if="date" type="button"
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
        :min="minDate || undefined"
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
