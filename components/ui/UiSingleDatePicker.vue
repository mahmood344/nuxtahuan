<script setup>
import {
  computed,
  ref,
  watch
} from 'vue'

const props=defineProps({
  modelValue:{
    type:[String,Array],
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

/*
 * مقدار تاریخ را به آرایه تبدیل می‌کند.
 *
 * پشتیبانی از:
 * ['1405/06/22','1405/06/25']
 *
 * و:
 * '1405/06/22,1405/06/25'
 */
const getDates=(value)=>{

  if(!value)
    return[]

  if(Array.isArray(value)){
    return value
      .map(item=>
        String(item||'').trim()
      )
      .filter(Boolean)
  }

  return String(value)
    .split(',')
    .map(item=>item.trim())
    .filter(Boolean)
}

/*
 * مقداری که فقط داخل Input نمایش داده می‌شود.
 */
const toPersianDigits=value=>
  String(value||'').replace(
    /\d/g,
    digit=>'۰۱۲۳۴۵۶۷۸۹'[Number(digit)]
  )

const toJalaliDate=value=>{
  const raw=String(value||'').trim()

  if(!raw)
    return''

  const normalized=
    raw.replace(/-/g,'/')

  const parts=
    normalized.split('/')

  if(parts.length!==3)
    return toPersianDigits(raw)

  const year=Number(parts[0])
  const month=Number(parts[1])
  const day=Number(parts[2])

  /*
   * اگر تاریخ از قبل شمسی باشد
   * فقط اعداد فارسی می‌شوند.
   *
   * مثال:
   * 1405/06/22
   */
  if(year<1700){
    return toPersianDigits(
      `${String(year).padStart(4,'0')}/${String(month).padStart(2,'0')}/${String(day).padStart(2,'0')}`
    )
  }

  /*
   * اگر تاریخ میلادی باشد
   * به شمسی تبدیل می‌شود.
   *
   * مثال:
   * 2026/09/13
   */
  const dateValue=new Date(
    year,
    month-1,
    day,
    12,
    0,
    0
  )

  if(
    Number.isNaN(
      dateValue.getTime()
    )
  ){
    return toPersianDigits(raw)
  }

  return new Intl.DateTimeFormat(
    'fa-IR-u-ca-persian',
    {
      year:'numeric',
      month:'2-digit',
      day:'2-digit'
    }
  ).format(dateValue)
}
const displayValue=computed(()=>{

  const dates=
    getDates(date.value)

  const from=
    String(dates[0]||'').trim()

  const to=
    String(dates[1]||'').trim()

  if(
    from&&
    to
  ){
    return `از ${toJalaliDate(from)} تا ${toJalaliDate(to)}`
  }

  if(from){
    return `از ${toJalaliDate(from)}`
  }

  return''
})

watch(
  ()=>props.modelValue,
  value=>{
    date.value=
      value||''
  },
  {
    deep:true
  }
)

watch(
  date,
  value=>{

    const result=
      value||''

    emit(
      'update:modelValue',
      result
    )

    emit(
      'change',
      result
    )

    /*
     * فقط وقتی هر دو تاریخ
     * ورود و خروج انتخاب شدند
     * تقویم بسته شود.
     */
    const dates=
      getDates(result)

    if(
      dates[0]&&
      dates[1]
    ){
      showPicker.value=false
    }
  },
  {
    deep:true
  }
)
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
  :model-value="displayValue"
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