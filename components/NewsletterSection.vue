<template>
 <section
  class="
   relative
   w-full
   overflow-hidden
   py-14
   md:py-20
  "
  dir="rtl"
 >
  <!-- ========================= -->
  <!-- Background Pattern -->
  <!-- ========================= -->
  <div
   class="
    pointer-events-none
    absolute
    inset-0
    bg-white
   "
  ></div>

  <div
   class="
    pointer-events-none
    absolute
    inset-0
    
   "
   :style="{
    backgroundImage:
     `url('/imgs/flight/background-profile.png')`,
    backgroundRepeat:'repeat',
    backgroundPosition:'center',
    backgroundSize:'1100px auto'
   }"
  ></div>


  <!-- ========================= -->
  <!-- Content -->
  <!-- ========================= -->
  <div
   class="
    relative
    z-10
    mx-auto
    w-full
    max-w-7xl
    px-4
   "
  >
   <div
    class="
     mx-auto
     grid
     max-w-[820px]
     overflow-hidden
     border
     border-[#e5bb82]
     bg-white
     shadow-sm
     md:grid-cols-2
    "
   >

    <!-- ========================= -->
    <!-- Right -->
    <!-- Newsletter Form -->
    <!-- ========================= -->
    <div
     class="
      order-1
      flex
      flex-col
      justify-center
      px-6
      py-8
      md:px-10
      md:py-10
     "
    >
     <h2
      class="
       text-[19px]
       font-black
       text-gray-700
      "
     >
      خبرنامه آنلاین آهوان
     </h2>

     <p
      class="
       mt-4
       text-[12px]
       leading-[2.2]
       text-gray-600
       md:text-[13px]
      "
     >
      با عضویت در خبرنامه آنلاین آهوان از جدیدترین مطالب حوزه
      گردشگری، پیشنهادهای ویژه، تورهای لحظه آخر و اخبار سفر
      مطلع شوید.
     </p>


     <!-- Email -->
     <div class="mt-8">
      <input
       v-model="email"
       type="email"
       placeholder="آدرس ایمیل"
       class="
        h-[50px]
        w-full
        border
        border-gray-400
        bg-white
        px-4
        text-right
        text-[13px]
        text-gray-700
        outline-none
        transition
        placeholder:text-gray-600
        focus:border-[#d6aa6d]
       "
      >
     </div>


     <!-- Button -->
     <div
      class="
       mt-8
       flex
       justify-center
      "
     >
      <button
       type="button"
       class="
        min-w-[160px]
        rounded-full
        bg-[#e7b978]
        px-7
        py-2.5
        text-[13px]
        font-bold
        text-white
        shadow-md
        transition
        duration-200
        hover:bg-[#dba65f]
        active:scale-95
       "
       @click="subscribe"
      >
       عضویت در خبرنامه
      </button>
     </div>
    </div>


    <!-- ========================= -->
    <!-- Left -->
    <!-- Image -->
    <!-- ========================= -->
    <div
     class="
      order-2
      min-h-[300px]
      md:min-h-[335px]
     "
    >
     <img
      src="/imgs/hotel/knews.png"
      alt="خبرنامه آنلاین آهوان"
      class="
       h-full
       w-full
       object-cover
      "
     >
    </div>

   </div>
  </div>
 </section>
</template>


<script setup>
import {ref} from 'vue'

const email=ref('')

function subscribe(){
 if(!email.value){
  alert('لطفاً آدرس ایمیل را وارد کنید.')
  return
 }

 console.log({
  email:email.value
 })
}
</script>