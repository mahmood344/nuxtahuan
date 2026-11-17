import {defineStore} from 'pinia'

let pendingOriginsRequest = null

const normalizeCity = value => String(value || '')
  .replace(/ي/g, 'ی').replace(/ك/g, 'ک')
  .replace(/\u200c/g, ' ').replace(/\s+/g, ' ').trim()

const popularCityNames = ['تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'کرج', 'قم', 'رشت', 'اهواز', 'یزد']


export const useBusStore=defineStore(
 'bus',
 {

  state:()=>({
    // Fetched on first selection of bus service; only unique cities are stored.
    cities: [],
    popularCities: [],
    originsLoading: false,
    originsLoaded: false,
    originsError: '',

      "companies": [
    {
      "name": "ایران پیما",
      "code": "iranpeyma",
      "image": '/imgs/bus/iranpeyma.svg',
      "pageUrl": "https://payaneh.ir/company-bus/iranpeyma"
    },
    {
      "name": "همسفر",
      "code": "hamsafar",
      "image": '/imgs/bus/hamsafar.svg',
      "pageUrl": "https://payaneh.ir/company-bus/hamsafar"
    },
    {
      "name": "ترابر بی تا",
      "code": "tbt",
      "image": '/imgs/bus/bita.svg',
      "pageUrl": "https://payaneh.ir/company-bus/tbt"
    },
    {
      "name": "آریا سفر",
      "code": "aryasafar",
      "image": '/imgs/bus/ariya.svg',
      "pageUrl": "https://payaneh.ir/company-bus/aryasafar"
    },
    {
      "name": "پیک معتمد (پی ام تی)",
      "code": "pmt",
      "image": '/imgs/bus/pmt.svg',
      "pageUrl": "https://payaneh.ir/company-bus/pmt"
    },
    {
      "name": "گیتی پیما",
      "code": "gitipeyma",
      "image": '/imgs/bus/giti.svg',
      "pageUrl": "https://payaneh.ir/company-bus/gitipeyma"
    },
    {
      "name": "تک سفر ایرانیان",
      "code": "taksafar",
      "image": '/imgs/bus/tak.svg',
      "pageUrl": "https://payaneh.ir/company-bus/taksafar"
    },
    {
      "name": "سیر و سفر",
      "code": "seirosafar",
      "image": '/imgs/bus/seirsafar.svg',
      "pageUrl": "https://payaneh.ir/company-bus/seirosafar"
    },
    {
      "name": "لوان نور",
      "code": "lavannour",
      "image": '/imgs/bus/lavan.svg',
      "pageUrl": "https://payaneh.ir/company-bus/lavannour"
    },
    {
      "name": "عدل",
      "code": "adl",
      "image": '/imgs/bus/adl.svg',
      "pageUrl": "https://payaneh.ir/company-bus/adl"
    },
    {
      "name": "پیک صبا",
      "code": "peykesaba",
      "image": '/imgs/bus/saba.svg',
      "pageUrl": "https://payaneh.ir/company-bus/peykesaba"
    },
    {
      "name": "رویال سفر ایرانیان",
      "code": "royalsafar",
      "image": '/imgs/bus/royal.svg',
      "pageUrl": "/imgs/bus/royal.svg"
    },
    {
      "name": "گیتی نورد",
      "code": "gitinavard",
      "image": '/imgs/bus/gitinavard.svg',
      "pageUrl": "https://payaneh.ir/company-bus/gitinavard"
    },
    {
      "name": "مارال سیر ایرانیان",
      "code": "maralseir",
      "image": '/imgs/bus/maral.svg',
      "pageUrl": "https://payaneh.ir/company-bus/maralseir"
    },
    {
      "name": "ماهان سفر",
      "code": "mahansafar",
      "image": '/imgs/bus/mahan.svg',
      "pageUrl": "https://payaneh.ir/company-bus/mahansafar"
    },
    {
      "name": "ایران پیمان",
      "code": "iranpeyman",
      "image": '/imgs/bus/iranpeyman.svg',
      "pageUrl": "https://payaneh.ir/company-bus/iranpeyman"
    },
    {
      "name": "میهن نور",
      "code": "mihannour",
      "image": '/imgs/bus/mihan.svg',
      "pageUrl": "https://payaneh.ir/company-bus/mihannour"
    },
    {
      "name": "آسیا سفر",
      "code": "asiasafar",
      "image": '/imgs/bus/asiyasafar.svg',
      "pageUrl": "https://payaneh.ir/company-bus/asiasafar"
    },
    {
      "name": "ایمن سفر ایرانیان",
      "code": "imensafariranian",
      "image": '/imgs/bus/imensafar.svg',
      "pageUrl": "https://payaneh.ir/company-bus/imensafariranian"
    },
    {
      "name": "آرتا سبلان",
      "code": "artasabalan",
      "image": '/imgs/bus/arta.svg',
      "pageUrl": "https://payaneh.ir/company-bus/artasabalan"
    },
    {
      "name": "کیان سفر پاسارگاد",
      "code": "kiansafarpasargad",
      "image": '/imgs/bus/kiyan.svg',
      "pageUrl": "https://payaneh.ir/company-bus/kiansafarpasargad"
    },
    {
      "name": "سفر سیر",
      "code": "safarseir",
      "image": '/imgs/bus/safirseir.svg',
      "pageUrl": "https://payaneh.ir/company-bus/safarseir"
    },
    {
      "name": "جوان سیر ایثار",
      "code": "javanseireisar",
      "image": '/imgs/bus/javan.svg',
      "pageUrl": "https://payaneh.ir/company-bus/javanseireisar"
    },
    {
      "name": "آرو",
      "code": "aro",
      "image": '/imgs/bus/aro.svg',
      "pageUrl": "https://payaneh.ir/company-bus/aro"
    },
    {
      "name": "سپهر آسیا",
      "code": "sepehrasia",
      "image": '/imgs/bus/sepehr.svg',
      "pageUrl": "https://payaneh.ir/company-bus/sepehrasia"
    },
    {
      "name": "پارسیان",
      "code": "parsian",
      "image": '/imgs/bus/parsian.svg',
      "pageUrl": "https://payaneh.ir/company-bus/parsian"
    },
    {
      "name": "راهپیمای پارسیان",
      "code": "rahpeymaparsian",
      "image": '/imgs/bus/rahparsian.svg',
      "pageUrl": "https://payaneh.ir/company-bus/rahpeymaparsian"
    },
    {
      "name": "جهان گشت مهر",
      "code": "jahangashtmehr",
      "image": '/imgs/bus/jahangasht.svg',
      "pageUrl": "https://payaneh.ir/company-bus/jahangashtmehr"
    }
  ]

  
  }),


  getters:{


  },


  actions: {
    async loadOrigins(force = false) {
      if (!force && this.originsLoaded && this.cities.length) return this.cities
      if (pendingOriginsRequest) return pendingOriginsRequest

      this.originsLoading = true
      this.originsError = ''
      pendingOriginsRequest = (async () => {
        try {
          const response = await $fetch('https://api.ahuan.ir/api/nira-bus/origins')
          if (!Array.isArray(response?.data)) throw new Error('فهرست شهرهای اتوبوس معتبر نیست.')

          const citiesByName = new Map()
          for (const item of response.data) {
            // Terminal names such as "تهران بیهقی" must not become independent cities.
            // originCity is the city; originName may contain a terminal label.
            const name = normalizeCity(item?.originCity || item?.originName)
            const itemName = normalizeCity(item?.originName)
            const code = String(item?.origin || '').trim().toLowerCase()
            if (!name || !code) continue

            const key = name.toLocaleLowerCase('fa-IR')
            const current = citiesByName.get(key)
            const isMainCityCode = name === itemName
            if (!current || (isMainCityCode && !current.isMainCityCode)) {
              citiesByName.set(key, { name, code, isMainCityCode })
            }
          }

          const cities = [...citiesByName.values()]
            .map(({ name, code }) => ({ name, code }))
            .sort((a, b) => a.name.localeCompare(b.name, 'fa'))
          if (!cities.length) throw new Error('هیچ شهری از سرویس اتوبوس دریافت نشد.')

          const byName = new Map(cities.map(city => [normalizeCity(city.name), city]))
          // Popular cities must come from the same API response, not hardcoded city objects.
          this.cities = cities
          this.popularCities = popularCityNames.map(name => byName.get(name)).filter(Boolean)
          this.originsLoaded = true
          return cities
        } catch (error) {
          this.originsError = error?.message || 'خطا در دریافت شهرهای اتوبوس'
          throw error
        } finally {
          this.originsLoading = false
          pendingOriginsRequest = null
        }
      })()
      return pendingOriginsRequest
    }
  }

 }
)