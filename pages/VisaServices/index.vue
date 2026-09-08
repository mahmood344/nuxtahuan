<template>
  <section
    class="w-full bg-white"
    dir="rtl"
  >
    <div
      class="
        mx-auto
        w-full
        max-w-[1180px]
        px-5
        py-16
        md:px-6
        md:py-24
      "
    >
      <!-- ================================= -->
      <!-- TOP SECTION -->
      <!-- ================================= -->
      <!-- TOP SECTION -->
<div
  class="
    mx-auto
    grid
    w-full
    max-w-[1180px]
    grid-cols-1
    items-start
    gap-10
    md:grid-cols-2
    md:gap-20
  "
>
  <!-- TITLE -->
  <div>
    <h1
      class="
        rokh
        text-[38px]
        font-black
        leading-[1.25]
        text-[#555]
        md:text-[52px]
      "
    >
      وقت سفارت و اخذ ویزا
    </h1>

    <p
      class="
        rokh
        mt-2
        text-[24px]
        font-black
        text-[#c8ccd0]
        md:text-[30px]
      "
    >
      در آژانس گردشگری آهوان
    </p>
  </div>

  <!-- DESCRIPTION -->
  <div class="w-full">
    <p
      class="
        max-w-[500px]
        text-justify
        text-[13px]
        leading-[2.25]
        text-gray-600
        md:text-[14px]
      "
    >
      برای سفر به کلیه کشورهایی که نیاز به ویزا دارند
      می‌بایست مراحلی را پشت سر بگذاریم تا با ارائه
      یکسری مدارک مورد نیاز برای آن کشور مقصد، درخواست
      خود را ارسال نماییم و سفارت بعد از بررسی مدارک شما
      در صورت تکمیل مدارک و حائز شرایط کشور مقصد بودن،
      برای شما ویزا صادر می‌کند. در این صفحه وبسایت، ما
      شما را با مراحل دریافت وقت از سفارت به‌صورت کامل
      آشنا می‌کنیم.
    </p>

    <div
      class="
        mt-7
        flex
        w-full
        justify-end
      "
    >
      <button
        type="button"
        class="
          min-w-[115px]
          rounded-full
          bg-[#14179e]
          px-6
          py-2.5
          text-[11px]
          font-bold
          text-white
          shadow-md
        "
        @click="scrollToVisa"
      >
        شروع فرآیند
      </button>
    </div>
  </div>
</div>


      <!-- ================================= -->
      <!-- TABS SECTION -->
      <!-- ================================= -->
      <div
        ref="visaSection"
        class="mt-28"
      >
        <!-- Tabs -->
        <div
          class="
            grid
            grid-cols-2
            gap-2
            md:grid-cols-4
            md:gap-3
          "
        >
          <button
            v-for="item in visaTypes"
            :key="item.id"
            type="button"
            class="
              flex
              min-h-[58px]
              items-center
              justify-center
              gap-2
              rounded-t-[18px]
              border
              border-gray-200
              px-3
              text-[11px]
              font-bold
              transition
              md:text-[12px]
            "
            :class="
  activeVisa === item.id
    ? 'bg-white border-gray-200 text-gray-800'
    : 'bg-[#e9eef2] border-gray-200 text-gray-700'
"
"
            @click="activeVisa = item.id"
          >
            <img
  :src="item.flag"
  :alt="item.title"
  class="
    h-[28px]
    w-[40px]
    shrink-0
    object-cover
    shadow-sm
  "
>

            <span>
              {{ item.title }}
            </span>
          </button>
        </div>


        <!-- Content -->
        <div
          class="
            relative
            min-h-[220px]
            rounded-b-[24px]
            bg-white
            px-6
            pb-20
            pt-8
            shadow-[0_8px_20px_rgba(0,0,0,0.13)]
            md:px-10
          "
        >
          <Transition
            name="visa-fade"
            mode="out-in"
          >
            <div
              :key="currentVisa.id"
            >
              <p
                class="
                  text-justify
                  text-[12px]
                  leading-[2.25]
                  text-gray-600
                  md:text-[13px]
                "
              >
                {{ currentVisa.description }}
              </p>

              <button
                type="button"
                class="
                  absolute
                  bottom-6
                  left-6
                  min-w-[120px]
                  rounded-full
                  bg-[#14179e]
                  px-6
                  py-2.5
                  text-[11px]
                  font-bold
                  text-white
                  shadow-md
                  transition
                  hover:bg-[#0e1185]
                "
                @click="selectVisa(currentVisa)"
              >
                {{ currentVisa.buttonText }}
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
import {
  ref,
  computed
} from 'vue'

import {
  useRouter
} from 'vue-router'

const router = useRouter()




const visaSection = ref(null)

const activeVisa = ref('usa')


const visaTypes = [
  {
    id: 'usa',
serviceId: 1,
    flag: '/imgs/hotel/us.png',

    title:
      'وقت سفارت و اخذ ویزای آمریکا',

    buttonText:
      'اخذ ویزای آمریکا',

    description:
      'خدمات اخذ ویزای آمریکا از مهمترین خدمات آژانس گردشگری آهوان است. ما با تیم متخصص و با تجربه در این زمینه، به متقاضیان ویزای آمریکا خدماتی سریع و کارآمد ارائه می‌دهیم. از توصیه‌های لازم برای تکمیل درخواست ویزا گرفته تا هماهنگی‌های لازم با سفارت یا کنسولگری آمریکا، تمام مراحل مرتبط با اخذ ویزای آمریکا را برای شما تسهیل می‌کنیم.'
  },

  {
    id: 'uk',
serviceId: 2,
    flag: '/imgs/hotel/uk.png',

    title:
      'وقت سفارت و اخذ ویزای انگلیس',

    buttonText:
      'اخذ ویزای انگلیس',

    description:
      'خدمات وقت سفارت و اخذ ویزای انگلیس توسط کارشناسان آهوان انجام می‌شود. در مراحل آماده‌سازی مدارک، ثبت درخواست، دریافت وقت سفارت و پیگیری مراحل مربوط به ویزا همراه شما خواهیم بود.'
  },

  {
    id: 'canada',
serviceId: 3,
    flag: '/imgs/hotel/ca.png',

    title:
      'وقت سفارت و اخذ ویزای کانادا',

    buttonText:
      'اخذ ویزای کانادا',

    description:
      'برای دریافت ویزای کانادا، آماده‌سازی صحیح مدارک و طی مراحل ثبت درخواست اهمیت زیادی دارد. کارشناسان آهوان شما را در تکمیل مدارک، ثبت درخواست و پیگیری مراحل اخذ ویزای کانادا همراهی می‌کنند.'
  },

  {
    id: 'europe',
serviceId: 4,
    flag: '/imgs/hotel/eu.png',

    title:
      'وقت سفارت و اخذ ویزای اروپا',

    buttonText:
      'اخذ ویزای اروپا',

    description:
      'برای سفر به کشورهای اروپایی، دریافت وقت سفارت و ویزا از مراحل اصلی سفر است. مجموعه آهوان در آماده‌سازی مدارک و انجام مراحل مربوط به دریافت وقت سفارت و ویزا همراه شما خواهد بود.'
  }
]


const currentVisa = computed(() => {

  return (
    visaTypes.find(
      item =>
        item.id === activeVisa.value
    )
    ||
    visaTypes[0]
  )

})


function scrollToVisa() {

  visaSection.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })

}


function selectVisa(item) {

  router.push(
    `/visaservices/${item.serviceId}`
  )

}
</script>


<style scoped>
.visa-fade-enter-active,
.visa-fade-leave-active {
  transition:
    opacity .18s ease;
}

.visa-fade-enter-from,
.visa-fade-leave-to {
  opacity: 0;
}
</style>