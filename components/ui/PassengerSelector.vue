<template>
  <div
    dir="rtl"
    class="passenger-selector-container flex w-full justify-center"
    :class="compact ? 'p-0' : 'p-4'"
  >
    <div
      class="
        passenger-selector
        relative
        flex
        w-full
        items-center
        rounded-[12px]
        border
        border-gray-300
        bg-white
      "
      :class="
        compact
          ? 'h-[44px] max-w-[280px]'
          : 'h-[54px] max-w-[500px]'
      "
    >
      <!-- label -->
      <label
        class="
          passenger-label
          absolute
          -top-3
          z-20
          whitespace-nowrap
          bg-white
          text-gray-400
        "
        :class="
          compact
            ? 'right-3 px-1.5 text-[10px]'
            : 'right-6 px-2 text-[11px]'
        "
      >
        مسافران
      </label>

      <!-- field -->
      <div
        @click="isOpen = !isOpen"
        class="
          passenger-field
          flex
          h-full
          w-full
          cursor-pointer
          items-center
          text-gray-700
        "
        :class="compact ? 'px-4' : 'px-6'"
      >
        <span class="font-semibold text-[10px]">
          {{ totalPassengers }} مسافر
        </span>

        <i
          class="
            bi
            bi-chevron-down
            mr-auto
            text-xs
            text-gray-400
            transition
          "
          :class="{ 'rotate-180': isOpen }"
        ></i>
      </div>

      <!-- dropdown -->
      <div
        v-if="isOpen"
        class="
          passenger-dropdown
          absolute
          right-0
          z-50
          w-full
          rounded-[16px]
          border
          border-gray-200
          bg-white
          shadow-xl
        "
        :class="
          compact
            ? 'top-[52px] p-4'
            : 'top-[64px] p-5'
        "
      >
        <div :class="compact ? 'space-y-4' : 'space-y-6'">

          <!-- adult -->
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <span
                class="font-bold text-gray-800"
                :class="compact ? 'text-[12px]' : 'text-[14px]'"
              >
                بزرگسال
                <span
                  class="mr-1 text-gray-400"
                  :class="compact ? 'text-[9px]' : 'text-[11px]'"
                >
                  (۱۲ سال به بالا)
                </span>
              </span>
            </div>

            <div
              class="flex shrink-0 items-center"
              :class="compact ? 'gap-3' : 'gap-4'"
            >
              <button
                @click.stop="decrement('adult')"
                :disabled="!canRemoveAdult"
                class="flex h-6 w-6 items-center justify-center rounded-full"
                :class="
                  canRemoveAdult
                    ? 'bg-[#253E91]'
                    : 'cursor-not-allowed bg-[#253E91]/20'
                "
              >
                <i class="bi bi-dash text-sm leading-none text-white"></i>
              </button>

              <span class="w-4 text-center text-sm font-bold">
                {{ counts.adult }}
              </span>

              <button
                @click.stop="increment('adult')"
                :disabled="!canAddAdult"
                class="flex h-6 w-6 items-center justify-center rounded-full"
                :class="
                  canAddAdult
                    ? 'bg-[#253E91]'
                    : 'cursor-not-allowed bg-[#253E91]/20'
                "
              >
                <i class="bi bi-plus text-sm leading-none text-white"></i>
              </button>
            </div>
          </div>

          <!-- child -->
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <span
                class="font-bold text-gray-800"
                :class="compact ? 'text-[12px]' : 'text-[14px]'"
              >
                کودک
                <span
                  class="mr-1 text-gray-400"
                  :class="compact ? 'text-[9px]' : 'text-[11px]'"
                >
                  (۲ تا ۱۲ سال)
                </span>
              </span>
            </div>

            <div
              class="flex shrink-0 items-center"
              :class="compact ? 'gap-3' : 'gap-4'"
            >
              <button
                @click.stop="decrement('child')"
                :disabled="!canRemoveChild"
                class="flex h-6 w-6 items-center justify-center rounded-full"
                :class="
                  canRemoveChild
                    ? 'bg-[#253E91]'
                    : 'cursor-not-allowed bg-[#253E91]/20'
                "
              >
                <i class="bi bi-dash text-sm text-white"></i>
              </button>

              <span class="w-4 text-center text-sm font-bold">
                {{ counts.child }}
              </span>

              <button
                @click.stop="increment('child')"
                :disabled="!canAddChild"
                class="flex h-6 w-6 items-center justify-center rounded-full"
                :class="
                  canAddChild
                    ? 'bg-[#253E91]'
                    : 'cursor-not-allowed bg-[#253E91]/20'
                "
              >
                <i class="bi bi-plus text-sm text-white"></i>
              </button>
            </div>
          </div>

          <!-- infant -->
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <span
                class="font-bold text-gray-800"
                :class="compact ? 'text-[12px]' : 'text-[14px]'"
              >
                نوزاد
                <span
                  class="mr-1 text-gray-400"
                  :class="compact ? 'text-[9px]' : 'text-[11px]'"
                >
                  (۱۰ روز تا ۲ سال)
                </span>
              </span>
            </div>

            <div
              class="flex shrink-0 items-center"
              :class="compact ? 'gap-3' : 'gap-4'"
            >
              <button
                @click.stop="decrement('infant')"
                :disabled="!canRemoveInfant"
                class="flex h-6 w-6 items-center justify-center rounded-full"
                :class="
                  canRemoveInfant
                    ? 'bg-[#253E91]'
                    : 'cursor-not-allowed bg-[#253E91]/20'
                "
              >
                <i class="bi bi-dash text-sm text-white"></i>
              </button>

              <span class="w-4 text-center text-sm font-bold">
                {{ counts.infant }}
              </span>

              <button
                @click.stop="increment('infant')"
                :disabled="!canAddInfant"
                class="flex h-6 w-6 items-center justify-center rounded-full"
                :class="
                  canAddInfant
                    ? 'bg-[#253E91]'
                    : 'cursor-not-allowed bg-[#253E91]/20'
                "
              >
                <i class="bi bi-plus text-sm text-white"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- rule -->
        <!-- rule -->
<div
  class="
    flex
    items-start
    gap-2
    border-t
    border-gray-100
  "
  :class="compact ? 'mt-4 pt-4' : 'mt-6 pt-5'"
>
  <div
    class="
      flex
      h-5
      w-5
      shrink-0
      items-center
      justify-center
      rounded-full
      border
      border-red-500
    "
  >
    <span class="text-[12px] font-bold text-red-500">
      i
    </span>
  </div>

  <p
    class="text-red-500"
    :class="compact ? 'text-[9px]' : 'text-[11px]'"
  >
    به ازای هر بزرگسال، ۳ کودک، یا ۲ کودک و یک نوزاد مجاز است.
  </p>
</div>


<!-- دکمه تایید -->
<div
  class="w-full"
  :class="compact ? 'mt-4' : 'mt-5'"
>
  <UiBaseButton
    label="تأیید"
    variant="filled"
    color="primary"
    :active="false"
    class="w-full !rounded-xl"
    :class="
      compact
        ? 'h-[36px] text-[11px]'
        : 'h-[40px] text-[12px]'
    "
    @click.stop="closeSelector"
  />
</div>
      </div>
    </div>

    <!-- overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40"
      @click="isOpen = false"
    ></div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch
} from "vue"

import { useRoute } from "vue-router"

const route = useRoute()



const isSyncingFromParent = ref(false)
const isOpen = ref(false)

const openSelector = () => {
  isOpen.value = true
}

const closeSelector = () => {
  isOpen.value = false
}

const props = defineProps({
  compact: {
  type: Boolean,
  default: false
},
  adl: {
    type: Number,
    default: 1
  },
  chd: {
    type: Number,
    default: 0
  },
  inf: {
    type: Number,
    default: 0
  }
})

const counts = ref({
  adult: props.adl,
  child: props.chd,
  infant: props.inf
})

watch(
  counts,

  (val) => {
    if (isSyncingFromParent.value)
      return

    emit(
      "update:adl",
      val.adult
    )

    emit(
      "update:chd",
      val.child
    )

    emit(
      "update:inf",
      val.infant
    )
  },

  {
    deep: true
  }
)

watch(
  () => [
    props.adl,
    props.chd,
    props.inf
  ],

  ([adl, chd, inf]) => {
    isSyncingFromParent.value = true

    counts.value = {
      adult: Number(adl ?? 1),
      child: Number(chd ?? 0),
      infant: Number(inf ?? 0)
    }

    queueMicrotask(() => {
      isSyncingFromParent.value = false
    })
  },

  {
    immediate: true
  }
)

const MAX = 9

const emit = defineEmits([
  "update:adl",
  "update:chd",
  "update:inf"
])

const totalPassengers = computed(() => {
  return (
    counts.value.adult +
    counts.value.child +
    counts.value.infant
  )
})

const canAddAdult = computed(() =>
  totalPassengers.value < MAX
)

const canAddChild = computed(() => {
  if (totalPassengers.value >= MAX)
    return false

  return (
    counts.value.child +
    1 +
    counts.value.infant <=
    3 * counts.value.adult
  )
})

const canAddInfant = computed(() => {
  if (totalPassengers.value >= MAX)
    return false

  const next =
    counts.value.infant + 1

  return (
    next <= counts.value.adult &&
    counts.value.child + next <=
      3 * counts.value.adult
  )
})

const canRemoveAdult = computed(() => {
  if (counts.value.adult <= 1)
    return false

  const next =
    counts.value.adult - 1

  return (
    counts.value.infant <= next &&
    counts.value.child +
      counts.value.infant <=
      3 * next
  )
})

const canRemoveChild = computed(() =>
  counts.value.child > 0
)

const canRemoveInfant = computed(() =>
  counts.value.infant > 0
)

const increment = (type) => {
  if (
    type === "adult" &&
    canAddAdult.value
  )
    counts.value.adult++

  if (
    type === "child" &&
    canAddChild.value
  )
    counts.value.child++

  if (
    type === "infant" &&
    canAddInfant.value
  )
    counts.value.infant++
}

const decrement = (type) => {
  if (
    type === "adult" &&
    canRemoveAdult.value
  )
    counts.value.adult--

  if (
    type === "child" &&
    canRemoveChild.value
  )
    counts.value.child--

  if (
    type === "infant" &&
    canRemoveInfant.value
  )
    counts.value.infant--
}

defineExpose({
  openSelector,
  closeSelector
})
</script>

<style scoped>
.passenger-selector-container {
  container-type: inline-size;
}

.passenger-selector {
  min-width: 0;
}

/* اگر Parent در صفحه Flight از 280px هم باریک‌تر شد */
@container (max-width: 280px) {
  .passenger-field {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }

  .passenger-label {
    right: 8px !important;
    padding-left: 4px !important;
    padding-right: 4px !important;
    font-size: 9px !important;
  }

  .passenger-dropdown {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
}
</style>
