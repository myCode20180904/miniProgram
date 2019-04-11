
import { AudioManager, AudioType } from "./AudioManager";
import { Logger } from "../Tool/Logger";
import { Toast } from "../View/Toast";
import { LoadManager } from "./LoadManager";

/**
 * 界面管理
 */
export class WindowCode {
	//主界面
	public static TYPE_MainUI:string = "MainUI";
	public static TYPE_TopUI:string = "TopUI";

}

/**
 * UIManager ui 预置资源管理
 */
export class UIManager {
	private static instance: UIManager;
	public static get Instance(): UIManager {
		if (this.instance == null) {
			this.instance = new UIManager();
		}
		return this.instance;
    }
    //舞台根节点
    private rootNode:cc.Node = cc.find('Canvas');
    //UI列表
    private uiList:Array<string> = [];
    //keep
    private uiKeepList:Array<string> = [];

	public constructor() {
        this.init();
    }
    /**
     * 初始化
     */
    private init(){

    }

   /**
    * open window (可能回延时加载)
    * @param key 
    * @param zoder 
    */
    public async openWindow(key:string,zoder?:number):Promise<any>{
        //
        let prefab:cc.Prefab = LoadManager.Instance.getPrefab(key);
        if(prefab){
            //添加
            this.addToRoot(prefab,key,zoder?zoder:0);
            return new Promise((resolve, reject) => {
                resolve()
            })
        }else{
            var that = this;
            return new Promise((resolve, reject) => {
                LoadManager.Instance.getPrefabAsync(key).then(function(prefab:cc.Prefab){
                    that.addToRoot(prefab,key,zoder?zoder:0);
                    resolve();
                })
            })
            
        }
    }
    /**
     * 添加一个新的窗口
     * @param prefab 
     * @param key 
     * @param zoder 
     */
    private addToRoot(prefab:cc.Prefab,key:string,zoder:number):cc.Node{
        Logger.info('openWindow:',key);
        if(this.uiList.indexOf(key)>=0){
            this.closeWindow(key);
        }
         //添加
         var node = cc.instantiate(prefab);
         this.rootNode.addChild(node,zoder);
         this.show(key);
         this.uiList.push(key);
         return node;
    }
    //预制名称
    private getCompName(key:string):string{
        let atrArr = key.split('/');
        return atrArr[atrArr.length-1];
    }

    private show(key:string){
        AudioManager.Instance.playEff(AudioType.EFF_OpenWindow)
        let name = this.getCompName(key);
        let comp = this.rootNode.getChildByName(name).getComponent(name);
        if(comp['addFlowBg']){
            comp.addFlowBg();
        }
        if(comp['onShow']){
            comp.onShow();
        }
        comp.enabled = true;
    }

    private hide(key:string){
        AudioManager.Instance.playEff(AudioType.EFF_CloseWindow);
        let name = this.getCompName(key);
        let comp = this.rootNode.getChildByName(name).getComponent(name);
        if(comp&&comp['onHide']){
            comp.onHide();
        }
        comp.enabled = true;
    }

    /**
     * 创建一个预制件作为节点
     */
    public createPrefab(key:string){
        //
        let prefab:cc.Prefab = LoadManager.Instance.getPrefab(key)
        if(prefab){
            return cc.instantiate(prefab);
        }else{
            return null;
        }
    }

    /**
     * close window
     * @param key 
     */
    public closeWindow(key:string){
        let node = this.findWindow(key);
        if(node){
            this.hide(key);
            Logger.info('closeWindow:',key);
            //移除
            node.removeFromParent();
            node.destroy();
            this.uiList.splice(this.uiList.indexOf(key),1)
        }else{
            Logger.info('closeWindow fail:',key,'not found');
        }
    }

    /**
     * closeAllWindow
     */
    public closeAllWindow(){
        Logger.info("closeAllWindow:");
        for (let index = 0; index < this.uiList.length; index++) {
            this.closeWindow(this.uiList[index]);
            
        }
        cc.sys.garbageCollect();
    }
    
    /**
     * loadScene 加载场景
     * @param name 
     * @param loade 
     */
    public async loadScene(name:string,loaded:Function): Promise<any>{
        this.closeAllWindow();
        var that = this;
        return new Promise((resolve, reject) => {
            cc.director.loadScene(name,async function(){
                loaded();
                that.rootNode = cc.find('Canvas');
                resolve()
                cc.sys.garbageCollect();
            });
        })
    }
    
    /**
     * find Window
     * @param key 
     */
    public findWindow(key:string):cc.Node{
        let name = this.getCompName(key);
        return this.rootNode.getChildByName(name);
    }
    
    /**
     * find Component
     * @param key 
     */
    public findComponent(key:string):any{
        let name = this.getCompName(key);
        let node = this.findWindow(key);
        if(node){
            return node.getComponent(name);
        }else{
            return null;
        }
        
    }

    
    
     public async showToast(msg:string,dt:number = 2.0){
        this.openWindow("Toast");
        let toast:Toast = this.findComponent('Toast');
        toast.showMsg(msg,dt);
    }
	
}