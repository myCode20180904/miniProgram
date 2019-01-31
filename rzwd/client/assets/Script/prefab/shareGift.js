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
            cc.sys.localStorage.setItem('inviteFriendsReward',JSON.stringify(dataScript.userInfo.inviteFriendsReward));
            this.Scroll_View();
        }
    },

    invitePeople:function(){
        for (let index = 0; index < dataScript.userInfo.inviteFriends.length; index++) {
            const element = dataScript.userInfo.inviteFriends[index];
            let item = cc.instantiate(this.iconMask);
            item.active  =true;
            item.setPosition(cc.v2(-208+index*100,232));//-81
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
        this.scrollView.getComponent(cc.ScrollView).content.height = size*116;
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
            item.setPosition(cc.v2(0,-(116/2+col*116)));

            let key = `loadres/role/role${element.index}`
            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(key);
            item.getChildByName("name").getComponent(cc.RichText).string = element.name;

            let desc_arr = element.desc;
            if(desc_arr.length>12){
                desc_arr = element.desc.substring(0,10)+"...";
            }
            item.getChildByName("desc").getComponent(cc.Label).string =desc_arr;
            let attribute_str = ''
            let flag = false;
            if(element.attribute.speed>1){
                attribute_str+=`移动速度增加${parseInt((element.attribute.speed-1)*100)}%\n`
                flag = true;
            }
            if(element.attribute.scale>1){
                attribute_str+=`出场增加查克拉${parseInt((element.attribute.scale-1)*100)}%\n`
                flag = true;
            }
            if(element.attribute.fcore>1){
                attribute_str+=`力量增加${parseInt((element.attribute.fcore-1)*100)}%\n`
                flag = true;
            }
            if(!flag){
                attribute_str+=`暂无\n`
            }
            item.getChildByName("descrich").getComponent(cc.Label).string = attribute_str;

            // lingqu
            if(index<dataScript.userInfo.inviteFriends.length){
                if(inviteReward.get==0){
                    item.getChildByName("get").getComponent(cc.Button).interactable = true;
                    item.getChildByName("get").getChildByName("num").getComponent(cc.Label).string = `领取`;
                    item.getChildByName("get").getChildByName("num").active = true;
                }else{
                    item.getChildByName("get").getComponent(cc.Button).interactable = false;
                    item.getChildByName("get").getChildByName("num").getComponent(cc.Label).string = `已领取`;
                    item.getChildByName("get").getChildByName("num").active = true;
                }
                
                
            }else{
                item.getChildByName("get").getComponent(cc.Button).interactable = false;
                item.getChildByName("get").getChildByName("num").getComponent(cc.Label).string = `邀请${index+1}人`;
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
            return cc.color(67,81,104)
        }else if(level>0&&level<=4){
            return cc.color(89,189,0)
        }else if(level>4&&level<=8){
            return cc.color(26,120,247)
        }else if(level>8&&level<=10){
            return cc.color(168,0,168)
        }else if(level>10&&level<=12){
            return cc.color(255,133,0)
        }
    },
});
