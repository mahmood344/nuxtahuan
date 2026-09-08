<template>
  <section
    class="visa-page mt-12"
    dir="rtl"
  >
    <div
      v-if="visa"
      class="visa-container"
    >
      <!-- ========================= -->
      <!-- MAIN CONTENT -->
      <!-- ========================= -->
      <main class="visa-main">

        <!-- بنر اصلی -->
        <img
          v-if="visa.heroImage"
          :src="visa.heroImage"
          :alt="visa.title"
          class="hero-image"
        >


        <!-- محتوا -->
        <template
          v-for="(item, index) in visa.content"
          :key="index"
        >

          <!-- متن -->
          <section
            v-if="item.type === 'text'"
            class="content-section"
          >
            <h1
              v-if="item.level === 1"
              class="main-title rokh"
            >
              {{ item.title }}
            </h1>

            <h2
              v-else
              class="section-title rokh"
            >
              {{ item.title }}
            </h2>

            <p class="description">
              {{ item.description }}
            </p>
          </section>


          <!-- عکس بین محتوا -->
          <div
            v-else-if="item.type === 'image'"
            class="content-image-box"
          >
            <img
              :src="item.image"
              :alt="item.alt || visa.title"
              class="content-image"
            >
          </div>

        </template>
<!-- دانلود مدارک سفارت -->
<!-- دانلود مدارک و فرم -->
<div
  v-if="
    (visa.showDocumentsDownload && visa.documentsFile) ||
    (visa.showFormDownload && visa.formFile)
  "
  class="visa-download-actions"
>
  <!-- دانلود مدارک -->
  <a
    v-if="
      visa.showDocumentsDownload &&
      visa.documentsFile
    "
    :href="visa.documentsFile"
    :download="`مدارک-مورد-نیاز-سفارت-${visa.countryName}.pdf`"
    class="visa-download-btn"
  >
    <i class="bi bi-download"></i>

    <span>
      دانلود مدارک مورد نیاز سفارت {{ visa.countryName }}
    </span>
  </a>


  <!-- دانلود فرم -->
  <a
    v-if="
      visa.showFormDownload &&
      visa.formFile
    "
    :href="visa.formFile"
    :download="`فرم-سفارت-${visa.countryName}.pdf`"
    class="visa-download-btn"
  >
    <i class="bi bi-download"></i>

    <span>
      دانلود فرم سفارت {{ visa.countryName }}
    </span>
  </a>
</div>
      </main>


      <!-- ========================= -->
      <!-- SIDEBAR مستقل -->
      <!-- ========================= -->
    <aside class="visa-sidebar">

  <!-- عکس تبلیغاتی -->
  <div
    v-if="sidebar.banner"
    class="sidebar-banner"
  >
    <img
      :src="sidebar.banner"
      :alt="visa?.title"
    >
  </div>


  <!-- مطالب مرتبط -->
  <div
    v-if="sidebar.related.length"
    class="related-box"
  >

    <h3 class="related-title rokh">
      مطالب مرتبط
    </h3>

    <div
      v-for="item in sidebar.related"
      :key="item.id"
      class="related-item"
    >
      <img
        :src="item.image"
        :alt="item.title"
      >

      <span>
        {{ item.title }}
      </span>
    </div>

  </div>

</aside>

    </div>
  </section>
</template>


<script setup>
import {
  computed
} from 'vue'

import {
  useRoute
} from 'vue-router'


const route = useRoute()


/* =====================================
   اطلاعات صفحات ویزا
   فقط محتوای اصلی
===================================== */

const visas = [

  {
    id: 1,
showFormDownload: false,
  formFile:
    '',
    title: 'ویزای آمریکا',
 showDocumentsDownload: false,
 countryName: 'آمریکا',

  documentsFile:
    '/imms/hotel/usa-documents.pdf',
    heroImage:
      '/imgs/hotel/usbaner.png',

    content: [

      {
        type: 'text',

        level: 1,

        title: 'کشور آمریکا',

        description:
          `آمریکا یکی از بزرگ‌ترین و مهم‌ترین کشورهای جهان است که سالانه مسافران آمریکا سومین کشور پهناور جهانه و در حال حاضر پربازدیدترین کشور دنیا از نظر توریست هست. آمریکا کشور اولین‌هاست که از اواسط قرن نوزدهم به صورت تدریجی از لحاظ اقتصادی و صنعتی به کشور اول جهان تبدیل شد. این کشور شامل 50 ایالت است و هر کدام از این ایالت‌ها زیبایی و فرهنگ خاص خودشونو دارن. از صحرای آریزونا تا یخزارهای کلورادو، از فرهنگ کابوی‌ها در تگزاس تا زندگی آرام کالیفرنیا همه و همه این کشور را منحصر به فردترین کشور جهان کرده‌است.زیادی با اهداف گردشگری، تحصیلی، کاری و مهاجرتی به این کشور سفر می‌کنند.`
      },


      {
        type: 'text',

        title: 'نیویورک',

        description:
          `شهری در ساحل شرقی ایالات متحده که شامل 5 بخش است: منهتن (Manhattan)، بروکلین (Brooklyn)، کوئینز (Queens)، برانکس (The Bronx) و استیتن آیلند (Staten Island). جمعیت این شهر بیش از 8 میلیون نفره و به خیابونای شلوغ، آسمون‌خراشای بزرگ و تفاوت فرهنگیش معروفه. این شهر خانه بازار سهام معروف نیویورکه و بزرگترین شرکت‌های دنیا توش دفتر دارن. از جمله نقاط مهم این شهر میشه به مجسمه آزادی اشاره کرد که توی جزیره آزادی در خلیج نیویورک قرار داره، از جمله جاهای دیدنی دیگه این شهر میشه به ساختمان امپایر استیت (Empire state Bldg.)، سنترال پارک (Central Park)، میدان تایمز (Times Sq.) و پل بروکلین (Brooklyn Bridge) اشاره کرد.`
      },


      {
        type: 'text',

        title: 'آستین- تگزاس',

        description:
          `شهر آستین مرکز ایالت تگزاس است و رو به پیشرفت‌ترین شهر آمریکا محسوب میشه و جمعیتی بیش از یک میلیون نفر داره. آستین پایتخت موسیقی زنده دنیاست و تقریباً کل سال پر از فستیوال‌های موسیقیه. آستین خونه کمپانی‌های بزرگی مثل IBM، DELL و Apple هست. این شهر در حال حاضر بهترین مقصد برای شکوفایی استارت‌آپ‌ها در جهان محسوب میشه. از جمله نقاط دیدنی آستین میشه به دریاچه لیدی بِرد (Lady Bird Lake) و موزه هنر بلانتون (Blanton Museums of Art) اشاره کرد.`
      },


      {
        type: 'text',

        title: 'سیاتل و واشنگتن',

        description:
          `سیاتل شهری در شمالغربی ایالات متحده و در ایالت واشینگتن واقع است و جمعیت حدودی آن هفتصد هزار نفر است. این شهر به خاطر طبیعت خیره‌کننده و پیشروی در تکنولوژی معروفه. این شهر خونه شرکت‌های بزرگی مثل آمازون و مایکروسافت است. از جمله نقاط خیلی معروف سیاتل میشه به اسپیس نیدل (Space Needle) یا سوزن فضایی اشاره کرد که 184 متر ارتفاع داره و می‌تونید از روش دید 360 درجه روی شهر داشته‌باشید این برج در سال 1961 ساخته‌شده.`
      },


      {
        type: 'image',

        image:
          '/imgs/hotel//visaus.png',

        alt:
          'مراحل اخذ ویزای آمریکا'
      },


      {
        type: 'text',

        title:
          'مراحل گرفتن وقت سفارت و ویزای آمریکا',

        description:
          `برای تعیین وقت سفارت آمریکا خیلی ساده می‌تونید وارد سایت https://ais.usvisa-info.com بشید و با پر کردن فرم‌ها و ارسال مدارک این کار رو انجام بدید. محل‌های سفارت آمریکا در نزدیکی ایران ارمنستان، امارات و ترکیه هستند که می‌تونید برای تحویل مدارک به هر کدوم از این کشورها و کنسولگری آمریکا در اون کشور مراجعه کنید.

با توجه به پیچیدگی فرم‌ها و لزوم دقت در پر کردن اون‌ها، مدارک متنوع، انواع مختلف ویزا و سختگیری‌های سفارت آمریکا پیشنهاد ما این هست که قبل از تصمیم‌گیری برای دریافت ویزای آمریکا حتماً از یک کارشناس با تجربه در این زمینه مشاوره بگیرید؛ ما در آهوان با بهره‌گیری از مجرب‌ترین تیم اخذ ویزا خیلی خوشحال میشیم بتونیم تو این مسیر شما رو یاری بدیم.`
      },


      {
        type: 'image',

        image:
          '/imgs/hotel/visalinebot.png',

        alt:
          'ویزای آمریکا'
      }

    ]
  },


  {
    id: 2,
countryName: 'انگلیس',
showFormDownload: false,
  formFile:
    '',
    title: 'ویزای انگلیس',
 showDocumentsDownload: true,

  documentsFile:
    '/imgs/hotel/مدارک سفارت انگلستان.pdf',
    heroImage:
      '/imgs/hotel/usslider.png',

    content: [

      {
        type: 'text',
        level: 1,
        title: 'کشور انگلیس',
        description:
          `انگلیس یا انگلستان (England) بزرگترین کشور در مجموعه جزایر بریتانیا است که به وسیله کانال مانش از فرانسه مجزا شده‌است و دارای مرز زمینی با اسکاتلند از شمال و ولز از غرب است.

مهمترین شهر انگلیس لندن (London) هست که پایتخت این کشور و پرجمعیت‌ترین شهر این کشور هم به حساب میاد. این شهر یکی از بهترین شهرهای اروپا از لحاظ موقعیت‌های شغلی و پر از دانشگاه‌های تراز اول مثل کالج لندن و مدرسه اقتصاد لندن است و هم‌چنین از جاذبه‌های تاریخی آن می‌توان به برج لندن و کاخ باکینگهام اشاره کرد.

لندن آب و هوای معتدلی دارد و تقریباً تمام ماه‌های سال می‌توانید شاهد بارندگی تو این شهر باشید، البته بیشتر اوقات هوا بارونی هست ولی بعضی از مواقع برف هم می‌بارد ولی بیشتر از چند میلیمتر نمی‌باره و سریع هم آب میشه و قرار نیست زیاد یخ بزنید.

دومین شهر بزرگ انگلیس بیرمنگام هست که یک شهر تاریخی فرهنگی محسوب میشه و از نظر اقتصادی یکی از شهرهای خوب اروپا هم هست. تاریخ این شهر به دوران امپراطوری روم برمیگرده و نقش بسیار مهمی هم توی انقلاب صنعتی ایفا کرده و از اون زمان تا به حال رونق اقتصادی و صنعتیش رو حفظ کرده.

از جمله شهرهای مهم دیگه انگلیس میشه به ترتیب به منچستر، لیورپول، لیدز، کمبریج، نیوکاسل، آکسفورد، یورک و بریستول اشاره کرد که البته به واسطه فوتبال یا دانشگاه های معروفشون کم و بیش ممکنه بشناسید.

بحث اصلی ما تو این قسمت این هست که حالا که این کشور انقدر فوتبال‌خیز (آرسنال، منچستر یونایتد، منچستر سیتی، چلسی، لیورپول و کلی تیم تراز اول دیگه)، مدرن، خوش آب و هوا و همه‌چی تمومه چطوری باید بریم و از نزدیک ببینیمش و از بین کارای اولی که باید انجام بدیم به جز زبان یاد گرفتن و آماده کردن حدودی مدارک چه مواردی تو اولویت قرار دارن؟

اگر میخواید این اطلاعات مهم رو داشته باشید همراه آهوان باشید تا به صورت مرحله‌ای توضیح بدیم که چه کار باید بکنید:`
      },

    //   {
    //     type: 'text',
    //     title: 'لندن',
    //     description:
    //       `توضیحات مربوط به شهر لندن در این قسمت قرار می‌گیرد.`
    //   },

      {
        type: 'image',
        image:
          '/imgs/hotel/visauk.png'
      },

      {
        type: 'text',
        title:
          'مراحل گرفتن وقت سفارت و ویزای انگلستان:',
        description:
          `باید توجه داشته باشین که جهت اخذ وقت سفارت انگلیس، تحویل مدارک و دریافت خدمات بایومتریک باید به یکی از دفاتر شرکت VFS. Global مراجعه کنین (Visa Facilitation Center Global).

متقاضیان سفر به انگلیس از ایران می‌تونن از طریق ایران، امارات و ترکیه برای اخذ ویزای انگلستان اقدام کنن که با توجه به نوسانات قیمت ارز و جهت صرفه‌جویی زمان بهتره که از طریق دفاتر VFS. Global ایران اقدام بشود.`
      },
      {
        type: 'text',
        title:
          'اخذ وقت سفارت انگلیس',
        description:
          `اخذ وقت سفارت انگلیس نکات زیادی داره چون انگلستان یه کم سخت‌گیره و به راحتی بقیه کشورها ویزا نمیده و اگه موفق به اخذ وقت سفارت بشین پیشنهاد می‌کنیم حدود شش تا هشت هفته قبل از تاریخ مد نظرتون برای سفر باشه.

همانطوری که میدونید با توجه به لزوم وجود برنامه‌ریزی دقیق برای انجام این کار و وجود مشغله‌های زندگی روزمره گاهی افراد موفق به کسب نتیجه از فرآیندهای پیچیده اخذ ویزا نمیشن اما نگران نباشید کارشناسان ما در آهوان با گذراندن چندباره این مراحل و تجربه ارزشمندشون میتونن این مسیر رو براتون هموارتر و کم استرس‌تر کنن.`
      },

      {
        type: 'image',
        image:
          '/imgs/hotel/visalinebot.png'
      }

    ]
  },


  {
    id: 3,
 countryName: 'کانادا',
 showFormDownload: true,
  formFile:
    '/imgs/hotel/فرم درخواست ویزای سفارت کانادا.pdf',
    title: 'ویزای کانادا',
 showDocumentsDownload: true,

  documentsFile:
    '/imgs/hotel/مدارک سفارت کانادا.pdf',
    heroImage:
      '/imgs/hotel/caslider.png',

    content: [

      {
        type: 'text',
        level: 1,
        title: 'کشور کانادا',
        description:
          `کانادا از جاهایی است که ما ایرانیا خیلی دوست داریم. کانادا دومین کشور پهناور جهان بعد از روسیه هست و شهرتش به خاطر زیبایی، مردم دوست داشتنی و همیشه خنده‌رو و شهرهای چند فرهنگی‌اش هست. از جمله شهرهای معروف کانادا میشه به تورنتو، ونکوور و مونترال اشاره کرد که هر کدوم ویژگی‌ها و جاذبه‌های منحصر به خودشون رو دارن؛ تورنتو به خاطر موزه‌ها، گالری‌ها و رستوران‌هایش معروفه؛ ونکوور شهریه که به زیبایی‌های طبیعی خارق‌العادش مثل کوه‌ها، جنگل‌ها و سواحل شناخته‌شده و در نهایت مونترال با نمای قدیمی، فریبنده و فرهنگ پر جنب و جوشش واقعاً ارزش دیدن داره.

از جمله مکان‌های دیدنی کانادا میشه به آبشار نیاگارا و کوه‌های راکی اشاره کرد که سالانه تعداد زیادی از گردشگران برای دیدنشون به اونجا سفر میکنن.`
      },
{
        type: 'text',
        level: 2,
        title: 'تورنتو',
        description:
          `تورنتو مرکز ایالت اونتاریو، پرجمعیت‌ترین شهر کانادا و چهارمین شهر پرجمعیت آمریکای شمالی است. ایرانی‌ها بیشتر ساکن منطقه یورک شمالی این شهر هستند و شما می‌تونید اونجا به راحتی مغازه‌های ایرانی پیدا کنید. این شهر پایتخت اقتصادی کانادا هست و یکی از ده شهر اقتصادی قدرتمند جهان هم محسوب میشه و پنج بانک بزرگ کانادا در این شهر قرار دارن.`
      },
      {
        type: 'text',
        level: 3,
        title: 'ونکوور',
        description:`ونکوور یکی از شهرهای ساحلی کانادا و در ایالت بریتیش کلمبیا واقع هست. این شهر، سومین شهر پرجمعیت این کشور است و چندین سال متوالی از لحاظ شاخص رفاه اجتماعی بهترین شهر جهان برای زندگی بوده‌است. این شهر هم‌چنین از لحاظ اقلیم نسبت به سایر شهرهای کانادا گرم‌تر است و هوای معتدلی دارد و از تابستان‌های خیلی گرم یا زمستان‌های خیلی سرد در آن خبری نیست.`
      },
       {
        type: 'text',
        level: 4,
        title: 'مونترال:',
        description:`مونترال بزرگترین شهر ایالت کبک و دومین شهر بزرگ کانادا بعد از تورنتو است و پانزدهمین شهر بزرگ آمریکای شمالی محسوب میشه، بیشتر جمعیت مونترال فرانسوی زبان هستند و مرکز تجاری و صنعتی کبک هست.`
      },
       {
        type: 'text',
        level: 5,
        title: 'مراحل دریافت ویزای کانادا:',
        description:`کانادا به عنوان یکی از کشورهای مهاجرپذیر در جهان امروز کاملا شناخته‌شده‌است و در مقایسه با کشورهای اروپایی قبلاً با سخت‌گیری‌های کمتری ویزا میداد، اما با گشترش بحران‌های اقتصادی و جنگ‌های مختلف میزان متقاضیان برای ورود به این کشور با پیشرفت چشمگیری مواجه شد که این خودش باعث به وجود آمدن شرایط رقابتی برای ورود به این کشور شد که البته هنوز هم از خیلی از کشورهای اروپایی فرآیند راحت‌تری برای صدور ویزا داره.

برای دریافت ویزا اولین قدم گرفتن وقت سفارت هست که از طریق دفاتر کارگزاری کنسولگری کانادا یا VAC (Visa Application Center) انجام می‌گیره. نزدیکترین دفاتر کنسولگری کانادا به ایران در شهرهای آنکارا، استانبول و ابوظبی قرار داره و شما بعد از گرفتن وقت سفارت برای تحویل مدارک و بایومتریک باید به این دفاتر در یکی از سه شهر ذکر شده برین و فرآیند رو طی کنین.

با توجه به سختی‌های فرآیند سفر و جا به جا شدن برنامه‌های سفر و مشغله‌های روزمره و امکان از دست دادن فرصت دریافت ویزا پیشنهاد ما این هست که برنامه‌ریزی و کنترل مدارکتون رو به یک کارشناس با تجربه در این زمینه بسپارید تا این فرآیند رو با موفقیت به پایان برسونین، ما در آهوان با بهره‌گیری از بهترین متخصصان این حوزه خوشحال میشیم که توی این مسیر همراه شما عزیزان باشیم.`
},
      {
        type: 'image',
        image:
          '/imgs/hotel/visaca.png'
      },
      {
        type: 'image',
        image:
          '/imgs/hotel/visalinebot.png'
      }

    ]
  },


  {
    id: 4,
countryName: 'اروپا',
showFormDownload: false,
  formFile:
    '',
    title: 'ویزای اروپا',
showDocumentsDownload: false,

  documentsFile:
    '/files/visa/europe-documents.pdf',
    heroImage:
      '/imgs/hotel/eubaner.png',

    content: [

      {
        type: 'text',
        level: 1,
        title: 'درباره اروپا',
        description:
          `اروپا قاره‌ای متنوع و جذابه که از تمام جهات جذاب و دوست داشتنیه و تاریخ غنی و طبیعت مسحور کنندش تلفیق بی‌نظیری برای هر بیننده‌ای به ارمغان میاره. این قاره 44 کشور مختلف رو تو خودش جا داده که گوناگونی زبانی فوق‌العاده‌ای هم دارن. از جمله شهرهای معروف اروپا از نظر تاریخی میشه به پاریس، رم و بارسلون اشاره کرد و اگر دوست دارید به شهرهای با طبیعت بی‌نظیر سفر کنید پیشنهاد ما توسکانی یا اسکاتلند هست. از نقاط قوت دیگه اروپا میشه به سیستم حمل و نقل بی نظیر و معماری دیدنی شهرهاش اشاره کرد.`
      },
{
        type: 'text',
        level: 2,
        title: 'پاریس:',
        description:`به عنوان پایتخت کشور فرانسه، پاریس یکی از زیباترین و فرهنگی‌ترین شهرهای اروپا هست. حمل و نقل عالی، تاریخ غنی، غذاهای متنوع محلی، موزه‌ها و گالری‌های خاص و شب‌های رویایی این شهر رو تبدیل به خواستنی‌ترین شهر اروپا کرده. البته بدی‌هاییم داره مثل شلوغی و نرخ بالای خرید و اجاره خونه و در مجموع هزینه‌ بالای زندگی که مسائل حیاتی و مهمی قبل از تصمیم‌گیری برای مهاجرت و یا سفر هستند که باید مد نظر قرار بگیره.`      },
        {
        type: 'text',
        level: 3,
        title: 'برلین::',
        description:`پایتخت آلمان یکی از شهرهای بی‌نظیر اروپاست و هزینه زندگی در اون نسبت به سایر شهرهای اروپا ارزانتر هست. یعنی از لحاظ حمل و نقل و اجاره خونه خیلی ارزانتر و معقول‌تر از جاهای دیگه اروپاست. از نکات بد این شهر هم باید اینو بدونید که این شهر در ماه‌های پیک سفر پر از توریسته و بازار کار رقابتی‌تری هم داره و همونطور که شاید بدونین سخت‌ترین قسمتش زبان آلمانیه که هم برای توریست‌ها و هم برای مهاجرها یه مشکل بزرگ حساب میشه.`}
        ,
        {
        type: 'text',
        level: 4,
        title: 'بارسلونا:',
        description:`بارسلونا معماری خیره‌کننده‌ای داره و آب و هواش خیلی خوب و دلنشینه. شب‌های خاطره انگیز و زنده و استایل زندگی مدیترانه‌ای این شهرو به یه شهر کاملاً متفاوت تو اروپا تبدیل کرده. از جمله بدی‌های این شهر میشه به هزینه زندگی بالا، حقوق کم و نرخ بیکاری بالا اشاره کرد.`
      },
              {
        type: 'image',
        image:
          '/imgs/hotel/visaeu.png'
      },

      {
        type: 'text',
        title:
          'مراحل گرفتن وقت سفارت و ویزای کشورهای اروپایی:',
        description:
          `وقت سفارت کشورها به طور کلی به دو شکل تعیین میشه یا توسط کنسولگری یا سفارتخونه و یا توسط شرکت‌های کارگزاری. که از جمله اون‌ها میشه به VFS. Global، VAC، Visametric، CKGSIR اشاره کرد.

وقت سفارت کشورهایی مثل فرانسه، اتریش، بلژیک، قبرس، چک، دانمارک، فنلاند، نروژ، یونان، مجارستان، نیوزلند، پرتغال، آفریقای جنوبی، سوییس، هلند، انگلیس و اوکراین توسط دفاتر کارگزاری VFS. Global تعیین میشه.

وقت سفارت کشور آلمان توسط شرکت کارگزاری Visametric تعیین میشه و وقت سفارت ایتالیا رو هم شرکت کارگزاری CKGSIR تعیین میکنه.

شما قبل از سفر به هر کشوری باید با تحویل مدارک یا مصاحبه با نماینده کشور مقصد در سفارت برای دریافت ویزای خودتون اقدام کنین و این شرایط برای کشورهای مختلف یکسان نیست.

پیشنهاد ما به متقاضیان این است که با توجه به حساس بودن و لزوم توجه به جزئیات در زمان اخذ وقت سفارت حتماً پیش از هر اقدامی با یک کارشناس با تجربه صحبت کنن و یا اقدامات لازم رو با هماهنگی و یا از طریق اون شخص انجام بدن؛ ما در آهوان با بهره‌گیری از حضور کارشناسان و متخصصان این زمینه خوشحال میشیم که بتونیم افتخار همراهیتون تو این مسیر رو داشته باشیم.`
      },

      {
        type: 'image',
        image:
          '/imgs/hotel/visalinebot.png'
      }

    ]
  }

]


/* =====================================
   SIDEBAR
   کاملاً جدا از visas
===================================== */

const sidebars = [
  // =========================
  // آمریکا
  // =========================
  {
    visaId: 1,

    banner:
      '/imgs/hotel/visalineside.gif',

    related: [
      {
        id: 1,
        title: 'راهنمای دریافت ویزای آمریکا',
        image: '/imgs/hotel/england1.png'
      },
      {
        id: 2,
        title: 'مدارک مورد نیاز ویزای آمریکا',
        image: '/imgs/hotel/england2.png'
      },
      {
        id: 3,
        title: 'راهنمای دریافت وقت سفارت آمریکا',
        image: '/imgs/hotel/england3.png'
      },
      {
        id: 4,
        title: 'راهنمای سفر به آمریکا',
        image: '/imgs/hotel/england1.png'
      },
      {
        id: 5,
        title: 'جاذبه‌های گردشگری آمریکا',
        image: '/imgs/hotel/england2.png'
      },
      
    ]
  },


  // =========================
  // انگلیس
  // =========================
  {
    visaId: 2,

    banner:
      '/imgs/hotel/visalineside.gif',

    related: [
      {
        id: 1,
        title: 'راهنمای دریافت ویزای انگلیس',
        image: '/imgs/hotel/england1.png'
      },
      {
        id: 2,
        title: 'مدارک مورد نیاز ویزای انگلیس',
        image: '/imgs/hotel/england2.png'
      },
      {
        id: 3,
        title: 'راهنمای دریافت وقت سفارت انگلیس',
        image: '/imgs/hotel/england3.png'
      },
      {
        id: 4,
        title: 'راهنمای سفر به انگلیس',
        image: '/imgs/hotel/england4.png'
      },
      {
        id: 5,
        title: 'جاذبه‌های گردشگری انگلیس',
        image: '/imgs/hotel/england5.png'
      }
    ]
  },


  // =========================
  // کانادا
  // =========================
  {
    visaId: 3,

    banner:
      '/imgs/hotel/visalineside.gif',

    related: [
      {
        id: 1,
        title: 'راهنمای دریافت ویزای کانادا',
        image: '/imgs/hotel/england1.png'
      },
      {
        id: 2,
        title: 'مدارک مورد نیاز ویزای کانادا',
        image: '/imgs/hotel/england2.png'
      },
      {
        id: 3,
        title: 'راهنمای دریافت وقت سفارت کانادا',
        image: '/imgs/hotel/england3.png'
      },
      {
        id: 4,
        title: 'راهنمای سفر به کانادا',
        image: '/imgs/hotel/england1.png'
      },
      {
        id: 5,
        title: 'جاذبه‌های گردشگری کانادا',
        image: '/imgs/hotel/england2.png'
      }
    ]
  },


  // =========================
  // اروپا
  // =========================
  {
    visaId: 4,

    banner:
      '/imgs/hotel/visalineside.gif',

    related: [
      {
        id: 1,
        title: 'راهنمای دریافت ویزای شینگن',
        image: '/imgs/hotel/england1.png'
      },
      {
        id: 2,
        title: 'مدارک مورد نیاز ویزای شینگن',
        image: '/imgs/hotel/england2.png'
      },
      {
        id: 3,
        title: 'راهنمای دریافت وقت سفارت',
        image: '/imgs/hotel/england3.png'
      },
      {
        id: 4,
        title: 'راهنمای سفر به اروپا',
        image: '/imgs/hotel/england1.png'
      },
      {
        id: 5,
        title: 'راهنمای ویزای کشورهای اروپایی',
        image: '/imgs/hotel/england2.png'
      }
    ]
  }
]


/* =====================================
   Visa By Id
===================================== */

const visa = computed(() => {

  const id =
    Number(route.params.id)

  return visas.find(
    item => item.id === id
  ) || null

})
const sidebar = computed(() => {

  const id = Number(route.params.id)

  return sidebars.find(
    item => item.visaId === id
  ) || {
    banner: '',
    related: []
  }

})
</script>


<style scoped>
.visa-page {
  width: 100%;
  background: #fff;
  padding: 35px 20px 70px;
}


/* کل صفحه */

.visa-container {
  width: 100%;
  max-width: 1180px;

  margin: 0 auto;

  display: grid;

  /*
    RTL داریم.

    main = ستون بزرگ سمت راست
    sidebar = ستون کوچک سمت چپ
  */

  grid-template-columns:
    minmax(0, 1fr) 215px;

  gap: 25px;

  align-items: start;
}


/* ============================= */
/* MAIN */
/* ============================= */

.visa-main {
  width: 100%;
  min-width: 0;
}


.hero-image {
  display: block;

  width: 100%;
  height: auto;

  max-height: 310px;

  object-fit: cover;

  margin-bottom: 22px;
}


.content-section {
  margin-bottom: 25px;
}


.main-title {
  margin-bottom: 10px;

  font-size: 21px;
  font-weight: 900;

  color: #252525;
}


.section-title {
  margin-bottom: 9px;

  font-size: 17px;
  font-weight: 900;

  color: #333;
}


.description {
  margin: 0;

  font-size: 12px;
  line-height: 2.2;

  color: #555;

  text-align: justify;

  white-space: pre-line;
}


.content-image-box {
  width: 100%;
  margin: 25px 0 30px;
}

.content-image {
  display: block;

  width: 100%;
  max-width: none;

  height: auto;

  object-fit: contain;
}


/* ============================= */
/* SIDEBAR */
/* ============================= */

.visa-sidebar {
  width: 215px;
}


.sidebar-banner {
  width: 100%;

  margin-bottom: 15px;

  overflow: hidden;

  border-radius: 10px;
}


.sidebar-banner img {
  display: block;

  width: 100%;
  height: auto;

  object-fit: cover;
}


/* مطالب مرتبط */

.related-box {
  width: 100%;

  overflow: hidden;

  background: #fff;

  border: 1px solid #dedede;

  border-radius: 5px;
}


.related-title {
  margin: 0;

  padding: 12px 13px;

  border-bottom: 1px solid #e5e5e5;

  font-size: 14px;
  font-weight: 900;

  color: #333;
}


.related-item {
  width: 100%;

  display: flex;

  align-items: center;

  gap: 8px;

  padding: 9px;

  border-bottom: 1px solid #ededed;
}


.related-item:last-child {
  border-bottom: 0;
}


.related-item img {
  width: 58px;
  height: 43px;

  flex-shrink: 0;

  object-fit: cover;

  border-radius: 3px;
}


.related-item span {
  font-size: 9px;
  line-height: 1.8;

  color: #555;
}


/* ============================= */
/* Mobile */
/* ============================= */

@media(max-width: 768px) {

  .visa-page {
    padding:
      20px 14px
      50px;
  }


  .visa-container {
    display: flex;

    flex-direction: column;

    gap: 30px;
  }


  .visa-main {
    width: 100%;
  }


  .visa-sidebar {
    width: 100%;
  }


  .hero-image {
    max-height: none;
  }


  .main-title {
    font-size: 19px;
  }


  .section-title {
    font-size: 16px;
  }


  .description {
    font-size: 12px;
  }


  .sidebar-banner {
    max-width: 320px;

    margin:
      0 auto
      18px;
  }


  .related-item img {
    width: 75px;
    height: 55px;
  }


  .related-item span {
    font-size: 11px;
  }
.documents-download {
    justify-content: center;
    margin-top: 25px;
    margin-bottom: 15px;
  }

  .documents-download-btn {
    min-height: 42px;
    padding: 0 18px;
    font-size: 11px;
  }
.visa-download-actions {
  gap: 10px;

  margin-top: 25px;
  margin-bottom: 15px;
}


.visa-download-btn {
  min-height: 42px;

  padding: 0 16px;

  font-size: 11px;
}
}
.documents-download {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
}

.documents-download-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  min-height: 42px;
  padding: 0 25px;

  background: transparent;

  border: 1.5px solid #14179e;
  border-radius: 7px;

  color: #14179e;
  text-decoration: none;

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;

  transition: all 0.25s ease;
}

.documents-download-btn i {
  font-size: 15px;
}

.documents-download-btn:hover {
  background: #14179e;
  color: #fff;
}
.visa-download-actions {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-wrap: wrap;

  gap: 12px;

  margin-top: 30px;
  margin-bottom: 20px;
}


.visa-download-btn {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  min-height: 42px;

  padding: 0 25px;

  background: transparent;

  border: 1.5px solid #14179e;
  border-radius: 7px;

  color: #14179e;

  text-decoration: none;

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;

  transition: all 0.25s ease;
}


.visa-download-btn i {
  font-size: 15px;
}


.visa-download-btn:hover {
  background: #14179e;

  color: #fff;
}
</style>