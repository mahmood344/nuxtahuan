<template>
 <div
  class="min-h-screen bg-white pb-16 "
  dir="rtl"
 >
  <main
   class="mx-auto w-full max-w-[920px] px-4 py-10"
  >
   <!-- Loading -->
   <div
    v-if="loading"
    class="flex min-h-[400px] items-center justify-center"
   >
    <div class="text-center">
     <div
      class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700"
     ></div>

     <p class="mt-4 text-[12px] text-gray-500">
      در حال دریافت تورها...
     </p>
    </div>
   </div>

   <!-- Error -->
   <div
    v-else-if="errorMessage"
    class="flex min-h-[300px] items-center justify-center"
   >
    <p class="text-[13px] font-bold text-red-500">
     {{errorMessage}}
    </p>
   </div>

   <template v-else>
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
      تورهای ویژه آهوان
     </h1>

     <span
      class="h-[2px] w-[45px] bg-blue-700"
     ></span>
    </div>

    <!-- Tours -->
    <div
     v-if="tours.length"
     class="grid grid-cols-1 gap-[10px] md:grid-cols-2"
    >
  <div
 v-for="tour in tours"
 :key="tour.id"
 class="group relative h-[165px] cursor-pointer overflow-hidden rounded-[6px] bg-gray-200 shadow-sm"
 @click="openTour(tour)"
>
 <!-- Image -->
 <img
  v-if="getTourImage(tour)"
  :src="getTourImage(tour)"
  :alt="tour.name"
  class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
 >

 <!-- No Image -->
 <div
  v-else
  class="flex h-full w-full items-center justify-center bg-gray-100"
 >
  <i
   class="bi bi-image text-[35px] text-gray-300"
  ></i>
 </div>

 <!-- Hover Overlay -->
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
  <div
   class="
    translate-y-3
    text-center
    text-white
    opacity-0
    transition-all duration-500
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
    v-if="tour.price"
    class="mt-2 text-[11px] font-bold text-white/90 drop-shadow-lg"
   >
    {{tour.price}}
   </p>
  </div>
 </div>
</div>
    </div>

    <!-- Empty -->
    <div
     v-else
     class="flex min-h-[300px] items-center justify-center"
    >
     <p class="text-[13px] text-gray-400">
      توری برای نمایش وجود ندارد.
     </p>
    </div>
   </template>
  </main>
 </div>
</template>

<script setup>
import{
 ref,
 onMounted
}from'vue'

import{
 useRouter
}from'vue-router'

const router=useRouter()

const API_URL=
 'https://api.ahuan.ir/api/package/groups'

const IMAGE_BASE_URL=
 'https://panel.ahuan.ir/uploads'

const tours=ref([])
const loading=ref(false)
const errorMessage=ref('')

async function loadTours(){
 try{
  loading.value=true
  errorMessage.value=''
  tours.value=[]

  const response=
   await $fetch(API_URL)

  const items=
   Array.isArray(response)
    ?response
    :Array.isArray(response?.data)
     ?response.data
     :Array.isArray(response?.result)
      ?response.result
      :[]

  tours.value=
   items
    .filter(item=>item?.isActive===true)
    .sort(
     (a,b)=>
      Number(a?.orderId??9999)-
      Number(b?.orderId??9999)
    )
 }
 catch(error){
  console.error(
   'Load Tours Error:',
   error
  )

  tours.value=[]

  errorMessage.value=
   'دریافت اطلاعات تورها با خطا مواجه شد.'
 }
 finally{
  loading.value=false
 }
}

function getTourImage(tour){
 const image=
  tour?.backImage||
  tour?.col1Image||
  tour?.backImageM||
  tour?.col1ImageM

 if(!image)
  return''

 if(
  image.startsWith('http://')||
  image.startsWith('https://')
 ){
  return image
 }

 return`${IMAGE_BASE_URL}/${image}`
}

function openTour(tour){
 if(!tour?.id)
  return

 router.push(
  `/domesticinternationaltours/${tour.id}`
 )
}

onMounted(()=>{
 loadTours()
})
</script>