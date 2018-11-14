const config = require('./public/config')
const myToast = require('./public/myToast')
cc.Class({
    extends: cc.Component,

    properties: {
        logo:{
            default: null,
            type: cc.Node
        },
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        var that = this;
        this.label.string = this.text;

        var localNode = cc.find("localNode").getComponent("localNodeScript");
        localNode.init();
        localNode.loadingView.active = true;
        localNode.loadRes({
            success:function(){
                console.info("资源加载完成。");

                that.updateUI();

                localNode.login({
                    success:function(){
                        // myToast.showMsg('登陆成功',2,function(){
                        //     myToast.showMsg('登陆成功2',3);
                        //     myToast.showMsg('登陆成功3',4);
                        //     myToast.showMsg('登陆成功4',2);
                        // });
                        myToast.showMsg('登陆成功',2);
                        that.refreshData();
                        that.updateUI();
                    },
                    fail:function(){

                    }
                });
            }
        });
    },

    refreshData:function(){

    },
    
    updateUI:function (){
        //this.logo.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("loadres/HelloWorld.png",cc.SpriteFrame);

        let url = config.service.imgUrl+"ball.png";
        this.logo.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.loader.getRes(url,cc.Texture2D));
    },

    // called every frame
    update: function (dt) {

    },
});
