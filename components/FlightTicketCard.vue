<template>

  <div 

    class="bg-white rounded-xl border-1 border-[var(--color-gray-100)] overflow-hidden shadow-md transition-opacity"

    :class="cardDisabled ? 'opacity-60 pointer-events-none select-none' : ''"

  >

    <div class="min-h-[200px] flex flex-col md:flex-row-reverse relative z-10 bg-white">

      <div class="flex-1 border-[var(--color-gray-100)] order-2 border-t-2 md:border-t-0 md:border-r-1 border-dashed relative p-3 pb-12 flex flex-col justify-center">

        <div class="flex items-center w-full md:flex-col">

          <template v-if="cardDisabled">

            <div class="w-full text-center py-6">

              <p class="font-bold text-[18px] text-red-500">

                {{ statusMessage }}

              </p>

            </div>

          </template>



        <template v-else>

  <div

 v-if="!props.hideSelectButton"

 class="

  order-1

  flex

  flex-1

  flex-col

  items-end

  md:order-2

  md:items-stretch

 "

>

 <UiBaseButton

  label="انتخاب پرواز"

  variant="filled"

  color="primary"

  :active="false"

  :disabled="false"

  class="

   !h-[42px]

   !w-auto

   min-w-[135px]

   !rounded-xl

   !px-5

   !py-0

   text-[12px]

   font-bold

   text-white

   shadow-md

   transition

   duration-200

   hover:-translate-y-0.5



   md:mt-5

   md:!h-auto

   md:!w-full

   md:min-w-0

   md:!rounded-3xl

   md:!py-2

  "

  @click="selectFlight"

 />



 <p

  v-if="capacityError"

  class="

   mt-2

   max-w-[160px]

   text-center

   text-[11px]

   font-bold

   text-red-500

   md:max-w-none

   md:text-[12px]

  "

  dir="rtl"

 >

  {{ capacityError }}

 </p>

</div>



 <div

 class="

  flex-[3]

  order-2

  md:order-1

 "

>

 <div

  class="

   flex

   items-baseline

   justify-start

   gap-1.5

  "

  dir="rtl"

 >

  <span

   class="

    text-[22px]

    font-bold

    text-[var(--color-primary-dark)]

   "

  >

   {{ formatPrice(cardPrice) }}

  </span>



  <span

   class="

    text-[12px]

    font-medium

    text-gray-500

   "

  >

   ریال

  </span>

 </div>

</div>

</template>

        </div>



        <div class="absolute -bottom-3 right-0 w-full flex justify-center md:justify-start gap-4 p-3 md:hidden">

          <button

            @click="toggleTab('rules')"

            :class="activeTab === 'rules' ? 'text-blue-600 font-bold bg-gray-300' : 'text-gray-500 font-medium'"

            class="text-[12px] hover:text-blue-600 transition-colors duration-300 transition-all rounded-sm py-2 px-2"

          >

            قوانین کنسلی

          </button>

          <button

            @click="toggleTab('info')"

            :class="activeTab === 'info' ? 'text-blue-600 font-bold' : 'text-gray-500 font-medium'"

            class="text-[12px] hover:text-blue-600 transition-colors duration-300 transition-all rounded-sm py-2 px-2"

          >

            اطلاعات پرواز

          </button>

        </div>



    <div

  v-if="!cardDisabled"

  class="hidden absolute bottom-0 w-full text-center pb-2 md:block"

  dir="rtl"

>

  <p class="text-red-500 text-[12px] font-bold">

    {{ capacityText }}

  </p>



  <p

    class="mt-1 text-[11px] font-bold"

    :class="

      displayRefundable

        ?'text-green-600'

        :'text-red-600'

    "

  >

    {{

      displayRefundable

        ?'قابل استرداد'

        :'غیرقابل استرداد'

    }}

  </p>

</div>

      </div>



      <div class="flex-[3] order-1 relative p-3 pb-12 flex flex-col">

        <div class="flex md:flex-col">

          <div class="flex-1 flex flex-col justify-start py-4 items-start md:hidden">

            <img

              v-if="airlineLogo"

              :src="airlineLogo"

              class="w-[105px] max-h-[55px] object-contain"

              :alt="airlineName"

              @error="handleLogoError"

            >

            <p

              v-if="isParto"

              class="mt-2 text-[12px] font-bold text-gray-700"

              dir="rtl"

            >

              {{ airlineName }}

            </p>

          </div>



          <div class="flex-[1] text-end">

            <UiBaseLabel

              class="mr-2 text-[12px]"

              :text="flightTypeLabel"

              color="#2629A6"

            />

            <UiBaseLabel

              class="mr-2 text-[12px]"

              :text="cabinLabel"

              color="#2629A6"

            />

          </div>

        </div>



       <div class="flex gap-5 mt-2">

  <div class="flex-[3]">



    <!-- ======================== -->

    <!-- مسیر رفت -->

    <!-- ======================== -->



    <div class="mt-4 flex items-center gap-3 text-gray-400 text-sm">

      <div class="flex items-center gap-1">

        <span class="text-[12px]">مقصد</span>

        <i class="bi bi-geo-alt"></i>

      </div>



      <div class="flex-1 relative flex justify-center items-center">

        <svg

          class="w-full h-7"

          viewBox="0 0 346 27"

          fill="none"

          preserveAspectRatio="none"

        >

          <path

            d="M1 26C1 26 119.005 0.5 173.5 0.5C227.995 0.5 345 26 345 26"

            stroke="#B3B3B3"

            stroke-dasharray="4 4"

          />

        </svg>



        <i

          class="bi bi-airplane-fill absolute -top-2 w-5 h-5 -rotate-[90deg] text-gray-400 bg-white text-xl"

        ></i>

      </div>



      <div class="flex flex-row-reverse items-center gap-1">

        <span class="text-[12px]">مبدا</span>

        <i class="bi bi-geo-alt"></i>

      </div>

    </div>



    <div class="mt-4 flex justify-between text-sm text-gray-600">

      <span class="text-[16px] -mt-5">

        {{ destinationCity }}

      </span>



      <span class="text-[16px] -mt-5">

        {{ originCity }}

      </span>

    </div>



    <div class="mt-1 flex justify-between text-sm text-gray-600">

      <span class="text-[12px]">

        {{ arrivalTime }}

      </span>



      <span class="text-[12px]">

        {{ departureTime }}

      </span>

    </div>



    <!-- وضعیت توقف رفت - فقط PARTO -->

    <div

      v-if="isParto"

      class="mt-1 text-center"

      dir="rtl"

    >

      <p

        class="text-[11px] font-bold"

        :class="

          outboundStopCount>0

            ?'text-orange-500'

            :'text-green-600'

        "

      >

        {{ outboundStopLabel }}

      </p>



      <p

        v-if="outboundStopAirports.length"

        class="mt-1 text-[10px] text-gray-500"

      >

        توقف در

        {{

          outboundStopAirports

            .map(getCityLabel)

            .join('، ')

        }}

      </p>

    </div>



    <div class="mt-1 flex justify-center text-sm text-gray-500">

      <span

        dir="rtl"

        class="text-[12px]"

      >

        {{ departureDateLabel }}

      </span>

    </div>





    <!-- ======================== -->

    <!-- مسیر برگشت -->

    <!-- ======================== -->



    <template v-if="isRoundTripView">

      <div class="mt-5 flex items-center gap-3 text-gray-400 text-sm">

        <div class="flex items-center gap-1">

          <span class="text-[12px]">مقصد</span>

          <i class="bi bi-geo-alt"></i>

        </div>



        <div class="flex-1 relative flex justify-center items-center">

          <svg

            class="w-full h-7"

            viewBox="0 0 346 27"

            fill="none"

            preserveAspectRatio="none"

          >

            <path

              d="M1 26C1 26 119.005 0.5 173.5 0.5C227.995 0.5 345 26 345 26"

              stroke="#B3B3B3"

              stroke-dasharray="4 4"

            />

          </svg>



          <i

            class="bi bi-airplane-fill absolute -top-2 w-5 h-5 rotate-[90deg] text-gray-400 bg-white text-xl"

          ></i>

        </div>



        <div class="flex flex-row-reverse items-center gap-1">

          <span class="text-[12px]">مبدا</span>

          <i class="bi bi-geo-alt"></i>

        </div>

      </div>



      <div class="mt-4 flex justify-between text-sm text-gray-600">

        <span class="text-[16px]">

          {{ returnDestinationCity }}

        </span>



        <span class="text-[16px]">

          {{ returnOriginCity }}

        </span>

      </div>



      <div class="mt-1 flex justify-between text-sm text-gray-600">

        <span class="text-[12px]">

          {{ returnArrivalTime }}

        </span>



        <span class="text-[12px]">

          {{ returnDepartureTime }}

        </span>

      </div>



      <!-- وضعیت توقف برگشت - فقط PARTO -->

      <div

        v-if="isParto"

        class="mt-1 text-center"

        dir="rtl"

      >

        <p

          class="text-[11px] font-bold"

          :class="

            returnStopCount>0

              ?'text-orange-500'

              :'text-green-600'

          "

        >

          {{ returnStopLabel }}

        </p>



        <p

          v-if="returnStopAirports.length"

          class="mt-1 text-[10px] text-gray-500"

        >

          توقف در

          {{

            returnStopAirports

              .map(getCityLabel)

              .join('، ')

          }}

        </p>

      </div>



      <div class="mt-1 flex justify-center text-sm text-gray-500">

        <span

          dir="rtl"

          class="text-[12px]"

        >

          {{

            formatFlightDateShort(

              flight.returnDeparture

            )

          }}

        </span>

      </div>

    </template>

  </div>





  <!-- لوگو -->

  <div

    class="hidden md:flex md:flex-1 md:flex-col md:justify-center md:items-end"

  >

    <img

      v-if="airlineLogo"

      :src="airlineLogo"

      class="w-[150px] max-h-[70px] object-contain"

      :alt="airlineName"

      @error="handleLogoError"

    >

    <p

      v-if="isParto"

      class="mt-2 w-[150px] text-center text-[13px] font-bold text-gray-700"

      dir="rtl"

    >

      {{ airlineName }}

    </p>

  </div>

</div>



       <div

  v-if="!cardDisabled"

  class="absolute bottom-0 w-full text-center pb-2 md:hidden"

  dir="rtl"

>

  <p class="text-red-500 text-[12px] font-bold">

    {{ capacityText }}

  </p>



  <p

    class="mt-1 text-[11px] font-bold"

    :class="

      displayRefundable

        ?'text-green-600'

        :'text-red-600'

    "

  >

    {{

      displayRefundable

        ?'قابل استرداد'

        :'غیرقابل استرداد'

    }}

  </p>

</div>



        <div class="hidden absolute -bottom-3 left-3 w-full md:flex justify-center md:justify-end p-3">

          <button

            @click="toggleTab('rules')"

            :class="activeTab === 'rules'

              ? 'text-blue-600 font-bold bg-gray-100'

              : 'text-gray-500 font-medium'"

            class="text-[12px] hover:text-blue-600 duration-300 transition-all rounded-t-sm py-2 px-2"

          >

            قوانین کنسلی

          </button>



          <button

            @click="toggleTab('info')"

            :class="activeTab === 'info'

              ? 'text-blue-600 font-bold bg-gray-100'

              : 'text-gray-500 font-medium'"

            class="text-[12px] hover:text-blue-600 transition-colors duration-300 transition-all rounded-t-sm py-2 px-2"

          >

            اطلاعات پرواز

          </button>

        </div>

      </div>

    </div>



    <div

      class="grid transition-all duration-300 ease-in-out bg-gray-50"

      :class="activeTab ? 'grid-rows-[1fr] opacity-100 border-t-2 border-gray-200' : 'grid-rows-[0fr] opacity-0'"

    >

      <div class="overflow-hidden">

        <Transition name="fade-slide" mode="out-in">

          <div
            v-if="activeTab === 'rules'"
            key="rules-tab"
            class="
              flex
              flex-col
              bg-gray-50
              md:flex-row
            "
          >

            <!-- ========================= -->
            <!-- خلاصه قیمت -->
            <!-- ========================= -->
            <aside
              class="
                order-2
                flex-1
                border-t
                border-gray-200
                bg-white
                p-4
                md:order-1
                md:border-l
                md:border-t-0
                md:p-5
              "
              dir="rtl"
            >

              <div class="mb-4 flex items-center gap-2">
                <span
                  class="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--color-primary-light)]
                    text-[var(--color-primary-dark)]
                  "
                >
                  <i class="bi bi-receipt"></i>
                </span>

                <div>
                  <h4 class="text-[13px] font-black text-gray-800">
                    خلاصه قیمت
                  </h4>

                  <p class="mt-0.5 text-[10px] text-gray-400">
                    مبلغ بر اساس مسافران انتخاب‌شده
                  </p>
                </div>
              </div>


              <div class="space-y-2">

                <template v-if="panelPassengerPrices.length">

                  <div
                    v-for="(item,index) in panelPassengerPrices"
                    :key="`rule-passenger-${index}`"
                    class="
                      flex
                      items-center
                      justify-between
                      gap-3
                      rounded-xl
                      border
                      border-gray-100
                      bg-gray-50
                      px-3
                      py-3
                    "
                  >

                    <div class="flex items-center gap-2">

                      <span
                        class="
                          flex
                          h-8
                          min-w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-white
                          px-2
                          text-[10px]
                          font-bold
                          text-gray-500
                          shadow-sm
                        "
                      >
                        ×{{ item.count }}
                      </span>

                      <span class="text-[11px] font-bold text-gray-700">
                        {{ item.label }}
                      </span>

                    </div>


                    <div class="text-left">

                      <span class="text-[12px] font-black text-gray-800">
                        {{ formatPrice(item.total) }}
                      </span>

                      <span class="mr-1 text-[9px] text-gray-400">
                        ریال
                      </span>

                    </div>

                  </div>

                </template>


                <template v-else>

                  <div
                    class="
                      flex
                      items-center
                      justify-between
                      gap-3
                      rounded-xl
                      border
                      border-gray-100
                      bg-gray-50
                      px-3
                      py-3
                    "
                  >

                    <div class="flex items-center gap-2">

                      <span
                        class="
                          flex
                          h-8
                          min-w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-white
                          px-2
                          text-[10px]
                          font-bold
                          text-gray-500
                          shadow-sm
                        "
                      >
                        ×1
                      </span>

                      <span class="text-[11px] font-bold text-gray-700">
                        بزرگسال
                      </span>

                    </div>


                    <div class="text-left">

                      <span class="text-[12px] font-black text-gray-800">
                        {{ formatPrice(cardPrice) }}
                      </span>

                      <span class="mr-1 text-[9px] text-gray-400">
                        ریال
                      </span>

                    </div>

                  </div>

                </template>

              </div>


              <div
                class="
                  mt-4
                  rounded-2xl
                  bg-[var(--color-primary-dark)]
                  px-4
                  py-4
                  text-white
                  shadow-sm
                "
              >

                <div class="flex items-center justify-between gap-3">

                  <div>
                    <p class="text-[10px] text-white/70">
                      مبلغ کل
                    </p>

                    <p class="mt-1 text-[10px] text-white/60">
                      برای همه مسافران
                    </p>
                  </div>


                  <div class="text-left">

                    <span class="text-[18px] font-black">
                      {{ formatPrice(panelTotalPrice) }}
                    </span>

                    <span class="mr-1 text-[10px] text-white/70">
                      ریال
                    </span>

                  </div>

                </div>

              </div>

            </aside>


            <!-- ========================= -->
            <!-- قوانین کنسلی -->
            <!-- ========================= -->
            <section
              class="
                order-1
                flex-[3]
                p-4
                md:order-2
                md:p-5
              "
              dir="rtl"
            >

              <!-- Header -->
              <div class="mb-5 flex items-start justify-between gap-3">

                <div class="flex items-center gap-3">

                  <span
                    class="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-red-50
                      text-red-500
                    "
                  >
                    <i class="bi bi-arrow-counterclockwise text-[17px]"></i>
                  </span>


                  <div>

                    <h3 class="text-[14px] font-black text-gray-800">
                      قوانین کنسلی
                    </h3>

                    <p class="mt-1 text-[10px] leading-5 text-gray-400">
                      میزان جریمه با توجه به زمان لغو پرواز محاسبه می‌شود.
                    </p>

                  </div>

                </div>


                <span
                  class="
                    hidden
                    shrink-0
                    rounded-full
                    border
                    border-gray-200
                    bg-white
                    px-3
                    py-1.5
                    text-[9px]
                    font-bold
                    text-gray-500
                    sm:inline-flex
                  "
                >
                  شرایط استرداد
                </span>

              </div>


              <!-- Notice -->
              <div
                class="
                  mb-5
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  border
                  border-amber-100
                  bg-amber-50
                  px-4
                  py-3
                "
              >

                <span
                  class="
                    mt-0.5
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    text-amber-500
                    shadow-sm
                  "
                >
                  <i class="bi bi-info-circle"></i>
                </span>


                <p class="text-[10px] leading-6 text-amber-800">
                  مبلغ نهایی استرداد ممکن است بر اساس زمان درخواست کنسلی و قوانین ایرلاین تغییر کند.
                </p>

              </div>


              <!-- ========================= -->
              <!-- PARTO -->
              <!-- ========================= -->
              <template v-if="isParto">

                <!-- Loading -->
                <div
                  v-if="loadingPartoRules"
                  class="
                    flex
                    min-h-[180px]
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                  "
                >

                  <div class="text-center">

                    <div
                      class="
                        mx-auto
                        h-8
                        w-8
                        animate-spin
                        rounded-full
                        border-2
                        border-gray-200
                        border-t-[var(--color-primary)]
                      "
                    ></div>

                    <p class="mt-3 text-[11px] text-gray-500">
                      در حال دریافت قوانین کنسلی...
                    </p>

                  </div>

                </div>


                <!-- Error -->
                <div
                  v-else-if="partoRulesError"
                  class="
                    flex
                    min-h-[150px]
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-red-100
                    bg-red-50
                    p-5
                  "
                >

                  <div class="text-center">

                    <span
                      class="
                        mx-auto
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-red-500
                        shadow-sm
                      "
                    >
                      <i class="bi bi-exclamation-triangle"></i>
                    </span>

                    <p class="mt-3 text-[11px] font-bold leading-6 text-red-500">
                      {{ partoRulesError }}
                    </p>

                  </div>

                </div>


                <!-- Rules -->
                <div
                  v-else-if="partoRules.length"
                  class="space-y-4"
                >

                  <article
                    v-for="(rule,index) in partoRules"
                    :key="`parto-rule-${index}`"
                    class="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-gray-100
                      bg-white
                      shadow-sm
                    "
                  >

                    <!-- Rule Header -->
                    <div
                      class="
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                        border-b
                        border-gray-100
                        bg-gray-50/70
                        px-4
                        py-3
                      "
                    >

                      <div class="flex items-center gap-2">

                        <span
                          class="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-white
                            text-[var(--color-primary-dark)]
                            shadow-sm
                          "
                        >
                          <i class="bi bi-shield-check"></i>
                        </span>


                        <div>

                          <p class="text-[11px] font-black text-gray-800">
                            {{ rule.categoryFa || 'قوانین کنسلی' }}
                          </p>

                          <p
                            v-if="rule.airline"
                            class="mt-0.5 text-[9px] text-gray-400"
                          >
                            ایرلاین:
                            {{ rule.airline }}
                          </p>

                        </div>

                      </div>


                      <span
                        v-if="rule.cityPair"
                        dir="ltr"
                        class="
                          rounded-full
                          border
                          border-gray-200
                          bg-white
                          px-3
                          py-1.5
                          text-[9px]
                          font-bold
                          text-gray-500
                        "
                      >
                        {{ rule.cityPair }}
                      </span>

                    </div>


                    <!-- Rule Sections -->
                    <div class="space-y-3 p-4">

                      <div
                        v-for="(section,sectionIndex) in rule.sections"
                        :key="`section-${sectionIndex}`"
                        class="
                          rounded-xl
                          border
                          border-gray-100
                          bg-gray-50
                          p-3
                        "
                      >

                        <div
                          class="
                            mb-2
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <span
                            class="
                              h-2
                              w-2
                              shrink-0
                              rounded-full
                              bg-[var(--color-primary)]
                            "
                          ></span>

                          <p
                            class="
                              text-[10px]
                              font-black
                              text-gray-700
                            "
                            :dir="
                              rule.rulesFa
                                ?'rtl'
                                :'ltr'
                            "
                          >
                            {{ section.title }}
                          </p>

                        </div>


                        <p
                          class="
                            whitespace-pre-line
                            text-[10px]
                            leading-7
                            text-gray-600
                          "
                          :dir="
                            rule.rulesFa
                              ?'rtl'
                              :'ltr'
                          "
                        >
                          {{ section.text }}
                        </p>

                      </div>

                    </div>

                  </article>

                </div>


                <!-- Empty -->
                <div
                  v-else
                  class="
                    flex
                    min-h-[150px]
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    p-5
                  "
                >

                  <div class="text-center">

                    <span
                      class="
                        mx-auto
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-gray-100
                        text-gray-400
                      "
                    >
                      <i class="bi bi-file-earmark-x"></i>
                    </span>

                    <p class="mt-3 text-[11px] font-bold text-gray-500">
                      قوانین کنسلی برای این پرواز اعلام نشده است.
                    </p>

                  </div>

                </div>

              </template>


              <!-- ========================= -->
              <!-- NIRA / MAHAN -->
              <!-- ========================= -->
              <template v-else>

                <!-- Loading -->
                <div
                  v-if="loadingFare"
                  class="
                    flex
                    min-h-[180px]
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                  "
                >

                  <div class="text-center">

                    <div
                      class="
                        mx-auto
                        h-8
                        w-8
                        animate-spin
                        rounded-full
                        border-2
                        border-gray-200
                        border-t-[var(--color-primary)]
                      "
                    ></div>

                    <p class="mt-3 text-[11px] text-gray-500">
                      در حال دریافت اطلاعات نرخ و قوانین...
                    </p>

                  </div>

                </div>


                <!-- Rules -->
                <div
                  v-else-if="refundPolicies.length>0"
                  class="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    shadow-sm
                  "
                >

                  <div
                    class="
                      hidden
                      grid-cols-[minmax(0,1fr)_160px]
                      gap-4
                      border-b
                      border-gray-100
                      bg-gray-50
                      px-4
                      py-3
                      text-[9px]
                      font-bold
                      text-gray-400
                      sm:grid
                    "
                  >
                    <span>
                      شرایط کنسلی
                    </span>

                    <span class="text-center">
                      جریمه
                    </span>
                  </div>


                  <div
                    v-for="(rule,index) in refundPolicies"
                    :key="`refund-rule-${index}`"
                    class="
                      border-b
                      border-gray-100
                      p-4
                      last:border-b-0
                    "
                  >

                    <div
                      class="
                        grid
                        grid-cols-1
                        gap-3
                        sm:grid-cols-[minmax(0,1fr)_160px]
                        sm:items-center
                      "
                    >

                      <div class="flex items-start gap-3">

                        <span
                          class="
                            mt-0.5
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-gray-100
                            text-[10px]
                            font-black
                            text-gray-500
                          "
                        >
                          {{ index+1 }}
                        </span>


                        <p
                          class="
                            text-[10px]
                            font-medium
                            leading-7
                            text-gray-700
                          "
                        >
                          {{ getRuleDescription(rule) }}
                        </p>

                      </div>


                      <div
                        class="
                          flex
                          items-center
                          justify-between
                          rounded-xl
                          border
                          border-red-100
                          bg-red-50
                          px-3
                          py-2.5
                          sm:justify-center
                        "
                      >

                        <span class="text-[9px] text-red-400 sm:hidden">
                          جریمه
                        </span>

                        <span
                          class="
                            text-[11px]
                            font-black
                            text-red-600
                          "
                        >
                          {{ getRulePenalty(rule) }}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>


                <!-- Empty -->
                <div
                  v-else
                  class="
                    flex
                    min-h-[150px]
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    p-5
                  "
                >

                  <div class="text-center">

                    <span
                      class="
                        mx-auto
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-gray-100
                        text-gray-400
                      "
                    >
                      <i class="bi bi-file-earmark-x"></i>
                    </span>

                    <p class="mt-3 text-[11px] font-bold text-gray-500">
                      قوانین کنسلی برای این پرواز اعلام نشده است.
                    </p>

                  </div>

                </div>

              </template>

            </section>

          </div>


          <div
            v-else-if="activeTab==='info'"
            key="info-tab"
            class="
              flex
              flex-col
              bg-gray-50
              md:flex-row
            "
          >

            <!-- ========================= -->
            <!-- جزئیات قیمت -->
            <!-- ========================= -->
            <aside
              class="
                order-2
                flex-1
                border-t
                border-gray-200
                bg-white
                p-4
                md:order-1
                md:border-l
                md:border-t-0
                md:p-5
              "
              dir="rtl"
            >

              <div class="mb-4 flex items-center gap-2">
                <span
                  class="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--color-primary-light)]
                    text-[var(--color-primary-dark)]
                  "
                >
                  <i class="bi bi-receipt"></i>
                </span>

                <div>
                  <h4 class="text-[13px] font-black text-gray-800">
                    جزئیات قیمت
                  </h4>

                  <p class="mt-0.5 text-[10px] text-gray-400">
                    قیمت بر اساس مسافران انتخاب‌شده
                  </p>
                </div>
              </div>


              <div class="space-y-2">

                <template v-if="panelPassengerPrices.length">
                  <div
                    v-for="(item,index) in panelPassengerPrices"
                    :key="`info-passenger-${index}`"
                    class="
                      flex
                      items-center
                      justify-between
                      gap-3
                      rounded-xl
                      border
                      border-gray-100
                      bg-gray-50
                      px-3
                      py-3
                    "
                  >
                    <div class="flex items-center gap-2">
                      <span
                        class="
                          flex
                          h-8
                          min-w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-white
                          px-2
                          text-[10px]
                          font-bold
                          text-gray-500
                          shadow-sm
                        "
                      >
                        ×{{ item.count }}
                      </span>

                      <span class="text-[11px] font-bold text-gray-700">
                        {{ item.label }}
                      </span>
                    </div>

                    <div class="text-left">
                      <span class="text-[12px] font-black text-gray-800">
                        {{ formatPrice(item.total) }}
                      </span>

                      <span class="mr-1 text-[9px] text-gray-400">
                        ریال
                      </span>
                    </div>
                  </div>
                </template>


                <template v-else>
                  <div
                    class="
                      flex
                      items-center
                      justify-between
                      gap-3
                      rounded-xl
                      border
                      border-gray-100
                      bg-gray-50
                      px-3
                      py-3
                    "
                  >
                    <div class="flex items-center gap-2">
                      <span
                        class="
                          flex
                          h-8
                          min-w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-white
                          px-2
                          text-[10px]
                          font-bold
                          text-gray-500
                          shadow-sm
                        "
                      >
                        ×1
                      </span>

                      <span class="text-[11px] font-bold text-gray-700">
                        بزرگسال
                      </span>
                    </div>

                    <div class="text-left">
                      <span class="text-[12px] font-black text-gray-800">
                        {{ formatPrice(cardPrice) }}
                      </span>

                      <span class="mr-1 text-[9px] text-gray-400">
                        ریال
                      </span>
                    </div>
                  </div>
                </template>

              </div>


              <div
                class="
                  mt-4
                  rounded-2xl
                  bg-[var(--color-primary-dark)]
                  px-4
                  py-4
                  text-white
                  shadow-sm
                "
              >
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-[10px] text-white/70">
                      مبلغ کل
                    </p>

                    <p class="mt-1 text-[10px] text-white/60">
                      برای همه مسافران
                    </p>
                  </div>

                  <div class="text-left">
                    <span class="text-[18px] font-black">
                      {{ formatPrice(panelTotalPrice) }}
                    </span>

                    <span class="mr-1 text-[10px] text-white/70">
                      ریال
                    </span>
                  </div>
                </div>
              </div>

            </aside>


            <!-- ========================= -->
            <!-- اطلاعات پرواز -->
            <!-- ========================= -->
            <section
              class="
                order-1
                flex-[3]
                p-4
                md:order-2
                md:p-5
              "
              dir="rtl"
            >

              <div class="mb-5 flex items-center justify-between gap-3">

                <div class="flex items-center gap-3">
                  <span
                    class="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[var(--color-primary-light)]
                      text-[var(--color-primary-dark)]
                    "
                  >
                    <i class="bi bi-airplane text-[17px]"></i>
                  </span>

                  <div>
                    <h3 class="text-[14px] font-black text-gray-800">
                      اطلاعات پرواز
                    </h3>

                    <p class="mt-1 text-[10px] text-gray-400">
                      زمان، مسیر و مشخصات پرواز
                    </p>
                  </div>
                </div>

                <span
                  v-if="segments.length"
                  class="
                    rounded-full
                    border
                    border-gray-200
                    bg-white
                    px-3
                    py-1.5
                    text-[10px]
                    font-bold
                    text-gray-500
                  "
                >
                  {{ segments.length }}
                  مسیر
                </span>

              </div>


              <!-- Loading -->
              <template v-if="loadingFare">
                <div
                  class="
                    flex
                    min-h-[180px]
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                  "
                >
                  <div class="text-center">
                    <div
                      class="
                        mx-auto
                        h-8
                        w-8
                        animate-spin
                        rounded-full
                        border-2
                        border-gray-200
                        border-t-[var(--color-primary)]
                      "
                    ></div>

                    <p class="mt-3 text-[11px] text-gray-500">
                      در حال دریافت اطلاعات نرخ...
                    </p>
                  </div>
                </div>
              </template>


              <template v-else>

                <!-- ========================= -->
                <!-- بار مجاز PARTO -->
                <!-- ========================= -->
                <div
                  v-if="isParto"
                  class="
                    mb-5
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    shadow-sm
                  "
                >

                  <div
                    class="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-gray-100
                      px-4
                      py-3
                    "
                  >
                    <div class="flex items-center gap-2">
                      <span
                        class="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-gray-100
                          text-[var(--color-primary-dark)]
                        "
                      >
                        <i class="bi bi-suitcase-lg"></i>
                      </span>

                      <div>
                        <p class="text-[12px] font-black text-gray-800">
                          بار مجاز
                        </p>

                        <p class="mt-0.5 text-[9px] text-gray-400">
                          میزان بار قابل حمل هر مسیر
                        </p>
                      </div>
                    </div>
                  </div>


                  <div
                    v-if="loadingBaggage"
                    class="px-4 py-5 text-center text-[11px] text-gray-500"
                  >
                    در حال دریافت بار مجاز...
                  </div>


                  <div
                    v-else-if="baggageError"
                    class="bg-red-50 px-4 py-4 text-center text-[11px] text-red-500"
                  >
                    {{ baggageError }}
                  </div>


                  <div
                    v-else-if="baggageInfoes.length"
                    class="
                      grid
                      grid-cols-1
                      gap-2
                      p-3
                      md:grid-cols-2
                    "
                  >
                    <div
                      v-for="(item,index) in baggageInfoes"
                      :key="`baggage-${index}`"
                      class="
                        flex
                        items-center
                        justify-between
                        gap-3
                        rounded-xl
                        bg-gray-50
                        px-3
                        py-3
                      "
                    >

                      <div class="min-w-0">
                        <p class="truncate text-[11px] font-bold text-gray-700">
                          {{ getCityLabel(item.departure) }}
                          <i class="bi bi-arrow-left mx-1 text-gray-400"></i>
                          {{ getCityLabel(item.arrival) }}
                        </p>

                        <p class="mt-1 text-[9px] text-gray-400">
                          پرواز
                          {{ item.flightNo||'-' }}
                        </p>
                      </div>

                      <span
                        class="
                          shrink-0
                          rounded-lg
                          bg-white
                          px-3
                          py-2
                          text-[11px]
                          font-black
                          text-[var(--color-primary-dark)]
                          shadow-sm
                        "
                      >
                        {{ item.baggage||'-' }}
                      </span>

                    </div>
                  </div>


                  <div
                    v-else
                    class="px-4 py-5 text-center text-[11px] text-gray-500"
                  >
                    اطلاعات بار مجاز اعلام نشده است.
                  </div>

                </div>


                <!-- ========================= -->
                <!-- Segment Cards -->
                <!-- ========================= -->
                <div class="space-y-4">

                  <article
                    v-for="(segment,index) in segments"
                    :key="`segment-${index}`"
                    class="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-gray-100
                      bg-white
                      shadow-sm
                    "
                  >

                    <!-- Segment Header -->
                    <div
                      class="
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-2
                        border-b
                        border-gray-100
                        bg-gray-50/70
                        px-4
                        py-3
                      "
                    >
                      <div class="flex items-center gap-2">
                        <span
                          class="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-white
                            text-[var(--color-primary-dark)]
                            shadow-sm
                          "
                        >
                          <i
                            class="bi bi-airplane-fill text-[13px]"
                            :class="
                              segment?.direction==='return'
                                ?'-rotate-90'
                                :'rotate-90'
                            "
                          ></i>
                        </span>

                        <div>
                          <p class="text-[11px] font-black text-gray-800">
                            {{ segmentTitle(index) || 'جزئیات پرواز' }}
                          </p>

                          <p class="mt-0.5 text-[9px] text-gray-400">
                            پرواز
                            {{ segment.flightNumber||'-' }}
                          </p>
                        </div>
                      </div>

                      <span
                        class="
                          rounded-full
                          bg-white
                          px-3
                          py-1.5
                          text-[9px]
                          font-bold
                          text-gray-500
                          shadow-sm
                        "
                      >
                        {{ getSegmentCabinLabel(segment) }}
                      </span>
                    </div>


                    <!-- Route -->
                    <div class="p-4 md:p-5">

                      <div
                        class="
                          grid
                          grid-cols-[1fr_auto_1fr]
                          items-center
                          gap-3
                          md:gap-5
                        "
                      >

                        <!-- Origin -->
                        <div class="text-right">
                          <p
                            class="
                              text-[22px]
                              font-black
                              leading-none
                              text-gray-900
                              md:text-[25px]
                            "
                          >
                            {{ formatTime(segment.departure) }}
                          </p>

                          <p
                            class="
                              mt-3
                              text-[13px]
                              font-black
                              text-gray-800
                              md:text-[14px]
                            "
                          >
                            {{ getCityLabel(segment.origin) }}
                          </p>

                          <p
                            class="
                              mt-1
                              line-clamp-2
                              text-[9px]
                              leading-5
                              text-gray-400
                              md:text-[10px]
                            "
                          >
                            {{ getAirportLabel(segment.origin) }}
                          </p>

                          <p class="mt-2 text-[9px] font-medium text-gray-500">
                            {{ formatFlightDate(segment.departure) }}
                          </p>
                        </div>


                        <!-- Flight Line -->
                        <div
                          class="
                            flex
                            min-w-[90px]
                            flex-col
                            items-center
                            justify-center
                            md:min-w-[170px]
                          "
                        >
                          <span
                            class="
                              mb-2
                              rounded-full
                              bg-[var(--color-primary-light)]
                              px-3
                              py-1
                              text-[9px]
                              font-bold
                              text-[var(--color-primary-dark)]
                            "
                          >
                            {{ getFlightDurationLabel(segment) }}
                          </span>

                          <div class="flex w-full items-center">
                            <span
                              class="
                                h-2
                                w-2
                                shrink-0
                                rounded-full
                                border-2
                                border-[var(--color-primary)]
                                bg-white
                              "
                            ></span>

                            <div
                              class="
                                h-px
                                flex-1
                                border-t
                                border-dashed
                                border-gray-300
                              "
                            ></div>

                            <span
                              class="
                                mx-1
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[var(--color-primary)]
                                text-white
                                shadow-sm
                              "
                            >
                              <i
                                class="bi bi-airplane-fill text-[11px] ml-1"
                                :class="
                                  segment?.direction==='return'
                                    ?'-rotate-270'
                                    :'rotate-270'
                                "
                              ></i>
                            </span>

                            <div
                              class="
                                h-px
                                flex-1
                                border-t
                                border-dashed
                                border-gray-300
                              "
                            ></div>

                            <span
                              class="
                                h-2
                                w-2
                                shrink-0
                                rounded-full
                                border-2
                                border-[var(--color-primary)]
                                bg-white
                              "
                            ></span>
                          </div>
                        </div>


                        <!-- Destination -->
                        <div class="text-left">
                          <p
                            class="
                              text-[22px]
                              font-black
                              leading-none
                              text-gray-900
                              md:text-[25px]
                            "
                          >
                            {{ formatTime(segment.arrival) }}
                          </p>

                          <p
                            class="
                              mt-3
                              text-[13px]
                              font-black
                              text-gray-800
                              md:text-[14px]
                            "
                          >
                            {{ getCityLabel(segment.destination) }}
                          </p>

                          <p
                            class="
                              mt-1
                              line-clamp-2
                              text-[9px]
                              leading-5
                              text-gray-400
                              md:text-[10px]
                            "
                          >
                            {{ getAirportLabel(segment.destination) }}
                          </p>

                          <p class="mt-2 text-[9px] font-medium text-gray-500">
                            {{ formatFlightDate(segment.arrival) }}
                          </p>
                        </div>

                      </div>


                      <!-- Meta -->
                      <div
                        class="
                          mt-5
                          grid
                          grid-cols-1
                          gap-2
                          border-t
                          border-gray-100
                          pt-4
                          sm:grid-cols-3
                        "
                      >

                        <div
                          class="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            bg-gray-50
                            px-3
                            py-3
                          "
                        >
                          <span
                            class="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-white
                              text-gray-500
                              shadow-sm
                            "
                          >
                            <i class="bi bi-hash"></i>
                          </span>

                          <div>
                            <p class="text-[9px] text-gray-400">
                              شماره پرواز
                            </p>

                            <p class="mt-1 text-[11px] font-black text-gray-700">
                              {{ segment.flightNumber||'-' }}
                            </p>
                          </div>
                        </div>


                        <div
                          class="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            bg-gray-50
                            px-3
                            py-3
                          "
                        >
                          <span
                            class="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-white
                              text-gray-500
                              shadow-sm
                            "
                          >
                            <i class="bi bi-person-vcard"></i>
                          </span>

                          <div>
                            <p class="text-[9px] text-gray-400">
                              کلاس پرواز
                            </p>

                            <p class="mt-1 text-[11px] font-black text-gray-700">
                              {{ getSegmentCabinLabel(segment) }}
                            </p>
                          </div>
                        </div>


                        <div
                          class="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            bg-gray-50
                            px-3
                            py-3
                          "
                        >
                          <span
                            class="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-white
                              text-gray-500
                              shadow-sm
                            "
                          >
                            <i class="bi bi-airplane-engines"></i>
                          </span>

                          <div class="min-w-0">
                            <p class="text-[9px] text-gray-400">
                              نوع هواپیما
                            </p>

                            <p
                              class="
                                mt-1
                                truncate
                                text-[11px]
                                font-black
                                text-gray-700
                              "
                            >
                              {{
                                segment.aircraftTypeName||
                                segment.aircraftTypeCode||
                                '-'
                              }}
                            </p>
                          </div>
                        </div>

                      </div>

                    </div>

                  </article>


                  <!-- Connection -->
                  <template
                    v-for="(segment,index) in segments"
                    :key="`connection-${index}`"
                  >
                    <div
                      v-if="
                        isParto&&
                        index<segments.length-1&&
                        segments[index+1]?.direction===segment.direction
                      "
                      class="
                        flex
                        items-center
                        gap-3
                        px-1
                      "
                    >
                      <div
                        class="
                          h-px
                          flex-1
                          border-t
                          border-dashed
                          border-orange-300
                        "
                      ></div>

                      <div
                        class="
                          shrink-0
                          rounded-2xl
                          border
                          border-orange-100
                          bg-orange-50
                          px-4
                          py-2.5
                          text-center
                        "
                      >
                        <div class="flex items-center justify-center gap-1.5">
                          <i class="bi bi-clock-history text-[11px] text-orange-500"></i>

                          <p class="text-[10px] font-black text-orange-600">
                            توقف در
                            {{ getCityLabel(segment.destination) }}
                          </p>
                        </div>

                        <p class="mt-1 text-[9px] text-gray-500">
                          مدت توقف:
                          {{
                            formatDurationFromMinutes(
                              getConnectionMinutes(
                                segment,
                                segments[index+1]
                              )
                            )
                          }}
                        </p>
                      </div>

                      <div
                        class="
                          h-px
                          flex-1
                          border-t
                          border-dashed
                          border-orange-300
                        "
                      ></div>
                    </div>
                  </template>

                </div>

              </template>

            </section>

          </div>

        </Transition>

      </div>

    </div>

  </div>

</template>



<script setup>

import { ref, computed, onMounted, watch } from 'vue'

import { useFlightStore } from '~/stores/flights'

import{

  getParoBaggages,

  getParoRules

}from'~/services/providers/paro.js'

const props = defineProps({

  flight: {

    type: Object,

    required: true

  },

  airlineInfo: {

    type: Object,

    default: () => ({})

  },

  hideSelectButton: {

    type: Boolean,

    default: false

  }

})



const emit = defineEmits(['select'])



const flightStore = useFlightStore()

const route = useRoute()

const activeTab = ref(null)

const logoFailed = ref(false)

const loadingFare = ref(false)

const niraFare = ref(null)

const capacityError=ref('')

const loadingBaggage=ref(false)

const baggageInfoes=ref([])

const baggageError=ref('')

const loadingPartoRules=ref(false)

const partoRules=ref([])

const partoRulesError=ref('')

const partoRulesLoaded=ref(false)

const isNira = computed(() => String(props.flight.provider || '').toUpperCase() === 'NIRA')

const isMahan = computed(() => String(props.flight.provider || '').toUpperCase() === 'MAHAN')

const isParto=computed(()=>

  String(

    props.flight.provider||''

  ).toUpperCase()==='PARTO'

)

const requestedSeatCount=computed(()=>{

  return(

    Number(passengerCounts.value.adult||0)+

    Number(passengerCounts.value.child||0)

  )

})

const passengerCounts = computed(() => {

  return {

    adult: Number(route.query.adl || 1),

    child: Number(route.query.chd || 0),

    infant: Number(route.query.inf || 0)

  }

})

const partoPassengerPrices=computed(()=>{

  const prices=

    props.flight.passengerPrices||{}



  const result=[]



  if(

    passengerCounts.value.adult>0&&

    prices.adult

  ){

    result.push({

      label:'بزرگسال',

      count:

        passengerCounts.value.adult,



      unitPrice:Number(

        prices.adult.totalFare||0

      ),



      total:

        Number(

          prices.adult.totalFare||0

        )*

        passengerCounts.value.adult

    })

  }



  if(

    passengerCounts.value.child>0&&

    prices.child

  ){

    result.push({

      label:'کودک',

      count:

        passengerCounts.value.child,



      unitPrice:Number(

        prices.child.totalFare||0

      ),



      total:

        Number(

          prices.child.totalFare||0

        )*

        passengerCounts.value.child

    })

  }



  if(

    passengerCounts.value.infant>0&&

    prices.infant

  ){

    result.push({

      label:'نوزاد',

      count:

        passengerCounts.value.infant,



      unitPrice:Number(

        prices.infant.totalFare||0

      ),



      total:

        Number(

          prices.infant.totalFare||0

        )*

        passengerCounts.value.infant

    })

  }



  return result

})

const airlineCode=computed(()=>{

  return String(

    props.flight?.airline||

    props.flight?.airlineCode||

    props.flight?.marketingAirlineCode||

    props.flight?.carrierCode||

    props.flight?.operatingAirline||

    ''

  )

    .trim()

    .toUpperCase()

})



/*

 * ایرلاین‌های داخلی قدیمی Store اولویت دارند،

 * چون نام و لوگوی محلی پروژه داخل همین لیست است.

 */

const oldAirline=computed(()=>{

  if(!airlineCode.value)return null



  return (flightStore.airlines||[]).find(

    item=>

      String(item?.code||'')

        .trim()

        .toUpperCase()===

      airlineCode.value

  )||null

})



/*

 * BasicInfo مکمل لیست قدیمی است و مخصوصاً

 * برای ایرلاین‌های خارجی Parto استفاده می‌شود.

 */

const basicAirline=computed(()=>{

  if(!airlineCode.value)return null



  return (flightStore.basicAirlines||[]).find(

    item=>

      String(item?.iataCode||'')

        .trim()

        .toUpperCase()===

      airlineCode.value

  )||null

})



const airlineFromStore=computed(()=>

  oldAirline.value||

  basicAirline.value||

  null

)



const airlineName=computed(()=>{

  return(

    oldAirline.value?.name||

    oldAirline.value?.nicName||

    props.airlineInfo?.nicName||

    props.airlineInfo?.name||

    basicAirline.value?.nicName||

    basicAirline.value?.name||

    airlineCode.value||

    'ایرلاین'

  )

})



const normalizeAirlineLogo=logo=>{

  const value=String(logo||'').trim()

  if(!value)return''



  if(

    value.startsWith('http://')||

    value.startsWith('https://')||

    value.startsWith('/')

  ){

    return value

  }



  return `/imgs/flight/airlines/${value}`

}



const airlineLogo=computed(()=>{

  if(logoFailed.value)return''



  if(isMahan.value){

    return'/imgs/flight/airlines/mahan.png'

  }



  const logo=

    oldAirline.value?.logo||

    oldAirline.value?.image||

    props.airlineInfo?.logo||

    props.airlineInfo?.image||

    basicAirline.value?.logo||

    basicAirline.value?.image||

    ''



  if(

    String(logo||'').trim()

  ){

    return normalizeAirlineLogo(logo)

  }



  const yataCode=

    String(

      oldAirline.value?.yataCode||

      oldAirline.value?.iataCode||

      props.airlineInfo?.yataCode||

      props.airlineInfo?.iataCode||

      basicAirline.value?.yataCode||

      basicAirline.value?.iataCode||

      airlineCode.value||

      ''

    )

      .trim()

      .toUpperCase()



  if(!yataCode){

    return''

  }



  return `/imgs/flight/airlines/${yataCode}.png`

})



onMounted(async()=>{

  try{

    await flightStore.loadBasicAirlines()

  }catch(error){

    console.error(

      'Load BasicInfo airlines error:',

      error

    )

  }

})



watch(

  airlineCode,

  ()=>{

    logoFailed.value=false

  }

)

const fetchPartoRules=async()=>{

  if(

    !isParto.value||

    loadingPartoRules.value||

    partoRulesLoaded.value

  ){

    return

  }



  const fareSourceCode=

    props.flight.fareSourceCode||

    props.flight.meta?.fareSourceCode||

    props.flight.meta?.raw?.fareSourceCode||

    ''



  const uniqueId=

    props.flight.uniqueId||

    props.flight.meta?.uniqueId||

    props.flight.meta?.raw?.uniqueId||

    ''



  if(!fareSourceCode){

    partoRulesError.value=

      'کد نرخ برای دریافت قوانین کنسلی موجود نیست.'



    partoRulesLoaded.value=true

    return

  }



  loadingPartoRules.value=true

  partoRulesError.value=''



  try{

    const response=

      await getParoRules({

        fareSourceCode,

        uniqueId

      })



    const fareRules=

      Array.isArray(

        response?.fareRules

      )

        ?response.fareRules

        :[]



    partoRules.value=

  fareRules.flatMap(fareRule=>{

    const details=

      Array.isArray(

        fareRule?.ruleDetails

      )

        ?fareRule.ruleDetails

        :[]



    return details.map(detail=>{

      const rulesFa=String(

        detail?.rulesFa||''

      ).trim()



      return{

        airline:

          fareRule?.airline||'',



        cityPair:

          fareRule?.cityPair||'',



        category:

          detail?.category||'',



        categoryFa:

          detail?.categoryFa||

          'قوانین کنسلی',



        rulesFa,



        sections:

          rulesFa

            ?[

                {

                  title:

                    detail?.categoryFa||

                    'قوانین کنسلی',



                  text:rulesFa

                }

              ]

            :parsePartoRuleHtml(

                detail?.rules

              )

      }

    })

  })



    partoRulesLoaded.value=true

  }catch(error){

    console.error(

      'PARTO Rules Error:',

      error

    )



    partoRules.value=[]



    partoRulesError.value=

      error?.data?.error?.message||

      error?.data?.message||

      error?.message||

      'دریافت قوانین کنسلی ناموفق بود.'

  }finally{

    loadingPartoRules.value=false

  }

}

const airports = computed(() => flightStore.iranAirports || [])



function findAirport(code) {

  if (!code) return null

  return airports.value.find((item) => item.iataCode === code || item.cityCode === code) || null

}

const fetchPartoBaggages=async()=>{

  if(

    !isParto.value||

    loadingBaggage.value

  ){

    return

  }



  const fareSourceCode=

    props.flight.fareSourceCode||

    props.flight.meta?.fareSourceCode||

    props.flight.meta?.raw?.fareSourceCode||

    ''



  if(!fareSourceCode){

    baggageInfoes.value=[]

    baggageError.value=

      'کد نرخ برای دریافت بار مجاز موجود نیست.'



    return

  }



  loadingBaggage.value=true

  baggageError.value=''



  try{

    const response=

      await getParoBaggages(

        fareSourceCode

      )



    baggageInfoes.value=

      Array.isArray(

        response?.baggageInfoes

      )

        ?response.baggageInfoes

        :[]

  }catch(error){

    console.error(

      'PARTO Baggage Error:',

      error

    )



    baggageInfoes.value=[]



    baggageError.value=

      error?.data?.error?.message||

      error?.data?.message||

      error?.message||

      'دریافت بار مجاز ناموفق بود.'

  }finally{

    loadingBaggage.value=false

  }

}

function getPartoStopAirportCodes(){

  if(!isParto.value){

    return[]

  }



  return[

    ...new Set([

      ...outboundStopAirports.value,

      ...returnStopAirports.value

    ]

      .filter(Boolean)

      .map(

        code=>

          String(code)

            .trim()

            .toUpperCase()

      )

    )

  ]

}



async function loadPartoStopAirports(){

  const codes=

    getPartoStopAirportCodes()



  if(!codes.length){

    return

  }



  await Promise.all(

    codes.map(

      code=>

        flightStore

          .loadAirportByCode(code)

    )

  )

}

const toggleTab=async tabName=>{

  if(activeTab.value===tabName){

    activeTab.value=null

    return

  }



  activeTab.value=tabName



  /*

   * اگر اطلاعات پرواز Parto باز شد،

   * اطلاعات فرودگاه‌های توقف را بگیر.

   */

  if(

    isParto.value&&

    tabName==='info'

  ){

    try{

      await loadPartoStopAirports()

    }catch(error){

      console.error(

        'Load Parto stop airports error:',

        error

      )

    }

  }



  /*

   * NIRA

   */

  if(

    isNira.value&&

    props.flight.needsFare===true&&

    !niraFare.value&&

    !loadingFare.value&&

    (

      tabName==='rules'||

      tabName==='info'

    )

  ){

    await fetchNiraFare()

  }



  /*

   * PARTO Baggage

   */

  if(

    isParto.value&&

    tabName==='info'&&

    !loadingBaggage.value

  ){

    await fetchPartoBaggages()

  }



  /*

   * PARTO Rules

   */

  if(

    isParto.value&&

    tabName==='rules'&&

    !loadingPartoRules.value&&

    !partoRulesLoaded.value

  ){

    await fetchPartoRules()

  }

}



const fetchNiraFare = async () => {

  loadingFare.value = true



  try {

    const departureDate = String(props.flight.departure || '')

      .trim()

      .split(' ')[0]

      .split('T')[0]



    const params = new URLSearchParams({

      AirLine: String(props.flight.airline || '').trim(),

      Route: `${String(props.flight.origin || '').trim()}-${String(props.flight.destination || '').trim()}`,

      RBD: String(props.flight.rbd || props.flight.bookingClass || '').trim(),

      DepartureDate: departureDate,

      FlightNo: String(props.flight.flightNumber || '').trim()

    })



    const url = `https://api.ahuan.ir/api/Nira/Fare?${params.toString()}`



    const response = await fetch(url, {

      method: 'GET',

      headers: {

        Accept: 'application/json'

      }

    })



    if (!response.ok) {

      const errorText = await response.text()

      throw new Error(`HTTP ${response.status} - ${errorText}`)

    }



    const data = await response.json()

    niraFare.value = typeof data === 'string' ? JSON.parse(data) : data

  } catch (error) {

    console.error('Error fetching NIRA fare:', error)

    niraFare.value = null

  } finally {

    loadingFare.value = false

  }

}



function mapMahanPassengerLabel(code) {

  const normalized = Number(code)



  if (normalized === 1) return 'بزرگسال'

  if (normalized === 2) return 'کودک'

  if (normalized === 3) return 'نوزاد'



  return 'مسافر'

}



function getMahanPassengerCount(code) {

  const normalized = Number(code)



  if (normalized === 1) return passengerCounts.value.adult

  if (normalized === 2) return passengerCounts.value.child

  if (normalized === 3) return passengerCounts.value.infant



  return 0

}



const mahanPassengerPrices = computed(() => {

  const list = props.flight.meta?.raw?.totalFlightPrice?.flightPassengerPrices || []



  if (!Array.isArray(list) || !list.length) return []



  return list

    .map((item) => {

      const count = getMahanPassengerCount(item.code)

      const unitPrice = Number(item.totalFare || item.totalSale || item.sale || 0)



      return {

        label: mapMahanPassengerLabel(item.code),

        count,

        unitPrice,

        total: unitPrice * count

      }

    })

    .filter((item) => item.count > 0)

})



const niraPassengerPrices = computed(() => {

  if (!niraFare.value) return []



  const items = []



  if (passengerCounts.value.adult > 0) {

    items.push({

      label: 'بزرگسال',

      count: passengerCounts.value.adult,

      unitPrice: Number(niraFare.value.AdultTotalPrice || 0),

      total: Number(niraFare.value.AdultTotalPrice || 0) * passengerCounts.value.adult

    })

  }



  if (passengerCounts.value.child > 0) {

    items.push({

      label: 'کودک',

      count: passengerCounts.value.child,

      unitPrice: Number(niraFare.value.ChildTotalPrice || 0),

      total: Number(niraFare.value.ChildTotalPrice || 0) * passengerCounts.value.child

    })

  }



  if (passengerCounts.value.infant > 0) {

    items.push({

      label: 'نوزاد',

      count: passengerCounts.value.infant,

      unitPrice: Number(niraFare.value.InfantTotalPrice || 0),

      total: Number(niraFare.value.InfantTotalPrice || 0) * passengerCounts.value.infant

    })

  }



  return items

})



const panelPassengerPrices=computed(()=>{

  if(isNira.value){

    return niraPassengerPrices.value

  }



  if(isMahan.value){

    return mahanPassengerPrices.value

  }



  if(isParto.value){

    return partoPassengerPrices.value

  }



  const basePrice=

    Number(

      props.flight.priceFrom||0

    )



  return[

    {

      label:'بزرگسال',

      count:

        passengerCounts.value.adult,



      unitPrice:basePrice,



      total:

        basePrice*

        passengerCounts.value.adult

    },

    {

      label:'کودک',

      count:

        passengerCounts.value.child,



      unitPrice:

        Math.round(

          basePrice*.75

        ),



      total:

        Math.round(

          basePrice*.75

        )*

        passengerCounts.value.child

    },

    {

      label:'نوزاد',

      count:

        passengerCounts.value.infant,



      unitPrice:

        Math.round(

          basePrice*.1

        ),



      total:

        Math.round(

          basePrice*.1

        )*

        passengerCounts.value.infant

    }

  ].filter(

    item=>item.count>0

  )

})



const cardPrice=computed(()=>{

  if(isNira.value){

    return Number(

      props.flight.priceFrom||0

    )

  }



  if(isMahan.value){

    const adultPrice=

      mahanPassengerPrices.value

        .find(

          item=>

            item.label==='بزرگسال'

        )

        ?.unitPrice



    return Number(

      adultPrice||

      props.flight.priceFrom||

      0

    )

  }



  if(isParto.value){

    return Number(

      props.flight

        .passengerPrices

        ?.adult

        ?.totalFare||

      props.flight.priceFrom||

      0

    )

  }



  return Number(

    props.flight.priceFrom||0

  )

})



const panelTotalPrice = computed(() => {

  return panelPassengerPrices.value.reduce((sum, item) => sum + Number(item.total || 0), 0)

})



const refundPolicies = computed(() => {

  if (isNira.value && niraFare.value?.CRCNRules) {

    return String(niraFare.value.CRCNRules)

      .split('/')

      .map((item) => item.trim())

      .filter(Boolean)

      .map((item) => {

        const parts = item.split(',')

        return {

          title: String(parts[0] || '').trim(),

          penalty: String(parts[1] || '').trim(),

          type: String(parts[2] || '').trim()

        }

      })

      .filter((item) => item.title)

  }



  const items =

    props.flight.meta?.raw?.refundPolicyDetails ||

    props.flight.refundPolicyDetails ||

    []



  return Array.isArray(items) ? items : []

})



const isRoundTripView = computed(() => {

  if (isNira.value) return false



  return Boolean(

    props.flight.isRoundTrip &&

    props.flight.returnDeparture &&

    props.flight.returnArrival

  )

})



const segments=computed(()=>{

  /*

   * PARTO:

   * Segmentهای واقعی Provider

   */

  if(isParto.value){

    const outbound=

      Array.isArray(

        props.flight.segments

      )

        ?props.flight.segments

        :[]



    const inbound=

      Array.isArray(

        props.flight.returnSegments

      )

        ?props.flight.returnSegments

        :[]



    return[

      ...outbound.map(segment=>({

        ...segment,

        direction:'outbound'

      })),



      ...inbound.map(segment=>({

        ...segment,

        direction:'return'

      }))

    ]

  }



  /*

   * NIRA / MAHAN / سایر Providerها

   */

  const outbound={

    origin:props.flight.origin,

    destination:props.flight.destination,

    departure:props.flight.departure,

    arrival:props.flight.arrival,

    flightNumber:props.flight.flightNumber,

    bookingClass:props.flight.bookingClass,

    rbd:props.flight.rbd,

    aircraftTypeCode:

      props.flight.aircraftTypeCode,

    aircraftTypeName:

      props.flight.aircraftTypeName,

    durationMinutes:

      props.flight.durationMinutes||

      props.flight.flightDurationMinutes||

      null,

    durationText:

      props.flight.durationText||

      props.flight.flightDuration||

      null,

    capacity:props.flight.capacity,

    direction:'outbound'

  }



  if(!isRoundTripView.value){

    return[outbound]

  }



  const inbound={

    origin:props.flight.returnOrigin,

    destination:

      props.flight.returnDestination,

    departure:

      props.flight.returnDeparture,

    arrival:

      props.flight.returnArrival,

    flightNumber:

      props.flight.returnFlightNumber,

    bookingClass:

      props.flight.returnBookingClass,

    rbd:

      props.flight.returnRbd,

    aircraftTypeCode:

      props.flight.returnAircraftTypeCode,

    aircraftTypeName:

      props.flight.returnAircraftTypeName,

    durationMinutes:

      props.flight.returnDurationMinutes||

      props.flight.returnFlightDurationMinutes||

      null,

    durationText:

      props.flight.returnDurationText||

      props.flight.returnFlightDuration||

      null,

    capacity:

      props.flight.returnCapacity,

    direction:'return'

  }



  return[

    outbound,

    inbound

  ]

})

const outboundSegments=computed(()=>{

  if(

    isParto.value&&

    Array.isArray(props.flight.segments)

  ){

    return props.flight.segments

  }



  return[]

})



const returnSegments=computed(()=>{

  if(

    isParto.value&&

    Array.isArray(

      props.flight.returnSegments

    )

  ){

    return props.flight.returnSegments

  }



  return[]

})

const outboundStopCount=computed(()=>{

  if(!isParto.value)return 0



  return Math.max(

    outboundSegments.value.length-1,

    0

  )

})



const returnStopCount=computed(()=>{

  if(!isParto.value)return 0



  return Math.max(

    returnSegments.value.length-1,

    0

  )

})

const outboundStopLabel=computed(()=>{

  if(!outboundStopCount.value){

    return 'بدون توقف'

  }



  return `${formatNumber(

    outboundStopCount.value

  )} توقف`

})

const outboundStopAirports=computed(()=>{

  if(

    outboundSegments.value.length<=1

  ){

    return[]

  }



  return outboundSegments.value

    .slice(0,-1)

    .map(

      segment=>segment.destination

    )

})

const returnStopLabel=computed(()=>{

  if(!returnStopCount.value){

    return 'بدون توقف'

  }



  return `${formatNumber(

    returnStopCount.value

  )} توقف`

})



const returnStopAirports=computed(()=>{

  if(

    returnSegments.value.length<=1

  ){

    return[]

  }



  return returnSegments.value

    .slice(0,-1)

    .map(

      segment=>segment?.destination

    )

    .filter(Boolean)

})

function getConnectionMinutes(

  segment,

  nextSegment

){

  if(!segment||!nextSegment){

    return 0

  }



  const arrival=

    parseDate(segment.arrival)



  const departure=

    parseDate(nextSegment.departure)



  if(!arrival||!departure){

    return 0

  }



  const diff=Math.floor(

    (

      departure.getTime()-

      arrival.getTime()

    )/60000

  )



  return diff>0

    ?diff

    :0

}

const originCity = computed(() => getCityLabel(props.flight.origin))

const destinationCity = computed(() => getCityLabel(props.flight.destination))

const departureTime = computed(() => formatTime(props.flight.departure))

const arrivalTime = computed(() => formatTime(props.flight.arrival))

const departureDateLabel = computed(() => formatFlightDateShort(props.flight.departure))



const returnOriginCity = computed(() => getCityLabel(props.flight.returnOrigin))

const returnDestinationCity = computed(() => getCityLabel(props.flight.returnDestination))

const returnDepartureTime = computed(() => formatTime(props.flight.returnDeparture))

const returnArrivalTime = computed(() => formatTime(props.flight.returnArrival))



const isCanceled = computed(() => {

  const status = String(

    props.flight.status ||

    props.flight.availabilityStatus ||

    props.flight.state ||

    props.flight.ticketStatus ||

    ''

  ).toLowerCase()



  const message = String(props.flight.statusMessage || '').toLowerCase()



  return (

    props.flight.canceled === true ||

    props.flight.cancelled === true ||

    status.includes('cancel') ||

    status.includes('باطل') ||

    status.includes('کنسل') ||

    message.includes('cancel') ||

    message.includes('باطل') ||

    message.includes('کنسل')

  )

})



const minCapacity = computed(() => {

  const capacities = segments.value

    .map((item) => Number(item.capacity))

    .filter((item) => Number.isFinite(item))



  if (!capacities.length) return null

  return Math.min(...capacities)

})



const isSoldOut = computed(() => {

  return minCapacity.value !== null && minCapacity.value <= 0

})



const cardDisabled = computed(() => {

  return Boolean(props.flight.disabled || isCanceled.value || isSoldOut.value)

})



const statusMessage = computed(() => {

  if (isCanceled.value) return 'کنسل شده'

  if (isSoldOut.value) return 'تکمیل ظرفیت'

  if (props.flight.statusMessage) return props.flight.statusMessage

  return cardDisabled.value ? 'غیرقابل خرید' : 'قابل خرید'

})

const flightClasses = {

  IV: {

    business: ['C', 'CR', 'CM']

  }, // کاسپین



  VR: {

    business: ['WB']

  }, // وارش



  Y9: {

    business: ['CPA', 'C']

  }, // کیش‌ایر



  J1: {

    business: ['Z']

  } // معراج

}

const partoCabinLabels={

  1:'اکونومی',

  2:'پریمیوم اکونومی',

  3:'بیزینس',

  4:'پریمیوم بیزینس',

  5:'فرست کلاس',

  6:'پریمیوم فرست کلاس'

}



const partoCabinCodeLabels={

  Y:'اکونومی',

  S:'پریمیوم اکونومی',

  C:'بیزینس',

  J:'پریمیوم بیزینس',

  F:'فرست کلاس',

  P:'پریمیوم فرست کلاس'

}



function getSegmentCabinLabel(segment){

  if(isParto.value){

    return(

      partoCabinLabels[

        Number(segment?.cabinType)

      ]||

      partoCabinCodeLabels[

        normalizeFlightCode(

          segment?.bookingClass||

          segment?.rbd

        )

      ]||

      '-'

    )

  }



  return getCabinClassLabel({

    airlineCode:

      props.flight.airline||

      props.flight.airlineCode||

      props.flight.carrierCode,



    bookingClass:

      segment?.bookingClass||

      segment?.rbd,



    cabinType:

      segment?.cabinType

  })

}

function normalizeFlightCode(value) {

  return String(value || '')

    .trim()

    .toUpperCase()

}



function getCabinClassLabel({

  airlineCode,

  bookingClass,

  cabinType

}) {

  const airline =

    normalizeFlightCode(airlineCode)



  const booking =

    normalizeFlightCode(bookingClass)



  const airlineConfig =

    flightClasses[airline]



  /*

   * اگر کلاس رزرو در لیست بیزینس

   * همان ایرلاین باشد.

   */

  if (

    airlineConfig?.business?.includes(

      booking

    )

  ) {

    return 'بیزینس'

  }



  /*

   * در صورت مشخص‌بودن cabinType،

   * از مقدار خود Provider استفاده می‌کنیم.

   */

  const cabinTypeMap = {

    1: 'فرست کلاس',

    2: 'بیزینس',

    3: 'اکونومی',

    4: 'پریمیوم اکونومی',

    5: 'بیزینس',

    6: 'اکونومی'

  }



  const cabinTypeLabel =

    cabinTypeMap[

      Number(cabinType)

    ]



  if (cabinTypeLabel) {

    return cabinTypeLabel

  }



  /*

   * برای سایر ایرلاین‌ها و کلاس‌ها

   * اکونومی در نظر گرفته می‌شود.

   */

  return 'اکونومی'

}

const cabinLabel=computed(()=>{

  if(isParto.value){

    const firstSegment=

      Array.isArray(

        props.flight.segments

      )

        ?props.flight.segments[0]

        :null



    return getSegmentCabinLabel(

      firstSegment||props.flight

    )

  }



  return getCabinClassLabel({

    airlineCode:

      props.flight.airline||

      props.flight.airlineCode||

      props.flight.carrierCode,



    bookingClass:

      props.flight.bookingClass||

      props.flight.rbd||

      props.flight.cabinClass||

      props.flight.flightClass,



    cabinType:

      props.flight.cabinType

  })

})



const flightTypeLabel = computed(() => {

  const refundable = props.flight.meta?.raw?.isRefundable

  if (refundable === false) return 'چارتر'

  return 'سیستمی'

})



const capacityText=computed(()=>{

  if(cardDisabled.value)return ''



  if(

    isNira.value&&

    String(

      props.flight.rawCapacity||

      props.flight.meta?.rawCapacity||

      ''

    ).toUpperCase()==='A'

  ){

    return 'بیشتر از ۹ صندلی مانده'

  }



  if(!Number.isFinite(displayCapacity.value))

    return ''



  return `${formatNumber(displayCapacity.value)} صندلی مانده`

})

const selectFlight=()=>{

  capacityError.value=''



  const rawCapacity=String(

    props.flight.rawCapacity||

    props.flight.meta?.rawCapacity||

    ''

  )

    .trim()

    .toUpperCase()



  let availableSeats=null



  if(rawCapacity==='A'){

    availableSeats=10

  }else{

    availableSeats=Number(

      props.flight.capacity ??

      props.flight.meta?.capacity ??

      minCapacity.value

    )

  }



  const requestedSeats=

    Number(passengerCounts.value.adult||0)+

    Number(passengerCounts.value.child||0)



  if(

    Number.isFinite(availableSeats)&&

    requestedSeats>availableSeats

  ){

    capacityError.value=

      `ظرفیت این پرواز ${formatNumber(availableSeats)} نفر است، اما برای ${formatNumber(requestedSeats)} مسافر جستجو کرده‌اید.`



    setTimeout(()=>{

      capacityError.value=''

    },2000)



    return

  }



  emit('select',props.flight)

}





const handleLogoError = () => {

  logoFailed.value = true

}



const segmentTitle=(index)=>{

  if(!isRoundTripView.value){

    return''

  }



  const segment=

    segments.value[index]



  if(!segment){

    return''

  }



  if(segment.direction==='outbound'){

    return index===0

      ?'پرواز رفت'

      :''

  }



  if(segment.direction==='return'){

    const previousSegment=

      segments.value[index-1]



    return previousSegment?.direction!=='return'

      ?'پرواز برگشت'

      :''

  }



  return''

}



function parseDate(value) {

  if (!value) return null

  const normalized = String(value).includes('T') ? String(value) : String(value).replace(' ', 'T')

  const date = new Date(normalized)

  if (Number.isNaN(date.getTime())) return null

  return date

}



function formatTime(value) {

  const date = parseDate(value)

  if (!date) return '-'



  return new Intl.DateTimeFormat('en-GB', {

    hour: '2-digit',

    minute: '2-digit',

    hour12: false

  }).format(date)

}



function formatPrice(value) {

  return new Intl.NumberFormat('fa-IR').format(Number(value || 0))

}

const displayCapacity=computed(()=>{

  if(isNira.value){

    return Number(

      props.flight.capacity??

      props.flight.meta?.capacity??

      0

    )

  }



  if(isMahan.value){

    return Number(

      props.flight.capacity??

      props.flight.meta?.raw?.flightItinerary?.[0]?.capacity??

      0

    )

  }



  return Number(

    props.flight.capacity||0

  )

})



const displayRefundable=computed(()=>{

  if(isNira.value){

    return props.flight.refundable===true

  }



  if(isMahan.value){

    return props.flight.meta

      ?.raw

      ?.isRefundable===true

  }



  if(isParto.value){

    const type=Number(

      props.flight.nonRefundableType

    )



    return type===0||type===1

  }



  return props.flight.refundable===true

})

function parsePartoRuleHtml(html){

  if(!html)return[]



  if(typeof window==='undefined'){

    return[

      {

        title:'قوانین کنسلی',

        text:String(html)

          .replace(/<[^>]+>/g,' ')

          .replace(/\s+/g,' ')

          .trim()

      }

    ]

  }



  const parser=new DOMParser()



  const doc=parser.parseFromString(

    String(html),

    'text/html'

  )



  const sections=[

    ...doc.querySelectorAll(

      '.farerules'

    )

  ]



  /*

   * برای قوانین کنسلی فقط بخش‌های مهم:

   *

   * 16 = PENALTIES

   * 33 = VOLUNTARY REFUNDS

   */

  const cancellationSections=

    sections.filter(section=>{

      const rel=String(

        section.getAttribute('rel')||''

      )



      return[

        '16',

        '33'

      ].includes(rel)

    })



  const source=

    cancellationSections.length

      ?cancellationSections

      :sections



  return source

    .map(section=>{

      const title=

        section

          .querySelector('h2')

          ?.textContent

          ?.trim()||

        'قوانین کنسلی'



      const text=

        section

          .querySelector('p')

          ?.textContent

          ?.replace(/\n+/g,'\n')

          ?.trim()||

        ''



      return{

        title,

        text

      }

    })

    .filter(

      item=>item.text

    )

}

function formatNumber(value) {

  return new Intl.NumberFormat('fa-IR').format(Number(value || 0))

}



function formatFlightDate(value) {

  const date = parseDate(value)

  if (!date) return '-'



  const enDate = new Intl.DateTimeFormat('en-US', {

    month: 'long',

    day: 'numeric'

  }).format(date)



  const faDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {

    day: 'numeric',

    month: 'long',

    year: 'numeric'

  }).format(date)



  return `(${enDate}) ${faDate}`

}



function formatFlightDateShort(value) {

  const date = parseDate(value)

  if (!date) return '-'



  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {

    day: 'numeric',

    month: 'long',

    year: 'numeric'

  }).format(date)

}



function getCityLabel(code){

  const normalized=

    String(code||'')

      .trim()

      .toUpperCase()



  if(!normalized){

    return'-'

  }



  /*

   * اول اطلاعاتی که از

   * BasicInfo/airports/{code}

   * گرفته‌ایم.

   */

  const apiAirport=

    flightStore

      .getAirportByCode(

        normalized

      )



  if(apiAirport){

    return(

      apiAirport.cityNicName||

      apiAirport.cityName||

      normalized

    )

  }



  /*

   * fallback برای پروازهای داخلی

   * و اطلاعات قدیمی Store.

   */

  const oldAirport=

    findAirport(

      normalized

    )



  return(

    oldAirport?.cityNicName||

    oldAirport?.cityName||

    normalized

  )

}



function getAirportLabel(code){

  const normalized=

    String(code||'')

      .trim()

      .toUpperCase()



  if(!normalized){

    return'-'

  }



  const apiAirport=

    flightStore

      .getAirportByCode(

        normalized

      )



  if(apiAirport){

    const faName=

      apiAirport.nicName||

      ''



    const enName=

      apiAirport.name||

      normalized



    return faName

      ?`${faName} (${enName})`

      :enName

  }



  const oldAirport=

    findAirport(

      normalized

    )



  if(!oldAirport){

    return normalized

  }



  return `${

    oldAirport.nicName||

    oldAirport.name||

    normalized

  }`

}

function translateNiraCancellationRule(text) {

  if (!text) {
    return ''
  }

  /*
   * اعداد فارسی و عربی را برای Regex
   * به عدد انگلیسی تبدیل می‌کنیم.
   */
  function toEnglishDigits(value) {

    return String(value || '')
      .replace(/[۰-۹]/g, digit =>
        '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)
      )
      .replace(/[٠-٩]/g, digit =>
        '٠١٢٣٤٥٦٧٨٩'.indexOf(digit)
      )
  }


  function toPersianDigits(value) {

    return String(value || '')
      .replace(/\d/g, digit =>
        '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]
      )
  }


  let original =
    String(text)
      .trim()
      .replace(/\s+/g, ' ')


  /*
   * برای Match کردن یک نسخه Normalize شده می‌سازیم.
   * متن اصلی تغییر نمی‌کند.
   */
  let value =
    toEnglishDigits(original)
      .replace(/یک\s*روزS?/gi, '1 DAYS')
      .replace(/(\d+)\s*روزS?/gi, '$1 DAYS')
      .replace(/(\d+)\s*ساعت/gi, '$1 HOURS')
      .replace(
        /عدم\s*حضور\s*مسافر/gi,
        'NOSHOW'
      )
      .replace(
        /\bB\.?\s*D\.?\b/gi,
        'BEFORE DEPARTURE'
      )
      .replace(/\s+/g, ' ')
      .trim()


  /*
   * =========================================
   * REFUND BEFORE 10 DAYS
   * =========================================
   */

  let match =
    value.match(
      /REFUND\s+BEFORE\s+(\d+)\s+DAYS?/i
    )

  if (match) {

    return (
      `استرداد قبل از ${toPersianDigits(match[1])} ` +
      `روز مانده به پرواز`
    )

  }


  /*
   * =========================================
   * REFUND 10 - 7 DAYS
   * REFUND 7 - 3 DAYS
   * REFUND 3 - 1 DAYS
   * =========================================
   */

  match =
    value.match(
      /REFUND\s+(\d+)\s*-\s*(\d+)\s+DAYS?/i
    )

  if (match) {

    return (
      `استرداد از ${toPersianDigits(match[1])} ` +
      `روز تا ${toPersianDigits(match[2])} ` +
      `روز قبل از پرواز`
    )

  }


  /*
   * =========================================
   * REFUND 1 DAYS - 6 HOURS
   * =========================================
   */

  match =
    value.match(
      /REFUND\s+(\d+)\s+DAYS?\s*-\s*(\d+)\s+HOURS?/i
    )

  if (match) {

    return (
      `استرداد از ${toPersianDigits(match[1])} ` +
      `روز تا ${toPersianDigits(match[2])} ` +
      `ساعت قبل از پرواز`
    )

  }


  /*
   * =========================================
   * NOSHOW 6 HOURS B.D
   *
   * بعد از Normalize:
   * NOSHOW 6 HOURS BEFORE DEPARTURE
   * =========================================
   */

  match =
    value.match(
      /NOSHOW\s+(\d+)\s+HOURS?\s+BEFORE\s+DEPARTURE/i
    )

  if (match) {

    return (
      `عدم حضور مسافر از ${toPersianDigits(match[1])} ` +
      `ساعت قبل از پرواز`
    )

  }


  /*
   * =========================================
   * Domestic BUSINESS
   * FROM 3 HOURS BEFORE DEPARTURE (NOSHOW)
   * =========================================
   */

  if (
    /DOMESTIC\s+BUSINESS.*FROM\s+3\s+HOURS?\s+BEFORE\s+DEPARTURE.*NOSHOW/i
      .test(value)
  ) {

    return (
      'پرواز داخلی - کلاس بیزینس: ' +
      'از ۳ ساعت قبل از پرواز ' +
      '(عدم حضور مسافر)'
    )

  }


  /*
   * =========================================
   * Domestic BUSINESS
   * Any time up to 12P.M 1 day before departure
   * =========================================
   */

  if (
    /DOMESTIC\s+BUSINESS.*ANY\s+TIME\s+UP\s+TO\s+12\s*P\.?\s*M\.?\s+1\s+DAYS?\s+BEFORE\s+DEPARTURE/i
      .test(value)
  ) {

    return (
      'پرواز داخلی - کلاس بیزینس: ' +
      'تا ساعت ۱۲ ظهر یک روز قبل از پرواز'
    )

  }


  /*
   * =========================================
   * FROM 12P.M 1 DAY BEFORE DEPARTURE
   * UP TO 3 HOURS BEFORE DEPARTURE
   * =========================================
   */

  if (
    /FROM\s+12\s*P\.?\s*M\.?\s+1\s+DAYS?\s+BEFORE\s+DEPARTURE\s+UP\s+TO\s+3\s+HOURS?\s+BEFORE\s+DEPARTURE/i
      .test(value)
  ) {

    return (
      'از ساعت ۱۲ ظهر یک روز قبل از پرواز ' +
      'تا ۳ ساعت قبل از پرواز'
    )

  }


  /*
   * =========================================
   * FROM 3 HOURS BEFORE DEPARTURE
   * UP TO DEPARTURE (NOSHOW DOM)
   * =========================================
   */

  if (
    /FROM\s+3\s+HOURS?\s+BEFORE\s+DEPARTURE\s+UP\s+TO\s+DEPARTURE/i
      .test(value)
  ) {

    return (
      'از ۳ ساعت قبل از پرواز ' +
      'تا زمان پرواز ' +
      '(عدم حضور مسافر)'
    )

  }


  /*
   * =========================================
   * ANY TIME UP TO 12P.M
   * 1 DAY BEFORE DEPARTURE
   * =========================================
   */

  if (
    /ANY\s+TIME\s+UP\s+TO\s+12\s*P\.?\s*M\.?\s+1\s+DAYS?\s+BEFORE\s+DEPARTURE/i
      .test(value)
  ) {

    return (
      'تا ساعت ۱۲ ظهر یک روز قبل از پرواز'
    )

  }


  /*
   * =========================================
   * Fallback فقط برای NIRA
   * =========================================
   */

  let result = value

    .replace(
      /DOMESTIC\s+BUSINESS/gi,
      'پرواز داخلی - کلاس بیزینس'
    )

    .replace(
      /\bDOMESTIC\b/gi,
      'پرواز داخلی'
    )

    .replace(
      /\bBUSINESS\b/gi,
      'کلاس بیزینس'
    )

    .replace(
      /\bREFUND\b/gi,
      'استرداد'
    )

    .replace(
      /NOSHOW|NO[\s-]?SHOW/gi,
      'عدم حضور مسافر'
    )

    .replace(
      /ANY\s+TIME\s+UP\s+TO/gi,
      'تا'
    )

    .replace(
      /UP\s+TO/gi,
      'تا'
    )

    .replace(
      /\bFROM\b/gi,
      'از'
    )

    .replace(
      /BEFORE\s+DEPARTURE/gi,
      'قبل از پرواز'
    )

    .replace(
      /\bDEPARTURE\b/gi,
      'زمان پرواز'
    )

    .replace(
      /12\s*P\.?\s*M\.?/gi,
      'ساعت ۱۲ ظهر'
    )

    .replace(
      /12\s*A\.?\s*M\.?/gi,
      'ساعت ۱۲ نیمه‌شب'
    )

    .replace(
      /(\d+)\s+DAYS?/gi,
      '$1 روز'
    )

    .replace(
      /(\d+)\s+HOURS?/gi,
      '$1 ساعت'
    )

    .replace(
      /\bDOM\b/gi,
      'داخلی'
    )


  return toPersianDigits(result)
    .replace(/\s+/g, ' ')
    .trim()
}





function getRuleDescription(rule) {

  if (isNira.value) {

    return translateNiraCancellationRule(
      rule.title ||
      'شرایط جریمه'
    )

  }

  return (
    rule.description ||
    rule.title ||
    rule.rule ||
    rule.text ||
    'شرایط جریمه'
  )
}



function getRulePenalty(rule) {

  if (isNira.value) {

    if (!rule.penalty) return 'نامشخص'

    return `${formatNumber(rule.penalty)}% جریمه`

  }



  const penalty = rule.penaltyPercent ?? rule.percent ?? rule.penalty ?? rule.amount

  if (penalty == null) return 'نامشخص'



  if (rule.penaltyPercent != null || rule.percent != null) {

    return `${formatNumber(penalty)}% جریمه`

  }



  return `${formatPrice(penalty)} ریال`

}



function getFlightDurationLabel(segment) {

  if (segment.durationText) return `مدت پرواز: ${segment.durationText}`



  if (Number.isFinite(Number(segment.durationMinutes)) && Number(segment.durationMinutes) > 0) {

    return `مدت پرواز: ${formatDurationFromMinutes(Number(segment.durationMinutes))}`

  }



  const diffMinutes = getDiffMinutes(segment.departure, segment.arrival)

  if (diffMinutes <= 0) return 'مدت پرواز: -'



  return `مدت پرواز: ${formatDurationFromMinutes(diffMinutes)}`

}



function getDiffMinutes(startTime, endTime) {

  const start = parseDate(startTime)

  const end = parseDate(endTime)

  if (!start || !end) return 0



  const diff = Math.floor((end.getTime() - start.getTime()) / 60000)

  return diff > 0 ? diff : 0

}



function formatDurationFromMinutes(totalMinutes) {

  const hours = Math.floor(totalMinutes / 60)

  const minutes = totalMinutes % 60



  if (hours > 0 && minutes > 0) {

    return `${formatNumber(hours)} ساعت و ${formatNumber(minutes)} دقیقه`

  }



  if (hours > 0) {

    return `${formatNumber(hours)} ساعت`

  }



  return `${formatNumber(minutes)} دقیقه`

}

</script>



<style scoped>

.fade-slide-enter-active,

.fade-slide-leave-active {

  transition: opacity 0.25s ease, transform 0.25s ease;

}



.fade-slide-enter-from {

  opacity: 0;

  transform: translateY(10px);

}



.fade-slide-leave-to {

  opacity: 0;

  transform: translateY(-10px);

}

</style>
