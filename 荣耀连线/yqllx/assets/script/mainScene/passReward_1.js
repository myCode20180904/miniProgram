var g_define = require('../g_define');
var myToast = require('./toastScript');

cc.Class({
    extends: cc.Component,

    properties: {
        closeBn:{
            default:null,
            type:cc.Node,
        },
        quickGet:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

         //
         this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){}, this);
         this.node.getChildByName("db").on(cc.Node.EventType.TOUCH_START,function(event){}, this);
         this.node.getChildByName("bg")._localZOrder = 0;
         this.node.getChildByName("db")._localZOrder = 1;
    },

    start () {
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        wxnodeScript.showBannerAd();
         //
         this.quickGet.on(cc.Node.EventType.TOUCH_END, this.onOpen, this);
        //
        this.closeBn.on(cc.Node.EventType.TOUCH_END, this.onClose, this);
    },

    onOpen:function(){
        
        var that = this;
        myToast.showPrefab("prefab/openRedPacket",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2),null,function(){ 
            if(that.clearance){
                if(that.clearance==1){
                    cc.director.getScene().getChildByName("openRedPacket").getComponent("openRedPacket").clearance = 1;
                    console.info("passReward_1--", that.reward);
                    console.info("-----------"+ g_define.getDataScript().lastXSHBreward);
                    cc.director.getScene().getChildByName("openRedPacket").getComponent("openRedPacket").reward = g_define.getDataScript().lastXSHBreward;
                }
            }

         },3);
         this.onClose();
    },

    onClose:function(){
        this.node.destroy();
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        wxnodeScript.hideBannerAd();
    },




});
