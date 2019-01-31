
import { BaseUI} from "../View/BaseUI";
import { AudioManager, AudioType } from "./AudioManager";
import { Logger } from "../Tool/Logger";
import { Toast } from "../View/Toast";

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
    
    //ui 池
    private uiPool:{ [key: string]: any} = {};
    //ui 字典
    private uiList:{ [key: string]: any} = {};
    //舞台根节点
    private rootNode:cc.Node = cc.find('Canvas');

	public constructor() {
        this.init();
    }
    /**
     * 初始化
     */
    private init(){

    }

    /**
     * preLoadWindow 提前导入资源
     */
    public preLoadWindow(names:Array<string>){
        var that = this;
        for (const iterator of names) {
            //如果加载过
            if(that.uiPool[iterator]){
                return ;
            }
            //加载
            let file = 'view/'+iterator;
            this.loadPrefab(file).then(prefab=>{
                that.uiPool[iterator] = prefab;
            }).catch(error=>{
                Logger.info(error)
            })
            
        }
        
    }

    /**
     * open window 支持异步加载
     */
    public async openWindow(name:string,zoder?:number){
        var that = this;
        let file = 'view/'+name;
        //如果加载过，直接从池子里面取
        if(that.uiPool[name]){
            //添加
            that.addNew(name,zoder?zoder:0);
            return ;
        }
        //加载
        let async_prefab = await this.loadPrefab(file).then(prefab=>{
           return prefab;
        }).catch(error=>{
            Logger.info(error)
        })
        that.uiPool[name] = async_prefab;
        //添加
        that.addNew(name,zoder?zoder:0);

    }

    /**
     * 创建一个预制件作为节点
     */
    public async createPrefab(name:string): Promise<any>{
        var that = this;
        let file = 'view/nodes/'+name;
        let node:cc.Node = null;
        //如果加载过，直接从池子里面取
        if(that.uiPool[name]){
            node = cc.instantiate(that.uiPool[name]);
        }else{
             //加载
            let async_prefab = await this.loadPrefab(file).catch(error=>{
                Logger.info(error)
            })
            that.uiPool[name] = async_prefab;
            //添加
            node = cc.instantiate(that.uiPool[name]);
        }
       
        let comp = node.getComponent(name)
        
        return new Promise((resolve, reject) => {
            resolve(comp)
        })
    }

    /**
     * close window
     * @param name 
     */
    public closeWindow(name:string){
        if(this.uiList[name]){
            this.hide(name);
            Logger.info('closeWindow:',name);
            //移除
            this.rootNode.removeChild(this.uiList[name]);
            this.uiList[name].destroy();
            delete this.uiList[name];

        }else{
            Logger.info('closeWindow:',name,'not found');
        }
    }

    /**
     * closeAllWindow
     */
    public closeAllWindow(){
        Logger.info("closeAllWindow:");
        for(let key in this.uiList){
            if(this.uiList[key]){
                this.rootNode.removeChild(this.uiList[key],true);
                this.uiList[key].destroy();
                delete this.uiList[key];
            }
        }
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
            });
        })
    }
    
    /**
     * find Window
     * @param name 
     */
    public findWindow(name:string):cc.Node{
        return this.uiList[name];
    }
    
    /**
     * find Component
     * @param name 
     */
    public findComponent(name:string):any{
        if(this.uiList[name]){
            return this.uiList[name].getComponent(name);
        }
        return null;
    }

    /**
     * 添加一个新的窗口
     * @param name 
     */
    private addNew(name:string,zoder:number):cc.Node{
        Logger.info('openWindow:',name);
        if(this.uiList[name]){
            this.closeWindow(name);
        }
        if(!this.uiPool[name]){
            return null;
        }
         //添加
         var node = cc.instantiate(this.uiPool[name]);
         this.rootNode.addChild(node,zoder);
         this.uiList[name] = node;
         this.show(name);
         return node;
    }

    private show(name:string){
        AudioManager.Instance.playEff(AudioType.EFF_OpenWindow)
        let comp = this.uiList[name].getComponent(name)
        if(comp['addFlowBg']){
            comp.addFlowBg();
        }
        if(comp['onShow']){
            comp.onShow();
        }
        comp.enabled = true;
    }

    private hide(name:string){
        AudioManager.Instance.playEff(AudioType.EFF_CloseWindow);
        let comp = this.uiList[name].getComponent(name)
        if(comp&&comp['onHide']){
            comp.onHide();
        }
        comp.enabled = true;
    }
    
     public async showToast(msg:string,dt:number = 2.0){
        await this.openWindow("Toast");
        let toast:Toast = this.findComponent('Toast');
        toast.showMsg(msg,dt);
     }
    /**
     * load 预置资源Prefab
     */
    public async loadPrefab(file:string): Promise<any>{
        return new Promise((resolve, reject) => {
            let onLoad = function(err, prefab){
                if(err){
                    reject(err);
                    return;
                }
                resolve(prefab);
            }

            cc.loader.loadRes(file,onLoad);
        })
    }
	
}