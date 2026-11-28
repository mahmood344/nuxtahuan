<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useFlightStore } from '~/stores/flights'

// Encode cookie values as UTF-8 Base64 (not encryption).
function encodeCookie(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  return btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''))
}


definePageMeta({ layout: false })
const flightStore = useFlightStore()
// Encode cookie names (ASCII names, no Base64 padding).
function encodeCookieName(name) {
  return btoa(name).replace(/=+$/, '')
}

const adminCookie = useCookie(encodeCookieName('admin'), { path: '/', sameSite: 'lax' })
const rolesCookie = useCookie(encodeCookieName('roles'), { path: '/', sameSite: 'lax' })
// Remove legacy cookies on entry.
const legacyAdminCookie = useCookie('admin', { path: '/', sameSite: 'lax' })
const legacyRolesCookie = useCookie('roles', { path: '/', sameSite: 'lax' })
const error = ref('')
const submitting = ref(false)
const logo = '/imgs/hotel/Menu/logo.png'

async function handleLoginSuccess() {
  if (submitting.value) return
  error.value = ''
  submitting.value = true
  try {
    const roles = Array.isArray(flightStore.userData?.roles) ? flightStore.userData.roles : []
    const normalizedRoles = roles.map(role => String(typeof role === 'string' ? role : role?.name || role?.roleName || '').trim().toLowerCase())
    if (!normalizedRoles.includes('menu')) {
      adminCookie.value = null
      rolesCookie.value = null
      error.value = 'شما مجوز ورود به پنل مدیریت را ندارید.'
      return
    }
    rolesCookie.value = encodeCookie(normalizedRoles)
    adminCookie.value = encodeCookie(true)
    await navigateTo('/links/menu/restaurant', { replace: true })
  } catch {
    adminCookie.value = null
    rolesCookie.value = null
    error.value = 'خطا در ورود به پنل مدیریت.'
  } finally {
    submitting.value = false
  }
}
function openLogin() {
  if (submitting.value) return
  error.value = ''
  adminCookie.value = null
  rolesCookie.value = null
  flightStore.authStep = 'mobile'
  flightStore.mobile = ''
  flightStore.error = ''
  flightStore.successMessage = ''
  flightStore.pendingAction = handleLoginSuccess
  flightStore.isAuthModalOpen = true
}
onMounted(() => {
  legacyAdminCookie.value = null
  legacyRolesCookie.value = null
  openLogin()
})
onUnmounted(() => {
  if (flightStore.pendingAction === handleLoginSuccess) flightStore.pendingAction = null
  flightStore.closeModal()
})
</script>

<template>
  <main dir="rtl" class="flex min-h-dvh w-full items-center justify-center bg-[#F8F8FA] px-4 py-10">
    <div class="w-full max-w-[400px] space-y-5 rounded-[24px] bg-white p-7 shadow-sm">
      <div class="flex flex-col items-center text-center">
        <div class="mb-5 h-[120px] w-[120px] overflow-hidden rounded-full shadow-md">
          <img :src="logo" alt="لوگوی شرکت آهوان" class="h-full w-full object-cover" />
        </div>
        <h1 class="text-xl font-extrabold text-gray-800">پنل ورود مدیریت</h1>
        <p class="mt-2 text-sm text-gray-500">شرکت خدمات مسافرتی آهوان</p>
      </div>
      <p v-if="error" role="alert" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{{ error }}</p>
      <button type="button" :disabled="submitting" class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60" @click="openLogin">
        <i v-if="submitting" class="bi bi-arrow-repeat animate-spin"></i>
        <span>{{ submitting ? 'در حال ورود...' : 'ورود به پنل مدیریت' }}</span>
      </button>
    </div>
    <AuthModal />
  </main>
</template>
