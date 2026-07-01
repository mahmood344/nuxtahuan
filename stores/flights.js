import { searchAllProviders } from '~/services/searchFlights.js'

export const useFlightStore  = defineStore('flights', {
  state: () => ({
    popularCities: [
{
  id: 1001,
  countryCode: "IR",
  countryNicName: "ایران",
  cityName: "Tehran",
  cityNicName: "تهران",
  cityCode: "THR",
  iataCode: "THR",
  name: "Mehrabad Airport",
  nicName: "فرودگاه مهرآباد",
  isCity: false,
  latitude: null,
  longitude: null,
  orderId: 1
},
{
  id: 1002,
  countryCode: "IR",
  countryNicName: "ایران",
  cityName: "Mashhad",
  cityNicName: "مشهد",
  cityCode: "MHD",
  iataCode: "MHD",
  name: "Mashhad Intl",
  nicName: "فرودگاه بین‌المللی شهید هاشمی‌نژاد",
  isCity: false,
  latitude: null,
  longitude: null,
  orderId: 2
},
{
  id: 1003,
  countryCode: "IR",
  countryNicName: "ایران",
  cityName: "Shiraz",
  cityNicName: "شیراز",
  cityCode: "SYZ",
  iataCode: "SYZ",
  name: "Shiraz Intl",
  nicName: "فرودگاه بین‌المللی شیراز",
  isCity: false,
  latitude: null,
  longitude: null,
  orderId: 3
},
{
  id: 1004,
  countryCode: "IR",
  countryNicName: "ایران",
  cityName: "Isfahan",
  cityNicName: "اصفهان",
  cityCode: "IFN",
  iataCode: "IFN",
  name: "Isfahan Intl",
  nicName: "فرودگاه بین‌المللی شهید بهشتی",
  isCity: false,
  latitude: null,
  longitude: null,
  orderId: 4
},
{
  id: 1005,
  countryCode: "IR",
  countryNicName: "ایران",
  cityName: "Ahvaz",
  cityNicName: "اهواز",
  cityCode: "AWZ",
  iataCode: "AWZ",
  name: "Ahvaz Airport",
  nicName: "فرودگاه اهواز",
  isCity: false,
  latitude: null,
  longitude: null,
  orderId: 5
},
{
  id: 1006,
  countryCode: "IR",
  countryNicName: "ایران",
  cityName: "Kish",
  cityNicName: "کیش",
  cityCode: "KIH",
  iataCode: "KIH",
  name: "Kish Airport",
  nicName: "فرودگاه بین‌المللی کیش",
  isCity: false,
  latitude: null,
  longitude: null,
  orderId: 6
},
{
  id: 1007,
  countryCode: "IR",
  countryNicName: "ایران",
  cityName: "Bandar Abbas",
  cityNicName: "بندرعباس",
  cityCode: "BND",
  iataCode: "BND",
  name: "Bandar Abbas Intl",
  nicName: "فرودگاه بین‌المللی بندرعباس",
  isCity: false,
  latitude: null,
  longitude: null,
  orderId: 7
},
{
  id: 1008,
  countryCode: "IR",
  countryNicName: "ایران",
  cityName: "Gonabad",
  cityNicName: "گناباد",
  cityCode: "GNB",
  iataCode: "GNB",
  name: "Gonabad Airport",
  nicName: "فرودگاه شهدای گناباد",
  isCity: false,
  latitude: null,
  longitude: null,
  orderId: 8
}
],
    iranAirports : [
{
id: 1,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Tehran",
cityNicName: "تهران",
cityCode: "THR",
iataCode: "THR",
name: "Mehrabad Arpt",
nicName: "فرودگاه مهرآباد",
isCity: false,
latitude: null,
longitude: null,
orderId: 1
},
{
id: 2,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Gonabad",
cityNicName: "گناباد",
cityCode: "MDN",
iataCode: "MDN",
name: "Shahadaey Gonabad Arpt",
nicName: "فرودگاه شهدای گناباد",
isCity: false,
latitude: null,
longitude: null,
orderId: 2
},
{
id: 3,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Mashhad",
cityNicName: "مشهد",
cityCode: "MHD",
iataCode: "MHD",
name: "Mashad Arpt",
nicName: "فرودگاه مشهد",
isCity: false,
latitude: null,
longitude: null,
orderId: 3
},
{
id: 4,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Shiraz",
cityNicName: "شیراز",
cityCode: "SYZ",
iataCode: "SYZ",
name: "Shiraz Arpt",
nicName: "فرودگاه شیراز",
isCity: false,
latitude: null,
longitude: null,
orderId: 4
},
{
id: 5,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Ahwaz",
cityNicName: "اهواز",
cityCode: "AWZ",
iataCode: "AWZ",
name: "Ahwaz Arpt",
nicName: "فرودگاه اهواز",
isCity: false,
latitude: null,
longitude: null,
orderId: 5
},
{
id: 6,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Isfahan",
cityNicName: "اصفهان",
cityCode: "IFN",
iataCode: "IFN",
name: "Isfahan Arpt",
nicName: "فرودگاه اصفهان",
isCity: false,
latitude: null,
longitude: null,
orderId: 6
},
{
id: 7,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Tabriz",
cityNicName: "تبریز",
cityCode: "TBZ",
iataCode: "TBZ",
name: "Tabriz International Arpt",
nicName: "فرودگاه تبریز",
isCity: false,
latitude: null,
longitude: null,
orderId: 7
},
{
id: 8,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Kish",
cityNicName: "کیش",
cityCode: "KIH",
iataCode: "KIH",
name: "Kish Island Arpt",
nicName: "فرودگاه کیش",
isCity: false,
latitude: null,
longitude: null,
orderId: 8
},
{
id: 9,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Bandar Abbas",
cityNicName: "بندر عباس",
cityCode: "BND",
iataCode: "BND",
name: "Bandar Abbas Arpt",
nicName: "فرودگاه بندرعباس",
isCity: false,
latitude: null,
longitude: null,
orderId: 9
},
{
id: 10,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Qeshm",
cityNicName: "قشم",
cityCode: "GSM",
iataCode: "GSM",
name: "Dayrestan Airport",
nicName: "فرودگاه قشم",
isCity: false,
latitude: null,
longitude: null,
orderId: 10
},
{
id: 11,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Gorgan",
cityNicName: "گرگان",
cityCode: "GBT",
iataCode: "GBT",
name: "Gorgon Airport",
nicName: "فرودگاه گرگان",
isCity: false,
latitude: null,
longitude: null,
orderId: 11
},
{
id: 12,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Ramsar",
cityNicName: "رامسر",
cityCode: "RZR",
iataCode: "RZR",
name: "Ramsar Airport",
nicName: "فرودگاه رامسر",
isCity: false,
latitude: null,
longitude: null,
orderId: 12
},
{
id: 13,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Bushehr",
cityNicName: "بوشهر",
cityCode: "BUZ",
iataCode: "BUZ",
name: "Bushehr Arpt",
nicName: "فرودگاه بوشهر",
isCity: false,
latitude: null,
longitude: null,
orderId: 13
},
{
id: 14,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Lar",
cityNicName: "لار",
cityCode: "LRR",
iataCode: "LRR",
name: "Lar Airport",
nicName: "فرودگاه لار",
isCity: false,
latitude: null,
longitude: null,
orderId: 14
},
{
id: 15,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Zanjan",
cityNicName: "زنجان",
cityCode: "JWN",
iataCode: "JWN",
name: "Zanjan Arpt",
nicName: "فرودگاه زنجان",
isCity: false,
latitude: null,
longitude: null,
orderId: 15
},
{
id: 16,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Lamard",
cityNicName: "لامرد",
cityCode: "LFM",
iataCode: "LFM",
name: "Lamerd Airport",
nicName: "فرودگاه لامرد",
isCity: false,
latitude: null,
longitude: null,
orderId: 16
},
{
id: 17,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Sari",
cityNicName: "ساری",
cityCode: "SRY",
iataCode: "SRY",
name: "Dasht-e Naz Airport",
nicName: "فرودگاه ساری",
isCity: false,
latitude: null,
longitude: null,
orderId: 17
},
{
id: 18,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Birjand",
cityNicName: "بیرجند",
cityCode: "XBJ",
iataCode: "XBJ",
name: "Birjand Airport",
nicName: "فرودگاه بیرجند",
isCity: false,
latitude: null,
longitude: null,
orderId: 18
},
{
id: 19,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Sabzevar",
cityNicName: "سبزوار",
cityCode: "AFZ",
iataCode: "AFZ",
name: "Sabzevar Airport",
nicName: "فرودگاه سبزوار",
isCity: false,
latitude: null,
longitude: null,
orderId: 19
},
{
id: 20,
countryCode: "IR",
countryNicName: "ایران",
cityName: "Mahshahr",
cityNicName: "ماهشهر",
cityCode: "MRX",
iataCode: "MRX",
name: "Mahshahr Airport",
nicName: "فرودگاه ماهشهر",
isCity: false,
latitude: null,
longitude: null,
orderId: 20
}
],
 airlines: [
  {
    code: 'I3',
    name: 'آتا',
    credentials: { username: 'THR155.WS', password: 'Ahuan1348' }
    // logo: require('@/assets/image/new images/airlines/لوگوی_آتا.png')
  },
  {
    code: 'Y9',
    name: 'کیش‌ایر',
    credentials: { username: 'THR100.WS', password: 'Ahuan1348' }
    // logo: require('@/assets/image/new images/airlines/لوگوی_کیش ایر.png')
  },
  {
    code: 'QB',
    name: 'قشم‌ایر',
    credentials: { username: 'THR166.WS', password: 'Ahuan1348' }
    // logo: require('@/assets/image/new images/airlines/لوگوی_قشم ایر.png')
  },
  {
    code: 'HH',
    name: 'تابان',
    credentials: { username: 'THR168.WS', password: 'Ahuan1348' }
    // logo: require('@/assets/image/new images/airlines/لوگوی_تابان.png')
  },
  {
    code: 'EP',
    name: 'آسمان',
    credentials: { username: 'THR100.WS', password: 'Ahuan1348' }
    // logo: require('@/assets/image/new images/airlines/لوگوآسمان.png')
  },
  {
    code: 'ZV',
    name: 'زاگرس',
    credentials: { username: 'THR197.WS', password: 'Ahuan1348' }
    // logo: require('@/assets/image/new images/airlines/zagros.png')
  },
  {
    code: 'NV',
    name: 'نفت',
    credentials: { username: 'THR100.WS', password: 'Ahuan1348' }
    // logo: require('@/assets/image/airlines/karonnewimage.png')
  },
  {
    code: 'J1',
    name: 'معراج',
    credentials: { username: 'THR158.WS', password: 'THR158AH' }
    // logo: require('@/assets/image/new images/airlines/لوگوی_معراج.png')
  },
  {
    code: 'VR',
    name: 'وارش',
    credentials: { username: 'THR215.WS', password: 'A2930' }
    // logo: require('@/assets/image/new images/airlines/لوگوی_وارش.png')
  },
  {
    code: 'IRZ',
    name: 'ساها',
    credentials: { username: 'THR140.WS', password: '123456789' }
    // logo: require('@/assets/image/new images/airlines/لوگوی_ساها.png')
  },
  {
    code: 'FP',
    name: 'فلای‌پرشیا',
    credentials: { username: 'THR106.WS', password: '123456789' }
    // logo: require('@/assets/image/new images/airlines/لوگوی_فلای‌پرشیا.png')
  },
  {
    code: 'IV',
    name: 'کاسپین',
    credentials: { username: 'THR100.WS', password: 'Ahuan1348' }
    // logo: require('@/assets/image/new images/airlines/لوگوی_کاسپین.png')
  },
  {
    code: 'PA',
    name: 'پارس‌ایر',
    credentials: { username: 'THR226.WS', password: 'Ahouvan@2026' }
    // logo: require('@/assets/image/new images/airlines/لوگوی_پارس ایر.png')
  }
],
flights: [], // <--- مطمئن شو این آرایه خالی است و undefined یا null نیست
    loading: false,
    selectedFlight: null,
    iranAirports: [] // سایر اطلاعات شما
  }),
   actions: {
    async searchFlights(searchParams) {
      this.loading = true
      this.flights = [] // ریست کردن لیست پروازها قبل از جستجوی جدید
      try {
        const results = await searchAllProviders(searchParams)
        // اطمینان از اینکه خروجی حتما آرایه است
        this.flights = Array.isArray(results) ? results : []
      } catch (error) {
        console.error('خطا در بارگذاری پروازها در استور:', error)
        this.flights = [] // در صورت بروز خطا آرایه خالی بماند
      } finally {
        this.loading = false
      }
    },

    async loadFlightDetails(flight) {
      this.selectedFlight = flight
      if (!flight.needsFare || flight.fareDetails) return

      try {
        // فراخوانی جزئیات نرخ
      } catch (error) {
        console.error('خطا در دریافت جزئیات قیمت:', error)
      }
    }
  }
})