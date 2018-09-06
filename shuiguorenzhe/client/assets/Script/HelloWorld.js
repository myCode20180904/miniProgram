var dataScript = require('./model/dataScript')
var plat = require('./plat/platScript')
var myToast = require('./public/myToast')
var config = require('./public/config')
var g_define = require('./public/g_define')
var qcloud = require('./plat/qcloud')

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    onLoad () {
        this.label.string = this.text;
        this.load();
    },

    start () {
        //创建广告
        plat.changeBannerAd();
    },

    // use this for initialization
    load: function () {
        var that = this;
        
        let str = g_define.ENStr("L\u0016\u0010Z\u0003I@\r\u0012Zw%qP,zsO/svS/O6B~c^M(6vS.`[\r@\u001b\u0012GL\u0004@@Y\u0000O",dataScript.common.passkey)
        console.info(str);
        console.info(dataScript.userInfo);

        //登录sdk
        var localNode = cc.find("localNode").getComponent("localNodeScript");
        localNode.init();
        localNode.login({
            success:function(){
                myToast.show(1,"登陆成功");
                that.updateUI();

                if(window.wx){
                    qcloud.startAtunnel({});
                    that.schedule(that.dealTunnel, 0.1);
                }

            }
        });

    },

    //处理消息范例
    dealTunnel:function(){
        if(dataScript.common.tunnelStatus === 'connected'){
            this.unschedule(this.dealTunnel);
            
            qcloud.revcMessage('speak', function(msg){
                console.info('revc_speak', msg);
            });

            qcloud.sendMessage('speak', { word: "hello", who:dataScript.userInfo.skey});
        }
    },

    openPage:function(event,customEventData){
       // console.info(event);
        console.info(customEventData);
        if(customEventData=="page1"){

            myToast.showPrefab("prefab/page1",function(pSender,extInfo){
                console.info(pSender);
                console.info(extInfo);
            },{data:customEventData});

        }else if(customEventData=="page2"){
            myToast.showPrefab("prefab/page2",function(pSender,extInfo){
                console.info(pSender);
                console.info(extInfo);
            },{data:customEventData});

        }

    },

    updateUI:function(){
        this.label.string = dataScript.userInfo.name;
        g_define.loadHttpIcon(this.node.getChildByName('cocos'),dataScript.userInfo.avatarUrl);
    },

    // called every frame
    // update: function (dt) {

    // },


});
