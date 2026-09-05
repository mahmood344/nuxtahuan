<template>
 <section
  class="mx-auto w-full max-w-7xl px-4 py-10"
  dir="rtl"
 >
  <div
   class="
    grid
    grid-cols-1
    gap-10
    lg:grid-cols-12
    lg:items-start
    lg:gap-8
   "
  >

   <!-- ====================== -->
   <!-- Right Column -->
   <!-- Title + Room + Facilities -->
   <!-- ====================== -->
   <div
    class="
     order-1
     lg:col-span-4
     lg:pt-0
    "
   >
    <!-- Title -->
    <div class="mb-8 text-right">
     <h2
      class="
       text-[25px]
       font-black
       text-gray-700
       md:text-[30px]
      "
     >
      تجربه آرامش و لذت
     </h2>

     <p
      class="
       mt-2
       text-[14px]
       font-bold
       text-gray-300
       md:text-[16px]
      "
     >
      با اقامت در هتل ساحلی آهوان
     </p>
    </div>


    <!-- Room Image -->
   <!-- Room Image -->
<div
 class="
  relative
  mb-14
  h-[235px]
  w-full
 "
>
 <!-- مربع پشت - متمایل به راست -->
 <div
  class="
   absolute
   right-[-18px]
   top-[-14px]
   h-[82%]
   w-[82%]
   rounded-xl
   bg-slate-100
  "
 ></div>

 <!-- Image -->
 <img
  src="/imgs/hotel/hotel-main-page-1.jpg"
  alt="اتاق هتل آهوان"
  class="
   relative
   z-10
   h-full
   w-full
   rounded-xl
   object-cover
   shadow-sm
  "
 >
</div>


    <!-- Facilities -->
    <div>
     <h3
      class="
       mb-7
       text-[17px]
       font-black
       text-gray-700
      "
     >
      امکانات هتل آهوان:
     </h3>

     <div
      class="
       grid
       grid-cols-2
       gap-x-8
       gap-y-7
      "
     >
      <div
       v-for="facility in facilities"
       :key="facility.title"
       class="
        flex
        items-center
        gap-2
        text-[12px]
        text-gray-600
       "
      >
       <i
        :class="[
         facility.icon,
         'text-[19px] text-gray-600'
        ]"
       ></i>

       <span>
        {{facility.title}}
       </span>
      </div>
     </div>
    </div>
   </div>


   <!-- ====================== -->
   <!-- Center Column -->
   <!-- Cafe -->
   <!-- ====================== -->
   <div
 class="
  order-2
  lg:col-span-4
  lg:pt-[120px]
 "
>
 <p
  class="
   mb-4
   pb-4
   text-center
   text-[22px]
   font-black
   text-gray-100
   md:text-[26px]
  "
 >
  سواحل زیبای چابکسر
 </p>

<div
 class="
  relative
  h-[210px]
  w-full
 "
>
 <!-- مربع پشت - متمایل به چپ -->
 <div
  class="
   absolute
   left-[-18px]
   top-[-14px]
   h-[82%]
   w-[82%]
   rounded-xl
   bg-slate-100
  "
 ></div>

 <!-- Image -->
 <img
  src="/imgs/hotel/hotel-main-page-2.jpg"
  alt="کافی شاپ هتل آهوان"
  class="
   relative
   z-10
   h-full
   w-full
   rounded-xl
   object-cover
   shadow-sm
  "
 >
</div>
</div>

   <!-- ====================== -->
   <!-- Left Column -->
   <!-- Garden -->
   <!-- ====================== -->
   <div
    class="
     order-3
     lg:col-span-4
     lg:pt-[145px]
    "
   >
    <div
 class="
  relative
  h-[420px]
  w-full
  md:h-[450px]
 "
>
 <!-- مربع پشت - متمایل به چپ -->
 <div
  class="
   absolute
   left-[-18px]
   top-[-14px]
   h-[82%]
   w-[82%]
   rounded-xl
   bg-slate-100
  "
 ></div>

 <!-- Image -->
 <img
  src="/imgs/hotel/hotel-main-page-3.jpg"
  alt="محوطه هتل آهوان"
  class="
   relative
   z-10
   h-full
   w-full
   rounded-xl
   object-cover
   shadow-sm
  "
 >
</div>
   </div>

  </div>
 </section>
</template>


<script setup>
const facilities=[
 {
  title:'اقامتگاه ویلا و آپارتمان',
  icon:'bi bi-house-door'
 },
 {
  title:'رستوران',
  icon:'bi bi-cup-hot'
 },
 {
  title:'زمین بازی کودکان',
  icon:'bi bi-person-arms-up'
 },
 {
  title:'ساحل اختصاصی',
  icon:'bi bi-umbrella'
 },
 {
  title:'سینمای روباز',
  icon:'bi bi-image'
 },
 {
  title:'کافی شاپ',
  icon:'bi bi-cup-straw'
 },
 {
  title:'سالن ورزشی چند منظوره',
  icon:'bi bi-dribbble'
 }
]
</script>