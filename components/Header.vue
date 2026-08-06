<script setup>
import { ref, onMounted } from "vue"
import { useFlightStore } from '~/stores/flights'
const flightStore = useFlightStore()
const menu = ref([])
const showTourMenu = ref(false)
const hoveredCat = ref(null)
const hoveredGrp = ref(null)
let closeTimer = null
const router = useRouter()

function goHome() {
  navigateTo('/')
}

async function logout() {
  await flightStore.logout()
  await navigateTo('/')
}
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
onMounted(() => {
  flightStore.fetchMe()
})
</script>

<template>
<header class="w-full bg-white shadow-sm z-50 rtl fixed top-0 right-0 left-0" dir="rtl">  <!-- DESKTOP -->
  <div class="hidden min-[943px]:flex items-center justify-between px-8 h-[64px]">
    <div class="flex items-center gap-6 cursor-pointer"  @click="goHome">
      <img src="/imgs/header/logo.png" class="h-12">
      <span class="font-rokh text-2xl text-[var(--color-primary)] font-bold">
    آهوان
  </span>
      <nav class="flex items-center gap-5 text-[13px] font-medium text-gray-800">
        <NuxtLink href="#" class="text-[12px] hover:text-[var(--color-primary-dark)]">بلیط</NuxtLink>
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
        <NuxtLink href="#" class="text-[12px] hover:text-[var(--color-primary-dark)]">هتل آهوان</NuxtLink>
        <NuxtLink href="#" class="text-[12px] hover:text-[var(--color-primary-dark)]">درباره ما</NuxtLink>
        <NuxtLink href="#" class="text-[12px] hover:text-[var(--color-primary-dark)]">مجله گردشگری آهوان</NuxtLink>
        <NuxtLink href="#" class="text-[12px] hover:text-[var(--color-primary-dark)]">پشتیبانی آنلاین</NuxtLink>
      </nav>
    </div>
<div class="flex items-center gap-3">
  <a href="tel:02141889" class="text-sm font-bold text-[var(--color-primary)]">021-41889</a>

  <!-- اگر لاگین نبود دکمه ورود را نشان بده -->
  <UiBaseButton
    v-if="!flightStore.isLoggedIn"
    @click="flightStore.openModal()"
    class="!rounded-4xl text-[12px]"
    label="ورود - ثبت‌نام"
    variant="filled"
    color="primary"
  />

  <!-- اگر لاگین بود نام کاربر را نشان بده -->
    <div v-else class="relative group h-12 flex items-center">
    <!-- دکمه کاربری -->
    <button class="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-all duration-200 cursor-pointer">
      <!-- آیکون پروفایل کاربر -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4.5 h-4.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
      <span class="text-xs font-bold">{{ flightStore.userName }}</span>
      <!-- آیکون فلش رو به پایین -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform duration-200">
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </button>

    <!-- دراپ‌دان کاربری (با اتصال فیزیکی به دکمه از طریق pt-2 جهت رفع مشکل رفتن هاور) -->
    <!-- دراپ‌دان کاربری (با افزایش پدینگ بالا برای ایجاد فاصله ظاهری بیشتر بدون قطع اتصال هاور) -->
<div class="absolute top-full left-0 pt-4 w-48 hidden group-hover:block z-[9999] transition-all duration-200">
  <div class="bg-white shadow-xl rounded-xl border border-gray-100 p-1.5 flex flex-col gap-0.5">
    <!-- دکمه پروفایل -->
    <NuxtLink to="/profile" class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-400">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
      <span>پروفایل کاربری</span>
    </NuxtLink>

    <!-- دکمه سبد خرید / سفارش‌ها -->
    <NuxtLink :to="{
    path:'/profile',
    query:{tab:'basket'}
  }" class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-400">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
      <span>سبد خرید و رزروها</span>
    </NuxtLink>

    <!-- خط جدا کننده -->
    <div class="h-px bg-gray-100 my-1"></div>

    <!-- دکمه خروج -->
<button
  @click="logout"
  class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-right"
>      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
      </svg>
      <span>خروج از حساب</span>
    </button>
  </div>
</div>

  </div>
</div>

</div>

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
      <NuxtLink href="#" class="block border-2 border-[var(--color-primary)] rounded-xl p-3 text-sm font-bold text-[var(--color-primary)]">بلیط</NuxtLink>
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
      <NuxtLink href="#" class="block border-2 border-[var(--color-primary)] rounded-xl p-3 text-sm font-bold text-[var(--color-primary)]">هتل آهوان</NuxtLink>
      <NuxtLink href="#" class="block border-2 border-[var(--color-primary)] rounded-xl p-3 text-sm font-bold text-[var(--color-primary)]">درباره ما</NuxtLink>
      <NuxtLink href="#" class="block border-2 border-[var(--color-primary)] rounded-xl p-3 text-sm font-bold text-[var(--color-primary)]">مجله گردشگری آهوان</NuxtLink>
      <NuxtLink href="#" class="block border-2 border-[var(--color-primary)] rounded-xl p-3 text-sm font-bold text-[var(--color-primary)]">پشتیبانی آنلاین</NuxtLink>
    </div>
  </div>
</header>
</template>

<style scoped>
.accordion-enter-active, .accordion-leave-active{ transition:all .3s ease; overflow:hidden; }
.accordion-enter-from, .accordion-leave-to{ max-height:0; opacity:0; transform:translateY(-6px); }
.accordion-enter-to, .accordion-leave-from{ max-height:500px; opacity:1; transform:translateY(0); }
</style>
