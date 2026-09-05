<template>
 <div
  v-if="isHtml"
  class="html-content"
  v-html="value"
 ></div>

 <span v-else>
  {{value}}
 </span>
</template>

<script setup>
import{
 computed
}from'vue'

const props=defineProps({
 value:{
  type:[String,Number],
  default:''
 }
})

const isHtml=computed(()=>{
 if(typeof props.value!=='string')
  return false

 return /<\/?[a-z][\s\S]*>/i.test(props.value)
})
</script>

<style scoped>
.html-content{
 direction:rtl;
}

.html-content :deep(p){
 margin:0 0 10px;
 line-height:2.15;
}

.html-content :deep(p:last-child){
 margin-bottom:0;
}

.html-content :deep(strong){
 font-weight:800;
}

.html-content :deep(br){
 line-height:2;
}

.html-content :deep(ul){
 list-style:disc;
 padding-right:20px;
}

.html-content :deep(ol){
 list-style:decimal;
 padding-right:20px;
}
</style>