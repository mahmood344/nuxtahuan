<script setup>
import { ref, onMounted } from "vue"

const menu = ref([])
const showTourMenu = ref(false)
const hoveredCat = ref(null)
const hoveredGrp = ref(null)
let closeTimer = null
const isMobileMenuOpen = ref(false)

const expanded = ref({
  tour:false,
  categories:{},
  groups:{}
})

async function fetchMenu(){
  try{
    const res = await fetch("https://api.ahuan.ir/api/package/menu")
    const data = await res.json()
    menu.value = Array.isArray(data) ? data : []
  }catch(e){ console.error(e) }
}

onMounted(fetchMenu)

function toggle(type,id){
  if(type==="tour") expanded.value.tour=!expanded.value.tour
  if(type==="category") expanded.value.categories[id]=!expanded.value.categories[id]
  if(type==="group") expanded.value.groups[id]=!expanded.value.groups[id]
}

function openMenu(){ clearTimeout(closeTimer); showTourMenu.value=true }
function closeMenu(){
  closeTimer=setTimeout(()=>{
    showTourMenu.value=false; hoveredCat.value=null; hoveredGrp.value=null
  },200)
}
</script>

<template>
<header class="w-full bg-white shadow-sm z-50 rtl fixed top-0 right-0 left-0" dir="rtl">  <!-- DESKTOP -->
  <div class="hidden min-[943px]:flex items-center justify-between px-8 h-[64px]">
    <div class="flex items-center gap-6">
      <img src="/imgs/header/logo.png" class="h-12">
      <span class="font-rokh text-2xl text-[var(--color-primary)] font-bold">
    آهوان
  </span>
      <nav class="flex items-center gap-5 text-[13px] font-medium text-gray-800">
        <a href="#" class="text-[12px] hover:text-[var(--color-primary-dark)]">بلیط</a>
        <div class="relative h-20 flex items-center cursor-pointer" @mouseenter="openMenu" @mouseleave="closeMenu">
          <span class="text-[12px] font-semibold hover:text-[var(--color-primary-dark)]">تور</span>
          <div v-if="showTourMenu" class="absolute top-[80px] right-0 pt-2 flex gap-1 z-[9999]">
            <div class="w-[180px] bg-white border border-gray-100 rounded-[12px] shadow-lg p-2">
              <div v-for="(cat,i) in menu" :key="cat.category" @mouseenter="hoveredCat=i; hoveredGrp=null"
                   class="px-4 py-2.5 rounded-[8px] text-sm flex justify-between items-center hover:bg-gray-50"
                   :class="hoveredCat===i ? 'bg-gray-50 text-[var(--color-primary)] font-bold':''">
                <span>{{cat.category}}</span>
                <span v-if="cat.groups?.length" class="text-[10px] text-[var(--color-primary)]">●</span>
              </div>
            </div>
            <div v-if="hoveredCat!==null" class="w-[180px] bg-white border border-gray-100 rounded-[12px] shadow-lg p-2">
              <div v-for="(grp,g) in menu[hoveredCat].groups" :key="grp.id" @mouseenter="hoveredGrp=g"
                   class="px-4 py-2.5 rounded-[8px] text-sm flex justify-between items-center hover:bg-gray-50"
                   :class="hoveredGrp===g ? 'bg-gray-50 text-[var(--color-primary)] font-bold':''">
                <span>{{grp.group}}</span>
                <span v-if="grp.packages?.length" class="text-[10px] text-[var(--color-primary)]">●</span>
              </div>
            </div>
            <div v-if="hoveredGrp!==null && menu[hoveredCat].groups[hoveredGrp]?.packages?.length" 
                 class="w-[200px] bg-white border border-gray-100 rounded-[12px] shadow-lg p-2">
              <a v-for="pkg in menu[hoveredCat].groups[hoveredGrp].packages" :key="pkg.id" :href="`/package/${pkg.id}`"
                 class="block px-4 py-2 rounded-[8px] text-sm hover:bg-gray-50 text-gray-700">{{pkg.package}}</a>
            </div>
          </div>
        </div>
        <a href="#" class="text-[12px] hover:text-[var(--color-primary-dark)]">هتل آهوان</a>
        <a href="#" class="text-[12px] hover:text-[var(--color-primary-dark)]">درباره ما</a>
        <a href="#" class="text-[12px] hover:text-[var(--color-primary-dark)]">مجله گردشگری آهوان</a>
        <a href="#" class="text-[12px] hover:text-[var(--color-primary-dark)]">پشتیبانی آنلاین</a>
      </nav>
    </div>
<div class="flex items-center gap-3">
  <a
    href="tel:02112345678"
    class="text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
  >
    021-41889
  </a>

  <!-- <a
    href="#"
    class="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-5 py-2 rounded-full text-xs font-bold"
  >
    ورود - ثبت‌نام
  </a> -->
  <UiBaseButton
  class="!rounded-4xl text-[12px]"
  label="ورود - ثبت‌نام
"
  variant="filled"
  color="primary"
  :active="false"
/>
</div>  </div>

  <!-- MOBILE -->
  <div class="min-[943px]:hidden">
    <!-- Header Row -->
    <div class="h-16 flex items-center justify-between px-4">
      <!-- آیکون پروفایل -->
      <button class="text-2xl" @click="isMobileMenuOpen=!isMobileMenuOpen">☰</button>
      <!-- لوگو -->
      <img src="/imgs/header/logo.png" class="h-8">
      <!-- منو همبرگری -->
      <a href="/login" class="text-2xl text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </a>
    </div>

    <div v-if="isMobileMenuOpen" class="p-4 space-y-3 bg-white">
      <a href="#" class="block border-2 border-[var(--color-primary)] rounded-xl p-3 text-sm font-bold text-[var(--color-primary)]">بلیط</a>
      <div class="border-2 border-[var(--color-primary)] rounded-xl overflow-hidden">
        <button class="w-full flex justify-between items-center p-3 text-sm font-bold text-[var(--color-primary)]" @click="toggle('tour')">
          تور <span>{{expanded.tour ? '−' : '+'}}</span>
        </button>
        <transition name="accordion">
          <div v-if="expanded.tour" class="bg-gray-100 p-2 space-y-2">
            <div v-for="cat in menu" :key="cat.category">
              <button class="w-full flex justify-between items-center p-3 text-xs font-bold bg-gray-200 rounded-lg" @click="toggle('category',cat.category)">
                <span>{{cat.category}}</span>
                <span v-if="cat.groups?.length">{{expanded.categories[cat.category] ? '−' : '+'}}</span>
              </button>
              <transition name="accordion">
                <div v-if="expanded.categories[cat.category]" class="mt-1 space-y-1">
                  <div v-for="grp in cat.groups" :key="grp.id">
                    <button class="w-full flex justify-between items-center p-2 text-[11px] bg-gray-300 rounded-lg" @click="toggle('group',grp.id)">
                      <span>{{grp.group}}</span>
                      <span v-if="grp.packages?.length">{{expanded.groups[grp.id] ? '−' : '+'}}</span>
                    </button>
                    <transition name="accordion">
                      <div v-if="expanded.groups[grp.id] && grp.packages?.length" class="bg-white border-r-2 border-[var(--color-primary)] p-2 mt-1">
                        <a v-for="pkg in grp.packages" :key="pkg.id" :href="`/package/${pkg.id}`" class="block text-[10px] py-1 text-gray-600">{{pkg.package}}</a>
                      </div>
                    </transition>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </transition>
      </div>
      <a href="#" class="block border-2 border-[var(--color-primary)] rounded-xl p-3 text-sm font-bold text-[var(--color-primary)]">هتل آهوان</a>
      <a href="#" class="block border-2 border-[var(--color-primary)] rounded-xl p-3 text-sm font-bold text-[var(--color-primary)]">درباره ما</a>
      <a href="#" class="block border-2 border-[var(--color-primary)] rounded-xl p-3 text-sm font-bold text-[var(--color-primary)]">مجله گردشگری آهوان</a>
      <a href="#" class="block border-2 border-[var(--color-primary)] rounded-xl p-3 text-sm font-bold text-[var(--color-primary)]">پشتیبانی آنلاین</a>
    </div>
  </div>
</header>
</template>

<style scoped>
.accordion-enter-active, .accordion-leave-active{ transition:all .3s ease; overflow:hidden; }
.accordion-enter-from, .accordion-leave-to{ max-height:0; opacity:0; transform:translateY(-6px); }
.accordion-enter-to, .accordion-leave-from{ max-height:500px; opacity:1; transform:translateY(0); }
</style>
