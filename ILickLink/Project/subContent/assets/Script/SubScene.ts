

/**
 * 数据域消息结构
 */
export class WX_OpenData{
    public fun_name:string = '';//调用的方法名
    public res:any = '';//发送的内容
	public constructor(val) {
        this.fun_name = val;
    }
}


const {ccclass, property} = cc._decorator;
const  wxkey='ILickLink';
var myrank:number;

@ccclass
export default class SubScene extends cc.Component {

    @property(cc.Node)
    rankScroll: cc.Node = null;
    @property(cc.Node)
    rankItem: cc.Node = null;
    @property(cc.SpriteFrame)
    itemBg1: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    itemBg2: cc.SpriteFrame = null;

    //用户信息
    userInfo:{nickName:string, openID:string} = {nickName:'',openID:''}

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        if(window['wx']){
            this.onMessage();
        }else{
            this.updateRankScroll([
                {nickname:"张三",avatarUrl:"",level:1},
                {nickname:"李四",avatarUrl:"",level:1},
                {nickname:"王五",avatarUrl:"",level:1},
                {nickname:"溜溜",avatarUrl:"",level:1},
                {nickname:"七杀",avatarUrl:"",level:1},
                {nickname:"巴拉",avatarUrl:"",level:1},
                {nickname:"就撒旦法",avatarUrl:"",level:1},
                {nickname:"上课了等级分三份",avatarUrl:"",level:1},
                {nickname:"案多发发士大夫撒速度",avatarUrl:"",level:1}
                
            ])
        }
        
    }

    /**
     * 刷新列表
     * @param {any}ranklist 微信排行榜数据
     */
    private updateRankScroll(ranklist:any){
        console.info("更新微信排行榜 SubScene.updateRankScroll:",ranklist);

        let rankScrollComp:cc.ScrollView = this.rankScroll.getComponent(cc.ScrollView);
        rankScrollComp.content.removeAllChildren();
        if(ranklist.length<=0)
        {
            return;
        }
        
        let oneHight = this.rankItem.height + 9;
        rankScrollComp.content.height = ranklist.length * oneHight;
        
        for (let index = 0; index < ranklist.length; index++) {
            const element = ranklist[index];
            let item = cc.instantiate(this.rankItem);
            item.active = true;
            rankScrollComp.content.addChild(item);

            item.setPosition(cc.v2(0, -index * oneHight - oneHight / 2));

            let head =  item.getChildByName("head");
            this.loadHttpIcon(head,element.avatarUrl,function(){});
            
            let name = item.getChildByName("name").getComponent(cc.Label);
            name.string  = element.nickname;

            if(element.KVDataList){
                let value = JSON.parse(element.KVDataList[0].value) 

                let level = item.getChildByName("level").getComponent(cc.Label);
                level.string = "关卡:"+value.level;
            }
           
           

            //如果是当前用户
            if(element.openid==this.userInfo.openID){
                item.getComponent(cc.Sprite).spriteFrame = this.itemBg2;
            }else if(element.nickname==this.userInfo.nickName){
                item.getComponent(cc.Sprite).spriteFrame = this.itemBg2;
            }else{
                item.getComponent(cc.Sprite).spriteFrame = this.itemBg1;
            }
        }

    }

    /**
     *  获取排行榜数据
     */
    private getRankInfo(res){
        let rankinfo = new Array();
        for (let index = 0; index <res.length; index++) {
            if(res[index].KVDataList.length>0&&res[index].KVDataList[0].key==wxkey){
                rankinfo.push(res[index]);
            }
        }
        //排序
        rankinfo.sort((a: any, b: any) => {
            let valueA = JSON.parse(a.KVDataList[0].value);
            let valueB = JSON.parse(b.KVDataList[0].value);
            if (valueA.level > valueB.level) {
                return -1;
            }
            else {
                return 1;
            }
        });

        return rankinfo;
    }
    /**
     * 监听来自主域消息
     * 
     */
    private onMessage(){
        let that = this;
        window['wx'].onMessage( data => {
            console.log(data);
            if(data.fun_name == "setUserCloudStorage"){
                window['wx'].setUserCloudStorage({
                    KVDataList:[{key:wxkey,value:JSON.stringify(data.data)}],
                    success: res => {
                        console.log(res);
                    },
                    fail: res => {
                        console.log(res);
                    }
                });
            } else if(data.fun_name == "getFriendCloudStorage"){
                // https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getFriendCloudStorage.html
                window['wx'].getFriendCloudStorage({
                    keyList: [wxkey], // 你要获取的、托管在微信后台都key
                    success: function (res) {
                        if(data.data){
                            that.userInfo.openID = data.data.openID
                            that.userInfo.nickName = data.data.nickName
                        }

                        that.updateRankScroll(that.getRankInfo(res.data));
                    },
                    fail: function (res) {
                        console.error(res);
                    }
                });
            }else if(data.fun_name == "show"){
                let rankScrollComp:cc.ScrollView = this.rankScroll.getComponent(cc.ScrollView);
                rankScrollComp.content.removeAllChildren();
            }else if(data.fun_name == "hide"){
               
            }



        });

        
    }


    /**
     * 精灵动态加载网络图片
     * @param container 
     * @param _iconUrl 
     * @param _callfunc 
     */
    private loadHttpIcon(container,_iconUrl,_callfunc){
        if(!_iconUrl||_iconUrl==""){
            _iconUrl="http://thirdwx.qlogo.cn/mmopen/vi_32/opmkDJhG2jpF8X8AfFQfTauRlpBc7VeFicJevZ9IiajEl5g4ia75opNSZOb0FvDV87BvpUN1rsyctibGnicP7uibsMtw/132"
        }
        cc.loader.load({url: _iconUrl, type: 'png'}, function (err, tex) {
            var spriteFrame=new cc.SpriteFrame(tex)
            container.getComponent(cc.Sprite).spriteFrame=spriteFrame;
            if(_callfunc){
                _callfunc()
            }
            console.info('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
        });
    }


    // update (dt) {}
}
