var dataScript = require('../model/dataScript')
var WXBizDataCrypt = require('../utils/WXBizDataCrypt');

var wxStart = function(obj){
     //获取启动参数
     var launchData= wx.getLaunchOptionsSync()
     if(launchData.query){
        if(launchData.query.sharekey){
        }
        if(launchData.query.appid){

        }
        if(launchData.query.sharetype){

        }
    }

    //  用户点击了“转发”按钮
    wx.onShareAppMessage(function() {
        var share_d = g_define.getShareData();
        return {
            title:share_d.title,
            imageUrl:share_d.img,
            success:commonScript.OnShareSuccessCallBack,
            fail:commonScript.OnSharefailCallBack,
            complete:commonScript.OnShareCompleteCallBack,
            query:"",
        };
    });

    //显示当前页面的转发按钮
    wx.showShareMenu({
        withShareTicket: true,
        success:function(){
            console.info("showShareMenu true");
        },
        fail:function(){
            console.info("showShareMenu fail");
        },
        complete:function(){
            console.info("showShareMenu complete");
        }
    })

    wx.updateShareMenu({
        withShareTicket: true,
        success:function(){
            console.info("updateShareMenu true");
        },
        fail:function(){
            console.info("updateShareMenu fail");
        },
        complete:function(){
            console.info("updateShareMenu complete");
        }
    });


    //小游戏更新
    if (typeof wx.getUpdateManager === 'function') {
        const updateManager = wx.getUpdateManager()
    
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
        })
    
        updateManager.onUpdateReady(function () {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
        })
    
        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败

            //wx.exitMiniProgram(null);//直接退出
        })
    }

    //
    //监听小游戏隐藏到后台事件。锁屏、按 HOME 键退到桌面、显示在聊天顶部等操作会触发此事件
    wx.onHide(() => { 
        console.log("onHide "); 

    });
    wx.onShow((res)=>{
        console.log("onShow");
        console.log(res);
        dataScript.userInfo.formScene = res.scene;
        if(res.query){
            if(res.query.sharekey){
             
            }
            if(res.query.appid){

            }
            if(res.query.sharetype){

            }
        }

    });

    obj.success("wxStart -- succeed");
}

var login = function(obj){
    wx.login({
        success: function (res) {
            obj.success(res);
        },
        fail:function(){
            obj.fail();
        },
        complete:function(){}
    })
}

var loginSuccess = function(obj){
    getUserInfo(obj);
}

var getUserInfo=function(obj){
    wx.getUserInfo({
        success: function(res){
            console.info(res);
            var _data={
                encryptedData:res.encryptedData,
                iv:res.iv,
                skey:dataScript.userInfo.skey,
                data:res.userInfo
            }
            obj.success(_data);
        },
        fail: function (res) {
          // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
          if (res.errMsg.indexOf('auth deny') > -1 || 	res.errMsg.indexOf('auth denied') > -1 ) {
            // 处理用户拒绝授权的情况
            obj.refuse(res);
            getUserInfo(obj);
          }else{
            obj.fail(res);
          }

        }
      })
}

var request = function(obj){
    console.info(obj.url)
    console.info("POSTDATA"+JSON.stringify(obj.data))
    const requestTask = wx.request({
        url:obj.url,
        data:obj.data,
        header:{
            "Content-Type": "application/json" 
        },
        method: "POST",
        success:function(res){
            console.info(res);
            obj.success(deepCopy(res.data));
        },
        fail:function(err){
            obj.fail(err);
            console.info("err"+JSON.stringify(err));
            //request(obj)
        }
    })
    return requestTask;
}

var deepCopy = function(_obj){
    var copyObj=null; 
    if(typeof _obj==="object"){
        copyObj={};
        for(var i in _obj){
            if(typeof _obj[i]==="object"||typeof _obj[i]==="array"){
              copyObj[i]=deepCopy(_obj[i]);
            }
            copyObj[i]=_obj[i];
        }
    }else if(typeof _obj==="array"){
          copyObj=[];
          for(var i=0;i<copyObj.length;i++){
              if(typeof _obj[i]==="object"||typeof _obj[i]==="array"){
                  copyObj[i]=deepCopy(_obj[i]);
              }
              copyObj[i]=_obj[i];
          }
    }else{
          copyObj=null;
          copyObj=_obj;
    }
    return copyObj;
}


var bannerAd = null;
var changeBannerAd = function(obj){
    if(!wx.createBannerAd)return;
        var _callfunc=function(){
            let winWidth=dataScript.common.screenWidth;
            let winHeight=dataScript.common.screenHeight;
            let height=winWidth*100/350;

            bannerAd = wx.createBannerAd({
                adUnitId:'adunit-126db2a263dfa9f7',
                style: {
                    left: (winWidth-350)/2,
                    top: winHeight-height,
                    width: 350
                }
             })

            bannerAd.onResize(res => {
                console.log(res.width, res.height)
                console.log(bannerAd.style.realWidth, bannerAd.style.realHeight)
                bannerAd.style.width = bannerAd.style.realWidth;
                bannerAd.style.height = bannerAd.style.realHeight;
                bannerAd.style.left = (winWidth-bannerAd.style.width)/2,
                bannerAd.style.top =   winHeight-bannerAd.style.height;
            })
        }
        if(bannerAd){
            bannerAd.destroy()
        }
        if(dataScript.common.screenWidth>0){
            _callfunc();
        }else{
            wx.getSystemInfo({
                success:function(res){
                console.info(JSON.stringify(res));
               if(res.errMsg=='getSystemInfo:ok'){
                      console.info("bannerAd  Add");
                      dataScript.common.screenWidth=res.screenWidth;
                      dataScript.common.screenHeight=res.screenHeight;
                      _callfunc();
                 }
                }
            });
        }
}

//GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
var authorization_code = function(code){
    request({
        url:`https://api.weixin.qq.com/sns/jscode2session?appid=${dataScript.common.appId}&secret=${dataScript.common.AppSecret}&js_code=${code}&grant_type=authorization_code`,
        data:{
        },
        success:function(res){
            console.info(res)
            dataScript.userInfo.skey = res.session_key;
            dataScript.userInfo.openid = res.openid;
        },
        fail:function(err){

        }
    })
}



module.exports = {
    start:wxStart,
    login:login,
    loginSuccess:loginSuccess,
    request:request,
    changeBannerAd:changeBannerAd,
    bannerAd:bannerAd

};