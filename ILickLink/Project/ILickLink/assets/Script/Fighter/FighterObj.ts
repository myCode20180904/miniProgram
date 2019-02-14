import { Util } from "../Define/Util";
import { LoadManager } from "../manager/LoadManager";

/**
 * 属性
 */
export class ObjAttribute {
    //表结构-------------------

    //怪物id
    public Id: number = 1000;
    //名字
    public Name: string = '';
    //名字
    public Desc: string = '';
    //绑定spine骨骼
    public Modelid: string = ''
    //类型
    public Type: number = 0;
    //生命
    public Maxhp: number = 0;
    //攻击
    public Attack: number = 0;
    //靠近可攻击
    public Nearatk: number = 50;
    //移动速度
    public Movespeed: number = 100;
    //攻击声音
    public Attacksound: number = 0;
    //死亡声音
    public Deadsound: number = 0;
    //产出
    public Produce: number = 0;
    //战斗力
    public Combat: number = 0;

    public constructor(config: any) {
        Util.safeCopy(this, config);
    }
}

/**
 * 
 */
export class FighterObj extends ObjAttribute{
    //分组
    public group: string = 'default';
    /**
     * 节点
     */
    public fighterNode:cc.Node = null;
    //骨骼组件
    public skeleton: sp.Skeleton = null;
    //翻转
    public flipX: boolean = false;

    protected onLoad(): void{};
    public constructor(config: any,_node:cc.Node,parent:cc.Node) {
        super(config);
        this.fighterNode = _node;
        if(this.fighterNode == null){
            return;
        }
        parent.addChild(this.fighterNode);

        this.loadSpine();
        this.onLoad();
        
    }

    /**
     * 移除
     */
    public removeFromParent(){
        this.fighterNode.removeFromParent();
    }

    /**
     * 加载骨骼
     */
    private loadSpine(){
        this.skeleton = this.fighterNode.getChildByName('body').getComponent(sp.Skeleton);
        let strArr = this.Modelid.split('|');
        let spineName = LoadManager.Instance.skeletons[strArr[0]]
        if (!spineName) {
            return;
        }
        this.skeleton.skeletonData = spineName;
        if (strArr.length > 1) {
            this.skeleton.defaultSkin = strArr[1];
        }
        if (strArr.length > 2) {
            this.skeleton.animation = strArr[2];
        }
    }

    /**
     * 设置播放动画
     * @param trackIndex 
     * @param name 
     * @param loop 
     * @returns sp.spine.TrackEntry
     */
    public setAnimation(trackIndex: number, name: string, loop: boolean): any {
        let anim = this.skeleton.findAnimation(name);
        if (!anim) {
            return null;
        }
        return this.skeleton.setAnimation(trackIndex, name, loop);
    }

    public setPos(pos:cc.Vec2){
        this.fighterNode.x = pos.x;
        this.fighterNode.y = pos.y;
    }

    public setFlipX(flip: boolean, call: cc.FiniteTimeAction) {
        this.flipX = flip;
        if (call) {
            this.fighterNode.runAction(cc.sequence(cc.flipX(flip), call));
        } else {
            this.fighterNode.runAction(cc.flipX(flip));
        }
    }


}