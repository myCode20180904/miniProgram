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
/**技能容器 */
var SkillContianer = (function (_super) {
    __extends(SkillContianer, _super);
    function SkillContianer() {
        var _this = _super.call(this) || this;
        /**技能列表 */
        _this.skillBnArr = new Array();
        _this.init();
        return _this;
    }
    SkillContianer.prototype.init = function () {
        this.skillBnArr.splice(0, this.skillBnArr.length);
        //
        for (var index = 0; index < SkillContianer.skillList.length; index++) {
            var element = SkillContianer.skillList[index];
            var btn = new MyButton("btn_y", "btn_kaishi");
            this.addChild(btn);
            btn.x = GameConst.StageW - btn.width - 20;
            btn.y = GameConst.StageH - 200 - 100 * index;
            btn.setClick(this.onSkill);
            btn.extData.idx = index;
            btn.extData.cd = element.cd;
            this.skillBnArr.push(btn);
        }
    };
    SkillContianer.prototype.onSkill = function (evt) {
        var idx = evt.target.extData.idx;
        evt.target.startCD();
        console.info("onSkill:", SkillContianer.skillList[idx]);
    };
    SkillContianer.skillList = [{ name: "金币双倍", skin: "btn_y", cd: 1 },
        { name: "能量大炮", skin: "btn_y", cd: 5 }
    ];
    return SkillContianer;
}(egret.Sprite));
__reflect(SkillContianer.prototype, "SkillContianer");
//# sourceMappingURL=SkillContianer.js.map