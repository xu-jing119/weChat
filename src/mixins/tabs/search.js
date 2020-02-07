import wepy from "wepy"
export default class extends wepy.mixin {
    data={
        value:'',
        SuggestList:[]
    }
    methods={
        //当搜索关键词发生改变时,触发这个事件
        onChange(e){
            console.log(e.detail)
            this.getSuggestList(e.detail)
        },
        // 触发搜索事件
        onSearch(e){
            console.log(e.detail)
        },
        // 触发取消事件
        onCancel(e){
            console.log(e.detail)
        }
    }
    async getSuggestList(getSuggest){
      const {data:res} = await wepy.get('/goods/qsearch',{query:getSuggest})
      console.log(res)
      if(res.meta.status!==200){
          return wepy.baseToast()
      }
      this.SuggestList=res.message
    }
}