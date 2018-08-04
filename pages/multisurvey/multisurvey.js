// pages/multisurvey/multisurvey.js
const utils = require('/../../utils/util.js');
const app = getApp();
const server = app.globalData.server;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    surveyUuid: null,
    survey: {},
    multiSurvey: {},
    partSurveyList: [],
    index: -1,
    structType: ['A1类：未经抗震设防的土木、砖木、石木等房屋', 'A2类：穿斗木构架房屋', 'B类：未经抗震设防的砖混结构房屋', 'C类：按照Ⅶ度抗震设防的砖混结构房屋', 'D类：按照Ⅶ度抗震设防的钢筋混凝土框架结构房屋'],
    structTypeIndex: 0,
  },
  formatMultiSurvey: function (multiSurvey) {
    let that = this;
    let structType = that.data.structType;
    let structTypeIndex = that.data.structTypeIndex;

    let partSurveyList = multiSurvey.partSurveyList || [];
    let newlist = [];
    for (var i = 0; i < structType.length; i++) {
      let partSurvey = partSurveyList[i] || {};
      partSurvey.name = partSurvey.name ? partSurvey.name : structType[i];
      partSurvey.index = i;

      newlist.push(partSurvey);

    }
    multiSurvey.partSurveyList = newlist;
    multiSurvey.uuid = multiSurvey.uuid ? multiSurvey.uuid : utils.UUID();
    multiSurvey.ownerId = multiSurvey.ownerId ? multiSurvey.ownerId : app.globalData.customer.id;
    multiSurvey.openId = multiSurvey.openId ? multiSurvey.openId : app.globalData.customer.openId;
    multiSurvey.surveyUuid = multiSurvey.surveyUuid ? multiSurvey.surveyUuid : that.data.surveyUuid;
    multiSurvey.earthquakeId = that.data.earthquakeId;
    return multiSurvey;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    let that = this;
    that.setData({
      surveyUuid: options.uuid,
      earthquakeId: options.earthquakeId
    })

    wx.request({
      method: "GET",
      url: server + "/multisurvey/getbysuidandoid",
      data: {
        ownerId: app.globalData.customer.id,
        surveyUuid: options.uuid
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      }, success: function (res) {
        console.log(res.data == "")
        let multiSurvey = res.data==""?{}:res.data;
        multiSurvey = that.formatMultiSurvey(multiSurvey);
        that.setData({
          multiSurvey: multiSurvey
        })

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

  bindBasic: function (e) {
    console.log(e);
    this.replaceContent(e, "basic");
  },
  bindLittle: function (e) {
    console.log(e);
    this.replaceContent(e, "little");
  },
  bindMiddle: function (e) {
    console.log(e);
    this.replaceContent(e, "middle");
  },
  bindSevere: function (e) {
    console.log(e);
    this.replaceContent(e, "severe");
  },
  bindDamage: function (e) {
    console.log(e);
    this.replaceContent(e, "damage");
  },

  replaceContent: function (event, key) {
    let that = this;

    let multiSurvey = that.data.multiSurvey;
    let index = event.currentTarget.dataset.multiindex;
    let value = event.detail.value;
    let partSurveyList = multiSurvey.partSurveyList;
    partSurveyList[index][key] = value;
    multiSurvey.partSurveyList = partSurveyList;

    that.setData({
      multiSurvey: multiSurvey
    })
    that.calculateArea(index);

  },
  calculateArea: function (index) {
    let that = this;

    let multiSurvey = that.data.multiSurvey;
    let partSurvey = multiSurvey.partSurveyList[index];

    let sum = 0;

    if (partSurvey.basic) { sum += parseFloat(partSurvey.basic) }
    if (partSurvey.little) { sum += parseFloat(partSurvey.little) }
    if (partSurvey.middle) { sum += parseFloat(partSurvey.middle) }
    if (partSurvey.severe) { sum += parseFloat(partSurvey.severe) }
    if (partSurvey.damage) { sum += parseFloat(partSurvey.damage) }


    partSurvey.area = parseFloat(sum).toFixed(2);
    let flag = false;
    if (partSurvey.basic && partSurvey.little && partSurvey.middle && partSurvey.severe && partSurvey.damage) {
      let factor = (0 * parseFloat(partSurvey.basic) + 0.2 * parseFloat(partSurvey.little) + 0.4 * parseFloat(partSurvey.middle) + 0.7 * parseFloat(partSurvey.severe) + 1 * parseFloat(partSurvey.damage)) / sum;
      partSurvey.factor = parseFloat(factor).toFixed(2);
      flag = true;
    }


    multiSurvey.partSurveyList[index] = partSurvey;


    that.setData({
      multiSurvey: multiSurvey
    })

    if (flag) {
      that.saveAll()
    }

  },
  saveAll: function () {
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    if (!that.data.multiSurvey.uuid) {
      // wx.showModal({
      //   title: '操作失败',
      //   content: '没有添加调查点',
      // })
      return;
    }
    wx.request({
      method: "POST",
      url: server + "/multisurvey/insertone",
      data: that.data.multiSurvey,
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      }, success: function (res) {
        console.log(res);
        console.log("save", that.data.multiSurvey);
        that.setData({
          multiSurvey: that.formatMultiSurvey(res.data)
        })
        wx.showToast({
          title: '保存成功！',
          icon: "success",
          duration: 2000,
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        })
      }
    })
  },

})