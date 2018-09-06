var dataScript = require('../model/dataScript')
var plat = require('../plat/platScript')
var myToast = require('./myToast')
var config = require('./config')
var g_define = require('./g_define')

cc.Class({
    extends: cc.Component,
    properties: {
        
    },


    onLoad () {
        console.info("localNode onLoad");
       
    },

    start () {
        console.info("localNode start");
        cc.game.addPersistRootNode(this.node);
    },
    
    init:function(){
        console.info("localNode init");

        //初始plat
        plat.start({
            success:function(res){
                console.info(res);
            }
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
                        that.serverLogin(res.code);
                    }
                },
                fail:function(){
                    console.info("fail");
                }
            });
    
        }

    },

    serverLogin:function(code){
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
            url:config.service.apiUrl+"/login",
            data:{
                code:code,
                appid:0,
                sharekey:0,
                shareType:0
            },
            success:function(res){
                dataScript.userInfo.openid = res.data.openid;
                dataScript.userInfo.skey = res.data.session_key;
                that.updateUserInfo(res);
                that.loginSuccees();
                console.info("登录成功")
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
            }
        });
    },

    updateUserInfo:function(res){
        console.info(res.data)
        if(res.data){
            dataScript.userInfo.name = res.data.nickName;
            dataScript.userInfo.avatarUrl = res.data.avatarUrl;
            dataScript.userInfo.sex = res.data.gender;
        }
    }

        
   



   
});
