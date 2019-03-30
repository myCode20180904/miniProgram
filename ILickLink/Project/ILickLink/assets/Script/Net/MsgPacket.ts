import { ErrorType, ErrorLang } from "../Define/ErrorLang";
import { UserManager } from "../Manager/UserManager";
import { Logger } from "../Tool/Logger";

/**
 * // 所有协议的基类
 */
export class IPacket {
	public pt: string;
	public constructor() {
		this.pt = this.toString().substr(3);
	}
}
/**
 * // 发给服务器
 */
export class CS_Packet extends IPacket {
    public tk: string = "";
    public uid:number = 0;
	public constructor() {
        super();
        this.tk = UserManager.Instance.getUserInfo().token;
        this.uid = UserManager.Instance.getUserInfo().uid;
	}
	public Write(ps) { }
}

/**
 * // 接受服服务器
 */
export class SC_Packet extends IPacket {
	public ret: number = 1;
	public constructor() {
		super();
	}
}

//
export class ProtoBase {
    /**
	 * 处理服务器消息
	 * @param {string} message 消息
	 */
    public handleProtocol(message: SC_Packet): void {
        if (message.ret !== ErrorType.COMMON_SUCCESS) {
            Logger.warn(ErrorLang[message.ret]);
            let func: any = this['fail' + message.pt];
            if (func) {
                func.call(this, message);
            } else {
                Logger.warn('失败消息解析错误');
            }
            return;
        }

        // 分发消息
        let func: any = this['handle' + message.pt];
        if (func) {
            func.call(this, message);
        } else {
            Logger.warn('成功消息解析错误');
        }
    }
}

////////////////////////////////////////////////////
//用户登入 UserLogin
export class CS_UserLogin extends CS_Packet{
	public type: number = 0; //登入类型
	public code:string = ''  //code
	public constructor() {
        super();
        this.pt = "UserLogin";
    }
}
export class SC_UserLogin extends SC_Packet{
	public uid:number = 0;//uid
    public openid:string = '';//微信开放ID
    public tk:string = ''; 
	public constructor() {
        super();
        this.pt = "UserLogin";
    }
}

/**
 * 获取角色数据 GetPlayerData
 */
export class CS_GetPlayerData extends CS_Packet{
    public picUrl:string = "";//头像
    public nickName: string = ""; //昵称
	public constructor() {
        super();
        this.pt = "GetPlayerData";
    }
}
export class SC_GetPlayerData extends SC_Packet{
    public picUrl:string = "";//头像
	public gender: number = 0;   //性别
    public nickName: string = ""; //昵称

    public score: number = 0;  //分数
    public stage:number = 0;   //层数
    public combat:number = 0;//战力
    public maxscore:number;  //最高层所对应得分
    public maxstage:number;  //最高层
	public constructor() {
        super();
        this.pt = "GetPlayerData";
    }
}



/**
 * 同步玩家数据 SynPlayerData**************************************************************
 */
export class CS_SynPlayerData extends CS_Packet{
    public score: number = 0;  //分数
    public stage:number = 0;   //层数
    public gold:number = 0;  //金币
	public constructor() {
        super();
        this.pt = "SynPlayerData";
    }
}
export class SC_SynPlayerData extends SC_Packet{
	public constructor() {
        super();
        this.pt = "SynPlayerData";
    }
}



//通关总排行************************************************************************************
export class CS_AllRank extends CS_Packet{

	public constructor() {
        super();
        this.pt = "AllRank";
    }
}
export class SC_AllRank extends SC_Packet{
    public rankList:Array<number> = new Array<number>();//总排行的数组
	public constructor() {
        super();
        this.pt = "AllRank";
    }
}


//日排行************************************************************************************
export class CS_DayRank extends CS_Packet{
    
	public constructor() {
        super();
        this.pt = "DayRank";
    }
}
export class SC_DayRank extends SC_Packet{
	public rankList:Array<number> = new Array<number>();//日排行的数组
	public constructor() {
        super();
        this.pt = "DayRank";
    }
}


//战力排行************************************************************************************
export class CS_CombatRank extends CS_Packet{

	public constructor() {
        super();
        this.pt = "CombatRank";
    }
}
export class SC_CombatRank extends SC_Packet{
	public rankList:Array<number> = new Array<number>();//战力排行的数组
	public constructor() {
        super();
        this.pt = "CombatRank";
    }
}


//排行奖励************************************************************************************
export class CS_CheckRankAward extends CS_Packet{

	public constructor() {
        super();
        this.pt = "CheckRankAward";
    }
}
export class SC_CheckRankAward extends SC_Packet{
	public rankAward = {};//排名和奖励信息
	public constructor() {
        super();
        this.pt = "CheckRankAward";
    }
}

//视屏分享奖励************************************************************************************
export class CS_GetShareAward extends CS_Packet{
    public shareType = 0;//类型 （分享 、看视屏）
	public constructor() {
        super();
        this.pt = "GetShareAward";
    }
}
export class SC_GetShareAward extends SC_Packet{
    public shareType = 0;//类型 （分享 、看视屏）
    public awardId = 0;//奖励物品id
    public awardCount = 0;//奖励数量
	public constructor() {
        super();
        this.pt = "GetShareAward";
    }
}