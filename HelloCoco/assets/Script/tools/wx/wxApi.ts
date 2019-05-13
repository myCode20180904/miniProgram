import { Logger } from "../Logger";
import { CommonHandel } from "../../define/CommonParam";
import { GameConfig } from "../../GameConfig";
import { UserManager } from "../../manager/UserManager";
import { LocalNode } from "../../LocalNode";

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
        Logger.info("获取启动参数:",this.launchData);
        if(this.launchData.query){
            if(this.launchData.query){
                this.dealQuery(this.launchData.scene,this.launchData.query);
            }
         }

        //  用户点击了“转发”按钮
        this.wx.onShareAppMessage(function() {
            return {
                title:"高校对决",
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
            cc.director.pause();
            Logger.info("onHide "); 
            

        });
        this.wx.onShow((res)=>{
            cc.director.resume();
            // AudioManager.Instance.playBGM()
            Logger.info("onShow");
            Logger.info(res);
            if(res.query){
                this.dealQuery(res.scene,res.query);
            }

        });
        /**
         * 以下事件会触发音频中断开始事件：接到电话、闹钟响起、系统提醒、收到微信好友的语音/视频通话请求。被中断之后，小游戏内所有音频会被暂停，并在中断结束之前都不能再播放成功。
         */
        this.wx.onAudioInterruptionBegin(function () {
            // 暂停游戏
            cc.director.pause();
        })
        this.wx.onAudioInterruptionEnd(function () {
            cc.director.resume();
            // AudioManager.Instance.playBGM()
        })

        this.wx.getSystemInfo({
            success:function(res){
                if(res.errMsg=='getSystemInfo:ok'){
                    Logger.info("getSystemInfo:",res);
                }
            }
        });

    }

    private dealQuery(scene:number,query:any){
        UserManager.Instance.enterQuery.secneID = scene;
        //分享邀请
        if(query.sharetype&&query.sharekey){
            UserManager.Instance.enterQuery.shareType = parseInt(query.sharetype);
            UserManager.Instance.enterQuery.shareKey = parseInt(query.sharekey);
        }
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
     * 显示消息提示框
     * @param msg 
     * @param icon success, success_no_circle, info, warn, waiting, cancel, download, search, clear
     * @param dt 
     */
    public showToast(msg:string,icon:string,dt:number){
        if(!this.checkWx()){
            return;
        }
        this.wx.showToast({
            title: msg,
            icon: icon,
            duration: dt
          })
    }
    public showLoading(title:string){
        if(!this.checkWx()){
            return;
        }
        this.wx.showLoading({
            title: title,
            mask: true,
          })
    }
    public hideLoading(title:string){
        if(!this.checkWx()){
            return;
        }
        this.wx.hideLoading();
    }

    /**
     * 登录
     * @param handel 
     */
    public login(target,handel:CommonHandel){
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
                that.getUserInfo(target,handel);
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
    public getUserInfo(target,handel:CommonHandel){
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

                        },
                        async fail(){
                            Logger.info("获取wx用户失败---转到授权界面-");

                            target.showWxInfoButton();
                        }
                    })
                }else{
                    Logger.info("==转到授权界面===")

                    target.showWxInfoButton();
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
        Logger.info(obj.url)
        Logger.info("POSTDATA"+JSON.stringify(obj.data))
        const requestTask = this.wx.request({
            url:obj.url,
            data:obj.data,
            header:{
                "Content-Type": "application/json" 
            },
            method: "POST",
            success:function(res){
                Logger.info(res);
            },
            fail:function(err){
                obj.fail(err);
                Logger.info("err"+JSON.stringify(err));
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
                if(callback){
                    callback.fail(res);
                }
            },
            complete:function(res){
                Logger.info("onShare complete:"+JSON.stringify(res));
                if(callback){
                    callback.complete(res);
                }
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
    public createRewardedVideoAd(obj:{onLoad:Function,onClose:Function}){
        Logger.info("广告视屏");
        if(!this.checkWx()){
            return;
        }
        if(!this.wx.createRewardedVideoAd)return;
        var that = this;
        if(!that.rewardedVideoAd){
            that.rewardedVideoAd = this.wx.createRewardedVideoAd({ adUnitId:'adunit-f60366d91f6e4092'});
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