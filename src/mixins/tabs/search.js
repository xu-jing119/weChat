import wepy from "wepy"
export default class extends wepy.mixin {
    data={
        value:'',
        SuggestList:[],
        kwList:[]
    }
    onLoad(){
        const kwL = wx.getStorageSync('kw')||[]
        this.kwList=kwL
        console.log(kwL)
    }
    methods={
       
        onGetDetail(id){
            wepy.navigateTo({
                url:'/pages/goods_detail/main?id='+id
            })
        },
        //当搜索关键词发生改变时,触发这个事件
        onChange(e){
            // console.log(e.detail)
            // 当搜索框为空时不发送请求
            if(e.detail.trim().length<=0){
                this.SuggestList=[]
                return
            }
            this.value=e.detail.trim()
            this.getSuggestList(e.detail)
        },
        // 触发搜索(回车)事件
        onSearch(e){
            // console.log(e.detail)
            if(e.detail.trim().length<=0){
                return
            }
            //将用户搜索的关键词保存到本地Storage
           //判断是否有重复的.重复的就不保存
           if(this.kwList.indexOf(e.detail.trim())===-1){
               this.kwList.unshift(e.detail.trim())
           }
           //只保存前十位  用数组方法slice来截取 会返回一个新数组
           this.kwList=this.kwList.slice(0,10)
           wepy.setStorageSync('kw',this.kwList)
            wepy.navigateTo({
                url:"/pages/goods_list?query="+e.detail
            })
        },
        // 触发取消事件
        onCancel(e){
            // console.log(e.detail)
            //当触发取消事件,清空数据列表
            this.SuggestList=[]

        },
        //当点击历史搜索里面的选项时  跳转到列表页面
        onClick(query){
            wepy.navigateTo({
                url:"/pages/goods_list?query="+query
            })
        },
        //点击删除图标时 清除历史记录
        clearHistory(){
            this.kwList=[]
           wepy.setStorageSync('kw',[])
        }
    }
    computed={
        isShowHistory(){
            if(this.value.length<=0){
                return true
            }
            return false
        }

    }
    async getSuggestList(searchStr){
      const {data:res} = await wepy.get('/goods/qsearch',{query:searchStr})
      console.log(res)
      if(res.meta.status!==200){
          return wepy.baseToast()
      }
      this.SuggestList=res.message
      this.$apply()
    }
}