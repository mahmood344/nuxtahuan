<template>
  <section class="voucher-section">
    <div class="voucher-section-title">
      {{ title }}
    </div>

    <div class="voucher-section-body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
 title:string
}>()
</script>

<style scoped>
.voucher-section{
  padding:0 12px 11px;
}

.voucher-section-title{
  border:1px solid #9ca3af;
  border-bottom:0;
  padding:5px 8px;
  text-align:center;
  font-size:14px;
  font-weight:900;
}

.voucher-section-body{
  width:100%;
}
</style>