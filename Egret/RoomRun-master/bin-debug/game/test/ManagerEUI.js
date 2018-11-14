var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ManagerEUI = (function () {
    function ManagerEUI(stage) {
        this.rootNode = new egret.Sprite();
        stage.addChildAt(this.rootNode, 0);
        this.layoutList = new Array();
    }
    /**
     * !获取根节点
     * !@return rootNode
     */
    ManagerEUI.prototype.getRootNode = function () {
        return this.rootNode;
    };
    /**
     * !添加eui
     * !@param ui 添加的界面
     * !@param zoder 层级(zoder>=0;替换zoder位置ui;zoder超出layoutList范围则push ui)
     */
    ManagerEUI.prototype.addChild = function (ui, zoder) {
        if (zoder && zoder < this.layoutList.length) {
            this.layoutList.splice(zoder, 1, ui);
            this.rootNode.addChildAt(ui, zoder);
        }
        else {
            this.layoutList.push(ui);
            this.rootNode.addChild(ui);
        }
    };
    /**
     * !移除ui
     * @param ui 界面
     */
    ManagerEUI.prototype.removeChild = function (ui) {
        var index = this.layoutList.indexOf(ui);
        if (index >= 0) {
            this.layoutList.splice(index, 1);
            this.rootNode.removeChild(ui);
        }
        else {
            console.info("not exit at ManagerEUI:", ui);
        }
    };
    /**
     * !removeAll
     */
    ManagerEUI.prototype.removeAll = function () {
        this.layoutList.splice(0, this.layoutList.length);
        this.rootNode.removeChildren();
    };
    return ManagerEUI;
}());
__reflect(ManagerEUI.prototype, "ManagerEUI");
//# sourceMappingURL=ManagerEUI.js.map