var config = require('./config')
var g_define = require('./g_define');
var myToast = require('./mainScene/toastScript');
cc.Class({
    extends: cc.Component,

    properties: {
        _timer:0,
        _isPlayBanner:false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.info("wxNode onLode");
        this.refreshDay();
        //第一次进入
        if(cc.sys.localStorage.getItem('firstCome')){
            g_define.getDataScript.firstCome = false;
        }else{
            g_define.getDataScript.firstCome = true;
        }
        cc.sys.localStorage.setItem('firstCome',"1");
        
        //
        this._isPlayBanner=false;
        this._timer=0;

 

    },

    loginCall:function(res){
        var that=this;
        if(res=="succeed"){
            that.islogin = true;
            myToast.showHttpLoad(false);
            myToast.show(1,"登陆成功！",cc.find("Canvas"))

            //var commonScript=cc.find("wxNode").getComponent("commonData");
            // commonScript.startGameInfo(1);
            // commonScript.startGameInfo(2);

            that.schedule(this.adupdate, 1.0);
           
        }else{
            that.islogin = false;
        }

    },

    start () {
        console.info("wxNode start");
        

        var msg = {
            name:"zzzzz",
            hello:"hello",
        };
        this.sendMessageToChild(msg);

        var that=this;
        this.islogin = false;
        if(window.wx){

            //
            that.wxstart();
            //
           var commonScript=cc.find("wxNode").getComponent("commonData");

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


        }

    },
    testLogin:function(){

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
            }
        };
        let uri = config.service.loginUrl;
        //uri = "http://localhost:3000/";
        xhr.open("GET",uri, true);
        xhr.send();
        // g_define.sendHttpRequest("POST","https://p2pnowly.qcloud.la/",null);
    },

    //微信启动
    wxstart:function(){
        console.info("wxstart");
        g_define.getDataScript().userInfo.form=0;
        //获取启动参数
        var _data= wx.getLaunchOptionsSync()
        console.info("getLaunchOptionsSync:");
        console.info(_data);
        if(_data.query){
            if(_data.query.sharekey){
                console.info("----",_data.query.sharekey);
                g_define.getDataScript().userInfo.shareKey=_data.query.sharekey;
            }
            if(_data.query.appid){
                g_define.getDataScript().userInfo.appid=_data.query.appid;
            }
            if(_data.query.sharetype){
                g_define.getDataScript().userInfo.shareType=_data.query.sharetype;
            }
        }
        if(_data.shareTicket){

        }
        //当场景为由从另一个小程序或公众号或App打开时，返回此字段 appId
        // referrerInfo 的结构
        // 属性	类型	说明	支持版本
        // appId	string	来源小程序或公众号或App的 appId	
        // extraData	object	来源小程序传过来的数据，scene=1037或1038时支持
        if(_data.referrerInfo){
            if(_data.referrerInfo.appid){
                g_define.getDataScript().userInfo.appid=_data.referrerInfo.appid;
            }
        }

        this.changeBannerAd(false);
        wx.getSystemInfo({
            success:function(res){
                if(res.errMsg=='getSystemInfo:ok'){

                    g_define.getDataScript().longScene = res.screenHeight/res.screenWidth>2.0?true:false;
                    
                }
            }
        });

        this.rewardedVideoAd = null;
       {
            console.info("create  RewardedVideoAd");
            this.rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId:'adunit-f60366d91f6e4092'});

            this.rewardedVideoAd.onClose(res => {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    // 正常播放结束，可以下发游戏奖励
                    console.info(" 正常播放结束，可以下发游戏奖励");
                          
                    var commonScript=cc.find("wxNode").getComponent("commonData");
                    var _callfunc=function(response){
                        if(response.err==0){
                            if(response.score>=0){
                                myToast.showPrefab("prefab/ui_section/flyGold",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2),null,function(){},1000);
                                myToast.show(1.0,"金币+50",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2));
                                g_define.getDataScript().userInfo.gold = response.score;
                                //更新用户信息
                                if(cc.director.getScene().name=="mainScene"){
                                    cc.find("Canvas").getComponent("mainScene").updateMainUI();
                                }
                                if(cc.director.getScene().name=="gameScene"){
                                    cc.find("Canvas").getComponent("gameuiScript").updateGameUI();
                                }
                            }
                        }else{
                            myToast.show(1.5,"每天使用看视频最多五次",cc.find("Canvas"));
                            cc.sys.localStorage.setItem('lookMvCount',-1);
                        }
                    }
                    commonScript.sendBehavio(2,_callfunc);
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    console.info(" 播放中途退出，不下发游戏奖励");
                }
            })
        }

        g_define.getDataScript().userInfo.formScene=_data.scene;

        this.login();
    },

    login:function(){
        console.info("wxlogin");
        var that=this;
        var commonScript=cc.find("wxNode").getComponent("commonData");
        wx.login({
            success: function (res) {
                if(!res.code){
                    myToast.show(2,"用户授权失败！"+res,cc.director.getScene());
                    return;
                }else{
                    commonScript.severLogin(res.code);
                }
            },
            fail:function(){},
            complete:function(){}
        })
          

        //监听小游戏隐藏到后台事件。锁屏、按 HOME 键退到桌面、显示在聊天顶部等操作会触发此事件
        if(!window.wx){
            cc.systemEvent.on(cc.game.EVENT_HIDE, function(){  
                console.log("cc.game.EVENT_HIDE "); 
            }); 
            cc.systemEvent.on(cc.game.EVENT_SHOW, function(){  
                console.info("cc.game.EVENT_SHOW");
            });
        }else{
            wx.onHide(() => { 
                console.log("onHide "); 

            });
            wx.onShow((res)=>{
                console.log("onShow");
                console.log(res);
                g_define.getDataScript().userInfo.formScene=res.scene;
                if(res.query){
                    if(res.query.sharekey){
                        g_define.getDataScript().userInfo.shareKey=res.query.sharekey;
                        //
                        if(res.query.sharekey!=0){
                            if(res.query.sharetype){
                                if(res.query.sharetype!=0){
                                    commonScript.sendCheckHelp(res.query.sharekey,res.query.sharetype);
                                }
                            }
                        }
                    }
                    if(res.query.appid){
                        g_define.getDataScript().userInfo.appid=res.query.appid;
                    }
                    if(res.query.sharetype){
                        g_define.getDataScript().userInfo.shareType=res.query.sharetype;
                    }
                }
                if(res.shareTicket){

                }
                //当场景为由从另一个小程序或公众号或App打开时，返回此字段 appId
                // referrerInfo 的结构
                // 属性	类型	说明	支持版本
                // appId	string	来源小程序或公众号或App的 appId	
                // extraData	object	来源小程序传过来的数据，scene=1037或1038时支持
                if(res.referrerInfo){
                    if(res.referrerInfo.appid){
                        g_define.getDataScript().userInfo.appid=res.referrerInfo.appid;
                    }
                }

                if (res.shareTicket) {
                    // 获取转发详细信息
                    wx.getShareInfo({
                      shareTicket: res.shareTicket,
                      success(res) {
                        console.info(res)
                      },
                      fail() {
                        console.info("getShareInfo fail")
                      },
                      complete() {
                        console.info("getShareInfo complete")
                      }
                    });
                }

                this.refreshDay();
            });
        }



    },

    getUserInfo:function(){
        console.info("wx.getUserInfo");
        var that=this;
        var commonScript=cc.find("wxNode").getComponent("commonData");
        wx.getUserInfo({
            success: function(res){
                console.info(res);
                var _data={
                    encryptedData:res.encryptedData,
                    iv:res.iv,
                    skey:g_define.getDataScript().userInfo.skey
                }
                commonScript.updateUserInfo(_data);
            },
            fail: function (res) {
              // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
              if (res.errMsg.indexOf('auth deny') > -1 || 	res.errMsg.indexOf('auth denied') > -1 ) {
                // 处理用户拒绝授权的情况
               // commonScript.getUserInfo();
              }else{
                that.login();
              }

            }
          })
    },

    refreshDay:function(){
        let date = new Date();
        date.setTime(cc.sys.localStorage.getItem('lastEnterTime'));
        config.isToday = false;
        let now = new Date();
        if(now.getFullYear()>date.getFullYear()){
            config.isToday = true;
        }else if(new Date().getMonth()>date.getMonth()){
            config.isToday = true;
        }else if(new Date().getDate()>date.getDate()){
            config.isToday = true;
        }
        cc.sys.localStorage.setItem('lastEnterTime',new Date().getTime());

        //新的一天
        if(config.isToday){
            cc.sys.localStorage.setItem('lookMvCount',5);
        }

    },

    showBannerAd(){
        if(this.bannerAd){
            this.bannerAd.show();
            this._isPlayBanner  = true;
        }
    },
    hideBannerAd(){
        if(this.bannerAd){
            this.bannerAd.hide();
            this._isPlayBanner = false;
        }
    },
    destroybannerAd(){
        if(this.bannerAd){
            this.bannerAd.destroy()
        }
    },
    changeBannerAd(isShow){
        if(!window.wx)return;
        if(!wx.createBannerAd)return;
        var that=this;
        var _callfunc=function(){
            let winWidth=that.screenWidth;
            let winHeight=that.screenHeight;
            var height=winWidth*100/350;
           console.info(winWidth+"//"+winHeight+"//"+height);
            that.bannerAd = wx.createBannerAd({
                adUnitId:'adunit-126db2a263dfa9f7',
                style: {
                    left: (winWidth-350)/2,
                    top: winHeight-height,
                    width: 350
                }
             })

            that.bannerAd.onResize(res => {
                console.log(res.width, res.height)
                console.log(that.bannerAd.style.realWidth, that.bannerAd.style.realHeight)
                that.bannerAd.style.width = that.bannerAd.style.realWidth;
                that.bannerAd.style.height = that.bannerAd.style.realHeight;
                that.bannerAd.style.left = (winWidth-that.bannerAd.style.width)/2,
                that.bannerAd.style.top =   winHeight-that.bannerAd.style.height;
            })

            if(isShow){
                that.showBannerAd();
            }

            // that.bannerAd.offResize({
            //     success:function(){
            //         console.info("取消onResize 监听");
            //     }
            // });
            
        }
        if(that.bannerAd){
            that.bannerAd.destroy()
        }
        if(that.screenWidth){
            _callfunc();
        }else{
            wx.getSystemInfo({
                success:function(res){
                console.info(JSON.stringify(res));
               if(res.errMsg=='getSystemInfo:ok'){
                      console.info("bannerAd  Add");
                      that.screenWidth=res.screenWidth;
                      that.screenHeight=res.screenHeight;
                      _callfunc();
                 }
                }
            });
        }
     
    },
    
    
    adupdate (dt) {
        this._timer++;
        if(this._timer>=60){
            this._timer = 0;
            this.changeBannerAd(this._isPlayBanner);
        }
    },

    //发送消息给子域
    sendMessageToChild:function(data){
        if(window.wx){
            let openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage({
                name: 'testMessage',
                time: (new Date()),
                version:cc.sys.localStorage.getItem("gameConfig").version,
                data:data,
            });
        }
    },
    onShare:function(data,callback){
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

        
    },
    onLookMvAd:function(data,callback){
        console.info("onLookMvAd");
        console.info(data);
        var that = this;
        let lookMvCount =  cc.sys.localStorage.getItem('lookMvCount');
        console.info(lookMvCount);
        if(lookMvCount>0){
            lookMvCount--;
            cc.sys.localStorage.setItem('lookMvCount',lookMvCount);
            if(that.rewardedVideoAd ){
                console.info("onLookMvAd rewardedVideoAd");
                that.rewardedVideoAd.onLoad(() => {
                    console.log('激励视频 广告加载成功');
                    if(callback){
                        callback();
                    }
                  })
      
                  that.rewardedVideoAd.show()
                  .then(() =>{
                    console.log('激励视频 广告显示');
                  })
                  .catch(err => {
                    console.log('拉取失败，重新拉取');
                    that.rewardedVideoAd.load()
                    .then(() => that.rewardedVideoAd.show())
                })
            }
        }else{
            myToast.show(1,"每天使用看视频最多五次",cc.find("Canvas"));
            if(callback){
                callback();
            }
        }

       

    },


    onJumpOther:function(_appId,path){
        if(window.wx){
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
    },

    checkBindStaue:function(isHelp){
        g_define.getDataScript().isHelp.tip = isHelp;
        if(isHelp>0){
            if(isHelp==1){
                g_define.getDataScript().isHelp.name = g_define.getDataScript().userInfo.name;
                g_define.getDataScript().isHelp.avatarurl = g_define.getDataScript().userInfo.avatarurl;
            }
            myToast.showPrefab("prefab/friendTip",cc.find("Canvas"));
        }
    },

    tttesett:function(){
        var WXBizDataCrypt = require('./WXBizDataCrypt')

        var appId = 'wx4f4bc4dec97d474b'
        var sessionKey = 'tiihtNczf5v6AKRyjwEUhQ=='
        var encryptedData = 
        'CiyLU1Aw2KjvrjMdj8YKliAjtP4gsMZM'+
        'QmRzooG2xrDcvSnxIMXFufNstNGTyaGS'+
        '9uT5geRa0W4oTOb1WT7fJlAC+oNPdbB+'+
        '3hVbJSRgv+4lGOETKUQz6OYStslQ142d'+
        'NCuabNPGBzlooOmB231qMM85d2/fV6Ch'+
        'evvXvQP8Hkue1poOFtnEtpyxVLW1zAo6'+
        '/1Xx1COxFvrc2d7UL/lmHInNlxuacJXw'+
        'u0fjpXfz/YqYzBIBzD6WUfTIF9GRHpOn'+
        '/Hz7saL8xz+W//FRAUid1OksQaQx4CMs'+
        '8LOddcQhULW4ucetDf96JcR3g0gfRK4P'+
        'C7E/r7Z6xNrXd2UIeorGj5Ef7b1pJAYB'+
        '6Y5anaHqZ9J6nKEBvB4DnNLIVWSgARns'+
        '/8wR2SiRS7MNACwTyrGvt9ts8p12PKFd'+
        'lqYTopNHR1Vf7XjfhQlVsAJdNiKdYmYV'+
        'oKlaRv85IfVunYzO0IKXsyl7JCUjCpoG'+
        '20f0a04COwfneQAGGwd5oa+T8yO5hzuy'+
        'Db/XcxxmK01EpqOyuxINew=='
        var iv = 'r7BXXKkLb8qrSNn05n0qiA=='

        var pc = new WXBizDataCrypt(appId, sessionKey)

        var data = pc.decryptData(encryptedData , iv)

        console.log('解密后 data: ', data)
        // 解密后的数据为
        //
        // data = {
        //   "nickName": "Band",
        //   "gender": 1,
        //   "language": "zh_CN",
        //   "city": "Guangzhou",
        //   "province": "Guangdong",
        //   "country": "CN",
        //   "avatarUrl": "http://wx.qlogo.cn/mmopen/vi_32/aSKcBBPpibyKNicHNTMM0qJVh8Kjgiak2AHWr8MHM4WgMEm7GFhsf8OYrySdbvAMvTsw3mo8ibKicsnfN5pRjl1p8HQ/0",
        //   "unionId": "ocMvos6NjeKLIBqg5Mr9QjxrP1FA",
        //   "watermark": {
        //     "timestamp": 1477314187,
        //     "appid": "wx4f4bc4dec97d474b"
        //   }
        // }

    }





});
