var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var HelloWorld = (function (_super) {
    __extends(HelloWorld, _super);
    function HelloWorld() {
        var _this = _super.call(this) || this;
        _this.isDrage = false;
        _this.skinName = "resource/assets/exml/helloPage.exml";
        return _this;
    }
    HelloWorld.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.init();
    };
    HelloWorld.prototype.init = function () {
        // this.logo.visible = false;
        this.role = new Role();
        this.addChild(this.role);
        this.role.setState(Role.STATE1);
        this.role.x = 200;
        this.role.y = 300;
        this.role.play();
        this.role.touchEnabled = true;
        this.role.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.role.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        //	动画
        // var data = RES.getRes("abc.json");
        // var txtr:egret.Texture = RES.getRes("abc.png");
        // var mcDataFactory = new  egret.MovieClipDataFactory(data, txtr);
        // var mc1:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData("att")); 
        // mc1.gotoAndPlay(1,3);
    };
    HelloWorld.prototype.mouseDown = function (evt) {
        console.log("Mouse Down.");
        this.isDrage = true;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
    };
    HelloWorld.prototype.mouseMove = function (evt) {
        if (this.isDrage) {
            console.log("moving now ! Mouse: [X:" + evt.stageX + ",Y:" + evt.stageY + "]");
            this.role.x = evt.stageX;
            this.role.y = evt.stageY;
        }
    };
    HelloWorld.prototype.mouseUp = function (evt) {
        console.log("Mouse Up.");
        this.isDrage = false;
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
    };
    return HelloWorld;
}(eui.Component));
__reflect(HelloWorld.prototype, "HelloWorld");
//# sourceMappingURL=HelloWorld.js.map