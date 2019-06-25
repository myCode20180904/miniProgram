import BaseUI from "./BaseUI";
import StartTip from "./StartTipUI";
import { UIModels } from "../manager/UIModels";
import { Logger } from "../tools/Logger";

/**
 * HallUI
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class HallUI extends BaseUI {
    private background:cc.Node;
    private label:cc.Label;

    private gameNode:cc.Node;
    private box_model:cc.Node;
    private camera:cc.Camera;
    private hearth_lb:cc.Label;

    //
    //高
    private ischeck_update:boolean = false;
    private gg_h:number = 0;
    private boxlist:Array<cc.Node> = [];
    private nowBox:cc.Node = null;
    private hearth:number = 10;
    constructor(skin:string){
        super(skin,[{url:'spine/hero/nanzhu',type:sp.SkeletonData},
        {url:'spine/43046_ske/43046_ske',type:dragonBones.DragonBonesAsset},
        {url:'spine/monster/guai01',type:sp.SkeletonData},
        {url:'spine/monster/guai02',type:sp.SkeletonData},
        {url:'spine/monster/guai03',type:sp.SkeletonData}]);
        UIModels.Instance.showLoading();

        this.enablePhysic();
    }

    onLoadProcess(completedCount: number, totalCount: number){
        super.onLoadProcess(completedCount, totalCount);
    }

    onLoadComplete(){
        super.onLoadComplete();
        UIModels.Instance.hideLoading();
        this.init();
    }

    init(){
        this.label = this.node.getChildByName('label').getComponent(cc.Label);
        this.label.string = '叠高高';

        this.background = this.node.getChildByName('background');

        this.gameNode = this.node.getChildByName('gameNode');

        this.box_model = this.node.getChildByName('gameNode').getChildByName('box_model');

        this.camera = this.node.getChildByName('camera').getComponent(cc.Camera);

        this.hearth_lb = this.node.getChildByName('tip').getChildByName('hearth').getComponent(cc.Label);

        this.gameNode.getChildByName('buttom').x = -cc.winSize.width/2;
        this.gameNode.getChildByName('buttom').y = -cc.winSize.height;

        this.addControl();

        this.showStartTip();
    }

    showStartTip(){
        new StartTip('view/StartTip');
        
    }
    /**
     * 开启物理
     */
    enablePhysic(){
        var manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        // manager.gravity = cc.v2(0, -160);
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit
        // ;
        // cc.director.getPhysicsManager().debugDrawFlags = 0;
        

        

        // 开启物理步长的设置
        manager.enabledAccumulator = true;
        // 物理步长，默认 FIXED_TIME_STEP 是 1/60
        cc.PhysicsManager.FIXED_TIME_STEP = 1/30;
        // 每次更新物理系统处理速度的迭代次数，默认为 10
        cc.PhysicsManager.VELOCITY_ITERATIONS = 8;
        // 每次更新物理系统处理位置的迭代次数，默认为 10
        cc.PhysicsManager.POSITION_ITERATIONS = 8;

        var collison_manager = cc.director.getCollisionManager();
        collison_manager.enabled = true;
        collison_manager.enabledDebugDraw = true;
        collison_manager.enabledDrawBoundingBox = true;
    }

    /**
     * startGame
     */
    startGame(){
        Logger.info('游戏开始：：')

    }
    
    /**
     * 游戏控制
     * 
     */
    addControl(){
        this.background.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.background.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.background.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    private removeControl(){
        this.background.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.background.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.background.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event:cc.Event.EventTouch){
        Logger.info('onTouchStart');
        let startPOS= event.touch.getStartLocation();
        startPOS.x-=cc.winSize.width/2;
        startPOS.y-=cc.winSize.height/2-this.camera.node.y;
        var collider = cc.director.getPhysicsManager().testPoint(cc.v2(event.touch.getStartLocation().x,event.touch.getStartLocation().y+this.camera.node.y));
        if(!collider){
            this.nowBox = this.addOne(startPOS);
        }
        this.ischeck_update = false;

    }
    onTouchMove(event:cc.Event.EventTouch){
        if(!this.nowBox){
            return;
        }

        let movePOS= event.touch.getLocation();
        movePOS.x-=cc.winSize.width/2;
        movePOS.y-=cc.winSize.height/2-this.camera.node.y;
        this.nowBox.setPosition(movePOS);

    }
    onTouchEnd(event:cc.Event.EventTouch){
        this.goBox();
        this.ischeck_update = true;
    }
    onTouchCancel(event:cc.Event.EventTouch){
        this.goBox();
        this.ischeck_update = true;
    }

    
    /**
     * 复制一个box
     */
    createBox():cc.Node{
        let box = cc.instantiate(this.box_model);
        box.active = true;
        return box;
    }

    addOne(pos):cc.Node{
        
        //
        let box = this.createBox();
        this.gameNode.addChild(box);
        box.setPosition(pos)
        box.getComponent(cc.RigidBody).active = false;
        box.color = cc.color(Math.random()*255,Math.random()*255,Math.random()*255)

        this.setBoxTag(box,1);
        
        return box;
    }
    removeNowBox(){
        if(!this.nowBox){
            return;
        }
        this.nowBox.removeFromParent();
        this.nowBox.destroy();
        this.nowBox = null;
    }

    goBox(){
        if(!this.nowBox){
            return;
        }
        if(this.getBoxTag(this.nowBox)==2){
            this.removeNowBox();
            return;
        }
        
        this.nowBox.getComponent(cc.RigidBody).active = true;
        this.nowBox.getComponent(cc.RigidBody).awake = true;
        this.setBoxTag(this.nowBox,0);
        //
        this.boxlist.push(this.nowBox);
        this.nowBox = null;
    }

    setBoxTag(box:cc.Node,num:number){
        if(box.getComponent(cc.BoxCollider)){
            box.getComponent(cc.BoxCollider).tag = num;
        }

    }
    getBoxTag(box:cc.Node):number{
        if(box.getComponent(cc.BoxCollider)){
            return box.getComponent(cc.BoxCollider).tag;
        }
    }

   

    checkAllBox(){
        let max_y = -cc.winSize.height/2;
        for (let index = 0; index < this.boxlist.length; index++) {
            const element = this.boxlist[index];
            //
            if(element.y<-cc.winSize.height/2){
                element.removeFromParent();
                element.destroy();
                this.boxlist.splice(index,1);
                this.hearth--;
                index--;
                return;
            }

            if(element.y>max_y){
                max_y = element.y;
            }

        }
        // Logger.info('最高位置',max_y+cc.winSize.height/2,this.boxlist.length);
        this.gg_h = max_y+cc.winSize.height/2;

    }

    //

    update(dt){
        super.update(dt);
    }

    fixedUpdate(dt){
        super.fixedUpdate(dt);
        if(this.ischeck_update){
            this.checkAllBox();
        }
        {
            let num = 0;
            if(this.gg_h>cc.winSize.height/2){
                num=this.gg_h-cc.winSize.height/2;
            }else{
            }
            num = num - this.camera.node.y;
            this.camera.node.y += num*dt;

        }
        

        this.hearth_lb.string = ''+this.hearth;
        this.label.string = '叠高高：'+Math.floor(this.gg_h);
    }
    
    onClose(){
        super.onClose();
        this.removeControl();
    }
}
