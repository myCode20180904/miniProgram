
import { CommonHandel, LoadHandel} from "./Define/CommonParam";
import { UIManager} from "./manager/UIManager";
import { TestUI} from "./View/TestUI";
import { LoadManager } from "./manager/LoadManager";
import { GameProto } from "./Net/protocols/GameProto";
import { WXManager } from "./Tool/wx/wxApi";
import { displaywxsub } from "./Tool/wx/displaywxsub";
import { AudioManager, AudioType } from "./manager/AudioManager";
import { CS_GetItemList } from "./Net/BagPacket";
import { MsEngine } from "./Net/protocols/MsEngine";

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
        MsEngine.Instance;
        //注册协议
        GameProto.Instance.registerProtocol();

    }

    async start () {
        // 声明常驻根节点
        cc.game.addPersistRootNode(this.node);

        //
        await UIManager.Instance.openWindow("MainUI")
        await UIManager.Instance.openWindow('LoginUI');
        await LoadManager.Instance.loadRes(new LoadHandel(
            function(process:number){

            },
            async function(){

                
            }
        ));
        
        

    }

    /**
     * 登陆完成
     */
    public loginComplete(){
                
        //获取背包配置
        GameProto.Instance.requestGetItemList(new CS_GetItemList());
        //test
        // this.openTest();
        AudioManager.Instance.playBg(AudioType.MUSIC_LoginBG)
        cc.debug.setDisplayStats(true);
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



    private async openTest(){

        //资源加载完成
        await UIManager.Instance.openWindow('TestUI');
        // UIManager.Instance.closeWindow('TestUI');
        //查找节点
        // UIManager.Instance.findWindow('TestUI').destroy();
        //查找组件
        let testComp = UIManager.Instance.findComponent('TestUI') as TestUI;
        testComp.play();
    }
}
