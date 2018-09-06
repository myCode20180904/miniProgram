var g_define = require('../g_define');
var myToast = require('./toastScript');

cc.Class({
    extends: cc.Component,

    properties: {
        closeBn:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

         //
         this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,this.onClose, this);
         this.node.getChildByName("db").on(cc.Node.EventType.TOUCH_START,function(event){  }, this);
         this.node.getChildByName("bg")._localZOrder = 0;
         this.node.getChildByName("db")._localZOrder = 1;
    },

    start () {
        //
        this.closeBn.on(cc.Node.EventType.TOUCH_END, this.onClose, this);

        //
        let bushu =  this.node.getChildByName("bushu");
        bushu.getComponent(cc.Label).string =this.reward;
        
        this.node.getChildByName("tip").getComponent(cc.Label).string =
        `恭喜你通过第${this.gate-this.gate%10}关`;

        // myToast.show(`通过第${this.gate}关,奖励10步!`,2.0,this.node);

    },


    onClose:function(){
        this.node.destroy();
    },

    update (dt) {
        let bushu =  this.node.getChildByName("bushu");
        let allLen =  this.node.getChildByName("add").width+this.node.getChildByName("bu").width+bushu.width+20;
        this.node.getChildByName("add").x = -allLen/2+this.node.getChildByName("add").width/2;
        bushu.x = -allLen/2+this.node.getChildByName("add").width+bushu.width/2+10;
        this.node.getChildByName("bu").x =allLen/2-this.node.getChildByName("bu").width/2;
     },


});
