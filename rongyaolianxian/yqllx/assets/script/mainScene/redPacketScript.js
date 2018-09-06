var g_define = require('../g_define');
var myToast = require('./toastScript');
var config = require('../config')

cc.Class({
    extends: cc.Component,

    properties: {
        closeBn:{
            default:null,
            type:cc.Node
        },
        look:{
            default:null,
            type:cc.Node
        },
        getMoney:{
            default:null,
            type:cc.Node
        },
        ligthTiXian:{
            default:null,
            type:cc.SpriteFrame
        },
        more:{
            default:null,
            type:cc.Node
        },
        kefu:{
            default:null,
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

         //
         this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,this.onClose, this);
         this.node.getChildByName("db").on(cc.Node.EventType.TOUCH_START,function(event){}, this);
         this.node.getChildByName("bg")._localZOrder = 0;
         this.node.getChildByName("db")._localZOrder = 1;
         this.pageView  = this.more.getChildByName("pageView");
         this.node.getChildByName("kefu").active = false;
         this.node.getChildByName("kefu").getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(){
            this.node.getChildByName("kefu").active = false;
        }, this);
    },

    start () {
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        wxnodeScript.showBannerAd();
        //

        this.closeBn.on(cc.Node.EventType.TOUCH_END,this.onClose, this);
        this.look.on(cc.Node.EventType.TOUCH_END,this.onLook, this);

        this.getMoney.getComponent(cc.Button).enabled = false;
        //满5元可提现
        if(g_define.getDataScript().userInfo.money>=g_define.getDataScript().config.txLimite){
            this.getMoney.getComponent(cc.Sprite).spriteFrame = this.ligthTiXian;
            this.getMoney.on(cc.Node.EventType.TOUCH_END,this.onGetMoney, this);
            this.getMoney.getComponent(cc.Button).enabled = true;
        }

        this.node.getChildByName("money").getComponent(cc.Label).string = g_define.getDataScript().userInfo.money;

        var that = this;
        var commonScript=cc.find("wxNode").getComponent("commonData");
        var _url=config.service.host+"/index/api/presentRecord";
        var _data={
            skey :g_define.getDataScript().userInfo.skey,
        }
        var _callfunc=function(response){
            if(response.err==0){
               g_define.getDataScript().txRecode = response.data;
               for (let index = 0; index < g_define.getDataScript().txRecode.length; index++) {
                   const element =  g_define.getDataScript().txRecode[index];
                   if(element.name){

                   }else{
                        element.name = "现金红包";
                   }
               }
                that.node.getChildByName("money").getComponent(cc.Label).string = g_define.getDataScript().userInfo.money;
            }
        }
        this.netTask=commonScript.sendHttpRequest(_data,_url,_callfunc);
    },
    //提现逻辑
    onGetMoney:function(){
        this.node.getChildByName("kefu").active = true;
        this.kefu.on(cc.Node.EventType.TOUCH_END,function(){
            wx.openCustomerServiceConversation({
                // sessionFrom:"",
                // showMessageCard:true,
                // sendMessageTitle:'',	//否	会话内消息卡片标题	
                // sendMessagePath:'',	//否	会话内消息卡片路径	
                // sendMessageImg:'',	//否	会话内消息卡片图片路径

            });
        }, this);
    },

    onLook:function(){
        this.more.active = true;
        this.initMore();
    },
    initMore:function(){
        console.info(g_define.getDataScript().txRecode);

        this.more.getChildByName("db").on(cc.Node.EventType.TOUCH_END,function(event){}, this);
        this.more.getChildByName("close").on(cc.Node.EventType.TOUCH_END,function(event){
            this.more.active = false;
        }, this);

        this.more.getChildByName("back").on(cc.Node.EventType.TOUCH_END,this.onBack, this);
        this.more.getChildByName("next").on(cc.Node.EventType.TOUCH_END,this.onNext, this);
        this.curPage = 0;

        // view
        this.maxPage = this.pageView.getComponent(cc.PageView).getPages().length;

        if(g_define.getDataScript().txRecode.length<=0){
            this.more.getChildByName("notip").active = true;
            
            return;
        }
        //增加页数
        if(parseInt((g_define.getDataScript().txRecode.length-1)/5+1)>this.maxPage){
            for (let index = 0; index <parseInt((g_define.getDataScript().txRecode.length-1)/5+1)-this.maxPage ; index++) {
                let newPage = cc.instantiate(this.pageView.getComponent(cc.PageView).getPages()[0]);
                this.pageView.getComponent(cc.PageView).addPage(newPage);
            }
        }
        this.maxPage = this.pageView.getComponent(cc.PageView).getPages().length;
        this.pageView.getComponent(cc.PageView).setCurrentPageIndex(this.curPage);

        for (let index = 0; index < g_define.getDataScript().txRecode.length; index++) {
            let s_index = g_define.getDataScript().txRecode.length-1-index;
            const element = g_define.getDataScript().txRecode[s_index];
            
            if(parseInt(index/5)<this.maxPage){
                var node = cc.instantiate(this.more.getChildByName("item"));
                node.parent =  this.pageView.getComponent(cc.PageView).getPages()[parseInt(index/5)];
                node.active = true;
                node.x = 0;
                node.y = 200-(index%5)*100;

                node.getChildByName("name").getComponent(cc.Label).string = element.name;
                node.getChildByName("time").getComponent(cc.Label).string = element.created_at;
                node.getChildByName("money").getComponent(cc.Label).string = element.reward;

            }
        }

    },

    onBack:function(event){
        this.curPage--;
        if(this.curPage<=0){
            this.curPage = 0;
        }
        this.pageView.getComponent(cc.PageView).scrollToPage(this.curPage,0.2);
    },
    onNext:function(event){
        this.curPage++;
        if(this.curPage>=this.maxPage){
            this.curPage=this.maxPage-1;
        }
        this.pageView.getComponent(cc.PageView).scrollToPage(this.curPage,0.2);
    },

    onClose:function(){
        this.node.destroy();
        if(this.netTask){
            this.netTask.abort();//取消网络请求
        }
        var wxnodeScript =  cc.find("wxNode").getComponent('wxNode');
        wxnodeScript.hideBannerAd();
    },




});
