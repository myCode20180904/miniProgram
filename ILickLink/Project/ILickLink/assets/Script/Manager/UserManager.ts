
import { SC_Packet, CS_Packet,CS_UserLogin,SC_UserLogin, SC_GetPlayerData } from "../Net/MsgPacket";
import {UserInfo } from "../Define/UserType";
import { UIManager } from "./UIManager";
import { BagManager } from "./BagManager";
import { LocalNode } from "../LocalNode";
import { Logger } from "../Tool/Logger";
import { MainUI } from "../View/MainUI";

export class UserManager {
    private static instance: UserManager;
	public static get Instance(): UserManager {
		if (this.instance == null) {
			this.instance = new UserManager();
		}
		return this.instance;
    }
    //是否今天第一次登陆
    public isFirstToday:boolean = false;
    //是否登录
    private _isLogin:boolean = false;
    // 用户数据
    private userInfo: UserInfo = new UserInfo();

    public set isLogin(value){
        this._isLogin = value;
        if(value){
            UIManager.Instance.closeWindow("LoginUI")
            this.refreshToUI();
        }
    }
    public get isLogin():boolean{
        return this._isLogin;
    }
    /**
     * 设置用户数据
     * @param {object} message 登陆消息
     */
    public setUserInfo(message: SC_UserLogin): void {
        this.userInfo.openid = message.openid
        this.userInfo.uid = message.uid;
        this.userInfo.token = message.tk;
        Logger.info("setUserInfo:",this.userInfo);
    }

    /**
     * 获得用户信息（可修改）
     */
    public getUserInfo(): UserInfo {
        return this.userInfo;
    }

    //更新玩家信息
    public updatePlayerData(message:SC_GetPlayerData){
        
        this.userInfo.avatarUrl = message.picUrl;
        this.userInfo.gender = message.gender;
        this.userInfo.nickName = message.nickName;

        this.userInfo.score = message.score;
        this.userInfo.stage = message.stage;
        this.userInfo.combat = message.combat;

        this.userInfo.maxscore = message.maxscore;
        this.userInfo.maxstage = message.maxstage;

        this.checkFirstToday();
        this.loginSuccess();
        this.refreshToUI()
    }

    private loginSuccess(){
        var localNode = cc.find("LocalNode").getComponent("LocalNode") as LocalNode;
        localNode.loginComplete();
    }
    /**
     * 更新资产
     * @param gold 
     * @param diamonds 
     */
    public updateAssets(){
        this.userInfo.gold = BagManager.Instance.getGold();
        this.userInfo.diamonds = BagManager.Instance.getDiamonds();
        this.refreshToUI()
    }
    
    //更新排行
    public updateMyRank(rank:number){
        this.userInfo.myRank = rank;
        this.refreshToUI()
    }
    /**
     * 根据排行id计算uid
     */
    public getUidByRankId(rankid:number): number {
        return (rankid-1)/10000;
    }

    //同步到UI
    public refreshToUI(){
        let mainUI:MainUI = UIManager.Instance.findComponent("MainUI"); 
        if(mainUI){
            mainUI.refreshUI();
        }
    }

    // public checkDevicdId(){
        
    // }
    /**
     * 检查是否今天第一次登陆
     */
    public checkFirstToday(){
        var date = new Date();
        date.setTime(cc.sys.localStorage.getItem('lastEnterTime'));
        this.isFirstToday = false;
        var now = new Date();
        if (now.getFullYear() > date.getFullYear()) {
            this.isFirstToday = true;
        } else if (new Date().getMonth() > date.getMonth()) {
            this.isFirstToday = true;
        } else if (new Date().getDate() > date.getDate()) {
            this.isFirstToday = true;
        }
        cc.sys.localStorage.setItem('lastEnterTime', new Date().getTime());

        //今天第一次进入
        if(this.isFirstToday){
            //重置看视屏奖励次数
            cc.sys.localStorage.setItem('rewardLookMvCount', 5);
            //重置分享奖励次数
            cc.sys.localStorage.setItem('rewardShareCount', 5);
        }
    }

}