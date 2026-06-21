<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },

  // رنگ‌ها از theme
  color: { type: String, default: 'var(--color-primary)' },
  tickColor: { type: String, default: 'var(--color-white)' },

  icon: { type: String, default: '' },
  customImage: { type: String, default: '' },

  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <label
    class="flex items-center gap-3 select-none"
    :class="[disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']"
  >
    <!-- icon / image -->
    <div
      v-if="customImage || icon"
      class="w-6 h-6 flex items-center justify-center"
    >
      <img
        v-if="customImage"
        :src="customImage"
        class="w-full h-full object-cover rounded-full"
      />

      <span
        v-else-if="icon"
        class="text-xl"
        v-html="icon"
      />
    </div>

    <!-- hidden checkbox -->
    <input
      type="checkbox"
      class="hidden"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.checked)"
    />

    <!-- circle -->
    <div
      class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300"
      :style="{
        backgroundColor: modelValue ? color : 'var(--color-white)',
        borderColor: modelValue ? color : 'var(--color-gray-300)'
      }"
    >
      <svg
        v-if="modelValue"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4"
        :style="{ color: tickColor }"
      >
        <path
          fill-rule="evenodd"
          d="M16.707 4.293a1 1 0 010 1.414l-9 9a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L7 11.586l8.293-8.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <!-- label -->
    <span
      v-if="label"
      :class="disabled ? 'text-[var(--color-gray-400)]' : 'text-[var(--color-gray-700)]'"
    >
      {{ label }}
    </span>
  </label>
</template>
