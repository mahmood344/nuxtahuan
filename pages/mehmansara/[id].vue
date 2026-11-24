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
watch(id, () => { current.value = 0 })
watch(images, () => { current.value = 0 })
const activeImage = computed(() => images.value[current.value])
function move(step) { if (images.value.length) current.value = (current.value + step + images.value.length) % images.value.length }
let touchStart = 0
function touchEnd(e) { const delta = e.changedTouches[0].clientX - touchStart; if (Math.abs(delta) > 45) move(delta > 0 ? 1 : -1) }
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
      <NuxtLink to="/mehmansara" class="back"><i class="bi bi-arrow-right"></i> بازگشت به مهمانسراها</NuxtLink>
      <div v-if="pending" class="empty-state">در حال دریافت اطلاعات مهمانسرا...</div>
      <div v-else-if="error || !place" class="empty-state">دریافت اطلاعات مهمانسرا انجام نشد.<button class="retry" @click="refresh()">تلاش مجدد</button></div>
      <template v-else>
        <header class="heading"><h1>{{ place.name }}</h1><p><i class="bi bi-geo-alt"></i> {{ place.province }} — {{ place.city }}</p></header>
        <section class="gallery" aria-label="تصاویر مهمانسرا">
          <template v-if="activeImage">
            <div class="gallery-layout">
              <div class="stage" tabindex="0" @keydown.left.prevent="move(1)" @keydown.right.prevent="move(-1)" @touchstart.passive="touchStart = $event.touches[0].clientX" @touchend.passive="touchEnd">
                <Transition name="photo-fade">
                  <div :key="current" class="photo-layer">
                    <img class="ambient-image" :src="activeImage.image" alt="" aria-hidden="true" />
                    <img class="hero-image" :src="activeImage.image" :alt="activeImage.description || place.name" />
                  </div>
                </Transition>
                <span class="gallery-tag"><i class="bi bi-images"></i> گالری تصاویر</span>
                <template v-if="images.length > 1">
                  <button type="button" class="nav prev" aria-label="تصویر قبلی" @click="move(-1)"><i class="bi bi-chevron-right"></i></button>
                  <button type="button" class="nav next" aria-label="تصویر بعدی" @click="move(1)"><i class="bi bi-chevron-left"></i></button>
                </template>
                <div class="photo-caption"><span>{{ activeImage.description || place.name }}</span><span class="photo-count" dir="ltr">{{ current + 1 }} / {{ images.length }}</span></div>
              </div>
              <div v-if="images.length > 1" class="thumbs">
                <button v-for="(img,i) in images" :key="img._id || i" :class="{selected:current===i}" :aria-label="`تصویر ${i+1}`" :aria-pressed="current===i" @click="current=i">
                  <img :src="img.image" :alt="img.description || `تصویر ${i+1}`" loading="lazy" />
                  <span class="thumb-number">{{ String(i+1).padStart(2,'0') }}</span>
                </button>
              </div>
            </div>
            <div class="gallery-footer"><span><i class="bi bi-camera"></i> {{ images.length }} تصویر از مهمانسرا</span><div class="gallery-progress" role="progressbar" :aria-valuenow="current+1" :aria-valuemin="1" :aria-valuemax="images.length" aria-label="شماره تصویر"><span :style="{width: `${(current+1)/images.length*100}%`}"></span></div><span dir="ltr">{{ String(current+1).padStart(2,'0') }} / {{ String(images.length).padStart(2,'0') }}</span></div>
          </template>
          <div v-else class="empty-state"><i class="bi bi-image"></i> تصویری ثبت نشده است.</div>
        </section>
        <h2 class="section-title">اطلاعات مهمانسرا</h2>
        <div class="table-scroll"><table class="places-table"><thead><tr><th>نام مهمانسرا</th><th>استان</th><th>شهر</th><th>کلیددار</th><th>موبایل</th></tr></thead><tbody><tr><td>{{ place.name }}</td><td>{{ place.province }}</td><td>{{ place.city }}</td><td>{{ place.keyHolder || '—' }}</td><td dir="ltr">{{ place.mobile || '—' }}</td></tr></tbody></table></div>
        <h2 class="section-title">امکانات و اطلاعات تکمیلی</h2>
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
.mehmansara-page{--primary:var(--color-primary-dark,#10135e);min-height:100vh;background:#F8F8FA;color:#202c42;font-family:inherit;padding:30px 16px 65px}.page-wrap{max-width:1440px;margin:auto}.back{display:inline-flex;gap:9px;align-items:center;color:var(--primary);text-decoration:none;font-size:14px;font-weight:700}.heading{margin:22px 0}.heading h1{font-size:26px;color:var(--primary);margin:0 0 8px}.heading p{font-size:14px;color:#657086;margin:0}.gallery{background:white;border:1px solid #e9e9f1;border-radius:24px;padding:12px}.stage{position:relative;overflow:hidden;border-radius:16px;background:#e9eaf0;height:clamp(240px,42vw,520px);touch-action:pan-y}.hero-image{width:100%;height:100%;object-fit:contain;display:block}.nav{position:absolute;top:50%;transform:translateY(-50%);border:0;border-radius:50%;width:46px;height:46px;background:#fffffff0;color:var(--primary);cursor:pointer;font-size:20px;display:grid;place-items:center}.prev{right:16px}.next{left:16px}.photo-caption{position:absolute;bottom:0;inset-inline:0;display:flex;justify-content:space-between;gap:12px;background:linear-gradient(transparent,#000b);padding:30px 18px 14px;color:white;font-size:14px}.thumbs{display:flex;gap:10px;overflow-x:auto;padding:12px 0 0}.thumbs button{flex:0 0 100px;height:72px;border:2px solid transparent;border-radius:10px;overflow:hidden;padding:3px;background:white;cursor:pointer}.thumbs button.selected{border-color:var(--primary)}.thumbs img{width:100%;height:100%;object-fit:cover;border-radius:5px}.section-title{font-size:19px;color:var(--primary);margin:28px 0 10px}.table-scroll{overflow-x:auto}.places-table{width:100%;min-width:650px;border-collapse:separate;border-spacing:0 8px;text-align:center}.places-table th,.places-table td{padding:16px 12px;font-size:14px;background:color-mix(in srgb,var(--primary) 6%,white)}.places-table th{background:color-mix(in srgb,var(--primary) 5%,white);color:var(--primary)}.places-table tr>*:first-child{border-radius:0 14px 14px 0}.places-table tr>*:last-child{border-radius:14px 0 0 14px}.empty-state{background:white;border:1px solid #dce2e9;border-radius:18px;padding:34px;text-align:center;color:#7b879a}.retry{display:block;margin:12px auto 0;border:0;border-radius:9px;padding:9px 18px;background:var(--primary);color:white;cursor:pointer}
.details-card{display:grid;grid-template-columns:minmax(300px,1fr) minmax(0,2fr);gap:38px;border:1px solid #e9e9f1;box-shadow:0 4px 12px #18186b09;border-radius:24px;padding:30px 34px;text-align:right}.details-side{padding-left:28px;border-left:1px solid #ededf4}.detail-section+.detail-section{border-top:1px solid #ececf1;margin-top:25px;padding-top:25px}.detail-heading{display:flex;align-items:center;gap:13px;margin-bottom:10px}.detail-heading h3{font-size:20px;color:var(--primary);margin:0;font-weight:850}.detail-section p{font-size:14px;line-height:2.1;color:#33354b;margin:4px 0}.tile-icon{display:grid;place-items:center;width:52px;height:52px;flex-shrink:0;border-radius:13px;background:color-mix(in srgb,var(--primary) 5%,white);color:var(--primary)}.details-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-content:start}.detail-item{display:flex;align-items:center;gap:14px;min-height:104px;border-bottom:1px solid #eeeef3;padding:14px 12px}.detail-item:nth-last-child(-n+3){border-bottom:0}.detail-item>div{display:flex;flex-direction:column;gap:7px;min-width:0}.detail-label{font-size:13px;color:#42445f;font-weight:750}.detail-item strong{font-size:14px;color:#151638;font-weight:850;white-space:normal}
.details-card{background:white}.detail-item:nth-last-child(-n+3){border-bottom:1px solid #eeeef3}
@media(max-width:1000px){.details-card{grid-template-columns:1fr;gap:20px;padding:24px}.details-side{border-left:0;padding-left:0}.details-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:600px){.mehmansara-page{padding:16px 12px 40px}.heading h1{font-size:20px}.gallery{padding:7px;border-radius:16px}.nav{width:36px;height:36px;font-size:16px}.thumbs button{flex-basis:76px;height:56px}.details-card{padding:16px}.details-grid{grid-template-columns:1fr}.detail-item{min-height:75px;padding:10px 0}.detail-heading h3{font-size:17px}.section-title{font-size:17px}}

/* Modern guesthouse gallery */
.gallery{padding:12px;border-radius:24px;background:#fff;border:1px solid #e7e8ef;box-shadow:0 12px 40px #10135e08}
.gallery-layout{display:flex;gap:12px;min-width:0}.stage{flex:1;min-width:0;height:clamp(320px,40vw,540px);border-radius:18px;background:#202438;isolation:isolate}.photo-layer{position:absolute;inset:0;overflow:hidden}.ambient-image{position:absolute;inset:-25px;width:calc(100% + 50px);height:calc(100% + 50px);object-fit:cover;filter:blur(28px) brightness(.55);opacity:.8}.hero-image{position:relative;object-fit:contain;z-index:1}.gallery-tag{position:absolute;z-index:2;top:18px;right:18px;display:flex;align-items:center;gap:8px;padding:9px 14px;border:1px solid #ffffff40;border-radius:30px;background:#171b2d66;backdrop-filter:blur(12px);color:white;font-size:12px}.nav{z-index:3;width:48px;height:48px;background:#ffffffd9;backdrop-filter:blur(12px);box-shadow:0 4px 18px #0002;transition:background .2s,scale .2s}.nav:hover{background:white;scale:1.08}.photo-caption{z-index:2;align-items:center;padding:45px 22px 18px;background:linear-gradient(transparent,#111827c9);font-weight:600}.photo-count{background:#ffffff24;border:1px solid #ffffff40;padding:5px 12px;border-radius:20px;font-size:12px;white-space:nowrap}.thumbs{flex:0 0 132px;display:flex;flex-direction:column;max-height:clamp(320px,40vw,540px);overflow:auto;padding:0 2px;gap:9px;scrollbar-width:thin}.thumbs button{position:relative;flex:0 0 96px;width:100%;height:96px;border:2px solid transparent;border-radius:13px;padding:3px;opacity:.68;transition:opacity .2s,border-color .2s}.thumbs button:hover,.thumbs button.selected{opacity:1}.thumbs button.selected{border-color:var(--primary)}.thumbs img{border-radius:8px;display:block}.thumb-number{position:absolute;bottom:9px;left:9px;background:#10182799;color:#fff;font-size:10px;padding:3px 7px;border-radius:6px}.gallery-footer{display:flex;align-items:center;gap:18px;padding:16px 8px 5px;color:#68738a;font-size:12px}.gallery-footer>span{white-space:nowrap}.gallery-progress{flex:1;height:3px;background:#e9eaf1;border-radius:8px;overflow:hidden}.gallery-progress span{display:block;height:100%;background:var(--primary);border-radius:8px;transition:width .3s}.photo-fade-enter-active,.photo-fade-leave-active{transition:opacity .32s ease}.photo-fade-enter-from,.photo-fade-leave-to{opacity:0}.photo-fade-enter-active{z-index:1}
@media(max-width:700px){.gallery{padding:7px;border-radius:18px}.gallery-layout{flex-direction:column;gap:8px}.stage{flex:auto;height:clamp(240px,65vw,400px);border-radius:13px}.thumbs{flex:auto;flex-direction:row;max-height:none;padding:0;gap:6px}.thumbs button{flex:0 0 82px;height:62px;width:82px}.nav{width:36px;height:36px;font-size:16px}.prev{right:8px}.next{left:8px}.gallery-tag{top:10px;right:10px;font-size:10px;padding:6px 10px}.photo-caption{padding:32px 12px 10px;font-size:12px}.gallery-footer{gap:9px;padding:10px 4px 4px;font-size:10px}}
@media(prefers-reduced-motion:reduce){.photo-fade-enter-active,.photo-fade-leave-active,.gallery-progress span,.nav{transition:none}}
</style>
