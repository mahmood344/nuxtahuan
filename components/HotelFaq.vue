<template>
 <section
  class="
   w-full
   bg-[#eef1f4]
   py-12
   md:py-16
  "
  dir="rtl"
 >
  <div
   class="
    mx-auto
    w-full
    max-w-7xl
    px-4
   "
  >
   <!-- ===================== -->
   <!-- Title -->
   <!-- ===================== -->
   <div
    class="
     mb-7
     flex
     items-center
     justify-start
     gap-2
    "
   >
    <span
     class="
      flex
      h-6
      w-6
      items-center
      justify-center
      text-gray-600
     "
    >
     <i class="bi bi-question-square"></i>
    </span>

    <h2
     class="
      text-[16px]
      font-black
      text-gray-700
      md:text-[18px]
     "
    >
     سوالات متداول
    </h2>
   </div>


   <!-- ===================== -->
   <!-- FAQ Accordion -->
   <!-- ===================== -->
   <div class="space-y-2">
    <div
     v-for="(item,index) in faqs"
     :key="index"
     class="
      border-b
      border-gray-200/70
     "
    >
     <!-- Question -->
     <button
      type="button"
      class="
       flex
       w-full
       items-center
       justify-between
       gap-5
       py-4
       text-right
      "
      @click="toggleFaq(index)"
     >
      <span
       class="
        text-[13px]
        font-bold
        leading-7
        text-gray-700
        md:text-[14px]
       "
      >
       {{item.question}}
      </span>

      <!-- Arrow -->
      <i
       class="
        bi
        bi-chevron-down
        shrink-0
        text-[12px]
        text-gray-500
        transition-transform
        duration-300
       "
       :class="{
        'rotate-180':openIndex===index
       }"
      ></i>
     </button>


     <!-- Answer -->
     <div
      class="
       grid
       transition-all
       duration-300
       ease-in-out
      "
      :class="
       openIndex===index
        ? 'grid-rows-[1fr] opacity-100'
        : 'grid-rows-[0fr] opacity-0'
      "
     >
      <div class="overflow-hidden">
       <p
        class="
         pb-5
         pl-8
         text-[12px]
         leading-[2.2]
         text-gray-600
         md:text-[13px]
        "
       >
        {{item.answer}}
       </p>
      </div>
     </div>
    </div>
   </div>

  </div>
 </section>
</template>


<script setup>
import {ref} from 'vue'


// =====================================
// Accordion
// =====================================
const openIndex=ref(null)

function toggleFaq(index){
 openIndex.value=
  openIndex.value===index
   ? null
   : index
}


// =====================================
// FAQ Data
// =====================================
const faqs=[
 {
  question:
   'برای رزرو تورهای مسافرتی چه طریقی باید اقدام کنم؟',

  answer:
   'برای رزرو تورهای مسافرتی از طریق همین وب‌سایت آهوان می‌توانید تور موردنظر خود را انتخاب کرده و مراحل رزرو را به‌صورت آنلاین انجام دهید.'
 },
 {
  question:
   'هتل آهوان چابکسر کجا واقع شده است؟',

  answer:
   'هتل آهوان چابکسر در استان گیلان و در منطقه چابکسر واقع شده و با موقعیت مناسب خود، دسترسی مطلوبی به ساحل و جاذبه‌های گردشگری منطقه دارد.'
 },
 {
  question:
   'چگونه می‌توانم رزرو هتل را لغو کنم؟',

  answer:
   'شرایط لغو رزرو با توجه به نوع اتاق، تاریخ اقامت و قوانین رزرو متفاوت است. برای مشاهده شرایط دقیق، قوانین مربوط به رزرو خود را بررسی نمایید.'
 },
 {
  question:
   'بهترین زمان برای خرید بلیط هواپیما چه زمانی است؟',

  answer:
   'زمان مناسب خرید بلیط به مقصد، تاریخ سفر و میزان تقاضا بستگی دارد. معمولاً برنامه‌ریزی و رزرو زودتر می‌تواند گزینه‌های بیشتری برای انتخاب در اختیار شما قرار دهد.'
 }
]
</script>