<template>
 <section
  class="
   mx-auto
   w-full
   max-w-7xl
   px-4
   py-12
   md:py-16
  "
  dir="rtl"
 >
  <div
   class="
    grid
    grid-cols-1
    gap-12
    lg:grid-cols-12
    lg:items-center
    lg:gap-12
   "
  >

   <!-- ================================= -->
   <!-- Right Side -->
   <!-- Title + Description + Images -->
   <!-- ================================= -->
   <div
    class="
     order-1
     lg:col-span-7
    "
   >
    <!-- Title -->
    <div class="text-right">
     <h2
      class="
       text-[25px]
       font-black
       leading-relaxed
       text-gray-700
       md:text-[30px]
      "
     >
      سفری به سبک خودتان
     </h2>

     <h3
      class="
       mt-1
       text-[16px]
       font-black
       text-gray-300
       md:text-[19px]
      "
     >
      تجربه تورهای آهوان براساس علایق شما
     </h3>

     <p
      class="
       mt-10
       max-w-[620px]
       text-[13px]
       leading-[2.1]
       text-gray-600
       md:text-[14px]
      "
     >
      با آهوان سفر شما به یک تجربه منحصر‌به‌فرد تبدیل می‌شود.
      می‌توانید پرسشنامه سبک سفر ما را تکمیل کرده و بر مبنای آن
      تورهای پیشنهادی آهوان را مشاهده نمایید.
     </p>
    </div>


    <!-- ================================= -->
    <!-- Travel Types -->
    <!-- ================================= -->
    <div
     class="
      mt-12
      grid
      grid-cols-4
      gap-3
      sm:gap-6
      md:gap-8
     "
    >
     <div
      v-for="item in travelTypes"
      :key="item.title"
      class="
       flex
       flex-col
       items-center
       text-center
      "
     >
      <!-- Circle Image -->
      <div
       class="
        h-[72px]
        w-[72px]
        overflow-hidden
        rounded-full
        border
        border-gray-300
        bg-gray-100
        p-[2px]
        shadow-md
        sm:h-[88px]
        sm:w-[88px]
        md:h-[105px]
        md:w-[105px]
       "
      >
       <img
        :src="item.image"
        :alt="item.title"
        class="
         h-full
         w-full
         rounded-full
         object-cover
        "
       >
      </div>

      <span
       class="
        mt-5
        text-[11px]
        text-gray-400
        sm:text-[12px]
        md:text-[13px]
       "
      >
       {{item.title}}
      </span>
     </div>
    </div>
   </div>


   <!-- ================================= -->
   <!-- Left Side -->
   <!-- Questionnaire -->
   <!-- ================================= -->
   <div
    class="
     order-2
     lg:col-span-5
    "
   >
    <div
     class="
      grid
      grid-cols-1
      gap-4
      sm:grid-cols-2
     "
    >
     <!-- Question -->
     <div
      v-for="question in questions"
      :key="question.id"
      class="
       flex
       min-h-[140px]
       flex-col
       justify-between
       rounded-lg
       bg-[#eef1f4]
       px-5
       py-4
       md:min-h-[155px]
      "
     >
      <p
       class="
        text-center
        text-[12px]
        leading-7
        text-gray-600
        md:text-[13px]
       "
      >
       {{question.title}}
      </p>

      <!-- Options -->
      <div
       class="
        mt-5
        flex
        items-center
        justify-between
       "
      >
       <!-- Low -->
       <label
        class="
         flex
         cursor-pointer
         items-center
         gap-2
         text-[12px]
         text-gray-700
        "
       >
        <input
         v-model="answers[question.id]"
         type="radio"
         :name="question.id"
         value="low"
         class="peer sr-only"
        >

        <span
         class="
          flex
          h-[20px]
          w-[20px]
          items-center
          justify-center
          rounded-full
          border-2
          border-gray-500
          bg-transparent
          transition
          after:h-[10px]
          after:w-[10px]
          after:rounded-full
          after:bg-gray-600
          after:opacity-0
          after:transition
          peer-checked:after:opacity-100
         "
        ></span>

        <span>
         کم
        </span>
       </label>


       <!-- High -->
       <label
        class="
         flex
         cursor-pointer
         items-center
         gap-2
         text-[12px]
         text-gray-700
        "
       >
        <input
         v-model="answers[question.id]"
         type="radio"
         :name="question.id"
         value="high"
         class="peer sr-only"
        >

        <span
         class="
          flex
          h-[20px]
          w-[20px]
          items-center
          justify-center
          rounded-full
          border-2
          border-gray-500
          bg-transparent
          transition
          after:h-[10px]
          after:w-[10px]
          after:rounded-full
          after:bg-gray-600
          after:opacity-0
          after:transition
          peer-checked:after:opacity-100
         "
        ></span>

        <span>
         زیاد
        </span>
       </label>
      </div>
     </div>
    </div>


    <!-- Button -->
    <div
     class="
      mt-5
      flex
      justify-center
     "
    >
     <button
      type="button"
      class="
       min-w-[175px]
       rounded-full
       bg-[#1717b8]
       px-7
       py-2.5
       text-[13px]
       font-bold
       text-white
       shadow-md
       transition
       duration-200
       hover:-translate-y-0.5
       hover:shadow-lg
       active:translate-y-0
      "
      @click="findMyTrip"
     >
      یافتن سفر دلخواه من
     </button>
    </div>
   </div>

  </div>
 </section>
</template>


<script setup>
import {reactive} from 'vue'


// =====================================
// Travel Types
// =====================================
const travelTypes=[
 {
  title:'لاکچری',
  image:'/imgs/hotel/suggest-hotel-main-page-1.svg'
 },
 {
  title:'رمانتیک',
  image:'/imgs/hotel/suggest-hotel-main-page-2.svg'
 },
 {
  title:'آرامش بخش',
  image:'/imgs/hotel/suggest-hotel-main-page-3.svg'
 },
 {
  title:'هیجان انگیز',
  image:'/imgs/hotel/suggest-hotel-main-page-4.svg'
 }
]


// =====================================
// Questions
// =====================================
const questions=[
 {
  id:'excitement',
  title:'میزان هیجان سفر خود را انتخاب کنید؟'
 },
 {
  id:'history',
  title:'به سفر تاریخی علاقه دارم؟'
 },
 {
  id:'nature',
  title:'به گشت‌وگذار در جنگل و پیاده‌روی در ساحل علاقه دارم؟'
 },
 {
  id:'luxury',
  title:'به سفرهای لوکس علاقه دارم؟'
 }
]


// =====================================
// Answers
// =====================================
const answers=reactive({
 excitement:'',
 history:'',
 nature:'',
 luxury:''
})


// =====================================
// Find Trip
// =====================================
function findMyTrip(){
 console.log({
  ...answers
 })
}
</script>