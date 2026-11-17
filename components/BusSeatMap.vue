<template>
  <section class="w-full min-w-0 bg-white" dir="rtl">
    <div v-if="loading" class="py-10 text-center text-normal text-gray-500">در حال دریافت نقشه صندلی‌ها...</div>
    <div v-else-if="error" class="py-5 text-center text-normal text-red-600">{{ error }}</div>
    <div v-else-if="!data || !Array.isArray(data.seats)" class="py-6 text-center text-normal text-gray-500">نقشه صندلی‌ها در دسترس نیست.</div>
    <template v-else>
      <p v-if="isMock" class="mb-3 text-center text-small leading-6 text-amber-700">
        نمونه استاتیک نقشه صندلی‌ها ـ وضعیت رزرو واقعی نیست.
        <span v-if="serviceMismatch">کد سرویس نمونه با سرویس انتخاب‌شده تفاوت دارد.</span>
      </p>
      <div class="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-small text-gray-600">
        <span class="flex items-center gap-1.5"><i class="seat-key border border-blue-500 bg-blue-100"></i>انتخاب شما</span>
        <span class="flex items-center gap-1.5"><i class="seat-key border border-gray-300 bg-slate-50"></i>قابل انتخاب</span>
        <span class="flex items-center gap-1.5"><i class="seat-key bg-[#98a2ad]"></i>رزرو شده</span>
        <span class="flex items-center gap-1.5"><i class="seat-key seat-inactive"></i>غیرقابل انتخاب</span>
      </div>
      <div class="min-w-0 rounded-xl border-2 border-gray-200 bg-white p-2 sm:p-3">
        <!-- در موبایل کل نقشه به صورت افقی اسکرول می‌شود؛ هیچ صندلی جابه‌جا یا فشرده نمی‌شود -->
        <div class="w-full min-w-0 overflow-x-auto overscroll-x-contain" dir="ltr">
          <div class="flex w-max min-w-full items-stretch gap-2">
            <div class="flex w-[30px] shrink-0 items-center justify-center border-r border-gray-200 py-2">
              <span class="whitespace-nowrap text-small font-extrabold text-gray-700 [writing-mode:vertical-rl]">جلوی اتوبوس</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="seat-grid" :style="gridStyle" dir="ltr">
                <button
                  v-for="seat in validSeats"
                  :key="seat.no"
                  type="button"
                  class="seat-item flex items-center justify-center rounded-md border text-small font-bold transition-colors disabled:cursor-default"
                  :class="seatClass(seat)"
                  :style="seatStyle(seat)"
                  :disabled="!selectable || isMock || !isAvailable(seat)"
                  :title="seatTitle(seat)"
                  @click="selectSeat(seat)"
                >{{ isSold(seat) ? genderLabel(seat) : seat.no }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-if="selectable" class="mt-3 text-center text-small font-bold text-blue-700">
        صندلی‌های انتخاب‌شده: {{ modelValue.length }} از {{ maxSelectable }}
        <span v-if="modelValue.length"> — {{ modelValue.join('، ') }}</span>
      </p>
      <p v-if="selectionError" class="mt-2 text-center text-small font-bold text-red-600">{{ selectionError }}</p>
    </template>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  data: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  isMock: { type: Boolean, default: true },
  serviceMismatch: { type: Boolean, default: false },
  selectable: { type: Boolean, default: false },
  modelValue: { type: Array, default: () => [] },
  maxSelectable: { type: Number, default: 10 }
})

const emit = defineEmits(['update:modelValue'])
const selectionError = ref('')
watch(() => props.modelValue, () => { selectionError.value = '' }, { deep: true })

const validSeats = computed(() => (props.data?.seats || []).filter(s =>
  Number.isInteger(Number(s.layoutX)) && Number(s.layoutX) > 0 &&
  Number.isInteger(Number(s.layoutY)) && Number(s.layoutY) > 0
))
const maxColumn = computed(() => Math.max(1, ...validSeats.value.map(s => Number(s.layoutY))))
const xs = computed(() => [...new Set(validSeats.value.map(s => Number(s.layoutX)))].sort((a, b) => a - b))

// معکوس کردن عرض اتوبوس و ایجاد راهرو در وسط، بدون تغییر مکان صندلی‌ها
const rowByX = computed(() => {
  const map = {}
  const count = xs.value.length
  xs.value.forEach((x, i) => {
    const reversed = count - 1 - i
    map[x] = reversed + 1 + (reversed >= Math.ceil(count / 2) ? 1 : 0)
  })
  return map
})
const gridRows = computed(() => {
  const rows = Array(xs.value.length + 1).fill('44px')
  rows[Math.ceil(xs.value.length / 2)] = '18px'
  return rows.join(' ')
})
const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${maxColumn.value}, minmax(38px, 1fr))`,
  gridTemplateRows: gridRows.value,
  columnGap: '5px',
  rowGap: '5px',
  minWidth: `${maxColumn.value * 43}px`,
  width: '100%'
}))
const seatStyle = seat => ({ gridColumn: Number(seat.layoutY), gridRow: rowByX.value[Number(seat.layoutX)] })
const isSold = seat => /^(sold|booked|reserved|occupied)$/i.test(String(seat.status || '').trim())
const isAvailable = seat => /^(available|free|open|empty)$/i.test(String(seat.status || '').trim())
const genderLabel = seat => String(seat.pax || '').toUpperCase() === 'F' ? 'خانم' : String(seat.pax || '').toUpperCase() === 'M' ? 'آقا' : 'رزرو'
const seatTitle = seat => `صندلی ${seat.no} - ${isSold(seat) ? 'رزرو شده' : isAvailable(seat) ? 'قابل انتخاب' : 'غیرقابل انتخاب'}`
const seatClass = seat => {
  if (props.modelValue.map(String).includes(String(seat.no))) return 'border-blue-500 bg-blue-100 text-blue-800'
  if (isSold(seat)) return 'border-[#98a2ad] bg-[#98a2ad] text-white cursor-not-allowed'
  if (isAvailable(seat)) return 'border-gray-300 bg-slate-50 text-gray-900 hover:border-blue-400'
  return 'seat-inactive border-gray-300 text-gray-500 cursor-not-allowed'
}
const selectSeat = seat => {
  if (!props.selectable || props.isMock || !isAvailable(seat)) return
  const no = String(seat.no)
  const selected = props.modelValue.map(String)
  if (selected.includes(no)) { emit('update:modelValue', selected.filter(item => item !== no)); return }
  if (selected.length >= props.maxSelectable) { selectionError.value = `حداکثر ${props.maxSelectable} صندلی قابل انتخاب است.`; return }
  emit('update:modelValue', [...selected, no])
}
</script>

<style scoped>
.seat-key { display: inline-block; width: 23px; height: 23px; border-radius: 5px; flex-shrink: 0; }
.seat-inactive { background: repeating-linear-gradient(135deg, #fff, #fff 4px, #cbd5e1 5px, #cbd5e1 6px); }
.seat-item { min-width: 0; min-height: 0; height: 44px; }
</style>
