import { UIManager } from "../Manager/UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export class BaseUI extends cc.Component{
    
    @property(({tooltip:"添加浮动背景"}))
    withFlowBg: boolean = false;

    protected onShow(): void{};
    protected onHide(): void{};
    protected async addFlowBg(){
        if(!this.withFlowBg){
            return
        }
        let bg = UIManager.Instance.createPrefab('nodes/BackGround');
        this.node.addChild(bg,-1);
    };
}