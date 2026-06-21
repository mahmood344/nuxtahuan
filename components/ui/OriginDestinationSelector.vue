<template>
  <div dir="rtl" class="flex w-full justify-center p-4">
    <div
      class="relative flex w-full max-w-[500px] h-[54px] bg-white border border-gray-300 rounded-[12px] items-center"
    >
      <!-- بخش مبدا -->
      <div class="flex-1 h-full relative group">
        <label class="absolute -top-3 right-6 z-20 bg-white px-2 text-[11px] text-gray-400">
          مبدا (شهر)
        </label>
        
        <!-- نمایش مقدار انتخاب شده -->
        <div 
          @click="isMabdaOpen = !isMabdaOpen; isMaghsadOpen = false"
          class="w-full h-full flex items-center px-6 cursor-pointer text-gray-700"
        >
          <span v-if="mabda">{{ mabda }}</span>
          <span v-else class="text-gray-400">انتخاب مبدا</span>
          
          <!-- آیکون هوشمند: اگر شهر انتخاب شده بود ضربدر، در غیر این صورت فلش رو به پایین -->
          <i 
            v-if="mabda"
            @click.stop="mabda = ''; isMabdaOpen = false"
            class="bi bi-x mr-auto text-gray-400 text-xl hover:text-red-500 transition-colors"
            title="پاک کردن"
          ></i>
          <i 
            v-else
            class="bi bi-chevron-down mr-auto text-gray-400 text-xs"
          ></i>
        </div>

        <!-- لیست شهرهای مبدا -->
        <div v-if="isMabdaOpen" class="custom-dropdown">
          <div class="px-4 py-2 text-[11px] text-gray-400 bg-gray-50/50">پرتردد</div>
          <div 
            v-for="city in cities" :key="city"
            @click="mabda = city; isMabdaOpen = false"
            class="city-item"
          >
            {{ city }}
          </div>
        </div>
      </div>

      <!-- دکمه جابجایی (با استایل و وسط‌چین دقیق شما) -->
      <div class="flex-shrink-0 flex items-center justify-center w-16 h-full relative">
        <div class="absolute inset-y-0 w-px bg-gray-300"></div>
        <button
          :class="{ disableBtn: !isFormValid }"
          :disabled="!isFormValid"
          @click="swapFields"
          class="p-1 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-300 relative z-10 hover:scale-110 transition-all"
        >
          <i class="bi bi-arrow-left-right w-5 h-5 text-gray-600"></i>
        </button>
      </div>

      <!-- بخش مقصد -->
      <div class="flex-1 h-full relative group">
        <label class="absolute -top-3 right-6 z-20 bg-white px-2 text-[11px] text-gray-400">
          مقصد (شهر)
        </label>
        
        <div 
          @click="isMaghsadOpen = !isMaghsadOpen; isMabdaOpen = false"
          class="w-full h-full flex items-center px-6 cursor-pointer text-gray-700"
        >
          <span v-if="maghsad">{{ maghsad }}</span>
          <span v-else class="text-gray-400">انتخاب مقصد</span>
          
          <!-- آیکون هوشمند: اگر شهر انتخاب شده بود ضربدر، در غیر این صورت فلش رو به پایین -->
          <i 
            v-if="maghsad"
            @click.stop="maghsad = ''; isMaghsadOpen = false"
            class="bi bi-x mr-auto text-gray-400 text-xl hover:text-red-500 transition-colors"
            title="پاک کردن"
          ></i>
          <i 
            v-else
            class="bi bi-chevron-down mr-auto text-gray-400 text-xs"
          ></i>
        </div>

        <!-- لیست شهرهای مقصد -->
        <div v-if="isMaghsadOpen" class="custom-dropdown">
          <div class="px-4 py-2 text-[11px] text-gray-400 bg-gray-50/50">پرتردد</div>
          <div 
            v-for="city in cities" :key="city"
            @click="maghsad = city; isMaghsadOpen = false"
            class="city-item"
          >
            {{ city }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const mabda = ref('');
const maghsad = ref('');
const isMabdaOpen = ref(false);
const isMaghsadOpen = ref(false);

const cities = ref(['تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'رشت', 'اهواز']);

const isFormValid = computed(() => {
  return mabda.value && maghsad.value;
});

const swapFields = () => {
  if (!isFormValid.value) return;
  const temp = mabda.value;
  mabda.value = maghsad.value;
  maghsad.value = temp;
};
</script>

<style scoped>
/* استایل لیست شهرها دقیقا مطابق عکس */
.custom-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.city-item {
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6; /* خط زیر هر شهر */
  transition: background 0.2s;
}

.city-item:last-child {
  border-bottom: none;
}

.city-item:hover {
  background-color: #f9fafb;
}

/* استایل دکمه غیرفعال شما */
.disableBtn {
  background: var(--color-gray-200);
  cursor: not-allowed;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.border-gray-300 {
  border-color: #d1d5db;
}

.w-px {
  width: 1px;
}

/* اسکرول‌بار زیبا برای لیست */
.custom-dropdown::-webkit-scrollbar {
  width: 4px;
}
.custom-dropdown::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
</style>
