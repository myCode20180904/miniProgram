var plat = require('../plat/platScript')
var myToast = require('../public/myToast')
var bannerAd = require('../public/bannerAd')
var config = require('../public/config')
var dataScript = require('../model/dataScript')

cc.Class({
    extends: bannerAd.obj,

    properties: {
        lingqu: {
            default: null,    
            type: cc.Node,
        },
        item: {
            default: null,    
            type: cc.Node,
        },
        item7: {
            default: null,    
            type: cc.Node,
        },
        closeBn: {
            default: null,    
            type: cc.Node,
        },
        yilingqu:cc.SpriteFrame,
        prop0:cc.SpriteFrame,
        prop1:cc.SpriteFrame,
        prop2:cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        console.info("daysign onLoad");
        this._onLoad();

    },
    onDestroy(){
        console.info("daysign onDestroy");
        this._onDestroy();
    },

    start () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){ }, this);
        this.node.getChildByName("db").on(cc.Node.EventType.TOUCH_START,function(event){}, this);


        
      this.refreshUI();
    },

    // update (dt) {},

    menu:function(event,customEventData){
        
        var that = this;
        if(customEventData=="close"){
            that.close();
        }else if(customEventData=="lingqu"){
            this.sign();
        }else{
            plat.request({
                url:config.service.apiUrl+"/hello",
                data:{
                   name:"testreq"
                },
                success:function(res){
    
                },
                fail:function(err){
                    console.error(err);
                }
            })
        }
        
    },
    sign:function(){

         //登陆奖励
         let day_index = dataScript.userInfo.loginDay-1;
         console.info("sign",day_index);
         try {
            // if(day_index>0&&day_index<7){
          
            // }
            if(dataScript.userInfo.daySign[day_index].prop==0){
                dataScript.userInfo.fuhuoka+=dataScript.userInfo.daySign[day_index].num;
                cc.sys.localStorage.setItem('fuhuoka',dataScript.userInfo.fuhuoka);
            }
            if(dataScript.userInfo.daySign[day_index].prop==1){
                dataScript.userInfo.baojika+=dataScript.userInfo.daySign[day_index].num;
                cc.sys.localStorage.setItem('baojika',dataScript.userInfo.baojika);
            }
            if(dataScript.userInfo.daySign[day_index].prop==2){
                if(dataScript.userInfo.roleScan.indexOf(8)==-1){
                    dataScript.userInfo.roleScan.push(8);
                    cc.sys.localStorage.setItem('roleScan',JSON.stringify(dataScript.userInfo.roleScan));

                    myToast.show(2.0,"恭喜获得皮肤："+dataScript.userInfo.Scan[8].name);
                }
            }
            if(dataScript.userInfo.daySign[day_index].prop==3){
                if(dataScript.userInfo.roleScan.indexOf(12)==-1){
                    dataScript.userInfo.roleScan.push(12);
                    cc.sys.localStorage.setItem('roleScan',JSON.stringify(dataScript.userInfo.roleScan));

                    myToast.show(2.0,"恭喜获得皮肤："+dataScript.userInfo.Scan[12].name);
                }
            }
         } catch (error) {
             
         }
        


        //今日登陆状态
        dataScript.userInfo.todaySign = 1;
        cc.sys.localStorage.setItem('todaySign',1);
       
        if(cc.find("Canvas").getComponent("mainScene")){
            cc.find("Canvas").getComponent("mainScene").updateUI();
        }
        this.refreshUI();

    },

    refreshUI:function(){
        //今天已签到
        if(dataScript.userInfo.todaySign==1){
            this.lingqu.getComponent(cc.Button).enableAutoGrayEffect = true;
            this.lingqu.getComponent(cc.Button).interactable = false;
        }else{
            this.lingqu.getComponent(cc.Button).enableAutoGrayEffect = false;
            this.lingqu.getComponent(cc.Button).interactable = true;
        }

        if(dataScript.userInfo.loginDay-1 == 6){
            if(dataScript.userInfo.todaySign==1){
                this.item7.getChildByName("state").active = true;
            }
        }
        console.info(dataScript.userInfo.daySign,dataScript.userInfo.loginDay,dataScript.userInfo.todaySign);

        let dayname = ["壹","贰","叁","肆","伍","陆","柒"];
        //
        for (let index = 0; index <dataScript.userInfo.daySign.length-1; index++) {
            var item = cc.instantiate(this.item);
            item.active = true;
            var data = dataScript.userInfo.daySign[index];
            this.node.addChild(item);
            if(index<3){
                item.setPosition(cc.v2(-146+154*index,184));
            }else{
                item.setPosition(cc.v2(-146+154*(index-3),-8));
            }

            item.getChildByName("day_lb").getComponent(cc.RichText).string =  `<outline color=#ffffff width=1><color=#435168>${dayname[index]}</c></outline>`
            if(index==dataScript.userInfo.loginDay-1){
                if(dataScript.userInfo.todaySign==1){
                    item.getChildByName("state").active = true;
                }
            }else if(index<dataScript.userInfo.loginDay-1){
                item.getChildByName("state").active = true;               
            }
            
            if(data.prop==0){
                item.getChildByName("desc").getComponent(cc.RichText).string = `<outline color=#ffffff width=1><color=#435168>复活卡x${data.num}</c></outline>`
                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.prop0;

            }else if(data.prop==1){
                item.getChildByName("desc").getComponent(cc.RichText).string = `<outline color=#ffffff width=1><color=#435168>保级卡x${data.num}</c></outline>`
                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.prop1;
            }else if(data.prop==2){
                item.getChildByName("desc").getComponent(cc.RichText).string = `<outline color=#ffffff width=1><color=#D379F6>迪达拉x${data.num}</c></outline>`
                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.prop2;
            }

        }
    },

    close:function(){
        this.node.destroy();
        if(cc.find("Canvas").getComponent("mainScene")){
            cc.find("Canvas").getComponent("mainScene").updateUI();
        }
    }


});
