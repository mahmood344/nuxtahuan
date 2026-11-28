

<script setup>

import { useMehmansaraStore } from '~/stores/mehmansara'

definePageMeta({ layout: 'menu' })

const store = useMehmansaraStore()

const role = useCookie('role')

const userRole = computed(() => String(role.value ?? '').trim().toLowerCase())

const canViewManagement = computed(() => ['admin', 'operator'].includes(userRole.value))

const selectedProvince = ref('اصفهان')

const search = ref('')

const showAllProvinces = ref(false)

const normalize = value => String(value ?? '').trim()

  .replace(/ي/g, 'ی')

  .replace(/ك/g, 'ک')

  .replace(/[آأإٱ]/g, 'ا')

  .replace(/[\u064b-\u065f\u0670]/g, '')

  .replace(/[\s\u200c\u200d\u00a0]+/g, '')

  .toLowerCase()

const filteredPlaces = computed(() => {

  const query = normalize(search.value)

  return store.places.filter(place => {

    if (

      selectedProvince.value &&

      normalize(place.province) !== normalize(selectedProvince.value)

    ) return false

    if (!query) return true

    return [

      place.name,

      place.city,

      place.province,

      place.address

    ].some(value => normalize(value).includes(query))

  })

})

const selectProvince = province => {

  selectedProvince.value =

    selectedProvince.value === province ? '' : province

  showAllProvinces.value = false

}



await useAsyncData('mehmansara-places', async () => {

  if (!canViewManagement.value) await store.loadPlaces()

  return true

})

useHead({ title: 'مهمانسراهای بانک تجارت' })

</script>

<template>

  <div dir="rtl" :class="{ 'management-root': canViewManagement }">

    <MehmansaraManagementPanel v-if="canViewManagement" />

    <div v-else class="mehmansara-page">

    <div class="page-wrap">

      <!-- جستجو -->

      <header class="page-heading">

        <label class="search-box">

          <svg

            viewBox="0 0 24 24"

            fill="none"

            stroke="currentColor"

            stroke-width="1.8"

            aria-hidden="true"

          >

            <circle cx="11" cy="11" r="7" />

            <path d="m16 16 5 5" />

          </svg>

          <input

            v-model="search"

            type="search"

            placeholder="جستجوی نام مهمانسرا یا شهر..."

            aria-label="جستجوی مهمانسرا"

          />

        </label>

      </header>

      <!-- انتخاب استان -->

      <section class="province-section" aria-label="انتخاب استان">

        <div

          class="province-grid"

          :class="{ expanded: showAllProvinces }"

        >

          <button

            v-for="province in store.allCities"

            :key="province.text"

            class="province-item"

            :class="{ active: selectedProvince === province.text }"

            type="button"

            :aria-pressed="selectedProvince === province.text"

            @click="selectProvince(province.text)"

          >

            <span class="province-icon">

              <img

                :src="province.image"

                :alt="province.text"

                loading="lazy"

              />

            </span>

            <span class="province-name">

              {{ province.text }}

            </span>

          </button>

        </div>

        <div class="province-actions">

          <!-- <button

            v-if="selectedProvince"

            type="button"

            class="clear-button"

            @click="selectedProvince = ''"

          >

            نمایش همه استان‌ها

          </button> -->

          <button

            type="button"

            class="expand-button"

            :aria-expanded="showAllProvinces"

            @click="showAllProvinces = !showAllProvinces"

          >

            {{ showAllProvinces ? 'نمایش کمتر' : 'نمایش بیشتر' }}

            <svg

              :class="{ rotated: showAllProvinces }"

              viewBox="0 0 24 24"

              fill="none"

              stroke="currentColor"

              stroke-width="2"

              aria-hidden="true"

            >

              <path d="m6 9 6 6 6-6" />

            </svg>

          </button>

        </div>

      </section>

      <!-- کارت‌های مهمانسرا -->

      <section class="results-section" aria-label="فهرست مهمانسراها">

        <div

          v-if="store.loading && !store.loaded"

          class="empty-state"

        >

          در حال دریافت مهمانسراها...

        </div>

        <div

          v-else-if="store.error && !store.loaded"

          class="empty-state error-state"

        >

          <p>{{ store.error }}</p>

          <button type="button" @click="store.loadPlaces()">

            تلاش مجدد

          </button>

        </div>

        <div

          v-else-if="!filteredPlaces.length"

          class="empty-state"

        >

          مهمانسرایی با این مشخصات پیدا نشد.

        </div>

        <div v-else class="place-grid">

          <NuxtLink
  v-for="place in filteredPlaces"
  :key="place._id"
  :to="`/mehmansara/${encodeURIComponent(place._id)}`"
  class="place-card"
  prefetch
>

            <span class="card-shape" aria-hidden="true"></span>

            <span class="place-content">

              <span class="place-name">

                {{ place.name || 'مهمانسرا' }}

              </span>

              <span class="place-location">

                {{ place.city || place.province || '' }}

              </span>

            </span>

            <span class="place-arrow" aria-hidden="true">

              <svg viewBox="0 0 64 64" fill="none">

                <path

                  d="M49 32H15M29 18L15 32L29 46"

                  stroke="currentColor"

                  stroke-width="8"

                  stroke-linecap="round"

                  stroke-linejoin="round"

                />

              </svg>

            </span>

          </NuxtLink>

        </div>

      </section>

    </div>

  </div>

  </div>

</template>

<style scoped>

.mehmansara-page {

  --primary: var(--color-primary-dark, #10135e);

  min-height: 100vh;

  background: #F8F8FA;

  color: #202c42;

  font-family: inherit;

  padding: 30px 16px 65px;

}

.page-wrap {

  max-width: 1440px;

  margin: auto;

}

.page-heading {

  margin-bottom: 24px;

}

/* Search */

.search-box {

  display: flex;

  align-items: center;

  gap: 12px;

  border: 1px solid #dce2e9;

  background: rgba(255, 255, 255, .78);

  border-radius: 16px;

  padding: 0 16px;

  height: 54px;

  backdrop-filter: blur(12px);

  -webkit-backdrop-filter: blur(12px);

}

.search-box:focus-within {

  border-color: var(--primary);

}

.search-box svg {

  width: 20px;

  height: 20px;

  color: #8c96aa;

  flex-shrink: 0;

}

.search-box input {

  width: 100%;

  border: 0;

  outline: 0;

  background: transparent;

  font: inherit;

  font-size: 14px;

  color: #24314c;

  min-width: 0;

}

/* Provinces */

.province-section {

  background: transparent;

  border: 0;

  padding: 0;

}

.province-grid {

  display: grid;

  grid-template-columns: repeat(8, minmax(0, 1fr));

  grid-auto-rows: 120px;

  gap: 10px;

  max-height: 120px;

  overflow: hidden;

  transition: max-height .3s ease;

}

.province-grid.expanded {

  max-height: 1200px;

}

.province-item {

  border: 1px solid transparent;

  background: rgba(255, 255, 255, .4);

  border-radius: 17px;

  display: flex;

  align-items: center;

  flex-direction: column;

  justify-content: center;

  gap: 7px;

  padding: 10px 5px;

  cursor: pointer;

  font: inherit;

  color: #45516a;

  transition: background .25s ease, color .25s ease, border-color .25s ease, transform .25s ease;

}

/* Hover for unselected province */

.province-item:hover:not(.active) {

  background: rgba(255, 255, 255, .85);

  border-color: color-mix(in srgb, var(--primary) 30%, white);

  color: var(--primary);

}

/* Selected province */

/* انتخاب ملایم استان */

.province-item.active,

.province-item.active:hover {

  background: color-mix(in srgb, var(--primary) 7%, white);

  border-color: color-mix(in srgb, var(--primary) 16%, white);

  color: var(--primary);

  box-shadow: 0 3px 12px rgba(16, 19, 94, .04);

}

.province-item.active .province-name { color: var(--primary); font-weight: 850; }

.province-item.active .province-icon { background: rgba(255, 255, 255, .45); border-radius: 13px; }

.province-icon {

  height: 65px;

  width: 65px;

  display: flex;

  align-items: center;

  justify-content: center;

}

.province-icon img {

  width: 58px;

  height: 58px;

  object-fit: contain;

}

.province-name {

  text-align: center;

  font-size: 12px;

  font-weight: 750;

  line-height: 1.5;

}

.province-actions {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 20px;

  padding: 14px 0 0;

}

.expand-button,

.clear-button {

  display: inline-flex;

  align-items: center;

  gap: 6px;

  border: 0;

  background: transparent;

  color: var(--primary);

  font: inherit;

  font-size: 13px;

  font-weight: 750;

  cursor: pointer;

}

.expand-button svg {

  width: 18px;

  height: 18px;

  transition: transform .2s;

}

.expand-button svg.rotated {

  transform: rotate(180deg);

}

/* Guesthouse cards */

.results-section {

  margin-top: 28px;

}

.place-grid {

  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 16px;

}

.place-card {

  position: relative;

  isolation: isolate;

  overflow: hidden;

  border: 1px solid rgba(255, 255, 255, .25);

  border-radius: 18px;

  background: linear-gradient(

    115deg,

    var(--primary),

    color-mix(in srgb, var(--primary) 75%, white)

  );

  min-height: 148px;

  display: flex;

  direction: rtl;

  align-items: center;

  justify-content: space-between;

  padding: 22px 20px;

  color: white;

  text-align: right;

  cursor: pointer;

  font: inherit;

  box-shadow: 0 8px 24px rgba(26, 36, 86, .1);

  transition: transform .2s, box-shadow .2s;

}

/* دایره بزرگ پشت فلش */

.place-card::before {

  content: '';

  position: absolute;

  width: 230px;

  height: 230px;

  border-radius: 50%;

  left: -100px;

  top: 50%;

  transform: translateY(-50%);

  background: rgba(255, 255, 255, .16);

  z-index: -1;

  pointer-events: none;

}

/* لایه شیشه‌ای */

.place-card::after {

  content: '';

  position: absolute;

  inset: 0;

  background: linear-gradient(

    145deg,

    rgba(255, 255, 255, .13),

    transparent 55%,

    rgba(255, 255, 255, .06)

  );

  z-index: -1;

  pointer-events: none;

}

.place-card:hover {

  transform: translateY(-3px);

  box-shadow: 0 14px 30px rgba(26, 36, 86, .16);

}

/* دایره دوم تزئینی */

.card-shape {

  position: absolute;

  width: 180px;

  height: 180px;

  right: -115px;

  top: -85px;

  border-radius: 50%;

  background: rgba(255, 255, 255, .07);

  z-index: -1;

  pointer-events: none;

}

.place-content {

  display: flex;

  flex-direction: column;

  gap: 10px;

  min-width: 0;

  flex: 1;

  text-align: right;

  direction: rtl;

  position: relative;

  z-index: 1;

}

.place-name {

  font-size: 16px;

  font-weight: 850;

  line-height: 1.7;

  overflow-wrap: anywhere;

}

.place-location {

  font-size: 12px;

  color: rgba(255, 255, 255, .88);

}

.place-arrow {

  width: 54px;

  height: 54px;

  display: grid;

  place-items: center;

  flex-shrink: 0;

  margin-right: 12px;

  background: transparent;

  border: none;

  color: rgba(255, 255, 255, .85);

  position: relative;

  z-index: 1;

}

.place-arrow svg {

  width: 44px;

  height: 44px;

}

/* Empty states */

.empty-state {

  background: rgba(255, 255, 255, .7);

  border: 1px solid #dce2e9;

  border-radius: 18px;

  padding: 34px;

  text-align: center;

  color: #7b879a;

}

.error-state button {

  margin-top: 12px;

  border: 0;

  border-radius: 9px;

  padding: 9px 18px;

  background: var(--primary);

  color: white;

  cursor: pointer;

}

/* Tablet */

@media (max-width: 1100px) {

  .place-grid {

    grid-template-columns: repeat(3, minmax(0, 1fr));

  }

}

@media (max-width: 900px) {

  .province-grid {

    grid-template-columns: repeat(5, minmax(0, 1fr));

  }

  .place-grid {

    grid-template-columns: repeat(2, minmax(0, 1fr));

  }

}

/* Mobile */

@media (max-width: 600px) {

  .mehmansara-page {

    padding: 20px 12px 55px;

  }

  .province-grid {

    grid-template-columns: repeat(4, minmax(0, 1fr));

    grid-auto-rows: 105px;

    max-height: 105px;

    gap: 7px 4px;

  }

  .province-grid.expanded {

    max-height: 1300px;

  }

  .province-item {

    padding: 8px 2px;

    gap: 5px;

    border-radius: 13px;

  }

  .province-icon {

    height: 53px;

    width: 53px;

  }

  .province-icon img {

    height: 46px;

    width: 46px;

  }

  .province-name {

    font-size: 10px;

  }

  .results-section {

    margin-top: 22px;

  }

  .place-grid {

    gap: 10px;

  }

  .place-card {

    min-height: 125px;

    border-radius: 15px;

    padding: 14px 12px;

    flex-direction: column;

    align-items: stretch;

    justify-content: space-between;

  }

  .place-name {

    font-size: 13px;

  }

  .place-location {

    font-size: 11px;

  }

  .place-content {

    gap: 4px;

    width: 100%;

    flex: initial;

    text-align: right;

  }

  .place-arrow {

    width: 38px;

    height: 38px;

    margin: 0;

    align-self: flex-end;

  }

  .place-arrow svg {

    width: 32px;

    height: 32px;

  }

  .place-card::before {

    width: 170px;

    height: 170px;

    left: -85px;

  }

  .card-shape {

    width: 145px;

    height: 180px;

    right: -95px;

    top: -65px;

  }

  .search-box {

    height: 49px;

  }

}

</style>





<style scoped>
.management-root{min-height:calc(100dvh - 76px);background:#F8F8FA;}
@media(max-width:640px){.management-root{min-height:calc(100dvh - 60px)}.mehmansara-page{padding:16px 12px 40px}.page-heading{margin-bottom:16px}.place-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:370px){.province-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.place-grid{grid-template-columns:1fr}.place-card{min-height:115px;flex-direction:row;align-items:center}}
</style>
