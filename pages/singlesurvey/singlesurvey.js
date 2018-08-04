// pages/singlesurvey/singlesurvey.js
const recorderManager = wx.getRecorderManager()

recorderManager.onStart(() => {
  console.log('recorder start')
})
recorderManager.onPause(() => {
  console.log('recorder pause')
})

recorderManager.onFrameRecorded((res) => {
  const { frameBuffer } = res
  console.log('frameBuffer.byteLength', frameBuffer.byteLength)
})

const options = {
  duration: 600000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}
const utils = require('/../../utils/util.js');
const app = getApp();
const server = app.globalData.server;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    earthquakeId:"",
    author: "",
    surveyIndex: -1,
    surveyuuid: -1,
    isRecoding: false,
    area: "",
    areaType: "",
    singleSurvey: {},
    singleSurveyList: [],
    survey: {},
    images: [],
    videos: [],
    audios: [],
    fileType: "image",
    structType: ['多层砌体房屋', '多层和高层钢筋混凝土房屋', '底层框架房屋', '内框架房屋', '单层钢筋混凝土柱厂房', '单层砖柱厂房和空旷厂房', '木结构房屋', '土石墙房屋', '空间钢结构'],
    structTypeIndex: 0,
    usage: ['住宅（公寓、居民楼等）', '政府（政府机关、科研院所等）', '商业（商场、酒店等）', '站点（机场、火车站等）', '工业厂房（重、轻工业厂房等）', '公共集会场所（体育馆、影剧院等）', '医疗卫生系统（医院、诊所等）', '生命线（生命线系统结构）', '文化教育系统（学校等）', '其它（物资储存设施等）'],
    usageIndex: 0,
    damage: ['完好','毁坏', '严重', '中等', '轻微'],
    damageIndex: 0,
    kangZhen: ['6度', '7度', '8度', '9度', '采用非正规抗震措施（民居、自建房等）'],
    kangZhenIndex: 0,
    flattenedForms: ['矩形','L型','凹型','其他'],
    flattenedFormIndex:0
  },


  chooseImage: function (e) {
    console.log(e)
    let that = this;
    let singleIndex = e.currentTarget.dataset.singleindex;
    let singleSurveyList = that.data.singleSurveyList;
    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        wx.uploadFile({
          url: server + '/fileentity/upload',
          header: {
            'content-type': 'multipart/form-data',
            'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
          },
          formData: {
            'id': app.globalData.customer.id,
            'eqId': wx.getStorageSync("earthquake").id,
            'usage': "单体调查",
            "typeId": 1
          },
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function (res) {
            let fileData = JSON.parse(res.data);
            if (fileData.errorMsg !== 'ok') {
              wx.showModal({
                title: '操作失败',
                content: '请检查网络或其他因素',
              })
              return;
            }
            let imageList = singleSurveyList[singleIndex].imageList || [];
            singleSurveyList[singleIndex].imageList = imageList.concat(fileData.data);
            singleSurveyList[singleIndex].images = singleSurveyList[singleIndex].images.concat(server + fileData.data.uri)

            that.setData({
              singleSurveyList: singleSurveyList
            });
            that.saveAll();
          }
        })

      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },
  chooseVideo: function (e) {
    console.log(e)
    let that = this;
    let singleIndex = e.currentTarget.dataset.singleindex;
    let singleSurveyList = that.data.singleSurveyList;
    wx.chooseVideo({
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      maxDuration: 30,
      camera: 'back',
      success: function (res) {
        console.log(res);
        if (res.size > 5000000) {
          wx.showModal({
            title: '操作失败',
            content: '所选视频太大，限制5MB以内。',
          })
          return;
        }
        wx.uploadFile({
          url: server + '/fileentity/upload',
          header: {
            'content-type': 'multipart/form-data',
            'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
          },
          formData: {
            'id': app.globalData.customer.id,
            'eqId': wx.getStorageSync("earthquake").id,
            'usage': "单体调查",
            "typeId": 2
          },
          filePath: res.tempFilePath,
          name: 'file',
          success: function (res) {

            let fileData = JSON.parse(res.data);
            if (fileData.errorMsg !== 'ok') {
              wx.showModal({
                title: '操作失败',
                content: '请检查网络或其他因素',
              })
              return;
            }
            let videoList = singleSurveyList[singleIndex].videoList || [];
            singleSurveyList[singleIndex].videoList = videoList.concat(fileData.data);
            singleSurveyList[singleIndex].videos = singleSurveyList[singleIndex].videos.concat(server + fileData.data.uri);

            that.setData({
              singleSurveyList: singleSurveyList
            });
            that.saveAll();
          }
        })

      }
    })
  },
  chooseAudio: function (e) {
    recorderManager.start(options);
    console.log(e)
    let that = this;
    let singleIndex = e.currentTarget.dataset.singleindex;
    let singleSurveyList = that.data.singleSurveyList;
    let index = e.currentTarget.dataset.index;
    singleSurveyList[singleIndex].isRecoding = !singleSurveyList[singleIndex].isRecoding;
    that.setData({
      singleSurveyList: singleSurveyList
    })

  },
  stopAudio: function (e) {
    recorderManager.stop();
    console.log(e)
    let that = this;
    let singleIndex = e.currentTarget.dataset.singleindex;
    let singleSurveyList = that.data.singleSurveyList;
    let index = e.currentTarget.dataset.index;
    singleSurveyList[singleIndex].isRecoding = !singleSurveyList[singleIndex].isRecoding;
    recorderManager.onStop((res) => {
      wx.uploadFile({
        url: server + '/fileentity/upload',
        header: {
          'content-type': 'multipart/form-data',
          'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
        },
        formData: {
          'id': app.globalData.customer.id,
          'eqId': wx.getStorageSync("earthquake").id,
          'usage': "单体调查",
          "typeId":3
        },
        filePath: res.tempFilePath,
        name: 'file',
        success: function (res) {
          let fileData = JSON.parse(res.data);
          if (fileData.errorMsg !== 'ok') {
            wx.showModal({
              title: '操作失败',
              content: '请检查网络或其他因素',
            })
            return;
          }
          let audioList = singleSurveyList[singleIndex].audioList || [];
          singleSurveyList[singleIndex].audioList = audioList.concat(fileData.data);
          singleSurveyList[singleIndex].audios = singleSurveyList[singleIndex].audios.concat(server + fileData.data.uri)
          that.setData({
            singleSurveyList: singleSurveyList
          });
          that.saveAll();
          wx.showToast({
            title: '上传成功',
            icon: "success",
            duration: 1500
          })
        }
      })


    })


  },
  delData: function (e) {
    console.log(e)
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    let singleIndex = e.currentTarget.dataset.singleindex;
    let singleSurveyList = that.data.singleSurveyList;
    let index = e.currentTarget.dataset.index;
    let target = e.currentTarget.dataset.target;
    wx.showModal({
      title: '删除此文件？',
      content: '点击确定删除此文件',
      success: function (me) {
        console.log(me);
        if (me.confirm) {

          let targetList = target.substring(0, target.length - 1) + "List";

          wx.request({
            method: "POST",
            url: server + "/fileentity/delbyid" ,
            data:{
              id: singleSurveyList[singleIndex][targetList][index].id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
            }, success: function (res) {

              let datas = singleSurveyList[singleIndex][target];
              datas.splice(index, 1);
              singleSurveyList[singleIndex][target] = datas;
              let dataList = singleSurveyList[singleIndex][targetList];
              dataList.splice(index, 1);
              singleSurveyList[singleIndex][targetList] = dataList;
              singleSurveyList = that.formatSingleSurveyList(singleSurveyList)
              that.setData({
                singleSurveyList: singleSurveyList
              })
              that.saveAll();
              wx.showToast({
                title: '删除成功！',
                icon: "success",
                duration: 2000,
              })
            }, fail: function (res) {
              wx.showModal({
                title: '操作失败',
                content: '请检查网络或其他问题后重试',
              })
            }
          })

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    let that = this;

    let singleSurveyList =  []
    if (singleSurveyList.length === 0) {
      if (!utils.checkSession()) {
        wx.navigateBack({

        })
        return;
      }
      wx.request({
        method: "GET",
        url: server + "/singlesurvey/getbysurveyuuid",
        data: {
          surveyUuid: options.uuid,
          ownerId: app.globalData.customer.id
        },
        header: {
          'content-type': 'application/json',
          'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
        }, success: function (res) {
          console.log(res)
          singleSurveyList = that.formatSingleSurveyList(res.data);
          console.log(singleSurveyList)
          that.setData({
            singleSurveyList: singleSurveyList,
            earthquakeId: options.earthquakeId,
           surveyUuid :options.uuid
          
          })
          
        }, fail: function (res) {
          wx.showModal({
            title: '操作失败',
            content: '请检查网络或其他问题后重试',
          })
          wx.navigateBack({

          })
        }
      })
    } else {
      singleSurveyList = that.formatSingleSurveyList(singleSurveyList);
      that.setData({
        singleSurveyList: singleSurveyList
      })
      
    }
  },


  removeSurvey: function (event) {
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    wx.showModal({
      title: '移除调查点',
      content: '点击确定移除本调查点（请谨慎操作）！',
      success: function (modalevent) {
        if (modalevent.confirm) {

          let singleIndex = event.currentTarget.dataset.singleindex;
          let singleSurveyList = that.data.singleSurveyList;
          let spliceSingleSurveys = singleSurveyList.splice(singleIndex, 1);
          for (let i = 0; i < singleSurveyList.length; i++) {
            singleSurveyList[i].index = i;
            singleSurveyList[i].removeWord = "";
          }
          if (spliceSingleSurveys[0].id) {

            wx.request({
              method: "POST",
              url: server + "/singlesurvey/delbyid",
              data:{
                id:spliceSingleSurveys[0].id
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
              }, success: function (res) {
                wx.showToast({
                  title: '删除成功！',
                  icon: "success",
                  duration: 2000,
                })
              }, fail: function (res) {
                wx.showModal({
                  title: '操作失败',
                  content: '请检查网络或其他问题后重试',
                })
              }
            })
          }
          that.setData({
            singleSurveyList: singleSurveyList
          })
       
          console.log(singleSurveyList)
        }
      }
    })
  },


  saveAll: function (e) {
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    if (that.data.singleSurveyList.length === 0) {
      // wx.showModal({
      //   title: '操作失败',
      //   content: '没有添加调查点',
      // })
      return;
    }
    let sslist = that.data.singleSurveyList;

    for (let i in sslist) {

      if (sslist[i].name === "") {
        if (e) {
          wx.showModal({
            title: '保存失败',
            content: '存在未填写的调查名称，请填写后重新操作。',
          })
          return;
        }
      }
    }

    wx.request({
      method: "POST",
      url: server + "/singlesurvey/saveall",
      data: that.data.singleSurveyList,
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      }, success: function (res) {
        let singleSurveyList = res.data;
        singleSurveyList = that.formatSingleSurveyList(singleSurveyList);
        that.setData({
          singleSurveyList: singleSurveyList
        })

        console.log("saveAll", that.data.singleSurveyList);
        if (e) {
          wx.showToast({
            title: '保存成功！',
            icon: "success",
            duration: 2000,
          })
        }

      },
      fail: function (res) {
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        })
      }
    })
  },

  addsurvey: function () {
    let that = this;
    let singleSurvey = {};

    let dateTime = utils.formatTime(new Date());

    let singleSurveyList = that.data.singleSurveyList || [];
   
    singleSurvey.surveyUuid = that.data.surveyUuid;
    singleSurvey.earthquakeId = that.data.earthquakeId;
    singleSurvey.ownerId = app.globalData.customer.id;
    singleSurvey.openId = app.globalData.customer.openId;
    singleSurvey.uuid = utils.UUID();
    singleSurvey.index = singleSurveyList.length;
  
    singleSurvey.dateTime = dateTime;
    singleSurvey.timestamp = new Date().getTime();
    singleSurvey.isRecoding = false;
    singleSurvey.area = "";
    singleSurvey.years = "";
    singleSurvey.areaType = "notAccurate";
    singleSurvey.images = [];
    singleSurvey.videos = [];
    singleSurvey.audios = [];
    singleSurvey.removeWord = "";
    singleSurvey.fileType = "image";
    singleSurvey.structType = "多层砌体房屋";
    singleSurvey.structTypes = ['多层砌体房屋', '多层和高层钢筋混凝土房屋', '底层框架房屋', '内框架房屋', '单层钢筋混凝土柱厂房', '单层砖柱厂房和空旷厂房', '木结构房屋', '土石墙房屋', '空间钢结构'];
    singleSurvey.structTypeIndex = 0;
    singleSurvey.usage = "住宅（公寓、居民楼等）";
    singleSurvey.usages = ['住宅（公寓、居民楼等）', '政府（政府机关、科研院所等）', '商业（商场、酒店等）', '站点（机场、火车站等）', '工业厂房（重、轻工业厂房等）', '公共集会场所（体育馆、影剧院等）', '医疗卫生系统（医院、诊所等）', '生命线（生命线系统结构）', '文化教育系统（学校等）', '其它（物资储存设施等）'];
    singleSurvey.usageIndex = 0;
    singleSurvey.damage = "基本完好";
    singleSurvey.damages = ['基本完好', '轻微破坏', '中等破坏', '严重破坏', '倒塌'];
    singleSurvey.damageIndex = 0;
    singleSurvey.kangZhen = "6度";
    singleSurvey.kangZhens = ['6度', '7度', '8度', '9度', '采用非正规抗震措施（民居、自建房等）'];
    singleSurvey.kangZhenIndex = 0;
    singleSurvey.flattenedForms=['矩形', 'L型', '凹型', '其他'];
    singleSurvey.flattenedFormIndex = 0;
   
    singleSurvey.mark = "";
    singleSurvey.status = "working";

    wx.chooseLocation({
      success: function (res) {
        singleSurvey.lat = res.latitude;
        singleSurvey.lng = res.longitude;
        singleSurvey.name = res.address + " " + res.name;
        singleSurvey.address = res.address+" "+res.name;
        singleSurveyList.push(singleSurvey);
        that.setData({
          singleSurveyList: singleSurveyList
        })
        that.saveAll();
      },
    })
  },


  replaceContent: function (event, keyStr) {
    let that = this;
    let singleIndex = event.currentTarget.dataset.singleindex;
    let key = event.detail.value;
    let singleSurveyList = that.data.singleSurveyList;
    singleSurveyList[singleIndex][keyStr] = key;
    that.setData({
      singleSurveyList: singleSurveyList
    })
    console.log(singleSurveyList)
  },

  replacePickerContent: function (event, keyStr) {
    let that = this;
    let singleIndex = event.currentTarget.dataset.singleindex;
    let key = event.detail.value;
    let singleSurveyList = that.data.singleSurveyList;
    singleSurveyList[singleIndex][keyStr + 'Index'] = key;
    singleSurveyList[singleIndex][keyStr] = singleSurveyList[singleIndex][keyStr + 's'][key];
    that.setData({
      singleSurveyList: singleSurveyList
    })
    console.log(singleSurveyList);
  },

  bindRemove: function (e) {
    this.replaceContent(e, "status");
    this.replaceContent(e, "removeWord");
  },
  bindName: function (e) {
    console.log(e)
    this.replaceContent(e, "name");
  },
  bindMark: function (e) {
    console.log(e)
    this.replaceContent(e, "mark");
  },
  bindAddress: function (e) { this.replaceContent(e, "address"); },
  bindLat: function (e) { this.replaceContent(e, "lat"); },
  bindLng: function (e) { this.replaceContent(e, "lng"); },
  bindDateTime: function (e) { this.replaceContent(e, "dateTime"); },

  bindRadioChange: function (e) {
    console.log(e);
    this.replaceContent(e, "areaType");
  },
  bindArea: function (e) {
    console.log(e);
    this.replaceContent(e, "area");
  },

  fileTypeChange: function (e) {
    console.log(e);
    this.replaceContent(e, "fileType");
  },
  bindflattenedForms:function(e){
    console.log(e);
    this.replacePickerContent(e, 'flattenedForm')
  },

  bindDamageChange: function (e) {
    console.log(e);
    this.replacePickerContent(e, 'damage')
  },
  bindyears: function (e) {
    console.log(e);
    this.replacePickerContent(e, 'years')
  },
  bindKangZhenChange: function (e) {
    console.log(e);
    this.replacePickerContent(e, 'kangZhen')
  },
  bindUsageChange: function (e) {
    console.log(e);
    this.replacePickerContent(e, 'usage')
  },
  bindStructTypeChange: function (e) {
    console.log(e);
    this.replacePickerContent(e, 'structType')
  },
  formatSingleSurveyList: function (list) {
    let structTypes = ['多层砌体房屋', '多层和高层钢筋混凝土房屋', '底层框架房屋', '内框架房屋', '单层钢筋混凝土柱厂房', '单层砖柱厂房和空旷厂房', '木结构房屋', '土石墙房屋', '空间钢结构'];
    let usages = ['住宅（公寓、居民楼等）', '政府（政府机关、科研院所等）', '商业（商场、酒店等）', '站点（机场、火车站等）', '工业厂房（重、轻工业厂房等）', '公共集会场所（体育馆、影剧院等）', '医疗卫生系统（医院、诊所等）', '生命线（生命线系统结构）', '文化教育系统（学校等）', '其它（物资储存设施等）'];

    let damages = ['基本完好', '轻微破坏', '中等破坏', '严重破坏', '倒塌'];
    let kangZhens = ['6度', '7度', '8度', '9度', '采用非正规抗震措施（民居、自建房等）'];
    let flattenedForms = ['矩形', 'L型', '凹型', '其他'];
     

    for (var i = 0; i < list.length; i++) {
      list[i].structTypes = structTypes;
      list[i].usages = usages;
      list[i].damages = damages;
      list[i].kangZhens = kangZhens;
      list[i].flattenedForms = flattenedForms;
      list[i].removeWord = "";
      list[i].fileType = list[i].fileType === undefined ? "image" : list[i].fileType;
      list[i].isRecoding = false;
      list[i].index = i;
      for (var j = 0; j < damages.length; j++) {
        if (list[i].damage === damages[j]) {
          list[i].damageIndex = j;
          break;
        }
      }
      for (j = 0; j < structTypes.length; j++) {
        if (list[i].structType === structTypes[j]) {
          list[i].structTypeIndex = j;
          break;
        }
      }
      for (j = 0; j < usages.length; j++) {
        if (list[i].usage === usages[j]) {
          list[i].usageIndex = j;
          break;
        }
      }
      for (j = 0; j < flattenedForms.length; j++) {
        if (list[i].flattenedForm === flattenedForms[j]) {
          list[i].flattenedFormIndex = j;
          break;
        }
      }
      for (j = 0; j < kangZhens.length; j++) {
        if (list[i].kangZhen === kangZhens[j]) {
          list[i].kangZhenIndex = j;
          break;
        }
      }
    }
    return list;
  },
  onHide: function (e) {
    console.log(e);
    this.saveAll();
  }
})