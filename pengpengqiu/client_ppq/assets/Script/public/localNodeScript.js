var dataScript = require('../model/dataScript')
var plat = require('../plat/platScript')
var myToast = require('./myToast')
var config = require('./config')
var g_define = require('./g_define')
var WXBizDataCrypt = require('../utils/WXBizDataCrypt')

cc.Class({
    extends: cc.Component,
    properties: {
        display: cc.Node,
    },


    onLoad () {
        console.info("localNode onLoad");
        this.node.getChildByName("mengban").on(cc.Node.EventType.TOUCH_START,function(event){ }, this);
        this.node.getChildByName("mengban").active = false;
        this.node.getChildByName("wxUserInfoBtn").active = false;
    },

    start () {
        console.info("localNode start");
        cc.game.addPersistRootNode(this.node);
    },
    
    init:function(){
        console.info("localNode init");

        //初始plat
        plat.platTarget = plat.start({
            success:function(res){
                console.info(res);
                console.info(dataScript.common.screenWidth,dataScript.common.screenHeight)
              
            }
        });

    },

    show_display:function(){
        this.display.active = true;
        let data = {
            name:'getFriendCloudStorage',
            res:{}
        }
        plat.sendMessageToChild(data);
    },
    hide_display:function(){
        this.display.active = false;
    },

    loadRes:function(obj){
        var that = this;
        // 加载 test assets 目录下所有 SpriteFrame，并且获取它们的路径
        cc.loader.loadResDir("loadres", cc.SpriteFrame, function (err, assets, urls) {
            
            if(err){
                console.info(err);
                return;
            }
            for (let index = 0; index < urls.length; index++) {
                
                dataScript.common.textureRes.set(urls[index],assets[index]); 
            }
            that.login(obj);
        });

        this.loadHttpPng(config.service.imgUrl + "/wanfajieshao.png","wanfajieshao",function(){});
        
    },

    //
    loadHttpPng:function(_iconUrl,name,_callfunc){
        if(!_iconUrl||_iconUrl==""){
            _iconUrl="http://thirdwx.qlogo.cn/mmopen/vi_32/opmkDJhG2jpF8X8AfFQfTauRlpBc7VeFicJevZ9IiajEl5g4ia75opNSZOb0FvDV87BvpUN1rsyctibGnicP7uibsMtw/132"
        }
        cc.loader.load({url: _iconUrl, type: 'png'}, function (err, tex) {
            var spriteFrame=new cc.SpriteFrame(tex)
            // if(!dataScript.common.textureRes.has(name)){
                dataScript.common.textureRes.set(name,spriteFrame); 
            // }
            
            if(_callfunc){
                _callfunc(spriteFrame)
            }
            console.info('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
        });
    },

    login:function(obj){
        var that = this;

        this.loginCall = obj;
        //登录plat
        if(!dataScript.common.isLogin){
            plat.login({
                success:function(res){
                    console.info(res);
                    if(!res.code){
                        myToast.show(1,"用户授权失败！");
                        return;
                    }else{
                        dataScript.userInfo.code = res.code;
                        that.loginSuccees();


                    }
                },
                fail:function(){
                    console.info("fail");
                }
            });
    
        }

    },


    serverLogin:function(obj){
        console.info("serverLogin:");
        //交由服务端处理authorization_code 解密用户信息
        // if(code){
        //     authorization_code(res.code)
        //     let destr = WXBizDataCrypt.decryptData(_data.encryptedData,_data.iv,_data.skey);
        //     console.info("WXBizDataCrypt");
        //     console.info(destr);
        // }
        var that = this;
        plat.request({
            url:config.service.apiUrl+"/UserLogin",
            data:{
                pt:"UserLogin",
                code:obj.code,
                nickName:obj.nickName,
                picUrl:obj.picUrl,
            },
            success:function(res){
                console.info("serverLogin登录成功",res)
                dataScript.userInfo.isNewPlayer = res[0].userData.isNewPlayer;
                dataScript.userInfo.openid = res[0].userData.openid;
                dataScript.userInfo.skey = res[0].userData.token;
                dataScript.userInfo.uid = res[0].userData.uid;
                obj.success();

            },
            fail:function(err){

            }
        })
    },

    loginSuccees:function(){
        console.info("loginSuccees");
        var that = this;
        plat.loginSuccess({
            success:function(res){
                console.info(res);
                console.info("成功获取用户信息")

                dataScript.common.isLogin = true;
                // that.getOpenId(res3);
                that.updateUserInfo(res);

                if(that.loginCall){
                    that.loginCall.success();
                }
            },
            fail:function(err){
                console.info("重新登录")
                that.login();
            },
            refuse:function(){
                console.info("用户拒绝")
            },
            showGetWxInfo:function(){
                // 
                wx.getSetting({
                    success(auths){
                        console.log(auths)
                        if(auths.authSetting["scope.userInfo"]){
                            //获得个人信息
                            wx.getUserInfo({
                                withCredentials: true,
                                lang: 'zh_CN',
                                success(res3){
                                    console.info("showGetWxInfo-成功获取用户信息")
                                    console.info(res3);
                                    dataScript.common.isLogin = true;
                                    that.getOpenId(res3);
                                    that.updateUserInfo(res3.userInfo);
                                    if(that.loginCall){
                                        that.loginCall.success();
                                    }   
                                },
                                fail(){
                                    console.log("login:获取自己的信息失败");
                                    that.showWxInfoButton();
                                }
                            })
                        }else{
                            console.log("==未授权===")
                            that.showWxInfoButton();
                        }
                    }
                })
                
            }
        });
    },

    updateUserInfo:function(userinfo){
        console.info('updateUserInfo',userinfo)
        if(userinfo){
            dataScript.userInfo.name = userinfo.nickName;
            dataScript.userInfo.avatarUrl = userinfo.avatarUrl;
            dataScript.userInfo.sex = userinfo.gender;
        }
    },

    getOpenId:function(res){
        // let destr = WXBizDataCrypt.decryptData(res.encryptedData,res.iv,res.signature);
        // console.info("WXBizDataCrypt");
        // console.info(destr);
    },

    hideWxInfoButton:function(){
        if(this.button){
            this.button.hide();
        }
    },
    showWxInfoButton:function(){
        console.info("用户授权按钮")
        var self = this;
        self.node.getChildByName("mengban").active = true;
        // self.node.getChildByName("wxUserInfoBtn").active = true;
        // // //按钮坐标
        self.left = 0;
        self.top = 0;
        //按钮图片
        self.url =  config.service.imgUrl + "/weixinshouquan.png";

        if(self.loginCall){
            self.loginCall.success();
        }
        if(self.button){
            console.info("wx.button.show");
            self.button.show();
        }else{
            wx.getSystemInfo({
                success(res){
                    console.info("wx.getSystemInfo success",res);
                    var width = res.screenWidth;
                    var height = res.screenHeight;
                    var btWidth = 384; //这里只是简单的认为Dpr 2.2
                    var btHeight = 86;
                    self.button = wx.createUserInfoButton({
                        type: "image",
                        image: self.url,
                        style: {
                            left: width/2 - btWidth/2,
                            top: height/2 - btHeight/2 + 200,
                            width: btWidth,
                            height: btHeight,
                        }
                    })
                    self.button.onTap((res1) => {
                        console.info("self.button.onTap");
                        wx.getSetting({
                            success(auths){
                                console.log(auths)
                                if(auths.authSetting["scope.userInfo"]){
                                    console.log("==已经授权===")
                                    //获得个人信息
                                    wx.getUserInfo({
                                        withCredentials: true,
                                        lang: 'zh_CN',
                                        success(res3){
                                            self.node.getChildByName("mengban").active = false;
                                            self.node.getChildByName("wxUserInfoBtn").active = false;
                                            self.hideWxInfoButton();
                                            
                                            console.info("onTap-成功获取用户信息",res3)
                                            dataScript.common.isLogin = true;
                                            self.getOpenId(res3);
                                            self.updateUserInfo(res3.userInfo);
                                            if(self.loginCall){
                                                self.loginCall.success();
                                            }   
                                        },
                                        fail(){
                                            console.log("login:获取自己的信息失败");
                                        }
                                    })
                                }else{
                                    console.log("==未授权===")
                                }
                            }
                        })
                        
                    })

                    self.button.show()
                }
            })
        }
    }
        
   



   
});
