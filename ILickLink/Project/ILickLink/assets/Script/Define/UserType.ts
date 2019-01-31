
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

/**
 * 战力
 */
export class FightingCapacity{
    public total:number = 0;//总战力
    public gate:number = 0;//关卡战力
    public boos:number = 0;//boss战力
    public friend:number = 0;//好友战力
    public equipment:number = 0;//装备战力( 只有通过消耗道具进行升级的装备才加战力)

}

/**
 * 教导室
 */
export class HangUpInfo{
    /**
     * 已解锁boss
     */
    public UnlockBossArr:Array<any> = []
    //金币加成
    public upGoldRate:number = 0;
    //金币
    public upGold:number = 10;
    //好友战力
    public friendCombat:number = 0;
    //boss战力
    public bossCombat:number = 0;

}

