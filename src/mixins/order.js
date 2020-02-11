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
        // 提交支付订单
       async onSubmit(){
            if(this.amount<=0){
                return wepy.baseToast('支付金额不能为0!')
            }
            if(this.userAddr.length<=0){
                return wepy.baseToast('请选择收货地址')
            }
            const {data:createRes} = await wepy.post('/my/orders/create',{
                order_price:'0.01',
                consignee_addr:this.userAddr,
                order_detail:JSON.stringify(this.cart),
                goods:this.cart.map(x=>{
                    return {
                        goods_id:x.id,
                        goods_number:x.count,
                        goods_price:x.price
                    }
                })
            })
            if(createRes.meta.status!==200){
                return wepy.baseToast('创建订单失败!')
            }
            const orderInfo = createRes.message
            // 生成预支付订单
            const {data:orderResult} = await wepy.post("/my/orders/req_unifiedorder",{
                order_number:orderInfo.order_number
            })
            // 生成预支付订单失败
            if(orderResult.meta.status!==200){
                return wepy.baseToast("生成预支付订单失败!")
            }
            // 走支付流程
            //调用微信支付Api
           const payResult= await wepy.requestPayment(orderResult.message.pay).catch(err=>err)
        //    用户取消了支付
           if(payResult.errMsg==="requestPayment:fail camcel"){
            return wepy.baseToast("您已经取消了支付!")
           }
            //用户完成了支付 
            // 检查用户支付的状态
            const {data:payCheckResult} = await wepy.post("/my/orders/chkOrder",{
                order_number:orderInfo.order_number
            })
            if(payCheckResult.meta.status!==200){
                return wepy.baseToast("支付订单失败!")
            }
            wepy.showToast({
                title:"支付订单成功!"
            })
            // 跳转到订单列表页面
            wepy.navigateTo({
                url:"/pages/orderList"
            })
        }
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