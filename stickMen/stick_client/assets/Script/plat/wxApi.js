var userInfo = require('../model/userInfo')
var common = require('../model/common')

var getName = function(){
    
    return "wx"
}
/**
 * wxApiInit
 */
var wxApiInit = function(obj){
    wx.setPreferredFramesPerSecond(30);
     //获取启动参数
     var launchData= wx.getLaunchOptionsSync()
     console.info("wx启动参数:",launchData);
     if(launchData.query){
        
        
    }

    //  用户点击了“转发”按钮
    wx.onShareAppMessage(function() {
        return {
            title:"",
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
        obj.onHide();
    });
    wx.onShow((res)=>{
        console.log("wx onShow:",res);
        userInfo.formScene = res.scene;
        if(res.query){
    
        }
        obj.onShow(res);
    });

    wx.getSystemInfo({
        success:function(res){
        if(res.errMsg=='getSystemInfo:ok'){
                console.info("getSystemInfo:",res);
                common.screenWidth=res.screenWidth;
                common.screenHeight=res.screenHeight;
                obj.success({});
            }
        }
    });

}



/**
 * downLoad
 * @param {url:string ,path:string,success:function,save:function} obj 
 */
var downLoad = function(obj){
    console.info("downLoad:",obj)
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

/**
 * wx登录
 * @param {success:function ,file:function} obj 
 */
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

/**
 * createBannerAd
 * @param {*} obj 
 */
var bannerAd = null;
var createBannerAd = function(obj){

    var _callfunc=function(){
        console.info("bannerAd  Add");
        let winWidth=common.screenWidth;
        let winHeight=common.screenHeight;
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
            bannerAd.style.width = bannerAd.style.realWidth;
            bannerAd.style.height = bannerAd.style.realHeight;
            bannerAd.style.left = (winWidth-bannerAd.style.width)/2,
            bannerAd.style.top =   winHeight-bannerAd.style.height;
        })
        obj.success(bannerAd);
    }
    if(bannerAd){
        bannerAd.destroy()
    }
    if(common.screenWidth>0){
        bannerAd = _callfunc();
    }else{
        wx.getSystemInfo({
            success:function(res){
            if(res.errMsg=='getSystemInfo:ok'){
                    common.screenWidth=res.screenWidth;
                    common.screenHeight=res.screenHeight;
                    bannerAd = _callfunc();
                }
            }
        });
    }
}


/**
 * onShare
 * @param {title,imageUrl,query,success,fail,complete} obj 
 */
var onShare = function(obj){
    console.info("onShare",obj);
    if(obj){
        wx.shareAppMessage({
            title:obj.title,
            imageUrl:obj.imageUrl,
            query:obj.query,
            success: function (res) {
                console.info("onShare success:",res);
                // 转发成功
                obj.success(res);
            },
            fail: function (res) {
                cconsole.info("onShare fail:",res);
                obj.fail(res);
            },
            complete:function(res){
                console.info("onShare complete:",res);
                obj.complete(res);
                
            }
        })
    }else{
        
    }

    
}

/**
 * request
 * @param {url,data,success,fail} obj 
 */
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
            console.info("success:",res);
            obj.success(res);
        },
        fail:function(err){
            console.info("err：",err);
            obj.fail(err);
        }
    })
    return requestTask;
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

//跳转其他小游戏
var onJumpOther = function(_appId,path){
    console.info(_appId,path);
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



module.exports = {
    wxApiInit:wxApiInit,
    getName:getName,
    downLoad:downLoad,
    login:login,
    createRewardedVideoAd:createRewardedVideoAd,
    createBannerAd:createBannerAd,
    onShare:onShare,
    request:request,
    sendMessageToChild:sendMessageToChild,
    onJumpOther:onJumpOther

};