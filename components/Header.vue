<template>
  <nav class="w-full h-[80px] border-2 flex   items-center"> 
    <div class="container border-2 mx-auto flex justify-between">
        <div>btn</div>
        <div class="hidden flex gap-8 md:flex"><a v-for="(item , index) in itemsMenu" :key="index">{{ item }}</a></div>
        <div>logo</div>
    </div>
  </nav>















   <!-- <i class="bi bi-list"></i>
   <button class="btn border-2">ورود یا عضویت</button>
   <div class="flex justify-between max-w-[800px] border-2">
   <p v-for="(item , index) in itemsMenu" :key="index">{{ item }}</p>
   </div>
   <p>webprog.io</p> -->
</template>

<script setup>
    const itemsMenu = reactive(['صفحه اصلی' , 'درباره ما' , 'خدمات' , 'ویژگی ها' , 'قوانین'])
</script>

<style>

</style>
