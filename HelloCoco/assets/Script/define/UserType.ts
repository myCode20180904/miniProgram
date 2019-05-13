
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
