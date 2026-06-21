<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  // --- ورودی‌های اصلی ---
  modelValue: { type: [String, Number, Object, null], default: null },
  items: { type: Array, required: true, default: () => [] },

  // --- کلیدهای مپینگ داده ---
  itemText: { type: String, default: '' },
  itemValue: { type: String, default: '' },

  // --- ظاهر و متون ---
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  icon: { type: String, default: '' },
  iconPosition: { type: String, default: 'left' },

  // --- وضعیت‌ها ---
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },

  // --- تنظیمات عملکردی ---
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

// --- Refs ---
const internalValue = ref(props.modelValue);
const search = ref('');
const isMenuOpen = ref(false);
const isFocused = ref(false);
const internalItems = ref(props.items);
const selectedItem = ref(null);
const inputRef = ref(null);
const menuRef = ref(null);

// --- Computed ---

const displayValue = computed(() => {
  if (selectedItem.value) {
    return getItemText(selectedItem.value);
  }

  if (
    typeof internalValue.value === 'string' ||
    typeof internalValue.value === 'number'
  ) {
    return internalValue.value;
  }

  return '';
});

const filteredItems = computed(() => {
  if (!search.value && !isMenuOpen.value) {
    return selectedItem.value ? [selectedItem.value] : [];
  }

  if (!search.value && isMenuOpen.value) {
    return internalItems.value;
  }

  const lowerSearch = search.value.toLowerCase();

  return internalItems.value.filter((item) => {
    const text = getItemText(item).toLowerCase();
    return text.includes(lowerSearch);
  });
});

const hasValue = computed(() => {
  return (
    selectedItem.value !== null ||
    internalValue.value !== null ||
    search.value !== ''
  );
});

const showClearIcon = computed(() => {
  return props.clearable && hasValue.value && !props.loading;
});

const showDropdownIcon = computed(() => {
  return !props.loading && !showClearIcon.value;
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

  if (showDropdownIcon.value) {
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
  }

  return '';
});

// --- Methods ---

const getItemText = (item) => {
  if (typeof item === 'object' && item !== null && props.itemText) {
    return item?.[props.itemText] || '';
  }

  return String(item || '');
};

const getItemValue = (item) => {
  if (typeof item === 'object' && item !== null && props.itemValue) {
    return item?.[props.itemValue];
  }

  return item;
};

const selectItem = (item) => {
  selectedItem.value = item;
  internalValue.value = getItemValue(item);
  search.value = getItemText(item);

  isMenuOpen.value = false;
  isFocused.value = false;

  emit('update:modelValue', internalValue.value);
  emit('change', internalValue.value);
};

const clear = () => {
  selectedItem.value = null;
  internalValue.value = null;
  search.value = '';
  isMenuOpen.value = false;
  isFocused.value = false;

  emit('update:modelValue', null);
  emit('change', null);
};

const toggleMenu = async () => {
  if (props.disabled) return;

  isMenuOpen.value = !isMenuOpen.value;
  isFocused.value = true;

  if (isMenuOpen.value) {
    search.value = displayValue.value;

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

      emit('blur');
    }
  }, 150);
};

const handleSuffixClick = () => {
  if (showClearIcon.value) {
    clear();
  } else {
    toggleMenu();
  }
};

// --- Watchers ---

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== internalValue.value) {
      internalValue.value = newValue;

      selectedItem.value =
        internalItems.value.find((item) => getItemValue(item) === newValue) ||
        null;

      search.value = selectedItem.value ? getItemText(selectedItem.value) : '';
    }
  }
);

watch(
  () => props.items,
  (newItems) => {
    internalItems.value = newItems;

    if (internalValue.value !== null && internalValue.value !== undefined) {
      selectedItem.value =
        internalItems.value.find(
          (item) => getItemValue(item) === internalValue.value
        ) || null;

      search.value = selectedItem.value ? getItemText(selectedItem.value) : '';
    } else {
      search.value = '';
    }
  }
);

nextTick(() => {
  internalItems.value = props.items;

  if (props.modelValue !== null && props.modelValue !== undefined) {
    internalValue.value = props.modelValue;

    selectedItem.value =
      internalItems.value.find(
        (item) => getItemValue(item) === props.modelValue
      ) || null;

    search.value = selectedItem.value ? getItemText(selectedItem.value) : '';
  }
});
</script>

<template>
  <div
    class="relative dir-rtl"
    :dir="rtl ? 'rtl' : 'ltr'"
    @click.stop="toggleMenu"
  >
    <!-- Input Field Wrapper -->
    <div class="relative flex items-center w-full">
      <!-- Label -->
      <label
        v-if="label"
        class="absolute -top-3 z-20 bg-white px-2 text-[11px] text-[var(--color-gray-400)]"
        :class="rtl ? 'right-4' : 'left-4'"
      >
        {{ label }}
      </label>

      <!-- Prepend Icon -->
      <span
        v-if="icon && iconPosition === 'left'"
        class="absolute top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] pointer-events-none z-10"
        :class="rtl ? 'right-3' : 'left-3'"
        v-html="icon"
      />

      <!-- Input Element -->
      <input
        ref="inputRef"
        v-model="search"
        :placeholder="placeholder"
        :disabled="disabled"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="emit('input', search)"
        class="peer w-full h-[54px] py-3 px-4 rounded-[12px] bg-white transition-all duration-300 outline-none border border-[var(--color-gray-300)] text-[var(--color-gray-700)] placeholder:text-[var(--color-gray-400)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary-dark)] focus:shadow-md"
        :class="{
          'bg-[var(--color-gray-100)] text-[var(--color-gray-500)] cursor-not-allowed': disabled,

          'border-[var(--color-red-500)] focus:ring-[var(--color-red-300)]': error,

          'pr-10':
            (icon && iconPosition === 'left' && rtl) ||
            (icon && iconPosition === 'right' && rtl),

          'pl-10':
            (suffixIconSvg && rtl) ||
            (icon && iconPosition === 'right' && !rtl),

          'pr-10': suffixIconSvg && !rtl
        }"
        :dir="rtl ? 'rtl' : 'ltr'"
      />

      <!-- Suffix Area: Clear Button Or Dropdown Icon -->
      <button
        v-if="suffixIconSvg"
        type="button"
        class="absolute inset-y-0 flex items-center justify-center px-3 z-10 transition-colors"
        :class="[
          rtl ? 'left-2' : 'right-2',
          showClearIcon
            ? 'text-[var(--color-gray-400)] hover:text-[var(--color-red-500)]'
            : 'text-[var(--color-gray-400)] hover:text-[var(--color-primary)]'
        ]"
        :title="showClearIcon ? 'پاک کردن' : 'باز کردن لیست'"
        @click.stop="handleSuffixClick"
      >
        <span v-html="suffixIconSvg" class="flex items-center justify-center"></span>
      </button>
    </div>

    <!-- Dropdown Menu -->
    <transition name="autocomplete-menu">
      <div
        v-if="isMenuOpen"
        ref="menuRef"
        class="absolute w-full bg-white rounded-lg mt-2 py-2 z-50 border border-[var(--color-gray-200)] shadow-lg"
        :class="rtl ? 'right-0' : 'left-0'"
        :style="{ ...menuProps }"
        @click.stop
      >
        <!-- Loading -->
        <div
          v-if="loading"
          class="flex justify-center items-center py-4"
        >
          <svg
            class="animate-spin h-6 w-6 text-[var(--color-primary)]"
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

        <!-- Menu Items -->
        <ul v-else-if="filteredItems.length > 0">
          <li
            v-for="(item, index) in filteredItems"
            :key="index"
            @click.stop="selectItem(item)"
            class="cursor-pointer transition-colors py-3 ps-4 pe-2 text-sm border-b border-[var(--color-gray-100)] last:border-b-0 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
            :class="{
              'bg-[var(--color-primary-light)] text-[var(--color-primary)]':
                selectedItem && getItemValue(item) === internalValue,

              'text-[var(--color-gray-700)]':
                !selectedItem || getItemValue(item) !== internalValue
            }"
          >
            {{ getItemText(item) }}
          </li>
        </ul>

        <!-- Empty -->
        <div
          v-else
          class="px-4 py-3 text-sm text-[var(--color-gray-500)]"
        >
          موردی یافت نشد.
        </div>
      </div>
    </transition>

    <!-- Error Message -->
    <p
      v-if="error"
      class="text-[var(--color-red-500)] text-sm mt-1"
    >
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
