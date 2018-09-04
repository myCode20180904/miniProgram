var g_define = require('../g_define');
var myToast = require('./toastScript');
cc.Class({
    extends: cc.Component,

    properties: {
        data:"",
        lookMV:{
            default:null,
            type:cc.Node,
        },
        inviteFriend:{
            default:null,
            type:cc.Node,
        },
        desc:{
            default:null,
            type:cc.Node,
        },
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
        //
        this.lookMV.on(cc.Node.EventType.TOUCH_END,this.onLookMV, this);
        //
        this.inviteFriend.on(cc.Node.EventType.TOUCH_END,this.onInviteFriend, this);
        //
        this.desc.getComponent(cc.RichText).string = `<color=#ffffff>每邀请一位群友点入\n可获得</c>`
        +`<color=#F0537E>${50}金币</color>`;

        //
        console.info(g_define.getDataScript().userInfo.gold);
        if(g_define.getDataScript().userInfo.gold){
            this.node.getChildByName("label").getComponent(cc.Label).string = g_define.getDataScript().userInfo.gold;
        }


        if(!g_define.getDataScript().open.lookMv){
            this.lookMV.getComponent(cc.Button).enableAutoGrayEffect = true;
            this.lookMV.getComponent(cc.Button).interactable = false;
            this.lookMV.off(cc.Node.EventType.TOUCH_END,this.onLookMV, this);
        }
    },

    onLookMV:function(event){
        //看视频+金币
        var that = this;
        var wxnodeScript = cc.find("wxNode").getComponent('wxNode');
         let data = {
             action:2,
         }
         this.lookMV.off(cc.Node.EventType.TOUCH_END,this.onLookMV, this);
         wxnodeScript.onLookMvAd(data,function(res){
            that.lookMV.on(cc.Node.EventType.TOUCH_END,that.onLookMV, that);
             if(res){
                
             }
         });
    },
    onInviteFriend:function(event){
        //获取节点的node脚本组件，并调用脚本里面的函数
        var wxnodeScript = cc.find("wxNode").getComponent('wxNode');
        var share_d = g_define.getShareData();
        let shareData = {
            title:share_d.title,
            imageUrl:share_d.img,
            query:`sharetype=1&sharekey=${g_define.getDataScript().userInfo.skey}`
        }
        wxnodeScript.onShare(shareData);
    },
    onClose:function(){
        if(this.onCloseCall)
        {
            this.onCloseCall();
        }
        this.node.destroy();

    },

    update (dt) {
        let icon =  this.node.getChildByName("goldicon");
        let num = this.node.getChildByName("label");
        
        let allLen =  icon.width+num.width+10;
        icon.x = -allLen/2+icon.width/2
        num.x =allLen/2-num.width/2;
        if(g_define.getDataScript().userInfo.gold){
            num.getComponent(cc.Label).string = g_define.getDataScript().userInfo.gold;
        }
    },
    initData:function(){
        //
        this.data = {
            "gold":50,
            "reward":50
        };
    }

});
