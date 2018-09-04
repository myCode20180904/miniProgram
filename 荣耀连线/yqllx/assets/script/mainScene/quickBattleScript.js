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
        act_tip:{
            default:null,
            type:cc.Node,
        },
        rLabel:{
            default:null,
            type:cc.Node,
        },
        data:""
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.initData();
         //
         this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,this.onClose, this);
         this.node.getChildByName("db").on(cc.Node.EventType.TOUCH_START,function(event){  }, this);
         this.node.getChildByName("bg")._localZOrder = 0;
         this.node.getChildByName("db")._localZOrder = 1;
    },

    start () {
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        wxnodeScript.showBannerAd();
        this.initQuickBattle();
        //
        this.startGameBn.on(cc.Node.EventType.TOUCH_END, this.onStartGame, this);
        
        //
        this.getStep.on(cc.Node.EventType.TOUCH_END, this.onGetStep, this);

        //
        this.act_tip.on(cc.Node.EventType.TOUCH_END, this.onAct_Tip, this);
    },

    onStartGame: function (event) {
        console.info("onStartGame");

        var commonScript=cc.find("wxNode").getComponent("commonData");
        commonScript.startGame(1);

    },
    onGetStep:function(event){
        console.info("onGetStep");
        myToast.showPrefab("prefab/getMoreStep",cc.find("Canvas"),cc.v2(0,0),cc.fadeIn(0.02),function(){
            cc.find("Canvas").getChildByName("getMoreStep").getComponent("getMoreStepScript").gametype = 1;
        });
    },
    onAct_Tip:function(event){
        console.info("onAct_Tip");
        myToast.showPrefab("prefab/activityTip",cc.find("Canvas"));
    },
    onClose:function(){
        this.node.destroy();
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        wxnodeScript.hideBannerAd();
    },

    initQuickBattle:function(){
        //活动时间
        //this.node.getChildByName("timelb").getComponent(cc.Label).string = "活动时间："+g_define.getDataScript().config.quickBattleTime;
        //
        var commonScript=cc.find("wxNode").getComponent("commonData");
        commonScript.startGameInfo(1);

        let bushu =  this.node.getChildByName("bushu");
        bushu.getComponent(cc.Label).string =this.data.step;

       

        //
        this.rLabel.getComponent(cc.RichText).string = `<color=#F1840D>目前</c><color=#ffff00>`
        +`${g_define.getDataScript().config.quickBattleNum}</c><color=#F1840D>人参与瓜分</c><color=#ffff00>`+
        `${g_define.getDataScript().config.quickBattleReward}</c><color=#F1840D>元大奖</c>`;



        //宝箱进度条
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

         //
         this.node.getChildByName("rlabel1").getComponent(cc.RichText).string = `<color=#ffffff>共</c><color=#f0537e>50</c>`
         +`<color=#ffffff>关  完成</c><color=#f0537e>${this.data.gate}</c><color=#ffffff>关</c>`;

        // this.node.getChildByName("process").getComponent(cc.ProgressBar).progress = ((this.data.gate)%30)/30;
        // if(this.data.gate>=30){
        //     this.node.getChildByName("process").getComponent(cc.ProgressBar).progress = ((this.data.gate+10)%30)/30;
        // }
    },

    initData:function(){
        this.data = g_define.getDataScript().quickBattleData;
    }

});
