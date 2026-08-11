<template>
  <div
    v-if="hasValidFlights"
    dir="rtl"
    class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
  >
    <!-- فیلتر ساعت -->
    <div>
      <h3 class="mb-5 text-sm font-bold text-gray-800">
        ساعت حرکت
      </h3>

      <div dir="ltr">
        <UiBaseRangeSlider
          v-model="selectedRange"
          :min="timeRangeLimits[0]"
          :max="timeRangeLimits[1]"
          :step="30"
        />

        <div class="mt-4 flex items-center justify-between">
          <div class="rounded-lg bg-gray-50 px-3 py-2 text-xs">
            <span class="font-bold text-primary">
              {{ formatTime(selectedRange[0]) }}
            </span>
          </div>

          <div class="rounded-lg bg-gray-50 px-3 py-2 text-xs">
            <span class="font-bold text-primary">
              {{ formatTime(selectedRange[1]) }}
            </span>
          </div>
        </div>
      </div>

      <button
        v-if="isRangeChanged"
        type="button"
        class="mt-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
        @click="resetRange"
      >
        نمایش تمام ساعت‌ها
      </button>
    </div>

    <!-- جداکننده -->
    <div class="my-5 h-px bg-gray-200"></div>

    <!-- فیلتر نوع کابین -->
    <div>
      <h3 class="mb-4 text-sm font-bold text-gray-800">
        نوع بلیت
      </h3>

      <div class="space-y-3">
  <UiBaseCheckbox
    v-model="economySelected"
    label="اکونومی"
    :disabled="!availableCabins.economy"
  />

  <UiBaseCheckbox
    v-model="premiumEconomySelected"
    label="پریمیوم اکونومی"
    :disabled="!availableCabins.premiumEconomy"
  />

  <UiBaseCheckbox
    v-model="businessSelected"
    label="بیزینس"
    :disabled="!availableCabins.business"
  />

  <UiBaseCheckbox
    v-model="premiumBusinessSelected"
    label="پریمیوم بیزینس"
    :disabled="!availableCabins.premiumBusiness"
  />

  <UiBaseCheckbox
    v-model="firstSelected"
    label="فرست کلاس"
    :disabled="!availableCabins.first"
  />

  <UiBaseCheckbox
    v-model="premiumFirstSelected"
    label="پریمیوم فرست کلاس"
    :disabled="!availableCabins.premiumFirst"
  />
</div>

      <p
  v-if="
    !economySelected&&
    !premiumEconomySelected&&
    !businessSelected&&
    !premiumBusinessSelected&&
    !firstSelected&&
    !premiumFirstSelected
  "
  class="mt-3 text-xs font-bold text-red-500"
>
  حداقل یک نوع بلیت را انتخاب کنید.
</p>

      <button
        v-if="isCabinFilterChanged"
        type="button"
        class="mt-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
        @click="resetCabinFilters"
      >
        نمایش همه کلاس‌ها
      </button>
    </div>
    <div class="my-5 h-px bg-gray-200"></div>

<!-- فیلتر ایرلاین -->
<div v-if="availableAirlines.length">
  <div class="mb-4 flex items-center justify-between">
    <h3 class="text-sm font-bold text-gray-800">
      شرکت هواپیمایی
    </h3>

    <button
      v-if="isAirlineFilterChanged"
      type="button"
      class="text-[11px] font-bold text-blue-600"
      @click="resetAirlineFilters"
    >
      نمایش همه
    </button>
  </div>

  <div class="max-h-[260px] space-y-3 overflow-y-auto pl-1">
    <UiBaseCheckbox
      v-for="airline in availableAirlines"
      :key="airline.code"
      :model-value="isAirlineSelected(airline.code)"
      :label="airline.name"
      :custom-image="airline.logo"
      @update:model-value="toggleAirline(airline.code,$event)"
    />
  </div>

  <p
    v-if="!selectedAirlines.length"
    class="mt-3 text-[11px] text-gray-400"
  >
    همه شرکت‌های هواپیمایی نمایش داده می‌شوند.
  </p>
</div>
  </div>
</template>

<script setup>
import{computed,ref,watch}from'vue'
import { useFlightStore } from '~/stores/flights'
const flightStore = useFlightStore()
const props=defineProps({
  allFlightsData:{
    type:Array,
    default:()=>[]
  },
  filters:{
    type:Object,
    required:true
  }
})
function normalizeAirlineCode(value) {
  return String(value ?? '')
    .trim()
    .toUpperCase()
}
function getAirlineCode(flight) {
  return normalizeAirlineCode(
    flight?.airline ||
    flight?.airlineCode ||
    flight?.carrierCode ||
    flight?.stepfindip ||
    flight?.stepFindIp ||
    flight?.marketingAirline ||
    flight?.operatingAirline ||
    flight?.meta?.raw?.Airline ||
    flight?.meta?.raw?.airline ||
    flight?.meta?.raw?.airlineCode ||
    flight?.meta?.raw?.OperatingAirline ||
    ''
  )
}
function getAirlineName(flight,code) {
  const airlineFromStore =
    flightStore?.airlines?.find(
      (item) =>
        normalizeAirlineCode(
          item?.code ||
          item?.iataCode ||
          item?.airlineCode
        ) === code
    )

  return String(
    flight?.airlineNameFarsi ||
    flight?.airlineName ||
    flight?.meta?.raw?.AirlineNameFarsi ||
    flight?.meta?.raw?.AirlineName ||
    airlineFromStore?.nameFarsi ||
    airlineFromStore?.name ||
    code
  ).trim()
}
function getAirlineLogo(flight,code) {
  const airlineFromStore =
    flightStore?.airlines?.find(
      (item) =>
        normalizeAirlineCode(
          item?.code ||
          item?.iataCode ||
          item?.airlineCode
        ) === code
    )

  return String(
    flight?.airlineLogo ||
    flight?.logo ||
    airlineFromStore?.logo ||
    airlineFromStore?.image ||
    ''
  ).trim()
}
const availableAirlines = computed(() => {
  const airlineMap = new Map()

  for (const flight of props.allFlightsData) {
    const code = getAirlineCode(flight)

    if (!code || airlineMap.has(code)) continue

    airlineMap.set(code,{
      code,
      name: getAirlineName(flight,code),
      logo: getAirlineLogo(flight,code)
    })
  }

  return Array.from(airlineMap.values())
    .sort((a,b) =>
      a.name.localeCompare(
        b.name,
        'fa'
      )
    )
})
const selectedAirlines = computed(() => {
  return Array.isArray(
    props.filters?.airlines
  )
    ? props.filters.airlines
        .map(normalizeAirlineCode)
        .filter(Boolean)
    : []
})

const isAirlineFilterChanged = computed(() => {
  return selectedAirlines.value.length > 0
})

function isAirlineSelected(code) {
  /*
   * آرایه خالی یعنی همه ایرلاین‌ها فعال‌اند.
   */
  if (!selectedAirlines.value.length) {
    return true
  }

  return selectedAirlines.value.includes(
    normalizeAirlineCode(code)
  )
}
const emit=defineEmits(['update:filters'])
const initializedRange=ref(false)

const flightClasses={
  IV:{business:['C','CR','CM']},
  VR:{business:['WB']},
  Y9:{business:['CPA','C']},
  J1:{business:['Z']}
}

function normalizeCode(value){
  return String(value??'').trim().toUpperCase()
}

function getFlightAirlineCode(flight){
  return normalizeCode(
    flight?.airline||
    flight?.airlineCode||
    flight?.carrierCode||
    flight?.stepfindip||
    flight?.stepFindIp||
    flight?.meta?.raw?.Airline||
    flight?.meta?.raw?.airline||
    flight?.meta?.raw?.airlineCode||
    ''
  )
}
function resetAirlineFilters() {
  emit('update:filters',{
    ...props.filters,
    airlines: []
  })
}
function getFlightBookingClass(flight){
  return normalizeCode(
    flight?.bookingClass||
    flight?.rbd||
    flight?.cabinClass||
    flight?.flightClass||
    flight?.classCode||
    flight?.meta?.rbd||
    flight?.meta?.raw?.RBD||
    flight?.meta?.raw?.rbd||
    flight?.meta?.raw?.BookingClass||
    flight?.meta?.raw?.bookingClass||
    ''
  )
}
function toggleAirline(code,checked) {
  const normalizedCode =
    normalizeAirlineCode(code)

  let nextAirlines =
    selectedAirlines.value.length
      ? [...selectedAirlines.value]
      : availableAirlines.value.map(
          (item) => item.code
        )

  if (checked) {
    if (!nextAirlines.includes(normalizedCode)) {
      nextAirlines.push(normalizedCode)
    }
  } else {
    nextAirlines = nextAirlines.filter(
      (item) => item !== normalizedCode
    )
  }

  /*
   * وقتی دوباره تمام ایرلاین‌ها انتخاب شدند،
   * آرایه را خالی می‌کنیم؛ خالی یعنی همه.
   */
  const allSelected =
    availableAirlines.value.length > 0 &&
    availableAirlines.value.every(
      (item) =>
        nextAirlines.includes(item.code)
    )

  emit('update:filters',{
    ...props.filters,
    airlines: allSelected
      ? []
      : nextAirlines
  })
}
function mapPartoCabinType(value){
  const cabinType=Number(value)

  switch(cabinType){
    case 1:return'economy'
    case 2:return'premiumEconomy'
    case 3:return'business'
    case 4:return'premiumBusiness'
    case 5:return'first'
    case 6:return'premiumFirst'
    default:return null
  }
}

function mapPartoCabinCode(value){
  const code=normalizeCode(value)

  switch(code){
    case'Y':return'economy'
    case'S':return'premiumEconomy'
    case'C':return'business'
    case'J':return'premiumBusiness'
    case'F':return'first'
    case'P':return'premiumFirst'
    default:return null
  }
}
function getPartoFlightCabinTypes(flight){
  const result=new Set()

  /*
   * تمام Segmentهای Map شده
   */
  const segments=Array.isArray(flight?.segments)
    ?flight.segments
    :[]

  for(const segment of segments){
    const type=
      mapPartoCabinType(
        segment?.cabinType
      )||
      mapPartoCabinCode(
        segment?.bookingClass||
        segment?.rbd
      )

    if(type){
      result.add(type)
    }
  }

  /*
   * Segmentهای برگشت
   */
  const returnSegments=
    Array.isArray(flight?.returnSegments)
      ?flight.returnSegments
      :[]

  for(const segment of returnSegments){
    const type=
      mapPartoCabinType(
        segment?.cabinType
      )||
      mapPartoCabinCode(
        segment?.bookingClass||
        segment?.rbd
      )

    if(type){
      result.add(type)
    }
  }

  /*
   * fallback روی خود Flight
   */
  if(!result.size){
    const type=
      mapPartoCabinType(
        flight?.cabinType
      )||
      mapPartoCabinCode(
        flight?.bookingClass||
        flight?.rbd
      )

    if(type){
      result.add(type)
    }
  }

  return[...result]
}
function getFlightCabinType(flight){
  const provider=normalizeCode(
    flight?.provider
  )

  /*
   * PARTO
   */
  if(provider==='PARTO'){
    const cabinType=Number(
      flight?.cabinType??
      flight?.segments?.[0]?.cabinType??
      flight?.meta?.raw
        ?.originDestinationOptions?.[0]
        ?.flightSegments?.[0]
        ?.cabinClassCode
    )

    if(cabinType===1){
      return'economy'
    }

    if(cabinType===2){
      return'premiumEconomy'
    }

    if(cabinType===3){
      return'business'
    }

    if(cabinType===4){
      return'premiumBusiness'
    }

    if(cabinType===5){
      return'first'
    }

    if(cabinType===6){
      return'premiumFirst'
    }

    /*
     * fallback با Code
     */
    const cabinCode=normalizeCode(
      flight?.bookingClass||
      flight?.rbd
    )

    if(cabinCode==='Y'){
      return'economy'
    }

    if(cabinCode==='S'){
      return'premiumEconomy'
    }

    if(cabinCode==='C'){
      return'business'
    }

    if(cabinCode==='J'){
      return'premiumBusiness'
    }

    if(cabinCode==='F'){
      return'first'
    }

    if(cabinCode==='P'){
      return'premiumFirst'
    }

    return null
  }

  /*
   * NIRA / MAHAN
   * منطق داخلی قبلی
   */
  const airlineCode=
    getFlightAirlineCode(flight)

  const bookingClass=
    getFlightBookingClass(flight)

  const config=
    flightClasses[airlineCode]

  if(
    config?.business
      ?.includes(bookingClass)
  ){
    return'business'
  }

  const cabinName=normalizeCode(
    flight?.cabinName||
    flight?.cabin||
    flight?.meta?.raw?.cabinName||
    flight?.meta?.raw?.CabinName||
    ''
  )

  if(
    cabinName.includes('BUSINESS')||
    cabinName.includes('بیزینس')
  ){
    return'business'
  }

  const cabinType=Number(
    flight?.cabinType??
    flight?.meta?.raw?.cabinType??
    flight?.meta?.raw?.CabinType
  )

  if(
    cabinType===2||
    cabinType===5
  ){
    return'business'
  }

  return'economy'
}

const availableCabins=computed(()=>{
  const types=[]

  for(const flight of props.allFlightsData){
    const provider=
      normalizeCode(
        flight?.provider
      )

    if(provider==='PARTO'){
      types.push(
        ...getPartoFlightCabinTypes(
          flight
        )
      )

      continue
    }

    const type=
      getFlightCabinType(
        flight
      )

    if(type){
      types.push(type)
    }
  }

  return{
    economy:
      types.includes('economy'),

    premiumEconomy:
      types.includes('premiumEconomy'),

    business:
      types.includes('business'),

    premiumBusiness:
      types.includes('premiumBusiness'),

    first:
      types.includes('first'),

    premiumFirst:
      types.includes('premiumFirst')
  }
})

const economySelected=computed({
  get:()=>props.filters?.economy!==false,
  set:value=>{
    emit('update:filters',{
      ...props.filters,
      economy:value
    })
  }
})

const businessSelected=computed({
  get:()=>props.filters?.business!==false,
  set:value=>{
    emit('update:filters',{
      ...props.filters,
      business:value
    })
  }
})
const premiumEconomySelected=computed({
  get:()=>props.filters?.premiumEconomy!==false,

  set:value=>{
    emit('update:filters',{
      ...props.filters,
      premiumEconomy:value
    })
  }
})

const premiumBusinessSelected=computed({
  get:()=>props.filters?.premiumBusiness!==false,

  set:value=>{
    emit('update:filters',{
      ...props.filters,
      premiumBusiness:value
    })
  }
})

const firstSelected=computed({
  get:()=>props.filters?.first!==false,

  set:value=>{
    emit('update:filters',{
      ...props.filters,
      first:value
    })
  }
})

const premiumFirstSelected=computed({
  get:()=>props.filters?.premiumFirst!==false,

  set:value=>{
    emit('update:filters',{
      ...props.filters,
      premiumFirst:value
    })
  }
})
const isCabinFilterChanged=computed(()=>{
  return(
    economySelected.value!==true||
    premiumEconomySelected.value!==true||
    businessSelected.value!==true||
    premiumBusinessSelected.value!==true||
    firstSelected.value!==true||
    premiumFirstSelected.value!==true
  )
})

function resetCabinFilters(){
  emit('update:filters',{
    ...props.filters,

    economy:true,
    premiumEconomy:true,

    business:true,
    premiumBusiness:true,

    first:true,
    premiumFirst:true
  })
}

function getDepartureMinutes(flight){
  const value=
    flight?.departure||
    flight?.departureDateTime||
    flight?.depDateTime||
    flight?.depTime||
    ''

  if(!value)return null

  const normalized=String(value).trim()

  const timePart=normalized.includes('T')
    ?normalized.split('T')[1]
    :normalized.includes(' ')
      ?normalized.split(' ')[1]
      :normalized

  const match=String(timePart||'').match(
    /^([01]?\d|2[0-3]):([0-5]\d)/
  )

  if(!match)return null

  return Number(match[1])*60+Number(match[2])
}

const flightTimes=computed(()=>{
  return props.allFlightsData
    .map(getDepartureMinutes)
    .filter(Number.isFinite)
})

const hasValidFlights=computed(()=>{
  return flightTimes.value.length>0
})

function floorToStep(value,step=30){
  return Math.floor(value/step)*step
}

function ceilToStep(value,step=30){
  return Math.ceil(value/step)*step
}

const timeRangeLimits=computed(()=>{
  if(!flightTimes.value.length)return[0,1439]

  const minimum=Math.min(...flightTimes.value)
  const maximum=Math.max(...flightTimes.value)

  let min=Math.max(floorToStep(minimum),0)
  let max=Math.min(ceilToStep(maximum),1439)

  if(min===max){
    min=Math.max(min-30,0)
    max=Math.min(max+30,1439)
  }

  return[min,max]
})

const selectedRange=computed({
  get(){
    const range=props.filters?.departureTimeRange

    if(Array.isArray(range)&&range.length===2){
      return[Number(range[0]),Number(range[1])]
    }

    return[...timeRangeLimits.value]
  },
  set(value){
    const absoluteMin=timeRangeLimits.value[0]
    const absoluteMax=timeRangeLimits.value[1]

    const selectedMin=Math.max(
      Number(value?.[0]??absoluteMin),
      absoluteMin
    )

    const selectedMax=Math.min(
      Number(value?.[1]??absoluteMax),
      absoluteMax
    )

    if(selectedMin>selectedMax)return

    emit('update:filters',{
      ...props.filters,
      departureTimeRange:[selectedMin,selectedMax]
    })
  }
})

const isRangeChanged=computed(()=>{
  return selectedRange.value[0]!==timeRangeLimits.value[0]||
    selectedRange.value[1]!==timeRangeLimits.value[1]
})

function resetRange(){
  selectedRange.value=[...timeRangeLimits.value]
}

watch(
  timeRangeLimits,
  (newLimits,oldLimits)=>{
    const range=props.filters?.departureTimeRange

    const unchanged=
      !Array.isArray(range)||
      !oldLimits||
      (
        Number(range[0])===Number(oldLimits[0])&&
        Number(range[1])===Number(oldLimits[1])
      )

    if(!initializedRange.value||unchanged){
      initializedRange.value=true
      selectedRange.value=[...newLimits]
    }
  },
  {immediate:true}
)

function formatTime(value){
  const total=Math.max(0,Math.min(Number(value||0),1439))
  const hours=Math.floor(total/60)
  const minutes=total%60

  return`${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`
}
</script>