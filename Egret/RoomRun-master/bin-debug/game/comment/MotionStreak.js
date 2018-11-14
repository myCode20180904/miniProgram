var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MotionPoint = (function () {
    /**
     *
     * !@param _point  坐标
     * !@param _angle  角度
     */
    function MotionPoint(_point, _angle) {
        this.point = _point;
        this.angle = _angle;
    }
    return MotionPoint;
}());
__reflect(MotionPoint.prototype, "MotionPoint");
/*
* !#zh 运动轨迹，用于游戏对象的运动轨迹上实现拖尾渐隐效果。

    示例
    var texture = egret.loader.getRes("texture.png");
    var motionStreak = new MotionStreak(role,texture,64,64);
    motionStreak.distance = 16;
    motionStreak.setPosition(role.width*role.scaleX/2,role.height*role.scaleY/2);
*/
var MotionStreak = (function () {
    /**
     *
     * !@param withNode  绑定跟随者
     * !@param texture  绑定纹理
     * !@param width 设定宽度
     * !@param height 设定height
     */
    function MotionStreak(withNode, texture, width, height) {
        /** !#en The fade time to fade.
        !#zh 拖尾的渐隐时间，以豪秒为单位。 */
        this.fadeTime = 200;
        /** !#en The minimum segment size.
        !#zh 拖尾之间最小距离。 */
        this.minSeg = 1;
        /** !#en The stroke's width.
        !#zh 拖尾的宽度。 */
        this.strokeW = 64;
        /** !#en The stroke's width.
        !#zh 拖尾的高度。 */
        this.strokeH = 64;
        /** !#en The stroke's width.
        !#zh 拖尾节间距。 */
        this.distance = 64;
        /** !#en The texture of the MotionStreak.
        !#zh 拖尾的贴图。 */
        this.texture = null;
        /** !#en The color of the MotionStreak.
        !#zh 拖尾的颜色 */
        this.color = "0xffffff";
        /**跟随的节点 */
        this.withNode = null;
        /**
         * ！跟随移动坐标的Point
         */
        this.offSetPoints = new egret.Point(0, 0);
        /**
         * !最大跟随数量
         */
        this.MaxNum = 20;
        /**
         * !设置密集（0-默认无效果 1-开启后可设置跟随粒子均匀的间隔距离 --）
         */
        this.fadeMode = 1;
        //容器
        this.picePanel = null;
        //跟随de节点
        this.points = new Array();
        this.nodes = new Array();
        this.lastPos = new egret.Point(0, 0);
        this.withNode = withNode;
        this.texture = texture;
        if (width) {
            this.strokeW = width;
            this.strokeH = height;
        }
        this.reset();
    }
    /**
       !#en Remove all living segments of the ribbon.
       !#zh 删除当前所有的拖尾片段。
   */
    MotionStreak.prototype.reset = function () {
        this.points.splice(0, this.points.length);
        this.createNodes(this.MaxNum * 20);
        this.timer1 = new egret.Timer(16, 0);
        this.timer1.stop();
        this.timerFade = new egret.Timer(this.fadeTime, 0);
        this.timerFade.stop();
        if (this.withNode.parent) {
            if (this.picePanel) {
                // this.picePanel.removeSelf();
            }
            this.picePanel = new egret.Sprite();
            this.withNode.parent.addChild(this.picePanel);
            this.picePanel.x = 0;
            this.picePanel.y = 0;
            this.lastPos.x = this.withNode.x + this.x - this.offSetPoints.x;
            this.lastPos.y = this.withNode.y + this.y - this.offSetPoints.y;
            this.withNode.parent.setChildIndex(this.picePanel, this.withNode.parent.getChildIndex(this.withNode) - 1);
            this.timer1.addEventListener(egret.TimerEvent.TIMER, this._updateMaterial, this);
            this.timer1.addEventListener(egret.TimerEvent.TIMER, this._updateDrawMaterial, this);
            this.timer1.start();
            this.timerFade.addEventListener(egret.TimerEvent.TIMER, this.reduce, this);
            this.timerFade.start();
        }
    };
    /**
     * !销毁
     */
    MotionStreak.prototype.destroy = function () {
        // this.points.splice(0,this.points.length);
        // for (var index = 0; index < this.nodes.length; index++) {
        //     var element = this.nodes[index];
        //     // element.destroy();
        // }
        // this.nodes.splice(0,this.nodes.length);
        // this.timer1.stop();
        // this.timerFade.stop();
        // if(this.picePanel){
        //     // this.picePanel.removeSelf();
        // }
        // delete this;
    };
    /**
     * ！设置坐标
     */
    MotionStreak.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };
    MotionStreak.prototype._updateMaterial = function () {
        if (this.withNode && this.picePanel) {
            var x = this.withNode.x + this.x - this.offSetPoints.x;
            var y = this.withNode.y + this.y - this.offSetPoints.y;
            this.picePanel.x = this.offSetPoints.x;
            this.picePanel.y = this.offSetPoints.y;
            var offx = this.lastPos.x - x;
            var offy = this.lastPos.y - y;
            var dis = Math.sqrt(offx * offx + offy * offy);
            var angel = this.getAngle(new egret.Point(this.lastPos.x, this.lastPos.y), new egret.Point(x, y));
            if (dis < this.distance) {
                return;
            }
            if (this.points.length <= this.nodes.length) {
                this.points.push(new MotionPoint(new egret.Point(x, y), angel));
                // console.info("--------------------:",x,y);
                //TODO:
                if (this.fadeMode == 1 && dis > this.distance) {
                    for (var index = 1; index <= Math.floor(dis / this.distance); index++) {
                        var __x = x + offx * (index / Math.floor(dis / this.distance));
                        var __y = y + offy * (index / Math.floor(dis / this.distance));
                        // console.info(":",__x,__y);
                        this.points.push(new MotionPoint(new egret.Point(__x, __y), angel));
                    }
                }
            }
            else {
                this.points.pop();
                // this.points.push(new egret.Point(x,y));
            }
            //
            this.lastPos.x = x;
            this.lastPos.y = y;
        }
    };
    MotionStreak.prototype._updateDrawMaterial = function () {
        var self = this;
        var _loop_1 = function () {
            element = this_1.points[index];
            var node = this_1.nodes[index];
            try {
                node.anchorOffsetX = this_1.strokeW / 2;
                node.anchorOffsetY = this_1.strokeH / 2;
                node.x = element.point.x;
                node.y = element.point.y;
                node.rotation = element.angle;
                node.alpha = (1 / this_1.points.length) * index;
                this_1.picePanel.addChild(node);
                var dt = this_1.fadeTime + this_1.fadeTime * (1 / this_1.points.length) * index;
                // console.info(dt);
                egret.Tween.get(node).to({ "alpha": 0 }, null)
                    .call(function () {
                    self.picePanel.removeChild(node);
                }, this_1);
            }
            catch (error) {
                console.info(error, node);
            }
        };
        var this_1 = this, element;
        for (var index = 0; index < this.points.length; index++) {
            _loop_1();
        }
    };
    MotionStreak.prototype.reduce = function () {
        if (this.points.length > this.MaxNum) {
            this.points.splice(0, this.points.length - this.MaxNum);
        }
        else {
            this.points.splice(0, 1);
        }
    };
    MotionStreak.prototype.createNodes = function (num) {
        for (var index = 0; index < this.nodes.length; index++) {
            var element = this.nodes[index];
            // element.destroy();
        }
        this.nodes.splice(0, this.nodes.length);
        for (var index = 0; index < num; index++) {
            var node = new egret.Sprite();
            // node.graphics.drawTexture(this.texture,0,0,this.strokeW,this.strokeH);
            this.nodes.push(node);
        }
    };
    //
    MotionStreak.prototype.getAngle = function (start, end) {
        var diff_x = end.x - start.x, diff_y = end.y - start.y;
        //返回角度,不是弧度0-360
        var angle = 0;
        if (diff_y > 0 && diff_x > 0) {
            angle = Math.abs(Math.atan(diff_y / diff_x) * (180 / Math.PI));
        }
        else if (diff_y > 0 && diff_x <= 0) {
            angle = 180 - Math.abs(Math.atan(diff_y / diff_x) * (180 / Math.PI));
        }
        else if (diff_y <= 0 && diff_x <= 0) {
            angle = 180 + Math.abs(Math.atan(diff_y / diff_x) * (180 / Math.PI));
        }
        else {
            angle = 360 - Math.abs(Math.atan(diff_y / diff_x) * (180 / Math.PI));
        }
        return angle + 90;
    };
    return MotionStreak;
}());
__reflect(MotionStreak.prototype, "MotionStreak");
//# sourceMappingURL=MotionStreak.js.map