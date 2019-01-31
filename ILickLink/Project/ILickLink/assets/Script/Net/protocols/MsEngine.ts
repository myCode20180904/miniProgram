import { Logger } from "../../Tool/Logger";
import { UserManager } from "../../manager/UserManager";
import { GenerateUUID } from "../../Define/CommonParam";
import { GameConfig } from "../../Define/GameConfig";

/**
 * 网络连接示例
 * 游戏中需要根据自己的逻辑进行适当的修改
 * 这里提供的是如何使用。具体游戏中自行更改
*/
export class MsEngine {
	private static instance: MsEngine;
	public static get Instance(): MsEngine {
		if (this.instance == null) {
			this.instance = new MsEngine();
		}
		return this.instance;
	}
	private engine:MatchvsEngine = new MatchvsEngine();
	public get GetEngine():MatchvsEngine{
		return this.engine
	}
    private response:MatchvsResponse = new MatchvsResponse();
	private heartTimer:number = -1;
	public constructor() {
		this.initEvent();
		this.engine.init(this.response,GameConfig.MatchvsConfig.Channel,"alpha",GameConfig.MatchvsConfig.GameID,GameConfig.MatchvsConfig.AppKey,1);
	}
	
	/**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     */
    private initEvent () {
        this.response.initResponse = this.initRsp.bind(this);
        this.response.registerUserResponse = this.registerUserRsp.bind(this);
		this.response.loginResponse = this.loginRsp.bind(this);


		this.response.sendEventResponse = this.EventRsp.bind(this);
		this.response.sendEventNotify = this.EventNotifyRsp.bind(this);
		this.response.sendEventGroupResponse = this.EventGroupRsp.bind(this);
		this.response.sendEventGroupNotify = this.EventGroupNotifyRsp.bind(this);
		
    }
	/**
     * 初始化回调
     * @param status
     */
    initRsp(status) {
        if (status === 200) {
            Logger.info("Ts版本 初始化成功");
            this.engine.registerUser();
        } else {
            Logger.info("Ts版本 初始化失败");
        }
    }

    /**
     * 注册回调
     * @param userInfo
     */
    registerUserRsp(userInfo) {
        if  (userInfo.status === 0) {
            Logger.info("Ts版本 注册成功");
            UserManager.Instance.getUserInfo().uid = userInfo.userID;
            UserManager.Instance.getUserInfo().token = userInfo.token;
            console.info(GenerateUUID())
            this.engine.login(userInfo.userID,userInfo.token,'1');
        } else {
            Logger.info("Ts版本 注册失败");
        }
	}

	/**
	 * 登录请求
	 */
	sendLogin(){
		console.info(GenerateUUID())
        this.engine.login(UserManager.Instance.getUserInfo().uid,UserManager.Instance.getUserInfo().token,'1');
	}
    /**
     * 登录回调
     * @param loginRsp
     */
    loginRsp(loginRsp:MsLoginRsp) {
        Logger.info("???",loginRsp);
        if  (loginRsp.status === 200) {
            console.log("Ts版本 登录成功");
            if (loginRsp.roomID !== null && loginRsp.roomID !== '0') {
                this.engine.leaveRoom("");
            } else {
            }
        } else {
            console.log("Ts版本 登录失败");
        }

	}
	
	/**
	 * 发送消息 接口默认把消息发送给了房间其他人
	 * @param data 
	 */
	private sendEvent(data:string):any{
		this.engine.sendEvent(data);
	}
	/**
	 * 
	 * @param msgType 消息发送的地方：0-发客户端不发gameServer 1-不发客户端+发gameServer 2-发客户端 发gameServer
	 * @param data 要发送的数据
	 * @param destType 0-包含destUids用户 1-排除destUids的用户
	 * @param userIDs 玩家ID集合
	 */
	private sendEventEx(msgType:number, data:string, destType:number, userIDs:Array <number> ):any{
		this.engine.sendEventEx(1,'hello',0,[UserManager.Instance.getUserInfo().uid]);
	}
	/**
	 * 自己发送消息回调
	 * @param rsp 
	 */
	EventRsp(rsp:MsSendEventRsp){
		Logger.info("发送消息回调",rsp);
		if(rsp.status == 200){
			//发送成功
		}else{
			//发送失败
		}
	}
	/**
     * 收到其他玩家发送的消息
     * @param {MsSendEventNotify} eventInfo
     */
	EventNotifyRsp(eventInfo:MsSendEventNotify){
		Logger.info("收到消息",eventInfo);
	}
	/**
     * 分组消息发送回调
     * @param {number} status
     * @param {number} dstNum
     */
	EventGroupRsp(status:number,dstNum:number){

	}
	/**
     * 分组消息发送异步回调
     * @param {number} srcUserID
     * @param {Array<string>} groups
     * @param {string} cpProto
     */
	EventGroupNotifyRsp(srcUserID:number, groups:Array<string>, cpProto:string){

	}
	
}