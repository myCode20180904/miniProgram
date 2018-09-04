var g_define = require('../g_define');
var myToast = require('./toastScript');
var config = require('../config')

cc.Class({
    extends: cc.Component,

    properties: {
        closeBn:{
            default:null,
            type:cc.Node,
        },
        xuanyao:{
            default:null,
            type:cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

         //
         this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_END,this.onClose, this);
         this.node.getChildByName("db").on(cc.Node.EventType.TOUCH_END,this.onShare, this);
         this.node.getChildByName("bg")._localZOrder = 0;
         this.node.getChildByName("db")._localZOrder = 1;

         this.closeBn.on(cc.Node.EventType.TOUCH_END,this.onClose, this);

         this.shareReward = 1;
         this.node.getChildByName("openUI").active = false;
         this.xuanyao.on(cc.Node.EventType.TOUCH_END, this.onXuanYao, this);
    },

    start () {
      
    },

    onShare:function(event){
        var wxnodeScript = cc.find("wxNode").getComponent('wxNode');
        var share_d = g_define.getShareData();
        let shareData = {
            title:share_d.title,
            imageUrl:share_d.img,
            query:``
        }
        var that = this;
        
        wxnodeScript.onShare(shareData,function(res){
            if(res.shareTickets){
                if(res.shareTickets.length<=0){
                    myToast.show(1.0,"分享到群才能获得奖励",cc.find("Canvas"));
                    return;
                }

                var commonScript=cc.find("wxNode").getComponent("commonData");
                var _callfunc=function(response){
                    console.info(response);
                    if(response.err==0){

                        myToast.showPrefab("prefab/ui_section/flyGold",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2),null,function(){
                            cc.director.getScene().getChildByName("flyGold").getComponent("flyGold").setFrame("hongbao");
                        },10);
                        g_define.getDataScript().userInfo.money =  parseFloat(parseFloat(g_define.getDataScript().userInfo.money)+parseFloat(g_define.getDataScript().userInfo.newerRedPacket)).toFixed(2);
                        console.info( g_define.getDataScript().userInfo.money)
                        console.info(parseFloat(g_define.getDataScript().userInfo.money),parseFloat(g_define.getDataScript().userInfo.newerRedPacket))
                        //更新用户信息
                        if(cc.director.getScene().name=="mainScene"){
                            cc.find("Canvas").getComponent("mainScene").updateMainUI();
                        }

                        that.openRedPacket(g_define.getDataScript().userInfo.newerRedPacket);
                    
                    }else{
                        //that.openRedPacket(g_define.getDataScript().userInfo.newerRedPacket);
                    }
                }
                commonScript.sendBehavio(6,_callfunc);
            }else{
                myToast.show(1.0,"分享到群才能获得奖励",cc.find("Canvas"));
            }
            
        });
    },

    openRedPacket:function(reward){
        console.info("openRedPacket");
        this.node.getChildByName("db").active = false;
        this.node.getChildByName("openUI").active = true;

        let money =  this.node.getChildByName("openUI").getChildByName("money");
        money.getComponent(cc.Label).string =reward;

        this.node.getChildByName("openUI").getChildByName("bg").on(cc.Node.EventType.TOUCH_END,function(){
            console.info("openUI");
        }, this);
    },


    onXuanYao:function(event){
        console.info("onXuanYao");

        var wxnodeScript = cc.find("wxNode").getComponent('wxNode');
        var share_d = g_define.getShareData();
        let shareData = {
            title:share_d.title,
            imageUrl:share_d.img,
            query:``
        }
        var that= this;
        wxnodeScript.onShare(shareData,function(res){
            if(that.shareReward==1){
                that.shareReward=0;

                var commonScript=cc.find("wxNode").getComponent("commonData");
                var _callfunc=function(response){
                    console.info(response);
                    if(response.err==0){
                        if(response.score>=0){
                            myToast.showPrefab("prefab/ui_section/flyGold",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2),null,function(){
                            },100);
                            myToast.show(1.0,"金币+50",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2));
                            
                            g_define.getDataScript().userInfo.gold = response.score;
                            //更新用户信息
                            if(cc.director.getScene().name=="mainScene"){
                                cc.find("Canvas").getComponent("mainScene").updateMainUI();
                            }
                            if(cc.director.getScene().name=="gameScene"){
                                cc.find("Canvas").getComponent("gameuiScript").updateGameUI();
                            }
                        }
                    }
                }
                commonScript.sendBehavio(5,_callfunc);
            }else{
                //myToast.show(1.0,"已经领取过了",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            }
            
        });
    },
   
    onClose:function(){
        if(this.onCloseCall)
        {
            this.onCloseCall();
        }
        this.node.destroy();

    },

    update (dt) {
        let openUI = this.node.getChildByName("openUI");
        let money =  openUI.getChildByName("money");
        let allLen =  openUI.getChildByName("yuan").width+money.width+10;
        money.x = -allLen/2+money.width/2
        openUI.getChildByName("yuan").x =allLen/2-openUI.getChildByName("yuan").width/2;
     },

   
});
