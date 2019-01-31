import { BaseUI} from "./BaseUI";
import { UIManager} from "../manager/UIManager";
import { Logger } from "../Tool/Logger";
import { MsEngine } from "../Net/protocols/MsEngine";
const {ccclass, property} = cc._decorator;

@ccclass
export class LoginUI extends BaseUI {


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Logger.info('LoginUI onLoad');
    }

    onDestroy(){
        Logger.info('LoginUI onDestroy');
    }

    onEnable(){
        Logger.info('LoginUI onEnable');
    }

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,function(){},this);
    }



    public login(){
        MsEngine.Instance.sendLogin();

    }

     /**
     * 菜单
     * @param event 点击事件
     * @param customEventData 用户参数
     */
    menu (event:cc.Event,customEventData:any){
        // Logger.info('touch menu:',customEventData);
        if(customEventData=="login"){
            this.login();
        }
      
    }

    /**
     * 关闭
     */
    private close(){
        UIManager.Instance.closeWindow('LoginUI');
    }

    // update (dt) {}

    public onShow(){
        Logger.info('LoginUI onShow');
    }
    public onHide(){
        Logger.info('LoginUI onHide');
        
    }
}
