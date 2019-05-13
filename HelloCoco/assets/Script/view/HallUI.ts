import BaseUI from "./BaseUI";
import { UIManager } from "../manager/UIManager";

/**
 * HallUI
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallUI extends BaseUI {
    private label:cc.Label;
    constructor(skin:string){
        super(skin,[{url:'spine/hero/nanzhu',type:sp.SkeletonData},
        {url:'spine/43046_ske/43046_ske',type:dragonBones.DragonBonesAsset},
        {url:'spine/monster/guai01',type:sp.SkeletonData},
        {url:'spine/monster/guai02',type:sp.SkeletonData},
        {url:'spine/monster/guai03',type:sp.SkeletonData}]);
        UIManager.Instance.showLoading();
    }

    onLoadProcess(completedCount: number, totalCount: number){
        super.onLoadProcess(completedCount, totalCount);
    }

    onLoadComplete(){
        super.onLoadComplete();
        UIManager.Instance.hideLoading();
        this.init();
    }

    init(){
        this.label = this.node.getChildByName('label').getComponent(cc.Label);
        this.label.string = 'create hand!';


        
    }
    
    
}
