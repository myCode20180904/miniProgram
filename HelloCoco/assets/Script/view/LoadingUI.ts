import BaseUI from "./BaseUI";
import { Util } from "../tools/Util";
import ShaderComponent from "../tools/shader/ShaderComponent";
import { ShaderType } from "../tools/shader/ShaderManager";
import { Logger } from "../tools/Logger";

/**
 * LoadingUI
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingUI extends BaseUI {
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

    private updateFrame:number = 0;
    private frameDt:number = 0;
    update(dt){
        super.update(dt);
        this.updateFrame++;
        this.frameDt+=dt;
        if(this.updateFrame%1000==0){
            this.fixedUpdate(this.frameDt)
            this.frameDt = 0;
        }
        if(this.updateFrame>Number.MAX_VALUE){
            this.updateFrame = 0;
        }
    }

    fixedUpdate(dt){
        
    }


}
