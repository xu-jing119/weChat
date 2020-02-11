import wepy from "wepy"
export default class extends wepy.mixin{
    data={
        addressInfo:null,
        cart:[],
        isLogin:false
    }
    onLoad(){
        this.addressInfo= wepy.getStorageSync('address')||null
        // 将购物车中已经勾选的商品过滤出来
        const newArr = this.$parent.globalData.cart.filter(x=>x.isCheck)
        console.log(newArr);
        this.cart=newArr
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
        },
        // 处理登录下单按钮时
       async getUserInfo(userInfo){
            // 判断是否获取用户信息成功
            if(userInfo.detail.errMsg!=="getUserInfo:ok"){
                return wepy.baseToast('获取用户信息失败!')
            }
            console.log(userInfo);
            // 获取用户登录凭证 Code
            const loginRes = await wepy.login()
            console.log(loginRes);
            if(loginRes.errMsg!=="login:ok"){
                return wepy.baseToast('微信登录失败!')
            }
            const loginParams={
                code:loginRes.code,
                encryptedData:userInfo.detail.encryptedData,
                iv:userInfo.detail.iv,
                rawData:userInfo.detail.rawData,
                signature:userInfo.detail.signature
            }
            // 发送post请求
            const {data:res} = await wepy.post("/users/wxlogin",loginParams)
            console.log(res);
            if(res.meta.status!==200){
                return wepy.baseToast('微信登录失败!')
            }
            this.setStorageSync('token',res.message.token)
            this.isLogin=true
            this.$apply() 
        },
        onSubmit(){}
    }
    computed={
        isHaveAddr(){
            if(this.addressInfo===null){
                return false
            }
            return true
        },
        userAddr(){
            if(this.addressInfo===null){
                return ''
            }
          return (this.addressInfo.provinceName+this.addressInfo.cityName+this.addressInfo.countyName+this.addressInfo.detailInfo)
          
        },
        // 计算总金额 单位 分
        amount(){
            let c =0
            this.cart.forEach(x=>{
                c+=x.price*x.count
            })
            return c*100
        }
    }
}