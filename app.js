//app.js
//var server = "http://47.105.56.124";
var server = "http://localhost"
App({
  onLaunch: function () {
    var that=this;
  },
  getCustomerInfo:function(){
    var that = this;
    
    return new Promise(function (resolve, reject) {
      // 调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            that.globalData.code = res.code;
            //调用登录接口
            wx.request({
              url: server + '/customer/login',
              method: 'POST',
              data: {
                code: res.code
              }, header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (response) {
                console.log("login", new Date());
                wx.setStorageSync('JSESSIONID', response.data.sessionId);
                wx.setStorageSync('customer', response.data.customer);
                that.globalData.sessiontime=new Date().getTime();
                that.globalData.customer = response.data.customer;
                that.globalData.JSESSIONID = response.data.sessionId;
                resolve(response)
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg);
            var res = {
              status: 300,
              data: '错误'
            }
            reject('error');
          }
        }
      })
    });
  },

  globalData: {
    userInfo: null,
    customer:{},
    JSESSIONID:null,
    sessiontime:null,
    infoTypeList: ["食宿", "交通", "伤亡", "指挥部信息", "其他"],
    //server:"http://47.105.56.124"
     server:"http://localhost"
  }
})