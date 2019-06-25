import BaseUI from "./BaseUI";
import { UIManager } from "../manager/UIManager";
import { Logger } from "../tools/Logger";
import HallUI from "./HallUI";

/**
 * StartTipUI
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class StartTipUI extends BaseUI {
    private bg:cc.Node;
    private startBn:cc.Button;
    constructor(skin:string){
        super(skin,[]);

    }

    onLoadProcess(completedCount: number, totalCount: number){
        super.onLoadProcess(completedCount, totalCount);
    }

    onLoadComplete(){
        super.onLoadComplete();
        this.init();
        this.node.zIndex = 1000;
    }

    onDestroy(){
        super.onDestroy();
        this.bg = null;
    }

    init(){
        this.bg = this.node.getChildByName('background');
        this.blurBg(this.bg);

        this.startBn = this.node.getChildByName('startBn').getComponent(cc.Button);
        this.addButtonEvent(this.startBn.node,'startGame','');
    }

    /**
     * 设置加载进度
     */
    setProcess(process: number) {
        
    }
    
    
    onClose(){
        super.onClose();

    }
    
    //#####################
    show(){
        this.node&&(this.node.active = true);
    }
    hide(){
        this.node&&(this.node.active = false);
    }


    /**
     * 开始游戏
     */
    startGame(){
        this.close();
        let hallnode  = UIManager.Instance.getRegUI('HallUI');
        if(hallnode){
            hallnode.getComponent(HallUI).startGame();
        }
    }

}
