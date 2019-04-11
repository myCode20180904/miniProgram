import { Logger } from "../Tool/Logger";
import { LoadManager } from "./LoadManager";


/**
 * FGUIManager ui 预置资源管理
 */
export class FGUIManager {
	private static instance: FGUIManager;
	public static get Instance(): FGUIManager {
		if (this.instance == null) {
			this.instance = new FGUIManager();
		}
		return this.instance;
    }
    //舞台根节点
    private rootNode:cc.Node = cc.find('Canvas');

	public constructor() {
        this.init();
    }
    /**
     * 初始化
     */
    private init(){
        //导入fgui
        fgui.addLoadHandler();
        fgui.GRoot.create();
        this.rootNode.on("onUILoaded", this.onUILoaded, this);
    }

    /**
     * open window 支持异步加载
     */
    public openWindow(comp: typeof cc.Component,fullScene:boolean = true){
        
        if(fullScene){
            this.closeAllWindow();
        }
        this.rootNode.addComponent(comp);
    }
    /**
     * 界面加载完
     */
    private onUILoaded(view){
        Logger.info('onUILoaded',123);
    }

    /**
     * close window
     * @param name 
     */
    public closeWindow(comp: typeof cc.Component){
        Logger.info(this.rootNode.getComponent(comp))
        
        // fgui.GRoot.inst.removeChild(this.rootNode.getComponent(comp)['_view']);
        this.rootNode.getComponent(comp).destroy();
    }

    /**
     * closeAllWindow
     */
    public closeAllWindow(){
        Logger.info("closeAllWindow:");
        
        // fgui.GRoot.inst.removeChildren(0, -1, true);
    }
    
    /**
     * loadScene 加载场景
     * @param name 
     * @param loade 
     */
    public async loadScene(name:string,loaded:Function): Promise<any>{
        this.closeAllWindow();
        LoadManager.Instance.releaseAllTempIcon();
        cc.sys.garbageCollect();
        var that = this;
        return new Promise((resolve, reject) => {
            cc.director.loadScene(name,function(){
                that.rootNode = cc.find('Canvas');
                loaded();
                resolve()
            });
        })
    }
    
    
}