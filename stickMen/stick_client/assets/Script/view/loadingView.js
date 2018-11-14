
cc.Class({
    extends: cc.Component,

    properties: {
        process: cc.Label,
        msg: cc.Label,
        count:0
    },

    onLoad () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){ }, this);
    },

    start () {
        this.schedule(this._update,1)
    },
    showProcess:function(msg){
        this.process.active = true;
        this.process.getComponent(cc.Label).string = msg+'%';
    },
    _update(dt){
        if(this.count>3){
            this.count = 0; 
        }
        let str = 'Loading'
        switch (this.count) {
            case 0:
                str = 'Loading'
                break;
            case 1:
                str = 'Loading.'
                break;
            case 2:
                str = 'Loading..'
                break;
            case 3:
                str = 'Loading...'
                break;
            default:
                break;
        }
        this.msg.getComponent(cc.Label).string = str;
        this.count++;
    }

});
