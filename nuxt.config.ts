import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@pinia/nuxt'],
    css: ['~/assets/css/main.css','~/assets/css/bootstrap-icons.css'],
  devtools: { enabled: false },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  }
})
