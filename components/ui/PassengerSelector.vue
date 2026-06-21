<template>
  <div dir="rtl" class="flex w-full justify-center p-4 font-vazir">

    <div class="relative w-full max-w-[360px] h-[54px] bg-white border border-gray-300 rounded-[12px] flex items-center">

      <!-- label مثل مبدا و مقصد -->
      <label class="absolute -top-3 right-6 z-20 bg-white px-2 text-[11px] text-gray-400">
        مسافران
      </label>

      <!-- فیلد -->
      <div
        @click="isOpen = !isOpen"
        class="w-full h-full flex items-center px-6 cursor-pointer text-gray-700"
      >
        <span class="font-semibold text-[14px]">
          {{ totalPassengers }} مسافر
        </span>

        <i
          class="bi bi-chevron-down mr-auto text-gray-400 text-xs transition"
          :class="{ 'rotate-180': isOpen }"
        ></i>
      </div>

      <!-- dropdown -->
      <div
        v-if="isOpen"
        class="absolute top-[64px] right-0 w-full bg-white border border-gray-200 rounded-[16px] shadow-xl p-5 z-50"
      >

        <div class="space-y-6">

          <!-- بزرگسال -->
          <div class="flex items-center justify-between">
            <div>
              <span class="text-[14px] font-bold text-gray-800">
                بزرگسال
                <span class="text-[11px] text-gray-400 mr-1">(۱۲ سال به بالا)</span>
              </span>
            </div>

            <div class="flex items-center gap-4">

              <button
                @click.stop="decrement('adult')"
                :disabled="!canRemoveAdult"
                class="w-6 h-6 rounded-full flex items-center justify-center"
                :class="canRemoveAdult ? 'bg-[#253E91]' : 'bg-[#253E91]/20 cursor-not-allowed'"
              >
                <i class="bi bi-dash text-white text-sm leading-none"></i>
              </button>

              <span class="w-4 text-center font-bold text-sm">
                {{ counts.adult }}
              </span>

              <button
                @click.stop="increment('adult')"
                :disabled="!canAddAdult"
                class="w-6 h-6 rounded-full flex items-center justify-center"
                :class="canAddAdult ? 'bg-[#253E91]' : 'bg-[#253E91]/20 cursor-not-allowed'"
              >
                <i class="bi bi-plus text-white text-sm leading-none"></i>
              </button>

            </div>
          </div>

          <!-- کودک -->
          <div class="flex items-center justify-between">
            <div>
              <span class="text-[14px] font-bold text-gray-800">
                کودک
                <span class="text-[11px] text-gray-400 mr-1">(۲ تا ۱۲ سال)</span>
              </span>
            </div>

            <div class="flex items-center gap-4">

              <button
                @click.stop="decrement('child')"
                :disabled="!canRemoveChild"
                class="w-6 h-6 rounded-full flex items-center justify-center"
                :class="canRemoveChild ? 'bg-[#253E91]' : 'bg-[#253E91]/20 cursor-not-allowed'"
              >
                <i class="bi bi-dash text-white text-sm"></i>
              </button>

              <span class="w-4 text-center font-bold text-sm">
                {{ counts.child }}
              </span>

              <button
                @click.stop="increment('child')"
                :disabled="!canAddChild"
                class="w-6 h-6 rounded-full flex items-center justify-center"
                :class="canAddChild ? 'bg-[#253E91]' : 'bg-[#253E91]/20 cursor-not-allowed'"
              >
                <i class="bi bi-plus text-white text-sm"></i>
              </button>

            </div>
          </div>

          <!-- نوزاد -->
          <div class="flex items-center justify-between">
            <div>
              <span class="text-[14px] font-bold text-gray-800">
                نوزاد
                <span class="text-[11px] text-gray-400 mr-1">(۱۰ روز تا ۲ سال)</span>
              </span>
            </div>

            <div class="flex items-center gap-4">

              <button
                @click.stop="decrement('infant')"
                :disabled="!canRemoveInfant"
                class="w-6 h-6 rounded-full flex items-center justify-center"
                :class="canRemoveInfant ? 'bg-[#253E91]' : 'bg-[#253E91]/20 cursor-not-allowed'"
              >
                <i class="bi bi-dash text-white text-sm"></i>
              </button>

              <span class="w-4 text-center font-bold text-sm">
                {{ counts.infant }}
              </span>

              <button
                @click.stop="increment('infant')"
                :disabled="!canAddInfant"
                class="w-6 h-6 rounded-full flex items-center justify-center"
                :class="canAddInfant ? 'bg-[#253E91]' : 'bg-[#253E91]/20 cursor-not-allowed'"
              >
                <i class="bi bi-plus text-white text-sm"></i>
              </button>

            </div>
          </div>

        </div>

        <!-- قانون -->
        <div class="flex items-start gap-2 mt-6 pt-5 border-t border-gray-100">
          <div class="w-5 h-5 rounded-full border border-red-500 flex items-center justify-center">
            <span class="text-red-500 text-[12px] font-bold">i</span>
          </div>

          <p class="text-[11px] text-red-500">
            به ازای هر بزرگسال، ۳ کودک، یا ۲ کودک و یک نوزاد مجاز است.
          </p>
        </div>

      </div>

    </div>

    <!-- overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40"
      @click="isOpen = false"
    ></div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue"

const isOpen = ref(false)

const counts = ref({
  adult: 1,
  child: 0,
  infant: 0
})

const MAX = 9

const totalPassengers = computed(() => {
  return counts.value.adult + counts.value.child + counts.value.infant
})

const canAddAdult = computed(() => totalPassengers.value < MAX)

const canAddChild = computed(() => {
  if (totalPassengers.value >= MAX) return false
  return counts.value.child + 1 + counts.value.infant <= 3 * counts.value.adult
})

const canAddInfant = computed(() => {
  if (totalPassengers.value >= MAX) return false

  const next = counts.value.infant + 1

  return (
    next <= counts.value.adult &&
    counts.value.child + next <= 3 * counts.value.adult
  )
})

const canRemoveAdult = computed(() => {
  if (counts.value.adult <= 1) return false

  const next = counts.value.adult - 1

  return (
    counts.value.infant <= next &&
    counts.value.child + counts.value.infant <= 3 * next
  )
})

const canRemoveChild = computed(() => counts.value.child > 0)
const canRemoveInfant = computed(() => counts.value.infant > 0)

const increment = (type) => {
  if (type === "adult" && canAddAdult.value) counts.value.adult++
  if (type === "child" && canAddChild.value) counts.value.child++
  if (type === "infant" && canAddInfant.value) counts.value.infant++
}

const decrement = (type) => {
  if (type === "adult" && canRemoveAdult.value) counts.value.adult--
  if (type === "child" && canRemoveChild.value) counts.value.child--
  if (type === "infant" && canRemoveInfant.value) counts.value.infant--
}
</script>

<style scoped>

</style>
