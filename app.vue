<script setup>
const route = useRoute()

const isLinksRoute = computed(() =>
  route.path === '/links' ||
  route.path.startsWith('/links/')
)
</script>

<template>
  <NuxtLayout>
    <div
      class="mx-auto w-full xl:max-w-none 2xl:max-w-full"
      :class="isLinksRoute ? 'mt-0' : 'mt-0 md:mt-[100px]'"
    >
      <NuxtPage />
    </div>
  </NuxtLayout>

  <AppToast />
</template>