import wepy from "wepy"
export default class extends wepy.mixin{
    data={
        goods_id:'',
        goodsInfo:[]
    }
    methods={
        getPreview(img){
            wepy.previewImage({
                current: img, // 当前显示图片的http链接
                urls: this.goodsInfo.pics.map(x=>x.pics_big) // 需要预览的图片http链接列表
              })
        }
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