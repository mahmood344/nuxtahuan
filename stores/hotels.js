import {defineStore} from 'pinia'


export const useHotelStore=defineStore(
 'hotels',
 {

  state:()=>({

   hotels:[
    {
     id:3,
     title:'هتل آهوان'
    },
    {
     id:4,
     title:'هتل شکوه ایمان مشهد'
    }
   ],

   selectedRooms:[],

   selectedRoomsFinalPricing:[],

   finalBookingPrice:0

  }),


  getters:{

   getSelectedRooms:(state)=>
    state.selectedRooms,


   totalSelectedRoomsPrice:(state)=>{

    return state.selectedRooms.reduce(
     (sum,room)=>
      sum+Number(room.price||0),
     0
    )

   }

  },


  actions:{

   // =========================
   // محاسبه قیمت نهایی یک اتاق
   // =========================

   calculateRoomFinalPrice(room){

    const count=
     Math.max(
      1,
      Number(room?.count||1)
     )


    // اگر basePrice از صفحه رزرو آمده باشد
    // خودش شامل تعداد اتاق است
    const basePrice=
     Number.isFinite(
      Number(room?.basePrice)
     ) &&
     Number(room?.basePrice)>0
      ?Number(room.basePrice)
      :Number(room?.unitPrice||0)*count


    const extraBedPrice=
     Number(
      room?.extraBedPrice||0
     )


    const noBedPrice=
     Number(
      room?.noBedPrice||0
     )


    return(
     basePrice+
     extraBedPrice+
     noBedPrice
    )

   },


   // =========================
   // Add Room
   // =========================

   addRoom(room){
console.log(room , 'room');
    if(!room)
     return


    const normalizedRoom={
     ...room,

     count:
      Math.max(
       1,
       Number(room.count||1)
      ),

     unitPrice:
      Number(room.unitPrice||0),

     basePrice:
      Number(room.basePrice||0),

     extraBedCount:
      Number(room.extraBedCount||0),

     extraBedUnitPrice:
      Number(room.extraBedUnitPrice||0),

     extraBedPrice:
      Number(room.extraBedPrice||0),

     noBedCount:
      Number(room.noBedCount||0),

     noBedUnitPrice:
      Number(room.noBedUnitPrice||0),

     noBedPrice:
      Number(room.noBedPrice||0)

    }


    normalizedRoom.price=
     this.calculateRoomFinalPrice(
      normalizedRoom
     )


    const exist=
     this.selectedRooms.find(
      item=>
       item.roomId===
       normalizedRoom.roomId
     )


    if(exist){

     // همه اطلاعات را آپدیت کن
     Object.assign(
      exist,
      normalizedRoom
     )

    }
    else{

     this.selectedRooms.push(
      normalizedRoom
     )

    }


    // مبلغ کل store
    this.updateFinalBookingPrice()

   },


   // =========================
   // Refresh Pricing
   // =========================

   async refreshSelectedRoomsPricing(){

    const pricingItems=
     this.selectedRooms.map(room=>{

      const totalPrice=
       this.calculateRoomFinalPrice(
        room
       )


      // خود selectedRooms هم اصلاح شود
      room.price=totalPrice


      return{

       key:
        room.key,

       roomId:
        room.roomId,

       hotelId:
        room.hotelId,

       roomName:
        room.roomName,

       count:
        Number(room.count||1),


       // =====================
       // پایه
       // =====================

       unitPrice:
        Number(room.unitPrice||0),

       basePrice:
        Number(room.basePrice||0),


       // =====================
       // تخت اضافه
       // =====================

       extraBedCount:
        Number(
         room.extraBedCount||0
        ),

       extraBedService:
        room.extraBedService||'',

       extraBedUnitPrice:
        Number(
         room.extraBedUnitPrice||0
        ),

       extraBedPrice:
        Number(
         room.extraBedPrice||0
        ),


       // =====================
       // بدون تخت
       // =====================

       noBedCount:
        Number(
         room.noBedCount||0
        ),

       noBedService:
        room.noBedService||'',

       noBedUnitPrice:
        Number(
         room.noBedUnitPrice||0
        ),

       noBedPrice:
        Number(
         room.noBedPrice||0
        ),


       // =====================
       // نهایی
       // =====================

       totalPrice

      }

     })


    this.selectedRoomsFinalPricing=
     pricingItems


    this.finalBookingPrice=
     pricingItems.reduce(
      (sum,item)=>
       sum+
       Number(item.totalPrice||0),
      0
     )


    return pricingItems

   },


   // =========================
   // Update Total
   // =========================

   updateFinalBookingPrice(){

    this.finalBookingPrice=
     this.selectedRooms.reduce(
      (sum,room)=>
       sum+
       Number(room.price||0),
      0
     )

   },


   // =========================
   // Remove
   // =========================

   removeRoom(key){

    this.selectedRooms=
     this.selectedRooms.filter(
      room=>room.key!==key
     )

    this.updateFinalBookingPrice()

   },


   removeRoomByRoomId(roomId){

    this.selectedRooms=
     this.selectedRooms.filter(
      room=>
       room.roomId!==roomId
     )

    this.updateFinalBookingPrice()

   },


   // =========================
   // Clear
   // =========================

   clearRooms(){

    this.selectedRooms=[]

    this.selectedRoomsFinalPricing=[]

    this.finalBookingPrice=0

   }

  }

 }
)