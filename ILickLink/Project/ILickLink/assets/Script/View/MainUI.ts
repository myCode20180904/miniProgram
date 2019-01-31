import { BaseUI} from "./BaseUI";
import { UIManager} from "../manager/UIManager";
import { Logger } from "../Tool/Logger";
import { UserManager } from "../manager/UserManager";
import { Util } from "../Define/Util";
const {ccclass, property} = cc._decorator;

@ccclass
export class MainUI extends BaseUI {

    @property(cc.Label)
    lb_name:cc.Label = null;
    @property(cc.Node)
    headIcon:cc.Node = null;
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

    public refreshUI(){
        //name
        this.lb_name.string = UserManager.Instance.getUserInfo().nickName;
        //图片
        Util.loadHttpIcon(this.headIcon,UserManager.Instance.getUserInfo().avatarUrl,null);
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
