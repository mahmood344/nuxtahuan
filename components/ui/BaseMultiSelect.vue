<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
const props = defineProps({ modelValue:{type:Array,default:()=>[]}, items:{type:Array,default:()=>[]}, label:String, placeholder:{type:String,default:'جستجو...'}, itemText:{type:String,default:'name'}, itemValue:{type:String,default:'id'}, disabled:Boolean, selectAll:Boolean })
const emit = defineEmits(['update:modelValue'])
const query=ref(''), open=ref(false), root=ref(null), input=ref(null)
const valueOf=x=>typeof x==='object'?x[props.itemValue]:x
const textOf=x=>typeof x==='object'?x[props.itemText]:x
const selected=computed(()=>props.items.filter(x=>props.modelValue.includes(valueOf(x))))
const visible=computed(()=>props.items.filter(x=>String(textOf(x)).toLowerCase().includes(query.value.trim().toLowerCase())))
const allSelected=computed(()=>props.items.length>0 && props.items.every(x=>props.modelValue.includes(valueOf(x))))
function toggle(v,checked){if(props.disabled)return;emit('update:modelValue',checked?[...new Set([...props.modelValue,v])]:props.modelValue.filter(x=>x!==v))}
function toggleAll(v){if(!props.disabled)emit('update:modelValue',v?props.items.map(valueOf):[])}
function close(){open.value=false;query.value=''}
function outside(e){if(!root.value?.contains(e.target))close()}
function focus(){if(!props.disabled){open.value=true;input.value?.focus()}}
watch(()=>props.disabled,v=>{if(v)close()})
onMounted(()=>document.addEventListener('pointerdown',outside,true))
onBeforeUnmount(()=>document.removeEventListener('pointerdown',outside,true))
</script>
<template>
  <div ref="root" class="multi" dir="rtl" @keydown.esc.stop="close">
    <label class="multi-label" @click="focus">{{ label }}</label>
    <div class="multi-field" :class="{active:open,disabled}" @click="focus">
      <span v-for="x in selected" :key="valueOf(x)" class="multi-chip">{{ textOf(x) }}<button type="button" :disabled="disabled" aria-label="حذف انتخاب" @click.stop="toggle(valueOf(x),false)">×</button></span>
      <input ref="input" v-model="query" type="text" :aria-label="label" :aria-expanded="open" :placeholder="selected.length ? 'جستجو...' : placeholder" :disabled="disabled" @focus="open=true" @input="open=true" />
      <button type="button" class="multi-arrow" :disabled="disabled" aria-label="باز و بسته کردن فهرست" @click.stop="open ? close() : focus()"><i :class="open?'bi bi-chevron-up':'bi bi-chevron-down'"></i></button>
    </div>
    <div v-if="open && !disabled" class="multi-menu">
      <div v-if="selectAll && items.length" class="multi-option multi-all" role="option" tabindex="0" :aria-selected="allSelected" @click="toggleAll(!allSelected)" @keydown.enter.prevent="toggleAll(!allSelected)" @keydown.space.prevent="toggleAll(!allSelected)">
        <span>انتخاب همه کلیدداران</span><i v-if="allSelected" class="bi bi-check2"></i>
      </div>
      <div class="multi-options" role="listbox" aria-multiselectable="true">
        <div v-for="x in visible" :key="valueOf(x)" class="multi-option" :class="{chosen:modelValue.includes(valueOf(x))}" role="option" tabindex="0" :aria-selected="modelValue.includes(valueOf(x))" @click="toggle(valueOf(x),!modelValue.includes(valueOf(x)))" @keydown.enter.prevent="toggle(valueOf(x),!modelValue.includes(valueOf(x)))" @keydown.space.prevent="toggle(valueOf(x),!modelValue.includes(valueOf(x)))">
          <span>{{ textOf(x) }}</span><i v-if="modelValue.includes(valueOf(x))" class="bi bi-check2"></i>
        </div>
        <small v-if="!visible.length">موردی یافت نشد.</small>
      </div>
    </div>
  </div>
</template>
<style scoped>
.multi{display:grid;gap:6px;min-width:0;position:relative}.multi-label{font-size:13px;font-weight:700;cursor:text}.multi-field{display:flex;align-items:center;flex-wrap:wrap;gap:6px;min-height:54px;max-height:150px;overflow:auto;padding:8px 12px;border:1px solid var(--color-gray-300,#ddd);border-radius:10px;background:#fff;cursor:text}.multi-field.active{border-color:var(--color-primary,#2629a6)}.multi-field.disabled{opacity:.6;cursor:not-allowed}.multi-field input{flex:1;min-width:85px;width:0;border:0;outline:none;background:transparent;font:inherit;font-size:13px;color:inherit}.multi-chip{display:inline-flex;align-items:center;gap:7px;padding:4px 9px;border-radius:8px;background:var(--color-gray-100,#f2f3f8);color:var(--color-primary-dark,#2629a6);font-size:12px}.multi-chip button,.multi-arrow{border:0;background:none;cursor:pointer;color:inherit}.multi-menu{border:1px solid var(--color-gray-300,#ddd);border-radius:10px;padding:8px 12px;background:white;box-shadow:0 5px 16px #0001}.multi-options{max-height:180px;overflow:auto}.multi-option{padding:6px 0}.multi-all{border-bottom:1px solid var(--color-gray-200,#eee);margin-bottom:5px}

.multi-option{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;cursor:pointer;border-radius:6px;font-size:13px;outline:none}.multi-option:hover,.multi-option:focus-visible{background:var(--color-gray-100,#f5f5f7)}.multi-option.chosen{background:var(--color-primary-light,#eef0ff);color:var(--color-primary-dark,#2629a6)}.multi-option i{font-size:16px}.multi-menu{padding:5px}.multi-all{border-radius:0;margin-bottom:4px}
.multi-chip button{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;width:30px;height:30px;padding:0;font-size:26px;font-weight:600;line-height:1;border-radius:6px}.multi-chip button:hover:not(:disabled){background:#e0e3ef}.multi-chip button:focus-visible{outline:2px solid var(--color-primary,#2629a6)}
</style>
