<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number, Object, null], default: null },
  items: { type: Array, required: true, default: () => [] },

  itemText: { type: String, default: 'label' },
  itemValue: { type: String, default: 'value' },

  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  icon: { type: String, default: '' },
  iconPosition: { type: String, default: 'left' },

  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },

  clearable: { type: Boolean, default: true },
  menuProps: { type: Object, default: () => ({}) },
  rtl: { type: Boolean, default: true }
});

const emit = defineEmits([
  'update:modelValue',
  'update:items',
  'update:loading',
  'update:error',
  'input',
  'change',
  'blur',
  'focus'
]);

const internalValue = ref(props.modelValue);
const search = ref('');
const isMenuOpen = ref(false);
const isFocused = ref(false);
const internalItems = ref(props.items);
const selectedItem = ref(null);
const inputRef = ref(null);
const menuRef = ref(null);
const isUserTyping = ref(false);

const wrapperClasses = computed(() => {
  return [
    'relative',
    props.rtl ? 'dir-rtl' : 'dir-ltr'
  ];
});

const getItemText = (item) => {
  if (typeof item === 'object' && item !== null) {
    return String(item?.[props.itemText] ?? '');
  }

  return String(item ?? '');
};

const getItemValue = (item) => {
  if (typeof item === 'object' && item !== null) {
    return item?.[props.itemValue];
  }

  return item;
};

const displayValue = computed(() => {
  if (selectedItem.value) return getItemText(selectedItem.value);

  if (
    typeof internalValue.value === 'string' ||
    typeof internalValue.value === 'number'
  ) {
    return String(internalValue.value);
  }

  return '';
});

const inputValue = computed(() => {
  if (isFocused.value || isMenuOpen.value) {
    return isUserTyping.value ? search.value : displayValue.value;
  }

  return displayValue.value;
});

const filteredItems = computed(() => {
  if (!isUserTyping.value || !search.value.trim()) {
    return internalItems.value;
  }

  const lowerSearch = search.value.toLowerCase();

  return internalItems.value.filter((item) =>
    getItemText(item).toLowerCase().includes(lowerSearch)
  );
});

const hasValue = computed(() => {
  return selectedItem.value !== null || String(displayValue.value).trim() !== '';
});

const showClearIcon = computed(() => {
  return props.clearable && hasValue.value && !props.loading;
});

const suffixIconSvg = computed(() => {
  if (props.loading) {
    return `
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
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
    `;
  }

  if (showClearIcon.value) {
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        class="w-5 h-5"
      >
        <path
          d="M6 6L18 18M18 6L6 18"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;
  }

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="w-5 h-5 transition-transform duration-200 ${isMenuOpen.value ? 'rotate-180' : ''}"
    >
      <path
        fill-rule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.93l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clip-rule="evenodd"
      />
    </svg>
  `;
});

const inputClasses = computed(() => {
  const classes = [
    'peer w-full h-[54px] py-3 px-4 rounded-[12px] bg-white transition-all duration-300 outline-none border text-[var(--color-gray-700)] placeholder:text-[var(--color-gray-400)]',
    props.error
      ? 'border-[var(--color-red-500)] focus:ring-1 focus:ring-[var(--color-red-300)]'
      : 'border-[var(--color-gray-300)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary-dark)] focus:shadow-md'
  ];

  if (props.disabled) {
    classes.push('bg-[var(--color-gray-100)] text-[var(--color-gray-500)] cursor-not-allowed');
  }

  if (props.icon) {
    classes.push(props.iconPosition === 'left' ? 'pl-10' : 'pr-10');
  }

  if (suffixIconSvg.value) {
    classes.push(props.rtl ? 'pl-10' : 'pr-10');
  }

  return classes;
});

const selectItem = (item) => {
  selectedItem.value = item;
  internalValue.value = getItemValue(item);
  search.value = '';
  isUserTyping.value = false;
  isMenuOpen.value = false;
  isFocused.value = false;

  emit('update:modelValue', internalValue.value);
  emit('change', internalValue.value);
};

const clear = () => {
  selectedItem.value = null;
  internalValue.value = null;
  search.value = '';
  isUserTyping.value = false;
  isMenuOpen.value = false;
  isFocused.value = false;

  emit('update:modelValue', null);
  emit('change', null);
};

const toggleMenu = async () => {
  if (props.disabled) return;

  isMenuOpen.value = !isMenuOpen.value;

  if (isMenuOpen.value) {
    isFocused.value = true;
    isUserTyping.value = false;
    search.value = '';
    await nextTick();
    inputRef.value?.focus();
  } else {
    handleBlur();
  }
};

const handleFocus = () => {
  isFocused.value = true;
  emit('focus');
};

const handleBlur = () => {
  setTimeout(() => {
    const isMouseOverMenu = menuRef.value?.matches(':hover');

    if (!isMouseOverMenu) {
      isMenuOpen.value = false;
      isFocused.value = false;
      isUserTyping.value = false;
      search.value = '';
      emit('blur');
    }
  }, 150);
};

const handleInput = (event) => {
  search.value = event.target.value;
  isUserTyping.value = true;
  isMenuOpen.value = true;

  emit('input', search.value);
};

const handleSuffixClick = () => {
  if (showClearIcon.value) {
    clear();
  } else {
    toggleMenu();
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue;

    selectedItem.value =
      internalItems.value.find((item) => getItemValue(item) === newValue) || null;

    if (!isFocused.value) {
      search.value = '';
      isUserTyping.value = false;
    }
  },
  { immediate: true }
);

watch(
  () => props.items,
  (newItems) => {
    internalItems.value = newItems;

    selectedItem.value =
      internalItems.value.find((item) => getItemValue(item) === internalValue.value) || null;

    if (!isFocused.value) {
      search.value = '';
      isUserTyping.value = false;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div
    :class="wrapperClasses"
    :dir="rtl ? 'rtl' : 'ltr'"
    @click.stop="toggleMenu"
  >
    <div class="relative flex items-center w-full">
      <label
        v-if="label"
        class="absolute -top-3 z-20 bg-white px-2 text-[11px]"
        :class="[
          rtl ? 'right-4' : 'left-4',
          error ? 'text-[var(--color-red-500)]' : 'text-[var(--color-gray-400)]'
        ]"
      >
        {{ label }}
      </label>

      <span
        v-if="icon"
        class="pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 text-[var(--color-gray-400)]"
        :class="iconPosition === 'left' ? 'left-3' : 'right-3'"
        v-html="icon"
      />

      <input
        ref="inputRef"
        :value="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        :dir="rtl ? 'rtl' : 'ltr'"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />

      <button
        v-if="suffixIconSvg"
        type="button"
        class="absolute inset-y-0 z-10 flex items-center justify-center px-3 transition-colors"
        :class="[
          rtl ? 'left-2' : 'right-2',
          showClearIcon
            ? 'text-[var(--color-gray-400)] hover:text-[var(--color-red-500)]'
            : 'text-[var(--color-gray-400)] hover:text-[var(--color-primary)]'
        ]"
        :title="showClearIcon ? 'پاک کردن' : 'باز کردن لیست'"
        @click.stop="handleSuffixClick"
      >
        <span class="flex items-center justify-center" v-html="suffixIconSvg"></span>
      </button>
    </div>

    <transition name="autocomplete-menu">
      <div
        v-if="isMenuOpen"
        ref="menuRef"
        class="absolute z-[100] mt-2 w-full rounded-lg border border-[var(--color-gray-200)] bg-white py-2 shadow-lg"
        :class="rtl ? 'right-0' : 'left-0'"
        :style="{ maxHeight: '220px', overflowY: 'auto', ...menuProps }"
        @click.stop
      >
        <div v-if="loading" class="flex items-center justify-center py-4">
          <svg
            class="h-6 w-6 animate-spin text-[var(--color-primary)]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>

        <ul v-else-if="filteredItems.length > 0">
          <li
            v-for="(item, index) in filteredItems"
            :key="index"
            class="cursor-pointer border-b border-[var(--color-gray-100)] py-3 pe-2 ps-4 text-sm transition-colors last:border-b-0 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
            :class="getItemValue(item) === internalValue ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'text-[var(--color-gray-700)]'"
            @click.stop="selectItem(item)"
          >
            {{ getItemText(item) }}
          </li>
        </ul>

        <div v-else class="px-4 py-3 text-sm text-[var(--color-gray-500)]">
          موردی یافت نشد.
        </div>
      </div>
    </transition>

    <p v-if="error" class="mt-1 text-sm text-[var(--color-red-500)]">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.autocomplete-menu-enter-active,
.autocomplete-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.autocomplete-menu-enter-from,
.autocomplete-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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

.rotate-180 {
  transform: rotate(180deg);
}
</style>
