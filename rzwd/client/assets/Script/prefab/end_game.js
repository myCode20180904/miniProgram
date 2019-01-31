var dataScript = require('../model/dataScript')
var plat = require('../plat/platScript')
var myToast = require('../public/myToast')

cc.Class({
    extends: cc.Component,

    properties: {
        kill_num:{
            default:null,
            type:cc.Node
        },
        rank_num:{
            default:null,
            type:cc.Node
        },
        score_num:{
            default:null,
            type:cc.Node
        },
        tip_lb:{
            default:null,
            type:cc.Node
        },
        win_farme:cc.SpriteFrame,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){}, this);
        
    },

    start () {
        console.info(this.win_loss,this.killed, this.rank,this.score);
        this.kill_num.getComponent(cc.Label).string = this.killed;
        this.rank_num.getComponent(cc.Label).string = this.rank;
        this.score_num.getComponent(cc.Label).string = this.score;
        if(this.score>dataScript.userInfo.score){
            dataScript.userInfo.score = this.score;
            cc.sys.localStorage.setItem('score',dataScript.userInfo.score);
        }
        if(dataScript.userInfo.score>dataScript.userInfo.maxScore){
            dataScript.userInfo.maxScore = dataScript.userInfo.score;
            cc.sys.localStorage.setItem('maxScore',dataScript.userInfo.maxScore);
        }
        if(this.win_loss == 1){
            dataScript.gamedata.pre_map_index = dataScript.gamedata.map_index;
            dataScript.gamedata.map_index++;
            console.info("endgame----------------");

            this.node.getChildByName("menu").getChildByName("jjtz").active = false;
            this.node.getChildByName("menu").getChildByName("mfbj1").active = false;
            this.node.getChildByName("menu").getChildByName("mfbj2").active = false;
            this.node.getChildByName("menu").getChildByName("next").active = true;
            this.node.getChildByName("win_los").getComponent(cc.Sprite).spriteFrame = this.win_farme;
            this.tip_lb.getComponent(cc.Label).string =   '前三名或全灭晋级成功';
        }else{
            dataScript.gamedata.pre_map_index = dataScript.gamedata.map_index;
            dataScript.gamedata.map_index--;
            if(dataScript.gamedata.map_index<=0){
                dataScript.gamedata.map_index =0;
            }

            if(dataScript.userInfo.baojika>0){
                this.node.getChildByName("menu").getChildByName("djbj").active = true;
                let baoji_lb = this.node.getChildByName("menu").getChildByName("djbj").getChildByName("num")
                baoji_lb.getComponent(cc.Label).string = `x${dataScript.userInfo.baojika}`
            }else{
                this.node.getChildByName("menu").getChildByName("mfbj1").active = true;
            }
            this.node.getChildByName("menu").getChildByName("jjtz").active = true;

            this.node.getChildByName("menu").getChildByName("mfbj2").active = true;
            this.node.getChildByName("menu").getChildByName("next").active = false;
            this.tip_lb.getComponent(cc.Label).string =   `挑战失败将下降至${dataScript.gamedata.map_index+1}层`;
        }

        cc.sys.localStorage.setItem('pre_map_index',dataScript.gamedata.pre_map_index);
        cc.sys.localStorage.setItem('map_index',dataScript.gamedata.map_index);
        //过关解锁
        if(dataScript.gamedata.map_index==4){
            if(dataScript.userInfo.roleScan.indexOf(1)==-1){
                dataScript.userInfo.roleScan.push(1);
                cc.sys.localStorage.setItem('roleScan',JSON.stringify(dataScript.userInfo.roleScan));
                this.showRewardScan(1);
            }
        }
        if(dataScript.gamedata.map_index==9){
            if(dataScript.userInfo.roleScan.indexOf(3)==-1){
                dataScript.userInfo.roleScan.push(3);
                cc.sys.localStorage.setItem('roleScan',JSON.stringify(dataScript.userInfo.roleScan));
                this.showRewardScan(3);
            }
        }
        if(dataScript.gamedata.map_index==19){
            if(dataScript.userInfo.roleScan.indexOf(6)==-1){
                dataScript.userInfo.roleScan.push(6);
                cc.sys.localStorage.setItem('roleScan',JSON.stringify(dataScript.userInfo.roleScan));
                this.showRewardScan(6);
            }
        }
        if(dataScript.gamedata.map_index==39){
            if(dataScript.userInfo.roleScan.indexOf(9)==-1){
                dataScript.userInfo.roleScan.push(9);
                cc.sys.localStorage.setItem('roleScan',JSON.stringify(dataScript.userInfo.roleScan));
                this.showRewardScan(9);
            }
        }
        if(dataScript.gamedata.map_index==59){
            if(dataScript.userInfo.roleScan.indexOf(11)==-1){
                dataScript.userInfo.roleScan.push(11);
                cc.sys.localStorage.setItem('roleScan',JSON.stringify(dataScript.userInfo.roleScan));
                this.showRewardScan(11);
            }
        }


        let data = {
            name:'setUserCloudStorage',
            res:{
                score:dataScript.userInfo.maxScore,
            }
        }
        plat.sendMessageToChild(data);
    },

    close:function(){
        this.node.destroy();
    },

    baojiSuc:function(){

    },
    
    showRewardScan:function(index){
        
        myToast.show(2.0,"恭喜获得皮肤："+dataScript.userInfo.Scan[index].name);
    },
    //菜单
    menu:function(event,customEventData){
        // console.info(event);
        console.info(customEventData);
        if(customEventData=="back"){
            cc.director.loadScene("mainScene",function(){
                if(cc.find("Canvas").getComponent("mainScene")){
                    cc.find("Canvas").getComponent("mainScene").updateUI();
                }
            })
            
        
        }else if(customEventData=="mfbj1"){
            plat.createRewardedVideoAd({
                onLoad:function(){

                },
                onClose:function(res){
                    if(res){
                        cc.find("Canvas").getChildByName("end_game").getComponent("end_game").baoji();
                    }
                }
            });
        
        }else if(customEventData=="mfbj2"){
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
                cc.find("Canvas").getChildByName("end_game").getComponent("end_game").baoji();
                console.info(res)

            });
    
        }else if(customEventData=="jjtz"){
            cc.director.loadScene("mainScene",function(){
                dataScript.gamedata.startGame();
            });
        }else if(customEventData=="rank"){
            myToast.showPrefab("prefab/rank",function(pSender,extInfo){
                console.info(pSender);
                console.info(extInfo);
            },{data:customEventData});
        }else if(customEventData=="yaoqing"){
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
        }else if(customEventData=="share"){
            myToast.showPrefab("prefab/shareGift",function(pSender,extInfo){
                console.info(pSender);
                console.info(extInfo);
            },{data:customEventData});
        }else if(customEventData=="next"){
            cc.director.loadScene("mainScene",function(){
                dataScript.gamedata.startGame();
            });
            
        }else if(customEventData=="djbj"){
            dataScript.userInfo.baojika--;
            cc.sys.localStorage.setItem('baojika',dataScript.userInfo.baojika);
            this.baoji();
            
        
        }
 
     },

     //保级
     baoji:function(){
        dataScript.gamedata.map_index = dataScript.gamedata.pre_map_index;
        dataScript.gamedata.pre_map_index = dataScript.gamedata.map_index;

        cc.sys.localStorage.setItem('pre_map_index',dataScript.gamedata.pre_map_index);
        cc.sys.localStorage.setItem('map_index',dataScript.gamedata.map_index);

        cc.director.loadScene("mainScene",function(){
            if(cc.find("Canvas").getComponent("mainScene")){
                cc.find("Canvas").getComponent("mainScene").updateUI();
                myToast.show(2.0,"保级成功");
            }
        })
        
     },


});
