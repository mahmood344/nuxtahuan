<template>
  <div
    class="hotel-voucher mx-auto w-full max-w-[1120px] bg-[#f7f1e7] text-[#1f2937]"
    dir="rtl"
  >
    <!-- Header -->
    <div class="voucher-header">
      <div class="header-illustration">
        <div class="illustration-placeholder">
          <span>AHUAN</span>
        </div>
      </div>

      <div class="header-brand">
        <div class="brand-small">
          هتل بزرگ
        </div>

        <div class="brand-title">
          آهوان
        </div>

        <div class="brand-company">
          شرکت خدمات مسافرتی، گردشگری و زیارتی آهوان
        </div>
      </div>
    </div>

    <!-- Contract Meta -->
    <div class="meta-row">
      <div>
        شماره قرارداد:
        <strong>{{ contract?.id || '-' }}</strong>
      </div>

      <div>
        ساعت رزرو:
        <strong>{{ contract?.issueTime || '-' }}</strong>
      </div>

      <div>
        تاریخ رزرو:
        <strong>{{ formatDate(contract?.issueDate) }}</strong>
      </div>
    </div>

    <!-- Buyer -->
    <VoucherSection title="مشخصات درخواست‌دهنده (خریدار)">
      <table class="voucher-table">
        <thead>
          <tr>
            <th>نام و نام خانوادگی</th>
            <th>کد ملی</th>
            <th>نوع مهمان</th>
            <th>موبایل</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              {{ leadPassengerFullName }}
            </td>

            <td dir="ltr">
              {{ leadPassenger?.codeMelli || '-' }}
            </td>

            <td>
              {{ passengerTypeTitle(leadPassenger?.age) }}
            </td>

            <td dir="ltr">
              {{ contract?.userName || '-' }}
            </td>
          </tr>
        </tbody>
      </table>

      <table class="voucher-table mt-2">
        <thead>
          <tr>
            <th>تاریخ ورود</th>
            <th>تاریخ خروج</th>
            <th>تعداد شب</th>
            <th>تعداد کل نفرات</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              {{ formatDate(roomRoute?.checkIn) }}
            </td>

            <td>
              {{ formatDate(roomRoute?.checkOut) }}
            </td>

            <td>
              {{ roomRoute?.stayNights ?? '-' }}
              شب
            </td>

            <td>
              {{ contract?.passengersNo ?? passengers.length }}
              نفر
            </td>
          </tr>
        </tbody>
      </table>

      <p class="voucher-note">
        در صورت تمایل به هرگونه تغییر یا کنسلی، حتماً با پشتیبانی هماهنگ شود.
      </p>
    </VoucherSection>

    <!-- Rooms -->
    <VoucherSection title="مشخصات اتاق(ها)">
      <table class="voucher-table">
        <thead>
          <tr>
            <th class="w-14">ردیف</th>
            <th>نام اتاق</th>
            <th>نوع اتاق</th>
            <th>هتل</th>
            <th>شهر</th>
            <th>مبلغ (ریال)</th>
          </tr>
        </thead>

       <tbody>
 <tr>
  <td>
   {{ roomIndex+1 }}
  </td>

  <td>
   {{ roomRoute?.roomName||'-' }}
  </td>

  <td>
   {{ roomRoute?.roomType||'-' }}
  </td>

  <td>
   {{ roomRoute?.hotelName||'-' }}
  </td>

  <td>
   {{ roomRoute?.cityNameFarsi||roomRoute?.cityName||'-' }}
  </td>

  <td dir="ltr">
   {{ formatPrice(roomPrice) }}
  </td>
 </tr>
</tbody>
      </table>

      <p class="voucher-note font-bold">
        ساعت تحویل اتاق ۱۴:۰۰ بعدازظهر و ساعت تخلیه اتاق ۱۲:۰۰ ظهر است.
      </p>
    </VoucherSection>

    <!-- Room supervisors -->
    <VoucherSection title="مشخصات سرپرست اتاق">
      <table class="voucher-table">
        <thead>
          <tr>
            <th>نام</th>
            <th>نام خانوادگی</th>
            <th>رده سنی</th>
            <th>نوع اتاق</th>
          </tr>
        </thead>

        <tbody>
 <tr>
  <td>
   {{ leadPassenger?.fName||'-' }}
  </td>

  <td>
   {{ leadPassenger?.lName||'-' }}
  </td>

  <td>
   {{ passengerTypeTitle(leadPassenger?.age) }}
  </td>

  <td>
   {{ roomRoute?.roomName||'-' }}
  </td>
 </tr>
</tbody>
      </table>

    
    </VoucherSection>

    <!-- Cancellation -->
    <!-- Cancellation -->
<VoucherSection
 v-if="Number(roomRoute?.hotelId)===3"
 title="شرایط انصراف و هزینه ابطال"
>
 <table class="voucher-table cancellation-table">
  <thead>
   <tr>
    <th class="w-14">
     ردیف
    </th>

    <th>
     (بدون احتساب روزهای تعطیل)زمان اعلام تغییرات
    </th>

    <th>
     میزان هزینه ابطال
    </th>
   </tr>
  </thead>

  <tbody>
   <tr>
    <td>1</td>

    <td>
     تا ساعت 10 صبح (7) روز قبل از تاریخ عزیمت
    </td>

    <td>
     10 درصد هزینه یک شب
    </td>
   </tr>

   <tr>
    <td>2</td>

    <td>
     از ساعت 10 صبح (7) روز قبل، تا ساعت 10 صبح (2) روز قبل از تاریخ عزیمت
    </td>

    <td>
     50 درصد هزینه یک شب
    </td>
   </tr>

   <tr>
    <td>3</td>

    <td>
     تا ساعت 10 صبح (2) روز قبل از تاریخ عزیمت تا روز ورود یا پس از آن
    </td>

    <td>
     100 درصد هزینه یک شب
    </td>
   </tr>

   <tr>
    <td>4</td>

    <td colspan="2">
     میهمانانی که در هتل اقامت داشته و به دلایلی اقامت خود را کاهش دهند،مشمول یک شب جریمه خواهند بود.
    </td>
   </tr>

   <tr>
    <td>5</td>

    <td colspan="2">
     در صورت انصراف اتاق رزرو شده برای ایام ویژه تعطیلات نوروزی (از 27 اسفند لغایت 15 فروردین) تا دو هفته قبل از تاریخ استفاده از هتل شامل هزینه یک شب از تعداد اتاق‌های رزرو شده کسر میگردد و کمتر از دو هفته قبل از تاریخ استفاده از هتل شامل صد درصد هزینه کل اتاق‌های رزرو شده بوده و هیچگونه وجهی به مهمان محترم مسترد نمی گردد.
    </td>
   </tr>
  </tbody>
 </table>
</VoucherSection>

    <!-- Footer -->
    <div class="voucher-footer">
      <div>
        آدرس دفتر مرکزی شرکت آهوان تهران، ضلع شمالغربی میدان آرژانتین طبقه همکف ساختمان بانک تجارت
      </div>
    <div>تلفن: ۰۲۱۴۱۸۸۹ | داخلی ۱۳۱و ۱۳۲
</div>
      <div>
        آدرس هتل آهوان چابکسر گیلان رودسر - کلاچای کیلومتر ۷ جاده ی کلاچای به چابکسر هتل بزرگ آهوان
      </div>
      <div>تلفن : ۰۱۳۴۲۰۵</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from'vue'

const props=defineProps<{
 contract:any
 route:any
 roomIndex:number
}>()

const contract=computed(
 ()=>props.contract||{}
)

const roomRoute=computed(
 ()=>props.route||null
)

const passengers=computed(
 ()=>Array.isArray(contract.value?.contractPassengers)
  ?contract.value.contractPassengers
  :[]
)

const roomPrice=computed(()=>{
 const price=Number(
  roomRoute.value?.price||
  roomRoute.value?.totalPrice||
  0
 )

 if(price>0){
  return price
 }

 const roomCount=
  Array.isArray(contract.value?.contractRoutes)
   ?contract.value.contractRoutes.length
   :1

 if(roomCount===1){
  return Number(
   contract.value?.totalPrice||0
  )
 }

 return 0
})

const leadPassenger=computed(
 ()=>passengers.value[0]||null
)

const leadPassengerFullName=computed(()=>{
 const passenger=leadPassenger.value

 if(!passenger){
  return'-'
 }

 return[
  passenger?.fName,
  passenger?.lName
 ]
  .filter(Boolean)
  .join(' ')
  .trim()||'-'
})

const passengerTypeTitle=(
 value:unknown
):string=>{
 const type=String(value||'')
  .trim()
  .toUpperCase()

 if(type==='CHD'){
  return'کودک'
 }

 if(type==='INF'){
  return'نوزاد'
 }

 return'مسافر عادی'
}

const formatPrice=(
 value:unknown
):string=>{
 const price=Number(value||0)

 if(!Number.isFinite(price)){
  return'0'
 }

 return new Intl.NumberFormat(
  'fa-IR'
 ).format(price)
}

const formatDate=(
 value:unknown
):string=>{
 const raw=String(value||'').trim()

 if(!raw){
  return'-'
 }

 const normalized=
  raw.includes('T')
   ?raw
   :`${raw}T00:00:00`

 const date=new Date(normalized)

 if(Number.isNaN(date.getTime())){
  return raw
 }

 return date.toLocaleDateString(
  'fa-IR',
  {
   year:'numeric',
   month:'2-digit',
   day:'2-digit'
  }
 )
}


</script>

<style scoped>
.hotel-voucher{
  font-family:Tahoma,Arial,sans-serif;
  min-height:720px;
  border:1px solid #9ca3af;
  overflow:hidden;
}

.voucher-header{
  display:grid;
  grid-template-columns:1fr 1fr;
  min-height:160px;
  background:#f0e5d5;
  border-bottom:6px solid #163f8c;
}

.header-illustration{
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
}

.illustration-placeholder{
  width:85%;
  height:110px;
  border:2px dashed #bbb;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#163f8c;
  font-size:28px;
  font-weight:900;
}

.header-brand{
  background:#173f8c;
  color:#fff;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  padding:16px;
}

.brand-small{
  font-size:28px;
}

.brand-title{
  margin-top:-4px;
  font-size:58px;
  font-weight:900;
  color:#f3c18d;
  line-height:1;
}

.brand-company{
  margin-top:10px;
  font-size:12px;
  text-align:center;
}

.meta-row{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:10px;
  padding:14px 16px;
  border-bottom:1px solid #9ca3af;
  font-size:15px;
}

.voucher-table{
  width:100%;
  border-collapse:collapse;
  table-layout:fixed;
}

.voucher-table th,
.voucher-table td{
  border:1px solid #9ca3af;
  padding:8px 6px;
  text-align:center;
  vertical-align:middle;
  font-size:13px;
}

.voucher-table th{
  background:rgba(255,255,255,.2);
  font-weight:800;
}

.voucher-note{
  margin-top:7px;
  text-align:center;
  font-size:11px;
  line-height:1.9;
}

.important-note{
  margin-top:6px;
  background:#13a8a7;
  padding:5px 10px;
  text-align:center;
  font-size:11px;
  font-weight:800;
}

.voucher-footer{
  background:#173f8c;
  color:#fff;
  text-align:center;
  font-size:11px;
  line-height:1.9;
  padding:9px 15px;
}

@media print{
  .hotel-voucher{
    width:100%;
    max-width:none;
    border:0;
    min-height:auto;
    print-color-adjust:exact;
    -webkit-print-color-adjust:exact;
  }

  .voucher-header,
  .header-brand,
  .important-note,
  .voucher-footer{
    print-color-adjust:exact;
    -webkit-print-color-adjust:exact;
  }
}
</style>