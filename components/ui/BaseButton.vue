<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: String,
  icon: String,
  variant: {
    type: String,
    default: 'filled'
  },
  color: {
    type: String,
    default: 'primary'
  },
  active: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  iconSize: String
});

const colors = {
  primary: {
    filled: 'bg-primary text-white hover:bg-primary-dark',
    outline: 'border border-primary text-primary hover:bg-primary-light',
    soft: 'bg-primary-light text-primary border border-primary/20'
  },

  gray: {
    filled: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-gray-400 text-gray-600 hover:bg-gray-50',
    soft: 'bg-gray-100 text-gray-700 border border-gray-200'
  }
};

const isDisabled = computed(() => props.disabled || props.loading);

const btnStyle = computed(() => {
  if (isDisabled.value) {
    return 'bg-gray-300 text-gray-500 border border-gray-300 cursor-not-allowed opacity-70';
  }

  return (
    colors[props.color]?.[props.variant] ||
    colors.primary.filled
  );
});

const activeClass = computed(() => {
  return props.active && !isDisabled.value
    ? 'ring-2 ring-primary'
    : '';
});
</script>

<template>
  <button
    :disabled="isDisabled"
    :class="[
      'px-5 py-2 rounded-lg transition flex items-center justify-center gap-2 font-medium',
      btnStyle,
      activeClass
    ]"
  >
    <template v-if="loading">
      <svg
        class="w-5 h-5 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M22 12a10 10 0 00-10-10v4a6 6 0 016 6h4z"
        />
      </svg>

      <span>در حال پردازش...</span>
    </template>

    <template v-else>
      <span>{{ label }}</span>

      <span
        v-if="icon"
        v-html="icon"
        :class="iconSize || 'text-lg'"
      />
    </template>
  </button>
</template>