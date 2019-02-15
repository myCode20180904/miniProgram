
import { CommonHandel, LoadHandel} from "../Define/CommonParam";
import { GameConfig,LoginType,GameLoginType} from "../Define/GameConfig";
import { WXManager} from "../Tool/wx/wxApi";
import { Logger } from "../Tool/Logger";
import { LoginUI } from "../View/LoginUI";
import { UIManager } from "./UIManager";
/**
 * LoadManager  加载资源管理
 */
export class LoadManager {
	private static instance: LoadManager;
	public static get Instance(): LoadManager {
		if (this.instance == null) {
			this.instance = new LoadManager();
		}
		return this.instance;
    }
    
   
    private loadhandel:LoadHandel = null;
    private loadView:cc.Node = null;
    //加载的配置文件
    public configs:{ [key: string]: any} = {};
    //加载的骨骼动画
    public skeletons:{ [key: string]: any} = {};
    //加载的音乐文件
    public audios:{ [key: string]: any} = {};
	public constructor() {
        this.init();
    }
    /**
     * 初始化
     */
    private init(){

    }

    /**
     * 加载资源
     */
    public async loadRes(handel:LoadHandel,loadv?:cc.Node): Promise<any>{
        this.loadhandel = handel;
        if(loadv){
            this.loadView = loadv;
        }
        this.showLoadView();
       
        var that = this;
        return new Promise((resolve, reject) => {
            that.doLoadRes({
                success:function(){
                    Logger.info('LoadManager 资源加载完成');
                    that.hideLoadView();
                    that.loadhandel.complete();
                    resolve();
                }
            });
        })
    }

    /**
     * 提前加载本地资源
     * @param {*} obj 
     */
    private async doLoadRes(obj){
        this.loadResLocal(obj,"./");
        
    }
    /**
     * 
     * @param obj 
     */
    private loadResLocal(obj,path){
        var that = this;
        //本地加载
        cc.loader.loadResDir(path,
            function (completedCount, totalCount,item){
                that.processLoadView(completedCount,totalCount)
            },
            function (err, assets, urls) {
                if(err){
                    Logger.info(err);
                    return;
                }
                
                Logger.info('加载了下列资源:',assets)
                for (const asset of assets) {
                    let assetType:string = asset.__classname__;
                    if(assetType == 'cc.JsonAsset'){
                        that.configs[asset.name] = asset.json;
                    }else if(assetType == 'cc.SpriteFrame'){
                        
                    }else if(assetType == 'cc.TTFFont'){
                        
                    }else if(assetType == 'cc.Texture2D'){
                        
                    }else if(assetType == 'sp.SkeletonData'){
                        //spine动画
                        that.skeletons[asset.name] = asset;
                    }else if(assetType == 'cc.AudioClip'){
                        that.audios[asset.name] = asset;
                    }else{

                    }
                    
                }
                obj.success();
            }
        );
    }

    /**
     * 加载远程资源（废弃）
     * @param {*} obj 
     */
    private loadResWX(obj){
        var that = this;
        Logger.info(window['wx'],cc.loader.downloader);
        
        //加载远程资源
        WXManager.Instance.downLoad({
            urls:['remoteRes/fnt/hyykh.ttf',
            'remoteRes/json/monster.json',
            'remoteRes/json/map1.json',
            'remoteRes/texture/战斗界面1.png',
            'remoteRes/texture/fight/background1.png',
            'remoteRes/texture/fight/pause.png',
            'remoteRes/texture/fight/top.png',
            'remoteRes/spine/hero/nanzhu.json',
            'remoteRes/spine/hero/nanzhu.png',
            'remoteRes/spine/hero/nanzhu.atlas',
            'remoteRes/spine/hero/nanzhu.skel'
            ],
            success:function(res){
                Logger.info(res)
                //初始字体
                let fontname = WXManager.Instance.wx.loadFont(`${WXManager.Instance.wx.env.USER_DATA_PATH}/remoteRes/fnt/HYYANKAIW.ttf`)
                if(fontname){
                    
                }
                // obj.success();
                that.loadResLocal(obj,`remoteRes`);

            },
            process:function(completedCount,totalCount){
                that.processLoadView(completedCount,totalCount)
            }
        });


    }


    private showLoadView(){
        if(this.loadView){
            this.loadView.active = true;
        }
    }
    private hideLoadView(){
        if(this.loadView){
            this.loadView.active = false;
        }
    }
    private processLoadView(completedCount,totalCount){
        // Logger.info("加载本地资源:",`完成度:${completedCount}/${totalCount}`);
        let loginUI:LoginUI = UIManager.Instance.findComponent("LoginUI");
        if(loginUI){
            loginUI.showProcess(Math.floor(completedCount/totalCount)*100);
        }
    }
	
}