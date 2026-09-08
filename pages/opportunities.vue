<template>
 <section
  class="w-full overflow-hidden bg-white mt-7"
  dir="rtl"
 >
  <!-- ========================================= -->
  <!-- معرفی فرصت‌های شغلی -->
  <!-- ========================================= -->
  <div
   class="
    mx-auto
    grid
    w-full
    max-w-[1400px]
    grid-cols-1
    items-center
    gap-10
    px-5
    py-12
    lg:grid-cols-2
    lg:gap-20
    lg:px-8
    lg:py-16
   "
  >
   <!-- متن -->
   <div
    class="
     order-1
     flex
     flex-col
     items-start
     lg:order-1
    "
   >
    <h1
     class="
      text-[28px]
      font-black
      leading-[1.6]
      text-gray-700
      md:text-[34px]
      lg:text-[38px]
     "
    >
     آژانس گردشگری آهوان
    </h1>

    <p
     class="
      mt-1
      text-[15px]
      font-bold
      text-gray-300
      md:text-[17px]
     "
    >
     مشتاق به همکاری با حرفه‌ای‌ها
    </p>

    <p
     class="
      mt-7
      max-w-[570px]
      text-justify
      text-[13px]
      leading-[2.4]
      text-gray-600
      md:text-[14px]
     "
    >
     ما همواره در جستجوی نیروهای باانگیزه، خلاق و
     علاقه‌مند به صنعت گردشگری هستیم. اگر به دنبال
     محیطی حرفه‌ای، پویا و فرصت‌های جدید برای رشد و
     پیشرفت هستید، خوشحال می‌شویم شما را در خانواده
     بزرگ آهوان همراه خود داشته باشیم.
    </p>

    <button
     type="button"
     class="
      mt-7
      inline-flex
      items-center
      justify-center
      gap-2
      rounded-full
      bg-[#14179e]
      px-7
      py-3
      text-[12px]
      font-bold
      text-white
      shadow-lg
      shadow-blue-900/10
      transition-all
      duration-300
      hover:-translate-y-1
      hover:bg-[#0f127f]
      hover:shadow-xl
     "
     @click="scrollToForm"
    >
     <i class="bi bi-send"></i>

     ارسال رزومه
    </button>
   </div>


   <!-- تصویر -->
   <div
    class="
     order-2
     lg:order-2
    "
   >
    <div
     class="
      relative
      overflow-hidden
      rounded-[24px]
      bg-[#eef1f4]
      p-3
      md:p-4
     "
    >
     <img
      src="/imgs/hotel/opportunities.png"
      alt="فرصت‌های شغلی آژانس گردشگری آهوان"
      class="
       block
       h-auto
       w-full
       rounded-[18px]
       object-contain
      "
     >

     <!-- تزئین -->
     <div
      class="
       pointer-events-none
       absolute
       -bottom-8
       -right-8
       h-28
       w-28
       rounded-full
       bg-[#14179e]/10
       blur-2xl
      "
     ></div>
    </div>
   </div>
  </div>


  <!-- ========================================= -->
  <!-- فرم ارسال رزومه -->
  <!-- ========================================= -->
  <div
   ref="formSection"
   class="
    bg-[#eef1f4]
    px-4
    py-10
    md:px-6
    md:py-14
   "
  >
   <div
    class="
     mx-auto
     w-full
     max-w-[1400px]
     rounded-[24px]
     border
     border-gray-200
     bg-white
     p-5
     shadow-sm
     md:p-8
    "
   >
    <!-- عنوان فرم -->
    <div
     class="
      mb-7
      flex
      items-center
      justify-between
      gap-4
     "
    >
     <div>
      <h2
       class="
        text-[18px]
        font-black
        text-gray-800
        md:text-[21px]
       "
      >
       ارسال رزومه
      </h2>

      <p
       class="
        mt-1
        text-[11px]
        leading-7
        text-gray-400
        md:text-[12px]
       "
      >
       اطلاعات خود را وارد کنید تا همکاران ما با شما
       در ارتباط باشند.
      </p>
     </div>

     <div
      class="
       hidden
       h-12
       w-12
       items-center
       justify-center
       rounded-2xl
       bg-[#14179e]/10
       text-[#14179e]
       sm:flex
      "
     >
      <i class="bi bi-file-earmark-person text-[22px]"></i>
     </div>
    </div>


    <form
     class="space-y-5"
     @submit.prevent="submitResume"
    >
     <!-- اطلاعات اصلی -->
     <div
      class="
       grid
       grid-cols-1
       gap-4
       md:grid-cols-2
       lg:grid-cols-4
      "
     >
      <!-- نام -->
      <div>
       <label class="form-label">
        نام و نام خانوادگی
       </label>

       <input
        v-model.trim="form.fullName"
        type="text"
        class="form-input"
        placeholder="نام و نام خانوادگی"
       >
      </div>


      <!-- موبایل -->
      <div>
       <label class="form-label">
        شماره تماس
       </label>

       <input
        v-model.trim="form.mobile"
        type="tel"
        inputmode="numeric"
        class="form-input"
        placeholder="0912..."
        dir="ltr"
       >
      </div>


      <!-- ایمیل -->
      <div>
       <label class="form-label">
        ایمیل
       </label>

       <input
        v-model.trim="form.email"
        type="email"
        class="form-input"
        placeholder="example@gmail.com"
        dir="ltr"
       >
      </div>


      <!-- تخصص -->
      <div>
       <label class="form-label">
        تخصص / موقعیت پیشنهادی
       </label>

       <input
        v-model.trim="form.position"
        type="text"
        class="form-input"
        placeholder="مثلاً کارشناس فروش"
       >
      </div>
     </div>


     <!-- توضیحات -->
     <div>
      <label class="form-label">
       توضیحات
      </label>

      <textarea
       v-model.trim="form.description"
       rows="5"
       class="
        form-input
        min-h-[130px]
        resize-none
       "
       placeholder="توضیحات تکمیلی خود را وارد کنید..."
      ></textarea>
     </div>


     <!-- آپلود رزومه -->
     <div>
      <label class="form-label">
       فایل رزومه
      </label>

      <label
       class="
        group
        flex
        min-h-[105px]
        cursor-pointer
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-gray-300
        bg-gray-50
        px-4
        py-5
        text-center
        transition
        hover:border-[#14179e]/50
        hover:bg-[#14179e]/[0.03]
       "
      >
       <input
        type="file"
        class="hidden"
        accept=".pdf,.doc,.docx"
        @change="handleFile"
       >

       <i
        class="
         bi
         bi-cloud-arrow-up
         text-[25px]
         text-[#14179e]
        "
       ></i>

       <span
        v-if="!form.file"
        class="
         mt-2
         text-[11px]
         font-bold
         text-gray-500
        "
       >
        برای انتخاب فایل رزومه کلیک کنید
       </span>

       <span
        v-else
        class="
         mt-2
         text-[11px]
         font-bold
         text-[#14179e]
        "
       >
        {{form.file.name}}
       </span>

       <span
        class="
         mt-1
         text-[10px]
         text-gray-400
        "
       >
        PDF، DOC یا DOCX
       </span>
      </label>
     </div>


     <!-- Error -->
     <p
      v-if="errorMessage"
      class="
       text-[11px]
       font-bold
       text-red-500
      "
     >
      {{errorMessage}}
     </p>


     <!-- Success -->
     <p
      v-if="successMessage"
      class="
       text-[11px]
       font-bold
       text-green-600
      "
     >
      {{successMessage}}
     </p>


     <!-- Buttons -->
     <div
      class="
       flex
       flex-wrap
       items-center
       gap-3
       pt-2
      "
     >
      <button
       type="submit"
       :disabled="submitting"
       class="
        inline-flex
        min-w-[120px]
        items-center
        justify-center
        gap-2
        rounded-full
        bg-[#14179e]
        px-7
        py-3
        text-[11px]
        font-bold
        text-white
        transition-all
        duration-300
        hover:bg-[#0f127f]
        disabled:cursor-not-allowed
        disabled:opacity-60
       "
      >
       <span v-if="!submitting">
        ارسال
       </span>

       <span v-else>
        در حال ارسال...
       </span>

       <i
        v-if="!submitting"
        class="bi bi-send"
       ></i>
      </button>


      <button
       type="button"
       class="
        rounded-full
        bg-[#e4b778]
        px-6
        py-3
        text-[11px]
        font-bold
        text-white
        transition
        hover:bg-[#d6a85f]
       "
       @click="resetForm"
      >
       پاکسازی فرم
      </button>
     </div>
    </form>
   </div>
  </div>
 </section>
</template>


<script setup>
import{
 ref,
 reactive
}from'vue'


const formSection=ref(null)

const submitting=ref(false)
const errorMessage=ref('')
const successMessage=ref('')


const form=reactive({
 fullName:'',
 mobile:'',
 email:'',
 position:'',
 description:'',
 file:null
})


function scrollToForm(){

 formSection.value?.scrollIntoView({
  behavior:'smooth',
  block:'start'
 })

}


function handleFile(event){

 const file=
  event.target.files?.[0]

 if(!file)
  return

 form.file=file

}


function validateForm(){

 if(!form.fullName){
  return 'نام و نام خانوادگی را وارد کنید.'
 }

 if(!form.mobile){
  return 'شماره تماس را وارد کنید.'
 }

 if(!form.email){
  return 'ایمیل را وارد کنید.'
 }

 return''
}


async function submitResume(){

 errorMessage.value=''
 successMessage.value=''

 const validationError=
  validateForm()

 if(validationError){

  errorMessage.value=
   validationError

  return
 }


 try{

  submitting.value=true


  /*
   * API ارسال رزومه را اینجا قرار بده.
   *
   * نمونه:
   *
   * const body=new FormData()
   *
   * body.append(
   *  'fullName',
   *  form.fullName
   * )
   *
   * body.append(
   *  'mobile',
   *  form.mobile
   * )
   *
   * body.append(
   *  'email',
   *  form.email
   * )
   *
   * body.append(
   *  'position',
   *  form.position
   * )
   *
   * body.append(
   *  'description',
   *  form.description
   * )
   *
   * if(form.file){
   *  body.append(
   *   'file',
   *   form.file
   *  )
   * }
   *
   * await $fetch(
   *  'YOUR_API_URL',
   *  {
   *   method:'POST',
   *   body
   *  }
   * )
   */


  successMessage.value=
   'اطلاعات شما با موفقیت آماده ارسال شد.'

 }
 catch(error){

  console.error(
   'Resume Submit Error:',
   error
  )

  errorMessage.value=
   'در ارسال اطلاعات مشکلی به وجود آمده است.'

 }
 finally{

  submitting.value=false

 }

}


function resetForm(){

 form.fullName=''
 form.mobile=''
 form.email=''
 form.position=''
 form.description=''
 form.file=null

 errorMessage.value=''
 successMessage.value=''

}
</script>


<style scoped>
.form-label{
 display:block;
 margin-bottom:7px;
 font-size:11px;
 font-weight:700;
 color:#4b5563;
}

.form-input{
 width:100%;
 border:1px solid #e5e7eb;
 border-radius:12px;
 background:#fff;
 padding:11px 13px;
 font-size:12px;
 color:#111827;
 outline:none;
 transition:
  border-color .2s ease,
  box-shadow .2s ease;
}

.form-input::placeholder{
 color:#c4c7cc;
}

.form-input:focus{
 border-color:#14179e;
 box-shadow:
  0 0 0 3px
  rgba(20,23,158,.08);
}
</style>