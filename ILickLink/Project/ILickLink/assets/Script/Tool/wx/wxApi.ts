import { GameConfig,LoginType,GameLoginType} from "../../Define/GameConfig";
import { LocalNode} from "../../LocalNode";
import { CommonHandel} from "../../Define/CommonParam";
import { UserManager} from "../../manager/UserManager";
import { UIManager} from "../../manager/UIManager";
import { Logger } from "../Logger";
import { LoginUI } from "../../View/LoginUI";

/**
 * 数据域消息结构
 */
export class WX_OpenData{
    public fun_name:string = '';//调用的方法名
    public res:any = '';//发送的内容
	public constructor(val) {
        this.fun_name = val;
    }
}


/**
 * WXManager  wxApi 管理
 */
export class WXManager {
	private static instance: WXManager;
	public static get Instance(): WXManager {
		if (this.instance == null) {
			this.instance = new WXManager();
		}
		return this.instance;
    }
    //微信doc
    public wx:any = window['wx']; 
    public launchData:any = null;
    //下载配置
    private downLoadConfig = {total:0,process:0};
    //广告
    private bannerAd:any = null;
    //视屏广告
    private rewardedVideoAd:any = null;

	public constructor() {
        
    }
    //加载wx
    public loadWx(){
        if(!window['wx']){
            Logger.warn("loadWx fail!");
            return;
        }
        this.wx = window['wx'];
        this.init();
    }
    /**
     * 初始化
     */
    private init(){
        if(!this.checkWx()){
            return;
        }

        //获取启动参数
        this.launchData= this.wx.getLaunchOptionsSync()
        Logger.info(this.launchData);
        if(this.launchData.query){
            if(this.launchData.query.appid){

            }
         }

        //  用户点击了“转发”按钮
        this.wx.onShareAppMessage(function() {
            return {
                title:"热血高校",
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
        this.wx.showShareMenu({
            withShareTicket: true,
            success:function(){
                Logger.info("showShareMenu true");
            },
            fail:function(){
                Logger.info("showShareMenu fail");
            },
            complete:function(){
                Logger.info("showShareMenu complete");
            }
        })

        this.wx.updateShareMenu({
            withShareTicket: true,
            success:function(){
                Logger.info("updateShareMenu true");
            },
            fail:function(){
                Logger.info("updateShareMenu fail");
            },
            complete:function(){
                Logger.info("updateShareMenu complete");
            }
        });


        //小游戏更新
        if (typeof this.wx.getUpdateManager === 'function') {
            const updateManager = this.wx.getUpdateManager()
        
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                Logger.info(res.hasUpdate)
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
        this.wx.onHide(() => { 
            Logger.info("onHide "); 
            

        });
        this.wx.onShow((res)=>{
            // cc.director.resume();
            Logger.info("onShow");
            Logger.info(res);
            if(res.query){
                if(res.query.appid){

                }
                
            }

        });

        this.wx.getSystemInfo({
            success:function(res){
                if(res.errMsg=='getSystemInfo:ok'){
                    Logger.info("getSystemInfo:",res);
                }
            }
        });

    }
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    /**
     * 检查wx 是否可用
     */
    public checkWx():boolean{
        if(this.wx){
            return true;
        }
        Logger.warn('not found wx:没有找到微信');
        return false;
    }

    /**
     * 打开微信数据域
     */
    public openDataContent(){
        if(!this.checkWx()){
            return;
        }
        var localNode = cc.find("LocalNode").getComponent("LocalNode") as LocalNode;
        localNode.showDisplayView();
    }
    /**
     * 关闭微信数据域
     */
    public closeDataContent(){
        if(!this.checkWx()){
            return;
        }
        var localNode = cc.find("LocalNode").getComponent("LocalNode") as LocalNode;
        localNode.hideDisplayView();
    }
    /**
     * 发送消息给数据域
     * @param data 
     */
    public sendMessageToChild(data:WX_OpenData){
        if(!this.checkWx()){
            return;
        }
        let openDataContext = this.wx.getOpenDataContext();
        openDataContext.postMessage({
            fun_name: data.fun_name,
            data:data.res,
        });
    }

    /**
     * 登录
     * @param handel 
     */
    public login(handel:CommonHandel){
        if(!this.checkWx()){
            return;
        }
        var that = this;
        this.wx.login({
            success: function (res) {
                if(!res.code){
                    Logger.error("用户授权失败！",res);
                    return;
                }
                UserManager.Instance.getUserInfo().code = res.code;
                that.getUserInfo(handel);
            },
            fail:function(){
                handel.fail();
            }
        })
    }

    /**
     * 获取wx用户信息
     * @param obj 
     */
    public getUserInfo(handel:CommonHandel){
        var that = this;
        //检查授权状态
        this.wx.getSetting({
            async success(auths){
                if(auths.authSetting["scope.userInfo"]){
                    //获得个人信息
                    that.wx.getUserInfo({
                        withCredentials: true,
                        lang: 'zh_CN',
                        success(res3){
                            Logger.info("成功获取wx用户信息")
                            handel.success(res3);

                            UIManager.Instance.closeWindow("LoginUI")
                        },
                        async fail(){
                            Logger.info("获取wx用户失败---转到授权界面-");
                            let loginUIComp:LoginUI = null;
                            if(!UIManager.Instance.findWindow("LoginUI")){
                                await UIManager.Instance.openWindow("LoginUI")
                            }
                            loginUIComp = UIManager.Instance.findComponent('LoginUI') as LoginUI;
                            if(!loginUIComp)return;

                            loginUIComp.loginHandel = handel;
                            loginUIComp.showWxInfoButton();
                        }
                    })
                }else{
                    Logger.info("==转到授权界面===")
                    let loginUIComp:LoginUI = null;
                    if(!UIManager.Instance.findWindow("LoginUI")){
                        await UIManager.Instance.openWindow("LoginUI")
                    }
                    loginUIComp = UIManager.Instance.findComponent('LoginUI') as LoginUI;
                    if(!loginUIComp)return;

                    loginUIComp.loginHandel = handel;
                    loginUIComp.showWxInfoButton();
                }
            }
        })
    }

    /**
     * 
     * @param obj 
     */
    public request(obj){
        if(!this.checkWx()){
            return;
        }
        Logger.info("微信http请求：",obj.url,"   POSTDATA:",JSON.stringify(obj.data))
        const requestTask = this.wx.request({
            url:obj.url,
            data:obj.data,
            header:{
                "Content-Type": "application/json" 
            },
            method: "POST",
            success:function(res){
                obj.success(res);
            },
            fail:function(err){
                obj.fail(err);
            }
        })
        return requestTask;
    }

    /**
     * 分享
     * @param data 
     * @param callback 
     */
    public async share(data:{title:string,imageUrl:string,query:any},callback:CommonHandel){
        if(!data){
            return;
        }
        Logger.info("微信分享:",data);
        if(!this.checkWx()){
            return;
        }
        this.wx.shareAppMessage({
            title:data.title,
            imageUrl:data.imageUrl,
            query:data.query,
            success: function (res) {
                Logger.info("onShare success:"+JSON.stringify(res));
                // 转发成功
                if(callback){
                    callback.success(res);
                }
            },
            fail: function (res) {
                Logger.info("onShare fail:"+JSON.stringify(res));
                callback.fail(res);
            },
            complete:function(res){
                Logger.info("onShare complete:"+JSON.stringify(res));
                callback.complete(res);
            }
        
        })
    
        
    }

    /**
     * 广告
     * @param obj 
     */
    public changeBannerAd(obj){
        if(!this.checkWx()){
            return;
        }
        if(!this.wx.createBannerAd)return;
        var that = this;
        var _callfunc=function(winWidth,winHeight){
            let height=winWidth*100/350;

            that.bannerAd = that.wx.createBannerAd({
                adUnitId:'adunit-126db2a263dfa9f7',
                style: {
                    left: (winWidth-350)/2,
                    top: winHeight-height,
                    width: 350
                }
            })

            that.bannerAd.onResize(res => {
                that.bannerAd.style.width =  that.bannerAd.style.realWidth;
                that.bannerAd.style.height =  that.bannerAd.style.realHeight;
                that.bannerAd.style.left = (winWidth- that.bannerAd.style.width)/2,
                that.bannerAd.style.top =   winHeight- that.bannerAd.style.height;
            })
        }
        if(that.bannerAd){
            that.bannerAd.destroy()
        }

        that.wx.getSystemInfo({
            success:function(res){
                if(res.errMsg=='getSystemInfo:ok'){
                    Logger.info("bannerAd  Add");
                    _callfunc(res.screenWidth,res.screenHeight);
                }
            }
        });

        
        
    }

    /**
     * 广告视屏
     * createRewardedVideoAd
     * @param obj 
     */
    public createRewardedVideoAd(obj:{adUnitId:string,onLoad:Function,onClose:Function}){
        Logger.info("广告视屏");
        if(!this.checkWx()){
            return;
        }
        if(!this.wx.createRewardedVideoAd)return;
        var that = this;
        if(!that.rewardedVideoAd){
            that.rewardedVideoAd = this.wx.createRewardedVideoAd({ adUnitId:obj.adUnitId});
        }

        if(that.rewardedVideoAd){
            //
            that.rewardedVideoAd.show()
            .then(() =>{
                Logger.info('激励视频 广告显示');
            })
            .catch(err => {
                Logger.info('拉取失败，重新拉取');
                that.rewardedVideoAd.load()
                .then(() => that.rewardedVideoAd.show())
            })

            //
            that.rewardedVideoAd.onLoad(() => {
                Logger.info('激励视频 广告加载成功');
                if(obj){
                    obj.onLoad();
                }
            })

            //
            that.rewardedVideoAd.onClose(res => {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    // 正常播放结束，可以下发游戏奖励
                    Logger.info(" 正常播放结束，可以下发游戏奖励");
                    
                    if(obj){
                        obj.onClose(true);
                    }
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    Logger.info(" 播放中途退出，不下发游戏奖励");
                    if(obj){
                        obj.onClose(false);
                    }
                }
            })
        }

        
    }

    
    //GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
    /**
     * 微信平台 openID
     * @param obj 
     */
    public getWxOpenID(obj:{code:string,success:Function}){
        this.request({
            url:`https://api.weixin.qq.com/sns/jscode2session?appid=${GameConfig.WxConfig.AppId}&secret=${GameConfig.WxConfig.AppSecret}&js_code=${obj.code}&grant_type=authorization_code`,
            data:{
            },
            success:function(res){
                obj.success(res);
            },
            fail:function(err){

            }
        })
    }

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    /**
     * downLoad 微信下载资源api
     * @param {urls:[] process:function ,success:function} obj 
     */
    public downLoad(obj){
        if(!obj){
            return;
        }
        if(!obj.urls){
            return;
        }
        this.downLoadConfig.total = obj.urls.length
        this.downLoadConfig.process = 0;
        //
        this.downLoadNext(obj)
    }
    private downLoadNext (obj){
        var that = this;
        const url = obj.urls[this.downLoadConfig.process];
        this.downLoadOne(url,function(){
            that.downLoadConfig.process++;
            obj.process(that.downLoadConfig.process,that.downLoadConfig.total);
            if(that.downLoadConfig.process<that.downLoadConfig.total){
                that.downLoadNext(obj)
            }else{
                obj.success('下载完成')
            }
        })
    }
    private downLoadOne (url,callback){
        var that = this;
        const downloadTask = this.wx.downloadFile({
            url: GameConfig.downLoadUrl+url,
            success (res) {
                
                let dirArr = [];
                //分割上级目录成数组
                dirArr = url.split('/');
                dirArr.splice(dirArr.length-1,1)
                new Promise(function(resolve,reject){
                    var startDir = '';
                    dirArr.forEach(function (element) {
                        startDir += element+'/';
                        //创建文件夹
                        that.wx.getFileSystemManager().mkdir({
                            dirPath: that.wx.env.USER_DATA_PATH + '/' + startDir,
                            success: function () {
                                // Logger.log("创建文件夹成功");
                            },
                            fail: function (e) {
                                // Logger.log("创建文件夹失败",e.errMsg);
                            }
                        })

                    });
                    resolve("创建文件的所有父目录成功");
                }).then(()=>{
                    that.wx.getFileSystemManager().saveFile({
                        tempFilePath:res.tempFilePath,
                        filePath:`${that.wx.env.USER_DATA_PATH}/${url}`,
                        success:function(save_file){
                            Logger.info("saveFile success",save_file);
                            callback();
                        },
                        fail:function(save_err){
                            Logger.info("saveFile fail:",save_err);
                        }
                    })
                })
                
            },
            fail:function(res){
                Logger.info("wx downLoad fail:",res);
            }
        })
    }

    
	
}