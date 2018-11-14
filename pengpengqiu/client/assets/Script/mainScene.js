var dataScript = require('./model/dataScript')
var plat = require('./plat/platScript')
var myToast = require('./public/myToast')
var config = require('./public/config')
var g_define = require('./public/g_define')
var qcloud = require('./plat/qcloud')
var aStar = require('./utils/aStar')

cc.Class({
    extends: cc.Component,

    properties: {
        select:{
            default:null,
            type:cc.Node
        },
        fuhuo_lb:{
            default:null,
            type:cc.Node
        },
        baoji_lb:{
            default:null,
            type:cc.Node
        },
    },

    onLoad () {
        this.load();
    },

    start () {
        //创建广告
        plat.changeBannerAd();
    },

    // use this for initialization
    load: function () {
        var that = this;
        
        let str = g_define.ENStr("L\u0016\u0010Z\u0003I@\r\u0012Zw%qP,zsO/svS/O6B~c^M(6vS.`[\r@\u001b\u0012GL\u0004@@Y\u0000O",dataScript.common.passkey)
        // console.info(str);
        // console.info(this.node.getChildByName("background").getComponent(cc.Widget));
        // if(window.innerWidth/window.innerHeight>640/1136){
            
        // }else{
        //     this.node.getChildByName("background").getComponent(cc.Widget).top = 0;
        //     this.node.getChildByName("background").getComponent(cc.Widget).bottom = 0;
        //     this.node.getChildByName("background").getComponent(cc.Widget).isAlignTop = true;
        //     this.node.getChildByName("background").getComponent(cc.Widget).isAlignBottom = true;
        //     this.node.getChildByName("background").width = this.node.getChildByName("background").height*(640/1136)/(window.innerWidth/window.innerHeight)
        // }

        cc.loader.loadRes("gameConf", function (err, jsonAsset) {
            if(err){
                console.error(err);
 
             }else{
                dataScript.gamedata.gameConf = jsonAsset.json;
                console.info(dataScript.gamedata.gameConf);
                dataScript.gamedata.map_cell = dataScript.gamedata.gameConf.map_cell;

             }
        });

        that.updateUI();
        //登录sdk
        var localNode = cc.find("localNode").getComponent("localNodeScript");
        localNode.init();
        localNode.loadRes({
            success:function(){
                myToast.show(1,"登陆成功");
                that.refreshData();
                        
                that.updateUI();
                // localNode.serverLogin({
                //     code:dataScript.userInfo.code,
                //     nickName:dataScript.userInfo.name,
                //     picUrl:dataScript.userInfo.avatarUrl,
                //     success:function(){

                //         that.refreshData();
                        
                //         that.updateUI();
                //     }
                // });
                


                // //开始一个信道
                // qcloud.start({success:function(){}});
                // that.schedule(that.dealTunnel, 0.1);

              
            

            }
        });

    },

    //处理消息范例
    dealTunnel:function(){
        if(dataScript.common.tunnelStatus === 'connected'){
            this.unschedule(this.dealTunnel);
            
            qcloud.revcMessage('speak', function(msg){
                console.info('revc_speak', msg);
            });

            qcloud.sendMessage('speak', { word: "hello", who:dataScript.userInfo.skey});
        }
    },
    refreshData:function(){
        if(true){
            let data = {
                name:'setMyOpenId',
                res:{
                    openid:dataScript.userInfo.name,
                }
            }
            plat.sendMessageToChild(data);
        }
       

         //--------------------------暂时本地保存用户数据------------------------------------------------
        //登陆保存数据
        if(cc.sys.localStorage.getItem('loginDay')){
            dataScript.userInfo.loginDay = parseInt(cc.sys.localStorage.getItem('loginDay'));
        }else{
            dataScript.userInfo.loginDay = 1;
            cc.sys.localStorage.setItem('loginDay',1)
        }
        if(cc.sys.localStorage.getItem('todaySign')){
            dataScript.userInfo.todaySign = parseInt(cc.sys.localStorage.getItem('todaySign'));
        }else{
            dataScript.userInfo.todaySign = 0;
            cc.sys.localStorage.setItem('todaySign',0)
        }

        //层级保存数据
        if(cc.sys.localStorage.getItem('map_index')){
            dataScript.gamedata.map_index = parseInt(cc.sys.localStorage.getItem('map_index'));
        }else{
            dataScript.gamedata.map_index = 0;
        }
        //皮肤保存数据
        if(cc.sys.localStorage.getItem('roleSelScan')){
            dataScript.userInfo.roleSelScan = parseInt(cc.sys.localStorage.getItem('roleSelScan'));
        }else{
            dataScript.userInfo.roleSelScan = 0;
        } 
        if(cc.sys.localStorage.getItem('roleScan')){
            dataScript.userInfo.roleScan = JSON.parse(cc.sys.localStorage.getItem('roleScan'));
            var compare = function (x, y) {//比较函数
                if (x < y) {
                    return -1;
                } else if (x > y) {
                    return 1;
                } else {
                    return 0;
                }
            }
            dataScript.userInfo.roleScan
            dataScript.userInfo.roleScan.sort(compare);
        }else{
            dataScript.userInfo.roleScan = new Array();
            dataScript.userInfo.roleScan.push(0);
            cc.sys.localStorage.setItem('roleScan',JSON.stringify(dataScript.userInfo.roleScan));

        } 
        if(cc.sys.localStorage.getItem('freeLuck')){
            dataScript.userInfo.freeLuck = parseInt(cc.sys.localStorage.getItem('freeLuck'));
        }else{
            dataScript.userInfo.freeLuck = 0;
            cc.sys.localStorage.setItem('freeLuck',0)
        }
        //复活卡
        if(cc.sys.localStorage.getItem('jiasuka')){
            dataScript.userInfo.jiasuka = parseInt(cc.sys.localStorage.getItem('jiasuka'));
        }else{
            dataScript.userInfo.jiasuka = 0;
        } 
        //复活卡
        if(cc.sys.localStorage.getItem('fuhuoka')){
            dataScript.userInfo.fuhuoka = parseInt(cc.sys.localStorage.getItem('fuhuoka'));
        }else{
            dataScript.userInfo.fuhuoka = 0;
        } 
        //保级卡
        if(cc.sys.localStorage.getItem('baojika')){
            dataScript.userInfo.baojika = parseInt(cc.sys.localStorage.getItem('baojika'));
        }else{
            dataScript.userInfo.baojika = 0;
        } 
        //分享邀请
        if(cc.sys.localStorage.getItem('inviteFriends')){
            dataScript.userInfo.inviteFriends = JSON.parse(cc.sys.localStorage.getItem('inviteFriends'));
        }else{
            dataScript.userInfo.inviteFriends = new Array();
            cc.sys.localStorage.setItem('inviteFriends',JSON.stringify(dataScript.userInfo.inviteFriends));
        } 
        if(cc.sys.localStorage.getItem('inviteFriendsReward')){
            dataScript.userInfo.inviteFriendsReward = JSON.parse(cc.sys.localStorage.getItem('inviteFriendsReward'));
        }else{
            cc.sys.localStorage.setItem('inviteFriendsReward',JSON.stringify(dataScript.userInfo.inviteFriendsReward));
        } 

        //分数
        if(cc.sys.localStorage.getItem('score')){
            dataScript.userInfo.score = parseInt(cc.sys.localStorage.getItem('score'));
        }

        //图像列表
        if(plat.platTarget == "wx"){
            for (let index = 0; index < 13; index++) {
                const element = config.service.imgUrl + `/Icon/role${index}.png`;
                dataScript.gamedata.imageUrlList.push(element);
            }
            for (let index = 1; index < 12; index++) {
                const element = config.service.imgUrl + `/Icon/${index}.jpg`;
                dataScript.gamedata.imageUrlList.push(element);
            }
        }
       


        // var that = this;
        // //同步开放信息
        // plat.request({
        //     url:config.service.apiUrl+"/SyncOpenInfo",
        //     data:{
        //         pt:"SyncOpenInfo",
        //         uid:dataScript.userInfo.uid,
        //         token:dataScript.userInfo.skey
        //     },
        //     success:function(res){
        //         console.info("SC_SyncOpenInfo:",res)
        //         if(res[0].skinIdx){
        //             dataScript.userInfo.roleSelScan = res[0].skinIdx;
        //         }
        //         if(res[0].relivingCard){

        //         }
        //         if(res[0].keepingCard){

        //         }
        //         if(res[0].skillCard){

        //         }
        //         if(res[0].mapIdx){
        //             dataScript.gamedata.map_index = res[0].map_index;
        //         }
        //         if(res[0].friends){

        //         }




        //         that.updateUI();
        //     },
        // })
       
    },

    openPage:function(event,customEventData){
       // console.info(event);
        console.info(customEventData);
        if(customEventData=="daysign"){

            myToast.showPrefab("prefab/daySign",function(pSender,extInfo){
                console.info(pSender);
                console.info(extInfo);
            },{data:customEventData});

        }else if(customEventData=="startGame"){
            console.info(cc.sys.localStorage.getItem('isNewPlayer'));
            if(cc.sys.localStorage.getItem('isNewPlayer')==1){
                dataScript.gamedata.startGame();
            }else{
                myToast.showPrefab("prefab/help",function(pSender,extInfo){
                    console.info(pSender);
                    console.info(extInfo);
                    pSender.getComponent("help").callBack = function(){
                        dataScript.gamedata.startGame();
                    }
                },{data:this});
            }

        }else if(customEventData=="select"){
            myToast.showPrefab("prefab/selectRole",function(pSender,extInfo){
                console.info(pSender);
                console.info(extInfo);
            },{data:customEventData});

        }else if(customEventData=="rank"){
            myToast.showPrefab("prefab/rank",function(pSender,extInfo){
                console.info(pSender);
                console.info(extInfo);
            },{data:customEventData});

        }else if(customEventData=="luckWheel"){
            myToast.showPrefab("prefab/luckWheel",function(pSender,extInfo){
                console.info(pSender);
                console.info(extInfo);
            },{data:customEventData});

        }else if(customEventData=="wechat"){
            //
            plat.onJumpOther("appid",'page');
            window.open("http://127.0.0.1:5380/index.html")
            
        }else if(customEventData=="share"){
            myToast.showPrefab("prefab/shareGift",function(pSender,extInfo){
                console.info(pSender);
                console.info(extInfo);
            },{data:customEventData});
        }else if(customEventData=="friend"){
            //
            let randnum = parseInt(Math.random()*3);
            console.info(dataScript.userInfo.avatarUrl)
            let shareData = {
                title:dataScript.common.shareArray[randnum].title,
                imageUrl:dataScript.common.shareArray[randnum].img,
                // query:`sharetype=1&sharekey=${dataScript.userInfo.skey}`
                query:`sharetype=1&sharekey=${dataScript.userInfo.avatarUrl}`
            }
            
            plat.onShare(shareData,function(res){
                console.info(res)

            });
        }

    },


    updateUI:function(){

        this.fuhuo_lb.getComponent(cc.Label).string = dataScript.userInfo.fuhuoka;
        this.baoji_lb.getComponent(cc.Label).string = dataScript.userInfo.baojika;
        
        dataScript.userInfo.refreshDay();
        this.refreshLevel();
        this.refreshSelectUI();
    },

   
    //层级
    refreshLevel:function(){
        let level = this.node.getChildByName("menuNode").getChildByName("level");
        let lv1 = level.getChildByName("lv1").getComponent(cc.Label);
        let lv2 = level.getChildByName("lv2").getComponent(cc.Label);
        let lv3 = level.getChildByName("lv3").getComponent(cc.Label);

        if(cc.sys.localStorage.getItem('pre_map_index')){
            dataScript.gamedata.pre_map_index = parseInt(cc.sys.localStorage.getItem('pre_map_index'));
        }else{
            dataScript.gamedata.pre_map_index = 0;
        }
        let up = dataScript.gamedata.pre_map_index<=dataScript.gamedata.map_index?true:false;

        lv1.string = `${dataScript.gamedata.map_index+2}层`;
        if(up){
            lv2.string = `${dataScript.gamedata.map_index+1}层 ↑`;//↓↑
        }else{
            lv2.string = `${dataScript.gamedata.map_index+1}层 ↓`;
        }

        lv3.string = `${dataScript.gamedata.map_index}层`;
        if(dataScript.gamedata.map_index<=0){
            level.getChildByName("lv3").active = false;
        }

    },
    //换皮肤选择
    refreshSelectUI:function(){

        let pageView = this.select.getChildByName("PageView");
        pageView.on('page-turning',this.onPageView, this);
        //增加页数
        let pageNum = pageView.getComponent(cc.PageView).getPages().length;
        console.info(pageNum)
        if(pageNum<dataScript.userInfo.roleScan.length){
            for (let index = 0; index <dataScript.userInfo.roleScan.length-pageNum; index++) {
                let newPage = cc.instantiate(pageView.getComponent(cc.PageView).getPages()[0]);
                pageView.getComponent(cc.PageView).addPage(newPage);
            }
        }

        let scollTo =  0;
        //
        for (let index = 0; index <dataScript.userInfo.roleScan.length; index++) {
            const scan_index = dataScript.userInfo.roleScan[index];
            let page = pageView.getComponent(cc.PageView).getPages()[index];
            let item = cc.instantiate(this.select.getChildByName("item"));
            item.active = true;
            item.parent = page;
            item.setPosition(cc.v2(0,0));
            let key = `loadres/role/role${scan_index}`
            item.getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(key);
            
            
            if(dataScript.userInfo.roleSelScan==scan_index){
                scollTo = index;
            }
        }

        let left = this.select.getChildByName("left");
        let right = this.select.getChildByName("right");
        left.on(cc.Node.EventType.TOUCH_END,this.onBack, this);
        right.on(cc.Node.EventType.TOUCH_END,this.onNext, this);

        pageView.getComponent(cc.PageView).setCurrentPageIndex(scollTo);
        this.cur_role_index = scollTo;

        this.refreshSelect();
    },
    onBack:function(event){
        this.cur_role_index--;
        let pageView = this.select.getChildByName("PageView");
        let index = pageView.getComponent(cc.PageView).getCurrentPageIndex();
        if(this.cur_role_index<=0){
            this.cur_role_index = 0;
        }
        dataScript.userInfo.roleSelScan = dataScript.userInfo.roleScan[this.cur_role_index];
        cc.sys.localStorage.setItem('roleSelScan',dataScript.userInfo.roleSelScan);
        pageView.getComponent(cc.PageView).scrollToPage(this.cur_role_index,0.2);
        this.refreshSelect();
    },
    onNext:function(event){
        this.cur_role_index++;
        let pageView = this.select.getChildByName("PageView");
        if(this.cur_role_index>=dataScript.userInfo.roleScan.length-1){
            this.cur_role_index=dataScript.userInfo.roleScan.length-1;
        }
        dataScript.userInfo.roleSelScan = dataScript.userInfo.roleScan[this.cur_role_index];
        cc.sys.localStorage.setItem('roleSelScan',dataScript.userInfo.roleSelScan);
        pageView.getComponent(cc.PageView).scrollToPage(this.cur_role_index,0.2);
        this.refreshSelect();
    },
    onPageView:function(event){
        let pageView = this.select.getChildByName("PageView");
        let index = pageView.getComponent(cc.PageView).getCurrentPageIndex();
        dataScript.userInfo.roleSelScan = dataScript.userInfo.roleScan[index];
        cc.sys.localStorage.setItem('roleSelScan',dataScript.userInfo.roleSelScan);
        this.refreshSelect();
    },
    refreshSelect:function(){
        let left = this.select.getChildByName("left");
        let right = this.select.getChildByName("right");
        let pageView = this.select.getChildByName("PageView");
        let index = pageView.getComponent(cc.PageView).getCurrentPageIndex();

        if(dataScript.userInfo.roleScan.length <= 1){
            left.getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get('loadres/comm/lweixuan');
            left.getComponent(cc.Button).interactable = false;
            right.getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get('loadres/comm/rweixuan');
            right.getComponent(cc.Button).interactable = false;
        }else{
            let key1 = `loadres/comm/ljiantou`;
            let key2 = `loadres/comm/rjiantou`;
            left.getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(key1);
            right.getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get(key2);
            left.getComponent(cc.Button).interactable = true;
            right.getComponent(cc.Button).interactable = true;
            if(index==0){
                left.getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get('loadres/comm/lweixuan');
                left.getComponent(cc.Button).interactable = false;
            }else if(index == dataScript.userInfo.roleScan.length-1){
                right.getComponent(cc.Sprite).spriteFrame = dataScript.common.textureRes.get('loadres/comm/rweixuan');
                right.getComponent(cc.Button).interactable = false;
            }else{
               
            }
        }
        
    },

});
