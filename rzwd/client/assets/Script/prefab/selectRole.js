var plat = require('../plat/platScript')
var bannerAd = require('../public/bannerAd')
var dataScript = require('../model/dataScript')

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
        sel:{
            default:null,
            type:cc.Node
        },
        yixuan:cc.SpriteFrame,
        xuanze:cc.SpriteFrame,
        del_index:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        console.info("selectRole onLoad");
        this._onLoad();
        this.del_index = dataScript.userInfo.roleSelScan;
    },
    onDestroy(){
        console.info("selectRole onDestroy");
        this._onDestroy();
    },

    start () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){ }, this);
        // this.node.getChildByName("db").on(cc.Node.EventType.TOUCH_START,function(event){}, this);

        this.sel_view();
        this.Scroll_View();
        this.preSelNode = null;
    },

    sel_view:function(){
        const element = dataScript.userInfo.Scan[this.del_index];
        
        let key = `loadres/role/role${element.index}`
        this.sel.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(key);
        this.sel.getChildByName("name").getComponent(cc.RichText).string = element.name;
        this.sel.getChildByName("name").color = this.selColor(element.index);
        this.sel.getChildByName("desc").getComponent(cc.Label).string = element.desc;
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
        this.sel.getChildByName("descrich").getComponent(cc.Label).string = attribute_str;

      
        let have  = false;
        for (let j = 0; j < dataScript.userInfo.roleScan.length; j++) {
            const id_sc = dataScript.userInfo.roleScan[j];
            if(element.index == id_sc){
                have = true;
                break;
            }
        }

        if(have){
            this.sel.getChildByName("selbn").active = true;
            if(this.del_index == dataScript.userInfo.roleSelScan){
                this.sel.getChildByName("selbn").getComponent(cc.Button).interactable = false;
                this.sel.getChildByName("selbn").getComponent(cc.Sprite).spriteFrame = this.yixuan;
                this.sel.getChildByName("selbn").getChildByName("label").active = false;
            }else{
                this.sel.getChildByName("selbn").getComponent(cc.Button).interactable = true;
                this.sel.getChildByName("selbn").getComponent(cc.Sprite).spriteFrame = this.xuanze;
                this.sel.getChildByName("selbn").getChildByName("label").active = true;
            }
        }else{
            this.sel.getChildByName("selbn").active = false;
        }
    },
    Scroll_View:function(){

        //this.scrollView.node.on('scroll-to-top', this.callback, this);
        let row = 0;
        let col = 0;
        this.scrollView.getComponent(cc.ScrollView).content.height = ((dataScript.userInfo.Scan.length-1)/3+1)*240
        for (let index = 0; index < dataScript.userInfo.Scan.length; index++) {
            const element = dataScript.userInfo.Scan[index];
            let item = cc.instantiate(this.item);
            this.scrollView.getComponent(cc.ScrollView).content.addChild(item);

            let W = this.scrollView.getComponent(cc.ScrollView).content.width
            let H = this.scrollView.getComponent(cc.ScrollView).content.height
            row = index%3;
            col =parseInt((index)/3);
            item.setPosition(cc.v2(-W/2+200/2+row*200,-(240/2+col*240)));

            let key = `loadres/role/role${element.index}`
            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(key);
            item.getChildByName("name").getComponent(cc.RichText).string = element.name;
            item.getChildByName("name").color = this.selColor(element.index);
            item.getChildByName("tip").getChildByName("label").getComponent(cc.Label).string = element.tip;
            item.getChildByName("tip").active = false;
            item._tag = index;

            let have  = false;
            for (let j = 0; j < dataScript.userInfo.roleScan.length; j++) {
                const id_sc = dataScript.userInfo.roleScan[j];
                if(element.index == id_sc){
                    have = true;
                    break;
                }
            }

            
            if(!have){
                item.getChildByName("tip").active = true;
            }
            

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
    

    //菜单
    menu:function(event,customEventData){
        console.info(customEventData);
        if(customEventData=="back"){
            this.close();
        }else if(customEventData=="sel_ok"){
            dataScript.userInfo.roleSelScan = this.del_index;
            cc.sys.localStorage.setItem('roleSelScan',dataScript.userInfo.roleSelScan);
            this.sel_view();
        }else if("clickItem"){
            this.del_index = event.target._tag;
            if(this.preSelNode){
                this.preSelNode.getChildByName("selected").active = false;
            }
            event.target.getChildByName("selected").active = true;

            this.preSelNode = event.target;
            this.sel_view();
        }
     },
    close:function(){
        this.node.destroy();
        if(cc.find("Canvas").getComponent("mainScene")){
            cc.find("Canvas").getComponent("mainScene").updateUI();
        }
    }


});
