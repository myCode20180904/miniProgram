cc.Class({
    extends: cc.Component,

    onAnimCompleted: function (string) {
        // console.log('onAnimCompleted: param1[%s]',string);
        this.node.destroy();
    }
});