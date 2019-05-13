import { HttpHandler } from "../Net/HttpHandel";
import { DataEventType, DataEventMsg } from "../Define/DataEventType";
import { UserManager } from "./UserManager";

//数据上报
export class ReportManager {
    private static instance: ReportManager;
	public static get Instance(): ReportManager {
		if (this.instance == null) {
			this.instance = new ReportManager();
		}
		return this.instance;
    }

    /**
     * 上报数据给游族
     */
    public sendEventYZ(type:string,extJson?:string){
        if(!window['wx']){
            return;
        }
        let event= new DataEventMsg(type,UserManager.Instance.getUserInfo().uid.toString(),extJson);
        HttpHandler.Instance.sendEventPostMessage(this.prasePostString(event));
    }
    /**
     * 序列化
     * @param event 
     */
    private prasePostString(event:DataEventMsg){
        let str:string = '';
        for (let srcName in event) {
            if (!event.hasOwnProperty(srcName)) {
                continue;
            }
            if (event[srcName]==undefined) {
                continue;
            }
            str+=`${event[srcName]}|`;
        }
        return str;
    }
}

// 请求的样例如下：
// curl  -d "action=BhBehavior"
// -d "msg=BhBehavior|ShowAD|1.1|2739|1587|1587310002|2014-05-05 12:00:00|account01|role01|1|||20|||||ShowAD|003||2||app|"
// -d "game_id=381"
