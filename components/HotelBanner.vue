<template>
 <section
  class="mx-auto w-full max-w-7xl px-4 py-10"
 >
  <button
   type="button"
   class="
    group
    block
    w-full
    cursor-pointer
    overflow-hidden
    rounded-[22px]
    border-0
    bg-transparent
    p-0
    shadow-lg
   "
   @click="goToHotel"
  >
   <!-- Desktop -->
   <img
    src="/imgs/hotel/هدر سایت.jpg"
    alt="هتل بزرگ آهوان"
    class="
     hidden
     w-full
     object-cover
     transition-transform
     duration-500
     group-hover:scale-[1.01]
     md:block
    "
   >

   <!-- Mobile -->
   <img
    src="/imgs/hotel/هدر سایت موبایل.jpg"
    alt="هتل بزرگ آهوان"
    class="
     block
     w-full
     object-cover
     transition-transform
     duration-500
     group-hover:scale-[1.01]
     md:hidden
    "
   >
  </button>
 </section>
</template>

<script setup>
function goToHotel(){
 if(!import.meta.client)
  return

 window.location.href=
  `${window.location.origin}/hotels/3`
}
</script>