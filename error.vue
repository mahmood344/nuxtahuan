<template>
 <div
  class="
   relative
   flex
   min-h-screen
   items-center
   justify-center
   overflow-hidden
   bg-[#f7f8fc]
   px-4
   py-10
  "
  dir="rtl"
 >
  <!-- Background -->
  <div
   class="
    pointer-events-none
    absolute
    inset-0
    overflow-hidden
   "
  >
   <div
    class="
     absolute
     -right-24
     -top-24
     h-[360px]
     w-[360px]
     rounded-full
     bg-[#304998]/10
     blur-3xl
    "
   ></div>

   <div
    class="
     -bottom-32
     -left-20
     absolute
     h-[420px]
     w-[420px]
     rounded-full
     bg-[#e5b981]/20
     blur-3xl
    "
   ></div>
  </div>


  <!-- Content -->
  <div
   class="
    relative
    z-10
    mx-auto
    flex
    w-full
    max-w-4xl
    flex-col
    items-center
    text-center
   "
  >
   <!-- Logo -->
<NuxtLink
 to="/"
 class="mb-3"
>
 <img
  src="/imgs/header/logo.png"
  alt="آهوان"
  class="
   error-logo
   h-[280px]
   w-auto
   object-contain
   sm:h-[32px]
   md:h-[360px]
  "
 >
</NuxtLink>


   <!-- 404 -->
   <div
    class="
     relative
     select-none
     font-black
     leading-none
     text-[#304998]
    "
   >
<span
 class="
  text-[150px]
  font-black
  tracking-[-10px]
  sm:text-[220px]
  md:text-[290px]
  lg:text-[330px]
 "
>
 {{statusCode}}
</span>

  <div
 class="
  absolute
  left-1/2
  top-1/2
  h-[18px]
  w-[78%]
  -translate-x-1/2
  -translate-y-1/2
  -rotate-3
  rounded-full
  bg-[#e5b981]/50
 "
></div>
   </div>


   <!-- Title -->
   <h1
    class="
     mt-6
     text-[22px]
     font-black
     text-gray-800
     sm:text-[26px]
     md:text-[30px]
    "
   >
    {{title}}
   </h1>


   <!-- Description -->
   <p
    class="
     mt-4
     max-w-[600px]
     text-[13px]
     leading-[2.2]
     text-gray-500
     sm:text-[14px]
    "
   >
    <!-- {{description}} -->
   </p>


   <!-- Buttons -->
   <div
    class="
     mt-9
     flex
     flex-col
     items-center
     gap-3
     sm:flex-row
    "
   >
    <button
     type="button"
     class="
     mt-4
      min-w-[170px]
      rounded-full
      bg-[#304998]
      px-7
      py-3
      text-[13px]
      font-bold
      text-white
      shadow-lg
      shadow-[#304998]/20
      transition
      duration-200
      hover:-translate-y-0.5
      hover:bg-[#253b82]
      active:scale-95
     "
     @click="goHome"
    >
     بازگشت به صفحه اصلی
    </button>


    <button
     type="button"
     class="
     mt-4
      min-w-[170px]
      rounded-full
      border
      border-[#304998]/20
      bg-white
      px-7
      py-3
      text-[13px]
      font-bold
      text-[#304998]
      transition
      duration-200
      hover:border-[#304998]
      hover:bg-[#304998]/5
      active:scale-95
     "
     @click="goBack"
    >
     بازگشت به صفحه قبل
    </button>
   </div>


   <!-- Decorative Plane -->
   <div
    class="
     mt-12
     flex
     items-center
     gap-3
     text-[#304998]/30
    "
   >
    <span class="h-px w-16 bg-[#304998]/20"></span>

    <!-- <i
     class="
      bi
      bi-airplane
      rotate-[-25deg]
      text-[28px]
     "
    ></i> -->

    <span class="h-px w-16 bg-[#304998]/20"></span>
   </div>
  </div>
 </div>
</template>


<script setup>
const props=defineProps({
 error:{
  type:Object,
  required:true
 }
})


const statusCode=computed(()=>
 props.error?.statusCode||404
)


const title=computed(()=>{
 if(statusCode.value===404){
  return 'صفحه موردنظر پیدا نشد'
 }

 return 'مشکلی پیش آمده است'
})


const description=computed(()=>{
 if(statusCode.value===404){
  return 'ممکن است آدرس صفحه تغییر کرده باشد، حذف شده باشد یا آدرس را اشتباه وارد کرده باشید.'
 }

 return 'در بارگذاری این صفحه مشکلی به وجود آمده است. لطفاً دوباره تلاش کنید.'
})


function goHome(){
 clearError({
  redirect:'/'
 })
}


function goBack(){
 if(import.meta.client){
  window.history.back()
 }
}
</script>
<style scoped>
.error-logo{
 animation:
  logoAlive 2.6s cubic-bezier(.45,.05,.55,.95) infinite,
  logoGlow 2.6s ease-in-out infinite;

 transform-origin:50% 80%;
 cursor:pointer;
 will-change:transform,filter;

 transition:
  transform .25s ease,
  filter .25s ease;
}


/* حرکت اصلی لوگو */
@keyframes logoAlive{

 0%{
  transform:
   translateY(0)
   rotate(0deg)
   scale(1);
 }

 12%{
  transform:
   translateY(-5px)
   rotate(-4deg)
   scale(1.04);
 }

 25%{
  transform:
   translateY(-14px)
   rotate(3deg)
   scale(1.08);
 }

 38%{
  transform:
   translateY(-8px)
   rotate(-2deg)
   scale(1.04);
 }

 50%{
  transform:
   translateY(-18px)
   rotate(0deg)
   scale(1.1);
 }

 62%{
  transform:
   translateY(-8px)
   rotate(3deg)
   scale(1.04);
 }

 75%{
  transform:
   translateY(-13px)
   rotate(-3deg)
   scale(1.07);
 }

 88%{
  transform:
   translateY(-4px)
   rotate(2deg)
   scale(1.02);
 }

 100%{
  transform:
   translateY(0)
   rotate(0deg)
   scale(1);
 }
}


/* سایه متحرک */
@keyframes logoGlow{

 0%,
 100%{
  filter:
   drop-shadow(
    0 4px 4px rgba(48,73,152,.12)
   );
 }

 50%{
  filter:
   drop-shadow(
    0 14px 10px rgba(48,73,152,.28)
   );
 }

}




@keyframes logoHover{

 0%{
  transform:
   rotate(0deg)
   scale(1);
 }

 25%{
  transform:
   rotate(-10deg)
   scale(1.15);
 }

 50%{
  transform:
   rotate(9deg)
   scale(1.18);
 }

 75%{
  transform:
   rotate(-5deg)
   scale(1.12);
 }

 100%{
  transform:
   rotate(0deg)
   scale(1.08);
 }

}
</style>