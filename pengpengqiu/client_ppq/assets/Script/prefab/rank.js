var plat = require('../plat/platScript')
var bannerAd = require('../public/bannerAd')
var dataScript = require('../model/dataScript')
var g_define = require('../public/g_define')

cc.Class({
    extends: bannerAd.obj,

    properties: {
        item:{
            default:null,
            type:cc.Node
        },
        scrollView:{
            default:null,
            type:cc.Node
        },
        itembg1:cc.SpriteFrame,
        itembg2:cc.SpriteFrame,
        itembg3:cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        console.info("rank onLoad");
        this._onLoad();

    },
    onDestroy(){
        console.info("rank onDestroy");
        this._onDestroy();
    },

    start () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){ }, this);
        // this.Scroll_View();
        var localNode = cc.find("localNode").getComponent("localNodeScript");
        localNode.show_display();

        // if(this.item){
        //     this.item.active = true;

        //     this.item.getChildByName("name").getComponent(cc.Label).string = dataScript.userInfo.name;
        //     this.item.getChildByName("score").getComponent(cc.Label).string = dataScript.userInfo.score;
        //     let head_self =  this.item.getChildByName("iconMask").getChildByName("head");
        //     g_define.loadHttpIcon(head_self,dataScript.userInfo.avatarUrl,function(){});
        //     // this.item.getChildByName("num").getComponent(cc.Label).string = `NO.${selfinfo.index}`;
        //     this.item.getChildByName("num").active = false;

        // }
        
    },

    Scroll_View:function(){

        //this.scrollView.node.on('scroll-to-top', this.callback, this);
        let row = 0;
        let col = 0;
        this.scrollView.getComponent(cc.ScrollView).content.height = dataScript.common.rank.length*112
        for (let index = 0; index <dataScript.common.rank.length; index++) {
            const element = dataScript.common.rank[index];
            let item = cc.instantiate(this.item);
            this.scrollView.getComponent(cc.ScrollView).content.addChild(item);

            let W = this.scrollView.getComponent(cc.ScrollView).content.width
            let H = this.scrollView.getComponent(cc.ScrollView).content.height
            row = index%1;
            col =parseInt((index)/1);
            item.setPosition(cc.v2(0,-(112/2+col*112)));

            let head =  item.getChildByName("iconMask").getChildByName("head");
            let key = `loadres/role/role${5}`
            head.getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(key);
            item.getChildByName("num").getComponent(cc.Label).string = `NO.${element}`;
            if(index%2==0){
                item.getComponent(cc.Sprite).spriteFrame = this.itembg2;
            }else{
                item.getComponent(cc.Sprite).spriteFrame = this.itembg1;
            }


        }
    },

    menu:function(event,customEventData){
        console.info(customEventData);
        if(customEventData=="back"){
            this.close();
        }else if(customEventData=="share"){

            let shareData = {
                title:"rank",
                imageUrl:'',
                query:``  
            }
            //分享
            plat.onShare(shareData,function(res){
                if(res.shareTickets){
                    if(res.shareTickets.length<=0){
                        myToast.show(1.0,"请分享到群！",cc.find("Canvas"));
                        return;
                    }
                    myToast.show(1.0,"分享成功！",cc.find("Canvas"));
                   
                }else{
                    myToast.show(1.0,"请分享到群！",cc.find("Canvas"));
                }
            });
            
        }
    },

    close:function(){
        this.node.destroy();
        var localNode = cc.find("localNode").getComponent("localNodeScript");
        localNode.hide_display();
    }


});
