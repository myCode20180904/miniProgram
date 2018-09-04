

var g_define = require('../g_define');

cc.Class({
    extends: cc.Component,

    properties: {
        lineDir:g_define.lineDir.bottom,
        start_end:0,//0连线，1起点，2终点
        col:0,
        row:0,
    },
    
    onLoad () {
        
        //this.node

    },

});
