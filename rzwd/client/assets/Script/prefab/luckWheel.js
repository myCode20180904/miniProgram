var plat = require('../plat/platScript')
var bannerAd = require('../public/bannerAd')
var dataScript = require('../model/dataScript')
var myToast = require('../public/myToast')

cc.Class({
    extends: bannerAd.obj,

    properties: {
        runbg:{
            default:null,
            type:cc.Node
        },
        zhizhen:{
            default:null,
            type:cc.Node
        },
        getbn:{
            default:null,
            type:cc.Node
        },
        shanshuo:{
            default:null,
            type:cc.Node
        },
        shareFrame:cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        console.info("help onLoad");
        this._onLoad();

    },
    onDestroy(){
        console.info("help onDestroy");
        this._onDestroy();
    },

    start () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){ }, this);
        this.updateUI();
    },

    updateUI:function(){
        if(dataScript.userInfo.freeLuck<=0){
            this.getbn.getComponent(cc.Sprite).spriteFrame = this.shareFrame;
            this.getbn.getChildByName("label").getComponent(cc.Label).string = "看视频";
            this.getbn.getChildByName("label").color = cc.color(255,255,255);
        }
    },

    menu:function(event,customEventData){
        console.info(customEventData);
        if(customEventData=="back"){
            this.close();
        }else if(customEventData=="getbn"){
            let index  = parseInt(Math.random()*8);
            if(index == 3){
                index = 0;
            }
            if(dataScript.userInfo.freeLuck>0){
                this.startRound(index)
                dataScript.userInfo.freeLuck--;
                cc.sys.localStorage.setItem('freeLuck',dataScript.userInfo.freeLuck);
            }else{
                var that = this;
                if(true){
                    //看视屏
                    plat.createRewardedVideoAd({
                        onLoad:function(){
        
                        },
                        onClose:function(res){
                            if(res){
                                that.startRound(index);
                            }
                        }
                    });
                }else{
                    //分享
                    let randnum = parseInt(Math.random()*3);
                    let shareData = {
                        title:dataScript.common.shareArray[randnum].title,
                        imageUrl:dataScript.common.shareArray[randnum].img,
                        query:``
                    }
                    
                    plat.onShare(shareData,function(res){
                        console.info(res)
                        that.startRound(index)
                    });
                }

                
            }

            this.updateUI();

        }
    },

    startRound:function(index){
        if(index<=0||index>7){
            index = 0;
        }
        let count = 32+index;
        let dt  = 0.04;
        this.zhizhen.rotation = 0;
        this.runbg.rotation = 0;
        var self = this;
        var anim = this.shanshuo.getComponent(cc.Animation);
        anim.play("shanshuo");
        // this.zhizhen.runAction(cc.sequence(cc.rotateBy(dt,-360/16),cc.repeat(cc.rotateBy(dt*2,-360/8),count)));
        this.runbg.runAction(cc.sequence(cc.rotateBy(dt,360/16),cc.repeat(cc.rotateBy(dt*2,360/8),count).easing(cc.easeOut(2)),cc.callFunc(function(){
            console.info("luck round---",index);
            self.getReward(index);
            var anim = this.shanshuo.getComponent(cc.Animation);
            anim.stop("shanshuo");
            anim.setCurrentTime(0,"shanshuo");
        },this)));
    },

    getReward:function(index){
        let str = "恭喜获得："
        if(index==0){
            dataScript.userInfo.jiasuka+=2;
            cc.sys.localStorage.setItem('jiasuka',dataScript.userInfo.jiasuka);
            str+="加速卡x"+2;
        }else if(index==1){
            dataScript.userInfo.baojika+=3;
            cc.sys.localStorage.setItem('baojika',dataScript.userInfo.baojika);
            str+="保级卡x"+3;
        }else if(index==2){
            dataScript.userInfo.fuhuoka+=3;
            cc.sys.localStorage.setItem('fuhuoka',dataScript.userInfo.fuhuoka);
            str+="复活卡x"+3;
        }else if(index==3){
            dataScript.userInfo.baojika+=2;
            cc.sys.localStorage.setItem('baojika',dataScript.userInfo.baojika);
            str+="保级卡x"+2;
        }else if(index==4){
            dataScript.userInfo.fuhuoka+=3;
            cc.sys.localStorage.setItem('fuhuoka',dataScript.userInfo.fuhuoka);
            str+="复活卡x"+3;
        }else if(index==5){
            dataScript.userInfo.jiasuka+=3;
            cc.sys.localStorage.setItem('jiasuka',dataScript.userInfo.jiasuka);
            str+="加速卡x"+3;
            
        }else if(index==6){
            str+="幸运暴击";
            
        }else if(index==7){
            dataScript.userInfo.baojika+=5;
            cc.sys.localStorage.setItem('baojika',dataScript.userInfo.baojika);
            str+="保级卡x"+5;
        }

        myToast.show(2,str);
        if(cc.find("Canvas").getComponent("mainScene")){
            cc.find("Canvas").getComponent("mainScene").updateUI();
        }
       
    },

    close:function(){
        this.node.destroy();
        if(cc.find("Canvas").getComponent("mainScene")){
            cc.find("Canvas").getComponent("mainScene").updateUI();
        }
    }


});
