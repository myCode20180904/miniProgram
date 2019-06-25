import { Logger } from "../tools/Logger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Box extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        
    }

    // update (dt) {}

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter(other, self) {
        if(self.tag==1){
            self.tag=2;
            self.node.opacity = 100;
        }
    }
    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay (other, self) {
        if(self.tag==1){
            self.tag=2;
            self.node.opacity = 100;
        }
    }
    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit(other, self) {
        if(self.tag>=2){
            self.tag=1;
            self.node.opacity = 255;
        }
    }

}
