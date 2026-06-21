<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  icon: { type: String, default: '' },
  iconPosition: { type: String, default: 'left' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  rtl: { type: Boolean, default: true }
});

const emit = defineEmits(['update:modelValue']);

const isFocused = ref(false);

const wrapperClasses = computed(() => {
  return `relative mb-6 ${props.rtl ? 'dir-rtl' : 'dir-ltr'}`;
});

const inputClasses = computed(() => {
  const basePaddingX = 'px-4';

  let effectiveIconPadding = '';
  if (props.icon) {
    if (props.rtl) {
      effectiveIconPadding = props.iconPosition === 'left' ? 'pr-10' : 'pl-10';
    } else {
      effectiveIconPadding = props.iconPosition === 'left' ? 'pl-10' : 'pr-10';
    }
  }

  let loadingPadding = '';
  if (props.loading) {
    if (props.rtl) {
      loadingPadding = props.iconPosition === 'left' ? 'pr-10' : 'pl-10';
    } else {
      loadingPadding = props.iconPosition === 'left' ? 'pl-10' : 'pr-10';
    }
  }

  return [
    'peer w-full py-3 rounded-lg transition-all duration-300 outline-none',
    basePaddingX,
    effectiveIconPadding,
    loadingPadding,

    'bg-[var(--color-white)] text-[var(--color-gray-800)] border',

    props.disabled
      ? 'bg-[var(--color-gray-100)] text-[var(--color-gray-500)] cursor-not-allowed'
      : '',

    props.error
      ? 'border-[var(--color-red-500)] focus:ring-[var(--color-red-300)]'
      : 'border-[var(--color-gray-300)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary-dark)]'
  ];
});

const labelClasses = computed(() => {
  const base =
    'absolute top-3 transition-all duration-300 text-[var(--color-gray-500)]';

  const errorStyles =
    '!text-[var(--color-red-500)] peer-focus:!text-[var(--color-red-500)]';

  let positionClasses = '';

  if (props.rtl) {
    positionClasses =
      props.icon && props.iconPosition === 'left' ? 'right-10' : 'right-4';

    if (props.modelValue || isFocused.value) {
      positionClasses += ' -top-3 !right-4 text-sm';
    }
  } else {
    positionClasses =
      props.icon && props.iconPosition === 'right' ? 'left-10' : 'left-4';

    if (props.modelValue || isFocused.value) {
      positionClasses += ' -top-3 !left-4 text-sm';
    }
  }

  return [
    base,
    positionClasses,
    props.error ? errorStyles : '',
    props.disabled ? 'text-[var(--color-gray-400)]' : '',
    props.loading ? 'opacity-50' : ''
  ];
});

const iconSpanClasses = computed(() => {
  const base =
    'absolute top-3 text-[var(--color-gray-400)] peer-focus:text-[var(--color-primary)]';

  let positionClass = '';

  if (props.rtl) {
    positionClass = props.iconPosition === 'left' ? 'left-3' : 'right-3';
  } else {
    positionClass = props.iconPosition === 'left' ? 'left-3' : 'right-3';
  }

  return `${base} ${positionClass}`;
});

const loadingIndicatorClasses = computed(() => {
  let positionClass = '';

  if (props.rtl) {
    positionClass = props.iconPosition === 'left' ? 'left-0' : 'right-0';
  } else {
    positionClass = props.iconPosition === 'left' ? 'left-0' : 'right-0';
  }

  return `absolute inset-y-0 flex items-center px-3 pointer-events-none ${positionClass}`;
});

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
};

const getIconHtml = computed(() => {
  if (typeof props.icon === 'string' && props.icon.trim().startsWith('<')) {
    return props.icon;
  }
  return '';
});
</script>

<template>
  <div :class="wrapperClasses">
    <label v-if="label" :class="labelClasses">
      {{ label }}
    </label>

    <div class="relative flex items-center w-full">

      <!-- icon -->
      <span
        v-if="icon"
        :class="iconSpanClasses"
        v-html="getIconHtml"
      />

      <input
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :class="inputClasses"
      />

      <!-- loading -->
      <div v-if="loading" :class="loadingIndicatorClasses">
        <svg
          class="animate-spin h-5 w-5 text-[var(--color-primary)]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>

    </div>

    <!-- error -->
    <p v-if="error" class="text-[var(--color-red-500)] text-sm mt-1">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>

input::placeholder {
  color: var(--color-gray-400);
}

.dir-rtl {
  direction: rtl;
}

.dir-rtl input {
  text-align: right;
}

.dir-rtl input::placeholder {
  text-align: right;
}

.dir-ltr input {
  text-align: left;
}

.dir-ltr input::placeholder {
  text-align: left;
}

</style>
