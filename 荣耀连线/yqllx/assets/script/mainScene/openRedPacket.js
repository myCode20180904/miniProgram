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
        share:{
            default:null,
            type:cc.Node,
        },
        nextGame:{
            default:null,
            type:cc.Node,
        },
        tixianFram:cc.SpriteFrame

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

         //
         this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_END,function(event){  }, this);
         this.node.getChildByName("db").on(cc.Node.EventType.TOUCH_START,function(event){}, this);
         this.node.getChildByName("bg")._localZOrder = 0;
         this.node.getChildByName("db")._localZOrder = 1;

         this.shareReward = 1;
         
    },

    start () {
        // var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        // wxnodeScript.showBannerAd();
        //
        this.closeBn.on(cc.Node.EventType.TOUCH_END, this.onClose, this);
        //
        this.share.on(cc.Node.EventType.TOUCH_END, this.onShare, this);
        //
        this.nextGame.on(cc.Node.EventType.TOUCH_END, this.onNextGame, this);

        let money =  this.node.getChildByName("money");
        console.info("openRedPacket---"+this.reward);
        money.getComponent(cc.Label).string =this.reward;


        // if(g_define.gameConfig.gameType==2){
        //     if(g_define.gameConfig.gateLevel>=10){
        //         this.nextGame.off(cc.Node.EventType.TOUCH_END, this.onNextGame, this);
        //         this.nextGame.active = false;
        //     }
        // }
        if(this.clearance){
            if(g_define.gameConfig.gameType==1){
                this.nextGame.getComponent(cc.Sprite).spriteFrame=this.tixianFram;
                this.node.getChildByName("bg").off(cc.Node.EventType.TOUCH_END,this.onClose, this);
                this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_END,function(){
                    this.onClose();
                    cc.director.loadScene("mainScene");
                }, this);
            }
        }
        if(g_define.gameConfig.gameType==2){
            if( g_define.getDataScript().gateBattleData.pass==1){
                this.nextGame.getComponent(cc.Sprite).spriteFrame=this.tixianFram;
                this.node.getChildByName("bg").off(cc.Node.EventType.TOUCH_END,this.onClose, this);
                this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_END,function(){
                    this.onClose();
                    cc.director.loadScene("mainScene");
                }, this);
            }
        }

    },

    onShare:function(event){
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

    onNextGame:function(event){
       
        if(g_define.gameConfig.gameType==1){
            if(this.clearance){
                cc.director.loadScene("mainScene",function(){
                    myToast.showPrefab("prefab/redPacket",cc.find("Canvas"));
                });
                
            }
        }else{
            console.info("onNextGame:"+g_define.gameConfig.gateLevel);
            if(g_define.gameConfig.gameType==2){
                if( g_define.getDataScript().gateBattleData.pass==1){
                    cc.director.loadScene("mainScene",function(){
                        myToast.showPrefab("prefab/redPacket",cc.find("Canvas"));
                    });
                    return;
                }
            }
            var commonScript=cc.find("wxNode").getComponent("commonData");
            commonScript.startGame(2);
        }

    },

    onClose:function(){
        this.node.destroy();
        // var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        // wxnodeScript.hideBannerAd();
    },


     update (dt) {
        let money =  this.node.getChildByName("money");
        let allLen =  this.node.getChildByName("yuan").width+money.width+10;
        money.x = -allLen/2+money.width/2
        this.node.getChildByName("yuan").x =allLen/2-this.node.getChildByName("yuan").width/2;
     },

});
