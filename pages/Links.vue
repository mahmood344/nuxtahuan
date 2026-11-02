
<script setup>
import bg from '/imgs/hotel/menu/background.webp'
import logo from '/imgs/hotel/menu/logo.png'
import baleIcon from '/imgs/hotel/menu/bale.png'
import rubikaIcon from '/imgs/hotel/menu/rubika.png'

definePageMeta({
  layout: false
})

const dataLinks = [
  {
    link: 'https://menu.ahuan.ir/hotel/#/main-page',
    text: 'اطلاعات هتل و جاذبه‌های گردشگری اطراف آن',
    icon: 'bi-link-45deg'
  },
  {
    link: 'https://menu.ahuan.ir/menu/main.html#/resturant',
    text: 'منو رستوران هتل آهوان',
    icon: 'bi-link-45deg'
  },
  {
    link: 'https://menu.ahuan.ir/menu/main.html#/coffeshop',
    text: 'منو کافی شاپ هتل آهوان',
    icon: 'bi-link-45deg'
  },
  {
    link: 'https://ahuan.ir/#/',
    text: 'وبسایت آهوان',
    icon: 'bi-link-45deg'
  },
  {
    link: 'https://ble.ir/ahuan',
    text: 'بله',
    image: baleIcon
  },
  {
    link: 'https://rubika.ir/page/Ahuan_ir',
    text: 'روبیکا',
    image: rubikaIcon
  },
  {
    link: 'https://www.instagram.com/ahuan.ir/',
    text: 'اینستاگرام',
    icon: 'bi-instagram'
  },
  {
    link: 'https://t.me/ahuanchannel',
    text: 'تلگرام',
    icon: 'bi-telegram'
  },
  {
    link: 'tel:02141889',
    text: 'شماره دفتر تهران',
    icon: 'bi-phone'
  },
  {
    link: 'tel:0134205',
    text: 'شماره هتل آهوان',
    icon: 'bi-phone'
  }
]

const mapUrl = 'https://neshan.org/maps/iframe/places/6c52bf999046a1f5a86412570992652c#c37.014-50.489-19z-0p/37.01448958136726/50.48881518774127'
</script>

<template>
  <main dir="rtl" class="min-h-dvh bg-[#F5F9FC]">

    <div
      class="mx-auto min-h-dvh w-full max-w-[700px] bg-[#F5F9FC] bg-center bg-size-[700px] bg-repeat px-5 py-8 shadow-xl"
      :style="{ backgroundImage: `url(${bg})` }"
    >

      <!-- لوگو و عنوان -->
      <div class="mt-10 text-center">

        <div class="mx-auto h-[150px] w-[150px] overflow-hidden rounded-full shadow-md">
          <img
            :src="logo"
            alt="لوگوی شرکت آهوان"
            class="h-full w-full object-cover"
          />
        </div>

        <p class="mt-5 text-xl font-normal text-black">
          شرکت خدمات مسافرتی آهوان
        </p>

      </div>

      <p class="mt-1 text-center text-sm text-black/60" dir="ltr">
        Call it a dream
      </p>

      <!-- لینک ها -->
      <div class="mt-10">

        <template
          v-for="(item, index) in dataLinks"
          :key="index"
        >

          <div class="mt-4 w-full rounded bg-white shadow">

            <div class="flex min-h-[64px] items-center px-4 py-4">

              <!-- آیکن تصویری -->
              <img
                v-if="item.image"
                :src="item.image"
                alt=""
                class="ml-2 h-6 w-6 shrink-0 object-contain"
              />

              <!-- آیکن Bootstrap -->
              <i
                v-else
                :class="['bi', item.icon]"
                class="ml-2 text-2xl text-[#1A83B8]"
                aria-hidden="true"
              ></i>

              <!-- متن لینک -->
              <a
                :href="item.link"
                :target="item.link.startsWith('tel:') ? undefined : '_blank'"
                :rel="item.link.startsWith('tel:') ? undefined : 'noopener noreferrer'"
                class="text-base font-normal text-[#1A83B8] no-underline"
              >
                {{ item.text }}
              </a>

            </div>
          </div>

          <!-- جداکننده پس از آیتم سوم و هشتم -->
          <div
            v-if="index === 2 || index === 7"
            class="my-8 flex items-center justify-center gap-3 text-[#1A83B8]"
          >
            <span class="h-px w-full max-w-[120px] bg-[#1A83B8]"></span>

            <i class="bi bi-star-fill text-[18px]"></i>

            <span class="h-px w-full max-w-[120px] bg-[#1A83B8]"></span>
          </div>

        </template>
      </div>

      <!-- نقشه -->
      <div class="mt-4 overflow-hidden rounded bg-white shadow">

        <div class="relative h-[250px] w-full">

          <iframe
            title="map-iframe"
            :src="mapUrl"
            class="h-full w-full border-0"
            allowfullscreen
            loading="lazy"
          ></iframe>

          <!-- دکمه روی نقشه -->
          <a
            :href="mapUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-[20px] bg-black/40 px-[14px] py-[6px] text-[13px] whitespace-nowrap text-white no-underline backdrop-blur-[4px] transition-colors duration-300 hover:bg-black/20"
          >
            روی نقشه کلیک کنید
          </a>

        </div>
      </div>

      <!-- آدرس -->
      <div class="mt-8 text-center text-sm text-[#1A83B8]">

        <i class="bi bi-geo-alt-fill"></i>

        ضلع شمال غربی میدان آرژانتین، ساختمان بانک تجارت، پلاک 18

      </div>

    </div>
  </main>
</template>
