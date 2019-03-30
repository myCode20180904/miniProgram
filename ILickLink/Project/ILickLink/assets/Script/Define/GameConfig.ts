
export const GAME_DEBUG:boolean = false;
export const USE_MATCHVS:boolean = false;
export const LOG_DEBUG:boolean = true;

//登陆方式（与服务器保持一致）
export enum LoginType {
    DEFAULT = 0,
    USERNAME = 1,  //账号密码登陆
    WECHAT = 2,   //微信登陆
    FACEBOOK = 3, //facebook 登录
}
export const GameLoginType: number = LoginType.WECHAT; 

export class GameConfig {
    // Matchvs
    public static MatchvsConfig:{GameID:number,AppKey:string,AppSecret:string,Channel:string} = {
        GameID:214770,
        AppKey:'c530cc41aa9f4b5581e8f7ec0cd0fd42#M',
        AppSecret:'fd0e8f434fe247e9814a8f3c1adc0216',
        Channel:'Matchvs'
    }
    //微信
    public static WxConfig:{AppId:string,AppSecret:string} = {
        AppId:"wxfdd206c03b158c68",
        AppSecret:"7f74f963c32f8970480bc771a3c99dc0",
    }
    //服务端
    //http://192.168.1.110
    //http://192.168.1.130
    public static httpUrl = 'http://192.168.1.110:7998/'  //登陆服地址 
    public static gameUrl = "http://192.168.1.110:7000/"    //游戏服地址
    public static wsServer = '192.168.1.28'
    public static port = 8200;
    public static imageUrl = 'https://minigame-1257126548.cos.ap-chengdu.myqcloud.com/ILickLink'
    public static downLoadUrl = 'https://minigame-1257126548.cos.ap-chengdu.myqcloud.com/ILickLink'

    /**
     * 预加载资源
     */
    public static beforeLoadRes: Array<string> = [
        'Csv/Buff',
        'Csv/case',
        'Csv/c_prop',
        'Csv/Effect',
        'Csv/equip',
        'Csv/item',
        'Csv/Skill',
        'Csv/SkillEffect',
        'Csv/t_item',
        'Csv/weapon',
    ]
}
