import { Logger } from "../tools/Logger";

/**
 * 界面管理
 */
export class WindowCode {
	//主界面

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

    constructor(){

    }
    
    private uimap:{ [key: string]:  Array<string>} = {};

    /**
     * 注册ui到UIManager
     */
    public regUI(name:string,id:string){
        
        if(this.uimap[name] instanceof Array){
            this.uimap[name].push(id);
        }else{
            this.uimap[name] = new Array();
            this.uimap[name].push(id);
        }
    }

    public unRegUI(name:string,id:string){
        if(!this.uimap[name]){
            return;
        }
        let idx = this.uimap[name].indexOf(id);
        if(idx>=0){
            this.uimap[name].splice(idx,1);
        }

        Logger.info(this.uimap);
    }

    public getRegUI(name:string,id?:string):cc.Node{
        if(!this.uimap[name]){
            return null;
        }
        if(this.uimap[name].length<=0){
            return null;
        }

        if(id){
            return cc.find('Canvas').getChildByUuid(id)
        }else{
            return cc.find('Canvas').getChildByUuid(this.uimap[name][this.uimap[name].length-1]);
        }
    }
    

    
    
}