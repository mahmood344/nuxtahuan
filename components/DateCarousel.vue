<template>
  <div class="w-full select-none" dir="rtl">
    <div class="relative flex items-center group">
      <button
        @click="scroll('right')"
        type="button"
        class="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all hover:scale-110 active:scale-95"
      >
        <span class="text-slate-500 text-lg">❯</span>
      </button>

      <div
  ref="scrollContainer"
  class="hide-scrollbar flex flex-1 gap-4 overflow-x-auto overflow-y-hidden scroll-smooth px-4 py-4"
>
        <div
          v-for="(item, index) in dateList"
          :key="item.fullDate"
          @click="!item.isPast && selectDate(index)"
          class="flex shadow-lg min-w-[128px] h-[125px] flex-col items-center justify-center rounded-[24px] py-4 transition-all duration-300"
          :class="[
            item.isPast
              ? 'cursor-not-allowed bg-white-100 text-slate-300 opacity-70'
              : 'cursor-pointer',
            index === activeIndex && !item.isPast
              ? 'bg-[#1a237e] text-white shadow-xl scale-105'
              : !item.isPast
                ? 'bg-white text-slate-600 shadow-sm border border-slate-50 hover:border-slate-200 hover:shadow-md'
                : ''
          ]"
        >
          <span
            class="text-[12px] font-medium"
            :class="index === activeIndex && !item.isPast ? 'text-white/80' : 'text-slate-400'"
          >
            {{ item.jalaaliDate }}
          </span>

          <span class="mt-1 text-[12px] font-bold">
            {{ item.dayName }}
          </span>
        </div>
      </div>

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

const dateList = computed(() => {
  const list = []
  const rawStart = String(props.startDate || '').replace(/\//g, '-').trim()
  const start = moment(rawStart, 'YYYY-MM-DD', true)
  const today = moment().startOf('day')

  if (!start.isValid()) {
    const fallback = moment()
    for (let i = 0; i < props.daysCount; i++) {
      const m = moment(fallback).add(i, 'days')
      list.push({
        jalaaliDate: m.format('jYYYY/jMM/jDD'),
        dayName: m.format('dddd'),
        fullDate: m.format('YYYY-MM-DD'),
        isPast: m.isBefore(today, 'day')
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
      isPast: m.isBefore(today, 'day')
    })
  }

  return list
})

const scroll = (direction) => {
  if (!scrollContainer.value) return
  const scrollAmount = 200
  scrollContainer.value.scrollBy({
    left: direction === 'right' ? scrollAmount : -scrollAmount,
    behavior: 'smooth'
  })
}

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

const selectDate = (index) => {
  if (index < 0 || index >= dateList.value.length) return
  if (dateList.value[index].isPast) return
  activeIndex.value = index
  emit('dateSelected', dateList.value[index])
  scrollToActiveElement()
}

const syncActiveIndex = () => {
  if (!props.selectedDate) {
    const firstAvailable = dateList.value.findIndex(item => !item.isPast)
    activeIndex.value = firstAvailable !== -1 ? firstAvailable : 0
    return
  }

  const cleanTarget = String(props.selectedDate).replace(/\//g, '-').trim()
  const parsed = moment(cleanTarget, 'YYYY-MM-DD', true)

  let targetFormatted = ''
  if (parsed.isValid()) {
    targetFormatted = parsed.format('YYYY-MM-DD')
  }

  const index = dateList.value.findIndex(item => item.fullDate === targetFormatted && !item.isPast)

  if (index !== -1) {
    activeIndex.value = index
  } else {
    const firstAvailable = dateList.value.findIndex(item => !item.isPast)
    activeIndex.value = firstAvailable !== -1 ? firstAvailable : 0
  }
}

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
<style>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.hide-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}
</style>