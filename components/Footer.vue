<template>
 <footer
  class="
   relative
   w-full
   overflow-hidden
   bg-[#304998]
   text-white
  "
  dir="rtl"
 >
  <!-- ======================== -->
  <!-- Top Decoration -->
  <!-- ======================== -->
  <div
   class="
    absolute
    left-1/2
    top-0
    flex
    -translate-x-1/2
   "
  >
   <!-- <span
    v-for="n in 8"
    :key="n"
    class="
     -mt-[13px]
     h-[28px]
     w-[28px]
     rotate-45
     rounded-[4px]
    "
    :class="
     n%2===0
      ? 'bg-[#e6b87e]'
      : 'bg-[#1db7b8]'
    "
   ></span> -->
  </div>


  <!-- ======================== -->
  <!-- Main Footer -->
  <!-- ======================== -->
  <div
   class="
    relative
    mx-auto
    grid
    w-full
    max-w-7xl
    grid-cols-1
    gap-12
    px-5
    pb-12
    pt-16
    md:grid-cols-2
    lg:grid-cols-12
    lg:gap-10
    lg:pb-16
    lg:pt-20
   "
  >

   <!-- ======================== -->
   <!-- Right -->
   <!-- Logo + Description -->
   <!-- ======================== -->
   <div
    class="
     lg:col-span-4
    "
   >
    <!-- Logo -->
    <div
     class="
      flex
      justify-start
     "
    >
     <div
      class="
       flex
       h-[180px]
       w-[190px]
       items-center
       justify-center
       rounded-lg
       bg-white
       p-3
       md:h-[205px]
       md:w-[215px]
      "
     >
      <img
       src="/imgs/header/logo.png"
       alt="Ahuan Travel"
       class="
        max-h-full
        max-w-full
        object-contain
       "
      >
     </div>
    </div>


    <!-- Description -->
    <p
     class="
      mt-10
      max-w-[500px]
      text-[13px]
      font-medium
      leading-[2.2]
      text-white
      md:text-[14px]
     "
    >
     آهوان با ارائه بهترین و باکیفیت‌ترین خدمات گردشگری
     به‌صورت آنلاین می‌کوشد تا به‌عنوان معتبرترین شرکت
     گردشگری در ایران، تجربه لذت‌بخش یک رزرو اینترنتی را
     برایتان تداعی کند.
    </p>


    <!-- Certificates -->
    <div
     class="
      mt-10
      flex
      flex-wrap
      items-center
      gap-4
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
       h-[80px]
       w-[80px]
       items-center
       justify-center
       overflow-hidden
       rounded-lg
       bg-white
       p-2
       transition
       duration-200
       hover:-translate-y-1
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


   <!-- ======================== -->
   <!-- Services -->
   <!-- ======================== -->
   <div
    class="
     lg:col-span-2
     lg:pt-[100px]
    "
   >
    <h3
     class="
      mb-7
      text-[15px]
      font-black
      text-white
     "
    >
     خدمات
    </h3>

    <ul class="space-y-5">
     <li
      v-for="item in services"
      :key="item.title"
     >
      <NuxtLink
       :to="item.link"
       class="
        text-[12px]
        font-medium
        text-white
        transition
        hover:text-[#e8bd83]
       "
      >
       {{item.title}}
      </NuxtLink>
     </li>
    </ul>
   </div>


   <!-- ======================== -->
   <!-- Travel Guide -->
   <!-- ======================== -->
   <div
    class="
     lg:col-span-3
     lg:pt-[100px]
    "
   >
    <h3
     class="
      mb-7
      text-[15px]
      font-black
      text-white
     "
    >
     راهنمای سفر
    </h3>

    <ul class="space-y-5">
     <li
      v-for="item in travelGuides"
      :key="item.title"
     >
      <NuxtLink
       :to="item.link"
       class="
        text-[12px]
        font-medium
        text-white
        transition
        hover:text-[#e8bd83]
       "
      >
       {{item.title}}
      </NuxtLink>
     </li>
    </ul>
   </div>


   <!-- ======================== -->
   <!-- Left -->
   <!-- Address + Social -->
   <!-- ======================== -->
   <div
    class="
     lg:col-span-3
     lg:pt-[100px]
    "
   >
    <!-- Address -->
    <p
     class="
      max-w-[300px]
      text-[12px]
      font-medium
      leading-[2]
      text-white
     "
    >
     ضلع شمال غربی میدان آرژانتین، ساختمان بانک تجارت
     شماره ۱۸
    </p>


    <!-- Phone -->
    <a
     href="tel:0218879"
     class="
      mt-5
      block
      text-[13px]
      font-bold
      text-white
      transition
      hover:text-[#e8bd83]
     "
    >
     ۰۲۱-۸۸۷۹
    </a>


    <!-- Social -->
    <div
     class="
      mt-8
      flex
      items-center
      gap-9
     "
     dir="ltr"
    >
     <!-- Telegram -->
     <a
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Telegram"
      class="social-link"
     >
      <i class="bi bi-telegram"></i>
     </a>

     <!-- Instagram -->
     <a
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      class="social-link"
     >
      <i class="bi bi-instagram"></i>
     </a>

     <!-- Email -->
     <a
      href="mailto:info@ahuan.ir"
      aria-label="Email"
      class="social-link"
     >
      <i class="bi bi-envelope"></i>
     </a>

     <!-- WhatsApp -->
     <a
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      class="social-link"
     >
      <i class="bi bi-whatsapp"></i>
     </a>
    </div>


    <!-- Decorative Logo -->
    <img
     src="/imgs/header/logo.png"
     alt=""
     class="
      pointer-events-none
      mt-10
      hidden
      w-[230px]
      opacity-[0.13]
      brightness-0
      invert
      lg:block
     "
    >
   </div>

  </div>


  <!-- ======================== -->
  <!-- Copyright -->
  <!-- ======================== -->
  <div
   class="
    w-full
    bg-[#e5b981]
    px-4
    py-3
    text-center
    text-[12px]
    font-medium
    text-white
   "
  >
   کلیه حقوق این وب سایت متعلق به شرکت خدمات مسافرتی آهوان می‌باشد.
  </div>
 </footer>
</template>


<script setup>
const services=[
 {
  title:'بلیط',
  link:'/flights'
 },
 {
  title:'تور',
  link:'/domesticinternationaltours'
 },
 {
  title:'درباره ما',
  link:'/about'
 },
 {
  title:'خدمات ویزا',
  link:'/visa'
 },
 {
  title:'دفتر حافظ منافع مشتری',
  link:'/customer-rights'
 },
 {
  title:'فرصت های شغلی',
  link:'/careers'
 },
 {
  title:'مجله گردشگری',
  link:'/blog'
 },
 {
  title:'پشتیبانی آنلاین',
  link:'/support'
 },
 {
  title:'تماس با ما',
  link:'/contact-us'
 }
]


const travelGuides=[
 {
  title:'راهنمای سفر به اروپا',
  link:'/domesticinternationaltours/1017'
 },
 {
  title:'راهنمای سفر به مالدیو',
  link:'/domesticinternationaltours/1027'
 },
 {
  title:'راهنمای سفر به ژاپن',
  link:'/domesticinternationaltours/1024'
 },
 {
  title:'راهنمای سفر به ترکیه',
  link:'/domesticinternationaltours/1'
 },
 {
  title:'راهنمای سفر به روسیه',
  link:'/blog/russia'
 },
 {
  title:'راهنمای سفر به دبی',
  link:'/domesticinternationaltours/1026'
 },
 {
  title:'راهنمای سفر به تایلند',
  link:'/domesticinternationaltours/1044'
 },
 {
  title:'راهنمای سفر به هند',
  link:'/domesticinternationaltours/1029'
 },
 {
  title:'راهنمای سفر به عمان',
  link:'/domesticinternationaltours/1033'
 }
]


const certificates=[
 {
  title:'مجوز گردشگری',
  image:'/imgs/hotel/logo.png',
  site:
   'https://trustseal.enamad.ir/?id=73832&Code=v3MxZxRYBX3uIkiwT158'
 },
 {
  title:'مجوز هواپیمایی',
  image:'/imgs/hotel/logo (1).png',
  site:
   'https://logo.samandehi.ir/Verify.aspx?id=104501&p=rfthobpdaodsdshwobpdrfth'
 },
 {
  title:'سازمان هواپیمایی کشوری',
  image:'/imgs/hotel/cao.png',
  site:'https://www.cao.ir/'
 },
 {
  title:'انجمن شرکت‌های هواپیمایی',
  image:'/imgs/hotel/lohoaira.png',
  site:'http://www.aira.ir/'
 },
 {
  title:'حقوق مسافر',
  image:'/imgs/hotel/passenger.png',
  site:'https://www.cao.ir/paxrights'
 }
]
</script>


<style scoped>
.social-link{
 display:flex;
 align-items:center;
 justify-content:center;
 font-size:28px;
 color:white;
 transition:
  transform .2s ease,
  color .2s ease;
}

.social-link:hover{
 color:#e5b981;
 transform:translateY(-3px);
}
</style>