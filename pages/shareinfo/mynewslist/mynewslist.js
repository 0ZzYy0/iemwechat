const utils = require('/../../../utils/util.js');
const app = getApp();
var server = app.globalData.server;
Page({
  data: {
    navLeftIndex: 0,
    pageNumber: 0,
    navLeftItems: app.globalData.infoTypeList,
    navRightItems: [],
    curLeftItem: 1,
    curIndex: 0
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let category = options.category;
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    wx.request({
      method: "GET",
      url: server + "/news/getByCategory",
      data: {
        category: category,
        pageNumber: that.data.pageNumber,
        earthquakeId: wx.getStorageSync('earthquake').id,
        authorId: app.globalData.customer.id,
        newsType: that.data.navLeftItems[that.data.navLeftIndex]
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      }, success: function (res) {
        console.log(res.data)
        that.setData({
          category: category,
          navRightItems: res.data,
          pageNumber: that.data.pageNumber + 1
        })
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
  },
  //事件处理函数
  switchLeftTab: function (e) {
    console.log(e)
    let index = parseInt(e.target.dataset.index);
    let item = e.target.dataset.item;
    console.log(item)
    this.setData({
      navLeftIndex:index,
    })
    if (!utils.checkSession()) {
      return;
    }
    
    let that = this;
    wx.request({
      method: "GET",
      url: server + "/news/getByCategory",
      data: {
        category: that.data.category,
        pageNumber: 0,
        earthquakeId: wx.getStorageSync('earthquake').id,
        authorId: app.globalData.customer.id,
        newsType: item
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      }, success: function (res) {
        console.log(res.data)
        that.setData({
    
          navRightItems: res.data,
          pageNumber: 1
        })
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
  },
  scrolllower:function(){
    this.getmorenewslist();
  },
  getmorenewslist: function (){
    wx.showToast({
      title: '加载更多',
      icon:"loading",
      duration:500
    })
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    wx.request({
      method: "GET",
      url: server + "/news/getByCategory",
      data: {
        category: that.data.category,
        pageNumber: that.data.pageNumber,
        earthquakeId: wx.getStorageSync('earthquake').id,
        authorId: app.globalData.customer.id,
        newsType: that.data.navLeftItems[that.data.navLeftIndex]
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      }, success: function (res) {
        console.log(res.data)
        if (res.data.length == 0) {
          wx.showToast({
            title: '已加载全部',
            icon: "success",
            duration: 1000
          })
          return;
        }
        let navRightItems = that.data.navRightItems;
        let items = navRightItems.concat(res.data);
        console.log(items)
        that.setData({
          navRightItems: items,
          pageNumber: that.data.pageNumber + 1
        })
       
       
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
  },
  

})