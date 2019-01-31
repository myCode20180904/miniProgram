import { HangUpInfo } from "../Define/UserType";

/**
 *  挂机 管理
 */
const {ccclass, property} = cc._decorator;

@ccclass
export class HangManager extends cc.Component{
	private static instance: HangManager;
	public static get Instance(): HangManager {
		if (this.instance == null) {
			this.instance = new HangManager();
		}
		return this.instance;
    }
 
    public hangUpInfo:HangUpInfo = new HangUpInfo();  //挂机房信息
	public constructor() {
        super();
        this.hangUpInfo.UnlockBossArr = [
            {name:"班主任",imageUrl:'-',combat:20,say:"嗯？被我发现了吧！"},
            {name:"训导主任",imageUrl:'-',combat:50,say:"????"}]
    }
    /**
     * 获取挂机信息
     */
    getHangUpInfo(){
        return this.hangUpInfo;
    }

    updateHang(){

    }



    onLoad(){

    }

    onDestroy(){

    }



    update (dt) {

    }

    
	
}