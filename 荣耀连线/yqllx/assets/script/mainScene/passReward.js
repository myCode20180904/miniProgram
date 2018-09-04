var g_define = require('../g_define');
var myToast = require('./toastScript');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

         //
         this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){}, this);
         this.node.getChildByName("db").on(cc.Node.EventType.TOUCH_START,this.onOpen, this);
         this.node.getChildByName("bg")._localZOrder = 0;
         this.node.getChildByName("db")._localZOrder = 1;
    },

    start () {
        //
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        wxnodeScript.showBannerAd();
    },

    onOpen:function(){
        
        var that = this;
        var data = {
            reward:that.reward
        }

        
        myToast.showPrefab("prefab/openRedPacket",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2),null,function(data){
            console.info("passReward---"+data.reward);
            cc.director.getScene().getChildByName("openRedPacket").getComponent("openRedPacket").reward = data.reward;
          },3,data);

        myToast.showPrefab("prefab/ui_section/flyGold",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2),null,function(){
            cc.director.getScene().getChildByName("flyGold").getComponent("flyGold").setFrame("hongbao");
        },10);

          this.onClose();
    },

    onClose:function(){
        this.node.destroy();
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        wxnodeScript.hideBannerAd();
    },




});
