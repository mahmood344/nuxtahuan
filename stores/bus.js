import {defineStore} from 'pinia'


export const useBusStore=defineStore(
 'bus',
 {

  state:()=>({
    "cities": [
    {
      "name": "قدس",
      "code": "qds"
    },
    {
      "name": "آبادان",
      "code": "abd"
    },
    {
      "name": "آباده",
      "code": "ab1"
    },
    {
      "name": "آزاد شهر",
      "code": "ash"
    },
    {
      "name": "آستارا",
      "code": "ast"
    },
    {
      "name": "آشتیان",
      "code": "asy"
    },
    {
      "name": "آمل",
      "code": "amo"
    },
    {
      "name": "آنکارا",
      "code": "ank"
    },
    {
      "name": "ابهر",
      "code": "abh"
    },
    {
      "name": "اراک",
      "code": "ark"
    },
    {
      "name": "اردبیل",
      "code": "adu"
    },
    {
      "name": "اردستان",
      "code": "ard"
    },
    {
      "name": "اردکان یزد",
      "code": "akn"
    },
    {
      "name": "ارمنستان",
      "code": "arm"
    },
    {
      "name": "ارومیه",
      "code": "umh"
    },
    {
      "name": "ازنا",
      "code": "azn"
    },
    {
      "name": "اسفراین",
      "code": "esf"
    },
    {
      "name": "اسفرجان",
      "code": "esr"
    },
    {
      "name": "اسلامشهر",
      "code": "esl"
    },
    {
      "name": "اشتهارد",
      "code": "esh"
    },
    {
      "name": "اصفهان",
      "code": "ifn"
    },
    {
      "name": "اصفهان جی",
      "code": "ifj"
    },
    {
      "name": "اصفهان صفه",
      "code": "ifs"
    },
    {
      "name": "اصفهان کاوه",
      "code": "ifk"
    },
    {
      "name": "انار",
      "code": "anr"
    },
    {
      "name": "اهر",
      "code": "ahr"
    },
    {
      "name": "اهواز",
      "code": "awz"
    },
    {
      "name": "ایذه",
      "code": "ize"
    },
    {
      "name": "ایروان ارمنستان",
      "code": "irv"
    },
    {
      "name": "ایلام",
      "code": "ilm"
    },
    {
      "name": "اکبر آباد فارس",
      "code": "akf"
    },
    {
      "name": "بابل",
      "code": "bbl"
    },
    {
      "name": "بابلسر",
      "code": "bab"
    },
    {
      "name": "بازرگان",
      "code": "bzg"
    },
    {
      "name": "بجنورد",
      "code": "boj"
    },
    {
      "name": "برازجان",
      "code": "brz"
    },
    {
      "name": "بروجرد",
      "code": "brj"
    },
    {
      "name": "بروجن",
      "code": "bjn"
    },
    {
      "name": "بندر انزلی",
      "code": "ban"
    },
    {
      "name": "بندرعباس",
      "code": "bnd"
    },
    {
      "name": "بهشهر",
      "code": "bsh"
    },
    {
      "name": "بوشهر",
      "code": "buz"
    },
    {
      "name": "بیرجند",
      "code": "bir"
    },
    {
      "name": "پارسیان",
      "code": "ppr"
    },
    {
      "name": "پایانه مرزی مهران",
      "code": "pmn"
    },
    {
      "name": "پیرانشهر",
      "code": "pir"
    },
    {
      "name": "تالش",
      "code": "tls"
    },
    {
      "name": "تاکستان",
      "code": "tkt"
    },
    {
      "name": "تبریز",
      "code": "tbz"
    },
    {
      "name": "تنکابن",
      "code": "tnk"
    },
    {
      "name": "تهران",
      "code": "thr"
    },
    {
      "name": "تهران آزادی",
      "code": "tha"
    },
    {
      "name": "تهران بیهقی",
      "code": "thb"
    },
    {
      "name": "تهران پونک",
      "code": "thp"
    },
    {
      "name": "تهران جنوب",
      "code": "ths"
    },
    {
      "name": "تهران شرق",
      "code": "the"
    },
    {
      "name": "تودشک",
      "code": "tdk"
    },
    {
      "name": "جلفا",
      "code": "jlf"
    },
    {
      "name": "جم",
      "code": "jam"
    },
    {
      "name": "جهرم",
      "code": "jah"
    },
    {
      "name": "چالوس",
      "code": "cha"
    },
    {
      "name": "چذابه",
      "code": "czb"
    },
    {
      "name": "خدابنده قیدار",
      "code": "khb"
    },
    {
      "name": "خرم آباد",
      "code": "khr"
    },
    {
      "name": "خسروی",
      "code": "khv"
    },
    {
      "name": "خوانسار",
      "code": "kha"
    },
    {
      "name": "خور اصفهان",
      "code": "kor"
    },
    {
      "name": "خوی",
      "code": "kho"
    },
    {
      "name": "دامغان",
      "code": "dam"
    },
    {
      "name": "درگهان",
      "code": "drg"
    },
    {
      "name": "درود خراسان",
      "code": "drd"
    },
    {
      "name": "دزفول",
      "code": "dzl"
    },
    {
      "name": "دلیجان",
      "code": "del"
    },
    {
      "name": "رامسر",
      "code": "ram"
    },
    {
      "name": "رامشه",
      "code": "rms"
    },
    {
      "name": "رشت",
      "code": "ras"
    },
    {
      "name": "رضوانشهر",
      "code": "rsh"
    },
    {
      "name": "رفسنجان",
      "code": "rfs"
    },
    {
      "name": "رودسر",
      "code": "rds"
    },
    {
      "name": "رویان",
      "code": "roy"
    },
    {
      "name": "زابل",
      "code": "zbl"
    },
    {
      "name": "زاهدان",
      "code": "zhd"
    },
    {
      "name": "زرین شهر",
      "code": "zar"
    },
    {
      "name": "زنجان",
      "code": "zan"
    },
    {
      "name": "ساری",
      "code": "sar"
    },
    {
      "name": "ساوه",
      "code": "sav"
    },
    {
      "name": "سبزوار",
      "code": "sbz"
    },
    {
      "name": "سراب",
      "code": "srb"
    },
    {
      "name": "سعادت شهر",
      "code": "sad"
    },
    {
      "name": "سقز",
      "code": "sgz"
    },
    {
      "name": "سلطان آباد تهران",
      "code": "sta"
    },
    {
      "name": "سلماس",
      "code": "sal"
    },
    {
      "name": "سمنان",
      "code": "sem"
    },
    {
      "name": "سمیرم",
      "code": "smi"
    },
    {
      "name": "سیرجان",
      "code": "srj"
    },
    {
      "name": "شاهرود",
      "code": "sha"
    },
    {
      "name": "شاهین شهر",
      "code": "shh"
    },
    {
      "name": "شبستر",
      "code": "101"
    },
    {
      "name": "شلمچه",
      "code": "sch"
    },
    {
      "name": "شهر قدس قلعه حسن خان",
      "code": "sgd"
    },
    {
      "name": "شهربابککرمان",
      "code": "sbk"
    },
    {
      "name": "شهرضا",
      "code": "shz"
    },
    {
      "name": "شهریار",
      "code": "srr"
    },
    {
      "name": "شهرکرد",
      "code": "shk"
    },
    {
      "name": "شوش",
      "code": "sho"
    },
    {
      "name": "شوشتر",
      "code": "sht"
    },
    {
      "name": "شیراز کاراندیش",
      "code": "syk"
    },
    {
      "name": "شیروان",
      "code": "shr"
    },
    {
      "name": "صنایع فولاد مبارکه",
      "code": "sfm"
    },
    {
      "name": "طبس",
      "code": "tbs"
    },
    {
      "name": "عباس  آباد مازندران",
      "code": "abs"
    },
    {
      "name": "فردوس",
      "code": "fer"
    },
    {
      "name": "فرودگاه امام خمینی",
      "code": "ika"
    },
    {
      "name": "فریمان",
      "code": "fan"
    },
    {
      "name": "فولادشهر",
      "code": "fsh"
    },
    {
      "name": "فومن",
      "code": "fmn"
    },
    {
      "name": "قائمشهر",
      "code": "gha"
    },
    {
      "name": "قروهسنندج",
      "code": "ghv"
    },
    {
      "name": "قشم",
      "code": "gsm"
    },
    {
      "name": "قم",
      "code": "qom"
    },
    {
      "name": "قوچان",
      "code": "gho"
    },
    {
      "name": "گرگان",
      "code": "gor"
    },
    {
      "name": "گرگان ف کاخ",
      "code": "gof"
    },
    {
      "name": "گل گهر",
      "code": "glg"
    },
    {
      "name": "گلپایگان",
      "code": "gol"
    },
    {
      "name": "گناباد",
      "code": "gbd"
    },
    {
      "name": "گناوه",
      "code": "gnv"
    },
    {
      "name": "گنبد",
      "code": "gon"
    },
    {
      "name": "لار",
      "code": "lar"
    },
    {
      "name": "لردگان",
      "code": "lrg"
    },
    {
      "name": "ماکو",
      "code": "mak"
    },
    {
      "name": "محمودآباد",
      "code": "mah"
    },
    {
      "name": "مشهد",
      "code": "mhd"
    },
    {
      "name": "مشکین شهر",
      "code": "msk"
    },
    {
      "name": "ملایر",
      "code": "mly"
    },
    {
      "name": "مهاباد",
      "code": "mbd"
    },
    {
      "name": "مهاجران (اراک)",
      "code": "mhj"
    },
    {
      "name": "مهران",
      "code": "mhn"
    },
    {
      "name": "مورچه  خورت",
      "code": "mch"
    },
    {
      "name": "میبد",
      "code": "mey"
    },
    {
      "name": "نائین",
      "code": "nae"
    },
    {
      "name": "نور",
      "code": "nor"
    },
    {
      "name": "نورآبادفارس",
      "code": "nrd"
    },
    {
      "name": "نوشهر",
      "code": "nsh"
    },
    {
      "name": "نیشابور",
      "code": "nei"
    },
    {
      "name": "هادی شهر",
      "code": "had"
    },
    {
      "name": "هشتپر",
      "code": "hpr"
    },
    {
      "name": "همدان",
      "code": "ham"
    },
    {
      "name": "ورزنه",
      "code": "vrz"
    },
    {
      "name": "یاسوج",
      "code": "ysj"
    },
    {
      "name": "یزد",
      "code": "yaz"
    },
    {
      "name": "کازرون",
      "code": "kzn"
    },
    {
      "name": "کاشان",
      "code": "ksh"
    },
    {
      "name": "کاشمر",
      "code": "ksm"
    },
    {
      "name": "کرج",
      "code": "krj"
    },
    {
      "name": "کرمان",
      "code": "ker"
    },
    {
      "name": "کرمانشاه",
      "code": "krh"
    },
    {
      "name": "کلاچای",
      "code": "kel"
    },
    {
      "name": "کلیبر",
      "code": "klb"
    }
  ],
  "popularCities": [
    {
      "name": "تهران",
      "code": "thr"
    },
    {
      "name": "مشهد",
      "code": "mhd"
    },
    {
      "name": "اصفهان",
      "code": "ifn"
    },
    {
      "name": "شیراز",
      "code": "syk"
    },
    {
      "name": "تبریز",
      "code": "tbz"
    },
    {
      "name": "کرج",
      "code": "krj"
    },
    {
      "name": "قم",
      "code": "qom"
    },
    {
      "name": "رشت",
      "code": "ras"
    },
    {
      "name": "اهواز",
      "code": "awz"
    },
    {
      "name": "یزد",
      "code": "yaz"
    }
  ],
  
  "companies": [
    {
      "name": "ایران پیما",
      "code": "iranpeyma",
      "image": '/imgs/bus/iranpeyma.svg',
      "pageUrl": "https://payaneh.ir/company-bus/iranpeyma"
    },
    {
      "name": "همسفر",
      "code": "hamsafar",
      "image": '/imgs/bus/hamsafar.svg',
      "pageUrl": "https://payaneh.ir/company-bus/hamsafar"
    },
    {
      "name": "ترابر بی تا",
      "code": "tbt",
      "image": '/imgs/bus/bita.svg',
      "pageUrl": "https://payaneh.ir/company-bus/tbt"
    },
    {
      "name": "آریا سفر",
      "code": "aryasafar",
      "image": '/imgs/bus/ariya.svg',
      "pageUrl": "https://payaneh.ir/company-bus/aryasafar"
    },
    {
      "name": "پیک معتمد (پی ام تی)",
      "code": "pmt",
      "image": '/imgs/bus/pmt.svg',
      "pageUrl": "https://payaneh.ir/company-bus/pmt"
    },
    {
      "name": "گیتی پیما",
      "code": "gitipeyma",
      "image": '/imgs/bus/giti.svg',
      "pageUrl": "https://payaneh.ir/company-bus/gitipeyma"
    },
    {
      "name": "تک سفر ایرانیان",
      "code": "taksafar",
      "image": '/imgs/bus/tak.svg',
      "pageUrl": "https://payaneh.ir/company-bus/taksafar"
    },
    {
      "name": "سیر و سفر",
      "code": "seirosafar",
      "image": '/imgs/bus/seirsafar.svg',
      "pageUrl": "https://payaneh.ir/company-bus/seirosafar"
    },
    {
      "name": "لوان نور",
      "code": "lavannour",
      "image": '/imgs/bus/lavan.svg',
      "pageUrl": "https://payaneh.ir/company-bus/lavannour"
    },
    {
      "name": "عدل",
      "code": "adl",
      "image": '/imgs/bus/adl.svg',
      "pageUrl": "https://payaneh.ir/company-bus/adl"
    },
    {
      "name": "پیک صبا",
      "code": "peykesaba",
      "image": '/imgs/bus/saba.svg',
      "pageUrl": "https://payaneh.ir/company-bus/peykesaba"
    },
    {
      "name": "رویال سفر ایرانیان",
      "code": "royalsafar",
      "image": '/imgs/bus/royal.svg',
      "pageUrl": "/imgs/bus/royal.svg"
    },
    {
      "name": "گیتی نورد",
      "code": "gitinavard",
      "image": '/imgs/bus/gitinavard.svg',
      "pageUrl": "https://payaneh.ir/company-bus/gitinavard"
    },
    {
      "name": "مارال سیر ایرانیان",
      "code": "maralseir",
      "image": '/imgs/bus/maral.svg',
      "pageUrl": "https://payaneh.ir/company-bus/maralseir"
    },
    {
      "name": "ماهان سفر",
      "code": "mahansafar",
      "image": '/imgs/bus/mahan.svg',
      "pageUrl": "https://payaneh.ir/company-bus/mahansafar"
    },
    {
      "name": "ایران پیمان",
      "code": "iranpeyman",
      "image": '/imgs/bus/iranpeyman.svg',
      "pageUrl": "https://payaneh.ir/company-bus/iranpeyman"
    },
    {
      "name": "میهن نور",
      "code": "mihannour",
      "image": '/imgs/bus/mihan.svg',
      "pageUrl": "https://payaneh.ir/company-bus/mihannour"
    },
    {
      "name": "آسیا سفر",
      "code": "asiasafar",
      "image": '/imgs/bus/asiyasafar.svg',
      "pageUrl": "https://payaneh.ir/company-bus/asiasafar"
    },
    {
      "name": "ایمن سفر ایرانیان",
      "code": "imensafariranian",
      "image": '/imgs/bus/imensafar.svg',
      "pageUrl": "https://payaneh.ir/company-bus/imensafariranian"
    },
    {
      "name": "آرتا سبلان",
      "code": "artasabalan",
      "image": '/imgs/bus/arta.svg',
      "pageUrl": "https://payaneh.ir/company-bus/artasabalan"
    },
    {
      "name": "کیان سفر پاسارگاد",
      "code": "kiansafarpasargad",
      "image": '/imgs/bus/kiyan.svg',
      "pageUrl": "https://payaneh.ir/company-bus/kiansafarpasargad"
    },
    {
      "name": "سفر سیر",
      "code": "safarseir",
      "image": '/imgs/bus/safirseir.svg',
      "pageUrl": "https://payaneh.ir/company-bus/safarseir"
    },
    {
      "name": "جوان سیر ایثار",
      "code": "javanseireisar",
      "image": '/imgs/bus/javan.svg',
      "pageUrl": "https://payaneh.ir/company-bus/javanseireisar"
    },
    {
      "name": "آرو",
      "code": "aro",
      "image": '/imgs/bus/aro.svg',
      "pageUrl": "https://payaneh.ir/company-bus/aro"
    },
    {
      "name": "سپهر آسیا",
      "code": "sepehrasia",
      "image": '/imgs/bus/sepehr.svg',
      "pageUrl": "https://payaneh.ir/company-bus/sepehrasia"
    },
    {
      "name": "پارسیان",
      "code": "parsian",
      "image": '/imgs/bus/parsian.svg',
      "pageUrl": "https://payaneh.ir/company-bus/parsian"
    },
    {
      "name": "راهپیمای پارسیان",
      "code": "rahpeymaparsian",
      "image": '/imgs/bus/rahparsian.svg',
      "pageUrl": "https://payaneh.ir/company-bus/rahpeymaparsian"
    },
    {
      "name": "جهان گشت مهر",
      "code": "jahangashtmehr",
      "image": '/imgs/bus/jahangasht.svg',
      "pageUrl": "https://payaneh.ir/company-bus/jahangashtmehr"
    }
  ]

  
  }),


  getters:{


  },


  actions:{
  

  }

 }
)