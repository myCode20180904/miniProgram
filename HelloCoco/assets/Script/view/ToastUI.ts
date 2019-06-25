import BaseUI from "./BaseUI";

/**
 * ToastUI
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class ToastUI extends BaseUI {
    private bg:cc.Node;
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

        this.bg.on(cc.Node.EventType.TOUCH_START,function(){
            this.close();
        }.bind(this),this)

        
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
