var dataScript = require('../model/dataScript')
var aStar = require('../utils/aStar')
var g_define = require('../public/g_define')
var config = require('../public/config')

cc.Class({
    extends: cc.Component,

    properties: {
        item:{
            default:null,
            type:cc.Node
        },
        process:{
            default:null,
            type:cc.Node
        },
        people_num:10,
        finishCount:0,
        bgCount:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){}, this);
    },

    start () {
        this.schedule(this.delLoadRes,1.0);

        var that = this;
        this.people_num = dataScript.gamedata.playerList.length;
        this.people_num = (this.people_num<=15?this.people_num:15)
        for (let index = 0; index < this.people_num; index++) {
            var node = cc.instantiate(this.item);
            node.active = true;
            let img =  node.getChildByName("img");//dataScript.gamedata.imageUrlList[0]
            if(index<4){
                node.setPosition(cc.v2(-155+index*110,148));
            }else if(index>=4&&index<8){
                node.setPosition(cc.v2(-155+(index-4)*110,36));
            }else if(index>=8&&index<15){
                node.setPosition(cc.v2(-155+(index-8)*110,-76));
                node.active = false;
            }
            that.node.addChild(node);
            let round = parseInt(Math.random()*dataScript.gamedata.imageUrlList.length)
            let imgurl = round<dataScript.gamedata.imageUrlList.length?dataScript.gamedata.imageUrlList[round]:"";
            if(round<13){
                img.rotation = 180
            }
            g_define.loadHttpIcon(img,imgurl,function(){
                that.finishCount++;
                that.process.getComponent(cc.Label).string = that.finishCount+'/'+that.people_num;
            });

            
        }


    },
    delLoadRes:function(dt){
        if(this.finishCount == this.people_num){
            if(this.bgCount>2){
                this.unschedule(this.delLoadRes);
                if(this.map){
                    this.loadRes(this.map);
                }
            }else{
                this.loadMapTexture();
            }
            
        }
        
    },
    loadRes:function(map){

        //地图点阵
        let cell_l = dataScript.gamedata.map_cell;
        let bianjie = parseInt(map.bg.width/(2*cell_l));//地图1/2宽
        for (let i = -bianjie; i < bianjie; i++) {
            for (let j = -bianjie; j < bianjie; j++) {
                if(map.isMapAera(cc.v2(i*cell_l,j*cell_l))){
                    dataScript.gamedata.mapArea_10.set(dataScript.gamedata.tomapkey(cc.v2(i,j)),{
                        point:cc.v2(i,j),
                        type:0
                    })
                    if(map.isSafeAera(cc.v2(i*cell_l,j*cell_l))){
                        dataScript.gamedata.mapArea_safe.set(dataScript.gamedata.tomapkey(cc.v2(i,j)),{
                            point:cc.v2(i,j),
                            type:0
                        })
                    }
                }
            }
        }

        //设置寻路地图
        aStar.setMap(dataScript.gamedata.mapArea_10);
        aStar.setSafeMap(dataScript.gamedata.mapArea_safe);
        // console.info(dataScript.gamedata.mapArea_safe);

        this.end();
    },

    end:function(dt){
        if(this.callBack){
            this.callBack();
        }

        this.close();
    },

    close:function(){
        this.node.destroy();
    },
    

    //加载地图图片资源
    loadMapTexture:function(){

        var that = this;
         //map/map1.png
         dataScript.common.loadHttpPng(that.map.mapUrl,function(spriteFrame){
            that.map.node.getChildByName("map").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            that.bgCount++;
        });

        dataScript.common.loadHttpPng(that.map.bgUrl,function(spriteFrame){
            that.map.node.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            that.bgCount++;
        });

        
    }

});
