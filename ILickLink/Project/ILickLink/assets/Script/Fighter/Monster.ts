import { FighterObj } from "./FighterObj";
import { FighterAnims, FighterAnim } from "../Define/CommonParam";


export class Monster extends FighterObj {
    //动画列表
    public animations: FighterAnims = null;
    public now_anim: FighterAnim = null;
    private _countId:number = 0;
    public set countId(value){
        this._countId = value;
    }
    public get countId():number{
        return this._countId;
    }
    public onLoad(){
        this.group = 'monster';
        this.animations = new FighterAnims();
        //骨骼原始数据
        let use_skeleton = (this.skeleton as any)._skeleton;
        //设置动画列表
        for (let index = 0; index < use_skeleton.data.animations.length; index++) {
            const element = use_skeleton.data.animations[index];
            //攻击动画
            if (element.name.indexOf("gongji") >= 0) {
                this.animations.atk.name.push(element.name);
            }
            if (element.name.indexOf("daji") >= 0) {
                this.animations.atk.name.push(element.name);
            }
            //格挡动画
            if (element.name.indexOf("parry") >= 0) {
                this.animations.block.name.push(element.name);
            }
             //受伤动画
             if (element.name.indexOf("shouji") >= 0) {
                this.animations.hurt.name.push(element.name);
            }
            //死亡动画
            if (element.name.indexOf("si") >= 0) {
                this.animations.death.name.push(element.name);
            }
            //
            if (element.name.indexOf("pao") >= 0) {
                this.animations.walk.name.push(element.name);
            }
            // ...
        }

        //初始
        this.now_anim = this.animations.idle;
        if (this.animations.walk.name.length > 0) {
            this.setAnimation(0, this.animations.walk.name[0], true);
        }
        this.fighterNode.group = this.group;

    }



}
