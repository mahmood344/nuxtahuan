import { defineStore } from 'pinia'


export const useHotelStore = defineStore('hotels', {

  state: () => ({

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
  finalBookingPrice:0,

  }),


  getters: {

    getSelectedRooms:(state)=>
      state.selectedRooms

  },


  actions: {
async refreshSelectedRoomsPricing(){

  const pricingItems =
    this.selectedRooms.map(room=>({
      roomId:room.roomId,
      hotelId:room.hotelId,
      name:room.name,
      count:room.count,
      unitPrice:Number(room.unitPrice || 0),
      totalPrice:Number(room.price || 0)
    }))

  this.selectedRoomsFinalPricing = pricingItems

  this.finalBookingPrice =
    pricingItems.reduce(
      (sum,item)=>
        sum + Number(item.totalPrice || 0),
      0
    )

  return pricingItems
},
    addRoom(room){
      console.log(this.selectedRooms , 'this.selectedRooms');
      const exist =
        this.selectedRooms.find(
          x=>x.roomId===room.roomId
        )

      if(exist){

         exist.count=room.count
 exist.price=room.price
 exist.unitPrice=room.unitPrice

      }
      else{

        this.selectedRooms.push(room)

      }

    },


    removeRoom(key){

      this.selectedRooms =
        this.selectedRooms.filter(
          x=>x.key!==key
        )

    },
removeRoomByRoomId(roomId){

 this.selectedRooms=
 this.selectedRooms.filter(
   x=>x.roomId!==roomId
 )

},

    clearRooms(){

      this.selectedRooms=[]

    }

  }

})