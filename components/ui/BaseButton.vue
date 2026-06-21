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
    filled: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]',
    outline: 'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]',
    soft: 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary)]/20'
  },

  gray: {
    filled: 'bg-[var(--color-gray-600)] text-white hover:bg-[var(--color-gray-700)]',
    outline: 'border border-[var(--color-gray-400)] text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)]',
    soft: 'bg-[var(--color-gray-100)] text-[var(--color-gray-700)] border border-[var(--color-gray-200)]'
  }
};

const isDisabled = computed(() => props.disabled || props.loading);

const btnStyle = computed(() => {
  if (isDisabled.value) {
    return 'bg-[var(--color-gray-300)] text-[var(--color-gray-500)] border border-[var(--color-gray-300)] cursor-not-allowed opacity-70';
  }

  return (
    colors[props.color]?.[props.variant] ||
    colors.primary.filled
  );
});

const activeClass = computed(() => {
  return props.active && !isDisabled.value
    ? 'ring-2 ring-[var(--color-primary)]'
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
