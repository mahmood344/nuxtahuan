<script setup>

import { computed, ref, watch } from 'vue'

definePageMeta({ layout: 'menu' })

const route = useRoute()

const id = computed(() => String(route.params.id ?? ''))

const API = 'https://mehmansara.ahuan.ir/api/places'

const { data: response, pending, error, refresh } = await useFetch(() => `${API}/${encodeURIComponent(id.value)}`, { method: 'GET', server: false })

const place = computed(() => response.value?.data ?? null)

const images = computed(() => Array.isArray(place.value?.images) ? place.value.images.filter(x => typeof x?.image === 'string' && /^data:image\/(jpeg|png|webp|gif);base64,/i.test(x.image)) : [])

const current = ref(0)

const dialog = ref(null)

const zoomed = ref(false)

const activeImage = computed(() => images.value[current.value])

const previewImages = computed(() => images.value.slice(0, 5))

function openGallery(index = 0) {

  if (!images.value.length) return

  current.value = index

  zoomed.value = false

  dialog.value?.showModal()

}

function closeGallery() { dialog.value?.close() }

function move(step) {

  if (!images.value.length) return

  current.value = (current.value + step + images.value.length) % images.value.length

  zoomed.value = false

}

watch(id, () => { closeGallery(); current.value = 0 })

watch(images, () => { closeGallery(); current.value = 0 })

let touchStart = 0

function touchEnd(e) {

  if (zoomed.value) return

  const delta = e.changedTouches[0].clientX - touchStart

  if (Math.abs(delta) > 45) move(delta > 0 ? 1 : -1)

}

useHead({ title: computed(() => place.value?.name || 'جزئیات مهمانسرا') })

function stripHtml(value) { return String(value || '').replace(/<br\s*\/?\s*>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').trim() }

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

</script>

<template>

  <main class="mehmansara-page" dir="rtl">

    <div class="page-wrap">

      <!-- <NuxtLink to="/mehmansara" class="back"><i class="bi bi-arrow-right"></i> بازگشت به مهمانسراها</NuxtLink> -->

      <div v-if="pending" class="empty-state">در حال دریافت اطلاعات مهمانسرا...</div>

      <div v-else-if="error || !place" class="empty-state">دریافت اطلاعات مهمانسرا انجام نشد.<button class="retry" @click="refresh()">تلاش مجدد</button></div>

      <template v-else>

        <header class="heading"><h1>{{ place.name }}</h1><p><i class="bi bi-geo-alt"></i> {{ place.province }} — {{ place.city }}</p></header>

  <section v-if="images.length > 0" class="gallery" aria-label="تصاویر مهمانسرا">

    <div class="gallery-grid" :class="`count-${previewImages.length}`">

      <button v-for="(img,i) in previewImages" :key="img._id || i"

        type="button" class="gallery-tile" :class="{'main-photo': i === 0}"

        :aria-label="`نمایش تصویر ${i+1}`" @click="openGallery(i)">

        <img :src="img.image" :alt="img.description || place.name" :loading="i === 0 ? 'eager' : 'lazy'" />

        <span v-if="i === 4 && images.length > 5" class="more-overlay">+{{ images.length - 5 }} تصویر</span>

      </button>

      <button type="button" class="show-all" @click="openGallery(0)"><i class="bi bi-images"></i> مشاهده همه تصاویر ({{ images.length }})</button>

    </div>

    <dialog ref="dialog" class="lightbox" aria-label="گالری تصاویر مهمانسرا" dir="rtl"

      @keydown.left.prevent="move(1)" @keydown.right.prevent="move(-1)" @click.self="closeGallery">

      <div v-if="activeImage" class="lightbox-layout">

        <header class="lightbox-header">

          <span>{{ place.name }}</span>

          <span dir="ltr">{{ current + 1 }} / {{ images.length }}</span>

          <button type="button" aria-label="بستن گالری" @click="closeGallery" autofocus><i class="bi bi-x-lg"></i></button>

        </header>

        <div class="lightbox-stage" @touchstart.passive="touchStart = $event.touches[0].clientX" @touchend.passive="touchEnd">

          <div class="image-scroll" :class="{zoomed}">

            <img :key="current" :src="activeImage.image" :alt="activeImage.description || place.name" />

          </div>

          <button v-if="images.length > 1" type="button" class="lightbox-prev" aria-label="تصویر قبلی" @click="move(-1)"><i class="bi bi-chevron-right"></i></button>

          <button v-if="images.length > 1" type="button" class="lightbox-next" aria-label="تصویر بعدی" @click="move(1)"><i class="bi bi-chevron-left"></i></button>

          <button type="button" class="zoom-button" :aria-label="zoomed ? 'کوچک‌نمایی' : 'بزرگ‌نمایی'" @click="zoomed = !zoomed"><i :class="zoomed ? 'bi bi-zoom-out' : 'bi bi-zoom-in'"></i></button>

        </div>

        <p class="lightbox-caption">{{ activeImage.description || place.name }}</p>

        <div class="lightbox-thumbs" v-if="images.length > 1">

          <button v-for="(img,i) in images" :key="img._id || i" type="button" :class="{selected: current === i}" :aria-label="`تصویر ${i+1}`" :aria-pressed="current === i" @click="current = i; zoomed = false"><img :src="img.image" :alt="img.description || `تصویر ${i+1}`" loading="lazy" /></button>

        </div>

      </div>

    </dialog>
        </section>

        <!-- <h2 class="section-title">اطلاعات مهمانسرا</h2> -->

        <div class="table-scroll"><table class="places-table"><thead><tr><th>نام مهمانسرا</th><th>استان</th><th>شهر</th><th>کلیددار</th><th>موبایل</th></tr></thead><tbody><tr><td>{{ place.name }}</td><td>{{ place.province }}</td><td>{{ place.city }}</td><td>{{ place.keyHolder || '—' }}</td><td dir="ltr">{{ place.mobile || '—' }}</td></tr></tbody></table></div>

        <!-- <h2 class="section-title">امکانات و اطلاعات تکمیلی</h2> -->

        <div class="details-card">

                  <aside class="details-side">

                    <section class="detail-section"><div class="detail-heading"><span class="tile-icon"><i class="bi bi-geo-alt" aria-hidden="true"></i></span><h3>آدرس</h3></div><p>{{ place.address || 'آدرس ثبت نشده است.' }}</p></section>

                    <section v-if="place.hospitals?.length" class="detail-section"><div class="detail-heading"><span class="tile-icon"><i class="bi bi-hospital" aria-hidden="true"></i></span><h3>مراکز درمانی اطراف</h3></div><p v-for="(v,i) in place.hospitals" :key="i">{{ stripHtml(v) }}</p></section>

                    <section v-if="place.touristPlaces?.length" class="detail-section"><div class="detail-heading"><span class="tile-icon"><i class="bi bi-bank" aria-hidden="true"></i></span><h3>مراکز توریستی اطراف</h3></div><p v-for="(v,i) in place.touristPlaces" :key="i">{{ stripHtml(v) }}</p></section>

                    <section v-if="place.importantPlaces?.length" class="detail-section"><div class="detail-heading"><span class="tile-icon"><i class="bi bi-bag" aria-hidden="true"></i></span><h3>مراکز ضروری اطراف</h3></div><p v-for="(v,i) in place.importantPlaces" :key="i">{{ stripHtml(v) }}</p></section>

                  </aside>

                  <div class="details-grid"><div v-for="item in detailItems(place)" :key="item.label" class="detail-item"><span class="tile-icon"><i :class="`bi bi-${item.icon}`" aria-hidden="true"></i></span><div><span class="detail-label">{{ item.label }}</span><strong>{{ item.value }}</strong></div></div></div>

                </div>

      </template>

    </div>

  </main>

</template>

<style scoped>

.mehmansara-page{--primary:var(--color-primary-dark,#10135e);min-height:100vh;background:#F8F8FA;color:#202c42;font-family:inherit;padding:30px 16px 65px}.page-wrap{max-width:1440px;margin:auto}.back{display:inline-flex;gap:9px;align-items:center;color:var(--primary);text-decoration:none;font-size:14px;font-weight:700}.heading{margin:22px 0}.heading h1{font-size:26px;color:var(--primary);margin:0 0 8px}.heading p{font-size:14px;color:#657086;margin:0}.section-title{font-size:19px;color:var(--primary);margin:28px 0 10px}.table-scroll{overflow-x:auto}.places-table{width:100%;min-width:650px;border-collapse:separate;border-spacing:0 8px;text-align:center}.places-table th,.places-table td{padding:16px 12px;font-size:14px;background:color-mix(in srgb,var(--primary) 6%,white)}.places-table th{background:color-mix(in srgb,var(--primary) 5%,white);color:var(--primary)}.places-table tr>*:first-child{border-radius:0 14px 14px 0}.places-table tr>*:last-child{border-radius:14px 0 0 14px}.empty-state{background:white;border:1px solid #dce2e9;border-radius:18px;padding:34px;text-align:center;color:#7b879a}.retry{display:block;margin:12px auto 0;border:0;border-radius:9px;padding:9px 18px;background:var(--primary);color:white;cursor:pointer}

.details-card{display:grid;grid-template-columns:minmax(300px,1fr) minmax(0,2fr);gap:38px;border:1px solid #e9e9f1;box-shadow:0 4px 12px #18186b09;border-radius:24px;padding:30px 34px;text-align:right}.details-side{padding-left:28px;border-left:1px solid #ededf4}.detail-section+.detail-section{border-top:1px solid #ececf1;margin-top:25px;padding-top:25px}.detail-heading{display:flex;align-items:center;gap:13px;margin-bottom:10px}.detail-heading h3{font-size:20px;color:var(--primary);margin:0;font-weight:850}.detail-section p{font-size:14px;line-height:2.1;color:#33354b;margin:4px 0}.tile-icon{display:grid;place-items:center;width:52px;height:52px;flex-shrink:0;border-radius:13px;background:color-mix(in srgb,var(--primary) 5%,white);color:var(--primary)}.details-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-content:start}.detail-item{display:flex;align-items:center;gap:14px;min-height:104px;border-bottom:1px solid #eeeef3;padding:14px 12px}.detail-item:nth-last-child(-n+3){border-bottom:0}.detail-item>div{display:flex;flex-direction:column;gap:7px;min-width:0}.detail-label{font-size:13px;color:#42445f;font-weight:750}.detail-item strong{font-size:14px;color:#151638;font-weight:850;white-space:normal}

.details-card{background:white}.detail-item:nth-last-child(-n+3){border-bottom:1px solid #eeeef3}

@media(max-width:1000px){.details-card{grid-template-columns:1fr;gap:20px;padding:24px}.details-side{border-left:0;padding-left:0}.details-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}

@media(max-width:600px){.mehmansara-page{padding:16px 12px 40px}.heading h1{font-size:20px}.details-card{padding:16px}.details-grid{grid-template-columns:1fr}.detail-item{min-height:75px;padding:10px 0}.detail-heading h3{font-size:17px}.section-title{font-size:17px}}

.gallery{margin:0 0 20px}

.gallery-grid{position:relative;display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:repeat(2,minmax(0,1fr));gap:6px;height:clamp(300px,34vw,420px);border-radius:20px;overflow:hidden;background:#e9eaf0}

.gallery-tile{position:relative;min-width:0;min-height:0;padding:0;border:0;overflow:hidden;background:#e9eaf0;cursor:zoom-in}

.gallery-tile img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .25s ease}

.gallery-tile:hover img{transform:scale(1.035)}

.main-photo{grid-row:span 2}

.count-1{grid-template-columns:1fr;grid-template-rows:1fr}.count-1 .main-photo{grid-row:auto}

.count-2{grid-template-columns:2fr 1fr;grid-template-rows:1fr}.count-2 .main-photo{grid-row:auto}

.count-3{grid-template-columns:2fr 1fr}.count-4 .gallery-tile:nth-child(4){grid-column:2 / 4}

.more-overlay{position:absolute;inset:0;display:grid;place-items:center;background:#0008;color:white;font-size:18px;font-weight:700}

.show-all{position:absolute;bottom:16px;left:16px;border:1px solid #ddd;border-radius:10px;background:white;color:#10135e;padding:11px 16px;font:inherit;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 3px 14px #0002}

.lightbox{position:fixed;inset:0;width:100%;max-width:none;height:100%;max-height:none;margin:0;padding:0;border:0;background:#11131b;color:white;box-sizing:border-box}

.lightbox::backdrop{background:#11131b}.lightbox-layout{height:100%;display:flex;flex-direction:column;gap:10px;padding:16px;box-sizing:border-box}

.lightbox-header{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:14px}.lightbox button{cursor:pointer;color:white;background:#ffffff20;border:1px solid #ffffff30;border-radius:10px;padding:10px;font:inherit}.lightbox-stage{position:relative;flex:1;min-height:0;overflow:hidden;touch-action:pan-y}.image-scroll{width:100%;height:100%;overflow:auto;display:flex;align-items:center;justify-content:center}.image-scroll img{width:100%;height:100%;object-fit:contain;display:block}.image-scroll.zoomed{display:block}.image-scroll.zoomed img{width:200%;height:200%;max-width:none;max-height:none;object-fit:contain}.lightbox-prev,.lightbox-next,.zoom-button{position:absolute;z-index:2}.lightbox-prev{right:8px;top:50%;transform:translateY(-50%)}.lightbox-next{left:8px;top:50%;transform:translateY(-50%)}.zoom-button{left:8px;bottom:8px}.lightbox-caption{text-align:center;margin:0;font-size:14px}.lightbox-thumbs{display:flex;gap:8px;overflow-x:auto;flex-shrink:0}.lightbox-thumbs button{flex:0 0 82px;height:60px;padding:2px;overflow:hidden}.lightbox-thumbs button.selected{border:2px solid white}.lightbox-thumbs img{width:100%;height:100%;object-fit:cover;border-radius:6px}

@media(max-width:700px){.gallery-grid{height:clamp(220px,65vw,340px);grid-template-columns:2fr 1fr;grid-template-rows:repeat(2,minmax(0,1fr));border-radius:14px}.gallery-tile:nth-child(n+4){display:none}.count-1{grid-template-columns:1fr;grid-template-rows:1fr}.count-2{grid-template-rows:1fr}.show-all{bottom:9px;left:9px;padding:8px 10px;font-size:11px}.lightbox-layout{padding:10px}.lightbox-thumbs button{flex-basis:65px;height:48px}}

@media(prefers-reduced-motion:reduce){.gallery-tile img{transition:none}}

</style>
