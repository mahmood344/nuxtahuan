<template>
  <section
    class="rounded-3xl border border-[var(--color-gray-100)] bg-white p-4 shadow-sm"
    dir="rtl"
  >
    <div class="mb-5 flex items-center justify-between gap-3">
      <div>
        <h3 class="text-[14px] font-black text-[var(--color-gray-800)]">
          فیلتر اتاق‌ها
        </h3>
        <p class="mt-1 text-[10px] text-[var(--color-gray-400)]">
          نتایج اتاق‌ها را دقیق‌تر کنید
        </p>
      </div>

      <UiBaseButton
        label="پاک کردن"
        variant="soft"
        color="primary"
        class="!rounded-full !px-3 !py-2 text-[10px]"
        @click="resetFilters"
      />
    </div>

    <div class="space-y-6">
      <!-- Price -->
      <div v-if="priceLimits[1] > 0">
        <div class="mb-3 flex items-center justify-between gap-3">
          <span class="text-[11px] font-bold text-[var(--color-gray-700)]">
            بازه قیمت
          </span>

          <span
            class="text-[10px] text-[var(--color-gray-500)]"
            dir="rtl"
          >
            <template v-if="canFilterByPrice">
              {{ formatPrice(priceRangeModel[0]) }}
              تا
              {{ formatPrice(priceRangeModel[1]) }}
              ریال
            </template>

            <template v-else>
              {{ formatPrice(priceLimits[0]) }}
              ریال
            </template>
          </span>
        </div>

        <div
          :class="
            canFilterByPrice
              ?''
              :'pointer-events-none opacity-40'
          "
        >
          <UiBaseRangeSlider
            v-model="priceRangeModel"
            :min="priceLimits[0]"
            :max="priceLimits[1]"
            :step="priceStep"
            :formatValue="formatPrice"
          />
        </div>

        <p
          v-if="!canFilterByPrice"
          class="mt-2 text-[10px] leading-5 text-[var(--color-gray-400)]"
        >
          برای فعال شدن فیلتر قیمت، حداقل دو قیمت متفاوت باید موجود باشد.
        </p>
      </div>

      <!-- Availability -->
      <div class="space-y-3 border-t border-[var(--color-gray-100)] pt-5 text-[13px]">
        <UiBaseCheckbox
          v-model="availableOnlyModel"
          label="فقط اتاق‌های قابل رزرو"
        />

        <UiBaseCheckbox
          v-model="extraBedOnlyModel"
          label="دارای تخت اضافه"
        />
      </div>

      <!-- Breakfast -->
      <div class="border-t border-[var(--color-gray-100)] pt-5">
        <p class="mb-3 text-[11px] font-bold text-[var(--color-gray-700)]">
          نوع اقامت
        </p>

        <div class="space-y-2 text-[13px]">
          <UiBaseCheckbox
            v-model="withBreakfastModel"
            label="با صبحانه"
          />

          <UiBaseCheckbox
            v-model="withoutBreakfastModel"
            label="بدون صبحانه"
          />
        </div>
      </div>

      <!-- Capacity -->
      <div
        v-if="capacityOptions.length"
        class="border-t border-[var(--color-gray-100)] pt-5"
      >
        <p class="mb-3 text-[11px] font-bold text-[var(--color-gray-700)]">
          ظرفیت اتاق
        </p>

        <div class="grid grid-cols-2 gap-2 text-[13px]">
          <UiBaseCheckbox
            v-for="capacity in capacityOptions"
            :key="capacity"
            :model-value="selectedCapacities.includes(capacity)"
            :label="`${capacity} نفره`"
            @update:model-value="toggleCapacity(capacity,$event)"
          />
        </div>
      </div>

      <!-- View -->
      <div
        v-if="roomViewOptions.length"
        class="border-t border-[var(--color-gray-100)] pt-5"
      >
        <p class="mb-3 text-[11px] font-bold text-[var(--color-gray-700)]">
          نمای اتاق
        </p>

        <div class="space-y-2 text-[13px]">
          <UiBaseCheckbox
            v-for="view in roomViewOptions"
            :key="view"
            :model-value="selectedRoomViews.includes(view)"
            :label="view"
            @update:model-value="toggleRoomView(view,$event)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {computed,ref,watch} from 'vue'

const props=defineProps({
  filters:{
    type:Object,
    default:()=>({})
  },

  allRoomsData:{
    type:Array,
    default:()=>[]
  }
})

const emit=defineEmits([
  'update:filters'
])

const roomPrice=room=>
  Number(
    room?.calculatedPrice||
    room?.priceFrom||
    0
  )

const priceLimits=computed(()=>{

  const prices=
    props.allRoomsData
      .map(roomPrice)
      .filter(price=>
        Number.isFinite(price)&&
        price>0
      )

  if(!prices.length)
    return[0,0]

  return[
    Math.min(...prices),
    Math.max(...prices)
  ]

})

const validPrices=computed(()=>
  props.allRoomsData
    .map(roomPrice)
    .filter(price=>
      Number.isFinite(price)&&
      price>0
    )
)

const uniqueValidPrices=computed(()=>
  [
    ...new Set(validPrices.value)
  ].sort((a,b)=>a-b)
)

const canFilterByPrice=computed(()=>
  uniqueValidPrices.value.length>1
)

const priceStep=computed(()=>{

  const max=priceLimits.value[1]

  if(max>=100_000_000)
    return 1_000_000

  if(max>=10_000_000)
    return 500_000

  if(max>=1_000_000)
    return 100_000

  return 10_000

})

const capacityOptions=computed(()=>
  [
    ...new Set(
      props.allRoomsData
        .map(room=>Number(room?.capacity||0))
        .filter(capacity=>capacity>0)
    )
  ].sort((a,b)=>a-b)
)

const roomViewOptions=computed(()=>
  [
    ...new Set(
      props.allRoomsData
        .map(room=>
          String(room?.roomView||'').trim()
        )
        .filter(view=>
          view&&
          view!=='-'&&
          view!=='----'
        )
    )
  ]
)

const selectedCapacities=computed(()=>
  Array.isArray(props.filters?.capacities)
    ?props.filters.capacities
    :[]
)

const selectedRoomViews=computed(()=>
  Array.isArray(props.filters?.roomViews)
    ?props.filters.roomViews
    :[]
)

function updateFilter(key,value){

  emit(
    'update:filters',
    {
      ...props.filters,
      [key]:value
    }
  )

}

const priceRangeModel=ref([0,0])

watch(
  priceLimits,
  limits=>{

    const min=Number(limits?.[0]||0)
    const max=Number(limits?.[1]||0)

    priceRangeModel.value=[
      min,
      max
    ]

  },
  {
    immediate:true
  }
)

watch(
  ()=>props.filters?.priceRange,
  value=>{

    if(
      !Array.isArray(value)||
      value.length!==2
    ){
      priceRangeModel.value=[
        ...priceLimits.value
      ]
      return
    }

    const min=Number(value[0])
    const max=Number(value[1])

    if(
      !Number.isFinite(min)||
      !Number.isFinite(max)
    ){
      return
    }

    priceRangeModel.value=[
      Math.min(min,max),
      Math.max(min,max)
    ]

  },
  {
    deep:true
  }
)

watch(
  priceRangeModel,
  value=>{

    if(!canFilterByPrice.value)
      return

    if(
      !Array.isArray(value)||
      value.length!==2
    ){
      return
    }

    const min=Number(value[0])
    const max=Number(value[1])

    if(
      !Number.isFinite(min)||
      !Number.isFinite(max)
    ){
      return
    }

    updateFilter(
      'priceRange',
      [
        Math.min(min,max),
        Math.max(min,max)
      ]
    )

  },
  {
    deep:true
  }
)

const availableOnlyModel=computed({
  get:()=>props.filters?.availableOnly===true,
  set:value=>updateFilter('availableOnly',value)
})

const extraBedOnlyModel=computed({
  get:()=>props.filters?.extraBedOnly===true,
  set:value=>updateFilter('extraBedOnly',value)
})

const withBreakfastModel=computed({
  get:()=>props.filters?.withBreakfast!==false,
  set:value=>updateFilter('withBreakfast',value)
})

const withoutBreakfastModel=computed({
  get:()=>props.filters?.withoutBreakfast!==false,
  set:value=>updateFilter('withoutBreakfast',value)
})

function toggleCapacity(
  capacity,
  checked
){

  const current=[
    ...selectedCapacities.value
  ]

  const next=
    checked
      ?[
        ...new Set([
          ...current,
          capacity
        ])
      ]
      :current.filter(
        item=>item!==capacity
      )

  updateFilter(
    'capacities',
    next
  )

}

function toggleRoomView(
  view,
  checked
){

  const current=[
    ...selectedRoomViews.value
  ]

  const next=
    checked
      ?[
        ...new Set([
          ...current,
          view
        ])
      ]
      :current.filter(
        item=>item!==view
      )

  updateFilter(
    'roomViews',
    next
  )

}

function resetFilters(){

  priceRangeModel.value=[
    ...priceLimits.value
  ]

  emit(
    'update:filters',
    {
      priceRange:null,
      capacities:[],
      roomViews:[],
      withBreakfast:true,
      withoutBreakfast:true,
      availableOnly:false,
      extraBedOnly:false
    }
  )

}

function formatPrice(value){

  return Number(value||0)
    .toLocaleString('fa-IR')

}
</script>
