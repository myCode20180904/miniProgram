
var g_define = require('../g_define');
var config = require('../config');
var myToast = require('../mainScene/toastScript');
cc.Class({
    extends: cc.Component,

    properties: {
        guanka:{
            default:null,
            type:cc.Node
        },
        bushu:{
            default:null,
            type:cc.Node
        },
        tishi:{
            default:null,
            type:cc.Node
        },
        home:{
            default:null,
            type:cc.Node
        },
        again:{
            default:null,
            type:cc.Node
        },
        back:{
            default:null,
            type:cc.Node
        },
        mv_gold:{
            default:null,
            type:cc.Node
        },
        share_tip:{
            default:null,
            type:cc.Node
        },
        goldnum:{
            default:null,
            type:cc.Node
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.loadGame();
        this.bushu_num = 0;

        //提示
        this.tishi.on(cc.Node.EventType.TOUCH_END, this.onTishi, this);
        //主页
        this.home.on(cc.Node.EventType.TOUCH_END, this.onHome, this);
        //返回
        this.back.on(cc.Node.EventType.TOUCH_END, this.onBack, this);
        //重来
        this.again.on(cc.Node.EventType.TOUCH_END, this.onAgain, this);
        //分享看视屏
        this.mv_gold.on(cc.Node.EventType.TOUCH_END, this.onMv_gold, this);
        //分享提示
        this.share_tip.on(cc.Node.EventType.TOUCH_END, this.onShare_tip, this);



        //
        this.node.getChildByName("uiLayout").getChildByName("bushu").getChildByName("bg").on(cc.Node.EventType.TOUCH_END, this.onAddStep, this);
        this.node.getChildByName("uiLayout").getChildByName("gold_ingame").on(cc.Node.EventType.TOUCH_END, this.onAddGold, this);
   
    },

    start () {
        if(!g_define.getDataScript().open.lookMv){
            this.mv_gold.getComponent(cc.Button).enableAutoGrayEffect = true;
            this.mv_gold.getComponent(cc.Button).interactable = false;
            this.mv_gold.off(cc.Node.EventType.TOUCH_END, this.onMv_gold, this);
        }

           
        //广告
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        wxnodeScript.showBannerAd();
       
    },

    loadGame: function () {
        {
            if(cc.find("Canvas/gameLayout")){
                cc.find("Canvas/gameLayout").destroy();
            }
            // 加载 Prefab
            cc.loader.loadRes("prefab/gameLayout", function (err, prefab) {
                var newNode = cc.instantiate(prefab);
                cc.find("Canvas").addChild(newNode);
                newNode.setPosition(0,60);
            });
        }

        if(g_define.gameConfig.gate>100){
            g_define.gameConfig.gameType = 1;
            this.bushu.getComponent(cc.Label).string = g_define.getDataScript().quickBattleData.step;
        }else if(g_define.gameConfig.gate<=100){
            g_define.gameConfig.gameType = 2;
            this.bushu.getComponent(cc.Label).string = g_define.getDataScript().gateBattleData.step;
        }
        //guanka
        this.guanka.getComponent(cc.Label).string = "第"+g_define.gameConfig.gateLevel%100+"关";
        //bushu
        
        //goldnum
        this.goldnum.getComponent(cc.Label).string =g_define.getDataScript().userInfo.gold;

    },

    updateGameUI:function(){
        console.info("updateGameUI");
        console.info(g_define.getDataScript().userInfo.gold);
        this.goldnum.getComponent(cc.Label).string =g_define.getDataScript().userInfo.gold;
    },
    // update (dt) {

        
        

    // },

    onTishi: function (event) {
        console.info("onTishi");
        if(cc.find("Canvas/gameLayout")){
            cc.find("Canvas/gameLayout").getComponent("gameScript").tip();
        }
       
    },

    onHome: function (event) {
        console.info("onHome");
        var that = this;
        var commonScript=cc.find("wxNode").getComponent("commonData");
        commonScript.sendReduceStep(this.bushu_num,g_define.gameConfig.gameType,function(res){
            console.info(cc.find("Canvas").getComponent("gameuiScript").bushu_num);
            if(res.err==0){
                if( g_define.gameConfig.gameType==1){
                    g_define.getDataScript().quickBattleData.step-= cc.find("Canvas").getComponent("gameuiScript").bushu_num;
                    if(g_define.getDataScript().quickBattleData.step<=0){
                        g_define.getDataScript().quickBattleData.step=0;
                    }
                }else if(g_define.gameConfig.gameType==2){
                    g_define.getDataScript().gateBattleData.step-= cc.find("Canvas").getComponent("gameuiScript").bushu_num;
                    if(g_define.getDataScript().gateBattleData.step<=0){
                        g_define.getDataScript().gateBattleData.step=0;
                    }
                }
                console.info(cc.find("Canvas").getComponent("gameuiScript").bushu_num);
                cc.find("Canvas").getComponent("gameuiScript").bushu_num = 0;
                 cc.director.loadScene("mainScene");
            }
          
        });

        
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        wxnodeScript.hideBannerAd();

    },
    onBack: function (event) {
        console.info("onBack");
        if(cc.find("Canvas/gameLayout")){
            cc.find("Canvas/gameLayout").getComponent("gameScript").removeLastLine();
        }

    },
    onAgain: function (event) {
        console.info("onAgain");

        var that = this;
        var commonScript=cc.find("wxNode").getComponent("commonData");
        commonScript.sendReduceStep(that.bushu_num,g_define.gameConfig.gameType,function(res){
            console.info(cc.find("Canvas").getComponent("gameuiScript").bushu_num);
            if(res.err==0){
                if( g_define.gameConfig.gameType==1){
                    g_define.getDataScript().quickBattleData.step-= cc.find("Canvas").getComponent("gameuiScript").bushu_num;
                }else if(g_define.gameConfig.gameType==2){
                    g_define.getDataScript().gateBattleData.step-= cc.find("Canvas").getComponent("gameuiScript").bushu_num;
                }
                console.info(cc.find("Canvas").getComponent("gameuiScript").bushu_num);
                cc.find("Canvas").getComponent("gameuiScript").bushu_num = 0;

                cc.director.loadScene("gameScene");
                // if(cc.find("Canvas/gameLayout")){
                //     cc.find("Canvas/gameLayout").destroy();
                // }
                // // 加载 Prefab
                // cc.loader.loadRes("prefab/gameLayout", function (err, prefab) {
                //     var newNode = cc.instantiate(prefab);
                //     cc.find("Canvas").addChild(newNode);
                //     newNode.setPosition(0,60);
                // });
    
            }
          
        });


   

    },
    onMv_gold: function (event) {
        console.info("onShare_tip");
        var that = this;
        //看视频加金币
         var wxnodeScript = cc.find("wxNode").getComponent('wxNode');
         let data = {
             action:2,
         }
         this.mv_gold.off(cc.Node.EventType.TOUCH_END, this.onMv_gold, this);
         wxnodeScript.onLookMvAd(data,function(res){
            that.mv_gold.on(cc.Node.EventType.TOUCH_END, that.onMv_gold, that);
             if(res){
                
             }
         });
    },
    onShare_tip: function (event) {
        console.info("onShare_tip");
        //分享免费提示限一次
        var wxnodeScript = cc.find("wxNode").getComponent('wxNode');
        var share_d = g_define.getShareData();
        let shareData = {
            title:share_d.title,
            imageUrl:share_d.img,
            query:``
        }
        wxnodeScript.onShare(shareData,function(res){

            if(cc.find("Canvas/gameLayout")){
                //更新分享次数
                let obj = cc.sys.localStorage.getItem('shareTip');
                console.info(obj);
                if(!obj){
                    cc.sys.localStorage.setItem('shareTip',[]);
                }
                let count = 0;
                let index =obj.length;
                console.info(index);
                while(index--){
                    const element = obj[index];
                    if(element.gameType==g_define.gameConfig.gameType&&element.gameLevel==g_define.gameConfig.gateLevel){
                        count = element.count;
                        obj.splice(element,1);
                    }
                }

                if(count>=1){
                    myToast.show(1.0,"每关只能通过分享获得一次提示！",cc.find("Canvas"));
                }else{
                    console.info(obj);
                    if(res.shareTickets){
                        if(res.shareTickets.length<=0){
                            myToast.show(1.0,"只有分享到群才能获得一次提示！",cc.find("Canvas"));
                            return;
                        }
                        
                        count++;
                        let item = {
                            count:count,
                            gameType:g_define.gameConfig.gameType,
                            gameLevel:g_define.gameConfig.gateLevel
                        }
                        obj.push(item);
                        cc.sys.localStorage.setItem('shareTip',obj);
        
                        cc.find("Canvas/gameLayout").getComponent("gameScript").__tip();
                    }else{
                        myToast.show(1.0,"只有分享到群才能获得一次提示！",cc.find("Canvas"));
                    }
                   
                }
            }

        });

    },

    onAddStep:function(){
        myToast.showPrefab("prefab/getMoreStep",cc.find("Canvas"),cc.v2(0,0),cc.fadeIn(0.02),function(){
            cc.find("Canvas").getChildByName("getMoreStep").getComponent("getMoreStepScript").gametype = g_define.gameConfig.gameType;
        });
    },

    onAddGold:function(){
        myToast.showPrefab("prefab/getGold",cc.find("Canvas"),cc.v2(0,0),null,function(){
            
        });
    }


});
