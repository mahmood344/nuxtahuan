<template>
 <section
  class="w-full bg-white"
  dir="rtl"
 >
  <!-- ===================================== -->
  <!-- معرفی دفتر حافظ منافع مشتریان -->
  <!-- ===================================== -->
  <div
   class="
    mx-auto
    w-full
    max-w-[1200px]
    px-5
    pb-8
    pt-10
    md:px-6
    md:pb-10
    md:pt-14
   "
  >
   <!-- Title -->
   <h1
    class="
     text-[20px]
     font-black
     text-gray-800
     md:text-[24px]
    "
   >
    دفتر حافظ منافع مشتریان
   </h1>


   <!-- Description -->
   <div
    class="
     mt-5
     max-w-[1400px]
     text-justify
     text-[12px]
     leading-[2.4]
     text-gray-600
     md:text-[16px]
    "
   >
    <p>
     برند رسمی آژانس مسافرتی آهوان به خوبی از جنس دغدغه‌های مسافرین آگاه است. نیاز ضروری کسب اعتماد به محصولات عرضه شده و اطمینان خاطر مسافرین از دریافت خدمات تورهایی در عالی ترین سطح منجر به تشکیل دفتر حافظ منافع مشتریان شد. این دپارتمان در حقیقت یک سیستم پیشرفته PTS (Passenger Tracking System) است که خدمات عرضه شده به مسافرین را از اولین نقطه تماس آنان با برند آهوان تا بازگشت از سفر و مرور خاطرات لذت‌بخش آن دنبال می‌کند. بازوی اجرایی مهم این سیستم مرکز تماس آنلاین مستقر در تهران است.
دفتر حافظ منافع مشتریان به مسافرین اطمینان خاطر می‌دهد که صدای آنان توسط برگزارکنندگان تور شنیده می‌شود و دغدغه‌های آنان در طراحی و اجرای پکیج‌ها لحاظ می‌گردد. شما در هر لحظه از شبانه ­روز می‌توانید نظرات، انتقادات و پیشنهادات خود را از طریق فرم ذیل به اطلاع تصمیم گیران پروژه برسانید و در حین لذت بردن از تورهای ویژه آهوان نیز نمایندگان تام الختیار این برند را همگام و همراه در کنار خود داشته باشید.
    </p>
   </div>

<div class="flex justify-end">
 <!-- Continue -->
   <button
    type="button"
    class="
     mt-7
     inline-flex
     min-w-[95px]
     items-center
     justify-center
     rounded-full
     bg-[#14179e]
     px-8
     py-2.5
     text-[11px]
     font-bold
     text-white
     transition
     duration-200
     hover:-translate-y-0.5
     hover:bg-[#0e117f]
    "
    @click="scrollToForm"
   >
    ادامه
   </button>
</div>
  


   <!-- Image -->
   <div
    class="
     mt-8
     flex
     w-full
     justify-center
    "
   >
    <img
     src="/imgs/hotel/customer-rights.png"
     alt="دفتر حافظ منافع مشتریان"
     class="
      h-auto
      w-full
      max-w-[650px]
      object-contain
     "
    >
   </div>
  </div>


  <!-- ===================================== -->
  <!-- Form Background -->
  <!-- ===================================== -->
  <div
   ref="formSection"
   class="
    bg-[#eef1f4]
    px-4
    py-8
    md:px-6
    md:py-10
   "
  >
   <div
    class="
     mx-auto
     w-full
     max-w-[1450px]
     rounded-[18px]
     border
     border-gray-200
     bg-white
     p-5
     shadow-[0_2px_12px_rgba(0,0,0,0.12)]
     md:p-7
    "
   >
    <!-- Form Title -->
    <h2
     class="
      mb-6
      text-[15px]
      font-black
      text-gray-800
     "
    >
     ارسال پیام
    </h2>


    <form
     @submit.prevent="submitMessage"
     class="space-y-5"
    >
     <!-- Row 1 -->
     <div
      class="
       grid
       grid-cols-1
       gap-4
       md:grid-cols-2
       lg:grid-cols-4
      "
     >
      <!-- Name -->
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


      <!-- Phone -->
      <div>
       <label class="form-label">
        تلفن همراه
       </label>

       <input
        v-model.trim="form.mobile"
        type="tel"
        inputmode="numeric"
        class="form-input"
        placeholder="09xxxxxxxxx"
        dir="ltr"
       >
      </div>


      <!-- Email -->
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


      <!-- Tracking -->
      <div>
       <label class="form-label">
        نوع پیگیری
       </label>

       <select
        v-model="form.requestType"
        class="form-input"
       >
        <option value="">
         انتخاب کنید
        </option>

        <option value="complaint">
         شکایت
        </option>

        <option value="suggestion">
         پیشنهاد
        </option>

        <option value="request">
         درخواست
        </option>

        <option value="other">
         سایر
        </option>
       </select>
      </div>
     </div>


     <!-- Row 2 -->
     <div
      class="
       grid
       grid-cols-1
       gap-4
       md:grid-cols-2
      "
     >
      <!-- Subject -->
      <div>
       <label class="form-label">
        موضوع
       </label>

       <input
        v-model.trim="form.subject"
        type="text"
        class="form-input"
        placeholder="موضوع پیام"
       >
      </div>


      <!-- Contract -->
      <div>
       <label class="form-label">
        شماره قرارداد
       </label>

       <input
        v-model.trim="form.contractNumber"
        type="text"
        class="form-input"
        placeholder="شماره قرارداد"
       >
      </div>
     </div>


     <!-- Message -->
     <div>
      <label class="form-label">
       متن پیام
      </label>

      <textarea
       v-model.trim="form.message"
       rows="5"
       class="
        form-input
        min-h-[130px]
        resize-none
       "
       placeholder="متن پیام خود را وارد کنید..."
      ></textarea>
     </div>


     <!-- Messages -->
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


     <!-- Submit -->
     <div
      class="
       flex
       items-center
       gap-3
      "
     >
      <button
       type="submit"
       :disabled="submitting"
       class="
        inline-flex
        min-w-[90px]
        items-center
        justify-center
        rounded-full
        bg-[#14179e]
        px-6
        py-2.5
        text-[11px]
        font-bold
        text-white
        transition
        hover:bg-[#0e117f]
        disabled:cursor-not-allowed
        disabled:opacity-50
       "
      >
       {{
        submitting
         ? 'در حال ارسال...'
         : 'ارسال'
       }}
      </button>


      <button
       type="button"
       class="
        inline-flex
        min-w-[100px]
        items-center
        justify-center
        rounded-full
        bg-[#e4b778]
        px-5
        py-2.5
        text-[11px]
        font-bold
        text-white
        transition
        hover:bg-[#d3a35f]
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
 requestType:'',
 subject:'',
 contractNumber:'',
 message:''
})


function scrollToForm(){

 formSection.value?.scrollIntoView({
  behavior:'smooth',
  block:'start'
 })

}


function validateForm(){

 if(!form.fullName){
  return 'نام و نام خانوادگی را وارد کنید.'
 }

 if(!form.mobile){
  return 'شماره تلفن همراه را وارد کنید.'
 }

 if(!form.subject){
  return 'موضوع پیام را وارد کنید.'
 }

 if(!form.message){
  return 'متن پیام را وارد کنید.'
 }

 return''
}


async function submitMessage(){

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
   * API را بعداً اینجا قرار بده:
   *
   * await $fetch(
   *  'YOUR_API_URL',
   *  {
   *   method:'POST',
   *   body:{
   *    fullName:form.fullName,
   *    mobile:form.mobile,
   *    email:form.email,
   *    requestType:form.requestType,
   *    subject:form.subject,
   *    contractNumber:form.contractNumber,
   *    message:form.message
   *   }
   *  }
   * )
   */


  successMessage.value=
   'پیام شما با موفقیت آماده ارسال شد.'

 }
 catch(error){

  console.error(
   'Customer Rights Message Error:',
   error
  )

  errorMessage.value=
   'در ارسال پیام مشکلی به وجود آمده است.'

 }
 finally{

  submitting.value=false

 }

}


function resetForm(){

 form.fullName=''
 form.mobile=''
 form.email=''
 form.requestType=''
 form.subject=''
 form.contractNumber=''
 form.message=''

 errorMessage.value=''
 successMessage.value=''

}
</script>


<style scoped>
.form-label{
 display:block;
 margin-bottom:6px;
 font-size:10px;
 font-weight:700;
 color:#4b5563;
}

.form-input{
 width:100%;
 min-height:38px;
 border:1px solid #d1d5db;
 border-radius:2px;
 background:#fff;
 padding:8px 10px;
 font-size:11px;
 color:#111827;
 outline:none;
 transition:
  border-color .2s ease,
  box-shadow .2s ease;
}

.form-input::placeholder{
 color:#9ca3af;
}

.form-input:focus{
 border-color:#14179e;
 box-shadow:
  0 0 0 2px
  rgba(20,23,158,.08);
}
</style>