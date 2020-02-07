import wepy from "wepy"
export default class extends wepy.mixin {
    data = {
        swiperList:[],
        cateList:[],
        floorList:[]
      }
      methods={
        
        getListData(url){
          wepy.navigateTo({
            url
          })
        }
      }
      onLoad(){
        this.getSwiperData()
        this.getCateData()
        this.getFloorData()
      }
     async getSwiperData(){
        const {data:res} = await wepy.get("/home/swiperdata")
        // console.log(res)
        if(res.meta.status!==200){
          return wepy.baseToast()
        }
        this.swiperList = res.message
        this.$apply()
        // console.log(this.swiperList)
      }
     async getCateData(){
       const {data:res} = await wepy.get("/home/catitems")
      //  console.log(res)
       if(res.meta.status!==200){
          return wepy.baseToast()
        }
        this.cateList = res.message
        this.$apply()
      }
      async getFloorData(){
        const {data:res} = await wepy.get("/home/floordata")
        console.log(res)
        if(res.meta.status!==200){
           return wepy.baseToast()
         }
         this.floorList = res.message
         this.$apply()
         console.log(this.floorList)
       }
}