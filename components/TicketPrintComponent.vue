<template>
  <section class="ticket-list">
    <div
      v-for="ticket in tickets"
      :key="ticket.key"
      class="ticket-sheet"
    ><div
  v-if="ticket.isCancelled"
  class="cancel-stamp"
>
  کنسل شد
</div>
    <article
    class="ticket-page overflow-hidden rounded-3xl border border-blue-900 bg-white shadow-lg"
    >
      <!-- Header -->
      <header
  class="ticket-header flex flex-col gap-5 bg-blue-900 px-6 py-5 text-white md:flex-row md:items-center md:justify-between"
>
        <div>
          <p class="text-xs text-blue-100">
            بلیت الکترونیکی پرواز
          </p>

          <h2 class="mt-1 text-xl font-black">
            {{ ticket.originName }}
            به
            {{ ticket.destinationName }}
          </h2>
        </div>

        <div
          class="grid grid-cols-2 gap-x-8 gap-y-2 text-sm"
        >
          <div>
            <span class="text-blue-200">
              شماره قرارداد
            </span>

            <p class="mt-1 font-bold">
              {{ ticket.contractId }}
            </p>
          </div>

          <div>
            <span class="text-blue-200">
              شماره بلیت
            </span>

            <p
              dir="ltr"
              class="mt-1 font-mono font-bold"
            >
              {{ ticket.ticketNo }}
            </p>
          </div>
        </div>

        <div
          class="rounded-2xl bg-white px-4 py-3 text-center text-blue-900"
        >
          <p class="text-xs">
            شرکت خدمات مسافرتی
          </p>

          <p class="mt-1 text-lg font-black">
            آهوان
          </p>
        </div>
      </header>

      <!-- Main information -->
      <div
        class="grid grid-cols-1 lg:grid-cols-12"
      >
        <!-- Airline and booking -->
        <section
          class="border-b border-blue-100 p-6 lg:col-span-3 lg:border-b-0 lg:border-l"
        >
          <h3
            class="mb-5 text-sm font-bold text-blue-900"
          >
            اطلاعات پرواز
          </h3>

          <dl class="space-y-4 text-sm">
            <div
              class="flex items-center justify-between gap-4"
            >
              <dt class="text-slate-500">
                ایرلاین
              </dt>

              <dd
                class="font-bold text-blue-900"
              >
                {{ ticket.airlineName }}
              </dd>
            </div>

            <div
              class="flex items-center justify-between gap-4"
            >
              <dt class="text-slate-500">
                کد ایرلاین
              </dt>

              <dd
                dir="ltr"
                class="font-mono font-bold"
              >
                {{ ticket.airlineCode }}
              </dd>
            </div>

            <div
              class="flex items-center justify-between gap-4"
            >
              <dt class="text-slate-500">
                شماره پرواز
              </dt>

              <dd
                dir="ltr"
                class="font-bold"
              >
                {{ ticket.flightNo }}
              </dd>
            </div>

            <div
              class="flex items-center justify-between gap-4"
            >
              <dt class="text-slate-500">
                کلاس نرخی
              </dt>

              <dd
                dir="ltr"
                class="font-bold"
              >
                {{ ticket.flightClass || '-' }}
              </dd>
            </div>

            <div
              class="flex items-center justify-between gap-4"
            >
              <dt class="text-slate-500">
                کد رزرو
              </dt>

              <dd
                dir="ltr"
                class="rounded-lg bg-blue-50 px-3 py-1 font-mono font-black text-blue-900"
              >
                {{ ticket.pnr }}
              </dd>
            </div>

            <div
              class="flex items-center justify-between gap-4"
            >
              <dt class="text-slate-500">
                وضعیت
              </dt>

              <dd
                class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"
              >
                {{ getStatusTitle(ticket.status) }}
              </dd>
            </div>
          </dl>
        </section>

        <!-- Route -->
        <section
          class="border-b border-blue-100 p-6 lg:col-span-6 lg:border-b-0 lg:border-l"
        >
          <div
            class="flex items-start justify-between gap-4"
          >
            <div class="text-center">
  <p
    class="text-3xl font-black text-blue-900"
  >
    {{ ticket.origin }}
  </p>

  <p
    class="mt-2 text-sm font-semibold text-slate-700"
  >
    {{ ticket.originName }}
  </p>

  <p
    v-if="ticket.originAirportName"
    class="mt-1 max-w-[180px] text-[10px] leading-4 text-slate-500"
  >
    {{ ticket.originAirportName }}
  </p>
</div>

            <div
              class="mt-4 flex flex-1 items-center px-2"
            >
              <span
                class="h-3 w-3 rounded-full bg-blue-900"
              ></span>

              <span
                class="mx-2 flex-1 border-t-2 border-dashed border-blue-300"
              ></span>

              <span
                class="rotate-180 text-2xl text-blue-900"
              >
                ✈
              </span>

              <span
                class="mx-2 flex-1 border-t-2 border-dashed border-blue-300"
              ></span>

              <span
                class="h-3 w-3 rounded-full bg-blue-900"
              ></span>
            </div>

           <div class="text-center">
  <p
    class="text-3xl font-black text-blue-900"
  >
    {{ ticket.destination }}
  </p>

  <p
    class="mt-2 text-sm font-semibold text-slate-700"
  >
    {{ ticket.destinationName }}
  </p>

  <p
    v-if="ticket.destinationAirportName"
    class="mt-1 max-w-[180px] text-[10px] leading-4 text-slate-500"
  >
    {{ ticket.destinationAirportName }}
  </p>
</div>
          </div>

          <div
            class="mt-8 grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-3"
          >
            <div class="text-center">
              <p class="text-xs text-slate-500">
                تاریخ پرواز
              </p>

              <p
                class="mt-2 font-bold text-slate-900"
              >
                {{ ticket.departurePersianDate }}
              </p>
            </div>

            <div class="text-center">
              <p class="text-xs text-slate-500">
                ساعت حرکت
              </p>

              <p
                dir="ltr"
                class="mt-2 font-bold text-slate-900"
              >
                {{ ticket.departureTime }}
              </p>
            </div>

            <div class="text-center">
              <p class="text-xs text-slate-500">
                نوع سفر
              </p>

              <p
                class="mt-2 font-bold text-slate-900"
              >
                {{
                  ticket.journeyType ===
                  'Domestic'
                    ? 'داخلی'
                    : 'خارجی'
                }}
              </p>
            </div>
          </div>

          <div
            class="mt-5 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            <span>
              بار مجاز
            </span>

            <strong>
              ۲۰ کیلوگرم
            </strong>
          </div>
        </section>

        <!-- Passenger -->
        <section
          class="bg-[#d5af81] p-6 lg:col-span-3"
        >
          <h3
            class="mb-5 text-sm font-bold text-blue-950"
          >
            اطلاعات مسافر
          </h3>

          <dl class="space-y-5 text-sm">
            <div>
              <dt
                class="text-xs text-blue-950/70"
              >
                نام و نام خانوادگی
              </dt>

              <dd
                dir="ltr"
                class="mt-1 break-words text-left font-bold text-blue-950"
              >
                {{ ticket.passengerFullName }}
              </dd>
            </div>

            <div>
              <dt
                class="text-xs text-blue-950/70"
              >
                کد ملی یا پاسپورت
              </dt>

              <dd
                dir="ltr"
                class="mt-1 text-left font-bold text-blue-950"
              >
                {{ ticket.nationalCode }}
              </dd>
            </div>
<div>
  <dt class="text-xs text-blue-950/70">
    ملیت
  </dt>

  <dd class="mt-1 font-bold text-blue-950">
    {{ ticket.nationality || '-' }}
  </dd>
</div>
<div>
  <dt class="text-xs text-blue-950/70">
    جنسیت
  </dt>

  <dd class="mt-1 font-bold text-blue-950">
    {{ticket.genderTitle || '-'}}
  </dd>
</div>
            <div>
              <dt
                class="text-xs text-blue-950/70"
              >
                رده سنی
              </dt>

              <dd
                class="mt-1 font-bold text-blue-950"
              >
                {{ ticket.passengerTypeTitle }}
              </dd>
            </div>

            <div>
              <dt
                class="text-xs text-blue-950/70"
              >
                مبلغ کل
              </dt>

              <dd
                class="mt-1 text-lg font-black text-blue-950"
              >
                {{
                  formatPrice(
                    ticket.totalPrice
                  )
                }}
                ریال
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <!-- Price details -->
      <section
        class="border-t border-blue-100 px-6 py-5"
      >
        <div
          class="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          <div
            class="rounded-xl bg-slate-50 p-3"
          >
            <p class="text-xs text-slate-500">
              مبلغ پایه
            </p>

            <p class="mt-1 font-bold">
              {{ formatPrice(ticket.fare) }}
              ریال
            </p>
          </div>

          <div
            class="rounded-xl bg-slate-50 p-3"
          >
            <p class="text-xs text-slate-500">
              مالیات
            </p>

            <p class="mt-1 font-bold">
              {{
                formatPrice(
                  getTaxesTotal(
                    ticket.taxes
                  )
                )
              }}
              ریال
            </p>
          </div>

          <div
            class="rounded-xl bg-slate-50 p-3"
          >
            <p class="text-xs text-slate-500">
              کمیسیون
            </p>

            <p class="mt-1 font-bold">
              {{
                formatPrice(
                  ticket.commission
                )
              }}
              ریال
            </p>
          </div>

          <div
            class="rounded-xl bg-blue-900 p-3 text-white"
          >
            <p class="text-xs text-blue-200">
              مبلغ نهایی
            </p>

            <p class="mt-1 font-black">
              {{
                formatPrice(
                  ticket.totalPrice
                )
              }}
              ریال
            </p>
          </div>
        </div>
      </section>

      <!-- Rules -->
      <footer
        class="border-t border-blue-100 px-6 py-5"
      >
        <h3
          class="font-bold text-blue-900"
        >
          قوانین و مقررات
        </h3>

        <ul
          class="mt-3 space-y-2 text-xs leading-6 text-slate-600"
        >
          <li>
            هزینه کنسلی مطابق قوانین ایرلاین محاسبه می‌شود.
          </li>

          <li>
            حضور مسافر حداقل دو ساعت قبل از پرواز در فرودگاه الزامی است.
          </li>

          <li>
            مسئولیت کنترل صحت نام، کد ملی، مسیر و تاریخ پرواز بر عهده مسافر است.
          </li>
        </ul>

        <div
          class="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between"
        >
          <p>
            پشتیبانی آهوان:
            <strong dir="ltr">
              02141889
            </strong>
          </p>

          <p>
            تهران، ضلع شمال غربی میدان آرژانتین، ساختمان بانک تجارت، پلاک ۱۸
          </p>
        </div>
      </footer>
    </article>
    </div>
    
  </section>
</template>

<script setup lang="ts">
type EtrTax = {
  TaxAmount: number | string
  TaxCode: string
}

type PrintableTicket = {
  key: string
  contractId: number
  airlineCode: string
  airlineName: string
  passengerFullName: string
  passengerFirstName: string
  passengerLastName: string
  passengerType: string
  passengerTypeTitle: string
  nationalCode: string
  ticketNo: string
  pnr: string
  flightNo: string
  flightClass: string
  journeyType: string
  origin: string
  originName: string
  destination: string
  destinationName: string
  departure: string
  departureDate: string
  departureTime: string
  departurePersianDate: string
  totalPrice: number
  fare: number
  commission: number
  taxes: EtrTax[]
  status: string
  flight: any
  passenger: any
  etr: any
}

defineProps<{
  tickets: PrintableTicket[]
}>()

const formatPrice = (
  value: number | string
): string => {
  return new Intl.NumberFormat(
    'fa-IR'
  ).format(
    Number(value || 0)
  )
}

const getTaxesTotal = (
  taxes: EtrTax[]
): number => {
  if (!Array.isArray(taxes)) {
    return 0
  }

  return taxes.reduce(
    (total, tax) =>
      total +
      Number(
        tax?.TaxAmount || 0
      ),
    0
  )
}

const getStatusTitle = (
  status: unknown
): string => {
  const value =
    String(status || '')
      .trim()
      .toUpperCase()

  if (
    value === 'OPEN FOR USE' ||
    value === 'O'
  ) {
    return 'قابل استفاده'
  }

  if (
    value === 'REFUNDED' ||
    value === 'R'
  ) {
    return 'استرداد شده'
  }

  if (
    value === 'USED' ||
    value === 'F'
  ) {
    return 'استفاده شده'
  }

  return (
    String(status || '').trim() ||
    'صادر شده'
  )
}
</script>

<style scoped>
.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.ticket-sheet {
  width: 100%;
}

.ticket-page {
  width: 100%;
  break-inside: avoid;
  page-break-inside: avoid;
}
.ticket-sheet{
  position:relative;
  width:100%;
}

.cancel-stamp{
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%) rotate(-20deg);
  z-index:999;
  padding:12px 40px;
  border:4px solid #dc2626;
  border-radius:14px;
  color:#dc2626;
  font-size:34px;
  font-weight:900;
  opacity:.7;
  pointer-events:none;
  white-space:nowrap;
}
</style>