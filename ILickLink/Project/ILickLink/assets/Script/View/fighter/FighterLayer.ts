import { BaseUI } from "../BaseUI";
import { Logger } from "../../Tool/Logger";
import { FighterFactor } from "../../Fighter/FighterFactor";

const {ccclass, property} = cc._decorator;

@ccclass
export class FighterLayer extends BaseUI {


    // LIFE-CYCLE CALLBACKS:
    monsters:Array<number> = new Array();

    onLoad () {
        Logger.info('FighterLayer onLoad');
    }

    onDestroy(){
        Logger.info('FighterLayer onDestroy');
    }

    onEnable(){
        Logger.info('FighterLayer onEnable');
    }

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,function(){},this);

        FighterFactor.Instance;
    }

    public addone(){
        let player = FighterFactor.Instance.createPlayer(this.node);

    }
    public addrand(){
        let monster = FighterFactor.Instance.createMonster(this.node);
        if(!monster){
            return;
        }
        monster.setPos(cc.v2(0,-600+this.monsters.length*100));
        this.monsters.push(monster.countId);
    }
    public remove(){
        if(this.monsters.length>0){
            let die_id = this.monsters.shift();
            FighterFactor.Instance.removeMonster(die_id);
        }

    }

     /**
     * 菜单
     * @param event 点击事件
     * @param customEventData 用户参数
     */
    menu (event:cc.Event,customEventData:any){
        // Logger.info('touch menu:',customEventData);
        if(customEventData=="close"){
            this.close();
        }
        if(customEventData=="addone"){
            this.addone();
        }
        if(customEventData=="addrand"){
            this.addrand();
        }
        if(customEventData=="remove"){
            this.remove()
        }
      
    }

    /**
     * 关闭
     */
    private close(){
        
    }

    // update (dt) {}

    public onShow(){
        Logger.info('FighterLayer onShow');
    }
    public onHide(){
        Logger.info('FighterLayer onHide');
        
    }
}
