
<script setup>
import MenuBottomNav from '~/components/Menu/MenuBottomNav.vue'

const route = useRoute()

const isProductPage = computed(() =>
  route.path.startsWith('/links/menu/restaurant') ||
  /^\/links\/menu\/coffeeshop\/[^/]+\/?$/.test(route.path)
)

const isRestaurant = computed(() =>
  route.path.startsWith('/links/menu/restaurant')
)

const menuHome = computed(() =>
  isRestaurant.value
    ? '/links/menu/restaurant'
    : '/links/menu/coffeeshop'
)
</script>

<template>
  <div dir="rtl" class="min-h-dvh bg-gray-100">
    <header
      v-if="!isProductPage"
      class="sticky top-0 z-40 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white px-4"
    >
      <NuxtLink to="/links">
        <img
          src="/imgs/hotel/menu/logo.png"
          alt="آهوان"
          class="h-12 w-auto object-contain"
        />
      </NuxtLink>

      <NuxtLink :to="menuHome" class="font-bold text-primary">
        {{ isRestaurant ? 'منوی رستوران' : 'منوی کافی شاپ' }}
      </NuxtLink>

      <span class="w-10"></span>
    </header>

    <main class="pb-[calc(90px+env(safe-area-inset-bottom))]">
      <slot />
    </main>

    <MenuBottomNav />
  </div>
</template>
