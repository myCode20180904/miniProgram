/**技能容器 */
class SkillContianer extends egret.Sprite {
    /**技能列表 */
    private skillBnArr:Array<MyButton> = new Array();
    public static skillList:Array<any> = [{name:"金币双倍",skin:"btn_y",cd:1}, 
                                          {name:"能量大炮",skin:"btn_y",cd:5}
                                         ];

    public constructor() {
        super();
        this.init();
    }
    private init():void {

        this.skillBnArr.splice(0, this.skillBnArr.length);
        //
        for(let index = 0;index < SkillContianer.skillList.length; index++){
            const element = SkillContianer.skillList[index];

            let btn:MyButton = new MyButton("btn_y", "btn_kaishi");
            this.addChild(btn);
            btn.x = GameConst.StageW - btn.width - 20;
            btn.y = GameConst.StageH-200-100*index;
            btn.setClick(this.onSkill);
            btn.extData.idx = index;
            btn.extData.cd = element.cd;
            this.skillBnArr.push(btn);

        }
       
      
    }
    private onSkill(evt:egret.TouchEvent) {
        let idx = evt.target.extData.idx;
        evt.target.startCD();
        console.info("onSkill:",SkillContianer.skillList[idx]);
    }

}