<template>
  <div
    ref="voucherWrapper"
    class="voucher-responsive-shell"
  >
    <div
      class="voucher-scale-layer"
      :style="voucherScaleStyle"
    >
      <div
        class="hotel-voucher"
        dir="rtl"
      >
        <div class="voucher-content">

          <!-- ================================= -->
          <!-- Contract Meta -->
          <!-- ================================= -->
          <div class="meta-row">

            <div>
              شماره قرارداد:
              <strong>
                {{ contract?.id || '-' }}
              </strong>
            </div>

            <div>
              ساعت رزرو:
              <strong>
                {{ contract?.issueTime || '-' }}
              </strong>
            </div>

            <div>
              تاریخ رزرو:
              <strong>
                {{ formatDate(contract?.issueDate) }}
              </strong>
            </div>

          </div>


          <!-- ================================= -->
          <!-- Buyer -->
          <!-- ================================= -->
          <VoucherSection
            title="مشخصات درخواست‌دهنده (خریدار)"
          >
            <table class="voucher-table">
              <thead>
                <tr>
                  <th>
                    نام و نام خانوادگی
                  </th>

                  <th>
                    کد ملی
                  </th>

                  <th>
                    نوع مهمان
                  </th>

                  <th>
                    موبایل
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    {{ leadPassengerFullName }}
                  </td>

                  <td dir="ltr">
                    {{
                      leadPassenger?.codeMelli ||
                      '-'
                    }}
                  </td>

                  <td>
                    {{
                      passengerTypeTitle(
                        leadPassenger?.age
                      )
                    }}
                  </td>

                  <td dir="ltr">
                    {{
                      contract?.userName ||
                      '-'
                    }}
                  </td>
                </tr>
              </tbody>
            </table>


            <!-- تاریخ اقامت -->
            <table
              class="
                voucher-table
                voucher-table-secondary
              "
            >
              <thead>
                <tr>
                  <th>
                    تاریخ ورود
                  </th>

                  <th>
                    تاریخ خروج
                  </th>

                  <th>
                    تعداد شب
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    {{
                      formatDate(
                        roomRoute?.checkIn
                      )
                    }}
                  </td>

                  <td>
                    {{
                      formatDate(
                        roomRoute?.checkOut
                      )
                    }}
                  </td>

                  <td>
                    {{
                      roomRoute?.stayNights ??
                      roomRoute?.nights ??
                      '-'
                    }}
                    شب
                  </td>
                </tr>
              </tbody>
            </table>


            <p class="voucher-note">
              در صورت تمایل به هرگونه تغییر یا کنسلی،
              حتماً با پشتیبانی هماهنگ شود.
            </p>

          </VoucherSection>


          <!-- ================================= -->
          <!-- Rooms -->
          <!-- ================================= -->
          <VoucherSection
            title="مشخصات اتاق(ها)"
          >
            <table class="voucher-table">
              <thead>
                <tr>

                  <th class="row-number">
                    ردیف
                  </th>

                  <th>
                    نام اتاق
                  </th>

                  <th>
                    نوع اتاق
                  </th>

                  <th>
                    هتل
                  </th>

                  <th>
                    شهر
                  </th>

                  <th>
                    مبلغ (ریال)
                  </th>

                </tr>
              </thead>

              <tbody>
                <tr>

                  <td>
                    {{ roomIndex + 1 }}
                  </td>

                  <td>
                    {{
                      roomRoute?.roomName ||
                      '-'
                    }}
                  </td>

                  <td>
                    {{
                      roomRoute?.roomType ||
                      '-'
                    }}
                  </td>

                  <td>
                    {{
                      roomRoute?.hotelName ||
                      '-'
                    }}
                  </td>

                  <td>
                    {{
                      roomRoute?.cityNameFarsi ||
                      roomRoute?.cityName ||
                      '-'
                    }}
                  </td>

                  <td dir="ltr">
                    {{
                      formatPrice(
                        roomPrice
                      )
                    }}
                  </td>

                </tr>
              </tbody>
            </table>


            <p
              v-if="
                roomRoute
                  ?.description
                  ?.trim()
              "
              class="voucher-note"
            >
              {{ roomRoute.description }}
            </p>


            <p
              class="
                voucher-note
                font-bold
              "
            >
              ساعت تحویل اتاق ۱۴:۰۰ بعدازظهر
              و ساعت تخلیه اتاق ۱۲:۰۰ ظهر است.
            </p>

          </VoucherSection>


          <!-- ================================= -->
          <!-- Room Supervisor -->
          <!-- ================================= -->
          <VoucherSection
            title="مشخصات سرپرست اتاق"
          >
            <table class="voucher-table">
              <thead>
                <tr>

                  <th>
                    نام
                  </th>

                  <th>
                    نام خانوادگی
                  </th>

                  <th>
                    رده سنی
                  </th>

                </tr>
              </thead>

              <tbody>
                <tr>

                  <td>
                    {{
                      leadPassenger?.fName ||
                      '-'
                    }}
                  </td>

                  <td>
                    {{
                      leadPassenger?.lName ||
                      '-'
                    }}
                  </td>

                  <td>
                    {{
                      passengerTypeTitle(
                        leadPassenger?.age
                      )
                    }}
                  </td>

                </tr>
              </tbody>
            </table>


            <p
              v-if="
                leadPassenger
                  ?.description
                  ?.trim()
              "
              class="voucher-note"
            >
              {{
                leadPassenger.description
              }}
            </p>


            <p
              v-if="
                contract?.printContractDesc === true &&
                contract?.contractDesc?.trim()
              "
              class="
                voucher-note
                contract-description
              "
            >
              {{
                contract.contractDesc
              }}
            </p>

          </VoucherSection>


          <!-- ================================= -->
          <!-- Cancellation -->
          <!-- ================================= -->
          <VoucherSection
            v-if="
              Number(
                roomRoute?.hotelId
              ) === 3
            "
            title="شرایط انصراف و هزینه ابطال"
          >
            <table
              class="
                voucher-table
                cancellation-table
              "
            >
              <thead>
                <tr>

                  <th class="row-number">
                    ردیف
                  </th>

                  <th>
                    (بدون احتساب روزهای تعطیل)
                    زمان اعلام تغییرات
                  </th>

                  <th>
                    میزان هزینه ابطال
                  </th>

                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>
                    1
                  </td>

                  <td>
                    تا ساعت 10 صبح (7) روز قبل
                    از تاریخ عزیمت
                  </td>

                  <td>
                    10 درصد هزینه یک شب
                  </td>
                </tr>


                <tr>
                  <td>
                    2
                  </td>

                  <td>
                    از ساعت 10 صبح (7) روز قبل،
                    تا ساعت 10 صبح (2) روز قبل
                    از تاریخ عزیمت
                  </td>

                  <td>
                    50 درصد هزینه یک شب
                  </td>
                </tr>


                <tr>
                  <td>
                    3
                  </td>

                  <td>
                    تا ساعت 10 صبح (2) روز قبل
                    از تاریخ عزیمت تا روز ورود
                    یا پس از آن
                  </td>

                  <td>
                    100 درصد هزینه یک شب
                  </td>
                </tr>


                <tr>
                  <td>
                    4
                  </td>

                  <td colspan="2">
                    میهمانانی که در هتل اقامت داشته
                    و به دلایلی اقامت خود را کاهش دهند،
                    مشمول یک شب جریمه خواهند بود.
                  </td>
                </tr>


                <tr>
                  <td>
                    5
                  </td>

                  <td colspan="2">
                    در صورت انصراف اتاق رزرو شده برای
                    ایام ویژه تعطیلات نوروزی
                    (از 27 اسفند لغایت 15 فروردین)
                    تا دو هفته قبل از تاریخ استفاده
                    از هتل شامل هزینه یک شب از تعداد
                    اتاق‌های رزرو شده کسر می‌گردد و
                    کمتر از دو هفته قبل از تاریخ
                    استفاده از هتل شامل صد درصد هزینه
                    کل اتاق‌های رزرو شده بوده و
                    هیچگونه وجهی به مهمان محترم
                    مسترد نمی‌گردد.
                  </td>
                </tr>

              </tbody>
            </table>

          </VoucherSection>

        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref
} from 'vue'


/* ================================= */
/* Props */
/* ================================= */

const props =
  defineProps<{
    contract:any
    route:any
    roomIndex:number
  }>()


/* ================================= */
/* Responsive Preview */
/* ================================= */

const voucherWrapper =
  ref<HTMLElement | null>(
    null
  )


const voucherScale =
  ref(1)


const voucherOriginalWidth =
  ref(794)


const voucherOriginalHeight =
  ref(1123)


let resizeObserver:
  ResizeObserver | null =
  null


const voucherScaleStyle =
  computed(() => ({
    transform:
      `scale(${voucherScale.value})`
  }))


const updateVoucherScale =
  async () => {

    await nextTick()

    const wrapper =
      voucherWrapper.value

    if(!wrapper){
      return
    }

    const voucher =
      wrapper.querySelector(
        '.hotel-voucher'
      ) as HTMLElement | null

    if(!voucher){
      return
    }

    /*
     * offsetWidth/Height اندازه واقعی
     * A4 قبل از scale است.
     */
    const originalWidth =
      voucher.offsetWidth

    const originalHeight =
      voucher.offsetHeight

    if(
      !originalWidth ||
      !originalHeight
    ){
      return
    }

    voucherOriginalWidth.value =
      originalWidth

    voucherOriginalHeight.value =
      originalHeight

    const availableWidth =
      wrapper.clientWidth

    const scale =
      Math.min(
        1,
        availableWidth /
        originalWidth
      )

    voucherScale.value =
      scale

    /*
     * چون transform روی flow تاثیر ندارد،
     * ارتفاع wrapper را دستی اصلاح می‌کنیم.
     */
    wrapper.style.height =
      `${
        originalHeight *
        scale
      }px`
  }


onMounted(
  async () => {

    await updateVoucherScale()

    if(
      typeof ResizeObserver !==
      'undefined'
    ){
      resizeObserver =
        new ResizeObserver(
          () => {
            updateVoucherScale()
          }
        )

      if(
        voucherWrapper.value
      ){
        resizeObserver.observe(
          voucherWrapper.value
        )
      }
    }

    window.addEventListener(
      'resize',
      updateVoucherScale
    )
  }
)


onBeforeUnmount(
  () => {

    resizeObserver
      ?.disconnect()

    window.removeEventListener(
      'resize',
      updateVoucherScale
    )
  }
)


/* ================================= */
/* Contract */
/* ================================= */

const contract =
  computed(
    () =>
      props.contract ||
      {}
  )


const roomRoute =
  computed(
    () =>
      props.route ||
      null
  )


/* ================================= */
/* Passengers */
/* ================================= */

const passengers =
  computed(
    () =>
      Array.isArray(
        contract.value
          ?.contractPassengers
      )
        ? contract.value
            .contractPassengers
        : []
  )


const leadPassenger =
  computed(
    () =>
      passengers.value[0] ||
      null
  )


const leadPassengerFullName =
  computed(
    () => {

      const passenger =
        leadPassenger.value

      if(!passenger){
        return '-'
      }

      return [
        passenger?.fName,
        passenger?.lName
      ]
        .filter(Boolean)
        .join(' ')
        .trim() ||
        '-'
    }
  )


/* ================================= */
/* Price */
/* ================================= */

const roomPrice =
  computed(
    () => {

      const price =
        Number(
          roomRoute.value
            ?.price ||
          roomRoute.value
            ?.totalPrice ||
          0
        )

      if(price > 0){
        return price
      }

      const roomCount =
        Array.isArray(
          contract.value
            ?.contractRoutes
        )
          ? contract.value
              .contractRoutes
              .length
          : 1

      if(roomCount === 1){
        return Number(
          contract.value
            ?.totalPrice ||
          0
        )
      }

      return 0
    }
  )


/* ================================= */
/* Helpers */
/* ================================= */

const passengerTypeTitle =
  (
    value:unknown
  ):string => {

    const type =
      String(
        value || ''
      )
        .trim()
        .toUpperCase()

    if(
      type === 'CHD'
    ){
      return 'کودک'
    }

    if(
      type === 'INF'
    ){
      return 'نوزاد'
    }

    return 'مسافر عادی'
  }


const formatPrice =
  (
    value:unknown
  ):string => {

    const price =
      Number(
        value || 0
      )

    if(
      !Number.isFinite(
        price
      )
    ){
      return '0'
    }

    return new Intl.NumberFormat(
      'fa-IR'
    ).format(
      price
    )
  }


const formatDate =
  (
    value:unknown
  ):string => {

    const raw =
      String(
        value || ''
      ).trim()

    if(!raw){
      return '-'
    }

    const normalized =
      raw.includes('T')
        ? raw
        : `${raw}T00:00:00`

    const date =
      new Date(
        normalized
      )

    if(
      Number.isNaN(
        date.getTime()
      )
    ){
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

/* ================================= */
/* Responsive Wrapper */
/* ================================= */

.voucher-responsive-shell{
  position:relative;

  width:100%;
  max-width:210mm;

  margin:
    0 auto;

  overflow:hidden;
}


.voucher-scale-layer{
  position:absolute;

  top:0;
  left:50%;

  width:210mm;
  height:297mm;

  transform-origin:
    top center;

  /*
   * left 50% + translate باعث
   * وسط‌چین شدن در موبایل می‌شود
   */
  margin-left:
    -105mm;
}


/* ================================= */
/* A4 Voucher */
/* ================================= */

.hotel-voucher{
  position:relative;

  width:210mm;
  height:297mm;

  box-sizing:
    border-box;

  overflow:
    hidden;

  font-family:
    Tahoma,
    Arial,
    sans-serif;

  color:
    #1f2937;

  background-image:
    url('/imgs/hotel/Voucher.jpg');

  background-repeat:
    no-repeat;

  background-position:
    top center;

  background-size:
    100% 100%;

  background-color:
    #f7f1e7;

  print-color-adjust:
    exact;

  -webkit-print-color-adjust:
    exact;
}


/* ================================= */
/* Content Area */
/* ================================= */

.voucher-content{
  position:absolute;

  /*
   * پایین هدر سربرگ
   */
  top:58mm;

  /*
   * بالای Footer سربرگ
   */
  bottom:40mm;

  left:8mm;
  right:8mm;

  overflow:hidden;

  display:flex;
  flex-direction:column;

  gap:4px;
}


/* ================================= */
/* Meta */
/* ================================= */

.meta-row{
  display:grid;

  grid-template-columns:
    repeat(
      3,
      minmax(0,1fr)
    );

  gap:4px;

  padding:
    5px 8px;

  border:
    1px solid
    rgba(
      23,
      63,
      140,
      .7
    );

  border-radius:
    5px;

  background:
    rgba(
      255,
      255,
      255,
      .72
    );

  font-size:
    14px;

  text-align:
    center;
}


/* ================================= */
/* Tables */
/* ================================= */

.voucher-table{
  width:100%;

  border-collapse:
    collapse;

  table-layout:
    fixed;

  background:
    transparent;
}


.voucher-table-secondary{
  margin-top:
    6px;
}


.voucher-table th,
.voucher-table td{
  border:
    1px solid
    rgba(
      23,
      63,
      140,
      .65
    );

  padding:
    5px 4px;

  text-align:
    center;

  vertical-align:
    middle;

  font-size:
    14px;

  font-weight:
    bold;

  line-height:
    0.9;

  background:
    rgba(
      255,
      255,
      255,
      .68
    );

  overflow-wrap:
    anywhere;
}


.voucher-table th{
  color:
    #173f8c;

  font-weight:
    800;

  background:
    rgba(
      240,
      229,
      213,
      .86
    );
}


.row-number{
  width:
    40px;
}


/* ================================= */
/* Notes */
/* ================================= */

.voucher-note{
  font-weight:
    bold;

  margin-top:
    6px;

  margin-bottom:
    5px;

  text-align:
    center;

  font-size:
    12px;

  line-height:
    1.5;

  color:
    #374151;
}


.contract-description{
  white-space:
    pre-line;
}


/* ================================= */
/* Cancellation */
/* ================================= */

.cancellation-table th,
.cancellation-table td{
  padding:
    4px;

  font-size:
    12px;

  line-height:
    1.3;
}


/* ================================= */
/* PDF Export */
/* ================================= */

/*
 * این کلاس فقط هنگام html2canvas
 * فعال می‌شود.
 */

.hotel-voucher.pdf-exporting
.meta-row{
  font-size:
    11px !important;

  padding-top:
    7px !important;

  padding-bottom:
    7px !important;
}


.hotel-voucher.pdf-exporting
.voucher-table th,
.hotel-voucher.pdf-exporting
.voucher-table td{
  font-size:
    11px !important;

  line-height:
    1.4 !important;

  /*
   * جدول در PDF بلندتر و بازتر
   */
  padding-top:
    9px !important;

  padding-bottom:
    9px !important;

  padding-left:
    4px !important;

  padding-right:
    4px !important;
}


.hotel-voucher.pdf-exporting
.voucher-note{
  font-size:
    9.5px !important;

  line-height:
    1.5 !important;

  margin-top:
    5px !important;

  margin-bottom:
    8px !important;
}


.hotel-voucher.pdf-exporting
.cancellation-table th,
.hotel-voucher.pdf-exporting
.cancellation-table td{
  font-size:
    9px !important;

  line-height:
    1.3 !important;

  padding:
    6px 4px !important;
}


.hotel-voucher.pdf-exporting
.voucher-content{
  top:
    50mm !important;

  /*
   * فضای بیشتر برای Footer
   */
  bottom:
    48mm !important;
}


/* ================================= */
/* Mobile */
/* ================================= */

@media (max-width:768px){

  .voucher-responsive-shell{
    width:100%;
  }

  /*
   * فقط Preview موبایل
   * روی PDF اعمال نمی‌شود
   */
  .hotel-voucher:not(.pdf-exporting)
  .voucher-content{
    left:6mm;
    right:6mm;

    gap:2px;
  }

  .hotel-voucher:not(.pdf-exporting)
  .meta-row{
    gap:2px;

    padding:
      4px 3px;

    font-size:
      10px;

    line-height:
      1.25;
  }

  .hotel-voucher:not(.pdf-exporting)
  .voucher-table th,
  .hotel-voucher:not(.pdf-exporting)
  .voucher-table td{
    padding:
      5px 3px;

    font-size:
      11px;

    line-height:
      2.9;

    white-space:
      normal;

    word-break:
      break-word;

    overflow-wrap:
      anywhere;
  }

  .hotel-voucher:not(.pdf-exporting)
  .voucher-table th{
    font-size:
      10px;
  }

  .hotel-voucher:not(.pdf-exporting)
  .voucher-table-secondary{
    margin-top:
      3px;
  }

  .hotel-voucher:not(.pdf-exporting)
  .voucher-note{
    margin-top:
      3px;

    margin-bottom:
      3px;

    font-size:
      9px;

    line-height:
      1.3;
  }

  .hotel-voucher:not(.pdf-exporting)
  .cancellation-table th,
  .hotel-voucher:not(.pdf-exporting)
  .cancellation-table td{
    padding:
      2px;

    font-size:
      8.5px;

    line-height:
      1.25;
  }

  .hotel-voucher:not(.pdf-exporting)
  .row-number{
    width:
      28px;
  }
}


/* ================================= */
/* Print */
/* ================================= */

@media print{

  .voucher-responsive-shell{
    width:
      210mm !important;

    height:
      297mm !important;

    max-width:
      none !important;

    overflow:
      visible !important;
  }


  .voucher-scale-layer{
    position:
      static !important;

    width:
      210mm !important;

    height:
      297mm !important;

    margin:
      0 !important;

    transform:
      none !important;
  }


  .hotel-voucher{
    width:
      210mm !important;

    height:
      297mm !important;

    margin:
      0 !important;

    border:
      0 !important;

    overflow:
      hidden !important;

    print-color-adjust:
      exact;

    -webkit-print-color-adjust:
      exact;
  }


  .voucher-content{
    top:
      58mm;

    bottom:
      48mm;
  }

}

</style>