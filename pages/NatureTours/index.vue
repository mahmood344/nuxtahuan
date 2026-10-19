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
    :src="tour.header" 
    :alt="tour.name" 
    class="
      h-full 
      w-full 
      object-cover 
      transition 
      duration-500 

      md:group-hover:scale-105
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

      bg-black/45 
      opacity-100 
      backdrop-blur-[2px] 

      transition-all 
      duration-500 

      md:bg-black/0 
      md:opacity-0 
      md:backdrop-blur-0 

      md:group-hover:bg-black/45 
      md:group-hover:opacity-100 
      md:group-hover:backdrop-blur-[2px] 
    " 
  > 
    <div 
      class="
        translate-y-0 
        text-center 
        text-white 
        opacity-100 

        transition-all 
        duration-500 

        md:translate-y-3 
        md:opacity-0 

        md:group-hover:translate-y-0 
        md:group-hover:opacity-100 
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
import { useRouter } from 'vue-router'
import { natureTours } from '~/data/natureTours'

const router = useRouter()

const tours = natureTours

function openTour(tour) {
  if (!tour?.id) return

  router.push(`/naturetours/${tour.id}`)
}
</script>