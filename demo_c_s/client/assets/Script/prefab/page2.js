var plat = require('../plat/platScript')
var bannerAd = require('../public/bannerAd')

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
        console.info("page2 onLoad");
        this._onLoad();

    },
    onDestroy(){
        console.info("page2 onDestroy");
        this._onDestroy();
    },

    start () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){ this.close()}, this);
        this.node.getChildByName("db").on(cc.Node.EventType.TOUCH_START,function(event){}, this);

        this.TestRequest.on(cc.Node.EventType.TOUCH_START,this.testreq, this);
    },

    // update (dt) {},

    testreq:function(event,customEventData){
        console.info("testreq:");
        var that = this;
        plat.request({
            url:"http://localhost:7457/",
            data:{
                name:"testreq"
            },
            success:function(res){
                console.info(res);
            },
            fail:function(err){

            }
        })
    },

    close:function(){
        this.node.destroy();
    }


});
