
const utils = require('/../../utils/util.js');
const app = getApp();
const server = app.globalData.server;
// pages/partlevel2/partlevel2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    assessId: "",
    fid: "",
    parts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let that = this;
    if (!utils.checkSession()) {
      wx.navigateBack({

      })
      return;
    }
    wx.request({
      method: "GET",
      url: server + "/StructurePart/getSubPartByFid",
      data: {
        fid: options.fid
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          fid: options.fid,
          assessId: options.assessId,
          parts: res.data,
        })

      },
      fail: function (res) {
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        })
        wx.navigateBack({

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