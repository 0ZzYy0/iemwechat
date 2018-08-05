// pages/home/home.js
const utils = require('/../../utils/util.js');
const app = getApp();
var server = app.globalData.server;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editable: false,
    checkedItem: false,
    earthquakes: [],
    name: "游客",
    items: [],
    itemsIndex: 0,
    earthquakeId: "",
    group: {}
  },


  editablechange: function() {
    this.setData({
      editable: !this.data.editable
    })
  },
  savegroup: function(e) {
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    let group = that.data.group;
    console.log(group)
    group.groupNumbering = e.detail.value.groupNumbering;
    group.isLeader = e.detail.value.isLeader;
    console.log(e.detail.value.isLeader);
    if (group.groupNumbering == "") {
      wx.showModal({
        title: '操作失败',
        content: '未填写小组编号',
      })
      return;
    }
    if (group.isLeader === "是" || group.isLeader === "否") {
      group.customerId = app.globalData.customer.id;
      group.earthquakeId = that.data.earthquakeId;
      group.name = app.globalData.customer.name;
      console.log(group);
      wx.request({
        method: "POST",
        url: server + "/group/join",
        data: group,
        header: {
          'content-type': 'application/json',
          'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
        },
        success: function(res) {
          console.log(res.data);
          that.setData({
            group: res.data,
            editable: !that.data.editable
          })
        },
        fail: function(res) {
          wx.showModal({
            title: '操作失败',
            content: '请检查网络或其他问题后重试',
          });
          wx.reLaunch({
            url: '/pages/home/home',
          })
        }
      })
    } else {
      group.isLeader = "";
      wx.showModal({
        title: '操作失败',
        content: '是否为组长只能填写是或否',
      })
      this.setData({
        group: group,

      })
      return;
    }


  },
  bindEQChange: function(e) {
    console.log('picker发生change事件，携带value值为：', e);
    let that = this;
    let items = that.data.items;

    let earthquakeId = items[e.detail.value].id;
    wx.setStorageSync('earthquake', items[e.detail.value])
    console.log(earthquakeId)
    that.setData({
      itemsIndex: e.detail.value,
      earthquakeId: earthquakeId,
    });

    wx.request({
      method: "GET",
      url: server + "/group/findbyeidandcustomerid",
      data: {
        customerId: app.globalData.customer.id,
        eid: earthquakeId
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      },
      success: function(res) {
        that.setData({
          group: res.data ? res.data : {}
        })
      },
      fail: function(res) {
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

  bindliedudiaocha: function() {
    var that = this;
    if (!that.data.earthquakeId) {
      wx.showModal({
        title: '操作失败',
        content: '请先选择地震信息',
      });
      return;
    }
    if (!that.data.group.id || !that.data.group.isLeader || !that.data.group.groupNumbering) {
      console.log(that.data.group)
      wx.showModal({
        title: '操作失败',
        content: '请先完善小组信息',
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/intensitysurvey/intensitysurvey?earthquakeId=' + that.data.earthquakeId,
    })
  },

  binddizhizaihaidiaocha: function(){
    var that = this;
    if (!that.data.earthquakeId) {
      wx.showModal({
        title: '操作失败',
        content: '请先选择地震信息',
      });
      return;
    }
    if (!that.data.group.id || !that.data.group.isLeader || !that.data.group.groupNumbering) {
      console.log(that.data.group)
      wx.showModal({
        title: '操作失败',
        content: '请先完善小组信息',
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/disasterSurvey/disasterSurvey?earthquakeId=' + that.data.earthquakeId,
    })

  },


  bindxinxigongxiang: function() {
    var that = this;
    if (!that.data.earthquakeId) {
      wx.showModal({
        title: '操作失败',
        content: '请先选择地震信息',
      });
      return;
    }
    if (!that.data.group.id || !that.data.group.isLeader || !that.data.group.groupNumbering) {
      console.log(that.data.group)
      wx.showModal({
        title: '操作失败',
        content: '请先完善小组信息',
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/shareinfo/shareinfo?earthquakeId=' + that.data.earthquakeId
    })
  },

  bindyinpingongneng: function() {
    var that = this;
    if (!that.data.earthquakeId) {
      wx.showModal({
        title: '操作失败',
        content: '请先选择地震信息',
      });
      return;
    }
    if (!that.data.group.id || !that.data.group.isLeader || !that.data.group.groupNumbering) {
      console.log(that.data.group)
      wx.showModal({
        title: '操作失败',
        content: '请先完善小组信息',
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/intensitysurvey/intensitysurvey?earthquakeId=' + that.data.earthquakeId
    })
  },

  bindanquanjianding: function() {
    var that = this;
    if (!that.data.earthquakeId) {
      wx.showModal({
        title: '操作失败',
        content: '请先选择地震信息',
      });
      return;
    }
    if (!that.data.group.id || !that.data.group.isLeader || !that.data.group.groupNumbering) {
      console.log(that.data.group)
      wx.showModal({
        title: '操作失败',
        content: '请先完善小组信息',
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/sfasslist/sfasslist?earthquakeId=' + that.data.earthquakeId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.getCustomerInfo().then(function(res) {
      console.log(res.data);
      if (res.data.customer.registered === 'no') {
        wx.redirectTo({
          url: '/pages/userinfo/userinfo',
        })
        return;
      }
      that.setData({
        name: res.data.customer.name
      })
      wx.request({
        method: "GET",
        url: server + "/earthquake/findallandgroup",
        data: {
          customerId: res.data.customer.id
        },
        header: {
          'content-type': 'application/json',
          'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
        },
        success: function(res) {
          let earthquakes = [];
          let items = res.data.earthquakes;
          console.log(res.data)
          items.reverse();
          items.forEach(function(n) {
            earthquakes.push(n.name)
          })
          that.setData({
            items: items,
            group: res.data.group,
            earthquakes: earthquakes,
            earthquakeId: items[0].id
          })
          wx.setStorageSync('earthquake', items[0]);

        },
        fail: function(res) {
          wx.showModal({
            title: '操作失败',
            content: '请检查网络或其他问题后重试',
          });
          wx.reLaunch({
            url: '/pages/home/home',
          })
        }
      })

    }, function(res) {
      console.log(res)
      wx.reLaunch({
        url: '/pages/home/home',
      })
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if (app.globalData.customer.name) {
      that.setData({
        name: app.globalData.customer.name
      })
      return;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})