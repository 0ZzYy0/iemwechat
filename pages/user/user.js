var app=getApp();
var server = getApp().globalData.server;
Page({
  data: {

   customer:{}
  },
  updateuserinfo: function () {
    wx.navigateTo({
      url: '/pages/userinfo/userinfo',
    })
  },
  getloginaccount:function(){
    wx.navigateTo({
      url: "/pages/user/account/account"
    })
  },
  onLoad: function () {
  
    this.setData({
      customer:app.globalData.customer
    })
  
  }
});
