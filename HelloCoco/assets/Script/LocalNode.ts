import { LOG_DEBUG } from "./GameConfig";
import LoginUI from "./view/LoginUI";

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
        cc.debug.setDisplayStats(LOG_DEBUG);
    }

    start () {
        // 声明常驻根节点
        cc.game.addPersistRootNode(this.node);

       
        this.enterFirstPage();

    }

    enterFirstPage(){
        new LoginUI('view/Login');
    }

 
    /**
     * showDisplayView 数据域
     */
    public showDisplayView(){
        
    }
    public hideDisplayView(){
        
    }

    // update (dt) {}

}
