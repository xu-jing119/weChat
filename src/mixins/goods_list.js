import wepy from 'wepy';
export default class extends wepy.mixin {
  data = {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10,
    goodsList:[],
    total:0,
    //数据是否已经加载完毕
    isBom:false,
    //是否在请求数据
    isLoading:false
  };
  onLoad(options) {
    console.log(options);
    this.query = options.query || '';
    this.cid = options.id || '';
    this.getGoodsList();
  }
  //获取商品列表数据
 async getGoodsList(cb) {
   this.isLoading=true
      const {data:res} = await wepy.get("/goods/search",{
          query:this.query,
          cid:this.cid,
          pagenum:this.pagenum,
          pagesize:this.pagesize
      })
      console.log(res)
      if(res.meta.status!==200){
        return wepy.baseToast()
      }
      this.goodsList=[...this.goodsList,...res.message.goods]
      this.total = res.message.total
      this.isLoading=false
      this.$apply()
      cb && cb()
  }
  // 触底操作
  onReachBottom(){
    //判断是否在请求其他数据
    if(this.isLoading){
      return
    }
    // console.log('触底了')
    //先判断是否有下一页数据 以防发送没必要的请求
    if(this.pagenum*this.pagesize>=this.total){
      this.isBom=true
      return
    }
    this.pagenum++
    this.getGoodsList()
  }
  //下拉刷新操作
  onPullDownRefresh(){
    //初始化必要的字段值
    this.pagenum=1
    this.total=0
    this.goodsList=[]
    this.isBom=this.isLoading=false
    //重新发起数据请求
    this.getGoodsList(()=>{
    //停止下拉刷新
    wepy.stopPullDownRefresh()
    })
  }
}
