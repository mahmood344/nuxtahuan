<template>
 <section
  class="w-full overflow-hidden bg-white pb-8 mt-7"
  dir="rtl"
 >
  <!-- ===================================== -->
  <!-- Section 1 - Introduction -->
  <!-- ===================================== -->
  <div
   class="
    mx-auto
    grid
    w-full
    max-w-5xl
    grid-cols-1
    items-center
    gap-10
    px-5
    py-16
    md:grid-cols-2
    md:py-20
   "
  >
   <!-- Title -->
   <div class="text-right">

    <h1
     class="
      font-rokh
      text-[40px]
      font-black
      leading-[1.2]
      text-gray-700
      sm:text-[48px]
      md:text-[56px]
      lg:text-[62px]
     "
    >
     آژانس گردشگری آهوان
    </h1>

    <p
     class="
      mt-2
      font-rokh
      text-[17px]
      font-bold
      text-gray-300
      sm:text-[19px]
      md:text-[22px]
     "
    >
نیم قرن با افتخار در کنار شماست
    </p>

   </div>


   <!-- Description -->
   <div>
    <p
     class="
      text-justify
      text-[12px]
      leading-[2.2]
      text-gray-600
     "
    >
    
شرکت خدمات مسافرتی آهوان در سال 1348 با هدف ترویج فرهنگ گردشگری و ایجاد تسهیلات برای مسافران افتتاح گردید و طی 5 دهه حضور فعال در این عرصه همواره سعی بر افزایش کیفیت و بهبود خدمات خود داشته است.
خدمات متمایز شرکت خدمات مسافرتی آهوان هتل چهار ستاره تفریحی واقامتی آهوان چابکسر است که به موازات ساحل زیبای دریای خزر و امتداد جنگل های بی نظیر و ...

    </p>
   </div>

  </div>


  <!-- ===================================== -->
<!-- About Video -->
<!-- ===================================== -->
<div class="relative w-full px-5">

  <!-- Decorative diamonds -->
  <!-- <div
    class="
      absolute
      left-1/2
      top-0
      z-20
      flex
      -translate-x-1/2
      -translate-y-1/2
    "
  >
    <span
      v-for="n in 4"
      :key="n"
      class="
        h-[18px]
        w-[18px]
        rotate-45
        rounded-[3px]
      "
      :class="
        n % 2 === 0
          ? 'bg-[#20b6b6]'
          : 'bg-[#e4b778]'
      "
    ></span>
  </div> -->

  <div
    class="
      mx-auto
      w-full
      max-w-5xl
      overflow-hidden
      rounded-2xl
      bg-black
      shadow-lg
    "
  >
    <video
      class="
        block
        w-full
        aspect-video
        object-cover
      "
      controls
      preload="metadata"
      poster="/imgs/hotel/about-us.jpg"
    >
      <source
        src="https://ahuan.ir/video/ahuan-intro.mp4"
        type="video/mp4"
      />

      مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
    </video>
  </div>

</div>


  <!-- ===================================== -->
  <!-- Section 2 -->
  <!-- ===================================== -->
  <div
   class="
    mx-auto
    grid
    w-full
    max-w-5xl
    grid-cols-1
    items-start
    gap-10
    px-5
    pb-8
    pt-16
    md:grid-cols-2
    md:pt-20
   "
  >
   <!-- Title -->
   <div>

    <h2
     class="
      font-rokh
      text-[38px]
      font-black
      leading-[1.2]
      text-gray-700
      sm:text-[46px]
      md:text-[54px]
      lg:text-[60px]
     "
    >
     با اطمینان سفر کنید
    </h2>

    <p
     class="
      mt-2
      font-rokh
      text-[17px]
      font-bold
      text-gray-300
      sm:text-[19px]
      md:text-[22px]
     "
    >
ما کیفیت سفر شما را ضمانت می کنیم
    </p>

   </div>


   <!-- Description -->
   <div>
    <p
     class="
      text-justify
      text-[12px]
      leading-[2.2]
      text-gray-600
     "
    >
    ما در آژانس گردشگری آهوان می کوشیم تا با پایبندی به کیفیت و جامع بودن خدمات خود در خدمت شما باشیم. از لحظه انتخاب مقصد تا لحظه بازگشت، تیم ما با دقت و تعهد به تمام جزئیات سفر شما می‌پردازد. همچنین آژانس گردشگری آهوان به پشتوانه و همکاری بانک تجارت ضمانت کننده کیفیت خدمات گردشگری شما بوده و همواره بهینه ترین قیمت خدمات را به مشتریان خود ارائه می نماید.
    </p>
   </div>

  </div>


  <!-- ===================================== -->
  <!-- Typewriter -->
  <!-- ===================================== -->
  <div
   class="
    mx-auto
    flex
    min-h-[140px]
    w-full
    max-w-6xl
    items-center
    justify-center
    px-5
    py-10
   "
  >
   <h3
    class="
     typewriter-text
     font-rokh
     text-center
     text-[28px]
     font-black
     leading-[1.6]
     text-gray-700
     sm:text-[34px]
     md:text-[40px]
     lg:text-[44px]
    "
   >
    <span>{{typedText}}</span>

    <span
     class="
      mr-1
      inline-block
      h-[35px]
      w-[3px]
      translate-y-[7px]
      bg-[#304998]
      md:h-[42px]
     "
     :class="{
      'cursor-blink':showCursor
     }"
    ></span>
   </h3>
  </div>


  <!-- ===================================== -->
  <!-- Statistics -->
  <!-- ===================================== -->
  <div
   ref="statsSection"
   class="
    mx-auto
    grid
    w-full
    max-w-4xl
    grid-cols-1
    gap-10
    px-5
    py-10
    sm:grid-cols-3
   "
  >
   <div
    v-for="item in stats"
    :key="item.title"
    class="text-center"
   >
    <p
     class="
      mx-auto
      max-w-[220px]
      text-[10px]
      leading-[2]
      text-gray-500
     "
    >
     {{item.description}}
    </p>


    <div
     class="
      mt-4
      font-rokh
      text-[38px]
      font-black
      text-gray-700
     "
     dir="ltr"
    >
     +{{item.display}}
    </div>


    <p
     class="
      mt-1
      text-[10px]
      font-medium
      text-gray-400
     "
    >
     {{item.title}}
    </p>
   </div>
  </div>


  <!-- ===================================== -->
  <!-- Last Section -->
  <!-- ===================================== -->
  <div
   class="
    mx-auto
    grid
    w-full
    max-w-5xl
    grid-cols-1
    items-center
    gap-10
    px-5
    pb-20
    pt-14
    md:grid-cols-2
   "
  >
   <!-- Title -->
   <div>

    <h2
     class="
      font-rokh
      text-[38px]
      font-black
      leading-[1.2]
      text-gray-700
      sm:text-[46px]
      md:text-[54px]
      lg:text-[60px]
     "
    >
     آژانس گردشگری آهوان
    </h2>

    <p
     class="
      mt-2
      font-rokh
      text-[17px]
      font-bold
      text-gray-300
      sm:text-[19px]
      md:text-[22px]
     "
    >
     مشتاق به همکاری با حرفه‌ای‌ها
    </p>

   </div>


 <!-- Text -->
<div class="flex flex-col">
 <p
  class="
   text-justify
   text-[12px]
   leading-[2.2]
   text-gray-600
  "
 >
 
ما همواره در جستجوی بهترین ها برای تکمیل تیم خود هستیم . در صورتی که فکر میکنید می توانید یکی از اعضای تیم بزرگ آهوان باشید می توانید از طریق فرم زیر با ما در ارتباط باشید. برای ما اطلاعات خودتان و رزومه کاری خود را ارسال کنید تا بیشتر با شما آشنا بشویم.
 </p>

 <NuxtLink
  to="/opportunities"
  class="
   mt-6
   inline-flex
   min-w-[110px]
   self-end
   items-center
   justify-center
   rounded-full
   bg-[#304998]
   px-6
   py-2.5
   text-[11px]
   font-bold
   text-white
   transition
   duration-200
   hover:-translate-y-0.5
   hover:bg-[#263d85]
  "
 >
  همکاری با ما
 </NuxtLink>
</div>

  </div>


  <!-- ===================================== -->
  <!-- Bottom decoration -->
  <!-- ===================================== -->
  <!-- <div
   class="
    relative
    h-[5px]
    w-full
    bg-[#304998]
   "
  >
   <div
    class="
     absolute
     bottom-0
     left-1/2
     flex
     -translate-x-1/2
     translate-y-1/2
    "
   >
    <span
     v-for="n in 8"
     :key="n"
     class="
      h-[15px]
      w-[15px]
      rotate-45
      rounded-[2px]
     "
     :class="
      n%2===0
       ? 'bg-[#e4b778]'
       : 'bg-[#20b6b6]'
     "
    ></span>
   </div>
  </div> -->

 </section>
</template>


<script setup>
import {
 ref,
 onMounted,
 onBeforeUnmount
} from 'vue'


/* =========================================
   Typewriter
========================================= */

const fullText=
 '”با افتخار می‌گوییم که در آژانس گردشگری آهوان، ارتقاء کیفیت خدمات سفر، دغدغه اصلی ماست”'
const typedText=ref('')
const showCursor=ref(true)

let typeTimer=null
let restartTimer=null
let currentIndex=0


function startTyping(){

 clearTimeout(typeTimer)
 clearTimeout(restartTimer)

 typedText.value=''
 currentIndex=0

 typeNextCharacter()

}


function typeNextCharacter(){

 if(currentIndex<fullText.length){

  typedText.value+=fullText[currentIndex]

  currentIndex++

  const speed=
   45+
   Math.floor(
    Math.random()*55
   )

  typeTimer=setTimeout(
   typeNextCharacter,
   speed
  )

  return

 }


 restartTimer=setTimeout(()=>{

  startTyping()

 },4000)

}


/* =========================================
   Statistics
========================================= */

const stats=ref([
 {
  title:'سال تجربه',
  value:50,
  display:0,
  description:
   'برگزاری بیش از 50 تور گروهی در سال 1401 به نقاط مختلف جهان شامل اروپا، ژاپن، فرانسه، مالدیو و...'
 },
 {
  title:'مسافر همراه',
  value:1000,
  display:0,
  description:
   'با افتخار در سال گذشته میزبان بیش از 1000 مشتری گرانقدر در آژانس گردشگری آهوان بوده ایم که از خدمات مختلفی چون خرید بلیط، رزرو هتل و... استفاده نموده اند.'
 },
 {
  title:'مقصد گردشگری',
  value:200,
  display:0,
  description:
   'در سال گذشته موفق به اخذ بیش از 200 ویزای گردشگری مربوط به نقاط مختلف جهان شده ایم'
 }
])


const statsSection=ref(null)

let statsObserver=null
let statsStarted=false


function animateStats(){

 if(statsStarted){
  return
 }

 statsStarted=true

 const duration=1600
 const start=performance.now()


 function animate(time){

  const progress=
   Math.min(
    (time-start)/duration,
    1
   )


  const eased=
   1-Math.pow(
    1-progress,
    3
   )


  stats.value.forEach(item=>{

   item.display=
    Math.floor(
     item.value*eased
    )

  })


  if(progress<1){

   requestAnimationFrame(
    animate
   )

  }

 }


 requestAnimationFrame(
  animate
 )

}


onMounted(()=>{

 startTyping()


 statsObserver=
  new IntersectionObserver(
   entries=>{

    if(
     entries[0]?.isIntersecting
    ){

     animateStats()

     statsObserver?.disconnect()

    }

   },
   {
    threshold:.3
   }
  )


 if(statsSection.value){

  statsObserver.observe(
   statsSection.value
  )

 }

})


onBeforeUnmount(()=>{

 clearTimeout(typeTimer)
 clearTimeout(restartTimer)

 statsObserver?.disconnect()

})
</script>


<style scoped>
.cursor-blink{
 animation:
  cursorBlink .7s step-end infinite;
}


@keyframes cursorBlink{

 0%,
 50%{
  opacity:1;
 }

 51%,
 100%{
  opacity:0;
 }

}


.typewriter-text{
 min-height:60px;
}


@media (prefers-reduced-motion:reduce){

 .cursor-blink{
  animation:none;
 }

}
</style>