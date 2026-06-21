<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    required: true,
  },
  value: {
    type: [String, Number, Boolean],
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'var(--color-primary)',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const handleChange = () => {
  if (!props.disabled) {
    emit('update:modelValue', props.value)
  }
}
</script>

<template>
  <label
    class="flex items-center gap-3 select-none"
    :class="[disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']"
  >
    <input
      type="radio"
      class="hidden"
      :checked="modelValue === value"
      :disabled="disabled"
      @change="handleChange"
    />

    <div
      class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0"
      :style="{
        borderColor: color,
        backgroundColor: 'var(--color-white)',
      }"
    >
      <div
        v-if="modelValue === value"
        class="w-2.5 h-2.5 rounded-full"
        :style="{ backgroundColor: color }"
      ></div>
    </div>

    <span
      v-if="label"
      :style="{
        color: disabled
          ? 'var(--color-gray-400)'
          : 'var(--color-gray-700)'
      }"
    >
      {{ label }}
    </span>
  </label>
</template>
