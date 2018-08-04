// pages/sfasslist/sfasslist.js
const utils = require('/../../utils/util.js');
const app = getApp();
var server = app.globalData.server;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sfasslist: [],
  },
  doAssess:function(e){
    console.log(e);
    let eid = this.data.earthquakeId;
    let uuid=e.currentTarget.dataset.uuid;
    wx.navigateTo({
      url: '/pages/sfassmain/sfassmain?uuid=' + uuid + '&earthquakeId=' + eid,
    })
  },
  add:function(){
    let eid=this.data.earthquakeId;
    wx.navigateTo({
      url: '/pages/sfassmain/sfassmain?earthquakeId=' + eid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    let that = this;
    if (!utils.checkSession()) {
      wx.navigateBack({

      });
      return;
    }

    wx.request({
      method: "GET",
      url: server + "/safetyassess/getbyowneridandeid",
      data: {
        ownerId: app.globalData.customer.id,
        earthquakeId: options.earthquakeId
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      }, success: function (res) {
        console.log(res);
        that.setData({
          sfasslist: res.data,
          earthquakeId: options.earthquakeId
        })
        console.log(that.data.earthquakeId,that.data.sfasslist);
      }, fail: function (res) {
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        });
        wx.navigateBack({

        })
      }
    })

  },

  remove: function (e) {
    let that = this;
    wx.showModal({
      title: '删除操作',
      content: '点击确定后删除',
      success:function(res){
        if(res.confirm){
          console.log(e);
          let index = e.currentTarget.dataset.index;
     
          if (!utils.checkSession()) {
            wx.navigateBack({

            });
            return;
          }

          let list = that.data.sfasslist;
          var temp = list.splice(index, 1)[0];
          console.log(temp.uuid)
          wx.request({
            method: "POST",
            url: server + "/safetyassess/delbyid",
            data: {
              id: temp.id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
            }, success: function (res) {
              that.setData({
                sfasslist: list
              })
              console.log(that.data.sfasslist);
              console.log(res)
            }, fail: function (res) {
              wx.showModal({
                title: '操作失败',
                content: '请检查网络或其他问题后重试',
              });
            }
          })
        }
      }
    })
    
  }

})