import wepy from 'wepy';
const baseUrl = 'https://www.zhengzhicheng.cn/api/public/v1';

wepy.baseToast = function(str = '获取数据失败') {
  return wepy.showToast({
    title: str,
    icon: 'success',
    duration: 1500
  });
};

wepy.get = function(url,data = {}) {
 return wepy.request({
    url: baseUrl + url,
    method: 'GET',
    data
  });
};

wepy.post = function(url,data = {}) {
    return wepy.request({
       url: baseUrl + url,
       method: 'POST',
       data
     });
   };
   