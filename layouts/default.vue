<template>
 <div
  class="
   flex
   min-h-screen
   flex-col
  "
 >
  <Header />

  <main class="flex-1">
   <slot />
  </main>

  <Footer />

  <AuthModal />
 </div>
</template>

<script setup>
// در Nuxt 3 کامپوننت‌ها به صورت خودکار Import می‌شوند، 
// اما اگر نشد، دستی Import کن:
// import AuthModal from '@/components/auth/AuthModal.vue'
</script>

<style>
/* استایل‌های کلی اگر نیاز داری */
</style>