<template>
 <div
  class="min-h-screen bg-[#f8f8f8] pb-16"
  dir="rtl"
 >
  <!-- Hero -->
  <section
   v-if="tour"
   class="relative hidden h-[250px] w-full overflow-hidden md:block mt-[-50px]"
  >
   <img
    :src="tour.header"
    :alt="tour.name"
    class="h-full w-full object-cover"
   >

   <div
    class="
     absolute inset-0
     bg-gradient-to-t
     from-black/50
     via-transparent
     to-transparent
    "
   ></div>
  </section>

  <!-- Mobile Hero -->
  <section
   v-if="tour"
   class="relative block w-full md:hidden"
  >
   <img
    :src="tour.headerMobile||tour.header"
    :alt="tour.name"
    class="h-[400px] w-full object-cover"
   >
  </section>

  <main
   v-if="tour"
   class="
    mx-auto
    w-full
    max-w-[920px]
    px-4
    py-8
    md:px-6
   "
  >
   <!-- Name -->
   <h1
    class="
     mb-3
     text-[20px]
     font-black
     text-gray-900
     md:text-[24px]
    "
   >
    {{tour.name}}
   </h1>

   <!-- Subtitle -->
   <p
    class="
     mb-6
     text-[13px]
     font-bold
     text-gray-700
    "
   >
    {{tour.title}}
   </p>

   <!-- Location -->
   <section class="mb-5">
    <h2
     class="
      mb-2
      text-[16px]
      font-black
      text-gray-900
     "
    >
     {{tour.titleLocation}}
    </h2>

    <p
     class="
      text-justify
      text-[12px]
      leading-8
      text-gray-700
      md:text-[13px]
     "
    >
     {{tour.descriptionLocation}}
    </p>
   </section>

   <!-- Weather -->
   <section class="mb-7">
    <h2
     class="
      mb-2
      text-[16px]
      font-black
      text-gray-900
     "
    >
     {{tour.titleWeather}}
    </h2>

    <p
     class="
      text-justify
      text-[12px]
      leading-8
      text-gray-700
      md:text-[13px]
     "
    >
     {{tour.descriptionWeather}}
    </p>
   </section>

   <!-- Tour Card -->
   <section
    class="
     mb-7
     overflow-hidden
     rounded-[8px]
     border
     border-gray-200
     bg-white
    "
   >
    <div
     class="
      grid
      grid-cols-1
      md:grid-cols-3
     "
    >
     <!-- Name -->
     <div
      class="
       flex
       items-center
       justify-center
       border-b
       border-gray-200
       px-5
       py-6
       text-center
       md:border-b-0
       md:border-l
      "
     >
      <strong
       class="
        text-[13px]
        font-black
        text-gray-800
       "
      >
       {{tour.name}}
      </strong>
     </div>

     <!-- Service -->
     <div
      class="
       flex
       items-center
       justify-center
       border-b
       border-gray-200
       px-5
       py-6
       text-center
       md:border-b-0
       md:border-l
      "
     >
      <p
       class="
        text-[11px]
        leading-6
        text-gray-700
       "
      >
       {{tour.service}}
      </p>
     </div>

     <!-- Price -->
     <div
      class="
       flex
       items-center
       justify-center
       px-5
       py-6
       text-center
      "
     >
      <strong
       class="
        text-[12px]
        font-black
        text-gray-800
       "
      >
       {{tour.price}} تومان
      </strong>
     </div>
    </div>
   </section>

   <!-- Suitable -->
   <section class="mb-5">
    <h2
     class="
      mb-3
      text-[16px]
      font-black
      text-gray-900
     "
    >
     {{tour.titleSuitable}}
    </h2>

    <p
     v-for="(item,index) in tour.descriptionSuitable"
     :key="index"
     class="
      mb-2
      text-[12px]
      leading-7
      text-gray-700
      md:text-[13px]
     "
    >
     {{item}}
    </p>
   </section>

   <!-- Attractions -->
   <section class="mb-5">
    <h2
     class="
      mb-3
      text-[16px]
      font-black
      text-gray-900
     "
    >
     {{tour.titleAttractions}}
    </h2>

    <p
     v-for="(item,index) in tour.descriptionAttractions"
     :key="index"
     class="
      mb-2
      text-[12px]
      leading-7
      text-gray-700
      md:text-[13px]
     "
    >
     {{item}}
    </p>
   </section>

   <!-- Best Time -->
   <section class="mb-5">
    <h2
     class="
      mb-2
      text-[16px]
      font-black
      text-gray-900
     "
    >
     {{tour.titleBestTime}}
    </h2>

    <p
     class="
      text-justify
      text-[12px]
      leading-8
      text-gray-700
      md:text-[13px]
     "
    >
     {{tour.descriptionBestTime}}
    </p>
   </section>

   <!-- Tips -->
   <section class="mb-8">
    <h2
     class="
      mb-2
      text-[16px]
      font-black
      text-gray-900
     "
    >
     {{tour.titleTips}}
    </h2>

    <p
     class="
      text-justify
      text-[12px]
      leading-8
      text-gray-700
      md:text-[13px]
     "
    >
     {{tour.descriptionTips}}
    </p>
   </section>

   <!-- Contact Desktop -->
   <section
    class="
     hidden
     w-full
     items-center
     justify-center
     rounded-xl
     bg-white
     px-5
     py-5
     text-center
     shadow-sm
     md:flex
    "
   >
    <p
     class="
      text-[12px]
      font-bold
      text-gray-700
     "
    >
     جهت اخذ اطلاعات بیشتر با کارشناسان ما تماس حاصل فرمایید.

     <a
      href="tel:02141889"
      class="
       mr-1
       font-black
       text-blue-700
      "
     >
      تلفن: 41889-021
     </a>
    </p>
   </section>
  </main>

  <!-- Not Found -->
  <div
   v-else
   class="
    flex
    min-h-[500px]
    items-center
    justify-center
   "
  >
   <p class="text-[13px] text-gray-400">
    تور مورد نظر پیدا نشد.
   </p>
  </div>

  <!-- Mobile Contact -->
  <div
   class="
    fixed
    bottom-0
    left-0
    right-0
    z-50
    border-t
    border-gray-200
    bg-white
    px-3
    py-3
    shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
    md:hidden
   "
  >
   <div
    class="
     flex
     items-center
     justify-between
     gap-3
    "
   >
    <p
     class="
      text-[10px]
      font-bold
      text-gray-700
     "
    >
     جهت اخذ اطلاعات بیشتر با کارشناسان ما تماس حاصل فرمایید.
    </p>

    <a
     href="tel:02141889"
     class="
      shrink-0
      rounded-lg
      bg-blue-700
      px-4
      py-2
      text-[11px]
      font-black
      text-white
     "
    >
     41889-021
    </a>
   </div>
  </div>
 </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { natureTours } from '~/data/natureTours'

const route = useRoute()

const tour = computed(() =>
  natureTours.find(
    item => String(item.id) === String(route.params.id)
  ) ?? null
)
</script>