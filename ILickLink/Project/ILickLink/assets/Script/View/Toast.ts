
import { UIManager} from "../Manager/UIManager";
const {ccclass, property} = cc._decorator;

@ccclass
export class Toast extends cc.Component {
    @property(cc.Label)
    label:cc.Label = null;
    @property()
    message:string = '';

    start () {

    }

    showMsg(msg:string,dt:number){
        this.message = msg
        this.label.string = this.message;
        this.node.getChildByName('bg').width = this.label.node.width+200;
        this.node.getChildByName('bg').height = this.label.node.height+60;

        var that = this;
        this.node.runAction(cc.sequence(cc.delayTime(dt),cc.fadeOut(0.5),cc.callFunc(function(){
            that.close();
        })))
    }
    /**
     * 关闭
     */
    private close(){
        UIManager.Instance.closeWindow('Toast');
    }

}
