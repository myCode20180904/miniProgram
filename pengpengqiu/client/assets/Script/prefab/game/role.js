var aiStage = require('./aiStage')
var g_define = require('../../public/g_define')
var dataScript = require('../../model/dataScript')
var aStar = require('../../utils/aStar')

cc.Class({
    extends: cc.Component,

    properties: {
        idx:0,
        m_route:new Array(),
        rundMapPos:cc.v2(0,0),
        state:"moveByRound",
        body:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        
    },
    //public
    changeRoute:function(name){
        if(dataScript.gamedata.playerList[this.idx].die){
            return;
        }
        this.state = name;
        if(name=="moveByRound"){
            // this.stop();
            this.moveByRound();
        }else if(name=="moveToDest"){
            this.moveToDest();
        }
    },
    //随机移动
    moveByRound:function(){
        // console.info("role moveByRound",this.idx);
        
        let scale = 1-dataScript.gamedata.map_reduce;
        let cell_l = dataScript.gamedata.map_cell;

        let myPos = this.body.convertToWorldSpaceAR(this.body.getPosition());
        myPos.x = myPos.x-cc.winSize.width/2
        myPos.y = myPos.y-cc.winSize.height/2
        let startPos = cc.v2(parseInt(myPos.x/cell_l) ,parseInt(myPos.y/cell_l));
        let endPos = this.getRundMapPos();


        let route = new Array();
        route = aStar.findRote(startPos,endPos,route);
        if(route.length<1){
            // console.error("errrrr -- ")
        }else{
            this.moveWithRoute(route);
        }

    },
    //寻到指定目标
    moveToDest:function(endPos){
        console.info("moveToDest");
        let cell_l = dataScript.gamedata.map_cell;
        let myPos = this.body.convertToWorldSpaceAR(this.body.getPosition());
        myPos.x = myPos.x-cc.winSize.width/2
        myPos.y = myPos.y-cc.winSize.height/2
        let startPos = cc.v2(parseInt(myPos.x/cell_l) ,parseInt(myPos.y/cell_l));

        let route = new Array();
        route = aStar.findRote(startPos,endPos,route);
        if(route.length<1){
            //console.error("errrrr -- ")
        }else{
            this.moveWithRoute(route);
        }

        
        
    },
    stop_clear:function(){
        this.m_route.splice(0,this.m_route.length);
        this.body.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
    },

    //------------------------------------------------------------------------------------------------

    moveWithRoute:function(route){
        this.m_route = route.reverse();
        this.move();
        // this.unschedule(this.gameupdate);
        // this.schedule(this.gameupdate,0.1);
    },

    move:function(){
        if(this.body.getComponent("collison").isHitting)
        {
            // console.info("move---isHitting");
            var that = this;
            this.body.stopActionByTag(21);
            let complete = cc.sequence(cc.delayTime(0.1),cc.callFunc(function(){
                that.move();
            },this));
            complete.setTag(21);
            this.body.runAction(complete);
            return;
        }
        if(this.m_route.length>0){
            const pre = this.m_route.pop();
            let cell_l = dataScript.gamedata.map_cell;

            let startPos = this.body.convertToWorldSpaceAR(this.body.getPosition());
            startPos.x = startPos.x-cc.winSize.width/2
            startPos.y = startPos.y-cc.winSize.height/2
            // console.info("role move:",startPos);
            // nextPos转换成缩放后像素坐标
            let scale = 1-dataScript.gamedata.map_reduce;
            let nextPos = cc.v2(parseInt(pre.x*cell_l*scale) ,parseInt(pre.y*cell_l*scale));

            // console.info("role move:",nextPos);

            let flag = false;
            if(cc.find("Canvas").getComponent("gameScene")){
                if(!cc.find("Canvas").getComponent("gameScene").pbMap.isSafeAera(nextPos))
                {
                    //flag = true;
                    
                    console.info("because len flag true");
                }
            }

            if(!flag){
                let __dir = aiStage.getDir(startPos,nextPos)
                if(__dir){
                    let angle = -90-g_define.getAngle(startPos,nextPos);
                    if(angle!=NaN){
                        this.body.stopActionByTag(20);
                        // this.body.rotation = angle-180;
                        let rotate_action = cc.rotateTo(0.3,angle);
                        rotate_action.setTag(20);
                        this.body.runAction(rotate_action);
                    }
                    let dis = Math.sqrt((nextPos.x-startPos.x)*(nextPos.x-startPos.x)+(nextPos.y-startPos.y)*(nextPos.y-startPos.y));
                    this.enemy_move(__dir,dis);
                }
            }
            

        }else{

            this.changeRoute(this.state);
            
        }

        
    },

    enemy_move:function(__dir,dis){
        dataScript.gamedata.playerList[this.idx].dir = __dir;
    
        let Velocity = this.body.getComponent(cc.RigidBody).linearVelocity;
        let rate = Math.sqrt(Velocity.x*Velocity.x+Velocity.y*Velocity.y)/Math.sqrt(__dir.x*__dir.x+__dir.y*__dir.y);
        this.body.getComponent(cc.RigidBody).linearVelocity = cc.v2(__dir.x*rate,__dir.y*rate);


        var that = this;
        let cell_l = dataScript.gamedata.map_cell;
        Velocity =  this.body.getComponent(cc.RigidBody).linearVelocity;
        let speed = Math.sqrt(Velocity.x*Velocity.x+Velocity.y*Velocity.y)
        let dt = dis/speed;
        // console.info("enemy_move :",dt);
        this.body.stopActionByTag(21);
        let complete = cc.sequence(cc.delayTime(dt),cc.callFunc(function(){
            that.move();
        },this));
        complete.setTag(21);
        this.body.runAction(complete);
    },
    
    

    gameupdate:function(dt) {
        
    },

    getRundMapPos:function(){
        this.getRandPos();
        // if(cc.find("Canvas").getComponent("gameScene")){
        //     let cell_l = dataScript.gamedata.map_cell;
        //     // nextPos转换成缩放后像素坐标
        //     let scale = 1-dataScript.gamedata.map_reduce;
        //     cc.find("Canvas").getComponent("gameScene").addTestPoint(cc.v2(this.rundMapPos.x*cell_l*scale,this.rundMapPos.y*cell_l*scale));
        // }
        return this.rundMapPos;
    },
    getRandPos:function(){
        try {
            var that = this;
            let size = dataScript.gamedata.mapArea_safe.size;
            let rand  = parseInt(Math.random()*size);

            let count = 0;
            dataScript.gamedata.mapArea_safe.forEach(function (value, key, map) {
                // value: 指向当前元素的值
                // key: 指向当前索引
                // map: 指向map对象本身
                if(count == rand){
                    that.rundMapPos = value.point;
                    throw new Error("getRandPos")
                }
                count++;
            });

        }  catch (error) {
            if(error.message!="getRandPos"){
                throw error;
            }
        }
        

    }




});
