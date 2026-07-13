import { defineStore } from 'pinia'
import { searchAllProviders } from '~/services/searchFlights.js'

export const useFlightStore = defineStore('flights', {
  state: () => ({
    popularCities: [
      {
        id: 1,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Tehran',
        cityNicName: 'تی تی کیو',
        cityCode: 'TTQ',
        iataCode: 'THR',
        name: 'Mehrabad Arpt',
        nicName: 'فرودگاه مهرآباد',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 1
      },
      {
        id: 1,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Tehran',
        cityNicName: 'یوجی تی',
        cityCode: 'UGT',
        iataCode: 'THR',
        name: 'Mehrabad Arpt',
        nicName: 'فرودگاه مهرآباد',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 1
      },
      {
        id: 1001,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Tehran',
        cityNicName: 'تهران',
        cityCode: 'THR',
        iataCode: 'THR',
        name: 'Mehrabad Airport',
        nicName: 'فرودگاه مهرآباد',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 1
      },
      {
        id: 1002,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Mashhad',
        cityNicName: 'مشهد',
        cityCode: 'MHD',
        iataCode: 'MHD',
        name: 'Mashhad Intl',
        nicName: 'فرودگاه بین‌المللی شهید هاشمی‌نژاد',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 2
      },
      {
        id: 1003,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Shiraz',
        cityNicName: 'شیراز',
        cityCode: 'SYZ',
        iataCode: 'SYZ',
        name: 'Shiraz Intl',
        nicName: 'فرودگاه بین‌المللی شیراز',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 3
      },
      {
        id: 1004,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Isfahan',
        cityNicName: 'اصفهان',
        cityCode: 'IFN',
        iataCode: 'IFN',
        name: 'Isfahan Intl',
        nicName: 'فرودگاه بین‌المللی شهید بهشتی',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 4
      },
      {
        id: 1005,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Ahvaz',
        cityNicName: 'اهواز',
        cityCode: 'AWZ',
        iataCode: 'AWZ',
        name: 'Ahvaz Airport',
        nicName: 'فرودگاه اهواز',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 5
      },
      {
        id: 1006,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Kish',
        cityNicName: 'کیش',
        cityCode: 'KIH',
        iataCode: 'KIH',
        name: 'Kish Airport',
        nicName: 'فرودگاه بین‌المللی کیش',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 6
      },
      {
        id: 1007,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Bandar Abbas',
        cityNicName: 'بندرعباس',
        cityCode: 'BND',
        iataCode: 'BND',
        name: 'Bandar Abbas Intl',
        nicName: 'فرودگاه بین‌المللی بندرعباس',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 7
      },
      {
        id: 1008,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Gonabad',
        cityNicName: 'گناباد',
        cityCode: 'GNB',
        iataCode: 'GNB',
        name: 'Gonabad Airport',
        nicName: 'فرودگاه شهدای گناباد',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 8
      }
    ],

    iranAirports: [
      {
        id: 1,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Tehran',
        cityNicName: 'تهران',
        cityCode: 'THR',
        iataCode: 'THR',
        name: 'Mehrabad Arpt',
        nicName: 'فرودگاه مهرآباد',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 1
      },
      {
        id: 2,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Gonabad',
        cityNicName: 'گناباد',
        cityCode: 'MDN',
        iataCode: 'MDN',
        name: 'Shahadaey Gonabad Arpt',
        nicName: 'فرودگاه شهدای گناباد',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 2
      },
      {
        id: 3,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Mashhad',
        cityNicName: 'مشهد',
        cityCode: 'MHD',
        iataCode: 'MHD',
        name: 'Mashad Arpt',
        nicName: 'فرودگاه مشهد',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 3
      },
      {
        id: 4,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Shiraz',
        cityNicName: 'شیراز',
        cityCode: 'SYZ',
        iataCode: 'SYZ',
        name: 'Shiraz Arpt',
        nicName: 'فرودگاه شیراز',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 4
      },
      {
        id: 5,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Ahwaz',
        cityNicName: 'اهواز',
        cityCode: 'AWZ',
        iataCode: 'AWZ',
        name: 'Ahwaz Arpt',
        nicName: 'فرودگاه اهواز',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 5
      },
      {
        id: 6,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Isfahan',
        cityNicName: 'اصفهان',
        cityCode: 'IFN',
        iataCode: 'IFN',
        name: 'Isfahan Arpt',
        nicName: 'فرودگاه اصفهان',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 6
      },
      {
        id: 7,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Tabriz',
        cityNicName: 'تبریز',
        cityCode: 'TBZ',
        iataCode: 'TBZ',
        name: 'Tabriz International Arpt',
        nicName: 'فرودگاه تبریز',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 7
      },
      {
        id: 8,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Kish',
        cityNicName: 'کیش',
        cityCode: 'KIH',
        iataCode: 'KIH',
        name: 'Kish Island Arpt',
        nicName: 'فرودگاه کیش',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 8
      },
      {
        id: 9,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Bandar Abbas',
        cityNicName: 'بندر عباس',
        cityCode: 'BND',
        iataCode: 'BND',
        name: 'Bandar Abbas Arpt',
        nicName: 'فرودگاه بندرعباس',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 9
      },
      {
        id: 10,
        countryCode: 'IR',
        countryNicName: 'ایران',
        cityName: 'Qeshm',
        cityNicName: 'قشم',
        cityCode: 'GSM',
        iataCode: 'GSM',
        name: 'Dayrestan Airport',
        nicName: 'فرودگاه قشم',
        isCity: false,
        latitude: null,
        longitude: null,
        orderId: 10
      }
    ],

   airlines : [
  {
    code: 'I3',
    name: 'آتا',
    credentials: { username: 'THR155.WS', password: 'Ahuan1348' },
    logo: '/imgs/flight/airlines/ata.png'
  },
  {
    code: 'Y9',
    name: 'کیش‌ایر',
    credentials: { username: 'THR100.WS', password: 'Ahuan1348' },
    logo: '/imgs/flight/airlines/kishair.png'
  },
  {
    code: 'QB',
    name: 'قشم‌ایر',
    credentials: { username: 'THR166.WS', password: 'Ahuan1348' },
    logo: '/imgs/flight/airlines/gheshm.png'
  },
  {
    code: 'HH',
    name: 'تابان',
    credentials: { username: 'THR168.WS', password: 'Ahuan1348' },
    logo: '/imgs/flight/airlines/taban.png'
  },
  {
    code: 'EP',
    name: 'آسمان',
    credentials: { username: 'THR100.WS', password: 'Ahuan1348' },
    logo: '/imgs/flight/airlines/aseman.png'
  },
  {
    code: 'ZV',
    name: 'زاگرس',
    credentials: { username: 'THR197.WS', password: 'Ahuan1348' },
    logo: '/imgs/flight/airlines/zagros.png'
  },
  {
    code: 'NV',
    name: 'نفت',
    credentials: { username: 'THR100.WS', password: 'Ahuan1348' },
    logo: '/imgs/flight/airlines/naft.png'
  },
  {
    code: 'VR',
    name: 'وارش',
    credentials: { username: 'THR215.WS', password: 'A2930' },
    logo: '/imgs/flight/airlines/varesh.png'
  },
  {
    code: 'IRZ',
    name: 'ساها',
    credentials: { username: 'THR140.WS', password: '123456789' },
    logo: '/imgs/flight/airlines/saha.png'
  },
  {
    code: 'FP',
    name: 'فلای‌پرشیا',
    credentials: { username: 'THR106.WS', password: '123456789' },
    logo: '/imgs/flight/airlines/flypersia.png'
  },
  {
    code: 'IV',
    name: 'کاسپین',
    credentials: { username: 'THR100.WS', password: 'Ahuan1348' },
    logo: '/imgs/flight/airlines/caspian.png'
  },
  {
    code: 'PA',
    name: 'پارس‌ایر',
    credentials: { username: 'THR226.WS', password: 'Ahouvan@2026' },
    logo: '/imgs/flight/airlines/parsair1.png' // یا parsair1.png
  }
],


    flights: [],
    loading: false,
    backgroundLoading: false,
    searchFinished: false,
    selectedFlight: null
  }),

  getters: {
    pricedFlightsCount(state) {
      if (!state.flights) return 0

      return state.flights.filter((flight) => {
        const price = flight?.priceFrom
        if (price === null || price === undefined || price === '' || price === '-') {
          return false
        }

        const numPrice = Number(price)
        return !Number.isNaN(numPrice) && numPrice > 0
      }).length
    }
  },

  actions: {
    setFlights(flightsList) {
      this.flights = Array.isArray(flightsList) ? flightsList : []
    },

    async searchFlights(searchParams) {
      this.loading = true
      this.backgroundLoading = true
      this.searchFinished = false
      this.flights = []

      try {
        await searchAllProviders(searchParams)
      } catch (error) {
        console.error('خطا در بارگذاری پروازها در استور:', error)
        this.loading = false
        this.backgroundLoading = false
        this.searchFinished = true
      }
    },

    async loadFlightDetails(flight) {
      this.selectedFlight = flight
    }
  }
})
