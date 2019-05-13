import { GameConfig } from "../GameConfig";
import { Logger } from "../tools/Logger";

export class HttpHandler {
	// 协议组
	private _protoMap: any = {};
	//消息队列
	private msgQuen:Array<any> = [];
	private static instance: HttpHandler;
	public static get Instance(): HttpHandler {
		if (this.instance == null) {
			this.instance = new HttpHandler();
		}
		return this.instance;
    }

	/**
	 * 注册协议
	 * @param {string} pt 协议名称
	 * @param {object} hanlder 协议处理
	 * @param void
	 */
	public registerProtocol(pt: string, hanlder: any): void {
		this._protoMap[pt] = hanlder;
	}

	/**
	 * 发送消息给登陆服务器.
	 * @param {object} message 消息
	 * @return void
	 */
	public sendLoginPostMessage(message: any): void {
        var that = this;
        let url = GameConfig.httpUrl + 'api/' + message.pt;
        
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if(request.readyState === XMLHttpRequest.DONE) {
                if(request.status === 200){
                    that.onPostComplete(request);
                }else{
                    that.onPostError(request);
                }
            }
        };
        request.responseType = "text";
        request.open("POST", url, true);
        request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        request.send(JSON.stringify(message));
		Logger.info("http sendPostMessage: 发送给服务器的消息：",message);
	}

	/**
	 * 发送消息给游戏服务器.
	 * @param {object} message 消息
	 * @return void
	 */
	public sendGamePostMessage(message: any): void {
		if(message.tk.length<=0){
			Logger.warn("未登录");
			return;
		}
        var that = this;
        let url = GameConfig.gameUrl + 'api/' + message.pt;
        
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if(request.readyState === XMLHttpRequest.DONE) {
                if(request.status === 200){
                    that.onPostComplete(request);
                }else{
                    that.onPostError(request);
                }
            }
        };
        request.responseType = "text";
        request.open("POST", url, true);
        request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        request.send(JSON.stringify(message));
		Logger.info("http sendPostMessage:发送给服务器的消息：",message);
		// this.msgQuen.push(request);
	}
	/**
	 * 数据上报
	 */
	public sendEventPostMessage(data:string){
		var that = this;
        let url = GameConfig.dataEventUrl;
        
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if(request.readyState === XMLHttpRequest.DONE) {
                if(request.status === 200){
                    // Logger.info(request);
                }else{
                    // Logger.error(request);
                }
            }
        };
        request.responseType = "text";
        request.open("POST",url, true);
        // request.setRequestHeader("Content-Type", "text;charset=utf-8");
        request.send('action=BhBehavior&msg='+ data+'&game_id=381');
	}
	/**
	 * 分发消息.
	 * @param {Object} msgArr 消息数组
	 * @return void
	 */
	private dispatch(msgArr: Array<any>): void {
		let that = this;
		msgArr.forEach(msg => {
			if (that._protoMap[msg.pt]) {
				that._protoMap[msg.pt].handleProtocol(msg);
			} else {
				Logger.info('未定义pt ' + msg.pt);
			}
		});
	};

	/**
	 * 发送消息完成.
	 * @param {object} event 事件
	 * @return void
	 */
	private onPostComplete(data:any): void {
		try {
			this.dispatch(JSON.parse(data.response));
		} catch (err) {
			Logger.info("返回数据必须为数组：", err);
		}
	}

	/**
	 * 发送消息错误.
	 * @param {object} event 事件
	 * @return void
	 */
	public onPostError(event: any): void {
		Logger.info("发送消息错误: ", event);
	}
}