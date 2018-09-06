var g_define = require('../g_define');

cc.Class({
    extends: cc.Component,

    properties: {
        nextBtn:{
            default:null,
            type:cc.Node,
        },
        shareBtn:{
            default:null,
            type:cc.Node,
        },
        backBtn:{
            default:null,
            type:cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.nextBtn.on(cc.Node.EventType.TOUCH_END, this.next, this);

    },

    start () {

    },

    // update (dt) {},

    next: function (event) {
        g_define.gameConfig.gateLevel++;
        cc.find("Canvas/gameLayout").destroy();
        cc.find("nextgate").destroy();

        // 加载 Prefab
        cc.loader.loadRes("prefab/gameLayout", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            cc.find("Canvas").addChild(newNode);
            newNode.setPosition(0,60);
        });

        if(cc.find("Canvas")){
            if(cc.find("Canvas").getComponent("gameuiScript")){
                cc.find("Canvas").getComponent("gameuiScript").guanka.getComponent(cc.Label).string
                = "第"+g_define.gameConfig.gateLevel+"关";

                cc.find("Canvas").getComponent("gameuiScript").bushu.getComponent(cc.Label).string
                = 0;
            }
            
        }
    },
    back: function (event) {
        console.info("back");
        console.info(event);


    },
    share: function (event) {
        console.info("share");
        console.info(event);


    }


});
