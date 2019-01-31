
import {INetSocket,NetSocketStatus } from "./INetSocket";
import {HostAdress } from "./HostAdress";
/**
 * WebSocket网络连接
 * 多条连接的多个new对象。每一个对象对应一条连接
*/
export class NetSocket implements INetSocket {
	private socket: WebSocket;
	protected status: NetSocketStatus = NetSocketStatus.None;
	protected adress: HostAdress;
	protected funcObj: any;
	protected onSocketFunc: Function;
	protected recFuncMaps: Object = new Object();

	public get isConnected(): boolean {
		if (this.socket == null) {
			return false;
		}
		return this.status==NetSocketStatus.Connected;
	}

	public constructor() {
		this.adress = new HostAdress();
	}
	/**
     * 添加监听消息
     * @param  {number} id 所关心的协议号
     * @param  {Function} func 对应的协议返回函数
     * @param  {any} thisObject this指针
     * @returns void
     */
	public addListenerMessage(id: string, func: Function, thisObject: any): void {
		console.log(this.recFuncMaps);
		if (this.recFuncMaps[id] == null) {
			var reciveFunc: ReciveFunction = new ReciveFunction();
			reciveFunc.ID = id;
			reciveFunc.handler = func;
			reciveFunc.thisObj = thisObject;
			this.recFuncMaps[id] = reciveFunc;
		} else {
			console.log("The same ID already exists in the receive message list:" + id);
		}
	}
	/**
     * 连接服务器，不加密连接，以ws开头
     * @param  {string} host 连接地址
     * @param  {number} port 连接端口
     * @param  {Function} func 连接后回调函数，成功，失败，服务器强制关闭，错误，都会触发
     * @param  {any} thisObject this指针
     * @returns void
     */
	public connect(host: string, port: number, func: Function, thisObject: any): void {
		if (host == "" || port == 0) {
			console.error("[socket] connect error,host or port is null..");
			this.status = NetSocketStatus.None;
		}
		this.funcObj = thisObject;
		this.onSocketFunc = func;
		this.connectToServer(host, port, false);
	}
	/**
     * 连接服务器，加密连接，以wss开头
     * @param  {string} host 连接地址
     * @param  {number} port 连接端口
     * @param  {Function} func 连接后回调函数，成功，失败，服务器强制关闭，错误，都会触发
     * @param  {any} thisObject this指针
     * @returns void
     */
	public secureConnect(host: string, port: number, func: Function, thisObject: any): void {
		if (host == "" || port == 0) {
			console.error("[socket] connect error,host or port is null..");
			this.status = NetSocketStatus.None;
		}
		this.funcObj = thisObject;
		this.onSocketFunc = func;
		this.connectToServer(host, port, true);
	}
	/**
     * 发送消息
     * @param  {string} id 协议ID
     * @param  {any} Obj
     * @returns void
     */
	public send(id: string, json: any): void {
		if (!this.isConnected) {
			this.close();
			return;
		}
		console.info("ws send:", json);
		{
			this.socket.send(json);
		}

	}
	/**
     * 关闭连接服务
     * @returns void
     */
	public close(): void {
		if (this.socket != null) {
			this.socket.onopen = null;
			this.socket.onmessage = null;
			this.socket.onerror = null;
			this.socket.onclose = null;
			this.socket.close();
			this.socket = null;
		}
		this.status = NetSocketStatus.None;
	}
	/**
	 * 连接服务器
	 * @param  {string} host 服务器地址
	 * @param  {number} port 服务器端口
	 * @param  {boolean} encryption 是否加密
	 * @returns void
	 */
	private connectToServer(host: string, port: number, encryption: boolean): void {
		this.adress.host = host;
		this.adress.port = port;
		this.adress.encryption = encryption;
		this.onInit();
	}
	/**
	 * 初始化socket服务
	 * @returns void
	 */
	private onInit(): void {
		if (this.isConnected == false) {
			this.status = NetSocketStatus.BeginConnect;
			if (this.socket == null) {
				this.socket = new WebSocket(this.adress.completeAddress());
				// this.socket.binaryType = "BinaryType";
				this.socket.onopen = this.onConnectSucceed;
				this.socket.onmessage = this.onReceive;
				this.socket.onerror = this.onError;
				this.socket.onclose = this.onClose;
			}
		}
	}
	/**
	 * 连接成功后回调
	 * @returns void
	 */
	private onConnectSucceed(event:any): void {
		this.status = NetSocketStatus.Connected;
		console.log("[socket] connect server succeed!");
		if (this.onSocketFunc != null && this.funcObj != null) {
			this.onSocketFunc.call(this.funcObj, this.status);
		}
	}
	/**
	 * 接收服务器返回消息回调
	 * @param  {egret.Event} e 消息参数
	 * @returns void
	 */
	private onReceive(event:any): void {
		var message:any = event
		console.info(event);
		var cmd = JSON.parse(message).pt;
		if (this.recFuncMaps[cmd] != null) {
			if(JSON.parse(message).ret!=1){
				console.error("ws onReceive err:",message);
				return;
			}
			console.info("ws onReceive:",message);
			var reciveFunc: ReciveFunction = this.recFuncMaps[cmd];
			reciveFunc.handler.call(reciveFunc.thisObj, message);
		}
	}
	/**
	 * 服务器主动断开连接回调
	 * @returns void
	 */
	private onClose(event:any): void {
		this.status = NetSocketStatus.Disconnect;
		console.log("[socket] server close!");
		if (this.onSocketFunc != null && this.funcObj != null) {
			this.onSocketFunc.call(this.funcObj, this.status);
		}
	}
	/**
	 * 连接错误回调
	 * @returns void
	 */
	private onError(event:any): void {
		this.status = NetSocketStatus.Error;
		console.error("[socket] connect server error!");
		if (this.onSocketFunc != null && this.funcObj != null) {
			this.onSocketFunc.call(this.funcObj, this.status);
		}
	}
	
}
/**
 * 返回函数封装
*/
class ReciveFunction {
	/**
	 * 协议ID
	*/
	public ID: string;
	/**
	* 对应ID的返回函数
	*/
	public handler: Function;
	/**
	 * this指针
	*/
	public thisObj: any;
}