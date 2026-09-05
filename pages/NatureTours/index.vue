<template>
 <div
  class="min-h-screen bg-white pb-16"
  dir="rtl"
 >
  <main
   class="mx-auto w-full max-w-[920px] px-4 py-10"
  >
   <!-- Title -->
   <div
    class="mb-7 flex items-center justify-center gap-3"
   >
    <span
     class="h-[2px] w-[45px] bg-blue-700"
    ></span>

    <h1
     class="whitespace-nowrap text-[15px] font-black text-blue-800 md:text-[16px]"
    >
     تورهای طبیعت گردی آهوان
    </h1>

    <span
     class="h-[2px] w-[45px] bg-blue-700"
    ></span>
   </div>

   <!-- Tours -->
   <div
    class="grid grid-cols-1 gap-[10px] md:grid-cols-2"
   >
    <div
     v-for="tour in tours"
     :key="tour.id"
     class="
      group
      relative
      h-[165px]
      cursor-pointer
      overflow-hidden
      rounded-[6px]
      bg-gray-200
      shadow-sm
     "
     @click="openTour(tour)"
    >
     <!-- Image -->
     <img
      :src="tour.image"
      :alt="tour.name"
      class="
       h-full
       w-full
       object-cover
       transition
       duration-500
       group-hover:scale-105
      "
     >

     <!-- Overlay -->
     <div
      class="
       absolute
       inset-0
       flex
       items-center
       justify-center
       bg-black/0
       opacity-0
       backdrop-blur-0
       transition-all
       duration-500
       group-hover:bg-black/45
       group-hover:opacity-100
       group-hover:backdrop-blur-[2px]
      "
     >
      <div
       class="
        translate-y-3
        text-center
        text-white
        opacity-0
        transition-all
        duration-500
        group-hover:translate-y-0
        group-hover:opacity-100
       "
      >
       <h2
        class="text-[15px] font-black drop-shadow-lg"
       >
        {{tour.name}}
       </h2>

       <p
        v-if="tour.title"
        class="
         mt-1
         text-[10px]
         font-bold
         text-white/90
        "
       >
        {{tour.title}}
       </p>

       <p
        v-if="tour.price"
        class="
         mt-2
         text-[11px]
         font-black
         text-white
         drop-shadow-lg
        "
       >
        {{tour.price}} تومان
       </p>
      </div>
     </div>
    </div>
   </div>
  </main>
 </div>
</template>

<script setup>
import{
 useRouter
}from'vue-router'



const router=useRouter()

const tours=[
 {
  id:1,
  image:'/imgs/tours/NatureTours/1.jpg',
  price:'2,100,000',
  name:'تور روستای شهرستانک',
  title:'بهشت کوچک جاده چالوس'
 },
 {
  id:2,
  image:'/imgs/tours/NatureTours/2.jpg',
  price:'2,800,000',
  name:'تور روستای برغان',
  title:'سفر به دل طبیعت و اصالت ایرانی'
 },
 {
  id:3,
  image:'/imgs/tours/NatureTours/3.jpg',
  price:'2,100,000',
  name:'تور جنگل بلیران',
  title:'سفر به قلب مه و آرامش شمال'
 },
 {
  id:4,
  image:'/imgs/tours/NatureTours/4.jpg',
  price:'2,100,000',
  name:'تور روستای هرانده',
  title:'سفر به دل طبیعت کوهستانی و مسیرهای آرام‌بخش آبشار'
 },
 {
  id:7,
  image:'/imgs/tours/NatureTours/7.jpg',
  price:'2,500,000',
  name:'تور شهر تاریخی قزوین',
  title:'سفری در دل تاریخ، معماری و طعم اصیل ایرانی'
 },
 {
  id:8,
  image:'/imgs/tours/NatureTours/8.jpg',
  price:'2,500,000',
  name:'تور شهر زنجان',
  title:'سفر به دیار مردان نمکی، گنبد سلطانیه و مهمان‌نوازی اصیل ایرانی'
 },
 {
  id:9,
  image:'/imgs/tours/NatureTours/9.jpg',
  price:'3,500,000',
  name:'تور غار کتله‌خور',
  title:'ماجراجویی در دل زمین؛ جایی که سنگ‌ها قصه می‌گویند!'
 },
 {
  id:10,
  image:'/imgs/tours/NatureTours/10.jpg',
  price:'3,500,000',
  name:'تور غار علیصدر',
  title:'سفری روی آب، در دل زمین!'
 },
 {
  id:11,
  image:'/imgs/tours/NatureTours/11.jpg',
  price:'2,800,000',
  name:'تور کاشان و قمصر (گلاب گیری)',
  title:'سفری در دل تاریخ، معماری و طعم اصیل ایرانی'
 }
]

function openTour(tour){
 if(!tour?.id)
  return

 router.push(
  `/naturetours/${tour.id}`
 )
}
</script>