<script setup>
import {
  ref,
  watch,
  computed
} from "vue";

import { useRoute } from "vue-router";
const props = defineProps({
  compact: {
  type: Boolean,
  default: false
},
  sendTravelType: {
    type: String,
    default: "one-way"
  },

  departDate: {
    type: [String, null],
    default: null
  },

  returnDate: {
    type: [String, null],
    default: null
  }
})

const route = useRoute()


const disablePastDates = (date) => {
  const selected = new Date(date)

  const today = new Date()

  today.setHours(0, 0, 0, 0)
  selected.setHours(0, 0, 0, 0)

  return selected < today
}
const emit = defineEmits([
  "update:departDate",
  "update:returnDate",
  "date-complete"
])

const departDate = ref("");
const returnDate = ref("");

const showdepartDate = ref(false);
const showreturnDate = ref(false);
const syncingDepart =
  ref(false)

const syncingReturn =
  ref(false)
// رنگ‌ها از theme
const styles = {
  "primary-color": "var(--color-primary)",
  "secondary-color": "var(--color-primary)",
  "in-range-background": "var(--color-primary-light)"
};

const openDepartPicker = () => {
  showdepartDate.value = true;
};

const openReturnPicker = () => {
  if (props.sendTravelType === "one-way") return
  showreturnDate.value = true;
};

const clearDepartDate = () => {
  departDate.value = "";
  emit("update:departDate", null)
};

const clearReturnDate = () => {
  returnDate.value = "";
  emit("update:returnDate", null)
};
const toPersianDigits = value =>
  String(value || "").replace(
    /\d/g,
    digit => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]
  )

const toJalaliDate = value => {
  const raw = String(value || "").trim()

  if (!raw)
    return ""

  const normalized =
    raw.replace(/-/g, "/")

  const parts =
    normalized.split("/")

  if (parts.length !== 3)
    return toPersianDigits(raw)

  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])

  // اگر به هر دلیل از قبل شمسی بود
  if (year < 1700) {
    return toPersianDigits(
      `${String(year).padStart(4, "0")}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`
    )
  }

  const dateValue = new Date(
    year,
    month - 1,
    day,
    12,
    0,
    0
  )

  if (Number.isNaN(dateValue.getTime()))
    return toPersianDigits(raw)

  return new Intl.DateTimeFormat(
    "fa-IR-u-ca-persian",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  ).format(dateValue)
}
const displayDepartDate = computed(() =>
  toJalaliDate(departDate.value)
)

const displayReturnDate = computed(() =>
  toJalaliDate(returnDate.value)
)
/* -----------------------
watch برای emit تاریخ رفت
----------------------- */
watch(
  departDate,
  (newVal, oldVal) => {

    if (syncingDepart.value)
      return

    emit(
      "update:departDate",
      newVal || null
    )

    if (
      !newVal ||
      newVal === oldVal
    )
      return

    showdepartDate.value = false

    // رفت و برگشت:
    // بعد از تاریخ رفت، برگشت باز شود
    if (
      props.sendTravelType ===
      "round-trip"
    ) {

      setTimeout(() => {
        showreturnDate.value = true
      }, 100)

      return
    }

    // یک طرفه:
    // کار تاریخ تمام شده
    emit("date-complete")
  }
)

/* -----------------------
watch برای emit تاریخ برگشت
----------------------- */
watch(
  () => props.departDate,

  (value) => {

    syncingDepart.value = true

    departDate.value =
      value || ""

    showdepartDate.value = false

    queueMicrotask(() => {
      syncingDepart.value = false
    })
  },

  {
    immediate: true
  }
)

watch(
  () => props.returnDate,

  (value) => {

    syncingReturn.value = true

    returnDate.value =
      value || ""

    showreturnDate.value = false

    queueMicrotask(() => {
      syncingReturn.value = false
    })
  },

  {
    immediate: true
  }
)
watch(
  returnDate,
  (newVal, oldVal) => {

    if (syncingReturn.value)
      return

    emit(
      "update:returnDate",
      newVal || null
    )

    if (
      !newVal ||
      newVal === oldVal
    )
      return

    showreturnDate.value = false

    // تاریخ‌ها کامل شده‌اند
    emit("date-complete")
  }
)

/* -----------------------
اگر نوع سفر یک‌طرفه شد،
تاریخ برگشت پاک شود
----------------------- */
watch(() => props.sendTravelType, (newType) => {
  if (newType === "one-way") {
    returnDate.value = ""
    showreturnDate.value = false
    emit("update:returnDate", null)
  }
})
defineExpose({
  openDepartPicker,
  openReturnPicker
})
</script>

<template>
  <div
    dir="rtl"
    class="date-picker-container w-full"
    :class="{ 'is-flight-page': compact }" 
  >
    <div
      class="date-picker-wrapper flex w-full justify-center"
      :class="compact ? 'p-0' : 'p-4'" 
    >
    <div
  class="
    date-picker-box
    relative
    flex
    min-w-0
    overflow-visible
    rounded-[10px]
    border
    border-[var(--color-gray-300)]
    bg-[var(--color-white)]
  "
  :class="compact ? 'h-[44px]' : 'h-[54px]'"
>

        <!-- تاریخ رفت -->
        <div
          class="
            date-field
            relative
            min-w-0
            flex-1
          "
        >

          <label
            class="
              date-label
              absolute
              -top-3
              right-6
              z-10
              whitespace-nowrap
              bg-[var(--color-white)]
              px-2
              text-[10px]
              leading-5
              text-[var(--color-gray-400)]
            "
          >
            تاریخ رفت
          </label>


          <input
            readonly
            :value="displayDepartDate"
            placeholder="تاریخ رفت"
            @click="openDepartPicker"
            class="
              date-input
              h-full
              w-full
              min-w-0
              cursor-pointer
              border-none
              bg-transparent
              pb-0
              pl-3
              pr-10
              pt-1.5
              text-[10px]
              font-bold
              text-[var(--color-gray-800)]
              outline-none
              placeholder:text-[var(--color-gray-400)]
            "
          >


          <!-- Clear -->
          <button
            v-if="departDate"
            type="button"
            @click="clearDepartDate"
            class="
              date-clear
              absolute
              right-3
              top-1/2
              z-20
              -translate-y-1/2
              text-[var(--color-gray-400)]
              transition-colors
              hover:text-[var(--color-red-500)]
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>


          <PersianDatePicker
            :styles="styles"
            v-model="departDate"
            class="hidden"
            :auto-submit="false"
            :show="showdepartDate"
            format="YYYY/MM/DD"
            mode="single"
            locale="fa,en"
            :disable="disablePastDates"
            @close="showdepartDate = false"
          >
            <template #icon></template>

            <template #footer>
              تاریخ رفت:
            </template>
          </PersianDatePicker>

        </div>


        <!-- Divider -->
        <div
          class="
            h-full
            w-px
            shrink-0
            bg-[var(--color-gray-300)]
          "
        ></div>


        <!-- تاریخ برگشت -->
        <div
          class="
            date-field
            relative
            min-w-0
            flex-1
          "
          :class="
            props.sendTravelType === 'one-way'
              ? 'rounded-bl-lg rounded-tl-lg bg-gray-100'
              : 'bg-transparent'
          "
        >

          <label
            v-if="props.sendTravelType !== 'one-way'"
            class="
              date-label
              absolute
              -top-3
              right-6
              z-10
              whitespace-nowrap
              bg-[var(--color-white)]
              px-2
              text-[10px]
              leading-5
              text-[var(--color-gray-400)]
            "
          >
            تاریخ برگشت
          </label>


          <input
            :disabled="props.sendTravelType === 'one-way'"
            readonly
            :value="displayReturnDate"
            placeholder="تاریخ برگشت"
            @click="openReturnPicker"
            class="
              date-input
              h-full
              w-full
              min-w-0
              cursor-pointer
              border-none
              bg-transparent
              pb-0
              pl-3
              pr-10
              pt-1.5
              text-[10px]
              font-bold
              text-[var(--color-gray-800)]
              outline-none
              placeholder:text-[var(--color-gray-400)]
              disabled:cursor-default
            "
          >


          <!-- Clear -->
          <button
            v-if="
              returnDate &&
              props.sendTravelType !== 'one-way'
            "
            type="button"
            @click="clearReturnDate"
            class="
              date-clear
              absolute
              right-3
              top-1/2
              z-20
              -translate-y-1/2
              text-[var(--color-gray-400)]
              transition-colors
              hover:text-[var(--color-red-500)]
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>


          <PersianDatePicker
            :styles="styles"
            :auto-submit="false"
            v-model="returnDate"
            class="hidden"
            format="YYYY/MM/DD"
            mode="single"
            locale="fa,en"
            :show="showreturnDate"
            :disable="disablePastDates"
            @close="showreturnDate = false"
          >
            <template #icon></template>

            <template #footer>
              تاریخ برگشت:
            </template>
          </PersianDatePicker>

        </div>

      </div>
    </div>
  </div>
</template>


<style scoped>
.date-picker-container {
  container-type: inline-size;
}

.date-picker-box,
.date-field {
  min-width: 0;
}

/* Home: اندازه فعلی همین کامپوننت حفظ می‌شود */
.date-picker-box {
  width: calc(100% - 64px);
  max-width: 436px;
}

/* Flight: دقیقاً هم‌اندازه دکمه جستجو */
.is-flight-page .date-picker-box {
  width: 100%;
  max-width: 280px;
}

.is-flight-page .date-input {
  padding-left: 8px;
  padding-right: 28px;
  font-size: 9px;
}

.is-flight-page .date-label {
  right: 10px;
  padding-left: 4px;
  padding-right: 4px;
  font-size: 9px;
}

.is-flight-page .date-clear {
  right: 8px;
}

.is-flight-page .date-clear svg {
  width: 13px;
  height: 13px;
}

/* Home در Parent باریک */
@container (max-width: 420px) {
  .date-picker-container:not(.is-flight-page) .date-picker-wrapper {
    padding-left: 0;
    padding-right: 0;
  }

  .date-picker-container:not(.is-flight-page) .date-picker-box {
    width: calc(100% - 44px);
  }

  .date-picker-container:not(.is-flight-page) .date-input {
    padding-left: 8px;
    padding-right: 32px;
    font-size: 9px;
  }

  .date-picker-container:not(.is-flight-page) .date-label {
    right: 12px;
    padding-left: 4px;
    padding-right: 4px;
    font-size: 9px;
  }

  .date-picker-container:not(.is-flight-page) .date-clear {
    right: 10px;
  }
}

@container (max-width: 330px) {
  .date-picker-container:not(.is-flight-page) .date-picker-box {
    width: calc(100% - 36px);
  }

  .date-picker-container:not(.is-flight-page) .date-input {
    padding-left: 5px;
    padding-right: 27px;
    font-size: 9px;
  }

  .date-picker-container:not(.is-flight-page) .date-label {
    right: 8px;
    padding-left: 3px;
    padding-right: 3px;
    font-size: 8px;
  }

  .date-picker-container:not(.is-flight-page) .date-clear {
    right: 7px;
  }

  .date-picker-container:not(.is-flight-page) .date-clear svg {
    width: 13px;
    height: 13px;
  }
}

/* اگر خود Parent در صفحه Flight از 280px هم کمتر شد */
@container (max-width: 280px) {
  .is-flight-page .date-input {
    padding-left: 5px;
    padding-right: 24px;
    font-size: 8px;
  }

  .is-flight-page .date-label {
    right: 7px;
    font-size: 8px;
  }

  .is-flight-page .date-clear {
    right: 6px;
  }
}
</style>
