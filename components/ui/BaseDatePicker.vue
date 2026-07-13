<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  sendTravelType: {
    type: String,
    default: "one-way"
  }
})

const emit = defineEmits([
  "update:departDate",
  "update:returnDate"
])

const departDate = ref("");
const returnDate = ref("");

const showdepartDate = ref(false);
const showreturnDate = ref(false);

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

/* -----------------------
watch برای emit تاریخ رفت
----------------------- */
watch(departDate, (newVal) => {
  emit("update:departDate", newVal || null)
})

/* -----------------------
watch برای emit تاریخ برگشت
----------------------- */
watch(returnDate, (newVal) => {
  emit("update:returnDate", newVal || null)
})

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
</script>

<template>
  <div dir="rtl" class="flex w-full justify-center p-4">
    <div
      class="relative flex w-full max-w-[500px] h-[54px] bg-[var(--color-white)] border border-[var(--color-gray-300)] rounded-[10px] overflow-visible"
    >

      <!-- تاریخ رفت -->
      <div class="flex-1 relative pr-8">

        <label
          class="absolute -top-3 right-6 z-10 bg-[var(--color-white)] px-2 text-[10px] leading-5 text-[var(--color-gray-400)]"
        >
          تاریخ رفت
        </label>

        <input
          readonly
          :value="departDate"
          placeholder="تاریخ رفت"
          @click="openDepartPicker"
          class="w-full h-full px-4 pt-1.5 text-[10px] font-bold text-[var(--color-gray-800)] placeholder:text-[var(--color-gray-400)] bg-transparent outline-none cursor-pointer border-none"
        />

        <!-- clear -->
        <button
          v-if="departDate"
          @click="clearDepartDate"
          class="absolute top-1/2 right-4 -translate-y-1/2 z-20 text-[var(--color-gray-400)] hover:text-[var(--color-red-500)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
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
          @close="showdepartDate=false"
        >
          <template #icon></template>
          <template #footer>تاریخ رفت:</template>
        </PersianDatePicker>
      </div>

      <!-- divider -->
      <div class="w-px h-full bg-[var(--color-gray-300)]"></div>

      <!-- تاریخ برگشت -->
      <div
        class="flex-1 relative pr-8"
        :class="props.sendTravelType === 'one-way'
          ? 'bg-gray-100 rounded-tl-lg rounded-bl-lg'
          : 'bg-transparent'"
      >
        <label
          v-if="props.sendTravelType !== 'one-way'"
          class="absolute -top-3 right-6 z-10 bg-[var(--color-white)] px-2 text-[10px] leading-5 text-[var(--color-gray-400)]"
        >
          تاریخ برگشت
        </label>

        <input
          :disabled="props.sendTravelType === 'one-way'"
          readonly
          :value="returnDate"
          placeholder="تاریخ برگشت"
          @click="openReturnPicker"
          class="w-full h-full px-4 pt-1.5 text-[10px] font-bold text-[var(--color-gray-800)] placeholder:text-[var(--color-gray-400)] bg-transparent outline-none cursor-pointer border-none"
        />

        <!-- clear -->
        <button
          v-if="returnDate && props.sendTravelType !== 'one-way'"
          @click="clearReturnDate"
          class="absolute top-1/2 right-4 -translate-y-1/2 z-20 text-[var(--color-gray-400)] hover:text-[var(--color-red-500)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
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
          @close="showreturnDate=false"
        >
          <template #icon></template>
          <template #footer>تاریخ برگشت:</template>
        </PersianDatePicker>

      </div>
    </div>
  </div>
</template>
