var g_define = require('../g_define');
var myToast = require('./toastScript');
var config = require('../config')
cc.Class({
    extends: cc.Component,

    properties: {
        data:"",
        back:{
            default:null,
            type:cc.Node,
        },
        next:{
            default:null,
            type:cc.Node,
        },
        back:{
            default:null,
            type:cc.Node,
        },
        inviteFriend:{
            default:null,
            type:cc.Node,
        },
        desc2:{
            default:null,
            type:cc.Node,
        },
        pageView:{
            default:null,
            type:cc.Node,
        },
        item:{
            default:null,
            type:cc.Node,
        },

        //已领取灰
        ylq_h: {
            default: null,
            type: cc.SpriteFrame
        }, 
        //领取亮
        lq_l: {
            default: null,
            type: cc.SpriteFrame
        },


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initData();
        console.info(this.data);
        //
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,this.onClose, this);
        this.node.getChildByName("db").on(cc.Node.EventType.TOUCH_START,function(event){  }, this);
        this.node.getChildByName("bg")._localZOrder = 0;
        this.node.getChildByName("db")._localZOrder = 1;

    },

    start () {
        //
        this.back.on(cc.Node.EventType.TOUCH_END,this.onBack, this);
        //
        this.next.on(cc.Node.EventType.TOUCH_END,this.onNext, this);
        //
        this.inviteFriend.on(cc.Node.EventType.TOUCH_END,this.onInviteFriend, this);
        //
        this.pageView.on('page-turning',this.onPageView, this);

       // http://192.168.24.89/index.php/index/api/getFriendList
       var that = this;
       var commonScript=cc.find("wxNode").getComponent("commonData");
       var _url=config.service.host+"/index/api/getFriendList";
       var _data={
           skey :g_define.getDataScript().userInfo.skey,
       }
       var _callfunc=function(response){
           console.info(response);
           if(response.err==0){
                g_define.getDataScript().getMoreStepData.inviteFriends = response.data;
                that.inviteFriendCount = response.count;
                that.initData();
                that.initGetMoreStep();
           }
       }
       commonScript.sendHttpRequest(_data,_url,_callfunc);

    },

    initGetMoreStep:function(){
        console.info("initGetMoreStep");
        var self = this;

        let count = 0;
        self.curPage = 0;
        self.maxPage = self.pageView.getComponent(cc.PageView).getPages().length;

        //增加页数
        if(parseInt((self.data.inviteFriends.length-1)/6+1)>self.maxPage){
            for (let index = 0; index <parseInt((self.data.inviteFriends.length-1)/6+1)-self.maxPage ; index++) {
                let newPage = cc.instantiate(self.pageView.getComponent(cc.PageView).getPages()[0]);
                self.pageView.getComponent(cc.PageView).addPage(newPage);
            }
        }
        self.maxPage = self.pageView.getComponent(cc.PageView).getPages().length;
        //self.pageView.getComponent(cc.PageView).getPages()[parseInt(index/6)].removeAllChildren();

        console.info(""+ self.maxPage+"----"+self.data.inviteFriends.length);
        for (let index = 0; index < self.data.inviteFriends.length; index++) {
            if(parseInt(index/6)<self.maxPage){
                const element = self.data.inviteFriends[index];
                var node = cc.instantiate(self.item);
                node.parent =  self.pageView.getComponent(cc.PageView).getPages()[parseInt(index/6)];
                node.active = true;
                node.getChildByName("ok").getComponent(cc.Button).enabled = false;

                if(element.avatarurl){
                    let headmask = node.getChildByName("headmask");
                    g_define.loadHttpIcon(headmask.getChildByName("head"),element.avatarurl,function(){});
                }
                node.getChildByName("label").getComponent(cc.Label).string = `步数+${element.reward}`;

                if(element.friend_id){   
                    node.getChildByName("ok").getComponent(cc.Sprite).spriteFrame=self.lq_l;
                    node.getChildByName("ok").getComponent(cc.Button).enabled = true;
                    node.getChildByName("ok").getComponent(cc.Button).friend_id = element.friend_id;
                    node.getChildByName("ok").getComponent(cc.Button).reward = element.reward;
                    //领取
                    node.getChildByName("ok").on(cc.Node.EventType.TOUCH_END,self.onLingQu, self);
                    count++;
                }

                if(element.get){
                    if(element.get==1){
                        node.getChildByName("ok").getComponent(cc.Sprite).spriteFrame=self.ylq_h;
                        node.getChildByName("ok").getComponent(cc.Button).enabled = false;
                    }

                }


                let arr = [cc.v2(-160,149),cc.v2(0,149),cc.v2(160,149),cc.v2(-160,-65),cc.v2(0,-65),cc.v2(160,-65)];
                node.x = arr[index%6].x;
                node.y = arr[index%6].y;

            }
            

        }

        this.desc2.getComponent(cc.RichText).string = `<color=#ffffff>本次活动已邀请</c>`+
        `<color=#f0537e>${this.inviteFriendCount}</c><color=#ffffff>人</c>`;

        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            self.pageView.getComponent(cc.PageView).setCurrentPageIndex(0);
        }, 0.02);

        self.refreshUI();

    },
    refreshUI:function(){
        if(this.maxPage<=1){
            this.back.active = false;
            this.next.active = false;
            return
        }
        if(this.curPage==0){
            this.back.active = false;
        }
        else if(this.curPage == this.maxPage-1){
            this.next.active = false;
        }else{
            this.back.active = true;
            this.next.active = true;
        }
    },

    onBack:function(event){
        this.curPage--;
        if(this.curPage<=0){
            this.curPage = 0;
        }
        this.pageView.getComponent(cc.PageView).scrollToPage(this.curPage,0.2);
        this.refreshUI();
    },
    onNext:function(event){
        this.curPage++;
        if(this.curPage>=this.maxPage-1){
            this.curPage=this.maxPage-1;
        }
        this.pageView.getComponent(cc.PageView).scrollToPage(this.curPage,0.2);
        this.refreshUI();
    },
    onInviteFriend:function(event){
        var wxnodeScript = cc.find("wxNode").getComponent('wxNode');
        var share_d = g_define.getShareData();
        let shareData = {
            title:share_d.title,
            imageUrl:share_d.img,
            query:`sharetype=2&sharekey=${g_define.getDataScript().userInfo.skey}`
        }
        wxnodeScript.onShare(shareData,function(res){
            
        });
    },
    onPageView:function(event){
        let pageView = event.detail;
        this.curPage = this.pageView.getComponent(cc.PageView).getCurrentPageIndex();
        this.refreshUI();
    },
    onLingQu:function(event){
        event.target.getComponent(cc.Sprite).spriteFrame=this.ylq_h;
        event.target.getComponent(cc.Button).enabled = false;
        event.target.off(cc.Node.EventType.TOUCH_END,this.onLingQu, this);
        if(this.gametype==1){
            //http://192.168.24.89/index.php/index/api/getRewardStep
            console.info("连线赢现金");
        }else if(this.gametype==2){
            console.info("挑战关卡");
        }

        var that = this;
        var commonScript=cc.find("wxNode").getComponent("commonData");
        var _url=config.service.host+"/index/api/getRewardStep";
        var _data={
            skey:g_define.getDataScript().userInfo.skey,
            type:that.gametype,
            friendId:event.target.getComponent(cc.Button).friend_id,
            reward:event.target.getComponent(cc.Button).reward
        }
        var _callfunc=function(response){
            console.info(response);
            if(response.err==0){
                    if(that.gametype==1){
                        g_define.getDataScript().quickBattleData.step+=response.reward;
                    } else if(that.gametype==2){
                        g_define.getDataScript().gateBattleData.step+=response.reward;
                    }
            }else{
                if(response.err==1){
                    myToast.show(1.0,response.msg,cc.find("Canvas"));
                }
            }
        }
        commonScript.sendHttpRequest(_data,_url,_callfunc);
    },
    onClose:function(){
        console.info("onClose:overStep:"+this.overStep);
        // if(this.overStep){
        //     if(this.overStep==1){
        //         cc.director.loadScene("mainScene");
        //     }
        // }
        this.node.destroy();

    },

    initData:function(){
        this.data = g_define.getDataScript().getMoreStepData;
    },
    // update (dt) {

    // }



});
