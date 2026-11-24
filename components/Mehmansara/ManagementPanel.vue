<script setup>
import { computed, ref, watch, onMounted } from 'vue'



const toast = useToast()
function notify(type, message) {
  if (!message) return
  if (typeof toast[type] === 'function') toast[type](message)
  else if (typeof toast.add === 'function') toast.add({ title: message, color: type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'success' })
}

const API = 'https://mehmansara.ahuan.ir/api/places'
const role = useCookie('role')
const userRole = computed(() => String(role.value || '').trim().toLowerCase())
const isAdmin = computed(() => userRole.value === 'admin')
const isOperator = computed(() => userRole.value === 'operator')
const canManage = computed(() => isAdmin.value || isOperator.value)

const places = ref([])
const loading = ref(false)
const editLoadingId = ref(null)
const saving = ref(false)
const error = ref('')
const success = ref('')
const search = ref('')
const provinceFilter = ref('')
const cityFilter = ref('')
const holderFilter = ref('')
const statusFilter = ref('')
const expandedId = ref(null)
const modalOpen = ref(false)
const editingId = ref(null)
const createdInSession = ref(false)
const creationUnconfirmed = ref(false)
const packageCreated = computed(() => editingId.value != null)
const modalSuccess = ref('')
const activeTab = ref('main')

const tabs = [
  { id: 'main', label: 'اطلاعات اصلی' },
  { id: 'details', label: 'اطلاعات تکمیلی' },
  { id: 'images', label: 'تصاویر' },
  { id: 'hospitals', label: 'مراکز درمانی اطراف' },
  { id: 'touristPlaces', label: 'مراکز توریستی اطراف' },
  { id: 'importantPlaces', label: 'مراکز ضروری اطراف' }
]

const emptyForm = () => ({
  name: '', province: '', city: '', keyHolder: '', mobile: '', address: '',
  standardCapacity: '', maxCapacity: '', meterage: '', floor: '', roomsNumber: '', bedNumber: '', stairs: '',
  toilet: [], cooler: [], warmer: [], parking: false, lift: false, pilgrimage: false, parkingCapacity: '', during: '', status: '',
  images: [], hospitals: [], touristPlaces: [], importantPlaces: []
})
const form = ref(emptyForm())
const imageDraft = ref({ image: '', description: '' })
const imageInput = ref(null)
const imageReading = ref(false)
let imageReadToken = 0
function resetImageDraft() {
  imageReadToken++
  imageReading.value = false
  imageDraft.value = { image: '', description: '' }
  if (imageInput.value) imageInput.value.value = ''
}
async function selectImage(event) {
  const token = ++imageReadToken
  const file = event.target.files?.[0]
  imageDraft.value.image = ''
  error.value = ''
  imageReading.value = false
  if (!file) return
  if (!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)) { error.value = 'فرمت تصویر معتبر نیست.'; return }
  imageReading.value = true
  try {
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('خواندن تصویر ناموفق بود.'))
      reader.readAsDataURL(file)
    })
    if (token === imageReadToken) imageDraft.value.image = data
  } catch (e) { if (token === imageReadToken) error.value = e.message }
  finally { if (token === imageReadToken) imageReading.value = false }
}
async function persistImages(images) {
  if (!isAdmin.value || !packageCreated.value || saving.value || imageReading.value) return false
  saving.value = true; error.value = ''; modalSuccess.value = ''
  try {
    const payload = buildPayload()
    payload.images = images
    await $fetch(`${API}/${encodeURIComponent(editingId.value)}`, { method: 'PUT', body: payload, retry: 0 })
    form.value.images = images
    const index = places.value.findIndex(p => String(p._id ?? p.id) === String(editingId.value))
    if (index >= 0) places.value[index] = { ...places.value[index], ...payload }
    modalSuccess.value = 'تصاویر با موفقیت ذخیره شدند.'
    return true
  } catch (e) { error.value = e?.data?.message || e?.data?.error || e?.message || 'ذخیره تصاویر انجام نشد.'; return false }
  finally { saving.value = false }
}
async function addImage() {
  if (!imageDraft.value.image || saving.value || imageReading.value) return
  if (await persistImages([...form.value.images, { ...imageDraft.value, description: imageDraft.value.description.trim() }])) resetImageDraft()
}
const deletePlaceTarget = ref(null)
const deletingPlace = ref(false)
const deletePlaceError = ref('')
function openPlaceDelete(place) {
  if (!isAdmin.value || deletingPlace.value || modalOpen.value || editLoadingId.value !== null) return
  const id = place._id ?? place.id
  if (id == null || !String(id).trim()) { error.value = 'شناسه مهمانسرا مشخص نیست.'; return }
  error.value = ''; success.value = ''; deletePlaceError.value = ''
  deletePlaceTarget.value = { id, name: place.name }
}
function cancelPlaceDelete() {
  if (!deletingPlace.value) { deletePlaceTarget.value = null; deletePlaceError.value = '' }
}
async function confirmPlaceDelete() {
  if (!isAdmin.value || deletingPlace.value || !deletePlaceTarget.value) return
  const { id } = deletePlaceTarget.value
  deletingPlace.value = true; deletePlaceError.value = ''
  try {
    await $fetch(`${API}/${encodeURIComponent(id)}`, { method: 'DELETE', retry: 0 })
    places.value = places.value.filter(p => String(p._id ?? p.id) !== String(id))
    if (String(expandedId.value) === String(id)) expandedId.value = null
    deletePlaceTarget.value = null
    success.value = 'مهمانسرا با موفقیت حذف شد.'
    await loadPlaces()
  } catch (e) {
    deletePlaceError.value = e?.data?.message || e?.data?.error || e?.message || 'حذف مهمانسرا انجام نشد.'
  } finally { deletingPlace.value = false }
}

const deleteImageIndex = ref(null)
function removeImage(index) {
  if (saving.value || imageReading.value) return
  error.value = ''
  deleteImageIndex.value = index
}
function cancelImageDelete() { if (!saving.value) deleteImageIndex.value = null }
async function confirmImageDelete() {
  if (saving.value || deleteImageIndex.value === null) return
  const index = deleteImageIndex.value
  const ok = await persistImages(form.value.images.filter((_, i) => i !== index))
  if (ok) deleteImageIndex.value = null
}
async function editImageDescription(index) {
  if (saving.value) return
  const description = window.prompt('توضیحات تصویر', form.value.images[index].description || '')
  if (description === null) return
  await persistImages(form.value.images.map((item, i) => i === index ? { ...item, description: description.trim() } : item))
}
const newText = ref({ hospitals: '', touristPlaces: '', importantPlaces: '' })

const normalize = v => String(v ?? '').trim().replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[آأإٱ]/g, 'ا').toLowerCase()
const provinces = computed(() => [...new Set(places.value.map(p => p.province).filter(Boolean))].sort((a,b) => a.localeCompare(b,'fa')))
const cities = computed(() => [...new Set(places.value.filter(p => !provinceFilter.value || p.province === provinceFilter.value).map(p => p.city).filter(Boolean))].sort((a,b) => a.localeCompare(b,'fa')))
const holders = computed(() => [...new Set(places.value.map(p => p.keyHolder).filter(Boolean))].sort((a,b) => a.localeCompare(b,'fa')))
const statusOptions = [
  'بازسازی شده',
  'با وضعیت موجود مبلمان شده',
  'با مبلمان قدیم درحال استفاده است'
]
const coolerOptions = ['کولر آبی','کولر گازی','اسپلیت','فن کوئل','چیلر']
const warmerOptions = ['بخاری','شومینه','موتورخانه','پکیج','رادیاتور','گرمایش از کف','گرمایش از سقف']
const tabIndex = computed(() => tabs.findIndex(t => t.id === activeTab.value))
const toNumber = value => value === '' || value === null || value === undefined ? null : Number(String(value).replace(/[۰-۹]/g, x => '۰۱۲۳۴۵۶۷۸۹'.indexOf(x)).replace(/[٠-٩]/g, x => '٠١٢٣٤٥٦٧٨٩'.indexOf(x)))
const numericFields = ['standardCapacity','maxCapacity','meterage','floor','roomsNumber','bedNumber','stairs','parkingCapacity']
function validateStep() {
  error.value = ''
  if (activeTab.value === 'main' && (!String(form.value.name || '').trim() || !form.value.province || !form.value.city)) { error.value = 'نام مهمانسرا، استان و شهر الزامی هستند.'; return false }
  if (activeTab.value === 'details') {
    for (const key of numericFields) {
      if ((key === 'parkingCapacity' && !form.value.parking) || form.value[key] === '' || form.value[key] == null) continue
      const n = toNumber(form.value[key])
      if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) { error.value = 'فیلدهای عددی باید عدد صحیح و نامنفی باشند.'; return false }
    }
    if (form.value.parking && (toNumber(form.value.parkingCapacity) === null || !Number.isInteger(toNumber(form.value.parkingCapacity)) || toNumber(form.value.parkingCapacity) < 0)) { error.value = 'ظرفیت پارکینگ را به صورت عدد وارد کنید.'; return false }
    if (form.value.pilgrimage && !String(form.value.during || '').trim()) { error.value = 'فاصله تا حرم را وارد کنید (مثلاً 1200 متر).'; return false }
  }
  return true
}
function nextStep() { if (!packageCreated.value || saving.value || !validateStep()) return; if (tabIndex.value < tabs.length - 1) activeTab.value = tabs[tabIndex.value + 1].id }
function previousStep() { if (saving.value) return; error.value = ''; if (tabIndex.value > 0) activeTab.value = tabs[tabIndex.value - 1].id }
function goToStep(index) { if (saving.value || (!packageCreated.value && index > 0)) return; if (!validateStep()) return; activeTab.value = tabs[index].id }
const formCities = computed(() => [...new Set(places.value.filter(p => p.province === form.value.province).map(p => p.city).filter(Boolean))].sort((a,b) => a.localeCompare(b,'fa')))
const filtered = computed(() => places.value.filter(p => {
  if (provinceFilter.value && p.province !== provinceFilter.value) return false
  if (cityFilter.value && p.city !== cityFilter.value) return false
  if (holderFilter.value && p.keyHolder !== holderFilter.value) return false
  if (statusFilter.value && String(p.status ?? '') !== statusFilter.value) return false
  const q = normalize(search.value)
  return !q || [p.name,p.province,p.city,p.keyHolder,p.mobile,p.address].some(v => normalize(v).includes(q))
}))

watch(provinceFilter, () => { cityFilter.value = '' })

async function loadPlaces() {
  loading.value = true
  error.value = ''
  try {
    const result = await $fetch(API)
    const list = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : Array.isArray(result?.places) ? result.places : null
    if (!list) throw new Error('ساختار پاسخ API فهرست مهمانسراها قابل شناسایی نیست.')
    places.value = list
  } catch (e) {
    error.value = e?.data?.message || e?.message || 'خطا در دریافت مهمانسراها'
  } finally { loading.value = false }
}

function openCreateModal() {
  if (!isAdmin.value || editLoadingId.value !== null) return
  resetImageDraft()
  editingId.value = null
  createdInSession.value = false
  creationUnconfirmed.value = false
  modalSuccess.value = ''
  form.value = emptyForm()
  newText.value = { hospitals: '', touristPlaces: '', importantPlaces: '' }
  activeTab.value = 'main'
  error.value = ''
  modalOpen.value = true
}
async function openEditModal(row) {
  if (!isAdmin.value || editLoadingId.value !== null || saving.value || modalOpen.value) return
  const id = row._id ?? row.id
  if (id == null || !String(id).trim()) { error.value = 'شناسه مهمانسرا مشخص نیست.'; return }
  editLoadingId.value = id
  error.value = ''
  try {
    const result = await $fetch(`${API}/${encodeURIComponent(id)}`, { method: 'GET' })
    const place = result?.data?.place ?? result?.data ?? result?.place ?? result
    if (!place || Array.isArray(place) || typeof place !== 'object' || String(place._id ?? place.id ?? '') !== String(id)) throw new Error('پاسخ جزئیات مهمانسرا معتبر نیست.')
    resetImageDraft()
    createdInSession.value = false
    creationUnconfirmed.value = false
    modalSuccess.value = ''
    editingId.value = id
    const base = emptyForm()
    form.value = { ...base, ...JSON.parse(JSON.stringify(place)), meterage: place.meterage ?? place.area ?? '', roomsNumber: place.roomsNumber ?? place.rooms ?? '', bedNumber: place.bedNumber ?? place.beds ?? '', lift: Boolean(place.lift ?? (place.elevator === 'دارد')), parking: Boolean(place.parking === true || place.parking === 'دارد'), pilgrimage: Boolean(place.pilgrimage), during: place.during ?? place.distanceToCenter ?? '', status: typeof place.status === 'string' ? place.status : '' }
    for (const key of ['toilet','cooler','warmer','images','hospitals','touristPlaces','importantPlaces']) {
      if (!Array.isArray(form.value[key])) form.value[key] = []
    }
    newText.value = Object.fromEntries(['hospitals','touristPlaces','importantPlaces'].map(key => [key, form.value[key].map(stripHtml).join('\n')]))
    activeTab.value = 'main'
    error.value = ''
    modalOpen.value = true
  } catch (e) {
    error.value = e?.data?.message || e?.data?.error || e?.message || 'خطا در دریافت جزئیات مهمانسرا'
  } finally { editLoadingId.value = null }
}
async function closeModal() {
  if (deleteImageIndex.value !== null || saving.value) return

  modalOpen.value = false

  if (createdInSession.value || creationUnconfirmed.value) {
    await loadPlaces()
  }
}
async function createPlace() {
  if (!isAdmin.value || saving.value || packageCreated.value || creationUnconfirmed.value || !validateStep()) return
  saving.value = true
  error.value = ''
  modalSuccess.value = ''
  try {
    const { name, province, city, keyHolder, mobile, address, status } = form.value
    const result = await $fetch(API, { method: 'POST', body: { name: name.trim(), province, city, keyHolder, mobile, address, status }, retry: 0 })
    const id = result?.data?._id ?? result?.data?.id ?? result?.place?._id ?? result?.place?.id ?? result?._id ?? result?.id
    if ((typeof id !== 'string' && typeof id !== 'number') || !String(id).trim()) {
      creationUnconfirmed.value = true
      throw new Error('پاسخ ایجاد پکیج شناسه ندارد. برای جلوگیری از ثبت تکراری، فهرست را بررسی کنید.')
    }
    editingId.value = id
    createdInSession.value = true
    modalSuccess.value = 'پکیج ایجاد شد. اکنون اطلاعات تکمیلی را وارد کنید.'
    activeTab.value = 'details'
  } catch (e) {
    error.value = e?.data?.message || e?.data?.error || e?.message || 'ایجاد پکیج انجام نشد.'
  } finally { saving.value = false }
}
function stripHtml(value) { return String(value || '').replace(/<br\s*\/?\s*>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').trim() }
function serializeCenters(key) {
  return newText.value[key].split(/\r?\n/).map(v => v.trim()).filter(Boolean).map(v => `<p>${v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>`)
}
function setArrayValue(key, value, checked) {
  if (!Array.isArray(form.value[key])) form.value[key] = []
  const exists = form.value[key].includes(value)
  if (checked && !exists) form.value[key].push(value)
  else if (!checked && exists) form.value[key] = form.value[key].filter(x => x !== value)
}
function toggleArrayValue(key, value) {
  const list = form.value[key]
  const index = list.indexOf(value)
  if (index < 0) list.push(value)
  else list.splice(index, 1)
}
function buildPayload() {
    const { _id, __v, area, rooms, beds, elevator, distanceToCenter, ...payload } = form.value
    for (const key of ['hospitals','touristPlaces','importantPlaces']) payload[key] = serializeCenters(key)
    for (const key of numericFields) {
      if (key === 'parkingCapacity' && !payload.parking) continue
      const number = toNumber(payload[key])
      if (number === null) { delete payload[key]; continue }
      if (!Number.isInteger(number) || number < 0) throw new Error('مقادیر عددی معتبر نیستند.')
      payload[key] = number
    }
    payload.lift = Boolean(payload.lift)
    payload.parking = Boolean(payload.parking)
    payload.pilgrimage = Boolean(payload.pilgrimage)
    if (payload.parking && (toNumber(payload.parkingCapacity) === null || !Number.isInteger(toNumber(payload.parkingCapacity)) || toNumber(payload.parkingCapacity) < 0)) { activeTab.value = 'details'; throw new Error('ظرفیت پارکینگ را به صورت عدد وارد کنید.') }
    if (payload.pilgrimage && !String(payload.during || '').trim()) { activeTab.value = 'details'; throw new Error('فاصله تا حرم را وارد کنید.') }
    if (!payload.parking) delete payload.parkingCapacity
    if (!payload.pilgrimage) delete payload.during
    return payload
}

async function savePlace() {
  if (!isAdmin.value || saving.value || !packageCreated.value) return
  if (!validateStep()) return
  if (!String(form.value.name || '').trim() || !form.value.province || !form.value.city) {
    activeTab.value = 'main'; error.value = 'نام مهمانسرا، استان و شهر الزامی هستند.'; return
  }
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    const payload = buildPayload()
    const url = `${API}/${encodeURIComponent(editingId.value)}`
    await $fetch(url, { method: 'PUT', body: payload })
    modalOpen.value = false
    success.value = createdInSession.value ? 'پکیج و اطلاعات تکمیلی ذخیره شد.' : 'اطلاعات مهمانسرا ویرایش شد.'
    await loadPlaces()
  } catch (e) {
    error.value = e?.data?.message || e?.data?.error || e?.message || 'ذخیره اطلاعات انجام نشد.'
  } finally { saving.value = false }
}

const exportingExcel = ref(false)
async function downloadExcel() {
  if (!import.meta.client || !canManage.value || exportingExcel.value) return
  exportingExcel.value = true
  error.value = ''
  try {
    const result = await $fetch(API)
    const list = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : result?.places
    if (!Array.isArray(list)) throw new Error('ساختار پاسخ API معتبر نیست.')
    const XLSX = await import('xlsx')
    const headers = ['نام مهمانسرا','استان','شهر','کلیددار','موبایل','تعداد تخت','شهر','طبقه','تعداد اتاق','تعداد پله','آسانسور','پارکینگ','ظرفیت استاندارد','حداکثر ظرفیت','متراژ','سرویس بهداشتی','فاصله تا مرکز شهر','سیستم سرمایشی','سیستم گرمایشی','آدرس','مراکز درمانی اطراف','مراکز توریستی اطراف','مراکز ضروری اطراف','ظرفیت پارکینگ','وضعیت']
    const text = v => v == null ? '' : String(v)
    const num = v => { const n = toNumber(v); return n != null && Number.isFinite(n) ? n : '' }
    const yesNo = v => v === true || v === 'دارد' ? 'دارد' : v === false || v === 'ندارد' ? 'ندارد' : ''
    const arr = v => Array.isArray(v) ? v.join('، ') : text(v)
    const centers = v => (Array.isArray(v) ? v : [v]).map(stripHtml).filter(Boolean).join('\n')
    const rows = list.map(p => [text(p.name),text(p.province),text(p.city),text(p.keyHolder),text(p.mobile),num(p.bedNumber ?? p.beds),text(p.city),num(p.floor),num(p.roomsNumber ?? p.rooms),num(p.stairs),yesNo(p.lift ?? p.elevator),yesNo(p.parking),num(p.standardCapacity),num(p.maxCapacity),num(p.meterage ?? p.area),arr(p.toilet),text(p.during ?? p.distanceToCenter),arr(p.cooler),arr(p.warmer),text(p.address),centers(p.hospitals),centers(p.touristPlaces),centers(p.importantPlaces),num(p.parkingCapacity),text(p.status)])
    const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
    sheet['!cols'] = [34,22,20,24,17,12,20,10,12,12,12,12,17,17,12,24,28,28,28,65,60,60,60,18,36].map(wch => ({ wch }))
    sheet['!autofilter'] = { ref: sheet['!ref'] }
    const workbook = XLSX.utils.book_new()
    workbook.Workbook = { Views: [{ RTL: true }] }
    XLSX.utils.book_append_sheet(workbook, sheet, 'مهمانسراها')
    XLSX.writeFile(workbook, 'مهمانسراهای بانک تجارت.xlsx')
    notify('success', 'فایل اکسل با موفقیت آماده شد.')
  } catch (e) {
    error.value = e?.data?.message || e?.message || 'خطا در دانلود اکسل'
  } finally { exportingExcel.value = false }
}
const exportingPdf = ref(false)
async function downloadPdf() {
  if (!import.meta.client || !canManage.value || exportingPdf.value) return
  exportingPdf.value = true
  error.value = ''
  let host
  try {
    const result = await $fetch(API, { method: 'GET' })
    const list = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : result?.places
    if (!Array.isArray(list)) throw new Error('ساختار پاسخ API معتبر نیست.')
    const [{ jsPDF }, { default: html2canvas }] = await Promise.all([import('jspdf'), import('html2canvas')])
    await document.fonts?.ready
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
    host = document.createElement('div')
    const font = getComputedStyle(document.querySelector('.management-page') || document.body).fontFamily
    Object.assign(host.style, { position: 'fixed', left: '-10000px', top: '0', width: '794px', background: '#fff', color: '#222', fontFamily: font, direction: 'rtl', pointerEvents: 'none' })
    document.body.appendChild(host)
    const headers = ['نام مهمانسرا', 'استان', 'شهر', 'کلیددار', 'موبایل']
    const keys = ['name', 'province', 'city', 'keyHolder', 'mobile']
    const widths = [25, 20, 17, 21, 17]
    const makeRow = (table, values, header = false) => {
      const tr = table.insertRow()
      values.forEach((value, i) => {
        const cell = document.createElement(header ? 'th' : 'td')
        cell.textContent = String(value ?? '')
        Object.assign(cell.style, { width: widths[i] + '%', padding: '12px 5px', textAlign: 'center', verticalAlign: 'middle', fontSize: header ? '15px' : '13px', lineHeight: '1.65', fontWeight: header ? '700' : '400', overflowWrap: 'anywhere', borderBottom: header ? '1px solid #aaa' : 'none' })
        if (i === 4 && !header) cell.dir = 'ltr'
        tr.appendChild(cell)
      })
      return tr
    }
    let index = 0, page = 0
    do {
      host.replaceChildren()
      const table = document.createElement('table')
      Object.assign(table.style, { width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', direction: 'rtl' })
      host.appendChild(table)
      makeRow(table, headers, true)
      const start = index
      while (index < list.length) {
        const row = makeRow(table, keys.map(key => list[index][key]))
        if (host.scrollHeight > 1040 && index > start) { row.remove(); break }
        index++
      }
      const canvas = await html2canvas(host, { scale: 2, backgroundColor: '#ffffff', logging: false, width: host.offsetWidth, height: host.scrollHeight, windowWidth: 1200, scrollX: 0, scrollY: 0 })
      if (page++) pdf.addPage()
      const width = Math.min(194, 281 * canvas.width / canvas.height)
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.94), 'JPEG', (210 - width) / 2, 8, width, width * canvas.height / canvas.width)
      canvas.width = canvas.height = 0
    } while (index < list.length)
    pdf.save('مهمانسراهای بانک تجارت.pdf')
    notify('success', 'فایل PDF با موفقیت آماده شد.')
  } catch (e) {
    error.value = e?.data?.message || e?.message || 'خطا در دانلود PDF'
  } finally {
    host?.remove()
    exportingPdf.value = false
  }
}

const downloadingImagesId = ref(null)
const safeFileName = value => String(value ?? '').replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').replace(/^[.\s]+|[.\s]+$/g, '').slice(0, 100)
async function downloadPlaceImages(row) {
  if (!import.meta.client || !canManage.value || downloadingImagesId.value !== null) return
  const id = row._id ?? row.id
  if (id == null || !String(id).trim()) { notify('error', 'شناسه مهمانسرا مشخص نیست.'); return }
  downloadingImagesId.value = id
  try {
    const result = await $fetch(`${API}/${encodeURIComponent(id)}`, { method: 'GET' })
    const place = result?.data?.place ?? result?.data ?? result?.place ?? result
    if (!place || String(place._id ?? place.id ?? '') !== String(id)) throw new Error('پاسخ جزئیات مهمانسرا معتبر نیست.')
    const images = Array.isArray(place.images) ? place.images : []
    if (!images.length) { notify('warning', 'برای این مهمانسرا تصویری ثبت نشده است.'); return }
    const { default: JSZip } = await import('jszip')
    const zip = new JSZip()
    const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/bmp': 'bmp', 'image/avif': 'avif' }
    let count = 0
    for (const [index, item] of images.entries()) {
      const source = String(typeof item === 'string' ? item : item?.image ?? '').trim()
      if (!source) continue
      const match = source.match(/^data:(image\/[\w.+-]+);base64,([\s\S]+)$/i)
      const name = `${index + 1}-${safeFileName(item?.description) || 'تصویر'}`
      if (match) {
        const ext = extensions[match[1].toLowerCase()]
        if (!ext) throw new Error(`فرمت تصویر شماره ${index + 1} پشتیبانی نمی‌شود.`)
        zip.file(`${name}.${ext}`, match[2].replace(/\s/g, ''), { base64: true })
      } else {
        const url = new URL(source, API + '/')
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error('آدرس تصویر معتبر نیست.')
        const response = await fetch(url)
        if (!response.ok) throw new Error(`دریافت تصویر شماره ${index + 1} ناموفق بود.`)
        const blob = await response.blob()
        const ext = extensions[blob.type.toLowerCase()]
        if (!ext) throw new Error(`فرمت تصویر شماره ${index + 1} معتبر نیست.`)
        zip.file(`${name}.${ext}`, await blob.arrayBuffer())
      }
      count++
    }
    if (!count) { notify('warning', 'تصویر قابل دانلود یافت نشد.'); return }
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${safeFileName(place.name || row.name) || 'مهمانسرا'}-تصاویر.zip`
    document.body.appendChild(link)
    try { link.click() } finally { link.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000) }
    notify('success', `فایل ZIP شامل ${count} تصویر آماده شد.`)
  } catch (e) {
    notify('error', e?.data?.message || e?.message || 'دانلود تصاویر انجام نشد.')
  } finally { downloadingImagesId.value = null }
}
function showUnavailable(label) { notify('warning', `برای ${label} هنوز سرویس مربوطه مشخص نشده است.`) }
function statusText(v) { return statusOptions.includes(v) ? v : (v || 'ثبت نشده') }
function displayValue(v, suffix = '') { return v === null || v === undefined || v === '' ? 'ثبت نشده' : Array.isArray(v) ? (v.join('، ') || 'ثبت نشده') : String(v) + suffix }
const detailItems = p => [
  { label:'تعداد تخت', value:displayValue(p.bedNumber ?? p.beds, ' تخت'), icon:'bed' },
  { label:'تعداد اتاق', value:displayValue(p.roomsNumber ?? p.rooms, ' اتاق'), icon:'door-open' },
  { label:'طبقه', value:displayValue(p.floor), icon:'ladder' },
  { label:'تعداد پله', value:displayValue(p.stairs, ' پله'), icon:'ladder' },
  { label:'حداکثر ظرفیت', value:displayValue(p.maxCapacity, ' نفر'), icon:'people' },
  { label:'ظرفیت استاندارد', value:displayValue(p.standardCapacity, ' نفر'), icon:'people' },
  { label:'آسانسور', value:p.lift === true ? 'دارد' : p.lift === false ? 'ندارد' : displayValue(p.elevator), icon:'arrow-down-up' },
  { label:'پارکینگ', value:p.parking === true ? 'دارد' : p.parking === false ? 'ندارد' : displayValue(p.parking), icon:'car-front' },
  { label:'ظرفیت پارکینگ', value:p.parking === true || p.parking === 'دارد' ? displayValue(p.parkingCapacity, ' خودرو') : '—', icon:'car-front' },
  { label:'متراژ', value:displayValue(p.meterage ?? p.area, ' متر'), icon:'arrows-fullscreen' },
  { label:'سرویس بهداشتی', value:displayValue(p.toilet), icon:'droplet' },
  { label:'سیستم سرمایشی', value:displayValue(p.cooler), icon:'snow' },
  { label:'سیستم گرمایشی', value:displayValue(p.warmer), icon:'fire' },
  { label:'فاصله تا حرم', value:displayValue(p.during ?? p.distanceToCenter), icon:'map' }
]
onMounted(() => { if (canManage.value) loadPlaces() })

const SMS_API = 'https://api.ahuan.ir/api/Auth/Send-Sms'
const smsOpen = ref(false), smsLoading = ref(false), smsSending = ref(false)
const smsError = ref(''), smsText = ref(''), smsProvince = ref([])
const smsContacts = ref([]), smsSelected = ref([]), smsResults = ref({}), smsFinished = ref(false)
const smsProvinces = computed(() => [...new Set(smsContacts.value.flatMap(c => c.locations.map(l=>l.province)))].filter(Boolean).sort((a,b)=>a.localeCompare(b,'fa')))
const smsVisible = computed(() => smsContacts.value.filter(c => c.locations.some(l=>(!smsProvince.value.length || smsProvince.value.includes(l.province)))))
watch(smsVisible,()=>{smsSelected.value=smsSelected.value.filter(m=>smsVisible.value.some(c=>c.mobile===m))},{flush:'sync'})
const smsHolderOptions = computed(()=>smsVisible.value.map(c=>({id:c.mobile,name:`${c.name} — ${c.mobile}`})))
const smsTargets = computed(() => smsContacts.value.filter(c => smsSelected.value.includes(c.mobile)))
const smsSuccessCount = computed(() => Object.values(smsResults.value).filter(v => v === 'success').length)
function normalizeMobile(v) {
  let n = String(v ?? '').replace(/[۰-۹]/g,x=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(x)).replace(/[٠-٩]/g,x=>'٠١٢٣٤٥٦٧٨٩'.indexOf(x)).replace(/[\s()-]/g,'')
  n = n.replace(/^(?:\+98|0098|98)(?=9\d{9}$)/,'0')
  if (/^9\d{9}$/.test(n)) n = '0'+n
  return /^09\d{9}$/.test(n) ? n : ''
}
async function openSmsModal() {
  if (!canManage.value || smsOpen.value || smsSending.value) return
  smsOpen.value = true; smsLoading.value = true; smsError.value = ''; smsText.value = ''; smsProvince.value = []; smsSelected.value = []; smsResults.value = {}; smsContacts.value = []; smsFinished.value = false
  try {
    const result = await $fetch(API, {method:'GET'})
    const list = Array.isArray(result) ? result : result?.data ?? result?.places
    if (!Array.isArray(list)) throw new Error('پاسخ فهرست مهمانسراها معتبر نیست.')
    const map = new Map()
    for (const p of list) {
      const mobile = normalizeMobile(p.mobile), name = String(p.keyHolder ?? '').trim(), province = String(p.province ?? '').trim()
      if (!mobile || !name) continue
      if (!map.has(mobile)) map.set(mobile,{mobile,names:[],locations:[]})
      const c = map.get(mobile)
      if (!c.names.includes(name)) c.names.push(name)
      const city = String(p.city ?? '').trim(), id = JSON.stringify([province,city])
      if (!c.locations.some(l=>l.id===id)) c.locations.push({province,city,id})
    }
    smsContacts.value = [...map.values()].map(c=>({...c,name:c.names.join(' / ')})).sort((a,b)=>a.name.localeCompare(b.name,'fa'))
  } catch(e) { smsError.value = e?.data?.message || e?.message || 'دریافت کلیدداران ناموفق بود.' }
  finally { smsLoading.value = false }
}
function selectAllSms() {
  if (smsSending.value || smsLoading.value || smsFinished.value) return
  smsProvince.value = []
  smsSelected.value = smsContacts.value.map(c => c.mobile)
  smsError.value = ''
}
function clearSms() {
  if (smsSending.value || smsLoading.value) return
  smsProvince.value = []; smsSelected.value = []; smsText.value = ''
  smsResults.value = {}; smsFinished.value = false; smsError.value = ''
}
function closeSmsModal() { if (!smsSending.value && !smsLoading.value) smsOpen.value = false }
async function sendSms() {
  if (!canManage.value || smsSending.value || smsLoading.value || smsFinished.value) return
  const sms = smsText.value.trim(), targets = [...smsTargets.value]
  smsError.value = ''
  if (!sms) { smsError.value = 'متن پیامک الزامی است.'; return }
  if (!targets.length) { smsError.value = 'حداقل یک کلیددار انتخاب کنید.'; return }
  smsSending.value = true
  smsResults.value = Object.fromEntries(targets.map(c=>[c.mobile,'pending']))
  try {
    for (const c of targets) {
      smsResults.value[c.mobile] = 'sending'
      try {
        const result = await $fetch(SMS_API,{method:'POST',body:{mobile:c.mobile,sms},retry:0})
        smsResults.value[c.mobile] = result === true ? 'success' : 'failed'
      } catch(e) { smsResults.value[c.mobile] = 'failed' }
    }
  } finally {
    smsSending.value = false; smsFinished.value = true
    const count = smsSuccessCount.value
    notify(count === targets.length ? 'success' : count === 0 ? 'error' : 'warning', `${count} ارسال موفق از ${targets.length} گیرنده`)
  }
}

// نمایش پیام‌ها به صورت Toast، بدون پیام تکراری در صفحه
for (const source of [error, deletePlaceError, smsError]) {
  watch(source, message => notify('error', message), { flush: 'sync' })
}
for (const source of [success, modalSuccess]) {
  watch(source, message => notify('success', message), { flush: 'sync' })
}

</script>

<template>
  <div class="management-page" dir="rtl">
    <div v-if="canManage" class="management-wrap">
      <div class="management-filterbar">
        <div class="top-filters">
          <div class="filter-component search-component"><UiBaseInput class="!mb-0" v-model="search" placeholder="جستجو..." icon='<i class="bi bi-search"></i>' /></div>
          <div class="filter-component"><UiBaseAutocomplete v-model="provinceFilter" :items="provinces" placeholder="استان" clearable icon='<i class="bi bi-geo-alt"></i>' iconPosition="right" /></div>
          <div class="filter-component"><UiBaseAutocomplete v-model="cityFilter" :items="cities" placeholder="شهر" clearable icon='<i class="bi bi-buildings"></i>' iconPosition="right" /></div>
          <div class="filter-component"><UiBaseAutocomplete v-model="holderFilter" :items="holders" placeholder="کلیددار" clearable icon='<i class="bi bi-key"></i>' iconPosition="right" /></div>
          <div class="filter-component status-component"><UiBaseAutocomplete v-model="statusFilter" :items="statusOptions" placeholder="وضعیت" clearable icon='<i class="bi bi-sliders"></i>' iconPosition="right" /></div>
        </div>
      </div>
      <div class="toolbar">
        <div class="toolbar-buttons">
          <button class="outline-button" type="button" @click="openSmsModal"><i class="bi bi-envelope" aria-hidden="true"></i> ارسال پیامک</button>
          <button class="filled-button" type="button" :disabled="exportingPdf" @click="downloadPdf"><i class="bi bi-file-earmark-pdf" aria-hidden="true"></i> {{ exportingPdf ? 'در حال ساخت PDF...' : 'دانلود PDF' }}</button>
          <button class="outline-button" type="button" :disabled="exportingExcel" @click="downloadExcel"><i class="bi bi-file-earmark-excel" aria-hidden="true"></i> {{ exportingExcel ? 'در حال دریافت اکسل...' : 'دانلود Excel' }}</button>
          <UiBaseButton v-if="isAdmin" class="create-package-btn" label="ایجاد پکیج" variant="filled" color="primary" icon='<i class="bi bi-plus-lg"></i>' @click="openCreateModal" />
          <button class="outline-button" type="button" @click="search='';provinceFilter='';cityFilter='';holderFilter='';statusFilter='' "><i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i> پاک کردن فیلتر</button>
        </div>
        <span class="results-count">{{ filtered.length }} مهمانسرا</span>
      </div>


      <div class="table-scroll">
        <table class="places-table">
          <thead><tr><th>ردیف</th><th>نام</th><th>استان</th><th>شهر</th><th>کلیددار</th><th>موبایل</th><th>عملیات</th></tr></thead>
          <tbody v-if="loading"><tr><td colspan="7" class="empty">در حال دریافت اطلاعات...</td></tr></tbody>
          <tbody v-else-if="!filtered.length"><tr><td colspan="7" class="empty">مهمانسرایی یافت نشد.</td></tr></tbody>
          <tbody v-else>
            <template v-for="(place,index) in filtered" :key="place._id || index">
              <tr class="place-row" :class="{ opened: expandedId === place._id }">
                <td data-label="ردیف">{{ index + 1 }}</td><td data-label="نام" class="place-name">{{ place.name }}</td><td data-label="استان">{{ place.province }}</td><td data-label="شهر">{{ place.city }}</td><td data-label="کلیددار">{{ place.keyHolder || '—' }}</td><td data-label="موبایل" dir="ltr">{{ place.mobile || '—' }}</td>
                <td data-label="عملیات" class="actions-cell"><div class="row-actions">
                  <button v-if="isAdmin" title="ویرایش" class="action" :disabled="editLoadingId !== null" :aria-busy="editLoadingId === (place._id ?? place.id)" @click="openEditModal(place)"><i :class="editLoadingId === (place._id ?? place.id) ? 'bi bi-arrow-repeat edit-spinner' : 'bi bi-pencil-square'" aria-hidden="true"></i></button>
                  <button v-if="isAdmin" title="حذف" class="action danger" type="button" :disabled="deletingPlace || editLoadingId !== null" @click="openPlaceDelete(place)"><i class="bi bi-trash" aria-hidden="true"></i></button>
                  
                  <button type="button" title="دانلود تصاویر ZIP" aria-label="دانلود تصاویر ZIP" class="action" :disabled="downloadingImagesId !== null" :aria-busy="downloadingImagesId === (place._id ?? place.id)" @click="downloadPlaceImages(place)"><i :class="downloadingImagesId === (place._id ?? place.id) ? 'bi bi-arrow-repeat edit-spinner' : 'bi bi-download'" aria-hidden="true"></i></button>
                  <span class="action-divider"></span>
                  <button class="expand-button" :aria-expanded="expandedId===place._id" :title="expandedId===place._id?'بستن جزئیات':'نمایش جزئیات'" @click="expandedId=expandedId===place._id?null:place._id"><i :class="expandedId === place._id ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" aria-hidden="true"></i></button>
                </div></td>
              </tr>
              <tr v-if="expandedId===place._id" class="detail-row"><td colspan="7">
                <div class="details-card">
                  <aside class="details-side">
                    <section class="detail-section"><div class="detail-heading"><span class="tile-icon"><i class="bi bi-geo-alt" aria-hidden="true"></i></span><h3>آدرس</h3></div><p>{{ place.address || 'آدرس ثبت نشده است.' }}</p></section>
                    <section v-if="place.hospitals?.length" class="detail-section"><div class="detail-heading"><span class="tile-icon"><i class="bi bi-hospital" aria-hidden="true"></i></span><h3>مراکز درمانی اطراف</h3></div><p v-for="(v,i) in place.hospitals" :key="i">{{ stripHtml(v) }}</p></section>
                    <section v-if="place.touristPlaces?.length" class="detail-section"><div class="detail-heading"><span class="tile-icon"><i class="bi bi-bank" aria-hidden="true"></i></span><h3>مراکز توریستی اطراف</h3></div><p v-for="(v,i) in place.touristPlaces" :key="i">{{ stripHtml(v) }}</p></section>
                    <section v-if="place.importantPlaces?.length" class="detail-section"><div class="detail-heading"><span class="tile-icon"><i class="bi bi-bag" aria-hidden="true"></i></span><h3>مراکز ضروری اطراف</h3></div><p v-for="(v,i) in place.importantPlaces" :key="i">{{ stripHtml(v) }}</p></section>
                  </aside>
                  <div class="details-grid"><div v-for="item in detailItems(place)" :key="item.label" class="detail-item"><span class="tile-icon"><i :class="`bi bi-${item.icon}`" aria-hidden="true"></i></span><div><span class="detail-label">{{ item.label }}</span><strong>{{ item.value }}</strong></div></div></div>
                </div>
              </td></tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="modalOpen && isAdmin" class="modal-backdrop" @click.self="closeModal">
      <div class="modal" role="dialog" aria-modal="true" aria-label="فرم مهمانسرا">
        <header class="modal-head"><h2>{{ createdInSession ? 'تکمیل اطلاعات پکیج' : editingId ? 'ویرایش مهمانسرا' : 'ایجاد پکیج جدید' }}</h2><button class="close-btn" @click="closeModal">×</button></header>
        <nav class="tabs"><button v-for="(tab,index) in tabs" :key="tab.id" :class="{active:activeTab===tab.id}" :disabled="saving || (!packageCreated && index > 0)" @click="goToStep(index)">{{ index + 1 }}. {{ tab.label }}</button></nav>
        <div class="modal-body">


          <div v-if="activeTab==='main'" class="form-grid">
  <UiBaseInput
    v-model="form.name"
    label="نام مهمانسرا *"
    placeholder="نام مهمانسرا"
  />

  <UiBaseAutocomplete
    v-model="form.province"
    label="نام استان *"
    :items="provinces"
    placeholder="انتخاب استان"
    clearable
    @update:modelValue="form.city = ''"
  />

  <UiBaseAutocomplete
    v-model="form.city"
    label="نام شهر *"
    :items="formCities"
    placeholder="انتخاب شهر"
    clearable
  />

  <UiBaseInput
    v-model="form.keyHolder"
    label="نام کلیددار"
    placeholder="نام کلیددار"
  />

  <UiBaseInput
    v-model="form.mobile"
    label="شماره موبایل"
    placeholder="شماره موبایل"
  />

  <UiBaseAutocomplete
    v-model="form.status"
    label="وضعیت"
    :items="statusOptions"
    placeholder="انتخاب وضعیت"
    clearable
    icon='<i class="bi bi-sliders"></i>'
    iconPosition="right"
  />

  <label class="field full">
    <span>آدرس</span>
    <textarea v-model="form.address" rows="4" />
  </label>
</div>
          <div v-else-if="activeTab==='details'" class="form-grid">
            <UiBaseInput
              v-for="item in [{key:'standardCapacity',label:'ظرفیت استاندارد'},{key:'maxCapacity',label:'حداکثر ظرفیت'},{key:'meterage',label:'متراژ واحد'},{key:'roomsNumber',label:'تعداد اتاق'},{key:'bedNumber',label:'تعداد تخت'},{key:'floor',label:'طبقه'},{key:'stairs',label:'تعداد پله'}]"
              :key="item.key" v-model="form[item.key]" :label="item.label" type="number" inputmode="numeric" min="0" step="1" placeholder="عدد وارد کنید" />
            <div class="field full"><span>امکانات واحد</span><div class="check-row">
              <UiBaseCheckbox v-model="form.lift" label="آسانسور" />
              <UiBaseCheckbox v-model="form.parking" label="پارکینگ" />
              <UiBaseCheckbox v-model="form.pilgrimage" label="شهر زیارتی" />
            </div></div>
            <UiBaseInput :disabled="!form.parking" v-model="form.parkingCapacity" label="ظرفیت پارکینگ" type="number" inputmode="numeric" min="0" step="1" placeholder="ظرفیت پارکینگ (عدد)" />
            <UiBaseInput v-if="form.pilgrimage" v-model="form.during" label="فاصله تا حرم" placeholder="مثلاً 1200 متر" />
            <div class="field full"><span>نوع سرویس بهداشتی</span><div class="check-row">
              <UiBaseCheckbox v-for="v in ['ایرانی','فرنگی']" :key="v" :label="v" :model-value="form.toilet.includes(v)" @update:modelValue="checked => setArrayValue('toilet',v,checked)" />
            </div></div>
            <div class="field full"><span>سیستم سرمایشی (انتخاب چند مورد)</span><div class="check-row">
              <UiBaseCheckbox v-for="v in coolerOptions" :key="v" :label="v" :model-value="form.cooler.includes(v)" @update:modelValue="checked => setArrayValue('cooler',v,checked)" />
            </div></div>
            <div class="field full"><span>سیستم گرمایشی (انتخاب چند مورد)</span><div class="check-row">
              <UiBaseCheckbox v-for="v in warmerOptions" :key="v" :label="v" :model-value="form.warmer.includes(v)" @update:modelValue="checked => setArrayValue('warmer',v,checked)" />
            </div></div>
          </div>
          <div v-else-if="activeTab==='images'" class="image-panel">
            <div class="image-upload-row">
              <label class="image-field"><span>انتخاب تصویر</span><input ref="imageInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif" :disabled="saving || imageReading" @change="selectImage" /></label>
              <label class="image-field"><span>توضیحات</span><input v-model="imageDraft.description" type="text" placeholder="توضیحات تصویر" :disabled="saving" /></label>
              <button type="button" class="image-add" :disabled="!imageDraft.image || saving || imageReading" @click="addImage">{{ saving ? 'در حال ذخیره...' : 'افزودن' }}</button>
            </div>
            <img v-if="imageDraft.image" :src="imageDraft.image" class="image-preview" alt="پیش‌نمایش تصویر" />
            <p class="center-hint">با افزودن یا حذف تصویر، اطلاعات فعلی فرم نیز به سرور ارسال می‌شود.</p>
            <div class="image-gallery">
              <article v-for="(item,index) in form.images" :key="index" class="image-card">
                <img :src="item.image" :alt="item.description || 'تصویر مهمانسرا'" />
                <button type="button" class="image-delete" :disabled="saving || imageReading" title="حذف تصویر" @click="removeImage(index)">×</button>
                <div class="image-caption"><span>{{ item.description || 'بدون توضیحات' }}</span><button type="button" :disabled="saving || imageReading" title="ویرایش توضیحات" @click="editImageDescription(index)"><i class="bi bi-pencil-square"></i></button></div>
              </article>
            </div>
          </div>
          <div v-else class="html-list"><label class="field"><span>{{ tabs.find(t=>t.id===activeTab)?.label }}</span><textarea v-model="newText[activeTab]" rows="8" placeholder="هر مرکز را در یک خط وارد کنید" /></label><p class="center-hint">هر مرکز را در یک خط بنویسید. متن هنگام ذخیره ثبت می‌شود و قابل ویرایش است.</p></div>
        </div>
        <footer class="modal-footer"><div class="footer-buttons"><UiBaseButton label="انصراف" variant="outline" color="primary" @click="closeModal" /><UiBaseButton v-if="tabIndex > 0" label="مرحله قبل" variant="outline" color="primary" @click="previousStep" /><UiBaseButton v-if="!packageCreated" label="ایجاد پکیج" variant="filled" color="primary" :loading="saving" :disabled="saving || creationUnconfirmed" @click="createPlace" /><UiBaseButton v-if="packageCreated && tabIndex < tabs.length - 1" :disabled="saving" label="مرحله بعد" variant="filled" color="primary" @click="nextStep" /><UiBaseButton v-if="packageCreated && (!createdInSession || tabIndex === tabs.length - 1)" :label="createdInSession ? 'ذخیره اطلاعات' : 'ذخیره تغییرات'" variant="filled" color="primary" :loading="saving" :disabled="saving" @click="savePlace" /></div></footer>
      </div>

    </div>
    <div v-if="smsOpen && canManage" class="modal-backdrop sms-backdrop" @keydown.esc.stop="closeSmsModal">
      <section class="modal sms-modal" role="dialog" aria-modal="true" aria-labelledby="sms-title">
        <header class="modal-head"><h2 id="sms-title">ارسال پیامک به کلیدداران</h2><button class="close-btn" :disabled="smsSending || smsLoading" @click="closeSmsModal">×</button></header>
        <div class="modal-body">
          <p v-if="smsLoading">در حال دریافت کلیدداران...</p>
          <div v-else class="sms-grid">
            <label class="field"><span>متن پیام *</span><textarea v-model="smsText" rows="8" placeholder="متن پیامک را وارد کنید" :disabled="smsSending || smsFinished" /></label>
            <div class="sms-recipients">
              <UiBaseMultiSelect v-model="smsProvince" :items="smsProvinces" label="انتخاب استان‌ها" placeholder="جستجوی استان..." :disabled="smsSending || smsFinished" />
              <UiBaseMultiSelect v-if="!smsSending && !smsFinished" v-model="smsSelected" :items="smsHolderOptions" label="انتخاب کلیدداران" placeholder="جستجوی کلیددار..." select-all :disabled="smsLoading" />
              <div v-if="smsSending || smsFinished" class="sms-list">
                <div v-for="c in smsTargets" :key="c.mobile" class="sms-person">
                  <span>{{ c.name }}<small dir="ltr">{{ c.mobile }}</small></span>
                  <i v-if="smsResults[c.mobile]==='success'" class="bi bi-check-circle-fill sms-ok" title="ارسال موفق" aria-label="ارسال موفق"></i>
                  <i v-else-if="smsResults[c.mobile]==='failed'" class="bi bi-x-circle-fill sms-fail" title="ارسال ناموفق" aria-label="ارسال ناموفق"></i>
                  <small v-else-if="smsResults[c.mobile]==='sending'">در حال ارسال</small><small v-else>در صف</small>
                </div>
              </div>
              <div v-if="!smsSending && !smsFinished" class="sms-tools">
                <button type="button" class="outline-button" :disabled="!smsContacts.length" @click="selectAllSms">ارسال به همه کلیدداران</button>
              </div>
              <small>{{ smsSelected.length }} گیرنده انتخاب شده</small>
            </div>
          </div>

          <p v-if="smsFinished" class="notice" aria-live="polite">{{ smsSuccessCount }} ارسال موفق از {{ smsTargets.length }} گیرنده</p>
        </div>
        <footer class="modal-footer"><div class="footer-buttons"><UiBaseButton label="پاک کردن" variant="outline" color="primary" :disabled="smsSending || smsLoading" @click="clearSms" /><UiBaseButton :label="smsFinished ? 'بستن' : 'انصراف'" variant="outline" color="primary" :disabled="smsSending || smsLoading" @click="closeSmsModal" /><UiBaseButton v-if="!smsFinished" :label="smsSending ? 'در حال ارسال...' : `ارسال به ${smsSelected.length} نفر`" variant="filled" color="primary" :loading="smsSending" :disabled="smsSending || smsLoading || !smsSelected.length || !smsText.trim()" @click="sendSms" /></div></footer>
      </section>
    </div>
    <div v-if="deletePlaceTarget && isAdmin" class="image-confirm-backdrop" @click.self="cancelPlaceDelete" @keydown.esc.stop="cancelPlaceDelete">
      <section class="image-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="place-delete-title">
        <div class="image-confirm-icon"><i class="bi bi-trash" aria-hidden="true"></i></div>
        <h2 id="place-delete-title">حذف مهمانسرا</h2>
        <p>آیا از حذف مهمانسرای «{{ deletePlaceTarget.name }}» اطمینان دارید؟</p>
        <!-- <small>این عملیات قابل بازگشت نیست.</small> -->

        <div class="image-confirm-actions">
          <button type="button" class="image-confirm-delete" :disabled="deletingPlace" @click="confirmPlaceDelete">{{ deletingPlace ? 'در حال حذف...' : 'بله، حذف شود' }}</button>
          <button type="button" class="image-confirm-cancel" :disabled="deletingPlace" @click="cancelPlaceDelete">انصراف</button>
        </div>
      </section>
    </div>
    <div v-if="modalOpen && deleteImageIndex !== null" class="image-confirm-backdrop" @click.self="cancelImageDelete" @keydown.esc.stop="cancelImageDelete">
      <section class="image-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="image-confirm-title">
        <div class="image-confirm-icon"><i class="bi bi-trash" aria-hidden="true"></i></div>
        <h2 id="image-confirm-title">حذف تصویر</h2>
        <p>آیا از حذف این تصویر اطمینان دارید؟</p>

        <div class="image-confirm-actions">
          <button type="button" class="image-confirm-delete" :disabled="saving" @click="confirmImageDelete">{{ saving ? 'در حال حذف...' : 'بله، حذف شود' }}</button>
          <button type="button" class="image-confirm-cancel" :disabled="saving" @click="cancelImageDelete">انصراف</button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.management-page{--primary:var(--color-primary-dark);color:var(--color-primary-dark);background:#F8F8FA;min-height:100vh;padding:0 32px 60px;font-family:inherit}.management-wrap{max-width:1800px;margin:auto}.management-filterbar{display:flex;align-items:center;justify-content:space-between;gap:25px;padding-bottom:26px;border-bottom:1px solid #e8e9f1}.top-filters{display:flex;align-items:center;gap:17px;flex-wrap:wrap}.filter-control{height:58px;min-width:145px;display:flex;align-items:center;gap:10px;border:1px solid #dedfe9;border-radius:15px;background:#fff;padding:0 16px;color:var(--primary);box-shadow:0 1px 3px var(--color-primary-dark)08}.filter-control select,.filter-control input{font-family:inherit;font-size:15px;font-weight:700;color:var(--color-primary-dark);border:0;outline:0;background:transparent;min-width:0;flex:1;width:100%;appearance:none}.filter-control input::placeholder{color:#9698a5}.filter-control:focus-within{border-color:var(--color-primary-dark)}.search-control{min-width:200px}.toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:30px 0 24px;flex-wrap:wrap}.toolbar-buttons{display:flex;flex-wrap:wrap;gap:12px}.outline-button,.filled-button{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:44px;padding:8px 19px;border-radius:25px;font:inherit;font-size:14px;font-weight:800;cursor:pointer}.outline-button{color:var(--primary);background:white;border:1px solid var(--primary)}.filled-button{color:white;background:var(--color-primary-dark);border:1px solid var(--color-primary-dark)}.results-count{color:#8587a1;font-size:13px}.table-scroll{overflow-x:auto}.places-table{width:100%;min-width:1000px;border-collapse:separate;border-spacing:0 10px;text-align:center}.places-table th{background:color-mix(in srgb,var(--color-primary-dark) 5%,white);padding:16px 12px;font-size:15px;font-weight:800;color:var(--color-primary-dark)}.places-table th:first-child{border-radius:0 14px 14px 0}.places-table th:last-child{border-radius:14px 0 0 14px}.place-row td{background:color-mix(in srgb,var(--color-primary-dark) 6%,white);padding:15px 12px;font-size:15px;font-weight:650;white-space:nowrap}.place-row td:first-child{border-radius:0 16px 16px 0}.place-row td:last-child{border-radius:16px 0 0 16px}.place-row.opened td{background:color-mix(in srgb,var(--color-primary-dark) 9%,white)}.place-name{font-weight:850!important}.row-actions{display:flex;align-items:center;justify-content:center;gap:16px;direction:rtl}.action{border:0;background:transparent;color:var(--color-primary-dark);display:grid;place-items:center;padding:5px;cursor:pointer}.action.danger{color:#dc2929}.action-divider{height:30px;width:1px;background:color-mix(in srgb,var(--color-primary-dark) 16%,white)}.expand-button{width:49px;height:49px;display:grid;place-items:center;border:0;border-radius:15px;background:color-mix(in srgb,var(--color-primary-dark) 14%,white);color:var(--color-primary-dark);cursor:pointer}.detail-row>td{padding:6px 0 20px}.details-card{display:grid;grid-template-columns:minmax(300px,1fr) minmax(0,2fr);gap:38px;border:1px solid #e9e9f1;box-shadow:0 4px 12px #18186b09;border-radius:24px;padding:30px 34px;text-align:right}.details-side{padding-left:28px;border-left:1px solid #ededf4}.detail-section+.detail-section{border-top:1px solid #ececf1;margin-top:25px;padding-top:25px}.detail-heading{display:flex;align-items:center;gap:13px;margin-bottom:10px}.detail-heading h3{font-size:20px;color:var(--color-primary-dark);margin:0;font-weight:850}.detail-section p{font-size:14px;line-height:2.1;color:#33354b;margin:4px 0}.tile-icon{display:grid;place-items:center;width:52px;height:52px;flex-shrink:0;border-radius:13px;background:color-mix(in srgb,var(--color-primary-dark) 5%,white);color:var(--color-primary-dark)}.details-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-content:start}.detail-item{display:flex;align-items:center;gap:14px;min-height:104px;border-bottom:1px solid #eeeef3;padding:14px 12px}.detail-item:nth-last-child(-n+3){border-bottom:0}.detail-item>div{display:flex;flex-direction:column;gap:7px;min-width:0}.detail-label{font-size:13px;color:#42445f;font-weight:750}.detail-item strong{font-size:14px;color:#151638;font-weight:850;white-space:normal}.empty{text-align:center;padding:42px;color:#7a7d96}.notice{padding:12px 16px;border-radius:10px;font-size:13px;margin:10px 0}.notice.error{background:#fff0f0;color:#b02727}.notice.success{background:#eaf9ef;color:#25653d}
.primary-btn,.secondary-btn{border-radius:11px;padding:12px 20px;font:inherit;font-size:13px;font-weight:750;cursor:pointer;white-space:nowrap}.primary-btn{background:var(--primary);border:1px solid var(--primary);color:#fff}.primary-btn:disabled{opacity:.55;cursor:wait}.secondary-btn{background:#fff;color:var(--primary);border:1px solid #d7d9e7}.field{display:flex;flex-direction:column;gap:8px;font-size:12px;font-weight:700;color:#686d86}.field input,.field select,.field textarea{width:100%;border:1px solid #e0e2ec;border-radius:10px;background:#fff;padding:12px 13px;font:inherit;font-size:14px;color:#252b52;outline:none;box-sizing:border-box}.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--primary)}.modal-backdrop{position:fixed;inset:0;z-index:1000;background:rgba(16,19,55,.58);display:flex;align-items:center;justify-content:center;padding:20px}.modal{background:#fff;width:min(1100px,100%);max-height:92vh;display:flex;flex-direction:column;border-radius:20px;overflow:hidden;box-shadow:0 20px 70px #0003}.modal-head,.modal-footer,.footer-buttons{display:flex;align-items:center}.modal-head{justify-content:space-between;padding:18px 24px}.modal-head h2{font-size:18px;margin:0}.close-btn{background:transparent;border:0;font-size:28px;cursor:pointer;color:#6b7085}.tabs{display:flex;gap:4px;overflow-x:auto;background:color-mix(in srgb,var(--color-primary-dark) 5%,white);padding:0 14px;flex-shrink:0}.tabs button{border:0;border-bottom:3px solid transparent;background:transparent;color:#393047;padding:16px 15px;font:inherit;font-size:13px;cursor:pointer;white-space:nowrap}.tabs button.active{color:var(--primary);border-bottom-color:var(--primary);font-weight:850}.modal-body{padding:27px;overflow-y:auto;min-height:180px}.form-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:23px}.form-grid .full{grid-column:1/-1}.check-row{display:flex;flex-wrap:wrap;gap:20px}.check-row label{display:flex;align-items:center;gap:7px}.check-row input{width:auto}.modal-footer{justify-content:space-between;gap:15px;border-top:1px solid #eee;padding:17px 24px}.footer-buttons{gap:10px;margin-right:auto}.form-error{color:#b32929;font-size:12px}.info-note{padding:24px;border-radius:12px;background:#f6f6fc;line-height:2;color:#676b84}.html-list{display:flex;flex-direction:column;align-items:flex-start;gap:15px}.html-list .field{width:100%}.list-entry{display:flex;justify-content:space-between;align-items:center;width:100%;border:1px solid #eee;border-radius:10px;padding:12px;box-sizing:border-box;gap:15px}.list-entry button{border:0;background:#fff1f1;color:#ad2222;border-radius:8px;padding:8px;cursor:pointer}
@media(max-width:1400px){.management-filterbar{align-items:flex-start;flex-direction:column}.top-filters{width:100%}.filter-control{flex:1}.details-card{gap:18px;padding:22px}.details-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:900px){.management-page{padding:18px 14px}.details-card{grid-template-columns:1fr}.details-side{border-left:0;border-bottom:1px solid #ededf4;padding:0 0 20px}.details-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.detail-item:nth-last-child(-n+3){border-bottom:1px solid #eeeef3}.form-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:550px){.top-filters{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.filter-control{min-width:0;height:48px;padding:0 10px}.search-control{grid-column:1/-1}.toolbar-buttons{gap:7px}.outline-button,.filled-button{font-size:12px;padding:7px 12px}.details-grid{grid-template-columns:1fr}.form-grid{grid-template-columns:1fr}.modal-backdrop{padding:8px}.modal-body{padding:17px}.modal-footer{flex-direction:column;align-items:stretch}.footer-buttons{margin-right:0;justify-content:flex-end}}@media print{.top-filters,.toolbar,.row-actions,.modal-backdrop{display:none!important}.management-page{padding:0}.details-card{box-shadow:none}.places-table{min-width:0}.place-row td{font-size:10px}}
</style>
<style scoped>
.bi{display:inline-flex;align-items:center;justify-content:center;font-size:21px;line-height:1;vertical-align:middle}
.tile-icon .bi{font-size:25px}

.filter-control .bi{font-size:21px}
.action .bi{font-size:19px}
</style>

<style scoped>
/* Consistent controls, desktop and mobile */
.management-page{width:100%;max-width:100%;min-width:0;box-sizing:border-box;padding:18px clamp(12px,2.6vw,40px) 48px;background:#F8F8FA;overflow-x:clip}
.management-wrap{width:100%;min-width:0}
.management-filterbar{display:block;padding:0 0 22px}

.top-filters{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));align-items:center;gap:10px;width:100%;min-width:0}
.top-filters .filter-component{width:100%;min-width:0;display:flex;align-items:stretch;margin:0!important}
.top-filters .filter-component>*{width:100%;min-width:0;margin:0!important}
.top-filters :deep(input){box-sizing:border-box;min-width:0;width:100%}
.top-filters :deep(.mb-3),.top-filters :deep(.mb-4),.top-filters :deep(.mb-5),.top-filters :deep(.mb-6){margin-bottom:0!important}
.top-filters .search-component :deep(input){min-height:50px}
.top-filters .filter-component :deep(> *){width:100%;min-width:0}
.top-filters .filter-component :deep(.mb-2){margin-bottom:0!important}
.create-package-btn,.create-package-btn :deep(button){border-radius:999px!important;overflow:hidden}
.table-scroll{width:100%;min-width:0;overflow-x:auto;-webkit-overflow-scrolling:touch}
.details-card{background:white}
.modal-body :deep(.mb-3),.modal-body :deep(.mb-4){margin-bottom:0!important}
@media(max-width:1450px){.top-filters{grid-template-columns:repeat(5,minmax(0,1fr))}}
@media(max-width:1000px){.top-filters{grid-template-columns:repeat(3,minmax(0,1fr))}.details-card{grid-template-columns:1fr}.details-side{border-left:0;border-bottom:1px solid #ededf4;padding:0 0 20px}}
@media(max-width:640px){
 .management-page{padding:14px 12px 35px;overflow-x:hidden}
 .management-filterbar{display:block;padding-bottom:16px}
 .top-filters{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
 .top-filters .search-component{grid-column:1/-1}
 .top-filters .filter-component{min-height:48px}
 .top-filters .filter-component :deep(input){font-size:13px}
 .toolbar{padding:16px 0;gap:10px;align-items:stretch}
 .toolbar-buttons{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;width:100%}
 .toolbar-buttons>*{width:100%;min-width:0;box-sizing:border-box;justify-content:center}
 .toolbar-buttons :deep(button){width:100%;min-height:43px;justify-content:center}
 .outline-button,.filled-button{font-size:12px;padding:8px 6px;min-height:43px}
 .results-count{display:block;width:100%;text-align:right}
 /* Mobile: each guesthouse is a readable card, not a clipped desktop table */
 .table-scroll{overflow:visible}
 .places-table{display:block;min-width:0;width:100%;border-spacing:0}
 .places-table thead{display:none}
 .places-table tbody{display:block}
 .places-table tbody>tr.place-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 12px;background:color-mix(in srgb,var(--color-primary-dark) 6%,white);border-radius:16px;padding:12px 14px;margin:0 0 10px;box-shadow:0 2px 8px #14146408}
 .places-table .place-row td{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;background:transparent!important;border-radius:0!important;padding:9px 0;min-width:0;white-space:normal;text-align:left;font-size:13px;overflow-wrap:anywhere}
 .places-table .place-row td::before{content:attr(data-label);color:#777a9b;font-size:12px;font-weight:600;flex-shrink:0;text-align:right}
 .places-table .place-row td:nth-child(2){grid-column:1/-1;font-weight:800!important;font-size:15px;border-bottom:1px solid color-mix(in srgb,var(--color-primary-dark) 13%,white);text-align:right}
 .places-table .place-row td:nth-child(1){grid-column:1/-1;padding-top:0;justify-content:flex-start}
 .places-table .place-row td:nth-child(6){direction:rtl}
 .places-table .place-row td.actions-cell{grid-column:1/-1;border-top:1px solid color-mix(in srgb,var(--color-primary-dark) 13%,white);padding:10px 0 0;display:flex;align-items:center;justify-content:space-between}
 .places-table .place-row td.actions-cell .row-actions{flex:1;justify-content:flex-end;gap:12px}
 .places-table .detail-row{display:block;margin:-4px 0 16px}
 .places-table .detail-row>td{display:block;padding:0;width:100%}
 .details-card{display:flex;flex-direction:column;gap:16px;border-radius:16px;padding:16px 12px;min-width:0;box-shadow:none}
 .details-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 8px}
 .detail-item{gap:8px;padding:10px 4px;min-height:78px}
 .tile-icon{width:36px;height:36px;border-radius:10px}.tile-icon .bi{font-size:18px}
 .detail-heading h3{font-size:16px}.detail-item strong{font-size:12px}.detail-label{font-size:11px}
 .modal-backdrop{padding:0;align-items:stretch}
 .modal{width:100%;max-height:100dvh;height:100dvh;border-radius:0}
 .modal-head{padding:12px 16px}.modal-body{padding:16px;min-height:0}
 .form-grid{grid-template-columns:1fr;gap:14px}.tabs{padding:0 8px}.tabs button{padding:12px 10px;font-size:12px}
 .modal-footer{padding:12px 16px;gap:8px}.footer-buttons{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0}.footer-buttons>*{min-width:0}
}
@media(max-width:380px){.details-grid{grid-template-columns:1fr}.toolbar-buttons{grid-template-columns:1fr 1fr}.top-filters{gap:7px}.places-table tbody>tr.place-row{padding:10px}}
</style>


<style scoped>
/* Modal responsiveness: desktop, tablet, mobile */
.modal-backdrop{box-sizing:border-box;overflow:hidden;overscroll-behavior:contain}
.modal{box-sizing:border-box;min-width:0;max-width:min(1100px,100%);max-height:min(92dvh,900px);overflow:hidden}
.modal-head{flex:0 0 auto;min-width:0;gap:12px}
.modal-head h2{min-width:0;overflow-wrap:anywhere}
.modal-head .close-btn{flex-shrink:0}
.tabs{flex:0 0 auto;min-width:0;max-width:100%;overflow-x:auto;overflow-y:hidden;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;scrollbar-width:thin}
.tabs button{flex:0 0 auto}
.modal-body{flex:1 1 auto;min-height:0;min-width:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
.form-grid{min-width:0;grid-template-columns:repeat(3,minmax(0,1fr))}
.form-grid>*{min-width:0;max-width:100%;box-sizing:border-box}
.form-grid :deep(input),.form-grid :deep(select),.form-grid :deep(textarea){max-width:100%;min-width:0;box-sizing:border-box}
.form-grid :deep(.mb-3),.form-grid :deep(.mb-4),.form-grid :deep(.mb-5),.form-grid :deep(.mb-6){margin-bottom:0!important}
.modal-footer{flex:0 0 auto;min-width:0;flex-wrap:wrap}
.footer-buttons{min-width:0;display:flex;flex-wrap:wrap;align-items:center}
.footer-buttons>*{min-width:0}
.html-list,.html-list>*{max-width:100%;min-width:0;box-sizing:border-box}
.list-entry{overflow-wrap:anywhere}
@media(max-width:900px){
 .form-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
 .modal{max-height:94dvh}
 .modal-body{padding:20px}
}
@media(max-width:640px){
 .modal-backdrop{padding:0!important;align-items:stretch;justify-content:stretch}
 .modal{width:100%!important;max-width:100%!important;height:100dvh!important;max-height:100dvh!important;border-radius:0!important;box-shadow:none}
 .modal-head{padding:14px 16px!important}
 .modal-head h2{font-size:16px;line-height:1.6}
 .tabs{padding:0 8px;gap:0}
 .tabs button{padding:13px 12px;font-size:12px}
 .modal-body{padding:16px!important;min-height:0;flex:1 1 auto}
 .form-grid{grid-template-columns:minmax(0,1fr)!important;gap:14px!important}
 .form-grid .full{grid-column:1/-1}
 .check-row{gap:12px 18px}
 .modal-footer{padding:12px 16px calc(12px + env(safe-area-inset-bottom))!important;display:flex;flex-direction:column;align-items:stretch;gap:10px;background:#fff}
 .form-error{display:block;max-height:72px;overflow-y:auto;overflow-wrap:anywhere}
 .footer-buttons{width:100%;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0!important}
 .footer-buttons>*{width:100%;min-width:0}
 .footer-buttons :deep(button){width:100%;min-height:44px;justify-content:center}
 .html-list .field{width:100%}
 .list-entry{gap:10px}
}
@media(max-width:360px){
 .modal-head{padding:12px!important}
 .modal-body{padding:12px!important}
 .modal-footer{padding-left:12px!important;padding-right:12px!important}
 .tabs button{padding:12px 9px}
}
</style>

<style scoped>
.modal-message{flex:0 0 auto;margin:0;padding:12px 20px calc(12px + env(safe-area-inset-bottom));background:#fff0f0;color:#a51f28;border-top:1px solid #ffd3d3;font-size:13px;line-height:1.8;overflow-wrap:anywhere;max-height:100px;overflow-y:auto}
.native-check{display:inline-flex;align-items:center;gap:8px;cursor:pointer;color:#272747;font-size:13px;font-weight:650;min-height:36px}
.native-check input[type=checkbox]{width:18px;height:18px;min-width:18px;accent-color:var(--color-primary-dark);cursor:pointer}
.modal-footer .footer-buttons{display:flex;flex-wrap:wrap;gap:10px;width:100%;justify-content:flex-end;margin:0}
@media(max-width:640px){.modal-footer .footer-buttons{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.modal-message{padding:10px 16px calc(10px + env(safe-area-inset-bottom))}}
</style>

<style scoped>
.modal-backdrop{flex-direction:column;gap:10px}
.modal-message{width:min(1100px,100%);box-sizing:border-box;border-radius:12px;border:1px solid #ffd3d3;box-shadow:0 6px 18px #0001}
@media(max-width:640px){.modal-backdrop{gap:0}.modal{flex:1 1 auto;height:auto!important;min-height:0}.modal-message{width:100%;border-radius:0;max-height:100px;flex:0 0 auto}}
</style>

<style scoped>
.modal-body .form-grid > * { min-width:0; }
.modal-body .check-row { display:flex; flex-wrap:wrap; align-items:center; gap:14px 24px; }
.modal-body .check-row > * { flex:0 0 auto; max-width:100%; }
.modal-body :deep(input[type="number"]) { direction:ltr; text-align:right; }
@media(max-width:640px){.modal-body .check-row{gap:12px 18px}.modal-body .form-grid{grid-template-columns:minmax(0,1fr)}}
</style>

<style scoped>
.tabs button:disabled{opacity:.4;cursor:not-allowed}
.management-page{padding-top:8px}
.management-filterbar{position:static;height:auto;min-height:0;padding:0 0 12px}
.top-filters{align-items:start}
.form-grid{align-items:start;align-content:start}
</style>

<style scoped>
.center-hint{font-size:12px;color:#777a91;margin:0;line-height:1.8}.html-list textarea{resize:vertical;min-height:180px}
</style>

<style scoped>
.image-panel{display:grid;gap:16px;min-width:0}.image-upload-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) auto;align-items:center;gap:14px}.image-upload-row input[type=file]{width:100%;max-width:100%;font-size:13px}.image-preview{width:160px;height:110px;object-fit:cover;border-radius:10px}.image-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;border-top:1px solid #eee;padding-top:16px}.image-card{position:relative;border:1px solid #e3e3eb;border-radius:12px;overflow:hidden;min-width:0}.image-card>img{width:100%;height:140px;object-fit:cover;display:block}.image-delete{position:absolute;top:7px;right:7px;background:white;color:#b42318;border:0;border-radius:50%;width:28px;height:28px;cursor:pointer}.image-caption{display:flex;justify-content:space-between;gap:8px;padding:10px;font-size:13px;overflow-wrap:anywhere}.image-caption button{color:#29269c;flex-shrink:0}.image-panel button:disabled{opacity:.5;cursor:not-allowed}@media(max-width:640px){.image-upload-row{grid-template-columns:minmax(0,1fr)}.image-gallery{grid-template-columns:repeat(2,minmax(0,1fr))}}

.image-upload-row{align-items:end;gap:14px}
.image-field{display:flex;flex-direction:column;gap:6px;min-width:0;margin:0;font-size:12px;color:#686d86}
.image-field input,.image-add{height:54px;box-sizing:border-box;margin:0;border-radius:11px;font:inherit;font-size:14px}
.image-field input{width:100%;min-width:0;border:1px solid #dedfe9;background:#fff;padding:0 12px;color:#252b52}
.image-field input[type=file]{padding:9px 10px;line-height:34px}
.image-field input::file-selector-button{height:32px;border:0;border-radius:6px;padding:0 10px;margin-inline-end:8px;cursor:pointer}
.image-add{background:#29269c;color:white;border:0;padding:0 22px;cursor:pointer;white-space:nowrap}
.action:disabled{opacity:.5;cursor:wait}.edit-spinner{animation:edit-spin 1s linear infinite}@keyframes edit-spin{to{transform:rotate(360deg)}}
@media(max-width:640px){.image-add{width:100%}}
</style>

<style scoped>
.image-confirm-backdrop{position:fixed;inset:0;z-index:3000;background:rgba(16,19,55,.48);display:flex;align-items:center;justify-content:center;padding:16px}
.image-confirm-dialog{width:min(380px,100%);background:#fff;border-radius:18px;padding:24px;text-align:center;box-shadow:0 16px 60px #0003;box-sizing:border-box}
.image-confirm-icon{width:56px;height:56px;border-radius:50%;background:#fdecec;color:#dc2626;display:grid;place-items:center;margin:0 auto 14px;font-size:24px}
.image-confirm-dialog h2{font-size:18px;margin:0 0 12px}.image-confirm-dialog p{font-size:14px;margin:8px 0}.image-confirm-dialog small{color:#777;font-size:12px}
.image-confirm-actions{display:flex;gap:10px;margin-top:24px}.image-confirm-actions button{flex:1;border-radius:9px;padding:11px 8px;font:inherit;font-size:13px;cursor:pointer}.image-confirm-delete{background:#dc2626;color:#fff;border:1px solid #dc2626}.image-confirm-cancel{background:#fff;color:#29269c;border:1px solid #d7d9e7}.image-confirm-actions button:disabled{opacity:.55;cursor:wait}
</style>

<style scoped>
.outline-button:disabled{opacity:.55;cursor:wait}
</style>

<style scoped>
@media screen and (min-width:641px){
  .table-scroll{max-height: max(240px, calc(100dvh - 260px));overflow:auto;position:relative}
  .places-table thead th{position:sticky;top:0;z-index:20;background:#f0f0f6;box-shadow:0 -10px 0 #F8F8FA}
}
@media print{.table-scroll{max-height:none!important;overflow:visible!important}.places-table thead th{position:static!important}.image-confirm-backdrop{display:none!important}}
</style>

<style scoped>
.sms-modal{width:min(850px,100%)}.sms-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}.sms-recipients{display:grid;gap:12px;min-width:0}.sms-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px}.sms-tools .outline-button{min-height:32px;padding:4px 10px;font-size:12px}.sms-list{max-height:280px;overflow:auto;border:1px solid #e0e2ec;border-radius:12px;padding:6px 12px}.sms-person{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #eee;font-size:13px}.sms-person:last-child{border:0}.sms-person span{flex:1}.sms-person small{display:block;color:#777}.sms-person span small{text-align:right;margin-top:4px}.sms-person input{accent-color:var(--primary)}.sms-ok{color:#16a34a}.sms-fail{color:#dc2626}.sms-modal button:disabled{opacity:.5;cursor:not-allowed}.sms-grid textarea{resize:vertical;min-height:180px}@media(max-width:640px){.sms-grid{grid-template-columns:1fr;gap:16px}.sms-list{max-height:240px}}@media print{.sms-backdrop{display:none!important}}
</style>
