var plat = require('../plat/platScript')
var bannerAd = require('../public/bannerAd')
var dataScript = require('../model/dataScript')
var g_define = require('../public/g_define')

cc.Class({
    extends: bannerAd.obj,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        console.info("rank onLoad");
        this._onLoad();

    },
    onDestroy(){
        console.info("rank onDestroy");
        this._onDestroy();
    },

    start () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){ }, this);
        var localNode = cc.find("localNode").getComponent("localNodeScript");
        localNode.show_display();
    },

    menu:function(event,customEventData){
        console.info(customEventData);
        if(customEventData=="back"){
            this.close();
        }else if(customEventData=="share"){

            let shareData = {
                title:"rank",
                imageUrl:'',
                query:``  
            }
            //分享
            plat.onShare(shareData,function(res){
                if(res.shareTickets){
                    if(res.shareTickets.length<=0){
                        myToast.show(1.0,"请分享到群！",cc.find("Canvas"));
                        return;
                    }
                    myToast.show(1.0,"分享成功！",cc.find("Canvas"));
                   
                }else{
                    myToast.show(1.0,"请分享到群！",cc.find("Canvas"));
                }
            });
            
        }
    },

    close:function(){
        this.node.destroy();
        var localNode = cc.find("localNode").getComponent("localNodeScript");
        localNode.hide_display();
        if(dataScript.common.GameClubBn){
            dataScript.common.GameClubBn.show();
        }
    }


});
