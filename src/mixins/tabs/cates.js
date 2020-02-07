import wepy from "wepy"
export default class extends wepy.mixin {
    data={
        cateList:[],
        active:0,
        wh:0,
        secondCateList:[]

    }
    methods={
        onChange(e) {
        //    console.log(e.detail)
           this.secondCateList=this.cateList[e.detail].children
        //    console.log(this.secondCateList)
        },
        getId(id){
            // console.log(id)
            wepy.navigateTo({
                url:'/pages/goods_list?id=' + id
            })
        }
    }
    onLoad(){
        this.getCateData()
        this.getHeight()
    }
   async getCateData(){
       const {data:res} = await wepy.get("/categories")
       if(res.meta.status!==200){
           return wepy.baseToast()
       }
       this.cateList=res.message
       this.secondCateList=res.message[0].children
       this.$apply()
       console.log(this.cateList)
    }
    async getHeight(){
        const res = await wepy.getSystemInfo()
        // console.log(res)
        if(res.errMsg === "getSystemInfo:ok"){
            this.wh = res.windowHeight
            this.$apply()
        }
    }
}