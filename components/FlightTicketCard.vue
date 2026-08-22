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
    class="flex-1 order-1 md:order-2"
  >
    <UiBaseButton
      label="انتخاب پرواز"
      variant="filled"
      color="primary"
      :active="false"
      :disabled="false"
      class="w-full text-[12px] text-white py-2 !rounded-3xl ml-2 mt-5"
      @click="selectFlight"
    />

    <p
      v-if="capacityError"
      class="mt-2 text-center text-[12px] font-bold text-red-500"
      dir="rtl"
    >
      {{ capacityError }}
    </p>
  </div>

  <div class="flex-[3] order-2 text-right md:order-1">
    <p class="font-bold text-[22px] text-[var(--color-primary-dark)]">
      {{ formatPrice(cardPrice) }}
    </p>

    <p class="text-sm text-left font-normal">
      ریال
    </p>
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
            v-else
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
    v-else
      class="mt-2 text-[13px] font-bold text-gray-700"
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
            class="flex text-[12px] flex-col md:flex-row bg-gray-100"
          >
            <div class="flex-1 order-2 md:order-1 border-white border-t-2 md:border-t-0 border-r-1 border-dashed relative p-3 pb-12 flex flex-col justify-center">
              <template v-if="panelPassengerPrices.length">
                <div
                  v-for="(item, index) in panelPassengerPrices"
                  :key="`passenger-${index}`"
                  class="flex py-2"
                >
                  <p class="flex-1 text-start">{{ formatPrice(item.total) }}</p>
                  <p class="flex-1 flex justify-end">
                    <span class="order-2 px-2">({{ item.count }})</span>
                    <span class="order-1 font-bold">{{ item.label }}</span>
                  </p>
                </div>
              </template>

              <template v-else>
                <div class="flex py-2">
                  <p class="flex-1 text-start">{{ formatPrice(cardPrice) }}</p>
                  <p class="flex-1 flex justify-end">
                    <span class="order-2 px-2">1</span>
                    <span class="order-1">بزرگسال</span>
                  </p>
                </div>
              </template>

              <p class="flex text-[var(--color-primary-dark)] flex-row-reverse justify-center border-t-1 font-bold pt-4 mt-4">
                <span class="px-2">مجموع</span>
                <span>{{ formatPrice(panelTotalPrice) }}</span>
                <span class="px-2">ریال</span>
              </p>
            </div>

            <div
  class="flex-[3] order-2 relative p-3 pb-12 flex flex-col"
>
  <!-- ========================= -->
  <!-- قوانین PARTO -->
  <!-- ========================= -->
  <template v-if="isParto">

    <div
      v-if="loadingPartoRules"
      class="flex mt-2 flex-row-reverse"
    >
      <p
        class="flex-1 text-[12px] text-gray-500 flex justify-end items-center"
      >
        در حال دریافت قوانین کنسلی...
      </p>
    </div>

    <div
      v-else-if="partoRulesError"
      class="flex mt-2 flex-row-reverse"
    >
      <p
        class="flex-1 text-[12px] text-red-500 flex justify-end items-center"
      >
        {{ partoRulesError }}
      </p>
    </div>

    <template v-else-if="partoRules.length">
  <div
    v-for="(rule,index) in partoRules"
    :key="`parto-rule-${index}`"
    class="bg-white rounded-xl p-4 mb-4 border border-gray-200"
    dir="rtl"
  >
    <!-- مسیر -->
    <div
      v-if="rule.cityPair"
      class="flex items-center justify-between border-b border-gray-100 pb-3 mb-3"
    >
      <p
        class="font-bold text-[12px] text-[var(--color-primary-dark)]"
      >
        {{ rule.categoryFa }}
      </p>

      <p
        class="text-[11px] text-gray-500"
        dir="ltr"
      >
        {{ rule.cityPair }}
      </p>
    </div>

    <!-- بخش‌های قوانین -->
    <div
      v-for="(section,sectionIndex) in rule.sections"
      :key="`section-${sectionIndex}`"
      class="mb-4 last:mb-0"
    >
      <p
        class="font-bold text-[11px] text-gray-700 mb-2"
        dir="ltr"
      >
        {{ section.title }}
      </p>

      <p
        class="text-[11px] leading-6 text-gray-600 whitespace-pre-line"
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
</template>

    <div
      v-else
      class="flex mt-2 flex-row-reverse"
    >
      <p
        class="flex-1 text-[12px] text-red-500 flex justify-end items-center"
      >
        قوانین کنسلی برای این پرواز اعلام نشده است.
      </p>
    </div>

  </template>

  <!-- ========================= -->
  <!-- قوانین NIRA / MAHAN -->
  <!-- ========================= -->
  <template v-else>

    <template v-if="loadingFare">
      <div
        class="flex mt-2 flex-row-reverse"
      >
        <p
          class="flex-1 text-[12px] text-gray-500 flex justify-end items-center"
        >
          در حال دریافت اطلاعات نرخ و قوانین...
        </p>
      </div>
    </template>

    <template
      v-else-if="refundPolicies.length>0"
    >
      <div
        v-for="(rule,index) in refundPolicies"
        :key="`refund-rule-${index}`"
        class="flex mt-2 flex-row-reverse border-b border-gray-200 pb-2 last:border-b-0"
      >
        <p
          class="flex-1 text-[12px] flex justify-end items-center text-right"
        >
          {{ getRuleDescription(rule) }}
        </p>

        <p
          dir="rtl"
          class="relative flex items-center justify-center gap-1 bg-white px-6 py-2 rounded-xl shadow-sm overflow-hidden after:content-[''] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-2 after:bg-teal-400 text-gray-800 font-medium w-fit"
        >
          {{ getRulePenalty(rule) }}
        </p>
      </div>
    </template>

    <template v-else>
      <div
        class="flex mt-2 flex-row-reverse"
      >
        <p
          class="flex-3 text-[12px] text-red-500 flex justify-end items-center"
        >
          قوانین کنسلی برای این پرواز اعلام نشده است.
        </p>
      </div>
    </template>

  </template>
</div>
          </div>

          <div
  v-else-if="activeTab==='info'"
  key="info-tab"
  class="flex text-[12px] flex-col md:flex-row bg-gray-100"
>
  <!-- قیمت‌ها -->
  <div
    class="flex-1 order-2 md:order-1 border-white border-t-2 md:border-t-0 border-r-1 border-dashed relative p-3 pb-12 flex flex-col justify-center"
  >
    <template v-if="panelPassengerPrices.length">
      <div
        v-for="(item,index) in panelPassengerPrices"
        :key="`info-passenger-${index}`"
        class="flex py-2"
      >
        <p class="flex-1 text-start">
          {{ formatPrice(item.total) }}
        </p>

        <p class="flex-1 flex justify-end">
          <span class="order-2 px-2">
            ({{ item.count }})
          </span>

          <span class="order-1 font-bold">
            {{ item.label }}
          </span>
        </p>
      </div>
    </template>

    <template v-else>
      <div class="flex py-2">
        <p class="flex-1 text-start">
          {{ formatPrice(cardPrice) }}
        </p>

        <p class="flex-1 flex justify-end">
          <span class="order-2 px-2">
            1
          </span>

          <span class="order-1">
            بزرگسال
          </span>
        </p>
      </div>
    </template>

    <p
      class="flex text-[var(--color-primary-dark)] flex-row-reverse justify-center border-t-1 font-bold pt-4 mt-4"
    >
      <span class="px-2">
        مجموع
      </span>

      <span>
        {{ formatPrice(panelTotalPrice) }}
      </span>

      <span class="px-2">
        ریال
      </span>
    </p>
  </div>


  <!-- اطلاعات پرواز -->
  <div
    class="flex-[3] order-1 md:order-2 relative p-3 pb-12 mt-4"
  >
    <template v-if="loadingFare">
      <div class="flex mt-2 flex-row-reverse">
        <p
          class="flex-1 text-[12px] text-gray-500 flex justify-end items-center"
        >
          در حال دریافت اطلاعات نرخ...
        </p>
      </div>
    </template>

    <template v-else>

      <!-- ============================ -->
      <!-- بار مجاز فقط برای PARTO -->
      <!-- ============================ -->

      <div
        v-if="isParto"
        class="mb-6"
        dir="rtl"
      >
        <div
          v-if="loadingBaggage"
          class="rounded-xl bg-white p-4 text-center text-[11px] text-gray-500"
        >
          در حال دریافت بار مجاز...
        </div>

        <div
          v-else-if="baggageError"
          class="rounded-xl bg-red-50 p-4 text-center text-[11px] text-red-500"
        >
          {{ baggageError }}
        </div>

        <div
          v-else-if="baggageInfoes.length"
          class="rounded-xl bg-white border border-gray-200 overflow-hidden"
        >
          <div
            class="px-4 py-3 font-bold text-[12px] border-b border-gray-100"
          >
            بار مجاز
          </div>

          <div
            v-for="(item,index) in baggageInfoes"
            :key="`baggage-${index}`"
            class="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0"
          >
            <div class="text-right">
              <p class="font-bold text-[11px]">
                {{ getCityLabel(item.departure) }}
                →
                {{ getCityLabel(item.arrival) }}
              </p>

              <p
                class="mt-1 text-[10px] text-gray-500"
              >
                پرواز
                {{ item.flightNo||'-' }}
              </p>
            </div>

            <div
              class="shrink-0 rounded-lg bg-gray-100 px-3 py-2 font-bold text-[11px] text-[var(--color-primary-dark)]"
            >
              {{ item.baggage||'-' }}
            </div>
          </div>
        </div>

        <div
          v-else
          class="rounded-xl bg-white p-4 text-center text-[11px] text-gray-500"
        >
          اطلاعات بار مجاز اعلام نشده است.
        </div>
      </div>


      <!-- ============================ -->
      <!-- اطلاعات اصلی پرواز -->
      <!-- همیشه نمایش داده شود -->
      <!-- ============================ -->

      <div
        v-for="(segment,index) in segments"
        :key="`segment-${index}`"
        class="mb-6 last:mb-0"
      >
        <div
          v-if="segmentTitle(index)"
          class="flex flex-col md:flex-row mb-2"
        >
          <p class="text-center md:flex-1 font-bold">
            {{ segmentTitle(index) }}
          </p>

          <p class="text-center md:flex-1"></p>
        </div>

        <div class="flex flex-col md:flex-row">
          <p class="text-center md:flex-1 font-bold">
            {{ formatFlightDate(segment.departure) }}
          </p>

          <p class="text-center md:flex-1">
            {{ formatTime(segment.departure) }}
          </p>
        </div>

        <div class="flex flex-col md:flex-row">
          <p class="text-center md:flex-1 font-bold">
            {{ getCityLabel(segment.origin) }}
          </p>

          <p class="text-center md:flex-1">
            {{ getAirportLabel(segment.origin) }}
          </p>
        </div>

        <div class="flex flex-col md:flex-row mt-3">
          <p class="text-center md:flex-1 font-bold">
            {{ formatFlightDate(segment.arrival) }}
          </p>

          <p class="text-center md:flex-1">
            {{ formatTime(segment.arrival) }}
          </p>
        </div>

        <div class="flex flex-col md:flex-row">
          <p class="text-center md:flex-1 font-bold">
            {{ getCityLabel(segment.destination) }}
          </p>

          <p class="text-center md:flex-1">
            {{ getAirportLabel(segment.destination) }}
          </p>
        </div>

        <div class="flex flex-col md:flex-row my-3">
          <p
            class="text-center md:flex-1 text-[var(--color-primary-dark)] font-bold"
          >
            {{ getFlightDurationLabel(segment) }}
          </p>

          <p class="text-center md:flex-1"></p>
        </div>

        <div class="flex flex-col md:flex-row mt-4">
          <div
            class="text-center flex justify-center py-1 md:flex-1"
          >
            <div
              class="border-r-1 border-[var(--color-gray-300)] flex flex-col text-center py-4 px-4"
            >
              <p class="py-2">
                شماره پرواز
              </p>

              <p class="font-bold">
                {{ segment.flightNumber||'-' }}
              </p>
            </div>

            <div
              class="flex flex-col text-center py-4 px-4"
            >
              <p class="py-2">
  کلاس پرواز
</p>

<p class="font-bold">
  {{ getSegmentCabinLabel(segment) }}
</p>
            </div>
          </div>

          <div
            class="text-center flex flex-col items-center justify-center md:flex-1"
          >
            <p class="py-2">
              نوع هواپیما
            </p>

            <p class="font-bold">
              {{
                segment.aircraftTypeName||
                segment.aircraftTypeCode||
                '-'
              }}
            </p>
          </div>
        </div>

        <!-- توقف بین segmentها -->
        <div
          v-if="
            isParto&&
            index<segments.length-1&&
            segments[index+1]?.direction===segment.direction
          "
          class="my-5 flex items-center gap-3"
          dir="rtl"
        >
          <div
            class="h-px flex-1 border-t border-dashed border-orange-300"
          ></div>

          <div
            class="shrink-0 rounded-xl bg-orange-50 border border-orange-100 px-5 py-2 text-center"
          >
            <p
              class="text-[11px] font-bold text-orange-600"
            >
              توقف در
              {{ getCityLabel(segment.destination) }}
            </p>

            <p
              class="mt-1 text-[10px] text-gray-500"
            >
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
            class="h-px flex-1 border-t border-dashed border-orange-300"
          ></div>
        </div>
      </div>

    </template>
  </div>
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

  /*
   * لوگوی Store قدیمی اولویت دارد.
   * این باعث می‌شود کیش‌ایر، پارس‌ایر، نفت،
   * وارش و سایر ایرلاین‌های داخلی لوگوی محلی
   * خودشان را از دست ندهند.
   */
  const logo=
    oldAirline.value?.logo||
    oldAirline.value?.image||
    props.airlineInfo?.logo||
    props.airlineInfo?.image||
    basicAirline.value?.logo||
    basicAirline.value?.image||
    ''

  return normalizeAirlineLogo(logo)
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



function getRuleDescription(rule) {
  if (isNira.value) {
    return rule.title || 'شرایط جریمه'
  }

  return rule.description || rule.title || rule.rule || rule.text || 'شرایط جریمه'
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
