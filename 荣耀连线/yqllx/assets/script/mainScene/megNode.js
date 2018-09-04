
var g_define = require('../g_define');
var myToast = require('./toastScript');

cc.Class({
    extends: cc.Component,

    properties: {
        msgLabel:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.msgLabel.active = false;
        this.hide();
        this.schedule(this.findMsg,0.02);
    },

    start () {

    },

    scollMsg:function(){
        // console.info(g_define.getDataScript().config.msgQueen);
        if(!g_define.getDataScript().config.msgQueen){
            return;
        }
        if(g_define.getDataScript().config.msgQueen.length>0){
            let msg = g_define.getDataScript().config.msgQueen.pop();
            g_define.getDataScript().config.msgQueen.unshift(msg);
            //console.info(msg);
            var node = cc.instantiate(this.msgLabel);
            node.getComponent(cc.RichText).string =msg.msg;
            node.parent = this.msgLabel.parent;
            node.active = true;
            node.zIndex = 3;
            node.x = 180;
            let offset = node.width+365;
            
            this.delay = 0.6+offset/100;
            
            //
            
            let seq = cc.sequence(cc.fadeIn(0.3),cc.moveBy(offset/100,cc.v2(-offset,0)),cc.fadeOut(0.3));
            node.runAction(seq);
            


            //下一条
            this.scheduleOnce(function() {
                // 这里的 this 指向 component
                this.scollMsg();
            },this.delay);

        }else{
            //this.hide();
            this.schedule(this.findMsg,0.02);
        }
       
    },

    findMsg:function(){
        if(!g_define.getDataScript().config.msgQueen){
            return;
        }
        if(g_define.getDataScript().config.msgQueen.length>0){
            this.unschedule(this.findMsg);
            this.show();
            this.scollMsg();
        }
    },

    hide:function(){
        this.node.getChildByName("bg").active = false;
    },
    show:function(){
        this.node.getChildByName("bg").active = true;
    }


    //  update (dt) {

    //  },
});
