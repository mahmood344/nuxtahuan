<template>

  <div
    v-if="hasValidHotels"
    dir="rtl"
    class="
      rounded-2xl
      border
      border-gray-200
      bg-white
      p-4
      shadow-sm
    "
  >

    <!--
    |--------------------------------------------------------------------------
    | Price
    |--------------------------------------------------------------------------
    -->

    <div
      v-if="hasValidPriceRange"
    >

      <div
        class="
          mb-5
          flex
          items-center
          justify-between
        "
      >

        <h3
          class="
            text-sm
            font-bold
            text-gray-800
          "
        >
          محدوده قیمت
        </h3>


        <button
          v-if="isPriceRangeChanged"
          type="button"
          class="
            text-[11px]
            font-bold
            text-blue-600
          "
          @click="resetPriceRange"
        >
          نمایش همه
        </button>

      </div>


      <div dir="ltr">

        <UiBaseRangeSlider
          v-model="selectedPriceRange"
          :min="priceRangeLimits[0]"
          :max="priceRangeLimits[1]"
          :step="priceStep"
        />


       <div
  class="
    mt-4
    flex
    items-center
    justify-between
    gap-3
  "
  dir="rtl"
>

  <!-- Maximum -->

  <div
    class="
      flex-1
      rounded-lg
      bg-gray-50
      px-3
      py-2
    "
  >

    <div
      class="
        text-[9px]
        text-gray-400
      "
    >
      تا
    </div>


    <span
      class="
        mt-1
        block
        text-xs
        font-bold
        text-primary
      "
    >
    {{
 formatRial(
  selectedPriceRange[1]
 )
}}
ریال
    </span>

  </div>


  <span
    class="
      text-gray-300
    "
  >
    —
  </span>


  <!-- Minimum -->

  <div
    class="
      flex-1
      rounded-lg
      bg-gray-50
      px-3
      py-2
    "
  >

    <div
      class="
        text-[9px]
        text-gray-400
      "
    >
      از
    </div>


    <span
      class="
        mt-1
        block
        text-xs
        font-bold
        text-primary
      "
    >
      {{
 formatRial(
  selectedPriceRange[0]
 )
}}
ریال
    </span>

  </div>

</div>

      </div>

    </div>


    <!-- Divider -->

    <div
      v-if="
        hasValidPriceRange &&
        availableAccommodationTypes.length
      "
      class="
        my-5
        h-px
        bg-gray-200
      "
    ></div>

<!--
|--------------------------------------------------------------------------
| Breakfast
|--------------------------------------------------------------------------
-->

<!-- <div>

  <div
    class="
      mb-4
      flex
      items-center
      justify-between
    "
  >

    <h3
      class="
        text-sm
        font-bold
        text-gray-800
      "
    >
      نوع پذیرایی
    </h3>


    <button
      v-if="isBreakfastFilterChanged"
      type="button"
      class="
        text-[11px]
        font-bold
        text-blue-600
      "
      @click="resetBreakfastFilters"
    >
      نمایش همه
    </button>

  </div>


  <div
    class="
      space-y-3
      text-[13px]
    "
  >

    <UiBaseCheckbox
      v-model="withBreakfastSelected"
      :label="
        `با صبحانه (${breakfastRoomCount})`
      "
    />


    <UiBaseCheckbox
      v-model="withoutBreakfastSelected"
      :label="
        `بدون صبحانه (${roomOnlyCount})`
      "
    />

  </div>


  <p
    v-if="
      !withBreakfastSelected &&
      !withoutBreakfastSelected
    "
    class="
      mt-3
      text-[11px]
      font-bold
      text-red-500
    "
  >
    حداقل یک نوع پذیرایی را انتخاب کنید.
  </p>

</div> -->
    <!--
    |--------------------------------------------------------------------------
    | Accommodation Type
    |--------------------------------------------------------------------------
    -->

    <div
      v-if="availableAccommodationTypes.length"
    >

      <div
        class="
          mb-4
          flex
          items-center
          justify-between
        "
      >

        <h3
          class="
            text-sm
            font-bold
            text-gray-800
          "
        >
          نوع اقامتگاه
        </h3>


        <button
          v-if="isAccommodationFilterChanged"
          type="button"
          class="
            text-[11px]
            font-bold
            text-blue-600
          "
          @click="resetAccommodationFilters"
        >
          نمایش همه
        </button>

      </div>


      <div
        class="
          space-y-3
          text-[13px]
        "
      >

        <UiBaseCheckbox
          v-for="
            item
            in availableAccommodationTypes
          "
          :key="item.value"
          :model-value="
            isAccommodationSelected(
              item.value
            )
          "
          :label="
            `${item.label} (${item.count})`
          "
          @update:model-value="
            toggleAccommodation(
              item.value,
              $event
            )
          "
        />

      </div>


      <p
        v-if="
          !selectedAccommodationTypes.length
        "
        class="
          mt-3
          text-[11px]
          text-gray-400
        "
      >
        همه انواع اقامتگاه نمایش داده می‌شوند.
      </p>

    </div>


    <!-- Divider -->

    <div
      v-if="
        availableAccommodationTypes.length &&
        availableStars.length
      "
      class="
        my-5
        h-px
        bg-gray-200
      "
    ></div>


    <!--
    |--------------------------------------------------------------------------
    | Stars
    |--------------------------------------------------------------------------
    -->

    <div
      v-if="availableStars.length"
    >

      <div
        class="
          mb-4
          flex
          items-center
          justify-between
        "
      >

        <h3
          class="
            text-sm
            font-bold
            text-gray-800
          "
        >
          درجه هتل
        </h3>


        <button
          v-if="isStarFilterChanged"
          type="button"
          class="
            text-[11px]
            font-bold
            text-blue-600
          "
          @click="resetStarFilters"
        >
          نمایش همه
        </button>

      </div>


      <div
        class="
          space-y-3
          text-[13px]
        "
      >

        <UiBaseCheckbox
          v-for="
            item
            in availableStars
          "
          :key="item.value"
          :model-value="
            isStarSelected(
              item.value
            )
          "
          :label="
            getStarLabel(
              item
            )
          "
          @update:model-value="
            toggleStar(
              item.value,
              $event
            )
          "
        />

      </div>


      <p
        v-if="!selectedStars.length"
        class="
          mt-3
          text-[11px]
          text-gray-400
        "
      >
        همه درجه‌ها نمایش داده می‌شوند.
      </p>

    </div>


    <!-- Divider -->

    <div
      v-if="
        availableStars.length &&
        availableFacilities.length
      "
      class="
        my-5
        h-px
        bg-gray-200
      "
    ></div>


    <!--
    |--------------------------------------------------------------------------
    | Facilities
    |--------------------------------------------------------------------------
    -->

    <div
      v-if="availableFacilities.length"
    >

      <div
        class="
          mb-4
          flex
          items-center
          justify-between
        "
      >

        <h3
          class="
            text-sm
            font-bold
            text-gray-800
          "
        >
          امکانات هتل
        </h3>


        <button
          v-if="isFacilityFilterChanged"
          type="button"
          class="
            text-[11px]
            font-bold
            text-blue-600
          "
          @click="resetFacilityFilters"
        >
          نمایش همه
        </button>

      </div>


      <div
        class="
          max-h-[280px]
          space-y-3
          overflow-y-auto
          pl-1
          text-[13px]
        "
      >

        <UiBaseCheckbox
          v-for="
            facility
            in visibleFacilities
          "
          :key="facility.key"
          :model-value="
            isFacilitySelected(
              facility.key
            )
          "
          :label="
            `${facility.title} (${facility.count})`
          "
          @update:model-value="
            toggleFacility(
              facility.key,
              $event
            )
          "
        />

      </div>


      <button
        v-if="
          availableFacilities.length >
          facilityDisplayLimit
        "
        type="button"
        class="
          mt-4
          w-full
          rounded-xl
          border
          border-gray-200
          px-3
          py-2
          text-xs
          font-bold
          text-gray-600
          transition
          hover:bg-gray-50
        "
        @click="
          showAllFacilities=
            !showAllFacilities
        "
      >

        {{
          showAllFacilities
            ?'نمایش کمتر'
            :'نمایش همه امکانات'
        }}

      </button>


      <p
        v-if="!selectedFacilities.length"
        class="
          mt-3
          text-[11px]
          text-gray-400
        "
      >
        همه امکانات نمایش داده می‌شوند.
      </p>

    </div>


    <!--
    |--------------------------------------------------------------------------
    | Reset All
    |--------------------------------------------------------------------------
    -->

    <template
      v-if="hasActiveFilters"
    >

      <div
        class="
          my-5
          h-px
          bg-gray-200
        "
      ></div>


      <UiBaseButton
        label="حذف همه فیلترها"
        variant="outline"
        color="primary"
        class="
          w-full
          !rounded-xl
          text-[11px]
          font-bold
        "
        @click="resetAllFilters"
      />

    </template>

  </div>

</template>


<script setup>

import{
  computed,
  ref,
  watch
}from'vue'


/*
|--------------------------------------------------------------------------
| Props
|--------------------------------------------------------------------------
*/

const props=
  defineProps({

    hotels:{
      type:Array,
      default:()=>[]
    },

    filters:{
      type:Object,
      required:true
    }

  })


/*
|--------------------------------------------------------------------------
| Emits
|--------------------------------------------------------------------------
*/

const emit=
  defineEmits([
    'update:filters'
  ])


/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const initializedPriceRange=
  ref(false)

const showAllFacilities=
  ref(false)

const facilityDisplayLimit=
  8


/*
|--------------------------------------------------------------------------
| Hotels
|--------------------------------------------------------------------------
*/

const hasValidHotels=
  computed(
    ()=>
      Array.isArray(
        props.hotels
      )&&
      props.hotels.length>0
  )
/*
|--------------------------------------------------------------------------
| Accommodation Normalizer
|--------------------------------------------------------------------------
*/

function normalizeAccommodation(
  value
){

  return String(
    value||
    ''
  )
    .trim()
    .replaceAll(
      'ي',
      'ی'
    )
    .replaceAll(
      'ك',
      'ک'
    )
    .replaceAll(
      '\u200c',
      ' '
    )
    .replace(
      /\s+/g,
      ' '
    )
    .toLowerCase()

}


/*
|--------------------------------------------------------------------------
| Accommodation Priority
|--------------------------------------------------------------------------
*/

function getAccommodationPriority(
  value
){

  const type=
    normalizeAccommodation(
      value
    )


  /*
  |--------------------------------------------------------------------------
  | Hotel
  |--------------------------------------------------------------------------
  */

  if(
    type==='هتل'||
    type==='hotel'
  ){
    return 1
  }


  /*
  |--------------------------------------------------------------------------
  | Hotel Apartment
  |--------------------------------------------------------------------------
  */

  if(
    type.includes(
      'هتل آپارتمان'
    )||
    type.includes(
      'هتل اپارتمان'
    )||
    type.includes(
      'apartment hotel'
    )||
    type.includes(
      'apartmenthotel'
    )
  ){
    return 2
  }


  /*
  |--------------------------------------------------------------------------
  | Guest House
  |--------------------------------------------------------------------------
  */

  if(
    type.includes(
      'مسافرخانه'
    )||
    type.includes(
      'مهمانپذیر'
    )||
    type.includes(
      'مهمان پذیر'
    )||
    type.includes(
      'guesthouse'
    )||
    type.includes(
      'guest house'
    )
  ){
    return 3
  }


  /*
  |--------------------------------------------------------------------------
  | Traditional
  |--------------------------------------------------------------------------
  */

  if(
    type.includes(
      'اقامتگاه سنتی'
    )||
    type.includes(
      'سنتی'
    )||
    type.includes(
      'traditional'
    )
  ){
    return 4
  }


  /*
  |--------------------------------------------------------------------------
  | Hostel
  |--------------------------------------------------------------------------
  */

  if(
    type.includes(
      'هاستل'
    )||
    type.includes(
      'hostel'
    )
  ){
    return 5
  }


  /*
  |--------------------------------------------------------------------------
  | Eco Lodge
  |--------------------------------------------------------------------------
  */

  if(
    type.includes(
      'بوم گردی'
    )||
    type.includes(
      'بوم‌گردی'
    )||
    type.includes(
      'ecolodge'
    )||
    type.includes(
      'eco lodge'
    )
  ){
    return 6
  }


  return 99

}


/*
|--------------------------------------------------------------------------
| Accommodation Types
|--------------------------------------------------------------------------
*/

const availableAccommodationTypes=
  computed(()=>{

    const map=
      new Map()


    for(
      const hotel
      of props.hotels
    ){

      const value=
        String(
          hotel?.accommodationTitle||
          ''
        )
          .trim()


      if(!value)
        continue


      if(
        !map.has(value)
      ){

        map.set(
          value,
          {
            value,
            label:value,
            count:0
          }
        )

      }


      map.get(
        value
      ).count++

    }


    return[
      ...map.values()
    ]
      .sort(
        (a,b)=>{

          const priorityDifference=
            getAccommodationPriority(
              a.value
            )-
            getAccommodationPriority(
              b.value
            )


          if(
            priorityDifference!==0
          ){
            return priorityDifference
          }


          return a.label.localeCompare(
            b.label,
            'fa'
          )

        }
      )

  })


const selectedAccommodationTypes=
  computed(()=>{

    return Array.isArray(
      props.filters
        ?.accommodationTypes
    )
      ?props.filters
        .accommodationTypes
        .map(
          item=>
            String(item).trim()
        )
        .filter(Boolean)
      :[]

  })


const isAccommodationFilterChanged=
  computed(
    ()=>
      selectedAccommodationTypes
        .value
        .length>0
  )


function isAccommodationSelected(
  value
){

  return selectedAccommodationTypes
    .value
    .includes(
      String(value)
        .trim()
    )

}


function toggleAccommodation(
  value,
  checked
){

  const normalizedValue=
    String(
      value||
      ''
    )
      .trim()


  let next=[
    ...selectedAccommodationTypes.value
  ]


  if(checked){

    if(
      !next.includes(
        normalizedValue
      )
    ){
      next.push(
        normalizedValue
      )
    }

  }
  else{

    next=
      next.filter(
        item=>
          item!==normalizedValue
      )

  }


  emit(
    'update:filters',
    {
      ...props.filters,

      accommodationTypes:
        next
    }
  )

}


function resetAccommodationFilters(){

  emit(
    'update:filters',
    {
      ...props.filters,

      accommodationTypes:[]
    }
  )

}
const breakfastRoomCount=
 computed(()=>{

  return props.hotels.filter(
   hotel=>{

    const rooms=
     Array.isArray(
      hotel?.rooms
     )
      ?hotel.rooms
      :[]


    return rooms.some(
     room=>
      isBreakfastRoom(
       room
      )
    )

   }
  ).length

})


const roomOnlyCount=
 computed(()=>{

  return props.hotels.filter(
   hotel=>{

    const rooms=
     Array.isArray(
      hotel?.rooms
     )
      ?hotel.rooms
      :[]


    return rooms.some(
     room=>
      isRoomOnlyRoom(
       room
      )
    )

   }
  ).length

})

/*
|--------------------------------------------------------------------------
| Stars
|--------------------------------------------------------------------------
*/

const availableStars=
  computed(()=>{

    const map=
      new Map()


    for(
      const hotel
      of props.hotels
    ){

      const star=
        Number(
          hotel?.hotelStar||
          0
        )


      if(
        !Number.isFinite(star)||
        star<=0
      ){
        continue
      }


      map.set(
        star,
        (
          map.get(star)||
          0
        )+1
      )

    }


    return[
      ...map.entries()
    ]
      .map(
        ([value,count])=>({
          value,
          count
        })
      )
      .sort(
        (a,b)=>
          b.value-
          a.value
      )

  })


const selectedStars=
  computed(()=>{

    return Array.isArray(
      props.filters?.stars
    )
      ?props.filters
        .stars
        .map(Number)
        .filter(
          value=>
            Number.isFinite(value)
        )
      :[]

  })

const withBreakfastSelected=
 computed({

  get:()=>
   props.filters
    ?.withBreakfast!==false,


  set:value=>{

   emit(
    'update:filters',
    {
     ...props.filters,

     withBreakfast:
      value
    }
   )

  }

 })


const withoutBreakfastSelected=
 computed({

  get:()=>
   props.filters
    ?.withoutBreakfast!==false,


  set:value=>{

   emit(
    'update:filters',
    {
     ...props.filters,

     withoutBreakfast:
      value
    }
   )

  }

 })
const isStarFilterChanged=
  computed(
    ()=>
      selectedStars
        .value
        .length>0
  )


function isStarSelected(
  value
){

  return selectedStars
    .value
    .includes(
      Number(value)
    )

}


function toggleStar(
  value,
  checked
){

  const star=
    Number(value)


  let next=[
    ...selectedStars.value
  ]


  if(checked){

    if(
      !next.includes(star)
    ){
      next.push(star)
    }

  }
  else{

    next=
      next.filter(
        item=>
          item!==star
      )

  }


  emit(
    'update:filters',
    {
      ...props.filters,

      stars:
        next
    }
  )

}

function resetBreakfastFilters(){

 emit(
  'update:filters',
  {
   ...props.filters,

   withBreakfast:true,

   withoutBreakfast:true
  }
 )

}
function resetStarFilters(){

  emit(
    'update:filters',
    {
      ...props.filters,

      stars:[]
    }
  )

}


function getStarLabel(
  item
){

  return(
    `${item.value} ستاره (${item.count})`
  )

}
const isBreakfastFilterChanged=
 computed(()=>{

  return(
   withBreakfastSelected.value!==true||
   withoutBreakfastSelected.value!==true
  )

})

/*
|--------------------------------------------------------------------------
| Original Price
|--------------------------------------------------------------------------
|
| تمام فیلترهای Price بر اساس originalPrice هستند.
|
|--------------------------------------------------------------------------
*/

function getHotelOriginalPrice(
  hotel
){

  const rooms=
    Array.isArray(
      hotel?.rooms
    )
      ?hotel.rooms
      :[]


  const prices=
    rooms

      .map(
        room=>
          Number(
            room?.originalPrice||
            0
          )
      )

      .filter(
        price=>
          Number.isFinite(price)&&
          price>0
      )


  if(!prices.length){
    return null
  }


  return Math.min(
    ...prices
  )

}


/*
|--------------------------------------------------------------------------
| Available Prices
|--------------------------------------------------------------------------
*/

const hotelPrices=
  computed(()=>{

    return props.hotels

      .map(
        hotel=>
          getHotelOriginalPrice(
            hotel
          )
      )

      .filter(
        price=>
          Number.isFinite(price)&&
          price>0
      )

  })


/*
|--------------------------------------------------------------------------
| Price Range Limits
|--------------------------------------------------------------------------
*/

const priceRangeLimits=
  computed(()=>{

    if(
      !hotelPrices.value.length
    ){
      return[
        0,
        0
      ]
    }


    return[
      Math.min(
        ...hotelPrices.value
      ),

      Math.max(
        ...hotelPrices.value
      )
    ]

  })


const hasValidPriceRange=
  computed(()=>{

    return(
      priceRangeLimits.value[0]>0&&
      priceRangeLimits.value[1]>=
        priceRangeLimits.value[0]
    )

  })


/*
|--------------------------------------------------------------------------
| Price Step
|--------------------------------------------------------------------------
*/

const priceStep=
  computed(()=>{

    const range=
      priceRangeLimits.value[1]-
      priceRangeLimits.value[0]


    if(range<=0){
      return 100000
    }


    /*
    |--------------------------------------------------------------------------
    | قیمت API ریال است.
    | حداقل Step = 100,000 ریال = 10,000 تومان
    |--------------------------------------------------------------------------
    */

    const calculated=
      Math.round(
        range/
        100
      )


    return Math.max(
      100000,
      calculated
    )

  })


/*
|--------------------------------------------------------------------------
| Selected Price Range
|--------------------------------------------------------------------------
*/

const selectedPriceRange=
  computed({

    get(){

      const range=
        props.filters
          ?.originalPriceRange


      if(
        Array.isArray(range)&&
        range.length===2
      ){

        return[
          Number(
            range[0]
          ),

          Number(
            range[1]
          )
        ]

      }


      return[
        ...priceRangeLimits.value
      ]

    },


    set(
      value
    ){

      const absoluteMin=
        priceRangeLimits.value[0]

      const absoluteMax=
        priceRangeLimits.value[1]


      const selectedMin=
        Math.max(
          Number(
            value?.[0]??
            absoluteMin
          ),
          absoluteMin
        )


      const selectedMax=
        Math.min(
          Number(
            value?.[1]??
            absoluteMax
          ),
          absoluteMax
        )


      if(
        selectedMin>
        selectedMax
      ){
        return
      }


      emit(
        'update:filters',
        {
          ...props.filters,

          originalPriceRange:[
            selectedMin,
            selectedMax
          ]
        }
      )

    }

  })


/*
|--------------------------------------------------------------------------
| Price Changed
|--------------------------------------------------------------------------
*/

const isPriceRangeChanged=
  computed(()=>{

    return(
      selectedPriceRange.value[0]!==
        priceRangeLimits.value[0]||
      selectedPriceRange.value[1]!==
        priceRangeLimits.value[1]
    )

  })


/*
|--------------------------------------------------------------------------
| Reset Price
|--------------------------------------------------------------------------
*/

function resetPriceRange(){

  selectedPriceRange.value=[
    ...priceRangeLimits.value
  ]

}


/*
|--------------------------------------------------------------------------
| Facilities Helpers
|--------------------------------------------------------------------------
*/

function getFacilityKey(
  facility
){

  if(
    facility===null||
    facility===undefined
  ){
    return''
  }


  if(
    typeof facility===
    'string'
  ){
    return facility.trim()
  }


  return String(
    facility?.id||
    facility?.facilityId||
    facility?.facility_id||
    facility?.title||
    facility?.name||
    facility?.label||
    ''
  )
    .trim()

}


function getFacilityTitle(
  facility
){

  if(
    facility===null||
    facility===undefined
  ){
    return''
  }


  if(
    typeof facility===
    'string'
  ){
    return facility.trim()
  }


  return String(
    facility?.title||
    facility?.name||
    facility?.titleFa||
    facility?.title_fa||
    facility?.label||
    ''
  )
    .trim()

}


/*
|--------------------------------------------------------------------------
| Available Facilities
|--------------------------------------------------------------------------
*/

const availableFacilities=
  computed(()=>{

    const facilityMap=
      new Map()


    for(
      const hotel
      of props.hotels
    ){

      const facilities=
        Array.isArray(
          hotel?.facilities
        )
          ?hotel.facilities
          :[]


      /*
      |--------------------------------------------------------------------------
      | جلوگیری از Count تکراری داخل یک Hotel
      |--------------------------------------------------------------------------
      */

      const hotelFacilityKeys=
        new Set()


      for(
        const facility
        of facilities
      ){

        const key=
          getFacilityKey(
            facility
          )

        const title=
          getFacilityTitle(
            facility
          )


        if(
          !key||
          !title||
          hotelFacilityKeys
            .has(key)
        ){
          continue
        }


        hotelFacilityKeys.add(
          key
        )


        if(
          !facilityMap.has(key)
        ){

          facilityMap.set(
            key,
            {
              key,
              title,
              count:0
            }
          )

        }


        facilityMap.get(
          key
        ).count++

      }

    }


    return[
      ...facilityMap.values()
    ]
      .sort(
        (a,b)=>{

          if(
            b.count!==a.count
          ){
            return b.count-
              a.count
          }


          return a.title
            .localeCompare(
              b.title,
              'fa'
            )

        }
      )

  })


const visibleFacilities=
  computed(()=>{

    if(
      showAllFacilities.value
    ){
      return availableFacilities.value
    }


    return availableFacilities
      .value
      .slice(
        0,
        facilityDisplayLimit
      )

  })


/*
|--------------------------------------------------------------------------
| Selected Facilities
|--------------------------------------------------------------------------
*/

const selectedFacilities=
  computed(()=>{

    return Array.isArray(
      props.filters
        ?.facilities
    )
      ?props.filters
        .facilities
        .map(
          value=>
            String(value).trim()
        )
        .filter(Boolean)
      :[]

  })


const isFacilityFilterChanged=
  computed(
    ()=>
      selectedFacilities
        .value
        .length>0
  )


function isFacilitySelected(
  key
){

  return selectedFacilities
    .value
    .includes(
      String(key)
    )

}


function toggleFacility(
  key,
  checked
){

  const value=
    String(
      key||
      ''
    )


  let next=[
    ...selectedFacilities.value
  ]


  if(checked){

    if(
      !next.includes(value)
    ){
      next.push(value)
    }

  }
  else{

    next=
      next.filter(
        item=>
          item!==value
      )

  }


  emit(
    'update:filters',
    {
      ...props.filters,

      facilities:
        next
    }
  )

}


function resetFacilityFilters(){

  emit(
    'update:filters',
    {
      ...props.filters,

      facilities:[]
    }
  )

}


/*
|--------------------------------------------------------------------------
| Has Active Filters
|--------------------------------------------------------------------------
*/

const hasActiveFilters=
  computed(()=>{

    return(
      isPriceRangeChanged.value||
      isAccommodationFilterChanged.value||
      isStarFilterChanged.value||
      isBreakfastFilterChanged.value||
      isFacilityFilterChanged.value
    )

  })

/*
|--------------------------------------------------------------------------
| Board Type
|--------------------------------------------------------------------------
*/

function normalizeBoardType(
 value
){

 return String(
  value||
  ''
 )
  .trim()
  .toLowerCase()

}


function isBreakfastRoom(
 room
){

 const boardType=
  normalizeBoardType(
   room?.boardType||
   room?.meta?.raw?.board_type
  )


 return[
  'bed_breakfast',
  'bb',
  'half_board',
  'hb',
  'full_board',
  'fb'
 ].includes(
  boardType
 )

}


function isRoomOnlyRoom(
 room
){

 const boardType=
  normalizeBoardType(
   room?.boardType||
   room?.meta?.raw?.board_type
  )


 return[
  'room_only',
  'ro'
 ].includes(
  boardType
 )

}
/*
|--------------------------------------------------------------------------
| Reset All
|--------------------------------------------------------------------------
*/

function resetAllFilters(){

 emit(
  'update:filters',
  {

   ...props.filters,

   originalPriceRange:[
    ...priceRangeLimits.value
   ],

   accommodationTypes:[],

   stars:[],

   withBreakfast:true,

   withoutBreakfast:true,

   facilities:[]

  }
 )

}


/*
|--------------------------------------------------------------------------
| Watch Price Limits
|--------------------------------------------------------------------------
|
| دقیقاً مثل FilterFlight:
| اگر نتایج Search عوض شوند، بازه قیمت با نتایج جدید Sync شود.
|
|--------------------------------------------------------------------------
*/

watch(
  priceRangeLimits,

  (
    newLimits,
    oldLimits
  )=>{

    const range=
      props.filters
        ?.originalPriceRange


    const unchanged=
      !Array.isArray(range)||
      !oldLimits||
      (
        Number(
          range[0]
        )===
        Number(
          oldLimits[0]
        )&&
        Number(
          range[1]
        )===
        Number(
          oldLimits[1]
        )
      )


    if(
      !initializedPriceRange.value||
      unchanged
    ){

      initializedPriceRange.value=
        true


      selectedPriceRange.value=[
        ...newLimits
      ]

    }

  },

  {
    immediate:true
  }

)


/*
|--------------------------------------------------------------------------
| Format Toman
|--------------------------------------------------------------------------
*/

function formatRial(
 value
){

 const price=
  Number(
   value||
   0
  )


 if(
  !Number.isFinite(price)||
  price<=0
 ){
  return'۰'
 }


 return Math.round(
  price
 )
  .toLocaleString(
   'fa-IR'
  )

}

</script>