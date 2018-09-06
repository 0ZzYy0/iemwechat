// pages/lifelineSurvey/lifelineSurvey.js
const recorderManager = wx.getRecorderManager()
recorderManager.onStart(() => {
  console.log('recorder start')
})
recorderManager.onPause(() => {
  console.log('recorder pause')
})

recorderManager.onFrameRecorded((res) => {
  const {
    frameBuffer
  } = res
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
    lifelineLists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    var lifelineLists = []
    that.setData({
      earthquakeId: options.earthquakeId
    })
    wx.request({
      method: "GET",
      url: server + "/LifeLine/getByOidAndEid",
      data: {
        ownerId: app.globalData.customer.id,
        earthquakeId: options.earthquakeId
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      },
      success: function (res) {
        lifelineLists = res.data;
        for (var i = 0; i < lifelineLists.length; i++) {
          lifelineLists[i].status = "working";
          lifelineLists[i].fileType = 'image';
        }
        lifelineLists = that.formatLifelineLists(lifelineLists);
        that.setData({
          lifelineLists: lifelineLists,
          earthquakeId: options.earthquakeId
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        })
        wx.navigateBack({
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //新增调查
  addsurvey: function () {
    let that = this;
    let lifeline = {};
    let dateTime = utils.formatTime(new Date());
    let lifelineLists = that.data.lifelineLists || [];

    lifeline.ownerId = app.globalData.customer.id;
    lifeline.index = lifelineLists.length;
    lifeline.earthquakeId = that.data.earthquakeId;
    lifeline.time = dateTime;
    lifeline.name = '';
    lifeline.adderss = '';
    lifeline.lng = '';
    lifeline.lat = '';
    lifeline.interact = '';
    lifeline.mid = utils.UUID();
    lifeline.cid = utils.UUID();
    lifeline.fileType = "image";
    lifeline.isRecoding = false;
    lifeline.audios = [];
    lifeline.videos = [];
    lifeline.images = [];
    lifeline.audiosData = [];
    lifeline.videosData = [];
    lifeline.imagesData = [];

    //初始化多选选项
    wx.request({
      method: "GET",
      url: server + "/LifeLine/getMsfDome",
      data: {
        ownerId: app.globalData.customer.id,
        earthquakeId: options.earthquakeId
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      },
      success: function (res) {
        lifeline.msf = res.data;
      },
      fail: function (res) {
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        })
        wx.navigateBack({
        })
      }
    })
    //用来控制删除
    lifeline.status = 'working';

    //地址选择
    wx.chooseLocation({
      success: function (res) {
        lifeline.lat = res.latitude;
        lifeline.lng = res.longitude;
        lifeline.name = res.address + " " + res.name;
        lifeline.adderss = res.address + " " + res.name;
        lifelineLists.push(lifeline);
        that.setData({
          lifelineLists: lifelineLists
        })
      },
    })
  },

  //改变多选
  checkboxMSFChange: function (e) {
    let lifelineLists = this.data.lifelineLists;
    var index = e.currentTarget.dataset.lifelineindex;
    var checkboxItems = lifelineLists[index].msf,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].name == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    lifelineLists[index].msf = checkboxItems;
    this.setData({
      lifelineLists: lifelineLists
    });
  },

  formatLifelineLists: function (lifelineLists) {
    for (var i = 0; i < lifelineLists.length; i++) {
      lifelineLists[i].index = i;
    }
    return lifelineLists;
  },

  //单体调查跳转
  navigateToMonomers: function (e) {
    let eid = this.data.earthquakeId;
    let mid = e.currentTarget.dataset.mid;
    this.saveAll();
    wx.navigateTo({
      url: "/pages/lifelineMonomers/lifelineMonomers?mid=" + mid + "&earthquakeId=" + eid
    })
  },

  //全面调查跳转
  navigateToComprehensive: function (e) {
    let eid = this.data.earthquakeId;
    let cid = e.currentTarget.dataset.cid;
    this.saveAll();
    wx.navigateTo({
      url: "/pages/lifelineComprehensive/lifelineComprehensive?cid=" + cid + "&earthquakeId=" + eid
    })
  },

  //图片上传
  chooseImage: function (e) {
    let that = this;
    let singleIndex = e.currentTarget.dataset.lifelineindex;
    let upName = e.currentTarget.dataset.upname;
    let lifelineSurveyList = that.data.lifelineLists;
    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.uploadFile({
          url: server + '/fileentity/upload',
          header: {
            'content-type': 'multipart/form-data',
            'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
          },
          formData: {
            'id': app.globalData.customer.id,
            'eqId': wx.getStorageSync("earthquake").id,
            'usage': "生命线附件图片",
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
            if (upName == 'images') {
              lifelineSurveyList[singleIndex].imagesData = lifelineSurveyList[singleIndex].imagesData.concat(fileData.data);
              lifelineSurveyList[singleIndex].images = lifelineSurveyList[singleIndex].images.concat(server + fileData.data.uri);
            }
            that.setData({
              lifelineLists: lifelineSurveyList
            });
          }
        })
      }
    })
  },

  //视频上传
  chooseVideo: function (e) {
    let that = this;
    let upName = e.currentTarget.dataset.upname;
    let singleIndex = e.currentTarget.dataset.lifelineindex;
    let lifelineSurveyList = that.data.lifelineLists;
    wx.chooseVideo({
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      maxDuration: 30,
      camera: 'back',
      success: function (res) {
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
            'usage': "生面线附件视频",
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

            if (upName == 'videos') {
              lifelineSurveyList[singleIndex].videosData = lifelineSurveyList[singleIndex].videosData.concat(fileData.data);
              lifelineSurveyList[singleIndex].videos = lifelineSurveyList[singleIndex].videos.concat(server + fileData.data.uri);
            }

            that.setData({
              lifelineLists: lifelineSurveyList
            });
          }
        })
      }
    })
  },

  //录音开始
  chooseAudio: function (e) {
    recorderManager.start(options);
    let that = this;
    let upName = e.currentTarget.dataset.upname;
    let singleIndex = e.currentTarget.dataset.lifelineindex;
    let lifelineSurveyList = that.data.lifelineLists;
    let index = e.currentTarget.dataset.index;
    if (upName == 'audios') {
      lifelineSurveyList[singleIndex].isRecoding = !lifelineSurveyList[singleIndex].isRecoding;
    }
    that.setData({
      lifelineLists: lifelineSurveyList
    })
  },

  //录音结束,上传
  stopAudio: function (e) {
    recorderManager.stop();
    let that = this;
    let upName = e.currentTarget.dataset.upname;
    let singleIndex = e.currentTarget.dataset.lifelineindex;
    let lifelineSurveyList = that.data.lifelineLists;
    let index = e.currentTarget.dataset.index;

    if (upName == 'audios') {
      lifelineSurveyList[singleIndex].isRecoding = !lifelineSurveyList[singleIndex].isRecoding;
    }

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
          'usage': "生命线附件录音",
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

          if (upName == 'audios') {
            lifelineSurveyList[singleIndex].audiosData = lifelineSurveyList[singleIndex].audiosData.concat(fileData.data);
            lifelineSurveyList[singleIndex].audios = lifelineSurveyList[singleIndex].audios.concat(server + fileData.data.uri);
          }

          that.setData({
            lifelineLists: lifelineSurveyList
          });
        }
      })
    })
  },

  //删除附件
  delData: function (e) {
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    let singleIndex = e.currentTarget.dataset.lifelineindex;
    let lifelineSurveyList = that.data.lifelineLists;
    let index = e.currentTarget.dataset.index;
    let target = e.currentTarget.dataset.target;
    wx.showModal({
      title: '删除此文件？',
      content: '点击确定删除此文件',
      success: function (me) {
        if (me.confirm) {
          let targetList = target + 'Data';
          wx.request({
            method: "POST",
            url: server + "/fileentity/delbyid",
            data: {
              id: lifelineSurveyList[singleIndex][targetList][index].id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
            },
            success: function (res) {
              let datas = lifelineSurveyList[singleIndex][target];
              datas.splice(index, 1);
              lifelineSurveyList[singleIndex][target] = datas;
              let dataList = lifelineSurveyList[singleIndex][targetList];
              dataList.splice(index, 1);
              lifelineSurveyList[singleIndex][targetList] = dataList;
              //lifelineSurveyList = that.formatlifelineLists(lifelineSurveyList)
              that.setData({
                lifelineLists: lifelineSurveyList
              })
              that.saveAll();
              wx.showToast({
                title: '删除成功！',
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

        }
      }
    })
  },

  saveAll: function (e) {
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    if (that.data.lifelineLists.length === 0) {
      return;
    }
    wx.request({
      method: "POST",
      url: server + "/LifeLine/saveall",
      data: that.data.lifelineLists,
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      },
      success: function (res) {
        if (e) {
          wx.showToast({
            title: '保存成功！',
            icon: "success",
            duration: 1000,
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

  //删除一组数据
  removeSurvey: function (event) {
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    wx.showModal({
      title: '移除调查',
      content: '点击确定移除本调查（请谨慎操作）！',
      success: function (modalevent) {
        if (modalevent.confirm) {
          let serveyIndex = event.currentTarget.dataset.lifelineindex;
          let lifelineLists = that.data.lifelineLists;
          let survey = lifelineLists.splice(serveyIndex, 1)
          if (survey.id !== null) {
            wx.request({
              method: "POST",
              url: server + "/LifeLine/delbyid?id=" + survey[0].id,
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
              },
              success: function (res) {
                wx.showToast({
                  title: '删除成功！',
                  icon: "success",
                  duration: 2000,
                })
                that.setData({
                  lifelineLists: that.formatLifelineLists(lifelineLists)
                })
                that.saveAll();
              },
              fail: function (res) {
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

  //前台input发生改动之后自动更新后台值
  replaceContent: function (event, keyStr) {
    let that = this;
    let key = event.detail.value;
    let lifelineLists = that.data.lifelineLists;
    let singleIndex = event.currentTarget.dataset.lifelineindex;
    lifelineLists[singleIndex][keyStr] = key;
    that.setData({
      lifelineLists: lifelineLists
    })
  },
  bindinputName: function (e) {
    this.replaceContent(e, "name");
  },
  bindinputAdderss: function (e) {
    this.replaceContent(e, "adderss");
  },
  bindinputLng: function (e) {
    this.replaceContent(e, "lng");
  },
  bindinputLat: function (e) {
    this.replaceContent(e, "lat");
  },
  bindinputTime: function (e) {
    this.replaceContent(e, "time");
  },
  bindinputInteract: function (e) {
    this.replaceContent(e, "interact");
  },
  bindStatus: function (e) {
    this.replaceContent(e, "status");
  },
  fileTypeChange: function (e) {
    this.replaceContent(e, "fileType");
  },
})