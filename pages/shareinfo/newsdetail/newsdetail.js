// pages/shareinfo/newsdetail/newsdetail.js
const utils = require('/../../../utils/util.js');
const app = getApp();
var server = app.globalData.server;
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newscontent:"",
    news:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  console.log(options);

  if (!utils.checkSession()) {
    return;
  }
  let that = this;
  wx.request({
    method: "GET",
    url: server + "/news/getById",
    data: {
      id: options.id
    },
    header: {
      'content-type': 'application/json',
      'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
    }, success: function (res) {
      console.log(res.data)
      that.setData({
        news:res.data,
        newscontent:res.data.newsContent
      });
      WxParse.wxParse('newsContent', 'html', res.data.newsContent, that, 5);
    }, fail: function (res) {
      wx.showModal({
        title: '操作失败',
        content: '请检查网络或其他问题后重试',
      });
      wx.reLaunch({
        url: '/pages/home/home',
      })
    }
  })
  }
})