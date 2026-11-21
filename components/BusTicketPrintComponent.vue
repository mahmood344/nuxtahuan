<template>
  <section class="ticket-list" dir="rtl">
    <div v-for="ticket in tickets" :key="ticket.key" class="ticket-sheet">
      <div v-if="ticket.isCancelled" class="cancel-stamp">کنسل شد</div>
      <article class="ticket-page overflow-hidden rounded-3xl border border-blue-900 bg-white shadow-lg">
        <header class="ticket-header flex flex-col gap-5 bg-blue-900 px-6 py-5 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-xs text-blue-100">بلیت الکترونیکی اتوبوس</p>
            <h2 class="mt-1 text-xl font-black">{{ ticket.originName || '-' }} به {{ ticket.destinationName || '-' }}</h2>
          </div>
          <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div>
              <span class="text-blue-200">شماره قرارداد</span>
              <p class="mt-1 font-bold">{{ contractId ?? '-' }}</p>
            </div>
            <div>
              <span class="text-blue-200">شماره بلیت</span>
              <p dir="ltr" class="mt-1 text-right font-mono font-bold">{{ ticket.ticketNo || 'صادر نشده' }}</p>
            </div>
          </div>
          <div class="ticket-company rounded-2xl bg-white px-4 py-3 text-center text-blue-900">
            <p class="text-xs">شرکت خدمات مسافرتی</p>
            <p class="mt-1 text-lg font-black">آهوان</p>
          </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12">
          <section class="border-b border-blue-100 p-6 lg:col-span-3 lg:border-b-0 lg:border-l">
            <h3 class="mb-5 text-sm font-bold text-blue-900">اطلاعات اتوبوس</h3>
            <dl class="space-y-4 text-sm">
              <div class="flex items-center justify-between gap-4">
                <dt class="text-slate-500">شرکت مسافربری</dt>
                <dd class="text-left font-bold text-blue-900">{{ ticket.companyName || '-' }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4">
                <dt class="text-slate-500">شماره صندلی</dt>
                <dd class="rounded-lg bg-blue-50 px-3 py-1 text-lg font-black text-blue-900">{{ ticket.seatNo || '-' }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4">
                <dt class="text-slate-500">مقصد نهایی سرویس</dt>
                <dd class="text-left font-bold">{{ ticket.finalDestination || '-' }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4">
                <dt class="text-slate-500">وضعیت</dt>
                <dd class="rounded-full px-3 py-1 text-xs font-bold" :class="ticket.isCancelled ? 'bg-red-100 text-red-700' : ticket.isIssued ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'">{{ ticket.isCancelled ? 'کنسل شده' : ticket.isIssued ? 'صادر شده' : 'در انتظار صدور' }}</dd>
              </div>
            </dl>
          </section>

          <section class="border-b border-blue-100 p-6 lg:col-span-6 lg:border-b-0 lg:border-l">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1 text-center">
                <p class="text-xl font-black text-blue-900 md:text-2xl">{{ ticket.originName || '-' }}</p>
                <p class="mt-2 text-xs text-slate-500">مبدأ / پایانه</p>
              </div>
              <div class="mt-3 flex min-w-[72px] flex-1 items-center px-1">
                <span class="h-3 w-3 shrink-0 rounded-full bg-blue-900"></span>
                <span class="mx-2 flex-1 border-t-2 border-dashed border-blue-300"></span>
                <span class="text-xl text-blue-900">🚌</span>
                <span class="mx-2 flex-1 border-t-2 border-dashed border-blue-300"></span>
                <span class="h-3 w-3 shrink-0 rounded-full bg-blue-900"></span>
              </div>
              <div class="min-w-0 flex-1 text-center">
                <p class="text-xl font-black text-blue-900 md:text-2xl">{{ ticket.destinationName || '-' }}</p>
                <p class="mt-2 text-xs text-slate-500">مقصد / پایانه</p>
              </div>
            </div>
            <div class="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-5">
              <div class="text-center">
                <p class="text-xs text-slate-500">تاریخ حرکت</p>
                <p class="mt-2 font-bold text-slate-900">{{ ticket.departureDate || '-' }}</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-slate-500">ساعت حرکت</p>
                <p dir="ltr" class="mt-2 font-bold text-slate-900">{{ ticket.departureTime || '-' }}</p>
              </div>
            </div>
          </section>

          <section class="bg-[#d5af81] p-6 lg:col-span-3">
            <h3 class="mb-5 text-sm font-bold text-blue-950">اطلاعات مسافر</h3>
            <dl class="space-y-5 text-sm">
              <div>
                <dt class="text-xs text-blue-950/70">نام و نام خانوادگی</dt>
                <dd class="mt-1 break-words font-bold text-blue-950">{{ ticket.passengerName || '-' }}</dd>
              </div>
              <div>
                <dt class="text-xs text-blue-950/70">جنسیت</dt>
                <dd class="mt-1 font-bold text-blue-950">{{ genderTitle(ticket.sex) }}</dd>
              </div>
              <div>
                <dt class="text-xs text-blue-950/70">کد ملی</dt>
                <dd dir="ltr" class="mt-1 text-right font-mono font-bold text-blue-950">{{ ticket.nationalCode || '-' }}</dd>
              </div>
              <div>
                <dt class="text-xs text-blue-950/70">شماره صندلی</dt>
                <dd class="mt-1 text-lg font-black text-blue-950">{{ ticket.seatNo || '-' }}</dd>
              </div>
            </dl>
          </section>
        </div>

        <footer class="border-t border-blue-100 px-6 py-5">
          <h3 class="font-bold text-blue-900">نکات مهم سفر</h3>
          <ul class="mt-3 space-y-2 text-xs leading-6 text-slate-600">
            <li>پیش از حرکت، زمان حضور در پایانه و محل سوارشدن را با شرکت مسافربری بررسی کنید.</li>
            <li>هنگام سوارشدن، بلیت و مدرک شناسایی معتبر همراه داشته باشید.</li>
            <li>شرایط تغییر یا استرداد بلیت تابع مقررات شرکت مسافربری است.</li>
          </ul>
          <div class="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>پشتیبانی آهوان: <strong dir="ltr">02141889</strong></p>
            <p>تهران، ضلع شمال غربی میدان آرژانتین، ساختمان بانک تجارت، پلاک ۱۸</p>
          </div>
        </footer>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
export type BusPrintableTicket = {
  key: string
  pnr: string
  ticketNo: string
  seatNo: string
  passengerName: string
  originName: string
  destinationName: string
  departureDate: string
  departureTime: string
  segment: string
  finalDestination: string
  companyName: string
  sex: string
  nationalCode: string
  isCancelled: boolean
  isIssued: boolean
}
defineProps<{ tickets: BusPrintableTicket[]; contractId?: string | number }>()
const genderTitle = (value: unknown): string => {
  const sex = String(value ?? '').trim().toUpperCase()
  return sex === 'M' ? 'آقا' : sex === 'F' ? 'خانم' : '-'
}
</script>

<style scoped>
.ticket-list { display:flex; flex-direction:column; gap:2rem; }
.ticket-sheet { position:relative; width:100%; }
.ticket-page { width:100%; break-inside:avoid; page-break-inside:avoid; }
.cancel-stamp { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-20deg); z-index:9; padding:12px 40px; border:4px solid #dc2626; border-radius:14px; color:#dc2626; font-size:34px; font-weight:900; opacity:.7; pointer-events:none; white-space:nowrap; }
</style>
