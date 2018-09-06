// pages/monomersSurveyMonomers/monomersSurveyMonomers.js
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
    mId: "",
    earthquakeId: "",
    monomersSurvey: {},
    monomersSurveyLists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    
    that.setData({
      mId: options.mid,
      earthquakeId: options.earthquakeId
    });
    
    let monomersSurveyLists = [];
      if (!utils.checkSession()) {
        wx.navigateBack({
        });
        return;
      }

      wx.request({
        method: "GET",
        url: server + "/lifeLineMonomers/getByMIdAndEid",
        data: {
          mId: options.mid,
          earthquakeId: options.earthquakeId
        },
        header: {
          'content-type': 'application/json',
          'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
        }, success: function (res) {
          monomersSurveyLists = that.formatmonomersSurveyLists(res.data);

          for (var i = 0; i < monomersSurveyLists.length; i++) {
            monomersSurveyLists[i].status = "working";
            monomersSurveyLists[i].fileType = 'image';
          }
          that.setData({
            monomersSurveyLists: monomersSurveyLists,
            earthquakeId: options.earthquakeId
          });
        }, fail: function (res) {
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
    let monomersSurvey = {};
    let dateTime = utils.formatTime(new Date());
    let monomersSurveyLists = that.data.monomersSurveyLists || [];
    monomersSurvey.ownerId = app.globalData.customer.id;
    monomersSurvey.earthquakeId = that.data.earthquakeId;
    monomersSurvey.mId = that.data.mId;
    monomersSurvey.index = monomersSurveyLists.length;
    monomersSurvey.adderss = '';//设施位置
    monomersSurvey.lng = '';//经度
    monomersSurvey.lat = '';//纬度
    monomersSurvey.time = dateTime;//调查时间
    monomersSurvey.name = '';//设施名称

    //主要结构形式
    monomersSurvey.msfRange = ['给（排）水系统', '燃气系统', '输油系统', '交通系统', '电力系统', '广播通信系统', '热力系统', '水利工程', '生命线工程设备', '其它'];
    monomersSurvey.msfIndex = 0;
    monomersSurvey.msf = '给（排）水系统';

    //破坏前状况 Pre destruction condition
    monomersSurvey.pdcRange = ['轻度损坏', '已废弃', '完好'];
    monomersSurvey.pdcIndex = 0;
    monomersSurvey.pdc = '轻度损坏';

    //破坏等级 damage grade
    monomersSurvey.damageGradeRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏','V损坏'];
    monomersSurvey.damageGradeIndex = 0;
    monomersSurvey.damageGrade = 'I级基本完好';

    //设防烈度 Fortification intensity
    monomersSurvey.fortificationIntensityRange = ['6度', '7度', '8度', '9度'];
    monomersSurvey.fortificationIntensityIndex = 0;
    monomersSurvey.fortificationIntensity = '6度';

    //场地类别 Site category
    monomersSurvey.siteCategoryRange = ['1类', '2类', '3类', '4类'];
    monomersSurvey.siteCategoryIndex = 0;
    monomersSurvey.siteCategory = '1类';

    //建造材料
    monomersSurvey.buildingMaterials = '';

    //建筑年代
    monomersSurvey.architecturalAge = '';

    //地震烈度 Earthquake intensity
    monomersSurvey.earthquakeIntensityRange = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    monomersSurvey.earthquakeIntensityIndex = 0;
    monomersSurvey.earthquakeIntensity = 'I';

    //中断时间 Interruption time
    monomersSurvey.interruptionTime = '';

    //恢复时间 recovery time
    monomersSurvey.recoveryTime = '';

    //中断期间对应急救灾的影响 Impact of interruption period on emergency relief
    monomersSurvey.ioipoer = '';

    //引起生命线工程震害的主要原因 Main causes of earthquake damage to Lifeline Engineering
    monomersSurvey.mcoedtleRange = ['强震动作用', '地面破坏（地基液化、沉降、滑坡、崩塌等)', '两者均有'];
    monomersSurvey.mcoedtleIndex = 0;
    monomersSurvey.mcoedtle = '强震动作用';

    monomersSurvey.fileType = "image";
    monomersSurvey.isRecoding = false;
    monomersSurvey.audios = [];
    monomersSurvey.videos = [];
    monomersSurvey.images = [];
    monomersSurvey.audiosData = [];
    monomersSurvey.videosData = [];
    monomersSurvey.imagesData = [];

    //--------------------------------------------------------------------------------------------------------
    //水池或水处理池 Pool or water treatment pond
    monomersSurvey.powtpRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏','V损坏'];
    monomersSurvey.powtpIndex = 0;
    monomersSurvey.powtp = 'I级基本完好';

    //水厂处理 Water treatment plant
    monomersSurvey.wtpRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    monomersSurvey.wtpIndex = 0;
    monomersSurvey.wtp = 'I级基本完好';

    //取水井站及供水泵站 Intake well station and water supply pumping station
    monomersSurvey.iwsawspsRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    monomersSurvey.iwsawspsIndex = 0;
    monomersSurvey.iwsawsps = 'I级基本完好';

    //供水管网 Water supply network
    monomersSurvey.wsnRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    monomersSurvey.wsnIndex = 0;
    monomersSurvey.wsn = 'I级基本完好';
    //--------------------------------------------------------------------------------------------------------

    //门站 Gate Station
    monomersSurvey.gateStationRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    monomersSurvey.gateStationIndex = 0;
    monomersSurvey.gateStation = 'I级基本完好';

    //煤气罐 Gas storage tank
    monomersSurvey.gstRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    monomersSurvey.gstIndex = 0;
    monomersSurvey.gst = 'I级基本完好';
      
    //输气管线 Gas transmission pipeline
    monomersSurvey.gtpRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    monomersSurvey.gtpIndex = 0;
    monomersSurvey.gtp = 'I级基本完好';
    //--------------------------------------------------------------------------------------------------------

    //道路 road
    monomersSurvey.roadRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    monomersSurvey.roadIndex = 0;
    monomersSurvey.road = 'I级基本完好';

    //桥梁 bridge
    monomersSurvey.bridgeRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    monomersSurvey.bridgeIndex = 0;
    monomersSurvey.bridge = 'I级基本完好';

    //隧道 tunnel
    monomersSurvey.tunnelRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    monomersSurvey.tunnelIndex = 0;
    monomersSurvey.tunnel = 'I级基本完好';

    //铁道线路 Railway line
    monomersSurvey.railwayLineRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    monomersSurvey.railwayLineIndex = 0;
    monomersSurvey.railwayLine = 'I级基本完好';
    //--------------------------------------------------------------------------------------------------------
    //发电厂 Power plant
    monomersSurvey.powerPlantRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    monomersSurvey.powerPlantIndex = 0;
    monomersSurvey.powerPlant = 'I级基本完好';

    //变（配）电站  Substation
    monomersSurvey.substationRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    monomersSurvey.substationIndex = 0;
    monomersSurvey.substation = 'I级基本完好';

    //输电线路 Transmission line
    monomersSurvey.transmissionLineRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    monomersSurvey.transmissionLineIndex = 0;
    monomersSurvey.transmissionLine = 'I级基本完好';
    //--------------------------------------------------------------------------------------------------------
    //中心控制室 Central control room
    monomersSurvey.centralControlRoomRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    monomersSurvey.centralControlRoomIndex = 0;
    monomersSurvey.centralControlRoom = 'I级基本完好';

    //通信线路 Communication line
    monomersSurvey.communicationLineRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    monomersSurvey.communicationLineIndex = 0;
    monomersSurvey.communicationLine = 'I级基本完好';
    //--------------------------------------------------------------------------------------------------------

    //用来控制删除
    monomersSurvey.status = 'working';

    //地址选择
    wx.chooseLocation({
      success: function (res) {
        monomersSurvey.lat = res.latitude;
        monomersSurvey.lng = res.longitude;
        monomersSurvey.name = res.address + " " + res.name;
        monomersSurvey.adderss = res.address + " " + res.name;
        monomersSurveyLists.push(monomersSurvey);
        that.setData({
          monomersSurveyLists: monomersSurveyLists
        })
      },
    })
  },

  //主要结构形式
  bindMsfChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].msfIndex = val;
    monomersSurveyLists[singleIndex].msf = monomersSurveyLists[singleIndex].msfRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    })
  },
  
  //破坏前状况
  bindPdcChange: function(event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].pdcIndex = val;
    monomersSurveyLists[singleIndex].pdc = monomersSurveyLists[singleIndex].pdcRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    })
  },

  //破坏等级 
  bindDamageGradeChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].damageGradeIndex = val;
    monomersSurveyLists[singleIndex].damageGrade = monomersSurveyLists[singleIndex].damageGradeRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    })
  },

  //设防烈度
  bindFortificationIntensityChange: function(event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].fortificationIntensityIndex = val;
    monomersSurveyLists[singleIndex].fortificationIntensity = monomersSurveyLists[singleIndex].fortificationIntensityRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    })
  },

  //场地类别
  bindSiteCategoryChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].siteCategoryIndex = val;
    monomersSurveyLists[singleIndex].siteCategory = monomersSurveyLists[singleIndex].siteCategoryRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    })
  },

  //地震烈度
  bindEarthquakeIntensityChange: function(event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].earthquakeIntensityIndex = val;
    monomersSurveyLists[singleIndex].earthquakeIntensity = monomersSurveyLists[singleIndex].earthquakeIntensityRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    })
  },

  //引起生命线工程震害的主要原因
  bindMcoedtleChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].mcoedtleIndex = val;
    monomersSurveyLists[singleIndex].mcoedtle = monomersSurveyLists[singleIndex].mcoedtleRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    })
  },
  
  //水池或水处理池
  bindPowtpChange: function(event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].powtpIndex = val;
    monomersSurveyLists[singleIndex].powtp = monomersSurveyLists[singleIndex].powtpRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    });

    let powtp = monomersSurveyLists[singleIndex].powtpRange[val];

    let text = '';
    if (powtp === 'I级基本完好'){
      text = '注:基本无震损，或个别构件有细微裂缝，功能正常';
    } else if (powtp === 'II级轻微破坏'){
      text = '注:个别构件出现变形或明显裂缝，池壁出现渗漏，需要进行维护';
    } else if (powtp === 'III中等破坏') {
      text = '注:部分构件发生倾斜、下沉或出现明显裂缝，池壁多处渗漏，需要进行维修';
    } else if (powtp === 'IV严重破坏') {
      text = '注:多数构件发生倾斜、下沉或出现贯通裂缝，局部坍塌，池壁喷漏，需要进行大修后才能恢复正常功能';
    } else if (powtp === 'V损坏') {
      text = '注:整座水池坍塌，储水漏光，需重建';
    }
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  },
  
  //水厂处理
  bindWtpChange: function(event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].wtpIndex = val;
    monomersSurveyLists[singleIndex].wtp = monomersSurveyLists[singleIndex].wtpRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    })
  },

  //取水井站及供水泵站
  bindIwsawspsChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].iwsawspsIndex = val;
    monomersSurveyLists[singleIndex].iwsawsps = monomersSurveyLists[singleIndex].iwsawspsRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    })
  },

  //供水管网
  bindWsnChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].wsnIndex = val;
    monomersSurveyLists[singleIndex].wsn = monomersSurveyLists[singleIndex].wsnRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    });
  },

  //门站
  bindGateStationChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].gateStationIndex = val;
    monomersSurveyLists[singleIndex].gateStation = monomersSurveyLists[singleIndex].gateStationRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    });

    let gateStation = monomersSurveyLists[singleIndex].gateStationRange[val];
    let text = '';
    if (gateStation === 'I级基本完好') {
      text = '注:各类设施、设备均无破损，建筑物基本完好';
    } else if (gateStation === 'II级轻微破坏') {
      text = '注:各类设施、设备基本完好，建筑物轻微破坏，需进行维护';
    } else if (gateStation === 'III中等破坏') {
      text = '注:个别机械和电气设备轻微破坏，或建筑物中等破坏，需进行维修';
    } else if (gateStation === 'IV严重破坏') {
      text = '注:泵设备严重破坏，建筑物严重破坏，必须经大修方能正常使用';
    } else if (gateStation === 'V损坏') {
      text = '注:多数设备毁坏，建筑物毁坏，需重建';
    }
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  },

  //煤气罐
  bindGstChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].gstIndex = val;
    monomersSurveyLists[singleIndex].gst = monomersSurveyLists[singleIndex].gstRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    });

    let gst = monomersSurveyLists[singleIndex].gstRange[val];
    let text = '';
    if (gst === 'I级基本完好') {
      text = '注:罐体无破损，支承构件完好或有轻微变形';
    } else if (gst === 'II级轻微破坏') {
      text = '注:罐体无破损，支承构件轻微破坏，需进行维护';
    } else if (gst === 'III中等破坏') {
      text = '注:罐体局部发生轻微变形，支承结构破损，需进行维修';
    } else if (gst === 'IV严重破坏') {
      text = '注:罐体局部发生屈曲或明显变形,支承结构有损坏，必须经大修方能正常使用';
    } else if (gst === 'V损坏') {
      text = '注:罐体破裂、漏气，支承结构倒塌或失稳，需重建';
    }
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  },

  //输气管线
  bindGtpChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].gtpIndex = val;
    monomersSurveyLists[singleIndex].gtp = monomersSurveyLists[singleIndex].gtpRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    });

    let gtp = monomersSurveyLists[singleIndex].gtpRange[val];
    let text = '';
    if (gtp === 'I级基本完好'){
      text = '注:管道基本无破损，功能正常';
    } else if (gtp === 'II级轻微破坏'){
      text = '注:管道局部出现小的漏气点，平均每10km泄漏点数小于2，输气功能基本正常。需进行管道维护';
    } else if (gtp === 'III中等破坏') {
      text = '注:管道破裂、漏气，平均每10km泄漏点数介于2和5之间，输气功能基本丧失。需进行抢修';
    } else if (gtp === 'IV严重破坏') {
      text = '注:管道断裂并严重泄漏，平均每10km泄漏点数介于5和12之间，输气功能丧失。必须经大修方能正常使用';
    } else if (gtp === 'V损坏') {
      text = '注:输气管道平均每10km泄漏点数大于12,需重建';
    }
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    });
  },

  //道路
  bindRoadChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].roadIndex = val;
    monomersSurveyLists[singleIndex].road = monomersSurveyLists[singleIndex].roadRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    });

    let road = monomersSurveyLists[singleIndex].roadRange[val];
    let text = '';
    if (road === 'I级基本完好') {
      text = '注:路面、路堤未受破损或破损甚微，可通行';
    } else if (road === 'II级轻微破坏') {
      text = '注:路肩、挡土墙、垒面、路堑有细裂缝，路面轻微下陷或隆起，出现细裂缝或小于15 cm的下 沉，造成一定的行车障碍，仍可通行';
    } else if (road === 'III中等破坏') {
      text = '注:路面出现一定程度的下陷或隆起，如小的不均匀塌陷。斜坡崩坏，石头滚落，虽可通行，需谨慎行车，需要进行修复后才能通行';
    } else if (road === 'IV严重破坏') {
      text = '注:路面出现大的不均匀沉陷、明显裂缝、隆起，通行困难，需限制通行，需要进行大修后才能通行';
    } else if (road === 'V损坏') {
      text = '注:路面出现大的断裂和错位，有大于50cm的沉陷或悬空，或路堤发生崩塌或由于崩塌、滑坡岩土堵塞路面，已无法行车，需重建';
    }
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    });
  },

  //桥梁
  bindBridgeChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].bridgeIndex = val;
    monomersSurveyLists[singleIndex].bridge = monomersSurveyLists[singleIndex].bridgeRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    });

    let bridge = monomersSurveyLists[singleIndex].bridgeRange[val];
    let text = '';
    if (bridge === 'I级基本完好') {
      text = '注:结构构件完好，桥面无明显变形，个别非结构构件可有破损,不需修理可继续使用';
    } else if (bridge === 'II级轻微破坏') {
      text = '注:桥台、桥面、桥墩、桥拱、桥塔、主梁等的混凝土部件表面出现细裂缝，局部表面混凝土剥落，支撑连接部位轻微变形，不需修理或稍加修理即可通行';
    } else if (bridge === 'III中等破坏') {
      text = '注:桥墩混凝土出现明显裂缝，梁移位，梁端混凝土出现明显裂缝，拱脚有明显裂缝，桥塔结构轻微变形，墩台轻微移动，出现明显裂缝，引桥下沉，支座与梁连接的螺栓部分剪断，震后需 限制通行（限速、限载），需要进行加固修复后才能正常通行';
    } else if (bridge === 'IV严重破坏') {
      text = '注:桥墩混凝土出现贯通裂缝、剥落，梁、拱出现贯通裂缝或破碎，桥塔结构变形，悬索或拉索 (杆)锚具出现滑动，墩台滑移、断裂或严重倾斜，基础破坏明显。需要进行大修后才能通行';
    } else if (bridge === 'V损坏') {
      text = '注:落梁、塌拱、墩台折断、倒塔、断索等现象已经发生或随时可能发生，整个桥梁已不能使用，需重建';
    }
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    });
  },

  //隧道
  bindTunnelChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].tunnelIndex = val;
    monomersSurveyLists[singleIndex].tunnel = monomersSurveyLists[singleIndex].tunnelRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    });

    let tunnel = monomersSurveyLists[singleIndex].tunnelRange[val];
    let text = '';
    if (tunnel === 'I级基本完好') {
      text = '注:隧道衬砌表面有细裂缝，但无衬砌或围岩材料掉落现象及可能性，可正常使用';
    } else if (tunnel === 'II级轻微破坏') {
      text = '注:隧道入口处的地面轻微下陷，隧道衬砌表面出现稀疏的细裂缝，局部衬砌或围岩材料掉落，稍加修理后能恢复正常使用';
    } else if (tunnel === 'III中等破坏') {
      text = '注:隧道衬砌出现许多细裂缝,多处衬砌或围岩材料掉落，隧道人口处的地面下陷明显，妨碍通行，需要进行修复后才能正常使用';
    } else if (tunnel === 'IV严重破坏') {
      text = '注:隧道衬砌广泛出现明显裂缝，大块衬砌或围岩材料脱落，隧道入口地面严重下陷，隧道已不能使用，需要进行大修后才能正常使用';
    } else if (tunnel === 'V损坏') {
      text = '注:隧道衬砌结构错位、断裂，部分断面隧道结构坍塌，需重建';
    }
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    });
  },

  //铁道线路
  bindRailwayLineChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].railwayLineIndex = val;
    monomersSurveyLists[singleIndex].railwayLine = monomersSurveyLists[singleIndex].railwayLineRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    });

    let railwayLine = monomersSurveyLists[singleIndex].railwayLineRange[val];
    let text = '';
    if (railwayLine === 'I级基本完好') {
      text = '注:路基和轨道均无明显变形，能正常使用';
    } else if (railwayLine === 'II级轻微破坏') {
      text = '注:由于地表不均匀沉陷或水平变形导致局部路基和轨道轻度脱离或变形，稍加修理后能正常使用';
    } else if (railwayLine === 'III中等破坏') {
      text = '注:由于地表明显的不均匀沉陷或水平变形导致路基严重变形,局部沉陷，轨道变形明显，并 与路基脱离，已不能正常使用，需要进行轨道和路基维修后才能正常使用';
    } else if (railwayLine === 'IV严重破坏') {
      text = '注:由于较大的地表不均匀沉陷或水平变形、地裂缝等，导致一定长度内的整段轨道出现蛇形弯曲变形、移位，需要进行大修后才能正常使用';
    } else if (railwayLine === 'V损坏') {
      text = '注:由于塌陷、滑坡、地裂缝等场地破坏导致很大长度内的整段路基的变形、移位、塌陷，轨道 变形、移位、悬空、断裂等，需重建';
    }
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    });
  },

  //发电厂
  bindPowerPlantChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].powerPlantIndex = val;
    monomersSurveyLists[singleIndex].powerPlant = monomersSurveyLists[singleIndex].powerPlantRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    });

    let powerPlant = monomersSurveyLists[singleIndex].powerPlantRange[val];
    let text = '';
    if (powerPlant === 'I级基本完好') {
      text = '注:发电设备及建筑物基本无破损，功能正常';
    } else if (powerPlant === 'II级轻微破坏') {
      text = '注:发电设备轻微变形，局部破损，或建筑物轻微破坏,稍加修理能正常运行';
    } else if (powerPlant === 'III中等破坏') {
      text = '注:设备柜、仪表架等移位、变形，锅炉和压力容器中等破坏，或建筑物中等破坏，需要进行维修';
    } else if (powerPlant === 'IV严重破坏') {
      text = '注:发电设备严重破坏，或建筑物严重破坏，需要进行大修后才能恢复正常功能';
    } else if (powerPlant === 'V损坏') {
      text = '注:多数发电设备毁坏，或建筑物毁坏，需重建';
    }
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    });
  },

  //变（配）电站
  bindSubstationChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].substationIndex = val;
    monomersSurveyLists[singleIndex].substation = monomersSurveyLists[singleIndex].substationRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    });

    let substation = monomersSurveyLists[singleIndex].substationRange[val];
    let text = '';
    if (substation === 'I级基本完好') {
      text = '注:设备基本完好，建筑物基本完好。功能基本正常';
    } else if (substation === 'II级轻微破坏') {
      text = '注:个别隔离开关和断路器破损或建筑物轻微破坏，经检修可迅速恢复正常功能';
    } else if (substation === 'III中等破坏') {
      text = '注:部分隔离开关、断路器和变压器破损或建筑物中等破坏，功能基本丧失需要一定时间的检修才能恢复正常功能';
    } else if (substation === 'IV严重破坏') {
      text = '注:多数隔离开关、断路器、变压器、电流(压)互感器和避雷器等设备严重破坏或建筑物严功能丧失，需要进行大修后才能恢复正常功能';
    } else if (substation === 'V损坏') {
      text = '注:多数设备毁坏，建筑物毁坏，须重建';
    }
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    });
  },

  //输电线路
  bindTransmissionLineChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].transmissionLineIndex = val;
    monomersSurveyLists[singleIndex].transmissionLine = monomersSurveyLists[singleIndex].transmissionLineRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    });

    let transmissionLine = monomersSurveyLists[singleIndex].transmissionLineRange[val];
    let text = '';
    if (transmissionLine === 'I级基本完好') {
      text = '注:线路无宏观震害，正常供电';
    } else if (transmissionLine === 'II级轻微破坏') {
      text = '注:输电线路出现塔架或线杆破损现象，平均每10km破损处数小于2，仍能供电，需要进行线路维护';
    } else if (transmissionLine === 'III中等破坏') {
      text = '注:输电线路出现塔架或线杆倾斜、破损以及绝缘子破损现象，局部线杆折断、塔架倒伏，平均每10km破损处数介于2和5之间，需要进行检修后才能正常供电';
    } else if (transmissionLine === 'IV严重破坏') {
      text = '注:部分塔架、线杆倾斜、倒伏、折断，线路被拉断，平均每10km损坏处数介于5和12之间，需要进行大修后才能恢复正常功能';
    } else if (transmissionLine === 'V损坏') {
      text = '注:多数塔架、线杆破坏，线路多处被拉断，平均每10km损坏处数大于12，输电线路需要重新架设';
    }
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    });
  },

  //中心控制室 Central control room
  bindCentralControlRoomChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].centralControlRoomIndex = val;
    monomersSurveyLists[singleIndex].centralControlRoom = monomersSurveyLists[singleIndex].centralControlRoomRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    });

    let centralControlRoom = monomersSurveyLists[singleIndex].centralControlRoomRange[val];
    let text = '';
    if (centralControlRoom === 'I级基本完好') {
      text = '注:通信设备无震损，建筑物基本完好';
    } else if (centralControlRoom === 'II级轻微破坏') {
      text = '注:通信设备无明显破损，建筑物轻微破坏，需要进行设备维护';
    } else if (centralControlRoom === 'III中等破坏') {
      text = '注:部分通信设备移位，建筑物中等破坏，需进行设备检修和房屋排险加固后才能恢复正常功能';
    } else if (centralControlRoom === 'IV严重破坏') {
      text = '注:多数通信设备倾斜、移位，功能失效，建筑物严重破坏，必须经大修方能恢复正常功能';
    } else if (centralControlRoom === 'V损坏') {
      text = '注:多数通信设备毁坏，建筑物毁坏，需要重建';
    }
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    });
  },

  //通信线路
  bindCommunicationLineChange: function (event) {
    let that = this;
    let val = event.detail.value;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex].communicationLineIndex = val;
    monomersSurveyLists[singleIndex].communicationLine = monomersSurveyLists[singleIndex].communicationLineRange[val];
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    });

    let communicationLine = monomersSurveyLists[singleIndex].communicationLineRange[val];
    let text = '';
    if (communicationLine === 'I级基本完好') {
      text = '注:线路无宏观震害，正常运行';
    } else if (communicationLine === 'II级轻微破坏') {
      text = '注:局部传输明线出现线杆倾斜现象，但线路未断，10km破损处数小于2，稍加检修能恢复正常';
    } else if (communicationLine === 'III中等破坏') {
      text = '注:传输明线出现线杆倾斜、倒伏现象，局部线杆折断，线路拉断，地下线缆由于变形过大而断裂，10km破坏处数介于2和5之间，需要进行检修才能恢复正常功能';
    } else if (communicationLine === 'IV严重破坏') {
      text = '注:出现线杆折断、倒伏，明线拉断、地下电缆断裂等破坏现象，10km破坏处数介于5和12之间，需要进行大修后才能正常使用';
    } else if (communicationLine === 'V损坏') {
      text = '注:线杆倾斜、倒伏、折断及断线等破坏现象多发，地下电缆遭到严重破坏，10 km破坏处数大于12，需要重建';
    }
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    });
  },

  //图片上传
  chooseImage: function (e) {
    let that = this;
    let singleIndex = e.currentTarget.dataset.monomerssurveyindex;
    let upName = e.currentTarget.dataset.upname;
    let monomersSurveyLists = that.data.monomersSurveyLists;
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
            'usage': "生命线单体调查附件图片",
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
              monomersSurveyLists[singleIndex].imagesData = monomersSurveyLists[singleIndex].imagesData.concat(fileData.data);
              monomersSurveyLists[singleIndex].images = monomersSurveyLists[singleIndex].images.concat(server + fileData.data.uri);
            }
            that.setData({
              monomersSurveyLists: monomersSurveyLists
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
    let singleIndex = e.currentTarget.dataset.monomerssurveyindex;
    let monomersSurveyLists = that.data.monomersSurveyLists;
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
              monomersSurveyLists[singleIndex].videosData = monomersSurveyLists[singleIndex].videosData.concat(fileData.data);
              monomersSurveyLists[singleIndex].videos = monomersSurveyLists[singleIndex].videos.concat(server + fileData.data.uri);
            }

            that.setData({
              monomersSurveyLists: monomersSurveyLists
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
    let singleIndex = e.currentTarget.dataset.monomerssurveyindex;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let index = e.currentTarget.dataset.index;

    if (upName == 'audios') {
      monomersSurveyLists[singleIndex].isRecoding = !monomersSurveyLists[singleIndex].isRecoding;
    }

    that.setData({
      monomersSurveyLists: monomersSurveyLists
    })
  },

  //录音结束,上传
  stopAudio: function (e) {
    recorderManager.stop();
    let that = this;
    let upName = e.currentTarget.dataset.upname;
    let singleIndex = e.currentTarget.dataset.monomerssurveyindex;
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let index = e.currentTarget.dataset.index;

    if (upName == 'audios') {
      monomersSurveyLists[singleIndex].isRecoding = !monomersSurveyLists[singleIndex].isRecoding;
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
            monomersSurveyLists[singleIndex].audiosData = monomersSurveyLists[singleIndex].audiosData.concat(fileData.data);
            monomersSurveyLists[singleIndex].audios = monomersSurveyLists[singleIndex].audios.concat(server + fileData.data.uri);
          }

          that.setData({
            monomersSurveyLists: monomersSurveyLists
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
    let singleIndex = e.currentTarget.dataset.monomerssurveyindex;
    let monomersSurveyLists = that.data.monomersSurveyLists;
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
              id: monomersSurveyLists[singleIndex][targetList][index].id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
            },
            success: function (res) {
              let datas = monomersSurveyLists[singleIndex][target];
              datas.splice(index, 1);
              monomersSurveyLists[singleIndex][target] = datas;
              let dataList = monomersSurveyLists[singleIndex][targetList];
              dataList.splice(index, 1);
              monomersSurveyLists[singleIndex][targetList] = dataList;
              //monomersSurveyLists = that.formatmonomersSurveyLists(monomersSurveyLists)
              that.setData({
                monomersSurveyLists: monomersSurveyLists
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

  //初始化
  formatmonomersSurveyLists: function (monomersSurveyLists) {
    let msfRange = ['给（排）水系统', '燃气系统', '输油系统', '交通系统', '电力系统', '广播通信系统', '热力系统', '水利工程', '生命线工程设备', '其它'];
    let pdcRange = ['轻度损坏', '已废弃', '完好'];
    let damageGradeRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let fortificationIntensityRange = ['6度', '7度', '8度', '9度'];
    let siteCategoryRange = ['1类', '2类', '3类', '4类'];
    let earthquakeIntensityRange = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    let mcoedtleRange = ['强震动作用', '地面破坏（地基液化、沉降、滑坡、崩塌等)', '两者均有'];
    let powtpRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let wtpRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let iwsawspsRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let wsnRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let gateStationRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let gstRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let gtpRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let roadRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let bridgeRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let tunnelRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let railwayLineRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let powerPlantRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let substationRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let transmissionLineRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let centralControlRoomRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];
    let communicationLineRange = ['I级基本完好', 'II级轻微破坏', 'III中等破坏', 'IV严重破坏', 'V损坏'];

    for (var i = 0; i < monomersSurveyLists.length; i++) {
      monomersSurveyLists[i].index = i;
      monomersSurveyLists[i].msfRange = msfRange;
      monomersSurveyLists[i].pdcRange = pdcRange;
      monomersSurveyLists[i].damageGradeRange = damageGradeRange;
      monomersSurveyLists[i].fortificationIntensityRange = fortificationIntensityRange;
      monomersSurveyLists[i].siteCategoryRange = siteCategoryRange;
      monomersSurveyLists[i].earthquakeIntensityRange = earthquakeIntensityRange;
      monomersSurveyLists[i].mcoedtleRange = mcoedtleRange;
      monomersSurveyLists[i].powtpRange = powtpRange;
      monomersSurveyLists[i].wtpRange = wtpRange;
      monomersSurveyLists[i].iwsawspsRange = iwsawspsRange;
      monomersSurveyLists[i].wsnRange = wsnRange;
      monomersSurveyLists[i].gateStationRange = gateStationRange;
      monomersSurveyLists[i].gstRange = gstRange;
      monomersSurveyLists[i].gtpRange = gtpRange;
      monomersSurveyLists[i].roadRange = roadRange;
      monomersSurveyLists[i].bridgeRange = bridgeRange;
      monomersSurveyLists[i].tunnelRange = tunnelRange;
      monomersSurveyLists[i].railwayLineRange = railwayLineRange;
      monomersSurveyLists[i].powerPlantRange = powerPlantRange;
      monomersSurveyLists[i].substationRange = substationRange;
      monomersSurveyLists[i].transmissionLineRange = transmissionLineRange;
      monomersSurveyLists[i].centralControlRoomRange = centralControlRoomRange;
      monomersSurveyLists[i].communicationLineRange = communicationLineRange;

      for (var j = 0; j < msfRange.length; j++) {
        if (monomersSurveyLists[i].msf === msfRange[j]) {
          monomersSurveyLists[i].msfIndex = j;
        }
      }
      for (var j = 0; j < damageGradeRange.length; j++) {
        if (monomersSurveyLists[i].damageGrade === damageGradeRange[j]) {
          monomersSurveyLists[i].damageGradeIndex = j;
        }
      }
      for (var j = 0; j < pdcRange.length; j++) {
        if (monomersSurveyLists[i].pdc === pdcRange[j]) {
          monomersSurveyLists[i].pdcIndex = j;
        }
      }
      for (var j = 0; j < fortificationIntensityRange.length; j++) {
        if (monomersSurveyLists[i].fortificationIntensity === fortificationIntensityRange[j]) {
          monomersSurveyLists[i].fortificationIntensityIndex = j;
        }
      }
      for (var j = 0; j < siteCategoryRange.length; j++) {
        if (monomersSurveyLists[i].siteCategory === siteCategoryRange[j]) {
          monomersSurveyLists[i].siteCategoryIndex = j;
        }
      }
      for (var j = 0; j < earthquakeIntensityRange.length; j++) {
        if (monomersSurveyLists[i].earthquakeIntensity === earthquakeIntensityRange[j]) {
          monomersSurveyLists[i].earthquakeIntensityIndex = j;
        }
      }
      for (var j = 0; j < mcoedtleRange.length; j++) {
        if (monomersSurveyLists[i].mcoedtle === mcoedtleRange[j]) {
          monomersSurveyLists[i].mcoedtleIndex = j;
        }
      }
      for (var j = 0; j < powtpRange.length; j++) {
        if (monomersSurveyLists[i].powtp === powtpRange[j]) {
          monomersSurveyLists[i].powtpIndex = j;
        }
      }
      for (var j = 0; j < wtpRange.length; j++) {
        if (monomersSurveyLists[i].wtp === wtpRange[j]) {
          monomersSurveyLists[i].wtpIndex = j;
        }
      }
      for (var j = 0; j < iwsawspsRange.length; j++) {
        if (monomersSurveyLists[i].iwsawsps === iwsawspsRange[j]) {
          monomersSurveyLists[i].iwsawspsIndex = j;
        }
      }
      for (var j = 0; j < wsnRange.length; j++) {
        if (monomersSurveyLists[i].wsn === wsnRange[j]) {
          monomersSurveyLists[i].wsnIndex = j;
        }
      }
      for (var j = 0; j < gateStationRange.length; j++) {
        if (monomersSurveyLists[i].gateStation === gateStationRange[j]) {
          monomersSurveyLists[i].gateStationIndex = j;
        }
      }
      for (var j = 0; j < gstRange.length; j++) {
        if (monomersSurveyLists[i].gst === gstRange[j]) {
          monomersSurveyLists[i].gstIndex = j;
        }
      }
      for (var j = 0; j < gtpRange.length; j++) {
        if (monomersSurveyLists[i].gtp === gtpRange[j]) {
          monomersSurveyLists[i].gtpIndex = j;
        }
      }
      for (var j = 0; j < roadRange.length; j++) {
        if (monomersSurveyLists[i].road === roadRange[j]) {
          monomersSurveyLists[i].roadIndex = j;
        }
      }
      for (var j = 0; j < bridgeRange.length; j++) {
        if (monomersSurveyLists[i].bridge === bridgeRange[j]) {
          monomersSurveyLists[i].bridgeIndex = j;
        }
      }
      for (var j = 0; j < tunnelRange.length; j++) {
        if (monomersSurveyLists[i].tunnel === tunnelRange[j]) {
          monomersSurveyLists[i].tunnelIndex = j;
        }
      }
      for (var j = 0; j < railwayLineRange.length; j++) {
        if (monomersSurveyLists[i].railwayLine === railwayLineRange[j]) {
          monomersSurveyLists[i].railwayLineIndex = j;
        }
      }
      for (var j = 0; j < powerPlantRange.length; j++) {
        if (monomersSurveyLists[i].powerPlant === powerPlantRange[j]) {
          monomersSurveyLists[i].powerPlantIndex = j;
        }
      }
      for (var j = 0; j < substationRange.length; j++) {
        if (monomersSurveyLists[i].substation === substationRange[j]) {
          monomersSurveyLists[i].substationIndex = j;
        }
      }
      for (var j = 0; j < transmissionLineRange.length; j++) {
        if (monomersSurveyLists[i].transmissionLine === transmissionLineRange[j]) {
          monomersSurveyLists[i].transmissionLineIndex = j;
        }
      }
      for (var j = 0; j < centralControlRoomRange.length; j++) {
        if (monomersSurveyLists[i].centralControlRoom === centralControlRoomRange[j]) {
          monomersSurveyLists[i].centralControlRoomIndex = j;
        }
      }
      for (var j = 0; j < communicationLineRange.length; j++) {
        if (monomersSurveyLists[i].communicationLine === communicationLineRange[j]) {
          monomersSurveyLists[i].communicationLineIndex = j;
        }
      }
    }
    return monomersSurveyLists;
  },

  //保存
  saveAll: function (e) {
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    if (that.data.monomersSurveyLists.length === 0) {
      return;
    }
    wx.request({
      method: "POST",
      url: server + "/lifeLineMonomers/saveall",
      data: that.data.monomersSurveyLists,
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
          let serveyIndex = event.currentTarget.dataset.monomerssurveyindex;
          let monomersSurveyLists = that.data.monomersSurveyLists;
          let survey = monomersSurveyLists.splice(serveyIndex, 1)
          if (survey.id !== null) {
            wx.request({
              method: "POST",
              url: server + "/lifeLineMonomers/delbyid?id=" + survey[0].id,
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
                  monomersSurveyLists: that.formatmonomersSurveyLists(monomersSurveyLists)
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
    let monomersSurveyLists = that.data.monomersSurveyLists;
    let singleIndex = event.currentTarget.dataset.monomerssurveyindex;
    monomersSurveyLists[singleIndex][keyStr] = key;
    that.setData({
      monomersSurveyLists: monomersSurveyLists
    })
  },
  bindinputBuildingMaterials: function (e) {
    this.replaceContent(e, "buildingMaterials");
  },
  bindinputArchitecturalAge: function (e) {
    this.replaceContent(e, "architecturalAge");
  },
  bindinputInterruptionTime: function (e) {
    this.replaceContent(e, "interruptionTime");
  },
  bindinputRecoveryTime: function (e) {
    this.replaceContent(e, "recoveryTime");
  },
  bindinputIoipoer: function (e) {
    this.replaceContent(e, "ioipoer");
  },
  bindStatus: function (e) {
    this.replaceContent(e, "status");
  },
  fileTypeChange: function (e) {
    this.replaceContent(e, "fileType");
  },
})