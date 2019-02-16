
import { CommonHandel, LoadHandel} from "./Define/CommonParam";
import { UIManager} from "./manager/UIManager";
import { LoadManager } from "./manager/LoadManager";
import { GameProto } from "./Net/protocols/GameProto";
import { WXManager } from "./Tool/wx/wxApi";
import { displaywxsub } from "./Tool/wx/displaywxsub";
import { MsEngine } from "./Net/protocols/MsEngine";
import { GAME_DEBUG, USE_MATCHVS } from "./Define/GameConfig";
import { LoginUI } from "./View/LoginUI";

/**
 * 常驻组件 从这里开始
 */
const {ccclass, property} = cc._decorator;

@ccclass
export class LocalNode extends cc.Component {
    /**
     *  数据域
     */
    @property({type:cc.Node,tooltip:"展示微信数据域"})
    displayView:cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //添加wx
        WXManager.Instance.loadWx();
        //MatchVs初始
        if(USE_MATCHVS){
            MsEngine.Instance;
        }
        //注册协议
        GameProto.Instance.registerProtocol();
        cc.debug.setDisplayStats(GAME_DEBUG);
    }

    async start () {
        // 声明常驻根节点
        cc.game.addPersistRootNode(this.node);

        //
        await UIManager.Instance.openWindow('LoginUI');
        await UIManager.Instance.openWindow("MainUI",-1)
        await LoadManager.Instance.loadRes(new LoadHandel(
            function(process:number){

            },
            async function(){

                
            }
        ));
        let loginUI:LoginUI = UIManager.Instance.findComponent("LoginUI");
        if(loginUI){
            loginUI.showLogin();
        }

    }


 
    /**
     * showDisplayView 数据域
     */
    public showDisplayView(){
        let _displaywxsub = this.displayView.getComponent("displaywxsub") as displaywxsub
        _displaywxsub.show();
    }
    public hideDisplayView(){
        let _displaywxsub = this.displayView.getComponent("displaywxsub") as displaywxsub
        _displaywxsub.hide();
    }

    // update (dt) {}

}
