const plat = require('../plat/platScript');
const config = require('../public/config')
const g_define = require('../public/g_define')
var common = require('../model/common')
var userInfo = require('../model/userInfo')
const myToast = require('../public/myToast')

cc.Class({
    extends: cc.Component,

    properties: {
        /**
         * 登录参数
         * success:function(){},
         * fail:function(){ } 
         */
        loginOption:'',
    },

    

    onLoad () {
        //背景点击穿透
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){ }, this);
        this.loginOption = {};
    },

    start () {

    },
    /**
     * 登录
     * @param {*} obj 
     */
    login:function(obj){
        console.info("login");
        var that = this;
        this.active = true;
        this.loginOption = obj;

        //登录plat
        if(!common.isLogin){
            plat.target.login({
                success:function(res){
                    console.info(res);
                    if(!res.code){
                        myToast.show(1,"用户授权失败！");
                        return;
                    }else{
                        userInfo.code = res.code;
                        if(plat.target.getName() == "wx"){
                            that.getWxInfo(obj);
                            
                        }else if(plat.target.getName() == "gf"){
                            that.loginSuccess(null);
                        }

                    }
                },
                fail:function(){
                    console.info("fail");
                }
            });
    
        }

    },

    /**
     * 
     * @param {*} obj 
     */
    getWxInfo:function(obj){
        var that = this;
        wx.getSetting({
            success(auths){
                if(auths.authSetting["scope.userInfo"]){
                    //获得个人信息
                    wx.getUserInfo({
                        withCredentials: true,
                        lang: 'zh_CN',
                        success(res3){
                            console.info("getWxInfo-成功获取用户信息",res3)
                            that.loginSuccess(res3);
                            
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

    },

    hideWxInfoButton:function(){
        if(this.button){
            this.button.hide();
        }
    },
    showWxInfoButton:function(){
        console.info("用户授权按钮")
        var self = this;
        // // //按钮坐标
        self.left = 0;
        self.top = 0;
        //按钮图片
        self.url =  config.service.imgUrl + "weixinshouquan.png";

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
                        wx.getSetting({
                            success(auths){
                                if(auths.authSetting["scope.userInfo"]){
                                    console.log("==已经授权===")
                                    //获得个人信息
                                    wx.getUserInfo({
                                        withCredentials: true,
                                        lang: 'zh_CN',
                                        success(res3){
                                            self.hideWxInfoButton();
                                            console.info("onTap-成功获取用户信息",res3)
                                            //
                                            self.loginSuccess(res3);
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
    },
    
    loginSuccess:function(userinfo){
        console.info("loginSuccess:",userinfo)
        var that= this;
        common.isLogin = true;
        if(userinfo){
            userInfo.name = userinfo.userInfo.nickName;
            userInfo.sex = userinfo.userInfo.gender;
            userInfo.avatarUrl = userinfo.userInfo.avatarUrl;
        }

        if(that.loginOption){
            that.loginOption.success();
            that.active = false;
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

   


});
