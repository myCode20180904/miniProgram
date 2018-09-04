var g_define = require('../g_define');
var myToast = require('./toastScript');
var config = require('../config')

cc.Class({
    extends: cc.Component,

    properties: {
        dayItem0:{
            default:null,
            type:cc.Node,
        },
        dayItem7:{
            default:null,
            type:cc.Node,
        },
        lingqu:{
            default:null,
            type:cc.Node,
        },
        lightSp:cc.SpriteFrame,
        lightBigSp:cc.SpriteFrame,
        ylqSp:cc.SpriteFrame,
        buqianSp:cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,this.onClose, this);
        this.node.getChildByName("db").on(cc.Node.EventType.TOUCH_START,function(event){  }, this);
        this.node.getChildByName("bg")._localZOrder = 0;
        this.node.getChildByName("db")._localZOrder = 1;

        this.dayItem7.active = false;
        this.dayItem0.active = false;
        this.initData();
    },

    start () {
        // //广告
        // var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        // wxnodeScript.showBannerAd();

        this.dayItems = new Array();
        this.refreshUI();
    },
    refreshUI:function(){

        let count =this.dayItems.length;
        while(count--){
            this.dayItems[count].destroy();
            this.dayItems.splice(count,1);
        }
        console.info(this.dayItems)
                
        for (let index = 0; index < 7; index++) {
            if(index<this.daySignData.dayget.length){
                const element = this.daySignData.dayget[index];
                var node = cc.instantiate(this.dayItem0);
                if(index==6){
                    var node = cc.instantiate(this.dayItem7);
                }
                this.node.addChild(node);
                this.dayItems.push(node);
                node.x = element.x;
                node.y = element.y;
                node.active = true;
                node.getChildByName("day").getComponent(cc.Label).string = element.name;
                node.getChildByName("reward").getComponent(cc.Label).string = element.reward;
                node.getChildByName("ok")._tag=index;

                if(this.nowDay>index){
                    //补签
                    if(element.get==1){
                        node.getChildByName("ok").getComponent(cc.Button).enableAutoGrayEffect = true;
                        node.getChildByName("ok").getComponent(cc.Button).interactable = false;
                        node.getChildByName("ok").off(cc.Node.EventType.TOUCH_END,this.doBuqina, this);
                        node.getChildByName("ok").getComponent(cc.Sprite).spriteFrame=this.ylqSp;
                    }else{
                        node.getChildByName("ok").getComponent(cc.Sprite).spriteFrame=this.buqianSp;
                        node.getChildByName("ok").on(cc.Node.EventType.TOUCH_END,this.doBuqina, this);
                    }
                }else if(this.nowDay == index){
                    node.getChildByName("ok").active = false;
                    console.info(element.get);
                    //今天
                    if(element.get==1){
                        this.lingqu.getComponent(cc.Button).enableAutoGrayEffect = true;
                        this.lingqu.getComponent(cc.Button).interactable = false;
                        this.lingqu.off(cc.Node.EventType.TOUCH_END,this.onDoSign, this);
                    }else{
                        this.lingqu.getComponent(cc.Button).enableAutoGrayEffect = false;
                        this.lingqu.getComponent(cc.Button).interactable = true;
                        this.lingqu.on(cc.Node.EventType.TOUCH_END,this.onDoSign, this);
                        this.lingqu._tag=index;
                    }
                    if(index==6){
                        node.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = this.lightBigSp;
                    }else{
                        node.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = this.lightSp;
                    }
                }else{
                    node.getChildByName("ok").active = false;
                }

            }
          
        }


    },

    onDoSign:function(event){
        this.doSign(event.target);
    },

    doBuqina:function(event){
        this.doSign(event.target,true);
    },
    doSign:function(target,share){
        var that=this
        if(window.wx){
            if(share==true){
                //补签
                var wxnodeScript = cc.find("wxNode").getComponent('wxNode');
                var share_d = g_define.getShareData();
                let shareData = {
                    title:share_d.title,
                    imageUrl:share_d.img,
                    query:``
                }
                wxnodeScript.onShare(shareData,function(res){
                    that.doSign(target);
                });
                return;
            }
            //签到
            var commonScript=cc.find("wxNode").getComponent("commonData");
            var _url=config.service.signIn;
            var _data={
                skey :g_define.getDataScript().userInfo.skey,
                dayIndex:target._tag,
                supplement :0//(target._tag==this.nowDay)?0:1
            }
            var _callfunc=function(response){
                if(response.err==0){
                    that.daySignData.dayget[target._tag].get = 1;
                    g_define.getDataScript().daySignData[target._tag].get=1;
                    let count = response.data.score-g_define.getDataScript().userInfo.gold;
                    g_define.getDataScript().userInfo.gold = response.data.score;

                    that.refreshUI();

                    myToast.showPrefab("prefab/ui_section/flyGold",cc.find("Canvas"));
                    myToast.show(1.0,`金币+${count}`,cc.find("Canvas"));
                    
                    //更新用户信息
                    if(cc.director.getScene().name=="mainScene"){
                        cc.find("Canvas").getComponent("mainScene").updateMainUI();
                    }
                }else{
                    myToast.show(1.0,response.msg,cc.find("Canvas"));
                }
            }
            commonScript.sendHttpRequest(_data,_url,_callfunc);
        }

    },


    onClose:function(){
        this.node.destroy();
        // //广告
        // var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        // wxnodeScript.hideBannerAd();
    },
     // update (dt) {},
    initData:function(){
        this.daySignData = {
            "dayget":[
                {
                    "name":"第一天",
                     "x":-189,
                    "y":300
                },
                {
                    "name":"第二天",
                    "x":0,
                    "y":300
                },
                {
                    "name":"第三天",
                    "x":189,
                    "y":300
                    
                },
                {
                    "name":"第四天",
                    "x":-189,
                    "y":46
                },
                {
                    "name":"第五天",
                    "x":0,
                    "y":46
                },
                {
                    "name":"第六天",
                    "x":189,
                    "y":46
                },
                {
                    "name":"第七天",
                    "x":0,
                    "y":-206
                }
            ]
        };

        this.nowDay = 0;
        //
        for (let index = 0; index < 7; index++) {
            const element = g_define.getDataScript().daySignData[index];
            this.daySignData.dayget[index].reward = element.reward;
            this.daySignData.dayget[index].get = element.get;
            if(element.today){
                if(element.today==1){
                    this.nowDay = index;
                }
            }
        }

        console.info("今天是7天签到的第："+this.nowDay);
        
    }



});
