
import { LoadHandel} from "../Define/CommonParam";
import { WXManager} from "../Tool/wx/wxApi";
import { Logger } from "../Tool/Logger";
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
    private json_deps:Array<string> = [];
    //加载的音乐文件
    private audio_deps:Array<string> = [];
    //预制件
    private prefab_deps:Array<string> = [];
    //图片纹理
    private texture_deps:Array<string> = [];
    private spriteFrame_deps:Array<string> = [];
    //字体

    //需要提前加载的资源数组
    private preResArr:Array<any> = ['view/LoginUI',
    'view/nodes/BackGround'];
	public constructor() {
        this.init();
    }
    /**
     * 初始化
     */
    private init(){

    }

    getSkeleton(key:string):sp.SkeletonData{
        return cc.loader.getRes('spine/'+key,sp.SkeletonData);
    }
    /**
     * 获取json配置文件
     * @param key 
     */
    getJsonConfig(key:string):any{
        return cc.loader.getRes('json/'+key,cc.JsonAsset).json;
    }
    /**
     * 获取音乐
     * @param key 
     */
    getAudio(key:string):cc.AudioClip{
        return cc.loader.getRes('audio/'+key,cc.AudioClip);
    }
    /**
     * 获取预制件
     * @param key 
     */
    getPrefab(key:string):cc.Prefab{
        return cc.loader.getRes('view/'+key,cc.Prefab);
    }
    async getPrefabAsync(key:string):Promise<any>{
        let catch_prefab:cc.Prefab = cc.loader.getRes('view/'+key,cc.Prefab);
        if(catch_prefab){
            return new Promise((resolve, reject) => {
                resolve(catch_prefab)
            })
        }else{
            // 加载 Prefab
            return new Promise((resolve, reject) => {
                let onLoad = function(err, prefab:cc.Prefab){
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(prefab);
                }
                cc.loader.loadRes('view/'+key,cc.Prefab,onLoad);
            })
        }  
        
    }
    /**
     * 获取SpriteFrame
     * @param key 
     */
    getSpriteFrame(key:string):cc.SpriteFrame{
        let spriteFrame = null;
        //图集缓存中查找
        let c_atlas = cc.loader.getRes('texture/ResAtlas',cc.SpriteAtlas);
        if(c_atlas){
            spriteFrame = c_atlas.getSpriteFrame(key);
            if(spriteFrame){
                return spriteFrame;
            }else{
                return cc.loader.getRes('texture/'+key,cc.SpriteFrame);
            }
            
        }
        return spriteFrame;
    }
    /**
     * 释放所有
     */
    releaseAll(){

    }
    /**
     * 释放所有纹理
     */
    releaseAllTexture(){
        Logger.info('释放所有纹理');
        
        cc.sys.garbageCollect();
    }
    /**
     * 释放所有音频
     */
    releaseAllAudio(){
        Logger.info('释放所有音频',this.audio_deps);
        for (let index = 0; index < this.audio_deps.length; index++) {
            cc.loader.release(this.audio_deps[index]);
        }
        this.audio_deps.splice(0,this.audio_deps.length);
        cc.sys.garbageCollect();
    }
    /**
     * 释放所有json配置
     */
    releaseAllJsonConfig(){
        Logger.info('释放所有json配置',this.json_deps);
        for (let index = 0; index < this.json_deps.length; index++) {
            cc.loader.release(this.json_deps[index]);
        }
        this.json_deps.splice(0,this.json_deps.length);
        cc.sys.garbageCollect();
    }

    /**
     * 释放所有动态加载的图片
     */
    releaseAllTempIcon(){
        Logger.info('释放所有动态加载的图片',this.tempIcon_deps);
        for (let index = 0; index < this.tempIcon_deps.length; index++) {
            cc.loader.release(this.tempIcon_deps[index]);
        }
        this.tempIcon_deps.splice(0,this.tempIcon_deps.length);
    }
    
    /**
     * 释放一批资源
     */
    releaseRes(urls:Array<string>){
        Logger.info(' 释放一批预制件',urls);
        for (let index = 0; index < urls.length; index++) {
            cc.loader.release(urls[index]);
        }
    }

    /**
     * 预先加载启动页面
     * @param handel 
     */
    public preLoadRes(handel:LoadHandel){
        cc.loader.loadResArray(this.preResArr,function(){
            handel.complete();
        })
    }
    /**
     * 加载资源
     */
    public loadRes(handel:LoadHandel,loadv?:cc.Node){
        this.loadhandel = handel;
        if(loadv){
            this.loadView = loadv;
        }
        this.showLoadView();
        //预加载
        // for(let r of GameConfig.beforeLoadRes){
        //     await LoadAsync.getRes(r).load();
        // }

        cc.loader.release(this.preResArr);

        var that = this;
        that.loadResRemote({
            success:function(){
                Logger.info('LoadManager 资源加载完成');
                that.hideLoadView();
                that.loadhandel.complete();
            }
        });
    }

    /**
     * 提前加载本地资源
     * @param {*} obj 
     */
    private loadResRemote(obj){
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
                        that.json_deps = that.json_deps.concat(cc.loader.getDependsRecursively(asset));
                    }else if(assetType == 'cc.SpriteFrame'){
                        
                    }else if(assetType == 'cc.TTFFont'){
                        
                    }else if(assetType == 'cc.Texture2D'){
                        
                    }else if(assetType == 'sp.SkeletonData'){
                    }else if(assetType == 'cc.AudioClip'){
                        that.audio_deps = that.audio_deps.concat(cc.loader.getDependsRecursively(asset));
                    }else if(assetType == 'cc.Prefab'){
                        
                    }
                    
                }
                obj.success();
            }
        );
    }

    private tempIcon_deps:Array<string> = [];
    /**
     * 精灵动态加载网络图片
     * @param container 
     * @param _iconUrl 
     * @param _callfunc 
     */
    public loadHttpIcon(container, _iconUrl, _callfunc) {
        if (!_iconUrl || _iconUrl == "") {
            _iconUrl = "http://thirdwx.qlogo.cn/mmopen/vi_32/opmkDJhG2jpF8X8AfFQfTauRlpBc7VeFicJevZ9IiajEl5g4ia75opNSZOb0FvDV87BvpUN1rsyctibGnicP7uibsMtw/132"
        }
        var that = this;
        //缓存中查找
        let c_texture = cc.loader.getRes(_iconUrl,cc.Texture2D);
        if(c_texture){
            container.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(c_texture);
            if (_callfunc) {
                _callfunc()
            }
            return;
        }
        //动态加载
        cc.loader.load({ url: _iconUrl, type: 'png' }, function (err, tex:cc.Texture2D) {
            var spriteFrame = new cc.SpriteFrame(tex)
            container.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            if (_callfunc) {
                _callfunc()
            }
            that.tempIcon_deps.push(_iconUrl);
        });
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
        this.loadhandel.process(completedCount,totalCount);
    }
	
}