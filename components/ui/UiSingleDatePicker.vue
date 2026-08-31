<script setup>
import{ref,watch}from'vue'

const props=defineProps({
  modelValue:{
    type:String,
    default:''
  },
  label:{
    type:String,
    default:'تاریخ'
  },
  placeholder:{
    type:String,
    default:'انتخاب تاریخ'
  },
  minDate:{
    type:String,
    default:''
  }
})

const emit=defineEmits([
  'update:modelValue',
  'change'
])

const date=ref(
  props.modelValue||''
)

const showPicker=ref(false)

const styles={
  'primary-color':'var(--color-primary)',
  'secondary-color':'var(--color-primary)',
  'in-range-background':'var(--color-primary-light)'
}

const openPicker=()=>{
  showPicker.value=true
}

const clearDate=(event)=>{
  event?.stopPropagation()

  date.value=''
  showPicker.value=false
}

watch(
  ()=>props.modelValue,
  value=>{
    if(value!==date.value){
      date.value=value||''
    }
  }
)

watch(date,value=>{
  const result=value||''

  emit(
    'update:modelValue',
    result
  )

  emit(
    'change',
    result
  )

  if(result){
    showPicker.value=false
  }
})
</script>

<template>
  <div
    class="relative w-full"
    dir="rtl"
  >

    <div
      class="relative cursor-pointer"
      @click="openPicker"
    >
      <UiBaseInput
        :model-value="date"
        :label="label"
        :placeholder="placeholder"
        readonly
        icon='<i class="bi bi-calendar3"></i>'
        icon-position="right"
        input-class="cursor-pointer"
        class="!mb-0"
      />

      <button
        v-if="date"
        type="button"
        class="absolute top-1/2 left-10 z-30 -translate-y-1/2 text-[var(--color-gray-400)] hover:text-[var(--color-red-500)]"
        @click.stop="clearDate"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <PersianDatePicker
      v-model="date"
      mode="range"
      class="hidden"
      :styles="styles"
      :show="showPicker"
      :auto-submit="false"
      format="YYYY/MM/DD"
      locale="fa,en"
      :min="minDate||undefined"
      @close="showPicker=false"
    >
      <template #icon></template>

      <template #footer>
        {{ label }}
      </template>
    </PersianDatePicker>

  </div>
</template>