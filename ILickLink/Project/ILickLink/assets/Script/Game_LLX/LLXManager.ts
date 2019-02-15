import { LoadManager } from "../manager/LoadManager";
import { Logger } from "../Tool/Logger";

/**
 * FighterFactor 战斗角色管理工厂
 */
export class LLXManager {
	private static instance: LLXManager;
	public static get Instance(): LLXManager {
		if (this.instance == null) {
			this.instance = new LLXManager();
		}
		return this.instance;
    }
    /**
     * 关卡信息
     */
    public gameinfo:any = {};
    public gateLevel:number = 1;
	public constructor() {
        
    }
    /**
     * 初始化
     */
    public init(){
        this.initGateConfig();
    }
    /**
     * 初始关卡配置信息 并存入字典
     */
    private initGateConfig(){
        //获取关卡等级
        if(!cc.sys.localStorage.getItem('llx_gateLevel')){
            cc.sys.localStorage.setItem('llx_gateLevel', 1);
        }
        this.gateLevel = parseInt(cc.sys.localStorage.getItem('llx_gateLevel'));

        let gateid = 100 + this.gateLevel;
        let config = LoadManager.Instance.configs['gate'+gateid];
        if(!config){
            Logger.error("读取物配置信息失败");
            return;
        }
        this.gameinfo = config;
        Logger.info("加载",gateid,"关");
    }
    /**
     * 下一关
     */
    public nextLevel(){
        this.gateLevel++;
        cc.sys.localStorage.setItem('llx_gateLevel', this.gateLevel);
    }
    /**
     * 
     */
    public exitGame(){
        this.clear();
    }
    /**
     * clear
     */
    public clear(){
        this.gameinfo = {};

    }
  
}