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

      flight.flightJson =
        JSON.stringify(
          flightIssueResult.success
            ? flightIssueResult.tickets
            : []
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
    const updateResponse =
      await $fetch<any>(
        'https://api.ahuan.ir/api/Contract/update',
        {
          method: 'PUT',
          body: contract
        }
      )

    return {
      success:
        allFlightsIssued,

      ticketStatus:
        finalStatus,

      confirmStatus:
        finalStatus,

      issueResults,

      contract:
        updateResponse?.data ||
        updateResponse ||
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

const updateSafarCardAfterIssue = async (
  session: PaymentSession,
  contract: any
): Promise<SafarCardUpdateResult> => {
  const travelCardUsed =
    session?.travelCardUsed === true

  const cardNumber = String(
    session?.travelCardNumber || ''
  ).trim()

  const amount = Number(
    session?.travelCardAmount || 0
  )

  /*
   * اگر کاربر سفرکارت استفاده نکرده باشد،
   * اصلاً درخواست ارسال نمی‌شود.
   */
  if (
    !travelCardUsed ||
    !cardNumber ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return {
      attempted: false,
      success: true,
      response: null,
      error: ''
    }
  }

  const contractId = Number(
    contract?.id ||
    session?.contractId ||
    0
  )

  const description =
    contractId > 0
      ? `کسر اعتبار سفرکارت بابت قرارداد شماره ${contractId}`
      : 'کسر اعتبار سفرکارت بابت خرید بلیت'

  try {
    const response = await $fetch<any>(
      'https://api.ahuan.ir/api/SafarCard/update',
      {
        method: 'PUT',
        body: {
          cardNumber,
          amount,
          description
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    /*
     * پاسخ ممکن است true، false،
     * یا داخل data باشد.
     */
    const success =
      response === true ||
      response?.data === true ||
      response?.success === true

    if (!success) {
      console.error(
        'SafarCard update returned false:',
        {
          contractId,
          cardNumber,
          amount,
          response
        }
      )
    }

    return {
      attempted: true,
      success,
      response,
      error: success
        ? ''
        : 'سرویس سفرکارت عملیات کسر اعتبار را ناموفق اعلام کرد.'
    }
  } catch (error: any) {
    /*
     * خطای سفرکارت نباید Flow صدور را متوقف کند.
     */
    const errorMessage =
      error?.data?.message ||
      error?.data?.title ||
      error?.message ||
      'خطا در بروزرسانی اعتبار سفرکارت'

    console.error(
      'SafarCard update error:',
      {
        contractId,
        cardNumber,
        amount,
        error:
          error?.data || error
      }
    )

    return {
      attempted: true,
      success: false,
      response:
        error?.data || null,
      error:
        errorMessage
    }
  }
}
const processVerify = async () => {
  loading.value = true
  errorMessage.value = ''
  statusStep.value = 'PENDING'

  try {
    const session = getPaymentSession()

    if (!session) {
      statusStep.value = 'BANK_FAILED'
      throw new Error(
        'اطلاعات پرداخت در مرورگر یافت نشد.'
      )
    }

    paymentInfo.value = session

    const contractId = Number(
      route.query.responseData ||
      session.contractId
    )

    if (
      !Number.isFinite(contractId) ||
      contractId <= 0
    ) {
      statusStep.value = 'BANK_FAILED'

      throw new Error(
        'شناسه قرارداد معتبر نیست.'
      )
    }

    /*
     * دریافت قرارداد از:
     * GET /api/Contract/{contractId}
     */
    contractData.value =
      await fetchContractDetails(
        contractId
      )

    const type = session.type

    /*
     * اعتبارسنجی پرداخت بانکی
     */
    if (
      type === 'gateway' ||
      type === 'travelcard-gateway'
    ) {
      const systemTraceAuditNumber =
        String(
          route.query
            .systemTraceAuditNumber ||
          route.query.traceNo ||
          ''
        )

      const retrievalReferenceNumber =
        String(
          route.query
            .retrievalReferenceNumber ||
          route.query.rrn ||
          ''
        )

      const token = String(
        route.query.token || ''
      )

      if (
        !systemTraceAuditNumber ||
        !retrievalReferenceNumber ||
        !token
      ) {
        statusStep.value =
          'BANK_FAILED'

        throw new Error(
          'پارامترهای اعتبارسنجی بازگشت از بانک کامل نیست.'
        )
      }

      let isVerified = true

    
      try {
        const verifyResponse =
          await verifyBank({
            systemTraceAuditNumber,
            retrievalReferenceNumber,
            token
          })

        isVerified =
          verifyResponse === true ||
          verifyResponse?.data === true ||
          verifyResponse?.success === true ||
          verifyResponse?.verified === true
      } catch {
        statusStep.value =
          'BANK_FAILED'

        throw new Error(
          'خطا در ارتباط با سرور برای تاییدیه تراکنش بانکی.'
        )
      }
      

      if (!isVerified) {
        statusStep.value =
          'BANK_FAILED'

        throw new Error(
          'تراکنش بانکی توسط بانک تایید نگردید.'
        )
      }
    }

    /*
     * صدور تمام پروازهای قرارداد
     */
    const issueResult =
      await issueContractBySupplier(
        contractData.value
      )

    /*
     * issueContractBySupplier باید:
     *
     * 1. برای هر پرواز NIRA یک Issue بزند.
     * 2. flightJson همان پرواز را مقداردهی کند.
     * 3. ticketStatus را confirm یا incomplete کند.
     * 4. قرارداد را یک بار Update کند.
     * 5. این نتیجه را برگرداند:
     *
     * {
     *   success: boolean,
     *   ticketStatus: string,
     *   issueResults: []
     * }
     */

    /*
     * خروجی Update همان نسخه نهایی قرارداد است؛
     * بنابراین GET مجدد قرارداد انجام نمی‌شود.
     */
    contractData.value =
      issueResult?.contract ||
      contractData.value

    /*
     * ارسال پیامک بعد از Issue و Update.
     * برای هر پرواز، مستقل از نوع ایرلاین،
     * یک پیام موفق یا ناموفق ارسال می‌شود.
     */


/*
 * کسر مبلغ سفرکارت بعد از Issue و Update.
 *
 * اگر پاسخ false باشد یا درخواست خطا بدهد،
 * فرآیند صدور و صفحه Verify متوقف نمی‌شود.
 */
const safarCardResult =
  await updateSafarCardAfterIssue(
    session,
    contractData.value
  )

console.log(
  'SafarCard update result:',
  safarCardResult
)




    let smsResults: FlightSmsResult[] = []

    try {
      smsResults =
        await sendContractFlightsSms(
          contractData.value,
          Array.isArray(issueResult?.issueResults)
            ? issueResult.issueResults
            : []
        )
    } catch (smsError) {
      /*
       * خطای ارسال پیامک نباید نتیجه صدور بلیت
       * یا پرداخت موفق را ناموفق نمایش دهد.
       */
      console.error(
        'Error sending contract SMS:',
        smsError
      )
    }

    console.log(
      'SMS results:',
      JSON.stringify(smsResults, null, 2)
    )

    /*
     * اگر یک یا چند پرواز Issue نشده باشند.
     */
    if (!issueResult?.success) {
      statusStep.value =
        'ISSUE_FAILED'

      const issueResults =
        Array.isArray(
          issueResult?.issueResults
        )
          ? issueResult.issueResults
          : []

      const failedFlights =
        issueResults
          .filter(
            (item: any) =>
              item?.success !== true
          )
          .map((item: any) => {
            const flightNumber =
              String(
                item?.flightNumber || ''
              ).trim()

            const pnr =
              String(
                item?.pnr || ''
              ).trim()

            if (
              flightNumber &&
              pnr
            ) {
              return `${flightNumber} با PNR ${pnr}`
            }

            return (
              flightNumber ||
              pnr ||
              ''
            )
          })
          .filter(Boolean)
          .join('، ')

      throw new Error(
        failedFlights
          ? `صدور پرواز ${failedFlights} ناموفق بود. وضعیت قرارداد incomplete ثبت شد.`
          : 'صدور یک یا چند پرواز ناموفق بود. وضعیت قرارداد incomplete ثبت شد.'
      )
    }

    /*
     * تمام پروازها Issue شده‌اند و
     * ticketStatus برابر confirm شده است.
     */
    statusStep.value = 'SUCCESS'
  } catch (err: any) {
    /*
     * اگر وضعیت قبلاً BANK_FAILED یا
     * ISSUE_FAILED شده، همان حفظ می‌شود.
     */
    if (statusStep.value === 'PENDING') {
      statusStep.value =
        'ISSUE_FAILED'
    }

    errorMessage.value =
      err?.data?.message ||
      err?.message ||
      'خطای غیرمنتظره‌ای رخ داده است.'
  } finally {
    loading.value = false
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
