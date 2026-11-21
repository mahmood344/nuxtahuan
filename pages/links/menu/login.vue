
<script setup>
import { ref } from 'vue'
import { useHotelStore } from '~/stores/hotels'

definePageMeta({ layout: false })

const hotelStore = useHotelStore()
const adminCookie = useCookie('admin', {
  path: '/',
  sameSite: 'lax'
})

const username = ref('')
const password = ref('')
const error = ref('')
const showPassword = ref(false)
const submitting = ref(false)

const logo = '/imgs/hotel/Menu/logo.png'

const login = async () => {
  if (submitting.value) return

  error.value = ''

  if (!username.value.trim() || !password.value) {
    error.value = 'نام کاربری و رمز عبور را وارد کنید.'
    return
  }

  if (!hotelStore.validateMenuUser(username.value, password.value)) {
    error.value = 'نام کاربری یا رمز عبور اشتباه است.'
    return
  }

  submitting.value = true

  try {
    adminCookie.value = 'true'

    await navigateTo('/links/menu/restaurant', {
      replace: true
    })
  } catch (err) {
    error.value = 'خطا در ورود به پنل مدیریت.'
    adminCookie.value = null
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main
    dir="rtl"
    class="flex min-h-dvh w-full items-center justify-center bg-[#F8F8FA] px-4 py-10"
  >
    <form
      class="w-full max-w-[400px] space-y-5 rounded-[24px] bg-white p-7 shadow-sm"
      @submit.prevent="login"
    >
      <!-- لوگو و عنوان -->
      <div class="flex flex-col items-center text-center">
        <div
          class="mb-5 h-[120px] w-[120px] overflow-hidden rounded-full shadow-md"
        >
          <img
            :src="logo"
            alt="لوگوی شرکت آهوان"
            class="h-full w-full object-cover"
          />
        </div>

        <h1 class="text-xl font-extrabold text-gray-800">
          پنل ورود مدیریت
        </h1>

        <p class="mt-2 text-sm text-gray-500">
          شرکت خدمات مسافرتی آهوان
        </p>
      </div>

      <!-- نام کاربری -->
      <div>
        <label
          for="menu-username"
          class="mb-2 block text-sm font-bold text-gray-700"
        >
          نام کاربری
        </label>

        <input
          id="menu-username"
          v-model="username"
          type="text"
          autocomplete="username"
          :disabled="submitting"
          class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-primary disabled:opacity-60"
          placeholder="نام کاربری یا شماره موبایل"
        />
      </div>

      <!-- رمز عبور -->
      <div>
        <label
          for="menu-password"
          class="mb-2 block text-sm font-bold text-gray-700"
        >
          رمز عبور
        </label>

        <div class="relative">
          <input
            id="menu-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            :disabled="submitting"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 pl-12 outline-none transition-colors focus:border-primary disabled:opacity-60"
            placeholder="رمز عبور"
          />

          <button
            type="button"
            class="absolute inset-y-0 left-3 flex items-center text-lg text-gray-500"
            :aria-label="showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'"
            @click="showPassword = !showPassword"
          >
            <i
              :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
            ></i>
          </button>
        </div>
      </div>

      <!-- خطا -->
      <p
        v-if="error"
        role="alert"
        class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
      >
        {{ error }}
      </p>

      <!-- دکمه ورود -->
      <button
        type="submit"
        :disabled="submitting"
        class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <i
          v-if="submitting"
          class="bi bi-arrow-repeat animate-spin"
        ></i>

        <span>
          {{ submitting ? 'در حال ورود...' : 'ورود به پنل مدیریت' }}
        </span>
      </button>
    </form>
  </main>
</template>
