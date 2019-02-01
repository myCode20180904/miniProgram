import { FighterObj } from "./FighterObj";
import { FighterAnims, FighterAnim } from "../Define/CommonParam";


export class Player extends FighterObj {
    //动画列表
    public animations: FighterAnims = null;
    public now_anim: FighterAnim = null;

    public onLoad(){
        this.group = 'player';
        this.animations = new FighterAnims();
        //骨骼原始数据
        let use_skeleton = (this.skeleton as any)._skeleton;
        //设置动画列表
        for (let index = 0; index < use_skeleton.data.animations.length; index++) {
            const element = use_skeleton.data.animations[index];
            //待机动画
            if (element.name.indexOf("quan" + "_idle") >= 0) {
                this.animations.idle.name.push(element.name);
            }
            //攻击动画
            if (element.name.indexOf("quan" + "_atk") >= 0) {
                this.animations.atk.name.push(element.name);
            }
            //受伤动画
            if (element.name.indexOf("block") >= 0) {
                this.animations.block.name.push(element.name);
            }
            //受伤动画
            if (element.name.indexOf("hurt") >= 0) {
                this.animations.hurt.name.push(element.name);
            }
            //死亡动画
            if (element.name.indexOf("death") >= 0) {
                this.animations.death.name.push(element.name);
            }
            // ...
        }

        //初始
        this.initSkin();
        this.now_anim = this.animations.idle;
        if (this.animations.idle.name.length > 0) {
            this.setAnimation(0, this.animations.idle.name[0], true);
        }
        this.fighterNode.group = this.group;

    }

    /**
     * 初始皮肤
     * @param name 
     */
    public initSkin() {
        this.skeleton.setSkin('b');
        let name = '';
        // //武器
        // if (BagManager.Instance.getBagInfo().myKeepEquipment.weapon.getSelect()) {
        //     let name = BagManager.Instance.getBagInfo().myKeepEquipment.weapon.getSelect().Modelid;
        //     let strArr = name.split('|');
        //     Logger.info("武器:", strArr);
        //     let left_slot = this.skeleton.findSlot('wuqi_a1');
        //     left_slot.setAttachment(null);
        //     let right_slot = this.skeleton.findSlot('a/wuqi01');
        //     right_slot.setAttachment(null);
        //     //替换武器绑定左
        //     if (strArr.length > 1) {
        //         let left_atta = this.skeleton.getAttachment('wuqi_a1', strArr[1]);
        //         if (left_atta) {
        //             left_slot.setAttachment(left_atta);
        //         }
        //     }
        //     //替换武器绑定右
        //     if (strArr.length > 2) {
        //         let right_atta = this.skeleton.getAttachment('a/wuqi01', strArr[2]);
        //         if (right_atta) {
        //             right_slot.setAttachment(right_atta);
        //         }
        //     }
        // }
        // // 帽子
        // if (BagManager.Instance.getBagInfo().myKeepEquipment.hat.getSelect()) {
        //     name = BagManager.Instance.getBagInfo().myKeepEquipment.hat.getSelect().Modelid;
        //     let strArr = name.split('|');
        //     Logger.info("帽子:", name);
        // }
        // //臂章
        // if (BagManager.Instance.getBagInfo().myKeepEquipment.armband.getSelect()) {
        //     name = BagManager.Instance.getBagInfo().myKeepEquipment.armband.getSelect().Modelid;
        //     Logger.info("臂章:", name);
        // }
        // //衣服
        // if (BagManager.Instance.getBagInfo().myKeepEquipment.clothes.getSelect()) {
        //     name = BagManager.Instance.getBagInfo().myKeepEquipment.clothes.getSelect().Modelid;
        //     Logger.info("衣服:", name);
        // }
        // //面具
        // if (BagManager.Instance.getBagInfo().myKeepEquipment.mask.getSelect()) {
        //     name = BagManager.Instance.getBagInfo().myKeepEquipment.mask.getSelect().Modelid;
        //     Logger.info("面具:", name);
        // }
        // //动作
        // if (BagManager.Instance.getBagInfo().myKeepEquipment.action.getSelect()) {
        //     name = BagManager.Instance.getBagInfo().myKeepEquipment.action.getSelect().Modelid;
        //     Logger.info("动作:", name);
        // }


    }
}
