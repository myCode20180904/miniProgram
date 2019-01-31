import { BaseUI} from "./BaseUI";
import { UIManager} from "../manager/UIManager";
import { Logger } from "../Tool/Logger";
const {ccclass, property} = cc._decorator;

@ccclass
export class MainUI extends BaseUI {


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Logger.info('MainUI onLoad');
    }

    onDestroy(){
        Logger.info('MainUI onDestroy');
    }

    onEnable(){
        Logger.info('MainUI onEnable');
    }

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,function(){},this);
    }

    public play(){

    }

     /**
     * 菜单
     * @param event 点击事件
     * @param customEventData 用户参数
     */
    menu (event:cc.Event,customEventData:any){
        // Logger.info('touch menu:',customEventData);
        if(customEventData=="close"){
            this.close();
        }
        if(customEventData=="play"){
            this.play();
        }
      
    }

    /**
     * 关闭
     */
    private close(){
        UIManager.Instance.closeWindow('MainUI');
    }

    // update (dt) {}

    public onShow(){
        Logger.info('MainUI onShow');
    }
    public onHide(){
        Logger.info('MainUI onHide');
        
    }
}
