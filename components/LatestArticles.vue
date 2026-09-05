<template>
 <section
  class="
   w-full
   bg-[#eef1f4]
   py-10
   md:py-14
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

   <!-- ======================== -->
   <!-- Title -->
   <!-- ======================== -->
   <div
    class="
     mb-7
     flex
     items-center
     gap-2
    "
   >
    <i
     class="
      bi
      bi-card-text
      text-[20px]
      text-gray-600
     "
    ></i>

    <h2
     class="
      text-[17px]
      font-black
      text-gray-700
      md:text-[19px]
     "
    >
     جدیدترین مطالب
    </h2>
   </div>


   <!-- ======================== -->
   <!-- Articles -->
   <!-- ======================== -->
   <div
    class="
     grid
     grid-cols-2
     gap-x-4
     gap-y-8
     md:gap-x-5
     lg:grid-cols-4
    "
   >
    <NuxtLink
     v-for="article in articles"
     :key="article.id"
     :to="article.link"
     class="
      group
      block
     "
    >
     <!-- Image -->
     <div
      class="
       aspect-[1.62/1]
       w-full
       overflow-hidden
       rounded-lg
       bg-gray-200
      "
     >
      <img
       :src="article.image"
       :alt="article.title"
       class="
        h-full
        w-full
        object-cover
        transition-transform
        duration-500
        group-hover:scale-105
       "
      >
     </div>


     <!-- Title -->
     <h3
      class="
       mt-3
       text-center
       text-[12px]
       font-normal
       leading-[2]
       text-gray-600
       transition-colors
       duration-200
       group-hover:text-gray-900
       md:text-[13px]
      "
     >
      {{article.title}}
     </h3>
    </NuxtLink>
   </div>

  </div>
 </section>
</template>


<script setup>
const articles=[
 {
  id:1,
  title:
   'راهنمای کامل سفر به تاریخی و فرهنگی ایران؛ بهترین مقاصد تاریخی برای بازدید',
  image:'/imgs/hotel/knews1.png',
  link:'/blog/1'
 },
 {
  id:2,
  title:
   'آشنایی با طعم‌ها و خوراکی‌های منحصر به فرهنگ ایران در سفرهای خود',
  image:'/imgs/hotel/knews2.png',
  link:'/blog/2'
 },
 {
  id:3,
  title:
   'سفر به طبیعت زیبای ایران؛ کوه‌ها، دریاچه‌ها و جاذبه‌های طبیعی',
  image:'/imgs/hotel/knews3.png',
  link:'/blog/3'
 },
 {
  id:4,
  title:
   'نکات مهم برای برنامه‌ریزی سفر به ایران؛ راهنمایی برای مسافران اولیه',
  image:'/imgs/hotel/knews4.png',
  link:'/blog/4'
 }
]
</script>