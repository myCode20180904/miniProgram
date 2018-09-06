// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        img:{
            default:null,
            type:cc.Node,
        },
        label:{
            default:null,
            type:cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, function(event){}, this);
        this.img.active = false;
        this.label.active = false;
        this.node.getChildByName("bg").active = false;
        this.label.string = " loading... ";
        
        this.node.runAction(cc.sequence(cc.delayTime(0.2),cc.callFunc(function(){
            this.img.active = true;
            this.label.active = true;
            this.node.getChildByName("bg").active = true;
            
        },this)));
        this.img.runAction(cc.repeatForever(cc.rotateBy(2.0,360)));
    },

    start () {

    },

    // update (dt) {},
});
