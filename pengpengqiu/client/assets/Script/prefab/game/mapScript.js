var dataScript = require('../../model/dataScript')

cc.Class({
    extends: cc.Component,

    properties: {
        map:{
            default:null,
            type:cc.Node
        },
        bg:{
            default:null,
            type:cc.Node
        },
        safeArea:{
            default:null,
            type:cc.Node
        },
        enemys:{
            default:null,
            type:cc.Node
        },
        bgUrl:"map_bg1_png",
        mapUrl:""
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.loadBG();
    },

    start () {

    },
    loadBG:function(){
        
        if(dataScript.common.textureRes.get(this.bgUrl)){
            this.node.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(this.bgUrl);
        }else{

        }

        if(dataScript.common.textureRes.get(this.mapUrl)){
            this.node.getChildByName("map").getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(this.mapUrl);
        }else{
            
        }
    },

    isMapAera:function(pos){
        // 如果是其他类型的碰撞组件，也可以在 cc.Intersection 中找到相应的测试函数
        let hit = false;
        if(this.map.getComponent(cc.CircleCollider)){
            //console.info(pos)
            let offset = this.map.getComponent(cc.CircleCollider).offset;
            let radius = this.map.getComponent(cc.CircleCollider).radius;
            // console.info({position:offset,radius:radius});
            if (cc.Intersection.circleCircle({position:pos,radius:1}, {position:offset,radius:radius})) {
                hit = true;
            } 
        }
        if(this.map.getComponent(cc.PolygonCollider)){
            // console.info(this.map.getComponent(cc.PolygonCollider))
            // console.info(this.map.getComponent(cc.PolygonCollider).world.points);
            if (cc.Intersection.pointInPolygon(pos, this.map.getComponent(cc.PolygonCollider).points)) {
                hit = true;
            } 
        }
       
        return hit;
    },
    isSafeAera:function(pos){
        // 如果是其他类型的碰撞组件，也可以在 cc.Intersection 中找到相应的测试函数
        let hit = false;
        if(this.safeArea.getComponent(cc.CircleCollider)){
            let offset = this.safeArea.getComponent(cc.CircleCollider).offset;
            let radius = this.safeArea.getComponent(cc.CircleCollider).radius;
            if (cc.Intersection.circleCircle({position:pos,radius:1}, {position:offset,radius:radius})) {
                hit = true;
            } 
        }
        if(this.safeArea.getComponent(cc.PolygonCollider)){
            //console.info(pos)
            //console.info(this.map.getComponent(cc.PolygonCollider))
            if (cc.Intersection.pointInPolygon(pos, this.safeArea.getComponent(cc.PolygonCollider).points)) {
                hit = true;
            } 
        }
       
        return hit;
    },

    updateSafe:function(){
        let cell_l = dataScript.gamedata.map_cell;
        var that = this;
        dataScript.gamedata.mapArea_safe.forEach(function (value, key, map) {
            // value: 指向当前元素的值
            // key: 指向当前索引
            // map: 指向map对象本身
            if(!that.isSafeAera(cc.v2(value.point.x*cell_l,value.point.y*cell_l))){
                console.info("updateSafe delete ",value);
                dataScript.gamedata.mapArea_safe.delete(key);
            }

            // if(cc.find("Canvas").getComponent("gameScene")){
            //     let scale = 1-dataScript.gamedata.map_reduce;
            //     cc.find("Canvas").getComponent("gameScene").addTestPoint(cc.v2(value.point.x*cell_l*scale,value.point.y*cell_l*scale));
            // }
        });

        
    },
    updateScale:function(scale){
        // this.map.scale = scale;
        this.map.runAction(cc.scaleTo(0.3,scale))
        // this.safeArea.scale = scale;
        this.safeArea.runAction(cc.scaleTo(0.3,scale))
    }
    // update (dt) {},
});
