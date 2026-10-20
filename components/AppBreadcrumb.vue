<template>
  <div
    v-if="breadcrumbs.length"
    class="
      w-full
      border-b
      border-gray-100
      bg-white
    "
    dir="rtl"
  >
    <div
      class="
        mx-auto
        flex
        max-w-7xl
        items-center
        justify-between
        gap-3
        px-4
        py-3
      "
    >
      <!-- Breadcrumb -->
      <nav
        class="
          flex
          min-w-0
          items-center
          gap-2
          overflow-hidden
          text-[11px]
        "
        aria-label="breadcrumb"
      >
        <NuxtLink
          to="/"
          class="
            shrink-0
            font-bold
            text-gray-400
            transition
            hover:text-[var(--color-primary)]
          "
        >
          خانه
        </NuxtLink>

        <template
          v-for="(item, index) in breadcrumbs"
          :key="item.path"
        >
          <i
            class="
              bi
              bi-chevron-left
              shrink-0
              text-[9px]
              text-gray-300
            "
          ></i>

          <NuxtLink
            v-if="index < breadcrumbs.length - 1"
            :to="item.path"
            class="
              shrink-0
              font-bold
              text-gray-500
              transition
              hover:text-[var(--color-primary)]
            "
          >
            {{ item.label }}
          </NuxtLink>

          <span
            v-else
            class="
              truncate
              font-black
              text-[var(--color-primary-dark)]
            "
          >
            {{ item.label }}
          </span>
        </template>
      </nav>

      <!-- Back -->
      <button
        type="button"
        class="
          flex
          h-9
          shrink-0
          items-center
          gap-2
          rounded-xl
          border
          border-gray-200
          bg-white
          px-3
          text-[10px]
          font-bold
          text-gray-500
          transition
          hover:border-[var(--color-primary)]
          hover:text-[var(--color-primary)]
        "
        @click="goBack"
      >
        <i class="bi bi-arrow-right"></i>

        <span class="hidden sm:inline">
          بازگشت
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  computed
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'


const route = useRoute()
const router = useRouter()


/*
|--------------------------------------------------------------------------
| نام فارسی Routeها
|--------------------------------------------------------------------------
*/

const routeLabels = {

  flights:
    'پروازها',

  hotels:
    'هتل‌ها',

  domesticinternationaltours:
    'تورها',

  profile:
    'حساب کاربری',

  verify:
    'نتیجه پرداخت',

  payment:
    'پرداخت',

  contact:
    'تماس با ما',

  about:
    'درباره ما'

}


/*
|--------------------------------------------------------------------------
| Breadcrumbs
|--------------------------------------------------------------------------
*/

const breadcrumbs = computed(() => {

  if (
    route.path === '/' ||
    route.path === '/home'
  ) {
    return []
  }


  const segments =
    route.path
      .split('/')
      .filter(Boolean)


  let currentPath = ''


  return segments.map(
    (segment, index) => {

      currentPath +=
        `/${segment}`


      /*
       * اگر Segment عدد باشد،
       * مثلاً /hotels/123
       */
      const isId =
        /^\d+$/.test(segment)


      let label = ''


      if (isId) {

        /*
         * فعلاً عنوان عمومی
         * بعداً می‌توانیم اسم واقعی هتل/تور
         * را از API یا Store نشان دهیم.
         */

        const parent =
          segments[index - 1]


        if (
          parent ===
          'hotels'
        ) {
          label =
            'جزئیات هتل'
        }
        else if (
          parent ===
          'domesticinternationaltours'
        ) {
          label =
            'جزئیات تور'
        }
        else {
          label =
            'جزئیات'
        }

      }
      else {

        label =
          routeLabels[segment] ||
          segment

      }


      return {

        label,

        path:
          currentPath

      }

    }
  )

})


function goBack() {

  /*
   * اگر History داشته باشیم
   */
  if (
    typeof window !==
      'undefined' &&
    window.history.length > 1
  ) {

    router.back()

    return

  }


  /*
   * Fallback
   */
  router.push('/')

}
</script>