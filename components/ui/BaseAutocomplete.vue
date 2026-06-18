<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  // --- ورودی‌های اصلی ---
  modelValue: { type: [String, Number, Object, null], default: null }, // مقدار انتخاب شده (v-model)
  items: { type: Array, required: true, default: () => [] },           // لیست گزینه‌ها
  
  // --- کلیدهای مپینگ داده ---
  itemText: { type: String, default: '' },   // فیلد نمایش متن در لیست
  itemValue: { type: String, default: '' },  // فیلد مقدار در آبجکت
  
  // --- ظاهر و متون ---
  label: { type: String, default: '' },       // برچسب بالای کامپوننت
  placeholder: { type: String, default: '' }, // متن خاکستری داخلی
  icon: { type: String, default: '' },       // آیکونِ کنارِ ورودی
  iconPosition: { type: String, default: 'left' }, // جهت آیکون (left/right)
  
  // --- وضعیت‌ها (States) ---
  loading: { type: Boolean, default: false }, // نمایش وضعیت لودینگ
  error: { type: String, default: '' },       // متن خطای زیر باکس
  disabled: { type: Boolean, default: false }, // غیرفعال‌سازی کامپوننت
  
  // --- تنظیمات عملکردی ---
  clearable: { type: Boolean, default: false }, // قابلیت پاک کردن (X)
  menuProps: { type: Object, default: () => ({}) }, // تنظیمات اضافی منو
  rtl: { type: Boolean, default: true }       // جهتِ متنِ فارسی
});

const emit = defineEmits(['update:modelValue', 'update:items', 'update:loading', 'update:error', 'input', 'change', 'blur', 'focus']);

// --- Refs ---
const internalValue = ref(props.modelValue);
const search = ref('');
const isMenuOpen = ref(false);
const isFocused = ref(false);
const internalItems = ref(props.items);
const selectedItem = ref(null);
const inputRef = ref(null);
const menuRef = ref(null);

// --- Computed Properties ---

// Determine display value for the input field
const displayValue = computed(() => {
  if (selectedItem.value) {
    return getItemText(selectedItem.value);
  }
  // If the direct value is a string or number, display it
  if (typeof internalValue.value === 'string' || typeof internalValue.value === 'number') {
    return internalValue.value;
  }
  return '';
});

// Filtered items for the dropdown menu
const filteredItems = computed(() => {
  // If menu is not open, show no items or only selected item if applicable
  // if (!isMenuOpen.value) {
  //   return selectedItem.value ? [selectedItem.value] : [];
  // }

  if (!search.value && !isMenuOpen.value) {
      // If menu is closed and search is empty, don't show items unless there's a selection to display
      return selectedItem.value ? [selectedItem.value] : [];
  }

  if (!search.value && isMenuOpen.value) {
      // If menu is open and search is empty, show all items
      return internalItems.value;
  }

  const lowerSearch = search.value.toLowerCase();
  return internalItems.value.filter(item => {
    const text = getItemText(item).toLowerCase();
    return text.includes(lowerSearch);
  });
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

// Handle item selection
const selectItem = (item) => {
  selectedItem.value = item;
  internalValue.value = getItemValue(item);
  search.value = getItemText(item); // Update search input with selected item text
  isMenuOpen.value = false; // Close menu on selection
  isFocused.value = false; // Lose focus
  emit('update:modelValue', internalValue.value);
  emit('change', internalValue.value);
};

// Clear the selected item and search input
const clear = () => {
  selectedItem.value = null;
  internalValue.value = null;
  search.value = '';
  isMenuOpen.value = false;
  emit('update:modelValue', null);
  emit('change', null);
};

// Toggle menu visibility
const toggleMenu = async () => {
  if (props.disabled) return;

  isMenuOpen.value = !isMenuOpen.value;
  isFocused.value = true;

  if (isMenuOpen.value) {
    // When opening, set search to the display value (or empty if no selection)
    search.value = displayValue.value;
    await nextTick(); // Wait for DOM update
    inputRef.value?.focus(); // Focus the input field

    // If search is empty and we want to show all items when menu opens
    if (!search.value) {
        search.value = ''; // Ensure search is truly empty to show all items
    }

  } else {
    handleBlur(); // Apply blur logic when closing
  }
};

// Handle input focus
const handleFocus = () => {
  isFocused.value = true;
  // Optionally open menu on focus if it's not already open and not disabled
  // Consider if this is desired behavior. Usually, user clicks to open.
  // if (!isMenuOpen.value && !props.disabled) {
  //   toggleMenu();
  // }
};

// Handle input blur
const handleBlur = () => {
  setTimeout(() => {
    const isMouseOverMenu = menuRef.value?.matches(':hover');
    if (!isMouseOverMenu) {
      isMenuOpen.value = false;
      isFocused.value = false;
      // When blurring, if the search input doesn't match the selected item's text,
      // it means the user typed something invalid or deselected.
      if (selectedItem.value && search.value !== getItemText(selectedItem.value)) {
        // Option 1: Revert to the selected item's text if selection is mandatory
        // search.value = getItemText(selectedItem.value);

        // Option 2: Clear selection if input is not valid
        // If the current search value doesn't correspond to any item's text,
        // and clearable is true, maybe reset. Or if it's mandatory, revert.
        // For now, we'll keep the search value as is, but close the menu.
        // If the user needs strict validation, more logic is needed here.
      } else if (!selectedItem.value && search.value !== '') {
        // If no item is selected and there's text in search, clear it on blur
        // unless we want to allow free text input.
        // search.value = ''; // Uncomment to clear non-selected text on blur
      }
      emit('blur');
    }
  }, 150);
};

// --- Watchers ---
watch(() => props.modelValue, (newValue) => {
  if (newValue !== internalValue.value) {
    internalValue.value = newValue;
    selectedItem.value = internalItems.value.find(item => getItemValue(item) === newValue) || null;
    // Update search input: if an item is selected, use its text, otherwise clear search
    search.value = selectedItem.value ? getItemText(selectedItem.value) : '';
  }
});

watch(() => props.items, (newItems) => {
  internalItems.value = newItems;
  // Re-evaluate selected item if value exists but items changed
  if (internalValue.value !== null && internalValue.value !== undefined) {
    selectedItem.value = internalItems.value.find(item => getItemValue(item) === internalValue.value) || null;
    // Update search input based on new selection
     search.value = selectedItem.value ? getItemText(selectedItem.value) : '';
  } else {
      // If modelValue is null/undefined, ensure search is also clear
      search.value = '';
  }
});

// --- Lifecycle Hooks ---
nextTick(() => {
  internalItems.value = props.items;
  if (props.modelValue !== null && props.modelValue !== undefined) {
    internalValue.value = props.modelValue;
    selectedItem.value = internalItems.value.find(item => getItemValue(item) === props.modelValue) || null;
    search.value = selectedItem.value ? getItemText(selectedItem.value) : '';
  }
});

// --- Dynamic Icon Computation ---
const showClearIcon = computed(() => props.clearable && (selectedItem.value || internalValue.value !== null));
const showDropdownIcon = computed(() => !props.loading && !showClearIcon.value);

// Function to get icon SVG based on condition
const getSuffixIcon = () => {
    if (props.loading) {
        return `
            <svg class="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
        `;
    }
    if (showClearIcon.value) {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M10 1.75a.75.75 0 01.75.75v9.5a.75.75 0 01-1.5 0v-9.5a.75.75 0 01.75-.75zM5.47 4.72a.75.75 0 00-1.06 1.06l3.97 3.97-3.97 3.97a.75.75 0 101.06 1.06l3.97-3.97 3.97 3.97a.75.75 0 101.06-1.06l-3.97-3.97 3.97-3.97a.75.75 0 00-1.06-1.06L10 8.03 6.03 4.06zM17.5 7.75a.75.75 0 00-.75.75v6.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012.5 15v-6.5a.75.75 0 00-1.5 0v6.5a3 3 0 003 3h9a3 3 0 003-3v-6.5a.75.75 0 00-.75-.75z" clip-rule="evenodd"/>
            </svg>
        `;
    }
    if (showDropdownIcon.value) {
        return `
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 ${isMenuOpen.value ? 'rotate-180' : ''}">
             <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.93l3.71-3.7a.75.75 0 011.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L3.13 8.3a.75.75 0 011.06-1.06z" clip-rule="evenodd" />
           </svg>
        `;
    }
    return ''; // No icon
};

// Determine which icon to display in the suffix position
const suffixIconSvg = computed(getSuffixIcon);

</script>

<template>
  <div
    :class="wrapperClasses"
    class="relative dir-rtl"
    @click.stop="toggleMenu"
  >
    <!-- Input Field Wrapper -->
    <div class="relative flex items-center w-full">
      <!-- Prepend Icon -->
      <span
        v-if="icon && iconPosition === 'left'"
        class="absolute top-3 text-gray-400 pointer-events-none z-10"
        :class="rtl ? 'left-3' : 'right-3'"
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
        class="peer w-full py-3 px-4 rounded-lg transition-all duration-300 outline-none border border-gray-300 focus:ring-primary focus:border-grey-dark focus:shadow-md"
        :class="{
          'bg-gray-100 text-gray-500 cursor-not-allowed': disabled,
          'border-red-500 focus:ring-red-300': error,
          // Padding adjustments based on icon/suffix position and RTL/LTR
          'pr-10': (icon && iconPosition === 'left' && !rtl) || (icon && iconPosition === 'right' && rtl) || (suffixIconSvg && !rtl), // Add padding if left icon (LTR) or right icon (RTL) or suffix icon (LTR)
          'pl-10': (icon && iconPosition === 'right' && !rtl) || (icon && iconPosition === 'left' && rtl) || (suffixIconSvg && rtl), // Add padding if right icon (LTR) or left icon (RTL) or suffix icon (RTL)
          // Specific padding for suffix icon slot
          'pr-10': suffixIconSvg && !rtl, // Suffix icon on the right (LTR)
          'pl-10': suffixIconSvg && rtl,  // Suffix icon on the left (RTL)
        }"
        :dir="rtl ? 'rtl' : 'ltr'"
      />

      <!-- Suffix Area: Clear Button or Dropdown Icon -->
      <div
        v-if="suffixIconSvg"
        class="absolute inset-y-0 flex items-center px-3 text-gray-500 z-10"
        :class="rtl ? 'left-3' : 'right-3'"
        @click.stop="showClearIcon ? clear() : toggleMenu()"
      >
        <span v-html="suffixIconSvg" class="flex items-center"></span>
      </div>

    </div>

    <!-- Dropdown Menu -->
    <transition name="autocomplete-menu">
      <div
        v-if="isMenuOpen"
        ref="menuRef"
        class="absolute w-full bg-white rounded-lg mt-2 py-2 z-50 border border-gray-200 shadow-lg"
        :class="rtl ? 'right-0' : 'left-0'"
        :style="{ ...menuProps }"
      >
        <!-- Menu Loading Indicator -->
        <div v-if="loading" class="flex justify-center items-center py-4">
          <svg class="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>

        <!-- Menu Items -->
        <ul v-else-if="filteredItems.length > 0">
          <li
            v-for="(item, index) in filteredItems"
            :key="index"
            @click.stop="selectItem(item)"
            class="cursor-pointer transition-colors"
            :class="{
              'bg-primary-light text-primary': selectedItem && getItemValue(item) === internalValue,
              'text-gray-700': selectedItem && getItemValue(item) !== internalValue,
              // --- Updated classes for RTL item padding ---
              'py-2': true,
              'hover:bg-primary-light hover:text-primary': true,
              'ps-4': true,  // padding-inline-start (right in RTL)
              'pe-2': true   // padding-inline-end (left in RTL)
            }"
          >
            {{ getItemText(item) }}
          </li>
        </ul>
        <div v-else class="px-4 py-2 text-gray-500">
          موردی یافت نشد.
        </div>
      </div>
    </transition>

    <!-- Error Message -->
    <p v-if="error" class="text-red-500 text-sm mt-1">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
/* Transition for the dropdown menu */
.autocomplete-menu-enter-active,
.autocomplete-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.autocomplete-menu-enter-from,
.autocomplete-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Styles for RTL */
/* These target the root element with .dir-rtl */
.dir-rtl input {
   text-align: right;
}
.dir-rtl input::placeholder {
    text-align: right;
}

/* Override Tailwind's default padding classes for RTL context */
/* Ensures ps/pe classes work correctly */
.dir-rtl .ps-4 { padding-inline-start: 1rem !important; } /* 1rem = 16px */
.dir-rtl .pe-2 { padding-inline-end: 0.5rem !important; } /* 0.5rem = 8px */

/* Adjusting absolute positioning for icons based on RTL */
/* Adjusting for left/right icons and suffix icons */
.dir-rtl .absolute.left-3 {
  left: 0.75rem !important; /* Default icon padding */
  right: auto !important;
}
.dir-rtl .absolute.right-3 {
  right: 0.75rem !important; /* Default icon padding */
  left: auto !important;
}

/* Specific padding adjustments for the input element itself */
/* This ensures the text doesn't overlap with icons */
.dir-rtl .pr-10 { padding-right: 2.5rem !important; } /* For LTR suffix icon or left icon */
.dir-rtl .pl-10 { padding-left: 2.5rem !important; }  /* For RTL suffix icon or right icon */

/* Explicitly set padding for input if suffix icon is present */
.dir-rtl input.has-suffix-icon {
    padding-left: 2.5rem !important; /* Suffix icon is on the left in RTL */
}
.dir-ltr input.has-suffix-icon {
    padding-right: 2.5rem !important; /* Suffix icon is on the right in LTR */
}

/* Apply RTL padding to list items explicitly */
.dir-rtl li.ps-4 { padding-inline-start: 1rem !important; }
.dir-rtl li.pe-2 { padding-inline-end: 0.5rem !important; }


/* Default input text alignment for LTR */
.dir-ltr input {
    text-align: left;
}
.dir-ltr input::placeholder {
    text-align: left;
}

/* Animation for spinning icon */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.rotate-180 {
  transform: rotate(180deg);
}

/* Utility classes for shadow, rounded, border */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.rounded-lg {
  border-radius: 0.5rem;
}
.border {
  border-width: 1px;
}
.border-gray-200 {
  border-color: #e5e7eb;
}
.focus\:ring-primary {
  --tw-ring-color: #6366f1; /* Assuming primary is indigo-500 */
}
.focus\:border-primary-dark {
    border-color: #4f46e5; /* Example darker primary */
}
.focus\:shadow-md {
    --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 transparent), var(--tw-ring-shadow, 0 0 transparent), var(--tw-shadow);
}
</style>
