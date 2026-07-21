<!-- components/ui/UiBaseInput.vue -->
<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  icon: { type: String, default: '' },
  iconPosition: { type: String, default: 'left' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  rtl: { type: Boolean, default: true },
  inputClass: { type: String, default: '' } // اضافه شدن پروپ کلاس سفارشی
});

const emit = defineEmits(['update:modelValue', 'input', 'keyup', 'keydown']);

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
    'peer w-full h-[54px] py-3 rounded-[12px] transition-all duration-300 outline-none text-center',
    basePaddingX,
    effectiveIconPadding,
    loadingPadding,
    'bg-[var(--color-white)] text-[var(--color-gray-800)] border',
    props.disabled
      ? 'bg-[var(--color-gray-100)] text-[var(--color-gray-500)] cursor-not-allowed'
      : '',
    props.error
      ? 'border-[var(--color-red-500)] focus:ring-[var(--color-red-300)]'
      : 'border-[var(--color-gray-300)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary-dark)]',
    props.inputClass // اعمال کلاس‌های دلخواه ارسالی از بیرون
  ];
});

const labelClasses = computed(() => {
  return [
    'absolute -top-3 z-20 bg-white px-2 text-[11px]',
    props.rtl ? 'right-4' : 'left-4',
    props.error
      ? 'text-[var(--color-red-500)]'
      : 'text-[var(--color-gray-400)]',
    props.disabled ? 'text-[var(--color-gray-400)]' : ''
  ];
});

const iconSpanClasses = computed(() => {
  const base =
    'absolute top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] peer-focus:text-[var(--color-primary)]';

  let positionClass = '';

  if (props.rtl) {
    positionClass = props.iconPosition === 'left' ? 'left-3' : 'right-3';
  } else {
    positionClass = props.iconPosition === 'left' ? 'left-3' : 'right-3';
  }

  return `${base} ${positionClass}`;
});

const loadingIndicatorClasses = computed(() => {
  const positionClass =
    props.rtl
      ? props.iconPosition === 'left' ? 'left-0' : 'right-0'
      : props.iconPosition === 'left' ? 'left-0' : 'right-0';

  return `absolute inset-y-0 flex items-center px-3 pointer-events-none ${positionClass}`;
});

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
  emit('input', event);
};

const handleKeyUp = (event) => {
  emit('keyup', event);
};

const handleKeyDown = (event) => {
  emit('keydown', event);
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
    <div class="relative flex items-center w-full">
      <label v-if="label" :class="labelClasses">
        {{ label }}
      </label>

      <span
        v-if="icon"
        :class="iconSpanClasses"
        v-html="getIconHtml"
      />

      <!-- v-bind="$attrs" باعث می‌شود تمام ویژگی‌های دیگر (مانند maxlength یا autocapitalize) مستقیما روی input بنشینند -->
      <input
        v-bind="$attrs"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
        @keyup="handleKeyUp"
        @keydown="handleKeyDown"
        :class="inputClasses"
      />

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

    <p v-if="error" class="text-[var(--color-red-500)] text-sm mt-1">
      {{ error }}
    </p>
  </div>
</template>
