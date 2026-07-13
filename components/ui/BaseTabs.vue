<script setup>
const props = defineProps({
  items: {
    type: Array,
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
  <div
    class="flex w-full items-center rounded-lg overflow-hidden p-1"
    style="background-color: var(--color-gray-100);"
    dir="rtl"
  >
    <!-- بخش ثابت دسته‌بندی -->
    <div class="px-3 text-[12px] font-bold text-slate-500 whitespace-nowrap">
      دسته‌بندی:
    </div>

    <!-- دکمه‌های داینامیک -->
    <div class="flex flex-1 gap-1">
      <button
        v-for="item in items"
        :key="item"
        @click="emit('update:modelValue', item)"
        class="flex-1 py-2 text-[12px] font-medium transition-all duration-200 rounded-md"
        :class="[
          modelValue === item
            ? 'bg-[var(--color-primary-dark)] text-[var(--color-white)] shadow-sm'
            : 'text-[var(--color-primary-dark)] hover:bg-[var(--color-gray-200)]'
        ]"
      >
        {{ item }}
      </button>
    </div>
  </div>
</template>
