<template>
  <section class="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm" dir="rtl">
    <div v-if="mode === 'passengers'">
      <!-- Desktop -->
      <div class="hidden overflow-x-auto lg:block">
        <table class="w-full border-separate border-spacing-y-2">
          <thead>
            <tr class="text-right text-sm text-gray-500">
              <th class="px-3 py-2 text-center">نام</th>
              <th class="px-3 py-2 text-center">نام خانوادگی</th>
              <th class="px-3 py-2 text-center">ملیت</th>
              <th v-if="hasNationalCodeColumn" class="px-3 py-2 text-center">کد ملی</th>
              <th v-if="hasPassportNumberColumn" class="px-3 py-2 text-center">شماره پاسپورت</th>
              <th
  v-if="hasPassportNumberColumn"
  class="px-3 py-2 text-center"
>
  تاریخ صدور پاسپورت
</th>
              <th
  v-if="hasPassportNumberColumn"
  class="px-3 py-2 text-center"
>
  تاریخ انقضای پاسپورت
</th>
              <th class="px-3 py-2 text-center">جنسیت</th>
              <th class="px-3 py-2 text-center">تاریخ تولد</th>
              <th class="px-3 py-2 text-center">عملیات</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(passenger, index) in passengers"
              :key="`${passenger.type || 'passenger'}-${index}`"
              class="bg-gray-100/50 text-sm text-gray-800"
            >
              <td class="rounded-r-2xl px-3 py-3 text-center">{{ passenger.firstName || '-' }}</td>
              <td class="px-3 py-3 text-center">{{ passenger.lastName || '-' }}</td>
              <td class="px-3 py-3 text-center">{{ formatNationality(passenger.nationality) }}</td>

              <td v-if="hasNationalCodeColumn" class="px-3 py-3 text-center">
                {{ shouldShowNationalCode(passenger) ? passenger.nationalCode || '-' : '-' }}
              </td>

              <td v-if="hasPassportNumberColumn" class="px-3 py-3 text-center">
                {{ shouldShowPassportNumber(passenger) ? passenger.passportNumber || '-' : '-' }}
              </td>
              <td v-if="hasPassportNumberColumn" class="px-3 py-3 text-center">
  {{
    shouldShowPassportNumber(passenger)
      ? formatPassportDate(passenger.passportIssueDate)
      : '-'
  }}
</td>
<td
  v-if="hasPassportNumberColumn"
  class="px-3 py-3 text-center"
>
  {{
    shouldShowPassportNumber(passenger)
      ?formatPassportExpDate(
          passenger.passportExpDate
        )
      :'-'
  }}
</td>
              <td class="px-3 py-3 text-center">{{ formatGender(passenger.gender) }}</td>
              <td class="px-3 py-3 text-center">{{ formatBirthDate(passenger.birthDate) }}</td>

              <td class="rounded-l-2xl px-3 py-3 text-center">
                <button
                  type="button"
                  class="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white"
                  @click="openPassengerEdit(index)"
                >
                  ویرایش
                </button>
              </td>
            </tr>

            <tr v-if="!passengers.length">
              <td
                :colspan="passengerColumnCount"
                class="rounded-2xl bg-gray-50 px-3 py-5 text-center text-sm text-gray-500"
              >
                اطلاعات مسافری ثبت نشده است
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile / Tablet -->
      <div v-if="passengers.length" class="space-y-3 lg:hidden">
        <div
          v-for="(passenger, index) in passengers"
          :key="`mobile-${passenger.type || 'passenger'}-${index}`"
          class="rounded-2xl bg-gray-50 text-sm text-gray-800"
        >
          <div class="grid grid-cols-2 items-center px-3 py-3">
            <div class="text-center text-gray-500">نام</div>
            <div class="text-center">{{ passenger.firstName || '-' }}</div>
          </div>

          <div class="grid grid-cols-2 items-center px-3 py-3">
            <div class="text-center text-gray-500">نام خانوادگی</div>
            <div class="text-center">{{ passenger.lastName || '-' }}</div>
          </div>

          <div class="grid grid-cols-2 items-center px-3 py-3">
            <div class="text-center text-gray-500">ملیت</div>
            <div class="text-center">{{ formatNationality(passenger.nationality) }}</div>
          </div>

          <div
            v-if="shouldShowNationalCode(passenger)"
            class="grid grid-cols-2 items-center px-3 py-3"
          >
            <div class="text-center text-gray-500">کد ملی</div>
            <div class="text-center">{{ passenger.nationalCode || '-' }}</div>
          </div>

          <div
            v-if="shouldShowPassportNumber(passenger)"
            class="grid grid-cols-2 items-center px-3 py-3"
          >
            <div class="text-center text-gray-500">شماره پاسپورت</div>
            <div class="text-center">{{ passenger.passportNumber || '-' }}</div>
          </div>
<div
  v-if="shouldShowPassportNumber(passenger)"
  class="grid grid-cols-2 items-center px-3 py-3"
>
  <div class="text-center text-gray-500">
    تاریخ انقضای پاسپورت
  </div>

  <div class="text-center">
    {{
      formatPassportExpDate(
        passenger.passportExpDate
      )
    }}
  </div>
</div>
<div
  v-if="shouldShowPassportNumber(passenger)"
  class="grid grid-cols-2 items-center px-3 py-3"
>
  <div class="text-center text-gray-500">
    تاریخ صدور پاسپورت
  </div>

  <div class="text-center">
    {{
      formatPassportDate(
        passenger.passportIssueDate
      )
    }}
  </div>
</div>
          <div class="grid grid-cols-2 items-center px-3 py-3">
            <div class="text-center text-gray-500">جنسیت</div>
            <div class="text-center">{{ formatGender(passenger.gender) }}</div>
          </div>

          <div class="grid grid-cols-2 items-center px-3 py-3">
            <div class="text-center text-gray-500">تاریخ تولد</div>
            <div class="text-center">{{ formatBirthDate(passenger.birthDate) }}</div>
          </div>

          <div class="grid grid-cols-2 items-center px-3 py-3">
            <div class="text-center text-gray-500">عملیات</div>
            <div class="text-center">
              <button
                type="button"
                class="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white"
                @click="openPassengerEdit(index)"
              >
                ویرایش
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!passengers.length"
        class="rounded-2xl bg-gray-50 px-3 py-5 text-center text-sm text-gray-500 lg:hidden"
      >
        اطلاعات مسافری ثبت نشده است
      </div>
    </div>

    <div v-else-if="mode === 'contact'">
      <!-- Desktop -->
      <div class="hidden overflow-x-auto lg:block">
        <table class="w-full border-separate border-spacing-y-2">
          <thead>
            <tr class="text-right text-sm text-gray-500">
              <th class="px-3 py-2 text-center">شماره موبایل</th>
              <th class="px-3 py-2 text-center">ایمیل</th>
              <th class="px-3 py-2 text-center">عملیات</th>
            </tr>
          </thead>

          <tbody>
            <tr class="bg-gray-50 text-sm text-gray-800">
              <td class="rounded-r-2xl px-3 py-3 text-center" dir="ltr">{{ contact.phone || '-' }}</td>
              <td class="px-3 py-3 text-center" dir="ltr">{{ contact.email || '-' }}</td>
              <td class="rounded-l-2xl px-3 py-3 text-center">
                <button
                  type="button"
                  class="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white"
                  @click="openContactEdit"
                >
                  ویرایش
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile / Tablet -->
      <div class="rounded-2xl bg-gray-50 text-sm text-gray-800 lg:hidden">
        <div class="grid grid-cols-2 items-center px-3 py-3">
          <div class="text-center text-gray-500">شماره موبایل</div>
          <div class="text-center" dir="ltr">{{ contact.phone || '-' }}</div>
        </div>

        <div class="grid grid-cols-2 items-center px-3 py-3">
          <div class="text-center text-gray-500">ایمیل</div>
          <div class="text-center" dir="ltr">{{ contact.email || '-' }}</div>
        </div>

        <div class="grid grid-cols-2 items-center px-3 py-3">
          <div class="text-center text-gray-500">عملیات</div>
          <div class="text-center">
            <button
              type="button"
              class="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white"
              @click="openContactEdit"
            >
              ویرایش
            </button>
          </div>
        </div>
      </div>
    </div>

    <Transition name="modal-fade">
      <div
        v-if="isPassengerModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        @click.self="closePassengerModal"
      >
        <Transition name="modal-scale" appear>
          <div class="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-5 shadow-xl">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-base font-bold text-gray-900">ویرایش اطلاعات مسافر</h3>

              <button
                type="button"
                class="text-xl text-gray-400"
                @click="closePassengerModal"
              >
                ×
              </button>
            </div>

            <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <UiBaseInput
                  :model-value="passengerForm.firstName"
                  label="نام"
                  placeholder="نام"
                  :rtl="true"
                  @update:model-value="onPassengerFirstNameChange($event)"
                />
                <p v-if="passengerErrors.firstName" class="mt-1 text-xs text-red-500">
                  {{ passengerErrors.firstName }}
                </p>
              </div>

              <div>
                <UiBaseInput
                  :model-value="passengerForm.lastName"
                  label="نام خانوادگی"
                  placeholder="نام خانوادگی"
                  :rtl="true"
                  @update:model-value="onPassengerLastNameChange($event)"
                />
                <p v-if="passengerErrors.lastName" class="mt-1 text-xs text-red-500">
                  {{ passengerErrors.lastName }}
                </p>
              </div>

              <div>
                <UiBaseAutocomplete
                  :model-value="passengerForm.nationality"
                  :items="nationalityOptions"
                  item-text="label"
                  item-value="value"
                  label="ملیت"
                  placeholder="ملیت"
                  :clearable="false"
                  :rtl="true"
                  @update:model-value="onPassengerNationalityChange($event)"
                />
                <p v-if="passengerErrors.nationality" class="mt-1 text-xs text-red-500">
                  {{ passengerErrors.nationality }}
                </p>
              </div>
<div
  v-if="
    props.flightType==='international'&&
    passengerForm.nationality==='FOREIGN'
  "
>
  <UiBaseAutocomplete
    :model-value="passengerForm.countryCode"
    :items="countryOptions"
    item-text="label"
    item-value="value"
    label="کشور"
    placeholder="کشور را انتخاب کنید"
    :clearable="false"
    :rtl="true"
    :loading="countriesLoading"
    @focus="loadCountries"
    @update:model-value="
      onPassengerCountryChange(
        $event
      )
    "
  />

  <p
    v-if="passengerErrors.countryCode"
    class="mt-1 text-xs text-red-500"
  >
    {{ passengerErrors.countryCode }}
  </p>
</div>
              <div v-if="shouldShowNationalCode(passengerForm)">
                <UiBaseInput
                  :model-value="passengerForm.nationalCode"
                  label="کد ملی"
                  placeholder="کد ملی"
                  :rtl="true"
                  @update:model-value="onPassengerNationalCodeChange($event)"
                />
                <p v-if="passengerErrors.nationalCode" class="mt-1 text-xs text-red-500">
                  {{ passengerErrors.nationalCode }}
                </p>
              </div>

              <div v-if="shouldShowPassportNumber(passengerForm)">
                <UiBaseInput
                  :model-value="passengerForm.passportNumber"
                  label="شماره پاسپورت"
                  placeholder="شماره پاسپورت"
                  :rtl="true"
                  @update:model-value="onPassengerPassportChange($event)"
                />
                <p v-if="passengerErrors.passportNumber" class="mt-1 text-xs text-red-500">
                  {{ passengerErrors.passportNumber }}
                </p>
              </div>

              <div>
                <UiBaseAutocomplete
                  :model-value="passengerForm.gender"
                  :items="genderOptions"
                  item-text="label"
                  item-value="value"
                  label="جنسیت"
                  placeholder="جنسیت"
                  :clearable="false"
                  :rtl="true"
                  @update:model-value="onPassengerGenderChange($event)"
                />
                <p v-if="passengerErrors.gender" class="mt-1 text-xs text-red-500">
                  {{ passengerErrors.gender }}
                </p>
              </div>

              <div class="space-y-1 text-right md:col-span-3">
                <div class="mb-3 pr-1 text-xs text-gray-400">تاریخ تولد</div>

                <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <UiBaseAutocomplete
                    :model-value="passengerForm.birthDate.day"
                    :items="dayOptions"
                    item-text="label"
                    item-value="value"
                    label="روز"
                    placeholder="روز"
                    :rtl="true"
                    :menu-props="scrollableMenuProps"
                    @update:model-value="onPassengerBirthDayChange($event)"
                  />

                  <UiBaseAutocomplete
                    :model-value="passengerForm.birthDate.month"
                    :items="getMonthOptions(passengerForm.nationality)"
                    item-text="label"
                    item-value="value"
                    label="ماه"
                    placeholder="ماه"
                    :rtl="true"
                    :menu-props="scrollableMenuProps"
                    @update:model-value="onPassengerBirthMonthChange($event)"
                  />

                  <UiBaseAutocomplete
                    :model-value="passengerForm.birthDate.year"
                    :items="getYearOptions(passengerForm.nationality)"
                    item-text="label"
                    item-value="value"
                    label="سال"
                    :placeholder="passengerForm.nationality === 'IR' ? 'سال شمسی' : 'سال میلادی'"
                    :rtl="true"
                    :menu-props="scrollableMenuProps"
                    @update:model-value="onPassengerBirthYearChange($event)"
                  />
                </div>

                <p v-if="passengerErrors.birthDate" class="mt-2 text-xs text-red-500">
                  {{ passengerErrors.birthDate }}
                </p>
              </div>
            </div>
            <div
  v-if="shouldShowPassportNumber(passengerForm)"
  class="space-y-1 text-right md:col-span-3"
>
  <div class="mb-3 pr-1 text-xs text-gray-400">
    تاریخ صدور پاسپورت
  </div>

  <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
    <UiBaseAutocomplete
      :model-value="passengerForm.passportIssueDate.day"
      :items="dayOptions"
      item-text="label"
      item-value="value"
      label="روز"
      placeholder="روز"
      :rtl="true"
      :menu-props="scrollableMenuProps"
      @update:model-value="
        onPassportIssueDayChange($event)
      "
    />

    <UiBaseAutocomplete
      :model-value="passengerForm.passportIssueDate.month"
      :items="gregorianMonthOptions"
      item-text="label"
      item-value="value"
      label="ماه"
      placeholder="ماه"
      :rtl="true"
      :menu-props="scrollableMenuProps"
      @update:model-value="
        onPassportIssueMonthChange($event)
      "
    />

    <UiBaseAutocomplete
      :model-value="passengerForm.passportIssueDate.year"
      :items="passportIssueYearOptions"
      item-text="label"
      item-value="value"
      label="سال"
      placeholder="سال میلادی"
      :rtl="true"
      :menu-props="scrollableMenuProps"
      @update:model-value="
        onPassportIssueYearChange($event)
      "
    />
  </div>

  <p
    v-if="passengerErrors.passportIssueDate"
    class="mt-2 text-xs text-red-500"
  >
    {{ passengerErrors.passportIssueDate }}
  </p>
</div>
<div
  v-if="shouldShowPassportNumber(passengerForm)"
  class="space-y-1 text-right md:col-span-3"
>
  <div class="mb-3 pr-1 text-xs text-gray-400">
    تاریخ انقضای پاسپورت
  </div>

  <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
    <UiBaseAutocomplete
      :model-value="passengerForm.passportExpDate.day"
      :items="dayOptions"
      item-text="label"
      item-value="value"
      label="روز"
      placeholder="روز"
      :rtl="true"
      :menu-props="scrollableMenuProps"
      @update:model-value="
        onPassportExpireDayChange($event)
      "
    />

    <UiBaseAutocomplete
      :model-value="passengerForm.passportExpDate.month"
      :items="gregorianMonthOptions"
      item-text="label"
      item-value="value"
      label="ماه"
      placeholder="ماه"
      :rtl="true"
      :menu-props="scrollableMenuProps"
      @update:model-value="
        onPassportExpireMonthChange($event)
      "
    />

    <UiBaseAutocomplete
      :model-value="passengerForm.passportExpDate.year"
      :items="passportExpireYearOptions"
      item-text="label"
      item-value="value"
      label="سال"
      placeholder="سال میلادی"
      :rtl="true"
      :menu-props="scrollableMenuProps"
      @update:model-value="
        onPassportExpireYearChange($event)
      "
    />
  </div>

  <p
    v-if="passengerErrors.passportExpDate"
    class="mt-2 text-xs text-red-500"
  >
    {{ passengerErrors.passportExpDate }}
  </p>
</div>
            <div class="mt-5 flex justify-end gap-2">
              <button
                type="button"
                class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600"
                @click="closePassengerModal"
              >
                انصراف
              </button>

              <button
                type="button"
                class="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white"
                @click="submitPassengerEdit"
              >
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div
        v-if="isContactModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        @click.self="closeContactModal"
      >
        <Transition name="modal-scale" appear>
          <div class="w-full max-w-lg rounded-3xl bg-white p-5 shadow-xl">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-base font-bold text-gray-900">ویرایش اطلاعات تماس</h3>

              <button
                type="button"
                class="text-xl text-gray-400"
                @click="closeContactModal"
              >
                ×
              </button>
            </div>

            <div class="grid grid-cols-1 gap-3">
              <div>
                <UiBaseInput
                  :model-value="contactForm.phone"
                  label="شماره موبایل"
                  placeholder="شماره موبایل"
                  :rtl="true"
                  @update:model-value="onContactPhoneChange($event)"
                />
                <p v-if="contactErrors.phone" class="mt-1 text-xs text-red-500">
                  {{ contactErrors.phone }}
                </p>
              </div>

              <div>
                <UiBaseInput
                  :model-value="contactForm.email"
                  label="ایمیل"
                  placeholder="ایمیل"
                  :rtl="true"
                  @update:model-value="onContactEmailChange($event)"
                />
                <p v-if="contactErrors.email" class="mt-1 text-xs text-red-500">
                  {{ contactErrors.email }}
                </p>
              </div>
            </div>

            <div class="mt-5 flex justify-end gap-2">
              <button
                type="button"
                class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600"
                @click="closeContactModal"
              >
                انصراف
              </button>

              <button
                type="button"
                class="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white"
                @click="submitContactEdit"
              >
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import {useFlightStore} from '~/stores/flights'

const flightStore=
  useFlightStore()
const emit = defineEmits(['update:passengers', 'update:contact'])
const countryOptions=
  computed(
    ()=>flightStore.countries
  )

const countriesLoading=
  computed(
    ()=>flightStore.countriesLoading
  )
  async function loadCountries(){
  try{
    await flightStore.loadCountries()
  }catch(error){
    console.error(
      'Countries load error:',
      error
    )
  }
}
const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['passengers', 'contact'].includes(value),
  },
  flightType: {
    type: String,
    default: 'domestic',
    validator: (value) => ['domestic', 'international'].includes(value),
  },
  passengers: {
    type: Array,
    default: () => [],
  },
  contact: {
    type: Object,
    default: () => ({
      phone: '',
      email: '',
    }),
  },
})

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

const isPassengerModalOpen = ref(false)
const isContactModalOpen = ref(false)
const editingPassengerIndex = ref(null)

const passengerForm=reactive({
  type:'',
  label:'',
  firstName:'',
  lastName:'',
  nationality:'IR',
  countryCode:'',
  nationalCode:'',
  passportNumber:'',
  passportIssueDate:{
    day:'',
    month:'',
    year:'',
    calendar:'gregorian'
  },
  passportExpDate:{
    day:'',
    month:'',
    year:'',
    calendar:'gregorian'
  },
  gender:'male',
  birthDate:{
    day:'',
    month:'',
    year:'',
    calendar:'jalali'
  }
})

const contactForm = reactive({
  phone: '',
  email: '',
})

const passengerErrors = reactive({
  firstName:'',
  lastName:'',
  nationality:'',
  nationalCode:'',
  passportNumber:'',
  passportIssueDate:'',
  passportExpDate:'',
  gender:'',
  birthDate:''
})

const contactErrors = reactive({
  phone: '',
  email: '',
})

const hasNationalCodeColumn = computed(() =>
  props.passengers.some((passenger) => shouldShowNationalCode(passenger))
)

const hasPassportNumberColumn = computed(() =>
  props.passengers.some((passenger) => shouldShowPassportNumber(passenger))
)

const passengerColumnCount = computed(() => {
  let count = 6
  if (hasNationalCodeColumn.value) count += 1
  if (hasPassportNumberColumn.value) count += 3
  return count + 1
})

const dayOptions = computed(() => {
  const days = []
  for (let day = 1; day <= 31; day += 1) {
    days.push({ label: String(day), value: String(day) })
  }
  return days
})
function formatPassportDate(value){
  if(!value)return'-'

  if(
    typeof value==='object'&&
    value.day&&
    value.month&&
    value.year
  ){
    return`${value.year}/${String(value.month).padStart(2,'0')}/${String(value.day).padStart(2,'0')}`
  }

  const date=new Date(value)

  if(!Number.isNaN(date.getTime())){
    return[
      date.getFullYear(),
      String(date.getMonth()+1).padStart(2,'0'),
      String(date.getDate()).padStart(2,'0')
    ].join('/')
  }

  return'-'
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

function normalizeGender(value) {
  if (!value) return ''
  const normalized = String(value).toLowerCase()
  if (normalized === 'male' || normalized === 'مرد' || normalized === 'آقا') return 'male'
  if (normalized === 'female' || normalized === 'زن' || normalized === 'خانم') return 'female'
  return String(value)
}

function formatGender(value) {
  const normalized = normalizeGender(value)
  if (normalized === 'male') return 'مرد'
  if (normalized === 'female') return 'زن'
  return value || '-'
}

function formatNationality(value) {
  if (value === 'IR') return 'ایرانی'
  if (value === 'FOREIGN') return 'غیر ایرانی'
  return value || '-'
}

function shouldShowNationalCode(passenger) {
  if (!passenger) return false
  return passenger.nationality === 'IR'
}

function shouldShowPassportNumber(passenger) {
  if (!passenger) return false

  const isIranian = passenger.nationality === 'IR'

  if (props.flightType === 'domestic' && !isIranian) return true
  if (props.flightType === 'international') return true

  return false
}

function getMonthOptions(nationality) {
  return nationality === 'IR' ? jalaliMonthOptions : gregorianMonthOptions
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
function onPassengerCountryChange(value){
  passengerForm.countryCode=
    String(
      extractValue(value)||''
    )
      .trim()
      .toUpperCase()

  passengerErrors.countryCode=''
}
function getPassportIssueYearOptions(){
  const years=[]
  const currentYear=new Date().getFullYear()

  for(
    let year=currentYear;
    year>=1920;
    year-=1
  ){
    years.push({
      label:String(year),
      value:String(year)
    })
  }

  return years
}

const passportIssueYearOptions=
  getPassportIssueYearOptions()
  function onPassportIssueDayChange(value){
  passengerForm.passportIssueDate.day=
    onlyNumbers(
      extractValue(value)
    ).slice(0,2)

  passengerErrors.passportIssueDate=''
}

function onPassportIssueMonthChange(value){
  passengerForm.passportIssueDate.month=
    onlyNumbers(
      extractValue(value)
    ).slice(0,2)

  passengerErrors.passportIssueDate=''
}

function onPassportIssueYearChange(value){
  passengerForm.passportIssueDate.year=
    onlyNumbers(
      extractValue(value)
    ).slice(0,4)

  passengerErrors.passportIssueDate=''
}
function getPassportExpireYearOptions(){
  const years=[]
  const currentYear=new Date().getFullYear()

  for(
    let year=currentYear;
    year<=currentYear+15;
    year+=1
  ){
    years.push({
      label:String(year),
      value:String(year)
    })
  }

  return years
}

const passportExpireYearOptions=
  getPassportExpireYearOptions()
  function normalizePassportExpDate(value){
  if(!value){
    return{
      day:'',
      month:'',
      year:'',
      calendar:'gregorian'
    }
  }

  if(typeof value==='object'){
    return{
      day:String(value.day||''),
      month:String(value.month||''),
      year:String(value.year||''),
      calendar:'gregorian'
    }
  }

  const date=new Date(value)

  if(!Number.isNaN(date.getTime())){
    return{
      day:String(date.getDate()),
      month:String(date.getMonth()+1),
      year:String(date.getFullYear()),
      calendar:'gregorian'
    }
  }

  const parts=
    String(value)
      .split('/')
      .map(x=>x.trim())

  return{
    year:parts[0]||'',
    month:parts[1]||'',
    day:parts[2]||'',
    calendar:'gregorian'
  }
}
function formatBirthDate(value) {
  if (!value) return '-'

  if (typeof value === 'string') return value

  if (typeof value === 'object') {
    const year = value.year || ''
    const month = value.month || ''
    const day = value.day || ''
    if (!year && !month && !day) return '-'
    return `${year}/${month}/${day}`
  }

  return '-'
}
function formatPassportExpDate(value){
  if(!value)return'-'

  if(typeof value==='object'){
    const year=value?.year||''
    const month=value?.month||''
    const day=value?.day||''

    if(!year&&!month&&!day){
      return'-'
    }

    return[
      year,
      String(month).padStart(2,'0'),
      String(day).padStart(2,'0')
    ].join('/')
  }

  const date=new Date(value)

  if(
    !Number.isNaN(
      date.getTime()
    )
  ){
    return[
      date.getFullYear(),
      String(
        date.getMonth()+1
      ).padStart(2,'0'),
      String(
        date.getDate()
      ).padStart(2,'0')
    ].join('/')
  }

  return String(value||'-')
}
function normalizeBirthDate(value, nationality) {
  const calendar = nationality === 'IR' ? 'jalali' : 'gregorian'

  if (!value) {
    return {
      day: '',
      month: '',
      year: '',
      calendar,
    }
  }

  if (typeof value === 'object') {
    return {
      day: String(value.day || ''),
      month: String(value.month || ''),
      year: String(value.year || ''),
      calendar: value.calendar || calendar,
    }
  }

  if (typeof value === 'string') {
    const parts = value.split('/').map((item) => item.trim())
    return {
      year: parts[0] || '',
      month: parts[1] || '',
      day: parts[2] || '',
      calendar,
    }
  }

  return {
    day: '',
    month: '',
    year: '',
    calendar,
  }
}

function resetPassengerErrors() {
  passengerErrors.firstName = ''
  passengerErrors.lastName = ''
  passengerErrors.nationality = ''
  passengerErrors.nationalCode = ''
  passengerErrors.passportNumber = ''
  passengerErrors.gender = ''
  passengerErrors.birthDate = ''
  passengerErrors.passportExpDate=''
  passengerErrors.passportIssueDate=''
}

function resetContactErrors() {
  contactErrors.phone = ''
  contactErrors.email = ''
}

function resetPassengerForm() {
  passengerForm.type = ''
  passengerForm.label = ''
  passengerForm.firstName = ''
  passengerForm.nationality='IR'
passengerForm.countryCode=''
  passengerForm.lastName = ''
  passengerForm.nationality = 'IR'
  passengerForm.nationalCode = ''
  passengerForm.passportNumber = ''
  passengerForm.passportIssueDate={
  day:'',
  month:'',
  year:'',
  calendar:'gregorian'
}
  passengerForm.passportExpDate={
  day:'',
  month:'',
  year:'',
  calendar:'gregorian'
}
  passengerForm.gender = 'male'
  passengerForm.birthDate = {
    day: '',
    month: '',
    year: '',
    calendar: 'jalali',
  }
}

function closePassengerModal() {
  isPassengerModalOpen.value = false
  editingPassengerIndex.value = null
  resetPassengerForm()
  resetPassengerErrors()
}
function normalizePassportDate(value){
  if(!value){
    return{
      day:'',
      month:'',
      year:'',
      calendar:'gregorian'
    }
  }

  if(typeof value==='object'){
    return{
      day:String(value.day||''),
      month:String(value.month||''),
      year:String(value.year||''),
      calendar:value.calendar||'gregorian'
    }
  }

  const date=new Date(value)

  if(Number.isNaN(date.getTime())){
    return{
      day:'',
      month:'',
      year:'',
      calendar:'gregorian'
    }
  }

  return{
    day:String(date.getDate()),
    month:String(date.getMonth()+1),
    year:String(date.getFullYear()),
    calendar:'gregorian'
  }
}
function openPassengerEdit(index) {
  const item = props.passengers[index]
  if (!item) return

  resetPassengerErrors()

  editingPassengerIndex.value = index
  passengerForm.type = item.type || ''
  passengerForm.label = item.label || ''
  passengerForm.firstName = item.firstName || ''
  passengerForm.lastName = item.lastName || ''
  passengerForm.nationality = item.nationality || 'IR'
  passengerForm.nationalCode = item.nationalCode || ''
  passengerForm.passportNumber = item.passportNumber || ''
  passengerForm.countryCode=
  item.countryCode||''
passengerForm.passportIssueDate=normalizePassportDate(item?.passportIssueDate)
passengerForm.passportExpDate=normalizePassportDate(item?.passportExpDate)
  passengerForm.gender = normalizeGender(item.gender) || 'male'
  passengerForm.birthDate = normalizeBirthDate(item.birthDate, item.nationality)

  isPassengerModalOpen.value = true
}

function openContactEdit() {
  resetContactErrors()
  contactForm.phone = props.contact?.phone || ''
  contactForm.email = props.contact?.email || ''
  isContactModalOpen.value = true
}

function closeContactModal() {
  isContactModalOpen.value = false
  contactForm.phone = ''
  contactForm.email = ''
  resetContactErrors()
}
// function normalizePassportDate(value){
//   if(!value){
//     return{
//       day:'',
//       month:'',
//       year:'',
//       calendar:'gregorian'
//     }
//   }

//   if(typeof value==='object'){
//     return{
//       day:String(value.day||''),
//       month:String(value.month||''),
//       year:String(value.year||''),
//       calendar:value.calendar||'gregorian'
//     }
//   }

//   const date=new Date(value)

//   if(Number.isNaN(date.getTime())){
//     return{
//       day:'',
//       month:'',
//       year:'',
//       calendar:'gregorian'
//     }
//   }

//   return{
//     day:String(date.getDate()),
//     month:String(date.getMonth()+1),
//     year:String(date.getFullYear()),
//     calendar:'gregorian'
//   }
// }
function validatePassengerForm() {
  resetPassengerErrors()

  let isValid = true

  if (!normalizeSpaces(passengerForm.firstName)) {
    passengerErrors.firstName = 'نام الزامی است'
    isValid = false
  }

  if (!normalizeSpaces(passengerForm.lastName)) {
    passengerErrors.lastName = 'نام خانوادگی الزامی است'
    isValid = false
  }

  if (!passengerForm.nationality) {
    passengerErrors.nationality = 'ملیت الزامی است'
    isValid = false
  }

  if (!passengerForm.gender) {
    passengerErrors.gender = 'جنسیت الزامی است'
    isValid = false
  }

  if (shouldShowNationalCode(passengerForm)) {
    if (!passengerForm.nationalCode) {
      passengerErrors.nationalCode = 'کد ملی الزامی است'
      isValid = false
    } else if (passengerForm.nationalCode.length !== 10) {
      passengerErrors.nationalCode = 'کد ملی باید 10 رقم باشد'
      isValid = false
    }
  }

 if(
  shouldShowPassportNumber(
    passengerForm
  )
){
  if(
    !normalizeSpaces(
      passengerForm.passportNumber
    )
  ){
    passengerErrors.passportNumber=
      'شماره پاسپورت الزامی است'

    isValid=false
  }
const issue=
  passengerForm.passportIssueDate

if(
  !issue.day||
  !issue.month||
  !issue.year
){
  passengerErrors.passportIssueDate=
    'تاریخ صدور پاسپورت کامل نیست'

  isValid=false
}else{
  const issueDate=new Date(
    Number(issue.year),
    Number(issue.month)-1,
    Number(issue.day)
  )

  if(
    Number.isNaN(
      issueDate.getTime()
    )||
    issueDate>new Date()
  ){
    passengerErrors.passportIssueDate=
      'تاریخ صدور پاسپورت معتبر نیست'

    isValid=false
  }
}
  const exp=
    passengerForm.passportExpDate

  if(
    !exp.day||
    !exp.month||
    !exp.year
  ){
    passengerErrors.passportExpDate=
      'تاریخ انقضای پاسپورت کامل نیست'

    isValid=false
  }else{
    const expireDate=new Date(
      Number(exp.year),
      Number(exp.month)-1,
      Number(exp.day),
      23,59,59
    )

    if(
      Number.isNaN(
        expireDate.getTime()
      )||
      expireDate<=new Date()
    ){
      passengerErrors.passportExpDate=
        'تاریخ انقضای پاسپورت معتبر نیست'

      isValid=false
    }
  }
}

  if (
    !passengerForm.birthDate.day ||
    !passengerForm.birthDate.month ||
    !passengerForm.birthDate.year
  ) {
    passengerErrors.birthDate = 'تاریخ تولد کامل نیست'
    isValid = false
  }

  return isValid
}

function validateContactForm() {
  resetContactErrors()

  let isValid = true

  const normalizedPhone = normalizeSpaces(contactForm.phone)
  const normalizedEmail = normalizeSpaces(contactForm.email)

  if (!normalizedPhone) {
    contactErrors.phone = 'شماره موبایل الزامی است'
    isValid = false
  } else if (!/^09\d{9}$/.test(onlyNumbers(normalizedPhone))) {
    contactErrors.phone = 'شماره موبایل معتبر نیست'
    isValid = false
  }

  if (!normalizedEmail) {
    contactErrors.email = 'ایمیل الزامی است'
    isValid = false
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(normalizedEmail)) {
      contactErrors.email = 'فرمت ایمیل صحیح نیست'
      isValid = false
    }
  }

  return isValid
}

function submitPassengerEdit(){
  if(editingPassengerIndex.value===null)return
  if(!validatePassengerForm())return

  const next=[...props.passengers]

  const nationalityCode=
    passengerForm.nationality==='IR'
      ?'IR'
      :String(passengerForm.countryCode||'')
        .trim()
        .toUpperCase()

  next[editingPassengerIndex.value]={
    ...next[editingPassengerIndex.value],
    type:passengerForm.type,
    label:passengerForm.label,
    firstName:normalizeSpaces(passengerForm.firstName),
    lastName:normalizeSpaces(passengerForm.lastName),
    nationality:nationalityCode,
    countryCode:nationalityCode,
    nationalCode:
      passengerForm.nationality==='IR'
        ?passengerForm.nationalCode
        :'',
    passportNumber:
      shouldShowPassportNumber(passengerForm)
        ?passengerForm.passportNumber
        :'',
    passportIssueDate:
      shouldShowPassportNumber(passengerForm)
        ?{
            day:passengerForm.passportIssueDate.day,
            month:passengerForm.passportIssueDate.month,
            year:passengerForm.passportIssueDate.year,
            calendar:'gregorian'
          }
        :null,
    passportExpDate:
      shouldShowPassportNumber(passengerForm)
        ?{
            day:passengerForm.passportExpDate.day,
            month:passengerForm.passportExpDate.month,
            year:passengerForm.passportExpDate.year,
            calendar:'gregorian'
          }
        :null,
    gender:passengerForm.gender,
    birthDate:{
      day:passengerForm.birthDate.day,
      month:passengerForm.birthDate.month,
      year:passengerForm.birthDate.year,
      calendar:
        passengerForm.nationality==='IR'
          ?'jalali'
          :'gregorian'
    }
  }

  emit('update:passengers',next)
  closePassengerModal()
}

function submitContactEdit() {
  if (!validateContactForm()) return

  emit('update:contact', {
    phone: normalizeSpaces(contactForm.phone),
    email: normalizeSpaces(contactForm.email),
  })

  closeContactModal()
}

function onPassengerFirstNameChange(value) {
  passengerForm.firstName = onlyLatin(extractValue(value))
  if (passengerErrors.firstName) passengerErrors.firstName = ''
}

function onPassengerLastNameChange(value) {
  passengerForm.lastName = onlyLatin(extractValue(value))
  if (passengerErrors.lastName) passengerErrors.lastName = ''
}

function onPassengerNationalCodeChange(value) {
  passengerForm.nationalCode = onlyNumbers(extractValue(value)).slice(0, 10)
  if (passengerErrors.nationalCode) passengerErrors.nationalCode = ''
}

function onPassengerPassportChange(value) {
  passengerForm.passportNumber = normalizeSpaces(extractValue(value)).toUpperCase()
  if (passengerErrors.passportNumber) passengerErrors.passportNumber = ''
}
function onPassportExpireDayChange(value){
  passengerForm.passportExpDate.day=
    onlyNumbers(
      extractValue(value)
    ).slice(0,2)

  passengerErrors.passportExpDate=''
}

function onPassportExpireMonthChange(value){
  passengerForm.passportExpDate.month=
    onlyNumbers(
      extractValue(value)
    ).slice(0,2)

  passengerErrors.passportExpDate=''
}

function onPassportExpireYearChange(value){
  passengerForm.passportExpDate.year=
    onlyNumbers(
      extractValue(value)
    ).slice(0,4)

  passengerErrors.passportExpDate=''
}
function onPassengerNationalityChange(value) {
  passengerForm.nationality = String(extractValue(value) || 'IR')
  passengerForm.nationalCode = ''
  passengerForm.passportNumber = ''
  passengerForm.passportIssueDate={
  day:'',
  month:'',
  year:'',
  calendar:'gregorian'
}
  passengerForm.passportExpDate={
  day:'',
  month:'',
  year:'',
  calendar:'gregorian'
}

passengerErrors.passportExpDate=''
passengerErrors.passportIssueDate=''
  passengerForm.birthDate.day = ''
  passengerForm.birthDate.month = ''
  passengerForm.birthDate.year = ''
  passengerForm.birthDate.calendar = passengerForm.nationality === 'IR' ? 'jalali' : 'gregorian'

  passengerErrors.nationality = ''
  passengerErrors.nationalCode = ''
  passengerErrors.passportNumber = ''
  passengerErrors.birthDate = ''
}

function onPassengerGenderChange(value) {
  passengerForm.gender = String(extractValue(value) || '')
  if (passengerErrors.gender) passengerErrors.gender = ''
}

function onPassengerBirthDayChange(value) {
  passengerForm.birthDate.day = onlyNumbers(extractValue(value)).slice(0, 2)
  if (passengerErrors.birthDate) passengerErrors.birthDate = ''
}

function onPassengerBirthMonthChange(value) {
  passengerForm.birthDate.month = onlyNumbers(extractValue(value)).slice(0, 2)
  if (passengerErrors.birthDate) passengerErrors.birthDate = ''
}

function onPassengerBirthYearChange(value) {
  passengerForm.birthDate.year = onlyNumbers(extractValue(value)).slice(0, 4)
  if (passengerErrors.birthDate) passengerErrors.birthDate = ''
}

function onContactPhoneChange(value) {
  contactForm.phone = String(extractValue(value) || '')
  if (contactErrors.phone) contactErrors.phone = ''
}

function onContactEmailChange(value) {
  contactForm.email = String(extractValue(value) || '')
  if (contactErrors.email) contactErrors.email = ''
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 220ms ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}

.modal-scale-enter-to,
.modal-scale-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
