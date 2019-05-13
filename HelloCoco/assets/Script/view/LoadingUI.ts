import BaseUI from "./BaseUI";

/**
 * LoadingUI
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingUI extends BaseUI {
    private label:cc.Label;
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

    init(){

        
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
}
