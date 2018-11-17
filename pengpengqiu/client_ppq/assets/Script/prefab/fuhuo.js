var dataScript = require('../model/dataScript')
var plat = require('../plat/platScript')
var myToast = require('../public/myToast')

cc.Class({
    extends: cc.Component,

    properties: {
        score_num:{
            default:null,
            type:cc.Node
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){}, this);
        
    },

    start () {
        this.score_num.getComponent(cc.Label).string = `历史:${dataScript.userInfo.score}\n得分:${this.score}`;

        this.node.getChildByName("menu").getChildByName("djbj").active = true;
        let fuhuo_lb = this.node.getChildByName("menu").getChildByName("djbj").getChildByName("num")
        fuhuo_lb.getComponent(cc.Label).string = `x${dataScript.userInfo.fuhuoka}`

        if(dataScript.userInfo.fuhuoka<=0){
            this.node.getChildByName("menu").getChildByName("djbj").active = false;
            this.node.getChildByName("menu").getChildByName("mffh").active = true;
        }else{
            this.node.getChildByName("menu").getChildByName("djbj").active = true;
            this.node.getChildByName("menu").getChildByName("mffh").active = false;
        }
    },

    close:function(){
        this.node.destroy();
    },

    //菜单
    menu:function(event,customEventData){
        // console.info(event);
        console.info(customEventData);
        if(customEventData=="back"){
             //失败结算
             myToast.showPrefab("prefab/end_game",function(pSender,extInfo){
                console.info("======",extInfo.data.win_loss,extInfo.data.killed, extInfo.data.rank,extInfo.data.score);
                pSender.getComponent("end_game").killed = extInfo.data.killed
                pSender.getComponent("end_game").rank = extInfo.data.rank;
                pSender.getComponent("end_game").score = extInfo.data.score;
                pSender.getComponent("end_game").win_loss = extInfo.data.win_loss;
            },{data:this});

            this.close();
            
        }else if(customEventData=="fuhuo"){
            
            if(cc.find("Canvas").getComponent("gameScene")){
                dataScript.userInfo.fuhuoka--;
                if(dataScript.userInfo.fuhuoka>=0){
                    cc.sys.localStorage.setItem('fuhuoka',dataScript.userInfo.fuhuoka);
                    cc.find("Canvas").getComponent("gameScene").fuhuo();
                   
                }else{

                }
                
            }
            this.close();
        }else if(customEventData=="share1"){
            //
            let randnum = parseInt(Math.random()*3);
            let shareData = {
                title:dataScript.common.shareArray[randnum].title,
                imageUrl:dataScript.common.shareArray[randnum].img,
                query:``
            }
            let self = this;
            plat.onShare(shareData,function(res){
                console.info(res)
                if(cc.find("Canvas").getComponent("gameScene")){
                    cc.find("Canvas").getComponent("gameScene").fuhuo();
                }

                cc.find("Canvas").getChildByName("fuhuo").getComponent("fuhuo").close();

            });
    
        }else if(customEventData=="mffh"){
            plat.onLookMvAd(0);
    
        }
 
     },
});
