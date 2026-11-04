
<script setup>
const route = useRoute()

const items = [
  {
    title: 'منوی رستوران',
    icon: '/icons/menu/main.png',
    to: '/links/menu/restaurant'
  },
  {
    title: 'خانه',
    icon: 'bi-house',
    to: '/links'
  },
  {
    title: 'منوی کافی شاپ',
    icon: '/icons/menu/coffee.png',
    to: '/links/menu/coffeeshop'
  }
]

const isActive = item => {
  const path = route.path.toLowerCase()
  const target = item.to.toLowerCase()

  if (target === '/links') {
    return path === target
  }

  return path === target || path.startsWith(`${target}/`)
}

const isImageIcon = icon => /\.(png|jpg|jpeg|webp|svg)$/i.test(icon)

const iconMask = icon => ({
  WebkitMask: `url("${icon}") center / contain no-repeat`,
  mask: `url("${icon}") center / contain no-repeat`
})
</script>

<template>
  <div class="fixed inset-x-0 bottom-0 z-50 pb-[env(safe-area-inset-bottom)]">
    <nav
      dir="ltr"
      class="mx-auto flex h-[70px] w-full max-w-[480px] items-center justify-around rounded-t-[24px] border border-gray-200 bg-white px-3 shadow-lg"
      aria-label="منوی پایین"
    >
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="relative flex min-w-0 flex-col items-center gap-1 px-1 transition-colors duration-200"
        :class="isActive(item) ? 'text-primary' : 'text-gray-500 hover:text-primary'"
      >
        <!-- آیکن PNG با رنگ متغیر -->
        <span
          v-if="isImageIcon(item.icon)"
          aria-hidden="true"
          class="block size-6 shrink-0 bg-current"
          :style="iconMask(item.icon)"
        ></span>

        <!-- آیکن Bootstrap -->
        <i
          v-else
          :class="['bi', item.icon]"
          class="text-2xl leading-none"
          aria-hidden="true"
        ></i>

        <span class="text-[10px] font-medium">
          {{ item.title }}
        </span>

        <!-- خط بالای گزینه فعال -->
        <!-- <span
          v-if="isActive(item)"
          class="absolute bottom-[61px] h-[3px] w-5 rounded-full bg-primary"
        ></span> -->
      </NuxtLink>
    </nav>
  </div>
</template>
