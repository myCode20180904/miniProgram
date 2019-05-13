import { UserManager } from "../../manager/UserManager";
import { ErrorType, ErrorLang } from "../../define/ErrorLang";
import { Logger } from "../../tools/Logger";


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
/**
 * 用户登入 UserLogin
 */
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
    public combatBase:number = 0;//boos  武器升级、 邀请助战等等 
    public combat:number = 0;//战力 - 经验 = combatUp + 战斗关卡战力
    public maxScore:number;  //最高层所对应得分
    public maxStage:number;  //最高层
    public maxkilled:number; //最高击杀
    public maxcombo:number;//最高连击次数
    //public rewardLevel:number;//已领取的等级奖励
	public constructor() {
        super();
        this.pt = "GetPlayerData";
    }
}



/**
 * 同步玩家数据 SynPlayerData
 */
export class CS_SynPlayerData extends CS_Packet{
    public score: number = 0;  //分数
    public stage:number = 0;   //层数
    public gold:number = 0;  //金币
    public diamonds:number = 0;  //钻石
    public maxkilled:number = 0; //最高击杀
    public maxcombo:number = 0;//最高连击次数
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


