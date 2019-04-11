import { BaseUI} from "./BaseUI";
import { UIManager} from "../Manager/UIManager";
import { Logger } from "../Tool/Logger";
import { UserManager } from "../Manager/UserManager";
import { WXManager } from "../Tool/wx/wxApi";
import { CommonHandel } from "../Define/CommonParam";
import { LLXManager } from "../Game_LLX/LLXManager";
import { LoadManager } from "../Manager/LoadManager";
const {ccclass, property} = cc._decorator;

@ccclass
export class MainUI extends BaseUI {

    @property(cc.Label)
    lb_name:cc.Label = null;
    @property(cc.Label)
    lb_gold:cc.Label = null;
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
        //
        this.refreshUI();

        //
        let rain = UIManager.Instance.createPrefab('nodes/Rain');
        this.node.addChild(rain,1000);
        rain.getChildByName('43046_ske').getComponent(dragonBones.ArmatureDisplay).playAnimation('wait',1000);

    }

    public refreshUI(){
        //name
        this.lb_name.string = UserManager.Instance.getUserInfo().nickName;
        this.lb_gold.string = UserManager.Instance.getUserInfo().gold.toString();
        //图片
        LoadManager.Instance.loadHttpIcon(this.headIcon,UserManager.Instance.getUserInfo().avatarUrl,null);
        
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
        if(customEventData=="test"){
            this.test();
        }
        if(customEventData=="test2"){
            this.test2();
        }
        if(customEventData=="startllx"){
            this.starLLX();
        }
        if(customEventData=="share"){
            this.share();
        }
        if(customEventData=="rank"){
            this.rank();
        }
    }

    /**
     * 关闭
     */
    private starLLX(){
        LLXManager.Instance.enterGame();
    }
    /**
     * 排行
     */
    private rank(){
        UIManager.Instance.openWindow('RankUI');
    }
    /**
     * 分享
     */
    private share(){
        var that = this;
        const handel = new CommonHandel();
        handel.success = function(){
            console.info("share success");
        };
        handel.fail = function(){
            console.info("share fail");
        };
        handel.complete = function(){
            console.info("share complete");
        };
        //获取关卡等级
        if(!cc.sys.localStorage.getItem('llx_gateLevel')){
            cc.sys.localStorage.setItem('llx_gateLevel', 1);
        }
        let level = parseInt(cc.sys.localStorage.getItem('llx_gateLevel'));
        //弹出微信分享
        WXManager.Instance.share({
            title:'我已经到达'+level+"关，快来超越我吧！",
            imageUrl:''+UserManager.Instance.getUserInfo().avatarUrl,
            query:`sharetype=1&sharekey=${UserManager.Instance.getUserInfo().openid}`
        },handel);
    }

    /**
     * 测试界面
     */
    private test(){
        UIManager.Instance.openWindow("TestScrollView");
    }
    private test2(){
        UIManager.Instance.loadScene('FighterScene',function(){
            
        })
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
