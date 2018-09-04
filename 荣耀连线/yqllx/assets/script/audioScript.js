
cc.Class({
    extends: cc.Component,

    properties: {
        line_end: {
            default: null,
            type: cc.AudioClip
        }
    },
   // onLoad () {},

   // start () { },
    playEff: function (name) {
        switch (name) {
            case "line_end":
                this.current = cc.audioEngine.play(this.line_end, false, 1);
                break;
        
            default:
                break;
        }

    },


    onDestroy: function () {
        cc.audioEngine.stop(this.current);
    }

});
