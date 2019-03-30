
import { SC_Packet, CS_Packet,CS_UserLogin,SC_UserLogin, SC_AllRank, SC_DayRank, SC_CombatRank } from "../Net/MsgPacket";
import {UserInfo } from "../Define/UserType";
import { RankInfo } from "../Define/RankInfo";
import { UIManager } from "./UIManager";

export class RankManager {
    private static instance: RankManager;
	public static get Instance(): RankManager {
		if (this.instance == null) {
			this.instance = new RankManager();
		}
		return this.instance;
    }

    // 数据
    private rankInfo: RankInfo = new RankInfo();

    public constructor() {
     
    }
    /**
     * 获得信息
     */
    public getRankInfo(): RankInfo {
        return this.rankInfo;
    }
    
    // /**
    //  * 刷新AllRank总排行榜
    //  */
    // public refreshAllRank(msg:SC_AllRank){
    //     this.rankInfo.allrankArr = msg.rankList;
    //     let s_rank = UIManager.Instance.findComponent("rank") as rank;
    //     if(s_rank){
    //         s_rank.updateRankView(); 
    //     }
    // }

    //  /**
    //  * 刷新DayRank日排行榜
    //  */
    // public refreshDayRank(msg:SC_DayRank){
    //     this.rankInfo.dayrankArr = msg.rankList;
    //     let s_rank = UIManager.Instance.findComponent("everydayrank") as everydayrank;
    //     if(s_rank){
    //         s_rank.updateRankView(); 
    //     }
    // }

    //  /**
    //  * 刷新CombatRank战力排行榜
    //  */
    // public refreshCombatRank(msg:SC_CombatRank){
    //     this.rankInfo.combatrankArr = msg.rankList;
    //     let s_rank = UIManager.Instance.findComponent("combatrank") as combatrank;
    //     if(s_rank){
    //         s_rank.updateRankView(); 
    //     }
    // }

}