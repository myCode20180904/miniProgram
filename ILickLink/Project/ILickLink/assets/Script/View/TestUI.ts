import { BaseUI} from "./BaseUI";
import { UIManager} from "../manager/UIManager";
import { Logger } from "../Tool/Logger";
const {ccclass, property} = cc._decorator;

@ccclass
export class TestUI extends BaseUI {


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Logger.info('TestUI onLoad');
    }

    onDestroy(){
        Logger.info('TestUI onDestroy');
    }

    onEnable(){
        Logger.info('TestUI onEnable');
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
        UIManager.Instance.closeWindow('TestUI');
    }

    // update (dt) {}

    public onShow(){
        Logger.info('TestUI onShow');
    }
    public onHide(){
        Logger.info('TestUI onHide');
        
    }
}
