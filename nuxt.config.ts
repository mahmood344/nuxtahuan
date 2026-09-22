import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    baseUrl: 'https://api.ahuan.ir'
  },
  css: ['~/assets/css/main.css', '~/assets/css/bootstrap-icons.css'],
  devtools: { enabled: false },
  app: {
    head: {
       title: 'خدمات گردشگری آهوان',

      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/logoSite.png'
        }
      ],
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl'
      }
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  }
})
