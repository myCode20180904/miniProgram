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
            if(index<5){
                node.setPosition(cc.v2(-190+index*98,176));
            }else if(index>=5&&index<10){
                node.setPosition(cc.v2(-190+(index-5)*98,76));
            }else if(index>=10&&index<15){
                node.setPosition(cc.v2(-190+(index-10)*98,-24));
            }
            that.node.addChild(node);
            let round = parseInt(Math.random()*dataScript.gamedata.imageUrlList.length)
            let imgurl = round<dataScript.gamedata.imageUrlList.length?dataScript.gamedata.imageUrlList[round]:"";
            g_define.loadHttpIcon(img,imgurl,function(){
                that.finishCount++;
                that.process.getComponent(cc.Label).string = that.finishCount+'/'+that.people_num;
            });

            
        }

        this.loadMapTexture();

    },
    delLoadRes:function(dt){
        if(this.finishCount == this.people_num){
            if(window.wx){
                if(this.bgCount == 16){
                    this.unschedule(this.delLoadRes);
                    if(this.map){
                        this.loadRes(this.map);
                    }
                }
            }else{
                this.unschedule(this.delLoadRes);
                if(this.map){
                    this.loadRes(this.map);
                }
            }
            
        }
        
    },
    loadRes:function(map){

        //地图点阵
        let cell_l = dataScript.gamedata.map_cell;
        // console.info(this.pbMap.isSafeAera(cc.v2(0,0)))
        // console.info(this.pbMap.isSafeAera(cc.v2(3,3))) 
        for (let i = -map.bg.width/(2*cell_l); i < map.bg.width/(2*cell_l); i++) {
            for (let j = -map.bg.width/(2*cell_l); j < map.bg.width/(2*cell_l); j++) {
                if(map.isMapAera(cc.v2(i*cell_l,j*cell_l))){
                    // console.info(cc.v2(i,j));
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

        aStar.setMap(dataScript.gamedata.mapArea_10);
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
        let mapindex = dataScript.gamedata.map_index;
        var that = this;
        var localNode = cc.find("localNode").getComponent("localNodeScript");
        for (let index = 2; index < 16; index++) {
            let url = config.service.imgUrl + `/map/map${index}.png`;
            let name = `map_map${index}_png`;
            if(!dataScript.common.textureRes.has(name)){
                localNode.loadHttpPng(url,name,function(){
                    that.bgCount++;
                    if(that.map.mapUrl == name){
                        that.map.node.getChildByName("map").getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(name);
                    }
                });
            }else{
                that.bgCount++;
            }
        }

        for (let index = 1; index < 3; index++) {
            let url = config.service.imgUrl + `/map/bg${index}.png`;
            let name = `map_bg${index}_png`;
            if(!dataScript.common.textureRes.has(name)){
                localNode.loadHttpPng(url,name,function(){
                    that.bgCount++;
                    if(that.map.bgUrl == name){
                        that.map.node.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(name);
                    }
                });
            }else{
                that.bgCount++;
            }
            
            
        }

        
    }

});
