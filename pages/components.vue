<template>
  <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    <div class="border border-primary rounded-xl p-4 space-y-3">
      <h2 class="font-semibold">Buttons</h2>
    
    <!-- دکمه اصلی (رزرو تور) -->
   <UiBaseButton
  label="ثبت نام"
  variant="outline"
  color="primary"
  :active="false"
/>
<UiBaseButton
  label="ثبت نام"
  variant="filled"
  color="primary"
  :active="false"
/>
<UiBaseButton
  label="ثبت نام"
  :loading="true"
/>
<UiBaseButton
  label="ثبت نام"
  variant="filled"
  color="primary"
  :disabled="true"
/>
<UiBaseButton
  label="لاکچری"
  variant="soft"
  color="primary"
  icon='<i class="bi bi-3-circle-fill"></i>'
/>
    </div>

<div class="border border-primary rounded-xl p-4 space-y-3">
      <h2 class="font-semibold">Inputs</h2>
      <UiBaseInput
          label="نام"
          placeholder="نام خود را وارد کنید"
          v-model="name"
        />

        <!-- Input with Icon -->
        <UiBaseInput
          label="ایمیل"
          placeholder="example@domain.com"
          icon='<i class="bi bi-envelope-fill"></i>'
          iconPosition="left"
          v-model="email"
        />

        <!-- Input with Error -->
        <UiBaseInput
          label="رمز عبور"
          placeholder="حداقل ۸ کاراکتر"
          icon='<i class="bi bi-lock-fill"></i>'
          iconPosition="right"
          error="رمز عبور ضعیف است"
          v-model="password"
        />

        <!-- Loading Input -->
        <UiBaseInput
          label="جستجو"
          
          loading
          v-model="searchTerm"
        />
     <UiBaseInput
          label="جستجو"
          placeholder="در حال بارگذاری..."
          icon='<i class="bi bi-search"></i>'
          v-model="searchTerm"
        />
        <!-- Disabled Input -->
        <UiBaseInput
          label="وضعیت"
          placeholder="غیر فعال"
          modelValue="مقدار پیش‌فرض"
          disabled
          v-model="status"
        />
    </div>
    <div class="border border-primary rounded-xl p-4 space-y-3">
        <h2 class="text-2xl font-bold mb-4">Autocomplete</h2>

        <!-- Example 1: Simple String Array -->
        <UiBaseAutocomplete
          label="انتخاب شهر"
          placeholder="نام شهر را تایپ کنید..."
          :items="['تهران' , 'cities1' , 'cities2']"
          v-model="selectedCity"
          clearable
          icon=''
          iconPosition="left"
        />

        <!-- Example 2: Array of Objects -->
        <UiBaseAutocomplete
          label="انتخاب کاربر"
          placeholder="نام کاربر را جستجو کنید..."
          :items="users"
          item-text="name"
          item-value="id"
          v-model="selectedUserId"
          clearable
          error="asdasda"
          :menuProps="{ maxHeight: '200px', offset: 8 }"
           icon='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6z" /><path fill-rule="evenodd" d="M5.157 3.633A9.03 9.03 0 0110 3c1.525 0 2.96.425 4.187.922c.77.362 1.164.864 1.164 1.345v.003c0 .482-.394.983-1.164 1.345A8.97 8.97 0 0110 7c-1.525 0-2.96-.425-4.187-.922-.77-.362-1.164-.864-1.164-1.345v-.003c0-.482.394-.983 1.164-1.345C5.993 3.425 7.425 3 9 3a8.97 8.97 0 011.157-.003zM17.748 4.922a7.5 7.5 0 00-10.494 0A2.5 2.5 0 018.75 5.5v.003c0 .482.394.983 1.164 1.345C11.04 7.922 12.475 8.35 14 8.35c1.525 0 2.96-.425 4.187-.922.77-.362 1.164-.864 1.164-1.345v-.003c0-.482-.394-.983-1.164-1.345zM10 12a4 4 0 110-8 4 4 0 010 8zM3.5 10.5a.75.75 0 001.06 1.06l2.867-2.867c.405-.405.405-1.06 0-1.465A.75.75 0 005.867 7H3.75A2.5 2.5 0 003.5 9.5v1z" clip-rule="evenodd" /></svg>'
          iconPosition="right"
        />

         <!-- Example 3: Loading state -->
        <UiBaseAutocomplete
          label="جستجو (با لودینگ)"
          placeholder="کمی صبر کنید..."
          :items="[]"
          :loading="isLoadingExample"
          v-model="loadingModel"
        />
    <UiBaseAutocomplete
          label="انتخاب شهر"
          placeholder="نام شهر را تایپ کنید..."
          :items="['تهران' , 'cities1' , 'cities2']"
          v-model="selectedCity"
          clearable
          icon=''
          iconPosition="left"
        />
      </div>
       <div class="border border-primary rounded-xl p-4 space-y-3">
        <h2 class="text-2xl font-bold mb-4">checkbox</h2>
   
<UiBaseCheckbox
  v-model="isAgreed"
  label="موافقم"
  color="#1F228C"
  disabled
/>
<UiBaseCheckbox
  v-model="isAgreed"
  label="موافقم"
/>
<UiBaseCheckbox
  v-model="isAgreed"
  label="موافقم"
  icon='<i class="bi bi-3-circle-fill"></i>'
/>
<!-- با عکس کنار چک‌باکس -->
<UiBaseCheckbox
  v-model="isAgreed"
  label="پروفایل من"
  customImage="https://camo.githubusercontent.com/5e45bc648dba68520ce949a53690af6bcef2880f84a1d46cbb1636649afd6d84/68747470733a2f2f796176757a63656c696b65722e6769746875622e696f2f73616d706c652d696d616765732f696d6167652d313032312e6a7067"
/>
       </div>
       <div class="border border-primary rounded-xl p-4 space-y-3">
        <h2 class="text-2xl font-bold mb-4">Autocomplete</h2>
        <UiBaseRadio v-model="selectedOption" value="A" label="گزینه اول" />
        <UiBaseRadio v-model="selectedOption" value="B" label="گزینه دوم" />
       </div>
       <div class="border border-primary rounded-xl p-4 space-y-3">
        <h2 class="text-2xl font-bold mb-4">labels</h2>
        <UiBaseLabel
        class="mr-2 "
  text="موفق"
  color="#2629A6"
  icon='<i class="bi bi-check2-circle"></i>'
/>
<UiBaseLabel
  text="جدید"
  color="#2629A6"
  :items="['نام ایرلاین', 'دیرترین', 'زودترین', 'ارزان‌ترین', 'گران‌ترین']" 
/>
       </div>
       <div class="border border-primary rounded-xl p-4 space-y-3">
        <h2 class="text-2xl font-bold mb-4">Tabs</h2>
        <UiBaseTabs 
    :items="['نام ایرلاین', 'دیرترین', 'زودترین', 'ارزان‌ترین', 'گران‌ترین']" 
    v-model="activeTab" 
  />
  <UiBaseTabs 
    :items="['دیرترین', 'زودترین', 'ارزان‌ترین', 'گران‌ترین']" 
    v-model="activeTab" 
  />
       </div>
        <div class="border border-primary rounded-xl p-4 space-y-3">
        <h2 class="text-2xl font-bold mb-4">loading</h2>
          <UiBaseLoadingSkeleton />
        </div>
        <div class="border rounded-xl p-4 space-y-4 border-[var(--color-primary)]">

<h2 class="text-2xl font-bold mb-4">Theme Colors</h2>

<div class="flex flex-wrap gap-3">

<div class="color-card w-44 p-3 rounded-lg text-center text-white"
style="background:var(--color-primary)">
--color-primary
</div>
<div class="color-card w-44 p-3 rounded-lg text-center text-white"
style="background:var(--color-secondary)">
--color-secondary
</div>
<div class="color-card w-44 p-3 rounded-lg text-center text-white"
style="background:var(--color-primary-dark)">
--color-primary-dark
</div>

<div class="color-card w-44 p-3 rounded-lg text-center"
style="background:var(--color-primary-light); color:var(--color-primary-dark)">
--color-primary-light
</div>

<div class="color-card w-44 p-3 rounded-lg text-center"
style="background:var(--color-gray-100)">
--color-gray-100
</div>

<div class="color-card w-44 p-3 rounded-lg text-center"
style="background:var(--color-gray-200)">
--color-gray-200
</div>

<div class="color-card w-44 p-3 rounded-lg text-center"
style="background:var(--color-gray-300)">
--color-gray-300
</div>

<div class="color-card w-44 p-3 rounded-lg text-center text-white"
style="background:var(--color-gray-400)">
--color-gray-400
</div>

<div class="color-card w-44 p-3 rounded-lg text-center text-white"
style="background:var(--color-gray-500)">
--color-gray-500
</div>

<div class="color-card w-44 p-3 rounded-lg text-center text-white"
style="background:var(--color-gray-600)">
--color-gray-600
</div>

<div class="color-card w-44 p-3 rounded-lg text-center text-white"
style="background:var(--color-gray-700)">
--color-gray-700
</div>

<div class="color-card w-44 p-3 rounded-lg text-center text-white"
style="background:var(--color-gray-800)">
--color-gray-800
</div>

<div class="color-card w-44 p-3 rounded-lg text-center"
style="background:var(--color-red-300)">
--color-red-300
</div>

<div class="color-card w-44 p-3 rounded-lg text-center text-white"
style="background:var(--color-red-500)">
--color-red-500
</div>

</div>

</div>

        <div class="border border-primary rounded-xl p-4 space-y-3">
        <h2 class="text-2xl font-bold mb-4">datePicker</h2>
      <div dir="rtl" class="w-full flex items-center">
        <UiBaseDatePicker></UiBaseDatePicker>
</div>
        </div>
<div class="border border-primary rounded-xl p-4 space-y-3">
        <h2 class="text-2xl font-bold mb-4">select city</h2>
        <UiOriginDestinationSelector></UiOriginDestinationSelector>
</div>
<div class="border border-primary rounded-xl p-4 space-y-3">
        <h2 class="text-2xl font-bold mb-4">select passenger</h2>
        <UiPassengerSelector></UiPassengerSelector>
</div>
  </div>
</template>
<script setup>


const selectedOption = ref('A');
const isAgreed = ref(false);
const activeTab = ref('ارزان‌ترین')
const date = ref('')
// آدرس URL عکس سفارشی
    const customImageUrl = 'https://raw.githubusercontent.com/yavuzceliker/sample-images/main/image-1021.jpg';
</script>