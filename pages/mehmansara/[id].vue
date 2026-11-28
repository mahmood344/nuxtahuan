<script setup>

import { computed, ref, watch, nextTick } from 'vue'

definePageMeta({ layout: 'menu' })

const route = useRoute()

const id = computed(() => String(route.params.id ?? ''))

const API = 'https://mehmansara.ahuan.ir/api/places'

const { data: response, pending, status, error, refresh } = await useFetch(() => `${API}/${encodeURIComponent(id.value)}`, { method: 'GET', server: false, lazy: true, deep: false })

const place = computed(() => response.value?.data ?? null)

const images = computed(() => Array.isArray(place.value?.images) ? place.value.images.filter(x => typeof x?.image === 'string' && /^data:image\/(jpeg|png|webp|gif);base64,/i.test(x.image)) : [])

const current = ref(0)

const dialog = ref(null)

const zoomed = ref(false)
const galleryOpen = ref(false)

const activeImage = computed(() => images.value[current.value])

const previewImages = computed(() => images.value.slice(0, 5))

async function openGallery(index = 0) {

  if (!images.value.length) return

  current.value = index

  zoomed.value = false

  galleryOpen.value = true
  await nextTick()
  if (galleryOpen.value && dialog.value && !dialog.value.open) {
    dialog.value.showModal()
  }

}

function closeGallery() {
  if (dialog.value?.open) dialog.value.close()
  galleryOpen.value = false
  zoomed.value = false
}

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

      <!-- Skeleton Loading -->
<div
  v-if="pending || status === 'idle'"
  class="skeleton-wrapper"
  role="status"
  aria-live="polite"
  aria-busy="true"
>
  <!-- Loading Header -->
  <div class="loading-header">
    <div class="loading-icon">
      <div class="loading-ring"></div>
      <i class="bi bi-house-door"></i>
    </div>

    <div class="loading-text">
      <h3>در حال آماده‌سازی مهمانسرا</h3>
      <p>در حال دریافت اطلاعات و تصاویر...</p>
    </div>
  </div>

  <!-- Heading Skeleton -->
  <div class="skeleton-heading" aria-hidden="true">
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-subtitle"></div>
  </div>

  <!-- Gallery Skeleton -->
  <div class="skeleton-gallery" aria-hidden="true">
    <div class="skeleton skeleton-main-image"></div>

    <div
      v-for="n in 4"
      :key="n"
      class="skeleton skeleton-small-image"
    ></div>
  </div>

  <!-- Table Skeleton -->
  <div class="skeleton-table" aria-hidden="true">
    <div
      v-for="n in 5"
      :key="n"
      class="skeleton-table-item"
    >
      <div class="skeleton skeleton-table-label"></div>
      <div class="skeleton skeleton-table-value"></div>
    </div>
  </div>

  <!-- Details Skeleton -->
  <div class="skeleton-details" aria-hidden="true">
    <div class="skeleton-sidebar">
      <div class="skeleton skeleton-sidebar-title"></div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line short"></div>
    </div>

    <div class="skeleton-details-grid">
      <div
        v-for="n in 9"
        :key="n"
        class="skeleton-detail-item"
      >
        <div class="skeleton skeleton-detail-icon"></div>

        <div class="skeleton-detail-text">
          <div class="skeleton skeleton-detail-label"></div>
          <div class="skeleton skeleton-detail-value"></div>
        </div>
      </div>
    </div>
  </div>
</div>

      <div v-else-if="error || !place" class="empty-state">دریافت اطلاعات مهمانسرا انجام نشد.<button class="retry" @click="refresh()">تلاش مجدد</button></div>

      <template v-else>

        <header class="heading"><h1>{{ place.name }}</h1><p><i class="bi bi-geo-alt"></i> {{ place.province }} — {{ place.city }}</p></header>

  <section v-if="images.length > 0" class="gallery" aria-label="تصاویر مهمانسرا">

    <div class="gallery-grid" :class="`count-${previewImages.length}`">

      <button v-for="(img,i) in previewImages" :key="img._id || i"

        type="button" class="gallery-tile" :class="{'main-photo': i === 0}"

        :aria-label="`نمایش تصویر ${i+1}`" @click="openGallery(i)">

        <img :src="img.image" :alt="img.description || place.name" :loading="i === 0 ? 'eager' : 'lazy'" decoding="async" />

        <span v-if="i === 4 && images.length > 5" class="more-overlay">+{{ images.length - 5 }} تصویر</span>

      </button>

      <button type="button" class="show-all" @click="openGallery(0)"><i class="bi bi-images"></i> مشاهده همه تصاویر ({{ images.length }})</button>

    </div>

    <dialog ref="dialog" class="lightbox" aria-label="گالری تصاویر مهمانسرا" dir="rtl"

      @close="galleryOpen = false; zoomed = false" @keydown.left.prevent="move(1)" @keydown.right.prevent="move(-1)" @click.self="closeGallery">

      <div v-if="galleryOpen && activeImage" class="lightbox-layout">

        <header class="lightbox-header">

          <span>{{ place.name }}</span>

          <span dir="ltr">{{ current + 1 }} / {{ images.length }}</span>

          <button type="button" aria-label="بستن گالری" @click="closeGallery" autofocus><i class="bi bi-x-lg"></i></button>

        </header>

        <div class="lightbox-stage" @touchstart.passive="touchStart = $event.touches[0].clientX" @touchend.passive="touchEnd">

          <div class="image-scroll" :class="{zoomed}">

            <img :key="current" :src="activeImage.image" :alt="activeImage.description || place.name" decoding="async" />

          </div>

          <button v-if="images.length > 1" type="button" class="lightbox-prev" aria-label="تصویر قبلی" @click="move(-1)"><i class="bi bi-chevron-right"></i></button>

          <button v-if="images.length > 1" type="button" class="lightbox-next" aria-label="تصویر بعدی" @click="move(1)"><i class="bi bi-chevron-left"></i></button>

          <button type="button" class="zoom-button" :aria-label="zoomed ? 'کوچک‌نمایی' : 'بزرگ‌نمایی'" @click="zoomed = !zoomed"><i :class="zoomed ? 'bi bi-zoom-out' : 'bi bi-zoom-in'"></i></button>

        </div>

        <p class="lightbox-caption">{{ activeImage.description || place.name }}</p>

        <div class="lightbox-thumbs" v-if="images.length > 1">

          <button v-for="(img,i) in images" :key="img._id || i" type="button" :class="{selected: current === i}" :aria-label="`تصویر ${i+1}`" :aria-pressed="current === i" @click="current = i; zoomed = false"><img :src="img.image" :alt="img.description || `تصویر ${i+1}`" loading="lazy" decoding="async" /></button>

        </div>

      </div>

    </dialog>
        </section>

        <!-- <h2 class="section-title">اطلاعات مهمانسرا</h2> -->

        <div class="table-scroll"><table class="places-table" aria-label="اطلاعات مهمانسرا"><thead><tr><th>نام مهمانسرا</th><th>استان</th><th>شهر</th><th>کلیددار</th><th>موبایل</th></tr></thead><tbody><tr><td data-label="نام مهمانسرا"><span>{{ place.name }}</span></td><td data-label="استان"><span>{{ place.province }}</span></td><td data-label="شهر"><span>{{ place.city }}</span></td><td data-label="کلیددار"><span>{{ place.keyHolder || '—' }}</span></td><td data-label="موبایل"><span dir="ltr">{{ place.mobile || '—' }}</span></td></tr></tbody></table></div>

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
/* ==============================
   Skeleton Loading
================================ */

.skeleton-wrapper {
  width: 100%;
  animation: skeleton-enter .25s ease;
}

@keyframes skeleton-enter {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Loading Header */

.loading-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  margin-bottom: 26px;
  background: #fff;
  border: 1px solid #e9e9f1;
  border-radius: 20px;
}

.loading-icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 50%;
  background: color-mix(
    in srgb,
    var(--primary) 5%,
    white
  );
  color: var(--primary);
}

.loading-icon i {
  font-size: 25px;
}

.loading-ring {
  position: absolute;
  inset: 0;
  border: 2px solid color-mix(
    in srgb,
    var(--primary) 12%,
    white
  );
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: loading-spin 1s linear infinite;
}

@keyframes loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text h3 {
  margin: 0 0 6px;
  color: var(--primary);
  font-size: 15px;
  font-weight: 850;
}

.loading-text p {
  margin: 0;
  color: #8c96aa;
  font-size: 12px;
  line-height: 1.8;
}

/* Shimmer Animation */

.skeleton {
  position: relative;
  overflow: hidden;
  background: #e8e9f0;
  border-radius: 8px;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, .65),
    transparent
  );
  transform: translateX(-100%);
  animation: skeleton-shimmer 1.7s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* Heading */

.skeleton-heading {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 22px 0;
}

.skeleton-title {
  width: 260px;
  max-width: 75%;
  height: 28px;
}

.skeleton-subtitle {
  width: 160px;
  max-width: 50%;
  height: 13px;
}

/* Gallery */

.skeleton-gallery {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 6px;
  height: clamp(300px, 34vw, 420px);
  overflow: hidden;
  border-radius: 20px;
  margin-bottom: 24px;
}

.skeleton-main-image {
  grid-row: span 2;
}

.skeleton-small-image,
.skeleton-main-image {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

/* Table */

.skeleton-table {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  padding: 20px;
  margin-bottom: 24px;
  background: white;
  border: 1px solid #e9e9f1;
  border-radius: 18px;
}

.skeleton-table-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.skeleton-table-label {
  width: 65%;
  height: 12px;
}

.skeleton-table-value {
  width: 85%;
  height: 16px;
}

/* Details */

.skeleton-details {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(0, 2fr);
  gap: 32px;
  padding: 30px;
  background: white;
  border: 1px solid #e9e9f1;
  border-radius: 24px;
}

.skeleton-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 24px;
  border-left: 1px solid #ededf4;
}

.skeleton-sidebar-title {
  width: 45%;
  height: 22px;
  margin-bottom: 10px;
}

.skeleton-line {
  width: 100%;
  height: 13px;
}

.skeleton-line.short {
  width: 65%;
}

.skeleton-details-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.skeleton-detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 85px;
  padding: 12px;
  border-bottom: 1px solid #eeeef3;
}

.skeleton-detail-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 13px;
}

.skeleton-detail-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-detail-label {
  width: 80%;
  height: 10px;
}

.skeleton-detail-value {
  width: 60%;
  height: 14px;
}

/* Tablet */

@media (max-width: 1000px) {
  .skeleton-details {
    grid-template-columns: 1fr;
    padding: 24px;
    gap: 24px;
  }

  .skeleton-sidebar {
    border-left: 0;
    padding-left: 0;
  }

  .skeleton-details-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Mobile */

@media (max-width: 700px) {
  .loading-header {
    padding: 14px;
    gap: 12px;
    border-radius: 15px;
    margin-bottom: 20px;
  }

  .loading-icon {
    width: 48px;
    height: 48px;
  }

  .loading-icon i {
    font-size: 21px;
  }

  .loading-text h3 {
    font-size: 13px;
  }

  .loading-text p {
    font-size: 11px;
  }

  .skeleton-gallery {
    height: clamp(220px, 65vw, 340px);
    grid-template-columns: 2fr 1fr;
    border-radius: 14px;
  }

  .skeleton-small-image:nth-child(n+4) {
    display: none;
  }

  .skeleton-table {
    padding: 14px 10px;
    gap: 8px;
  }

  .skeleton-table-label {
    width: 85%;
    height: 9px;
  }

  .skeleton-table-value {
    height: 12px;
  }

  .skeleton-details {
    padding: 16px;
    border-radius: 18px;
  }

  .skeleton-detail-item {
    padding: 8px 0;
    min-height: 70px;
    gap: 8px;
  }

  .skeleton-detail-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
  }
}

/* Accessibility */

@media (prefers-reduced-motion: reduce) {
  .skeleton::after,
  .loading-ring,
  .skeleton-wrapper {
    animation: none;
  }
}

/* Compact top spacing */
.mehmansara-page { padding-top: 10px; }
.page-wrap { margin-top: 0; }
.heading { margin: 0 0 16px; }
.skeleton-wrapper { margin-top: 0; padding-top: 0; }
.loading-header { margin-top: 0; margin-bottom: 12px; padding: 12px 16px; }
.skeleton-heading { margin: 12px 0; gap: 8px; }
@media (max-width: 700px) {
  .mehmansara-page { padding-top: 6px; }
  .loading-header { padding: 10px 12px; margin-bottom: 10px; }
  .skeleton-heading { margin: 10px 0; }
  .heading { margin: 0 0 12px; }
}

/* Responsive layout overrides */
.mehmansara-page { box-sizing: border-box; width: 100%; min-width: 0; min-height: 100dvh; }
.page-wrap, .gallery, .gallery-grid, .details-card, .details-side, .details-grid, .skeleton-wrapper, .skeleton-details, .skeleton-details-grid, .table-scroll { min-width: 0; max-width: 100%; box-sizing: border-box; }
.heading h1, .detail-section p, .detail-item strong, .places-table td, .lightbox-caption { overflow-wrap: anywhere; }
.detail-item > div { flex: 1; }
.lightbox { height: 100dvh; }
.lightbox-layout { min-height: 0; padding-bottom: max(16px, env(safe-area-inset-bottom)); }
.lightbox-header > span:first-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lightbox-header > button, .lightbox-header > span:nth-child(2) { flex-shrink: 0; }
.lightbox-caption { max-height: 15dvh; overflow-y: auto; }
@media (max-width: 1000px) {
  .details-card, .skeleton-details { gap: 18px; padding: 20px; }
  .details-side, .skeleton-sidebar { border-left: 0; padding-left: 0; padding-bottom: 16px; border-bottom: 1px solid #ededf4; }
  .detail-item { min-height: 86px; }
}
@media (max-width: 700px) {
  .mehmansara-page { padding: 6px 12px 24px; }
  .heading h1 { font-size: clamp(18px, 4.8vw, 22px); line-height: 1.6; }
  .heading p { font-size: 12px; }
  .gallery { margin-bottom: 14px; }
  .gallery-grid, .skeleton-gallery { height: clamp(180px, 60vw, 340px); gap: 4px; }
  .gallery-grid.count-1 { grid-template-columns: 1fr; grid-template-rows: 1fr; }
  .gallery-grid.count-2 { grid-template-columns: 2fr 1fr; grid-template-rows: 1fr; }
  .gallery-grid.count-4 .gallery-tile:nth-child(4) { grid-column: auto; }
  .show-all { max-width: calc(100% - 18px); white-space: normal; }
  .table-scroll { overflow: visible; margin-bottom: 14px; }
  .places-table { display: block; width: 100%; min-width: 0; border: 1px solid #e9e9f1; border-radius: 16px; background: white; padding: 4px 12px; box-sizing: border-box; }
  .places-table thead { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .places-table tbody, .places-table tr { display: block; width: 100%; }
  .places-table td, .places-table tr > td:first-child, .places-table tr > td:last-child { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr); align-items: center; gap: 10px; padding: 12px 0; border-radius: 0; background: transparent; text-align: start; font-size: 13px; border-bottom: 1px solid #eeeef3; }
  .places-table td:last-child { border-bottom: 0; }
  .places-table td::before { content: attr(data-label); color: #657086; font-size: 12px; font-weight: 600; }
  .places-table td > span { min-width: 0; text-align: end; overflow-wrap: anywhere; font-weight: 700; }
  .details-card, .skeleton-details { padding: 14px; gap: 14px; border-radius: 16px; }
  .details-grid, .skeleton-details-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 10px; }
  .detail-item, .skeleton-detail-item { padding: 10px 0; gap: 8px; min-height: 76px; }
  .tile-icon, .skeleton-detail-icon { width: 36px; height: 36px; border-radius: 10px; }
  .detail-heading h3 { font-size: 16px; }
  .detail-label { font-size: 11px; }
  .detail-item strong { font-size: 12px; }
  .detail-section p { font-size: 13px; }
  .detail-section + .detail-section { margin-top: 16px; padding-top: 16px; }
  .skeleton-table { grid-template-columns: 1fr; padding: 4px 12px; gap: 0; margin-bottom: 14px; }
  .skeleton-table-item { flex-direction: row; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eeeef3; }
  .skeleton-table-item:last-child { border-bottom: 0; }
  .skeleton-table-label { width: 30%; height: 11px; }
  .skeleton-table-value { width: 48%; height: 14px; }
  .lightbox-layout { padding: 10px; padding-bottom: max(10px, env(safe-area-inset-bottom)); }
}
@media (max-width: 360px) {
  .mehmansara-page { padding-inline: 8px; }
  .details-grid, .skeleton-details-grid { grid-template-columns: 1fr; }
  .detail-item { min-height: 64px; }
  .loading-header { gap: 8px; padding: 10px; }
  .loading-text h3 { font-size: 12px; }
}
/* Desktop - Remove extra top spacing */
@media (min-width: 1024px) {
  .mehmansara-page {
    padding-top: 0;
  }

  .page-wrap {
    margin-top: 0;
    padding-top: 0;
  }

  .heading {
    margin-top: -70px;
    margin-bottom: 16px;
  }

  .skeleton-wrapper {
    margin-top: 0;
    padding-top: 0;
  }

  .loading-header {
    margin-top: 0;
  }
}
@media (max-width: 700px) {
  .places-table td[data-label="موبایل"] > span {
    direction: ltr;
    text-align: left;
    justify-self: end;
    width: 100%;
    white-space: nowrap;
  }
}
</style>
