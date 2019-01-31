var g_define = require('./public/g_define')
var dataScript = require('./model/dataScript')
var myToast = require('./public/myToast')
var aiStage = require('./prefab/game/aiStage')
var aStar = require('./utils/aStar')
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
        killed:{
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
        

        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags= cc.PhysicsManager.DrawBits.e_aabbBit |
        //                                                 cc.PhysicsManager.DrawBits.e_pairBit |
        //                                                 cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //                                                 cc.PhysicsManager.DrawBits.e_jointBit |
        //                                                 cc.PhysicsManager.DrawBits.e_shapeBit;
        // cc.director.getPhysicsManager().debugDrawFlags = 0;
        var manager = cc.director.getPhysicsManager();
        // 开启物理步长的设置
        manager.enabledAccumulator = false;
        // 物理步长，默认 FIXED_TIME_STEP 是 1/60
        manager.FIXED_TIME_STEP = 1/60;
        // 每次更新物理系统处理速度的迭代次数，默认为 10
        manager.VELOCITY_ITERATIONS = 10;
        // 每次更新物理系统处理位置的迭代次数，默认为 10
        manager.POSITION_ITERATIONS = 10;

        var CollisionManager = cc.director.getCollisionManager();
        CollisionManager.enabled = true;

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
        this.level.getComponent(cc.Label).string = `第${mapindex+1}层`;
        this.killed.getComponent(cc.Label).string = `${dataScript.gamedata.playerList.length}/${dataScript.gamedata.playerList.length}`
        if(mapindex>15){
            mapindex = parseInt(Math.random()*16);
        }
        if(dataScript.gamedata.gameType==2){
            mapindex = 15;
        }
        let mapurl = `prefab/game/mapPb_${mapindex+1}`;
        console.info("正在加载地图...",mapurl);
        cc.loader.loadRes(mapurl, function (err, prefab) {
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
            let rund_pos = aiStage.getRundMapPos(index);
            roleitem.setPosition(cc.v2(rund_pos.x*cell_l,rund_pos.y*cell_l));
            if(index==0){
                roleitem.setPosition(cc.v2(0,-100));
                if(this.pbMap.node.getChildByName("setpos")){
                    roleitem.setPosition(this.pbMap.node.getChildByName("setpos").getPosition());
                }
                
            }
            roleitem.getComponent("role").brunPos = roleitem.getPosition();
            this.pbMap.enemys.addChild(roleitem);

            //属性
            roleitem.getChildByName("body").setPosition(cc.v2(0,0));
            roleitem.getChildByName("body").active = true;
            roleitem.getChildByName("body").scale = element.startScale+(element.level-1)*0.05;
            //roleitem.getChildByName("namebg").y = roleitem.getChildByName("body").height*roleitem.getChildByName("body").scale/2+10;
            let key = `loadres/role/role${element.scan}`
            roleitem.getChildByName("body").getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(key);
            roleitem.getChildByName("namebg").getChildByName("name").getComponent(cc.Label).string = element.name;
            if(index==0){
                // roleitem.getChildByName("namebg").active = false;
                roleitem.getChildByName("body").getChildByName("dirto").active = true;
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

        let rolebody = this.player.getChildByName("body");
        let tagtarPos = cc.v2(rolebody.x+this.player.getPosition().x,rolebody.y+this.player.getPosition().y);
        this.moveCamera.setPosition(tagtarPos);

        console.info("-----------------");
    },

    suitPos:function(){

    },
    
    readyGo:function(){
        myToast.showPrefab("prefab/game/readyGo",function(pSender,extInfo){

            pSender.getComponent("readyGo").callBack = function(){
                console.info("开始游戏");   
                pSender.y = 120; 
                extInfo.data.startGame(false);
            }
            
        
        },{data:this});
    },
    startGame:function(isfuhuo){
        dataScript.gamedata.gameend = 0;
        this.timer = 0;

        this.pause.active = true;
        this.control.active = false;
        this.addControl();
        this.dir = cc.v2(0,1);
        if(!isfuhuo){
            this.schedule(this.gameupdate,0.01);
        }

        dataScript.gamedata.playerList[0].speed = 0;
        //
        for (let index = 0; index < this.players.length; index++) {
            const roleitem = this.players[index];
            if(!roleitem){
                return;
            }
            const element = dataScript.gamedata.playerList[index];
            var rigidbody = roleitem.getChildByName("body").getComponent(cc.RigidBody);
            rigidbody.active = true;
            roleitem.getChildByName("body").getComponent("collison").enabled = true;
            roleitem.getChildByName("body").getComponent("collison").isHitting = false;
            roleitem.getChildByName("body").getComponent("collison").isSkill = false;

            //随机开始方向
            if(!isfuhuo){
                let round_pre = cc.v2(Math.random()*5,-Math.random()*5);
                let round_now = cc.v2(Math.random()*5,-Math.random()*5);
                let rounddir = aiStage.getDir(round_pre,round_now);
                
                if(rounddir){
                    let angle = -90-g_define.getAngle(round_pre,round_now);
                    if(angle!=NaN){
                        roleitem.getChildByName("body").rotation = angle;
                    }
                    dataScript.gamedata.playerList[index].dir = rounddir;
                    rigidbody.linearVelocity=(cc.v2(rounddir.x*element.speed,rounddir.y*element.speed));
                }else{
                    dataScript.gamedata.playerList[index].dir = cc.v2(0,1);
                    rigidbody.linearVelocity=(cc.v2(0,element.speed));
                }
            
            }

            //开始随机移动
            roleitem.getComponent("role").initRole("moveByRound");
            roleitem.getComponent("role").updateLVScale();
        }

        this.player.getChildByName("tail").active = true;
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
            let skillSpeed = 800;
            rolebody.stopActionByTag(dataScript.gamedata.RESUMEACTION_TAG2);

            let resume_dt  = 0.5;
            this.player.getComponent("role")._FloatSlerpSkill.init(skillSpeed,0,resume_dt);
            //
 
            rolebody.getComponent("collison").isSkill = true;
            let self_att = cc.sequence(cc.delayTime(resume_dt),cc.callFunc(function(obj){
                obj.getComponent("collison").isSkill = false;
            },this))
            self_att.setTag(dataScript.gamedata.RESUMEACTION_TAG2)
            rolebody.runAction(self_att);

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
        let cell_l = dataScript.gamedata.map_cell;
        this.player.getChildByName("body").setPosition(cc.v2(0,0));
        
        //属性
        this.player.getChildByName("body").active = true;
        this.player.getChildByName("body").scale = element.startScale+(element.level-1)*0.05;
        let key = `loadres/role/role${element.scan}`
        this.player.getChildByName("body").getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(key);
        this.player.getChildByName("namebg").getChildByName("name").getComponent(cc.Label).string = element.name;

        dataScript.gamedata.leftPeoPle++;
        this.player.scale = 1;
        
        // this.player.runAction(cc.sequence(cc.fadeIn(0.1),cc.blink(0.2,3)));
        var that = this;
        this.player.runAction(cc.spawn(cc.scaleTo(0.02,1),cc.fadeIn(0.5),cc.callFunc(function(){
            //物理属性
            var rigidbody = that.player.getChildByName("body").getComponent(cc.RigidBody);
            rigidbody.active = true;
            rigidbody.enabledContactListener = true;
            rigidbody.awake = true;
            that.player.getChildByName("namebg").active = true;
            that.player.getChildByName("tail").active = true;
        },this)));
        var tmpbbb = this.player.getChildByName("body");
        this.moveCamera.setPosition(cc.v2(tmpbbb.x+this.player.getPosition().x,tmpbbb.y+this.player.getPosition().y));

        this.resumeGame();
        this.startGame(true);
    },

    //自定义暂停
    pauseGame:function(fuhuo){
        try {
            this.endPause = true;
            this.removeControl();
            if(!fuhuo){
                this.unschedule(this.gameupdate);
                // cc.director.getCollisionManager().enabled = false;
                // cc.director.getPhysicsManager().enabled = false;

                for (let index = 0; index < this.players.length; index++) {
                    const enemy = this.players[index];
                    if(enemy){
                        let info = dataScript.gamedata.playerList[index];
                        if(!info.die){
                            enemy.getComponent("role").stop_clear();//自动移动逻辑清理
                        } 
                    }
                }

                // var actionManager = cc.director.getActionManager();
                // this.pauseNodes = actionManager.pauseAllRunningActions();
            }
        } catch (error) {
            console.info("catch pauseGame:",error);
        }

    },
    resumeGame:function(){
        this.addControl();
        this.endPause = false;
        // cc.director.getCollisionManager().enabled = true;
        // cc.director.getPhysicsManager().enabled = true;
        //
        // for (let index = 0; index < this.players.length; index++) {
        //     let info = dataScript.gamedata.playerList[index];
        //     if(!info.die){
        //         const enemy = this.players[index];
        //         enemy.getComponent("role").stop_clear();//自动移动逻辑清理
        //     } 
        // }

        // var actionManager = cc.director.getActionManager();
        // actionManager.resumeTargets(this.pauseNodes);
        
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
        let rolebody = this.player.getChildByName("body");
        // if(rolebody.getComponent("collison").isHitting){
        //     return;
        // }
        if(rolebody.getComponent("collison").isSkill){
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
            var that = this;
            __dir.x = __dir.x/rate;
            __dir.y = __dir.y/rate;
            let angle = -90-g_define.getAngle(event.touch._startPoint,event.touch._point);
            this.control.getChildByName("center").setPosition(cc.v2(__dir.x*80/1,__dir.y*80/1));
            if(angle!=NaN){
                this.player.getComponent("role").next_angle = angle;
            }
            this.role_move(__dir)
        }

    },
    onTouchEnd:function(event){
        this.control.active = false;
    },

   
    gameupdate:function (dt) {
        if(this.endPause)
        return;

        this.timer++;
        if( !this.p_rolebody )
        {
            this.p_rolebody = this.player.getChildByName("body");
        }

        if( !this.p_tail )
        {
            this.p_tail =  this.player.getChildByName("tail")
        }

        if( !this.p_namebg )
        {
            this.p_namebg = this.player.getChildByName("namebg")
        }



        if(!dataScript.gamedata.playerList[0].die){
    
            //主角位置刷新
            //if(!rolebody.getComponent("collison").isHitting){
                 // this.moveCamera.stopAllActions();
                let moveCameraPos = this.moveCamera.getPosition();
                let tagtarPos = cc.v2(this.p_rolebody.x+this.player.getPosition().x,this.p_rolebody.y+this.player.getPosition().y);
                let movtby  = tagtarPos.subSelf(moveCameraPos);
                movtby.normalizeSelf();
                // this.moveCamera.runAction(cc.moveBy(0.2,movtby));
                let linearVelocity = this.p_rolebody.getComponent(cc.RigidBody).linearVelocity;
                let offdis = linearVelocity.mag()/60;
                this.moveCamera.setPosition(cc.v2(movtby.x*offdis,movtby.y*offdis).addSelf(moveCameraPos));
           // }
           

           this.p_tail.setPosition(cc.v2(this.p_rolebody.x,this.p_rolebody.y));
           this.p_namebg.setPosition(cc.v2(this.p_rolebody.x,this.p_rolebody.y+40));
            
        }
        
        
        if(this.timer%(60)==1){
            let mapindex = dataScript.gamedata.map_index;
            this.level.getComponent(cc.Label).string = `第${mapindex+1}层`;
            this.killed.getComponent(cc.Label).string = `${dataScript.gamedata.leftPeoPle}/${dataScript.gamedata.playerList.length}`

            if(dataScript.gamedata.gameType!=2){
                if(dataScript.gamedata.map_reduce<=0.8){
                    let map_reduce_speed = dataScript.gamedata.gameConf.map_reduce_speed;
                    dataScript.gamedata.map_reduce+=map_reduce_speed;
                }
                this.pbMap.updateScale((1.0-dataScript.gamedata.map_reduce)<0.2?0.2:(1.0-dataScript.gamedata.map_reduce));
    
            }
            
            //换个路线
            // for (let index = 1; index < this.players.length; index++) {
            //     let info = dataScript.gamedata.playerList[index];
            //     if(!info.die){
            //         const enemy = this.players[index];
            //         enemy.getComponent("role").changeRoute("moveByRound");
            //     }
                
            // }

        }

        if(this.timer%(120)==1){
            
        }




        


    },

    addTestPoint:function(pos){
        var node = cc.instantiate(this.testPoint);
        this.pbMap.enemys.addChild(node);
        node.setPosition(pos);
        node.scale = 0.3
        node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(obj){
            obj.active = false;
            obj.destroy();
        })))
    },

    addDarwLine:function(start,end){
        var ctx = this.pbMap.enemys.getComponent(cc.Graphics);
        if(ctx){
            ctx.lineWidth = 4;
            ctx.moveTo(start.x,start.y);
            ctx.lineTo(end.x,end.y);
            ctx.stroke();
        }

    },

    addDarwDot:function(start,color){
        var ctx = this.pbMap.enemys.getComponent(cc.Graphics);
        if(ctx){
            ctx.lineWidth = 1;
            ctx.circle(start.x,start.y,4);
            ctx.fillColor = color;
            ctx.fill();
        }

    },

    
   
});
