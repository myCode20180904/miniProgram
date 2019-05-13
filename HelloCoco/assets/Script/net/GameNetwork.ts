
import {NetSocket } from "../Net/ws/NetSocket";
import {NetSocketStatus } from "../Net/ws/INetSocket";
import { CS_UserLogin } from "./protocols/MsgPacket";
/**
 * 网络连接示例
 * 游戏中需要根据自己的逻辑进行适当的修改
 * 这里提供的是如何使用。具体游戏中自行更改
*/
export class GameNetwork {
	private static instance: GameNetwork;
	public static get Instance(): GameNetwork {
		if (this.instance == null) {
			this.instance = new GameNetwork();
		}
		return this.instance;
	}
	private link: NetSocket;
	private connect_callback:Function = null;
	private heartTimer:number = -1;
	public constructor() {
		this.link = new NetSocket();
		this.initListener();
	}
	
	/**
	 * 连接服务器
	 * @returns void
	 */
	public connect(callback:Function): void {
		this.link.connect("GameConfig.wsServer", 8080, this.onSocketHandler, this);
		this.connect_callback = callback;
	}
	public get isConnected():boolean{
		return this.link.isConnected;
	}
	
	public close(): void {
		this.link.close();
	}
	/**
	 * 初始化消息监听
	 * 所关心的协议在初始化时应注册进去
	 * @returns void
	 */
	private initListener(): void {
		this.link.addListenerMessage("UserLogin", this.recUserLogin, this);

	}
	private onSocketHandler(status: NetSocketStatus): void {
		switch (status) {
			case NetSocketStatus.Connected:
				{
					if(this.connect_callback){
						this.connect_callback();
					}
				}
				break;
			case NetSocketStatus.ConnectFailed:
				{
					this.link.close();
					this.openConnectTip("  Connection failed, whether to reconnect!");
				}
				
				break;
			case NetSocketStatus.Disconnect:
				{
					this.link.close();
					this.closeHeart();
					this.openConnectTip("  The network has been disconnected, is it reconnected?");
				}
				break;
			case NetSocketStatus.Error:
				{
					this.link.close();
					this.openConnectTip("  Connection error, whether to reconnect!");
				}
				break;
		}
	}
	/**
	 * 连接提示
	 */
	private openConnectTip(msg){
		
	}
	/**
	 * 定时发送心跳连接
	 */
	private sendHeart(timeout:number){
		var that = this;
		this.heartTimer = setTimeout(function () {
			that.link.send("Ping","");
		}, timeout);
	}

	/**
	 * 关闭心跳
	 */
	private closeHeart(){
		clearTimeout(this.heartTimer);
	}



	/**
     * WEB账号密码登录
     */
    public requestLoginByWeb(message: CS_UserLogin): void {
        message.type = 0;
        
        this.link.send(message.pt, JSON.stringify(message));
    }

	/**
     * 处理用户登录.
     * @param {SC_UserLogin} message
     * @return void
     */
	public recUserLogin(message: any){

	}

   
}