import wepy from "wepy"
export default class extends wepy.mixin{
    data={
        active:0,
        // 全部订单
        allOrderList:[],
        // 待支付订单
        waitOrderList:[],
        // 已支付订单
        finishOrderList:[]
    }
    onLoad(){
        this.getListInfo(this.active)
    }
    methods={
        tabChanged(e){
            // console.log(e);
           this.active=e.detail.index 
           this.getListInfo(this.active)
        }
    }
   async getListInfo(index){
        const {data:res} = await wepy.get("/my/orders/all",{type:index+1})
        if(res.meta.status!==200){
            return wepy.baseToast('获取数据失败')
        }
        // console.log(res);
        
        if(index===0){
            this.allOrderList=res.message.orders
        }else if(index===1){
            this.waitOrderList=res.message.orders
        }else if(index===2){
            this.finishOrderList=res.message.orders
        }else{
            wepy.baseToast('订单类型错误')
        }
        this.$apply()
    }
}