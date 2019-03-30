import { BaseUI} from "./BaseUI";
import { UIManager} from "../Manager/UIManager";
import { Logger } from "../Tool/Logger";
import { UserManager } from "../Manager/UserManager";
import { WXManager, WX_OpenData } from "../Tool/wx/wxApi";
import { LoadManager } from "../Manager/LoadManager";
const {ccclass, property} = cc._decorator;

@ccclass
export class TestScrollView extends BaseUI {

    @property(cc.Node)
    scrollView: cc.Node = null;
    @property(cc.Node)
    item: cc.Node = null;

    //
    private ranklist:Array<any> = [];
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    

    start () {
        this.refreshUI();

    }

    public refreshUI(){
        this.updateRankScroll([
            {name:"张三",avatarUrl:"",level:1},
            {name:"李四",avatarUrl:"",level:1},
            {name:"王五",avatarUrl:"",level:1},
            {name:"溜溜",avatarUrl:"",level:1},
            {name:"七杀",avatarUrl:"",level:1},
            {name:"巴拉",avatarUrl:"",level:1},
            {name:"就撒旦法",avatarUrl:"",level:1},
            {name:"上课了等级分三份",avatarUrl:"",level:1},
            {name:"案多发发士大夫撒速度",avatarUrl:"",level:1},
            {name:"七杀",avatarUrl:"",level:1},
            {name:"巴拉",avatarUrl:"",level:1},
            {name:"就撒旦法",avatarUrl:"",level:1},
            {name:"上课了等级分三份",avatarUrl:"",level:1},
            {name:"案多发发士大夫撒速度",avatarUrl:"",level:1},
            {name:"七杀",avatarUrl:"",level:1},
            {name:"巴拉",avatarUrl:"",level:1},
            {name:"就撒旦法",avatarUrl:"",level:1},
            {name:"上课了等级分三份",avatarUrl:"",level:1},
            {name:"案多发发士大夫撒速度",avatarUrl:"",level:1}
            
        ]);
    }

    /**
     * 刷新列表
     * @param {any = uid,nickname,avatarUrl,score,layer}ranklist 排行榜数据
     */
    private updateRankScroll(ranklist: any) {
        Logger.info("更新 TestScrollView.updateRankScroll:", ranklist);

        let rankScrollComp: cc.ScrollView = this.scrollView.getComponent(cc.ScrollView);
        rankScrollComp.content.removeAllChildren();

        if (ranklist.length <= 0) {
            //this.node.active = false;
            return;
        }
        this.node.active = true;
        
        let oneHight = this.item.height + 5;
        rankScrollComp.content.height = ranklist.length * oneHight;

        let hasMyRank: boolean = false;
        for (let index = 0; index < ranklist.length; index++) {
            
            const element = ranklist[index];
            let item = cc.instantiate(this.item);
            item.active = false;
            rankScrollComp.content.addChild(item);

            item.setPosition(cc.v2(0, -index * oneHight - oneHight / 2));

            let head = item.getChildByName("head");
            LoadManager.Instance.loadHttpIcon(head,element.avatarUrl,function(){});

            let name = item.getChildByName("name").getComponent(cc.Label);
            name.string  = element.name;

            let level = item.getChildByName("level").getComponent(cc.Label);
            level.string = 'LV'+element.level;

            // let rank = item.getChildByName("rank").getComponent(cc.Label);
            // rank.string = "NO." + (index + 1);

            
            //如果是当前用户
            if(123==(UserManager.Instance.getUserInfo().uid)){
                hasMyRank = true;
            }
        }

        this.scrollEvent(rankScrollComp,cc.ScrollView.EventType.SCROLLING,'');
    }

    private viewSize = cc.size(640,800)
    /**
     * 
     * @param sview 
     * @param eventType 
     * @param customEventData 
     */
    scrollEvent(sview:cc.ScrollView, eventType:cc.ScrollView.EventType, customEventData){
        if(eventType==cc.ScrollView.EventType.SCROLLING){

            //隐藏view区域外的item
            for (let index = 0; index < sview.content.children.length; index++) {
                if((-sview.content.children[index].y+sview.content.children[index].height/2<sview.content.getPosition().y-this.viewSize.height/2)
                ||(-sview.content.children[index].y-sview.content.children[index].height>sview.content.getPosition().y+this.viewSize.height/2)){
                    sview.content.children[index].active = false;
                }else{
                    sview.content.children[index].active = true;
                }
            }
        }
    }

    

     /**
     * 菜单
     * @param event 点击事件
     * @param customEventData 用户参数
     */
    menu (event:cc.Event,customEventData:any){
        // Logger.info('touch menu:',customEventData);
        if(customEventData=="close"){
            this.close();
        }
        
      
    }

    
    /**
     * 关闭
     */
    private close(){
        UIManager.Instance.closeWindow('TestScrollView');
        WXManager.Instance.closeDataContent();
    }

    // update (dt) {}

    public onShow(){
        Logger.info('TestScrollView onShow');
    }
    public onHide(){
        Logger.info('TestScrollView onHide');
        WXManager.Instance.closeDataContent();
    }

    
}
