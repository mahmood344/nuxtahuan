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

    airlines: [
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
        logo: '/imgs/flight/airlines/parsair1.png'
      }
    ],
airlineIdMap : {
  I3: 489,
  Y9: 1016,
  QB: 761,
  HH: 470,
  EP: 376,
  ZV: 1064,
  NV: 683,
  J1: 535,
  VR: 8,
  IRZ: 6,
  FP: 410,
  IV: 515,
  IS: 7,
  A1: 212,
  RI: 802,
  W5: 956,
  IR: 512,
  PA: 1072,
  PY: 4,
  B9: 256,
  A7: 218,
  YAZDAIR: 1074,
  AVAAIR: 1076,
  H8: 1070
},
    flights: [],
    loading: false,
    authLoading: false,
    backgroundLoading: false,
    searchFinished: false,

    selectedFlight: null,
    selectedDepartureFlight: null,
    selectedReturnFlight: null,
    currentStep: 0,
    abortController: null,
    lastSearchParams: null,

    pricingRefreshLoading: false,
    selectedFlightsFinalPricing: [],
    finalBookingPrice: 0,
    pricingRefreshError: '',
    isUserLoggedIn: false, 
   isAuthModalOpen: false,
    authStep: 'mobile', // 'mobile' | 'register' | 'otp'
    authLoading: false, // لودینگ اختصاصی برای بخش لاگین
    mobile: '',
    userData: null,
    error: '',
    successMessage: '',
    pendingAction: null,
  }),

  getters: {
     isLoggedIn: (state) => {
      // اگر از قبل در استیت به عنوان لاگین‌شده علامت‌گذاری شده یا کوکی وجود دارد
      if (state.isUserLoggedIn) return true
      const token = useCookie('token')
      return !!token.value
    },
    userName: (state) => state.userData ? `${state.userData.firstName} ${state.userData.lastName}` : 'پنل کاربری',
    getAirlineId: (state) => (stepfindip) => {
      const code = String(stepfindip || '').trim().toUpperCase()
      return state.airlineIdMap[code] || 0
    },
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
    },

    hasSelectedDeparture(state) {
      return !!state.selectedDepartureFlight
    },

    hasSelectedReturn(state) {
      return !!state.selectedReturnFlight
    },

    hasRoundTripSelection(state) {
      if (state.selectedDepartureFlight?.isRoundTrip && state.selectedDepartureFlight?.provider !== 'NIRA') {
        return true
      }

      return !!state.selectedDepartureFlight && !!state.selectedReturnFlight
    },

    selectedFlights(state) {
      const items = []

      if (state.selectedDepartureFlight) {
        items.push(state.selectedDepartureFlight)
      }

      if (state.selectedReturnFlight) {
        items.push(state.selectedReturnFlight)
      }

      return items
    },
 hasFinalPricing(state) {
      return Array.isArray(state.selectedFlightsFinalPricing) && state.selectedFlightsFinalPricing.length > 0
    },

    finalPricingItems(state) {
      return state.selectedFlightsFinalPricing || []
    },
    selectedTrip(state) {
      if (
        state.selectedDepartureFlight?.isRoundTrip &&
        state.selectedDepartureFlight?.provider !== 'NIRA'
      ) {
        return state.selectedDepartureFlight
      }

      if (state.selectedDepartureFlight && state.selectedReturnFlight) {
        return {
          provider: 'NIRA',
          isRoundTrip: true,
          outbound: state.selectedDepartureFlight,
          inbound: state.selectedReturnFlight,
          priceFrom:
            Number(state.selectedDepartureFlight?.priceFrom || 0) +
            Number(state.selectedReturnFlight?.priceFrom || 0),
          currency: state.selectedDepartureFlight?.currency || 'IRR'
        }
      }

      return state.selectedDepartureFlight || null
    }
  },

  actions: {
     openModal(action = null) {
      this.isAuthModalOpen = true
      this.authStep = 'mobile'
      this.pendingAction = action
      this.error = ''
      this.successMessage = ''
    },
    closeModal() {
      this.isAuthModalOpen = false
      this.authStep = 'mobile' // بازنشانی مرحله مودال به اولین وضعیت
      this.error = ''
      this.successMessage = ''
    },
   async checkMobile(mobile) {
      this.authLoading = true
      this.error = ''
      this.successMessage = ''
      this.mobile = mobile

      try {
        const res = await $fetch(`https://api.ahuan.ir/api/Auth/sendsms/${mobile}`)

        const val = typeof res === 'object' ? (res.data ?? res.result ?? res.value) : res
        
        if (Number(val) === 0) {
          this.authStep = 'register'
        } else {
          this.authStep = 'otp'
          this.successMessage = 'کد تأیید ارسال شد.'
        }
      } catch (err) {
        this.error = err.data?.message || 'خطا در برقراری ارتباط با سرور'
      } finally {
        this.authLoading = false
      }
    }
,
    async register(payload) {
      this.authLoading = true
      this.error = ''
      this.successMessage = ''

      try {
        // ۱. ثبت نام
        await $fetch('https://api.ahuan.ir/api/Auth/register-minimal', {
          method: 'POST',
          body: {
            phoneNumber: this.mobile,
            fName: payload.firstName,
            lName: payload.lastName,
          }
        })

        // ۲. ارسال پیامک بعد از ثبت نام موفق
        await $fetch(`https://api.ahuan.ir/api/Auth/sendsms/${this.mobile}`)

        this.authStep = 'otp'
        this.successMessage = 'ثبت‌نام انجام شد. کد تایید ارسال گردید.'
      } catch (err) {
        this.error = err.data?.message || 'خطا در فرآیند ثبت‌نام'
      } finally {
        this.authLoading = false
      }
    },
    async verifyOtp(code) {
  this.authLoading = true
  this.error = ''

  try {
    const res = await $fetch(`https://api.ahuan.ir/api/Auth/Checksms/${this.mobile}/${code}`)

    if (res && res.token && res.successful) {
      const token = useCookie('token', {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      })

      token.value = res.token
      this.isUserLoggedIn = true

      const userObj = {
        firstName: res.fName || '',
        lastName: res.lName || '',
        mobile: res.mobile || '',
        companyId: res.companyId || null,
        companyName: res.companyName || '',
        credit: res.credit || 0,
        hasCredit: res.hasCredit ?? false
      }

      const userCookie = useCookie('user_data', {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      })

      userCookie.value = userObj
      this.userData = userObj

      return {
        success: true,
        user: userObj
      }
    }

    this.error = res?.error || 'کد تایید نامعتبر است.'

    return {
      success: false
    }
  } catch (err) {
    this.error = err.data?.message || 'کد وارد شده اشتباه است یا منقضی شده'

    return {
      success: false
    }
  } finally {
    this.authLoading = false
  }
},

    async fetchMe() {
      const token = useCookie('token')
      const userCookie = useCookie('user_data')
      // اگر توکن نبود، کوکی اطلاعات کاربر را هم پاک کن
      if (!token.value) {
        this.userData = null
        userCookie.value = null
        return
      }

      // اولویت اول: خواندن مستقیم از کوکی ذخیره شده (بدون نیاز به ریکوئست اضافی در SSR)
      if (userCookie.value) {
        this.userData = userCookie.value
        return
      }

      try {
        // اولویت دوم: در صورتی که کوکی پریده بود ولی توکن بود، از API استعلام بگیر
        const res = await $fetch('https://api.ahuan.ir/api/Auth/me', {
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        })
        
        if (res) {
          const userObj = {
            firstName: res.fName || res.firstName || '',
            lastName: res.lName || res.lastName || '',
            mobile: res.mobile || '',
            companyId: res.companyId || null,
            companyName: res.companyName || '',
            credit: res.credit || 0,
            hasCredit: res.hasCredit ?? false
          }
          userCookie.value = userObj
          this.userData = userObj
        }
      } catch (e) {
        token.value = null
        userCookie.value = null
        this.userData = null
      }
    },
      async fetchMe() {
      const token = useCookie('token')
      const userCookie = useCookie('user_data')
      
      // اگر توکن نبود، کوکی اطلاعات کاربر را هم پاک کن
      if (!token.value) {
        this.userData = null
        userCookie.value = null
        return
      }

      // اولویت اول: خواندن مستقیم از کوکی ذخیره شده (بدون نیاز به ریکوئست اضافی در SSR)
      if (userCookie.value) {
        this.userData = userCookie.value
        return
      }

      try {
        // اولویت دوم: در صورتی که کوکی پریده بود ولی توکن بود، از API استعلام بگیر
        const res = await $fetch('https://api.ahuan.ir/api/Auth/me', {
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        })
        
        if (res) {
          const userObj = {
            firstName: res.fName || res.firstName || '',
            lastName: res.lName || res.lastName || '',
            mobile: res.mobile || '',
            companyId: res.companyId || null,
            companyName: res.companyName || '',
            credit: res.credit || 0,
            hasCredit: res.hasCredit ?? false
          }
          userCookie.value = userObj
          this.userData = userObj
        }
      } catch (e) {
        token.value = null
        userCookie.value = null
        this.userData = null
      }
    },

   logout() {
      // پاک کردن تمامی کوکی‌ها در هنگام خروج
      const token = useCookie('token', { path: '/' })
      const userCookie = useCookie('user_data', { path: '/' })
      
      token.value = null
      userCookie.value = null
      this.userData = null
       this.isUserLoggedIn = false
      window.location.reload()
    },
    setFlights(flightsList) {
      this.flights = Array.isArray(flightsList) ? flightsList : []
    },

    setCurrentStep(step) {
      this.currentStep = step
    },

    setLastSearchParams(searchParams) {
      this.lastSearchParams = searchParams ? { ...searchParams } : null
    },

    createNewAbortSignal() {
      if (this.abortController) {
        this.abortController.abort()
      }

      this.abortController = new AbortController()
      return this.abortController.signal
    },

    cancelAllPendingRequests() {
      if (this.abortController) {
        this.abortController.abort()
        this.abortController = null
      }

      this.loading = false
      this.backgroundLoading = false
    },

    selectFlight(flight) {
      this.selectedFlight = flight
    },

    selectDepartureFlight(flight) {
      this.selectedDepartureFlight = flight
      this.selectedFlight = flight
    },

    selectReturnFlight(flight) {
      this.selectedReturnFlight = flight
    },

    clearSelectedFlights() {
      this.selectedFlight = null
      this.selectedDepartureFlight = null
      this.selectedReturnFlight = null
      this.currentStep = 0
      this.selectedFlightsFinalPricing = []
      this.finalBookingPrice = 0
      this.pricingRefreshError = ''
    },
    getPassengerCountByCode(code, passengerCounts) {
      const normalized = Number(code)

      if (normalized === 1) return Number(passengerCounts.adult || 0)
      if (normalized === 2) return Number(passengerCounts.child || 0)
      if (normalized === 3) return Number(passengerCounts.infant || 0)

      return 0
    },

    getPassengerLabelByCode(code) {
      const normalized = Number(code)

      if (normalized === 1) return 'بزرگسال'
      if (normalized === 2) return 'کودک'
      if (normalized === 3) return 'نوزاد'

      return 'مسافر'
    },

    async refreshSelectedFlightsPricing(passengerCounts) {
      const flights = this.selectedFlights || []

      if (!flights.length) {
        throw new Error('هیچ پروازی انتخاب نشده است.')
      }

      this.pricingRefreshLoading = true
      this.pricingRefreshError = ''

      try {
        const pricingItems = await Promise.all(
          flights.map((flight, index) => this.buildFlightFinalPricing(flight, passengerCounts, index))
        )

        this.selectedFlightsFinalPricing = pricingItems
        this.finalBookingPrice = pricingItems.reduce(
          (sum, item) => sum + Number(item.totalPrice || 0),
          0
        )

        return pricingItems
      } catch (error) {
        this.selectedFlightsFinalPricing = []
        this.finalBookingPrice = 0
        this.pricingRefreshError = error?.message || 'دریافت قیمت نهایی با خطا مواجه شد.'
        throw error
      } finally {
        this.pricingRefreshLoading = false
      }
    },

    async buildFlightFinalPricing(flight, passengerCounts, index = 0) {
      const provider = String(flight?.provider || '').toUpperCase()

      if (provider === 'NIRA') {
        return await this.buildNiraFinalPricing(flight, passengerCounts, index)
      }

      if (provider === 'MAHAN') {
        return this.buildMahanFinalPricing(flight, passengerCounts, index)
      }

      return this.buildDefaultFinalPricing(flight, passengerCounts, index)
    },

    async buildNiraFinalPricing(flight, passengerCounts, index = 0) {
      const fare = await this.fetchNiraFare(flight)

      const adultUnitPrice = Number(fare?.AdultTotalPrice || 0)
      const childUnitPrice = Number(fare?.ChildTotalPrice || 0)
      const infantUnitPrice = Number(fare?.InfantTotalPrice || 0)

      const passengerPrices = [
        {
          type: 'ADL',
          label: 'بزرگسال',
          count: Number(passengerCounts.adult || 0),
          unitPrice: adultUnitPrice,
          total: adultUnitPrice * Number(passengerCounts.adult || 0)
        },
        {
          type: 'CHD',
          label: 'کودک',
          count: Number(passengerCounts.child || 0),
          unitPrice: childUnitPrice,
          total: childUnitPrice * Number(passengerCounts.child || 0)
        },
        {
          type: 'INF',
          label: 'نوزاد',
          count: Number(passengerCounts.infant || 0),
          unitPrice: infantUnitPrice,
          total: infantUnitPrice * Number(passengerCounts.infant || 0)
        }
      ].filter((item) => item.count > 0)

      const totalPrice = passengerPrices.reduce((sum, item) => sum + Number(item.total || 0), 0)

      return {
        key: `${flight?.id || 'flight'}-${index}`,
        flightId: flight?.id || null,
        provider: 'NIRA',
        airline: flight?.airline || '',
        flightNumber: flight?.flightNumber || '',
        route: `${flight?.origin || ''}-${flight?.destination || ''}`,
        departure: flight?.departure || '',
        fare,
        passengerPrices,
        totalPrice,
        currency: flight?.currency || 'IRR'
      }
    },

    buildMahanFinalPricing(flight, passengerCounts, index = 0) {
      const list = flight?.meta?.raw?.totalFlightPrice?.flightPassengerPrices || []

      const passengerPrices = Array.isArray(list)
        ? list
            .map((item) => {
              const count = this.getPassengerCountByCode(item.code, passengerCounts)
              const unitPrice = Number(item.totalFare || item.totalSale || item.sale || 0)

              return {
                type: Number(item.code) === 1 ? 'ADL' : Number(item.code) === 2 ? 'CHD' : Number(item.code) === 3 ? 'INF' : '',
                label: this.getPassengerLabelByCode(item.code),
                count,
                unitPrice,
                total: unitPrice * count,
                raw: item
              }
            })
            .filter((item) => item.count > 0)
        : []

      const totalPrice = passengerPrices.reduce((sum, item) => sum + Number(item.total || 0), 0)

      return {
        key: `${flight?.id || 'flight'}-${index}`,
        flightId: flight?.id || null,
        provider: 'MAHAN',
        airline: flight?.airline || '',
        flightNumber: flight?.flightNumber || '',
        route: `${flight?.origin || ''}-${flight?.destination || ''}`,
        departure: flight?.departure || '',
        fare: null,
        passengerPrices,
        totalPrice,
        currency: flight?.currency || 'IRR'
      }
    },

    buildDefaultFinalPricing(flight, passengerCounts, index = 0) {
      const basePrice = Number(flight?.priceFrom || 0)
      const childPrice = Math.round(basePrice * 0.75)
      const infantPrice = Math.round(basePrice * 0.1)

      const passengerPrices = [
        {
          type: 'ADL',
          label: 'بزرگسال',
          count: Number(passengerCounts.adult || 0),
          unitPrice: basePrice,
          total: basePrice * Number(passengerCounts.adult || 0)
        },
        {
          type: 'CHD',
          label: 'کودک',
          count: Number(passengerCounts.child || 0),
          unitPrice: childPrice,
          total: childPrice * Number(passengerCounts.child || 0)
        },
        {
          type: 'INF',
          label: 'نوزاد',
          count: Number(passengerCounts.infant || 0),
          unitPrice: infantPrice,
          total: infantPrice * Number(passengerCounts.infant || 0)
        }
      ].filter((item) => item.count > 0)

      const totalPrice = passengerPrices.reduce((sum, item) => sum + Number(item.total || 0), 0)

      return {
        key: `${flight?.id || 'flight'}-${index}`,
        flightId: flight?.id || null,
        provider: String(flight?.provider || '').toUpperCase() || 'DEFAULT',
        airline: flight?.airline || '',
        flightNumber: flight?.flightNumber || '',
        route: `${flight?.origin || ''}-${flight?.destination || ''}`,
        departure: flight?.departure || '',
        fare: null,
        passengerPrices,
        totalPrice,
        currency: flight?.currency || 'IRR'
      }
    },

    async fetchNiraFare(flight) {
      const departureDate = String(flight?.departure || '')
        .trim()
        .split(' ')[0]
        .split('T')[0]

      const params = new URLSearchParams({
        AirLine: String(flight?.airline || '').trim(),
        Route: `${String(flight?.origin || '').trim()}-${String(flight?.destination || '').trim()}`,
        RBD: String(flight?.rbd || flight?.bookingClass || '').trim(),
        DepartureDate: departureDate,
        FlightNo: String(flight?.flightNumber || '').trim()
      })

      const response = await fetch(`https://api.ahuan.ir/api/Nira/Fare?${params.toString()}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`NIRA Fare failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return typeof data === 'string' ? JSON.parse(data) : data
    },

    async searchFlights(searchParams) {
      this.setLastSearchParams(searchParams)
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

    async reloadLastSearch() {
      if (!this.lastSearchParams) {
        return
      }

      this.clearSelectedFlights()
      await this.searchFlights(this.lastSearchParams)
    },

    async loadFlightDetails(flight) {
      this.selectedFlight = flight
    }
  }
})
