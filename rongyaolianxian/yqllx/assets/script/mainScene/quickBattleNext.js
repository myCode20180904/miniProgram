var g_define = require('../g_define');
var myToast = require('./toastScript');
var config = require('../config')

cc.Class({
    extends: cc.Component,

    properties: {
        startGameBn:{
            default:null,
            type:cc.Node,
        },
        getStep:{
            default:null,
            type:cc.Node,
        },
        home:{
            default:null,
            type:cc.Node,
        },
        rLabel:{
            default:null,
            type:cc.Node,
        },
        //炫耀
        shareFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        data:""
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.initData();
       

    },

    start () {
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        wxnodeScript.showBannerAd();
         //
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_END,function(event){  }, this);
        this.node.getChildByName("db").on(cc.Node.EventType.TOUCH_START,function(event){  }, this);
        this.node.getChildByName("bg")._localZOrder = 0;
        this.node.getChildByName("db")._localZOrder = 1;


        this.initQuickBattle();
        // if((this.data.gate-1)%5==0){
        //     this.jiangliStep(this.data.gate);
        // }
        
        //
        this.getStep.on(cc.Node.EventType.TOUCH_END, this.onGetStep, this);

        this.home.on(cc.Node.EventType.TOUCH_END, function(){
            this.onClose();
            cc.director.loadScene("mainScene");
        }, this);
      
        let obj = cc.sys.localStorage.getItem('shareReward');
        if(obj){
            if(obj.gate==this.data.gate){
                
            }else{
                cc.sys.localStorage.setItem('shareReward',{gate:this.data.gate,shareReward:1});
            }
        }else{
            cc.sys.localStorage.setItem('shareReward',{gate:this.data.gate,shareReward:1});
        }
        console.info(cc.sys.localStorage.getItem('shareReward'));
       

    },

    onStartGame: function (event) {
        console.info("onStartGame");
        // var commonScript=cc.find("wxNode").getComponent("commonData");
        // commonScript.startGame(1);
        cc.director.loadScene("gameScene");

    },
    onGetStep:function(event){
        console.info("onGetStep");
        var self = this;
        let data ={
            overStep:this.overStep,
            gametype:this.gametype
        }
        console.info(this.overStep);
        myToast.showPrefab("prefab/getMoreStep",self.node,cc.v2(0,0),cc.fadeIn(0.02),function(res){
            self.node.getChildByName("getMoreStep").getComponent("getMoreStepScript").gametype = 1;
            self.node.getChildByName("getMoreStep").getComponent("getMoreStepScript").overStep = res.overStep;
            console.info("res"+res.overStep);
            console.info("res"+self.overStep);
        },20,data);
        
    },
    onShare:function(event){
        var self = this;
        //获取节点的node脚本组件，并调用脚本里面的函数
        var wxnodeScript = cc.find("wxNode").getComponent('wxNode');
        var share_d = g_define.getShareData();
        let shareData = {
            title:share_d.title,
            imageUrl:share_d.img,
            query:``  
        }
        wxnodeScript.onShare(shareData,function(res){
            if(self.overStep){
                if(self.overStep==1){
                    //cc.director.loadScene("mainScene");\
                    let obj = cc.sys.localStorage.getItem('shareReward');
                    console.info(obj);
                    if(obj.shareReward==1){
                        cc.sys.localStorage.setItem('shareReward',{gate:self.data.gate,shareReward:0});
                        
                        var commonScript=cc.find("wxNode").getComponent("commonData");
                        var _callfunc=function(response){
                            console.info(response);
                            if(response.err==0){
                                if(response.score>=0){
                                    myToast.showPrefab("prefab/ui_section/flyGold",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2),null,function(){
                                    },100);
                                    myToast.show(1.0,"金币+50",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2));
                                    
                                    g_define.getDataScript().userInfo.gold = response.score;
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
                  
                }
            }
        });

        
    },
    jiangliStep:function(gate){
        var self = this;
        myToast.showPrefab("prefab/jiangLiStep",self.node,cc.v2(0,0),null,function(){
            self.node.getChildByName("jiangLiStep").getComponent("jiangLiStep").gate = gate;
         },3);
    },
    onClose:function(){
        this.node.destroy();
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        wxnodeScript.hideBannerAd();
    },

    initQuickBattle:function(){
        
        this.node.getChildByName("sybs").getComponent(cc.Label).string =`第${this.data.gate-1}关`;
        this.startGameBn.on(cc.Node.EventType.TOUCH_END, this.onStartGame, this);
        //没有步数
        if(this.overStep){
            if(this.overStep==1){
                this.startGameBn.getComponent(cc.Sprite).spriteFrame=this.shareFrame;
                this.startGameBn.off(cc.Node.EventType.TOUCH_END, this.onStartGame, this);
                this.startGameBn.on(cc.Node.EventType.TOUCH_END, this.onShare, this);

                let seq = cc.repeatForever(cc.sequence(cc.scaleTo(0.5,1.1),cc.scaleTo(0.5,1.0)));
                this.getStep.runAction(seq);

                this.node.getChildByName("sybs").getComponent(cc.Label).string =`第${this.data.gate}关`;
            }    
        }

        
        let bushu =  this.node.getChildByName("bushu");
        bushu.getComponent(cc.Label).string =this.data.step;
        //
        this.rLabel.getComponent(cc.RichText).string = `<color=#F1840D>目前</c><color=#ffff00>`
        +`${g_define.getDataScript().config.quickBattleNum}</c><color=#F1840D>人参与瓜分</c><color=#ffff00>`+
        `${g_define.getDataScript().config.quickBattleReward}</c><color=#F1840D>元大奖</c>`;

        // let step1 = 10;
        // if(this.data.gate>=30){
        //     step1=30;
        // }
        // //
        // this.node.getChildByName("step1").getChildByName("label").getComponent(cc.Label).string = `第${step1}关`;
        // this.node.getChildByName("step2").getChildByName("label").getComponent(cc.Label).string = `第${step1+10}关`;
        // this.node.getChildByName("step3").getChildByName("label").getComponent(cc.Label).string = `第${step1+20}关`;

        // //
        // this.node.getChildByName("process").getComponent(cc.ProgressBar).progress = ((this.data.gate)%30)/30;
        // if(this.data.gate>=30){
        //     this.node.getChildByName("process").getComponent(cc.ProgressBar).progress = ((this.data.gate+10)%30)/30;
        // }

    },


     update (dt) {
        let bushu =  this.node.getChildByName("bushu");
        let allLen =  this.node.getChildByName("bu").width+bushu.width+10;
        bushu.x = -allLen/2+bushu.width/2
        this.node.getChildByName("bu").x =allLen/2-this.node.getChildByName("bu").width/2;
        bushu.getComponent(cc.Label).string =g_define.getDataScript().quickBattleData.step;
     },

    initData:function(){
        this.data = g_define.getDataScript().quickBattleData;
    }

});
