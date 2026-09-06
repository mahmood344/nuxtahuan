<template>
 <div
  class="min-h-screen bg-[#f8f8f8] pb-[90px] md:pb-0"
  dir="rtl"
 >
  <!-- ========================= -->
  <!-- Loading -->
  <!-- ========================= -->

  <div
   v-if="loading"
   class="flex min-h-screen items-center justify-center"
  >
   <div class="text-center">
    <div
     class="
      mx-auto
      h-10 w-10
      animate-spin
      rounded-full
      border-4
      border-gray-200
      border-t-blue-700
     "
    ></div>

    <p class="mt-4 text-[12px] text-gray-500">
     در حال دریافت اطلاعات تور...
    </p>
   </div>
  </div>

  <!-- ========================= -->
  <!-- Error -->
  <!-- ========================= -->

  <div
   v-else-if="errorMessage"
   class="flex min-h-[500px] items-center justify-center px-4"
  >
   <div class="text-center">
    <p class="text-[13px] font-bold text-red-500">
     {{errorMessage}}
    </p>

    <button
     type="button"
     class="
      mt-4
      rounded-lg
      bg-blue-700
      px-5 py-2
      text-[11px]
      font-bold
      text-white
     "
     @click="loadPackage"
    >
     تلاش مجدد
    </button>
   </div>
  </div>

  <!-- ========================= -->
  <!-- Page -->
  <!-- ========================= -->

  <template v-else-if="packageData">

   <!-- ========================= -->
   <!-- Hero -->
   <!-- دسکتاپ 250px -->
   <!-- موبایل مخفی -->
   <!-- ========================= -->

  <!-- ========================= -->
<!-- Hero - Desktop + Mobile -->
<!-- ========================= -->

<!-- ========================= -->
<!-- Hero -->
<!-- ========================= -->

<section
 v-if="getMainImage(packageData)"
 class="
  relative
  mt-[-35px]
  w-full
  overflow-hidden
  bg-[#f8f8f8]
 "
>
 <!-- Mobile -->
 <div
  class="
   relative
   h-[320px]
   w-full
   md:hidden
  "
 >
  <img
   :src="getMobileImage(packageData)"
   :alt="packageData.name"
   class="
    h-full
    w-full
    object-cover
    object-center
   "
  >

  <div
   class="
    pointer-events-none
    absolute
    inset-x-0
    bottom-0
    bg-gradient-to-t
    from-black/70
    via-black/20
    to-transparent
    px-4
    pb-5
    pt-20
   "
  >
   <h1
    class="
     text-[18px]
     font-black
     text-white
     drop-shadow-lg
    "
   >
    {{packageData.name}}
   </h1>
  </div>
 </div>


 <!-- Desktop -->
 <div
  class="
   relative
   hidden
   w-full
   md:block
  "
 >
  <img
   :src="getMainImage(packageData)"
   :alt="packageData.name"
   class="
    block
    h-auto
    w-full
    object-contain
   "
  >

  <div
   class="
    pointer-events-none
    absolute
    inset-x-0
    bottom-0
    bg-gradient-to-t
    from-black/55
    via-black/10
    to-transparent
    px-6
    pb-7
    pt-20
   "
  >
   <div
    class="
     mx-auto
     w-full
     max-w-[1100px]
    "
   >
    <h1
     class="
      text-[24px]
      font-black
      text-white
      drop-shadow-lg
     "
    >
     {{packageData.name}}
    </h1>
   </div>
  </div>
 </div>
</section>

   <!-- ========================= -->
   <!-- Mobile Title -->
   <!-- ========================= -->

   <!-- <div
    class="
     px-4
     pb-3
     pt-5
     md:hidden
    "
   >
    <h1
     class="
      text-[18px]
      font-black
      text-gray-900
     "
    >
     {{packageData.name}}
    </h1>
   </div> -->

   <!-- ========================= -->
   <!-- Sticky Tabs -->
   <!-- ========================= -->

   <div
    class="
     sticky
     top-0
     z-40
     border-b
     border-gray-200
     bg-[#f8f8f8]/95
     backdrop-blur-md
    "
   >
    <div
 class="
  mx-auto
  grid
  w-full
  max-w-[1100px]
  grid-cols-2
  gap-2
  px-4
  py-3

  md:flex
  md:items-center
  md:justify-center
 "
>
     <button
      v-if="hasPrograms"
      type="button"
      :class="tabClass('program')"
      @click="activeTab='program'"
     >
      برنامه سفر
     </button>

     <button
      v-if="hasServices"
      type="button"
      :class="tabClass('services')"
      @click="activeTab='services'"
     >
      خدمات تور
     </button>

     <button
      v-if="hasPrices"
      type="button"
      :class="tabClass('prices')"
      @click="activeTab='prices'"
     >
      لیست قیمت
     </button>

     <button
      v-if="hasDocs"
      type="button"
      :class="tabClass('docs')"
      @click="activeTab='docs'"
     >
      مدارک مورد نیاز
     </button>

     <button
      v-if="hasTips"
      type="button"
      :class="tabClass('tips')"
      @click="activeTab='tips'"
     >
      نکات ضروری
     </button>

     <button
      v-if="hasPhotos"
      type="button"
      :class="tabClass('gallery')"
      @click="activeTab='gallery'"
     >
      گالری تصاویر
     </button>
    </div>
   </div>

   <!-- ========================= -->
   <!-- Content -->
   <!-- ========================= -->

   <main
    class="
     mx-auto
     w-full
     max-w-[1100px]
     px-4
     py-7
     md:px-6
     md:py-9
    "
   >

    <!-- ========================= -->
    <!-- Program -->
    <!-- ========================= -->

    <section
     v-if="activeTab==='program'"
     class="rounded-lg bg-white p-5 md:p-7"
    >
     <h2
      class="
       mb-5
       text-[16px]
       font-black
       text-blue-800
       md:text-[18px]
      "
     >
      برنامه سفر
     </h2>

     <!-- Flights -->

     <div
      v-if="packageFlights.length"
      class="mb-7"
     >
      <h3
       class="
        mb-4
        text-[13px]
        font-black
        text-gray-800
       "
      >
       اطلاعات پرواز
      </h3>

      <div class="space-y-3">
       <div
        v-for="flight in packageFlights"
        :key="flight.id"
        class="
         rounded-lg
         border
         border-gray-200
         bg-gray-50
         p-4
        "
       >
        <div
         class="
          grid
          grid-cols-1
          gap-4
          text-[11px]
          text-gray-600
          sm:grid-cols-2
          md:grid-cols-4
         "
        >
         <div>
          <span class="block text-[9px] text-gray-400">
           مسیر پرواز
          </span>

          <strong
           class="mt-1 block text-gray-800"
          >
           {{flight.flightPath||'-'}}
          </strong>
         </div>

         <div>
          <span class="block text-[9px] text-gray-400">
           فرودگاه
          </span>

          <strong
           class="mt-1 block text-gray-800"
          >
           {{flight.airportsPath||'-'}}
          </strong>
         </div>

         <div>
          <span class="block text-[9px] text-gray-400">
           شماره پرواز
          </span>

          <strong
           class="mt-1 block text-gray-800"
          >
           {{flight.flightNo||'-'}}
          </strong>
         </div>

         <div>
          <span class="block text-[9px] text-gray-400">
           ساعت
          </span>

          <strong
           class="mt-1 block text-gray-800"
          >
           {{flight.depTime||'-'}}
          </strong>
         </div>
        </div>
       </div>
      </div>
     </div>

     <!-- Program texts -->

     <div
      v-if="packagePrograms.length"
      class="space-y-5"
     >
      <article
       v-for="program in packagePrograms"
       :key="program.id"
      >
       <h3
        v-if="program.title"
        class="
         mb-2
         text-[13px]
         font-black
         text-gray-800
        "
       >
        {{program.title}}
       </h3>

       <div
        class="
         html-content
         text-[12px]
         leading-8
         text-gray-700
         md:text-[13px]
        "
        v-html="program.program"
       ></div>
      </article>
     </div>

     <p
      v-if="!packagePrograms.length&&!packageFlights.length"
      class="text-[12px] text-gray-400"
     >
      اطلاعاتی برای برنامه سفر ثبت نشده است.
     </p>
    </section>

    <!-- ========================= -->
    <!-- Services -->
    <!-- ========================= -->

    <section
     v-else-if="activeTab==='services'"
     class="rounded-lg bg-white p-5 md:p-7"
    >
     <h2
      class="
       mb-5
       text-[16px]
       font-black
       text-blue-800
       md:text-[18px]
      "
     >
      خدمات تور
     </h2>

     <div
      class="
       grid
       grid-cols-1
       gap-3
       md:grid-cols-2
      "
     >
      <div
       v-for="item in packageServices"
       :key="item.id"
       class="
        flex
        items-center
        gap-3
        rounded-lg
        bg-gray-50
        px-4
        py-4
        text-[12px]
        font-bold
        text-gray-700
       "
      >
       <i
        class="
         bi bi-check-circle-fill
         text-blue-700
        "
       ></i>

      <div
 class="html-content"
 v-html="item.service"
></div>
      </div>
     </div>
    </section>

    <!-- ========================= -->
    <!-- Prices -->
    <!-- ========================= -->

    <section
     v-else-if="activeTab==='prices'"
     class="
      overflow-hidden
      rounded-lg
      bg-white
      p-4
      md:p-6
     "
    >
     <h2
      class="
       mb-5
       text-[16px]
       font-black
       text-blue-800
       md:text-[18px]
      "
     >
      لیست قیمت
     </h2>

     <p
      class="
       mb-4
       text-[11px]
       font-bold
       text-gray-600
      "
     >
      قیمت‌های اعلام شده به ازای هر نفر می‌باشد.
     </p>

     <div
      class="
       w-full
       overflow-x-auto
       rounded-lg
       border
       border-gray-200
      "
     >
      <table
       class="
        min-w-[850px]
        w-full
        border-collapse
        text-center
        text-[10px]
       "
      >
       <thead>
        <tr class="bg-gray-100 text-gray-700">
         <th class="border-b px-3 py-3">
          ردیف
         </th>

         <th class="border-b px-3 py-3">
          هتل
         </th>

         <th class="border-b px-3 py-3">
          ستاره
         </th>

         <th class="border-b px-3 py-3">
          موقعیت
         </th>

         <th class="border-b px-3 py-3">
          دو تخته
         </th>

         <th class="border-b px-3 py-3">
          یک تخته
         </th>

         <th class="border-b px-3 py-3">
          کودک با تخت
         </th>

         <th class="border-b px-3 py-3">
          کودک بدون تخت
         </th>
        </tr>
       </thead>

       <tbody>
        <tr
         v-for="(hotel,index) in packageHotelPrices"
         :key="hotel.id"
         class="
          border-b
          border-gray-100
          even:bg-[#fafafa]
         "
        >
         <td class="px-3 py-3">
          {{index+1}}
         </td>

         <td
          class="
           px-3
           py-3
           font-black
           text-gray-800
          "
         >
          {{hotel.hotel}}
         </td>

         <td class="px-3 py-3">
          {{hotel.star}}
         </td>

         <td class="px-3 py-3">
          {{hotel.location}}
         </td>

         <td class="px-3 py-3">
          {{formatMoney(hotel.dbl)}}
         </td>

         <td class="px-3 py-3">
          {{formatMoney(hotel.sgl)}}
         </td>

         <td class="px-3 py-3">
          {{formatMoney(hotel.extBed)}}
         </td>

         <td class="px-3 py-3">
          {{formatMoney(hotel.noBed)}}
         </td>
        </tr>
       </tbody>
      </table>
     </div>
    </section>

    <!-- ========================= -->
    <!-- Docs -->
    <!-- ========================= -->

    <section
     v-else-if="activeTab==='docs'"
     class="rounded-lg bg-white p-5 md:p-7"
    >
     <h2
      class="
       mb-5
       text-[16px]
       font-black
       text-blue-800
       md:text-[18px]
      "
     >
      مدارک مورد نیاز
     </h2>

     <article
      v-for="item in packageDocs"
      :key="item.id"
      class="mb-5 last:mb-0"
     >
      <h3
       v-if="item.title"
       class="
        mb-2
        text-[13px]
        font-black
        text-gray-800
       "
      >
       {{item.title}}
      </h3>

      <div
       class="
        html-content
        text-[12px]
        leading-8
        text-gray-700
       "
       v-html="item.description"
      ></div>
     </article>
    </section>

    <!-- ========================= -->
    <!-- Tips -->
    <!-- ========================= -->

    <section
     v-else-if="activeTab==='tips'"
     class="rounded-lg bg-white p-5 md:p-7"
    >
     <h2
      class="
       mb-5
       text-[16px]
       font-black
       text-blue-800
       md:text-[18px]
      "
     >
      نکات ضروری
     </h2>

     <div class="space-y-4">
      <article
       v-for="item in packageEssentialTips"
       :key="item.id"
       class="
        flex
        gap-3
        text-[12px]
        leading-8
        text-gray-700
       "
      >
       <span
        class="
         mt-[11px]
         h-1.5
         w-1.5
         shrink-0
         rounded-full
         bg-red-500
        "
       ></span>

       <div>
        <strong
         v-if="item.essentialTitle"
         class="block text-gray-900"
        >
         {{item.essentialTitle}}
        </strong>

        <HtmlText
         :value="item.essentialTip"
        />
       </div>
      </article>
     </div>
    </section>

    <!-- ========================= -->
    <!-- Gallery -->
    <!-- ========================= -->

    <section
     v-else-if="activeTab==='gallery'"
     class="rounded-lg bg-white p-5 md:p-7"
    >
     <h2
      class="
       mb-5
       text-[16px]
       font-black
       text-blue-800
       md:text-[18px]
      "
     >
      گالری تصاویر
     </h2>

     <div
      class="
       grid
       grid-cols-2
       gap-3
       md:grid-cols-3
       lg:grid-cols-4
      "
     >
      <button
       v-for="photo in packagePhotoes"
       :key="photo.id"
       type="button"
       class="
        group
        relative
        h-[150px]
        overflow-hidden
        rounded-lg
        bg-gray-100
       "
       @click="openPhoto(photo)"
      >
       <img
        :src="buildImageUrl(photo.photo)"
        :alt="photo.description||packageData.name"
        class="
         h-full
         w-full
         object-cover
         transition
         duration-500
         group-hover:scale-105
        "
       >
      </button>
     </div>
    </section>

    <!-- ========================= -->
    <!-- Contact Desktop -->
    <!-- ========================= -->

    <section
     class="
      mt-8
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

   <!-- ========================= -->
   <!-- Mobile Fixed Contact -->
   <!-- ========================= -->

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
      mx-auto
      flex
      items-center
      justify-between
      gap-3
     "
    >
     <p
      class="
       flex-1
       text-[10px]
       font-bold
       leading-5
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
       py-2.5
       text-[11px]
       font-black
       text-white
      "
     >
      41889-021
     </a>
    </div>
   </div>

   <!-- ========================= -->
   <!-- Photo Modal -->
   <!-- ========================= -->

   <div
    v-if="selectedPhoto"
    class="
     fixed
     inset-0
     z-[100]
     flex
     items-center
     justify-center
     bg-black/80
     p-4
    "
    @click.self="selectedPhoto=null"
   >
    <button
     type="button"
     class="
      absolute
      left-5
      top-5
      text-[30px]
      text-white
     "
     @click="selectedPhoto=null"
    >
     ×
    </button>

    <img
     :src="buildImageUrl(selectedPhoto.photo)"
     :alt="selectedPhoto.description||''"
     class="
      max-h-[90vh]
      max-w-full
      rounded-lg
      object-contain
     "
    >
   </div>

  </template>
 </div>
</template>

<script setup>
import{
 ref,
 computed,
 watch
}from'vue'

import{
 useRoute
}from'vue-router'

const route=useRoute()

const BASE_URL=
 'https://api.ahuan.ir/api'

const IMAGE_BASE_URL=
 'https://panel.ahuan.ir/uploads'

const packageData=ref(null)

const loading=ref(false)

const errorMessage=ref('')

const selectedPhoto=ref(null)

const activeTab=ref('program')

const packageId=computed(()=>
 String(route.params.packageId||'')
)

/* ========================= */
/* API Fields */
/* ========================= */

const packagePrograms=computed(()=>
 sortItems(
  packageData.value?.packagePrograms
 )
)

const packageServices=computed(()=>
 sortItems(
  packageData.value?.packageServices
 )
)

const packageHotelPrices=computed(()=>
 Array.isArray(
  packageData.value?.packageHotelPrices
 )
  ?packageData.value.packageHotelPrices
  :[]
)

const packageDocs=computed(()=>
 sortItems(
  packageData.value?.packageDocs
 )
)

const packageEssentialTips=computed(()=>
 sortItems(
  packageData.value?.packageEssentialTips
 )
)

const packageFlights=computed(()=>
 sortItems(
  packageData.value?.packageFlights
 )
)

const packagePhotoes=computed(()=>
 sortItems(
  packageData.value?.packagePhotoes
 )
)

/* ========================= */
/* Available Tabs */
/* ========================= */

const hasPrograms=computed(()=>
 packagePrograms.value.length>0||
 packageFlights.value.length>0
)

const hasServices=computed(()=>
 packageServices.value.length>0
)

const hasPrices=computed(()=>
 packageHotelPrices.value.length>0
)

const hasDocs=computed(()=>
 packageDocs.value.length>0
)

const hasTips=computed(()=>
 packageEssentialTips.value.length>0
)

const hasPhotos=computed(()=>
 packagePhotoes.value.length>0
)

/* ========================= */
/* Sort */
/* ========================= */
function getMobileImage(item){

 if(!item)
  return''

 return buildImageUrl(
  item.backImageM ||
  item.imageM ||
  item.backImage ||
  item.image
 )

}
function sortItems(items){
 if(!Array.isArray(items))
  return[]

 return[...items].sort(
  (a,b)=>
   Number(a?.orderId??9999)-
   Number(b?.orderId??9999)
 )
}

/* ========================= */
/* Load Package */
/* ========================= */

async function loadPackage(){
 if(!packageId.value)
  return

 try{
  loading.value=true
  errorMessage.value=''
  packageData.value=null

  const response=
   await $fetch(
    `${BASE_URL}/package/${packageId.value}`
   )

  packageData.value=
   response?.data||
   response?.result||
   response||
   null

  setDefaultTab()
 }
 catch(error){
  console.error(
   'Load Package Error:',
   error
  )

  packageData.value=null

  errorMessage.value=
   'دریافت اطلاعات پکیج با خطا مواجه شد.'
 }
 finally{
  loading.value=false
 }
}

/* ========================= */
/* Default Tab */
/* ========================= */

function setDefaultTab(){
 if(hasPrograms.value){
  activeTab.value='program'
  return
 }

 if(hasServices.value){
  activeTab.value='services'
  return
 }

 if(hasPrices.value){
  activeTab.value='prices'
  return
 }

 if(hasDocs.value){
  activeTab.value='docs'
  return
 }

 if(hasTips.value){
  activeTab.value='tips'
  return
 }

 if(hasPhotos.value){
  activeTab.value='gallery'
 }
}

/* ========================= */
/* Tab CSS */
/* ========================= */

function tabClass(tab){

 return[
  `
   w-full
   whitespace-nowrap
   rounded-xl
   px-3
   py-3
   text-[11px]
   font-bold
   transition

   md:w-auto
   md:rounded-full
   md:px-5
   md:py-2
   md:text-[10px]
  `,

  activeTab.value===tab
   ?'bg-[#7f888d] text-white shadow-sm'
   :'bg-white text-gray-700 hover:bg-gray-200'
 ]

}

/* ========================= */
/* Images */
/* ========================= */

function buildImageUrl(image){
 if(!image)
  return''

 if(
  image.startsWith('http://')||
  image.startsWith('https://')
 )
  return image

 return`${IMAGE_BASE_URL}/${image}`
}

function getMainImage(item){
 if(!item)
  return''

 return buildImageUrl(
  item.backImage||
  item.image||
  item.backImageM||
  item.imageM
 )
}

function openPhoto(photo){
 selectedPhoto.value=photo
}

/* ========================= */
/* Money */
/* ========================= */

function formatMoney(value){
 if(
  value===null||
  value===undefined||
  value===''
 )
  return'-'

 const number=Number(value)

 if(Number.isNaN(number))
  return value

 return(
  number.toLocaleString('fa-IR')+
  ' تومان'
 )
}

/* ========================= */
/* Watch */
/* ========================= */

watch(
 packageId,
 ()=>{
  loadPackage()
 },
 {
  immediate:true
 }
)
</script>

<style scoped>
/* scrollbar tabs */
.overflow-x-auto{
 scrollbar-width:none;
}

.overflow-x-auto::-webkit-scrollbar{
 display:none;
}
</style>