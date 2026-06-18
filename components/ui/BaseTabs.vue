<script setup>
const props = defineProps({
  items: {
    type: Array, // ["نام ایرلاین", "دیرترین", "زودترین", "ارزان‌ترین", "گران‌ترین"]
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex w-full bg-[#EEEEEE] rounded-lg overflow-hidden">
    <button
      v-for="item in items"
      :key="item"
      @click="emit('update:modelValue', item)"
      class="flex-1 py-3 text-sm font-medium transition-colors duration-200"
      :class="[
        modelValue === item
          ? 'bg-[#1F228C] text-white' // حالت فعال (آبی پررنگ)
          : 'text-[#1F228C] hover:bg-gray-200' // حالت عادی (متن آبی)
      ]"
    >
      {{ item }}
    </button>
  </div>
</template>
