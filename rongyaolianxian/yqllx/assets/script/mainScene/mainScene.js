
var g_define = require('../g_define');
var config = require('../config')
var myToast = require('./toastScript');
cc.Class({
    extends: cc.Component,

    properties: {
        startGameBn:{
            default:null,
            type:cc.Node,
        },
        shareBn:{
            default:null,
            type:cc.Node,
        },
        daySign:{
            default:null,
            type:cc.Node,
        },
        moneyRed:{
            default:null,
            type:cc.Node,
        },
        getGold:{
            default:null,
            type:cc.Node,
        }
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.info("mainSceneLoad");
        //
        this.startGameBn.on(cc.Node.EventType.TOUCH_END, this.onQuickBattle, this);

        //
        this.daySign.on(cc.Node.EventType.TOUCH_END, this.onDaySign, this);
        //
        this.shareBn.on(cc.Node.EventType.TOUCH_END, this.onShare, this);
         //闯关赢红包
         this.moneyRed.on(cc.Node.EventType.TOUCH_END, this.onPassGetMoney, this);

         //
         this.getGold.on(cc.Node.EventType.TOUCH_END, this.onGetGold, this);
         this.getGold.active = true;


        //addGold加金币
        this.node.getChildByName("gold").on(cc.Node.EventType.TOUCH_END, this.onGetGold, this);
        //addMoney提现
        this.node.getChildByName("redMoney").on(cc.Node.EventType.TOUCH_END, this.onTiMoney, this);
        //
       // this.addMessageMove();

        // this.schedule(function(){
        //     myToast.showPrefab("prefab/ui_section/flyGold",cc.find("Canvas"),cc.v2(0,0),null,function(){
        //         cc.find("Canvas").getChildByName("flyGold").getComponent("flyGold").setFrame("hongbao");
        //     });
        // },3)

    },
    shake:function(node){
        let actionArr= new Array();
        let rate =20;
        let dt = 0.02;
        for (let index = 0; index < 10; index++) {
            let rota = cc.sequence(cc.rotateBy(dt,-rate),cc.rotateBy(dt*2,rate*2),cc.rotateBy(dt,-rate));
            //rota.easing(cc.easeQuadraticActionOut());
            actionArr.push(rota);
            rate = rate/2;
            dt = dt/2;
        }

        actionArr.push(cc.sequence(cc.delayTime(2),cc.callFunc(function(){
            this.shake(node)
        },this)));

        node.runAction(cc.sequence(actionArr).easing(cc.easeQuadraticActionIn()));
    },

    start () {

        this.schedule(this.checkLogin, 0.02);

    },
    checkLogin:function(){
        //获取节点的node脚本组件，并调用脚本里面的函数
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        if(wxnodeScript.islogin){
            this.unschedule(this.checkLogin);

            this.initMainUI();
        }
    },
    initMainUI:function(){
        if(g_define.getDataScript.firstCome){
            console.info("欢迎新用户");
            cc.sys.localStorage.setItem('shareTip',[]);
        }
        //else
        {
            var that = this;
            //弹新手红包
            if(g_define.getDataScript().userInfo.hasNewerRedPacket){
                g_define.getDataScript().userInfo.hasNewerRedPacket = 0;
                myToast.showPrefab("prefab/newPlayerRed",cc.find("Canvas"),cc.v2(0,0),null,function(){

                    cc.find("Canvas").getChildByName("newPlayerRed").getComponent("newPlayerRed").onCloseCall =function(){
                       //弹签到
                        if(!g_define.getDataScript().hasPopDaySign){
                            g_define.getDataScript().hasPopDaySign = true;
                            that.popDaySign(1);
                        }
                    };

                });
            }else{
                  //弹签到
                  if(!g_define.getDataScript().hasPopDaySign){
                    g_define.getDataScript().hasPopDaySign = true;
                    that.popDaySign(0);
                }
            }
            
        }

        this.updateMainUI();

        // if(g_define.getDataScript().longScene){
        //     console.log("长屏幕");
        //     this.daySign.y = 560;
        //     this.getGold.y = 560;
        // }

        //adnode
        var ads_data = (g_define.getDataScript().config.ads);
        console.info(ads_data)
        if(ads_data.length>=4)
        {
            var imgurl0 = config.service.game_img+"/"+ads_data[0][0];
            var imgurl1 = config.service.game_img+"/"+ads_data[1][0];
            console.info(imgurl1)
            var imgurl2 = config.service.game_img+"/"+ads_data[2][0];
            var imgurl3 = config.service.game_img+"/"+ads_data[3][0];

            var adNode = this.node.getChildByName("adNode")
            var wxnodeScript = cc.find("wxNode").getComponent('wxNode');
            g_define.loadHttpIcon(adNode.getChildByName("ad1"),imgurl0,function(){});
            g_define.loadHttpIcon(adNode.getChildByName("ad2"),imgurl1,function(){});
            g_define.loadHttpIcon(adNode.getChildByName("ad3"),imgurl2,function(){});
            g_define.loadHttpIcon(adNode.getChildByName("ad_2048"),imgurl3,function(){});

            adNode.getChildByName("ad1").on(cc.Node.EventType.TOUCH_END,function(event){
                wxnodeScript.onJumpOther(ads_data[0][1],0);
            }, this);

            adNode.getChildByName("ad2").on(cc.Node.EventType.TOUCH_END,function(event){
                wxnodeScript.onJumpOther(ads_data[1][1],0);
            }, this);

            adNode.getChildByName("ad3").on(cc.Node.EventType.TOUCH_END,function(event){
                wxnodeScript.onJumpOther(ads_data[2][1],0);
            }, this);

            adNode.getChildByName("ad_2048").on(cc.Node.EventType.TOUCH_END,function(event){
                wxnodeScript.onJumpOther(ads_data[3][1],0);
            }, this);
             this.shake(adNode.getChildByName("ad_2048"));


        }

    },
    updateMainUI:function(){
        //gold
        this.node.getChildByName("gold").getChildByName("num").getComponent(cc.Label).string = 
        g_define.getDataScript().userInfo.gold;
        //redMoney  
        this.node.getChildByName("redMoney").getChildByName("num").getComponent(cc.Label).string = 
        g_define.getDataScript().userInfo.money;
        //center
        this.node.getChildByName("center").getChildByName("time").getComponent(cc.Label).string = 
        g_define.getDataScript().config.quickBattleTime;
    },
    popDaySign:function(dt){
        

        var that = this;
        that.scheduleOnce(function(dt){
            that.nowDay = 0;
            //
            for (let index = 0; index < 7; index++) {
                const element = g_define.getDataScript().daySignData[index];
                if(element.today){
                    if(element.today==1)
                    that.nowDay = index;
                }
            }
            if(g_define.getDataScript().daySignData[that.nowDay].get!=1){
                myToast.showPrefab("prefab/daySignUI",cc.find("Canvas"));
            }
    
        }, 0.5);
       
    },

    onQuickBattle:function(event){
        console.info("onQuickBattle");
        // this.onStartGame();
        // return;
        
        myToast.showPrefab("prefab/quickBattle",cc.find("Canvas"));
    },

    onStartGame: function (event) {
        console.info("onStartGame");
        g_define.gameConfig.gateLevel=1;
        cc.director.loadScene("gameScene");
        
    },
    onDaySign:function(event){
        console.info("onDaySign");
        myToast.showPrefab("prefab/daySignUI",cc.find("Canvas"));
    },
    onPassGetMoney:function(event){
        console.info("onPassGetMoney");
        myToast.showPrefab("prefab/gateBattle",cc.find("Canvas"));
    },
    onGetGold:function(event){
        console.info("onGetGold");
        myToast.showPrefab("prefab/getGold",cc.find("Canvas"),cc.v2(0,0),null,function(){
                    //广告
            var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
            wxnodeScript.showBannerAd();
            cc.find("Canvas").getChildByName("getGold").getComponent("getGoldScript").onCloseCall =function(){
                wxnodeScript.hideBannerAd();
            };
        });
    },
    onTiMoney:function(event){
        console.info("onTiMoney");
        myToast.showPrefab("prefab/redPacket",cc.find("Canvas"));
    },
    onShare:function(){
        //获取常驻节点
        var wxnode = cc.find("wxNode");
        //获取节点的node脚本组件，并调用脚本里面的函数
        var wxnodeScript = wxnode.getComponent('wxNode');
        var share_d = g_define.getShareData();
        let shareData = {
            title:share_d.title,
            imageUrl:share_d.img,
            query:``  
        }
        wxnodeScript.onShare(shareData);
    },

    addMessageMove:function(){
        myToast.showPrefab("prefab/ui_section/megNode",cc.find("Canvas"));
    }
    // update (dt) {},
});
