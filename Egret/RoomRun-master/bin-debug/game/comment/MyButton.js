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
/**自定义按钮类 */
var MyButton = (function (_super) {
    __extends(MyButton, _super);
    function MyButton(bgName, titleName) {
        var _this = _super.call(this) || this;
        _this._shape = null;
        _this.extData = {};
        _this._bg = GameConst.createBitmapFromSheet(bgName, "ui");
        _this.addChild(_this._bg);
        _this.title = GameConst.createBitmapFromSheet(titleName, "ui");
        _this.title.x = (_this._bg.width - _this.title.width) >> 1;
        _this.title.y = (_this._bg.height - _this.title.height) >> 1;
        _this.addChild(_this.title);
        return _this;
    }
    //设置点击触发事件
    MyButton.prototype.setClick = function (func) {
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickEvent, this);
        this.onClick = func;
    };
    //点击触发的事件
    MyButton.prototype.onClickEvent = function (evt) {
        this.onClick(evt);
    };
    MyButton.prototype.setTitle = function (title) {
        this.title = GameConst.CreateBitmapByName(title);
    };
    Object.defineProperty(MyButton.prototype, "bg", {
        get: function () {
            return this._bg;
        },
        set: function (bg) {
            this._bg = bg;
        },
        enumerable: true,
        configurable: true
    });
    //初始化赋值
    MyButton.prototype.initCDGraphics = function () {
        var shape = this._shape = new egret.Shape();
        shape.x = this._bg.width / 2;
        shape.y = this._bg.height / 2;
        this.addChild(shape);
        this._bg.mask = shape;
    };
    //轻触修改属性
    MyButton.prototype.startCD = function () {
        if (!this._shape) {
            this.initCDGraphics();
        }
        var shape = this._shape;
        var self = this;
        /*** 本示例关键代码段开始 ***/
        var angle = 0;
        var i = 1;
        egret.startTick(onTimer, self);
        function onTimer(timeStamp) {
            routeAngle(angle);
            angle += 6 / self.extData.cd;
            if (angle > 360) {
                egret.stopTick(onTimer, self);
            }
            return false;
        }
        function routeAngle(angle) {
            shape.graphics.clear();
            // self.fullFront(shape);
            shape.graphics.beginFill(0x00ffff, 1);
            shape.graphics.moveTo(0, 0);
            shape.graphics.lineTo(200, 0);
            shape.graphics.drawArc(0, 0, 200, 0, angle * Math.PI / 180, i == -1);
            shape.graphics.lineTo(0, 0);
            shape.graphics.endFill();
        }
        /*** 本示例关键代码段结束 ***/
    };
    //填充形状
    MyButton.prototype.fullFront = function (bgSptite) {
        var bitmap = new egret.Bitmap();
        bitmap.texture = RES.getRes("$ui_json.btn_y");
        bitmap.scrollRect = new egret.Rectangle(0, 0, this._bg.width, this._bg.height);
        bitmap.x = 0;
        bitmap.y = 0;
        bgSptite.addChild(bitmap);
    };
    return MyButton;
}(egret.Sprite));
__reflect(MyButton.prototype, "MyButton");
//# sourceMappingURL=MyButton.js.map