// pages/partlevel1/partlevel1.js
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
const server = app.globalData.server;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailSeismic: {},
    images: [],
    audios: [],
    videos: [],
    parts: [],
    assessId: "",
    isRecoding: false,
    judgement: ["完好", "毁坏", "严重破坏"],
    judgementIndex: 0
  },
  bindRadioChange: function(e) {
    let that = this;
    let detailSeismic = that.data.detailSeismic;
    detailSeismic.intuited = !detailSeismic.intuited;
    console.log(this.data.detailSeismic)
    that.setData({
      detailSeismic: detailSeismic
    })
    that.saveAll();
  },
  bindJudgementChange :function(e){
    let that = this;
    let detailSeismic = that.data.detailSeismic;
    let judgementIndex=parseInt(e.detail.value);
    detailSeismic.intuitJudgement = that.data.judgement[judgementIndex];
    that.setData({
      detailSeismic: detailSeismic,
      judgementIndex: judgementIndex
    });
    that.saveAll();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    let that = this;
    if (!utils.checkSession()) {
      wx.navigateBack({

      })
      return;
    }
    wx.request({
      method: "GET",
      url: server + "/StructurePart/getSubPartByAssessId",
      data: {
        assessId: options.assessId
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      },
      success: function(res) {
        console.log(res.data)
        let detailSeismic = res.data.result.detailSeismic;
        let judgementIndex = that.data.judgementIndex;
        if (detailSeismic.intuitJudgement){
          let judgement = that.data.judgement;
          for(let i=0;i<judgement.length;i++){
            if (judgement[i] == detailSeismic.intuitJudgement){
              judgementIndex=i;
              break;
            }
          }
        }
        that.setData({
          judgementIndex: judgementIndex,
          assessId: options.assessId,
          detailSeismic: detailSeismic,
          parts: res.data.result.parts,
          images: res.data.result.detailSeismic.images,
          videos: res.data.result.detailSeismic.videos,
          audios: res.data.result.detailSeismic.audios
        })

      },
      fail: function(res) {
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        })
        wx.navigateBack({

        })
      }
    })
  },

  chooseImage: function(e) {
    console.log(e)
    let that = this;
    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
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
            'usage': "细部震损",
            "typeId":1
          },
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function(res) {
            let fileData = JSON.parse(res.data);
            if (fileData.errorMsg !== 'ok') {
              wx.showModal({
                title: '操作失败',
                content: '请检查网络或其他因素',
              })
              return;
            }
            let detailSeismic = that.data.detailSeismic || {};
            console.log(detailSeismic);
            let images = that.data.images || [];
            let imageList = detailSeismic.imageList || [];
            detailSeismic.imageList = imageList.concat(fileData.data);
            images = images.concat(server + fileData.data.uri)
            detailSeismic.images = images;
            that.setData({
              images: images,
              detailSeismic: detailSeismic
            });
            that.saveAll();
          }
        })

      }
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },
  chooseVideo: function(e) {
    console.log(e)
    let that = this;
    let singleIndex = e.currentTarget.dataset.singleindex;
    let singleSurveyList = that.data.singleSurveyList;
    wx.chooseVideo({
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      maxDuration: 30,
      camera: 'back',
      success: function(res) {
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
            'usage': "细部震损",
            "typeId":2
          },
          filePath: res.tempFilePath,
          name: 'file',
          success: function(res) {

            let fileData = JSON.parse(res.data);
            if (fileData.errorMsg !== 'ok') {
              wx.showModal({
                title: '操作失败',
                content: '请检查网络或其他因素',
              })
              return;
            }
            let detailSeismic = that.data.detailSeismic || {};
            console.log(detailSeismic);
            let videos = that.data.videos || [];
            let videoList = detailSeismic.videoList || [];
            detailSeismic.videoList = videoList.concat(fileData.data);
            videos = videos.concat(server + fileData.data.uri)
            detailSeismic.videos = videos;
            that.setData({
              videos: videos,
              detailSeismic: detailSeismic
            });
            that.saveAll();
          }
        })

      }
    })
  },
  chooseAudio: function(e) {
    recorderManager.start(options);
    this.setData({
      isRecoding: true
    })
  },
  stopAudio: function(e) {
    recorderManager.stop();
    console.log(e)
    let that = this;
    this.setData({
      isRecoding: false
    })
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
          'usage': "细部震损",
          "typeId": 3
        },
        filePath: res.tempFilePath,
        name: 'file',
        success: function(res) {
          let fileData = JSON.parse(res.data);
          if (fileData.errorMsg !== 'ok') {
            wx.showModal({
              title: '操作失败',
              content: '请检查网络或其他因素',
            })
            return;
          }
          let detailSeismic = that.data.detailSeismic || {};
          console.log(detailSeismic);
          let audios = that.data.audios || [];
          let audioList = detailSeismic.audioList || [];
          detailSeismic.audioList = audioList.concat(fileData.data);
          audios = audios.concat(server + fileData.data.uri)
          detailSeismic.audios = audios;
          that.setData({
            audios: audios,
            detailSeismic: detailSeismic
          });
          that.saveAll();
        }
      })

    })
  },

  saveAll: function() {
    let that = this;
    let detailSeismic = that.data.detailSeismic;
    detailSeismic.customerId = app.globalData.customer.id;
    wx.request({
      method: "POST",
      url: server + "/DetailSeismic/save",
      data: detailSeismic,
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      },
      success: function(res) {
        that.setData({
          detailSeismic: res.data
        })
        wx.showToast({
          title: '保存成功',
          icon: "success",
          duration: 500
        })
      },
      fail: function(res) {
        wx.showModal({
          title: '操作失败',
          content: '请检查网络或其他问题后重试',
        })
      }
    })
  },
  delData: function(e) {
    let typ = e.currentTarget.dataset.typ;
    let index = e.currentTarget.dataset.index;
    let that = this;
    let typs = that.data[typ];
    wx.showModal({
      title: '删除操作',
      content: '点击确定删除',
      success: function(eve) {
        if (eve.confirm) {
          typs.splice(index, 1);
          let detailSeismic = that.data.detailSeismic;
          detailSeismic[typ] = typs;
          if (typ == "images") {
            that.setData({
              images: typs
            })
            detailSeismic.imageList.splice(index, 1);
          } else if (typ == "audios") {
            that.setData({
              audios: typs
            })
            detailSeismic.audioList.splice(index, 1);
          } else if (typ == "videos") {
            that.setData({
              videos: typs
            })
            detailSeismic.videoList.splice(index, 1);
          } else {

          }
          that.setData({
            detailSeismic: detailSeismic
          })
          that.saveAll()
        }
      }
    })

  }
})