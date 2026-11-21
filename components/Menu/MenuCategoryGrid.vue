<script setup>



import { useHotelStore } from '~/stores/hotels'



const hotelStore = useHotelStore()



const emit = defineEmits(['add-product', 'edit-product', 'delete-product'])



const adminCookie = useCookie('admin', { path: '/', sameSite: 'lax' })



const isAdmin = computed(() => adminCookie.value === true || adminCookie.value === 'true')



const logoutAdmin = async () => {
  if (savingProduct.value || deletingProduct.value) return
  adminCookie.value = null
  editorOpen.value = false
  deleteProductTarget.value = null
  language.value = 'fa'
  showCart.value = false
  await navigateTo('/links/menu/login')
}



const editorOpen = ref(false)

const editorMode = ref('add')

const editorProduct = ref(null)

const deleteProductTarget = ref(null)

const formErrors = ref({})

const imageFile = ref(null)

const imagePreview = ref('')

// تصاویر پیشنهاد ویژه مستقل از تصویر اصلی محصول هستند.

const specialImageFile = ref(null)

const specialImagePreview = ref('')

const staticSpecialSlides = ref([])

const specialObjectUrls = new Set()

const specialKey = product => String(product?.id || `${props.menu}:${product?.title || ''}`)

const clearSpecialImage = () => {
  specialImageFile.value = null
  specialImagePreview.value = ''
}

// حذف تصویر اسلایدر از فرم؛ تصویر انتخاب‌شده و تصویر قبلی پاک می‌شوند.
const removeSpecialImage = () => {
  specialImageFile.value = null
  specialImagePreview.value = ''
  editorForm.specialImage = ''
  formErrors.value = { ...formErrors.value, specialImage: '' }
  if (specialImageInput.value) specialImageInput.value.value = ''
}

const specialImageInput = ref(null)

const onSpecialImage = event => {

  const file = event.target.files?.[0]

  if (!file) return

  if (!file.type.startsWith('image/')) {

    formErrors.value = { ...formErrors.value, specialImage: 'فایل انتخاب‌شده باید تصویر باشد.' }

    event.target.value = ''

    return

  }

  if (file.size > 5 * 1024 * 1024) {

    formErrors.value = { ...formErrors.value, specialImage: 'حجم تصویر نباید بیشتر از ۵ مگابایت باشد.' }

    event.target.value = ''

    return

  }

  specialImageFile.value = file

  const url = URL.createObjectURL(file)

  specialObjectUrls.add(url)

  specialImagePreview.value = url

  formErrors.value = { ...formErrors.value, specialImage: '' }

}



const editorForm = reactive({ title: '', titleEn: '', price: '', description: '', descriptionEn: '', category: '', image: '', isSpecial: false, specialImage: '' })



// جداکننده هزارگان فقط در نمایش؛ مقدار ارسالی به API عدد خالص است.

const priceDisplay = computed({

  get: () => {

    const digits = String(editorForm.price ?? '').replace(/[^0-9]/g, '')

    return digits ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''

  },

  set: value => {

    editorForm.price = String(value ?? '')

      .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 1776))

      .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 1632))

      .replace(/[^0-9]/g, '')

  }

})



const categoryOptions = computed(() => categories.value.flatMap(c => (Array.isArray(c.apiCategory) ? c.apiCategory : [c.apiCategory])))

const resetEditor = () => {

  Object.assign(editorForm, { title: '', titleEn: '', price: '', description: '', descriptionEn: '', category: selectedCategory.value?.apiCategory instanceof Array ? selectedCategory.value.apiCategory[0] : selectedCategory.value?.apiCategory || '', image: '', isSpecial: false, specialImage: '' })

  imageFile.value = null

  imagePreview.value = ''

  clearSpecialImage()

  formErrors.value = {}

}

const requestAddProduct = () => {

  if (!isAdmin.value) return

  resetEditor()

  editorProduct.value = null

  editorMode.value = 'add'

  editorOpen.value = true

}

const requestEditProduct = product => {

  if (!isAdmin.value) return

  resetEditor()

  editorMode.value = 'edit'

  editorProduct.value = product

  const existingSpecial = staticSpecialSlides.value.find(slide => slide.productKey === specialKey(product))

  Object.assign(editorForm, {

    title: product.title || '', titleEn: product.titleEn || '', price: String(product.price ?? ''),

    description: product.description || '', descriptionEn: product.descriptionEn || '',

    category: product.category || '', image: product.image || '',

    isSpecial: Boolean(existingSpecial || product.isSpecial),

    specialImage: existingSpecial?.image || product.specialImage || ''

  })

  imagePreview.value = getImage(product)

  specialImagePreview.value = editorForm.specialImage

  editorOpen.value = true

}

const requestDeleteProduct = product => {

  if (!isAdmin.value) return

  deleteError.value = ''
  deleteProductTarget.value = product

}

const closeEditor = () => { editorOpen.value = false; imageFile.value = null; specialImageFile.value = null }

// حذف تصویر انتخاب‌شده یا تصویر قبلی از فرم؛ ثبت نهایی با دکمه ذخیره انجام می‌شود.
const removeEditorImage = () => {
  if (imagePreview.value.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)
  imageFile.value = null
  imagePreview.value = ''
  editorForm.image = ''
  formErrors.value = { ...formErrors.value, image: '' }
}

const onEditorImage = event => {

  const file = event.target.files?.[0]

  if (!file) return

  if (!file.type.startsWith('image/')) { formErrors.value = { ...formErrors.value, image: 'فایل باید تصویر باشد.' }; return }

  if (file.size > 5 * 1024 * 1024) { formErrors.value = { ...formErrors.value, image: 'حجم تصویر نباید بیشتر از ۵ مگابایت باشد.' }; return }

  imageFile.value = file

  if (imagePreview.value.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)

  imagePreview.value = URL.createObjectURL(file)

  formErrors.value = { ...formErrors.value, image: '' }

}

// شناسه خام API برای PUT (بدون پیشوند restaurant/coffeeshop)
const getFoodId = product => String(product?.apiId || product?.rawId || product?._id || product?.Id || product?.id || '').replace(/^(restaurant|coffeeshop)-/, '').trim()

const refreshFoodsFromApi = async () => {
  const response = await $fetch('https://menu.ahuan.ir/api/foods', {
    method: 'GET',
    cache: 'no-store',
  })
  const foods = Array.isArray(response) ? response
    : Array.isArray(response?.data) ? response.data
    : Array.isArray(response?.Data) ? response.Data
    : Array.isArray(response?.foods) ? response.foods
    : Array.isArray(response?.Foods) ? response.Foods : null
  if (!foods) throw new Error('ذخیره انجام شد، اما قالب پاسخ لیست محصولات قابل تشخیص نیست.')
  hotelStore.foods = [...foods]
  hotelStore.foodsLoading = false
  hotelStore.foodsLoaded = true
  hotelStore.foodsError = null
}

const savingProduct = ref(false)
const saveError = ref('')

const fileToBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result || ''))
  reader.onerror = () => reject(new Error('خواندن تصویر با خطا مواجه شد.'))
  reader.readAsDataURL(file)
})

const updateStaticSpecialSlide = () => {
  const key = editorProduct.value ? specialKey(editorProduct.value) : `${props.menu}:draft:${Date.now()}`
  staticSpecialSlides.value = staticSpecialSlides.value.filter(slide => slide.productKey !== key)
  if (!editorForm.isSpecial) return
  const image = specialImageFile.value ? specialImagePreview.value : editorForm.specialImage
  staticSpecialSlides.value.push({
    id: `special-${key}`, productKey: key, title: editorForm.title.trim(), image,
    product: {
      ...(editorProduct.value || {}), id: key, title: editorForm.title.trim(),
      titleEn: editorForm.titleEn.trim(), price: Number(editorForm.price),
      description: editorForm.description.trim(), descriptionEn: editorForm.descriptionEn.trim(),
      category: editorForm.category, image: imageFile.value ? imagePreview.value : editorForm.image,
      isSpecial: true, specialImage: image
    }
  })
}

const saveEditor = async () => {
  if (savingProduct.value || !isAdmin.value) return
  saveError.value = ''
  const errors = {}
  if (!editorForm.title.trim()) errors.title = 'تکمیل این فیلد اجباریست.'
  if (!editorForm.titleEn.trim()) errors.titleEn = 'تکمیل این فیلد اجباریست.'
  if (editorForm.price === '' || !Number.isFinite(Number(editorForm.price)) || Number(editorForm.price) <= 0) errors.price = 'قیمت معتبر وارد کنید.'
  if (!editorForm.category) errors.category = 'دسته‌بندی را انتخاب کنید.'
  if (editorForm.isSpecial && !specialImageFile.value && !specialImagePreview.value) errors.specialImage = 'برای پیشنهاد ویژه، تصویر اسلایدر را انتخاب کنید.'
  formErrors.value = errors
  if (Object.keys(errors).length) return

  const editing = editorMode.value === 'edit'
  const id = editing ? getFoodId(editorProduct.value) : ''
  if (editing && !id) { saveError.value = 'شناسه محصول برای ویرایش پیدا نشد.'; return }

  savingProduct.value = true
  try {
    // تصویر جدید به صورت Data URL شامل پیشوند data:image/...;base64 ارسال می‌شود.
    // هنگام ویرایش بدون انتخاب تصویر جدید، مقدار قبلی دست‌نخورده باقی می‌ماند.
    const image = imageFile.value ? await fileToBase64(imageFile.value) : (editorForm.image || '')
    const body = {
      C_OR_R: menuType.value,
      Category: editorForm.category,
      Description: editorForm.description.trim(),
      DescriptionEn: editorForm.descriptionEn.trim(),
      Image: image,
      Price: editing ? Number(editorForm.price) : String(editorForm.price),
      Title: editorForm.title.trim(),
      TitleEn: editorForm.titleEn.trim()
    }
    await $fetch(editing
      ? `https://menu.ahuan.ir/api/foods/${encodeURIComponent(id)}`
      : 'https://menu.ahuan.ir/api/foods', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })

    updateStaticSpecialSlide()
    closeEditor()
    try {
      await refreshFoodsFromApi()
    } catch (refreshError) {
      console.error('محصول ذخیره شد اما دریافت مجدد لیست ناموفق بود:', refreshError)
      hotelStore.foodsError = 'محصول ذخیره شد اما دریافت مجدد لیست ناموفق بود. صفحه را دوباره بارگذاری کنید.'
    }
  } catch (error) {
    saveError.value = error?.data?.message || error?.data?.error || error?.message || 'خطا در ذخیره محصول.'
  } finally {
    savingProduct.value = false
  }
}

const productOperationLoading = computed(() => savingProduct.value || deletingProduct.value)
const productOperationMessage = computed(() => deletingProduct.value ? 'در حال حذف محصول و بروزرسانی لیست...' : editorMode.value === 'edit' ? 'در حال ویرایش محصول و بروزرسانی لیست...' : 'در حال افزودن محصول و بروزرسانی لیست...')

const deletingProduct = ref(false)
const deleteError = ref('')

const closeDeleteDialog = () => {
  if (deletingProduct.value) return
  deleteProductTarget.value = null
  deleteError.value = ''
}

const confirmDeleteProduct = async () => {
  if (!isAdmin.value || !deleteProductTarget.value || deletingProduct.value) return
  deleteError.value = ''
  const id = getFoodId(deleteProductTarget.value)
  if (!id) { deleteError.value = 'شناسه محصول برای حذف پیدا نشد.'; return }

  deletingProduct.value = true
  try {
    const result = await $fetch(`https://menu.ahuan.ir/api/foods/${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (result?.success !== true) throw new Error(result?.message || 'حذف محصول تأیید نشد.')
    deleteProductTarget.value = null
    try {
      await refreshFoodsFromApi()
    } catch (refreshError) {
      console.error('محصول حذف شد اما دریافت مجدد لیست ناموفق بود:', refreshError)
      hotelStore.foodsError = 'محصول حذف شد اما دریافت مجدد لیست ناموفق بود. صفحه را دوباره بارگذاری کنید.'
    }
  } catch (error) {
    deleteError.value = error?.data?.message || error?.data?.error || error?.message || 'خطا در حذف محصول.'
  } finally {
    deletingProduct.value = false
  }
}



const props = defineProps({



  menu: { type: String, required: true, validator: value => ['restaurant', 'coffeeshop'].includes(value) }



})



const menuType = computed(() => props.menu === 'restaurant' ? 'r' : 'c')

const route = useRoute()



const language = useState('menu-language', () => 'fa')



const isEnglish = computed(() => language.value === 'en')



const t = (fa, en) => isEnglish.value ? en : fa



const toggleLanguage = () => { language.value = isEnglish.value ? 'fa' : 'en' }



const categoryLists = {



  restaurant: [



    {



      title: 'پیش غذا',



      titleEn: 'Appetizers',



      slug: 'appetizer',



      apiCategory: 'پیش غذا',



      icon: 'bi-egg-fried'



    },



    {



      title: 'غذای اصلی',



      titleEn: 'Main Courses',



      slug: 'main',



      apiCategory: 'غذای اصلی',



      icon: 'bi-menu-button-wide'



    },



    {



      title: 'کباب ها',



      titleEn: 'Kebabs',



      slug: 'kebab',



      apiCategory: 'کباب',



      icon: 'bi-fire'



    },



    // {



    //   title: 'سالاد',



    //   titleEn: 'Salads',



    //   slug: 'salad',



    //   apiCategory: 'سالاد',



    //   icon: 'bi-flower1'



    // },



    // {



    //   title: 'ساندویچ',



    //   titleEn: 'Sandwiches',



    //   slug: 'sandwich',



    //   apiCategory: 'ساندویچ',



    //   icon: 'bi-stack'



    // },



    // {



    //   title: 'پاستا',



    //   titleEn: 'Pasta',



    //   slug: 'pasta',



    //   apiCategory: 'پاستا',



    //   icon: 'bi-egg'



    // },



    {



      title: 'نوشیدنی و مخلفات',



      titleEn: 'Drinks & Sides',



      slug: 'drinks',



      apiCategory: 'نوشیدنی و مخلفات',



      icon: 'bi-cup-straw'



    }



  ],



  coffeeshop: [



    {



      title: 'پیش غذا',



      titleEn: 'Appetizers',



      slug: 'appetizer',



      apiCategory: 'پیش غذا',



      icon: 'bi-egg-fried'



    },



    {



      title: 'سالاد',



      titleEn: 'Salads',



      slug: 'salad',



      apiCategory: 'سالاد',



      icon: 'bi-flower1'



    },



    {



      title: 'ساندویچ',



      titleEn: 'Sandwiches',



      slug: 'sandwich',



      apiCategory: 'ساندویچ',



      icon: 'bi-stack'



    },



    {



      title: 'پیتزا',



      titleEn: 'Pizza',



      slug: 'pizza',



      apiCategory: 'پیتزا',



      icon: 'bi-circle'



    },



    {



      title: 'پاستا',



      titleEn: 'Pasta',



      slug: 'pasta',



      apiCategory: 'پاستا',



      icon: 'bi-egg'



    },



    {



      title: 'سوخاری',



      titleEn: 'Fried Foods',



      slug: 'fried',



      apiCategory: 'سوخاری',



      icon: 'bi-fire'



    },



    // {



    //   title: 'غذای اصلی',



    //   titleEn: 'Main Courses',



    //   slug: 'main',



    //   apiCategory: 'غذای اصلی',



    //   icon: 'bi-menu-button-wide'



    // },



    {



      title: 'قهوه',



      titleEn: 'Coffee',



      slug: 'coffee',



      apiCategory: 'قهوه',



      icon: 'bi-cup-hot'



    },



    {



      title: 'آیس کافی',



      titleEn: 'Iced Coffee',



      slug: 'ice-coffee',



      apiCategory: 'آیس کافی',



      icon: 'bi-cup-straw'



    },



    {



      title: 'نوشیدنی سرد',



      titleEn: 'Cold Drinks',



      slug: 'cold-drinks',



      apiCategory: 'نوشیدنی سرد',



      icon: 'bi-droplet'



    },



    {



      title: 'نوشیدنی گرم',



      titleEn: 'Hot Drinks',



      slug: 'hot-drinks',



      apiCategory: 'نوشیدنی گرم',



      icon: 'bi-cup-hot-fill'



    },



    {



      title: 'شیک',



      titleEn: 'Shakes',



      slug: 'shake',



      apiCategory: 'شیک',



      icon: 'bi-cup-straw'



    },



    {



      title: 'اسموتی فصل',



      titleEn: 'Seasonal Smoothies',



      slug: 'smoothie',



      apiCategory: 'اسموتی فصل',



      icon: 'bi-cup-straw'



    },



    {



      title: 'فراپه',



      titleEn: 'Frappe',



      slug: 'frappe',



      apiCategory: 'فراپه',



      icon: 'bi-snow2'



    },



    {



  title: 'بستنی و دسر',



  titleEn: 'Ice Cream & Desserts',



  slug: 'icecream',



  apiCategory: ['بستنی', 'بستنی ها'],



  icon: 'bi-snow'



},



    {



      title: 'گلاسه',



      titleEn: 'Glaces',



      slug: 'dessert',



      apiCategory: 'گلاسه',



      icon: 'bi-cup'



    }



  ]



}



const categoryNav = ref(null)



const scrollToSelectedCategory = async () => {



  await nextTick()



  const nav = categoryNav.value



  if (!nav) return



  const selected = Array.from(nav.querySelectorAll('button'))



    .find(button => button.getAttribute('aria-pressed') === 'true')



  if (!selected) return



  selected.scrollIntoView({



    behavior: 'instant',



    block: 'nearest',



    inline: 'nearest'



  })



}



const scrollCategories = event => {



  const element = event.currentTarget



  if (element.scrollWidth <= element.clientWidth) return



  if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {



    element.scrollLeft += event.deltaY



    event.preventDefault()



  }



}



const categories = computed(() => categoryLists[props.menu])



const basePath = computed(() => `/links/menu/${props.menu}`)



const currentSlug = computed(() => String(route.params.category || categories.value[0].slug))



const selectedCategory = computed(() => categories.value.find(c => c.slug === currentSlug.value))



const menuTitle = computed(() => props.menu === 'restaurant'



  ? t('منوی رستوران', 'Restaurant Menu')



  : t('منوی کافی شاپ', 'Coffee Shop Menu'))



const normalize = value => String(value ?? '')



  .replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/\u200c/g, ' ').trim().replace(/\s+/g, ' ')



// Comparison key only: ignore spaces/half-spaces but keep the displayed title unchanged.



const normalizeProductKey = value => normalize(value)



  .toLowerCase()



  .replace(/[آأإٱ]/g, 'ا')



  .replace(/[\u064b-\u065f\u0670]/g, '')



  .replace(/[\s\u200c\u200d\u00a0]+/g, '')



// const staticCoffeeShopImages = {



//   'آیس لاته': '/imgs/hotel/Menu/1.jpg',



//   'آیس لاته طعم دار': '/imgs/hotel/Menu/2.jpg',



//   'آیس موکا': '/imgs/hotel/Menu/3.jpg',



//   'آیس آمریکانو': '/imgs/hotel/Menu/4.jpg',



//   'فراپاچینو': '/imgs/hotel/Menu/5.jpg'



// }



const search = ref('')



const submittedSearch = ref('')



const searchInput = ref(null)



const searchResults = ref(null)



// Keep a pending category across Nuxt route component remounts.



const scrollPendingCategory = useState('menu-scroll-pending-category', () => '')



let categoryScrollTimer = null



const scrollToProducts = async () => {



  await nextTick()



  if (!import.meta.client) return



  if (categoryScrollTimer) clearTimeout(categoryScrollTimer)



  categoryScrollTimer = setTimeout(() => {



    const el = searchResults.value



    if (!el) return



    const top = el.getBoundingClientRect().top + window.scrollY - 16



    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })



    scrollPendingCategory.value = ''



    categoryScrollTimer = null



  }, 150)



}



let searchScrollTimer = null



// تایپ کردن فقط مقدار ورودی را تغییر می‌دهد؛ تا ثبت جستجو، لیست فیلتر نمی‌شود.



const onSearchInput = () => { submittedSearch.value = '' }



const clearSearch = () => {



  search.value = ''



  submittedSearch.value = ''



}



const showSearchResults = async () => {



  const term = normalize(search.value)



  if (!term) return



  // ابتدا کیبورد را ببند و بعد جستجو را اعمال کن.



  searchInput.value?.blur()



  submittedSearch.value = term



  await nextTick()



  if (import.meta.client) {



    if (searchScrollTimer) clearTimeout(searchScrollTimer)



    searchScrollTimer = setTimeout(() => {



      searchResults.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })



    }, 250)



  }



}



const selectedProduct = ref(null)



const draftQuantity = ref(1)



const showCart = ref(false)



const quantities = useState('menu-quantities', () => ({}))



const slideIndices = useState('menu-slide-indices', () => ({ restaurant: 0, coffeeshop: 0 }))



const activeSlide = computed({



  get: () => slideIndices.value[props.menu] || 0,



  set: index => { slideIndices.value = { ...slideIndices.value, [props.menu]: index } }



})



const imageFailures = reactive({})



// Hide these placeholder/menu items in the Nuxt UI without deleting API records.



const hiddenProductTitles = new Set(['نان خرما', 'تست', 'غذای جدید', 'اب میوه', 'آب میوه', 'کیک روز'].map(normalizeProductKey))



// Within each menu type, only keep the highest-priced record for a matching title.



// Keep the first record when duplicate prices are equal.



const allProducts = computed(() => {



  const highestByTitle = new Map()



  for (const item of hotelStore.foods || []) {



    if (!item) continue



    const title = normalize(item.Title)



    if (!title || title.toUpperCase() === 'NULL' || hiddenProductTitles.has(normalizeProductKey(title))) continue



    // Hide the specified 80,000-toman carrot glace entries, including '(طبیعی)'.



    const cleanTitleKey = normalizeProductKey(title).replace(/[\u200e\u200f\u061c\u2060\ufeff]/g, '')



    const priceValue = Number(String(item.Price ?? 0).replace(/[,٬،\s]/g, '').replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776)).replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632)))



    if ([normalizeProductKey('هویج گلاسه'), normalizeProductKey('هویج گلاسه (طبیعی)')].includes(cleanTitleKey) && priceValue === 80000) continue



    // Hide the 38,000-toman duplicate of natural watermelon juice.



    if (normalizeProductKey(title) === normalizeProductKey('آب هندوانه طبیعی') && Number(String(item.Price ?? 0).replace(/,/g, '')) === 38000) continue



    const type = normalize(item.C_OR_R).toLowerCase()



    const key = `${type}:${normalizeProductKey(title)}`



    const existing = highestByTitle.get(key)



    if (!existing || Number(item.Price || 0) > Number(existing.Price || 0)) {



      highestByTitle.set(key, item)



    }



  }



  return Array.from(highestByTitle.values())



})



const status = computed(() => {



  if (hotelStore.foodsLoading) return 'pending'



  if (hotelStore.foodsLoaded) return 'success'



  if (hotelStore.foodsError) return 'error'



  return 'idle'



})



const error = computed(() =>



  hotelStore.foodsError



    ? { message: hotelStore.foodsError }



    : null



)



const refresh = () => hotelStore.loadFoods()



const menuRows = computed(() => {



  const type = menuType.value



  const allowed = categories.value.flatMap(c =>



    (Array.isArray(c.apiCategory) ? c.apiCategory : [c.apiCategory])



      .map(normalize)



  )



  return allProducts.value.filter(item => {



    if (!item) return false



    const title = normalize(item.Title)



    const category = normalize(item.Category)



    const itemType = normalize(item.C_OR_R).toLowerCase()



    if (!title || title.toUpperCase() === 'NULL' ||



        !allowed.includes(category)) return false



    return itemType === type || !itemType



  })



})



const mapProduct = item => {



  const title = normalize(item.Title)



  const apiImage = item.ImageUrl || item.ImageURL || item.Image || item.image || item.Photo || ''



  const description = normalize(item.Descripttion || item.Description)

  const descriptionEn = normalize(item.DescriptionEn || item.DescripttionEn)



  const ingredients = normalize(item.Ingredients || item.ingredients || item.Components)



  return {



    id: `${props.menu}-${item._id || item.Id || item.id}`,
    apiId: String(item._id || item.Id || item.id || ''),



    title,



    titleEn: normalize(item.TitleEn),



    category: normalize(item.Category),



    description: description.toUpperCase() === 'NULL' ? '' : description,

    descriptionEn: normalize(item.DescriptionEn || item.DescripttionEn || item.DescriptionEN),



    descriptionEn: descriptionEn.toUpperCase() === 'NULL' ? '' : descriptionEn,

    ingredients: ingredients.toUpperCase() === 'NULL' ? '' : ingredients,



    price: Number(item.Price) || 0,



   image: apiImage,



    // image: (props.menu === 'coffeeshop' ? staticCoffeeShopImages[title] : '') || apiImage,



    apiImage



  }



}



const allMenuProducts = computed(() => menuRows.value.map(mapProduct))



const products = computed(() => {



  const value = selectedCategory.value?.apiCategory



  const selected = (Array.isArray(value) ? value : [value])



    .map(normalize)



  return allMenuProducts.value.filter(p =>



    selected.includes(p.category)



  )



})



const visibleProducts = computed(() => {



  const term = normalize(submittedSearch.value).toLowerCase()



  // وقتی جستجو خالی است، محصولات دسته انتخاب‌شده نمایش داده شوند



  if (!term) return products.value



  // جستجو در کل اطلاعات ذخیره‌شده در Store



  return allProducts.value



    .filter(item => {



      if (!item) return false



      const title = normalize(item.Title)



      return title && title.toUpperCase() !== 'NULL'



    })



    .map(mapProduct)



    .filter(product =>



      [



        product.title,



        product.titleEn,



        product.category,



        product.description,



        product.ingredients



      ].some(value =>



        normalize(value).toLowerCase().includes(term)



      )



    )



})



const resolveImage = value => {

  const image = String(value || '').trim()

  if (!image || image.toUpperCase() === 'NULL') return ''

  if (/^data:image\/[a-zA-Z0-9.+-]+;base64,/i.test(image)) return image

  if (/^https?:\/\//i.test(image)) return image

  if (image.startsWith('/imgs/')) return image

  if (image.startsWith('/')) return `https://menu.ahuan.ir${image}`

  return ''

}



const getImage = product => {



  if (!product) return ''



  const first = resolveImage(product.image)



  const fallback = resolveImage(product.apiImage)



  const failure = imageFailures[product.id] || 0



  if (failure === 0) return first



  if (failure === 1 && fallback !== first) return fallback



  return ''



}



const handleImageError = product => {



  const first = resolveImage(product.image)



  const fallback = resolveImage(product.apiImage)



  imageFailures[product.id] = !imageFailures[product.id] && fallback && fallback !== first ? 1 : 2



}



const productTitle = product => {



  if (!product) return ''



  const en = String(product.titleEn || '').trim()



  return isEnglish.value && en && en !== '*' && en.toUpperCase() !== 'NULL' ? en : product.title



}



const formatPrice = price => Number(price || 0).toLocaleString(isEnglish.value ? 'en-US' : 'fa-IR')



const formatCount = count => Number(count || 0).toLocaleString(isEnglish.value ? 'en-US' : 'fa-IR')



const quantity = id => quantities.value[id] || 0



const setQuantity = (id, amount) => {



  quantities.value = { ...quantities.value, [id]: Math.max(0, amount) }



}



const addProduct = id => setQuantity(id, quantity(id) + 1)



const removeProduct = id => setQuantity(id, quantity(id) - 1)



const changeCategory = async slug => {



  clearSearch()



  selectedProduct.value = null



  // Clicking the already-active category should scroll too.



  if (slug === currentSlug.value) {



    await scrollToProducts()



    return



  }



  // Persist until the destination category is rendered, even after remount.



  scrollPendingCategory.value = `${props.menu}:${slug}`



  try {



    await navigateTo(`${basePath.value}/${slug}`)



  } catch (error) {



    scrollPendingCategory.value = ''



    throw error



  }



}



watch(currentSlug, async slug => {



  clearSearch()



  selectedProduct.value = null



  await scrollToSelectedCategory()



  if (scrollPendingCategory.value === `${props.menu}:${slug}`) {



    await scrollToProducts()



  }



}, { flush: 'post' })



// اسلایدر در تمام دسته‌بندی‌های همان منو ثابت است.



// هر اسلاید یک عکس دارد؛ تعداد نقطه‌ها دقیقاً برابر تعداد اسلایدهاست.



const defaultSlideProducts = [



  {



    id: 'slide-1',



    title: 'خوراک ماهی سفید شکم پر',



    image: '/imgs/hotel/Menu/Slider/pro1.jpg'



  },



  {



    id: 'slide-2',



    title: 'خوراک مرغ شکم پر(مرغ کامل،سبزیجات محلی معطر،گردو)',



    image: '/imgs/hotel/Menu/Slider/pro2.jpg'



  },



  {



    id: 'slide-3',



    title: 'خوراک گوشت مخصوص گوسفندی(400گرم)',



    image: '/imgs/hotel/Menu/Slider/pro3.jpg'



  },



]

const slideProducts = computed(() => props.menu === 'restaurant'

  ? [...defaultSlideProducts, ...staticSpecialSlides.value]

  : [...staticSpecialSlides.value])



const currentSlide = computed(() => slideProducts.value[activeSlide.value] || slideProducts.value[0] || null)



// Find the actual menu item for a static promotional slide.



const currentSlideProduct = computed(() => {



  if (!currentSlide.value) return null



  return currentSlide.value.product || allMenuProducts.value.find(product =>



    normalize(product.title) === normalize(currentSlide.value.title)



  ) || null



})



function openCurrentSlideProduct() {



  const product = currentSlideProduct.value



  if (!product) return



  openProduct(product)



}



watch(() => slideProducts.value.length, length => {



  if (length && activeSlide.value >= length) activeSlide.value = 0



})



const goToSlide = index => {



  if (index >= 0 && index < slideProducts.value.length) activeSlide.value = index



}



const nextSlide = () => {



  if (slideProducts.value.length > 1) goToSlide((activeSlide.value + 1) % slideProducts.value.length)



}



const previousSlide = () => {



  if (slideProducts.value.length > 1) goToSlide((activeSlide.value - 1 + slideProducts.value.length) % slideProducts.value.length)



}



// حرکت انگشت روی بنر اسلایدر (بدون اختلال در اسکرول عمودی)



let touchStartX = 0



let touchStartY = 0



let touchTracking = false



const onSliderTouchStart = event => {



  if (event.touches.length !== 1) { touchTracking = false; return }



  touchStartX = event.touches[0].clientX



  touchStartY = event.touches[0].clientY



  touchTracking = true



}



const onSliderTouchEnd = event => {



  if (!touchTracking || !event.changedTouches.length) return



  touchTracking = false



  if (slideProducts.value.length < 2) return



  const dx = event.changedTouches[0].clientX - touchStartX



  const dy = event.changedTouches[0].clientY - touchStartY



  if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(dy)) return



  if (dx < 0) nextSlide()



  else previousSlide()



  startSlider()



}



const onSliderTouchCancel = () => { touchTracking = false }



let sliderTimer = null



const stopSlider = () => { if (sliderTimer) clearInterval(sliderTimer); sliderTimer = null }



const startSlider = () => {



  stopSlider()



  sliderTimer = setInterval(() => {



    if (!selectedProduct.value && !showCart.value) nextSlide()



  }, 4000)



}



const openProduct = product => {



  selectedProduct.value = product



  draftQuantity.value = Math.max(1, quantity(product.id))



}



const closeProduct = () => { selectedProduct.value = null }



const confirmProduct = () => {



  if (!selectedProduct.value) return



  setQuantity(selectedProduct.value.id, draftQuantity.value)



  closeProduct()



}



const cartProducts = computed(() =>



  allProducts.value



    .filter(item => {



      if (!item) return false



      const title = normalize(item.Title)



      return title && title.toUpperCase() !== 'NULL'



    })



    .map(mapProduct)



    .filter(p => quantity(p.id) > 0)



)



const cartCount = computed(() => cartProducts.value.reduce((n, p) => n + quantity(p.id), 0))



const cartTotal = computed(() => cartProducts.value.reduce((n, p) => n + quantity(p.id) * p.price, 0))



const closeOverlays = e => {



  if (e.key === 'Escape') { closeProduct(); showCart.value = false; closeEditor(); deleteProductTarget.value = null }



}



onMounted(() => {



  refresh()



  if (props.menu === 'restaurant') {



    startSlider()



  }



  scrollToSelectedCategory()



  if (scrollPendingCategory.value === `${props.menu}:${currentSlug.value}`) {



    scrollToProducts()



  }



  window.addEventListener('keydown', closeOverlays)



})



onUnmounted(() => {



  stopSlider()



  if (searchScrollTimer) clearTimeout(searchScrollTimer)



  if (categoryScrollTimer) clearTimeout(categoryScrollTimer)



  window.removeEventListener('keydown', closeOverlays)

  if (imagePreview.value.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)

  for (const url of specialObjectUrls) URL.revokeObjectURL(url)

  specialObjectUrls.clear()



})



</script>



<template>



  <main :dir="isEnglish ? 'ltr' : 'rtl'" class="min-h-dvh w-full bg-[#F8F8FA] pb-8 text-gray-800">



    <div class="mx-auto max-w-[680px]">



      <!-- هدر -->



      <header class="flex items-center justify-between px-5 pt-5 pb-2">

        <div v-if="!isAdmin" class="flex items-center gap-2">

          <button type="button" aria-label="سبد خرید" class="relative grid size-11 place-items-center rounded-[14px] bg-primary-light text-primary" @click="showCart = true">

            <i class="bi bi-bag-fill block text-[20px] leading-none"></i>

            <span v-if="cartCount" class="absolute -top-1 -right-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[10px] font-bold text-primary">{{ formatCount(cartCount) }}</span>

          </button>

          <button type="button" :aria-label="isEnglish ? 'تغییر زبان به فارسی' : 'Switch to English'" class="group flex h-11 items-center gap-2 rounded-[14px] border border-primary/10 bg-primary-light px-3 text-primary transition-colors hover:bg-primary hover:text-white" @click="toggleLanguage">

            <i class="bi bi-globe2 block text-[21px] leading-none"></i>

            <span class="h-5 w-px bg-primary/20 group-hover:bg-white/30"></span>

            <span class="text-[12px] font-extrabold">{{ isEnglish ? 'FA' : 'EN' }}</span>

          </button>

        </div>

        <button v-else type="button" aria-label="خروج از مدیریت" title="خروج از مدیریت" class="flex h-11 items-center gap-2 rounded-[14px] bg-red-50 px-4 text-red-600 transition-colors hover:bg-red-100" @click="logoutAdmin">

          <i class="bi bi-box-arrow-right text-[21px]"></i>

          <span class="text-[12px] font-bold">خروج</span>

        </button>

      </header>



      <section class="flex items-center justify-between gap-3 px-5 pt-6 pb-5">



        <h1 class="text-[27px] font-extrabold">{{ menuTitle }}</h1>



        <button v-if="isAdmin" type="button" class="flex shrink-0 items-center gap-1.5 rounded-[13px] bg-primary px-3 py-2.5 text-[11px] font-bold text-white" @click="requestAddProduct">



          <i class="bi bi-plus-lg"></i><span>{{ t('افزودن محصول', 'Add item') }}</span>



        </button>



      </section>



      <!-- جستجو: حفظ همه بخش‌های صفحه هنگام باز بودن کیبورد -->



      <section class="px-5 pb-6">



        <div class="flex items-center gap-2">



          <div class="flex h-[52px] min-w-0 flex-1 items-center gap-3 rounded-[17px] border border-gray-200 bg-white px-4 focus-within:border-primary">



            <i class="bi bi-search shrink-0 text-[20px] text-primary"></i>



            <input



              ref="searchInput"



              v-model="search"



              type="text"



              enterkeyhint="search"



              autocomplete="off"



              :placeholder="t('جستجوی غذا و نوشیدنی...', 'Search dishes and drinks...')"



              class="h-full min-w-0 flex-1 bg-transparent text-[16px] text-gray-800 outline-none placeholder:text-gray-400"



              @input="onSearchInput"



              @keydown.enter.prevent="showSearchResults"



            />



            <button



              v-if="search"



              type="button"



              :aria-label="t('پاک کردن جستجو', 'Clear search')"



              class="grid size-7 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"



              @click="clearSearch"



            >



              <i class="bi bi-x-lg block text-[12px] leading-none"></i>



            </button>



          </div>



          <button



            v-if="search.trim()"



            type="button"



            class="h-[52px] shrink-0 rounded-[14px] bg-primary px-3 text-[12px] font-bold text-white"



            @click="showSearchResults"



          >{{ t('جستجو', 'Search') }}</button>



        </div>



      </section>



      <!-- دسته‌بندی با آیکن -->



<!-- دسته‌بندی با اسکرول افقی -->



<div class="w-full min-w-0 max-w-full overflow-hidden">



  <nav



  ref="categoryNav"



  dir="rtl"



  @wheel="scrollCategories"



  class="flex w-full min-w-0 flex-nowrap items-center gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain px-5 py-3 touch-pan-x [scrollbar-width:none] [**&**::-webkit-scrollbar]:hidden"



>



    <button



      v-for="category in categories"



      :key="category.slug"



      type="button"



      :aria-pressed="currentSlug === category.slug"



      class="flex min-w-[90px] shrink-0 flex-col items-center justify-center gap-2 rounded-[16px] border px-3 py-3 transition-colors duration-200"



      :class="



        currentSlug === category.slug



          ? 'border-primary bg-primary text-white'



          : 'border-gray-200 bg-white text-gray-700'



      "



      @click="changeCategory(category.slug)"



    >



      <!-- آیکن -->



      <span



        aria-hidden="true"



        class="block size-8 shrink-0 bg-current"



        :style="{



          WebkitMask: `url('/icons/menu/${category.slug}.svg') center / contain no-repeat`,



          mask: `url('/icons/menu/${category.slug}.svg') center / contain no-repeat`



        }"



      ></span>



      <!-- نام دسته -->



      <span class="text-center text-[11px] font-bold whitespace-nowrap">



        {{ isEnglish ? category.titleEn : category.title }}



      </span>



    </button>



  </nav>



</div>



      <!-- بنر و نقاط زیر آن؛ هر نقطه دقیقاً یک اسلاید -->



      <section



  v-if="currentSlide && (menu === 'restaurant' || staticSpecialSlides.length)"



  class="px-5 pt-3 pb-6"



>



        <div class="relative h-[175px] touch-pan-y select-none overflow-hidden rounded-[22px] bg-primary text-white"



          @touchstart.passive="onSliderTouchStart"



          @touchend.passive="onSliderTouchEnd"



          @touchcancel.passive="onSliderTouchCancel">



<img



  v-if="currentSlide?.image"



  :key="currentSlide.id"



  :src="currentSlide.image"



  :alt="currentSlide.title"



  draggable="false"



  class="absolute inset-0 h-full w-full object-cover"



/>



          <div class="absolute inset-0 bg-gradient-to-l from-primary via-primary/70 to-transparent"></div>



         <div class="absolute inset-0 flex flex-col items-start justify-center px-5 pb-2">



  <span class="mb-2 text-[11px] font-bold text-secondary">



      پیشنهاد ویژه از منو آهوان



  </span>



  <h2 class="max-w-[65%] text-[20px] leading-8 font-extrabold">



    {{ currentSlide.title }}



  </h2>



  <button



    type="button"



    :disabled="!currentSlideProduct"



    class="relative z-10 mt-3 rounded-full bg-secondary px-4 py-2 text-[11px] font-bold text-primary disabled:cursor-not-allowed disabled:opacity-50"



    @click.stop="openCurrentSlideProduct"



  >



    مشاهده محصول



  </button>



</div>



          <div v-if="slideProducts.length > 1" class="absolute bottom-3 left-3 z-10 flex items-center gap-2">



            <button type="button" aria-label="اسلاید قبلی" class="grid size-7 place-items-center rounded-full bg-white/20" @click="previousSlide"><i class="bi bi-chevron-right block leading-none"></i></button>



            <button type="button" aria-label="اسلاید بعدی" class="grid size-7 place-items-center rounded-full bg-white/20" @click="nextSlide"><i class="bi bi-chevron-left block leading-none"></i></button>



          </div>



        </div>



        <!-- مهم: این div بیرون از بنر است -->



        <div v-if="slideProducts.length > 1" class="mt-3 flex w-full items-center justify-center gap-1.5">



          <button v-for="(slide, index) in slideProducts" :key="slide.id" type="button" :aria-label="`نمایش عکس ${index + 1}`" :aria-pressed="activeSlide === index" class="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full" @click="goToSlide(index)">



            <span class="block size-[9px] rounded-full bg-primary transition-all duration-200" :class="activeSlide === index ? 'scale-125 opacity-100' : 'opacity-30'"></span>



          </button>



        </div>



      </section>



      <!-- فهرست محصولات -->



      <div ref="searchResults" class="flex scroll-mt-4 items-center justify-between px-5 pb-3">



        <h2 class="text-[17px] font-extrabold">



  {{ submittedSearch.trim()



    ? t('نتایج جستجو', 'Search Results')



    : (isEnglish ? selectedCategory?.titleEn : selectedCategory?.title)



  }}



</h2>



        <span class="text-[11px] text-gray-500">{{ formatCount(visibleProducts.length) }} {{ t('محصول', 'items') }}</span>



      </div>



      <div v-if="status === 'idle' || status === 'pending'" class="py-14 text-center text-sm text-gray-500"><i class="bi bi-arrow-repeat me-2 inline-block animate-spin"></i>{{ t('در حال دریافت محصولات...', 'Loading items...') }}</div>



      <div v-else-if="status === 'error'" class="flex flex-col items-center gap-4 px-5 py-12 text-center">



        <i class="bi bi-exclamation-circle text-3xl text-red-500"></i>



        <p class="text-sm text-gray-600">{{ t('دریافت اطلاعات با خطا مواجه شد.', 'Could not load items.') }}</p>



        <p class="text-xs text-gray-500">{{ error?.message }}</p>



        <button type="button" class="rounded-full bg-primary px-5 py-3 text-white" @click="refresh">{{ t('تلاش مجدد', 'Retry') }}</button>



      </div>



      <div v-else-if="!visibleProducts.length" class="py-14 text-center text-sm text-gray-500">{{ t('محصولی پیدا نشد.', 'No items found.') }}</div>



      <section v-else class="flex flex-col gap-2 px-5">



        <article v-for="product in visibleProducts" :key="product.id" class="flex items-center gap-3 rounded-[18px] bg-white px-3 py-3">



          <button type="button" class="flex min-w-0 flex-1 items-center gap-3 text-start" @click="openProduct(product)">



            <div class="grid size-[68px] shrink-0 place-items-center overflow-hidden rounded-full bg-gray-100">



              <img v-if="getImage(product)" :src="getImage(product)" :alt="productTitle(product)" loading="lazy" class="h-full w-full object-cover" @error="handleImageError(product)" />



              <i v-else class="bi bi-image text-2xl text-gray-400"></i>



            </div>



            <div class="min-w-0 flex-1">



              <h3 class="line-clamp-2 text-[13px] leading-6 font-extrabold">{{ productTitle(product) }}</h3>



              <!-- <p v-if="product.description" class="mt-0.5 line-clamp-1 text-[11px] text-gray-500">{{ product.description }}</p> -->



              <p class="mt-1.5 text-[12px] font-bold text-primary">{{ formatPrice(product.price) }} <span class="text-[10px] font-normal">{{ t('تومان', 'Toman') }}</span></p>



            </div>



          </button>



            <div v-if="isAdmin" class="flex shrink-0 items-center gap-2">



              <button type="button" :aria-label="`ویرایش ${product.title}`" class="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600" @click.stop="requestEditProduct(product)"><i class="bi bi-pencil-square text-[17px]"></i></button>



              <button type="button" :aria-label="`حذف ${product.title}`" class="grid size-9 place-items-center rounded-xl bg-red-50 text-red-600" @click.stop="requestDeleteProduct(product)"><i class="bi bi-trash3 text-[17px]"></i></button>



            </div>



          <div v-else dir="ltr" class="flex shrink-0 items-center gap-1 rounded-full bg-gray-100 p-1">



            <button type="button" :disabled="!quantity(product.id)" :aria-label="`کاهش ${product.title}`" class="grid size-7 place-items-center rounded-full bg-white disabled:opacity-35" @click="removeProduct(product.id)"><i class="bi bi-dash-lg block text-[14px] leading-none"></i></button>



            <span class="min-w-5 text-center text-[12px] font-bold">{{ formatCount(quantity(product.id)) }}</span>



            <button type="button" :aria-label="`افزودن ${product.title}`" class="grid size-8 place-items-center rounded-full bg-primary text-white" @click="addProduct(product.id)"><i class="bi bi-plus-lg block text-[15px] leading-none"></i></button>



          </div>



        </article>



      </section>



    </div>



    <!-- مودال جزئیات، وسط صفحه -->



    <Teleport to="body">



      <div v-if="selectedProduct" dir="rtl" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4" @click.self="closeProduct">



        <section role="dialog" aria-modal="true" :aria-label="productTitle(selectedProduct)" class="flex max-h-[90dvh] w-full max-w-[420px] flex-col items-center overflow-y-auto rounded-[28px] bg-white px-6 py-7 text-center shadow-2xl">



<!-- تصویر محصول داخل مودال -->



<div class="aspect-[420/325] w-full shrink-0 overflow-hidden rounded-[20px]">



  <img



    v-if="getImage(selectedProduct)"



    :src="getImage(selectedProduct)"



    :alt="productTitle(selectedProduct)"



    class="block h-full w-full object-cover"



    @error="handleImageError(selectedProduct)"



  />



  <i v-else class="bi bi-image text-5xl text-gray-400"></i>



</div>



          <h2 class="mt-5 text-[22px] leading-9 font-extrabold text-gray-800">{{ productTitle(selectedProduct) }}</h2>



          <p v-if="selectedProduct.description" class="mt-2 text-[13px] leading-7 text-gray-500">{{ selectedProduct.description }}</p>



          <div v-if="selectedProduct.ingredients" class="mt-4 w-full rounded-[16px] bg-gray-100 p-4 text-right">



            <strong class="text-[13px] text-primary">{{ t('اجزای تشکیل‌دهنده', 'Ingredients') }}</strong>



            <p class="mt-2 text-[12px] leading-6 text-gray-600">{{ selectedProduct.ingredients }}</p>



          </div>



          <div class="mt-5 w-full border-gray-200 pt-4">



            <span class="text-[12px] text-gray-500">{{ t('قیمت محصول', 'Price') }}</span>



            <p class="mt-1 text-[20px] font-extrabold text-primary">{{ formatPrice(selectedProduct.price) }} <span class="text-[12px]">{{ t('تومان', 'Toman') }}</span></p>



          </div>



          <!-- <div dir="ltr" class="mt-5 flex items-center gap-5 rounded-full bg-gray-100 p-2">



            <button type="button" :disabled="draftQuantity <= 1" class="grid size-10 place-items-center rounded-full bg-white disabled:opacity-35" @click="draftQuantity = Math.max(1, draftQuantity - 1)"><i class="bi bi-dash-lg block text-[18px] leading-none"></i></button>



            <span class="min-w-6 text-center text-[17px] font-extrabold">{{ formatCount(draftQuantity) }}</span>



            <button type="button" class="grid size-10 place-items-center rounded-full bg-primary text-white" @click="draftQuantity++"><i class="bi bi-plus-lg block text-[18px] leading-none"></i></button>



          </div> -->



          <div class="mt-7 grid w-full gap-3" :class="isAdmin ? 'grid-cols-3' : 'grid-cols-2'">



              <button v-if="isAdmin" type="button" class="h-12 rounded-[14px] bg-blue-600 text-[13px] font-bold text-white" @click="requestEditProduct(selectedProduct); closeProduct()"><i class="bi bi-pencil-square me-1"></i>{{ t('ویرایش', 'Edit') }}</button>



              <button v-if="isAdmin" type="button" class="h-12 rounded-[14px] bg-red-600 text-[13px] font-bold text-white" @click="requestDeleteProduct(selectedProduct); closeProduct()"><i class="bi bi-trash3 me-1"></i>{{ t('حذف', 'Delete') }}</button>



            <button v-if="!isAdmin" type="button" class="h-12 rounded-[14px] bg-primary text-[13px] font-bold text-white" @click="confirmProduct"><i class="bi bi-bag-plus me-2"></i>{{ t('افزودن', 'Add') }}</button>



            <button type="button" class="h-12 rounded-[14px] bg-gray-800 text-[13px] font-bold text-white" @click="closeProduct">{{ t('بازگشت', 'Back') }}</button>



          </div>



        </section>



      </div>



    </Teleport>



    <!-- مودال سبد خرید، وسط صفحه -->



    <Teleport to="body">



      <div v-if="showCart" dir="rtl" class="fixed inset-0 z-[110] flex items-center justify-center bg-black/65 p-4" @click.self="showCart = false">



        <section role="dialog" aria-modal="true" :aria-label="t('سبد خرید', 'Cart')" class="flex max-h-[85dvh] w-full max-w-[420px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">



          <div class="flex items-center justify-between border-b border-gray-200 px-5 py-5">



            <div class="flex items-center gap-3"><i class="bi bi-bag-fill text-[22px] text-primary"></i><div><h2 class="text-[18px] font-extrabold"></h2><span class="text-[11px] text-gray-500">{{ formatCount(cartCount) }} {{ t('سفارش', 'items') }}</span></div></div>



            <button type="button" aria-label="بستن" class="grid size-9 place-items-center rounded-full bg-gray-100" @click="showCart = false"><i class="bi bi-x-lg block leading-none"></i></button>



          </div>



          <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">



            <p v-if="!cartProducts.length" class="py-12 text-center text-sm text-gray-500">{{ t('سفارشی ندارید !!', 'Your cart is empty.') }}</p>



            <div v-for="product in cartProducts" :key="product.id" class="border-b border-gray-200 py-4 last:border-0">



              <div class="flex items-center justify-between gap-3">



                <div class="min-w-0"><h3 class="text-[13px] font-extrabold">{{ productTitle(product) }}</h3><p class="mt-1 text-[12px] text-primary">{{ formatPrice(product.price) }} {{ t('تومان', 'Toman') }}</p></div>



                <div dir="ltr" class="flex shrink-0 items-center gap-2 rounded-full bg-gray-100 p-1">



                  <button type="button" class="grid size-8 place-items-center rounded-full bg-white" @click="removeProduct(product.id)"><i class="bi bi-dash-lg block leading-none"></i></button>



                  <span class="min-w-4 text-center text-[12px] font-bold">{{ formatCount(quantity(product.id)) }}</span>



                  <button type="button" class="grid size-8 place-items-center rounded-full bg-primary text-white" @click="addProduct(product.id)"><i class="bi bi-plus-lg block leading-none"></i></button>



                </div>



              </div>



              <p class="mt-2 text-[12px] text-gray-500">{{ t('جمع این سفارش', 'Subtotal') }} : {{ formatPrice(product.price * quantity(product.id)) }} {{ t('تومان', 'Toman') }}</p>



            </div>



          </div>



          <div class="border-t border-gray-200 px-5 py-5">



            <div class="flex items-center justify-between"><span class="font-bold">{{ t('مبلغ کل', 'Total') }}</span><strong class="text-[18px] text-primary">{{ formatPrice(cartTotal) }} {{ t('تومان', 'Toman') }}</strong></div>



            <button type="button" class="mt-4 h-12 w-full rounded-[14px] bg-gray-800 text-[13px] font-bold text-white" @click="showCart = false">{{ t('بازگشت', 'Back') }}</button>



          </div>



        </section>



      </div>



    </Teleport>





    <!-- افزودن و ویرایش محصول: آماده اتصال به API -->

    <Teleport to="body">

      <div v-if="editorOpen && isAdmin" dir="rtl" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-3" @click.self="closeEditor">

        <section role="dialog" aria-modal="true" aria-label="مدیریت محصول" class="w-full max-w-[780px] max-h-[92dvh] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7">

          <div class="mb-6 flex items-center justify-between">

            <h2 class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-lg font-extrabold">

              <span>{{ editorMode === 'add' ? 'افزودن محصول جدید' : 'ویرایش محصول' }}</span>

              <span v-if="editorMode === 'edit' && editorProduct?.title" class="max-w-full break-words text-base font-bold text-primary">{{ editorProduct.title }}</span>

            </h2>

            <button type="button" class="grid size-9 place-items-center rounded-lg bg-gray-100" aria-label="بستن" @click="closeEditor"><i class="bi bi-x-lg"></i></button>

          </div>

          <form class="space-y-5" @submit.prevent="saveEditor">
            <p v-if="saveError" role="alert" class="rounded-lg bg-red-50 p-3 text-sm text-red-600">{{ saveError }}</p>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_200px]">

              <div class="grid gap-4">

                <div><UiBaseInput v-model="editorForm.title" label="نام" placeholder="نام" :error="formErrors.title || ''" /></div>

                <div><UiBaseInput v-model="editorForm.titleEn" label="نام لاتین" placeholder="نام لاتین" :error="formErrors.titleEn || ''" /></div>

                <div><UiBaseInput v-model="priceDisplay" label="قیمت" placeholder="مثلاً 150,000" type="text" inputmode="numeric" :error="formErrors.price || ''" /></div>

              </div>

              <div class="flex flex-col gap-3">

                <div v-if="imagePreview" class="relative overflow-hidden rounded-xl">
                  <label class="block cursor-pointer" title="ویرایش تصویر">
                    <img :src="imagePreview" alt="پیش‌نمایش محصول" class="h-32 w-full object-cover" />
                    <span class="absolute bottom-2 left-2 grid size-7 place-items-center rounded-full bg-white text-gray-800 shadow-md" aria-label="ویرایش تصویر">
                      <i class="bi bi-pencil-square text-xs"></i>
                    </span>
                    <input type="file" accept="image/*" class="hidden" @change="onEditorImage" />
                  </label>
                  <button type="button" class="absolute right-2 top-2 z-10 grid size-7 place-items-center rounded-full bg-red-600 text-white shadow-md" title="حذف تصویر" aria-label="حذف تصویر" @click.stop.prevent="removeEditorImage">
                    <i class="bi bi-trash3 text-xs"></i>
                  </button>
                </div>
                <label v-else class="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 p-3 text-sm text-gray-600">
                  <i class="bi bi-paperclip"></i> انتخاب تصویر
                  <input type="file" accept="image/*" class="hidden" @change="onEditorImage" />
                </label>
                <p v-if="formErrors.image" class="text-xs text-red-600">{{ formErrors.image }}</p>
                <span v-if="imageFile" class="break-all text-xs text-gray-500">{{ imageFile.name }}</span>
              </div>

            </div>

            <div>

              <UiBaseAutocomplete

                v-model="editorForm.category"

                label="دسته‌بندی"

                placeholder="انتخاب دسته‌بندی"

                :items="categoryOptions"

                :clearable="true"

                :rtl="true"

                :error="formErrors.category || ''"

                :menuProps="{ maxHeight: '220px' }"

                @change="formErrors.category = ''"

              />

            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div><label class="mb-2 block text-sm font-bold">توضیحات</label><textarea v-model="editorForm.description" rows="5" placeholder="توضیحات" class="w-full resize-y rounded-xl border border-gray-300 p-3 outline-none focus:border-primary"></textarea></div>

              <div><label class="mb-2 block text-sm font-bold">توضیحات لاتین</label><textarea v-model="editorForm.descriptionEn" rows="5" placeholder="توضیحات لاتین" class="w-full resize-y rounded-xl border border-gray-300 p-3 outline-none focus:border-primary"></textarea></div>

            </div>

            <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">

              <UiBaseCheckbox v-model="editorForm.isSpecial" label="پیشنهاد ویژه" />

              <div v-if="editorForm.isSpecial" class="space-y-3">

                <p class="text-xs leading-6 text-gray-500">تصویر مخصوص اسلایدر را جدا از تصویر اصلی محصول انتخاب کنید.</p>

                <label class="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-white p-4 text-sm text-primary">

                  <i class="bi bi-image"></i>

                  <span>انتخاب تصویر اسلایدر</span>

                  <input ref="specialImageInput" type="file" accept="image/*" class="hidden" @change="onSpecialImage" />

                </label>

                <p v-if="formErrors.specialImage" class="text-xs text-red-600">{{ formErrors.specialImage }}</p>

                <div v-if="specialImagePreview" class="relative overflow-hidden rounded-xl">
                  <img :src="specialImagePreview" alt="پیش‌نمایش تصویر پیشنهاد ویژه" class="aspect-[16/6] w-full object-cover" />
                  <button type="button" class="absolute right-2 top-2 z-10 grid size-7 place-items-center rounded-full bg-red-600 text-white shadow-md" title="حذف تصویر اسلایدر" aria-label="حذف تصویر اسلایدر" @click.stop.prevent="removeSpecialImage">
                    <i class="bi bi-trash3 text-xs"></i>
                  </button>
                </div>

                <span v-if="specialImageFile" class="block break-all text-xs text-gray-500">{{ specialImageFile.name }}</span>

              </div>

            </div>

            <div class="flex items-center justify-center gap-3 pt-2">

              <UiBaseButton :label="savingProduct ? 'در حال ذخیره...' : 'ذخیره'" variant="filled" color="primary" :disabled="savingProduct" @click="saveEditor" />

              <UiBaseButton label="لغو" variant="outline" color="primary" @click="closeEditor" />

            </div>

          </form>

        </section>

      </div>

    </Teleport>

    <!-- تأیید حذف: DELETE سپس یک GET برای بروزرسانی لیست -->

    <Teleport to="body">

      <div v-if="deleteProductTarget && isAdmin" dir="rtl" class="fixed inset-0 z-[210] flex items-center justify-center bg-black/60 p-4" @click.self="closeDeleteDialog">

        <section role="alertdialog" aria-modal="true" class="w-full max-w-[420px] rounded-2xl bg-white p-6 text-center shadow-2xl">

          <i class="bi bi-trash3 text-4xl text-red-600"></i>

          <h2 class="mt-3 text-lg font-bold">حذف محصول</h2>

          <p class="mt-3 text-sm leading-7">آیا از حذف محصول «{{ deleteProductTarget.title }}» اطمینان دارید؟</p>

          <p v-if="deleteError" class="mt-3 text-sm text-red-600">{{ deleteError }}</p>

          <div class="mt-6 flex justify-center gap-3">

            <UiBaseButton :label="deletingProduct ? 'در حال حذف...' : 'بله، حذف شود'" :disabled="deletingProduct" variant="filled" color="primary" @click="confirmDeleteProduct" />

            <UiBaseButton label="انصراف" :disabled="deletingProduct" variant="outline" color="primary" @click="closeDeleteDialog" />

          </div>

        </section>

      </div>

    </Teleport>

    <!-- لودینگ عملیات افزودن، ویرایش و حذف؛ تا پایان درخواست و دریافت مجدد محصولات -->
    <Teleport to="body">
      <div v-if="productOperationLoading" dir="rtl" role="status" aria-live="polite"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 p-5 backdrop-blur-[2px]">
        <div class="flex w-full max-w-[320px] flex-col items-center gap-4 rounded-[22px] bg-white px-6 py-8 text-center shadow-2xl">
          <i class="bi bi-arrow-repeat inline-block animate-spin text-[38px] text-primary" aria-hidden="true"></i>
          <p class="text-[14px] font-bold leading-7 text-gray-800">{{ productOperationMessage }}</p>
          <p class="text-[11px] text-gray-500">لطفاً منتظر بمانید</p>
        </div>
      </div>
    </Teleport>

  </main>



</template>
