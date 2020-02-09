import wepy from "wepy"
export default class extends wepy.mixin{
    data={
        goods_id:'',
        goodsInfo:[]
    }
    onLoad(options){
        console.log(options);
        this.goods_id=options.goods_id
        this.getGoodsInfo()
      }
     async getGoodsInfo(){
          const {data:res} = await wepy.get('/goods/detail',{goods_id:this.goods_id})
          console.log(res);
          if(res.meta.status!==200){
              return wepy.baseToast()
          }
          this.goodsInfo=res.message
          this.$apply()   
      }
}