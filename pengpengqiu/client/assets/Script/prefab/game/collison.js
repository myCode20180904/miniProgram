
var dataScript = require('../../model/dataScript')
var aiStage = require('./aiStage')
var g_define = require('../../public/g_define')
var myToast = require('../../public/myToast')

cc.Class({
    extends: cc.Component,

    properties: {
        isHitting:false,
        whoHitTail:-1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        
        
    },
    isTailAera:function(pos){
        let hit = false;
        if(this.safeArea.getComponent(cc.PolygonCollider)){
            console.info(pos)
            console.info(this.safeArea.getComponent(cc.PolygonCollider))
            if (cc.Intersection.pointInPolygon(pos, this.safeArea.getComponent(cc.PolygonCollider).world.points)) {
                hit = true;
            } 
        }
       
        return hit;
    },

   // 只在两个碰撞体开始接触时被调用一次
   onBeginContact: function (contact, selfCollider, otherCollider) {
        if (selfCollider.node.group=='player'&&otherCollider.node.group=='player') {
            let self_tag = selfCollider.node.getComponent(cc.PhysicsCircleCollider).tag;
            let other_tag = otherCollider.node.getComponent(cc.PhysicsCircleCollider).tag;
            let selfinfo = dataScript.gamedata.playerList[self_tag];
            let otherinfo = dataScript.gamedata.playerList[other_tag];
            if(selfinfo.die||otherinfo.die){
                return;
            }
            if (self_tag == 0) {
                
            }else{
                
            }
            // console.log("onBeginContact: "+self_tag+" attack "+ other_tag);

            otherinfo.killner = self_tag;//最后一个撞击着
            //震动
            if(self_tag==0){
                if(window.wx){
                    wx.vibrateShort({});
                }
            }

            if(cc.find("Canvas").getComponent("gameScene")){
                cc.find("Canvas").getComponent("gameScene").updateLVScale();
            }
            //体积膨胀效果
            let selfscale = selfCollider.node.scale;
            // let otherscale = otherCollider.node.scale;
            selfCollider.node.stopActionByTag(6);
            // otherCollider.node.stopActionByTag(0);
            selfCollider.node.stopActionByTag(1);
            // otherCollider.node.stopActionByTag(1);
            
            let self_scaleback  = cc.sequence(cc.scaleTo(0.1,selfscale-selfscale*0.1),cc.scaleTo(0.1,selfscale));
            self_scaleback.setTag(6)
            selfCollider.node.runAction(self_scaleback);
            // let other_scaleback  = cc.sequence(cc.scaleTo(0.2,otherscale-0.04),cc.scaleTo(0.2,otherscale));
            // other_scaleback.setTag(0)
            // otherCollider.node.runAction(other_scaleback);

            let selfRigidBody = selfCollider.node.getComponent(cc.RigidBody);
            let otherRigidBody = otherCollider.node.getComponent(cc.RigidBody);
            var selfmass = selfRigidBody.getMass();
            var othermass = otherRigidBody.getMass();
            var massrate = othermass/selfmass>1.4?1.4:othermass/selfmass;

            // console.info("mass",selfmass,othermass);
            //contact
            // console.info(contact);
            let worldManifold = contact.getWorldManifold();
            // console.info(worldManifold.points[0]);
            // var points = worldManifold.points;
            // var normal = worldManifold.normal;
            
            //碰撞的真正的方向
            //方式一
            // let vel1 = selfRigidBody.getLinearVelocityFromWorldPoint( worldManifold.points[0] );
            // let vel2 = otherRigidBody.getLinearVelocityFromWorldPoint( worldManifold.points[0] );
            //方式二
            let vel1 = selfCollider.node.convertToWorldSpaceAR(selfCollider.node.getPosition());
            let vel2 = otherCollider.node.convertToWorldSpaceAR(otherCollider.node.getPosition());
            
             //方向
             {
                let __dir = aiStage.getDir(vel2,vel1);
                if(__dir){

                    // let angle = -90-g_define.getAngle(vel1,vel2);
                    // if(angle!=NaN){
                    //     selfCollider.node.stopActionByTag(20);
                    //     let rotate_action = cc.rotateTo(0.3,angle);
                    //     rotate_action.setTag(20);
                    //     selfCollider.node.runAction(rotate_action);
                    // }
                    
                    // dataScript.gamedata.playerList[other_tag].dir = cc.v2(__dir.x,__dir.y);
                    // dataScript.gamedata.playerList[self_tag].dir = cc.v2(__dir.x,__dir.y);
                    
                    let resume_dt  = 0.3;
                     //--撞击后分开
                    //  otherRigidBody.linearVelocity = cc.v2(0,0);
                     selfRigidBody.linearVelocity = cc.v2(0,0);

                     let elasticity = dataScript.gamedata.gameConf.elasticity;
                     let baseSpeed = dataScript.gamedata.gameConf.baseSpeed*elasticity;
                     if(self_tag==0){
                        baseSpeed = dataScript.gamedata.gameConf.baseSpeed;
                     }
                     //applyLinearImpulse
                    //  otherRigidBody.linearVelocity=(cc.v2(-__dir.x*baseSpeed*selfinfo.force*massrate,-__dir.y*baseSpeed*selfinfo.force*massrate));
                     selfRigidBody.linearVelocity=(cc.v2(__dir.x*baseSpeed*otherinfo.force*massrate,__dir.y*baseSpeed*otherinfo.force*massrate));
 
                     
                     //--撞击状态（受到撞击后短时间无法制动 0.4s）
                     selfCollider.node.getComponent("collison").isHitting = true;
                     // selfCollider.node.getComponent(cc.PhysicsCircleCollider).friction = 0.5;
                     let self_att = cc.sequence(cc.delayTime(resume_dt),cc.callFunc(function(obj){
                         obj.getComponent("collison").isHitting = false;
                         let info = dataScript.gamedata.playerList[self_tag];
                         obj.getComponent(cc.RigidBody).linearVelocity = cc.v2(info.dir.x*info.speed,info.dir.y*info.speed);
                         obj.getComponent(cc.PhysicsCircleCollider).friction = 0;
                     },this))
                     self_att.setTag(1)
                     selfCollider.node.runAction(self_att);
 
                    //  otherCollider.node.getComponent("collison").isHitting = true;
                    //  // otherCollider.node.getComponent(cc.PhysicsCircleCollider).friction = 0.5;
                    //  let other_att = cc.sequence(cc.delayTime(resume_dt),cc.callFunc(function(obj){
                    //      obj.getComponent("collison").isHitting = false;
                    //      let info = dataScript.gamedata.playerList[other_tag];
                    //      obj.getComponent(cc.RigidBody).linearVelocity = cc.v2(info.dir.x*info.speed,info.dir.y*info.speed);
                    //      obj.getComponent(cc.PhysicsCircleCollider).friction = 0;
                    //  },this))
                    //  other_att.setTag(1)
                    //  otherCollider.node.runAction(other_att);

                }else{

                }
                
                
            }
            
            
            // 修改碰撞体间的弹性系数
            // contact.setRestitution(1);
            // 修改碰撞体间的摩擦力
            // contact.setFriction(0)

            
            //是否为不撞击

            let att_pos = worldManifold.points[0];//撞击点
            // console.info("att_pos",att_pos);
            // var newVec2 = node.convertToNodeSpace(cc.v2(100, 100));
            // console.info("——————att_pos",otherCollider.node.convertToNodeSpace(att_pos));

            //att_pos = cc.v2((vel2.x-vel1.x)/2,(vel2.y-vel1.y)/2);
            
            cc.loader.loadRes("prefab/farmeAnim/boom", function (err, prefab) {
                var node = cc.instantiate(prefab);
                node.active = true;
                selfCollider.node.parent.addChild(node);
                node.setPosition(selfCollider.node.parent.convertToNodeSpace(att_pos));
                var anim = node.getComponent(cc.Animation);
                anim.play("boom_0");

            });
            
        }
        
        
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider){
        if (selfCollider.node.group=='player'&&otherCollider.node.group=='player') {
            let self_tag = selfCollider.node.getComponent(cc.PhysicsCircleCollider).tag;
            let other_tag = otherCollider.node.getComponent(cc.PhysicsCircleCollider).tag;
            let selfinfo = dataScript.gamedata.playerList[self_tag];
            let otherinfo = dataScript.gamedata.playerList[other_tag];
            if(selfinfo.die||otherinfo.die){
                return;
            }
            if (self_tag == 0) {
                
            }else{
                
            }

            let selfRigidBody = selfCollider.node.getComponent(cc.RigidBody);
            let otherRigidBody = otherCollider.node.getComponent(cc.RigidBody);
            
            if(selfCollider.node.getComponent("collison").whoHitTail>=0){
                // console.log("onEndContact: "+self_tag);
                var selfmass = selfRigidBody.getMass();
                var othermass = otherRigidBody.getMass();
                var massrate = 1;
                //计算角度方向
                let rotate = selfCollider.node.rotation
                let end = cc.v2(0,1);
                let tmptotate = (rotate%360)
                if(tmptotate<0){
                    tmptotate = Math.abs(tmptotate)-90;
                }
                let hudu = Math.PI*tmptotate/180           
                // console.log("selfCollider.node.rotation: ",rotate,tmptotate,Math.sin(hudu));
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
                let angle = -90-g_define.getAngle(cc.v2(0,0),end);
                if(angle!=NaN){
                    selfCollider.node.stopActionByTag(20);
                    let rotate_action = cc.rotateTo(0.3,angle);
                    rotate_action.setTag(20);
                    selfCollider.node.runAction(rotate_action);
                }
                
                // dataScript.gamedata.playerList[self_tag].dir = cc.v2(__dir.x,__dir.y);

                //尾部被撞击
                // console.info('尾部被撞击',selfCollider.node.getComponent("collison").whoHitTail,"->",self_tag)
                selfCollider.node.stopActionByTag(3);
                selfCollider.node.getComponent("collison").whoHitTail = -1;
                let resume_dt  = 0.4;
                let elasticity = dataScript.gamedata.gameConf.elasticity;
                let baseSpeed = dataScript.gamedata.gameConf.baseSpeed*3;
                selfRigidBody.linearVelocity = cc.v2(0,0);
                selfRigidBody.linearVelocity = cc.v2(__dir.x*otherinfo.force*baseSpeed*massrate,__dir.y*otherinfo.force*baseSpeed*massrate);

                // --撞击状态（受到撞击后短时间无法制动 resume_dts）
                dataScript.gamedata.playerList[self_tag].force=dataScript.gamedata.playerList[self_tag].startForce*3;
                // selfCollider.node.getComponent(cc.PhysicsCircleCollider).friction = 0.8;
                let self_att = cc.sequence(cc.delayTime(resume_dt),cc.callFunc(function(obj){
                    obj.getComponent("collison").isHitting = false;
                    let info = dataScript.gamedata.playerList[self_tag];
                    dataScript.gamedata.playerList[self_tag].force=dataScript.gamedata.playerList[self_tag].startForce;
                    obj.getComponent(cc.RigidBody).linearVelocity = cc.v2(info.dir.x*info.speed,info.dir.y*info.speed);
                    // obj.getComponent(cc.PhysicsCircleCollider).friction = 0;
                },this))
                self_att.setTag(3)
                selfCollider.node.runAction(self_att);

                cc.loader.loadRes("particel/tailPlist", function (err, prefab) {
                    var node = cc.instantiate(prefab);
                    node.active = true;
                    node.scale = 2.0;
                    node.setPosition(cc.v2(0,0));
                    selfCollider.node.parent.getChildByName("tail").addChild(node);

                   
                });
                
            }
          
            
            
        }
    
    },

    
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {  
        if (other.node.group=='tail'&&self.node.group=='player') {
            let self_tag = self.node.getComponent(cc.CircleCollider).tag;
            let other_tag = other.node.parent.getComponent(cc.CircleCollider).tag;
            if(self_tag!=other_tag){
                // console.info("tail att========",self_tag,other_tag);

                let otherbody = other.node.parent;
                otherbody.getComponent("collison").whoHitTail = self_tag;

            }
        }

    },
    onCollisionStay: function (other, self) {   },
    onCollisionExit: function (other, self) {
        let self_tag = self.node.getComponent(cc.CircleCollider).tag;
        if(other.node.group=='safe'&&!dataScript.gamedata.playerList[self_tag].die){
            if(self_tag!=0){
                // console.info("=========================keepSafe")
               
            }
        }
        try {
            if (other.node.group=='map'&&!dataScript.gamedata.playerList[self_tag].die) {
                console.log("onCollisionExit: "+dataScript.gamedata.playerList[self_tag].name+" goout ");
                dataScript.gamedata.playerList[self_tag].die = true;
                let killner = dataScript.gamedata.playerList[self_tag].killner;
                //击杀者人头++
                if(killner>=0){
                    dataScript.gamedata.playerList[killner].killed++;
                    dataScript.gamedata.playerList[killner].level+=dataScript.gamedata.playerList[self_tag].level;
                    if(cc.find("Canvas").getComponent("gameScene")){
                        cc.find("Canvas").getComponent("gameScene").updateLVScale();
                    }
                }
                dataScript.gamedata.leftPeoPle--;
                this.die(self.node.parent,self_tag==0,self_tag==0||dataScript.gamedata.leftPeoPle<=1);

    
                console.info(dataScript.gamedata.leftPeoPle);
                if(self_tag==0&&dataScript.gamedata.leftPeoPle>=1){
    
                    dataScript.gamedata.myrank = dataScript.gamedata.leftPeoPle+1;
                    if(cc.find("Canvas").getComponent("gameScene")){
                        cc.find("Canvas").getComponent("gameScene").pause.active = false;
                    }
                    dataScript.gamedata.gameend = 1;
    
                   
                    if(dataScript.gamedata.myrank<=3||dataScript.gamedata.haveFuHuo==0){
                        
                        //失败结算
                        myToast.showPrefab("prefab/end_game",function(pSender,extInfo){
    
                            pSender.getComponent("end_game").killed = dataScript.gamedata.playerList[self_tag].killed;
                            pSender.getComponent("end_game").rank = dataScript.gamedata.myrank;
                            pSender.getComponent("end_game").score = 400+pSender.getComponent("end_game").killed*10-dataScript.gamedata.myrank;
                            if(dataScript.gamedata.myrank<=3){
                                pSender.getComponent("end_game").win_loss = 1;
                            }else{
                                pSender.getComponent("end_game").win_loss = 0;
                            }
                        },{data:0});
                    }else{
                        dataScript.gamedata.haveFuHuo = 0;
                        //复活
                        myToast.showPrefab("prefab/fuhuo",function(pSender,extInfo){
    
                            pSender.getComponent("fuhuo").killed = dataScript.gamedata.playerList[self_tag].killed;
                            pSender.getComponent("fuhuo").rank = dataScript.gamedata.myrank;
                            pSender.getComponent("fuhuo").score = 400+pSender.getComponent("fuhuo").killed*10-dataScript.gamedata.myrank;
                            pSender.getComponent("fuhuo").win_loss = 0;
    
                        },{data:0});
                    }
                }else if(dataScript.gamedata.leftPeoPle<=1&&!dataScript.gamedata.playerList[0].die){
    
                    dataScript.gamedata.myrank = 1;
                    if(cc.find("Canvas").getComponent("gameScene")){
                        cc.find("Canvas").getComponent("gameScene").pause.active = false;
                    }
                    dataScript.gamedata.gameend = 1;
                    myToast.showPrefab("prefab/end_game",function(pSender,extInfo){
    
                        pSender.getComponent("end_game").killed = dataScript.gamedata.playerList[self_tag].killed;
                        pSender.getComponent("end_game").rank = 1;
                        pSender.getComponent("end_game").score = 400+pSender.getComponent("end_game").killed*10-1;
                        pSender.getComponent("end_game").win_loss = 1;
                    },{data:0});
                }
            }
                        
        } catch (error) {
            console.log(error);
        }


        
    },

    //
    die:function(dieplayer,isSelf,isPause){
        dieplayer.getChildByName("namebg").active = false;
        dieplayer.getChildByName("tail").active = false;
        dieplayer.runAction(cc.sequence(cc.spawn(cc.scaleTo(1.0,0),cc.fadeOut(1.0)),cc.delayTime(0.2),cc.callFunc(function(){
            if(isPause){
                if(cc.find("Canvas").getComponent("gameScene")){
                    cc.find("Canvas").getComponent("gameScene").pauseGame();
                }
            }
            if(!isSelf){
                dieplayer.active = false;
                dieplayer.getChildByName("body").getComponent("collison").enabled = false;
                // dieplayer.destroy();
            }
            
        },this)));


        cc.loader.loadRes("prefab/farmeAnim/shuihua", function (err, prefab) {
            var node = cc.instantiate(prefab);
            node.active = true;
            var anim = node.getComponent(cc.Animation);
            anim.play("shuihua_0");
            node.active = true;
            if(dieplayer){
                if(dieplayer.parent){
                    dieplayer.parent.addChild(node);
                    let x = dieplayer.getPosition().x+dieplayer.getChildByName("body").x//+dieplayer.getChildByName("body").getComponent(cc.RigidBody).linearVelocity.x/2;
                    let y = dieplayer.getPosition().y+dieplayer.getChildByName("body").y//+dieplayer.getChildByName("body").getComponent(cc.RigidBody).linearVelocity.y/2;
                    node.setPosition(cc.v2(x,y));

                }
            }

        });
        
    }

});
