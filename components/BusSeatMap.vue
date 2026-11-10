<template>
  <section class="w-full bg-white" dir="rtl">
    <div v-if="loading" class="py-10 text-center text-sm text-gray-500">در حال دریافت نقشه صندلی‌ها...</div>
    <div v-else-if="error" class="py-5 text-center text-sm text-red-600">{{ error }}</div>
    <div v-else-if="!data || !Array.isArray(data.seats)" class="py-6 text-center text-sm text-gray-500">نقشه صندلی‌ها در دسترس نیست.</div>
    <template v-else>
      <p v-if="isMock" class="mb-3 text-center text-[11px] leading-6 text-amber-700">
        نمونه استاتیک نقشه صندلی‌ها ـ وضعیت رزرو واقعی نیست.
        <span v-if="serviceMismatch">کد سرویس نمونه با سرویس انتخاب‌شده تفاوت دارد.</span>
      </p>
      <div class="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-gray-600">
        <span class="flex items-center gap-1.5"><i class="seat-key border border-blue-500 bg-blue-100"></i>انتخاب شما</span>
        <span class="flex items-center gap-1.5"><i class="seat-key border border-gray-300 bg-slate-50"></i>قابل انتخاب</span>
        <span class="flex items-center gap-1.5"><i class="seat-key bg-[#98a2ad]"></i>رزرو شده</span>
        <span class="flex items-center gap-1.5"><i class="seat-key seat-inactive"></i>غیرقابل انتخاب</span>
      </div>
      <div class="rounded-xl border-2 border-gray-200 bg-white p-3 sm:p-5">
        <div class="flex flex-row items-stretch gap-3 overflow-x-auto" dir="ltr">
          <div class="flex w-[45px] shrink-0 items-center justify-center border-r border-gray-200 py-3">
            <span class="whitespace-nowrap text-[11px] font-extrabold text-gray-700 [writing-mode:vertical-rl]">جلوی اتوبوس</span>
          </div>
          <div class="min-w-0 flex-1 overflow-x-auto">
            <div class="seat-grid mx-auto" :style="gridStyle" dir="ltr">
              <template v-for="seat in validSeats" :key="seat.no">
                <button
                  type="button"
                  class="seat-item flex items-center justify-center rounded-md border text-[12px] font-bold transition-colors"
                  :class="seatClass(seat)"
                  :style="seatStyle(seat)"
                  :disabled="isMock || !isAvailable(seat)"
                  :title="seatTitle(seat)"
                  @click="selectSeat(seat)"
                >{{ isSold(seat) ? genderLabel(seat) : seat.no }}</button>
              </template>
            </div>
          </div>
        </div>
      </div>
      <p v-if="selectedSeat" class="mt-3 text-center text-xs font-bold text-blue-700">صندلی انتخاب‌شده: {{ selectedSeat }}</p>
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
  serviceMismatch: { type: Boolean, default: false }
})
const selectedSeat = ref('')
watch(() => props.data?.moveCode, () => { selectedSeat.value = '' })
const validSeats = computed(() =>
  (props.data?.seats || []).filter(s => Number(s.layoutX) > 0 && Number(s.layoutY) > 0)
)
const maxColumn = computed(() => Math.max(1, ...validSeats.value.map(s => Number(s.layoutY))))
// خروجی سرویس: layoutX محل قرارگیری در عرض اتوبوس و layoutY در طول آن است.
// محورهای نقشه برای نمایش افقی شبیه تصویر نمونه جابه‌جا شده‌اند.
const xs = computed(() => [...new Set(validSeats.value.map(s => Number(s.layoutX)))].sort((a,b)=>a-b))
const rowByX = computed(() => {
  const map = {}
  xs.value.forEach((x, i) => { map[x] = i + 1 + (i > 0 ? 1 : 0) })
  return map
})
const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${maxColumn.value}, minmax(38px, 1fr))`,
  gridTemplateRows: `repeat(${xs.value.length + 1}, 44px)`,
  gap: '5px',
  minWidth: `${maxColumn.value * 43}px`,
  width: '100%',
  maxWidth: '780px'
}))
const seatStyle = seat => ({ gridColumn: Number(seat.layoutY), gridRow: rowByX.value[Number(seat.layoutX)] })
const isSold = seat => /^(sold|booked|reserved|occupied)$/i.test(String(seat.status || '').trim())
const isAvailable = seat => /^(available|free|open|empty)$/i.test(String(seat.status || '').trim())
const genderLabel = seat => String(seat.pax || '').toUpperCase() === 'F' ? 'خانم' : String(seat.pax || '').toUpperCase() === 'M' ? 'آقا' : 'رزرو'
const seatTitle = seat => `صندلی ${seat.no} - ${isSold(seat) ? 'رزرو شده' : isAvailable(seat) ? 'قابل انتخاب' : 'غیرقابل انتخاب'}`
const seatClass = seat => {
  if (selectedSeat.value === String(seat.no)) return 'border-blue-500 bg-blue-100 text-blue-800'
  if (isSold(seat)) return 'border-[#98a2ad] bg-[#98a2ad] text-white cursor-not-allowed'
  if (isAvailable(seat)) return 'border-gray-300 bg-slate-50 text-gray-900 hover:border-blue-400'
  return 'seat-inactive border-gray-300 text-gray-500 cursor-not-allowed'
}
const selectSeat = seat => {
  if (props.isMock || !isAvailable(seat)) return
  selectedSeat.value = selectedSeat.value === String(seat.no) ? '' : String(seat.no)
}
</script>
<style scoped>
.seat-key { display:inline-block;width:23px;height:23px;border-radius:5px;flex-shrink:0 }
.seat-inactive { background:repeating-linear-gradient(135deg,#fff,#fff 4px,#cbd5e1 5px,#cbd5e1 6px) }
.seat-item { min-width:0;min-height:44px }
</style>
