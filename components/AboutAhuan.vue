<template>
 <section
  class="
   w-full
   bg-white
   py-12
   md:py-16
  "
  dir="rtl"
 >
  <div
   class="
    mx-auto
    grid
    w-full
    max-w-7xl
    grid-cols-1
    items-center
    gap-10
    px-4
    md:grid-cols-12
    md:gap-12
   "
  >

   <!-- ======================= -->
   <!-- Right Content -->
   <!-- ======================= -->
   <div
    class="
     order-1
     text-right
     md:col-span-7
    "
   >
    <!-- Title -->
    <h2
     class="
      text-[17px]
      font-black
      text-gray-700
      md:text-[19px]
     "
    >
     با آهوان مطمئن سفر کنید
    </h2>


    <!-- Description -->
    <p
     class="
      mt-5
      max-w-[720px]
      text-[12px]
      leading-[2.3]
      text-gray-600
      md:text-[13px]
     "
    >
     شرکت خدمات مسافرتی آهوان با سال‌ها تجربه در صنعت گردشگری
     و ارائه خدمات متنوع سفر، همواره تلاش نموده است تا با ارائه
     خدمات با کیفیت، برنامه‌ریزی دقیق و پشتیبانی مناسب، تجربه‌ای
     مطمئن و خاطره‌انگیز را برای مسافران فراهم نماید.
    </p>

    <p
     class="
      mt-2
      max-w-[720px]
      text-[12px]
      leading-[2.3]
      text-gray-600
      md:text-[13px]
     "
    >
     مجموعه آهوان با بهره‌گیری از تیم متخصص و همکاری با مراکز
     معتبر گردشگری، خدمات خود را در حوزه تور، هتل، پرواز و سایر
     خدمات مرتبط با سفر ارائه می‌دهد.
    </p>


    <!-- ======================= -->
<!-- Certificates -->
<!-- ======================= -->
<div
 class="
  mt-8
  flex
  flex-wrap
  items-center
  justify-start
  gap-5
  md:gap-7
 "
>
 <a
  v-for="item in certificates"
  :key="item.title"
  :href="item.site"
  target="_blank"
  rel="noopener noreferrer"
  :title="item.title"
  class="
   flex
   h-[48px]
   w-[62px]
   cursor-pointer
   items-center
   justify-center
   transition
   duration-200
   hover:scale-110
   hover:opacity-80
  "
 >
  <img
   :src="item.image"
   :alt="item.title"
   class="
    max-h-full
    max-w-full
    object-contain
   "
  >
 </a>
</div>
   </div>


   <!-- ======================= -->
   <!-- Left Logo -->
   <!-- ======================= -->
   <div
    class="
     order-2
     flex
     items-center
     justify-center
     md:col-span-5
    "
   >
    <img
     src="/imgs/header/logo.png"
     alt="Ahuan Travel"
     class="
      w-[180px]
      object-contain
      sm:w-[210px]
      md:w-[240px]
     "
    >
   </div>

  </div>
 </section>
</template>


<script setup>
const certificates=[
 {
  title:'مجوز گردشگری',
  image:'/imgs/hotel/logo.png',
  site:"https://trustseal.enamad.ir/?id=73832&Code=v3MxZxRYBX3uIkiwT158"
 },
 {
  title:'مجوز هواپیمایی',
  image:'/imgs/hotel/logo (1).png',
  site:'https://logo.samandehi.ir/Verify.aspx?id=104501&p=rfthobpdaodsdshwobpdrfth'
 },
 {
  title:'مجوز خدمات مسافرتی',
  image:'/imgs/hotel/cao.png',
  site:'https://www.cao.ir/'
 },
 {
  title:'مجوز رسمی',
  image:'/imgs/hotel/lohoaira.png',
  site:'http://www.aira.ir/'
 },
 {
  title:'مجوز گردشگری الکترونیک',
  image:'/imgs/hotel/passenger.png',
  site:'https://www.cao.ir/paxrights'
 }
]
</script>