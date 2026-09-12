<template>

<aside
 class="rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden"
 dir="rtl"
>


<!-- بدون اتاق -->
<div
 v-if="!selectedRooms.length"
 class="py-10 text-center text-[13px] font-bold text-gray-400"
>
 هنوز اتاقی انتخاب نشده است
</div>



<template v-else>


<!-- تصویر هتل -->
<img
 v-if="galleryImages.length"
 :src="getHotelImageUrl(galleryImages[0]?.image)"
 class="w-full h-40 object-cover"
/>



<div class="p-5">


<h3
 class="text-[15px] font-black text-gray-900"
>
 هتل {{hotel?.name}}
</h3>



<div
 class="mt-2 flex justify-end gap-1 text-yellow-400"
>

<i
 v-for="star in Number(hotel?.star||0)"
 :key="star"
 class="bi bi-star-fill text-sm"
/>

</div>




<!-- تاریخ -->

<div class="grid grid-cols-2 gap-3 mt-5">


<div
 class="border border-gray-200 rounded-xl p-3 text-center"
>

<p class="text-[11px] text-gray-400">
 ورود
</p>

<p class="text-[12px] font-bold">
{{formatPersianDate(checkIn)}}
</p>

</div>



<div
 class="border border-gray-200 rounded-xl p-3 text-center"
>

<p class="text-[11px] text-gray-400">
 خروج
</p>

<p class="text-[12px] font-bold">
{{formatPersianDate(checkOut)}}
</p>

</div>


</div>





<!-- اتاق ها -->

<div class="mt-5 space-y-3">


<div
 v-for="room in selectedRooms"
 :key="room.key"
 class="border border-gray-100 rounded-xl p-3 flex justify-between"
>


<div>

<p class="text-[12px] font-bold">
{{room.roomName}}
</p>


<p class="text-[11px] text-gray-400">
{{room.count}} اتاق
</p>


</div>



<div class="text-left">


<p class="text-[12px] font-bold">

{{formatPrice(room.price)}}

ریال

</p>



<button
 class="text-red-500"
 @click="removeRoom(room)"
>

<i class="bi bi-trash"></i>

</button>


</div>



</div>



</div>






<div
 class="border-t  border-gray-100 border-dashed mt-5 pt-4 flex justify-between"
>


<span class="text-[12px] font-bold">
 مجموع
</span>


<span class="text-[15px] font-black">

{{formatPrice(totalPrice)}}

ریال

</span>


</div>



<button
 v-if="currentStep===1"
 type="button"
 class="mt-4 w-full rounded-xl border border-red-500 py-3 text-[12px] font-bold text-red-500"
 @click="changeRoom"
>
 <i class="bi bi-arrow-repeat ml-1"></i>
 تغییر اتاق‌های انتخابی
</button>
<button
v-if="currentStep===0"
 class="mt-5 w-full rounded-xl bg-red-500 py-3 text-white text-[12px] font-bold"
 @click="$emit('continue')"
>

تایید و ادامه

</button>


</div>


</template>



</aside>


</template>



<script setup>


import {computed} from 'vue'
import {useHotelStore} from '~/stores/hotels'
const flightStore = useFlightStore()

const currentStep = computed(()=>flightStore.currentStep)

const hotelStore=useHotelStore()



const props=defineProps({

 hotel:{
  type:Object,
  default:null
 },

 checkIn:{
  type:String,
  default:''
 },

 checkOut:{
  type:String,
  default:''
 },

 galleryImages:{
  type:Array,
  default:()=>[]
 }

})



defineEmits([
 'continue'
])



const selectedRooms=
 computed(()=>hotelStore.selectedRooms)



const totalPrice=computed(()=>{

 return selectedRooms.value.reduce(
  (sum,item)=>
   sum+Number(item.price||0),
  0
 )

})

function changeRoom(){

 flightStore.setCurrentStep(0)

 window.scrollTo({
  top:0,
  behavior:'smooth'
 })

}

function removeRoom(room){

 hotelStore.removeRoom(room.key)

}



function getHotelImageUrl(image){

 if(!image)
  return ''

 return `https://panel.ahuan.ir/uploads/${image}`

}



function formatPrice(value){

 return Number(value||0)
 .toLocaleString('fa-IR')

}



function formatPersianDate(date){

 if(!date)
  return '-'


 return new Intl.DateTimeFormat(
  'fa-IR',
  {
   year:'numeric',
   month:'long',
   day:'numeric'
  }
 )
 .format(
  new Date(date)
 )

}



</script>