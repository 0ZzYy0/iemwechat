// pages/sfaexpectenvir/sfaexpectenvir.js
const utils = require('/../../utils/util.js');
const app = getApp();
const server = app.globalData.server;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    expectEnvir: {},
    changdiyingxiangArr: [],
    dijizhuangkuangArr: [],
    bilinjianzhuArr: [],
    jifalieduArr: ["VI", "VII", "VIII", "IX", "X", "XI", "XII"],
    jifalieduIndex: 0,
    xiaozhenArr: [],
    dazhenArr: [],
    xiaozhenOriginArr: ["无小震", "≤V", "VI", "VII", "VIII", "IX"],
    dazhenOriginArr: ["无大震", "VI", "VII", "VIII", "IX", "≥X"],
    fcOther: "",
    liOther: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id;
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    wx.request({
      method: "GET",
      url: server + "/ExpectEnvir/getByAssessId",
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.code !== 1) {
          wx.showModal({
            title: '操作失败',
            content: res.data.msg,
          })
          return;
        }
        that.setData({
          expectEnvir: res.data.result.expectEnvir
        })
        that.formatEE(res.data.result.expectEnvir)
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
  inputfcOther: function(e) {
    console.log(e);
    this.setData({
      fcOther: e.detail.value
    })
  },
  inputliOther: function(e) {
    console.log(e);
    this.setData({
      liOther: e.detail.value
    })
  },
  checkboxDijiChange: function(e) {
    let expectEnvir = this.data.expectEnvir;
    var checkboxItems = expectEnvir.foundationCondition,
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
    expectEnvir.foundationCondition = checkboxItems;
    this.setData({
      expectEnvir: expectEnvir
    });
    console.log(expectEnvir);
  },
  checkboxChangDiChange: function(e) {

    let expectEnvir = this.data.expectEnvir;
    var checkboxItems = expectEnvir.locationInfluence,
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
    expectEnvir.locationInfluence = checkboxItems;
    this.setData({
      expectEnvir: expectEnvir
    });
    console.log(expectEnvir);
  },
  bindRadioChange: function(e) {
    console.log(e);
    let expectEnvir = this.data.expectEnvir;
    let index = parseInt(e.detail.value);
    expectEnvir.abOther = expectEnvir.adjoiningBuilding[index].name;
    let ab = expectEnvir.adjoiningBuilding;
    for (let i = 0; i < ab.length; i++) {
      if (i !== index) {
        ab[i].checked = false;
      } else {
        ab[i].checked = true;
      }
    }
    expectEnvir.adjoiningBuilding = ab;
    this.setData({
      expectEnvir: expectEnvir
    });
    console.log(expectEnvir)
  },
  formatEE: function(expectEnvir) {
    let that = this;
    let jifaliedu = expectEnvir.yetIntensity;
    let abOther = expectEnvir.abOther;
    let fcOther = expectEnvir.fcOther;
    let liOther = expectEnvir.liOther;
    let jifalieduArr = that.data.jifalieduArr;
    let effectType = expectEnvir.effectType;
    let expectEffect = expectEnvir.expectEffect;
    console.log(effectType, expectEffect);
    let idx = 0;
    for (let i = 0; i < jifalieduArr.length; i++) {
      if (jifalieduArr[i] == jifaliedu) {
        idx = i;
        break;
      }
    }
    let xiaozhenOriginArr = that.data.xiaozhenOriginArr;
    let dazhenOriginArr = that.data.dazhenOriginArr;
    let jifalieduIndex = idx;
    let xiaozhenArr = [],
      dazhenArr = [];
    
    if (effectType == "SMALL") {
      xiaozhenOriginArr.forEach(function (item,index) {
        let xiaozhen = {};
        xiaozhen.value = item;
        if (item == expectEffect){
          xiaozhen.checked = true;
        }else{
          xiaozhen.checked = false;
        }
        xiaozhen.disabled = false;
        xiaozhenArr.push(xiaozhen)
      })

      dazhenOriginArr.forEach(function (item, index) {
        let dazhen = {};
        dazhen.value = item;
        if (index == 0) {
          dazhen.checked = true;
        } else
        dazhen.checked = false;
        dazhen.disabled = false;
        dazhenArr.push(dazhen)
      })
    }

    if (effectType == "BIG") {
      xiaozhenOriginArr.forEach(function (item, index) {
        let xiaozhen = {};
        xiaozhen.value = item;
        if(index==0){
          xiaozhen.checked = true;
        }else
        xiaozhen.checked = false;
        xiaozhen.disabled = false;
        xiaozhenArr.push(xiaozhen)
      })

      dazhenOriginArr.forEach(function (item, index) {
        let dazhen = {};
        dazhen.value = item;
        console.log(item)
        if (item == expectEffect) {
          console.log(true)
          dazhen.checked = true;
        } else {
          dazhen.checked = false;
        }
      
        dazhen.disabled = false;
        dazhenArr.push(dazhen)
      })
    }

    let expInst = expectEnvir.yetIntensity;
   
    let smallAbleIndex = 0;
    for (let i = 0; i < jifalieduArr.length; i++) {
      if (jifalieduArr[i] == expInst) {
        smallAbleIndex = i + 1;
        break;
      }
    }
   
    for (let i = 0; i < xiaozhenArr.length; i++) {
      if (i <= smallAbleIndex) {
        xiaozhenArr[i].disabled = false;
      } else {
        xiaozhenArr[i].disabled = true;
      }
    }

  
    for (let i = 0; i < dazhenArr.length; i++) {
      if (i == 0) {
        dazhenArr[i].disabled = false;
        continue;
      }
      if (i < smallAbleIndex) {
        dazhenArr[i].disabled = true;
      } else {
        dazhenArr[i].disabled = false;
      }
    }
 


    that.setData({
      dazhenArr: dazhenArr,
      xiaozhenArr: xiaozhenArr,
      jifalieduIndex: jifalieduIndex,
      fcOther: fcOther,
      liOther: liOther,
    })
    console.log(dazhenArr);
    console.log(xiaozhenArr);

  },

  bindSmallChange: function(e) {
    let that=this;
    let expectEnvir = that.data.expectEnvir;
    let index=parseInt(e.detail.value);
    let xiaozhenArr = that.data.xiaozhenArr;
    expectEnvir.effectType="SMALL";
    expectEnvir.expectEffect = xiaozhenArr[index].value;
    for(let i=0;i<xiaozhenArr.length;i++){
      if(i==index){
        xiaozhenArr[i].checked=true;
      }else{
        xiaozhenArr[i].checked = false;
      }
    }
    let dazhenArr = that.data.dazhenArr;
    for (let i = 0; i < dazhenArr.length; i++) {
      if (i == 0) {
        dazhenArr[i].checked = true;
      } else {
        dazhenArr[i].checked = false;
      }
    }
    that.setData({
      xiaozhenArr: xiaozhenArr,
      dazhenArr: dazhenArr,
      expectEnvir: expectEnvir
    })
    console.log(expectEnvir);
  },
  bindBigChange: function(e) {

    let that=this;
    let expectEnvir = that.data.expectEnvir;
    let index = parseInt(e.detail.value);
    let dazhenArr = that.data.dazhenArr;
    expectEnvir.effectType = "BIG";
    expectEnvir.expectEffect = dazhenArr[index].value;
    for (let i = 0; i < dazhenArr.length; i++) {
      if (i == index) {
        dazhenArr[i].checked = true;
      } else {
        dazhenArr[i].checked = false;
      }
    }
    let xiaozhenArr = that.data.xiaozhenArr;
    for (let i = 0; i < xiaozhenArr.length; i++) {
      if (i == 0) {
        xiaozhenArr[i].checked = true;
      } else {
        xiaozhenArr[i].checked = false;
      }
    }
    that.setData({
      xiaozhenArr: xiaozhenArr,
      dazhenArr: dazhenArr,
      expectEnvir: expectEnvir
    })
    console.log(expectEnvir);
  },
  save: function() {
    if (!utils.checkSession()) {
      return;
    }
    let that = this;
    let expectEnvir = that.data.expectEnvir;
    expectEnvir.fcOther = that.data.fcOther;
    expectEnvir.liOther = that.data.liOther;
    console.log(expectEnvir)
    wx.request({
      method: "POST",
      url: server + "/ExpectEnvir/save",
      data: expectEnvir,
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + app.globalData.JSESSIONID
      },
      success: function (res) {
        console.log(res.data)
        that.formatEE(res.data)
        wx.showToast({
          title: '成功',
          icon:"success",
          duration:500
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
  checkDisabled: function (expectEnvir){
    let that=this;
    let expInst = expectEnvir.yetIntensity;
    let jifalieduArr = that.data.jifalieduArr;
    let smallAbleIndex=0;
    for(let i=0;i<jifalieduArr.length;i++){
      if(jifalieduArr[i]==expInst){
        smallAbleIndex=i+1;
        break;
      }
    }
    let xiaozhenArr = this.data.xiaozhenArr;
    for (let i = 0; i < xiaozhenArr.length;i++){
      if(i<=smallAbleIndex){
      xiaozhenArr[i].disabled=false;
      }else{
        xiaozhenArr[i].disabled = true;
      }
    }
   
    let dazhenArr = this.data.dazhenArr;
    for (let i = 0; i < dazhenArr.length; i++) {
      if(i==0){
        dazhenArr[i].disabled = false;
        continue;
      }
      if (i < smallAbleIndex) {
        dazhenArr[i].disabled = true;
      } else {
        dazhenArr[i].disabled = false;
      }
    }
   that.setData({
     xiaozhenArr: xiaozhenArr,
     dazhenArr: dazhenArr
   })
  },
  bindJiFaLieDuChange: function(e) {
   console.log(e);
   let that = this;
   let idx = parseInt(e.detail.value);
   let jifalieduArr = that.data.jifalieduArr;
   let expectEnvir = that.data.expectEnvir;
   expectEnvir.yetIntensity = jifalieduArr[idx];
   that.setData({
     expectEnvir: expectEnvir,
     jifalieduIndex:idx
   })

   that.checkDisabled(expectEnvir)


  }
})