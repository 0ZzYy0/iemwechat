var app = getApp();
var server = app.globalData.server;
var utils = require('../../utils/util.js')
Page({
  data: {
    name: "",
    department: "",
    discipline: "",
    email: "",
    phone: "",
    zipCode: "",
    profTitle: "",
    address: "",
    wordCount: 0,
    showTopTips: false,
    isAgree: true,
    customer: {}
  },
  bindZipCode: function (e) {
    this.setData({
      zipCode: e.detail.value
    })
  },
  bindPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindEmail: function (e) {
    this.setData({
      email: e.detail.value
    })
  },
  bindDiscipline: function (e) {
    this.setData({
      discipline: e.detail.value
    })
  },
  bindProfTitle: function (e) {
    this.setData({
      profTitle: e.detail.value
    })
  },
  bindName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindDepartment: function (e) {
    this.setData({
      department: e.detail.value
    })
  },

  bindAddress: function (e) {
    this.setData({
      address: e.detail.value,
      wordCount: e.detail.value.length
    })
  },

  onLoad: function (options) {

    let customer = app.globalData.customer;
    this.setData({
      customer: customer,
      phone: customer.phone,
      name: customer.name,
      email: customer.email,
      department: customer.department,
      discipline: customer.discipline,
      profTitle: customer.profTitle,
      address: customer.address,
      zipCode: customer.zipCode,
      wordCount: customer.address.length
    })

  },

  updateUserInfo: function () {
    let that = this;
    let customer = that.data.customer;

    customer.name = that.data.name;
    customer.phone = that.data.phone;
    customer.email = that.data.email;
    customer.department = that.data.department;
    customer.discipline = that.data.discipline;
    customer.profTitle = that.data.profTitle;
    customer.address = that.data.address;
    customer.zipCode = that.data.zipCode;
    customer.registered = "yes"

    if (utils.objHasNull(customer)) {

      that.setData({
        showTopTips: true
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      return;
    }
    
    wx.request({
      method: "POST",
      url: server + "/customer/update",
      data: customer,
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      }, success: function (res) {
        app.globalData.customer = res.data;
        wx.showToast({
          title: '保存成功！',
          icon: "success",
          duration: 2000,
          complete: function () {
            setTimeout(function () {
              wx.reLaunch({
                url: '/pages/home/home',
              })
            }, 2000)
          }
        })
      }
    })

  },

  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
    console.log(this.data.isAgree)
  }
});