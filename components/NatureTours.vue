<template>
 <section
  class="mx-auto w-full max-w-7xl px-4 py-10"
  dir="rtl"
 >
  <!-- Header -->
  <div class="mb-5 flex items-center justify-start gap-2">
   <i
    class="bi bi-tree text-[24px] text-gray-600"
   ></i>

   <h2
    class="text-[14px] font-black text-gray-700"
   >
    تورهای طبیعت‌گردی آهوان
   </h2>
  </div>

  <!-- Cards -->
  <div
   class="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-2"
  >
   <NuxtLink
    v-for="tour in tours"
    :key="tour.id"
    :to="`/naturetours/${tour.id}`"
    class="group relative h-[400px] overflow-hidden rounded-lg shadow-md"
   >
    <!-- Image -->
    <img
     :src="tour.image"
     :alt="tour.title"
     class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
    >

    <!-- Glass Overlay -->
    <div
     class="
      absolute inset-0
      flex items-center justify-center
      bg-black/0
      opacity-0
      backdrop-blur-0
      transition-all duration-500
      group-hover:bg-black/45
      group-hover:opacity-100
      group-hover:backdrop-blur-[2px]
     "
    >
     <div class="flex items-center gap-3 text-white">
      <span
       class="h-[1px] w-8 bg-white/80"
      ></span>

      <span
       class="text-[16px] font-black drop-shadow-md"
      >
       {{tour.title}}
      </span>

      <span
       class="h-[1px] w-8 bg-white/80"
      ></span>
     </div>
    </div>
   </NuxtLink>
  </div>

  <!-- More -->
  <div class="mt-5 flex justify-center">
   <NuxtLink
    to="/naturetours"
    class="
     rounded-full
     border border-blue-700
     px-4 py-2
     text-[11px]
     text-blue-700
     transition
     hover:bg-blue-700
     hover:text-white
    "
   >
    تورهای بیشتر +
   </NuxtLink>
  </div>
 </section>
</template>

<script setup>
const tours=[
 {
  id:1,
  title:'تور روستای شهرستانک',
  image:'/imgs/tours/NatureTours/sahrestanak.jpg'
 },
 {
  id:2,
  title:'تور روستای برغان',
  image:'/imgs/tours/NatureTours/baraghan.jpg'
 },
 {
  id:3,
  title:'تور جنگل بلیران',
  image:'/imgs/tours/NatureTours/beliran.jpg'
 },
 {
  id:4,
  title:'تور روستای هرانده',
  image:'/imgs/tours/NatureTours/harande.jpg'
 }
]
</script>