<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div
    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium"
    style="background-color: #EEEEEE; color: #666666;"
  >
    <span
      v-if="icon"
      class="w-4 h-4 flex items-center justify-center"
      v-html="icon"
    ></span>
    <span>{{ text }}</span>
  </div>
</template>
