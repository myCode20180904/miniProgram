var dataScript = require('./model/dataScript')
var plat = require('./plat/platScript')
var myToast = require('./public/myToast')
var config = require('./public/config')
var g_define = require('./public/g_define')
var qcloud = require('./plat/qcloud')
var downLoader = require('./public/downLoader')

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: '汉仪颜楷W'
    },

    onLoad () {
        this.load();
    },

    start () {
        //创建广告
        plat.changeBannerAd();
    },

    test:function(){
        let str = g_define.ENStr("L\u0016\u0010Z\u0003I@\r\u0012Zw%qP,zsO/svS/O6B~c^M(6vS.`[\r@\u001b\u0012GL\u0004@@Y\u0000O",dataScript.common.passkey)
        console.info(str);
        console.info(dataScript.userInfo);


        this.rotation();

    },
    // use this for initialization
    load: function () {
        var that = this;

        //代码测试
        // this.test();
       
        //获取全局节点
        var localNode = cc.find("localNode").getComponent("localNodeScript");
        localNode.init();
        //加载游戏初始资源
        localNode.loadRes({
            success:function(){
                myToast.show(1,"登陆成功");
                that.updateUI();

                //开始一个信道
                qcloud.start({success:function(){}});
                that.schedule(that.dealTunnel, 0.1);

              
                

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
       var that = this;
        console.info(customEventData);
        if(customEventData=="page1"){
            //
            let task = downLoader.loadUrl({
                url:'Texture/testui/biaoti.png',
                type:'png',
                completeness:function(res){
                    console.log(`下载进度:${res.progress}--(${res.totalBytesWritten}/${res.totalBytesExpectedToWrite})`)
                },
                complete:function(res){
                    console.log('complete:',res.key)
                    that.node.getChildByName("cocos").getComponent(cc.Sprite).spriteFrame = res.spriteFrame;
                },
                fail:function(){

                },
                cancel:function(res){
                    console.log('cancel:',res)
                }
            })

        }else if(customEventData=="page2"){
            myToast.showPrefab("prefab/page2",function(pSender,extInfo){
                console.info(pSender);
                console.info(extInfo);
            },{data:customEventData});

        }

    },

    updateUI:function(){
        // console.info(this.label);
        // this.label.string = dataScript.userInfo.name;
    },


    
    //转向
    rotation:function(node,start_angle,end_angle,speed){
        let dir = cc.v2(0,1);
        let start_dir = Math.atan(start_angle);// tan = y/x
    },

    // called every frame
    update: function (dt) {

    },


});
