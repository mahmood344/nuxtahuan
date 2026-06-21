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
    class="flex w-full rounded-lg overflow-hidden"
    style="background-color: var(--color-gray-100);"
  >
    <button
      v-for="item in items"
      :key="item"
      @click="emit('update:modelValue', item)"
      class="flex-1 py-3 text-sm font-medium transition-colors duration-200"
      :class="[
        modelValue === item
          ? 'bg-[var(--color-primary-dark)] text-[var(--color-white)]'
          : 'text-[var(--color-primary-dark)] hover:bg-[var(--color-gray-200)]'
      ]"
    >
      {{ item }}
    </button>
  </div>
</template>
