<script setup>
import MenuBottomNav from '~/components/Menu/MenuBottomNav.vue'
const route = useRoute()
const isRestaurant = computed(() => route.path.startsWith('/links/menu/restaurant'))
const isCoffeeShop = computed(() => route.path.startsWith('/links/menu/coffeeshop'))
const isMenuPage = computed(() => isRestaurant.value || isCoffeeShop.value)
const isMehmansaraPage = computed(() => route.path === '/mehmansara' || route.path.startsWith('/mehmansara/'))
const headerTitle = computed(() => isMehmansaraPage.value ? 'مهمانسراهای بانک تجارت' : isRestaurant.value ? 'منوی رستوران' : 'منوی کافی شاپ')
const headerHome = computed(() => isMehmansaraPage.value ? '/mehmansara' : isRestaurant.value ? '/links/menu/restaurant' : '/links/menu/coffeeshop')
</script>
<template>
  <div dir="rtl" class="min-h-dvh min-w-0" :class="isMehmansaraPage ? 'bg-[#F8F8FA]' : 'bg-[#edf0f3]'">
    <header v-if="!isMenuPage" class="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div class="mx-auto grid h-[60px] w-full grid-cols-[52px_minmax(0,1fr)_52px] items-center gap-2 px-3 sm:h-[76px] sm:grid-cols-[100px_minmax(0,1fr)_100px] sm:px-6 lg:px-12">
        <NuxtLink to="/" class="flex min-w-0 items-center justify-start" aria-label="صفحه اصلی آهوان">
          <img src="/imgs/hotel/menu/logo.png" alt="آهوان" class="max-h-9 max-w-full object-contain sm:max-h-12" />
        </NuxtLink>
        <NuxtLink :to="headerHome" class="min-w-0 text-center text-[12px] font-extrabold leading-5 text-primary sm:text-lg lg:text-xl">{{ headerTitle }}</NuxtLink>
        <div class="flex min-w-0 items-center justify-end">
          <img v-if="isMehmansaraPage" src="/icons/mehmansara/bank-logo.png" alt="بانک تجارت" class="max-h-9 max-w-full object-contain sm:max-h-12" />
        </div>
      </div>
    </header>
    <main class="min-w-0" :class="isMenuPage ? 'pb-[calc(90px+env(safe-area-inset-bottom))]' : ''"><slot /></main>
    <MenuBottomNav v-if="isMenuPage" />
  </div>
</template>
