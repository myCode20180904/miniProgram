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

    },


    onClose:function(){
        this.node.destroy();

    },




});
