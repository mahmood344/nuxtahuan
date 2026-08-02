<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from '#app'
import moment from 'moment-jalaali'

moment.loadPersian({
  usePersianDigits: false,
  dialect: 'persian-modern'
})
function handleDebugPassengers() {
  const isValid = validateAll()
  const data = getData()

  console.log('validation result:', isValid)
  console.log('passengers raw:', passengers.value)
  console.log('passengers normalized data:', data)
}
const route = useRoute()

const genderOptions = [
  { label: 'آقا', value: 'male' },
  { label: 'خانم', value: 'female' },
]

const nationalityOptions = [
  { label: 'ایرانی', value: 'IR' },
  { label: 'غیر ایرانی', value: 'FOREIGN' },
]

const jalaliMonthOptions = [
  { label: 'فروردین', value: '1' },
  { label: 'اردیبهشت', value: '2' },
  { label: 'خرداد', value: '3' },
  { label: 'تیر', value: '4' },
  { label: 'مرداد', value: '5' },
  { label: 'شهریور', value: '6' },
  { label: 'مهر', value: '7' },
  { label: 'آبان', value: '8' },
  { label: 'آذر', value: '9' },
  { label: 'دی', value: '10' },
  { label: 'بهمن', value: '11' },
  { label: 'اسفند', value: '12' },
]

const gregorianMonthOptions = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
]

const scrollableMenuProps = {
  maxHeight: '220px',
  overflowY: 'auto',
}

const adlCount = computed(() => Number.parseInt(route.query.adl || '1', 10) || 1)
const chdCount = computed(() => Number.parseInt(route.query.chd || '0', 10) || 0)
const infCount = computed(() => Number.parseInt(route.query.inf || '0', 10) || 0)

const flightType = computed(() => String(route.query.flightType || '').toLowerCase())
const isDomesticFlight = computed(() => flightType.value === 'domestic')
const isInternationalFlight = computed(() => flightType.value === 'international')

const passengers = ref([])
const previousPassengersModal = ref(false)
const previousPassengersLoading = ref(false)
const previousPassengersError = ref('')
const previousPassengers = ref([])
const selectedPassengerFormIndex = ref(null)

function getLoggedInUser() {
  const userCookie = useCookie('user_data')
  let user = userCookie.value

  if (typeof user === 'string') {
    try {
      user = JSON.parse(user)
    } catch {
      user = null
    }
  }

  return user && typeof user === 'object'
    ? user
    : null
}

function getLoggedInMobile() {
  const user = getLoggedInUser()

  return onlyNumbers(
    user?.mobile ||
    user?.phone ||
    ''
  )
}

function unwrapApiResponse(response) {
  if (
    response &&
    typeof response === 'object' &&
    'data' in response
  ) {
    return response.data
  }

  return response
}

function normalizePassengerNationality(value) {
  const nationality = String(value || '')
    .trim()
    .toUpperCase()

  if (
    nationality === 'IR' ||
    nationality === 'IRAN' ||
    nationality === 'IRN' ||
    nationality === 'ایرانی'
  ) {
    return 'IR'
  }

  return 'FOREIGN'
}

function normalizePreviousPassengerGender(value) {
  if (
    value === true ||
    value === 1 ||
    value === '1' ||
    String(value).toLowerCase() === 'true' ||
    String(value).toLowerCase() === 'male'
  ) {
    return 'male'
  }

  if (
    value === false ||
    value === 0 ||
    value === '0' ||
    String(value).toLowerCase() === 'false' ||
    String(value).toLowerCase() === 'female'
  ) {
    return 'female'
  }

  return ''
}

function parsePreviousPassengerBirthDate(
  value,
  nationality
) {
  if (!value) {
    return {
      day: '',
      month: '',
      year: ''
    }
  }

  const date = moment(value)

  if (!date.isValid()) {
    return {
      day: '',
      month: '',
      year: ''
    }
  }

  if (nationality === 'IR') {
    return {
      day: date.format('jD'),
      month: date.format('jM'),
      year: date.format('jYYYY')
    }
  }

  return {
    day: date.format('D'),
    month: date.format('M'),
    year: date.format('YYYY')
  }
}

function formatPreviousPassengerBirthDate(
  value,
  nationality
) {
  if (!value) return '-'

  const date = moment(value)
  if (!date.isValid()) return '-'

  return nationality === 'IR'
    ? date.format('jYYYY/jMM/jDD')
    : date.format('YYYY/MM/DD')
}

function getPreviousPassengerGenderTitle(value) {
  const gender =
    normalizePreviousPassengerGender(value)

  if (gender === 'male') return 'آقا'
  if (gender === 'female') return 'خانم'

  return '-'
}

function getPreviousPassengerNationalityTitle(value) {
  return normalizePassengerNationality(value) === 'IR'
    ? 'ایرانی'
    : 'غیر ایرانی'
}

async function openPreviousPassengers(index) {
  selectedPassengerFormIndex.value = index
  previousPassengersModal.value = true
  previousPassengersLoading.value = true
  previousPassengersError.value = ''
  previousPassengers.value = []

  try {
    const mobile = getLoggedInMobile()

    if (!mobile) {
      throw new Error(
        'شماره موبایل کاربر در اطلاعات ورود یافت نشد.'
      )
    }

    const customerResponse = await $fetch(
      `https://api.ahuan.ir/api/Customer/mobile/${encodeURIComponent(mobile)}`,
      {
        method: 'GET'
      }
    )

    const customer =
      unwrapApiResponse(customerResponse)

    const customerId = Number(
      customer?.id ||
      customer?.customerId ||
      0
    )

    if (
      !Number.isInteger(customerId) ||
      customerId <= 0
    ) {
      throw new Error(
        'شناسه مشتری از سرویس دریافت نشد.'
      )
    }

    const passengersResponse = await $fetch(
      'https://api.ahuan.ir/api/Customer/passengers',
      {
        method: 'GET',
        query: {
          customerId
        }
      }
    )

    const result =
      unwrapApiResponse(passengersResponse)

    const list = Array.isArray(result)
      ? result
      : Array.isArray(result?.items)
        ? result.items
        : Array.isArray(result?.customerPassengers)
          ? result.customerPassengers
          : []

    previousPassengers.value = list
  } catch (error) {
    console.error(
      'Previous passengers error:',
      error
    )

    previousPassengersError.value =
      error?.data?.message ||
      error?.response?.data?.message ||
      error?.message ||
      'دریافت لیست مسافران سابق با خطا مواجه شد.'
  } finally {
    previousPassengersLoading.value = false
  }
}

function closePreviousPassengersModal() {
  previousPassengersModal.value = false
  selectedPassengerFormIndex.value = null
  previousPassengersError.value = ''
}

function selectPreviousPassenger(item) {
  const index =
    selectedPassengerFormIndex.value

  if (
    !Number.isInteger(index) ||
    !passengers.value[index]
  ) {
    return
  }

  const target =
    passengers.value[index]

  const nationality =
    normalizePassengerNationality(
      item?.nationality
    )

  const birthDate =
    parsePreviousPassengerBirthDate(
      item?.birthDate,
      nationality
    )

  target.firstName = onlyLatin(
    normalizeSpaces(
      item?.fName ||
      item?.firstName ||
      ''
    )
  )

  target.lastName = onlyLatin(
    normalizeSpaces(
      item?.lName ||
      item?.lastName ||
      ''
    )
  )

  target.nationality = nationality

  target.nationalCode = onlyNumbers(
    item?.codeMelli ||
    item?.nationalCode ||
    ''
  ).slice(0, 10)

  target.passportNumber =
    normalizeSpaces(
      item?.passportNo ||
      item?.passportNumber ||
      ''
    )
      .toUpperCase()
      .slice(0, 10)

  target.gender =
    normalizePreviousPassengerGender(
      item?.gender
    )

  target.birthDate = {
    day: birthDate.day,
    month: birthDate.month,
    year: birthDate.year
  }

  target.errors = {}

  closePreviousPassengersModal()
}
function extractValue(payload) {
  if (payload == null) return ''

  if (typeof payload === 'object') {
    if ('target' in payload && payload.target?.value != null) return payload.target.value
    if ('value' in payload && payload.value != null) return payload.value
    if ('label' in payload && payload.label != null && !('value' in payload)) return payload.label
  }

  return payload
}

function onlyLatin(value) {
  return String(value || '')
    .replace(/[^a-zA-Z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trimStart()
}

function onlyNumbers(value) {
  return String(value || '').replace(/\D/g, '')
}

function normalizeSpaces(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function isValidLatinName(value) {
  return /^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(String(value || '').trim())
}

function isValidIranianNationalCode(code) {
  if (!/^\d{10}$/.test(code)) return false

  const check = Number(code[9])
  const sum = code
    .split('')
    .slice(0, 9)
    .reduce((total, digit, index) => total + Number(digit) * (10 - index), 0)

  const remainder = sum % 11
  return remainder < 2 ? check === remainder : check === 11 - remainder
}

function isValidPassport(value) {
  return /^[A-Za-z0-9]{1,10}$/.test(String(value || '').trim())
}

function getPassengerTitle(type, index) {
  if (type === 'ADL') return `بزرگسال ${index + 1}`
  if (type === 'CHD') return `کودک ${index + 1}`
  return `نوزاد ${index + 1}`
}

function getPassengerIcon(type) {
  if (type === 'ADL') return 'bi-person-vcard'
  if (type === 'CHD') return 'bi-person-badge'
  return 'bi-person-lines-fill'
}

function shouldShowNationalCode(passenger) {
  return passenger.nationality === 'IR'
}

function shouldShowPassport(passenger) {
  if (passenger.nationality === 'FOREIGN') return true
  if (passenger.nationality === 'IR' && isInternationalFlight.value) return true
  return false
}

function getYearOptions(nationality) {
  const years = []

  if (nationality === 'IR') {
    for (let year = 1405; year >= 1300; year -= 1) {
      years.push({ label: String(year), value: String(year) })
    }
  } else {
    for (let year = 2026; year >= 1920; year -= 1) {
      years.push({ label: String(year), value: String(year) })
    }
  }

  return years
}

function getDayOptions() {
  const days = []
  for (let day = 1; day <= 31; day += 1) {
    days.push({ label: String(day), value: String(day) })
  }
  return days
}

const dayOptions = getDayOptions()

function getMonthOptions(nationality) {
  return nationality === 'IR' ? jalaliMonthOptions : gregorianMonthOptions
}

// تابع کمکی برای تبدیل تاریخ جلالی به میلادی
function jalaliToGregorian(jy, jm, jd) {
  const salA = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 335, 365]
  let jy2 = (jy <= 979) ? 0 : 979
  let jy3 = jy - jy2
  let ept = (jy3 * 97) + 3
  let ept2 = Math.floor(ept / 400)
  let ept3 = Math.floor((ept % 400) / 4)
  let ept4 = Math.floor((ept3 * 4) / 33)
  let ept5 = ept3 - ept4
  let gD = (jy3 * 365) + ept2 + ept5 + 78
  gD += (jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186
  gD += jd - 1

  let gy = 1600 + 400 * Math.floor(gD / 146097)
  let gD2 = gD % 146097
  let leap = 1
  if (gD2 >= 36525) {
    gD2--
    gy += 100 * Math.floor(gD2 / 36524)
    gD2 = gD2 % 36524
    if (gD2 >= 365) {
      gD2++
    } else {
      leap = 0
    }
  }
  gy += 4 * Math.floor(gD2 / 1461)
  let gD3 = gD2 % 1461
  if (gD3 >= 366) {
    leap = 0
    gD3--
    gy += Math.floor(gD3 / 365)
    gD3 = gD3 % 365
  }
  let i
  for (i = 0; gD3 >= salA[i] + (i === 1 && leap ? 1 : 0); i++) {
    gD3 -= salA[i] + (i === 1 && leap ? 1 : 0)
  }
  const gm = i
  const gd = gD3 + 1
  return new Date(gy, gm - 1, gd)
}

// محاسبه سن به روز/ماه/سال از روی تاریخ تولد
function calculateAge(birthDateObj, nationality) {
  const day = Number(birthDateObj.day)
  const month = Number(birthDateObj.month)
  const year = Number(birthDateObj.year)

  if (!day || !month || !year) return null

  let birthDate
  if (nationality === 'IR') {
    birthDate = jalaliToGregorian(year, month, day)
  } else {
    birthDate = new Date(year, month - 1, day)
  }

  const today = new Date()
  
  let ageYears = today.getFullYear() - birthDate.getFullYear()
  let ageMonths = today.getMonth() - birthDate.getMonth()
  let ageDays = today.getDate() - birthDate.getDate()

  if (ageDays < 0) {
    ageMonths--
    // تقریب روزهای ماه قبل
    ageDays += 30
  }
  if (ageMonths < 0) {
    ageYears--
    ageMonths += 12
  }

  return { years: ageYears, months: ageMonths, days: ageDays, totalDays: Math.floor((today - birthDate) / (1000 * 60 * 60 * 24)) }
}

function createPassenger(type, index) {
  return {
    type,
    label: getPassengerTitle(type, index),
    firstName: '',
    lastName: '',
    nationality: 'IR',
    nationalCode: '',
    passportNumber: '',
    gender: 'male',
    birthDate: {
      day: '',
      month: '',
      year: '',
    },
    errors: {},
  }
}

function initPassengers() {
  const list = []

  for (let i = 0; i < adlCount.value; i += 1) list.push(createPassenger('ADL', i))
  for (let i = 0; i < chdCount.value; i += 1) list.push(createPassenger('CHD', i))
  for (let i = 0; i < infCount.value; i += 1) list.push(createPassenger('INF', i))

  passengers.value = list
}

function clearFieldError(passenger, field) {
  if (passenger.errors[field]) delete passenger.errors[field]
}

function clearIdentityFields(passenger) {
  passenger.nationalCode = ''
  passenger.passportNumber = ''
  passenger.birthDate.day = ''
  passenger.birthDate.month = ''
  passenger.birthDate.year = ''

  delete passenger.errors.nationalCode
  delete passenger.errors.passportNumber
  delete passenger.errors.day
  delete passenger.errors.month
  delete passenger.errors.year
  delete passenger.errors.ageRange
}

function validateBirthDate(passenger) {
  const errors = {}
  const day = Number(passenger.birthDate.day)
  const month = Number(passenger.birthDate.month)
  const year = Number(passenger.birthDate.year)

  if (!passenger.birthDate.day) {
    errors.day = 'روز تولد الزامی است'
  } else if (day < 1 || day > 31) {
    errors.day = 'نامعتبر'
  }

  if (!passenger.birthDate.month) {
    errors.month = 'ماه تولد الزامی است'
  } else if (month < 1 || month > 12) {
    errors.month = 'نامعتبر'
  }

  if (!passenger.birthDate.year) {
    errors.year = 'سال تولد الزامی است'
  } else if (passenger.nationality === 'IR' && (year < 1300 || year > 1405)) {
    errors.year = 'باید بین ۱۳۰۰ تا ۱۴۰۵ باشد'
  } else if (passenger.nationality === 'FOREIGN' && (year < 1920 || year > 2026)) {
    errors.year = 'باید بین ۱۹۲۰ تا ۲۰۲۶ باشد'
  }

  // اگر فرمت‌های اولیه روز/ماه/سال درست بودند، رده سنی بررسی می‌شود
  if (!errors.day && !errors.month && !errors.year) {
    const age = calculateAge(passenger.birthDate, passenger.nationality)
    
    if (age) {
      if (passenger.type === 'ADL' && age.years < 12) {
        errors.year = 'سن بزرگسال باید حداقل ۱۲ سال باشد'
      } else if (passenger.type === 'CHD') {
        if (age.years < 2 || age.years >= 12) {
          errors.year = 'سن کودک باید بین ۲ تا ۱۲ سال باشد'
        }
      } else if (passenger.type === 'INF') {
        if (age.years >= 2) {
          errors.year = 'سن نوزاد باید کمتر از ۲ سال باشد'
        } else if (age.totalDays < 7) {
          errors.year = 'نوزاد باید حداقل ۷ روزه باشد'
        }
      }
    }
  }

  return errors
}

function validatePassenger(passenger) {
  const errors = {}

  passenger.firstName = onlyLatin(normalizeSpaces(passenger.firstName))
  passenger.lastName = onlyLatin(normalizeSpaces(passenger.lastName))
  passenger.nationalCode = onlyNumbers(passenger.nationalCode).slice(0, 10)
  passenger.passportNumber = normalizeSpaces(passenger.passportNumber).toUpperCase().slice(0, 10)
  passenger.birthDate.day = onlyNumbers(passenger.birthDate.day).slice(0, 2)
  passenger.birthDate.month = onlyNumbers(passenger.birthDate.month).slice(0, 2)
  passenger.birthDate.year = onlyNumbers(passenger.birthDate.year).slice(0, 4)

  if (!passenger.firstName) {
    errors.firstName = 'نام الزامی است'
  } else if (!isValidLatinName(passenger.firstName)) {
    errors.firstName = 'نام باید با حروف لاتین وارد شود'
  }

  if (!passenger.lastName) {
    errors.lastName = 'نام خانوادگی الزامی است'
  } else if (!isValidLatinName(passenger.lastName)) {
    errors.lastName = 'نام خانوادگی باید با حروف لاتین وارد شود'
  }

  if (!passenger.gender) {
    errors.gender = 'جنسیت را انتخاب کنید'
  }

  if (!passenger.nationality) {
    errors.nationality = 'ملیت را انتخاب کنید'
  }

  if (shouldShowNationalCode(passenger)) {
    if (!passenger.nationalCode) {
      errors.nationalCode = 'کد ملی الزامی است'
    } else if (!isValidIranianNationalCode(passenger.nationalCode)) {
      errors.nationalCode = 'کد ملی معتبر نیست'
    }
  }

  if (shouldShowPassport(passenger)) {
    if (!passenger.passportNumber) {
      errors.passportNumber = 'شماره پاسپورت الزامی است'
    } else if (!isValidPassport(passenger.passportNumber)) {
      errors.passportNumber = 'شماره پاسپورت معتبر نیست'
    }
  }

  Object.assign(errors, validateBirthDate(passenger))
  passenger.errors = errors

  return Object.keys(errors).length === 0
}

function validateAll() {
  let isValid = true

  passengers.value.forEach((passenger) => {
    if (!validatePassenger(passenger)) isValid = false
  })

  return isValid
}

function getData() {
  return passengers.value.map((passenger) => ({
    type: passenger.type,
    label: passenger.label,
    firstName: passenger.firstName,
    lastName: passenger.lastName,
    nationality: passenger.nationality,
    nationalCode: shouldShowNationalCode(passenger) ? passenger.nationalCode : '',
    passportNumber: shouldShowPassport(passenger) ? passenger.passportNumber : '',
    gender: passenger.gender,
    birthDate: {
      day: passenger.birthDate.day,
      month: passenger.birthDate.month,
      year: passenger.birthDate.year,
      calendar: passenger.nationality === 'IR' ? 'jalali' : 'gregorian',
    },
  }))
}

function onFirstNameChange(passenger, value) {
  passenger.firstName = onlyLatin(extractValue(value))
  clearFieldError(passenger, 'firstName')
}

function onLastNameChange(passenger, value) {
  passenger.lastName = onlyLatin(extractValue(value))
  clearFieldError(passenger, 'lastName')
}

function onNationalCodeChange(passenger, value) {
  passenger.nationalCode = onlyNumbers(extractValue(value)).slice(0, 10)
  clearFieldError(passenger, 'nationalCode')
}

function onPassportChange(passenger, value) {
  passenger.passportNumber = normalizeSpaces(extractValue(value)).toUpperCase().slice(0, 10)
  clearFieldError(passenger, 'passportNumber')
}

function onNationalityChange(passenger, value) {
  passenger.nationality = String(extractValue(value) || '')
  clearFieldError(passenger, 'nationality')
  clearIdentityFields(passenger)
}

function onGenderChange(passenger, value) {
  passenger.gender = String(extractValue(value) || '')
  clearFieldError(passenger, 'gender')
}

function onBirthDayChange(passenger, value) {
  passenger.birthDate.day = onlyNumbers(extractValue(value)).slice(0, 2)
  clearFieldError(passenger, 'day')
}

function onBirthMonthChange(passenger, value) {
  passenger.birthDate.month = onlyNumbers(extractValue(value)).slice(0, 2)
  clearFieldError(passenger, 'month')
}

function onBirthYearChange(passenger, value) {
  passenger.birthDate.year = onlyNumbers(extractValue(value)).slice(0, 4)
  clearFieldError(passenger, 'year')
}

watch(
  () => [route.query.adl, route.query.chd, route.query.inf],
  () => {
    initPassengers()
  },
  { immediate: true }
)

defineExpose({
  validateAll,
  getData,
})
</script>

<template>
  <div class="space-y-6" dir="rtl">
    <div
      v-for="(passenger, index) in passengers"
      :key="`${passenger.type}-${index}`"
      class="relative overflow-visible rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div class="flex flex-col gap-6 md:flex-row">
        <div class="order-1 flex shrink-0 flex-col items-center justify-between py-1 md:w-44">
          <h3 class="mb-4 w-full text-right text-lg font-bold text-gray-800 md:mb-0">
            مشخصات فردی
          </h3>

          <div class="my-auto flex flex-col items-center justify-center">
            <div class="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-blue-50 text-slate-700 shadow-sm">
              <i :class="['bi', getPassengerIcon(passenger.type), 'text-5xl']" />
            </div>

            <span class="text-base font-bold text-gray-700">
              {{ passenger.label }}
            </span>
          </div>
        </div>

        <div class="order-2 my-2 hidden w-px self-stretch bg-gray-100 md:block"></div>

        <div class="order-3 flex flex-grow flex-col justify-between">
          <div class="mb-6 flex justify-end">
            <UiBaseButton
  label="انتخاب از مسافران سابق"
  variant="outline"
  color="primary"
  class="!rounded-full border-primary px-5 py-2 text-xs text-primary transition-colors hover:bg-primary/5"
  @click="openPreviousPassengers(index)"
/>
          </div>

          <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
            <UiBaseInput
              :model-value="passenger.firstName"
              label="نام"
              placeholder="نام"
              :rtl="true"
              :error="passenger.errors.firstName"
              @update:model-value="onFirstNameChange(passenger, $event)"
            />

            <UiBaseInput
              :model-value="passenger.lastName"
              label="نام خانوادگی"
              placeholder="نام خانوادگی"
              :rtl="true"
              :error="passenger.errors.lastName"
              @update:model-value="onLastNameChange(passenger, $event)"
            />

            <UiBaseAutocomplete
              :model-value="passenger.nationality"
              :items="nationalityOptions"
              item-text="label"
              item-value="value"
              label="ملیت"
              placeholder="ملیت"
              :clearable="false"
              :rtl="true"
              :error="passenger.errors.nationality"
              @update:model-value="onNationalityChange(passenger, $event)"
            />

            <UiBaseInput
              v-if="shouldShowNationalCode(passenger)"
              :model-value="passenger.nationalCode"
              label="کد ملی"
              placeholder="کد ملی"
              :rtl="true"
              :error="passenger.errors.nationalCode"
              @update:model-value="onNationalCodeChange(passenger, $event)"
            />

            <UiBaseInput
              v-if="shouldShowPassport(passenger)"
              :model-value="passenger.passportNumber"
              label="شماره پاسپورت"
              placeholder="شماره پاسپورت"
              :rtl="true"
              :error="passenger.errors.passportNumber"
              @update:model-value="onPassportChange(passenger, $event)"
            />

            <UiBaseAutocomplete
              :model-value="passenger.gender"
              :items="genderOptions"
              item-text="label"
              item-value="value"
              label="جنسیت"
              placeholder="جنسیت"
              :clearable="false"
              :rtl="true"
              :error="passenger.errors.gender"
              @update:model-value="onGenderChange(passenger, $event)"
            />

            <div class="space-y-1 text-right md:col-span-3">
              <div class="mb-3 pr-1 text-xs text-gray-400">
                تاریخ تولد
              </div>

              <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                <UiBaseAutocomplete
                  :model-value="passenger.birthDate.day"
                  :items="dayOptions"
                  item-text="label"
                  item-value="value"
                  label="روز"
                  placeholder="روز"
                  :rtl="true"
                  :menu-props="scrollableMenuProps"
                  :error="passenger.errors.day"
                  @update:model-value="onBirthDayChange(passenger, $event)"
                />

                <UiBaseAutocomplete
                  :model-value="passenger.birthDate.month"
                  :items="getMonthOptions(passenger.nationality)"
                  item-text="label"
                  item-value="value"
                  label="ماه"
                  placeholder="ماه"
                  :rtl="true"
                  :menu-props="scrollableMenuProps"
                  :error="passenger.errors.month"
                  @update:model-value="onBirthMonthChange(passenger, $event)"
                />

                <UiBaseAutocomplete
                  :model-value="passenger.birthDate.year"
                  :items="getYearOptions(passenger.nationality)"
                  item-text="label"
                  item-value="value"
                  label="سال"
                  :placeholder="passenger.nationality === 'IR' ? 'سال شمسی' : 'سال میلادی'"
                  :rtl="true"
                  :menu-props="scrollableMenuProps"
                  :error="passenger.errors.year"
                  @update:model-value="onBirthYearChange(passenger, $event)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 <Teleport to="body">
  <Transition name="passenger-modal">
    <div
      v-if="previousPassengersModal"
      class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/35 p-4 backdrop-blur-[1px]"
      dir="rtl"
      @click.self="closePreviousPassengersModal"
    >
      <div
        class="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <!-- هدر مودال -->
        <div
          class="flex items-center justify-between border-b border-gray-200 px-5 py-4"
        >
          <h2 class="text-base font-black text-blue-900 md:text-lg">
            افزودن از لیست مسافران سابق
          </h2>

          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full text-3xl leading-none text-blue-800 transition hover:bg-blue-50"
            @click="closePreviousPassengersModal"
          >
            ×
          </button>
        </div>

        <!-- Loading -->
        <div
          v-if="previousPassengersLoading"
          class="flex min-h-[260px] flex-col items-center justify-center"
        >
          <div
            class="mb-4 h-11 w-11 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700"
          ></div>

          <p class="text-sm text-gray-600">
            در حال دریافت مسافران سابق...
          </p>
        </div>

        <!-- Error -->
        <div
          v-else-if="previousPassengersError"
          class="m-5 rounded-xl border border-red-200 bg-red-50 p-5 text-center"
        >
          <p class="font-bold text-red-700">
            {{ previousPassengersError }}
          </p>

          <button
            type="button"
            class="mt-4 rounded-xl bg-blue-700 px-5 py-2 text-sm font-bold text-white"
            @click="openPreviousPassengers(selectedPassengerFormIndex)"
          >
            تلاش مجدد
          </button>
        </div>

        <!-- جدول دسکتاپ -->
        <div
          v-else-if="previousPassengers.length"
          class="overflow-auto p-4"
        >
          <table
            class="hidden w-full border-collapse text-center text-sm md:table"
          >
            <thead>
              <tr class="border-b border-gray-200 text-gray-700">
                <th class="px-3 py-4 font-bold">
                  نام
                </th>

                <th class="px-3 py-4 font-bold">
                  نام خانوادگی
                </th>

                <th class="px-3 py-4 font-bold">
                  ملیت
                </th>

                <th class="px-3 py-4 font-bold">
                  کد ملی
                </th>

                <th class="px-3 py-4 font-bold">
                  جنسیت
                </th>

                <th class="px-3 py-4 font-bold">
                  تاریخ تولد
                </th>

                <th class="px-3 py-4 font-bold">
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="item in previousPassengers"
                :key="item.id"
                class="border-b border-gray-200 transition odd:bg-white even:bg-gray-50 hover:bg-blue-50"
              >
                <td
                  dir="ltr"
                  class="px-3 py-3"
                >
                  {{ item.fName || item.firstName || '-' }}
                </td>

                <td
                  dir="ltr"
                  class="px-3 py-3"
                >
                  {{ item.lName || item.lastName || '-' }}
                </td>

                <td class="px-3 py-3">
                  {{ getPreviousPassengerNationalityTitle(item.nationality) }}
                </td>

                <td
                  dir="ltr"
                  class="px-3 py-3"
                >
                  {{ item.codeMelli || item.nationalCode || '-' }}
                </td>

                <td class="px-3 py-3">
                  {{ getPreviousPassengerGenderTitle(item.gender) }}
                </td>

                <td
                  dir="ltr"
                  class="px-3 py-3"
                >
                  {{
                    formatPreviousPassengerBirthDate(
                      item.birthDate,
                      normalizePassengerNationality(item.nationality)
                    )
                  }}
                </td>

                <td class="px-3 py-3">
                  <button
                    type="button"
                    class="rounded-full bg-blue-800 px-6 py-2 text-xs font-bold text-white shadow-md transition hover:bg-blue-900"
                    @click="selectPreviousPassenger(item)"
                  >
                    انتخاب
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- نمایش موبایل -->
          <div class="space-y-3 md:hidden">
            <div
              v-for="item in previousPassengers"
              :key="`mobile-${item.id}`"
              class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span class="text-gray-400">
                    نام
                  </span>

                  <p
                    dir="ltr"
                    class="mt-1 font-bold text-gray-800"
                  >
                    {{ item.fName || item.firstName || '-' }}
                  </p>
                </div>

                <div>
                  <span class="text-gray-400">
                    نام خانوادگی
                  </span>

                  <p
                    dir="ltr"
                    class="mt-1 font-bold text-gray-800"
                  >
                    {{ item.lName || item.lastName || '-' }}
                  </p>
                </div>

                <div>
                  <span class="text-gray-400">
                    ملیت
                  </span>

                  <p class="mt-1 font-bold text-gray-800">
                    {{ getPreviousPassengerNationalityTitle(item.nationality) }}
                  </p>
                </div>

                <div>
                  <span class="text-gray-400">
                    جنسیت
                  </span>

                  <p class="mt-1 font-bold text-gray-800">
                    {{ getPreviousPassengerGenderTitle(item.gender) }}
                  </p>
                </div>

                <div>
                  <span class="text-gray-400">
                    کد ملی
                  </span>

                  <p
                    dir="ltr"
                    class="mt-1 font-bold text-gray-800"
                  >
                    {{ item.codeMelli || item.nationalCode || '-' }}
                  </p>
                </div>

                <div>
                  <span class="text-gray-400">
                    تاریخ تولد
                  </span>

                  <p
                    dir="ltr"
                    class="mt-1 font-bold text-gray-800"
                  >
                    {{
                      formatPreviousPassengerBirthDate(
                        item.birthDate,
                        normalizePassengerNationality(item.nationality)
                      )
                    }}
                  </p>
                </div>
              </div>

              <button
                type="button"
                class="mt-4 w-full rounded-xl bg-blue-800 py-2.5 text-sm font-bold text-white"
                @click="selectPreviousPassenger(item)"
              >
                انتخاب
              </button>
            </div>
          </div>
        </div>

        <!-- لیست خالی -->
        <div
          v-else
          class="flex min-h-[250px] flex-col items-center justify-center p-6 text-center"
        >
          <i class="bi bi-people mb-4 text-5xl text-gray-300"></i>

          <p class="font-bold text-gray-600">
            مسافر سابقی برای این کاربر ثبت نشده است.
          </p>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>
  </div>
</template>
<style scoped>
.passenger-modal-enter-active,
.passenger-modal-leave-active {
  transition: opacity 0.2s ease;
}

.passenger-modal-enter-active > div,
.passenger-modal-leave-active > div {
  transition: transform 0.2s ease;
}

.passenger-modal-enter-from,
.passenger-modal-leave-to {
  opacity: 0;
}

.passenger-modal-enter-from > div,
.passenger-modal-leave-to > div {
  transform: translateY(12px) scale(0.98);
}
</style>