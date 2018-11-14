var dataScript = require('../model/dataScript')

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){}, this);
        
    },

    start () {

    },

    close:function(){
        this.node.destroy();
    },
    
    //菜单
    menu:function(event,customEventData){
        // console.info(event);
         console.info(customEventData);
         if(customEventData=="pause"){
            cc.director.resume();
            if(cc.find("Canvas").getComponent("gameScene")){
                cc.find("Canvas").getComponent("gameScene").pause.active = true;
            }
            this.close();
 
         }else if(customEventData=="bianda"){
            if(dataScript.gamedata.playerList.length>0){
                dataScript.gamedata.playerList[0].level+=2;
            }
            cc.director.resume();
            if(cc.find("Canvas").getComponent("gameScene")){
                cc.find("Canvas").getComponent("gameScene").pause.active = true;
            }
            this.close();
         }
 
     },
});
