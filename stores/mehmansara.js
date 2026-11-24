import { defineStore } from 'pinia'

const provinces = [
    ['اصفهان','esfehan'],
  ['اردبیل','ardebil'],['البرز','alborz'],['ایلام','ilam'],
  ['آذربایجان شرقی','azarbayjanSharghi'],['آذربایجان غربی','azarbayjangharbi'],
  ['بوشهر','boushehr'],['تهران','tehran'],['چهارمحال و بختیاری','charmahal'],
  ['خراسان جنوبی','khorasanJonubi'],['خراسان رضوی','khorasanRazavi'],['خراسان شمالی','khorasanShomali'],
  ['خوزستان','khuzestan'],['زنجان','zanjan'],['سمنان','semnan'],['سیستان و بلوچستان','sistanbalouchestan'],
  ['فارس','fars'],['قزوین','ghazvin'],['قم','ghom'],['کردستان','kordestan'],
  ['کرمان','kerman'],['کرمانشاه','kermanShah'],['کهگیلویه و بویراحمد','kohkiluye'],
  ['گلستان','golestan'],['گیلان','gilan'],['لرستان','lorestan'],['مازندران','mazandaran'],
  ['مرکزی','markazi'],['هرمزگان','hormozgan'],['همدان','hamedan'],['یزد','yazd']
]

export const useMehmansaraStore = defineStore('mehmansara', {
  state: () => ({
    allCities: provinces.map(([text, icon]) => ({ text, image: `/icons/mehmansara/icons/${icon}.png` })),
    places: [], loading: false, loaded: false, error: ''
  }),
  actions: {
    async loadPlaces() {
      if (this.loading) return
      this.loading = true
      this.error = ''
      try {
        const response = await $fetch('https://mehmansara.ahuan.ir/api/places')
        const items = Array.isArray(response) ? response : response?.data ?? response?.Data ?? response?.places
        if (!Array.isArray(items)) throw new Error('ساختار پاسخ API قابل شناسایی نیست.')
        this.places = items
        this.loaded = true
      } catch (error) {
        this.error = error?.data?.message || error?.message || 'دریافت اطلاعات مهمانسراها ناموفق بود.'
      } finally {
        this.loading = false
      }
    }
  }
})
