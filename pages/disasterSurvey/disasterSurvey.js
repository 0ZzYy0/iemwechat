// pages/disasterSurvey/disasterSurvey.js
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
    disasterLists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!utils.checkSession()) {
      wx.navigateBack({});
      return;
    }
    var that = this;
    var disasterLists = []
    that.setData({
      earthquakeId: options.earthquakeId
    })
    wx.request({
      method: "GET",
      url: server + "/geologydisaster/getbyoidandeid",
      data: {
        ownerId: app.globalData.customer.id,
        earthquakeId: options.earthquakeId
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      },
      success: function (res) {
        disasterLists = res.data;
        for (var i = 0; i < disasterLists.length; i++) {
          disasterLists[i].status = "working";
          disasterLists[i].datumArrayfileType = 'image';
          disasterLists[i].sdosgfileType = 'image';
          disasterLists[i].pictureArrayfileType = 'image';
          disasterLists[i].fileArrayfileType = 'image';
          disasterLists[i].sdopasfileType = 'image';
          disasterLists[i].remarksfileType = 'image';
        }
        disasterLists = that.formatDisasterLists(disasterLists);
        that.setData({
          disasterLists: disasterLists,
          earthquakeId: options.earthquakeId
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        });
        wx.navigateBack({})
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
    let disaster = {};

    let dateTime = utils.formatTime(new Date());

    let disasterLists = that.data.disasterLists || [];
    disaster.ownerId = app.globalData.customer.id;
    disaster.openId = app.globalData.customer.openId;
    disaster.uuid = utils.UUID();
    disaster.index = disasterLists.length;
    disaster.earthquakeId = that.data.earthquakeId;
    disaster.dateTime = dateTime;
    disaster.name = '';
    disaster.lng = '';
    disaster.lat = '';
    disaster.intensityIndex = '';

    disaster.pooeoiRange = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    disaster.pooeoiIndex = 0;
    disaster.pooeoi = 'I';

    disaster.ceoiRange = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    disaster.ceoiIndex = 0;
    disaster.ceoi = 'I';

    disaster.typeRange = ['其它', '地裂', '滑坡', '堰塞', '崩塌', '砂土液化', '震陷'];
    disaster.typeIndex = 0;
    disaster.type = '其它';

    disaster.shapeRange = ['其它', '雁行式', '直线状', '锯齿状', '弧形', '地裂带'];
    disaster.shapeIndex = 0;
    disaster.shape = '其它';

    disaster.wonaghdmicRange = ['否', '是'];
    disaster.wonaghdmicIndex = 0;
    disaster.wonaghdmic = '否';

    disaster.datumArrayfileType = "image";
    disaster.datumArray = [];
    disaster.datumArrayAudios = [];
    disaster.datumArrayisRecoding = false;
    disaster.datumArrayVideos = [];
    disaster.datumArrayImages = [];
    disaster.datumArrayAudiosData = [];
    disaster.datumArrayVideosData = [];
    disaster.datumArrayImagesData = [];

    disaster.sdosgfileType = "image";
    disaster.sdosg = [];
    disaster.sdosgAudios = [];
    disaster.sdosgisRecoding = false;
    disaster.sdosgVideos = [];
    disaster.sdosgImages = [];
    disaster.sdosgAudiosData = [];
    disaster.sdosgVideosData = [];
    disaster.sdosgImagesData = [];

    disaster.pictureArrayfileType = "image";
    disaster.pictureArray = [];
    disaster.pictureArrayAudios = [];
    disaster.pictureArrayisRecoding = false;
    disaster.pictureArrayVideos = [];
    disaster.pictureArrayImages = [];
    disaster.pictureArrayAudiosData = [];
    disaster.pictureArrayVideosData = [];
    disaster.pictureArrayImagesData = [];

    disaster.fileArrayfileType = "image";
    disaster.fileArray = [];
    disaster.fileArrayAudios = [];
    disaster.fileArrayisRecoding = false;
    disaster.fileArrayVideos = [];
    disaster.fileArrayImages = [];
    disaster.fileArrayAudiosData = [];
    disaster.fileArrayVideosData = [];
    disaster.fileArrayImagesData = [];

    disaster.sdopasfileType = "image";
    disaster.sdopas = [];
    disaster.sdopasAudios = [];
    disaster.sdopasisRecoding = false;
    disaster.sdopasVideos = [];
    disaster.sdopasImages = [];
    disaster.sdopasAudiosData = [];
    disaster.sdopasVideosData = [];
    disaster.sdopasImagesData = [];

    disaster.remarksfileType = "image";
    disaster.remarks = [];
    disaster.remarksAudios = [];
    disaster.remarksisRecoding = false;
    disaster.remarksVideos = [];
    disaster.remarksImages = [];
    disaster.remarksAudiosData = [];
    disaster.remarksVideosData = [];
    disaster.remarksImagesData = [];

    disaster.time = dateTime;

    disaster.size = '';
    disaster.adderss = '';
    disaster.lsc = '';
    disaster.hc = '';
    disaster.aodm = '';
    //用来控制删除
    disaster.status = 'working';


    wx.chooseLocation({
      success: function (res) {
        disaster.lat = res.latitude;
        disaster.lng = res.longitude;
        disaster.name = res.address + " " + res.name;
        disaster.adderss = res.address + " " + res.name;
        disaster.altitude = "";

        disasterLists.push(disaster);
        that.setData({
          disasterLists: disasterLists
        })
      },
    })
  },

  bindIntensityChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let disasterLists = that.data.disasterLists;
    let singleIndex = event.currentTarget.dataset.disasterindex;
    disasterLists[singleIndex].intensityIndex = val;
    that.setData({
      disasterLists: disasterLists
    })
  },

  bindPooeoiChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let disasterLists = that.data.disasterLists;
    let singleIndex = event.currentTarget.dataset.disasterindex;
    disasterLists[singleIndex].pooeoiIndex = val;
    disasterLists[singleIndex].pooeoi = disasterLists[singleIndex].pooeoiRange[val];
    that.setData({
      disasterLists: disasterLists
    })
  },

  bindCeoiChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let disasterLists = that.data.disasterLists;
    let singleIndex = event.currentTarget.dataset.disasterindex;
    disasterLists[singleIndex].ceoiIndex = val;
    disasterLists[singleIndex].ceoi = disasterLists[singleIndex].ceoiRange[val];
    that.setData({
      disasterLists: disasterLists
    })
  },

  bindTypeChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let disasterLists = that.data.disasterLists;
    let singleIndex = event.currentTarget.dataset.disasterindex;
    disasterLists[singleIndex].typeIndex = val;
    disasterLists[singleIndex].type = disasterLists[singleIndex].typeRange[val];
    that.setData({
      disasterLists: disasterLists
    })
  },

  bindShapeChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let disasterLists = that.data.disasterLists;
    let singleIndex = event.currentTarget.dataset.disasterindex;
    disasterLists[singleIndex].shapeIndex = val;
    disasterLists[singleIndex].shape = disasterLists[singleIndex].shapeRange[val];
    that.setData({
      disasterLists: disasterLists
    })
  },

  bindWonaghdmicChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let disasterLists = that.data.disasterLists;
    let singleIndex = event.currentTarget.dataset.disasterindex;
    disasterLists[singleIndex].wonaghdmicIndex = val;
    disasterLists[singleIndex].wonaghdmic = disasterLists[singleIndex].wonaghdmicRange[val];
    that.setData({
      disasterLists: disasterLists
    })
  },

  chooseImage: function (e) {
    let that = this;
    let singleIndex = e.currentTarget.dataset.disasterindex;
    let upName = e.currentTarget.dataset.upname;

    let disasterSurveyList = that.data.disasterLists;
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
            'usage': "地址灾害调查",
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

            if (upName == 'datumArrayImages') {
              disasterSurveyList[singleIndex].datumArrayImagesData = disasterSurveyList[singleIndex].datumArrayImagesData.concat(fileData.data);
              disasterSurveyList[singleIndex].datumArrayImages = disasterSurveyList[singleIndex].datumArrayImages.concat(server + fileData.data.uri);
            } else if (upName == 'sdosgImages') {
              disasterSurveyList[singleIndex].sdosgImagesData = disasterSurveyList[singleIndex].sdosgImagesData.concat(fileData.data);
              disasterSurveyList[singleIndex].sdosgImages = disasterSurveyList[singleIndex].sdosgImages.concat(server + fileData.data.uri);
            } else if (upName == 'pictureArrayImages') {
              disasterSurveyList[singleIndex].pictureArrayImagesData = disasterSurveyList[singleIndex].pictureArrayImagesData.concat(fileData.data);
              disasterSurveyList[singleIndex].pictureArrayImages = disasterSurveyList[singleIndex].pictureArrayImages.concat(server + fileData.data.uri);
            } else if (upName == 'fileArrayImages') {
              disasterSurveyList[singleIndex].fileArrayImagesData = disasterSurveyList[singleIndex].fileArrayImagesData.concat(fileData.data);
              disasterSurveyList[singleIndex].fileArrayImages = disasterSurveyList[singleIndex].fileArrayImages.concat(server + fileData.data.uri);
            } else if (upName == 'sdopasImages') {
              disasterSurveyList[singleIndex].sdopasImagesData = disasterSurveyList[singleIndex].sdopasImagesData.concat(fileData.data);
              disasterSurveyList[singleIndex].sdopasImages = disasterSurveyList[singleIndex].sdopasImages.concat(server + fileData.data.uri);
            } else if (upName == 'remarksImages') {
              disasterSurveyList[singleIndex].remarksImagesData = disasterSurveyList[singleIndex].remarksImagesData.concat(fileData.data);
              disasterSurveyList[singleIndex].remarksImages = disasterSurveyList[singleIndex].remarksImages.concat(server + fileData.data.uri);
            }
            
            

            that.setData({
              disasterLists: disasterSurveyList
            });
            //that.saveAll();
          }
        })
      }
    })
  },
  chooseVideo: function (e) {
    let that = this;
    let upName = e.currentTarget.dataset.upname;
    let singleIndex = e.currentTarget.dataset.disasterindex;
    let disasterSurveyList = that.data.disasterLists;
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
            'usage': "地址灾害调查",
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

            if (upName == 'datumArrayVideos') {
              disasterSurveyList[singleIndex].datumArrayVideosData = disasterSurveyList[singleIndex].datumArrayVideosData.concat(fileData.data);
              disasterSurveyList[singleIndex].datumArrayVideos = disasterSurveyList[singleIndex].datumArrayVideos.concat(server + fileData.data.uri);
            } else if (upName == 'sdosgVideos') {
              disasterSurveyList[singleIndex].sdosgVideosData = disasterSurveyList[singleIndex].sdosgVideosData.concat(fileData.data);
              disasterSurveyList[singleIndex].sdosgVideos = disasterSurveyList[singleIndex].sdosgVideos.concat(server + fileData.data.uri);
            } else if (upName == 'pictureArrayVideos') {
              disasterSurveyList[singleIndex].pictureArrayVideosData = disasterSurveyList[singleIndex].pictureArrayVideosData.concat(fileData.data);
              disasterSurveyList[singleIndex].pictureArrayVideos = disasterSurveyList[singleIndex].pictureArrayVideos.concat(server + fileData.data.uri);
            } else if (upName == 'fileArrayVideos') {
              disasterSurveyList[singleIndex].fileArrayVideosData = disasterSurveyList[singleIndex].fileArrayVideosData.concat(fileData.data);
              disasterSurveyList[singleIndex].fileArrayVideos = disasterSurveyList[singleIndex].fileArrayVideos.concat(server + fileData.data.uri);
            } else if (upName == 'sdopasVideos') {
              disasterSurveyList[singleIndex].sdopasVideosData = disasterSurveyList[singleIndex].sdopasVideosData.concat(fileData.data);
              disasterSurveyList[singleIndex].sdopasVideos = disasterSurveyList[singleIndex].sdopasVideos.concat(server + fileData.data.uri);
            } else if (upName == 'remarksVideos') {
              disasterSurveyList[singleIndex].remarksVideosData = disasterSurveyList[singleIndex].remarksVideosData.concat(fileData.data);
              disasterSurveyList[singleIndex].remarksVideos = disasterSurveyList[singleIndex].remarksVideos.concat(server + fileData.data.uri);
            }

            that.setData({
              disasterLists: disasterSurveyList
            });
            //that.saveAll();
          }
        })
      }
    })
  },
  chooseAudio: function (e) {
    recorderManager.start(options);
    let that = this;
    let upName = e.currentTarget.dataset.upname;
    let singleIndex = e.currentTarget.dataset.disasterindex;
    let disasterSurveyList = that.data.disasterLists;
    let index = e.currentTarget.dataset.index;

    if (upName == 'datumArrayAudios') {
      disasterSurveyList[singleIndex].datumArrayisRecoding = !disasterSurveyList[singleIndex].datumArrayisRecoding;
    } else if (upName == 'sdosgAudios') {
      disasterSurveyList[singleIndex].sdosgisRecoding = !disasterSurveyList[singleIndex].sdosgisRecoding;
    } else if (upName == 'pictureArrayAudios') {
      disasterSurveyList[singleIndex].pictureArrayisRecoding = !disasterSurveyList[singleIndex].pictureArrayisRecoding;
    } else if (upName == 'fileArrayAudios') {
      disasterSurveyList[singleIndex].fileArrayisRecoding = !disasterSurveyList[singleIndex].fileArrayisRecoding;
    } else if (upName == 'sdopasAudios') {
      disasterSurveyList[singleIndex].sdopasisRecoding = !disasterSurveyList[singleIndex].sdopasisRecoding;
    } else if (upName == 'remarksAudios') {
      disasterSurveyList[singleIndex].remarksisRecoding = !disasterSurveyList[singleIndex].remarksisRecoding;
    }

    that.setData({
      disasterLists: disasterSurveyList
    })
  },
  stopAudio: function (e) {
    recorderManager.stop();
    let that = this;
    let upName = e.currentTarget.dataset.upname;
    let singleIndex = e.currentTarget.dataset.disasterindex;
    let disasterSurveyList = that.data.disasterLists;
    let index = e.currentTarget.dataset.index;

    if (upName == 'datumArrayAudios') {
      disasterSurveyList[singleIndex].datumArrayisRecoding = !disasterSurveyList[singleIndex].datumArrayisRecoding;
    } else if (upName == 'sdosgAudios') {
      disasterSurveyList[singleIndex].sdosgisRecoding = !disasterSurveyList[singleIndex].sdosgisRecoding;
    } else if (upName == 'pictureArrayAudios') {
      disasterSurveyList[singleIndex].pictureArrayisRecoding = !disasterSurveyList[singleIndex].pictureArrayisRecoding;
    } else if (upName == 'fileArrayAudios') {
      disasterSurveyList[singleIndex].fileArrayisRecoding = !disasterSurveyList[singleIndex].fileArrayisRecoding;
    } else if (upName == 'sdopasAudios') {
      disasterSurveyList[singleIndex].sdopasisRecoding = !disasterSurveyList[singleIndex].sdopasisRecoding;
    } else if (upName == 'remarksAudios') {
      disasterSurveyList[singleIndex].remarksisRecoding = !disasterSurveyList[singleIndex].remarksisRecoding;
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
          'usage': "地址灾害调查",
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

          if (upName == 'datumArrayAudios') {
            disasterSurveyList[singleIndex].datumArrayAudiosData = disasterSurveyList[singleIndex].datumArrayAudiosData.concat(fileData.data);
            disasterSurveyList[singleIndex].datumArrayAudios = disasterSurveyList[singleIndex].datumArrayAudios.concat(server + fileData.data.uri);
          } else if (upName == 'sdosgAudios') {
            disasterSurveyList[singleIndex].sdosgAudiosData = disasterSurveyList[singleIndex].sdosgAudiosData.concat(fileData.data);
            disasterSurveyList[singleIndex].sdosgAudios = disasterSurveyList[singleIndex].sdosgAudios.concat(server + fileData.data.uri);
          } else if (upName == 'pictureArrayAudios') {
            disasterSurveyList[singleIndex].pictureArrayAudiosData = disasterSurveyList[singleIndex].pictureArrayAudiosData.concat(fileData.data);
            disasterSurveyList[singleIndex].pictureArrayAudios = disasterSurveyList[singleIndex].pictureArrayAudios.concat(server + fileData.data.uri);
          } else if (upName == 'fileArrayAudios') {
            disasterSurveyList[singleIndex].fileArrayAudiosData = disasterSurveyList[singleIndex].fileArrayAudiosData.concat(fileData.data);
            disasterSurveyList[singleIndex].fileArrayAudios = disasterSurveyList[singleIndex].fileArrayAudios.concat(server + fileData.data.uri);
          } else if (upName == 'sdopasAudios') {
            disasterSurveyList[singleIndex].sdopasAudiosData = disasterSurveyList[singleIndex].sdopasAudiosData.concat(fileData.data);
            disasterSurveyList[singleIndex].sdopasAudios = disasterSurveyList[singleIndex].sdopasAudios.concat(server + fileData.data.uri);
          } else if (upName == 'remarksAudios') {
            disasterSurveyList[singleIndex].remarksAudiosData = disasterSurveyList[singleIndex].remarksAudiosData.concat(fileData.data);
            disasterSurveyList[singleIndex].remarksAudios = disasterSurveyList[singleIndex].remarksAudios.concat(server + fileData.data.uri);
          }

          that.setData({
            disasterLists: disasterSurveyList
          });

        }
      })
    })
  },

  delData: function (e) {
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    let singleIndex = e.currentTarget.dataset.disasterindex;
    let disasterSurveyList = that.data.disasterLists;
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
              id: disasterSurveyList[singleIndex][targetList][index].id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
            },
            success: function (res) {
              let datas = disasterSurveyList[singleIndex][target];
              datas.splice(index, 1);
              disasterSurveyList[singleIndex][target] = datas;
              let dataList = disasterSurveyList[singleIndex][targetList];
              dataList.splice(index, 1);
              disasterSurveyList[singleIndex][targetList] = dataList;
              //disasterSurveyList = that.formatDisasterLists(disasterSurveyList)
              that.setData({
                disasterLists: disasterSurveyList
              })
              //that.saveAll();
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
    if (that.data.disasterLists.length === 0) {
      return;
    }
    wx.request({
      method: "POST",
      url: server + "/geologydisaster/saveall",
      data: that.data.disasterLists,
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      },
      success: function (res) {
        //let list = res.data;
        //list = that.formatDisasterLists(list);
        //that.setData({
        //  disasterLists: list
        //})
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
      title: '移除调查点',
      content: '点击确定移除本调查点（请谨慎操作）！',
      success: function (modalevent) {
        if (modalevent.confirm) {
          let serveyIndex = event.currentTarget.dataset.disasterindex;
          let disasterLists = that.data.disasterLists;
          let survey = disasterLists.splice(serveyIndex, 1)
          if (survey.id !== null) {
            wx.request({
              method: "POST",
              url: server + "/geologydisaster/delbyid?id=" + survey[0].id,
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
                  disasterLists: that.formatDisasterLists(disasterLists)
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
      }
    })
  },

  formatDisasterLists: function (disasterLists) {
    let intensityRange = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    let pooeoiRange = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    let ceoiRange = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    
    let typeRange = ['其它', '地裂', '滑坡', '堰塞', '崩塌', '砂土液化', '震陷'];
    let shapeRange = ['其它', '雁行式', '直线状', '锯齿状', '弧形', '地裂带'];
    let wonaghdmicRange = ['否', '是'];

    for (var i = 0; i < disasterLists.length; i++) {
      disasterLists[i].index = i;
      disasterLists[i].intensityRange = intensityRange;
      disasterLists[i].pooeoiRange = pooeoiRange;
      disasterLists[i].ceoiRange = ceoiRange;
      

      disasterLists[i].typeRange = typeRange;
      disasterLists[i].shapeRange = shapeRange;
      disasterLists[i].wonaghdmicRange = wonaghdmicRange;

      disasterLists[i].fileType = disasterLists[i].fileType === undefined ? "image" : disasterLists[i].fileType;

      disasterLists[i].datumArrayisRecoding = false;
      disasterLists[i].sdosgisRecoding = false;
      disasterLists[i].pictureArrayisRecoding = false;
      disasterLists[i].fileArrayisRecoding = false;
      disasterLists[i].sdopasisRecoding = false;
      disasterLists[i].remarksisRecoding = false;

      for (var j = 0; j < intensityRange.length; j++) {
        if (disasterLists[i].intensity === intensityRange[j]) {
          disasterLists[i].intensityIndex = j;
        }
      }

      for (var j = 0; j < pooeoiRange.length; j++) {
        if (disasterLists[i].pooeoi === pooeoiRange[j]) {
          disasterLists[i].pooeoiIndex = j;
        }
      }

      for (var j = 0; j < ceoiRange.length; j++) {
        if (disasterLists[i].ceoi === ceoiRange[j]) {
          disasterLists[i].ceoiIndex = j;
        }
      }
      
      for (var j = 0; j < typeRange.length; j++) {
        if (disasterLists[i].type === typeRange[j]) {
          disasterLists[i].typeIndex = j;
        }
      }

      for (var j = 0; j < shapeRange.length; j++) {
        if (disasterLists[i].shape === shapeRange[j]) {
          disasterLists[i].shapeIndex = j;
        }
      }

      for (var j = 0; j < wonaghdmicRange.length; j++) {
        if (disasterLists[i].wonaghdmic === wonaghdmicRange[j]) {
          disasterLists[i].wonaghdmicIndex = j;
        }
      }

    }
    return disasterLists;
  },
  //前台input发生改动之后自动更新后台值
  replaceContent: function (event, keyStr) {
    let that = this;
    let key = event.detail.value;
    let disasterLists = that.data.disasterLists;
    let singleIndex = event.currentTarget.dataset.disasterindex;
    disasterLists[singleIndex][keyStr] = key;
    that.setData({
      disasterLists: disasterLists
    })
  },
  bindinputName: function (e) {
    this.replaceContent(e, "name");
  },
  bindinputLng: function (e) {
    this.replaceContent(e, "lng");
  },
  bindinputLat: function (e) {
    this.replaceContent(e, "lat");
  },
  bindinputIntensityIndex: function (e) {
    this.replaceContent(e, "intensityIndex");
  },
  bindinputTime: function (e) {
    this.replaceContent(e, "time");
  },
  bindinputSize: function (e) {
    this.replaceContent(e, "size");
  },
  bindinputAdderss: function (e) {
    this.replaceContent(e, "adderss");
  },
  bindinputlsc: function (e) {
    this.replaceContent(e, "lsc");
  },
  bindinputhc: function (e) {
    this.replaceContent(e, "hc");
  },
  bindinputaodm: function (e) {
    this.replaceContent(e, "aodm");
  },
  bindinputaAderss: function (e) {
    this.replaceContent(e, "aderss");
  },
  datumArrayfileTypeChange: function (e) {
    this.replaceContent(e, "datumArrayfileType");
  },
  bindStatus: function (e) {
    this.replaceContent(e, "status");
  },
  sdosgfileTypeChange: function (e) {
    this.replaceContent(e, "sdosgfileType");
  },
  pictureArrayfileTypeChange: function (e) {
    this.replaceContent(e, "pictureArrayfileType");
  },
  fileArrayfileTypeChange: function (e) {
    this.replaceContent(e, "fileArrayfileType");
  },
  sdopasfileTypeChange: function (e) {
    this.replaceContent(e, "sdopasfileType");
  },
  remarksfileTypeChange: function (e) {
    this.replaceContent(e, "remarksfileType");
  }
})