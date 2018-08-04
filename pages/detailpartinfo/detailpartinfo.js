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
    partId: "",
    detailPartInfo: {},
    damages: [],

    numbers: ["个别", "少数", "多数"],
    degrees: ["轻微", "中等", "严重"],
    describe: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    let that = this;
    if (!utils.checkSession()) {
      wx.navigateBack({

      })
      return;
    }
    wx.request({
      method: "GET",
      url: server + "/DetailPartInfo/getByAssessIdAndPartId",
      data: {
        partId: options.partId,
        assessId: options.assessId
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      },
      success: function(res) {
        console.log(res.data)
        let damages = res.data.damages;
        let damage = {};
        damage.number = "";
        damage.degree = "";
        damage.describe = "";
        if (damages.length == 0) {
          damages.push(damage);
        }
        that.setData({
          partId: options.partId,
          assessId: options.assessId,
          detailPartInfo: res.data,
          damages: damages
        })

      },
      fail: function(res) {
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        })
        wx.navigateBack({

        })
      }
    })
  },
  bindDescribe: function(e) {
    console.log(e);
    let damages = this.data.damages;
    let index = e.currentTarget.dataset.idx;
    damages[index].describe = e.detail.value;
    let detailPartInfo = this.data.detailPartInfo;
    detailPartInfo.damages = damages;
    this.setData({
      damages: damages,
      detailPartInfo: detailPartInfo
    })
  },
  bindDegreeChange: function(e) {
    console.log(e);
    let damages = this.data.damages;
    let index = e.currentTarget.dataset.idx;
    damages[index].degree = e.detail.value;
    let detailPartInfo = this.data.detailPartInfo;
    detailPartInfo.damages = damages;
    this.setData({
      damages: damages,
      detailPartInfo: detailPartInfo
    })
  },
  bindNumberChange: function(e) {
    console.log(e);
    let damages = this.data.damages;
    let index = e.currentTarget.dataset.idx;
    damages[index].number = e.detail.value;
    let detailPartInfo = this.data.detailPartInfo;
    detailPartInfo.damages = damages;
    this.setData({
      damages: damages,
      detailPartInfo: detailPartInfo
    })

  },
  addDamage: function() {
    let damages = this.data.damages;
    let damage = {};
    damage.number = "";
    damage.degree = "";
    damage.describe = "";
    damages.push(damage);
    let detailPartInfo = this.data.detailPartInfo;
    detailPartInfo.damages = damages;
    this.setData({
      detailPartInfo: detailPartInfo,
      damages: damages
    })

  },
  remove :function(e){
    let that=this;
    let damages = this.data.damages;
    let index = e.currentTarget.dataset.idx;
     damages.splice(index,1);
    let detailPartInfo = this.data.detailPartInfo;
    detailPartInfo.damages = damages;
    this.setData({
      detailPartInfo: detailPartInfo,
      damages: damages
    })

  },
  bindRadioChange: function(e) {
    let that = this;
    let detailPartInfo = that.data.detailPartInfo;
    detailPartInfo.damaged = !detailPartInfo.damaged;
    console.log(this.data.detailPartInfo)
    that.setData({
      detailPartInfo: detailPartInfo
    })
    that.saveAll();
  },
  saveAll: function() {
    let that = this;
    let detailPartInfo = that.data.detailPartInfo;
    detailPartInfo.customerId = app.globalData.customer.id;
    wx.request({
      method: "POST",
      url: server + "/DetailPartInfo/save",
      data: detailPartInfo,
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      },
      success: function(res) {
        that.setData({
          detailPartInfo: res.data
        })
        wx.showToast({
          title: '保存成功',
          icon: "success",
          duration: 500
        })
      },
      fail: function(res) {
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        })
      }
    })
  }
})