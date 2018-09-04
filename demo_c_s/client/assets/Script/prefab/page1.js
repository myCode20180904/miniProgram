var plat = require('../plat/platScript')
var myToast = require('../public/myToast')
var bannerAd = require('../public/bannerAd')
var config = require('../public/config')

cc.Class({
    extends: bannerAd.obj,

    properties: {
        TestRequest: {
            default: null,    
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        console.info("page1 onLoad");
        this._onLoad();

    },
    onDestroy(){
        console.info("page1 onDestroy");
        this._onDestroy();
    },

    start () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){ this.close()}, this);
        this.node.getChildByName("db").on(cc.Node.EventType.TOUCH_START,function(event){}, this);

        // this.TestRequest.on(cc.Node.EventType.TOUCH_END,this.testreq, this);
    },

    // update (dt) {},

    testreq:function(event,customEventData){
        console.info("testreq:");
        myToast.show(1,`登陆成功${Math.random()}`);
        var that = this;
        plat.request({
            url:config.service.apiUrl+"/hello",
            data:{
               name:"testreq"
            },
            success:function(res){

            },
            fail:function(err){
                console.error(err);
            }
        })
    },

    close:function(){
        this.node.destroy();
    }


});
