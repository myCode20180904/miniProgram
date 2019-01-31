var aiStage = require('./aiStage')
var g_define = require('../../public/g_define')
var dataScript = require('../../model/dataScript')
var aStar = require('../../utils/aStar')
var FloatSlerp = require('../game/FloatSlerp')

cc.Class({
    extends: cc.Component,

    properties: {
        idx:0,//信息id
        brunPos:cc.v2(0,0),

        //寻路移动部分
        m_route:[],//路线
        m_endPos:null,//保存路线的终点
        m_NextIndex:0,
        m_NextPos:0,
        is_Reverse:false,//反向
        
        //地图随机点
        rundMapPos:cc.v2(0,0),
        //移动状态
        state:"moveByRound",


        timer:0,
        //非碰撞下最后一次的速度
        lastTypeSpeed:0,

        body:cc.Node,
        _FloatSlerp:null,//碰撞向量差值
        _FloatSlerp2:null,//移动向量差值
        _FloatSlerpSkill:null,//技能向量差值
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._FloatSlerp = new FloatSlerp();
        this._FloatSlerp2 = new FloatSlerp();
        this._FloatSlerpSkill = new FloatSlerp();
    },

    start () {
        
    },
    onDestroy(){
        this.unschedule(this.playerupdate);
    },
    initRole:function(){
        if(dataScript.gamedata.playerList[this.idx].die){
            return;
        }
        this.schedule(this.playerupdate,0.02);
        this.changeRoute("moveByRound");
        this._FloatSlerp2.init(0,dataScript.gamedata.playerList[this.idx].startSpeed,0.4);
    },
    //public
    changeRoute:function(name){
        if(dataScript.gamedata.playerList[this.idx].die){
            return;
        }
        if(this.idx==0){
            return;
        }
        // console.info(name);
        this.state = name;
        switch (name) {
            case "moveByRound":
                this.moveByRound();
                break;
            case "AttackToRound":
                this.AttackToRound();
                break;
            case "Escape":
                this.Escape();
                break;
            default:
                break;
        }
       
    },
    //随机移动
    moveByRound:function(){
        var that = this;
        let scale = 1-dataScript.gamedata.map_reduce;
        let cell_l = dataScript.gamedata.map_cell;

        //随机一条路径
        let myPos = this.getRolePosInMap();
        let startPos = cc.v2(parseInt(myPos.x/(scale*cell_l)) ,parseInt(myPos.y/(scale*cell_l)));
        // console.info(startPos);
       
        let endPos = this.getRundMapPos();

        let route = new Array();
        route = aStar.findRote(startPos,endPos);
        if(route.length<1){
            console.warn("路径长度小于1:",startPos,endPos)
            // let reFound = cc.sequence(cc.delayTime(0.1),cc.callFunc(function(){
            //     that.changeRoute(that.state);
            // },this));
            // this.node.runAction(reFound);
        }else{
            this.stop();

            this.m_route = route;
            this.m_endPos = this.m_route[this.m_route.length-1]
            this.moveWithRoute();
        }

    },
    //寻到指定目标
    AttackToRound:function(){
        var that = this;
        let scale = 1-dataScript.gamedata.map_reduce;
        let cell_l = dataScript.gamedata.map_cell;

        //随机一条路径
        let myPos = this.getRolePosInMap();
        let startPos = cc.v2(parseInt(myPos.x/(scale*cell_l)) ,parseInt(myPos.y/(scale*cell_l)));
        // console.info(startPos);
        
        let endPos = this.getRundRolePos();

        let route = new Array();
        route = aStar.findRote(startPos,endPos);
        if(route.length<1){
            console.warn("路径长度小于1:",startPos,endPos)
          
        }else{
            this.stop();

            this.m_route = route;
            this.m_endPos = this.m_route[this.m_route.length-1]
            this.moveWithRoute();
        } 
    },
    //逃离当前目标
    Escape:function(){
        if(this.p_collison.curDir){
            let nowAttDir = this.p_collison.curDir;
            let angle = -90-g_define.getAngle(cc.v2(0,0),nowAttDir);
            let offAngel = 60-Math.random()*120;
            
            angle = angle+offAngel;
            
            //计算角度方向
            let getDir = cc.v2(0,0);
            let tmptotate = (angle%360)
            if(tmptotate<0){
                tmptotate = Math.abs(tmptotate)-90;
            }
            let hudu = Math.PI*tmptotate/180           
            // console.log("selfCollider.node.rotation: ",rotate,tmptotate,Math.sin(hudu));
            if(tmptotate==0){
                getDir = cc.v2(1,0);
            }else if(tmptotate==90){
                getDir = cc.v2(0,1);
            }else if(tmptotate==180){
                getDir = cc.v2(-1,0);
            }else if(tmptotate==270){
                getDir = cc.v2(0,-1);
            }else{
                getDir.x = Math.cos(hudu);
                getDir.y = Math.sin(hudu);
            }
            
            
            getDir = aiStage.getDir(cc.v2(0,0),getDir);

            if(getDir){
                this.p_collison.curDir = getDir;
            }

        }
        
    },

    stop:function(){
        this.body.stopActionByTag(21);
        this.m_route.splice(0,this.m_route.length);
    },

    stop_clear:function(){
        this.unschedule(this.playerupdate);
        this.body.stopActionByTag(21);
        this.m_route.splice(0,this.m_route.length);
        this.body.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
    },

    //
    getRundRolePos:function(){
        let pos = null;
        let scale = 1-dataScript.gamedata.map_reduce;
        let cell_l = dataScript.gamedata.map_cell;
        let gameScene = cc.find("Canvas").getComponent("gameScene");
        if(gameScene){
            let size = gameScene.players.length;
            let rand  = parseInt(Math.random()*size);
            for (let index = 0; index < size; index++) {
                const element = gameScene.players[index];
                if(element&&rand<=index&&index!=this.idx){
                    pos = element.getComponent("role").getRolePosInMap();
                    break;
                }

            }
            
        }
        if(pos){
            pos = cc.v2(parseInt(pos.x/(scale*cell_l)) ,parseInt(pos.y/(scale*cell_l)));
            return pos;
        }else{
            pos = this.getRundMapPos();
            return pos;
        }
    },

    //
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
        

    },

    //获取在地图坐标系当前位置
    getRolePosInMap:function(){
        let pos = this.body.getPosition().addSelf(this.brunPos);
        return pos;
    },

    //------------------------------------------------------------------------------------------------
    //                         playerupdate
    //------------------------------------------------------------------------------------------------
    playerupdate:function (dt) {
        this.timer++;
        if( !this.p_tail )
        {
            this.p_tail = this.node.getChildByName("tail")
        }
        if( !this.p_namebg )
        {
            this.p_namebg = this.node.getChildByName("namebg")
        }

        if( !this.p_collison )
        {
            this.p_collison = this.body.getComponent("collison")
        }

        if( !this.p_RigidBody )
        {
            this.p_RigidBody = this.body.getComponent(cc.RigidBody)
        }
        //

        //属性刷新
        {
            let info = dataScript.gamedata.playerList[this.idx];
            if(!info.die){
                //属性
                this.p_tail.setPosition(cc.v2(this.body.x,this.body.y));
                this.p_namebg.setPosition(cc.v2(this.body.x,this.body.y+40));
                if(this.timer%30==1){
                    this.updateLVScale();
                }
            } 
        }

         //处理角度- -！buy why
         if(this.next_angle){
             
            //-90 -450
            let changeAngel = (this.next_angle - this.body.rotation%360)
            if(changeAngel<-180){
                changeAngel = changeAngel+360;
            }
            if(changeAngel>180){
                changeAngel = 360-changeAngel;
                changeAngel = -changeAngel;
            }

            // if(this.idx==0){
            //     /**
            //      * 
            //      */
            //    console.info("id:",this.idx,"==",this.body.rotation,this.next_angle,changeAngel);
            // }
            if(Math.abs(changeAngel)>150){
                dataScript.gamedata.playerList[this.idx].speed=dataScript.gamedata.playerList[this.idx].speed/3;
                this._FloatSlerp2.init(dataScript.gamedata.playerList[this.idx].speed,dataScript.gamedata.playerList[this.idx].startSpeed,0.3);
            }
            if(this.idx==0){
                this.body.rotation = (this.body.rotation + changeAngel *dataScript.gamedata.playerList[this.idx].rotateSpeed)%360-360;
            }else{
                this.body.rotation = (this.body.rotation + changeAngel *dataScript.gamedata.playerList[this.idx].rotateSpeed/2)%360-360;
            }
            
        }
        //方向
        let __dir = dataScript.gamedata.playerList[this.idx].dir;
        let info = dataScript.gamedata.playerList[this.idx];
        let linearVelocity = cc.v2(0,0);
        let collisionLinearVelocity = cc.v2(0,0);
        {
            //新的移动向量
            if(this._FloatSlerp2._begin<this._FloatSlerp2._end){
                dataScript.gamedata.playerList[this.idx].speed = this._FloatSlerp2.acceleration(dt,2);
            }else{
                dataScript.gamedata.playerList[this.idx].speed = this._FloatSlerp2.deceleration(dt,2);
            }
            // dataScript.gamedata.playerList[this.idx].speed = this._FloatSlerp2.updateNumber(dt);
            info = dataScript.gamedata.playerList[this.idx];
            linearVelocity = cc.v2(__dir.x*info.speed,__dir.y*info.speed);

             //发现其他玩家的寻路的下一个节点
            //  if(this.idx!=0){
            //     let cell_l = dataScript.gamedata.map_cell;
            //     let scale = 1-dataScript.gamedata.map_reduce;
            //     //当前
            //     let nowPos = this.getRolePosInMap();
            //     //nextPos转换成缩放后像素坐标
            //     let nextPos = cc.v2(parseInt(this.m_NextPos.x*cell_l*scale) ,parseInt(this.m_NextPos.y*cell_l*scale));
            //     if(nowPos.subSelf(nextPos).mag()<5){
            //         this.moveNext();
            //     }
                
            // }
        }
        if(this.p_collison.isHitting){
            
            //新的撞击向量
            // let now_collisionSpeed = this._FloatSlerp.updateNumber(dt);
            let now_collisionSpeed = this._FloatSlerp.acceleration(dt,10);
            if(this.p_collison.curDir){
                collisionLinearVelocity = cc.v2(now_collisionSpeed*this.p_collison.curDir.x,now_collisionSpeed*this.p_collison.curDir.y)
            }
            
        }

        if(this.p_collison.isSkill){
             //
            let now_skillSpeed = this._FloatSlerpSkill.deceleration(dt,5);
            linearVelocity.addSelf(cc.v2(__dir.x*now_skillSpeed,__dir.y*now_skillSpeed));
        }

        this.p_RigidBody.linearVelocity = linearVelocity.addSelf(collisionLinearVelocity);
       
         
        
    },
    

    /**
     * 更新拖尾，体积
     */
    updateLVScale:function(){
        if( !this.p_tail )
        {
            this.p_tail = this.body.parent.getChildByName("tail")
        }
        let info = dataScript.gamedata.playerList[this.idx];
        //scale属性
        this.body.scale = info.startScale+(info.level-1)*0.05;
        this.p_tail.getComponent(cc.MotionStreak).stroke = 130*(0.3+(info.level-1)*0.05);
    },
    //------------------------------------------------------------------------------------------------
    //                         移动逻辑
    //------------------------------------------------------------------------------------------------

    moveWithRoute:function(){
        this.m_NextIndex = 0;
        this.moveNext();
    },

    moveNext:function(){
        if(this.m_route.length.length<1)
        return;

        if(this.m_NextIndex<this.m_route.length){
            // 下一个点
            this.m_NextPos = this.m_route[this.m_NextIndex];
            
            // console.info(`m_NextPos[${this.m_NextIndex}]:${this.m_NextPos}`);
            this.moveTo();
           
        }else{
            //原路返回
            this.m_route.reverse();
            this.moveWithRoute();
            
        }
    },

    moveTo:function(){
        var that = this;
        // if(this.body.getComponent("collison").isHitting)
        // {
        //     // console.info("move---isHitting");
        //     this.body.stopActionByTag(21);
        //     let complete = cc.sequence(cc.delayTime(0.1),cc.callFunc(function(){
        //         that.moveNext();
        //     },this));
        //     complete.setTag(21);
        //     this.body.runAction(complete);
        //     return;
        // }


        let cell_l = dataScript.gamedata.map_cell;
        let scale = 1-dataScript.gamedata.map_reduce;

        //起始
        let startPos = this.getRolePosInMap();

        //nextPos转换成缩放后像素坐标
        let nextPos = cc.v2(parseInt(this.m_NextPos.x*cell_l*scale) ,parseInt(this.m_NextPos.y*cell_l*scale));



        //test
        //  console.info("test:",startPos,nextPos);
        //  this.body.setPosition(cc.v2(0,0))
        //  cc.find("Canvas").getComponent("gameScene").addDarwDot(this.getRolePosInMap(),cc.color(255,255,0));
        //  if(cc.find("Canvas").getComponent("gameScene")){
        //     cc.find("Canvas").getComponent("gameScene").addDarwDot(startPos,cc.color(255,0,0));
        // }
        //  if(cc.find("Canvas").getComponent("gameScene")){
        //      cc.find("Canvas").getComponent("gameScene").addDarwLine(startPos,nextPos);
        //  }
         /* testend */

        //设定移动方向
        let __dir = aiStage.getDir(startPos,nextPos)
        if(__dir){
            let angle = -90-g_define.getAngle(startPos,nextPos);
            if(angle!=NaN){
                this.next_angle = angle;
                // this.body.stopActionByTag(20);
                // let rotate_action = cc.rotateTo(0.3,angle);
                // rotate_action.setTag(20);
                // this.body.runAction(rotate_action);
            }
            dataScript.gamedata.playerList[this.idx].dir = __dir;
        }

        /**
         * speed = linearVelocity.mag();
         * speed = info.speed = 80
         * 
         */

        //移动
        let info = dataScript.gamedata.playerList[this.idx];
        let offset = nextPos.subSelf(startPos);
        let dis = offset.mag();
        let dt = dis/info.speed;
        dt = dt>0.02?dt:0.02;
        dt = Math.min(dt,0.2);
        // this.body.getComponent(cc.RigidBody).linearVelocity = cc.v2(info.dir.x*info.speed,info.dir.y*info.speed);
        this.body.stopActionByTag(21);
        let complete = cc.sequence(cc.delayTime(dt),cc.callFunc(function(){
            this.m_NextIndex++;
            that.moveNext();
        },this));
        complete.setTag(21);
        this.body.runAction(complete);
    },



});
