var dataScript = require('../../model/dataScript')

cc.Class({
    extends: cc.Component,

    properties: {
        tip_lb:{
            default:null,
            type:cc.Node
        },
        ready:{
            default:null,
            type:cc.Node
        },
        kaishi:{
            default:null,
            type:cc.Node
        },
        num:3
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){}, this);
        this.node.scale = 0;
        this.node.opacity = 0;
        this.node.runAction(cc.sequence(cc.fadeIn(0.2),cc.scaleTo(0.2,1.0)));
        let key = `loadres/ready${this.num}`
        this.tip_lb.getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(key);
        this.schedule(this.daojishi,1);
    },

    start () {
        
    },

    daojishi:function(dt){
        this.num--;
        if(this.num<0){
            if(this.callBack){
                this.callBack();
            }
            this.unschedule(this.daojishi);
            this.close();
        }else{
            let key = `loadres/ready${this.num}`
            this.tip_lb.getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(key);
            this.tip_lb.scale = 0;
            this.tip_lb.opacity = 0;
            this.tip_lb.stopAllActions();
            this.tip_lb.runAction(cc.sequence(cc.fadeIn(0.3),cc.scaleTo(0.3,1.0)));
        }

        if(this.num==0){
            this.tip_lb.active = false;
            this.ready.active = false;
            this.kaishi.active = true;
            this.kaishi.scale = 0;
            this.kaishi.opacity = 0;
            this.kaishi.stopAllActions();
            this.kaishi.runAction(cc.sequence(cc.fadeIn(0.3),cc.scaleTo(0.3,1.0)));
        }
        
    },

    close:function(){
        this.node.destroy();
    },
    
});
