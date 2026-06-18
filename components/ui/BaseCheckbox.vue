<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  color: { type: String, default: '#1F228C' },
  tickColor: { type: String, default: '#ffffff' },
  icon: { type: String, default: '' },     // آیکون کنار چک‌باکس
  customImage: { type: String, default: '' }, // عکس کنار چک‌باکس
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <label class="flex items-center gap-3" :class="[disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']">
    <!-- عکس یا آیکونِ کنار چک‌باکس -->
    <div v-if="customImage || icon" class="w-6 h-6 flex items-center justify-center">
      <img v-if="customImage" :src="customImage" class="w-full h-full object-cover rounded-full" />
      <span v-else-if="icon" class="text-xl" v-html="icon"></span>
    </div>

    <!-- چک‌باکس اصلی -->
    <input
      type="checkbox"
      class="hidden"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.checked)"
    />

    <div
      class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300"
      :style="{
        backgroundColor: modelValue ? color : '#fff',
        borderColor: modelValue ? color : '#d1d5db'
      }"
    >
      <svg v-if="modelValue" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4" :style="{ color: tickColor }">
        <path fill-rule="evenodd" d="M16.707 4.293a1 1 0 010 1.414l-9 9a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L7 11.586l8.293-8.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </div>

    <!-- متن -->
    <span v-if="label" :class="{ 'text-gray-500': disabled }">{{ label }}</span>
  </label>
</template>
