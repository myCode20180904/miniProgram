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
        //广告
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        wxnodeScript.showBannerAd();
        //
        this.closeBn.on(cc.Node.EventType.TOUCH_END, this.onClose, this);


        this.node.tip = this.node.getChildByName("tip1");
        if(g_define.getDataScript().isHelp.tip==2){
            this.node.tip = this.node.getChildByName("tip1");
        }else if(g_define.getDataScript().isHelp.tip==1){
            this.node.tip = this.node.getChildByName("tip2");
        }else if(g_define.getDataScript().isHelp.tip==3){
            this.node.tip = this.node.getChildByName("tip3");
        }

        if(g_define.getDataScript().isHelp.tip>0){
            console.info(g_define.getDataScript().isHelp.name);
            console.info(g_define.getDataScript().isHelp.name.toString());
            this.node.tip.active = true;
            let headmask = this.node.tip.getChildByName("headmask");
            if(g_define.getDataScript().isHelp.avatarurl!=0){
                g_define.loadHttpIcon(headmask.getChildByName("head"),g_define.getDataScript().isHelp.avatarurl,function(){});
            }
            if(g_define.getDataScript().isHelp.name!=0){
                this.node.tip.getChildByName("name").getComponent(cc.Label).string = g_define.getDataScript().isHelp.name.toString();
            }
        }
       
    },


    onClose:function(){
        this.node.destroy();
                //广告
                var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
                wxnodeScript.hideBannerAd();
    },




});
