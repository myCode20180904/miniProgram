

cc.Class({
    extends: cc.Component,

    properties: {
        msgArr:[],
        msgBox:cc.Node
    },


    onLoad () {
        this.msgArr = new Array();
        this.msgBox.active = false;
        this.schedule(this._update,0.5)
    },

    start () {

    },

    createMsg:function(msg,dt){
        return {
            msg:msg,
            dt:dt
        }
    },

    addMsg:function(msg,dt){
        this.msgArr.push(this.createMsg(msg,dt));
    },

    popMsg:function(){
        if(this.msgArr.length>0){
            this.unschedule(this._update);
            let msg = this.msgArr.shift();
            this.msgBox.active = true;
            console.info(msg.msg);
            this.msgBox.getChildByName("label").getComponent(cc.Label).string = msg.msg;
            this.msgBox.opacity = 0;
    
            var that  = this;
            let act = cc.sequence(cc.fadeIn(0.5),cc.delayTime(msg.dt-1),cc.fadeOut(0.5),cc.callFunc(function(){
                that.msgBox.active = false;
                that.schedule(this._update,0.5)
            },this));
            this.msgBox.runAction(act);

        }else{

        }
        
    },

    _update:function (dt) {
        this.popMsg();
    },
});
