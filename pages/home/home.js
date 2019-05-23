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
    group: {},

    isLeader:'',
    isLeaderIndex:0,
    isLeaderRange:['是','否']
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
    group.groupNumbering = e.detail.value.groupNumbering;
    if (group.groupNumbering == "") {
      wx.showModal({
        title: '操作失败',
        content: '未填写小组编号',
      })
      return;
    }
    if (!(group.isLeader === "是") && !(group.isLeader === "否")) {
      group.isLeader = "是";
    }
    if (group.isLeader === "是" || group.isLeader === "否") {
      group.customerId = app.globalData.customer.id;
      group.earthquakeId = that.data.earthquakeId;
      group.name = app.globalData.customer.name;
      wx.request({
        method: "POST",
        url: server + "/group/join",
        data: group,
        header: {
          'content-type': 'application/json',
          'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
        },
        success: function(res) {
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
  bindIsLeaderhange:function(e){
    let that = this;
    let isLeader = that.data.isLeader;
    let isLeaderIndex = that.data.isLeaderIndex;
    let isLeaderRange = that.data.isLeaderRange;
    isLeader = isLeaderRange[e.detail.value];
    let cxtgroup = that.data.group;
    cxtgroup.isLeader = isLeader;

    that.setData({
      isLeaderIndex: e.detail.value,
      isLeader: isLeader,
      group: cxtgroup
    });
  },
  bindEQChange: function(e) {

    var that = this;
    let items = that.data.items;

    let earthquakeId = items[e.detail.value].id;
    wx.setStorageSync('earthquake', items[e.detail.value])

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
        let isLeader = "";
        let isLeaderIndex;
        if (res.data.isLeader == "是"){
          isLeader = "是";
          isLeaderIndex = 0;
        }else{
          isLeader = "否";
          isLeaderIndex = 1;
        }

        that.setData({
          isLeader: isLeader,
          isLeaderIndex: isLeaderIndex
        })
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

    wx.getSetting({ //检查已经有了的权限
      success: (response) => {
        console.log(response)
        if (!response.authSetting['scope.userLocation']) {//对比需要的权限
          console.log('123');
          wx.authorize({
            scope: 'scope.userLocation',//弹出  授权提示
            success: () => {
              console.log('yes')
            }
          })
        }
      }
    })

    var that = this;
    if (!that.data.earthquakeId) {
      wx.showModal({
        title: '操作失败',
        content: '请先选择地震信息',
      });
      return;
    }
    if (!that.data.group.id || !that.data.group.isLeader || !that.data.group.groupNumbering) {

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

  //生命线调查
  bindshengmingxian: function () {
    var that = this;
    if (!that.data.earthquakeId) {
      wx.showModal({
        title: '操作失败',
        content: '请先选择地震信息',
      });
      return;
    }
    if (!that.data.group.id || !that.data.group.isLeader || !that.data.group.groupNumbering) {
      wx.showModal({
        title: '操作失败',
        content: '请先完善小组信息',
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/lifelineSurvey/lifelineSurvey?earthquakeId=' + that.data.earthquakeId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {



    console.log("11111111a");





    var that = this;
    app.getCustomerInfo().then(function(res) {

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

          items.reverse();
          items.forEach(function(n) {
            earthquakes.push(n.name)
          })

          let isLeader = that.data.isLeader;
          let isLeaderRange = that.data.isLeaderRange;
          let isLeaderIndex = that.data.isLeaderIndex;


          for (var j = 0; j < isLeaderRange.length; j++) {
            if (res.data.group.isLeader === isLeaderRange[j]) {
              isLeader = res.data.group.isLeader;
              isLeaderIndex = j;
              that.setData({
                isLeader: isLeader,
                isLeaderIndex: isLeaderIndex
              })
            }
          }

          
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