var config = require('./config')
var g_define = require('./g_define');
var myToast = require('./mainScene/toastScript');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.info("commondata onLoad");
       
    },
    OnShareSuccessCallBack(_data){
        console.info("分享成功");
    },
    OnSharefailCallBack(_data){
        console.info("分享失败");
    },
    OnShareCompleteCallBack(){
        console.info("分享完成");
    },

    start () {
        this._timer=0;
        cc.game.addPersistRootNode(this.node);
    },
    
    severLogin(code){
        var that=this
        console.info("serverLogin");
        var wxNodeScript=cc.find("wxNode").getComponent("wxNode");
        console.info(g_define.getDataScript().userInfo);
        var _url=config.service.loginUrl;
        var _data={
            code:code,
            appid:g_define.getDataScript().userInfo.appid,
            sharekey:g_define.getDataScript().userInfo.shareKey,
            shareType:g_define.getDataScript().userInfo.shareType,
            newerRedPacketVersion:1
        }
        var _callfunc=function(response){
            console.info(response);
            if(response.err==0){
                g_define.getDataScript().config = response.config;
                g_define.getDataScript().userInfo.avatarurl = response.data.avatarurl;
                g_define.getDataScript().userInfo.name = response.data.nickname;
                g_define.getDataScript().userInfo.openid = response.data.openid;
                g_define.getDataScript().userInfo.gold = response.data.score;
                g_define.getDataScript().userInfo.money = response.data.money;
                g_define.getDataScript().userInfo.skey = response.data.skey;
                g_define.getDataScript().daySignData = response.data.signe_info
    
                g_define.getDataScript().quickBattleData.step = response.data.step;
                g_define.getDataScript().gateBattleData.step = response.data.redpacket_step;

                g_define.getDataScript().userInfo.hasNewerRedPacket = response.data.hasNewerRedPacket;
                g_define.getDataScript().userInfo.newerRedPacket = response.data.newerRedPacket;

                if(response.data.isHelp){
                    
                    g_define.getDataScript().isHelp.name = 0;
                    g_define.getDataScript().isHelp.avatarurl  = 0;
                    if(response.data.shareName){
                        g_define.getDataScript().isHelp.name = response.data.shareName;
                    }
                    if(response.data.shareavAtarurl){
                        g_define.getDataScript().isHelp.avatarurl = response.data.shareavAtarurl;
                    }
                    
                    if(response.data.isHelp==1){
                        g_define.getDataScript().isHelp.name = g_define.getDataScript().userInfo.name;
                        g_define.getDataScript().isHelp.avatarurl = g_define.getDataScript().userInfo.avatarurl;
                    }
                    wxNodeScript.checkBindStaue(response.data.isHelp);
                }

    
                wxNodeScript.getUserInfo();
            }else{

            }
        }
        myToast.showHttpLoad(true);
        this.sendHttpRequest(_data,_url,_callfunc);
       
    }, 
    updateUserInfo:function(_data){
        var that=this
        console.info("updateUserInfo");
        var wxNodeScript=cc.find("wxNode").getComponent("wxNode");
        
        var _url=config.service.updateUserInfo;
        var _callfunc=function(response){
            console.info(response);
            g_define.getDataScript().userInfo.avatarurl = response.avatarurl;
            g_define.getDataScript().userInfo.name = response.nickname;
            wxNodeScript.loginCall("succeed");

        }
        this.sendHttpRequest(_data,_url,_callfunc);
    },
    
    startGame:function(type,checkNext){
        var that=this
        if(window.wx){
            var _url=config.service.gameStart;
            var _data={
                skey :g_define.getDataScript().userInfo.skey,
                version:1,
                type:type
            }
            var _callfunc=function(response){
                console.info(response);
                g_define.getDataScript().mkey = response.data.mkey;
                if(response.err==0){
                    g_define.gameConfig.gameType = type;
                    var updateData = function(response){
                          //更新关卡
                          if(response.data.next_pass>=0){
                            g_define.gameConfig.gate = response.data.next_pass;
                          }

                          if(response.data.count>=0){
                            g_define.gameConfig.gateLevel=response.data.count;
                          }

                          
                          if(response.data.score>=0){
                            g_define.getDataScript().userInfo.gold = response.data.score;
                          }
                          if(type==1){
                              if(response.data.step>=0){
                                  g_define.getDataScript().quickBattleData.step = response.data.step;
                              }
                              if(response.data.count>=0){
                                  g_define.getDataScript().quickBattleData.gate=response.data.count;
                              }
                          }else if(type==2){
                              if(response.data.step>=0){
                                  g_define.getDataScript().gateBattleData.step = response.data.step;
                              }
                              if(response.data.count>=0){
                                  g_define.getDataScript().gateBattleData.gate=response.data.count;
                              }
                          }  
                    };

                    if(response.data.clearance){
                        if(response.data.clearance==1){
                            if(type==1){
                                myToast.showPrefab("prefab/passReward_1",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2),null,function(res){
                                    cc.director.getScene().getChildByName("passReward_1").getComponent("passReward_1").clearance = res.clearance;
                                    if(res.reward){
                                        console.info("clearance :"+res.reward);
                                        g_define.getDataScript().lastXSHBreward = (parseFloat(res.reward)).toFixed(2);
                                    }
                                    cc.director.getScene().getChildByName("passReward_1").getComponent("passReward_1").reward = g_define.getDataScript().lastXSHBreward;

                                    g_define.getDataScript().quickBattleData.gate = 0;
                                    if(cc.find("Canvas/gameLayout")){
                                        // cc.find("Canvas/gameLayout").getComponent("gameScript").refreshStepUi();
                                    }
                                  },3,response.data);
                            }else if(type==2){
                                g_define.getDataScript().gateBattleData.pass=1;
                                myToast.show(1.0,"通关了！",cc.find("Canvas"));
                                //updateData(response);
                                //cc.director.loadScene("mainScene");
                            }
                            
                        }
                    }else{
                        updateData(response);
                        if(checkNext){
                            if(type==1){
                                myToast.showPrefab("prefab/quickBattleNext",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2),null,function(){});
                            }
                        }else{
                            cc.director.loadScene("gameScene");
                        }

                    }
                }else{
                    if(response.err==1){
                        myToast.show(1.0,response.msg,cc.find("Canvas"));
                    }
                }
            }
            that.sendHttpRequest(_data,_url,_callfunc);
        }

    },
    startGameInfo:function(type){
        var that=this
        if(window.wx){
            var _url=config.service.gameStart;
            var _data={
                skey :g_define.getDataScript().userInfo.skey,
                version:1,
                type:type
            }
            var _callfunc=function(response){
                if(response.err==0){
                    g_define.gameConfig.gameType = type;
                    if(response.data.clearance){
                        if(response.data.clearance==1){
                            g_define.getDataScript().gateBattleData.pass=1;
                        }
                    }

                    if(response.data.undef>=0){
                        console.info("undef");
                      }

                    var updateData = function(response){
                          //更新关卡
                          if(response.data.next_pass>=0){
                            g_define.gameConfig.gate = response.data.next_pass;
                          }

                          if(response.data.count>=0){
                            g_define.gameConfig.gateLevel=response.data.count;
                          }

                          if(response.data.score>=0){
                            g_define.getDataScript().userInfo.gold = response.data.score;
                          }
                          if(type==1){
                              if(response.data.step>=0){
                                  g_define.getDataScript().quickBattleData.step = response.data.step;
                              }
                              if(response.data.count>=0){
                                  g_define.getDataScript().quickBattleData.gate=response.data.count;
                              }
                          }else if(type==2){
                              if(response.data.step>=0){
                                  g_define.getDataScript().gateBattleData.step = response.data.step;
                              }
                              if(response.data.count>=0){
                                  g_define.getDataScript().gateBattleData.gate=response.data.count;
                              }
                          }  
                    };

                    updateData(response);
                }else{
                    if(response.err==1){
                        myToast.show(1.0,response.msg,cc.find("Canvas"));
                    }
                }
            }
            that.sendHttpRequest(_data,_url,_callfunc);
        }

    },
    sendHttpRequest(_data,_url,_callBack,_isHavaChaoShi){
        var that=this;
        console.info(_url)
        console.info("POSTDATA"+JSON.stringify(_data))
        if(!window.wx)return;
        const requestTask = wx.request({
            url:_url,
            data:_data,
            header:{
                "Content-Type": "application/json" 
            },
            method: "POST",
            success:function(res){
                _callBack(that.deepCopy(res.data));
            },
            fail:function(err){
                console.info("err"+JSON.stringify(err));
                if(_isHavaChaoShi){
                    console.info("网络超时!");
                    myToast.showHttpLoad(false);
                }else{
                    that.sendHttpRequest(_data,_url,_callBack,true);
                }
            }
        })

        return requestTask;
    },
    deepCopy(_obj){
        var copyObj=null; 
        if(typeof _obj==="object"){
            copyObj={};
            for(var i in _obj){
                if(typeof _obj[i]==="object"||typeof _obj[i]==="array"){
                  copyObj[i]=this.deepCopy(_obj[i]);
                }
                copyObj[i]=_obj[i];
            }
        }else if(typeof _obj==="array"){
              copyObj=[];
              for(var i=0;i<copyObj.length;i++){
                  if(typeof _obj[i]==="object"||typeof _obj[i]==="array"){
                      copyObj[i]=this.deepCopy(_obj[i]);
                  }
                  copyObj[i]=_obj[i];
              }
        }else{
              copyObj=null;
              copyObj=_obj;
        }
        return copyObj;
      },

    sendBehavio:function(action,call){
        var that=this
        //behavior action: 2-看视屏  5炫耀加积分 6领取红包接口
        var _url=config.service.behavior;
        var _data={
            skey :g_define.getDataScript().userInfo.skey,
            action:action,
        }
        var _callfunc=function(response){
            myToast.showHttpLoad(false);
            if(call){
                call(response);
            }
        }
        //myToast.showHttpLoad(true);
        this.sendHttpRequest(_data,_url,_callfunc);
    },

    sendReduceStep:function(step,type,call){
        if(step<=0){
            if(call){
                let data = {
                    err:0,
                    type:type
                }
                call(data);
            }
            return;
        }
        var that=this
        var _url=config.service.host+"/index/api/reduceStep";
        console.info(_url)
        var _data={
            skey :g_define.getDataScript().userInfo.skey,
            reduceStep:step,
            type:type
        }
        var _callfunc=function(response){
            if(call){
                call(response);
            }
        }
        this.sendHttpRequest(_data,_url,_callfunc);
    },
    sendCheckHelp:function(q_sharekey,q_sharetype){
        var that=this
        var wxNodeScript=cc.find("wxNode").getComponent("wxNode");
        var _url=config.service.host+"/index/api/helpFriend";
        var _data={
            skey :g_define.getDataScript().userInfo.skey,
            shareSkey:q_sharekey,
            shareType:q_sharetype
        }
        var _callfunc=function(response){
            console.info(response);
            g_define.getDataScript().isHelp.name = 0;
            g_define.getDataScript().isHelp.avatarurl  = 0;
            if(response.data.isHelp>0){
                g_define.getDataScript().isHelp.name = response.data.shareName;
                g_define.getDataScript().isHelp.avatarurl = response.data.shareavAtarurl;
                wxNodeScript.checkBindStaue(response.data.isHelp);
            }
        }
        this.sendHttpRequest(_data,_url,_callfunc);
    },
    _madeSubKeyById(_str,_timeStr){
        _timeStr=_timeStr+"";
        var _timeArr=_timeStr.split("");
       var _strArr=_str.split("");
       var _keyArr=[];
       for(var i=2;i<_timeArr.length+2;i++){
            var _cellStr=_strArr[i];
            var codeNum=_cellStr.charCodeAt();
            if(Number(codeNum)+Number(_timeArr[i-2])<127){
                _keyArr[i-2]=String.fromCharCode((Number(codeNum)+Number(_timeArr[i-2])));
            }else{
                _keyArr[i-2]=String.fromCharCode((Number(codeNum)-Number(_timeArr[i-2])));
            }
       }
       this._subKey="";
       for(var j=0;j<_keyArr.length;j++){
        this._subKey+=_keyArr[j];
       }
    },
 
    update (dt) {
    //     this._timer+=dt;
    //    if(this._timer>30){
    //         this._timer=0;
    //         this.getShareStatus();
    //    }
    },
    getShareStatus(){
        var that=this;
        var wxNodeScript=cc.find("wxNode").getComponent("wxNodeScript");
        
        var _url=this.gameConfig.requestUrl+"/WxApi/WxApi/shareStatus";
        var _data={
        }
        var _callfunc=function(response){
            if(that.configData&&Number(response)>=0){
                that.configData.relive_gold_status=response;
                that.configData.relive_gold_status=2
            }
        }
        this.sendHttpRequest(_data,_url,_callfunc,false,"shareStatus");
    }
});
