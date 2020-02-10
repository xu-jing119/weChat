import wepy from "wepy"
export default class extends wepy.mixin {
    data={
        cart:[]
    }
    methods={}
    computed={
        isEmpty(){
            if(this.cart.length<=0){
                return true
            }
            return false
        }
    }
    onLoad(){
       this.cart=this.$parent.globalData.cart
    //    console.log(this.cart);
       
    }
}