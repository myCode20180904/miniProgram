import { WXManager,WX_OpenData } from "./wxApi";

const {ccclass, property} = cc._decorator;

@ccclass
export class displaywxsub extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // let wxSubContextView:cc.WXSubContextView = this.node.getComponent(cc.WXSubContextView);
        // wxSubContextView.enabled = false;
    }

    start () {

    }

    public show(){
        this.node.active = true;
        this.node.getComponent(cc.WXSubContextView).updateSubContextViewport();

        let wx_OpenData = new WX_OpenData("show")
        wx_OpenData.res = {};
        WXManager.Instance.sendMessageToChild(wx_OpenData);
    }

    public hide(){
        this.node.active = false;
        
        let wx_OpenData = new WX_OpenData("hide")
        wx_OpenData.res = {};
        WXManager.Instance.sendMessageToChild(wx_OpenData);
    }

    // update (dt) {}
}
