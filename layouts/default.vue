<template>
  <div class="layout-wrapper">
    <!-- هدر سایت -->
    <Header />

    <!-- محتوای صفحات -->
    <main> <!-- به اندازه ارتفاع هدر پدینگ بده که محتوا زیرش نره -->
      <slot />
    </main>

    <!-- فوتر سایت -->
    <Footer />

    <!-- مودال احراز هویت که در کل سایت در دسترس است -->
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