import { UserInfo, EnterQuery } from "../define/UserType";
import { SC_UserLogin, SC_SynPlayerData, SC_GetPlayerData } from "../net/protocols/MsgPacket";
import { Logger } from "../tools/Logger";
import { HttpHandler } from "../net/HttpHandel";


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
    public _isLogin = false;
    // 用户数据
    private userInfo: UserInfo = new UserInfo();
    //进入时带
    public enterQuery: EnterQuery = new EnterQuery();
    //最后一次点击入口
    public lastClickEnter:number = 0;
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

    public set isLogin(value){
        if(value&&!this._isLogin){
            //登陆成功

            //依次处理登陆后需要完成的协议
            this.dealPro();
        }
        this._isLogin = value;
    }
    public get isLogin():boolean{
        return this._isLogin;
    }

    //更新玩家信息
    public updatePlayerData(message:SC_GetPlayerData){
        // this.userInfo.playerid = message.playerid;
        this.userInfo.avatarUrl = message.picUrl;
        this.userInfo.gender = message.gender;
        this.userInfo.nickName = message.nickName;

        this.userInfo.score = message.score;
        this.userInfo.stage = message.stage;
        this.userInfo.combat = message.combat;

        this.userInfo.maxscore = message.maxScore;
        this.userInfo.maxstage = message.maxStage;


        this.checkFirstToday();

    }
    
    
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
            //今日战斗最多还可获得的钻石
            cc.sys.localStorage.setItem('maxDiamondGetInGame', 50);
            //使用武器机会
            cc.sys.localStorage.setItem('freeWeaponCount',3);
        }
    }


    //依次处理登陆后需要完成的协议
    public dealPro(){
        
    }

    /**
     * 上报数据给游族
     */
    public sendEventYZ(data:any){
        //http://10.6.24.152/log?action='行为'&msg=''&
        HttpHandler.Instance.sendEventPostMessage(data);
    }
}