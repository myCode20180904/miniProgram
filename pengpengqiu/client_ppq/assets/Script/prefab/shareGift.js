var plat = require('../plat/platScript')
var bannerAd = require('../public/bannerAd')
var dataScript = require('../model/dataScript')
var g_define = require('../public/g_define')

cc.Class({
    extends: bannerAd.obj,

    properties: {
        item:{
            default:null,
            type:cc.Node
        },
        scrollView:{
            default:null,
            type:cc.Node
        },
        iconMask:{
            default:null,
            type:cc.Node
        },
        lingqu:cc.SpriteFrame,
        weilingqu:cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        console.info("shareGift onLoad");
        this._onLoad();

    },
    onDestroy(){
        console.info("shareGift onDestroy");
        this._onDestroy();
    },

    start () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){ }, this);
        this.Scroll_View();
        this.invitePeople();
    },

   

    menu:function(event,customEventData){
        console.info(customEventData);
        if(customEventData=="close"){
            this.close();
        }else if(customEventData=="invite"){
            //
            let randnum = parseInt(Math.random()*3);
            console.info(dataScript.userInfo.avatarUrl)
            let shareData = {
                title:dataScript.common.shareArray[randnum].title,
                imageUrl:dataScript.common.shareArray[randnum].img,
                // query:`sharetype=1&sharekey=${dataScript.userInfo.skey}`
                query:`sharetype=1&sharekey=${dataScript.userInfo.avatarUrl}`
            }
            
            plat.onShare(shareData,function(res){
                console.info(res)

            });
        }else if(customEventData=="get"){
            let index = event.target._tag;
            let scan_index = dataScript.userInfo.inviteFriendsReward[index].scan_index;
            if(dataScript.userInfo.roleScan.indexOf(scan_index)==-1){
                dataScript.userInfo.roleScan.push(scan_index);
                cc.sys.localStorage.setItem('roleScan',JSON.stringify(dataScript.userInfo.roleScan));
            }
            dataScript.userInfo.inviteFriendsReward[index].get = 1;
            this.Scroll_View();
        }
    },

    invitePeople:function(){
        for (let index = 0; index < dataScript.userInfo.inviteFriends.length; index++) {
            console.info(element)
            const element = dataScript.userInfo.inviteFriends[index];
            let item = cc.instantiate(this.iconMask);
            item.active  =true;
            item.setPosition(cc.v2(-188.5+index*107.5,274));//-81
            this.node.addChild(item);

            g_define.loadHttpIcon(item.getChildByName("head"),element,function(){

            });
    
        }

       
    },

    Scroll_View:function(){

        //this.scrollView.node.on('scroll-to-top', this.callback, this);
        let row = 0;
        let col = 0;
        let size  =dataScript.userInfo.inviteFriendsReward.length;
        this.scrollView.getComponent(cc.ScrollView).content.height = size*200;
        let index = 0;
        while (index<size) {
            let inviteReward = dataScript.userInfo.inviteFriendsReward[index];
            const element = dataScript.userInfo.Scan[inviteReward.scan_index];
            // console.info(element)
            let item = cc.instantiate(this.item);
            item.active = true;
            this.scrollView.getComponent(cc.ScrollView).content.addChild(item);
            let W = this.scrollView.getComponent(cc.ScrollView).content.width
            let H = this.scrollView.getComponent(cc.ScrollView).content.height
            row = index%1;
            col =parseInt((index)/1);
            item.setPosition(cc.v2(0,-(200/2+col*200)));

            let key = `loadres/role/role${element.index}`
            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(key);
            item.getChildByName("name").getComponent(cc.Label).string = element.name;
            item.getChildByName("name").color = this.selColor(element.index);

            item.getChildByName("desc").getComponent(cc.Label).string = element.desc;
            let attribute_str = '<color=#B27B00>'
            let flag = false;
            if(element.attribute.speed>1){
                attribute_str+=`移动速度+<color=#ff0000>${parseInt((element.attribute.speed-1)*100)}%</color>\n`
                flag = true;
            }
            if(element.attribute.scale>1){
                attribute_str+=`初始体积+<color=#ff0000>${parseInt((element.attribute.scale-1)*100)}%</color>\n`
                flag = true;
            }
            if(element.attribute.fcore>1){
                attribute_str+=`冲撞威力+<color=#ff0000>${parseInt((element.attribute.fcore-1)*100)}%</color>\n`
                flag = true;
            }
            if(!flag){
                attribute_str+=`暂无</c>\n`
            }
            item.getChildByName("descrich").getComponent(cc.RichText).string = attribute_str;

            // lingqu
            if(inviteReward.get==0&&index<dataScript.userInfo.inviteFriends.length){
                item.getChildByName("get").getComponent(cc.Button).interactable = true;
                item.getChildByName("get").getComponent(cc.Sprite).spriteFrame = this.lingqu;
                item.getChildByName("get").getChildByName("num").active = false;
                
            }else{
                item.getChildByName("get").getComponent(cc.Button).interactable = false;
                item.getChildByName("get").getComponent(cc.Sprite).spriteFrame = this.weilingqu;
                item.getChildByName("get").getChildByName("num").getComponent(cc.Label).string = (index+1);
                item.getChildByName("get").getChildByName("num").active = true;
            }

            item.getChildByName("get")._tag = index;
            index++;
        }
        
    },

    close:function(){
        this.node.destroy();
        if(cc.find("Canvas").getComponent("mainScene")){
            cc.find("Canvas").getComponent("mainScene").updateUI();
        }
    },

    

    selColor:function(level){
        if(level==0){
            return cc.color(51,51,53)
        }else if(level>0&&level<=4){
            return cc.color(40,230,116)
        }else if(level>4&&level<=8){
            return cc.color(0,110,254)
        }else if(level>8&&level<=10){
            return cc.color(168,0,168)
        }else if(level>10&&level<=12){
            return cc.color(255,133,0)
        }
    },
});
