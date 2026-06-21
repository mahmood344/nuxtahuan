<script setup>
import { ref } from 'vue'; // اطمینان از import ref

const departDate = ref("");
const returnDate = ref("");
const showdepartDate = ref(false);
const showreturnDate = ref(false);
const styles = 
    
        {
            'primary-color':  '#2629A6',
            'secondary-color':  '#2629A6',
            'in-range-background':  '#2629A6'
        }
// توابع برای باز کردن تقویم
const openDepartPicker = () => {
  showdepartDate.value = true;
};

const openReturnPicker = () => {
  showreturnDate.value = true;
};

// تابع برای حذف تاریخ
const clearDepartDate = () => {
  departDate.value = "";
};

const clearReturnDate = () => {
  returnDate.value = "";
};
</script>

<template>
  <div dir="rtl" class="flex w-full justify-center p-4">
    <!-- کانتینر اصلی -->
    <div
      class="relative flex w-full max-w-[500px] h-[50px] bg-white border border-gray-300 rounded-[10px] overflow-visible"
    >
      <!-- تاریخ رفت -->
      <div class="flex-1 relative pr-8"> <!-- افزایش padding راست برای جا دادن دکمه -->
        <!-- لیبل روی بوردر -->
        <label
          class="absolute -top-3 right-6 z-10 bg-white px-2 text-[10px] leading-5 text-gray-400"
        >
          تاریخ رفت
        </label>

        <input
          readonly
          :value="departDate"
          placeholder="تاریخ رفت"
          @click="openDepartPicker"
          class="w-full h-full px-4 pt-1.5 text-[14px] font-bold text-gray-800 placeholder-gray-300 bg-transparent outline-none cursor-pointer border-none"
        />
        <!-- دکمه حذف تاریخ رفت -->
        <button
          v-if="departDate"
          @click="clearDepartDate"
          class="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 text-gray-400 hover:text-red-500 transition-colors duration-200"
          aria-label="Clear departure date"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        <PersianDatePicker
        :styles="styles"
          v-model="departDate"
          :min-date="today"
          class="hidden"
          :show="showdepartDate"
          format="jYYYY/jMM/jDD"
            mode="single"
            locale="fa,en"
          @close="showdepartDate=false"
          :auto-submit="false"
         
        >
          <template #icon></template>
          <template #footer>تاریخ رفت:</template>
        </PersianDatePicker>
      </div>

      <!-- جداکننده وسط -->
      <div class="w-px h-full bg-gray-300"></div> <!-- h-full اضافه شده -->

      <!-- تاریخ برگشت -->
      <div class="flex-1 relative pr-8"> <!-- افزایش padding راست برای جا دادن دکمه -->
        <!-- لیبل روی بوردر -->
        <label
          class="absolute -top-3 right-6 z-10 bg-white px-2 text-[10px] leading-5 text-gray-400"
        >
          تاریخ برگشت
        </label>
        <input
          @click="openReturnPicker"
          readonly
          
          :value="returnDate"
          placeholder="تاریخ برگشت"
          class="w-full h-full px-4 pt-1.5 text-[14px] font-bold text-gray-800 placeholder-gray-300 bg-transparent outline-none cursor-pointer border-none"
        />

        <!-- دکمه حذف تاریخ برگشت -->
        <button
          v-if="returnDate"
          @click="clearReturnDate"
          class="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 text-gray-400 hover:text-red-500 transition-colors duration-200"
          aria-label="Clear return date"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>

        <PersianDatePicker
       :styles="styles"
          v-model="returnDate"
          class="hidden"
          format="jYYYY/jMM/jDD"
            mode="single"
            locale="fa,en"
          :show="showreturnDate"
          @close="showreturnDate=false"
          :auto-submit="false"
        >
          <template #icon></template>
          <template #footer>تاریخ برگشت:</template>
        </PersianDatePicker>
      </div>
    </div>
  </div>
</template>

<style>
/* استایل اضافی برای اطمینان از نمایش صحیح در صورت نیاز */


</style>
