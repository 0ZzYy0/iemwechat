// pages/intensitysurvey/intensitysurvey.js
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
var server = app.globalData.server;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    earthquakeId: "",
    intensityRange: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'],
    surveyLists: []
  },

  chooseImage: function (e) {
    console.log(e)
    let that = this;
    let singleIndex = e.currentTarget.dataset.surveyindex;
    let singleSurveyList = that.data.surveyLists;
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
            'usage': "烈度调查",
            'typeId': 1,
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
              surveyLists: singleSurveyList
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
    let singleIndex = e.currentTarget.dataset.surveyindex;
    let singleSurveyList = that.data.surveyLists;
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
            'usage': "烈度调查",
            'typeId': 2,
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
              surveyLists: singleSurveyList
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
    let singleIndex = e.currentTarget.dataset.surveyindex;
    let singleSurveyList = that.data.surveyLists;
    let index = e.currentTarget.dataset.index;
    singleSurveyList[singleIndex].isRecoding = !singleSurveyList[singleIndex].isRecoding;
    that.setData({
      surveyLists: singleSurveyList
    })


  },
  stopAudio: function (e) {
    recorderManager.stop();
    let that = this;
    let singleIndex = e.currentTarget.dataset.surveyindex;
    let singleSurveyList = that.data.surveyLists;
    let index = e.currentTarget.dataset.index;
    console.log(singleSurveyList, singleIndex);
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
          'usage': "烈度调查",
          'typeId': 3,
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
            surveyLists: singleSurveyList
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
    let singleIndex = e.currentTarget.dataset.surveyindex;
    let singleSurveyList = that.data.surveyLists;
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
              singleSurveyList = that.formatSurveyLists(singleSurveyList)
              that.setData({
                surveyLists: singleSurveyList
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

  addsurvey: function () {
    let that = this;
    let survey = {};

    let dateTime = utils.formatTime(new Date());

    let surveyLists = that.data.surveyLists || [];
    survey.ownerId = app.globalData.customer.id;
    survey.openId = app.globalData.customer.openId;
    survey.uuid = utils.UUID();
    survey.index = surveyLists.length;
    survey.earthquakeId = that.data.earthquakeId;
    survey.dateTime = dateTime;
    survey.fileType = "image";
    survey.timestamp = new Date().getTime();
    survey.intensity = "I";
    survey.intensityRange = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    survey.intensityIndex = 0;
    survey.mark = "";
    survey.audios = [];
    survey.videos = [];
    survey.images = [];
    survey.status = "working";
    survey.houseNumber = "";
    survey.avgArea = "";
    survey.totalPeople = "";
    wx.chooseLocation({
      success: function (res) {
        survey.lat = res.latitude;
        survey.lng = res.longitude;
        survey.name = res.address + " " + res.name;
        survey.address = res.address + " " + res.name;
        survey.altitude = "";
        surveyLists.push(survey);
        that.setData({
          surveyLists: surveyLists
        })

      },
    })
  },

  fileTypeChange: function (e) {
    console.log(e);
    this.replaceContent(e, "fileType");
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (!utils.checkSession()) {
      wx.navigateBack({

      });
      return;
    }
    var that = this;
    var surveyLists = []
    that.setData({
      earthquakeId: options.earthquakeId
    })
    wx.request({
      method: "GET",
      url: server + "/intensitysurvey/getbyoidandeid",
      data: {
        ownerId: app.globalData.customer.id,
        earthquakeId: options.earthquakeId
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      }, success: function (res) {
        console.log(res.data)
        surveyLists = res.data;
        for (var i = 0; i < surveyLists.length; i++) {
          surveyLists[i].status = "working"
        }
        surveyLists = that.formatSurveyLists(surveyLists);
        console.log(surveyLists)
        that.setData({
          surveyLists: surveyLists,
          earthquakeId: options.earthquakeId
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

  bindsurveymark: function (e) {
    this.replaceContent(e, "mark");
  },
  bindsurveyname: function (e) {
    this.replaceContent(e, "name");
  },
  bindsurveyaddress: function (e) { this.replaceContent(e, "address"); },
  bindDateTime: function (e) { this.replaceContent(e, "dateTime"); },
  bindLat: function (e) { this.replaceContent(e, "lat"); },
  bindLng: function (e) { this.replaceContent(e, "lng"); },
  bindRemove: function (e) { this.replaceContent(e, "status"); },
  bindaltitude: function (e) { this.replaceContent(e, "altitude"); },
  bindhouseNumber: function (e) { this.replaceContent(e, "houseNumber"); },
  bindavgArea: function (e) { this.replaceContent(e, "avgArea"); },
  bindtotalPeople: function (e) { this.replaceContent(e, "totalPeople"); },

  binddeath: function (e) { this.replaceContent(e, "death"); },
  bindmiss: function (e) { this.replaceContent(e, "miss"); },
  bindsevereWound: function (e) { this.replaceContent(e, "severeWound"); },
  bindslightWound: function (e) { this.replaceContent(e, "slightWound"); },

  bindIntensityChange: function (event) {
    let that = this;
    let serveyIndex = event.currentTarget.dataset.surveyindex;
    let val = event.detail.value;
    let surveyLists = that.data.surveyLists;
    surveyLists[serveyIndex].intensityIndex = val;
    surveyLists[serveyIndex].intensity = surveyLists[serveyIndex].intensityRange[val];
    that.setData({
      surveyLists: surveyLists
    })
  },


  saveAll: function (e) {
    console.log(e);
    if (!utils.checkSession()) {
      return;
    }

    let that = this;
    if (that.data.surveyLists.length === 0) {
      return;
    }

    if (!that.checkNamesNotNull()) {
      wx.showModal({
        title: '保存失败',
        content: '存在未填写的调查点名称，请填写后重新操作。',
      })
      return;
    }


    wx.request({
      method: "POST",
      url: server + "/intensitysurvey/saveall",
      data: that.data.surveyLists,
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      }, success: function (res) {
        let list = res.data;
        list = that.formatSurveyLists(list);
        that.setData({
          surveyLists: list
        })
        console.log(that.data.surveyLists);
        if (e) {
          wx.showToast({
            title: '保存成功！',
            icon: "success",
            duration: 1000,
          })
        }

      }, fail: function (res) {
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        })
      }
    })
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
          let serveyIndex = event.currentTarget.dataset.surveyindex;
          let surveyLists = that.data.surveyLists;
          let survey = surveyLists.splice(serveyIndex, 1)
          if (survey.id !== null) {
            wx.request({
              method: "POST",
              url: server + "/intensitysurvey/delbyid?id=" + survey[0].id,

              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
              }, success: function (res) {
                wx.showToast({
                  title: '删除成功！',
                  icon: "success",
                  duration: 2000,
                })
                that.setData({
                  surveyLists: that.formatSurveyLists(surveyLists)
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
      }
    })
  },

  replaceContent: function (event, keyStr) {
    let that = this;
    let serveyIndex = event.currentTarget.dataset.surveyindex;
    let key = event.detail.value;
    let surveyLists = that.data.surveyLists;
    console.log(serveyIndex, surveyLists, keyStr)
    surveyLists[serveyIndex][keyStr] = key;
    that.setData({
      surveyLists: surveyLists
    })

  },

  formatSurveyLists: function (surveyLists) {
    let intensityRange = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    for (var i = 0; i < surveyLists.length; i++) {
      surveyLists[i].index = i;
      surveyLists[i].intensityRange = intensityRange;
      surveyLists[i].fileType = surveyLists[i].fileType === undefined ? "image" : surveyLists[i].fileType;
      surveyLists[i].isRecoding = false;

      for (var j = 0; j < intensityRange.length; j++) {
        if (surveyLists[i].intensity === intensityRange[j]) {
          surveyLists[i].intensityIndex = j;
        }
      }
    }
    return surveyLists;
  },
  navigateToSingleSurvey: function (e) {

    let eid = this.data.earthquakeId;
    console.log(eid)
    let uuid = e.currentTarget.dataset.uuid;
    if (!this.checkNamesNotNull()) {
      wx.showModal({
        title: '保存失败',
        content: '存在未填写的调查点名称，请填写后重新操作。',
      })
      return;
    }
    this.saveAll();
    wx.navigateTo({
      url: "/pages/singlesurvey/singlesurvey?uuid=" + uuid + "&earthquakeId=" + eid
    })
  },

  navigateToMultiSurvey: function (e) {
    let eid = this.data.earthquakeId;
    let uuid = e.currentTarget.dataset.uuid;
    console.log(eid);
    if (!this.checkNamesNotNull()) {
      wx.showModal({
        title: '保存失败',
        content: '存在未填写的调查点名称，请填写后重新操作。',
      })
      return;
    }
    this.saveAll();
    wx.navigateTo({
      url: "/pages/multisurvey/multisurvey?uuid=" + uuid + "&earthquakeId=" + eid
    })
  },

  checkNamesNotNull: function () {
    let that = this;
    let slist = that.data.surveyLists;
    for (let i in slist) {
      if (slist[i].name === "") {
        return false;
      }
    }
    return true;
  }

})