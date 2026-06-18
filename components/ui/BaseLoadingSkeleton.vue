<template>
  <div class="p-6 bg-white rounded-3xl border shadow-sm w-full max-w-sm mx-auto animate-pulse">
    <!-- بخش اول: آیتم‌های بالا (گرید) -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div v-for="i in 5" :key="i" class="h-10 bg-gray-200 rounded-lg"></div>
    </div>
    
    <hr class="mb-6">

    <!-- بخش دوم: دایره‌ها و فرم -->
    <div class="flex justify-center gap-6 mb-6">
      <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
    </div>
    
    <div class="h-12 bg-gray-200 rounded-lg mb-4"></div>
    <div class="flex justify-end mb-8">
      <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
    </div>

    <!-- بخش سوم: آیتم‌های اصلی -->
    <div class="space-y-4">
      <div class="h-16 bg-gray-200 rounded-lg relative">
        <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 bg-gray-300 rounded-full"></div>
      </div>
      <div class="h-16 bg-gray-200 rounded-lg"></div>
      <div class="h-16 bg-gray-200 rounded-lg"></div>
      <div class="h-16 bg-gray-200 rounded-lg"></div>
      <div class="h-20 w-1/3 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
</template>
