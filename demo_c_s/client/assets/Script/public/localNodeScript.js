var dataScript = require('../model/dataScript')
var COMMON = dataScript.common;
var USERINFO = dataScript.userInfo;
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

    /**
     * start 
     * 声明常驻根节点
     */
    start () {
        console.info("声明常驻根节点");
        cc.game.addPersistRootNode(this.node);
    },
    /**
     * 初始化
     */
    init:function(){
        console.info("正在准备游戏 localNode init");

        //初始plat
        plat.start({
            success:function(res){
                console.info(res);
            }
        });

    },

    /**
     * loadRes
     * 游戏开始是加载的资源 
     * @param {*} obj {success:function,fail:function,...}
     */
    loadRes:function(obj){
        console.info("加载游戏初始资源 localNode loadRes");
        var that = this;
      
        //加载loadres目录下的资源
        cc.loader.loadResDir("loadres", cc.SpriteFrame, function (err, assets, urls) {
            if(err){
                console.info(err);
                return;
            }
            for (let index = 0; index < urls.length; index++) {
                COMMON.textureRes.set(urls[index],assets[index]); 
            }
            that.login(obj);
        });
        //加载远程资源
        COMMON.loadHttpPng("/ball.png",function(){});

        
        //静默加载字体
        g_define.loadHttpFont({
            url:"https://lg-3q7kbp58-1257126548.cos.ap-shanghai.myqcloud.com/fnt/HYYANKAIW.ttf",
            path:"HYYANKAIW.ttf",
            success:function(){
                console.info("已加载字体:",dataScript.common.myFontList);
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
                        obj.success();
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
