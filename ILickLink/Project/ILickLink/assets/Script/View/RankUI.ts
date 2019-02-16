import { BaseUI} from "./BaseUI";
import { UIManager} from "../manager/UIManager";
import { Logger } from "../Tool/Logger";
import { UserManager } from "../manager/UserManager";
import { WXManager, WX_OpenData } from "../Tool/wx/wxApi";
const {ccclass, property} = cc._decorator;

@ccclass
export class RankUI extends BaseUI {

    @property(cc.Node)
    rankScroll: cc.Node = null;
    @property(cc.Node)
    rankItem: cc.Node = null;

    //
    private ranklist:Array<any> = [];
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    

    start () {
        // this.node.on(cc.Node.EventType.TOUCH_START,function(){},this);
        // this.refreshUI();
        WXManager.Instance.openDataContent();
        //从子域获取最新排行信息
        let wx_OpenData = new WX_OpenData("getFriendCloudStorage")
        wx_OpenData.res = {
            nickName:UserManager.Instance.getUserInfo().nickName,
            openId:UserManager.Instance.getUserInfo().openid
        };
        WXManager.Instance.sendMessageToChild(wx_OpenData);

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
            {name:"案多发发士大夫撒速度",avatarUrl:"",level:1}
            
        ]);
    }

    /**
     * 刷新列表
     * @param {any = uid,nickname,avatarUrl,score,layer}ranklist 排行榜数据
     */
    private updateRankScroll(ranklist: any) {
        Logger.info("更新 RankView.updateRankScroll:", ranklist);

        let rankScrollComp: cc.ScrollView = this.rankScroll.getComponent(cc.ScrollView);
        rankScrollComp.content.removeAllChildren();

        if (ranklist.length <= 0) {
            //this.node.active = false;
            return;
        }
        this.node.active = true;
        
        let oneHight = this.rankItem.height + 9;
        rankScrollComp.content.height = ranklist.length * oneHight;

        let hasMyRank: boolean = false;
        for (let index = 0; index < ranklist.length; index++) {
            
            const element = ranklist[index];
            let item = cc.instantiate(this.rankItem);
            item.active = true;
            rankScrollComp.content.addChild(item);

            item.setPosition(cc.v2(0, -index * oneHight - oneHight / 2));

            let head = item.getChildByName("head");
            this.loadHttpIcon(head,element.avatarUrl,function(){});

            let name = item.getChildByName("name").getComponent(cc.Label);
            name.string  = element.name;

            let level = item.getChildByName("level").getComponent(cc.Label);
            level.string = element.level;

            // let rank = item.getChildByName("rank").getComponent(cc.Label);
            // rank.string = "NO." + (index + 1);

            
            //如果是当前用户
            if(123==(UserManager.Instance.getUserInfo().uid)){
                hasMyRank = true;
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
        UIManager.Instance.closeWindow('RankUI');
        WXManager.Instance.closeDataContent();
    }

    // update (dt) {}

    public onShow(){
        Logger.info('RankUI onShow');
    }
    public onHide(){
        Logger.info('RankUI onHide');
        WXManager.Instance.closeDataContent();
    }

    /**
     * 精灵动态加载网络图片
     * @param container 
     * @param _iconUrl 
     * @param _callfunc 
     */
    private loadHttpIcon(container, _iconUrl, _callfunc) {
        if (!_iconUrl || _iconUrl == "") {
            _iconUrl = "http://thirdwx.qlogo.cn/mmopen/vi_32/opmkDJhG2jpF8X8AfFQfTauRlpBc7VeFicJevZ9IiajEl5g4ia75opNSZOb0FvDV87BvpUN1rsyctibGnicP7uibsMtw/132"
        }
        cc.loader.load({ url: _iconUrl, type: 'png' }, function (err, tex) {
            var spriteFrame = new cc.SpriteFrame(tex)
            container.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            if (_callfunc) {
                _callfunc()
            }
            Logger.info('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
        });
    }
}
