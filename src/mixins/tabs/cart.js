import wepy from "wepy"
export default class extends wepy.mixin {
    data={
        cart:[]
    }
    methods={
        countChange(e){
            // 最新商品数量
            // console.log(e.detail);
            // 商品id
            // console.log(e.target.dataset.id);
            this.$parent.saveGoodsCount(e.target.dataset.id,e.detail)
        },
        stateChgange(e){
             // 商品最新选中状态
            //  console.log(e.detail);
             // 当前商品id
            //  console.log(e.target.dataset.id);
             this.$parent.saveStateChange(e.target.dataset.id,e.detail)
        },
        // 点击删除对应的商品
        close(id){
            // console.log(id);
            this.$parent.removeGoods(id)
        }
    }
    computed={
        // 计算购物车是否有商品
        isEmpty(){
            if(this.cart.length<=0){
                return true
            }
            return false
        },
        // 计算总价格  单位 分
        amount() {
            var total=0
            this.cart.forEach(x=>{
                if(x.isCheck){
                    total+=x.price*x.count
                }
               
            })
            return total*100

        }   
    }
    onLoad(){
       this.cart=this.$parent.globalData.cart
    //    console.log(this.cart);
       
    }
}