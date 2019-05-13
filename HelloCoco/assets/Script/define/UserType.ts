
/**
 * 用户信息
 */
export class UserInfo {
    public uid: number = 0; // 用户ID
    public token: string = ''; // 用户登陆令牌
    public openid:string = ''; //微信开放id
    public deviceid:string = ''; //设备唯一
    public isNewPlayer: string = ''; // 新用户

    public code:string = null  //微信授权code
    //基本信息
	public avatarUrl:string = "";//头像
	public gender: number = 1;   //性别
    public nickName: string = "游客"; //昵称

    public diamonds:number = 0;//钻石 
    public gold:number = 0;    //金币

    public score: number = 0;  //分数
    public stage:number = 0;   //层数
    public combat:number = 0;//战力
    public maxscore:number;  //最高层所对应得分
    public maxstage:number;  //最高层
    
    public myRank:number = 99999;//我的排名
    
}


//挂机助战类型
export enum AssistType {
    DEFAULT = 0,
    FIGHT_UP_TYPE = 1, //助战战力加成
    GOLD_UP_TYPE = 2, //助战金币加成
}

//进入参数
export class EnterQuery{
    //来源场景
    public secneID:number = 1001;
    //分享类型
    public shareType:AssistType = AssistType.DEFAULT;
    //分享来源id
    public shareKey:number = 0;
}