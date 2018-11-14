const plat = require('../plat/platScript');
const config = require('../public/config')
const g_define = require('../public/g_define')
var common = require('../model/common')
var userInfo = require('../model/userInfo')
const myToast = require('../public/myToast')

cc.Class({
    extends: cc.Component,
    properties: {
        displayView: cc.Node,
        loginView: cc.Node,
        loadingView:cc.Node
    },


    onLoad () {
        console.info("localNode onLoad");
        this.loginView.active = true;
    },

    start () {
        console.info("addPersistRootNode localNode");
        // 声明常驻根节点
        cc.game.addPersistRootNode(this.node);
    },
    
    /**
     * 初始系统配置
     */
    init:function(){
        console.info("localNode init ");

        //初始plat
        plat.target = plat.init({
            onHide:function(){
    
            },
            onShow:function(){

            },
            success:function(res){
                console.info("platTarget:",plat.target.getName());
                console.info(res);
              
            }
        });

    },

    /**
     * 展示小游戏数据域
     */
    showDisplayView:function(){
        this.display.active = true;
        let data = {
            name:'getFriendCloudStorage',
            res:{}
        }
        plat.sendMessageToChild(data);
    },
    /**
     * 移除小游戏数据域
     */
    hideDisplayView:function(){
        this.display.active = false;
    },

    /**
     * loadRes
     * 游戏开始时加载的资源 
     * @param {*} obj {success:function,fail:function,...}
     */
    loadRes:function(obj){
        var that = this;
        that.loadResA(obj);
    },

    /**
     * 加载游戏配置
     * @param {*} obj 
     */
    loadResA:function(obj){
        var that = this;

        cc.loader.loadRes("gameConfig",
            function (completedCount, totalCount,item){
                console.info("加载游戏配置:",item,`,完成度:${completedCount}/${totalCount}`);
                let process = completedCount/totalCount;
                that.loadingView.getComponent("loadingView").showProcess(process.toFixed(2));
            },
            function (err, jsonAsset) {
                if(err){
                    console.error(err);

                }else{
                    console.info("init gameConfig:",jsonAsset.json);
                    common.gameConfig.version = jsonAsset.json.version;
                    that.loadResB(obj)
                    
                }
            }
        );
    },

    /**
     * 加载需要提前引入的资源
     * @param {*} obj 
     */
    loadResB:function(obj){
        var that = this;
        //加载loadres目录下的资源
        cc.loader.loadResDir("loadres", cc.SpriteFrame, 
            function (completedCount, totalCount,item){
                console.info("加载本地图片到纹理:",item,`,完成度:${completedCount}/${totalCount}`);
                let process = completedCount/totalCount;
                that.loadingView.getComponent("loadingView").showProcess(process.toFixed(2));
            },
            function (err, assets, urls) {
                if(err){
                    console.info(err);
                    return;
                }
                for (let index = 0; index < urls.length; index++) {
                    common.textureRes.set(urls[index],assets[index]); 
                }
                that.loadResC(obj)
            }
        );
    },

    /**
     * 加载远程资源
     * @param {*} obj 
     */
    loadResC:function(obj){
        var that = this;
        //加载远程资源
        let url = config.service.imgUrl+"ball.png";
        cc.loader.load({url:url, type:'png'}, 
            function (completedCount, totalCount,item){
                console.info("加载远程图片到纹理:",item,`,完成度:${completedCount}/${totalCount}`);
                let process = completedCount/totalCount;
                that.loadingView.getComponent("loadingView").showProcess(process.toFixed(2));
            },
            function (err, tex) {
                if(err){
                    console.info("loadHttpPng:",err);
                    return;
                }
                that.loadResD(obj)
            }
        );
    },

    /**
     * 加载字体
     * @param {*} obj 
     */
    loadResD:function(obj){
        var that = this;
        let url = config.service.imgUrl+"ball.png";
        console.info(cc.loader.getRes(url,cc.Texture2D))

        //加载字体
        g_define.loadHttpFont({
            url:"https://lg-3q7kbp58-1257126548.cos.ap-shanghai.myqcloud.com/fnt/HYYANKAIW.ttf",
            path:"HYYANKAIW.ttf",
            success:function(fontname){
                console.info("loadHttpFont:",fontname);
                // myToast.refreshFont(cc.find("Canvas"),"HYYankaiW");

               
            },
            complete:function(){
                //加载结束
                that.loadingView.active = false;
                obj.success();
            },
            onProcess:function(process){
                that.loadingView.getComponent("loadingView").showProcess(process.toFixed(2));
            }
        });

    },


    /**
     * 登录
     * @param {*} obj 
     */
    login:function(obj){
        var that = this;
        that.loginView.getComponent("loginView").login(obj);
    },
   
});
