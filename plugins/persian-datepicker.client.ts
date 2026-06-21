export default defineNuxtPlugin(async (nuxtApp) => {
  const module: any = await import('@alireza-ab/vue3-persian-datepicker')

  const PersianDatePicker =
    module.default || module.PersianDatePicker

  nuxtApp.vueApp.component('PersianDatePicker', PersianDatePicker)
})
