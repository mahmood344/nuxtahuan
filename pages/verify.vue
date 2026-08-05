<template>
  <div
    class="min-h-screen bg-gray-100 pb-24  md:bg-white md:pb-10"
    dir="rtl"
  >
    <!-- هدر و استپر -->
    <header
      class="relative -mt-10 hidden h-[97px] w-full bg-secondary md:block"
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
          :active-step="verifyActiveStep"
          active-color="#1a237e"
        />
      </div>
    </header>

    <main
      class="mx-auto mt-6 w-full max-w-7xl px-4 md:mt-[100px]"
    >
      <div
        class="mx-auto w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-md"
      >
        <!-- ۱. حالت در حال بارگذاری -->
        <div
          v-if="loading"
          class="py-8 text-center"
        >
          <div
            class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
          ></div>

          <p class="text-lg font-medium text-gray-700">
            در حال بررسی وضعیت پرداخت و صدور بلیت...
          </p>

          <p class="mt-2 text-sm text-gray-400">
            لطفاً صفحه را نبندید یا بارگذاری مجدد نکنید.
          </p>
        </div>

        <!-- ۲. حالت خطای پرداخت بانکی -->
        <div
          v-else-if="statusStep === 'BANK_FAILED'"
          class="text-center"
        >
          <div class="mb-4 text-5xl">
            ❌
          </div>

          <h1 class="mb-2 text-xl font-bold text-red-600">
            پرداخت ناموفق بود
          </h1>

          <p class="mb-4 text-gray-700">
            {{ errorMessage }}
          </p>

          <div
            v-if="isBankPayment"
            class="space-y-2 rounded-lg bg-red-50 p-4 text-right text-sm text-gray-700"
          >
            <p>
              <b>نوع پرداخت:</b>
              {{ getPaymentTypeLabel(paymentInfo?.type) }}
            </p>

            <p v-if="paymentInfo?.payableAmount">
              <b>مبلغ تراکنش:</b>
              {{ formatPrice(paymentInfo.payableAmount) }}
              ریال
            </p>

            <p v-if="paymentInfo?.contractId">
              <b>شناسه قرارداد:</b>
              {{ paymentInfo.contractId }}
            </p>
          </div>
        </div>

        <!-- ۳. حالت خطای صدور بلیت -->
        <div
          v-else-if="statusStep === 'ISSUE_FAILED'"
          class="text-center"
        >
          <div class="mb-4 text-5xl">
            ⚠️
          </div>

          <h1 class="mb-2 text-xl font-bold text-orange-600">
            خطا در صدور بلیت
          </h1>

          <p class="mb-4 text-gray-700">
            {{ errorMessage }}
          </p>

          <div
            class="mb-4 rounded-lg bg-orange-50 p-4 text-right text-sm text-gray-700"
          >
            <p
              v-if="isBankPayment"
              class="font-semibold leading-relaxed text-orange-800"
            >
              توجه: پرداخت شما با موفقیت انجام شده است اما در فرآیند صدور بلیت خطایی رخ داد. جهت پیگیری با پشتیبانی تماس بگیرید.
            </p>

            <p
              v-else
              class="font-semibold leading-relaxed text-orange-800"
            >
              توجه: فرآیند صدور بلیت با خطا مواجه شد. لطفاً جهت بررسی یا صدور دستی با پشتیبانی تماس بگیرید.
            </p>
          </div>
        </div>

        <!-- ۴. حالت موفقیت کامل -->
        <div
          v-else-if="statusStep === 'SUCCESS'"
          class="text-center"
        >
          <div class="mb-4 text-5xl">
            ✅
          </div>

          <h1 class="mb-2 text-xl font-bold text-green-600">
            خرید و صدور بلیت با موفقیت انجام شد
          </h1>

          <p class="mb-6 text-gray-700">
            بلیت شما با موفقیت صادر گردید.
          </p>

          <!-- اطلاعات پرواز صادر شده -->
          <div
            v-if="contractData"
            class="mb-6 rounded-2xl border border-green-100 bg-green-50 p-5 text-center"
          >
            <div
              v-for="(flight,index) in contractData.contractFlights"
              :key="flight?.id || index"
              class="border-b border-green-200 py-4 first:pt-0 last:border-0 last:pb-0"
            >
              <div
                v-if="contractData.contractFlights.length > 1"
                class="mb-3"
              >
                <span
                  class="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700"
                >
                  {{ index === 0 ? 'پرواز رفت' : 'پرواز برگشت' }}
                </span>
              </div>

              <p class="text-base font-bold text-gray-800">
                از
                {{ getCityNameFromStore(flight.origin) }}
                به
                {{ getCityNameFromStore(flight.destination) }}
              </p>

              <p class="mt-2 text-sm text-gray-700">
                شماره پرواز:
                <span
                  dir="ltr"
                  class="font-bold text-gray-900"
                >
                  {{ toPersianDigits(flight.flightNumber) }}
                </span>
              </p>

              <p class="mt-2 text-sm text-gray-700">
                روز پرواز:
                <span class="font-bold text-gray-900">
                  {{ getPersianFlightDate(flight.depDate) }}
                </span>
              </p>

              <p class="mt-2 text-sm text-gray-700">
                ساعت پرواز:
                <span
                  dir="ltr"
                  class="font-bold text-gray-900"
                >
                  {{ getPersianFlightTime(flight.depTime) }}
                </span>
              </p>
            </div>
          </div>

          <!-- دکمه دانلود بلیت -->
          <div class="flex justify-center">
            <NuxtLink
              v-if="contractData?.id"
              :to="getDownloadTicketRoute(contractData.id)"
              class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition duration-200 hover:bg-blue-700"
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
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>

              دانلود بلیت
            </NuxtLink>
          </div>
        </div>

        <!-- وضعیت نامشخص -->
        <div
          v-else
          class="py-8 text-center text-gray-600"
        >
          وضعیت عملیات مشخص نیست.
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useFlightStore } from '~/stores/flights'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from '#app'
const flightStore = useFlightStore()
definePageMeta({
  name: 'verify'
})

type PaymentType = 'agency' | 'travelcard' | 'travelcard-gateway' | 'gateway'

type PaymentSession = {
  contractId: number
  type: PaymentType
  totalPrice: number
  payableAmount: number
  travelCardUsed: boolean
  travelCardAmount: number
  travelCardNumber: string
  email?: string
  mobile?: string
  travelType?: string
}
const travelType = computed(() => {
  const value = String(
    paymentInfo.value?.travelType ||
    route.query.travelType ||
    'one-way'
  )
    .trim()
    .toLowerCase()

  return value === 'round-trip'
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

const verifyActiveStep = computed(() => {
  return flightSteps.value.length - 1
})
const route = useRoute()
const loading = ref(true)
const errorMessage = ref('')
const paymentInfo = ref<PaymentSession | null>(null)
const contractData = ref<any>(null)

const statusStep = ref<'PENDING' | 'BANK_FAILED' | 'ISSUE_FAILED' | 'SUCCESS'>('PENDING')
const PAYMENT_SESSION_KEY = 'flight_payment_session'

// محاسبه بررسی اینکه آیا پرداخت از نوع درگاه بانکی است یا خیر
const isBankPayment = computed(() => {
  const type = paymentInfo.value?.type
  return type === 'gateway' || type === 'travelcard-gateway'
})

const formatPrice = (value: number) =>
  new Intl.NumberFormat('fa-IR').format(Number(value || 0))

const getPaymentTypeLabel = (type?: PaymentType) => {
  if (!type) return ''
  const labels: Record<PaymentType, string> = {
    agency: 'اعتباری آژانس',
    travelcard: 'سفر کارت',
    'travelcard-gateway': 'ترکیبی (سفرکارت + درگاه)',
    gateway: 'درگاه بانکی'
  }
  return labels[type] || type
}

const getPaymentSession = (): PaymentSession | null => {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(PAYMENT_SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const fetchContractDetails = async (contractId: number) => {
  try {
    const response = await $fetch<any>(`https://api.ahuan.ir/api/Contract/${contractId}`, {
      method: 'GET'
    })
    return response?.data || response
  } catch (error) {
    console.error('Error fetching contract details:', error)
    throw new Error('خطا در دریافت اطلاعات قرارداد از سرور.')
  }
}

const verifyBank = async (bankParams: {
  systemTraceAuditNumber: string
  retrievalReferenceNumber: string
  token: string
}) => {
  return await $fetch<any>('https://test.ahuan.ir/api/Tejarat/Verify', {
    method: 'POST',
    body: bankParams
  })
}



type FlightIssueStatus = {
  flightId: number | string | null
  success: boolean
  message?: string
}

type FlightSmsResult = {
  flightId: number | string | null
  flightNumber: string
  issueSucceeded: boolean
  smsSent: boolean
  error: string
  response: any
}
const toPersianDigits = (
  value: unknown
): string => {
  return String(value || '-')
    .replace(/\d/g, (digit) =>
      '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]
    )
}

const getPersianFlightTime = (
  timeValue: unknown
): string => {
  const value = String(
    timeValue || ''
  ).trim()

  if (!value) {
    return '-'
  }

  const normalizedTime =
    value.includes('T')
      ? value.split('T')[1]
      : value.includes(' ')
        ? value.split(' ')[1]
        : value

  const [hour = '', minute = ''] =
    normalizedTime.split(':')

  if (!hour || !minute) {
    return toPersianDigits(value)
  }

  return toPersianDigits(
    `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
  )
}
const getCityNameFromStore = (cityCode: unknown): string => {
  const code = String(cityCode || '').trim().toUpperCase()

  if (!code) return '-'

  const cities = [
    ...(Array.isArray(flightStore.popularCities) ? flightStore.popularCities : []),
    ...(Array.isArray(flightStore.iranAirports) ? flightStore.iranAirports : [])
  ]

  const city = cities.find((item: any) => {
    const itemCityCode = String(item?.cityCode || '').trim().toUpperCase()
    const itemIataCode = String(item?.iataCode || '').trim().toUpperCase()

    return itemCityCode === code || itemIataCode === code
  })

  return String(city?.cityNicName || city?.nicName || code).trim()
}
const getAirlineNameFromStore = (
  airlineCode: unknown
): string => {
  const code = String(
    airlineCode || ''
  )
    .trim()
    .toUpperCase()

  if (!code) {
    return ''
  }

  const airlines =
    Array.isArray(flightStore.airlines)
      ? flightStore.airlines
      : []

  const airline =
    airlines.find(
      (item: any) =>
        String(item?.code || '')
          .trim()
          .toUpperCase() === code
    )

  return String(
    airline?.name || ''
  ).trim()
}
const getPersianFlightDate = (
  dateValue: unknown
): string => {
  const value = String(
    dateValue || ''
  ).trim()

  if (!value) {
    return '-'
  }

  const datePart =
    value.split('T')[0]
      .split(' ')[0]

  const date = new Date(
    `${datePart}T00:00:00`
  )

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return toPersianDigits(
      datePart
    )
  }

  return date.toLocaleDateString(
    'fa-IR',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  )
}

const encodeContractId = (contractId: number | string): string => {
  const value = String(contractId || '').trim()

  if (!value || typeof window === 'undefined') return ''

  return window.btoa(value)
}

const buildFlightSmsText = (
  contract: any,
  flight: any,
  issueSucceeded: boolean
): string => {
  const passengers =
    Array.isArray(
      contract?.contractPassengers
    )
      ? contract.contractPassengers
      : []

  const ticketWord =
    passengers.length === 1
      ? 'بلیت'
      : 'بلیت‌های'

  /*
   * ابتدا کد ایرلاین از اطلاعات پرواز گرفته می‌شود.
   * اگر فقط airlineId موجود باشد، کد از airlineIdMap
   * استور استخراج خواهد شد.
   */
  const airlineCode = String(
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

  /*
   * نام فارسی ایرلاین بر اساس کد از
   * flightStore.airlines خوانده می‌شود.
   */
  const airlineName =
    getAirlineNameFromStore(
      airlineCode
    ) ||
    String(
      flight?.airlineNameFarsi ||
      flight?.airlineName ||
      airlineCode ||
      'ایرلاین'
    ).trim()

  const flightNumber = String(
    flight?.flightNumber || '-'
  ).trim()

  const flightDate =
    getPersianFlightDate(
      flight?.depDate
    )

  const flightTime = String(
    flight?.depTime || '-'
  ).trim()

  const origin =
    getCityNameFromStore(
      flight?.origin
    )

  const destination =
    getCityNameFromStore(
      flight?.destination
    )

  const pnr = String(
    flight?.pnr || '-'
  ).trim()

  const encodedContractId =
    encodeContractId(
      contract?.id
    )

  const ticketUrl =
    `https://ahuan.ir/downloadticket/${encodedContractId}`

  if (issueSucceeded) {
    return `مسافر گرامی،
احتراماً به اطلاع می‌رساند که ${ticketWord} شما در پرواز هواپیمایی ${airlineName} به شماره ${flightNumber} مورخ ${flightDate} ساعت ${flightTime} از ${origin} به ${destination} صادر گردید.

لینک دریافت بلیت:
${ticketUrl}

کد رزرو: ${pnr}
با آرزوی سفری خوش
شرکت خدمات مسافرتی آهوان`
  }

  return `مسافر گرامی،
احتراماً به اطلاع می‌رساند که صدور ${ticketWord} شما در پرواز هواپیمایی ${airlineName} به شماره ${flightNumber} مورخ ${flightDate} ساعت ${flightTime} از ${origin} به ${destination} با موفقیت انجام نشد.

کد رزرو: ${pnr}
موضوع توسط کارشناسان آهوان در حال پیگیری است.
شرکت خدمات مسافرتی آهوان`
}

const sendContractFlightsSms = async (
  contract: any,
  flightIssueStatuses: FlightIssueStatus[] = []
): Promise<FlightSmsResult[]> => {
  const flights = Array.isArray(contract?.contractFlights)
    ? contract.contractFlights
    : []

  if (flights.length === 0) return []

  const mobile = String(
    contract?.userName ||
    contract?.mobile ||
    contract?.contactMobile ||
    paymentInfo.value?.mobile ||
    ''
  ).trim()

  if (!mobile) {
    throw new Error('شماره موبایل قرارداد مشخص نیست.')
  }

  const results: FlightSmsResult[] = []

  for (const flight of flights) {
    const matchedStatus = flightIssueStatuses.find(
      (item) => String(item?.flightId) === String(flight?.id)
    )

    const issueSucceeded = matchedStatus
      ? matchedStatus.success === true
      : String(contract?.ticketStatus || '').trim().toLowerCase() === 'confirm'

    const smsText = buildFlightSmsText(contract, flight, issueSucceeded)

    const result: FlightSmsResult = {
      flightId: flight?.id ?? null,
      flightNumber: String(flight?.flightNumber || '').trim(),
      issueSucceeded,
      smsSent: false,
      error: '',
      response: null
    }

    try {
      /*
       * آدرس و Body زیر را در صورت تفاوت، با API واقعی پیامک پروژه هماهنگ کن.
       */
      const response = await $fetch<any>(
        'https://api.ahuan.ir/api/Auth/Send-Sms',
        {
          method: 'POST',
          body: {
            mobile,
            sms: smsText
          }
        }
      )

      if (response?.success === false || response?.error) {
        throw new Error(
          response?.message ||
          'سرویس پیامک، ارسال را ناموفق اعلام کرد.'
        )
      }

      result.smsSent = true
      result.response = response
    } catch (error: any) {
      result.error =
        error?.data?.message ||
        error?.data?.title ||
        error?.message ||
        'خطا در ارسال پیامک'
      result.response = error?.data || null
    }

    results.push(result)
  }

  console.log('Contract flight SMS results:', JSON.stringify(results, null, 2))

  return results
}
const maskTravelCard=(value:unknown):string=>{
  const card=String(value||'').trim()
  return card.length<=4?card:`****${card.slice(-4)}`
}

const createPaymentSnapshot=(
  session:PaymentSession
):FlightProcessDocument['payment']=>({
  type:session.type,
  contractTotal:Math.floor(Number(session.totalPrice||0)),
  bankAmount:Math.floor(Number(session.payableAmount||0)),
  travelCardUsed:session.travelCardUsed===true,
  travelCardAmount:Math.floor(Number(session.travelCardAmount||0)),
  travelCardNumber:maskTravelCard(session.travelCardNumber),
  recordedAt:new Date().toISOString()
})

const readFlightDocument=(
  flight:any,
  session:PaymentSession
):FlightProcessDocument=>{
  try{
    const parsed=JSON.parse(String(flight?.flightJson||''))

    if(
      parsed&&
      !Array.isArray(parsed)&&
      parsed.version===1&&
      parsed.issue
    ){
      return{
        ...parsed,
        payment:parsed.payment||createPaymentSnapshot(session)
      }
    }

    /*
     * سازگاری با flightJson قدیمی:
     * [{"Tickets":"..."}]
     */
    if(Array.isArray(parsed)){
      const ticketNumbers=parsed
        .map((x:any)=>String(x?.Tickets||'').trim())
        .filter(Boolean)

      return{
        version:1,
        payment:createPaymentSnapshot(session),
        issue:{
          provider:String(flight?.flightSupplier||'').trim().toUpperCase(),
          status:ticketNumbers.length?'success':'pending',
          pnr:String(flight?.pnr||'').trim(),
          ticketNumbers,
          message:'',
          response:parsed,
          attemptedAt:new Date().toISOString()
        },
        updatedAt:new Date().toISOString()
      }
    }
  }catch{}

  return{
    version:1,
    payment:createPaymentSnapshot(session),
    issue:{
      provider:String(flight?.flightSupplier||'').trim().toUpperCase(),
      status:'pending',
      pnr:String(flight?.pnr||'').trim(),
      ticketNumbers:[],
      message:'',
      response:null,
      attemptedAt:new Date().toISOString()
    },
    updatedAt:new Date().toISOString()
  }
}

const writeFlightDocument=(
  flight:any,
  document:FlightProcessDocument
)=>{
  document.updatedAt=new Date().toISOString()
  flight.flightJson=JSON.stringify(document)
}
const applyPaymentToFlightJson=(
  contract:any,
  session:PaymentSession
)=>{
  const flights=Array.isArray(contract?.contractFlights)
    ?contract.contractFlights
    :[]

  for(const flight of flights){
    const document=readFlightDocument(flight,session)
    document.payment=createPaymentSnapshot(session)
    writeFlightDocument(flight,document)
  }
}
const issueContractBySupplier = async (contract: any) => {
  const contractId = Number(contract?.id || 0)

  const flights = Array.isArray(contract?.contractFlights)
    ? contract.contractFlights
    : []

  if (!contractId) {
    throw new Error('شناسه قرارداد معتبر نیست.')
  }

  if (flights.length === 0) {
    throw new Error('پروازی در این قرارداد یافت نشد.')
  }

  const suppliers = flights.map((flight: any) =>
    String(flight?.flightSupplier || '')
      .trim()
      .toUpperCase()
  )

  const hasNira = suppliers.includes('NIRA')
  const hasMahan = suppliers.includes('MAHAN')

  /*
   * صدور پروازهای نیرا
   */
  if (hasNira) {
    const session = getPaymentSession()

    const emailAddress = String(
      session?.email ||
      contract?.contactEmail ||
      contract?.email ||
      'info@ahuan.ir'
    ).trim()

    const niraFlights = flights.filter(
      (flight: any) =>
        String(flight?.flightSupplier || '')
          .trim()
          .toUpperCase() === 'NIRA'
    )

    const issueResults: Array<{
      flightId: number | string | null
      flightNumber: string
      airlineCode: string
      pnr: string
      success: boolean
      tickets: Array<{
        Tickets: string
      }>
      message: string
      raw: any
    }> = []

    /*
     * هر پرواز نیرا جداگانه Issue می‌شود.
     */
    for (const flight of niraFlights) {
      const airlineCode = String(
        flight?.airlineIataCode ||
        flightStore.getAirlineCode(
          Number(flight?.airlineId || 0)
        ) ||
        ''
      )
        .trim()
        .toUpperCase()

      const pnr = String(
        flight?.pnr || ''
      ).trim()

      const issueResult = {
        flightId: flight?.id ?? null,

        flightNumber: String(
          flight?.flightNumber || ''
        ).trim(),

        airlineCode,

        pnr,

        success: false,

        tickets: [] as Array<{
          Tickets: string
        }>,

        message: '',

        raw: null as any
      }

      if (!airlineCode) {
        issueResult.message =
          'کد ایرلاین پرواز مشخص نیست.'

        issueResults.push(issueResult)
        continue
      }

      if (!pnr) {
        issueResult.message =
          'PNR پرواز مشخص نیست.'

        issueResults.push(issueResult)
        continue
      }

      try {
        const response = await $fetch<any>(
          'https://api.ahuan.ir/api/Nira/ETIssue',
          {
            method: 'GET',

            query: {
              AirLine: airlineCode,
              PNR: pnr,
              Email: emailAddress
            }
          }
        )

        /*
         * پاسخ ممکن است Object، data یا string باشد.
         */
        let responseValue: any = response

        if (
          responseValue &&
          typeof responseValue === 'object' &&
          responseValue.data !== undefined
        ) {
          responseValue = responseValue.data
        }

        let parsedResponse: any = null

        let validTickets: Array<{
          Tickets: string
        }> = []

        /*
         * یکسان‌سازی متن شماره بلیت‌ها.
         */
        const normalizeTickets = (
          value: unknown
        ): string => {
          return String(value || '')
            .replace(/\\r/g, ' ')
            .replace(/\\n/g, ' ')
            .replace(/\r/g, ' ')
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
        }

        /*
         * استخراج شماره‌بلیت از Object.
         */
        const extractTickets = (
          value: any
        ): Array<{ Tickets: string }> => {
          const ticketItems = Array.isArray(
            value?.AirNRSTICKETS
          )
            ? value.AirNRSTICKETS
            : []

          return ticketItems
            .map((item: any) => ({
              Tickets: normalizeTickets(
                item?.Tickets
              )
            }))
            .filter(
              (item: { Tickets: string }) =>
                item.Tickets.length > 0
            )
        }

        /*
         * پاسخ Object.
         */
        if (
          responseValue &&
          typeof responseValue === 'object'
        ) {
          parsedResponse = responseValue

          validTickets =
            extractTickets(parsedResponse)
        }

        /*
         * پاسخ string.
         */
        if (typeof responseValue === 'string') {
          const rawResponse =
            responseValue.trim()

          try {
            /*
             * حالت JSON string معتبر.
             */
            parsedResponse =
              JSON.parse(rawResponse)

            validTickets =
              extractTickets(parsedResponse)
          } catch {
            /*
             * حالت JSON نامعتبر به‌علت newline واقعی
             * داخل مقدار Tickets.
             */
            const ticketsMatch =
              rawResponse.match(
                /"Tickets"\s*:\s*"([\s\S]*?)"\s*}/i
              )

            const ticketsText =
              normalizeTickets(
                ticketsMatch?.[1] || ''
              )

            if (ticketsText) {
              validTickets = [
                {
                  Tickets: ticketsText
                }
              ]
            }

            const messageMatch =
              rawResponse.match(
                /"Message"\s*:\s*"([\s\S]*?)"\s*}/i
              )

            parsedResponse = {
              AirNRSTICKETS:
                validTickets,

              Message: String(
                messageMatch?.[1] || ''
              ).trim(),

              raw:
                rawResponse
            }
          }
        }

        /*
         * تنها ملاک موفقیت وجود Tickets غیرخالی است.
         */
        issueResult.success =
          validTickets.some(
            (item) =>
              String(
                item?.Tickets || ''
              ).trim().length > 0
          )

        issueResult.tickets =
          validTickets

        issueResult.message =
          String(
            parsedResponse?.Message ||
            parsedResponse?.message ||
            ''
          ).trim()

        issueResult.raw =
          parsedResponse

        issueResults.push(issueResult)
      } catch (error: any) {
        issueResult.success = false

        issueResult.message =
          error?.data?.message ||
          error?.data?.title ||
          error?.message ||
          'خطا در ارتباط با سرویس صدور نیرا'

        issueResult.raw =
          error?.data || null

        issueResults.push(issueResult)
      }
    }

    /*
     * ثبت نتیجه Issue داخل flightJson همان پرواز.
     */
    for (const flight of contract.contractFlights) {
      const flightIssueResult =
        issueResults.find(
          (result) =>
            String(result.flightId) ===
            String(flight?.id)
        )

      if (!flightIssueResult) {
        continue
      }

    if(!session){
  throw new Error(
    'اطلاعات پرداخت برای ثبت نتیجه صدور یافت نشد.'
  )
}

const document=readFlightDocument(
  flight,
  session
)

document.issue={
  provider:String(
    flight?.flightSupplier||'NIRA'
  ).trim().toUpperCase(),
  status:flightIssueResult.success
    ?'success'
    :'failed',
  pnr:String(
    flightIssueResult.pnr||
    flight?.pnr||
    ''
  ).trim(),
  ticketNumbers:Array.isArray(
    flightIssueResult.tickets
  )
    ?flightIssueResult.tickets
      .map((x:any)=>
        String(x?.Tickets||'').trim()
      )
      .filter(Boolean)
    :[],
  message:String(
    flightIssueResult.message||''
  ).trim(),
  response:flightIssueResult.raw,
  attemptedAt:new Date().toISOString()
}

writeFlightDocument(
  flight,
  document
)
    }

    /*
     * تمام پروازهای نیرا باید شماره‌بلیت داشته باشند.
     */
    const allFlightsIssued =
      niraFlights.length > 0 &&
      issueResults.length ===
        niraFlights.length &&
      issueResults.every(
        (result) =>
          result.success === true &&
          Array.isArray(result.tickets) &&
          result.tickets.some(
            (ticket) =>
              String(
                ticket?.Tickets || ''
              ).trim().length > 0
          )
      )

    const finalStatus =
      allFlightsIssued
        ? 'confirm'
        : 'incomplete'

    /*
     * خود contract مستقیماً تغییر داده می‌شود.
     */
    contract.ticketStatus =
      finalStatus

    contract.confirmStatus =
      finalStatus

    /*
     * این فیلدها در بک‌اند Nullable<byte> هستند.
     */
    contract.reduceFlightLoad =
      null

    contract.reduceHotelLoad =
      null

    console.log(
      'NIRA issue results:',
      JSON.stringify(
        issueResults,
        null,
        2
      )
    )

    console.log(
      'Contract before update:',
      {
        id:
          contract.id,

        ticketStatus:
          contract.ticketStatus,

        confirmStatus:
          contract.confirmStatus,

        reduceFlightLoad:
          contract.reduceFlightLoad,

        reduceHotelLoad:
          contract.reduceHotelLoad,

        contractFlights:
          contract.contractFlights.map(
            (flight: any) => ({
              id:
                flight?.id,

              flightNumber:
                flight?.flightNumber,

              pnr:
                flight?.pnr,

              flightJson:
                flight?.flightJson
            })
          )
      }
    )

    /*
     * خود contract مستقیماً ارسال می‌شود.
     *
     * ساختار ارسالی:
     * {
     *   id: ...,
     *   ticketStatus: ...,
     *   confirmStatus: ...,
     *   contractFlights: ...
     * }
     *
     * نه:
     * {
     *   updatedContract: { ... }
     * }
     */
    

    return{
  success:allFlightsIssued,
  ticketStatus:finalStatus,
  confirmStatus:finalStatus,
  issueResults,
  contract
}
  }

  /*
   * صدور ماهان
   */
  if (hasMahan) {
    const response =
      await $fetch<any>(
        'https://api.ahuan.ir/api/Mahan/Issue',
        {
          method: 'POST',

          body: {
            contractId
          }
        }
      )

    if (
      response?.success === false ||
      response?.error
    ) {
      throw new Error(
        response?.message ||
        'خطا در صدور پرواز ماهان'
      )
    }

    return {
      success: true,

      ticketStatus:
        contract?.ticketStatus,

      confirmStatus:
        contract?.confirmStatus,

      issueResults: [],

      response
    }
  }

  /*
   * صدور سایر تأمین‌کننده‌ها
   */
  const response =
    await $fetch<any>(
      'https://api.ahuan.ir/api/Flight/Issue',
      {
        method: 'POST',

        body: {
          contractId
        }
      }
    )

  if (
    response?.success === false ||
    response?.error
  ) {
    throw new Error(
      response?.message ||
      'خطا در صدور عمومی بلیت'
    )
  }

  return {
    success: true,

    ticketStatus:
      contract?.ticketStatus,

    confirmStatus:
      contract?.confirmStatus,

    issueResults: [],

    response
  }
}

type SafarCardUpdateResult = {
  attempted: boolean
  success: boolean
  response: any
  error: string
}

const updateSafarCardAfterIssue=async(
  session:PaymentSession,
  contract:any,
  amountToUse:number
):Promise<SafarCardUpdateResult>=>{
  const cardNumber=String(
    session?.travelCardNumber||''
  ).trim()

  const amount=Math.floor(
    Number(amountToUse||0)
  )

  if(
    session?.travelCardUsed!==true||
    !cardNumber||
    !Number.isFinite(amount)||
    amount<=0
  ){
    return{
      attempted:false,
      success:true,
      response:null,
      error:''
    }
  }

  const contractId=Number(
    contract?.id||
    session?.contractId||
    0
  )

  try{
    const response=await $fetch<any>(
      'https://api.ahuan.ir/api/SafarCard/update',
      {
        method:'PUT',
        body:{
          cardNumber,
          amount,
          description:
            `کسر اعتبار سفرکارت بابت بخش صادرشده قرارداد شماره ${contractId}`
        },
        headers:{
          'Content-Type':'application/json'
        }
      }
    )

    const success=
      response===true||
      response?.data===true||
      response?.success===true

    return{
      attempted:true,
      success,
      response,
      error:success
        ?''
        :'سرویس سفرکارت عملیات کسر اعتبار را ناموفق اعلام کرد.'
    }
  }catch(error:any){
    return{
      attempted:true,
      success:false,
      response:error?.data||null,
      error:
        error?.data?.message||
        error?.data?.title||
        error?.message||
        'خطا در کسر اعتبار سفرکارت'
    }
  }
}
type BankPaymentDetails={
  amount:number
  rrn:string
  traceNo:string
  paymentId:string
  token:string
}

type PaymentSettlement={
  contractTotal:number
  successfulAmount:number
  failedAmount:number
  bankPaid:number
  travelCardPaid:number
  bankUsed:number
  travelCardUsed:number
  bankRefund:number
  travelCardUnused:number
}

type RefundResult={
  attempted:boolean
  success:boolean
  amount:number
  response:any
  error:string
}
type ProcessStatus='not-required'|'pending'|'success'|'failed'|'unknown'

type FlightProcessDocument={
  version:1
  payment:{
    type:PaymentType
    contractTotal:number
    bankAmount:number
    travelCardUsed:boolean
    travelCardAmount:number
    travelCardNumber:string
    recordedAt:string
  }
  issue:{
    provider:string
    status:'pending'|'success'|'failed'|'unknown'
    pnr:string
    ticketNumbers:string[]
    message:string
    response:any
    attemptedAt:string
  }
  refund?:{
    status:ProcessStatus
    amount:number
    response:any
    error:string
    attemptedAt:string
  }
  safarCard?:{
    status:ProcessStatus
    deductedAmount:number
    response:any
    error:string
    attemptedAt:string
  }
  updatedAt:string
}

type ContractSaveResult={
  success:boolean
  contract:any
  error:string
  step:string
}
const getBankPaymentDetails=(
  session:PaymentSession
):BankPaymentDetails=>{
  return{
    amount:Math.floor(
      Number(
        route.query.amount||
        session?.payableAmount||
        0
      )
    ),

    rrn:String(
      route.query.rrn||
      route.query.retrievalReferenceNumber||
      ''
    ).trim(),

    traceNo:String(
      route.query.traceNo||
      route.query.systemTraceAuditNumber||
      ''
    ).trim(),

    paymentId:String(
      route.query.paymentId||
      ''
    ).trim(),

    token:String(
      route.query.token||
      ''
    ).trim()
  }
}
const updateContract=async(
  contract:any
):Promise<any>=>{
  contract.reduceFlightLoad=null
  contract.reduceHotelLoad=null

  const response=await $fetch<any>(
    'https://api.ahuan.ir/api/Contract/update',
    {
      method:'PUT',
      body:contract,
      headers:{
        'Content-Type':'application/json'
      }
    }
  )

  if(response?.success===false||response?.error){
    throw new Error(
      response?.message||
      'ذخیره اطلاعات قرارداد ناموفق بود.'
    )
  }

  return response?.data||response||contract
}
const failedSaveSteps=ref<string[]>([])

const trySaveContractStep=async(
  contract:any,
  step:string
):Promise<ContractSaveResult>=>{
  try{
    const updatedContract=await updateContract(contract)

    return{
      success:true,
      contract:updatedContract,
      error:'',
      step
    }
  }catch(error:any){
    const message=
      error?.data?.message||
      error?.data?.title||
      error?.message||
      'خطا در ذخیره قرارداد'

    if(!failedSaveSteps.value.includes(step)){
      failedSaveSteps.value.push(step)
    }

    console.error(
      `Contract update failed at ${step}:`,
      error
    )

    /*
     * همان contract تغییرکرده برمی‌گردد؛
     * اطلاعات روی حافظه باقی می‌ماند.
     */
    return{
      success:false,
      contract,
      error:message,
      step
    }
  }
}
const verifyAndApplyBankPayment=async(
  session:PaymentSession,
  contract:any
):Promise<any>=>{
  const bankCode=String(
    route.query.code||''
  ).trim()

  if(bankCode==='17'){
    statusStep.value='BANK_FAILED'

    throw new Error(
      'عملیات پرداخت به‌علت انصراف از خرید لغو شد.'
    )
  }

  if(bankCode!=='00'){
    statusStep.value='BANK_FAILED'

    throw new Error(
      'عملیات پرداخت توسط بانک موفق اعلام نشد.'
    )
  }

  const bank=
    getBankPaymentDetails(
      session
    )

  if(
    !bank.rrn||
    !bank.traceNo||
    !bank.token||
    !bank.paymentId
  ){
    statusStep.value='BANK_FAILED'

    throw new Error(
      'پارامترهای بازگشتی بانک کامل نیست.'
    )
  }

  let verifyResponse:any

  try{
    verifyResponse=
      await verifyBank({
        systemTraceAuditNumber:
          bank.traceNo,

        retrievalReferenceNumber:
          bank.rrn,

        token:
          bank.token
      })
  }catch{
    statusStep.value='BANK_FAILED'

    throw new Error(
      'خطا در ارتباط با سرور برای تأیید تراکنش بانکی.'
    )
  }

  const verified=
    verifyResponse===true||
    verifyResponse?.data===true||
    verifyResponse?.success===true||
    verifyResponse?.verified===true

  if(!verified){
    statusStep.value='BANK_FAILED'

    throw new Error(
      'تراکنش بانکی توسط بانک تأیید نشد.'
    )
  }

  /*
   * ساختار موردنظر:
   * amount-rrn-traceNo-paymentId
   */
  contract.paymentId=[
  bank.amount,
  bank.rrn,
  bank.traceNo,
  bank.paymentId
].join('-')

applyPaymentToFlightJson(
  contract,
  session
)

return contract
}
const calculatePaymentSettlement=(
  session:PaymentSession,
  contract:any,
  issueResults:any[]
):PaymentSettlement=>{
  const flights=Array.isArray(
    contract?.contractFlights
  )
    ?contract.contractFlights
    :[]

  const departurePrice=Math.max(
    Number(contract?.totalPrice||0),
    0
  )

  const returnPrice=Math.max(
    Number(contract?.totalPrice2||0),
    0
  )

  const contractTotal=
    departurePrice+
    returnPrice

  if(
    !flights.length||
    contractTotal<=0
  ){
    throw new Error(
      'قیمت یا اطلاعات پروازهای قرارداد معتبر نیست.'
    )
  }

  let successfulAmount=0

  flights.forEach(
    (flight:any,index:number)=>{
      const price=
        index===0
          ?departurePrice
          :returnPrice

      const result=
        issueResults.find(
          (item:any)=>
            String(item?.flightId)===
            String(flight?.id)
        )

      if(result?.success===true){
        successfulAmount+=price
      }
    }
  )

  successfulAmount=Math.min(
    successfulAmount,
    contractTotal
  )

  const failedAmount=
    contractTotal-
    successfulAmount

  if(session.type==='agency'){
    return{
      contractTotal,
      successfulAmount,
      failedAmount,
      bankPaid:0,
      travelCardPaid:0,
      bankUsed:0,
      travelCardUsed:0,
      bankRefund:0,
      travelCardUnused:0
    }
  }

  const travelCardPaid=
    session.travelCardUsed
      ?Math.min(
          Math.max(
            Number(
              session.travelCardAmount||0
            ),
            0
          ),
          contractTotal
        )
      :0

  const bankPaid=Math.min(
    Math.max(
      Number(
        session.payableAmount||0
      ),
      0
    ),
    contractTotal-travelCardPaid
  )

  /*
   * پرداخت فقط سفرکارت
   */
  if(
    session.type==='travelcard'||
    bankPaid===0
  ){
    const travelCardUsed=Math.min(
      successfulAmount,
      travelCardPaid
    )

    return{
      contractTotal,
      successfulAmount,
      failedAmount,
      bankPaid:0,
      travelCardPaid,
      bankUsed:0,
      travelCardUsed,
      bankRefund:0,
      travelCardUnused:
        travelCardPaid-
        travelCardUsed
    }
  }

  /*
   * پرداخت فقط درگاه
   */
  if(
    session.type==='gateway'||
    travelCardPaid===0
  ){
    const bankUsed=Math.min(
      successfulAmount,
      bankPaid
    )

    return{
      contractTotal,
      successfulAmount,
      failedAmount,
      bankPaid,
      travelCardPaid:0,
      bankUsed,
      travelCardUsed:0,
      bankRefund:
        bankPaid-bankUsed,
      travelCardUnused:0
    }
  }

  /*
   * پرداخت ترکیبی:
   * تقسیم متناسب بین درگاه و سفرکارت
   */
  const bankRatio=
    bankPaid/contractTotal

  let bankUsed=Math.round(
    successfulAmount*
    bankRatio
  )

  bankUsed=Math.min(
    bankUsed,
    bankPaid,
    successfulAmount
  )

  const travelCardUsed=Math.min(
    successfulAmount-bankUsed,
    travelCardPaid
  )

  return{
    contractTotal,
    successfulAmount,
    failedAmount,
    bankPaid,
    travelCardPaid,
    bankUsed,
    travelCardUsed,
    bankRefund:Math.max(
      bankPaid-bankUsed,
      0
    ),
    travelCardUnused:Math.max(
      travelCardPaid-
      travelCardUsed,
      0
    )
  }
}
const getFailedFlightIds=(
  issueResults:any[]
):Set<string>=>{
  return new Set(
    issueResults
      .filter(x=>x?.success!==true)
      .map(x=>String(x?.flightId))
  )
}

const markRefundPending=(
  contract:any,
  session:PaymentSession,
  issueResults:any[],
  amount:number
)=>{
  const failedIds=getFailedFlightIds(issueResults)

  for(const flight of contract?.contractFlights||[]){
    if(!failedIds.has(String(flight?.id)))continue

    const document=readFlightDocument(flight,session)

    document.refund={
      status:'pending',
      amount:Math.floor(Number(amount||0)),
      response:null,
      error:'',
      attemptedAt:new Date().toISOString()
    }

    writeFlightDocument(flight,document)
  }
}

const applyRefundResultToFlightJson=(
  contract:any,
  session:PaymentSession,
  issueResults:any[],
  result:RefundResult
)=>{
  const failedIds=getFailedFlightIds(issueResults)

  for(const flight of contract?.contractFlights||[]){
    if(!failedIds.has(String(flight?.id)))continue

    const document=readFlightDocument(flight,session)

    document.refund={
      status:result.attempted
        ?result.success
          ?'success'
          :'failed'
        :'not-required',
      amount:result.amount,
      response:result.response,
      error:result.error,
      attemptedAt:new Date().toISOString()
    }

    writeFlightDocument(flight,document)
  }
}
const applySafarCardResultToFlightJson=(
  contract:any,
  session:PaymentSession,
  issueResults:any[],
  result:SafarCardUpdateResult,
  deductedAmount:number
)=>{
  const successfulIds=new Set(
    issueResults
      .filter(x=>x?.success===true)
      .map(x=>String(x?.flightId))
  )

  for(const flight of contract?.contractFlights||[]){
    if(!successfulIds.has(String(flight?.id)))continue

    const document=readFlightDocument(flight,session)

    document.safarCard={
      status:result.attempted
        ?result.success
          ?'success'
          :'failed'
        :'not-required',
      deductedAmount:Math.floor(
        Number(deductedAmount||0)
      ),
      response:result.response,
      error:result.error,
      attemptedAt:new Date().toISOString()
    }

    writeFlightDocument(flight,document)
  }
}
const refundBankPayment=async(
  contract:any,
  amount:number
):Promise<RefundResult>=>{
  const paymentId=String(
    contract?.paymentId||''
  ).trim()

 const[
  amountPart,
  rrnPart,
  traceNoPart,
  ...requestIdParts
]=paymentId.split('-')

const originalAmount=Number(
  amountPart||0
)

const rrn=String(
  rrnPart||''
).trim()

const traceNo=String(
  traceNoPart||''
).trim()

const requestId=requestIdParts
  .join('-')
  .trim()

  const refundAmount=Math.floor(
    Number(amount||0)
  )

  if(refundAmount<=0){
    return{
      attempted:false,
      success:true,
      amount:0,
      response:null,
      error:''
    }
  }

  if(
    !rrn||
    !traceNo||
    !requestId
  ){
    return{
      attempted:true,
      success:false,
      amount:refundAmount,
      response:null,
      error:
        'اطلاعات تراکنش بانکی برای استرداد کامل نیست.'
    }
  }

  if(
    originalAmount>0&&
    refundAmount>originalAmount
  ){
    return{
      attempted:true,
      success:false,
      amount:refundAmount,
      response:null,
      error:
        'مبلغ استرداد بیشتر از مبلغ پرداخت‌شده است.'
    }
  }

  try{
    const response=await $fetch<any>(
      'REFUND_API_URL',
      {
        method:'POST',
        body:{
          rrn,
          amount:refundAmount,
          stan:traceNo,
          terminal:'08102574',
          acceptor:'992180008102574',
          requestId,
          isSettled:false,
          checkdate:''
        },
        headers:{
          'Content-Type':'application/json'
        }
      }
    )

    const success=
      response===true||
      response?.data===true||
      response?.success===true

    return{
      attempted:true,
      success,
      amount:refundAmount,
      response,
      error:success
        ?''
        :response?.message||
          'استرداد بانکی ناموفق بود.'
    }
  }catch(error:any){
    return{
      attempted:true,
      success:false,
      amount:refundAmount,
      response:error?.data||null,
      error:
        error?.data?.message||
        error?.message||
        'خطا در استرداد وجه'
    }
  }
}
const processVerify=async()=>{
  loading.value=true
  errorMessage.value=''
  statusStep.value='PENDING'

  try{
    const session=
      getPaymentSession()

    if(!session){
      statusStep.value='BANK_FAILED'

      throw new Error(
        'اطلاعات پرداخت در مرورگر یافت نشد.'
      )
    }

    paymentInfo.value=session

    const contractId=Number(
      route.query.responseData||
      session.contractId
    )

    if(
      !Number.isFinite(contractId)||
      contractId<=0
    ){
      statusStep.value='BANK_FAILED'

      throw new Error(
        'شناسه قرارداد معتبر نیست.'
      )
    }

    contractData.value=
      await fetchContractDetails(
        contractId
      )

    /*
     * فقط پرداخت‌هایی که درگاه دارند
     * باید Verify شوند.
     */
    if(
      session.type==='gateway'||
      session.type==='travelcard-gateway'
    ){
     contractData.value=
  await verifyAndApplyBankPayment(
    session,
    contractData.value
  )

const verifySave=
  await trySaveContractStep(
    contractData.value,
    'bank-verify'
  )

contractData.value=
  verifySave.contract
    }

    /*
     * آژانسی و سفرکارت مستقیم
     * بدون Verify وارد Issue می‌شوند.
     */
    const issueResult=
      await issueContractBySupplier(
        contractData.value
      )

    contractData.value=
      issueResult?.contract||
      contractData.value
const issueSave=
  await trySaveContractStep(
    contractData.value,
    'flight-issue'
  )

contractData.value=
  issueSave.contract
    const issueResults=
      Array.isArray(
        issueResult?.issueResults
      )
        ?issueResult.issueResults
        :[]

    const settlement=
      calculatePaymentSettlement(
        session,
        contractData.value,
        issueResults
      )

    console.log(
      'Payment settlement:',
      settlement
    )

    let safarCardResult:
      SafarCardUpdateResult|null=null

    let refundResult:
      RefundResult|null=null

    /*
     * عملیات مالی براساس نوع پرداخت
     */
    switch(session.type){
      case'agency':
        /*
         * بدون Verify، سفرکارت و Refund
         */
        break

      case'travelcard':
  safarCardResult=
    await updateSafarCardAfterIssue(
      session,
      contractData.value,
      settlement.travelCardUsed
    )

  applySafarCardResultToFlightJson(
    contractData.value,
    session,
    issueResults,
    safarCardResult,
    settlement.travelCardUsed
  )

  {
    const save=await trySaveContractStep(
      contractData.value,
      'safar-card'
    )

    contractData.value=save.contract
  }
  break

     case'travelcard-gateway':
  safarCardResult=
    await updateSafarCardAfterIssue(
      session,
      contractData.value,
      settlement.travelCardUsed
    )

  applySafarCardResultToFlightJson(
    contractData.value,
    session,
    issueResults,
    safarCardResult,
    settlement.travelCardUsed
  )

  {
    const save=await trySaveContractStep(
      contractData.value,
      'safar-card'
    )

    contractData.value=save.contract
  }

  if(settlement.bankRefund>0){
    markRefundPending(
      contractData.value,
      session,
      issueResults,
      settlement.bankRefund
    )

    {
      const save=await trySaveContractStep(
        contractData.value,
        'refund-pending'
      )

      contractData.value=save.contract
    }

    refundResult=
      await refundBankPayment(
        contractData.value,
        settlement.bankRefund
      )

    applyRefundResultToFlightJson(
      contractData.value,
      session,
      issueResults,
      refundResult
    )

    {
      const save=await trySaveContractStep(
        contractData.value,
        'refund-result'
      )

      contractData.value=save.contract
    }
  }
  break

      case'gateway':
  if(settlement.bankRefund>0){
    markRefundPending(
      contractData.value,
      session,
      issueResults,
      settlement.bankRefund
    )

    {
      const save=await trySaveContractStep(
        contractData.value,
        'refund-pending'
      )

      contractData.value=save.contract
    }

    refundResult=
      await refundBankPayment(
        contractData.value,
        settlement.bankRefund
      )

    applyRefundResultToFlightJson(
      contractData.value,
      session,
      issueResults,
      refundResult
    )

    {
      const save=await trySaveContractStep(
        contractData.value,
        'refund-result'
      )

      contractData.value=save.contract
    }
  }
  break
    }
const finalSave=
  await trySaveContractStep(
    contractData.value,
    'final'
  )

contractData.value=
  finalSave.contract

if(!finalSave.success){
  statusStep.value='ISSUE_FAILED'

  throw new Error(
    'عملیات انجام شد اما ثبت نهایی اطلاعات قرارداد ناموفق بود. لطفاً عملیات پرداخت یا صدور را مجدداً اجرا نکنید و با پشتیبانی تماس بگیرید.'
  )
}

failedSaveSteps.value=[]
   console.log(
  'SafarCard result:',
  safarCardResult
)

console.log(
  'Refund result:',
  refundResult
)

/*
 * ذخیره نهایی تمام اطلاعات انباشته‌شده
 */


/*
 * پیامک هر پرواز مستقل ارسال می‌شود.
 */
try{
  await sendContractFlightsSms(
    contractData.value,
    issueResults
  )
}catch(smsError){
  console.error(
    'Error sending contract SMS:',
    smsError
  )
}

    /*
     * صدور ناقص یا کاملاً ناموفق
     */
    if(!issueResult?.success){
      statusStep.value='ISSUE_FAILED'

      const failedFlights=
        issueResults
          .filter(
            (item:any)=>
              item?.success!==true
          )
          .map(
            (item:any)=>
              String(
                item?.flightNumber||
                item?.pnr||
                ''
              ).trim()
          )
          .filter(Boolean)
          .join('، ')

      if(
        refundResult?.attempted&&
        !refundResult.success
      ){
        throw new Error(
          `صدور ${failedFlights||'یک یا چند پرواز'} ناموفق بود و استرداد بانکی نیز با خطا مواجه شد: ${refundResult.error}`
        )
      }

      if(
        safarCardResult?.attempted&&
        !safarCardResult.success
      ){
        throw new Error(
          `صدور ${failedFlights||'یک یا چند پرواز'} ناموفق بود و کسر سهم سفرکارت بخش موفق نیز با خطا مواجه شد: ${safarCardResult.error}`
        )
      }

      const messages:string[]=[
        `صدور ${failedFlights||'یک یا چند پرواز'} ناموفق بود.`
      ]

      if(refundResult?.amount){
        messages.push(
          `مبلغ ${formatPrice(refundResult.amount)} ریال برای استرداد بانکی ارسال شد.`
        )
      }

      if(settlement.travelCardUsed>0){
        messages.push(
          `مبلغ ${formatPrice(settlement.travelCardUsed)} ریال از سفرکارت بابت پرواز صادرشده کسر شد.`
        )
      }

      if(
        session.type==='travelcard'&&
        settlement.successfulAmount===0
      ){
        messages.push(
          'هیچ مبلغی از سفرکارت کسر نشد.'
        )
      }

      throw new Error(
        messages.join(' ')
      )
    }

    /*
     * همه پروازها موفق
     */
    if(
      safarCardResult?.attempted&&
      !safarCardResult.success
    ){
      statusStep.value='ISSUE_FAILED'

      throw new Error(
        `بلیت صادر شد اما کسر اعتبار سفرکارت با خطا مواجه شد: ${safarCardResult.error}`
      )
    }

    statusStep.value='SUCCESS'
  }catch(err:any){
    if(statusStep.value==='PENDING'){
      statusStep.value='ISSUE_FAILED'
    }

    errorMessage.value=
      err?.data?.message||
      err?.message||
      'خطای غیرمنتظره‌ای رخ داده است.'
  }finally{
    loading.value=false
  }
}

onMounted(() => {
  processVerify()
})


const getDownloadTicketRoute = (
  contractId: number | string | null | undefined
): string => {
  const encodedContractId =
    encodeContractId(contractId)

  if (!encodedContractId) {
    return '/'
  }

  return `/downloadticket/${encodedContractId}`
}
</script>


/*
|--------------------------------------------------------------------------
| FLOW کامل صفحه Verify و صدور بلیت
|--------------------------------------------------------------------------
|
| این صفحه چهار نوع پرداخت را پشتیبانی می‌کند:
|
| 1) agency
|    پرداخت اعتباری آژانس
|
| 2) travelcard
|    پرداخت کامل با سفرکارت
|
| 3) travelcard-gateway
|    پرداخت ترکیبی سفرکارت و درگاه بانکی
|
| 4) gateway
|    پرداخت کامل از درگاه بانکی
|
|--------------------------------------------------------------------------
| مرحله 1: خواندن اطلاعات پرداخت
|--------------------------------------------------------------------------
|
| اطلاعات پرداخت از SessionStorage با کلید زیر خوانده می‌شود:
|
| flight_payment_session
|
| نمونه:
|
| {
|   contractId:10824,
|   type:'travelcard-gateway',
|   totalPrice:1000000,
|   payableAmount:700000,
|   travelCardUsed:true,
|   travelCardAmount:300000,
|   travelCardNumber:'123456789',
|   mobile:'09109306731',
|   email:'asd@gmail.com',
|   travelType:'round-trip'
| }
|
| اگر Session وجود نداشته باشد:
|
| - فرآیند متوقف می‌شود.
| - Issue انجام نمی‌شود.
| - Refund انجام نمی‌شود.
| - وضعیت صفحه BANK_FAILED می‌شود.
|
|--------------------------------------------------------------------------
| مرحله 2: دریافت شناسه قرارداد
|--------------------------------------------------------------------------
|
| شناسه قرارداد ابتدا از URL خوانده می‌شود:
|
| route.query.responseData
|
| در صورت نبودن آن، از Session خوانده می‌شود:
|
| session.contractId
|
| نمونه URL:
|
| /verify?responseData=10824
|
| اگر شناسه قرارداد نامعتبر باشد، فرآیند متوقف می‌شود.
|
|--------------------------------------------------------------------------
| مرحله 3: دریافت قرارداد
|--------------------------------------------------------------------------
|
| اطلاعات کامل قرارداد از این سرویس دریافت می‌شود:
|
| GET /api/Contract/{contractId}
|
| قیمت مسیرها از خود قرارداد خوانده می‌شود:
|
| contract.totalPrice
|   قیمت نهایی Fare پرواز رفت یا پرواز یک‌طرفه
|
| contract.totalPrice2
|   قیمت نهایی Fare پرواز برگشت
|
| مبلغ کل قرارداد:
|
| contract.totalPrice + contract.totalPrice2
|
| در پرواز یک‌طرفه totalPrice2 برابر صفر است.
|
|--------------------------------------------------------------------------
| مرحله 4: تشخیص نیاز به Verify بانکی
|--------------------------------------------------------------------------
|
| فقط این دو نوع پرداخت باید Verify بانکی شوند:
|
| gateway
| travelcard-gateway
|
| این دو نوع بدون Verify بانکی وارد Issue نمی‌شوند.
|
| این دو نوع Verify بانکی ندارند:
|
| agency
| travelcard
|
|--------------------------------------------------------------------------
| مرحله 5: بررسی پاسخ بانک
|--------------------------------------------------------------------------
|
| برای پرداخت‌های بانکی ابتدا code بررسی می‌شود:
|
| code === '00'
|   تراکنش از سمت بانک موفق اعلام شده و باید Verify شود.
|
| code === '17'
|   کاربر از پرداخت منصرف شده است.
|   Issue و Refund انجام نمی‌شوند.
|
| هر code دیگری:
|   پرداخت ناموفق است.
|   Issue و Refund انجام نمی‌شوند.
|
| پارامترهای موردنیاز Verify:
|
| traceNo
| rrn
| token
| paymentId
| amount
|
| سپس سرویس زیر صدا زده می‌شود:
|
| POST /api/Tejarat/Verify
|
| فقط در صورتی که Verify موفق باشد، فرآیند ادامه پیدا می‌کند.
|
|--------------------------------------------------------------------------
| مرحله 6: ذخیره اطلاعات بانکی
|--------------------------------------------------------------------------
|
| بعد از Verify موفق، اطلاعات تراکنش داخل paymentId قرارداد
| با ساختار زیر ذخیره می‌شود:
|
| amount-rrn-traceNo-paymentId
|
| نمونه:
|
| 700000-963258741852-45896321-987654321
|
| این اطلاعات برای Refund احتمالی آینده لازم هستند.
|
| همچنین Snapshot پرداخت داخل flightJson تمام پروازها ثبت می‌شود:
|
| {
|   version:1,
|   payment:{
|     type:'travelcard-gateway',
|     contractTotal:1000000,
|     bankAmount:700000,
|     travelCardUsed:true,
|     travelCardAmount:300000,
|     travelCardNumber:'****6789',
|     recordedAt:'...'
|   }
| }
|
| سپس قرارداد با مرحله bank-verify ذخیره می‌شود.
|
| اگر Update این مرحله ناموفق شود:
|
| - اطلاعات در حافظه contract باقی می‌ماند.
| - فرآیند Issue متوقف نمی‌شود.
| - نام مرحله در failedSaveSteps ثبت می‌شود.
| - در Update بعدی، اطلاعات قبلی همراه اطلاعات جدید دوباره ارسال می‌شود.
|
|--------------------------------------------------------------------------
| مرحله 7: صدور مستقل پروازها
|--------------------------------------------------------------------------
|
| هر پرواز بر اساس flightSupplier خودش صادر می‌شود.
|
| برای NIRA:
|
| GET /api/Nira/ETIssue
|
| پارامترها:
|
| AirLine
| PNR
| Email
|
| هر پرواز به‌صورت مستقل Issue می‌شود.
|
| بنابراین در رفت‌وبرگشت ممکن است:
|
| - هر دو موفق باشند.
| - فقط رفت موفق باشد.
| - فقط برگشت موفق باشد.
| - هر دو ناموفق باشند.
|
| معیار موفقیت NIRA:
|
| وجود حداقل یک Tickets غیرخالی در AirNRSTICKETS
|
| نتیجه صدور هر پرواز داخل flightJson همان پرواز ثبت می‌شود:
|
| {
|   issue:{
|     provider:'NIRA',
|     status:'success' | 'failed',
|     pnr:'...',
|     ticketNumbers:['...'],
|     message:'...',
|     response:{...},
|     attemptedAt:'...'
|   }
| }
|
| اگر همه پروازها موفق باشند:
|
| ticketStatus = 'confirm'
| confirmStatus = 'confirm'
|
| اگر حداقل یک پرواز ناموفق باشد:
|
| ticketStatus = 'incomplete'
| confirmStatus = 'incomplete'
|
| بعد از صدور، قرارداد با مرحله flight-issue ذخیره می‌شود.
|
|--------------------------------------------------------------------------
| مرحله 8: محاسبه نتیجه مالی
|--------------------------------------------------------------------------
|
| مبلغ پروازهای موفق و ناموفق بر اساس نتیجه Issue محاسبه می‌شود.
|
| پرواز اول:
|
| contract.totalPrice
|
| پرواز دوم:
|
| contract.totalPrice2
|
| مثال:
|
| totalPrice  = 400000
| totalPrice2 = 600000
|
| اگر فقط رفت موفق باشد:
|
| successfulAmount = 400000
| failedAmount     = 600000
|
| اگر فقط برگشت موفق باشد:
|
| successfulAmount = 600000
| failedAmount     = 400000
|
| اگر هر دو موفق باشند:
|
| successfulAmount = 1000000
| failedAmount     = 0
|
| اگر هر دو ناموفق باشند:
|
| successfulAmount = 0
| failedAmount     = 1000000
|
|--------------------------------------------------------------------------
| مرحله 9: تسویه پرداخت آژانسی
|--------------------------------------------------------------------------
|
| session.type === 'agency'
|
| در پرداخت آژانسی:
|
| - Verify بانک انجام نمی‌شود.
| - سفرکارت کسر نمی‌شود.
| - Refund بانکی انجام نمی‌شود.
| - فقط نتیجه Issue و وضعیت قرارداد ذخیره می‌شود.
| - برای پروازهای موفق و ناموفق پیامک مستقل ارسال می‌شود.
|
|--------------------------------------------------------------------------
| مرحله 10: تسویه پرداخت فقط سفرکارت
|--------------------------------------------------------------------------
|
| session.type === 'travelcard'
|
| بعد از مشخص‌شدن نتیجه Issue:
|
| فقط سهم پروازهای موفق از سفرکارت کسر می‌شود.
|
| اگر همه پروازها موفق باشند:
|
| کسر سفرکارت = کل مبلغ سفرکارت
|
| اگر فقط یک پرواز موفق باشد:
|
| کسر سفرکارت = سهم همان پرواز موفق
|
| اگر همه پروازها ناموفق باشند:
|
| کسر سفرکارت = صفر
|
| چون کسر سفرکارت بعد از Issue انجام می‌شود، برای پروازهای
| ناموفق نیازی به بازگرداندن اعتبار نیست؛ از ابتدا کسر نمی‌شود.
|
| نتیجه کسر سفرکارت داخل flightJson پروازهای موفق ثبت می‌شود:
|
| {
|   safarCard:{
|     status:'success' | 'failed' | 'not-required',
|     deductedAmount:...,
|     response:{...},
|     error:'...',
|     attemptedAt:'...'
|   }
| }
|
| سپس قرارداد با مرحله safar-card ذخیره می‌شود.
|
|--------------------------------------------------------------------------
| مرحله 11: تسویه پرداخت فقط درگاه
|--------------------------------------------------------------------------
|
| session.type === 'gateway'
|
| اگر همه پروازها موفق باشند:
|
| bankRefund = 0
|
| اگر یک پرواز ناموفق باشد:
|
| bankRefund = قیمت همان مسیر ناموفق
|
| اگر همه پروازها ناموفق باشند:
|
| bankRefund = کل مبلغ پرداخت‌شده از بانک
|
| مبلغ Refund هرگز نباید بیشتر از مبلغ واقعی پرداخت‌شده
| از درگاه باشد.
|
| قبل از فراخوانی Refund:
|
| refund.status = 'pending'
|
| داخل flightJson پروازهای ناموفق ذخیره می‌شود و قرارداد با
| مرحله refund-pending Update می‌شود.
|
| سپس سرویس Refund فراخوانی می‌شود.
|
| نتیجه Refund داخل flightJson ثبت می‌شود:
|
| {
|   refund:{
|     status:'success' | 'failed',
|     amount:...,
|     response:{...},
|     error:'...',
|     attemptedAt:'...'
|   }
| }
|
| سپس قرارداد با مرحله refund-result ذخیره می‌شود.
|
|--------------------------------------------------------------------------
| مرحله 12: تسویه سفرکارت + درگاه
|--------------------------------------------------------------------------
|
| session.type === 'travelcard-gateway'
|
| مبلغ هر پرواز بین سهم بانک و سفرکارت تقسیم می‌شود.
|
| برای بخش موفق:
|
| - فقط سهم سفرکارت پروازهای موفق کسر می‌شود.
| - سهم بانکی پروازهای موفق نزد شرکت باقی می‌ماند.
|
| برای بخش ناموفق:
|
| - سهم بانکی پروازهای ناموفق Refund می‌شود.
| - سهم سفرکارت پروازهای ناموفق کسر نمی‌شود.
|
| مثال:
|
| مبلغ کل قرارداد: 1,000,000
| بانک:             700,000
| سفرکارت:          300,000
|
| سهم بانک:    70 درصد
| سهم سفرکارت: 30 درصد
|
| اگر پرواز 400,000 ریالی موفق و پرواز 600,000 ریالی
| ناموفق باشد:
|
| سهم بانکی پرواز موفق:    280,000
| سهم سفرکارت پرواز موفق:  120,000
| Refund بانکی:             420,000
| سفرکارت کسرنشده:          180,000
|
| ابتدا نتیجه سفرکارت ذخیره می‌شود.
| سپس Refund به حالت pending ذخیره می‌شود.
| بعد Refund انجام و نتیجه نهایی ثبت می‌شود.
|
|--------------------------------------------------------------------------
| مرحله 13: ذخیره نهایی قرارداد
|--------------------------------------------------------------------------
|
| بعد از تمام عملیات مالی، Update نهایی با مرحله final
| انجام می‌شود.
|
| این Update باید تمام اطلاعات انباشته‌شده را ذخیره کند:
|
| - paymentId
| - payment داخل flightJson
| - نتیجه Issue
| - شماره بلیت‌ها
| - وضعیت هر پرواز
| - نتیجه سفرکارت
| - وضعیت Refund
| - پاسخ Providerها
| - ticketStatus
| - confirmStatus
|
| اگر ذخیره نهایی ناموفق باشد:
|
| - عملیات پرداخت، Issue، Refund یا سفرکارت دوباره اجرا نمی‌شود.
| - وضعیت صفحه ISSUE_FAILED می‌شود.
| - کاربر باید با پشتیبانی تماس بگیرد.
|
|--------------------------------------------------------------------------
| مرحله 14: ارسال پیامک
|--------------------------------------------------------------------------
|
| برای هر پرواز یک پیامک مستقل ساخته می‌شود.
|
| اگر پرواز موفق باشد:
|
| - اطلاعات پرواز
| - شماره پرواز
| - تاریخ و ساعت
| - مسیر
| - PNR
| - لینک دانلود بلیت
|
| ارسال می‌شود.
|
| اگر پرواز ناموفق باشد:
|
| پیام عدم موفقیت صدور و پیگیری توسط کارشناسان ارسال می‌شود.
|
| خطای پیامک نباید نتیجه اصلی پرداخت و صدور را تغییر دهد.
|
|--------------------------------------------------------------------------
| مرحله 15: تعیین وضعیت نهایی صفحه
|--------------------------------------------------------------------------
|
| BANK_FAILED:
|
| - انصراف از بانک
| - code ناموفق
| - پارامترهای ناقص بانک
| - Verify ناموفق
| - خطا در ارتباط با Verify
|
| ISSUE_FAILED:
|
| - یک یا چند پرواز صادر نشده‌اند.
| - کسر سفرکارت ناموفق شده است.
| - Refund ناموفق شده است.
| - ذخیره نهایی قرارداد ناموفق شده است.
|
| SUCCESS:
|
| - تمام پروازها موفق صادر شده‌اند.
| - عملیات مالی موردنیاز موفق بوده است.
| - قرارداد نهایی ذخیره شده است.
|
|--------------------------------------------------------------------------
| نکات مهم
|--------------------------------------------------------------------------
|
| 1) برای پرواز یک‌طرفه:
|
| totalPrice  = قیمت پرواز
| totalPrice2 = 0
|
| همین Flow بدون تغییر کار می‌کند.
|
| 2) برای رفت‌وبرگشت:
|
| totalPrice  = قیمت رفت
| totalPrice2 = قیمت برگشت
|
| 3) نوع پرداخت باید دقیقاً یکی از این مقادیر باشد:
|
| agency
| travelcard
| travelcard-gateway
| gateway
|
| مقدار اشتباه agancy نباید استفاده شود.
|
| 4) paymentId فقط پس از Verify موفق بانک ذخیره می‌شود.
|
| 5) اگر بانک پرداخت را تأیید نکرده باشد، Refund نباید
| فراخوانی شود.
|
| 6) Refund فقط وقتی انجام می‌شود که:
|
| - پرداخت بانکی Verify شده باشد.
| - یک یا چند پرواز ناموفق باشند.
| - bankRefund بیشتر از صفر باشد.
|
| 7) totalPrice و totalPrice2 بعد از کنسلی یا Refund تغییر
| نمی‌کنند؛ این دو قیمت اصلی Fare مسیرها هستند.
|
| 8) وضعیت‌های مالی و سوابق عملیات داخل flightJson ثبت می‌شوند.
|
| 9) Update ناموفق در مراحل میانی نباید Issue یا عملیات مالی
| انجام‌شده را دوباره اجرا کند. اطلاعات در حافظه باقی می‌ماند
| و در Update بعدی دوباره برای ذخیره ارسال می‌شود.
|
|--------------------------------------------------------------------------
*/