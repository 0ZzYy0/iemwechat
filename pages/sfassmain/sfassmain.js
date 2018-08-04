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
    safetyAssess:{},
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
    damage: ['毁坏', '严重', '中等', '轻微', '完好'],
    damageIndex: 0,
    regionParam: ['西南地区', '东北地区', '西北地区', '华东地区', '华南地区', '华北地区','华中地区'],
    regionParamIndex: 0,
    kangZhen: ['6度', '7度', '8度', '9度', '采用非正规抗震措施（民居、自建房等）'],
    kangZhenIndex: 0
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
            'usage': "安全鉴定",
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
            'usage': "安全鉴定",
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

      console.log('recorder stop', res)


      wx.uploadFile({
        url: server + '/fileentity/upload',
        header: {
          'content-type': 'multipart/form-data',
          'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
        },
        formData: {
          'id': app.globalData.customer.id,
          'eqId': wx.getStorageSync("earthquake").id,
          'usage': "安全鉴定",
          "typeId": 3
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
            url: server + "/fileentity/delbyid",
            data: {
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
    let safetyAssess={};
    let singleSurveyList = that.data.singleSurveyList;
    if(options.uuid){
      if (!utils.checkSession()) {
        wx.navigateBack({

        })
        return;
      }
      wx.request({
        method: "GET",
        url: server + "/safetyassess/getbyuuid",
        data: {
          uuid: options.uuid
        },
        header: {
          'content-type': 'application/json',
          'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
        }, success: function (res) {
          console.log(res.data)
          if(res.data.code!==1)
          {
            wx.showModal({
              title: '操作失败',
              content: res.data.msg,
            })
            return;
          }
          let types=res.data.result.types;
          let usage = res.data.result.usages;
          let tys=[];
          types.forEach(function(e){
            tys.push(e.typeName)
          })

          let uss = [];
          usage.forEach(function (e) {
            uss.push(e.usage)
          })
          that.setData({
            usage: uss,
            structType: tys
          })
          console.log(uss)
          safetyAssess = res.data.result.assess;
          singleSurveyList.push(safetyAssess);
          singleSurveyList = that.formatSingleSurveyList(singleSurveyList);
          that.setData({
            safetyAssess: safetyAssess,
            singleSurveyList: singleSurveyList,
            earthquakeId: options.earthquakeId
          })
          console.log(options.earthquakeId, safetyAssess);
        }, fail: function (res) {
          wx.showModal({
            title: '操作失败',
            content: '请检查网络或其他问题后重试',
          })
          wx.navigateBack({

          })
        }
      })
    }else{
      that.addsurvey(options.earthquakeId)
      //  wx.chooseLocation({
      //    success: function(res) {
      //      safetyAssess.address=res.address+" "+res.name;
      //      safetyAssess.lat=res.latitude;
      //      safetyAssess.lng=res.longitude;
      //      safetyAssess.uuid=utils.UUID();
      //      let dt=new Date();
      //      safetyAssess.dateTime = utils.formatTime(dt);
      //      safetyAssess.timestamp = dt.getTime();
      //      singleSurveyList.push(safetyAssess);
      //      singleSurveyList=that.formatSingleSurveyList(singleSurveyList);
      //      that.setData({
      //        safetyAssess: safetyAssess,
      //        singleSurveyList: singleSurveyList
      //      })
      //    },
      //    fail:function(res){
      //      wx.navigateBack({
             
      //      })
      //    }
      //  })
    }
    
    return;
    

    
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
    console.log(that.data.singleSurveyList[0])
    wx.request({
      method: "POST",
      url: server + "/safetyassess/save",
      data: that.data.singleSurveyList[0],
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      }, success: function (res) {
        let singleSurvey = res.data;
        let list=[];
        list.push(singleSurvey);
        list = that.formatSingleSurveyList(list);
        that.setData({
          singleSurveyList: list
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

  addsurvey: function (earthquakeId) {
    let that = this;
    let singleSurvey = {};

    let dateTime = utils.formatTime(new Date());

    let singleSurveyList = that.data.singleSurveyList || [];
    singleSurvey.surveyId = that.data.survey.id;
    singleSurvey.surveyUuid = that.data.survey.uuid;
    singleSurvey.ownerId = app.globalData.customer.id;
    singleSurvey.earthquakeId =earthquakeId;
    
    singleSurvey.openId = app.globalData.customer.openId;
    singleSurvey.uuid = utils.UUID();
    singleSurvey.index = singleSurveyList.length;
    singleSurvey.fortified = false;
    singleSurvey.dateTime = dateTime;
    singleSurvey.timestamp = new Date().getTime();
    singleSurvey.isRecoding = false;
    singleSurvey.area = "";
    singleSurvey.houseHost = "";
    singleSurvey.areaType = "notAccurate";
    singleSurvey.images = [];
    singleSurvey.videos = [];
    singleSurvey.audios = [];
    singleSurvey.removeWord = "";
    singleSurvey.fileType = "image";
    singleSurvey.structType = "多层砌体房屋";
    singleSurvey.structTypes = that.data.structType;
    singleSurvey.structTypeIndex = 0;
    singleSurvey.usage = "住宅（公寓、居民楼等）";
    singleSurvey.usages = that.data.usage;
    singleSurvey.usageIndex = 0;
    singleSurvey.damage = "完好";
    singleSurvey.damages = ['完好', '毁坏', '严重', '中等', '轻微'];
    singleSurvey.damageIndex = 0;

    singleSurvey.regionParam ="";
      singleSurvey.regionParams= ['西南地区', '东北地区', '西北地区', '华东地区', '华南地区', '华北地区', '华中地区'];
      singleSurvey.regionParamIndex= 0;

    singleSurvey.kangZhen = "6度";
    singleSurvey.kangZhens = ['6度', '7度', '8度', '9度', '采用非正规抗震措施（民居、自建房等）'];
    singleSurvey.kangZhenIndex = 0;

    singleSurvey.mark = "";
    singleSurvey.status = "working";

    wx.chooseLocation({
      success: function (res) {
        singleSurvey.name = res.address + " " + res.name;
        singleSurvey.lat = res.latitude;
        singleSurvey.lng = res.longitude;
        singleSurvey.address = res.address + " " + res.name;
        singleSurveyList.push(singleSurvey);
        that.setData({
          singleSurveyList: singleSurveyList
        })
        console.log(singleSurvey)
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
  bindHost: function (e) { this.replaceContent(e, "houseHost"); },
  bindMainOnGround: function (e) { this.replaceContent(e, "mainOnGround"); },
  bindLocalNumOfLayers: function (e) { this.replaceContent(e, "localNumOfLayers"); },
  bindMainUnderGround: function (e) { this.replaceContent(e, "mainUnderGround"); },
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
  bindKZSFChange: function (event){
    let that = this;
    let singleIndex = event.currentTarget.dataset.singleindex;
    let key = event.detail.value=="true"?true:false;
    let singleSurveyList = that.data.singleSurveyList;
    singleSurveyList[singleIndex]['fortified'] = key;
    that.setData({
      singleSurveyList: singleSurveyList
    })
    console.log(singleSurveyList)
  },

  bindDamageChange: function (e) {
    console.log(e);
    this.replacePickerContent(e, 'damage')
  },

  bindRegionParamChange:function(e){
    console.log(e);
    this.replacePickerContent(e, 'regionParam')
  },
  navigateToExpectEnvir:function(e){
    let assessId=e.currentTarget.dataset.mid;
      wx.navigateTo({
        url: "/pages/sfaexpectenvir/sfaexpectenvir?id=" + assessId
      })
  },

  navigateToDetailSeismic: function (e) {
    let assessId = e.currentTarget.dataset.mid;
    wx.navigateTo({
      url: "/pages/partlevel1/partlevel1?assessId=" + assessId
    })
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
    let that=this;
    let structTypes = that.data.structType;
    let usages = that.data.usage;
    console.log(that.data.structType)

    let damages = ['完好', '毁坏', '严重', '中等', '轻微'];
    let kangZhens = ['6度', '7度', '8度', '9度', '采用非正规抗震措施（民居、自建房等）'];

  let regionParams = ['西南地区', '东北地区', '西北地区', '华东地区', '华南地区', '华北地区', '华中地区'];
    for (var i = 0; i < list.length; i++) {
      list[i].structTypes = structTypes;
      list[i].usages = usages;
      list[i].houseHost = list[i].houseHost ? list[i].houseHost:"";
      list[i].damages = damages;
      list[i].regionParam = list[i].regionParam === undefined ? "" : list[i].regionParam;
      list[i].regionParams = regionParams;
      list[i].kangZhens = kangZhens;
      list[i].removeWord = "";
      console.log(list[i].fortified )
      list[i].fortified = list[i].fortified ? list[i].fortified : false;
      list[i].fileType = list[i].fileType === undefined ? "image" : list[i].fileType;
      list[i].isRecoding = false;
      list[i].index = i;
      list[i].mainOnGround = list[i].mainOnGround ? list[i].mainOnGround:"";
      list[i].mainUnderGround = list[i].mainUnderGround ? list[i].mainUnderGround : "";
      list[i].localNumOfLayers = list[i].localNumOfLayers ? list[i].localNumOfLayers : "";
      for (var j = 0; j < damages.length; j++) {
        if (list[i].damage === damages[j]) {
          list[i].damageIndex = j;
          break;
        }
      }
      for (j = 0; j < regionParams.length; j++) {
        if (list[i].regionParam === regionParams[j]) {
          list[i].regionParamIndex = j;
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
      for (j = 0; j < kangZhens.length; j++) {
        if (list[i].kangZhen === kangZhens[j]) {
          list[i].kangZhenIndex = j;
          break;
        }
      }
    }
    console.log(list)
    return list;
  },
  onHide: function (e) {
    console.log(e);
    this.saveAll();
  }
})