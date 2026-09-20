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
          bi bi-tree
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
        تورهای طبیعت‌گردی آهوان
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
        :to="`/naturetours/${tour.id}`"
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
        to="/naturetours"
        class="inline-flex"
      >
        <UiBaseButton
          label="تورهای بیشتر +"
          variant="outline"
          color="primary"
          :active="false"
          class="
            !rounded-full
            !px-5
            !py-2
            !text-[12px]
          "
        />
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
const tours = [
  {
    id: 1,
    title: 'تور روستای شهرستانک',
    image:
      '/imgs/tours/NatureTours/sahrestanak.jpg'
  },
  {
    id: 2,
    title: 'تور روستای برغان',
    image:
      '/imgs/tours/NatureTours/baraghan.jpg'
  },
  {
    id: 3,
    title: 'تور جنگل بلیران',
    image:
      '/imgs/tours/NatureTours/beliran.jpg'
  },
  {
    id: 4,
    title: 'تور روستای هرانده',
    image:
      '/imgs/tours/NatureTours/harande.jpg'
  }
]
</script>