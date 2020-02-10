import wepy from "wepy"
export default class extends wepy.mixin{
    data={
        addressInfo:''
    }
    methods={
       async chooseAddr(){
            const res = await wepy.chooseAddress().catch(err=>err)
            console.log(res);
            
        }
    }
}