var plat = require('../plat/platScript')
var bannerAd = require('../public/bannerAd')
var dataScript = require('../model/dataScript')

cc.Class({
    extends: bannerAd.obj,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        console.info("help onLoad");
        this.node.getChildByName("db").getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get('wanfajieshao');
        this._onLoad();

    },
    onDestroy(){
        console.info("help onDestroy");
        this._onDestroy();
    },

    start () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){ }, this); 
        
    },

   

    menu:function(event,customEventData){
        console.info(customEventData);
        if(customEventData=="close"){
            if(this.callBack){
                this.callBack();
            }
            this.close();
        }else if(customEventData=="close_notip"){
            cc.sys.localStorage.setItem('isNewPlayer',1);
            if(this.callBack){
                this.callBack();
            }
            this.close();
        }
    },

    close:function(){
        this.node.destroy();
    }


});
