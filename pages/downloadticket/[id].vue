<template>
  <div
    class="min-h-screen bg-gray-100 pb-24  md:bg-white md:pb-10"
    dir="rtl"
  >
    <!-- هدر و استپر -->
    <header
      class="relative -mt-10 hidden h-[97px] w-full bg-secondary md:block print:hidden"
    >
      <div
        class="absolute inset-0 bg-cover bg-center"
        style="background-image:url('/imgs/flight/header.png')"
      ></div>

      <div
        class="absolute -bottom-15 left-0 right-0 z-10 mx-auto max-w-3xl px-4"
      >
        <Stepper
          :steps="flightSteps"
          :active-step="downloadActiveStep"
          active-color="#1a237e"
        />
      </div>
    </header>

    <main
      class="mx-auto mt-6 w-full max-w-7xl px-4 md:mt-[100px]"
    >
      <div class="mx-auto max-w-6xl">
        <!-- ابزارهای صفحه -->
        <section
          class="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden"
        >
          <div
            class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 class="text-xl font-bold text-slate-900">
                دریافت بلیت
              </h1>

              <p class="mt-1 text-sm text-slate-500">
                برای چاپ یا ذخیره فایل PDF روی دکمه زیر کلیک کنید.
              </p>
            </div>

            <button
              v-if="tickets.length"
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
              @click="printTickets"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.72 13.829a3 3 0 00-2.68 3.306l.266 2.4A2.25 2.25 0 006.542 21h10.916a2.25 2.25 0 002.236-1.465l.266-2.4a3 3 0 00-2.68-3.306M6.75 7.5V3.75A.75.75 0 017.5 3h9a.75.75 0 01.75.75V7.5M6.75 16.5h10.5M6 7.5h12a3 3 0 013 3v3.75a.75.75 0 01-.75.75H18v-1.5H6V15H3.75a.75.75 0 01-.75-.75V10.5a3 3 0 013-3z"
                />
              </svg>

              چاپ یا ذخیره PDF
            </button>
          </div>
        </section>

        <!-- Loading -->
        <section
          v-if="loading"
          class="rounded-2xl bg-white p-12 text-center shadow-sm print:hidden"
        >
          <div
            class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700"
          ></div>

          <p class="text-gray-700">
            در حال دریافت اطلاعات بلیت...
          </p>
        </section>

        <!-- Error -->
        <section
          v-else-if="errorMessage"
          class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center print:hidden"
        >
          <p class="font-semibold text-red-700">
            {{ errorMessage }}
          </p>
        </section>

        <!-- Tickets -->
        <div
          v-else-if="tickets.length"
          id="ticket-print-area"
        >
          <div
            v-if="cancelledTickets.length"
            class="mb-5 space-y-3 print:mb-4"
          >
            <div
              v-for="ticket in cancelledTickets"
              :key="`cancelled-${ticket.key}`"
              class="rounded-2xl border-2 border-red-500 bg-red-50 px-5 py-4 text-center"
            >
              <p class="text-lg font-black text-red-700">
                این بلیت کنسل شده است
              </p>

              <p class="mt-1 text-sm text-red-600">
                شماره بلیت:
                <span dir="ltr" class="font-bold">
                  {{ ticket.ticketNo }}
                </span>
              </p>
            </div>
          </div>

          <TicketPrintComponent
            :tickets="tickets"
          />
        </div>

        <!-- Empty -->
        <section
          v-else
          class="rounded-2xl border border-slate-200 bg-white p-8 text-center text-gray-500 print:hidden"
        >
          بلیتی برای نمایش وجود ندارد.
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref
} from 'vue'
import { useRoute } from '#app'
import { useFlightStore } from '~/stores/flights'


definePageMeta({
  name: 'downloadticket'
})
type FlightCancellation={
  ticketNumber:string
  status:string
  settlementStatus?:string
  providerStatus?:string
}

type FlightJsonData={
  version:number
  payment?:unknown
  issue?:unknown
  cancellations?:FlightCancellation[]
  updatedAt?:string
}
type FlightJsonPayment={
  type:string
  contractTotal:number
  bankAmount:number
  travelCardUsed:boolean
  travelCardAmount:number
  travelCardNumber:string
  recordedAt:string
}

type FlightJsonIssue={
  provider:string
  status:string
  pnr:string
  ticketNumbers:string[]
  message:string
  response:any
  attemptedAt:string
}


type EtrTax = {
  TaxAmount: number | string
  TaxCode: string
}

type EtrHistory = {
  CouponNo: number
  Origin: string
  Status: string
  Office: string
  Destination: string
  Remark: string
}

type EtrCoupon = {
  Origin: string
  Status: string
  Destination: string
  JourneyType: string
  PassengerFullName: string
  FlightClass: string
  Departure: string
  PNR: string
  FlightNo: string
  Fare: string
  PassengerPAX: string
}

type EtrResponse = {
  PassengerFullName: string
  PAX: string
  TotalPrice: string
  TAXES: EtrTax[]
  TicketNo: string
  Comission: string
  History: EtrHistory[]
  COUPONS: EtrCoupon[]
  Fare: string
}

export type PrintableTicket = {
  key: string
  contractId: number
  airlineCode: string
  airlineName: string
  isCancelled:boolean
  cancellationStatus:string
  cancellationTitle:string
  cancellation:FlightCancellation|null
  passengerFullName: string
  passengerFirstName: string
  passengerLastName: string
  passengerType: string
  passengerTypeTitle: string
  nationalCode: string
  nationality: string
  gender:boolean|null
  genderTitle:string

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
  etr: EtrResponse
}

type FlightTicketNumber = {
  ticketNo: string
  passengerText: string
}
const getFlightDocument=(flight:any):FlightJsonData|null=>{
  const items=parseFlightJson(
    flight?.flightJson
  )

  const documentValue=items?.[0]

  return documentValue&&
    typeof documentValue==='object'
      ?documentValue
      :null
}

const getTicketCancellation=(
  flight:any,
  ticketNo:string
):FlightCancellation|null=>{
  const documentValue=
    getFlightDocument(flight)

  const cancellations=
    Array.isArray(
      documentValue?.cancellations
    )
      ?documentValue.cancellations
      :[]

  return cancellations.find(
    item=>
      String(item?.ticketNumber||'').trim()===
      String(ticketNo||'').trim()
  )||null
}

const isTicketCancelled=(
  flight:any,
  ticketNo:string
):boolean=>{
  const cancellation=
    getTicketCancellation(
      flight,
      ticketNo
    )

  const status=String(
    cancellation?.status||''
  )
    .trim()
    .toLowerCase()

  return[
    'success',
    'provider-cancelled',
    'settlement-pending',
    'manual-review'
  ].includes(status)
}
const route = useRoute()
const flightStore = useFlightStore()

const loading = ref(true)
const errorMessage = ref('')
const contractData = ref<any>(null)
const tickets = ref<PrintableTicket[]>([])

const cancelledTickets=computed(()=>
  tickets.value.filter(ticket=>ticket.isCancelled)
)

/*
 * Decode کردن contractId موجود در URL.
 *
 * نسخه URL-safe را نیز پشتیبانی می‌کند.
 */
const travelType = computed(() => {
  const flights =
    Array.isArray(
      contractData.value?.contractFlights
    )
      ? contractData.value.contractFlights
      : []

  return flights.length > 1
    ? 'round-trip'
    : 'one-way'
})

const flightSteps = computed(() => {
  if (travelType.value === 'round-trip') {
    return [
      { icon: '✈️', label: 'انتخاب پرواز رفت' },
      { icon: '🔁', label: 'انتخاب پرواز برگشت' },
      { icon: '📄', label: 'تکمیل اطلاعات' },
      { icon: '💳', label: 'تایید و پرداخت' },
      { icon: '🎫', label: 'دریافت بلیت' }
    ]
  }

  return [
    { icon: '✈️', label: 'انتخاب پرواز' },
    { icon: '📄', label: 'تکمیل اطلاعات' },
    { icon: '💳', label: 'تایید و پرداخت' },
    { icon: '🎫', label: 'دریافت بلیت' }
  ]
})

const downloadActiveStep = computed(() => {
  return flightSteps.value.length - 1
})
const decodeContractId = (
  encodedValue: unknown
): number => {
  if (typeof window === 'undefined') {
    throw new Error(
      'امکان خواندن شناسه قرارداد وجود ندارد.'
    )
  }

  let value = String(
    encodedValue || ''
  ).trim()

  if (!value) {
    throw new Error(
      'شناسه قرارداد در آدرس وجود ندارد.'
    )
  }

  value = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const paddingLength =
    (4 - value.length % 4) % 4

  value += '='.repeat(
    paddingLength
  )

  let decodedValue = ''

  try {
    decodedValue =
      window.atob(value)
  } catch {
    throw new Error(
      'فرمت شناسه قرارداد معتبر نیست.'
    )
  }

  const contractId =
    Number(decodedValue)

  if (
    !Number.isInteger(contractId) ||
    contractId <= 0
  ) {
    throw new Error(
      'شناسه قرارداد معتبر نیست.'
    )
  }

  return contractId
}

/*
 * دریافت اطلاعات قرارداد.
 */
const fetchContractDetails = async (
  contractId: number
): Promise<any> => {
  const response =
    await $fetch<any>(
      `https://api.ahuan.ir/api/Contract/${contractId}`,
      {
        method: 'GET'
      }
    )

  return response?.data || response
}

/*
 * پاسخ ETR در پروژه تو یک JSON string است.
 *
 * نمونه:
 * "{\"PassengerFullName\":\"...\"}"
 *
 * این تابع هم Object و هم JSON string و هم
 * response.data را پشتیبانی می‌کند.
 */
const parseEtrResponse = (
  response: any
): EtrResponse => {
  let value =
    response?.data !== undefined
      ? response.data
      : response

  /*
   * گاهی خروجی دو بار stringify شده است.
   * بنابراین تا دو مرحله JSON.parse انجام می‌دهیم.
   */
  for (let index = 0; index < 2; index++) {
    if (typeof value !== 'string') {
      break
    }

    const rawValue =
      value.trim()

    if (!rawValue) {
      throw new Error(
        'پاسخ سرویس ETR خالی است.'
      )
    }

    try {
      value =
        JSON.parse(rawValue)
    } catch {
      throw new Error(
        'پاسخ سرویس ETR فرمت JSON معتبر ندارد.'
      )
    }
  }

  if (
    !value ||
    typeof value !== 'object'
  ) {
    throw new Error(
      'پاسخ معتبر از سرویس ETR دریافت نشد.'
    )
  }

  if (
    !String(value.TicketNo || '').trim()
  ) {
    throw new Error(
      'شماره بلیت در پاسخ ETR وجود ندارد.'
    )
  }

  return value as EtrResponse
}

/*
 * درخواست اطلاعات یک شماره بلیت از ETR.
 */
const fetchNiraTicketEtr = async (
  airlineCode: string,
  ticketNo: string
): Promise<EtrResponse> => {
  const response =
    await $fetch<any>(
      'https://api.ahuan.ir/api/Nira/ETR',
      {
        method: 'GET',

        query: {
          AirLine:
            airlineCode,

          TicketNo:
            ticketNo
        },

        headers: {
          Accept:
            'application/json'
        }
      }
    )

  return parseEtrResponse(
    response
  )
}

/*
 * flightJson ممکن است string یا Array باشد.
 */
const parseFlightJson=(
  flightJson:unknown
):FlightJsonData[]=>{
  if (!flightJson) {
    return []
  }

  if (Array.isArray(flightJson)) {
    return flightJson
  }

  if (
    typeof flightJson === 'object'
  ) {
    return [flightJson]
  }

  if (
    typeof flightJson !== 'string'
  ) {
    return []
  }

  let value: any =
    flightJson.trim()

  if (!value) {
    return []
  }

  for (let index = 0; index < 2; index++) {
    if (typeof value !== 'string') {
      break
    }

    try {
      value =
        JSON.parse(value)
    } catch {
      return []
    }
  }

  return Array.isArray(value)
    ? value
    : value
      ? [value]
      : []
}

/*
 * نمونه Tickets:
 *
 * KARIMI/MAHMOODMR=1012401547112 29JUL25
 * KARIMI/KOBRAMISS=1012401547113
 */
const extractTicketNumbers = (
  ticketsValue: unknown
): FlightTicketNumber[] => {
  const text =
    String(ticketsValue || '')
      .replace(/\\r/g, ' ')
      .replace(/\\n/g, ' ')
      .replace(/\r/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

  if (!text) {
    return []
  }

  /*
   * هر شماره 10 تا 16 رقمی بعد از = استخراج می‌شود.
   */
  const regex =
    /([^=]+?)=(\d{10,16})(?=\s|$)/g

  const result:
    FlightTicketNumber[] = []

  let match:
    RegExpExecArray | null

  while (
    (
      match =
        regex.exec(text)
    ) !== null
  ) {
    let passengerText =
      String(match[1] || '')
        .trim()

    /*
     * تاریخ باقی‌مانده از بلیت قبلی:
     * 29JUL25 KARIMI/KOBRAMISS
     */
    passengerText =
      passengerText.replace(
        /^\d{1,2}[A-Z]{3}\d{2}\s+/i,
        ''
      )

    const ticketNo =
      String(match[2] || '')
        .trim()

    if (!ticketNo) {
      continue
    }

    result.push({
      passengerText,
      ticketNo
    })
  }

  return result.filter(
    (item, index, list) =>
      list.findIndex(
        (other) =>
          other.ticketNo ===
          item.ticketNo
      ) === index
  )
}

const getFlightTicketNumbers=(
  flight:any
):FlightTicketNumber[]=>{
  const items=parseFlightJson(
    flight?.flightJson
  )

  const results:FlightTicketNumber[]=[]

  for(const item of items){
    /*
     * ساختار جدید:
     * issue.ticketNumbers[]
     */
    const newTicketValues=
      Array.isArray(
        item?.issue?.ticketNumbers
      )
        ?item.issue.ticketNumbers
        :[]

    for(const ticketValue of newTicketValues){
      results.push(
        ...extractTicketNumbers(
          ticketValue
        )
      )
    }

    /*
     * پشتیبانی از ساختار قدیمی:
     * [{Tickets:"..."}]
     */
    const oldTicketValue=
      item?.Tickets||
      item?.tickets||
      item?.AirNRSTICKETS?.[0]?.Tickets||
      ''

    if(oldTicketValue){
      results.push(
        ...extractTicketNumbers(
          oldTicketValue
        )
      )
    }
  }

  return results.filter(
    (item,index,list)=>
      list.findIndex(
        other=>
          other.ticketNo===
          item.ticketNo
      )===index
  )
}

const normalizeName = (
  value: unknown
): string => {
  return String(value || '')
    .replace(
      /^\d{1,2}[A-Z]{3}\d{2}\s+/i,
      ''
    )
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()
}

/*
 * در خروجی ETR نوزاد، PassengerFullName ممکن است:
 *
 * 29JUL25 KARIMI/KOBRAMISS
 *
 * باشد. تاریخ ابتدای نام حذف می‌شود.
 */
const parsePassengerName = (
  value: unknown
) => {
  const normalized =
    normalizeName(value)

  const parts =
    normalized.split('/')

  return {
    fullName:
      normalized,

    lastName:
      String(parts[0] || '')
        .trim(),

    firstName:
      String(parts
        .slice(1)
        .join('/') || '')
        .trim()
  }
}

const normalizePassengerNamePart = (
  value: unknown
): string => {
  return String(value || '')
    .replace(
      /(MR|MRS|MISS|MS|MSTR)$/i,
      ''
    )
    .replace(/\s+/g, '')
    .trim()
    .toUpperCase()
}

const findContractPassenger = (
  contract: any,
  etr: EtrResponse
): any => {
  const passengers =
    Array.isArray(
      contract?.contractPassengers
    )
      ? contract.contractPassengers
      : []

  const parsedName =
    parsePassengerName(
      etr?.PassengerFullName
    )

  const firstName =
    normalizePassengerNamePart(
      parsedName.firstName
    )

  const lastName =
    normalizePassengerNamePart(
      parsedName.lastName
    )

  return passengers.find(
    (passenger: any) => {
      const passengerFirstName =
        normalizePassengerNamePart(
          passenger?.fName ||
          passenger?.firstName ||
          passenger?.name
        )

      const passengerLastName =
        normalizePassengerNamePart(
          passenger?.lName ||
          passenger?.lastName ||
          passenger?.family
        )

      return (
        passengerFirstName ===
          firstName &&
        passengerLastName ===
          lastName
      )
    }
  ) || null
}

const getPassengerTypeTitle = (
  pax: unknown
): string => {
  const value =
    String(pax || '')
      .trim()
      .toUpperCase()

  if (
    value === 'IN' ||
    value === 'INF'
  ) {
    return 'نوزاد'
  }

  if (
    value === 'CH' ||
    value === 'CHD'
  ) {
    return 'کودک'
  }

  return 'بزرگسال'
}

const getAirlineCode = (
  flight: any
): string => {
  return String(
    flight?.airlineIataCode ||
    flight?.airlineCode ||
    flight?.airline ||
    (
      flight?.airlineId
        ? flightStore.getAirlineCode(
            Number(flight.airlineId)
          )
        : ''
    ) ||
    ''
  )
    .trim()
    .toUpperCase()
}

const getAirlineName = (
  airlineCode: string
): string => {
  const airline =
    flightStore.airlines.find(
      (item: any) =>
        String(item?.code || '')
          .trim()
          .toUpperCase() ===
        airlineCode
    )

  return String(
    airline?.name ||
    airlineCode ||
    'ایرلاین'
  ).trim()
}

const getCityName = (
  cityCode: unknown
): string => {
  const code =
    String(cityCode || '')
      .trim()
      .toUpperCase()

  const cities = [
    ...(
      Array.isArray(
        flightStore.popularCities
      )
        ? flightStore.popularCities
        : []
    ),
    ...(
      Array.isArray(
        flightStore.iranAirports
      )
        ? flightStore.iranAirports
        : []
    )
  ]

  const city =
    cities.find(
      (item: any) => {
        const cityCodeValue =
          String(
            item?.cityCode || ''
          )
            .trim()
            .toUpperCase()

        const iataCodeValue =
          String(
            item?.iataCode || ''
          )
            .trim()
            .toUpperCase()

        return (
          cityCodeValue === code ||
          iataCodeValue === code
        )
      }
    )

  return String(
    city?.cityNicName ||
    city?.nicName ||
    city?.name ||
    code
  ).trim()
}

const parseDeparture = (
  departureValue: unknown
) => {
  const value =
    String(departureValue || '')
      .trim()

  if (!value) {
    return {
      date:
        '-',

      time:
        '-',

      persianDate:
        '-'
    }
  }

  const normalizedValue =
    value.replace(
      ' ',
      'T'
    )

  const date =
    new Date(normalizedValue)

  const values =
    value.split(' ')

  return {
    date:
      values[0] || '-',

    time:
      values[1]?.slice(0, 5) ||
      '-',

    persianDate:
      Number.isNaN(
        date.getTime()
      )
        ? values[0] || '-'
        : date.toLocaleDateString(
            'fa-IR',
            {
              year:
                'numeric',

              month:
                '2-digit',

              day:
                '2-digit'
            }
          )
  }
}

const toNumber = (
  value: unknown
): number => {
  const numberValue =
    Number(value || 0)

  return Number.isFinite(
    numberValue
  )
    ? numberValue
    : 0
}

const mapEtrToPrintableTicket = (
  contract: any,
  flight: any,
  airlineCode: string,
  etr: EtrResponse
): PrintableTicket => {
  const coupon =
    Array.isArray(etr?.COUPONS)
      ? etr.COUPONS[0]
      : null

  const passenger =
    findContractPassenger(
      contract,
      etr
    )

  const parsedName =
    parsePassengerName(
      etr?.PassengerFullName
    )

  const departure =
    parseDeparture(
      coupon?.Departure
    )

  const origin = String(
    coupon?.Origin ||
    flight?.origin ||
    ''
  )
    .trim()
    .toUpperCase()

  const destination = String(
    coupon?.Destination ||
    flight?.destination ||
    ''
  )
    .trim()
    .toUpperCase()

  const ticketNo=String(
    etr?.TicketNo||''
  ).trim()

  const cancellation=
    getTicketCancellation(
      flight,
      ticketNo
    )

  const cancellationStatus=String(
    cancellation?.status||''
  )
    .trim()
    .toLowerCase()

  const cancelled=[
    'success',
    'provider-cancelled',
    'settlement-pending',
    'manual-review'
  ].includes(cancellationStatus)

  return {
    key:
      `${flight?.id}-${ticketNo}`,

    contractId:
      Number(contract?.id || 0),

    airlineCode,

    airlineName:
      getAirlineName(
        airlineCode
      ),

    isCancelled:cancelled,
    cancellationStatus,
    cancellationTitle:cancelled
      ?'این بلیت کنسل شده است'
      :'بلیت فعال است',
    cancellation,

    passengerFullName:
      parsedName.fullName,

    passengerFirstName:
      String(
        passenger?.fName ||
        passenger?.firstName ||
        parsedName.firstName ||
        ''
      ).trim(),

    passengerLastName:
      String(
        passenger?.lName ||
        passenger?.lastName ||
        parsedName.lastName ||
        ''
      ).trim(),

    passengerType:
      String(
        etr?.PAX ||
        coupon?.PassengerPAX ||
        ''
      ).trim(),

    passengerTypeTitle:
      getPassengerTypeTitle(
        etr?.PAX ||
        coupon?.PassengerPAX
      ),

    nationalCode:
      String(
        passenger?.nationalCode ||
        passenger?.nationalityCode ||
        passenger?.codeMelli ||
        passenger?.passportNo ||
        passenger?.passportNumber ||
        '-'
      ).trim(),

    nationality:
      String(
        passenger?.nationality ||
        passenger?.nationalityName ||
        passenger?.countryName ||
        '-'
      ).trim(),

    gender:
      passenger?.gender ?? null,

    genderTitle:
      passenger?.gender === true
        ? 'آقا'
        : passenger?.gender === false
          ? 'خانم'
          : '-',

    ticketNo,

    pnr:
      String(
        coupon?.PNR ||
        flight?.pnr ||
        ''
      ).trim(),

    flightNo:
      String(
        coupon?.FlightNo ||
        flight?.flightNumber ||
        ''
      ).trim(),

    flightClass:
      String(
        coupon?.FlightClass ||
        flight?.flightClass ||
        ''
      ).trim(),

    journeyType:
      String(
        coupon?.JourneyType ||
        ''
      ).trim(),

    origin,

    originName:
      getCityName(origin),

    destination,

    destinationName:
      getCityName(destination),

    departure:
      String(
        coupon?.Departure ||
        ''
      ).trim(),

    departureDate:
      departure.date,

    departureTime:
      departure.time,

    departurePersianDate:
      departure.persianDate,

    totalPrice:
      toNumber(etr?.TotalPrice),

    fare:
      toNumber(etr?.Fare),

    commission:
      toNumber(etr?.Comission),

    taxes:
      Array.isArray(etr?.TAXES)
        ? etr.TAXES
        : [],

    status:cancelled
      ?'CANCELLED'
      :String(
          coupon?.Status ||
          etr?.History?.[0]?.Status ||
          ''
        ).trim(),

    flight,
    passenger,
    etr
  }
}

const getFlightSupplier = (
  flight: any
): string => {
  return String(
    flight?.flightSupplier ||
    flight?.provider ||
    ''
  )
    .trim()
    .toUpperCase()
}

/*
 * تمام پاسخ‌های Providerها در نهایت باید به
 * PrintableTicket تبدیل شوند. کامپوننت چاپ فقط
 * همین مدل مشترک را دریافت می‌کند.
 */
const fetchNiraPrintableTickets = async (
  contract: any,
  flight: any
): Promise<PrintableTicket[]> => {
  const airlineCode =
    getAirlineCode(flight)

  if (!airlineCode) {
    throw new Error(
      `کد ایرلاین پرواز ${flight?.flightNumber || ''} مشخص نیست.`
    )
  }

  const flightTickets =
    getFlightTicketNumbers(flight)

  if (!flightTickets.length) {
    throw new Error(
      `شماره بلیت پرواز ${flight?.flightNumber || ''} داخل flightJson پیدا نشد.`
    )
  }

  return await Promise.all(
    flightTickets.map(
      async (ticket) => {
        const etr =
          await fetchNiraTicketEtr(
            airlineCode,
            ticket.ticketNo
          )

        return mapEtrToPrintableTicket(
          contract,
          flight,
          airlineCode,
          etr
        )
      }
    )
  )
}

/*
 * آدرس و Body سرویس اطلاعات بلیت ماهان را اینجا
 * با قرارداد واقعی API پروژه جایگزین کن.
 * بقیه صفحه و TicketPrintComponent تغییر نمی‌کنند.
 */
const fetchMahanTicketInfo = async (
  contract: any,
  flight: any
): Promise<any> => {
  const endpoint =
    'https://api.ahuan.ir/api/Mahan/TicketInfo'

  const response = await $fetch<any>(
    endpoint,
    {
      method: 'POST',
      body: {
        contractId:
          Number(contract?.id || 0),
        flightId:
          Number(flight?.id || 0),
        pnr:
          String(flight?.pnr || '').trim()
      },
      headers: {
        Accept: 'application/json'
      }
    }
  )

  let value =
    response?.data !== undefined
      ? response.data
      : response

  for (let index = 0; index < 2; index++) {
    if (typeof value !== 'string') break

    const rawValue = value.trim()

    if (!rawValue) {
      throw new Error(
        'پاسخ سرویس اطلاعات بلیت ماهان خالی است.'
      )
    }

    try {
      value = JSON.parse(rawValue)
    } catch {
      throw new Error(
        'پاسخ سرویس اطلاعات بلیت ماهان JSON معتبر نیست.'
      )
    }
  }

  return value
}

const findContractPassengerByProviderData = (
  contract: any,
  data: any
): any => {
  const passengers =
    Array.isArray(contract?.contractPassengers)
      ? contract.contractPassengers
      : []

  const passengerId = Number(
    data?.contractPassengerId ||
    data?.passengerId ||
    0
  )

  if (passengerId > 0) {
    const passenger = passengers.find(
      (item: any) =>
        Number(item?.id || 0) === passengerId
    )

    if (passenger) return passenger
  }

  const documentNumber = String(
    data?.nationalCode ||
    data?.codeMelli ||
    data?.passportNo ||
    data?.passportNumber ||
    data?.documentNumber ||
    ''
  ).trim()

  if (documentNumber) {
    const passenger = passengers.find(
      (item: any) =>
        String(
          item?.codeMelli ||
          item?.passportNo ||
          item?.passportNumber ||
          ''
        ).trim() === documentNumber
    )

    if (passenger) return passenger
  }

  return null
}

const mapMahanToPrintableTicket = (
  contract: any,
  flight: any,
  data: any
): PrintableTicket => {
  const passenger =
    findContractPassengerByProviderData(
      contract,
      data
    )

  const airlineCode = String(
    data?.airlineCode ||
    flight?.airlineIataCode ||
    getAirlineCode(flight) ||
    'W5'
  )
    .trim()
    .toUpperCase()

  const departureValue = String(
    data?.departure ||
    data?.departureDateTime ||
    `${flight?.depDate || ''} ${flight?.depTime || ''}`
  ).trim()

  const departure =
    parseDeparture(departureValue)

  const origin = String(
    data?.origin ||
    flight?.origin ||
    ''
  )
    .trim()
    .toUpperCase()

  const destination = String(
    data?.destination ||
    flight?.destination ||
    ''
  )
    .trim()
    .toUpperCase()

  const ticketNo = String(
    data?.ticketNumber ||
    data?.ticketNo ||
    data?.documentNumber ||
    ''
  ).trim()

  if (!ticketNo) {
    throw new Error(
      'شماره بلیت در پاسخ ماهان وجود ندارد.'
    )
  }

  const cancellation=
    getTicketCancellation(
      flight,
      ticketNo
    )

  const cancellationStatus=String(
    cancellation?.status||''
  )
    .trim()
    .toLowerCase()

  const cancelled=[
    'success',
    'provider-cancelled',
    'settlement-pending',
    'manual-review'
  ].includes(cancellationStatus)

  const passengerFullName = String(
    data?.passengerFullName ||
    data?.passengerName ||
    `${passenger?.lName || ''}/${passenger?.fName || ''}`
  ).trim()

  const passengerType = String(
    data?.passengerType ||
    passenger?.age ||
    ''
  ).trim()

  return {
    key:
      `${flight?.id}-${ticketNo}`,

    contractId:
      Number(contract?.id || 0),

    airlineCode,

    airlineName:
      getAirlineName(airlineCode),

    isCancelled:cancelled,
    cancellationStatus,
    cancellationTitle:cancelled
      ?'این بلیت کنسل شده است'
      :'بلیت فعال است',
    cancellation,

    passengerFullName,

    passengerFirstName:
      String(
        passenger?.fName ||
        data?.firstName ||
        ''
      ).trim(),

    passengerLastName:
      String(
        passenger?.lName ||
        data?.lastName ||
        ''
      ).trim(),

    passengerType,

    passengerTypeTitle:
      getPassengerTypeTitle(passengerType),

    nationalCode:
      String(
        passenger?.codeMelli ||
        passenger?.passportNo ||
        passenger?.passportNumber ||
        data?.nationalCode ||
        data?.passportNo ||
        '-'
      ).trim(),

    nationality:
      String(
        passenger?.nationality ||
        data?.nationality ||
        data?.nationalityName ||
        '-'
      ).trim(),

    ticketNo,
gender:
  typeof passenger?.gender === 'boolean'
    ? passenger.gender
    : typeof data?.gender === 'boolean'
      ? data.gender
      : null,

genderTitle:
  passenger?.gender === true ||
  data?.gender === true
    ? 'مرد'
    : passenger?.gender === false ||
        data?.gender === false
      ? 'زن'
      : '-',
    pnr:
      String(
        data?.pnr ||
        data?.airlinePnr ||
        flight?.pnr ||
        ''
      ).trim(),

    flightNo:
      String(
        data?.flightNumber ||
        data?.flightNo ||
        flight?.flightNumber ||
        ''
      ).trim(),

    flightClass:
      String(
        data?.flightClass ||
        data?.classCode ||
        flight?.flightClass ||
        ''
      ).trim(),

    journeyType:
      String(
        data?.journeyType ||
        ''
      ).trim(),

    origin,
    originName: getCityName(origin),
    destination,
    destinationName:
      getCityName(destination),

    departure:
      departureValue,

    departureDate:
      departure.date,

    departureTime:
      departure.time,

    departurePersianDate:
      departure.persianDate,

    totalPrice:
      toNumber(data?.totalPrice),

    fare:
      toNumber(
        data?.fare ||
        data?.baseFare
      ),

    commission:
      toNumber(
        data?.commission ||
        data?.comission
      ),

    taxes:
      Array.isArray(data?.taxes)
        ? data.taxes
        : Array.isArray(data?.TAXES)
          ? data.TAXES
          : [],

    status:cancelled
      ?'CANCELLED'
      :String(
          data?.status ||
          'OPEN FOR USE'
        ).trim(),

    flight,
    passenger,
    etr: data
  }
}

const fetchMahanPrintableTickets = async (
  contract: any,
  flight: any
): Promise<PrintableTicket[]> => {
  const response =
    await fetchMahanTicketInfo(
      contract,
      flight
    )

  const items =
    Array.isArray(response?.tickets)
      ? response.tickets
      : Array.isArray(response?.data?.tickets)
        ? response.data.tickets
        : Array.isArray(response)
          ? response
          : response
            ? [response]
            : []

  if (!items.length) {
    throw new Error(
      'اطلاعات بلیت ماهان دریافت نشد.'
    )
  }

  return items.map(
    (item: any) =>
      mapMahanToPrintableTicket(
        contract,
        flight,
        item
      )
  )
}

const fetchFlightPrintableTickets = async (
  contract: any,
  flight: any
): Promise<PrintableTicket[]> => {
  const supplier =
    getFlightSupplier(flight)

  switch (supplier) {
    case 'NIRA':
      return await fetchNiraPrintableTickets(
        contract,
        flight
      )

    case 'MAHAN':
      return await fetchMahanPrintableTickets(
        contract,
        flight
      )

    default:
      throw new Error(
        `دریافت اطلاعات بلیت برای تامین‌کننده ${supplier || 'نامشخص'} پیاده‌سازی نشده است.`
      )
  }
}

const processContractTickets = async (
  contract: any
) => {
  const flights =
    Array.isArray(
      contract?.contractFlights
    )
      ? contract.contractFlights
      : []

  if (!flights.length) {
    throw new Error(
      'هیچ پروازی داخل قرارداد وجود ندارد.'
    )
  }

  /*
   * برای هر پرواز، Provider همان پرواز تشخیص داده
   * می‌شود. بنابراین قرارداد رفت و برگشت می‌تواند
   * شامل دو Provider متفاوت هم باشد.
   */
  const results =
    await Promise.allSettled(
      flights.map(
        (flight: any) =>
          fetchFlightPrintableTickets(
            contract,
            flight
          )
      )
    )

  const successfulTickets =
    results
      .filter(
        (
          result
        ): result is PromiseFulfilledResult<PrintableTicket[]> =>
          result.status === 'fulfilled'
      )
      .flatMap(
        (result) => result.value
      )

  const failedResults =
    results.filter(
      (result) =>
        result.status === 'rejected'
    ) as PromiseRejectedResult[]

  console.log(
    'Successful printable tickets:',
    successfulTickets
  )

  console.error(
    'Failed ticket provider requests:',
    failedResults
  )

  if (!successfulTickets.length) {
    throw new Error(
      failedResults[0]?.reason?.message ||
      'دریافت اطلاعات تمام بلیت‌ها ناموفق بود.'
    )
  }

  /*
   * اگر یک Provider خطا کند ولی Provider دیگر موفق
   * باشد، بلیت‌های موفق نمایش داده می‌شوند و Flow
   * کامل صفحه متوقف نمی‌شود.
   */
  tickets.value = successfulTickets
}

const printTickets = async () => {
  if (typeof window === 'undefined') return

  const printArea =
    document.getElementById('ticket-print-area')

  if (!printArea) {
    throw new Error('بخش بلیت برای چاپ پیدا نشد.')
  }

  const iframe =
    document.createElement('iframe')

  iframe.style.position = 'fixed'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  iframe.style.right = '0'
  iframe.style.bottom = '0'

  document.body.appendChild(iframe)

  const iframeDocument =
    iframe.contentDocument ||
    iframe.contentWindow?.document

  if (!iframeDocument) {
    iframe.remove()
    throw new Error('امکان ساخت صفحه چاپ وجود ندارد.')
  }

  const styles = Array.from(
    document.querySelectorAll(
      'style,link[rel="stylesheet"]'
    )
  )
    .map((element) =>
      element.outerHTML
    )
    .join('\n')

  iframeDocument.open()

  iframeDocument.write(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
      <head>
        <meta charset="UTF-8" />

        ${styles}

        <style>
          @page {
            size: A4 landscape;
            margin: 7mm;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          body {
            width: 100%;
          }

          *,
          *::before,
          *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .ticket-list {
            display: block !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .ticket-sheet {
            display: block !important;
            width: 100% !important;
            height: 190mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;

            break-inside: avoid !important;
            page-break-inside: avoid !important;

            break-after: page !important;
            page-break-after: always !important;
          }

          .ticket-sheet:last-child {
            break-after: auto !important;
            page-break-after: auto !important;
          }

          .ticket-page {
            width: 100% !important;
            margin: 0 !important;
            min-height: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            transform: scale(.82);
            transform-origin: top center;
          }
        </style>
      </head>

      <body>
        ${printArea.innerHTML}
      </body>
    </html>
  `)

  iframeDocument.close()

  const printWindow =
    iframe.contentWindow

  if (!printWindow) {
    iframe.remove()
    throw new Error('پنجره چاپ در دسترس نیست.')
  }

  const images =
    Array.from(
      iframeDocument.images
    )

  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>(
          (resolve) => {
            if (image.complete) {
              resolve()
              return
            }

            image.onload = () =>
              resolve()

            image.onerror = () =>
              resolve()
          }
        )
    )
  )

  printWindow.focus()
  printWindow.print()

  setTimeout(() => {
    iframe.remove()
  }, 1000)
}

const initializePage = async () => {
  loading.value = true
  errorMessage.value = ''
  tickets.value = []

  try {
    const contractId =
      decodeContractId(
        route.params.id
      )

    contractData.value =
      await fetchContractDetails(
        contractId
      )

    await processContractTickets(
      contractData.value
    )
  } catch (error: any) {
    console.error(
      'Download ticket error:',
      error
    )

    errorMessage.value =
      error?.data?.message ||
      error?.data?.title ||
      error?.message ||
      'خطای غیرمنتظره‌ای رخ داده است.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initializePage()
})
</script>
<style>
@media print {
  @page {
    size: A4 landscape;
    margin: 7mm;
  }

  
 
  
}
</style>