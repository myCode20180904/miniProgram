var dataScript = require('../model/dataScript')
var WXBizDataCrypt = require('../utils/WXBizDataCrypt');
var config = require('../public/config');

var wxStart = function(obj){
    // wx.setPreferredFramesPerSecond(30);
     //获取启动参数
     var launchData= wx.getLaunchOptionsSync()
     console.info(launchData);
     if(launchData.query){
        
        if(launchData.query.appid){

        }
        if(launchData.query.sharetype){
            if(launchData.query.sharekey){
                dataScript.common.sharekey = launchData.query.sharekey;
            }
            //邀请好友
            if(launchData.query.sharetype==1){
                if(launchData.query.sharekey){
                    
                }
            }
        }
    }


    //  用户点击了“转发”按钮
    wx.onShareAppMessage(function() {
        //var share_d = g_define.getShareData();
        return {
            title:"pengpeng",
            imageUrl:'',
            success:function(){

            },
            fail:function(){
                
            },
            complete:function(){
                
            },
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
        //同步开放信息
        // request({
        //     url:config.service.apiUrl+"/SyncOpenInfo",
        //     data:{
        //         pt:"SyncOpenInfo",
        //         uid:dataScript.userInfo.uid,
        //         token:dataScript.userInfo.skey,
        //         openInfo:{
        //             skins:dataScript.userInfo.roleScan,
        //             skinIdx:dataScript.userInfo.roleSelScan,
        //             map_index:dataScript.gamedata.map_index,
        //             relivingCard:dataScript.userInfo.fuhuoka,
        //             keepingCard:dataScript.userInfo.baojika,
        //             skillCard:0,
        //             friends:dataScript.userInfo.inviteFriends,
        //         }
        //     },
        //     success:function(res){
        //         console.info("CS_SyncOpenInfo:",res)
        //     },
        // })

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

    wx.getSystemInfo({
        success:function(res){
            if(res.errMsg=='getSystemInfo:ok'){
                console.info("getSystemInfo:",res);
                dataScript.common.screenWidth=res.screenWidth;
                dataScript.common.screenHeight=res.screenHeight;

                
                obj.success("wxStart -- succeed");
            }
        }
    });

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

    obj.showGetWxInfo();
    // wx.getUserInfo({
    //     success: function(res){
    //         console.info(res);
    //         var _data={
    //             encryptedData:res.encryptedData,
    //             iv:res.iv,
    //             skey:dataScript.userInfo.skey,
    //             data:res.userInfo
    //         }
    //         obj.success(_data);
    //     },
    //     fail: function (res) {
    //       // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
    //       if (res.errMsg.indexOf('auth deny') > -1 || 	res.errMsg.indexOf('auth denied') > -1 ) {
    //         // 处理用户拒绝授权的情况
    //         obj.refuse(res);
    //         getUserInfo(obj);
    //       }else{
    //         obj.fail(res);
    //       }

    //     }
    //   })
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
                // console.log(res.width, res.height)
                // console.log(bannerAd.style.realWidth, bannerAd.style.realHeight)
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
                // console.info(JSON.stringify(res));
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


// let shareData = {
//     title:share_d.title,
//     imageUrl:share_d.img,
//     query:``  
// }
// wxnodeScript.onShare(shareData);
var onShare = function(data,callback){
    console.info("onShare");
    if(data){
        console.info(data);
        if(window.wx){
            wx.shareAppMessage({
                title:data.title,
                imageUrl:data.imageUrl,
                query:data.query,
                success: function (res) {
                    console.info("onShare success:"+JSON.stringify(res));
                    // 转发成功
                    if(callback){
                        callback(res);
                    }
                },
                fail: function (res) {
                    console.log(res);
                },
                complete:function(res){
                    console.log("onShare complete:");
                    
                }
            
                })
        }
    }else{
        
    }

    
}

//发送消息给子域
//  var msg = {
//     name:"zzzzz",
//     hello:"hello",
// };
// this.sendMessageToChild(msg);
var sendMessageToChild = function(data){
    let openDataContext = wx.getOpenDataContext();
    openDataContext.postMessage({
        name: data.name,//'setUserCloudStorage',
        data:data.res,
    });
}


/**
 * createRewardedVideoAd
 * @param {onLoad:function ,onClose:function} obj 
 */
var rewardedVideoAd = null;
var createRewardedVideoAd = function(obj){
    console.info("create  RewardedVideoAd");

    if(!rewardedVideoAd){
        rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId:'adunit-f60366d91f6e4092'});
    }

    if(rewardedVideoAd ){
        //
        rewardedVideoAd.show()
        .then(() =>{
            console.log('激励视频 广告显示');
        })
        .catch(err => {
            console.log('拉取失败，重新拉取');
            rewardedVideoAd.load()
            .then(() => rewardedVideoAd.show())
        })

        //
        rewardedVideoAd.onLoad(() => {
            console.log('激励视频 广告加载成功');
            if(obj){
                obj.onLoad();
            }
        })

        //
        rewardedVideoAd.onClose(res => {
            // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                console.info(" 正常播放结束，可以下发游戏奖励");
                
                if(obj){
                    obj.onClose(true);
                }
            }
            else {
                // 播放中途退出，不下发游戏奖励
                console.info(" 播放中途退出，不下发游戏奖励");
                if(obj){
                    obj.onClose(false);
                }
            }
        })
    }

    
}

//跳转其他小游戏
var onJumpOther = function(_appId,path){
    console.info(_appId);
    console.info(path);
    wx.navigateToMiniProgram({
        appId:"wxb6feee4440b51059",
        path:`pages/index/index?touid=${_appId}`,
        extraData:{appId:"wx70a7dead1e7b37b3"},
        success:function(){

        },
        fail:function(){

        },
        complete:function(){

        }
    })
}

var downLoad = function(obj){
    console.info("downLoad:",obj.url)
    var downloadTask = wx.downloadFile({
        url: obj.url, //仅为示例，并非真实的资源
        // filePath:"./"+obj.path,
        success (res) {
            if(obj){
                wx.getFileSystemManager().saveFile({
                    tempFilePath:res.tempFilePath,
                    filePath:`${wx.env.USER_DATA_PATH}/${obj.path}`,
                    success:function(res2){
                        console.info("saveFile success",res2);
                        obj.save(`${wx.env.USER_DATA_PATH}/${obj.path}`);
                    },
                    fail:function(res2){
                        console.info("saveFile fail:",res2);
                    }
                })
                obj.success(res);
            }
        },
        fail:function(res){
            console.info("wx downLoad fail:",res);

        }
    })

    // downloadTask.onProgressUpdate((res) => {
    //     console.log('下载进度', res.progress)
    //     console.log('已经下载的数据长度', res.totalBytesWritten)
    //     console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
    // })
    return downloadTask;
}

var createGameClubButton = function(obj){
    let url = "https://lg-3q7kbp58-1257126548.cos.ap-shanghai.myqcloud.com/images/rzwd/weixin.png"; 
    var width = dataScript.common.screenWidth;
    var height = dataScript.common.screenHeight;
    const button = wx.createGameClubButton({
        type: "image",
        image: url,
        style: {
            left: width*0.23-21,
            top: 0.95*height-21,
            width: 42,
            height: 42
        }
    })
    console.info("GameClubBn:",button,width);
    button.onTap(function(res){
        console.info("GameClubBn.onTap:",res);
    });
    return button;
}


module.exports = {
    start:wxStart,
    login:login,
    loginSuccess:loginSuccess,
    request:request,
    changeBannerAd:changeBannerAd,
    bannerAd:bannerAd,
    onShare:onShare,
    createRewardedVideoAd:createRewardedVideoAd,
    sendMessageToChild:sendMessageToChild,
    onJumpOther:onJumpOther,
    downLoad:downLoad,
    createGameClubButton:createGameClubButton


};