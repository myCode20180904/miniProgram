import { LoadManager } from "../manager/LoadManager";
import { Logger } from "../Tool/Logger";
import { WX_OpenData, WXManager } from "../Tool/wx/wxApi";
import { UIManager } from "../manager/UIManager";

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
        if(gateid>161){
            gateid = Math.floor(Math.random()*10)+1;
        }
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
        //同步到微信子域
        if (this.gateLevel) {
            let wx_OpenData = new WX_OpenData("setUserCloudStorage")
            wx_OpenData.res = {
                level: this.gateLevel
            };
            WXManager.Instance.sendMessageToChild(wx_OpenData);
        }
    }

    /**
     * 进入游戏
     */
    public enterGame(){
        UIManager.Instance.openWindow('LLXLayer');
        UIManager.Instance.closeWindow("RankUI")
        UIManager.Instance.closeWindow("MainUI")
    }
    /**
     * 结束游戏
     */
    public exitGame(){
        UIManager.Instance.openWindow("MainUI",-1);
        UIManager.Instance.openWindow("RankUI",-1)
        UIManager.Instance.closeWindow('LLXLayer');
        this.clear();
    }
    /**
     * 重来
     */
    public restartGame(){
        UIManager.Instance.closeWindow('LLXLayer');
        this.clear();
        UIManager.Instance.openWindow('LLXLayer');
    }
    /**
     * clear
     */
    public clear(){
        this.gameinfo = {};

    }
  
}