import { ProtoBase, CS_UserLogin, SC_UserLogin, CS_GetPlayerData, CS_SynPlayerData, SC_SynPlayerData, SC_GetPlayerData } from "./protocols/MsgPacket";
import { HttpHandler } from "./HttpHandel";
import { UserManager } from "../manager/UserManager";
import { Logger } from "../tools/Logger";


export class GameProto extends ProtoBase {
    private static instance: GameProto;
	public static get Instance(): GameProto {
		if (this.instance == null) {
			this.instance = new GameProto();
		}
		return this.instance;
    }

    /**
     * 注册全部协议
     */
    public registerProtocol(): void {
        HttpHandler.Instance.registerProtocol('UserLogin', this);//登陆
        HttpHandler.Instance.registerProtocol('GetPlayerData', this);//获取玩家信息      
        HttpHandler.Instance.registerProtocol('SynPlayerData', this); //同步玩家数据

    }


  
    //登陆*****************************************************************
    /**
     * 请求用户登录.  发
     * @param {object} message
     * @return void
     */
    public requestUserLogin(message: CS_UserLogin): void {
        if(window['wx']){
            message.type = 1;
        }else{
            message.type = 0;
        }
        HttpHandler.Instance.sendLoginPostMessage(message);

    }
    /**
     * 返回用户登录.  收
     * @param {SC_UserLogin} message
     * @return void
     */
    public handleUserLogin(message: SC_UserLogin): void {
        Logger.info("收到服务器返回登陆信息：",message);
        UserManager.Instance.setUserInfo(message);

        //登陆完成之后，获取玩家数据  发请求
        let getplayerdata = new CS_GetPlayerData();
        getplayerdata.nickName = UserManager.Instance.getUserInfo().nickName;
        getplayerdata.picUrl = UserManager.Instance.getUserInfo().avatarUrl;
        this.requestGetPlayerData(getplayerdata);

    }





      /**
     * 提交结算信息  同步信息
     * @param message
     */
    public requestSynPlayerData(message: CS_SynPlayerData) {
        UserManager.Instance.getUserInfo().score = message.score;
        UserManager.Instance.getUserInfo().stage = message.stage;

        HttpHandler.Instance.sendGamePostMessage(message);
    }
    /**
     * 结算信息返回
     * @param message 
     */
    public handleSynPlayerData(message: SC_SynPlayerData) {
        Logger.info("保存结算信息成功：", message);
    }



  
    


    /**
     * 请求玩家数据信息
     * @param message 
     */
    public requestGetPlayerData(message:CS_GetPlayerData){
        HttpHandler.Instance.sendGamePostMessage(message);
    }
    /**
     * 返回玩家数据
     * @param message 
     */
    public handleGetPlayerData(message:SC_GetPlayerData){
        Logger.info("收到服务器返回玩家数据：",message);
        UserManager.Instance.updatePlayerData(message);
    }

   
}
