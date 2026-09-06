<template>
 <div
  class="min-h-screen bg-[#f8f8f8] pb-[95px] md:pb-0"
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
     @click="loadData"
    >
     تلاش مجدد
    </button>
   </div>
  </div>

  <!-- ========================= -->
  <!-- Page -->
  <!-- ========================= -->

  <template v-else>

   <!-- ======================================== -->
   <!-- Hero -->
   <!-- فقط دسکتاپ -->
   <!-- ارتفاع 250px -->
   <!-- ======================================== -->

   <section
    v-if="group&&getGroupImage(group)"
    class="
     relative
     hidden
     h-[250px]
     mt-[-50px]
     w-full
     overflow-hidden
     md:block
    "
   >
    <img
     :src="getGroupImage(group)"
     :alt="group.name"
     class="
      absolute
      inset-0
      h-full
      w-full
      object-cover
     "
    
    >

    <div
     class="
      absolute
      inset-0
      bg-gradient-to-t
      from-black/25
      via-transparent
      to-transparent
     "
    ></div>
   </section>

   <!-- ======================================== -->
   <!-- Main -->
   <!-- ======================================== -->

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

    <!-- ======================================== -->
    <!-- First Note -->
    <!-- ======================================== -->

    <section
     v-if="firstNote"
     class="mb-7"
    >
     <h1
      class="
       mb-3
       text-[18px]
       font-black
       text-gray-900
       md:text-[22px]
      "
     >
      {{firstNote.title}}
     </h1>

     <div
      class="
       package-description
       text-[12px]
       leading-8
       text-gray-700
       md:text-[13px]
      "
      v-html="firstNote.description"
     ></div>
    </section>

    <!-- ======================================== -->
    <!-- Packages -->
    <!-- ======================================== -->

    <section
     v-if="activePackages.length"
     class="mb-8"
    >
     <div class="space-y-3">

      <article
       v-for="item in activePackages"
       :key="item.id"
       class="
        overflow-hidden
        rounded-[6px]
        border
        border-gray-200
        bg-white
       "
      >
       <div
        class="
         flex
         min-h-[115px]
         flex-col
         md:flex-row
        "
       >

        <!-- ========================= -->
        <!-- Image -->
        <!-- ========================= -->

        <div
         class="
          h-[180px]
          w-full
          shrink-0
          overflow-hidden
          bg-gray-100
          md:h-auto
          md:w-[210px]
         "
        >
         <img
          v-if="getPackageImage(item)"
          :src="getPackageImage(item)"
          :alt="item.name"
          class="
           h-full
           w-full
           object-cover
          "
         >

         <div
          v-else
          class="
           flex
           h-full
           w-full
           items-center
           justify-center
          "
         >
          <i
           class="
            bi bi-image
            text-[30px]
            text-gray-300
           "
          ></i>
         </div>
        </div>

        <!-- ========================= -->
        <!-- Name -->
        <!-- ========================= -->

        <div
         class="
          flex
          min-w-0
          flex-1
          flex-col
          justify-center
          border-b
          border-gray-100
          px-5
          py-4
          md:border-b-0
          md:border-l
         "
        >
         <h3
          class="
           text-[13px]
           font-black
           text-gray-800
           md:text-[14px]
          "
         >
          {{item.name}}
         </h3>

         <div
          v-if="item.airlines"
          class="
           mt-3
           flex
           items-center
           gap-2
           text-[10px]
           text-gray-500
          "
         >
          <i class="bi bi-airplane"></i>

          <span>
           {{item.airlines}}
          </span>
         </div>

         <div
          v-if="item.flightDays"
          class="
           mt-2
           flex
           items-center
           gap-2
           text-[10px]
           text-gray-500
          "
         >
          <i class="bi bi-calendar3"></i>

          <span>
           {{item.flightDays}}
          </span>
         </div>
        </div>

        <!-- ========================= -->
        <!-- Hotel -->
        <!-- ========================= -->

        <div
         class="
          flex
          min-w-[190px]
          items-center
          justify-center
          border-b
          border-gray-100
          px-5
          py-4
          text-center
          md:border-b-0
          md:border-l
         "
        >
         <div>
          <i
           class="
            bi bi-building
            mb-2
            block
            text-[16px]
            text-gray-500
           "
          ></i>

          <p
           class="
            text-[11px]
            font-bold
            text-gray-700
           "
          >
           {{item.hotel||'-'}}
          </p>
         </div>
        </div>

        <!-- ========================= -->
        <!-- Price -->
        <!-- ========================= -->

        <div
         class="
          flex
          min-w-[170px]
          flex-col
          items-center
          justify-center
          gap-2
          px-5
          py-4
         "
        >
         <div
          v-if="item.price"
          class="text-center"
         >
          <span
           class="
            block
            text-[9px]
            text-gray-400
           "
          >
           شروع قیمت
          </span>

          <strong
           class="
            mt-1
            block
            text-[12px]
            font-black
            text-gray-700
           "
          >
           {{formatPrice(item.price)}}
          </strong>
         </div>

         <button
          type="button"
          class="
           min-w-[110px]
           border
           border-blue-700
           bg-white
           px-3
           py-1.5
           text-[10px]
           font-bold
           text-blue-700
           transition
           hover:bg-blue-700
           hover:text-white
          "
          @click="openPackage(item)"
         >
          مشاهده جزئیات
         </button>
        </div>

       </div>
      </article>

     </div>
    </section>

    <!-- ======================================== -->
    <!-- No Packages -->
    <!-- ======================================== -->

    <section
     v-else-if="packagesLoaded"
     class="
      mb-8
      rounded-lg
      border
      border-gray-200
      bg-white
      px-5
      py-6
      text-center
     "
    >
     <p class="text-[11px] text-gray-400">
      در حال حاضر پکیج فعالی برای این مقصد وجود ندارد.
     </p>
    </section>

    <!-- ======================================== -->
    <!-- Other Notes -->
    <!-- ======================================== -->

    <section
     v-if="otherNotes.length"
     class="space-y-7"
    >
     <article
      v-for="item in otherNotes"
      :key="item.id"
      class="w-full"
     >
      <h2
       class="
        mb-2
        text-[16px]
        font-black
        text-gray-900
        md:text-[18px]
       "
      >
       {{item.title}}
      </h2>

      <div
       class="
        package-description
        text-[12px]
        leading-8
        text-gray-700
        md:text-[13px]
       "
       v-html="item.description"
      ></div>
     </article>
    </section>

    <!-- ======================================== -->
    <!-- Contact Box Desktop -->
    <!-- ======================================== -->

    <section
     class="
      mt-10
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
       md:text-[13px]
      "
     >
      جهت اخذ اطلاعات بیشتر با کارشناسان ما تماس حاصل فرمایید.

      <a
       href="tel:02141889"
       class="
        mr-1
        font-black
        text-blue-700
        hover:underline
       "
      >
       تلفن: 41889-021
      </a>
     </p>
    </section>

   </main>

   <!-- ======================================== -->
   <!-- Contact Box Mobile Fixed -->
   <!-- ======================================== -->

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
      max-w-[600px]
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
 useRoute,
 useRouter
}from'vue-router'

const route=useRoute()
const router=useRouter()

/* ========================= */
/* API */
/* ========================= */

const BASE_URL=
 'https://api.ahuan.ir/api'

const IMAGE_BASE_URL=
 'https://panel.ahuan.ir/uploads'

/* ========================= */
/* State */
/* ========================= */

const group=ref(null)

const packages=ref([])

const notes=ref([])

const loading=ref(false)

const packagesLoaded=ref(false)

const errorMessage=ref('')

/* ========================= */
/* Group Id */
/* ========================= */

const groupId=computed(()=>
 String(route.params.id||'')
)

/* ========================= */
/* Active Packages */
/* ========================= */

const activePackages=computed(()=>
 packages.value
  .filter(
   item=>item?.isActive===true
  )
  .sort(
   (a,b)=>
    Number(a?.orderId??9999)-
    Number(b?.orderId??9999)
  )
)

/* ========================= */
/* Notes */
/* ========================= */

const sortedNotes=computed(()=>
 [...notes.value]
  .sort(
   (a,b)=>
    Number(a?.orderId??9999)-
    Number(b?.orderId??9999)
  )
)

/* ========================= */
/* First Note */
/* ========================= */

const firstNote=computed(()=>
 sortedNotes.value[0]||null
)

/* ========================= */
/* Other Notes */
/* ========================= */

const otherNotes=computed(()=>
 sortedNotes.value.slice(1)
)

/* ========================= */
/* Array Response */
/* ========================= */

function getArrayResponse(response){
 if(Array.isArray(response))
  return response

 if(Array.isArray(response?.data))
  return response.data

 if(Array.isArray(response?.result))
  return response.result

 return[]
}

/* ========================= */
/* Load Data */
/* ========================= */

async function loadData(){
 if(!groupId.value)
  return

 try{
  loading.value=true
  packagesLoaded.value=false
  errorMessage.value=''

  group.value=null
  packages.value=[]
  notes.value=[]

  const[
   groupResponse,
   packagesResponse,
   notesResponse
  ]=await Promise.all([

   $fetch(
    `${BASE_URL}/package/group/${groupId.value}`
   ),

   $fetch(
    `${BASE_URL}/package/group-packages/${groupId.value}`
   ),

   $fetch(
    `${BASE_URL}/package/group/notes/${groupId.value}`
   )

  ])

  /* Group */

  group.value=
   groupResponse?.data||
   groupResponse?.result||
   groupResponse||
   null

  /* Packages */

  packages.value=
   getArrayResponse(
    packagesResponse
   )

  packagesLoaded.value=true

  /* Notes */

  notes.value=
   getArrayResponse(
    notesResponse
   )

 }
 catch(error){

  console.error(
   'Load Tour Page Error:',
   error
  )

  group.value=null
  packages.value=[]
  notes.value=[]

  packagesLoaded.value=true

  errorMessage.value=
   'دریافت اطلاعات تور با خطا مواجه شد.'

 }
 finally{

  loading.value=false

 }
}

/* ========================= */
/* Build Image */
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

/* ========================= */
/* Hero Image */
/* ========================= */

function getGroupImage(item){
 if(!item)
  return''

 const image=
  item.backImage||
  item.col1Image||
  item.backImageM||
  item.col1ImageM

 return buildImageUrl(image)
}

/* ========================= */
/* Package Image */
/* ========================= */

function getPackageImage(item){
 if(!item)
  return''

 const image=
  item.image||
  item.backImage||
  item.imageM||
  item.backImageM

 return buildImageUrl(image)
}

/* ========================= */
/* Price */
/* ========================= */

function formatPrice(price){
 if(
  price===null||
  price===undefined||
  price===''
 )
  return''

 const value=
  String(price).trim()

 if(
  value.includes('تومان')||
  value.includes(',')||
  value.includes('،')||
  value.includes('/')||
  value.includes('.')
 )
  return value

 if(/^\d+$/.test(value)){
  return(
   Number(value).toLocaleString('fa-IR')+
   ' تومان'
  )
 }

 return value
}

/* ========================= */
/* Open Package */
/* ========================= */

function openPackage(item){
 if(
  !groupId.value||
  !item?.id
 )
  return

 router.push(
  `/domesticinternationaltours/${groupId.value}/${item.id}`
 )
}

/* ========================= */
/* Watch */
/* ========================= */

watch(
 groupId,
 ()=>{
  loadData()
 },
 {
  immediate:true
 }
)
</script>

<style scoped>
.package-description{
 direction:rtl;
 text-align:justify;
}

.package-description :deep(p){
 margin:0 0 10px;
 line-height:2.15;
}

.package-description :deep(p:last-child){
 margin-bottom:0;
}

.package-description :deep(strong){
 font-weight:800;
 color:#1f2937;
}

.package-description :deep(span){
 line-height:2.15;
}

.package-description :deep(.ql-direction-rtl){
 direction:rtl;
}

.package-description :deep(.ql-align-justify){
 text-align:justify;
}

.package-description :deep(br){
 line-height:2;
}
</style>