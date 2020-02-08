import wepy from 'wepy';
export default class extends wepy.mixin {
  data = {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  };
  onLoad(options) {
    console.log(options);
    this.query = options.query || '';
    this.cid = options.id || '';
    this.getGoodsList();
  }
  //获取商品列表数据
 async getGoodsList() {
      const {data:res} = await wepy.get("/goods/search",{
          query:this.query,
          cid:this.cid,
          pagenum:this.pagenum,
          pagesize:this.pagesize
      })
      console.log(res)
  }
}
