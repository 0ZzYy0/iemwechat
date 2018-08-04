// pages/user/account/account.js
const utils = require('/../../../utils/util.js');
const app = getApp();
const server = app.globalData.server;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAccount: "123",
    password: "123456"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!utils.checkSession()) {
      return;
    }
let that=this;
    wx.request({
      method: "POST",
      url: server + "/account/create",
      data: {
        id:app.globalData.customer.id,
        timestamp:new Date().getTime()
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      }, success: function (res) {
console.log(res.data);
that.setData({
  userAccount: res.data.loginAccount,
  password: res.data.loginPassword
})
        
      }, fail: function (res) {
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})