<!-- error.vue -->

<template>
  <div
    class="
      relative
      flex
      min-h-screen
      items-center
      justify-center
      overflow-hidden
      bg-[#f7f8fc]
      px-4
      py-10
    "
    dir="rtl"
  >

    <!-- ============================= -->
    <!-- Background -->
    <!-- ============================= -->

    <div
      class="
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
      "
    >
      <div
        class="
          absolute
          -right-24
          -top-24
          h-[360px]
          w-[360px]
          rounded-full
          bg-[#304998]/10
          blur-3xl
        "
      ></div>

      <div
        class="
          absolute
          -bottom-32
          -left-20
          h-[420px]
          w-[420px]
          rounded-full
          bg-[#e5b981]/20
          blur-3xl
        "
      ></div>
    </div>


    <!-- ============================= -->
    <!-- Content -->
    <!-- ============================= -->

    <div
      class="
        relative
        z-10
        mx-auto
        flex
        w-full
        max-w-4xl
        flex-col
        items-center
        text-center
      "
    >

      <!-- ============================= -->
      <!-- Logo -->
      <!-- ============================= -->

      <button
        type="button"
        class="
          mb-4
          flex
          items-center
          justify-center
          border-0
          bg-transparent
        "
        aria-label="بازگشت به صفحه اصلی"
        @click="goHome"
      >
        <img
          src="/imgs/header/logo.png"
          alt="آهوان"
          class="
            error-logo
            h-[180px]
            w-auto
            object-contain
            sm:h-[220px]
            md:h-[260px]
          "
        >
      </button>


      <!-- ============================= -->
      <!-- Decorative Line -->
      <!-- ============================= -->

      <div
        class="
          mb-5
          flex
          items-center
          justify-center
          gap-3
        "
      >
        <span
          class="
            h-px
            w-12
            bg-[#e5b981]
          "
        ></span>

        <span
          class="
            h-2
            w-2
            rounded-full
            bg-[#e5b981]
          "
        ></span>

        <span
          class="
            h-px
            w-12
            bg-[#e5b981]
          "
        ></span>
      </div>


      <!-- ============================= -->
      <!-- Title -->
      <!-- ============================= -->

      <h1
        class="
          text-[23px]
          font-black
          text-gray-800
          sm:text-[27px]
          md:text-[31px]
        "
      >
        {{ title }}
      </h1>


      <!-- ============================= -->
      <!-- Description -->
      <!-- ============================= -->

      <p
        class="
          mt-4
          max-w-[580px]
          text-[13px]
          leading-[2.2]
          text-gray-500
          sm:text-[14px]
        "
      >
        {{ description }}
      </p>


      <!-- ============================= -->
      <!-- Buttons -->
      <!-- ============================= -->

      <div
        class="
          mt-8
          flex
          w-full
          max-w-[420px]
          flex-col
          items-center
          justify-center
          gap-3
          sm:flex-row
        "
      >

        <!-- 404 / سایر خطاها -->

        <button
          v-if="!isServerError"
          type="button"
          class="
            flex
            w-full
            min-w-[175px]
            items-center
            justify-center
            gap-2
            rounded-full
            bg-[#304998]
            px-7
            py-3.5
            text-[13px]
            font-bold
            text-white
            shadow-lg
            shadow-[#304998]/20
            transition
            duration-200
            hover:-translate-y-0.5
            hover:bg-[#253b82]
            active:scale-95
            sm:w-auto
          "
          @click="goHome"
        >
          <i class="bi bi-house-door"></i>

          <span>
            بازگشت به صفحه اصلی
          </span>
        </button>


        <!-- Server Error -->

        <button
          v-else
          type="button"
          class="
            flex
            w-full
            min-w-[175px]
            items-center
            justify-center
            gap-2
            rounded-full
            bg-[#304998]
            px-7
            py-3.5
            text-[13px]
            font-bold
            text-white
            shadow-lg
            shadow-[#304998]/20
            transition
            duration-200
            hover:-translate-y-0.5
            hover:bg-[#253b82]
            active:scale-95
            sm:w-auto
          "
          @click="retryPage"
        >
          <i class="bi bi-arrow-clockwise"></i>

          <span>
            تلاش مجدد
          </span>
        </button>


        <!-- Back -->

        <button
          type="button"
          class="
            flex
            w-full
            min-w-[175px]
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-[#304998]/20
            bg-white
            px-7
            py-3.5
            text-[13px]
            font-bold
            text-[#304998]
            transition
            duration-200
            hover:border-[#304998]
            hover:bg-[#304998]/5
            active:scale-95
            sm:w-auto
          "
          @click="goBack"
        >
          <i class="bi bi-arrow-right"></i>

          <span>
            بازگشت به صفحه قبل
          </span>
        </button>

      </div>


      <!-- ============================= -->
      <!-- Bottom Decoration -->
      <!-- ============================= -->

      <div
        class="
          mt-10
          flex
          items-center
          gap-3
          text-[#304998]/30
        "
      >
        <span
          class="
            h-px
            w-16
            bg-[#304998]/20
          "
        ></span>

        <span
          class="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-sm
          "
        >
          <i
            class="
              bi
              bi-airplane
              rotate-[-25deg]
              text-[14px]
            "
          ></i>
        </span>

        <span
          class="
            h-px
            w-16
            bg-[#304998]/20
          "
        ></span>
      </div>

    </div>

  </div>
</template>


<script setup>

import {
  computed
} from 'vue'


const props = defineProps({

  error: {
    type: Object,
    required: true
  }

})


/*
|--------------------------------------------------------------------------
| Status Code
|--------------------------------------------------------------------------
|
| فقط برای تشخیص نوع خطا استفاده می‌شود.
| در UI نمایش داده نمی‌شود.
|
*/

const statusCode = computed(() => {

  return Number(
    props.error?.statusCode ||
    props.error?.status ||
    500
  )

})


/*
|--------------------------------------------------------------------------
| Error Types
|--------------------------------------------------------------------------
*/

const isNotFound = computed(() => {

  return statusCode.value === 404

})


const isServerError = computed(() => {

  return statusCode.value >= 500

})


/*
|--------------------------------------------------------------------------
| Title
|--------------------------------------------------------------------------
*/

const title = computed(() => {

  if (isNotFound.value) {

    return 'صفحه موردنظر پیدا نشد'

  }


  if (isServerError.value) {

    return 'مشکلی پیش آمده است'

  }


  return 'امکان نمایش این صفحه وجود ندارد'

})


/*
|--------------------------------------------------------------------------
| Description
|--------------------------------------------------------------------------
*/

const description = computed(() => {

  if (isNotFound.value) {

    return 'ممکن است آدرس صفحه تغییر کرده باشد، صفحه حذف شده باشد یا آدرس را اشتباه وارد کرده باشید.'

  }


  if (isServerError.value) {

    return 'در حال حاضر مشکلی در بارگذاری این صفحه به وجود آمده است. لطفاً چند لحظه دیگر دوباره تلاش کنید.'

  }


  return 'در پردازش درخواست شما مشکلی به وجود آمده است. لطفاً دوباره تلاش کنید.'

})


/*
|--------------------------------------------------------------------------
| Go Home
|--------------------------------------------------------------------------
*/

function goHome() {

  clearError({
    redirect: '/'
  })

}


/*
|--------------------------------------------------------------------------
| Go Back
|--------------------------------------------------------------------------
*/

function goBack() {

  if (!import.meta.client) {
    return
  }


  if (window.history.length > 1) {

    window.history.back()

    return
  }


  clearError({
    redirect: '/'
  })

}


/*
|--------------------------------------------------------------------------
| Retry
|--------------------------------------------------------------------------
*/

function retryPage() {

  if (!import.meta.client) {
    return
  }


  window.location.reload()

}

</script>


<style scoped>

/*
|--------------------------------------------------------------------------
| Logo
|--------------------------------------------------------------------------
*/

.error-logo {

  animation:
    logoAlive
      2.6s
      cubic-bezier(.45,.05,.55,.95)
      infinite,

    logoGlow
      2.6s
      ease-in-out
      infinite;

  transform-origin: 50% 80%;

  cursor: pointer;

  will-change:
    transform,
    filter;

  transition:
    transform .25s ease,
    filter .25s ease;

}


/*
|--------------------------------------------------------------------------
| Logo Movement
|--------------------------------------------------------------------------
*/

@keyframes logoAlive {

  0% {

    transform:
      translateY(0)
      rotate(0deg)
      scale(1);

  }


  12% {

    transform:
      translateY(-4px)
      rotate(-2deg)
      scale(1.02);

  }


  25% {

    transform:
      translateY(-10px)
      rotate(2deg)
      scale(1.04);

  }


  38% {

    transform:
      translateY(-6px)
      rotate(-1deg)
      scale(1.02);

  }


  50% {

    transform:
      translateY(-12px)
      rotate(0deg)
      scale(1.05);

  }


  62% {

    transform:
      translateY(-6px)
      rotate(2deg)
      scale(1.02);

  }


  75% {

    transform:
      translateY(-9px)
      rotate(-2deg)
      scale(1.03);

  }


  88% {

    transform:
      translateY(-4px)
      rotate(1deg)
      scale(1.01);

  }


  100% {

    transform:
      translateY(0)
      rotate(0deg)
      scale(1);

  }

}


/*
|--------------------------------------------------------------------------
| Glow
|--------------------------------------------------------------------------
*/

@keyframes logoGlow {

  0%,
  100% {

    filter:
      drop-shadow(
        0 4px 4px
        rgba(48, 73, 152, .10)
      );

  }


  50% {

    filter:
      drop-shadow(
        0 12px 10px
        rgba(48, 73, 152, .20)
      );

  }

}


/*
|--------------------------------------------------------------------------
| Reduced Motion
|--------------------------------------------------------------------------
*/

@media (
  prefers-reduced-motion:
  reduce
) {

  .error-logo {

    animation: none;

  }

}

</style>