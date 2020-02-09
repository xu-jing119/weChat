import wepy from "wepy"
export default class extends wepy.mixin{
    data={
        goods_id:'',
        goodsInfo:[],
        addressInfo:null
    }
    methods={
        getPreview(img){
            wepy.previewImage({
                current: img, // 当前显示图片的http链接
                urls: this.goodsInfo.pics.map(x=>x.pics_big) // 需要预览的图片http链接列表
              })
        },
       async getAddress(){
            const res = await wepy.chooseAddress().catch(err=>err)
            if(res.errMsg!=='chooseAddress:ok'){
                return wepy.baseToast('获取收货地址失败')
            }
            this.addressInfo = res
            // console.log(res);
            wepy.setStorageSync('address',res)
            this.$apply()
            
        },
        onAddCart(){
            // console.log(this.goodsInfo);
            // console.log(this.$parent.globalData);
            this.$parent.addGoodsCart(this.goodsInfo)
            wepy.showToast({
                title:"加入购物车成功",
                icon:"success"
            })
            
        }
    }
    computed={
        addressStr(){
            if(this.addressInfo==null){
                return '请选择收货地址'
            }
            const addr=this.addressInfo
            const str = addr.provinceName+addr.cityName+addr.countyName+addr.detailInfo
            return str
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