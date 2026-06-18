<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  // Icon can be an SVG string or a class for an icon font
  icon: {
    type: String,
    default: ''
  },
  // 'left' or 'right' defines which side the icon visually appears on
  iconPosition: {
    type: String,
    default: 'left' // Default to left
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  rtl: {
    type: Boolean,
    default: true // Default to RTL
  }
});

const emit = defineEmits(['update:modelValue']);

const isFocused = ref(false);

// --- Computed Properties ---

// Classes for the main wrapper div
const wrapperClasses = computed(() => {
  return `relative mb-6 ${props.rtl ? 'dir-rtl' : 'dir-ltr'}`;
});

// Classes for the input element itself
const inputClasses = computed(() => {
  const basePaddingX = 'px-4'; // Default horizontal padding
  const labelPadding = props.label ? (props.rtl ? 'pr-10' : 'pl-10') : ''; // Padding for label space
  const iconPadding = props.icon ? (props.rtl ? 'pr-10' : 'pl-10') : ''; // Padding for icon space

  // If icon is on the right visually in LTR, it needs left padding.
  // If icon is on the left visually in RTL, it needs right padding.
  let effectiveIconPadding = '';
  if (props.icon) {
    if (props.rtl) {
      if (props.iconPosition === 'left') effectiveIconPadding = 'pr-10'; // Icon on the left edge needs padding on the right
      else effectiveIconPadding = 'pl-10'; // Icon on the right edge needs padding on the left
    } else {
      if (props.iconPosition === 'left') effectiveIconPadding = 'pl-10'; // Icon on the left edge needs padding on the left
      else effectiveIconPadding = 'pr-10'; // Icon on the right edge needs padding on the right
    }
  }

  // Loading indicator padding (adjusts based on icon position)
  let loadingPadding = '';
  if (props.loading) {
    if (props.rtl) {
        loadingPadding = props.iconPosition === 'left' ? 'pr-10' : 'pl-10'; // Matches icon padding adjustment
    } else {
        loadingPadding = props.iconPosition === 'left' ? 'pl-10' : 'pr-10';
    }
  }

  return [
    'peer w-full py-3 rounded-lg transition-all duration-300 outline-none',
    basePaddingX,
    props.label ? (props.rtl ? 'pr-10' : 'pl-10') : '', // Add padding for label if present
    effectiveIconPadding, // Padding for icon
    loadingPadding,       // Padding for loading spinner
    'bg-white text-gray-800 border',
    props.disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '',
    props.error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary focus:border-primary-dark',
  ];
});

// Classes for the label element
const labelClasses = computed(() => {
  const base = 'absolute top-3 text-gray-500 transition-all duration-300';
  const focusStyles = 'text-primary -top-3 text-sm';
  const errorStyles = '!text-red-500 peer-focus:!text-red-500';

  // Positioning based on direction and icon
  let positionClasses = '';
  if (props.rtl) {
    positionClasses = props.icon && props.iconPosition === 'left' ? 'right-10' : 'right-4'; // Icon on left visually = need more space on right for label
    if (props.modelValue || isFocused.value) {
      positionClasses += ' -top-3 !right-4 text-sm'; // Label moves up and aligns right
    }
  } else { // LTR
    positionClasses = props.icon && props.iconPosition === 'right' ? 'left-10' : 'left-4'; // Icon on right visually = need more space on left for label
     if (props.modelValue || isFocused.value) {
      positionClasses += ' -top-3 !left-4 text-sm'; // Label moves up and aligns left
    }
  }

  return [
    base,
    positionClasses,
    props.error ? errorStyles : '',
    props.disabled ? 'text-gray-400' : '',
    props.loading ? 'opacity-50' : '',
  ];
});

// Classes for the icon span
const iconSpanClasses = computed(() => {
  const base = 'absolute top-3 text-gray-400 peer-focus:text-primary';
  let positionClass = '';

  if (props.rtl) {
    positionClass = props.iconPosition === 'left' ? 'left-3' : 'right-3'; // Icon on left edge or right edge
  } else { // LTR
    positionClass = props.iconPosition === 'left' ? 'left-3' : 'right-3';
  }
  return `${base} ${positionClass}`;
});

// Classes for the loading indicator div
const loadingIndicatorClasses = computed(() => {
    let positionClass = '';
    if (props.rtl) {
        // Spinner should be on the side opposite to the text input direction if icon is there
        positionClass = props.iconPosition === 'left' ? 'left-0' : 'right-0';
    } else { // LTR
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
    <label
      v-if="label"
      :class="labelClasses"
    >
      {{ label }}
    </label>

    <div class="relative flex items-center w-full">
      <!-- Icon -->
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

      <!-- Loading Indicator -->
      <div v-if="loading" :class="loadingIndicatorClasses">
        <svg class="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-red-500 text-sm mt-1">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
/* Elevation styles */
.elevation-0 { box-shadow: var(--elevation-0); }
.elevation-1 { box-shadow: var(--elevation-1); }
.elevation-2 { box-shadow: var(--elevation-2); }
.elevation-3 { box-shadow: var(--elevation-3); }

/* Placeholder color */
input::placeholder {
  color: var(--color-gray-400);
}

/* Base RTL adjustments */
.dir-rtl {
  direction: rtl;
}
.dir-rtl input {
   /* Ensure input text is right-aligned when placeholder is shown */
   text-align: right;
}

/* Specific label positioning adjustments for RTL */
/* When label is active (focused or has value) */
.dir-rtl .peer-focus:-top-3.right-4,
.dir-rtl .peer:not(:placeholder-shown).right-4 {
  transform: translateY(-1.5rem) scale(0.85);
}

/* Adjustments for icon padding based on direction */
/* These Tailwind classes should already handle this, but explicit overrides can help */
.dir-rtl .pr-10 { padding-right: 2.5rem !important; } /* For icon on the left edge */
.dir-rtl .pl-10 { padding-left: 2.5rem !important; }  /* For icon on the right edge */

/* Ensure text direction is correct within the input */
.dir-rtl input:not([dir]),
.dir-rtl textarea:not([dir]) {
  direction: rtl;
}

/* Re-align placeholder in RTL */
.dir-rtl input::placeholder {
    text-align: right;
}

/* Override label positioning to ensure it stays on the right edge when moved up */
.dir-rtl label.right-4 {
    right: 1rem; /* Default right alignment */
}
.dir-rtl label.-top-3.right-4 {
    right: 1rem; /* Keep it right when moved up */
}
/* Make sure label is correctly positioned relative to the input */
/* The classes in labelClasses handle most of this, but explicit CSS ensures consistency */
.dir-rtl label {
    /* Example: Adjust if needed */
}

</style>