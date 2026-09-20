<template>
  <section
    class="mx-auto w-full max-w-7xl px-4 py-10"
    dir="rtl"
  >
    <!-- Header -->
    <div
      class="mb-5 flex items-center justify-start gap-2"
    >
      <i
        class="
          bi bi-airplane
          text-[24px]
          text-[var(--color-gray-600)]
        "
      ></i>

      <h2
        class="
          text-[14px]
          font-black
          text-[var(--color-gray-700)]
        "
      >
        پیشنهادهای ویژه آهوان
      </h2>
    </div>

    <!-- Cards -->
    <div
      class="
        grid
        grid-cols-2
        gap-2
        md:grid-cols-4
      "
    >
      <NuxtLink
        v-for="tour in tours"
        :key="tour.id"
        :to="`/domesticinternationaltours/${tour.routeId}`"
        class="
          group
          relative
          h-[400px]
          overflow-hidden
          rounded-lg
          shadow-md
        "
      >
        <!-- Image -->
        <img
          :src="tour.image"
          :alt="tour.title"
          class="
            h-full
            w-full
            object-cover
            transition
            duration-500
            group-hover:scale-105
          "
        >

        <!-- Overlay -->
        <div
          class="
            absolute
            inset-0
            flex
            items-center
            justify-center

            bg-[var(--color-gray-800)]/0
            opacity-0
            backdrop-blur-0

            transition-all
            duration-500

            group-hover:bg-[var(--color-gray-800)]/50
            group-hover:opacity-100
            group-hover:backdrop-blur-[2px]
          "
        >
          <div
            class="
              flex
              items-center
              gap-3
              text-[var(--color-white)]
            "
          >
            <span
              class="
                h-[1px]
                w-8
                bg-[var(--color-white)]/80
              "
            ></span>

            <span
              class="
                text-[16px]
                font-black
                drop-shadow-md
              "
            >
              {{ tour.title }}
            </span>

            <span
              class="
                h-[1px]
                w-8
                bg-[var(--color-white)]/80
              "
            ></span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- More -->
    <div
      class="mt-6 flex justify-center"
    >
      <NuxtLink
        to="/domesticinternationaltours"
        class="inline-flex"
      >
       <UiBaseButton
  label="مقاصد بیشتر +"
  variant="outline"
  color="primary"
  :active="false"
  class="!text-[12px] !rounded-[999px] !px-5 !py-2"
/>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
const tours = [
  {
    id: 1,
    routeId: 1,
    title: 'تور استانبول',
    image:
      '/imgs/tours/DomesticInternationalTours/estanboul.jpg'
  },
  {
    id: 2,
    routeId: 1102,
    title: 'تور شیراز',
    image:
      '/imgs/tours/DomesticInternationalTours/shiraz.jpg'
  },
  {
    id: 3,
    routeId: 1103,
    title: 'تور کاشان',
    image:
      '/imgs/tours/DomesticInternationalTours/kashan.jpg'
  },
  {
    id: 4,
    routeId: 1039,
    title: 'تور مشهد',
    image:
      '/imgs/tours/DomesticInternationalTours/mashad.jpg'
  }
]
</script>