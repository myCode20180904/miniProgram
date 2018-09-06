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
        //广告
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        wxnodeScript.showBannerAd();

        this.initGateBattle();
        //
        this.startGameBn.on(cc.Node.EventType.TOUCH_END, this.onStartGame, this);
        
        //
        this.getStep.on(cc.Node.EventType.TOUCH_END, this.onGetStep, this);

    },

    onStartGame: function (event) {
        console.info("onStartGame");
        var commonScript=cc.find("wxNode").getComponent("commonData");
        commonScript.startGame(2);
        
    },
    onGetStep:function(event){
        console.info("onGetStep");
        myToast.showPrefab("prefab/getMoreStep",cc.find("Canvas"),cc.v2(0,0),cc.fadeIn(0.02),function(){
            cc.find("Canvas").getChildByName("getMoreStep").getComponent("getMoreStepScript").gametype = 2;
        });
    },
    onClose:function(){
        this.node.destroy();
        //广告
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        wxnodeScript.hideBannerAd();
    },

    initGateBattle:function(){
        console.info("initGateBattle");
        var commonScript=cc.find("wxNode").getComponent("commonData");
        commonScript.startGameInfo(2);
       
    },


    update (dt) {
        let bushu =  this.node.getChildByName("bushu");
        let allLen =  this.node.getChildByName("bu").width+bushu.width+10;
        bushu.x = -allLen/2+bushu.width/2
        this.node.getChildByName("bu").x =allLen/2-this.node.getChildByName("bu").width/2;
        bushu.getComponent(cc.Label).string =g_define.getDataScript().gateBattleData.step;
         //
         this.node.getChildByName("desc").getComponent(cc.Label).string = `已经获得${g_define.getDataScript().gateBattleData.gate-1}个红包`;
         this.node.getChildByName("label_1").getComponent(cc.Label).string = `总共10关，已过${g_define.getDataScript().gateBattleData.gate-1}关`;
         if(g_define.getDataScript().gateBattleData.pass==1){
             this.node.getChildByName("desc").getComponent(cc.Label).string = `已经获得${10}个红包`;
              this.node.getChildByName("label_1").getComponent(cc.Label).string = `总共10关，已过${10}关`;
         }
         //
         this.node.getChildByName("bushu").getComponent(cc.Label).string =g_define.getDataScript().gateBattleData.step;
     },
    // update (dt) {},

    initData:function(){
        this.data = g_define.getDataScript().gateBattleData;
        console.info(this.data);

    }

});
