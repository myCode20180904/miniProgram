
var dataScript = require('../../model/dataScript')
var aiStage = require('./aiStage')
var g_define = require('../../public/g_define')
var myToast = require('../../public/myToast')

cc.Class({
    extends: cc.Component,

    properties: {
        isHitting:false,
        isSkill:false,
        whoHitTail:-1,
        
        indexDir:0,//被撞方向序号（0-30正方，30-60正侧方，60-90侧侧方，90-120侧侧方 ...）
        playEff:true,//播放撞动画

        //
        collisionSpeed:0,//被撞的速度
        curDir:null,//被撞方向




    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        
        
    },

   // 只在两个碰撞体开始接触时被调用一次
   onBeginContact: function (contact, selfCollider, otherCollider) {
        if (selfCollider.node.group=='player'&&otherCollider.node.group=='player') {
            let self_tag = selfCollider.node.getComponent(cc.PhysicsCircleCollider).tag;
            let other_tag = otherCollider.node.getComponent(cc.PhysicsCircleCollider).tag;
            let selfInfo = dataScript.gamedata.playerList[self_tag];
            let otherInfo = dataScript.gamedata.playerList[other_tag];
            if(selfInfo.die||otherInfo.die){
                return;
            }
            if (self_tag == 0) {
                
            }else{
                
            }
            // console.log("onBeginContact: "+self_tag+" attack "+ other_tag);
            //最后一个撞击着
            otherInfo.killner = self_tag;
            //震动
            if(self_tag==0){
                if(window.wx){
                    wx.vibrateShort({});
                }
            }
            
            //体积膨胀效果
            selfCollider.node.stopActionByTag(6);
            let selfscale = selfCollider.node.scale;
            let self_scaleback  = cc.sequence(cc.scaleTo(0.05,selfscale-selfscale*0.1),cc.scaleTo(0.05,selfscale)).easing(cc.easeQuadraticActionIn());
            self_scaleback.setTag(6)
            
            selfCollider.node.runAction(self_scaleback);

            //contact信息
            // console.info(contact);
            let worldManifold = contact.getWorldManifold();
            // var points = worldManifold.points;
            // var normal = worldManifold.normal;
            // console.info(worldManifold.points[0]);
            
            //撞击点
            let att_pos =selfCollider.node.parent.convertToNodeSpace(worldManifold.points[0]);
            //碰撞的真正的方向
            //方式一
            let selfRigidBody = selfCollider.node.getComponent(cc.RigidBody);
            let otherRigidBody = otherCollider.node.getComponent(cc.RigidBody);
            let vel1 = selfRigidBody.getLinearVelocityFromWorldPoint( worldManifold.points[0] );
            let vel2 = otherRigidBody.getLinearVelocityFromWorldPoint( worldManifold.points[0] );
            //方式二
            // let vel1 = selfCollider.node.convertToWorldSpaceAR(selfCollider.node.getPosition());
            // let vel2 = otherCollider.node.convertToWorldSpaceAR(otherCollider.node.getPosition());
            
            //改变移动参数
            {
                //被撞方向
                let __dir = aiStage.getDir(vel1,vel2);
                this.curDir = __dir;

                //被撞角度
                if(__dir){
                    let angle = -90-g_define.getAngle(cc.v2(0,0),__dir);
                     
                    let changeAngel = (angle - selfCollider.node.rotation%360)
                    if(changeAngel<-180){
                        changeAngel = changeAngel+360;
                    }
                    if(changeAngel>180){
                        changeAngel = 360-changeAngel;
                        changeAngel = -changeAngel;
                    }
                    // console.info("changeAngel",changeAngel);
                    /**
                     * changeAngel (0-30 、30-60 、60-90 、90-120 、120-150 、150-180)
                     */
                    changeAngel = Math.abs(changeAngel)%180

                    //
                    this.indexDir = 6-parseInt(changeAngel/30)

                                
                    // 修改碰撞体间的弹性系数
                    contact.setRestitution(1);
                    // console.info("setRestitution",changeAngel,this.indexDir);

                }
               
            }
            
            //
            selfCollider.node.stopActionByTag(dataScript.gamedata.RESUMEACTION_TAG);
            selfCollider.node.getComponent("collison").isHitting = true;

            // 修改碰撞体间的摩擦力
            // contact.setFriction(0)

        
            
            // console.info("att_pos",att_pos);
            //撞击特效
            if(this.playEff){
                this.playEff = false;
                cc.loader.loadRes("prefab/farmeAnim/boom", function (err, prefab) {
                    var node = cc.instantiate(prefab);
                    node.active = true;
                    selfCollider.node.parent.addChild(node);
                    node.setPosition(att_pos);
                    var anim = node.getComponent(cc.Animation);
                    anim.play("boom_0");
    
                });
            }
           
            
        }
        
        
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider){
        if (selfCollider.node.group=='player'&&otherCollider.node.group=='player') {
            this.playEff = true;
            let self_tag = selfCollider.node.getComponent(cc.PhysicsCircleCollider).tag;
            let other_tag = otherCollider.node.getComponent(cc.PhysicsCircleCollider).tag;
            let selfInfo = dataScript.gamedata.playerList[self_tag];
            let otherInfo = dataScript.gamedata.playerList[other_tag];
            if(selfInfo.die||otherInfo.die){
                return;
            }
            if (self_tag == 0) {
                
            }else{
                
            }
            //刚体属性
            let selfRigidBody = selfCollider.node.getComponent(cc.RigidBody);
            let otherRigidBody = otherCollider.node.getComponent(cc.RigidBody);
            var selfmass = selfRigidBody.getMass();
            var othermass = otherRigidBody.getMass();
            selfRigidBody.linearVelocity = cc.v2(0,0);
            // 基础弹射冲量
            let baseSpeed = 200//dataScript.gamedata.gameConf.baseSpeed;
            if(this.indexDir <= 1){
                baseSpeed+50;
            }
            
            //其他玩家携带的冲量
            let otherForce = Math.max(otherRigidBody.linearVelocity.mag()*otherInfo.force,baseSpeed)/baseSpeed-1;


            let __dir = this.curDir;

            if(__dir){
                dataScript.gamedata.playerList[self_tag].speed = 0;
                //this.collisionSpeed = baseSpeed*otherForce+(othermass)*50+this.indexDir*150;
                if(this.indexDir>=4){
                    this.collisionSpeed = baseSpeed+otherForce*50+(othermass/selfmass)*50+(this.indexDir-1)*100;
                }else{
                    this.collisionSpeed = baseSpeed+otherForce*50+(othermass/selfmass)*50+this.indexDir*100;
                }


                //重设向量
                selfRigidBody.linearVelocity = cc.v2(__dir.x*this.collisionSpeed,__dir.y*this.collisionSpeed);

                selfCollider.node.parent.getComponent("role")._FloatSlerp.init(this.collisionSpeed,0,0.4);
                selfCollider.node.parent.getComponent("role")._FloatSlerp2.init(0,selfInfo.startSpeed,0.4);
                //从撞击态恢复
                let resume_dt  = 0.4;
                let self_att = cc.sequence(cc.delayTime(resume_dt),cc.callFunc(function(obj){
                    obj.getComponent("collison").isHitting = false;
                    selfCollider.node.parent.getComponent("role")._FloatSlerp2.init(selfRigidBody.linearVelocity.mag(),selfInfo.startSpeed,0.4);
                    
                },this))
                self_att.setTag(dataScript.gamedata.RESUMEACTION_TAG)
                selfCollider.node.runAction(self_att);

                //添加圆圈拖尾
                if(this.indexDir>=5){
                    cc.loader.loadRes("particel/tailPlist", function (err, prefab) {
                        var node = cc.instantiate(prefab);
                        node.active = true;
                        node.scale = 2.0;
                        node.setPosition(cc.v2(0,0));
                        selfCollider.node.parent.getChildByName("tail").addChild(node);
    
                        
                    });
                }
            }

            // 修改碰撞体间的弹性系数
            // contact.setRestitution(1);
                
        }
    
    },

    
    // /**
    //  * 当碰撞产生的时候调用
    //  * @param  {Collider} other 产生碰撞的另一个碰撞组件
    //  * @param  {Collider} self  产生碰撞的自身的碰撞组件
    //  */
    // onCollisionEnter: function (other, self) {  
    //     //检测尾部碰撞
    //     if (other.node.group=='tail'&&self.node.group=='player') {
    //         let self_tag = self.node.getComponent(cc.CircleCollider).tag;
    //         let other_tag = other.node.parent.getComponent(cc.CircleCollider).tag;
    //         if(self_tag!=other_tag){
    //             // console.info("tail att========",self_tag,other_tag);

    //             let otherbody = other.node.parent;
    //             otherbody.getComponent("collison").whoHitTail = self_tag;

    //         }
    //     }

    // },
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
                }
                dataScript.gamedata.leftPeoPle--;
                this.die(self.node.parent,self_tag,self_tag==0||dataScript.gamedata.leftPeoPle<=1);

    
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
                        //复活
                        this.node.runAction(cc.sequence(cc.delayTime(1.0),cc.callFunc(this.fuhuo,this)));
                       
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
    fuhuo:function(){
        dataScript.gamedata.haveFuHuo = 0;
        let self_tag = this.node.getComponent(cc.CircleCollider).tag;
        myToast.showPrefab("prefab/fuhuo",function(pSender,extInfo){                 
            pSender.getComponent("fuhuo").killed = dataScript.gamedata.playerList[self_tag].killed;
            pSender.getComponent("fuhuo").rank = dataScript.gamedata.myrank;
            pSender.getComponent("fuhuo").score = 400+pSender.getComponent("fuhuo").killed*10-dataScript.gamedata.myrank;
            pSender.getComponent("fuhuo").win_loss = 0;

        },{data:0});
    },

    //
    die:function(dieplayer,self_tag,isPause){
        dieplayer.getChildByName("namebg").active = false;
        dieplayer.getChildByName("tail").active = false;
        if(self_tag==0){
            if(cc.find("Canvas").getComponent("gameScene")){
                cc.find("Canvas").getComponent("gameScene").pauseGame();
            }
        }
        dieplayer.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.8,0.1),cc.fadeOut(0.8)),cc.delayTime(0.2),cc.callFunc(function(){
            if(!(self_tag==0)){
                dieplayer.active = false;
                dieplayer.getChildByName("body").getComponent("collison").enabled = false;
                dieplayer.destroy();
                if(cc.find("Canvas").getComponent("gameScene")){
                    cc.find("Canvas").getComponent("gameScene").players[self_tag] = null;
                }
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
