// pages/mapinfo/mapinfo.js
const utils = require('/../../utils/util.js');
const app = getApp();
const server = app.globalData.server;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    earthquake: {},
    markers: [],
    newTypes: app.globalData.infoTypeList,
    tabs: ["调查点烈度", "预估烈度图"].concat(app.globalData.infoTypeList),
    activeIndex: 0,
    icons: ["gp_location.png", "", "food.png", "transport.png", "hurtor.png", "commandcenter.png", "other.png"]
  },
  markertap:function(e){
    let id=e.markerId;
    if(id>=0){
      let mks = this.data.markers;
      let mk = mks[id+1];
      if(mk.typ==='news'){
        wx.navigateTo({
          url: "/pages/shareinfo/newsdetail/newsdetail?id=" + mk.nid
        })
      }
    }
  },
 
  onShow: function (options) {
    if (!utils.checkSession()) {
      return;
    }
    let eq = wx.getStorageSync('earthquake');
    let earthquake = this.data.earthquake;
    if(earthquake.name!==eq.name){
     let markers=[];
      earthquake.id = -1;
      earthquake.eid=eq.id;
      earthquake.latitude = eq.lat;
      earthquake.longitude = eq.lng;
      earthquake.title = eq.name;
      earthquake.name = eq.name;
      earthquake.iconPath = "/images/eqcenter.png";
      earthquake.width = 32;
      earthquake.height = 32;
      let callout = {};
      callout.content = eq.name;
      callout.display = "ALWAYS";
      callout.textAlign = "center";
      earthquake.callout = callout;
      console.log(earthquake);
      markers.push(earthquake);
      this.setData({
        earthquake:earthquake,
        activeIndex: 0,
        markers:[]
      })
      this.getSurveyIntensityByEQ(earthquake,0);
    }
  },
  getSurveyIntensityByEQ: function (earthquake, index){
    console.log(earthquake);
    let that = this;
    wx.request({
      method: "GET",
      url: server + "/intensitysurvey/getByEidForMap",
      data: {
        eid: earthquake.eid
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      }, success: function (res) {
        console.log(res.data)
        that.formatMarkers(res.data, index,"intensity");
      }, fail: function (res) {
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        });

      }
    })
  },
  tabClick: function (e) {
    let that=this;
    let index = e.currentTarget.id;
    let eid = wx.getStorageSync('earthquake').id;
    that.setData({
      activeIndex: index
    });
  
    if (index == 0) {
      that.getSurveyIntensityByEQ(that.data.earthquake, index);
    }
    if (index == 1) {
      let markers = [];
      markers.push(that.data.earthquake);
      that.setData({
        markers: markers
      })
  
      console.log(index)
    }
    if (index >= 2) {
      let tp = that.data.tabs[index];

      that.getByTypeAndEid(tp, eid, index);

    }
  },
  getByTypeAndEid: function (newsType, eid, index) {
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    wx.request({
      method: "GET",
      url: server + "/news/getByEIdAndType",
      data: {
        newsType: newsType,
        eid: eid
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      }, success: function (res) {
        console.log(res.data)

        that.formatMarkers(res.data, index,"news");

      }, fail: function (res) {
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        });

      }
    })
  },
  formatMarkers: function (resList, index,markerType) {
    let icons = this.data.icons;
    let icon = icons[index];

    let markers = [];
    markers.push(this.data.earthquake)
    resList.forEach(function (item, idx) {
      let mk = {};
      mk.id = idx;
      mk.latitude = item.lat;
      mk.longitude = item.lng;
      mk.title = item.newsTitle;
      mk.iconPath = "/images/" + icon;
      mk.nid=item.id;
      mk.typ = markerType;
      mk.width = 32;
      mk.height =32;
      let callout = {};
      if (markerType==='news'){
        callout.content = item.newsTitle;
      }
      if (markerType === 'intensity') {
        callout.content = item.intensity;
      }
      callout.display = "ALWAYS";
      callout.textAlign = "center";
      mk.callout = callout;
      console.log(mk);
      markers.push(mk)
    })
    this.setData({
      markers: markers
    })
  }

})