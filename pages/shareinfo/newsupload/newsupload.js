// pages/shareinfo/newsupload/newsupload.js
const utils = require('/../../../utils/util.js');
const app = getApp();
var server = app.globalData.server;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeIndex:0,
    newTypes: app.globalData.infoTypeList,
    news:{},
  },

  getNewsTypeIndex:function(newsType){
    let newTypes = this.data.newTypes;
    for(let i=0;i<newTypes.length;i++){
      if (newTypes[i] === newsType) return i;
    }
    return -1;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    let news= wx.getStorageSync('news')||{};
     if(news.address){
       let typeIndex = that.getNewsTypeIndex(news.newsType);
       that.setData({
         news:news,
         typeIndex: typeIndex
       })
     }else{
        wx.chooseLocation({
          success: function(res) {
            news.address=res.address+" "+res.name;
            news.lat=res.latitude;
            news.lng=res.longitude;
            news.authorName=app.globalData.customer.name;
            news.authorDepartment = app.globalData.customer.department;
            news.authorId = app.globalData.customer.id;
            news.authorGroup = wx.getStorageSync('group').groupNumbering;
            news.dateTime = utils.formatTime(new Date());
            news.newsType = that.data.newTypes[0];
            news.newsCategory="NORMAL";
            news.earthquakeId = wx.getStorageSync('earthquake').id;
            news.newsTitle="";
            news.newsContent= "";
            that.setData({
              news: news
            })
          },
          fail:function(){
            wx.showModal({
              title: '操作失败',
              content: '未选择相关地点',
            });
            wx.navigateBack({
              
            })
          }
        })
     }
  },
  bindtypeChange:function(e){
    console.log(e);
    let v=e.detail.value;
    let news=this.data.news;
    let newsType = this.data.newTypes[v];
    news.newsType = newsType;
    this.setData({
      news:news,
      typeIndex:v
    })
  },
save:function(){
  wx.setStorageSync('news', this.data.news)
},
  bindnewsContent:function(e){
    let v=e.detail.value;
    this.replacontent('newsContent',v)
  },
  binddateTime: function (e) {
    let v = e.detail.value;
    this.replacontent('dateTime', v)
  },
  bindnewsTitle: function (e) {
    let v = e.detail.value;
    this.replacontent('newsTitle', v)
  },
  bindauthorGroup: function (e) {
    let v = e.detail.value;
    this.replacontent('authorGroup', v)
  },
  bindauthordepartment: function (e) {
    let v = e.detail.value;
    this.replacontent('authorDepartment', v)
  },
  bindauthorname: function (e) {
    let v = e.detail.value;
    this.replacontent('authorName', v)
  },

  bindLat: function (e) {
    let v = e.detail.value;
    this.replacontent('lat', v)
  },
  bindLng: function (e) {
    let v = e.detail.value;
    this.replacontent('lng', v)
  },
  bindaddress: function (e) {
    let v = e.detail.value;
    this.replacontent('address', v)
  },

replacontent:function(keyword,value){
  let news=this.data.news;
  news[keyword]=value;
  this.setData({
    news:news
  })
},
clear: function () { 
  wx.setStorageSync('news', null);
  this.setData({
    news:{},
    typeIndex:0
  })
  wx.navigateBack({
    
  })
},
upload:function(){
  if (!utils.checkSession()) {
    return;
  }

  let that=this;
  let news=that.data.news;

  console.log(news);
  if (utils.objHasNull(news)){
    wx.showModal({
      title: '操作失败',
      content: '存在未填写项',
    })
    return;
  }

  wx.request({
    method: "POST",
    url: server + "/news/add",
    data: news,
    header: {
      'content-type': 'application/json',
      'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
    }, success: function (res) {

      console.log(res.data);
      if(res.data.id){
        wx.showToast({
          title: '发布成功',
        })
        that.clear();
      }else{
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        });
      }
     
      
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