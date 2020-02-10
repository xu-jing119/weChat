import wepy from "wepy"
export default class extends wepy.mixin{
    data={
        addressInfo:null
    }
    onLoad(){
        this.addressInfo= wepy.getStorageSync('address')||null
    }
    methods={
       async chooseAddr(){
            const res = await wepy.chooseAddress().catch(err=>err)
            // console.log(res);
            if(res.errMsg!=="chooseAddress:ok"){
                return
            }
            this.addressInfo=res
            // 将收货地址存储到本地
            wepy.setStorageSync('address',res)
            this.$apply()
        }
    }
    computed={
        isHaveAddr(){
            if(this.addressInfo===null){
                return false
            }
            return true
        }
    }
}