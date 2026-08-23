<template>
  <div
    dir="rtl"
    class="profile-page"
  >
    <!-- بک‌گراند مستقل -->
    <div
      class="profile-background"
      aria-hidden="true"
    ></div>

    <!-- محتوای صفحه -->
    <div class="profile-page-content">
      <div class="profile-container">
        <div class="profile-layout">
          <!-- منوی باریک سمت راست -->
          <aside class="profile-menu">
            <button
              v-for="item in menuItems"
              :key="item.key"
              type="button"
              class="profile-menu-item"
              :class="activeItem === item.key ? 'profile-menu-item-active' : ''"
              @click="activeItem = item.key"
            >
              <span class="text-xl">
                {{ item.icon }}
              </span>

              <span class="text-[11px]">
                {{ item.label }}
              </span>
            </button>
          </aside>

          <!-- ستون وسط -->
          <main class="profile-content">
            <!-- بخش بالای ستون وسط -->
            <div class="profile-top">
              <!-- اطلاعات کاربر -->
      <section class="profile-user-info">
  <!-- Loading -->
  <div
    v-if="userLoading"
    class="flex h-full min-h-[105px] items-center justify-center"
  >
    <div class="text-center">
      <div
        class="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#14179e]"
      ></div>

      <p class="text-xs text-gray-500">
        در حال دریافت اطلاعات کاربر...
      </p>
    </div>
  </div>

  <!-- Error -->
  <div
    v-else-if="userError"
    class="flex h-full min-h-[105px] items-center justify-center text-center"
  >
    <div>
      <p class="text-sm font-bold text-red-600">
        {{ userError }}
      </p>

      <button
        type="button"
        class="mt-3 rounded-lg bg-[#14179e] px-4 py-2 text-xs font-bold text-white"
        @click="fetchUserProfile"
      >
        تلاش مجدد
      </button>
    </div>
  </div>

  <!-- User information -->
  <div
    v-else
    class="user-info-grid"
  >
    <div class="user-info-item">
      <span class="user-info-label">
        نام
      </span>

      <span>
        {{ user.firstName || '-' }}
      </span>
    </div>

    <div class="user-info-item">
      <span class="user-info-label">
        شماره موبایل
      </span>

      <span dir="ltr">
        {{ user.mobile || '-' }}
      </span>
    </div>

    <div class="user-info-item">
      <span class="user-info-label">
        نام خانوادگی
      </span>

      <span>
        {{ user.lastName || '-' }}
      </span>
    </div>

    <div class="user-info-item">
      <span class="user-info-label">
        ایمیل
      </span>

      <span dir="ltr">
        {{ user.email || '-' }}
      </span>
    </div>

    <div class="user-info-item">
      <span class="user-info-label">
        کد ملی
      </span>

      <span dir="ltr">
        {{ user.nationalCode || '-' }}
      </span>
    </div>

    <div class="user-info-item">
      <span class="user-info-label">
        پاسپورت
      </span>

      <span dir="ltr">
        {{ user.passport || '-' }}
      </span>
    </div>
  </div>
</section>

              <!-- آب‌وهوا -->
              <section class="profile-weather">
                <p class="text-sm font-bold text-gray-600">
                  {{ currentPersianDate }}
                </p>

                <div class="my-3 text-4xl">
                  🌤️
                </div>

                <p class="text-sm text-gray-500">
                  منطقه: تهران، ایران
                </p>
              </section>
            </div>

            <!-- آخرین سفارشات -->
            <!-- داشبورد و آخرین سفارش‌ها -->
<section
  v-if="activeItem === 'dashboard'"
  class="orders-section"
>
  <h2 class="orders-title">
    آخرین سفارشات ثبت شده
  </h2>

  <div
    v-if="contractsLoading"
    class="flex min-h-[220px] items-center justify-center rounded-xl bg-white"
  >
    <div class="text-center">
      <div
        class="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#14179e]"
      ></div>

      <p class="text-xs text-gray-500">
        در حال دریافت سفارش‌ها...
      </p>
    </div>
  </div>

  <div
    v-else-if="contractsError"
    class="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
  >
    <p class="text-sm font-bold text-red-600">
      {{ contractsError }}
    </p>

    <button
      type="button"
      class="mt-4 rounded-lg bg-[#14179e] px-5 py-2 text-xs font-bold text-white"
      @click="fetchUserContracts"
    >
      تلاش مجدد
    </button>
  </div>

  <div
    v-else-if="visibleOrders.length"
    class="orders-list"
  >
    <div
      v-for="order in visibleOrders"
      :key="order.id"
      class="order-card"
    >
      <div class="order-column">
        <span class="order-label">
          شماره سفارش
        </span>

        <span>
          {{ toPersianDigits(order.id) }}
        </span>
      </div>

      <div class="order-column">
        <span class="order-label">
          نوع سفارش
        </span>

        <span>
          {{ order.type }}
        </span>
      </div>

      <div class="order-column">
        <span class="order-label">
          مبلغ (تومان)
        </span>

        <span>
          {{ formatPrice(order.amount) }}
        </span>
      </div>

      <div class="order-column">
        <span class="order-label">
          تاریخ و ساعت
        </span>

        <span>
          {{ order.dateTime }}
        </span>
      </div>

      <div class="flex items-center justify-center">
        <button
          type="button"
          class="rounded-full bg-[#14179e] px-5 py-2.5 text-xs font-bold text-white"
          @click="openOrderDetails(order.contract)"
        >
          اطلاعات بیشتر
        </button>
      </div>
    </div>
  </div>

  <div
    v-else
    class="rounded-xl bg-white p-8 text-center text-sm font-bold text-gray-500"
  >
    سفارشی برای این کاربر یافت نشد.
  </div>

  <div
    v-if="mappedOrders.length > 4"
    class="mt-5 flex justify-center"
  >
    <button
      type="button"
      class="rounded-full border border-gray-400 bg-white px-5 py-2 text-xs text-[#14179e]"
      @click="showAllContracts = !showAllContracts"
    >
      {{
        showAllContracts
          ? 'نمایش سفارش‌های کمتر'
          : 'نمایش قراردادهای بیشتر...'
      }}
    </button>
  </div>
</section>

<!-- صفحه پروفایل -->
<section
  v-else-if="activeItem === 'profile'"
  class="profile-details-section"
>
  <div class="profile-details-header">
    <h2 class="profile-details-title">
      اطلاعات کاربری شما:
    </h2>

    <button
      type="button"
      class="rounded-md bg-[#14179e] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0d107e]"
      @click="openEditProfileModal"
    >
      ویرایش اطلاعات
    </button>
  </div>

  <div class="profile-details-card">
    <div class="profile-details-grid">
      <div class="profile-detail-item">
        <span class="profile-detail-label">
          نام:
        </span>

        <span>
          {{ user.firstName || '-' }}
        </span>
      </div>

      <div class="profile-detail-item">
        <span class="profile-detail-label">
          نام خانوادگی:
        </span>

        <span>
          {{ user.lastName || '-' }}
        </span>
      </div>

      <div class="profile-detail-item">
        <span class="profile-detail-label">
          کد ملی:
        </span>

        <span dir="ltr">
          {{ user.nationalCode || '-' }}
        </span>
      </div>

      <div class="profile-detail-item">
        <span class="profile-detail-label">
          تاریخ تولد:
        </span>

        <span>
          {{ formatUserBirthDate(user.birthDate) }}
        </span>
      </div>

      <div class="profile-detail-item">
        <span class="profile-detail-label">
          جنسیت:
        </span>

        <span>
          {{ getGenderTitle(user.gender) }}
        </span>
      </div>

      <div class="profile-detail-item">
        <span class="profile-detail-label">
          شماره پاسپورت:
        </span>

        <span dir="ltr">
          {{ user.passport || '-' }}
        </span>
      </div>

      <div class="profile-detail-item profile-detail-email">
        <span class="profile-detail-label">
          ایمیل:
        </span>

        <span dir="ltr">
          {{ user.email || '-' }}
        </span>
      </div>
    </div>
  </div>
</section>
<section
  v-else-if="activeItem === 'contracts'"
  class="orders-section"
>
  <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
    <h2 class="orders-title !mb-0">
      قراردادهای الکترونیک:
    </h2>

    <div class="flex items-center gap-3">
      <!-- فیلتر دسته‌بندی -->
      <div class="relative">
        <button
          type="button"
          class="flex min-w-[125px] items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm text-gray-600 shadow-md"
          @click="
            categoryMenuOpen = !categoryMenuOpen;
            sortMenuOpen = false
          "
        >
          <span>⌘</span>
          <span>
            {{ selectedCategoryLabel }}
          </span>
        </button>

        <div
          v-if="categoryMenuOpen"
          class="absolute right-0 top-full z-50 mt-2 w-full min-w-[125px] overflow-hidden rounded-lg bg-white shadow-xl"
        >
          <button
            v-for="item in contractCategories"
            :key="item.key"
            type="button"
            class="block w-full px-5 py-3 text-right text-sm transition hover:bg-gray-100"
            :class="
              contractCategory === item.key
                ? 'bg-gray-100 font-bold text-[#14179e]'
                : 'text-gray-700'
            "
            @click="
              contractCategory = item.key;
              categoryMenuOpen = false
            "
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <!-- مرتب‌سازی -->
      <div class="relative">
        <button
          type="button"
          class="flex min-w-[150px] items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm text-gray-600 shadow-md"
          @click="
            sortMenuOpen = !sortMenuOpen;
            categoryMenuOpen = false
          "
        >
          <span>⇅</span>
          <span>
            {{ selectedSortLabel }}
          </span>
        </button>

        <div
          v-if="sortMenuOpen"
          class="absolute right-0 top-full z-50 mt-2 w-full min-w-[150px] overflow-hidden rounded-lg bg-white shadow-xl"
        >
          <button
            v-for="item in contractSortOptions"
            :key="item.key"
            type="button"
            class="block w-full px-5 py-3 text-right text-sm transition hover:bg-gray-100"
            :class="
              contractSort === item.key
                ? 'bg-gray-100 font-bold text-[#14179e]'
                : 'text-gray-700'
            "
            @click="
              contractSort = item.key;
              sortMenuOpen = false
            "
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading -->
  <div
    v-if="contractsLoading"
    class="flex min-h-[220px] items-center justify-center rounded-xl bg-white"
  >
    <div class="text-center">
      <div
        class="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#14179e]"
      ></div>

      <p class="text-xs text-gray-500">
        در حال دریافت قراردادها...
      </p>
    </div>
  </div>

  <!-- Error -->
  <div
    v-else-if="contractsError"
    class="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
  >
    <p class="text-sm font-bold text-red-600">
      {{ contractsError }}
    </p>

    <button
      type="button"
      class="mt-4 rounded-lg bg-[#14179e] px-5 py-2 text-xs font-bold text-white"
      @click="fetchUserContracts"
    >
      تلاش مجدد
    </button>
  </div>

  <!-- Contracts -->
  <div
    v-else-if="filteredContractOrders.length"
    class="orders-list"
  >
    <div
      v-for="order in filteredContractOrders"
      :key="`contract-${order.id}`"
      class="order-card"
    >
      <div class="order-column">
        <span class="order-label">
          شماره سفارش
        </span>

        <span>
          {{ toPersianDigits(order.id) }}
        </span>
      </div>

      <div class="order-column">
        <span class="order-label">
          نوع سفارش
        </span>

        <span>
          {{ order.type }}
        </span>
      </div>

      <div class="order-column">
        <span class="order-label">
          مبلغ (تومان)
        </span>

        <span>
          {{ formatPrice(order.amount) }}
        </span>
      </div>

      <div class="order-column">
        <span class="order-label">
          تاریخ و ساعت
        </span>

        <span>
          {{ order.dateTime }}
        </span>
      </div>

      <div class="flex items-center justify-center">
        <button
          type="button"
          class="rounded-full bg-[#14179e] px-5 py-2.5 text-xs font-bold text-white shadow-md"
          @click="openOrderDetails(order.contract)"
        >
          اطلاعات بیشتر
        </button>
      </div>
    </div>
  </div>

  <!-- Empty -->
  <div
    v-else
    class="rounded-xl bg-white p-10 text-center text-sm font-bold text-gray-500"
  >
    قراردادی در این دسته‌بندی پیدا نشد.
  </div>
</section>
<section
  v-else-if="activeItem === 'transactions'"
  class="orders-section"
>
  <h2 class="orders-title">
    تراکنش‌ها:
  </h2>

  <div
    v-if="contractsLoading"
    class="flex min-h-[220px] items-center justify-center rounded-xl bg-white"
  >
    <p class="text-sm text-gray-500">
      در حال دریافت تراکنش‌ها...
    </p>
  </div>

  <div
    v-else-if="contractsError"
    class="rounded-xl bg-red-50 p-6 text-center text-red-600"
  >
    {{ contractsError }}
  </div>

  <div
    v-else-if="transactions.length"
    class="orders-list"
  >
    <div
      v-for="transaction in transactions"
      :key="`transaction-${transaction.id}`"
      class="order-card"
    >
      <div class="order-column">
        <span class="order-label">
          شماره سفارش
        </span>

        <span>
          {{
            toPersianDigits(
              transaction.orderNumber
            )
          }}
        </span>
      </div>

      <div class="order-column">
        <span class="order-label">
          نوع سفارش
        </span>

        <span>
          {{ transaction.orderType }}
        </span>
      </div>

      <div class="order-column">
        <span class="order-label">
          مبلغ
        </span>

        <span>
          {{
            formatPrice(
              transaction.amount
            )
          }}
        </span>
      </div>

      <div class="order-column">
        <span class="order-label">
          تاریخ
        </span>

        <span>
          {{
            formatContractDate(
              transaction.date
            )
          }}
        </span>
      </div>

      <div class="flex items-center justify-center">
        <button
          type="button"
          class="rounded-full bg-[#14179e] px-5 py-2.5 text-xs font-bold text-white"
          @click="
            openTransactionDetails(
              transaction
            )
          "
        >
          اطلاعات بیشتر
        </button>
      </div>
    </div>
  </div>

  <div
    v-else
    class="rounded-xl bg-white p-8 text-center text-sm text-gray-500"
  >
    تراکنشی یافت نشد.
  </div>
</section>
<section
  v-else-if="activeItem === 'passengers'"
  class="passengers-section"
>
  <div class="mb-6 flex items-center justify-between gap-4">
    <h2 class="text-xl font-black text-gray-700">
      اطلاعات مسافران منتخب:
    </h2>

    <button
      type="button"
      class="rounded-md bg-[#14179e] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#0d107e]"
      @click="openAddPassengerModal"
    >
      افزودن مسافر
    </button>
  </div>

  <div
    v-if="passengersLoading"
    class="flex min-h-[220px] items-center justify-center rounded-xl bg-white"
  >
    <div class="text-center">
      <div
        class="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#14179e]"
      ></div>

      <p class="text-sm text-gray-500">
        در حال دریافت مسافران...
      </p>
    </div>
  </div>

  <div
    v-else-if="passengersError"
    class="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
  >
    <p class="text-sm font-bold text-red-600">
      {{ passengersError }}
    </p>

    <button
      type="button"
      class="mt-4 rounded-lg bg-[#14179e] px-5 py-2 text-xs font-bold text-white"
      @click="fetchPassengers"
    >
      تلاش مجدد
    </button>
  </div>

  <div
    v-else
    class="overflow-x-auto rounded-xl bg-white shadow-sm"
  >
    <table
      v-if="passengers.length"
      class="w-full min-w-[750px] border-collapse text-center text-sm"
    >
      <thead>
        <tr class="border-b border-gray-200 text-gray-800">
          <th class="px-4 py-5">
            نام
          </th>

          <th class="px-4 py-5">
            نام خانوادگی
          </th>

          <th class="px-4 py-5">
            کد ملی
          </th>

          <th class="px-4 py-5">
            ملیت
          </th>

          <th class="px-4 py-5">
            جنسیت
          </th>

          <th class="px-4 py-5">
            تاریخ تولد
          </th>

          <th class="px-4 py-5">
            عملیات
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="passenger in passengers"
          :key="passenger.id"
          class="border-b border-gray-200 last:border-b-0"
        >
          <td class="px-4 py-4">
            {{ passenger.fName || '-' }}
          </td>

          <td class="px-4 py-4">
            {{ passenger.lName || '-' }}
          </td>

          <td class="px-4 py-4">
            {{ toPersianDigits(passenger.codeMelli || '-') }}
          </td>

          <td class="px-4 py-4">
            {{ passenger.nationality || '-' }}
          </td>

          <td class="px-4 py-4">
            {{ getGenderTitle(passenger.gender) }}
          </td>

          <td class="px-4 py-4">
            {{ formatUserBirthDate(passenger.birthDate) }}
          </td>

          <td class="px-4 py-4">
            <div class="flex items-center justify-center gap-2">
              <button
                type="button"
                class="rounded-full bg-[#14179e] px-5 py-2 text-xs font-bold text-white"
                @click="openEditPassengerModal(passenger)"
              >
                ویرایش
              </button>

              <button
                type="button"
                class="rounded-full bg-[#e9b978] px-5 py-2 text-xs font-bold text-white"
                :disabled="deletingPassengerId === passenger.id"
                @click="openDeletePassengerModal(passenger)"
              >
                {{
                  deletingPassengerId === passenger.id
                    ? 'در حال حذف...'
                    : 'حذف'
                }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-else
      class="p-10 text-center text-sm font-bold text-gray-500"
    >
      هنوز مسافری ثبت نشده است.
    </div>
  </div>
</section>
          </main>

          <!-- ستون سمت چپ -->
          <aside class="profile-sidebar">
            <!-- خلاصه حساب -->
            <section class="account-card">
              <div class="flex items-center gap-4">
                <div
                  class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-3xl"
                >
                  👤
                </div>

                <div>
                  <p class="font-bold text-gray-700">
                    {{ user.firstName }}
                    {{ user.lastName }}
                  </p>

                  <p
                    dir="ltr"
                    class="mt-1 text-xs text-gray-500"
                  >
                    {{ user.mobile }}
                  </p>
                </div>
              </div>

              <div class="my-5 h-px bg-gray-300"></div>

              <div class="space-y-5 text-sm">
                <div class="flex justify-between">
                  <span>بلیت‌های خریداری شده</span>
                  <span>{{ summary.tickets }}</span>
                </div>

                <div class="flex justify-between">
                  <span>هتل‌های رزرو شده</span>
                  <span>{{ summary.hotels }}</span>
                </div>

                <div class="flex justify-between">
                  <span>تورهای رزرو شده</span>
                  <span>{{ summary.tours }}</span>
                </div>

                <div class="flex justify-between">
                  <span>موجودی کیف پول</span>
                  <span>{{ formatPrice(summary.wallet) }} تومان</span>
                </div>
              </div>
            </section>

            <!-- بنر -->
            <section class="advertising-card">
              بنر تبلیغاتی
            </section>
          </aside>
        </div>
      </div>
    </div>
  </div>
  
  <Teleport to="body">
  <Transition name="profile-edit-modal">
    <div
      v-if="editProfileModalOpen"
      dir="rtl"
      class="fixed inset-0 z-[2500] flex items-center justify-center bg-black/40 p-4"
      @click.self="closeEditProfileModal"
    >
      <div
        class="w-full max-w-[700px] rounded-xl bg-white p-4 shadow-2xl sm:p-6"
      >
        <!-- عنوان مودال -->
        <div
          class="flex items-center justify-between border-b border-gray-200 pb-4"
        >
          <h2 class="text-base font-black text-[#14179e]">
            ✎ ویرایش اطلاعات کاربری شما
          </h2>

          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center text-3xl text-[#14179e]"
            @click="closeEditProfileModal"
          >
            ×
          </button>
        </div>

        <!-- فرم -->
        <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <label class="profile-edit-field">
            <span>نام</span>

            <input
              v-model="editProfileForm.firstName"
              type="text"
            >
          </label>

          <label class="profile-edit-field">
            <span>نام خانوادگی</span>

            <input
              v-model="editProfileForm.lastName"
              type="text"
            >
          </label>

          <label class="profile-edit-field">
            <span>کد ملی</span>

            <input
              v-model="editProfileForm.nationalCode"
              dir="ltr"
              type="text"
            >
          </label>

          <label class="profile-edit-field">
            <span>شماره پاسپورت</span>

            <input
              v-model="editProfileForm.passport"
              dir="ltr"
              type="text"
            >
          </label>

          <label class="profile-edit-field">
            <span>ایمیل</span>

            <input
              v-model="editProfileForm.email"
              dir="ltr"
              type="email"
            >
          </label>

          <label class="profile-edit-field">
            <span>جنسیت</span>

            <select v-model="editProfileForm.gender">
              <option :value="true">
                آقا
              </option>

              <option :value="false">
                خانم
              </option>

              <option :value="null">
                انتخاب نشده
              </option>
            </select>
          </label>

          <!-- تاریخ تولد -->
          <div class="sm:col-span-3">
            <p class="mb-2 text-xs font-bold text-gray-600">
              تاریخ تولد
            </p>

            <div class="grid grid-cols-3 gap-3">
              <label class="profile-edit-field">
                <span>روز</span>

                <input
                  v-model="editProfileForm.birthDay"
                  type="number"
                  min="1"
                  max="31"
                >
              </label>

              <label class="profile-edit-field">
                <span>ماه</span>

                <input
                  v-model="editProfileForm.birthMonth"
                  type="number"
                  min="1"
                  max="12"
                >
              </label>

              <label class="profile-edit-field">
                <span>سال</span>

                <input
                  v-model="editProfileForm.birthYear"
                  type="number"
                  min="1200"
                  max="1500"
                >
              </label>
            </div>
          </div>
        </div>

        <!-- عملیات -->
        <div class="mt-6 flex items-center gap-3">
          <button
            type="button"
            disabled
            class="min-w-[170px] cursor-not-allowed rounded-full bg-[#14179e]/60 px-7 py-3 text-sm font-bold text-white"
          >
            ثبت تغییرات
          </button>

          <span class="text-xs text-gray-400">
            سرویس ویرایش اطلاعات هنوز پیاده‌سازی نشده است.
          </span>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>
  <Teleport to="body">
  <Transition name="contract-modal">
    <div
      v-if="detailsModalOpen"
      dir="rtl"
      class="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
      @click.self="closeOrderDetails"
    >
      <div
        class="flex max-h-[92vh] w-full max-w-[1400px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <!-- هدر مودال -->
        <div class="flex items-center justify-end px-5 py-4">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full text-3xl leading-none text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            @click="closeOrderDetails"
          >
            ×
          </button>
        </div>

        <div class="overflow-y-auto px-5 pb-7 md:px-7">
          <!-- خلاصه سفارش -->
          <section
            class="grid grid-cols-1 gap-x-8 gap-y-8 rounded-3xl bg-[#e2f2ff] px-6 py-8 text-sm text-gray-800 sm:grid-cols-2 xl:grid-cols-4"
          >
            <div class="flex items-center gap-2">
              <span class="font-black">شماره سفارش:</span>

              <span>
                {{ toPersianDigits(selectedContract?.id || '-') }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-black">تاریخ رزرو:</span>

              <span>
                {{ formatContractDate(selectedContract?.issueDate) }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-black">ساعت رزرو:</span>

              <span>
                {{ toPersianDigits(selectedContract?.issueTime || '-') }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-black">روز رزرو:</span>

              <span>
                {{ getPersianWeekday(selectedContract?.issueDate) }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-black">تعداد مسیر:</span>

              <span>
                {{ getRouteCountTitle(selectedContract) }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-black">تعداد مسافر:</span>

              <span>
                {{ toPersianDigits(getPassengerCount(selectedContract)) }}
                نفر
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-black">وضعیت:</span>

              <span>
                {{ getContractStatusTitle(selectedContract) }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-black">نوع سفارش:</span>

              <span>
                {{ getContractServiceType(selectedContract) }}
              </span>
            </div>
          </section>

          <!-- لیست بلیت‌ها -->
          <section
            v-if="isFlightContract(selectedContract)"
            class="mt-7"
          >
            <h2 class="mb-5 text-lg font-black text-gray-800">
              لیست بلیت‌ها
            </h2>

            <div
              v-if="ticketRows.length"
              class="overflow-x-auto rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            >
              <table
                class="w-full min-w-[1100px] border-collapse text-center text-sm"
              >
                <thead class="bg-[#d9effd] text-gray-800">
                  <tr>
                    <th class="px-4 py-4">
                      نام مسافر
                    </th>

                    <th class="px-4 py-4">
                      بازه سنی
                    </th>

                    <th class="px-4 py-4">
                      مبدا
                    </th>

                    <th class="px-4 py-4">
                      مقصد
                    </th>

                    <th class="px-4 py-4">
                      مبلغ
                    </th>

                    <th class="px-4 py-4">
                      شماره بلیت
                    </th>

                    <th class="px-4 py-4">
                      تاریخ پرواز
                    </th>

                    <th class="px-4 py-4">
                      ساعت پرواز
                    </th>

                    <th class="px-4 py-4">
                      شماره پرواز
                    </th>

                    <th class="px-4 py-4">
                      نوع پرواز
                    </th>

                    <th class="px-4 py-4">
                      هواپیمایی
                    </th>

                    <th class="px-4 py-4">
                      عملیات
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="row in ticketRows"
                    :key="row.key"
                    class="border-b border-gray-100 last:border-b-0"
                  >
                    <td
                      dir="ltr"
                      class="px-4 py-5 font-medium"
                    >
                      {{ row.passengerName }}
                    </td>

                    <td class="px-4 py-5">
                      {{ row.passengerType }}
                    </td>

                    <td class="px-4 py-5">
                      {{ row.origin }}
                    </td>

                    <td class="px-4 py-5">
                      {{ row.destination }}
                    </td>

                    <td class="px-4 py-5">
                      {{ formatPrice(row.amount) }}
                    </td>

                    <td class="px-4 py-5">
                      {{ row.ticketNumber || '-' }}
                    </td>

                    <td class="px-4 py-5">
                      {{ row.departureDate }}
                    </td>

                    <td class="px-4 py-5">
                      {{ toPersianDigits(row.departureTime) }}
                    </td>

                    <td class="px-4 py-5">
                      {{ toPersianDigits(row.flightNumber) }}
                    </td>

                    <td class="px-4 py-5">
                      {{ row.flightType }}
                    </td>

                    <td class="px-4 py-5">
                      {{ row.airlineName }}
                    </td>

                    <td class="px-4 py-5">
                      <div class="flex min-w-[175px] flex-col gap-3">
                        <div
                          class="rounded border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-500"
                        >
                          {{
                            row.ticketNumber
                              ? row.ticketNumber
                              : 'شماره بلیت ثبت نشده'
                          }}
                        </div>

                        <button
                          type="button"
                          class="rounded border px-4 py-2.5 text-xs font-bold transition disabled:cursor-not-allowed"
                          :class="getCancelButtonClass(row)"
                          :disabled="!row.canCancel || cancellingTicketKey === row.key"
                          @click="openCancelTicket(row)"
                        >
                          {{
                            cancellingTicketKey === row.key
                              ? 'در حال بررسی جریمه...'
                              : getCancellationStatusTitle(row)
                          }}
                        </button>

                        <button
                          type="button"
                          class="rounded border border-gray-300 px-4 py-2.5 text-xs transition"
                          :class="
                            row.canDownload
                              ? 'bg-white text-[#14179e] hover:bg-blue-50'
                              : 'cursor-not-allowed bg-gray-50 text-gray-300'
                          "
                          :disabled="!row.canDownload"
                          @click="downloadContractTicket(row)"
                        >
                          دانلود بلیت
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              v-else
              class="rounded-xl bg-gray-50 p-8 text-center text-sm text-gray-500"
            >
              اطلاعات بلیتی برای این سفارش ثبت نشده است.
            </div>
          </section>

          <!-- اطلاعات هتل -->
          <!-- اطلاعات هتل و مسافران -->
<section
  v-else-if="selectedContract?.hotel"
  class="mt-7"
>
  <h2 class="mb-5 text-lg font-black text-gray-800">
    اطلاعات هتل
  </h2>

  <div
    v-if="selectedContractRoutes.length"
    class="space-y-4"
  >
    <div
      v-for="route in selectedContractRoutes"
      :key="route.id"
      class="grid grid-cols-1 gap-5 rounded-xl bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] sm:grid-cols-2 lg:grid-cols-4"
    >
      <div>
        <p class="text-xs text-gray-400">
          نام هتل
        </p>

        <p class="mt-2 font-bold">
          {{
            route.hotelName ||
            route.name ||
            '-'
          }}
        </p>
      </div>

      <div>
        <p class="text-xs text-gray-400">
          اتاق
        </p>

        <p class="mt-2 font-bold">
          {{
            route.roomName ||
            route.roomType ||
            '-'
          }}
        </p>
      </div>

      <div>
        <p class="text-xs text-gray-400">
          تاریخ ورود
        </p>

        <p class="mt-2 font-bold">
          {{
            formatContractDate(
              route.checkIn ||
              route.checkInDate
            )
          }}
        </p>
      </div>

      <div>
        <p class="text-xs text-gray-400">
          تاریخ خروج
        </p>

        <p class="mt-2 font-bold">
          {{
            formatContractDate(
              route.checkOut ||
              route.checkOutDate
            )
          }}
        </p>
      </div>
    </div>
  </div>

  <div
    v-else
    class="rounded-xl bg-gray-50 p-7 text-center text-sm text-gray-500"
  >
    اطلاعات هتل برای این قرارداد ثبت نشده است.
  </div>

  <!-- اطلاعات مسافران هتل -->
  <div class="mt-8">
    <h2 class="mb-5 text-lg font-black text-gray-800">
      اطلاعات مسافران
    </h2>

    <div
      v-if="selectedContractPassengers.length"
      class="overflow-x-auto rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
    >
      <table
        class="w-full min-w-[900px] border-collapse text-center text-sm"
      >
        <thead class="bg-[#d9effd] text-gray-800">
          <tr>
            <th class="px-4 py-4">
              ردیف
            </th>

            <th class="px-4 py-4">
              نام
            </th>

            <th class="px-4 py-4">
              نام خانوادگی
            </th>

            <th class="px-4 py-4">
              بازه سنی
            </th>

            <th class="px-4 py-4">
              کد ملی
            </th>

            <th class="px-4 py-4">
              شماره پاسپورت
            </th>

            <th class="px-4 py-4">
              ملیت
            </th>

            <th class="px-4 py-4">
              جنسیت
            </th>

            <th class="px-4 py-4">
              تاریخ تولد
            </th>

            <th class="px-4 py-4">
              اتاق
            </th>
            <th class="px-4 py-4">
  عملیات
</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(passenger,index) in selectedContractPassengers"
            :key="passenger.id || index"
            class="border-b border-gray-100 last:border-b-0"
          >
            <td class="px-4 py-5">
              {{ toPersianDigits(index+1) }}
            </td>

            <td class="px-4 py-5 font-medium">
              {{
                passenger.fName ||
                passenger.firstName ||
                '-'
              }}
            </td>

            <td class="px-4 py-5 font-medium">
              {{
                passenger.lName ||
                passenger.lastName ||
                '-'
              }}
            </td>

            <td class="px-4 py-5">
              {{
                getPassengerTypeTitle(
                  passenger.age
                )
              }}
            </td>

            <td
              dir="ltr"
              class="px-4 py-5"
            >
              {{
                toPersianDigits(
                  passenger.codeMelli ||
                  '-'
                )
              }}
            </td>

            <td
              dir="ltr"
              class="px-4 py-5"
            >
              {{
                passenger.passportNo ||
                '-'
              }}
            </td>

            <td class="px-4 py-5">
              {{
                passenger.nationality ||
                '-'
              }}
            </td>

            <td class="px-4 py-5">
              {{
                getGenderTitle(
                  passenger.gender
                )
              }}
            </td>

            <td class="px-4 py-5">
              {{
                formatContractDate(
                  passenger.birthDate
                )
              }}
            </td>

            <td class="px-4 py-5">
              {{
                passenger.room ||
                passenger.roomType ||
                passenger.hotelRoom?.roomName ||
                passenger.hotelRoom?.name ||
                '-'
              }}
            </td>
           <td class="px-4 py-5">
  <button
  type="button"
  class="rounded border border-[#14179e] bg-white px-4 py-2 text-xs font-bold text-[#14179e] hover:bg-blue-50 disabled:opacity-50"
  :disabled="!passenger?.goTicketUrl"
  @click="downloadHotelVoucher(passenger)"
>
  دانلود واچر هتل
</button>
</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-else
      class="rounded-xl bg-gray-50 p-7 text-center text-sm text-gray-500"
    >
      مسافری برای این رزرو هتل ثبت نشده است.
    </div>
  </div>
</section>
        </div>
      </div>
    </div>
    
  </Transition>
</Teleport>
<!-- مودال جزئیات تراکنش -->
<Teleport to="body">
  <Transition name="transaction-modal">
    <div
      v-if="transactionModalOpen && selectedTransaction"
      dir="rtl"
      class="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
      @click.self="closeTransactionDetails"
    >
      <div
        class="flex max-h-[92vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <!-- هدر -->
        <div class="flex items-center justify-end px-5 py-4">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full text-3xl leading-none text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            @click="closeTransactionDetails"
          >
            ×
          </button>
        </div>

        <div class="overflow-y-auto px-5 pb-8 md:px-8">
          <!-- اطلاعات اصلی تراکنش -->
          <section
            class="grid grid-cols-1 gap-x-10 gap-y-8 rounded-3xl bg-[#e2f2ff] px-7 py-9 text-sm text-gray-800 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div class="flex items-center gap-2">
              <span class="font-black">
                شماره سفارش:
              </span>

              <span>
                {{
                  toPersianDigits(
                    selectedTransaction?.orderNumber ?? '-'
                  )
                }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-black">
                تاریخ پرداخت:
              </span>

              <span>
                {{
                  formatContractDate(
                    selectedTransaction?.date
                  )
                }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-black">
                ساعت پرداخت:
              </span>

              <span>
                {{
                  toPersianDigits(
                    selectedTransaction?.time ?? '-'
                  )
                }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-black">
                نوع پرداخت:
              </span>

              <span>
                {{
                  selectedTransaction?.paymentType || '-'
                }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-black">
                نوع سفارش:
              </span>

              <span>
                {{
                  selectedTransaction?.orderType || '-'
                }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-black">
                وضعیت:
              </span>

              <span
                class="font-bold"
                :class="{
                  'text-green-600':
                    selectedTransaction?.status === 'موفق',

                  'text-red-600':
                    selectedTransaction?.status === 'ناموفق',

                  'text-orange-600':
                    selectedTransaction?.status === 'در انتظار'
                }"
              >
                {{
                  selectedTransaction?.status || '-'
                }}
              </span>
            </div>
          </section>

          <!-- جزئیات مبلغ -->
          <section class="mt-8 text-center">
            <h3 class="text-base font-black text-gray-800">
              جزئیات تراکنش:
            </h3>

            <div
              class="mx-auto mt-6 max-w-[420px] rounded-2xl border border-gray-200 bg-gray-50 p-6"
            >
              <p class="text-sm text-gray-500">
                مبلغ کل
              </p>

              <p class="mt-3 text-2xl font-black text-gray-800">
                {{
                  formatPrice(
                    selectedTransaction?.amount ?? 0
                  )
                }}
                ریال
              </p>

              <div
                class="mx-auto mt-6 w-fit -rotate-6 border-4 px-5 py-2 text-xl font-black"
                :class="
                  selectedTransaction?.status === 'ناموفق'
                    ? 'border-red-600 text-red-600'
                    : selectedTransaction?.status === 'در انتظار'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-blue-600 text-blue-600'
                "
              >
                {{
                  selectedTransaction?.status === 'ناموفق'
                    ? 'پرداخت ناموفق'
                    : selectedTransaction?.status === 'در انتظار'
                      ? 'در انتظار پرداخت'
                      : 'پرداخت شد'
                }}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>
<Teleport to="body">
  <Transition name="passenger-modal">
    <div
      v-if="passengerModalOpen"
      dir="rtl"
      class="fixed inset-0 z-[3200] flex items-center justify-center bg-black/40 p-4"
      @click.self="closePassengerModal"
    >
      <div
        class="max-h-[92vh] w-full max-w-[750px] overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-7"
      >
        <div
          class="flex items-center justify-between border-b border-gray-200 pb-4"
        >
          <h2 class="text-lg font-black text-[#14179e]">
            {{
              passengerFormMode === 'add'
                ? 'افزودن مسافر'
                : 'ویرایش اطلاعات مسافر'
            }}
          </h2>

          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center text-3xl text-[#14179e]"
            @click="closePassengerModal"
          >
            ×
          </button>
        </div>

        <form
          class="mt-6"
          @submit.prevent="submitPassenger"
        >
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <label class="profile-edit-field">
              <span>نام</span>

              <input
                v-model.trim="passengerForm.fName"
                type="text"
              >
            </label>

            <label class="profile-edit-field">
              <span>نام خانوادگی</span>

              <input
                v-model.trim="passengerForm.lName"
                type="text"
              >
            </label>

            <label class="profile-edit-field">
              <span>کد ملی</span>

              <input
                v-model.trim="passengerForm.codeMelli"
                dir="ltr"
                type="text"
                maxlength="10"
              >
            </label>

            <label class="profile-edit-field">
              <span>شماره پاسپورت</span>

              <input
                v-model.trim="passengerForm.passportNo"
                dir="ltr"
                type="text"
              >
            </label>

            <label class="profile-edit-field">
              <span>ملیت</span>

              <select v-model="passengerForm.nationality">
                <option value="ایرانی">
                  ایرانی
                </option>

                <option value="غیر ایرانی">
                  غیر ایرانی
                </option>
              </select>
            </label>

            <label class="profile-edit-field">
              <span>جنسیت</span>

              <select v-model="passengerForm.gender">
                <option :value="true">
                  آقا
                </option>

                <option :value="false">
                  خانم
                </option>
              </select>
            </label>
          </div>

          <div class="mt-6">
            <p class="mb-3 text-xs font-bold text-gray-700">
              تاریخ تولد
            </p>

            <div class="grid grid-cols-3 gap-3">
              <label class="profile-edit-field">
                <span>روز</span>

                <input
                  v-model="passengerForm.birthDay"
                  type="number"
                  min="1"
                  max="31"
                >
              </label>

              <label class="profile-edit-field">
                <span>ماه</span>

                <input
                  v-model="passengerForm.birthMonth"
                  type="number"
                  min="1"
                  max="12"
                >
              </label>

              <label class="profile-edit-field">
                <span>سال</span>

                <input
                  v-model="passengerForm.birthYear"
                  type="number"
                  min="1200"
                  max="1500"
                >
              </label>
            </div>
          </div>
<div class="mt-6">
  <p class="mb-3 text-xs font-bold text-gray-700">
    تاریخ صدور پاسپورت
  </p>

  <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
    <UiBaseAutocomplete
      :model-value="passengerForm.passportIssueDay"
      :items="dayOptions"
      item-text="label"
      item-value="value"
      label="روز"
      placeholder="روز"
      :rtl="true"
      :menu-props="scrollableMenuProps"
      @update:model-value="
        passengerForm.passportIssueDay=
          extractValue($event)
      "
    />

    <UiBaseAutocomplete
      :model-value="passengerForm.passportIssueMonth"
      :items="gregorianMonthOptions"
      item-text="label"
      item-value="value"
      label="ماه"
      placeholder="ماه"
      :rtl="true"
      :menu-props="scrollableMenuProps"
      @update:model-value="
        passengerForm.passportIssueMonth=
          extractValue($event)
      "
    />

    <UiBaseAutocomplete
      :model-value="passengerForm.passportIssueYear"
      :items="passportIssueYearOptions"
      item-text="label"
      item-value="value"
      label="سال"
      placeholder="سال میلادی"
      :rtl="true"
      :menu-props="scrollableMenuProps"
      @update:model-value="
        passengerForm.passportIssueYear=
          extractValue($event)
      "
    />
  </div>
</div>
         <div class="mt-6">
  <p class="mb-3 text-xs font-bold text-gray-700">
    تاریخ انقضای پاسپورت
  </p>

  <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
    <UiBaseAutocomplete
      :model-value="passengerForm.passportExpDay"
      :items="dayOptions"
      item-text="label"
      item-value="value"
      label="روز"
      placeholder="روز"
      :rtl="true"
      :menu-props="scrollableMenuProps"
      @update:model-value="
        passengerForm.passportExpDay=
          extractValue($event)
      "
    />

    <UiBaseAutocomplete
      :model-value="passengerForm.passportExpMonth"
      :items="gregorianMonthOptions"
      item-text="label"
      item-value="value"
      label="ماه"
      placeholder="ماه"
      :rtl="true"
      :menu-props="scrollableMenuProps"
      @update:model-value="
        passengerForm.passportExpMonth=
          extractValue($event)
      "
    />

    <UiBaseAutocomplete
      :model-value="passengerForm.passportExpYear"
      :items="passportExpireYearOptions"
      item-text="label"
      item-value="value"
      label="سال"
      placeholder="سال میلادی"
      :rtl="true"
      :menu-props="scrollableMenuProps"
      @update:model-value="
        passengerForm.passportExpYear=
          extractValue($event)
      "
    />
  </div>
</div>

          <p
            v-if="passengerFormError"
            class="mt-5 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-600"
          >
            {{ passengerFormError }}
          </p>

          <div class="mt-7 flex items-center gap-3">
            <button
              type="submit"
              class="min-w-[170px] rounded-full bg-[#14179e] px-7 py-3 text-sm font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="passengerSubmitting"
            >
              {{
                passengerSubmitting
                  ? 'در حال ثبت...'
                  : passengerFormMode === 'add'
                    ? 'افزودن مسافر'
                    : 'ثبت تغییرات'
              }}
            </button>

            <button
              type="button"
              class="rounded-full border border-gray-300 px-7 py-3 text-sm text-gray-600"
              :disabled="passengerSubmitting"
              @click="closePassengerModal"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</Teleport>

<Teleport to="body">
  <Transition name="contract-modal">
    <div
      v-if="cancelModalOpen"
      dir="rtl"
      class="fixed inset-0 z-[4500] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
      @click.self="closeCancelModal"
    >
      <div class="max-h-[92vh] w-full max-w-[590px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 class="text-lg font-black text-gray-800">
            کنسل کردن بلیت
          </h2>

          <button
            type="button"
            class="text-3xl leading-none text-gray-500"
            :disabled="cancelSubmitting"
            @click="closeCancelModal"
          >
            ×
          </button>
        </div>

        <div
          v-if="cancelModalStep === 'confirm'"
          class="mt-6"
        >
          <p class="text-center leading-8 text-gray-700">
            آیا از کنسل کردن بلیت مسافر
            <b>{{ selectedCancelRow?.passengerName }}</b>
            در مسیر
            <b>
              {{ selectedCancelRow?.origin }}
              به
              {{ selectedCancelRow?.destination }}
            </b>
            اطمینان دارید؟
          </p>

          <div class="mt-5 space-y-3 rounded-xl bg-orange-50 p-4 text-sm">
            <div class="flex justify-between gap-4">
              <span class="font-bold">تأمین‌کننده:</span>
              <span>{{ selectedCancelRow?.provider || '-' }}</span>
            </div>

            <div class="flex justify-between gap-4">
              <span class="font-bold">شماره بلیت:</span>
              <span dir="ltr">{{ selectedCancelRow?.ticketNumber || '-' }}</span>
            </div>

            <div class="flex justify-between gap-4">
              <span class="font-bold">کد رزرو:</span>
              <span dir="ltr">{{ selectedCancelRow?.pnr || '-' }}</span>
            </div>

            <div class="flex justify-between gap-4">
              <span class="font-bold">جریمه اولیه:</span>
              <span>{{ formatPrice(cancelPenalty) }} ریال</span>
            </div>

            <div class="flex justify-between gap-4">
              <span class="font-bold">مبلغ قابل استرداد اولیه:</span>
              <span>{{ formatPrice(cancelRefundAmount) }} ریال</span>
            </div>
          </div>

          <p class="mt-4 rounded-lg bg-yellow-50 p-3 text-xs leading-6 text-yellow-800">
            مبلغ قطعی جریمه هنگام اجرای کنسلی دوباره از سرویس تأمین‌کننده دریافت می‌شود و ممکن است تغییر کند.
          </p>

          <p
            v-if="cancelError"
            class="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-600"
          >
            {{ cancelError }}
          </p>

          <div class="mt-6 flex justify-center gap-3">
            <button
              type="button"
              class="min-w-[155px] rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
              :disabled="cancelSubmitting"
              @click="confirmCancelTicket"
            >
              {{
                cancelSubmitting
                  ? 'در حال انجام عملیات...'
                  : 'بله، کنسل شود'
              }}
            </button>

            <button
              type="button"
              class="min-w-[100px] rounded-full bg-[#14179e] px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
              :disabled="cancelSubmitting"
              @click="closeCancelModal"
            >
              خیر
            </button>
          </div>
        </div>

        <div
          v-else-if="cancelModalStep === 'success'"
          class="mt-7 text-center"
        >
          <div class="text-5xl">✅</div>

          <h3 class="mt-4 text-lg font-black text-green-600">
            بلیت در تأمین‌کننده کنسل شد
          </h3>

          <div class="mt-5 space-y-3 rounded-xl bg-green-50 p-4 text-right text-sm">
            <div class="flex justify-between gap-4">
              <span>مبلغ قابل استرداد تأمین‌کننده:</span>
              <b>{{ formatPrice(cancelResult?.providerRefundAmount) }} ریال</b>
            </div>

            <div
              v-if="cancelResult?.bankRefundAmount > 0"
              class="flex justify-between gap-4"
            >
              <span>استرداد بانکی:</span>
              <b>{{ formatPrice(cancelResult.bankRefundAmount) }} ریال</b>
            </div>

            <div
              v-if="cancelResult?.travelCardRefundAmount > 0"
              class="flex justify-between gap-4"
            >
              <span>بازگشت سفرکارت:</span>
              <b>{{ formatPrice(cancelResult.travelCardRefundAmount) }} ریال</b>
            </div>

            <div
              v-if="cancelResult?.agencyCreditAmount > 0"
              class="flex justify-between gap-4"
            >
              <span>بستانکاری آژانس:</span>
              <b>{{ formatPrice(cancelResult.agencyCreditAmount) }} ریال</b>
            </div>

            <div
              v-if="cancelResult?.unresolvedAmount > 0"
              class="flex justify-between gap-4 text-orange-700"
            >
              <span>نیازمند بررسی مالی:</span>
              <b>{{ formatPrice(cancelResult.unresolvedAmount) }} ریال</b>
            </div>
          </div>

          <p
            v-if="cancelResult?.settlementPending"
            class="mt-4 rounded-lg bg-orange-50 p-3 text-sm font-bold text-orange-700"
          >
            کنسلی ایرلاین انجام شده، اما بخشی از تسویه مالی نیازمند پیگیری است. کنسلی را دوباره اجرا نکنید.
          </p>

          <button
            type="button"
            class="mt-6 rounded-full bg-[#14179e] px-8 py-3 text-sm font-bold text-white"
            @click="closeCancelModal"
          >
            بستن
          </button>
        </div>

        <div
          v-else
          class="mt-7 text-center"
        >
          <div class="text-5xl">⚠️</div>

          <h3 class="mt-4 text-lg font-black text-red-600">
            عملیات با خطا مواجه شد
          </h3>

          <p class="mt-4 rounded-lg bg-red-50 p-4 text-sm font-bold leading-7 text-red-600">
            {{ cancelError }}
          </p>

          <button
            type="button"
            class="mt-6 rounded-full bg-[#14179e] px-8 py-3 text-sm font-bold text-white"
            @click="closeCancelModal"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>
<Teleport to="body">
  <Transition name="passenger-modal">
    <div
      v-if="deletePassengerModalOpen"
      dir="rtl"
      class="fixed inset-0 z-[4000] flex items-center justify-center bg-black/40 p-4"
      @click.self="closeDeletePassengerModal"
    >
      <div
        class="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div class="text-center">
          <div
            class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600"
          >
            !
          </div>

          <h2
            class="mt-4 text-lg font-black text-gray-800"
          >
            حذف مسافر
          </h2>

          <p
            class="mt-3 text-sm leading-7 text-gray-500"
          >
            آیا از حذف
            <strong class="text-gray-800">
              {{passengerToDelete?.fName}}
              {{passengerToDelete?.lName}}
            </strong>
            مطمئن هستید؟
          </p>

          <p
            class="mt-1 text-xs text-red-500"
          >
            این عملیات قابل بازگشت نیست.
          </p>
        </div>

        <div
          class="mt-6 flex items-center justify-center gap-3"
        >
          <button
            type="button"
            class="min-w-[120px] rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
            :disabled="!!deletingPassengerId"
            @click="closeDeletePassengerModal"
          >
            انصراف
          </button>

          <button
            type="button"
            class="min-w-[120px] rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="!!deletingPassengerId"
            @click="confirmDeletePassenger"
          >
            {{
              deletingPassengerId
                ?'در حال حذف...'
                :'حذف مسافر'
            }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
  watch
} from 'vue'
import {
  toGregorian
} from 'jalaali-js'
const detailsModalOpen = ref(false)
const selectedContract = ref(null)
const toast=useToast()
const cancelModalOpen=ref(false)
const cancelModalStep=ref('confirm')
const selectedCancelRow=ref(null)
const cancellingTicketKey=ref('')
const cancelSubmitting=ref(false)
const cancelError=ref('')
const cancelPenalty=ref(0)
const cancelRefundAmount=ref(0)
const cancelInitialPreview=ref(null)
const cancelResult=ref(null)
const gregorianMonthOptions=[
  {label:'January',value:'1'},
  {label:'February',value:'2'},
  {label:'March',value:'3'},
  {label:'April',value:'4'},
  {label:'May',value:'5'},
  {label:'June',value:'6'},
  {label:'July',value:'7'},
  {label:'August',value:'8'},
  {label:'September',value:'9'},
  {label:'October',value:'10'},
  {label:'November',value:'11'},
  {label:'December',value:'12'}
]

const scrollableMenuProps={
  maxHeight:'220px',
  overflowY:'auto'
}

const dayOptions=Array.from(
  {length:31},
  (_,i)=>({
    label:String(i+1),
    value:String(i+1)
  })
)

function getPassportIssueYearOptions(){
  const years=[]
  const currentYear=new Date().getFullYear()

  for(
    let year=currentYear;
    year>=1920;
    year--
  ){
    years.push({
      label:String(year),
      value:String(year)
    })
  }

  return years
}

function getPassportExpireYearOptions(){
  const years=[]
  const currentYear=new Date().getFullYear()

  for(
    let year=currentYear;
    year<=currentYear+15;
    year++
  ){
    years.push({
      label:String(year),
      value:String(year)
    })
  }

  return years
}

const passportIssueYearOptions=
  getPassportIssueYearOptions()

const passportExpireYearOptions=
  getPassportExpireYearOptions()
const BANK_REFUND_API='https://panel.ahuan.ir/api/Refund'
const SAFAR_CARD_RESTORE_API=''

const CANCELLATION_STATUS={
  IDLE:'idle',
  PENALTY_CHECKED:'penalty-checked',
  PROCESSING:'processing',
  PROVIDER_CANCELLED:'provider-cancelled',
  SETTLEMENT_PENDING:'settlement-pending',
  SUCCESS:'success',
  FAILED:'failed',
  MANUAL_REVIEW:'manual-review'
}

function openOrderDetails(contract) {
  if (!contract) return

  selectedContract.value = contract
  detailsModalOpen.value = true

  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
}

function closeOrderDetails() {
  detailsModalOpen.value = false
  selectedContract.value = null

  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
}

const selectedContractFlights = computed(() => {
  return Array.isArray(
    selectedContract.value?.contractFlights
  )
    ? selectedContract.value.contractFlights
    : []
})

const selectedContractPassengers = computed(() => {
  return Array.isArray(
    selectedContract.value?.contractPassengers
  )
    ? selectedContract.value.contractPassengers
    : []
})

const selectedContractRoutes = computed(() => {
  return Array.isArray(
    selectedContract.value?.contractRoutes
  )
    ? selectedContract.value.contractRoutes
    : []
})

function getPassengerCount(contract) {
  const passengers = Array.isArray(
    contract?.contractPassengers
  )
    ? contract.contractPassengers
    : []

  if (passengers.length) {
    return passengers.length
  }

  return Number(
    contract?.passengersNo || 0
  )
}

function getRouteCountTitle(contract) {
  const flights = Array.isArray(
    contract?.contractFlights
  )
    ? contract.contractFlights
    : []

  const routes = Array.isArray(
    contract?.contractRoutes
  )
    ? contract.contractRoutes
    : []

  const count = flights.length || routes.length

  if (count <= 1) {
    return 'تک مسیر'
  }

  if (count === 2) {
    return 'رفت و برگشت'
  }

  return `${toPersianDigits(count)} مسیر`
}

function getContractStatusTitle(contract) {
  const status = String(
    contract?.confirmStatus ||
    contract?.ticketStatus ||
    ''
  )
    .trim()
    .toLowerCase()

  if (
    status === 'confirm' ||
    status === 'confirmed'
  ) {
    return 'صادر شده'
  }

  if (
    status.includes('temp')
  ) {
    return 'در انتظار تکمیل'
  }

  if (
    status.includes('cancel')
  ) {
    return 'لغو شده'
  }

  return status || '-'
}

function isFlightContract(contract) {
  return Boolean(
    contract?.ticket === true ||
    (
      Array.isArray(
        contract?.contractFlights
      ) &&
      contract.contractFlights.length
    ) ||
    String(contract?.travelVehicle || '').trim() === 'هواپیما'
  )
}

function getContractServiceType(contract) {
  if (contract?.hotel === true) {
    return 'هتل'
  }

  if (contract?.tour === true) {
    return 'تور'
  }

  if (isFlightContract(contract)) {
    return getFlightOrderType(contract)
  }

  if (contract?.visa === true) {
    return 'ویزا'
  }

  if (contract?.insurance === true) {
    return 'بیمه'
  }

  return '-'
}

function getFlightOrderType(contract) {
  const flights = Array.isArray(
    contract?.contractFlights
  )
    ? contract.contractFlights
    : []

  if (!flights.length) {
    return 'پرواز'
  }

  const hasInternationalFlight =
    flights.some((flight) => {
      const origin = String(
        flight?.origin || ''
      ).toUpperCase()

      const destination = String(
        flight?.destination || ''
      ).toUpperCase()

      return (
        origin === 'IKA' ||
        destination === 'IKA' ||
        origin === 'IST' ||
        destination === 'IST'
      )
    })

  return hasInternationalFlight
    ? 'پرواز خارجی'
    : 'پرواز داخلی'
}
function formatContractDate(value) {
  if (!value) return '-'

  const date = new Date(
    String(value).includes('T')
      ? String(value)
      : `${value}T00:00:00`
  )

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleDateString(
    'fa-IR-u-ca-persian',
    {
      year:'numeric',
      month:'long',
      day:'numeric'
    }
  )
}

function getPersianWeekday(value) {
  if (!value) return '-'

  const date = new Date(
    String(value).includes('T')
      ? String(value)
      : `${value}T00:00:00`
  )

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleDateString(
    'fa-IR',
    {
      weekday:'long'
    }
  )
}

function getPassengerTypeTitle(value) {
  const type = String(value || '')
    .trim()
    .toUpperCase()

  if (
    type === 'ADL' ||
    type === 'AD'
  ) {
    return 'بزرگسال'
  }

  if (
    type === 'CHD' ||
    type === 'CH'
  ) {
    return 'کودک'
  }

  if (
    type === 'INF' ||
    type === 'IN'
  ) {
    return 'نوزاد'
  }

  return type || '-'
}

function getPassengerFullName(passenger) {
  return [
    passenger?.fName ||
    passenger?.firstName,
    passenger?.lName ||
    passenger?.lastName
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || '-'
}

function parseJsonValue(value){
  let result=value

  for(let index=0;index<3;index++){
    if(typeof result!=='string') break

    const normalized=result.trim()

    if(!normalized) return null

    try{
      result=JSON.parse(normalized)
    }catch{
      return result
    }
  }

  return result
}
function canDownloadHotelVoucher(passenger){
  return Boolean(
    passenger?.voucherUrl||
    passenger?.hotelVoucherUrl||
    passenger?.voucherFile||
    selectedContract.value?.voucherUrl
  )
}

function downloadHotelVoucher(passenger){
  const url=passenger?.goTicketUrl

  if(!url){
    return
  }

  window.open(
    url,
    '_blank'
  )
}
function extractTicketEntries(value){
  const text=String(value||'')
    .replace(/\r?\n/g,' ')
    .trim()

  if(!text) return[]

  const matches=[
    ...text.matchAll(
      /([A-Z0-9' -]+\/[A-Z0-9' -]+?)\s*[=:]\s*(\d{10,14})/gi
    )
  ]

  if(matches.length){
    return matches.map(item=>({
      passengerName:String(item[1]||'')
        .trim()
        .toUpperCase(),
      ticketNumber:String(item[2]||'')
        .trim()
    }))
  }

  return(
    text.match(/\b\d{10,14}\b/g)||[]
  ).map(ticketNumber=>({
    passengerName:'',
    ticketNumber
  }))
}

function normalizePassengerLatinName(passenger){
  return[
    passenger?.lName,
    passenger?.fName
  ]
    .filter(Boolean)
    .join('/')
    .replace(/\s+/g,'')
    .toUpperCase()
}

function readFlightDocument(flight){
  const parsed=parseJsonValue(
    flight?.flightJson
  )

  if(
    parsed&&
    typeof parsed==='object'&&
    !Array.isArray(parsed)
  ){
    return parsed
  }

  return{
    version:1,
    payment:null,
    issue:null,
    cancellations:[],
    updatedAt:new Date().toISOString()
  }
}

function writeFlightDocument(
  flight,
  documentValue
){
  documentValue.version=Number(
    documentValue?.version||1
  )

  documentValue.updatedAt=
    new Date().toISOString()

  flight.flightJson=
    JSON.stringify(documentValue)
}

function getFlightTicketEntries(flight){
  const parsed=parseJsonValue(
    flight?.flightJson
  )

  if(!parsed) return[]

  const documents=Array.isArray(parsed)
    ?parsed
    :[parsed]

  const entries=[]

  for(const documentValue of documents){
    const issueTicketNumbers=
      Array.isArray(
        documentValue?.issue?.ticketNumbers
      )
        ?documentValue.issue.ticketNumbers
        :[]

    for(const value of issueTicketNumbers){
      entries.push(
        ...extractTicketEntries(value)
      )
    }

    const legacyValues=[
      documentValue?.Tickets,
      documentValue?.tickets,
      ...(Array.isArray(
        documentValue?.AirNRSTICKETS
      )
        ?documentValue.AirNRSTICKETS.map(
            item=>item?.Tickets
          )
        :[]),
      ...(Array.isArray(
        documentValue?.issue?.response?.AirNRSTICKETS
      )
        ?documentValue.issue.response.AirNRSTICKETS.map(
            item=>item?.Tickets
          )
        :[])
    ]

    for(const value of legacyValues){
      if(!value) continue

      entries.push(
        ...extractTicketEntries(value)
      )
    }
  }

  return entries.filter(
    (item,index,list)=>
      list.findIndex(
        other=>
          other.ticketNumber===
          item.ticketNumber
      )===index
  )
}

function getPassengerTicketNumber(
  passenger,
  flight,
  passengerIndex,
  flightIndex
){
  const directTicket=
    flightIndex===0
      ?(
          passenger?.goTicketNumber||
          passenger?.ticketNumber||
          flight?.ticketNumber
        )
      :(
          passenger?.retTicketNumber||
          passenger?.ticketNumber||
          flight?.ticketNumber
        )

  if(directTicket){
    return String(directTicket).trim()
  }

  const entries=
    getFlightTicketEntries(flight)

  const normalizedName=
    normalizePassengerLatinName(passenger)

  const matchedByName=
    entries.find(item=>{
      const entryName=String(
        item?.passengerName||''
      )
        .replace(/\s+/g,'')
        .toUpperCase()

      return(
        normalizedName&&
        entryName&&
        (
          entryName.includes(normalizedName)||
          normalizedName.includes(entryName)
        )
      )
    })

  return String(
    matchedByName?.ticketNumber||
    entries?.[passengerIndex]?.ticketNumber||
    ''
  ).trim()
}
function buildPassportDate({
  year,
  month,
  day
}){
  const y=Number(year)
  const m=Number(month)
  const d=Number(day)

  if(!y||!m||!d){
    return null
  }

  const date=new Date(
    y,
    m-1,
    d
  )

  if(
    Number.isNaN(date.getTime())||
    date.getFullYear()!==y||
    date.getMonth()!==m-1||
    date.getDate()!==d
  ){
    return null
  }

  return[
    String(y).padStart(4,'0'),
    String(m).padStart(2,'0'),
    String(d).padStart(2,'0')
  ].join('-')
}
function normalizeFlightProvider(value){
  const provider=String(value||'')
    .trim()
    .toUpperCase()

  if(provider==='NRS') return'NIRA'
  if(provider==='W5') return'MAHAN'
  if(provider==='IS') return'SEPEHRAN'
  if(provider==='B9') return'AIRTOUR'

  return provider
}

function normalizePaymentType(value){
  const type=String(value||'')
    .trim()
    .toLowerCase()

  return type==='agancy'
    ?'agency'
    :type
}
function extractValue(payload){
  if(payload==null)return''

  if(typeof payload==='object'){
    if(
      'target' in payload&&
      payload.target?.value!=null
    ){
      return payload.target.value
    }

    if(
      'value' in payload&&
      payload.value!=null
    ){
      return payload.value
    }
  }

  return payload
}
function getCancellationList(documentValue){
  return Array.isArray(
    documentValue?.cancellations
  )
    ?documentValue.cancellations
    :[]
}

function getTicketCancellation(
  flight,
  ticketNumber
){
  return getCancellationList(
    readFlightDocument(flight)
  ).find(
    item=>
      String(item?.ticketNumber)===
      String(ticketNumber)
  )||null
}

function upsertCancellation(
  documentValue,
  cancellation
){
  const list=[
    ...getCancellationList(
      documentValue
    )
  ]

  const index=list.findIndex(
    item=>
      String(item?.ticketNumber)===
      String(cancellation?.ticketNumber)
  )

  if(index>=0){
    list.splice(
      index,
      1,
      {
        ...list[index],
        ...cancellation
      }
    )
  }else{
    list.push(cancellation)
  }

  documentValue.cancellations=list
}

const ticketRows=computed(()=>{
  const flights=
    selectedContractFlights.value

  const passengers=
    selectedContractPassengers.value

  const rows=[]

  flights.forEach((flight,flightIndex)=>{
    passengers.forEach(
      (passenger,passengerIndex)=>{
        const ticketNumber=
          getPassengerTicketNumber(
            passenger,
            flight,
            passengerIndex,
            flightIndex
          )

        const ticketStatus=String(
          flightIndex===0
            ?passenger?.goTicketStatus
            :passenger?.retTicketStatus
        )
          .trim()
          .toLowerCase()

        const provider=
          normalizeFlightProvider(
            flight?.flightSupplier||
            flight?.provider
          )

        const cancellation=
          getTicketCancellation(
            flight,
            ticketNumber
          )

        const cancellationStatus=
          String(
            cancellation?.status||''
          )
            .trim()
            .toLowerCase()

        const datePart=String(
          flight?.depDate||''
        ).split('T')[0]

        const timePart=String(
          flight?.depTime||'00:00'
        ).slice(0,5)

        const departureDateTime=
          new Date(
            `${datePart}T${timePart}:00`
          )

        const flightExpired=
          !Number.isNaN(
            departureDateTime.getTime()
          )&&
          departureDateTime.getTime()<=
          Date.now()

        const ticketUrl=
          flightIndex===0
            ?passenger?.goTicketUrl
            :passenger?.retTicketUrl

        const lockedStatuses=[
          CANCELLATION_STATUS.PROCESSING,
          CANCELLATION_STATUS.PROVIDER_CANCELLED,
          CANCELLATION_STATUS.SETTLEMENT_PENDING,
          CANCELLATION_STATUS.SUCCESS,
          CANCELLATION_STATUS.MANUAL_REVIEW
        ]

        rows.push({
          key:
            `${flight?.id||flightIndex}-`+
            `${passenger?.id||passengerIndex}`,

          flight,
          passenger,
          flightIndex,
          passengerIndex,

          passengerName:
            getPassengerFullName(passenger),

          passengerType:
            getPassengerTypeTitle(
              passenger?.age
            ),

          origin:flight?.origin||'-',
          destination:
            flight?.destination||'-',

          amount:Number(
            flightIndex===0
              ?(
                  passenger?.paymentable??
                  passenger?.price??
                  0
                )
              :(
                  passenger?.paymentable2??
                  passenger?.price2??
                  0
                )
          ),

          ticketNumber,

          departureDate:
            formatContractDate(
              flight?.depDate
            ),

          departureTime:String(
            flight?.depTime||'-'
          ),

          flightNumber:String(
            flight?.flightNumber||'-'
          ),

          flightType:
            flight?.charterFlight===true
              ?'چارتر'
              :'سیستمی',

          airlineName:
            flight?.airlineNameFarsi||
            flight?.airlineName||
            flight?.airlineIataCode||
            '-',

          airlineCode:String(
            flight?.airlineIataCode||
            flight?.airlineCode||
            flight?.airline||
            ''
          )
            .trim()
            .toUpperCase(),

          provider,

          pnr:String(
            flight?.pnr||
            (
              flightIndex===0
                ?passenger?.goTicketPNR
                :passenger?.retTicketPNR
            )||
            ''
          ).trim(),

          ticketUrl,
          cancellation,
          cancellationStatus,

          isCancelled:Boolean(
            ticketStatus==='cancelled'||
            cancellationStatus===
              CANCELLATION_STATUS.SUCCESS||
            cancellationStatus===
              CANCELLATION_STATUS.PROVIDER_CANCELLED||
            cancellationStatus===
              CANCELLATION_STATUS.MANUAL_REVIEW
          ),

          canCancel:Boolean(
            cancellationProviders[provider]&&
            ticketNumber&&
            !flightExpired&&
            ticketStatus!=='cancelled'&&
            !lockedStatuses.includes(
              cancellationStatus
            )
          ),

          canDownload:Boolean(
            ticketNumber||ticketUrl
          )
        })
      }
    )
  })

  return rows
})

function getCancellationStatusTitle(row){
  const status=String(
    row?.cancellationStatus||''
  )

  if(status===CANCELLATION_STATUS.PROCESSING){
    return'در حال کنسلی'
  }

  if(
    status===CANCELLATION_STATUS.PROVIDER_CANCELLED||
    status===CANCELLATION_STATUS.SETTLEMENT_PENDING
  ){
    return'کنسل شده؛ در انتظار تسویه'
  }

  if(status===CANCELLATION_STATUS.MANUAL_REVIEW){
    return'کنسل شده؛ نیازمند پیگیری'
  }

  if(
    row?.isCancelled||
    status===CANCELLATION_STATUS.SUCCESS
  ){
    return'بلیت کنسل شده'
  }

  if(status===CANCELLATION_STATUS.FAILED){
    return'تلاش مجدد برای کنسلی'
  }

  return'کنسل کردن بلیت'
}

function getCancelButtonClass(row){
  if(
    row?.isCancelled||
    [
      CANCELLATION_STATUS.PROCESSING,
      CANCELLATION_STATUS.PROVIDER_CANCELLED,
      CANCELLATION_STATUS.SETTLEMENT_PENDING,
      CANCELLATION_STATUS.SUCCESS,
      CANCELLATION_STATUS.MANUAL_REVIEW
    ].includes(row?.cancellationStatus)
  ){
    return'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400'
  }

  return row?.canCancel
    ?'border-[#d7a05b] bg-white text-[#a76b20] hover:bg-[#fff8ef]'
    :'cursor-not-allowed border-gray-300 bg-gray-50 text-gray-300'
}

function downloadContractTicket(row){
  const contractId=
    selectedContract.value?.id

  if(!contractId) return

  if(row?.ticketUrl){
    window.open(
      row.ticketUrl,
      '_blank'
    )

    return
  }

  const encodedContractId=
    window.btoa(
      String(contractId)
    )

  navigateTo(
    `/downloadticket/${encodedContractId}`
  )
}

function unwrapApiResponse(response){
  let value=response

  if(
    value&&
    typeof value==='object'&&
    value.data!==undefined
  ){
    value=value.data
  }

  return parseJsonValue(value)??value
}

function getApiErrorMessage(
  error,
  fallback
){
  const raw=
    error?.data??
    error?.response?._data??
    error?.response?.data??
    error

  const parsed=
    parseJsonValue(raw)??raw

  return(
    parsed?.message||
    parsed?.Message||
    error?.message||
    fallback
  )
}

function getNiraPenaltyData(response){
  const unwrapped=
    unwrapApiResponse(response)

  const data=
    parseJsonValue(unwrapped)??
    unwrapped

  return{
    raw:data,
    penalty:
      data&&
      typeof data==='object'&&
      !Array.isArray(data)
        ?data.NRSPenalty||null
        :null
  }
}

async function fetchNiraPenaltyNow(row){
  const response=await $fetch(
    'https://api.ahuan.ir/api/Nira/PenaltyNow',
    {
      method:'GET',
      query:{
        Airline:row.airlineCode,
        TicketNo:row.ticketNumber
      }
    }
  )

  const result=
    getNiraPenaltyData(response)

  if(!result.penalty){
    const rawMessage=
      typeof result.raw==='string'
        ?result.raw
        :result.raw?.message||
         result.raw?.Message||
         ''

    if(
      String(rawMessage)
        .toUpperCase()
        .includes(
          'NO COUPON EXISTS FOR REFUND'
        )
    ){
      throw new Error(
        'این بلیت قبلاً کنسل شده یا امکان استرداد ندارد.'
      )
    }

    throw new Error(
      rawMessage||
      'اطلاعات جریمه از نیرا دریافت نشد.'
    )
  }

  return{
    response:result.raw,
    penalty:Math.max(
      Math.floor(
        Number(
          result.penalty?.PENALTY||0
        )
      ),
      0
    ),
    refundedAmount:Math.max(
      Math.floor(
        Number(
          result.penalty?.RefundedAmount||0
        )
      ),
      0
    ),
    isDomestic:
      result.penalty?.IsDomestic===true,
    refundedTaxes:Array.isArray(
      result.penalty?.RefundedTaxes
    )
      ?result.penalty.RefundedTaxes
      :[],
    legs:Array.isArray(
      result.penalty?.Legs
    )
      ?result.penalty.Legs
      :[]
  }
}

async function fetchNiraEtr(row){
  const response=await $fetch(
    'https://api.ahuan.ir/api/Nira/ETR',
    {
      method:'GET',
      query:{
        AirLine:row.airlineCode,
        TicketNo:row.ticketNumber
      }
    }
  )

  const data=unwrapApiResponse(response)

  if(
    !data||
    typeof data!=='object'||
    data?.Fare===undefined
  ){
    throw new Error(
      'اطلاعات مالی بلیت از ETR دریافت نشد.'
    )
  }

  const taxes=Array.isArray(data?.TAXES)
    ?data.TAXES
    :[]

  const fare=Math.max(
    Math.floor(
      Number(data?.Fare||0)
    ),
    0
  )

  const lp=Math.max(
    Math.floor(
      taxes
        .filter(
          tax=>
            String(tax?.TaxCode||'')
              .trim()
              .toUpperCase()==='LP'
        )
        .reduce(
          (sum,tax)=>
            sum+
            Number(tax?.TaxAmount||0),
          0
        )
    ),
    0
  )

  const ku=Math.max(
    Math.floor(
      taxes
        .filter(
          tax=>
            String(tax?.TaxCode||'')
              .trim()
              .toUpperCase()!=='LP'
        )
        .reduce(
          (sum,tax)=>
            sum+
            Number(tax?.TaxAmount||0),
          0
        )
    ),
    0
  )

  return{
    response:data,
    fare,
    ku,
    lp
  }
}

async function cancelNiraSeat(row){
  const departureDate=String(
    row?.flight?.depDate||''
  ).split('T')[0]

  const response=await $fetch(
    'https://api.ahuan.ir/api/Nira/CancelSeat',
    {
      method:'GET',
      query:{
        Airline:row.airlineCode,
        PNR:row.pnr,
        PassengerName:String(
          row?.passenger?.fName||''
        ).trim(),
        PassengerLastName:String(
          row?.passenger?.lName||''
        ).trim(),
        DepartureDate:departureDate,
        FlightNo:row.flightNumber
      }
    }
  )

  const data=unwrapApiResponse(response)
  const item=data?.AirCancelSeat?.[0]

  const success=String(
    item?.Done||''
  )
    .trim()
    .toLowerCase()==='true'

  if(!success){
    throw new Error(
      'آزادسازی صندلی مسافر در نیرا ناموفق بود.'
    )
  }

  return{
    success:true,
    newPnr:String(
      item?.NewSplittedPNR||''
    ).trim(),
    response:data
  }
}
function openDeletePassengerModal(passenger){
  passengerToDelete.value=passenger
  deletePassengerModalOpen.value=true

  if(import.meta.client){
    document.body.style.overflow='hidden'
  }
}

function closeDeletePassengerModal(){
  if(deletingPassengerId.value){
    return
  }

  deletePassengerModalOpen.value=false
  passengerToDelete.value=null

  if(import.meta.client){
    document.body.style.overflow=''
  }
}

async function confirmDeletePassenger(){
  if(!passengerToDelete.value){
    return
  }

  await deletePassenger(
    passengerToDelete.value
  )
}
async function executeNiraEtRefund(
  row,
  etr,
  penalty
){
  const response=await $fetch(
    'https://api.ahuan.ir/api/Nira/ETRefund',
    {
      method:'GET',
      query:{
        Airline:row.airlineCode,
        TicketNo:row.ticketNumber,
        Fare:etr.fare,
        KU:etr.ku,
        LP:etr.lp,
        Penalty:penalty
      }
    }
  )

  const data=unwrapApiResponse(response)
  const item=data?.AirNRSRefund?.[0]

  const done=String(
    item?.Done??''
  ).trim()

  const description=String(
    item?.Desc||''
  ).trim()

  const success=
    done==='0'||
    description
      .toUpperCase()
      .includes('REFUND SUCCESS')

  if(!success){
    throw new Error(
      description||
      'استرداد بلیت در نیرا ناموفق بود.'
    )
  }

  return{
    success:true,
    response:data
  }
}

async function fetchNiraCancellationPreview(row){
  const penalty=
    await fetchNiraPenaltyNow(row)

  return{
    provider:'NIRA',
    penaltyAmount:
      penalty.penalty,
    providerRefundAmount:
      penalty.refundedAmount,
    response:penalty.response
  }
}

async function cancelNiraTicket(row){
  const etr=await fetchNiraEtr(row)
  const cancelSeat=
    await cancelNiraSeat(row)

  if(cancelSeat.newPnr){
    row.pnr=cancelSeat.newPnr
    row.flight.pnr=cancelSeat.newPnr
  }

  const penalty=
    await fetchNiraPenaltyNow(row)

  const refund=
    await executeNiraEtRefund(
      row,
      etr,
      penalty.penalty
    )

  return{
    success:true,
    provider:'NIRA',
    providerStatus:'REFUND SUCCESS',
    ticketNumber:row.ticketNumber,
    pnr:row.pnr,
    newPnr:cancelSeat.newPnr||'',
    penaltyAmount:penalty.penalty,
    providerRefundAmount:
      penalty.refundedAmount,
    responses:{
      etr:etr.response,
      cancel:cancelSeat.response,
      penalty:penalty.response,
      refund:refund.response
    }
  }
}

function createUnsupportedProviderHandler(
  provider
){
  return{
    async getPreview(){
      throw new Error(
        `سرویس محاسبه جریمه ${provider} هنوز در این کامپوننت متصل نشده است.`
      )
    },
    async cancel(){
      throw new Error(
        `سرویس کنسلی ${provider} هنوز در این کامپوننت متصل نشده است.`
      )
    }
  }
}

const cancellationProviders={
  NIRA:{
    getPreview:
      fetchNiraCancellationPreview,
    cancel:cancelNiraTicket
  },
  MAHAN:
    createUnsupportedProviderHandler(
      'ماهان'
    ),
  SEPEHRAN:
    createUnsupportedProviderHandler(
      'سپهران'
    ),
  AIRTOUR:
    createUnsupportedProviderHandler(
      'ایرتور'
    )
}

function getCancellationProvider(row){
  const provider=
    normalizeFlightProvider(
      row?.provider||
      row?.flight?.flightSupplier
    )

  const handler=
    cancellationProviders[provider]

  if(!handler){
    throw new Error(
      `کنسلی خودکار برای Provider «${provider||'-'}» پیاده‌سازی نشده است.`
    )
  }

  return{
    provider,
    handler
  }
}

function getCancellationPayment(row){
  const documentValue=
    readFlightDocument(row.flight)

  const payment=documentValue?.payment

  if(
    !payment||
    typeof payment!=='object'
  ){
    throw new Error(
      'اطلاعات منابع پرداخت داخل flightJson ثبت نشده است.'
    )
  }

  return{
    documentValue,
    payment:{
      ...payment,
      type:normalizePaymentType(
        payment?.type
      ),
      bankAmount:Math.max(
        Number(
          payment?.bankAmount||0
        ),
        0
      ),
      travelCardAmount:Math.max(
        Number(
          payment?.travelCardAmount||0
        ),
        0
      )
    }
  }
}

function calculateCancellationSettlement(
  payment,
  providerRefundAmount
){
  const type=
    normalizePaymentType(
      payment?.type
    )

  const bankAmount=Math.max(
    Math.floor(
      Number(
        payment?.bankAmount||0
      )
    ),
    0
  )

  const travelCardAmount=Math.max(
    Math.floor(
      Number(
        payment?.travelCardAmount||0
      )
    ),
    0
  )

  const providerAmount=Math.max(
    Math.floor(
      Number(
        providerRefundAmount||0
      )
    ),
    0
  )

  if(type==='agency'){
    return{
      type,
      providerRefundAmount:
        providerAmount,
      customerRefundAmount:
        providerAmount,
      bankRefundAmount:0,
      travelCardRefundAmount:0,
      agencyCreditAmount:
        providerAmount,
      unresolvedAmount:0
    }
  }

  const customerPaidAmount=
    bankAmount+travelCardAmount

  if(customerPaidAmount<=0){
    throw new Error(
      'مبالغ پرداخت بانک و سفرکارت معتبر نیست.'
    )
  }

  const refundableAmount=Math.min(
    providerAmount,
    customerPaidAmount
  )

  if(type==='gateway'){
    const bankRefundAmount=Math.min(
      refundableAmount,
      bankAmount
    )

    return{
      type,
      providerRefundAmount:
        providerAmount,
      customerRefundAmount:
        bankRefundAmount,
      bankRefundAmount,
      travelCardRefundAmount:0,
      agencyCreditAmount:0,
      unresolvedAmount:Math.max(
        providerAmount-
        bankRefundAmount,
        0
      )
    }
  }

  if(type==='travelcard'){
    const travelCardRefundAmount=
      Math.min(
        refundableAmount,
        travelCardAmount
      )

    return{
      type,
      providerRefundAmount:
        providerAmount,
      customerRefundAmount:
        travelCardRefundAmount,
      bankRefundAmount:0,
      travelCardRefundAmount,
      agencyCreditAmount:0,
      unresolvedAmount:Math.max(
        providerAmount-
        travelCardRefundAmount,
        0
      )
    }
  }

  if(type==='travelcard-gateway'){
    const bankRatio=
      bankAmount/customerPaidAmount

    let bankRefundAmount=Math.round(
      refundableAmount*bankRatio
    )

    bankRefundAmount=Math.min(
      bankRefundAmount,
      bankAmount
    )

    let travelCardRefundAmount=
      refundableAmount-
      bankRefundAmount

    travelCardRefundAmount=Math.min(
      travelCardRefundAmount,
      travelCardAmount
    )

    return{
      type,
      providerRefundAmount:
        providerAmount,
      customerRefundAmount:
        bankRefundAmount+
        travelCardRefundAmount,
      bankRefundAmount,
      travelCardRefundAmount,
      agencyCreditAmount:0,
      unresolvedAmount:Math.max(
        providerAmount-
        bankRefundAmount-
        travelCardRefundAmount,
        0
      )
    }
  }

  throw new Error(
    `نوع پرداخت «${type||'-'}» معتبر نیست.`
  )
}

function parseContractPaymentId(contract){
  const value=String(
    contract?.paymentId||''
  ).trim()

  const separator=
    value.includes(',')
      ?','
      :'-'

  const parts=value.split(separator)

  return{
    amount:Number(
      parts.shift()||0
    ),
    rrn:String(
      parts.shift()||''
    ).trim(),
    traceNo:String(
      parts.shift()||''
    ).trim(),
    requestId:parts
      .join(separator)
      .trim()
  }
}

async function refundGatewayPayment(
  contract,
  amount
){
  const refundAmount=Math.max(
    Math.floor(
      Number(amount||0)
    ),
    0
  )

  if(refundAmount<=0){
    return{
      attempted:false,
      success:true,
      amount:0,
      response:null,
      error:''
    }
  }

  const payment=
    parseContractPaymentId(contract)

  if(
    !payment.rrn||
    !payment.traceNo||
    !payment.requestId
  ){
    return{
      attempted:true,
      success:false,
      amount:refundAmount,
      response:null,
      error:
        'اطلاعات تراکنش بانکی قرارداد کامل نیست.'
    }
  }

  if(
    payment.amount>0&&
    refundAmount>payment.amount
  ){
    return{
      attempted:true,
      success:false,
      amount:refundAmount,
      response:null,
      error:
        'مبلغ استرداد بیشتر از مبلغ پرداخت‌شده بانکی است.'
    }
  }

  try{
    const response=await $fetch(
      BANK_REFUND_API,
      {
        method:'POST',
        body:{
          rrn:payment.rrn,
          amount:refundAmount,
          stan:payment.traceNo,
          terminal:'08102574',
          acceptor:'992180008102574',
          requestId:payment.requestId,
          isSettled:false,
          checkdate:''
        }
      }
    )

    const data=unwrapApiResponse(response)

    const success=
      response===true||
      data===true||
      response?.success===true||
      data?.success===true||
      data?.done===true

    return{
      attempted:true,
      success,
      amount:refundAmount,
      response,
      error:success
        ?''
        :data?.message||
         response?.message||
         'استرداد بانکی ناموفق بود.'
    }
  }catch(error){
    return{
      attempted:true,
      success:false,
      amount:refundAmount,
      response:error?.data||null,
      error:getApiErrorMessage(
        error,
        'خطا در استرداد بانکی'
      )
    }
  }
}

async function restoreTravelCardCredit({
  payment,
  contractId,
  ticketNumber,
  amount
}){
  const restoreAmount=Math.max(
    Math.floor(
      Number(amount||0)
    ),
    0
  )

  if(restoreAmount<=0){
    return{
      attempted:false,
      success:true,
      amount:0,
      sentAmount:0,
      response:null,
      error:''
    }
  }

  const cardNumber=String(
    payment?.travelCardNumber||
    payment?.cardNumber||
    ''
  ).trim()

  if(!cardNumber){
    return{
      attempted:true,
      success:false,
      amount:restoreAmount,
      sentAmount:-restoreAmount,
      response:null,
      error:'شماره سفرکارت ثبت نشده است.'
    }
  }

  if(cardNumber.includes('*')){
    return{
      attempted:true,
      success:false,
      amount:restoreAmount,
      sentAmount:-restoreAmount,
      response:null,
      error:'شماره کامل سفرکارت ثبت نشده است و بازگرداندن اعتبار امکان‌پذیر نیست.'
    }
  }

  try{
    const response=await $fetch(
      'https://api.ahuan.ir/api/SafarCard/update',
      {
        method:'PUT',
        body:{
          cardNumber,
          amount:-restoreAmount,
          description:
            `بازگشت اعتبار بابت کنسلی بلیت ${ticketNumber} - قرارداد ${contractId}`
        }
      }
    )

    const data=
      unwrapApiResponse(response)

    const success=
      response===true||
      data===true||
      response?.success===true||
      data?.success===true||
      response?.status===true||
      data?.status===true

    return{
      attempted:true,
      success,
      amount:restoreAmount,
      sentAmount:-restoreAmount,
      response,
      error:success
        ?''
        :data?.message||
         response?.message||
         'بازگرداندن اعتبار سفرکارت ناموفق بود.'
    }
  }catch(error){
    return{
      attempted:true,
      success:false,
      amount:restoreAmount,
      sentAmount:-restoreAmount,
      response:error?.data||null,
      error:getApiErrorMessage(
        error,
        'خطا در بازگرداندن اعتبار سفرکارت'
      )
    }
  }
}

function setTicketCancellationState({
  row,
  status,
  provider,
  providerResult=null,
  error=''
}){
  if(!row?.flight) return

  const documentValue=
    readFlightDocument(row.flight)

  upsertCancellation(
    documentValue,
    {
      ticketNumber:
        row.ticketNumber,
      passengerId:
        row.passenger?.id||null,
      passengerName:
        row.passengerName,
      provider:
        provider||
        normalizeFlightProvider(
          row.provider
        ),
      status,
      providerResult,
      error,
      updatedAt:
        new Date().toISOString()
    }
  )

  writeFlightDocument(
    row.flight,
    documentValue
  )
}

function applyProviderCancellationDocument({
  row,
  documentValue,
  providerCancellation,
  settlement,
  bankRefundResult,
  travelCardRefundResult,
  settlementPending
}){
  upsertCancellation(
    documentValue,
    {
      ticketNumber:
        row.ticketNumber,
      passengerId:
        row.passenger?.id||null,
      passengerName:
        row.passengerName,
      provider:
        providerCancellation.provider,
      status:settlementPending
        ?CANCELLATION_STATUS.MANUAL_REVIEW
        :CANCELLATION_STATUS.SUCCESS,
      providerStatus:
        providerCancellation.providerStatus,
      pnr:
        providerCancellation.pnr||
        row.pnr,
      newPnr:
        providerCancellation.newPnr||'',
      origin:row.origin,
      destination:row.destination,
      penaltyAmount:
        providerCancellation.penaltyAmount,
      providerRefundAmount:
        providerCancellation
          .providerRefundAmount,
      paymentType:settlement.type,
      customerRefundAmount:
        settlement.customerRefundAmount,
      bankRefundAmount:
        settlement.bankRefundAmount,
      travelCardRefundAmount:
        settlement.travelCardRefundAmount,
      agencyCreditAmount:
        settlement.agencyCreditAmount,
      unresolvedAmount:
        settlement.unresolvedAmount,
      settlementStatus:
        settlementPending
          ?'pending-manual'
          :'success',
      bankRefundResult,
      travelCardRefundResult,
      providerResponses:
        providerCancellation.responses||{},
      completedAt:
        new Date().toISOString(),
      updatedAt:
        new Date().toISOString()
    }
  )

  writeFlightDocument(
    row.flight,
    documentValue
  )
}

function isEveryContractTicketCancelled(
  contract
){
  const flights=Array.isArray(
    contract?.contractFlights
  )
    ?contract.contractFlights
    :[]

  const passengers=Array.isArray(
    contract?.contractPassengers
  )
    ?contract.contractPassengers
    :[]

  if(!flights.length||!passengers.length){
    return false
  }

  return flights.every(
    (flight,flightIndex)=>
      passengers.every(passenger=>{
        const status=String(
          flightIndex===0
            ?passenger?.goTicketStatus
            :passenger?.retTicketStatus
        )
          .trim()
          .toLowerCase()

        return status==='cancelled'
      })
  )
}

function applyCancelledTicketStatus(
  contract,
  row
){
  const passengers=Array.isArray(
    contract?.contractPassengers
  )
    ?contract.contractPassengers
    :[]

  const passenger=passengers.find(
    item=>
      String(item?.id)===
      String(row?.passenger?.id)
  )

  if(!passenger){
    throw new Error(
      'مسافر موردنظر داخل قرارداد پیدا نشد.'
    )
  }

  if(row.flightIndex===0){
    passenger.goTicketStatus='cancelled'
  }else{
    passenger.retTicketStatus='cancelled'
  }

  contract.reduceFlightLoad=1
  contract.reduceHotelLoad=0

  if(
    isEveryContractTicketCancelled(
      contract
    )
  ){
    contract.ticketStatus='cancelled'
    contract.confirmStatus='cancelled'
  }
}

async function updateCancelledContract(
  contract
){
  const response=await $fetch(
    'https://api.ahuan.ir/api/Contract/update',
    {
      method:'PUT',
      body:contract,
      headers:{
        'Content-Type':
          'application/json'
      }
    }
  )

  return(
    response?.data||
    response||
    contract
  )
}

async function openCancelTicket(row){
  if(!row?.canCancel) return

  cancellingTicketKey.value=row.key
  cancelError.value=''
  cancelResult.value=null

  try{
    const{
      provider,
      handler
    }=getCancellationProvider(row)

    const preview=
      await handler.getPreview(row)

    selectedCancelRow.value={
      ...row,
      provider
    }

    cancelPenalty.value=Math.max(
      Number(
        preview?.penaltyAmount||0
      ),
      0
    )

    cancelRefundAmount.value=Math.max(
      Number(
        preview?.providerRefundAmount||0
      ),
      0
    )

    cancelInitialPreview.value=
      preview

    cancelModalStep.value='confirm'
    cancelModalOpen.value=true
  }catch(error){
    selectedCancelRow.value=row

    cancelError.value=
      getApiErrorMessage(
        error,
        'دریافت جریمه کنسلی با خطا مواجه شد.'
      )

    cancelModalStep.value='error'
    cancelModalOpen.value=true
  }finally{
    cancellingTicketKey.value=''
  }
}

async function confirmCancelTicket(){
  const row=
    selectedCancelRow.value

  const contract=
    selectedContract.value

  if(!row||!contract) return

  cancelSubmitting.value=true
  cancelError.value=''
  cancelResult.value=null

  let providerCancellation=null

  try{
    const{
      provider,
      handler
    }=getCancellationProvider(row)

    setTicketCancellationState({
      row,
      status:
        CANCELLATION_STATUS.PROCESSING,
      provider
    })

    providerCancellation=
      await handler.cancel(row)

    setTicketCancellationState({
      row,
      status:
        CANCELLATION_STATUS.PROVIDER_CANCELLED,
      provider,
      providerResult:
        providerCancellation
    })

    const{
      documentValue,
      payment
    }=getCancellationPayment(row)

    const settlement=
      calculateCancellationSettlement(
        payment,
        providerCancellation
          .providerRefundAmount
      )

    let bankRefundResult={
      attempted:false,
      success:true,
      amount:0,
      response:null,
      error:''
    }

    let travelCardRefundResult={
      attempted:false,
      success:true,
      amount:0,
      response:null,
      error:''
    }

    switch(settlement.type){
      case'agency':
        break

      case'gateway':
        bankRefundResult=
          await refundGatewayPayment(
            contract,
            settlement.bankRefundAmount
          )
        break

      case'travelcard':
        travelCardRefundResult=
          await restoreTravelCardCredit({
            payment,
            contractId:contract.id,
            ticketNumber:
              row.ticketNumber,
            amount:
              settlement
                .travelCardRefundAmount
          })
        break

      case'travelcard-gateway':
        if(
          settlement.bankRefundAmount>0
        ){
          bankRefundResult=
            await refundGatewayPayment(
              contract,
              settlement
                .bankRefundAmount
            )
        }

        if(
          settlement
            .travelCardRefundAmount>0
        ){
          travelCardRefundResult=
            await restoreTravelCardCredit({
              payment,
              contractId:contract.id,
              ticketNumber:
                row.ticketNumber,
              amount:
                settlement
                  .travelCardRefundAmount
            })
        }
        break
    }

    const settlementPending=
      (
        bankRefundResult?.attempted&&
        !bankRefundResult?.success
      )||
      (
        travelCardRefundResult
          ?.attempted&&
        !travelCardRefundResult
          ?.success
      )||
      settlement.unresolvedAmount>0

    applyProviderCancellationDocument({
      row,
      documentValue,
      providerCancellation,
      settlement,
      bankRefundResult,
      travelCardRefundResult,
      settlementPending
    })

    applyCancelledTicketStatus(
      contract,
      row
    )

    const updatedContract=
      await updateCancelledContract(
        contract
      )

    selectedContract.value=
      updatedContract

    const contractIndex=
      contracts.value.findIndex(
        item=>
          String(item?.id)===
          String(updatedContract?.id)
      )

    if(contractIndex>=0){
      contracts.value.splice(
        contractIndex,
        1,
        updatedContract
      )
    }

    cancelResult.value={
      provider,
      ...settlement,
      bankRefundResult,
      travelCardRefundResult,
      settlementPending
    }

    cancelModalStep.value='success'
  }catch(error){
    if(providerCancellation?.success){
      setTicketCancellationState({
        row,
        status:
          CANCELLATION_STATUS.MANUAL_REVIEW,
        provider:
          providerCancellation.provider,
        providerResult:
          providerCancellation,
        error:getApiErrorMessage(
          error,
          'تسویه یا ذخیره قرارداد ناموفق بود.'
        )
      })

      cancelError.value=
        'بلیت در تأمین‌کننده کنسل شد، اما تسویه مالی یا ذخیره اطلاعات کامل نشد. کنسلی را دوباره انجام ندهید و با پشتیبانی تماس بگیرید.'
    }else{
      setTicketCancellationState({
        row,
        status:
          CANCELLATION_STATUS.FAILED,
        error:getApiErrorMessage(
          error,
          'کنسلی تأمین‌کننده ناموفق بود.'
        )
      })

      cancelError.value=
        getApiErrorMessage(
          error,
          'عملیات کنسلی با خطا مواجه شد.'
        )
    }

    cancelModalStep.value='error'
  }finally{
    cancelSubmitting.value=false
  }
}

function closeCancelModal(){
  if(cancelSubmitting.value) return

  cancelModalOpen.value=false
  cancelModalStep.value='confirm'
  selectedCancelRow.value=null
  cancelError.value=''
  cancelPenalty.value=0
  cancelRefundAmount.value=0
  cancelInitialPreview.value=null
  cancelResult.value=null
}

const userLoading = ref(false)
const userError = ref('')

const user = ref({
  firstName:'',
  lastName:'',
  mobile:'',
  email:'',
  nationalCode:'',
  passport:'',
  birthDate:null,
  gender:null,
  credit:0,
  noLimit:false
})
const summary = computed(() => {
  return {
    tickets:contracts.value.filter(
      contract =>
        contract?.ticket === true ||
        (
          Array.isArray(
            contract?.contractFlights
          ) &&
          contract.contractFlights.length > 0
        )
    ).length,

    hotels:contracts.value.filter(
      contract =>
        contract?.hotel === true
    ).length,

    tours:contracts.value.filter(
      contract =>
        contract?.tour === true
    ).length,

    wallet:Number(
      user.value?.credit || 0
    )
  }
})
function getUserCookieData() {
  const userCookie = useCookie('user_data')
  let value = userCookie.value

  if (typeof value === 'string') {
    try {
      value = JSON.parse(value)
    } catch {
      value = null
    }
  }

  return value && typeof value === 'object'
    ? value
    : null
}

function getUserMobileFromCookie() {
  const cookieUser = getUserCookieData()

  return String(
    cookieUser?.mobile ||
    cookieUser?.phoneNumber ||
    cookieUser?.phone ||
    ''
  )
    .trim()
}

function unwrapResponse(response) {
  if (
    response &&
    typeof response === 'object' &&
    response.data &&
    typeof response.data === 'object'
  ) {
    return response.data
  }

  return response
}

async function fetchUserProfile() {
  userLoading.value = true
  userError.value = ''

  try {
    const mobile = getUserMobileFromCookie()

    if (!mobile) {
      throw new Error(
        'شماره موبایل کاربر در کوکی پیدا نشد.'
      )
    }

    const response = await $fetch(
      `https://api.ahuan.ir/api/Auth/users/${encodeURIComponent(mobile)}`,
      {
        method: 'GET'
      }
    )

    const data = unwrapResponse(response)

    if (!data || typeof data !== 'object') {
      throw new Error(
        'اطلاعات کاربر از سرویس دریافت نشد.'
      )
    }

    user.value = {
          firstName:String(data?.firstName || '').trim(),
  lastName:String(data?.lastName || '').trim(),
  mobile:String(data?.phoneNumber || mobile).trim(),
  email:String(data?.email || '').trim(),
  nationalCode:String(data?.codeMelli || '').trim(),
  passport:String(data?.passportNo || '').trim(),

  birthDate:
    data?.birthDate || null,

  gender:
    typeof data?.gender === 'boolean'
      ? data.gender
      : null,

  credit:Number(data?.credit || 0),
  noLimit:data?.noLimit === true,
  firstName:String(
    data?.firstName || ''
  ).trim(),

  lastName:String(
    data?.lastName || ''
  ).trim(),

  mobile:String(
    data?.phoneNumber || mobile
  ).trim(),

  email:String(
    data?.email || ''
  ).trim(),

  nationalCode:String(
    data?.codeMelli || ''
  ).trim(),

  passport:String(
    data?.passportNo || ''
  ).trim(),

  credit:Number(
    data?.credit || 0
  ),

  noLimit:data?.noLimit === true
}
  } catch (error) {
    console.error(
      'Fetch user profile error:',
      error
    )

    userError.value =
      error?.data?.message ||
      error?.response?.data?.message ||
      error?.message ||
      'دریافت اطلاعات کاربر با خطا مواجه شد.'
  } finally {
    userLoading.value = false
  }
}
const route=useRoute()

const activeItem=ref(
  String(route.query.tab||'dashboard')
)
watch(
  ()=>route.query.tab,
  tab=>{
    activeItem.value=
      String(tab||'dashboard')
  }
)
const menuItems = [
  { key:'dashboard',label:'داشبورد',icon:'▦' },
  { key:'profile',label:'پروفایل',icon:'◯' },
  { key:'contracts',label:'قراردادها',icon:'▤' },
  { key:'transactions',label:'تراکنش‌ها',icon:'↔' },
  { key:'passengers',label:'مسافران',icon:'♟' },
  { key:'basket',label:'سبد خرید',icon:'🛒' },
  { key:'bankCard',label:'کارت بانکی',icon:'▱' },
  { key:'settings',label:'تنظیمات',icon:'⚙' },
  { key:'logout',label:'خروج',icon:'↪' }
]

const contractCategory = ref('all')
const contractSort = ref('newest')
const categoryMenuOpen = ref(false)
const sortMenuOpen = ref(false)

const contractCategories = [
  { key:'all',label:'همه' },
  { key:'ticket',label:'بلیط' },
  { key:'hotel',label:'هتل' },
  { key:'tour',label:'تور' }
]

const contractSortOptions = [
  { key:'newest',label:'جدیدترین' },
  { key:'oldest',label:'قدیمی‌ترین' }
]
const contractsLoading = ref(false)
const contractsError = ref('')
const contracts = ref([])
const showAllContracts = ref(false)
function isTicketContract(contract) {
  return Boolean(
    contract?.ticket === true ||
    (
      Array.isArray(contract?.contractFlights) &&
      contract.contractFlights.length > 0
    ) ||
    String(contract?.travelVehicle || '').trim() === 'هواپیما'
  )
}

function isHotelContract(contract) {
  return Boolean(
    contract?.hotel === true ||
    (
      Array.isArray(contract?.contractRoutes) &&
      contract.contractRoutes.some(
        route =>
          route?.hotelId ||
          route?.hotelName
      )
    )
  )
}

function isTourContract(contract) {
  return contract?.tour === true
}
const filteredContractOrders = computed(() => {
  let list = [...mappedOrders.value]

  if (contractCategory.value === 'ticket') {
    list = list.filter(
      item => isTicketContract(item.contract)
    )
  }

  if (contractCategory.value === 'hotel') {
    list = list.filter(
      item => isHotelContract(item.contract)
    )
  }

  if (contractCategory.value === 'tour') {
    list = list.filter(
      item => isTourContract(item.contract)
    )
  }

  list.sort((a,b) => {
    const firstTime =
      getContractTimestamp(a.contract)

    const secondTime =
      getContractTimestamp(b.contract)

    return contractSort.value === 'newest'
      ? secondTime - firstTime
      : firstTime - secondTime
  })

  return list
})
const selectedCategoryLabel = computed(() => {
  return contractCategories.find(
    item => item.key === contractCategory.value
  )?.label || 'همه'
})

const selectedSortLabel = computed(() => {
  return contractSortOptions.find(
    item => item.key === contractSort.value
  )?.label || 'جدیدترین'
})
function unwrapContractsResponse(response) {
  if (Array.isArray(response)) return response

  if (Array.isArray(response?.data)) {
    return response.data
  }

  if (Array.isArray(response?.items)) {
    return response.items
  }

  if (Array.isArray(response?.data?.items)) {
    return response.data.items
  }

  return []
}

function getContractTimestamp(contract) {
  const date = String(
    contract?.issueDate || ''
  ).trim()

  const time = String(
    contract?.issueTime || '00:00'
  ).trim()

  if (!date) return 0

  const parsed = new Date(
    `${date}T${time || '00:00'}`
  ).getTime()

  return Number.isNaN(parsed)
    ? 0
    : parsed
}

function getContractType(contract) {
  const types = []

  if (
    contract?.ticket === true ||
    Array.isArray(contract?.contractFlights) &&
    contract.contractFlights.length
  ) {
    types.push('بلیط هواپیما')
  }

  if (contract?.hotel === true) {
    types.push('هتل')
  }

  if (contract?.tour === true) {
    types.push('تور')
  }

  if (contract?.visa === true) {
    types.push('ویزا')
  }

  if (contract?.insurance === true) {
    types.push('بیمه')
  }

  if (contract?.cruise === true) {
    types.push('کشتی کروز')
  }

  if (contract?.other === true) {
    types.push('سایر خدمات')
  }

  return types.length
    ? types.join(' و ')
    : contract?.travelVehicle || '-'
}

function getContractAmount(contract) {
  const go = Number(contract?.totalPrice || 0)
  const ret = Number(contract?.totalPrice2 || 0)

  return go + ret
}

function formatContractDateTime(contract) {
  const dateValue = String(
    contract?.issueDate || ''
  ).trim()

  const timeValue = String(
    contract?.issueTime || ''
  ).trim()

  if (!dateValue) return '-'

  const date = new Date(
    `${dateValue}T${timeValue || '00:00'}`
  )

  if (Number.isNaN(date.getTime())) {
    return `${dateValue}${timeValue ? ` - ${timeValue}` : ''}`
  }

  const persianDate =
    date.toLocaleDateString(
      'fa-IR-u-ca-persian',
      {
        year:'numeric',
        month:'2-digit',
        day:'2-digit'
      }
    )

  const persianTime = timeValue
    ? toPersianDigits(
        timeValue.slice(0,5)
      )
    : ''

  return persianTime
    ? `${persianDate} - ${persianTime}`
    : persianDate
}

function mapContractToOrder(contract) {
  return {
    id:Number(contract?.id || 0),
    type:getContractType(contract),
    amount:getContractAmount(contract),
    dateTime:formatContractDateTime(contract),
    confirmStatus:String(
      contract?.confirmStatus || ''
    ),
    ticketStatus:String(
      contract?.ticketStatus || ''
    ),
    contract
  }
}

async function fetchUserContracts() {
  contractsLoading.value = true
  contractsError.value = ''

  try {
    const mobile =
      getUserMobileFromCookie()

    if (!mobile) {
      throw new Error(
        'شماره موبایل کاربر در کوکی پیدا نشد.'
      )
    }

    const response = await $fetch(
      `https://api.ahuan.ir/api/Contract/search-user/${encodeURIComponent(mobile)}`,
      {
        method:'GET',
        query:{
          pageIndex:1,
          pageSize:1000
        }
      }
    )

    contracts.value =
      unwrapContractsResponse(response)
        .filter(Boolean)
        .sort(
          (a,b) =>
            getContractTimestamp(b) -
            getContractTimestamp(a)
        )
  } catch (error) {
    console.error(
      'Fetch user contracts error:',
      error
    )

    contracts.value = []

    contractsError.value =
      error?.data?.message ||
      error?.response?._data?.message ||
      error?.message ||
      'دریافت سفارش‌های کاربر با خطا مواجه شد.'
  } finally {
    contractsLoading.value = false
  }
}
const mappedOrders = computed(() => {
  return contracts.value.map(
    mapContractToOrder
  )
})

const visibleOrders = computed(() => {
  return showAllContracts.value
    ? mappedOrders.value
    : mappedOrders.value.slice(0,4)
})
const currentPersianDate = computed(() => {
  const now = new Date()

  const weekday = now.toLocaleDateString('fa-IR', {
    weekday: 'long'
  })

  const day = now.toLocaleDateString('fa-IR', {
    day: 'numeric'
  })

  const month = now.toLocaleDateString('fa-IR', {
    month: 'long'
  })

  const year = now.toLocaleDateString('fa-IR', {
    year: 'numeric'
  })

  return `${weekday}، ${day} ${month} ${year}`
})

function formatPrice(value) {
  return new Intl.NumberFormat('fa-IR').format(
    Number(value || 0)
  )
}

function toPersianDigits(value) {
  return String(value ?? '').replace(
    /\d/g,
    digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]
  )
}

function showOrderDetails(order) {
  console.log('Selected order:',order)
}
onMounted(async () => {
  await Promise.all([
    fetchUserProfile(),
    fetchUserContracts()
  ])
})
const editProfileModalOpen = ref(false)

const editProfileForm = ref({
  firstName:'',
  lastName:'',
  nationalCode:'',
  passport:'',
  email:'',
  gender:null,
  birthDay:'',
  birthMonth:'',
  birthYear:''
})

function openEditProfileModal() {
  const birthParts =
    getPersianBirthDateParts(
      user.value.birthDate
    )

  editProfileForm.value = {
    firstName:
      user.value.firstName || '',

    lastName:
      user.value.lastName || '',

    nationalCode:
      user.value.nationalCode || '',

    passport:
      user.value.passport || '',

    email:
      user.value.email || '',

    gender:
      user.value.gender,

    birthDay:
      birthParts.day,

    birthMonth:
      birthParts.month,

    birthYear:
      birthParts.year
  }

  editProfileModalOpen.value = true

  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
}

function closeEditProfileModal() {
  editProfileModalOpen.value = false

  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
}

function getGenderTitle(value) {
  if (value === true) {
    return 'آقا'
  }

  if (value === false) {
    return 'خانم'
  }

  return '-'
}

function formatUserBirthDate(value) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleDateString(
    'fa-IR-u-ca-persian',
    {
      year:'numeric',
      month:'2-digit',
      day:'2-digit'
    }
  )
}

function getPersianBirthDateParts(value) {
  if (!value) {
    return {
      year:'',
      month:'',
      day:''
    }
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return {
      year:'',
      month:'',
      day:''
    }
  }

  const formatter =
    new Intl.DateTimeFormat(
      'en-US-u-ca-persian',
      {
        year:'numeric',
        month:'numeric',
        day:'numeric'
      }
    )

  const parts =
    formatter.formatToParts(date)

  const result = {}

  for (const part of parts) {
    if (
      part.type === 'year' ||
      part.type === 'month' ||
      part.type === 'day'
    ) {
      result[part.type] = part.value
    }
  }

  return {
    year:result.year || '',
    month:result.month || '',
    day:result.day || ''
  }
}





function parsePaymentInfo(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return null
  }

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.length
        ? value
        : null
    }

    return Object.keys(value).length
      ? value
      : null
  }

  if (typeof value === 'string') {
    const normalized = value.trim()

    if (
      !normalized ||
      normalized === 'null' ||
      normalized === 'undefined' ||
      normalized === '{}' ||
      normalized === '[]'
    ) {
      return null
    }

    try {
      const parsed = JSON.parse(normalized)

      if (
        parsed &&
        typeof parsed === 'object'
      ) {
        return parsed
      }
    } catch {
      /*
       * اگر paymentInfo رشته معمولی باشد،
       * باز هم مقدار دارد و پرداخت درگاهی است.
       */
      return {
        raw: normalized
      }
    }
  }

  return null
}

function hasPaymentInfo(contract) {
  return Boolean(
    parsePaymentInfo(
      contract?.paymentInfo
    )
  )
}

function getPaymentTypeTitle(contract) {
  return hasPaymentInfo(contract)
    ? 'درگاه بانکی'
    : 'شارژ بی‌نهایت'
}
function getTransactionAmount(contract) {
  const info = parsePaymentInfo(
    contract?.paymentInfo
  )

  const amount = Number(
    info?.payableAmount ??
    info?.amount ??
    info?.totalPrice ??
    contract?.totalPrice ??
    contract?.totalPrice2 ??
    contract?.prePayment ??
    0
  )

  return Number.isFinite(amount)
    ? amount
    : 0
}
function getTransactionStatusTitle(contract) {
  const status = String(
    contract?.financialStatus ||
    contract?.confirmStatus ||
    contract?.ticketStatus ||
    ''
  )
    .trim()
    .toLowerCase()

  if (
    status === 'confirm' ||
    status === 'confirmed' ||
    status === 'success' ||
    status === 'successful' ||
    status === 'paid'
  ) {
    return 'موفق'
  }

  if (
    status.includes('fail') ||
    status.includes('cancel') ||
    status.includes('error')
  ) {
    return 'ناموفق'
  }

  if (
    status.includes('temp') ||
    status.includes('pending')
  ) {
    return 'در انتظار'
  }

  return status || '-'
}
const transactions = computed(() => {
  return contracts.value.map(
    (contract) => ({
      id:
        Number(contract?.id || 0),

      orderNumber:
        Number(contract?.id || 0),

      orderType:
        getContractServiceType(
          contract
        ),

      amount:
        getTransactionAmount(
          contract
        ),

      date:
        String(
          contract?.issueDate || ''
        ),

      time:
        String(
          contract?.issueTime || ''
        ),

      paymentType:
        getPaymentTypeTitle(
          contract
        ),

      paymentInfo:
        parsePaymentInfo(
          contract?.paymentInfo
        ),

      status:
        getTransactionStatusTitle(
          contract
        ),

      contract
    })
  )
})
const transactionModalOpen = ref(false)
const selectedTransaction = ref(null)

function openTransactionDetails(
  transaction
) {
  selectedTransaction.value =
    transaction

  transactionModalOpen.value =
    true

  if (
    typeof document !== 'undefined'
  ) {
    document.body.style.overflow =
      'hidden'
  }
}

function closeTransactionDetails() {
  transactionModalOpen.value =
    false

  selectedTransaction.value =
    null

  if (
    typeof document !== 'undefined'
  ) {
    document.body.style.overflow =
      ''
  }
}
const customerId = ref(null)
const passengers = ref([])
const passengersLoading = ref(false)
const passengersError = ref('')
const passengerModalOpen = ref(false)
const passengerFormMode = ref('add')
const passengerSubmitting = ref(false)
const passengerFormError = ref('')
const deletingPassengerId = ref(null)
const deletePassengerModalOpen=ref(false)
const passengerToDelete=ref(null)
const createEmptyPassengerForm=()=>({
  id:0,
  fName:'',
  lName:'',
  codeMelli:'',
  passportNo:'',
  nationality:'ایرانی',
  gender:true,
  age:'-',

  birthDay:'',
  birthMonth:'',
  birthYear:'',

  passportIssueDay:'',
  passportIssueMonth:'',
  passportIssueYear:'',

  passportExpDay:'',
  passportExpMonth:'',
  passportExpYear:''
})

const passengerForm = ref(
  createEmptyPassengerForm()
)

async function fetchCustomerInfo() {
  const cookieData =
    getUserCookieData()

  const mobile = String(
  cookieData?.mobile ||
  cookieData?.phoneNumber ||
  cookieData?.phone ||
  ''
).trim()

  if (!mobile) {
    throw new Error(
      'شماره موبایل کاربر در کوکی یافت نشد.'
    )
  }

  const response = await $fetch(
    `https://api.ahuan.ir/api/Customer/mobile/${encodeURIComponent(mobile)}`,
    {
      method:'GET'
    }
  )

  const data =
    response?.data &&
    typeof response.data === 'object'
      ? response.data
      : response

  const id = Number(
    data?.id || 0
  )

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      'شناسه مشتری دریافت نشد.'
    )
  }

  customerId.value = id

  return id
}
async function fetchPassengers() {
  passengersLoading.value = true
  passengersError.value = ''

  try {
    const id =
      customerId.value ||
      await fetchCustomerInfo()

    const response = await $fetch(
      'https://api.ahuan.ir/api/Customer/passengers',
      {
        method:'GET',
        query:{
          customerId:id
        }
      }
    )

    const list =
      Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : []

    passengers.value = list
  } catch (error) {
    console.error(
      'Fetch passengers error:',
      error
    )

    passengers.value = []

    passengersError.value =
      error?.data?.message ||
      error?.response?._data?.message ||
      error?.message ||
      'دریافت لیست مسافران با خطا مواجه شد.'
  } finally {
    passengersLoading.value = false
  }
}
function openAddPassengerModal() {
  passengerFormMode.value = 'add'
  passengerFormError.value = ''
  passengerForm.value =
    createEmptyPassengerForm()

  passengerModalOpen.value = true

  if (typeof document !== 'undefined') {
    document.body.style.overflow =
      'hidden'
  }
}
function getGregorianDateParts(value){
  if(!value){
    return{
      year:'',
      month:'',
      day:''
    }
  }

  const date=new Date(value)

  if(Number.isNaN(date.getTime())){
    return{
      year:'',
      month:'',
      day:''
    }
  }

  return{
    year:String(date.getFullYear()),
    month:String(date.getMonth()+1),
    day:String(date.getDate())
  }
}
function getPersianDateParts(value){
  if(!value){
    return{
      year:'',
      month:'',
      day:''
    }
  }

  const date=new Date(value)

  if(Number.isNaN(date.getTime())){
    return{
      year:'',
      month:'',
      day:''
    }
  }

  const formatter=
    new Intl.DateTimeFormat(
      'en-US-u-ca-persian',
      {
        year:'numeric',
        month:'numeric',
        day:'numeric'
      }
    )

  const parts=
    formatter.formatToParts(date)

  const result={}

  parts.forEach(part=>{
    if(
      part.type==='year'||
      part.type==='month'||
      part.type==='day'
    ){
      result[part.type]=part.value
    }
  })

  return{
    year:result.year||'',
    month:result.month||'',
    day:result.day||''
  }
}
function openEditPassengerModal(passenger){
  const birthDate=
    getPersianDateParts(
      passenger?.birthDate
    )

  const passportIssueDate=
    getGregorianDateParts(
      passenger?.passportIssueDate
    )

  const passportExpDate=
    getGregorianDateParts(
      passenger?.passportExpDate
    )

  passengerFormMode.value='edit'
  passengerFormError.value=''

  passengerForm.value={
    id:Number(passenger?.id||0),
    fName:String(passenger?.fName||''),
    lName:String(passenger?.lName||''),
    codeMelli:String(passenger?.codeMelli||''),
    passportNo:String(passenger?.passportNo||''),

    nationality:String(
      passenger?.nationality||
      'ایرانی'
    ),

    gender:
      passenger?.gender===false
        ?false
        :true,

    age:String(
      passenger?.age||'-'
    ),

    birthDay:birthDate.day,
    birthMonth:birthDate.month,
    birthYear:birthDate.year,
    passportIssueDay:passportIssueDate.day,
passportIssueMonth:passportIssueDate.month,
passportIssueYear:passportIssueDate.year,

passportExpDay:passportExpDate.day,
passportExpMonth:passportExpDate.month,
passportExpYear:passportExpDate.year
    
  }

  passengerModalOpen.value=true

  if(typeof document!=='undefined'){
    document.body.style.overflow='hidden'
  }
}
function buildGregorianDate({
  year,
  month,
  day
}) {
  const jy = Number(year)
  const jm = Number(month)
  const jd = Number(day)

  if (!jy || !jm || !jd) {
    return null
  }

  try {
    const result =
      toGregorian(
        jy,
        jm,
        jd
      )

    return [
      String(result.gy).padStart(4,'0'),
      String(result.gm).padStart(2,'0'),
      String(result.gd).padStart(2,'0')
    ].join('-')
  } catch {
    return null
  }
}
function buildPassengerPayload(){
  const form=
    passengerForm.value

  /*
   * تاریخ تولد شمسی است و به میلادی
   * تبدیل می‌شود.
   */
  const birthDate=
    buildGregorianDate({
      year:form.birthYear,
      month:form.birthMonth,
      day:form.birthDay
    })

  /*
   * تاریخ صدور پاسپورت از ابتدا میلادی است.
   */
  const hasPassportIssueDate=
    form.passportIssueYear&&
    form.passportIssueMonth&&
    form.passportIssueDay

  const passportIssueDate=
    hasPassportIssueDate
      ?buildPassportDate({
          year:form.passportIssueYear,
          month:form.passportIssueMonth,
          day:form.passportIssueDay
        })
      :null

  /*
   * تاریخ انقضا هم میلادی است.
   */
  const hasPassportExpDate=
    form.passportExpYear&&
    form.passportExpMonth&&
    form.passportExpDay

  const passportExpDate=
    hasPassportExpDate
      ?buildPassportDate({
          year:form.passportExpYear,
          month:form.passportExpMonth,
          day:form.passportExpDay
        })
      :null

  return{
    id:
      passengerFormMode.value==='edit'
        ?Number(form.id)
        :0,

    customerId:
      Number(customerId.value),

    gender:
      form.gender===true,

    fName:
      String(
        form.fName||''
      ).trim(),

    lName:
      String(
        form.lName||''
      ).trim(),

    age:
      String(
        form.age||'-'
      ),

    codeMelli:
      String(
        form.codeMelli||''
      ).trim(),

    nationality:
      String(
        form.nationality||
        'ایرانی'
      ).trim(),

    birthDate,

    passportNo:
      String(
        form.passportNo||''
      ).trim()||null,

    passportIssueDate,
    passportExpDate
  }
}
function validatePassengerForm(payload) {
  if (!payload.fName) {
    return 'نام مسافر را وارد کنید.'
  }

  if (!payload.lName) {
    return 'نام خانوادگی مسافر را وارد کنید.'
  }

  if (!payload.birthDate) {
    return 'تاریخ تولد معتبر وارد کنید.'
  }

  if (
    payload.codeMelli &&
    payload.codeMelli.length !== 10
  ) {
    return 'کد ملی باید ۱۰ رقم باشد.'
  }

  return ''
}

async function submitPassenger(){
  if(passengerSubmitting.value)return

  passengerFormError.value=''

  try{
    passengerSubmitting.value=true

    if(!customerId.value){
      await fetchCustomerInfo()
    }

    const payload=buildPassengerPayload()

    const validationError=
      validatePassengerForm(payload)

    if(validationError){
      passengerFormError.value=
        validationError

      return
    }

    const isEdit=
      passengerFormMode.value==='edit'

    await $fetch(
      isEdit
        ?'https://api.ahuan.ir/api/Customer/update-passenger'
        :'https://api.ahuan.ir/api/Customer/add-passenger',
      {
        method:isEdit
          ?'PUT'
          :'POST',

        body:payload,

        headers:{
          'Content-Type':'application/json'
        }
      }
    )

    passengerSubmitting.value=false

    closePassengerModal()

    toast.success(
      isEdit
        ?'اطلاعات مسافر با موفقیت ویرایش شد.'
        :'مسافر با موفقیت اضافه شد.'
    )

    await fetchPassengers()
  }catch(error){
    console.error(
      'Submit passenger error:',
      error
    )

    const message=
      error?.data?.message||
      error?.response?._data?.message||
      error?.message||
      'ثبت اطلاعات مسافر با خطا مواجه شد.'

    passengerFormError.value=message

    toast.error(message)
  }finally{
    passengerSubmitting.value=false
  }
}
async function deletePassenger(passenger){
  const passengerId=Number(passenger?.id||0)

  if(!passengerId){
    return
  }

  try{
    deletingPassengerId.value=passengerId

    await $fetch(
      'https://api.ahuan.ir/api/Customer/delete-passenger',
      {
        method:'DELETE',
        query:{
          passengerId
        }
      }
    )

    deletePassengerModalOpen.value=false
    passengerToDelete.value=null

    if(import.meta.client){
      document.body.style.overflow=''
    }

    toast.success(
      'مسافر با موفقیت حذف شد.'
    )

    await fetchPassengers()
  }catch(error){
    console.error(
      'Delete passenger error:',
      error
    )

    toast.error(
      error?.data?.message||
      error?.response?._data?.message||
      error?.message||
      'حذف مسافر با خطا مواجه شد.'
    )
  }finally{
    deletingPassengerId.value=null
  }
}
function closePassengerModal() {
  if (passengerSubmitting.value) {
    return
  }

  passengerModalOpen.value = false
  passengerFormError.value = ''

  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
}
watch(
  activeItem,
  async (value) => {
    if (
      value === 'passengers' &&
      !passengers.value.length &&
      !passengersLoading.value
    ) {
      await fetchPassengers()
    }
  }
)
</script>

<style scoped>
/* فاصله واقعی از کناره‌ها و max-width */
.profile-container {
  width: 100%;
  max-width: 1400px;
  margin-right: auto;
  margin-left: auto;
}

/*
  دسکتاپ:
  منوی راست | وسط | ستون چپ
*/
.profile-layout {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) 290px;
  gap: 16px;
  align-items: start;
}

.profile-menu {
  grid-column: 1;
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 15px rgb(0 0 0 / 7%);
}

.profile-menu-item {
  display: flex;
  width: 100%;
  min-height: 76px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-bottom: 1px solid #f1f1f1;
  color: #777;
  transition: 0.2s;
}

.profile-menu-item-active {
  background: #14179e;
  color: #fff;
}

.profile-content {
  grid-column: 2;
  min-width: 0;
}

.profile-sidebar {
  grid-column: 3;
  min-width: 0;
}

/* دو div مستقل بالای ستون وسط */
.profile-top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 245px;
  gap: 16px;
}

.profile-user-info,
.profile-weather,
.account-card,
.advertising-card {
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 15px rgb(0 0 0 / 7%);
}

.profile-user-info {
  min-height: 155px;
  padding: 24px;
}

.profile-weather {
  display: flex;
  min-height: 155px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.user-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px 40px;
}

.user-info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  font-size: 14px;
}

.user-info-label {
  width: 105px;
  flex-shrink: 0;
  font-weight: 700;
  color: #555;
}

/* چند div سفارش زیر هم */
.orders-section {
  margin-top: 32px;
}
.passengers-section{
    margin-top: 32px;
}
.orders-title {
  margin-bottom: 16px;
  padding-right: 12px;
  font-size: 18px;
  font-weight: 900;
  color: #555;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(100px, 1fr))
    130px;
  gap: 12px;
  align-items: center;
  min-height: 120px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 12px rgb(0 0 0 / 5%);
}

.order-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  font-size: 13px;
  color: #777;
}

.order-label {
  font-weight: 700;
  color: #555;
}

.account-card {
  padding: 24px;
}

.advertising-card {
  display: flex;
  min-height: 350px;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  font-weight: 700;
  color: #333;
}

/* فقط در موبایل زیر هم قرار می‌گیرد */
@media (max-width: 767px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-menu,
  .profile-content,
  .profile-sidebar {
    grid-column: 1;
  }

  .profile-menu {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .profile-menu-item {
    border-left: 1px solid #f1f1f1;
  }

  .profile-top {
    grid-template-columns: 1fr;
  }

  .user-info-grid {
    grid-template-columns: 1fr;
  }

  .order-card {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .order-card > :last-child {
    grid-column: 1 / -1;
  }
}
.profile-page{
  position:relative;
  width:100%;
  min-height:100vh;
  margin:0;
  padding:0;
  isolation:isolate;
}

.profile-background{
  position:fixed;
  inset:0;
  z-index:-1;
  background-image:url('/imgs/flight/background-profile.png');
  
}

.profile-page-content{
  width:100%;
  padding:32px 40px;
}

@media(max-width:767px){
  .profile-page-content{
    padding:24px 16px;
  }
}
.contract-modal-enter-active,
.contract-modal-leave-active{
  transition:opacity .2s ease;
}

.contract-modal-enter-active>div,
.contract-modal-leave-active>div{
  transition:transform .2s ease;
}

.contract-modal-enter-from,
.contract-modal-leave-to{
  opacity:0;
}

.contract-modal-enter-from>div,
.contract-modal-leave-to>div{
  transform:translateY(14px) scale(.98);
}
.profile-details-section{
  margin-top:32px;
}

.profile-details-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  margin-bottom:16px;
}

.profile-details-title{
  display:inline-block;
  padding:4px 8px;
  color:black;
  font-size:18px;
  font-weight:900;
}

.profile-details-card{
  min-height:215px;
  padding:24px 32px;
  border:1px solid #e5e7eb;
  border-radius:10px;
  background:#fff;
  box-shadow:0 2px 12px rgb(0 0 0 / 5%);
}

.profile-details-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:28px 80px;
}

.profile-detail-item{
  display:flex;
  align-items:center;
  gap:12px;
  min-width:0;
  font-size:15px;
  color:#555;
}

.profile-detail-label{
  font-weight:700;
}

.profile-detail-email{
  grid-column:1 / -1;
}

.profile-edit-field{
  position:relative;
  display:block;
}

.profile-edit-field>span{
  position:absolute;
  top:-8px;
  right:10px;
  z-index:1;
  padding:0 5px;
  background:#fff;
  font-size:11px;
  color:#555;
}

.profile-edit-field input,
.profile-edit-field select{
  width:100%;
  height:50px;
  padding:0 12px;
  border:1px solid #aaa;
  border-radius:4px;
  background:#fff;
  font-size:14px;
  outline:none;
}

.profile-edit-field input:focus,
.profile-edit-field select:focus{
  border-color:#14179e;
}

.profile-edit-modal-enter-active,
.profile-edit-modal-leave-active{
  transition:opacity .2s ease;
}

.profile-edit-modal-enter-from,
.profile-edit-modal-leave-to{
  opacity:0;
}

@media(max-width:767px){
  .profile-details-header{
    align-items:flex-start;
    flex-direction:column;
  }

  .profile-details-grid{
    grid-template-columns:1fr;
    gap:20px;
  }

  .profile-detail-email{
    grid-column:auto;
  }
}
@media(min-width:1024px){
  .profile-menu,.profile-sidebar{
    position:sticky;
    top:24px;
    align-self:start;
    height:max-content;
  }
}
</style>
/*
|--------------------------------------------------------------------------
| FLOW کامل کنسل‌کردن بلیت در Profile
|--------------------------------------------------------------------------
|
| این Flow برای هر بلیت به‌صورت مستقل اجرا می‌شود.
| Provider هر پرواز از flightSupplier تشخیص داده می‌شود.
|
| Providerهای فعلی:
|
| NIRA
| MAHAN
| SEPEHRAN
| AIRTOUR
|
| منطق داخلی کنسلی هر Provider داخل Handler مخصوص خودش است،
| اما نتیجه نهایی همه Providerها باید به یک ساختار مشترک تبدیل شود.
|
|--------------------------------------------------------------------------
| مرحله 1: ساخت ردیف بلیت
|--------------------------------------------------------------------------
|
| برای هر پرواز و هر مسافر یک row ساخته می‌شود.
|
| شماره بلیت ابتدا از فیلدهای مستقیم مسافر خوانده می‌شود:
|
| goTicketNumber
| retTicketNumber
|
| اگر این فیلدها مقدار نداشته باشند، شماره بلیت از:
|
| flightJson.issue.ticketNumbers
|
| استخراج می‌شود.
|
| سپس براساس شماره بلیت، رکورد کنسلی داخل:
|
| flightJson.cancellations[]
|
| پیدا می‌شود.
|
|--------------------------------------------------------------------------
| مرحله 2: تشخیص امکان کنسلی
|--------------------------------------------------------------------------
|
| دکمه کنسلی فقط زمانی فعال است که:
|
| - Provider برای کنسلی Handler داشته باشد.
| - شماره بلیت موجود باشد.
| - زمان پرواز نگذشته باشد.
| - وضعیت بلیت cancelled نباشد.
| - عملیات کنسلی قبلاً وارد وضعیت قفل‌شده نشده باشد.
|
| وضعیت‌های قفل‌شده:
|
| processing
| provider-cancelled
| settlement-pending
| success
| manual-review
|
| در این وضعیت‌ها عملیات Provider نباید دوباره اجرا شود.
|
|--------------------------------------------------------------------------
| مرحله 3: کلیک روی دکمه کنسلی
|--------------------------------------------------------------------------
|
| با اجرای openCancelTicket:
|
| 1- Provider تشخیص داده می‌شود.
|
| 2- Handler همان Provider دریافت می‌شود.
|
| 3- سرویس جریمه اولیه Provider فراخوانی می‌شود.
|
| برای نیرا:
|
| PenaltyNow
|
| این مرحله فقط برای نمایش مبلغ تقریبی به کاربر است.
|
| اطلاعات زیر در مودال نمایش داده می‌شود:
|
| - نام مسافر
| - مسیر
| - شماره بلیت
| - PNR
| - Provider
| - جریمه اولیه
| - مبلغ قابل استرداد اولیه
|
| در این مرحله هنوز:
|
| - Seat کنسل نشده است.
| - Provider Refund انجام نشده است.
| - بانک Refund نشده است.
| - سفرکارت افزایش پیدا نکرده است.
| - قرارداد Update نشده است.
|
|--------------------------------------------------------------------------
| مرحله 4: تأیید کاربر
|--------------------------------------------------------------------------
|
| پس از کلیک روی «بله، کنسل شود»، تابع:
|
| confirmCancelTicket
|
| اجرا می‌شود.
|
| ابتدا وضعیت همان شماره بلیت داخل flightJson برابر می‌شود با:
|
| processing
|
| سپس Handler مخصوص Provider اجرا می‌شود.
|
|--------------------------------------------------------------------------
| مرحله 5: Flow اختصاصی نیرا
|--------------------------------------------------------------------------
|
| ترتیب واقعی کنسلی نیرا:
|
| 1- ETR
| 2- CancelSeat
| 3- PenaltyNow مجدد
| 4- ETRefund
|
| توضیح:
|
| ETR
| برای دریافت Fare و Taxهای بلیت استفاده می‌شود.
|
| CancelSeat
| صندلی همان مسافر را آزاد می‌کند.
|
| اگر NewSplittedPNR برگردد، PNR جدید روی پرواز ذخیره می‌شود.
|
| PenaltyNow مجدد
| بعد از آزادسازی Seat اجرا می‌شود تا جریمه قطعی دریافت شود.
|
| ETRefund
| استرداد مالی را داخل نیرا ثبت می‌کند.
|
| خروجی استاندارد Handler نیرا شامل این موارد است:
|
| success
| provider
| providerStatus
| ticketNumber
| pnr
| newPnr
| penaltyAmount
| providerRefundAmount
| responses
|
|--------------------------------------------------------------------------
| مرحله 6: Provider کنسل شده است
|--------------------------------------------------------------------------
|
| وقتی Handler Provider موفق برگردد، یعنی بلیت در سیستم
| تأمین‌کننده کنسل شده است.
|
| وضعیت موقت داخل flightJson:
|
| provider-cancelled
|
| از این مرحله به بعد حتی اگر تسویه یا Update خطا بخورد،
| عملیات Provider نباید دوباره اجرا شود.
|
|--------------------------------------------------------------------------
| مرحله 7: دریافت اطلاعات پرداخت
|--------------------------------------------------------------------------
|
| اطلاعات پرداخت از:
|
| flightJson.payment
|
| خوانده می‌شود.
|
| نوع پرداخت نرمال می‌شود.
|
| مقدار اشتباه قدیمی:
|
| agancy
|
| به:
|
| agency
|
| تبدیل می‌شود.
|
| نوع‌های پشتیبانی‌شده:
|
| agency
| gateway
| travelcard
| travelcard-gateway
|
|--------------------------------------------------------------------------
| مرحله 8: محاسبه مبلغ قابل بازپرداخت
|--------------------------------------------------------------------------
|
| مبلغ پایه تصمیم‌گیری:
|
| providerRefundAmount
|
| یعنی مبلغی که Provider بعد از کسر جریمه اعلام کرده است.
|
| کاربر نباید بیشتر از مبلغ واقعی پرداخت‌شده خودش دریافت کند.
|
| برای پرداخت غیرآژانسی:
|
| customerRefundAmount
| حداکثر برابر مجموع:
|
| bankAmount + travelCardAmount
|
| است.
|
|--------------------------------------------------------------------------
| مرحله 9: تسویه پرداخت آژانسی
|--------------------------------------------------------------------------
|
| payment.type === 'agency'
|
| در این حالت:
|
| - Refund بانکی انجام نمی‌شود.
| - سفرکارت افزایش پیدا نمی‌کند.
| - مبلغ قابل استرداد به‌عنوان بستانکاری آژانس ثبت می‌شود.
|
| نتیجه:
|
| bankRefundAmount = 0
| travelCardRefundAmount = 0
| agencyCreditAmount = providerRefundAmount
|
| فعلاً این مبلغ داخل flightJson ثبت می‌شود.
|
|--------------------------------------------------------------------------
| مرحله 10: تسویه فقط درگاه
|--------------------------------------------------------------------------
|
| payment.type === 'gateway'
|
| مبلغ Refund بانک:
|
| min(providerRefundAmount, bankAmount)
|
| اطلاعات تراکنش بانکی از contract.paymentId خوانده می‌شود.
|
| سپس API Refund بانک فراخوانی می‌شود.
|
| مبلغ Refund هرگز نباید بیشتر از مبلغ پرداخت‌شده بانکی باشد.
|
|--------------------------------------------------------------------------
| مرحله 11: تسویه فقط سفرکارت
|--------------------------------------------------------------------------
|
| payment.type === 'travelcard'
|
| مبلغ قابل بازگشت:
|
| min(providerRefundAmount, travelCardAmount)
|
| برای بازگرداندن اعتبار سفرکارت این API فراخوانی می‌شود:
|
| PUT /api/SafarCard/update
|
| Payload:
|
| {
|   cardNumber,
|   amount:-restoreAmount,
|   description
| }
|
| نکته:
|
| برای افزایش اعتبار سفرکارت، amount باید منفی ارسال شود.
|
| مثال:
|
| مبلغ بازگشتی = 76000
|
| مقدار ارسالی:
|
| amount = -76000
|
|--------------------------------------------------------------------------
| مرحله 12: تسویه سفرکارت + درگاه
|--------------------------------------------------------------------------
|
| payment.type === 'travelcard-gateway'
|
| providerRefundAmount براساس نسبت پرداخت اولیه تقسیم می‌شود.
|
| مثال:
|
| bankAmount = 300000
| travelCardAmount = 122000
| totalPaid = 422000
|
| ابتدا نسبت بانک و سفرکارت محاسبه می‌شود.
|
| سپس:
|
| bankRefundAmount
| به بانک Refund می‌شود.
|
| travelCardRefundAmount
| با amount منفی به سفرکارت برگردانده می‌شود.
|
| هیچ‌کدام از این دو مبلغ نباید بیشتر از سهم اولیه همان
| منبع پرداخت باشد.
|
| اگر providerRefundAmount بیشتر از مجموع پرداخت کاربر باشد،
| مبلغ اضافه به کاربر پرداخت نمی‌شود و داخل:
|
| unresolvedAmount
|
| ثبت می‌شود.
|
|--------------------------------------------------------------------------
| مرحله 13: ذخیره نتیجه در flightJson
|--------------------------------------------------------------------------
|
| نتیجه کنسلی هر شماره بلیت داخل:
|
| flightJson.cancellations[]
|
| ذخیره می‌شود.
|
| چون یک پرواز ممکن است چند مسافر داشته باشد، برای هر
| ticketNumber یک رکورد مستقل نگهداری می‌شود.
|
| ساختار تقریبی:
|
| {
|   ticketNumber,
|   passengerId,
|   passengerName,
|   provider,
|   status,
|   providerStatus,
|   pnr,
|   newPnr,
|   origin,
|   destination,
|   penaltyAmount,
|   providerRefundAmount,
|   paymentType,
|   customerRefundAmount,
|   bankRefundAmount,
|   travelCardRefundAmount,
|   agencyCreditAmount,
|   unresolvedAmount,
|   settlementStatus,
|   bankRefundResult,
|   travelCardRefundResult,
|   providerResponses,
|   completedAt,
|   updatedAt
| }
|
| اگر قبلاً برای همان ticketNumber رکورد وجود داشته باشد،
| همان رکورد Update می‌شود و رکورد جدید تکراری ساخته نمی‌شود.
|
|--------------------------------------------------------------------------
| مرحله 14: وضعیت نهایی کنسلی
|--------------------------------------------------------------------------
|
| اگر Provider و تمام تسویه‌های موردنیاز موفق باشند:
|
| status = 'success'
| settlementStatus = 'success'
|
| اگر Provider کنسل شده ولی Refund بانک، برگشت سفرکارت
| یا ذخیره قرارداد مشکل داشته باشد:
|
| status = 'manual-review'
| settlementStatus = 'pending-manual'
|
| در این حالت کاربر نباید دوباره دکمه کنسلی را اجرا کند.
|
| اگر عملیات قبل از کنسل‌شدن Provider خطا بخورد:
|
| status = 'failed'
|
| در این حالت امکان تلاش مجدد وجود دارد.
|
|--------------------------------------------------------------------------
| مرحله 15: تغییر وضعیت مسافر
|--------------------------------------------------------------------------
|
| بعد از کنسلی Provider، وضعیت همان بلیت روی مسافر تغییر می‌کند.
|
| برای مسیر اول:
|
| goTicketStatus = 'cancelled'
|
| برای مسیر دوم:
|
| retTicketStatus = 'cancelled'
|
|--------------------------------------------------------------------------
| مرحله 16: تنظیم Load قرارداد
|--------------------------------------------------------------------------
|
| بعد از کنسلی:
|
| reduceFlightLoad = 1
| reduceHotelLoad = 0
|
|--------------------------------------------------------------------------
| مرحله 17: وضعیت کلی قرارداد
|--------------------------------------------------------------------------
|
| اگر فقط یک بلیت یا یک مسیر کنسل شده باشد:
|
| ticketStatus و confirmStatus قرارداد همچنان confirm می‌مانند.
|
| اگر تمام بلیت‌های تمام مسافران و تمام مسیرها کنسل شده باشند:
|
| ticketStatus = 'cancelled'
| confirmStatus = 'cancelled'
|
|--------------------------------------------------------------------------
| مرحله 18: Update قرارداد
|--------------------------------------------------------------------------
|
| کل قرارداد شامل این اطلاعات Update می‌شود:
|
| - flightJson جدید
| - cancellations[]
| - نتیجه Provider
| - نتیجه Refund بانک
| - نتیجه برگشت سفرکارت
| - goTicketStatus / retTicketStatus
| - reduceFlightLoad
| - reduceHotelLoad
| - وضعیت کلی قرارداد
|
| API:
|
| PUT /api/Contract/update
|
|--------------------------------------------------------------------------
| مرحله 19: نمایش وضعیت در Profile
|--------------------------------------------------------------------------
|
| وضعیت دکمه براساس flightJson.cancellations[] نمایش داده می‌شود.
|
| success:
| بلیت کنسل شده
|
| processing:
| در حال کنسلی
|
| provider-cancelled:
| کنسل شده؛ در انتظار تسویه
|
| settlement-pending:
| کنسل شده؛ در انتظار تسویه
|
| manual-review:
| کنسل شده؛ نیازمند پیگیری
|
| failed:
| تلاش مجدد برای کنسلی
|
|--------------------------------------------------------------------------
| قانون مهم جلوگیری از اجرای دوباره
|--------------------------------------------------------------------------
|
| بعد از موفقیت Provider، حتی اگر تسویه مالی یا Update قرارداد
| خطا بخورد، Provider Cancel و ETRefund نباید دوباره اجرا شوند.
|
| وضعیت‌های provider-cancelled و manual-review برای جلوگیری
| از همین تکرار داخل flightJson ذخیره می‌شوند.
|
|--------------------------------------------------------------------------
*/