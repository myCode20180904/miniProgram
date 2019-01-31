
cc.Class({
    extends:cc.Component,

    properties: {
        item:{
            default:null,
            type:cc.Node
        },
        scrollView:{
            default:null,
            type:cc.Node
        },
        itembg1:cc.SpriteFrame,
        itembg2:cc.SpriteFrame,
        myOpenid:0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        console.info("rank sub display onLoad");

    },

    start () {

        let _self = this;
        wx.onMessage( data => {
            console.log(data);
            if(data.name == "setUserCloudStorage"){
                let info = data.data;
                console.info(info.score);
                wx.setUserCloudStorage({
                    KVDataList:[{key:'score',value:`${info.score}`}],
                    success: res => {
                        console.log(res);
                        
                    },
                    fail: res => {
                        console.log(res);
                    }
                });
            } else if(data.name == "getFriendCloudStorage"){
                // https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getFriendCloudStorage.html
                wx.getFriendCloudStorage({
                    keyList: ['score'], // 你要获取的、托管在微信后台都key
                    success: function (res) {
                        console.info("getFriendCloudStorage",res);
                        _self.Scroll_View(res.data);
                    },
                    fail: function (res) {
                        console.error(res);
                    }
                });
            }else if(data.name == "setMyOpenId"){
                let info = data.data;
                this.myOpenid = info.openid;
            }



        });

        // https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getUserInfo.html
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            lang: 'zh_CN',
            success: (res) => {
                console.log('success', res.data);
                let userInfo = res.data[0];
                
            },
            fail: (res) => {
                reject(res);
            }
        });
        
        

    },
    
    
    //精灵动态加载网络图片
    loadHttpIcon:function(container,_iconUrl,_callfunc){
        if(!_iconUrl||_iconUrl==""){
            _iconUrl="http://thirdwx.qlogo.cn/mmopen/vi_32/opmkDJhG2jpF8X8AfFQfTauRlpBc7VeFicJevZ9IiajEl5g4ia75opNSZOb0FvDV87BvpUN1rsyctibGnicP7uibsMtw/132"
        }
        cc.loader.load({url: _iconUrl, type: 'png'}, function (err, tex) {
            var spriteFrame=new cc.SpriteFrame(tex)
            container.getComponent(cc.Sprite).spriteFrame=spriteFrame;
            if(_callfunc){
                _callfunc()
            }
            console.info('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
        });
    },


    Scroll_View:function(rankdata){
        var compare = function (x, y) {//比较函数
            let score_x = 0;
            let score_y = 0;
            if(x.KVDataList.length>0){
                score_x = parseInt(x.KVDataList[0].value) 
            }
            if(y.KVDataList.length>0){
                score_y = parseInt(y.KVDataList[0].value)
            }

            if (score_x < score_y) {
                return 1;
            } else if (score_x > score_y) {
                return -1;
            } else {
                return 0;
            }
        }
        rankdata.sort(compare);

        // {
        //     let tsts = rankdata[0];
        //     for (let index = 0; index < 10; index++) {
        //         rankdata.push(tsts);
                
        //     }
            
        // }


        let size = rankdata.length>=10?10:rankdata.length;
        console.info("Scroll_View",size)
        //this.scrollView.node.on('scroll-to-top', this.callback, this);
        let row = 0;
        let col = 0;
        this.scrollView.getComponent(cc.ScrollView).content.height = size*125
        let selfinfo = 0;
        for (let index = 0; index <size; index++) {
            let friendInfo = rankdata[index];
            let score = 0;
            if(friendInfo.KVDataList.length>0){
                score = parseInt(friendInfo.KVDataList[0].value)
            }
            console.info(index,friendInfo)
            if (!friendInfo) {
                
                continue;
            }
            

            let item = cc.instantiate(this.item);
            item.active = true;
            this.scrollView.getComponent(cc.ScrollView).content.addChild(item);

            let W = this.scrollView.getComponent(cc.ScrollView).content.width
            let H = this.scrollView.getComponent(cc.ScrollView).content.height
            row = index%1;
            col =parseInt((index)/1);
            item.setPosition(cc.v2(0,-(125/2+col*125)));

            item.getChildByName("name").getComponent(cc.Label).string = friendInfo.nickname;
            console.info(item.getChildByName("score"))
            console.info(item.getChildByName("score").getComponent(cc.Label))
            item.getChildByName("score").getComponent(cc.Label).string =score// `<outline color=#ffffff width=2><color=#435168>${score}</c></outline>`;
            // let head =  item.getChildByName("iconMask").getChildByName("head");
            // this.loadHttpIcon(head,friendInfo.avatarUrl,function(){});
        
            item.getChildByName("num").getComponent(cc.Label).string = `NO.${index+1}`;
            // self
            if(friendInfo.nickname == this.myOpenid){
                selfinfo = friendInfo;
                selfinfo.score = score;
                selfinfo.index = index+1;

                item.getComponent(cc.Sprite).spriteFrame = this.itembg2; 
            }

        }

        // self
        if(selfinfo){
            

        }


    },

});
