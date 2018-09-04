
var myToast = require('../mainScene/toastScript');
cc.Class({
    extends: cc.Component,

    properties: {
        gold:{
            default:null,
            type:cc.Node
        },
        hongbaoFrame:cc.SpriteFrame
    },

    onLoad () {


    },


    start () {
        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            this.jumpBoom();
        }, 0.1);
    },
    setFrame:function(name){
        if(name=="hongbao"){
            this.gold.getComponent(cc.Sprite).spriteFrame = this.hongbaoFrame;
        }
        
    },

    jumpBoom:function(){
        for (let index = 0; index < 15; index++) {
            let random700 = Math.round(Math.random()*700);
            let random20 = Math.round(Math.random()*20);
            let dt = Math.random();

            let node = cc.instantiate(this.gold);
            node.parent = this.node;
            node.x = -random20;
            node.y = -300+random20;
            node.active = true;
            let skew = -10+Math.random()*20;
            node.skewX = skew;
            node.skewY = -skew;
            node.opacity = 0;

            var bezier = [cc.v2(0, 0), cc.v2(-100, 800+random700), cc.v2(random700/2, random20)];
            var bezierForward = cc.bezierBy(1.5, bezier).easing(cc.easeIn(0.4));
            let seq = cc.sequence(cc.delayTime(dt),cc.spawn(cc.fadeIn(0.3),bezierForward),cc.fadeOut(0.3));
            node.runAction(seq);
        }
        for (let index = 0; index < 15; index++) {
            let random700 = Math.round(Math.random()*700);
            let random20 = Math.round(Math.random()*20);
            let dt = Math.random();

            let node = cc.instantiate(this.gold);
            node.parent = this.node;
            node.x = random20;
            node.y = -300+random20;
            node.active = true;
            let skew = -10+Math.random()*20;
            node.skewX = skew;
            node.skewY = -skew;
            node.opacity = 0;

            var bezier = [cc.v2(0, 0), cc.v2(100, 800+random700), cc.v2(-random700/2, random20)];
            var bezierForward = cc.bezierBy(1.5, bezier).easing(cc.easeIn(0.4));
            let seq = cc.sequence(cc.delayTime(dt),cc.spawn(cc.fadeIn(0.3),bezierForward),cc.fadeOut(0.3));
            node.runAction(seq);
        }
        

        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            this.node.destroy();
        }, 3);
    },

    fly:function(){
        for (let index = 0; index < 25; index++) {
            let node = cc.instantiate(this.gold);
            node.parent = this.node;
            node.x = -250+100*((index+1)%6)*Math.random();
            node.y = 750;
            node.active = true;
            let skew = -10+Math.random()*20;
            node.skewX = skew;
            node.skewY = -skew;

            let dt = 1.0+Math.random();
            //cc.moveBy(2.0,cc.v2(0,-1500)).easing(cc.easeIn(2));
            node.runAction(cc.sequence(cc.moveBy(dt,cc.v2(0,-1300)).easing(cc.easeIn(4)),cc.fadeOut(0.5)));
        }
        
        myToast.show(1.0,"金币+50",cc.find("Canvas"));

        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            this.node.destroy();
        }, 3);
    }
    // update (dt) {},
});
