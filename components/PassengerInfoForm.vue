<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from '#app'

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
  return /^[A-Za-z0-9]{6,15}$/.test(String(value || '').trim())
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
  passenger.passportNumber = normalizeSpaces(passenger.passportNumber).toUpperCase()
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
  passenger.passportNumber = normalizeSpaces(extractValue(value)).toUpperCase()
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
      class="relative overflow-visible rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm"
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

        <div class="order-2 my-2 hidden w-px self-stretch bg-gray-200 md:block"></div>

        <div class="order-3 flex flex-grow flex-col justify-between">
          <div class="mb-6 flex justify-end">
            <UiBaseButton
              label="انتخاب از مسافران سابق"
              variant="outline"
              color="primary"
              class="!rounded-full border-primary px-5 py-2 text-xs text-primary transition-colors hover:bg-primary/5"
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
 
  </div>
</template>
