var g_define = require('./public/g_define')
var dataScript = require('./model/dataScript')
var myToast = require('./public/myToast')
var aiStage = require('./prefab/game/aiStage')
var config = require('./public/config')


cc.Class({
    extends: cc.Component,

    properties: {
        map:{
            default:null,
            type:cc.Node
        },
        rolePb:{
            default:null,
            type:cc.Node
        },
        control:{
            default:null,
            type:cc.Node
        },
        moveCamera:{
            default:null,
            type:cc.Node
        },
        pause:{
            default:null,
            type:cc.Node
        },
        level:{
            default:null,
            type:cc.Node
        },
        testPoint:{
            default:null,
            type:cc.Node
        },
        timer:0,
        isControl:false,
        pauseNodes:Array,
        endPause:false,
    },


    onLoad () {
        
        //开起物理
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags= cc.PhysicsManager.DrawBits.e_aabbBit |
        //                                                 cc.PhysicsManager.DrawBits.e_pairBit |
        //                                                 cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //                                                 cc.PhysicsManager.DrawBits.e_jointBit |
        //                                                 cc.PhysicsManager.DrawBits.e_shapeBit;
        // cc.director.getPhysicsManager().debugDrawFlags = 0;

        this.loadMap();
        this.pause.active = false;
    },

    start () {   
    },

    loadMap:function(){
        var that = this;
        dataScript.gamedata.haveFuHuo = 1;
        dataScript.gamedata.map_reduce = 0;
        //加载游戏
        console.info("开始加载游戏资源",dataScript.gamedata.map_index);
        //加载地图
        let mapindex = dataScript.gamedata.map_index;
        this.level.getComponent(cc.Label).string = `第${mapindex+1}层\n${dataScript.gamedata.playerList.length}/${dataScript.gamedata.playerList.length}`;
        if(mapindex>=14){
            mapindex = parseInt(Math.random()*15);
        }
        // mapindex = 0;
        let mapurl = 'prefab/game/mapPb_'+mapindex;
        cc.loader.loadRes(mapurl, function (err, prefab) {
            console.info("正在加载地图...");
            if(err){
                console.info("无法加载地图...",err);
                return;
            }
            var node = cc.instantiate(prefab);
            node.active = true;
            that.map.removeAllChildren();
            that.map.addChild(node);
            node.setPosition(0,0);

            that.pbMap = node.getComponent("mapScript");

            //开始匹配
            console.info("开始匹配");
            myToast.showPrefab("prefab/pipei",function(pSender,extInfo){

                pSender.getComponent("peipi").map = that.pbMap;
                pSender.getComponent("peipi").callBack = function(){ 
                    extInfo.data.loadgame(); 
                    extInfo.data.readyGo();
                    extInfo.data.pbMap.loadBG();
                }
                
            
            },{data:that});

        });


      
    },
    loadgame:function(){
   
        //玩家列表初始
        this.players = new Array()
        for (let index = 0; index < dataScript.gamedata.playerList.length; index++) {
            const element = dataScript.gamedata.playerList[index];
            var roleitem = cc.instantiate(this.rolePb);
            roleitem.active = true;
            // roleitem.setPosition(element.pos);
            let cell_l = dataScript.gamedata.map_cell;

            let rund_pos = aiStage.getRundMapPos();
            roleitem.setPosition(cc.v2(rund_pos.x*cell_l,rund_pos.y*cell_l));
            // this.addTestPoint(cc.v2(rund_pos.x*cell_l,rund_pos.y*cell_l));
            if(index==0){
                roleitem.setPosition(cc.v2(0,0));
                if(this.pbMap.node.getChildByName("setpos")){
                    roleitem.setPosition(this.pbMap.node.getChildByName("setpos").getPosition());
                }
                
            }
            this.pbMap.enemys.addChild(roleitem);

            //属性
            roleitem.getChildByName("body").setPosition(cc.v2(0,0));
            roleitem.getChildByName("body").active = true;
            roleitem.getChildByName("body").scale = element.startScale*0.25+(element.level-1)*0.05;
            //roleitem.getChildByName("namebg").y = roleitem.getChildByName("body").height*roleitem.getChildByName("body").scale/2+10;
            let key = `loadres/role/role${element.scan}`
            roleitem.getChildByName("body").getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(key);
            roleitem.getChildByName("namebg").getChildByName("name").getComponent(cc.Label).string = element.name;
            if(index==0){
                roleitem.getChildByName("namebg").active = false;
            }
            

            //物理属性
            var rigidbody = roleitem.getChildByName("body").getComponent(cc.RigidBody);
            rigidbody.active = false;
            rigidbody.enabledContactListener = true;
            rigidbody.awake = true;

            roleitem.getChildByName("body").getComponent(cc.PhysicsCircleCollider).tag = index;
            roleitem.getChildByName("body").getComponent(cc.CircleCollider).tag = index;
            roleitem.getComponent("role").idx = index;

            this.players.push(roleitem);
        }
        this.player = this.players[0];//主角
        dataScript.gamedata.leftPeoPle = this.players.length;

        
        var tmpbbb = this.player.getChildByName("body").getComponent(cc.RigidBody);
        this.moveCamera.setPosition(cc.v2(tmpbbb.x+this.player.getPosition().x,tmpbbb.y+this.player.getPosition().y));
        console.info("-----------------");
    },

    readyGo:function(){
        myToast.showPrefab("prefab/game/readyGo",function(pSender,extInfo){

            pSender.getComponent("readyGo").callBack = function(){
                console.info("开始游戏");   
                pSender.y = 120; 
                extInfo.data.startGame();
            }
            
        
        },{data:this});
    },
    startGame:function(){
        dataScript.gamedata.gameend = 0;

        this.pause.active = true;
        this.control.active = false;
        this.addControl();
        this.dir = cc.v2(0,1);
        this.schedule(this.gameupdate,0.01);
        //
        for (let index = 0; index < this.players.length; index++) {
            const roleitem = this.players[index];
            const element = dataScript.gamedata.playerList[index];
            var rigidbody = roleitem.getChildByName("body").getComponent(cc.RigidBody);
            rigidbody.active = true;
            roleitem.getChildByName("body").getComponent("collison").enabled = true;


            //随机开始方向
            {
                roleitem.getChildByName("body").getComponent("collison").isHitting = false;
                let round_pre = cc.v2(Math.random()*5,Math.random()*5);
                let round_now = cc.v2(Math.random()*5,Math.random()*5);
                let rounddir = aiStage.getDir(round_pre,round_now);
                
                if(rounddir){
                    let angle = -90-g_define.getAngle(round_pre,round_now);
                    if(angle!=NaN){
                        console.info(angle);
                        roleitem.getChildByName("body").rotation = angle;
                    }
                    dataScript.gamedata.playerList[index].dir = rounddir;
                    // rigidbody.applyForceToCenter(cc.v2(rounddir.x*element.speed,rounddir.y*element.speed));
                    rigidbody.linearVelocity=(cc.v2(rounddir.x*element.speed,rounddir.y*element.speed));
                }else{
                    dataScript.gamedata.playerList[index].dir = cc.v2(0,1);
                    // rigidbody.applyForceToCenter(cc.v2(0,element.speed));
                    rigidbody.linearVelocity=(cc.v2(0,element.speed));
                }
            
            }

            //开始随机移动
            if(index!=0){
                roleitem.getComponent("role").changeRoute("moveByRound");
            }
            
        }



        this.updateLVScale();

    },

    role_move:function(__dir){
        this.dir = cc.v2(__dir.x,__dir.y);
        dataScript.gamedata.playerList[0].dir = this.dir;
        let rolebody = this.player.getChildByName("body");
        if(rolebody.getComponent("collison").isHitting){
            return;
        }
        let Velocity = rolebody.getComponent(cc.RigidBody).linearVelocity;
        let rate = Math.sqrt(Velocity.x*Velocity.x+Velocity.y*Velocity.y)/Math.sqrt(this.dir.x*this.dir.x+this.dir.y*this.dir.y);
        rolebody.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.dir.x*rate,this.dir.y*rate);
    },

    //菜单
    menu:function(event,customEventData){
        // console.info(event);
         console.info(customEventData);
         if(customEventData=="pause"){
            this.pause_resume();
 
         }else if(customEventData=="home"){
             cc.director.loadScene("mainScene");
         }else if(customEventData=="skill"){
            let rolebody = this.player.getChildByName("body");
            let info = dataScript.gamedata.playerList[0];
            let speed = dataScript.gamedata.playerList[0].speed+200;
            dataScript.gamedata.playerList[0].force=dataScript.gamedata.playerList[0].startForce+1;

            //计算角度方向
            let rotate = rolebody.rotation
            let end = cc.v2(0,1);
            let tmptotate = (rotate%360)
            if(tmptotate<0){
                tmptotate = Math.abs(tmptotate)-90;
            }
            let hudu = Math.PI*tmptotate/180           
            console.log("skill.node.rotation: ",rotate,tmptotate,Math.sin(hudu));
            if(tmptotate==0){
                end = cc.v2(1,0);
            }else if(tmptotate==90){
                end = cc.v2(0,1);
            }else if(tmptotate==180){
                end = cc.v2(-1,0);
            }else if(tmptotate==270){
                end = cc.v2(0,-1);
            }else{
                end.x = Math.cos(hudu);
                end.y = Math.sin(hudu);
            }
            
            
            let __dir = aiStage.getDir(cc.v2(0,0),end);
            dataScript.gamedata.playerList[0].dir = __dir;

            rolebody.getComponent(cc.RigidBody).linearVelocity=cc.v2(__dir.x*speed,__dir.y*speed);
            rolebody.getComponent("collison").isHitting = true;
            // rolebody.getComponent(cc.PhysicsCircleCollider).friction = 0.5;
            rolebody.runAction(cc.sequence(cc.delayTime(0.4),cc.callFunc(function(obj){
                obj.getComponent("collison").isHitting = false;
                dataScript.gamedata.playerList[0].force=dataScript.gamedata.playerList[0].startForce;
                obj.getComponent(cc.RigidBody).linearVelocity = cc.v2(info.dir.x*info.speed,info.dir.y*info.speed);
                obj.getComponent(cc.PhysicsCircleCollider).friction = 0;
            },this)));

            cc.loader.loadRes("particel/tailPlist", function (err, prefab) {
                var node = cc.instantiate(prefab);
                node.active = true;
                node.scale = 2.0;
                node.setPosition(cc.v2(0,0));
                rolebody.parent.getChildByName("tail").addChild(node);
            });
         }
 
     },

    //复活
    fuhuo:function(){
        this.addControl();
        dataScript.gamedata.playerList[0].die = false;
        const element = dataScript.gamedata.playerList[0];
        this.player.active = true;
        // roleitem.setPosition(element.pos);
        let cell_l = dataScript.gamedata.map_cell;
        this.player.getChildByName("body").setPosition(cc.v2(0,0));
        

        //属性
        this.player.getChildByName("body").active = true;
        this.player.getChildByName("body").scale = element.startScale*0.25+(element.level-1)*0.05;
        let key = `loadres/role/role${element.scan}`
        this.player.getChildByName("body").getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(key);
        this.player.getChildByName("namebg").getChildByName("name").getComponent(cc.Label).string = element.name;
        this.player.getChildByName("namebg").active = false;
        this.player.getChildByName("tail").active = true;

        //物理属性
        var rigidbody = this.player.getChildByName("body").getComponent(cc.RigidBody);
        rigidbody.active = true;
        rigidbody.enabledContactListener = true;
        rigidbody.awake = true;

        dataScript.gamedata.leftPeoPle++;

        this.player.scale = 1;
        
        this.player.runAction(cc.sequence(cc.fadeIn(0.1),cc.blink(0.2,3)));
        var tmpbbb = this.player.getChildByName("body");
        this.moveCamera.setPosition(cc.v2(tmpbbb.x+this.player.getPosition().x,tmpbbb.y+this.player.getPosition().y));

        this.resumeGame();
        this.startGame();
    },

    //自定义暂停
    pauseGame:function(){
        try {
            this.endPause = true;
            this.removeControl();
            this.unschedule(this.gameupdate);
            // cc.director.getCollisionManager().enabled = false;
            
            for (let index = 0; index < this.players.length; index++) {
                let info = dataScript.gamedata.playerList[index];
                if(!info.die){
                    const enemy = this.players[index];
                    enemy.getComponent("role").stop_clear();//自动移动逻辑清理
                    // var eb = enemy.getChildByName("body");
                    // eb.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
                } 
            }

            var actionManager = cc.director.getActionManager();
            this.pauseNodes = actionManager.pauseAllRunningActions();
        } catch (error) {
            console.info("catch pauseGame:",error);
        }
        

        
    },
    resumeGame:function(){
        this.endPause = false;
        // cc.director.getCollisionManager().enabled = true;
        //
        for (let index = 0; index < this.players.length; index++) {
            let info = dataScript.gamedata.playerList[index];
            if(!info.die){
                const enemy = this.players[index];
                var eb = enemy.getChildByName("body");
                eb.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
            } 
        }

        var actionManager = cc.director.getActionManager();
        actionManager.resumeTargets(this.pauseNodes);
        
    },

    pause_resume:function(){
        if(cc.director.isPaused()){
            this.pause.active = true;
            cc.director.resume();
        }else{
            cc.director.pause();
            this.pause.active = false;
            myToast.showPrefab("prefab/pause_show",function(pSender,extInfo){
                console.info(pSender);
                console.info(extInfo);
            },{data:0});
        }

    },
    //角色控制
    addControl:function(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },
    removeControl:function(){
        this.control.active = false;
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },
    onTouchStart:function(event){
        let startPOS= event.touch._startPoint;
        this.control.active = true;
        this.control.setPosition(cc.v2(startPOS.x-cc.winSize.width/2,startPOS.y-cc.winSize.height/2));
    },
    onTouchMove:function(event){
        if(dataScript.gamedata.playerList[0].die){
            return;
        }
        let __dir = cc.v2(0,0);
        if(event.touch._point.x-event.touch._startPoint.x==0){
            if(event.touch._point.y-event.touch._startPoint.y>=0){
                __dir.y = 1;
            }else{
                __dir.y = -1;
            }
        }else if(event.touch._point.y-event.touch._startPoint.y==0){
            if(event.touch._point.x-event.touch._startPoint.x>=0){
                __dir.x = 1;
            }else{
                __dir.x = -1;
            }
        }else{
            __dir.x = event.touch._point.x-event.touch._startPoint.x;
            __dir.y = event.touch._point.y-event.touch._startPoint.y;
        }

        let rate = Math.sqrt(__dir.x*__dir.x+__dir.y*__dir.y)/1;
        if(rate>1){
            __dir.x = __dir.x/rate;
            __dir.y = __dir.y/rate;
            this.angle = -90-g_define.getAngle(event.touch._startPoint,event.touch._point);
            this.control.getChildByName("center").setPosition(cc.v2(__dir.x*48/1,__dir.y*48/1));
            if(this.angle!=NaN){
                this.player.getChildByName("body").rotation = this.angle;
                // this.player.getChildByName("body").stopActionByTag(20);
                // let rotate_action = cc.rotateTo(0.5,this.angle-180);
                // rotate_action.setTag(20);
                // this.player.getChildByName("body").runAction(rotate_action);
            }
            
        
            this.role_move(__dir)
        }

    },
    onTouchEnd:function(event){
        this.control.active = false;
    },

   
    updateLVScale:function(){
        for (let index = 0; index < this.players.length; index++) {
            let info = dataScript.gamedata.playerList[index];
            if(!info.die){
                const enemy = this.players[index];
                var eb = enemy.getChildByName("body");
                //scale属性
                eb.scale = info.startScale*0.25+(info.level-1)*0.04;
                enemy.getChildByName("tail").getComponent(cc.MotionStreak).stroke = 180*(0.25+(info.level-1)*0.04);

               
            } 
        }
    },
    gameupdate:function (dt) {
        if(this.endPause)
        return;

        this.timer++;

        if(!dataScript.gamedata.playerList[0].die){
            let rolebody = this.player.getChildByName("body");
    
            //主角位置刷新
            let moveCameraPos = this.moveCamera.getPosition();
            let tagtarPos = cc.v2(rolebody.x+this.player.getPosition().x,rolebody.y+this.player.getPosition().y);
            if(moveCameraPos.x<tagtarPos.x){
                moveCameraPos.x+=1
            }
            if(moveCameraPos.x>tagtarPos.x){
                moveCameraPos.x-=1
            }
            if(moveCameraPos.y>tagtarPos.y){
                moveCameraPos.y-=1
            }
            if(moveCameraPos.y<tagtarPos.y){
                moveCameraPos.y+=1
            }
            this.moveCamera.setPosition(moveCameraPos);

            this.player.getChildByName("tail").setPosition(cc.v2(rolebody.x,rolebody.y));
            this.player.getChildByName("namebg").setPosition(cc.v2(rolebody.x,rolebody.y+40));
            
        }
       
        let mapindex = dataScript.gamedata.map_index;
        this.level.getComponent(cc.Label).string = `第${mapindex+1}层\n${dataScript.gamedata.leftPeoPle}/${dataScript.gamedata.playerList.length}`;
        if(this.timer%(60)==1){
            if(dataScript.gamedata.map_reduce<=0.8){
                let map_reduce_speed = dataScript.gamedata.gameConf.map_reduce_speed;
                dataScript.gamedata.map_reduce+=map_reduce_speed;
            }
            this.pbMap.updateScale((1.0-dataScript.gamedata.map_reduce)<0.2?0.2:(1.0-dataScript.gamedata.map_reduce));

            this.pbMap.updateSafe();
            
            for (let index = 1; index < this.players.length; index++) {
                let info = dataScript.gamedata.playerList[index];
                if(!info.die){
                    const enemy = this.players[index];
                    enemy.getComponent("role").changeRoute("moveByRound");
                }
                
            }

        }





        //其他玩家
        let roundunm = Math.floor(this.players.length*Math.random());
        for (let index = 1; index < this.players.length; index++) {
            let info = dataScript.gamedata.playerList[index];
            if(!info.die){
                const enemy = this.players[index];
                var eb = enemy.getChildByName("body");
                //属性
                enemy.getChildByName("tail").setPosition(cc.v2(eb.x,eb.y));
                enemy.getChildByName("namebg").setPosition(cc.v2(eb.x,eb.y+40));
               
                //
                if(this.timer%(60)==1){
                    let cell_l = dataScript.gamedata.map_cell;
                    let roundBody = this.players[roundunm].getChildByName("body");
                    let pos = roundBody.convertToWorldSpaceAR(roundBody.getPosition());
                    pos.x = pos.x-cc.winSize.width/2
                    pos.y = pos.y-cc.winSize.height/2
                    pos = cc.v2(parseInt(pos.x/cell_l) ,parseInt(pos.y/cell_l));
                    //开始随机移动
                    // enemy.getComponent("role").moveToDest(pos);
                }
            } 
        }

        // if(this.timer%(2)==1){
        //     this.pbMap.updateSafe();
        // }

    },


    addTestPoint:function(pos){
        var node = cc.instantiate(this.testPoint);
        this.pbMap.enemys.addChild(node);
        node.setPosition(pos);
        node.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(function(obj){
            obj.active = false;
            obj.destroy();
        })))
    }


   
});
