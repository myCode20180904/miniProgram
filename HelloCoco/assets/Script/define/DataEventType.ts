import { Util } from "./Util";
import { UserManager } from "../manager/UserManager";

export enum DataEventType{
    DEFAULT = '',
    Login = '',
    Click = '',
    Share = '',
    LookMv = ''
}


/**
 * 用户上报事件消息体
 */
export class DataEventMsg {
    public action:string = 'BhBehavior';//固定填
    public ShowAD:string = '测试';//事件名 （参见事件excel）
    public ver:string = '1.1';//版本
    public op_id:string = '2363';//渠道 wx 2363 sQ 2739
    public opgame_id:string = '1587';//固定填 混服组 id，如果没有具体的，默认是server_id的前4位
    public server_id:string = '1587310002';//固定填 服 id，游戏服的数字编号，比如2066310028
    public createtime:string = '2014-05-05 12:00:00';//时间
    public account:string = 'account';//账号
    public role_id:string = 'role_id';//角色id
    public role_type:string = '1';//
    public role_name:string = '';
    public role_career:string = '';
    public role_level:string = '1';//等级
    public role_vip:string = '';
    public role_regtime:string = '';
    public role_paid:string = '';
    public b_type:string = '';
    public b_id:string = '测试';//事件名 （参见事件excel）
    public zone_id:string = '016';//子gameid 区域id
    public zone_instance_id:string = '';
    public b_value:string = '2';//固定填 事件行为结果 成功或失败 （1到达、进入、开始 2胜利、完成、成功）
    public channel_id:string = '';//
    public multiscreen_type:string = 'app';//固定填
    public spare_one:string = undefined;//扩展字段 json格式
    /**
     * 事件名
     * @param eventname 
     */
    constructor(eventname,userid,extJson:any){
        this.ShowAD = eventname;
        this.b_id = eventname;
        this.role_id = userid;
        this.spare_one = extJson;
        this.createtime = Util.formatDateYmd();
        this.account = userid;

    }
}
//
export enum DataEvent_T {
    DEFAULT = 0,
    Login_Loading = 1, //登陆-游戏启动
    Login_Success = 2, //登陆-游戏加载成功
    Login_UseTime = 3, //游戏加载时间
    Login_OnLineTime = 5, //在线

    //外围功能
    Click_XMBCount = 101,//小卖部
    Click_RankCount = 102,//
    Click_HangUpCount = 103,//
    Click_QCSCount = 104,//器材室
    Click_FriendCare = 105,//同学录
    Click_FirendGold = 106,//办公室
    Click_Sgin = 107,//签到

    Share_ZSHDCount = 201,//钻石活动
    Share_JBHDCount = 202,//金币活动
    Share_HangFirendCare = 203,//同学录
    Share_HangFirendGold = 204,//办公室


    //关卡
    Game_Gate_startcount = 301,//“关卡模式”开始次数
    Game_Gate_endcount = 302,//“关卡模式”开始次数
    Game_EndLess_startcount = 303,//“无尽模式”开始次数
    Game_EndLess_endcount = 304,//“无尽模式”开始次数
    Game_Gate_fuhuo = 305,//复活次数
    //引导功能
    NewGuide_Count = 501,//新手引导点击次数
    //跳转
}
