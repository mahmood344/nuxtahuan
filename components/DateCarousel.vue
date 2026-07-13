<!-- components/ui/DateCarousel.vue -->
<template>
  <div class="w-full select-none" dir="rtl" >
    <div class="relative flex items-center group">
      
      <!-- دکمه قبلی (راست) - در جهت RTL برای بازگشت به تاریخ‌های قبل‌تر -->
      <button 
        @click="scroll('right')"
        type="button"
        class="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all hover:scale-110 active:scale-95"
      >
        <span class="text-slate-500 text-lg">❯</span>
      </button>

      <!-- کانتینر اصلی اسکرول -->
      <div
        ref="scrollContainer"
        class="hide-scrollbar flex flex-1 gap-4 overflow-x-auto scroll-smooth px-4 py-4"
      >
        <div
          v-for="(item, index) in dateList"
          :key="item.fullDate"
          @click="selectDate(index)"
          class="flex shadow-lg min-w-[128px] h-[125px] cursor-pointer flex-col items-center justify-center rounded-[24px] py-4 transition-all duration-300"
          :class="[
            index === activeIndex
              ? 'bg-[#1a237e] text-white shadow-xl scale-105'
              : 'bg-white text-slate-600 shadow-sm border border-slate-50 hover:border-slate-200 hover:shadow-md'
          ]"
        >
          <!-- تاریخ عددی شمسی -->
          <span 
            class="text-[12px] font-medium"
            :class="index === activeIndex ? 'text-white/80' : 'text-slate-400'"
          >
            {{ item.jalaaliDate }}
          </span>
          
          <!-- نام روز هفته -->
          <span class="mt-1 text-[12px] font-bold">
            {{ item.dayName }}
          </span>
        </div>
      </div>

      <!-- دکمه بعدی (چپ) - برای رفتن به تاریخ‌های جلوتر -->
      <button 
        @click="scroll('left')"
        type="button"
        class="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all hover:scale-110 active:scale-95"
      >
        <span class="text-slate-500 text-lg">❮</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import moment from 'moment-jalaali'

// غیرفعال کردن استفاده از کاراکترهای فارسی در فرمت‌های انگلیسی برای جلوگیری از تداخل در پارسر
moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' })

const props = defineProps({
  daysCount: { type: Number, default: 21 },
  startDate: { type: String, default: () => new Date().toISOString() },
  selectedDate: { type: String, default: '' },
  activeColor: { type: String, default: '#1a237e' }
})

const emit = defineEmits(['dateSelected'])

const activeIndex = ref(-1)
const scrollContainer = ref(null)

// تولید ایمن لیست تاریخ‌ها
const dateList = computed(() => {
  const list = []
  
  // پاکسازی مقادیر ورودی
  const rawStart = String(props.startDate || '').replace(/\//g, '-').trim()
  const start = moment(rawStart, 'YYYY-MM-DD', true)
  
  if (!start.isValid()) {
    // برگشت به تاریخ امروز در صورت نامعتبر بودن فرمت ورودی
    const fallback = moment()
    for (let i = 0; i < props.daysCount; i++) {
      const m = moment(fallback).add(i, 'days')
      list.push({
        jalaaliDate: m.format('jYYYY/jMM/jDD'),
        dayName: m.format('dddd'),
        fullDate: m.format('YYYY-MM-DD'),
      })
    }
    return list
  }
  
  for (let i = 0; i < props.daysCount; i++) {
    const m = moment(start).add(i, 'days')
    list.push({
      jalaaliDate: m.format('jYYYY/jMM/jDD'),
      dayName: m.format('dddd'),
      fullDate: m.format('YYYY-MM-DD'),
    })
  }
  return list
})

// اسکرول کردن نرم کاروسل
const scroll = (direction) => {
  if (!scrollContainer.value) return
  const scrollAmount = 200
  scrollContainer.value.scrollBy({
    left: direction === 'right' ? scrollAmount : -scrollAmount,
    behavior: 'smooth'
  })
}

// اسکرول به سمت کارت فعال برای قرارگیری در مرکز
const scrollToActiveElement = () => {
  nextTick(() => {
    setTimeout(() => {
      if (scrollContainer.value && activeIndex.value !== -1) {
        const activeEl = scrollContainer.value.children[activeIndex.value]
        if (activeEl) {
          activeEl.scrollIntoView({ 
            inline: 'center', 
            block: 'nearest', 
            behavior: 'smooth' 
          })
        }
      }
    }, 100)
  })
}

// انتخاب تاریخ بر اساس کلیک روی کارت‌ها
const selectDate = (index) => {
  if (index < 0 || index >= dateList.value.length) return
  activeIndex.value = index
  emit('dateSelected', dateList.value[index])
  scrollToActiveElement()
}

// همگام‌سازی دقیق ایندکس فعال با selectedDate بدون تداخل فرمت‌ها
const syncActiveIndex = () => {
  if (!props.selectedDate) {
    activeIndex.value = 0
    return
  }

  // تمیز کردن ساختار تاریخ برای مقایسه دقیق
  const cleanTarget = String(props.selectedDate).replace(/\//g, '-').trim()
  const parsed = moment(cleanTarget, 'YYYY-MM-DD', true)
  
  let targetFormatted = ''
  if (parsed.isValid()) {
    targetFormatted = parsed.format('YYYY-MM-DD')
  } else {
    // تلاش مجدد با پارسر منعطف‌تر در صورت وجود خطا
    const fallbackParsed = moment(cleanTarget, ['YYYY-MM-DD', 'YYYY/MM/DD', 'jYYYY/jMM/jDD'])
    if (fallbackParsed.isValid()) {
      targetFormatted = fallbackParsed.format('YYYY-MM-DD')
    }
  }

  const index = dateList.value.findIndex(item => {
    if (targetFormatted && item.fullDate === targetFormatted) {
      return true
    }
    const cleanFull = item.fullDate.replace(/\//g, '-').trim()
    return cleanFull === cleanTarget
  })

  if (index !== -1) {
    activeIndex.value = index
  } else {
    // جلوگیری از ریست شدن به ایندکس صفر در صورتی که آیتم پیدا نشود ولی لیست پر باشد
    if (activeIndex.value === -1 || activeIndex.value >= dateList.value.length) {
      activeIndex.value = 0
    }
  }
}

// نظارت بر مقادیر ورودی
watch(() => props.selectedDate, () => {
  syncActiveIndex()
  scrollToActiveElement()
}, { immediate: true })

watch(() => dateList.value, () => {
  syncActiveIndex()
  scrollToActiveElement()
}, { immediate: true })

onMounted(() => {
  syncActiveIndex()
  scrollToActiveElement()
})
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
