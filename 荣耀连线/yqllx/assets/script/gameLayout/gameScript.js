
var g_define = require('../g_define');
var myToast = require('../mainScene/toastScript');
var config = require('../config')

cc.Class({
    extends: cc.Component,

    properties: {

        //游戏配置
        gameinfo:"",
        pointMode:{
            default:null,
            type:cc.Node,
        },
        lineMode:{
            default:null,
            type:cc.Node,
        },
        gridLine:{
            default:null,
            type:cc.Node,
        },
        blockMode:{
            default:null,
            type:cc.Node,
        },
        routeTipMode:{
            default:null,
            type:cc.Node,
        },
        tipStar:{
            default:null,
            type:cc.Node,
        }, 
        hand:{
            default:null,
            type:cc.Node,
        },

        point_farm1:cc.SpriteFrame,
        point_farm2:cc.SpriteFrame,
        point_farm3:cc.SpriteFrame,
        line_farm1:cc.SpriteFrame,
        line_farm2:cc.SpriteFrame,
        line_farm3:cc.SpriteFrame,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lySize = cc.size(720,720);
        this.setGate("gate/gate"+g_define.gameConfig.gate,this);
        this.blocks = new Array();//方块
        this.lineMaps = new Map();//画的线
        this.completeLines = new Map();//完成的线
        this.tipCompleteLines = new Map();//靠提示完成的线
    },

    start () {
      
        
    },

    // 设置关卡信息
    setGate: function(path,that){
        cc.loader.loadRes(path, function (err, jsonAsset) {
           if(err){
               console.error(err);

            }else{
                that.setGameInfo(jsonAsset.json);
            }
       });
    },
    setGameInfo: function(json){
       this.gameinfo = json;
       if(g_define.gameConfig.gateLevel<=1){
            this.gameinfo.newplayer = 1;
       }

       console.info('setGameInfo:');
       console.info(this.gameinfo);
       this.loadGame();
    },
    loadGame:function(){
        this.lySize = cc.size(this.gameinfo.size.width,this.gameinfo.size.height);
        this.drawGrid();
        this.step = 0;
        this.maxLine = this.gameinfo.pointArr.length/2;

        //触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START,this.onStartTouch, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onMoveTouch, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onCancelTouch, this);

        if(this.gameinfo.newplayer){
            this.newPlayerTip();
            myToast.show(3.0,"连线所有的相同颜色的格子，\n所有格子必须都要被填满。",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
    },

    checkPass:function(){
        let com_block = 0;
        console.info(this.completeLines)
        this.completeLines.forEach(function (value, key, map) {
            // value: 指向当前元素的值
            // key: 指向当前索引
            // map: 指向map对象本身
            com_block+=value.length;
        });
        console.info(com_block);
        if(com_block>=this.gameinfo.max_row*this.gameinfo.max_col){
            //console.info(this.completeLines);
            console.info("pass game");
            this.node.off(cc.Node.EventType.TOUCH_START,this.onStartTouch, this);
            this.node.off(cc.Node.EventType.TOUCH_MOVE,this.onMoveTouch, this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onCancelTouch, this);

            if(window.wx){
                var commonScript=cc.find("wxNode").getComponent("commonData");
                var that=this
                var _url=config.service.gameOver;
                let str = `{"skey":"${g_define.getDataScript().userInfo.skey}","step":${this.step.toString()}}`
                var _data={
                    mkey:g_define.getDataScript().mkey,
                    str:g_define.ENStr(str,g_define.getDataScript().passkey),
                    type:g_define.gameConfig.gameType
                }
                var _callfunc=function(response){
                    console.info(response);
                   
                    if(response.err==0){
                        if(response.reward){ 
                            g_define.getDataScript().userInfo.money=(parseFloat(g_define.getDataScript().userInfo.money)+parseFloat(response.reward)).toFixed(2);
                            if(g_define.gameConfig.gameType == 1){
                                g_define.getDataScript().lastXSHBreward = (parseFloat(response.reward)).toFixed(2);
                                if(response.addStep>0){
                                    g_define.getDataScript().quickBattleData.step+=response.addStep;
                                    cc.find("Canvas/gameLayout").getComponent("gameScript").refreshStepUi();
                                    myToast.showPrefab("prefab/jiangLiStep",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2),null,function(){
                                        cc.director.getScene().getChildByName("jiangLiStep").getComponent("jiangLiStep").gate = g_define.gameConfig.gateLevel;
                                        cc.director.getScene().getChildByName("jiangLiStep").getComponent("jiangLiStep").reward = response.addStep;
                                     },10);
                                }
                            }else if(g_define.gameConfig.gameType == 2){
                                myToast.showPrefab("prefab/passReward",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2),null,function(){
                                    cc.director.getScene().getChildByName("passReward").getComponent("passReward").reward = response.reward;
                                });
                            }
                        }
                         //通关 
                         that.passGame();
                    }else{
                        if(response.err==1){
                            myToast.show(1.0,response.msg,cc.find("Canvas"));
                        }
                    }
                }

                commonScript.sendHttpRequest(_data ,_url,_callfunc);
            }
           
        }

        if(this.gameinfo.newplayer){
            this.newPlayerTip();
        }
        this.refreshStepUi();
    },
    //刷新步数显示
    refreshStepUi:function(){
        //
        if(cc.find("Canvas").getComponent("gameuiScript")){
            cc.find("Canvas").getComponent("gameuiScript").bushu_num = this.step;
            //bushu
            if(g_define.gameConfig.gameType==1){
                cc.find("Canvas").getComponent("gameuiScript").bushu.getComponent(cc.Label).string 
                =g_define.getDataScript().quickBattleData.step-this.step;
                if(g_define.getDataScript().quickBattleData.step-this.step<=0){
                    cc.find("Canvas").getComponent("gameuiScript").bushu.getComponent(cc.Label).string=0;
                }
            }else if(g_define.gameConfig.gameType==2){
                cc.find("Canvas").getComponent("gameuiScript").bushu.getComponent(cc.Label).string 
                =g_define.getDataScript().gateBattleData.step-this.step;
                if(g_define.getDataScript().gateBattleData.step-this.step<=0){
                    cc.find("Canvas").getComponent("gameuiScript").bushu.getComponent(cc.Label).string=0;
                }
            }
        }
    },
    //通关
    passGame:function(){
        var commonScript=cc.find("wxNode").getComponent("commonData");
        commonScript.startGame(g_define.gameConfig.gameType,true);

    },

    //画网格
    drawGrid:function(){
        console.info("drawGrid");
        let onedis_h = parseInt(this.lySize.height/this.gameinfo.max_row);
        let onedis_w = parseInt(this.lySize.width/this.gameinfo.max_col);

        console.info(onedis_h+":"+onedis_w);
        for(var i = 0;i<this.gameinfo.max_row+1;i++){
            var node = cc.instantiate(this.gridLine);
            node.parent = this.gridLine.parent;
            node.setPosition(0,-this.lySize.height/2+onedis_h*i);
            node.width = this.lySize.width;
            node.active = true;
            //console.info(`${i}":"${node.y}`);
        }
        for(var i = 0;i<this.gameinfo.max_col+1;i++){
            var node = cc.instantiate(this.gridLine);
            node.parent = this.gridLine.parent;
            node.setPosition(-this.lySize.width/2+onedis_w*i,0);
            node.width = this.lySize.height;
            node.rotation = 90;
            //console.info(`${i}":"${node.x}`);
            node.active = true;
        }

        //block
        for (let index = 0; index < this.gameinfo.max_row; index++) {
            for (let jndex = 0; jndex < this.gameinfo.max_col; jndex++) {
                var node = cc.instantiate(this.blockMode);
                node.parent = this.blockMode.parent;

                node.getComponent("block_s").row = index;
                node.getComponent("block_s").col = jndex;
                node.width = onedis_w;
                node.height = onedis_h;
                node.setPosition(-this.lySize.width/2+onedis_w/2+jndex*onedis_w,-this.lySize.height/2+onedis_h/2+index*onedis_h);
                node.active = true;

                //
                node.getComponent("block_s").__pointColor = "pure";
                node.getComponent("block_s").start_end = 0;
                node.getComponent("block_s").line = g_define.lineDir.meiyou;
                node.getComponent("block_s").rectx = node.x - onedis_w/2;
                node.getComponent("block_s").recty = node.y - onedis_h/2;
                node.getComponent("block_s").rectw = node.width;
                node.getComponent("block_s").recth = node.height;

                this.blocks.push(node);
            }
            
        }

         //point
         for (let index = 0; index < this.blocks.length; index++) {
            const element = this.blocks[index];
            for(var i = 0;i<this.gameinfo.pointArr.length;i++){
                if(element.getComponent("block_s").row==this.gameinfo.pointArr[i].row
                &&element.getComponent("block_s").col==this.gameinfo.pointArr[i].col)
                this.addPoint(element,this.gameinfo.pointArr[i].row
                    ,this.gameinfo.pointArr[i].col
                    ,this.gameinfo.pointArr[i].color);
    
            }
        }

        this.tiplineMaps = new Map();
        //init tip
        if(this.gameinfo.tip){
            for(var i = 0;i<this.gameinfo.tip.length;i++){
                 const element = this.gameinfo.tip[i];
                 let blocks = new Array();
                 for (let index = 0; index < element.route.length; index++) {
                     const element1 = element.route[index];
                     if(this.getBlockXY(element1.row,element1.col)){
                        blocks.push(this.getBlockXY(element1.row,element1.col));
                     }
                     
                 }
                this.tiplineMaps.set(element.color,blocks);
             }
        }


    },
   
    //加连线
    addLine:function(block1,block2,isTip){
        if(block1.getComponent("block_s").line != g_define.lineDir.meiyou){
            return false;
        }
        //
        if(isTip!="undefined"){
            if(isTip){
                //提示处理，删除路径上错误的线
                if(block2.getComponent("block_s").__pointColor!="pure")
                {
                    if(block2.getComponent("block_s").__pointColor!=block1.getComponent("block_s").__pointColor){
                        //清除这条线
                        console.info(this.lineMaps);
                        console.info(block2.getComponent("block_s").__pointColor);
                        if(this.lineMaps.has(block2.getComponent("block_s").__pointColor)){
                            console.info("has "+block2.getComponent("block_s").__pointColor );
                            this.removeLine(block2.getComponent("block_s").__pointColor,0,0);
                        }
                    }
                }
            }
        }
        let onedis_w = parseInt(this.lySize.width/this.gameinfo.max_col);
        let onedis_h = parseInt(this.lySize.height/this.gameinfo.max_row);
        if(block1.x==block2.x){
            if(block1.y==block2.y+onedis_h){
                //bottom
                this._addLine(block1,cc.v2(0,-onedis_h/2),0,block1.getComponent("block_s").__pointColor);
                block1.getComponent("block_s").line = g_define.lineDir.bottom;
                return true;
            }else if(block1.y+onedis_h==block2.y){
                //top
                this._addLine(block1,cc.v2(0,onedis_h/2),0,block1.getComponent("block_s").__pointColor);
                block1.getComponent("block_s").line = g_define.lineDir.top;
                return true;
            }
        }
        if(block1.y==block2.y){
            if(block1.x+onedis_w==block2.x){
                //right
                this._addLine(block1,cc.v2(onedis_w/2,0),90,block1.getComponent("block_s").__pointColor);
                block1.getComponent("block_s").line = g_define.lineDir.right;
                return true;
            }else if(block1.x==block2.x+onedis_w){
                //left
                this._addLine(block1,cc.v2(-onedis_w/2,0),90,block1.getComponent("block_s").__pointColor);
                block1.getComponent("block_s").line = g_define.lineDir.left;
                return true;
            }
        }
        return false;
    },
            //5 - 128,6 - 106.6,7 - 91,8 - 80,9 - 71,-10 - 64
    _addLine:function(parent,pos,roat,color){
        var node = cc.instantiate(this.lineMode);
        parent.addChild(node,10);
        node.setPosition(pos.x,pos.y);
        node.width = parseInt(this.lySize.width/this.gameinfo.max_col)*0.33; 
        node.height = parseInt(this.lySize.height/this.gameinfo.max_row)*1.33;
        node.rotation = roat;
        node.color = g_define.string2color(color);
        node.active = true;
        node.getComponent("line").pointColor = color;
        if(parseInt(this.lySize.width/this.gameinfo.max_col)>100){
            node.getComponent(cc.Sprite).spriteFrame = this.line_farm1;
        }else if(parseInt(this.lySize.width/this.gameinfo.max_col)>79){
            node.getComponent(cc.Sprite).spriteFrame = this.line_farm2;
        }else{
            node.getComponent(cc.Sprite).spriteFrame = this.line_farm3;
        }
    },
     //加点
     addPoint:function(parent,row,col,color){
        let onedis_h = parseInt(this.lySize.height/this.gameinfo.max_row);
        let onedis_w = parseInt(this.lySize.width/this.gameinfo.max_col);

        var node = cc.instantiate(this.pointMode);
        node.parent = parent;
        node.color = g_define.string2color(color);
        node.width = onedis_w*0.7;
        node.height = onedis_h*0.7;
        node.setPosition(0,0);
        node.getComponent("point").pointColor = color;
        //node.setPosition(-this.lySize.width/2+onedis_w/2+col*onedis_w,-this.lySize.height/2+onedis_h/2+row*onedis_h);
        node.active = true;
    
        if(parseInt(this.lySize.width/this.gameinfo.max_col)>100){
            node.getComponent(cc.Sprite).spriteFrame = this.point_farm1;
        }else if(parseInt(this.lySize.width/this.gameinfo.max_col)>79){
            node.getComponent(cc.Sprite).spriteFrame = this.point_farm2;
        }else{
            node.getComponent(cc.Sprite).spriteFrame = this.point_farm3;
        }
    },
    addRouteTip:function(parent,color){//浅色路径
        var node = cc.instantiate(this.routeTipMode);
        node.parent = parent;
        node.setPosition(0,0);
        node.width = parent.width; 
        node.height = parent.height;
        node.color = g_define.string2color(color);
        node.opacity = 80;
        node.active = true;
    },
    addTipStar:function(parent){
        var node = cc.instantiate(this.tipStar);
        parent.parent.addChild(node,1000);
        node.setPosition(parent.x,parent.y);
        node.width = parseInt(this.lySize.width/this.gameinfo.max_col)*0.4; 
        node.height = parseInt(this.lySize.height/this.gameinfo.max_row)*0.4;
        node.active = true;
        parent.getComponent("block_s").haiTipStar = 1;
        parent.getComponent("block_s").TipStar = node;
    },
    removeLine:function(color,start,end){
        console.info(color+"//:");
        var index = this.lineMaps.get(color).length;
        console.info(index+":;"+start);
        let isRemove = false;
        while(index--){
            if(start==0){
                if(index>=start){
                    let element = this.lineMaps.get(color)[index];
                    if(element.getChildByName("line")){
                        element.getChildByName("line").destroy();
                    }
                    if(element.getChildByName("routetip")){
                        element.getChildByName("routetip").destroy();
                    }
                    element.getComponent("block_s").line = g_define.lineDir.meiyou;
                    element.getComponent("block_s").start_end = 0;
                    element.getComponent("block_s").__pointColor = "pure";
                    console.info("delete index :"+index);
                    this.lineMaps.get(color).splice(index,1);
                    isRemove = true;
                }
            }else{
                if(index>=start+1){
                    let element = this.lineMaps.get(color)[index];
                    if(element.getChildByName("line")){
                        element.getChildByName("line").destroy();
                    }
                    if(element.getChildByName("routetip")){
                        element.getChildByName("routetip").destroy();
                    }
                    element.getComponent("block_s").line = g_define.lineDir.meiyou;
                    element.getComponent("block_s").start_end = 0;
                    element.getComponent("block_s").__pointColor = "pure";
                    console.info("delete index :"+index);
                    this.lineMaps.get(color).splice(index,1);
                    isRemove = true;
                }else if(index>=start){
                    let element = this.lineMaps.get(color)[index];
                    if(element.getChildByName("line")){
                        element.getChildByName("line").destroy();
                    }
                    // if(element.getChildByName("routetip")){
                    //     element.getChildByName("routetip").destroy();
                    // }
                    element.getComponent("block_s").line = g_define.lineDir.meiyou;
                    element.getComponent("block_s").start_end = 0;
                    //isRemove = true;
                }
            }
        }

        //
        if(isRemove){
            this.completeLines.delete(color);
            console.info(this.completeLines);
        }
        
        if(this.lineMaps.get(color).length<=0){
            this.lineMaps.delete(color);
            console.info("delete "+color+" size=:"+this.lineMaps.size);
        }else{
            
        }
    },
    removeTipLine:function(color){
        console.info(color+"//:removeTipLine");
        let index = this.tipCompleteLines.get(color).length;
        while(index--){
            let element = this.tipCompleteLines.get(color)[index];
            if(element.getChildByName("line")){
                element.getChildByName("line").destroy();
            }
            if(element.getChildByName("routetip")){
                element.getChildByName("routetip").destroy();
            }
            element.getComponent("block_s").line = g_define.lineDir.meiyou;
            element.getComponent("block_s").start_end = 0;
            element.getComponent("block_s").__pointColor = "pure";
            if(element.getComponent("block_s").haiTipStar==1){
                element.getComponent("block_s").haiTipStar = 0;
                if(element.getComponent("block_s").TipStar){
                    element.getComponent("block_s").TipStar.destroy();
                }
            }

        }

        this.tiplineMaps.set(color,this.tipCompleteLines.get(color));
        this.tipCompleteLines.delete(color);
        this.completeLines.delete(color);
      
    },
    //
    getBlock:function(touch){
        let point = cc.v2(0,0);
        point.x = touch._point.x-cc.winSize.width/2-this.node.x;
        point.y = touch._point.y-cc.winSize.height/2-this.node.y;
        //console.info(point);
         let result = null;
        for (let index = 0; index < this.blocks.length; index++) {
            const element = this.blocks[index];
            if(point.x>element.getComponent("block_s").rectx
            &&point.y>element.getComponent("block_s").recty
            &&point.x<(element.getComponent("block_s").rectx+element.getComponent("block_s").rectw)
            &&point.y<(element.getComponent("block_s").recty+element.getComponent("block_s").recth)){
                result = element;
            }
        }

        if(result){
            if(result.getChildByName("point")){
                result.getComponent("block_s").__pointColor=result.getChildByName("point").getComponent("point").pointColor;
            }
        } 
        return result;
    },

    checkStep:function(){
        let flagStep = false;
        var commonScript=cc.find("wxNode").getComponent("commonData");
        if(g_define.gameConfig.gameType == 1){
            if(this.step>=g_define.getDataScript().quickBattleData.step){
                commonScript.sendReduceStep(this.step,g_define.gameConfig.gameType,function(res){
                    if(res.err==0){
                        g_define.getDataScript().quickBattleData.step = 0;
                        myToast.showPrefab("prefab/quickBattleNext",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2),null,function(){
                            console.info("overStep=1");
                            cc.director.getScene().getChildByName("quickBattleNext").getComponent("quickBattleNext").overStep = 1;
                        });
                    }
                });
        
                flagStep = true;

            }
        }else if(g_define.gameConfig.gameType == 2){
            if(this.step>=g_define.getDataScript().gateBattleData.step){
                commonScript.sendReduceStep(this.step,g_define.gameConfig.gameType,function(res){
                    if(res.err==0){
                        g_define.getDataScript().quickBattleData.step = 0;
                        myToast.showPrefab("prefab/getMoreStep",cc.find("Canvas"),cc.v2(0,0),cc.fadeIn(0.02),function(){
                            cc.find("Canvas").getChildByName("getMoreStep").getComponent("getMoreStepScript").gametype = 2;
                        });
                    }
                });

                flagStep = true;
                
            }
        }
        if(flagStep){
           
            myToast.show(1.0,"步数不足，无法完成关卡",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        return flagStep;
    },
    //
    onStartTouch:function(event){
        //获取点击的方块
        this.preBlock = this.getBlock(event.touch); 
        if(this.preBlock){
            //提示过了不能再连了
            if(this.preBlock.getComponent("block_s").haiTipStar==1){
                return; 
            }
            //步长不够
           if(this.checkStep()){
               return;
           }
           
            console.info("点击方块:"+this.preBlock.getComponent("block_s").row+","+this.preBlock.getComponent("block_s").col
            +","+this.preBlock.getComponent("block_s").__pointColor);

            
            if(this.preBlock.getChildByName("point")){
                //点击point清除这条线
                if(this.lineMaps.has(this.preBlock.getComponent("block_s").__pointColor)){
                    this.removeLine(this.preBlock.getComponent("block_s").__pointColor,0,0);
                }

                //起一条线
                let arr = new Array;
                arr.push(this.preBlock);
                this.preBlock.getComponent("block_s").start_end = 1;
                this.addRouteTip(this.preBlock,this.preBlock.getChildByName("point").getComponent("point").pointColor);
                this.lineMaps.set(this.preBlock.getChildByName("point").getComponent("point").pointColor,arr)

            }else if(this.preBlock.getChildByName("line")){
                //点击线清除这条线
                if(this.lineMaps.has(this.preBlock.getComponent("block_s").__pointColor)){
                    console.info("has line:"+this.preBlock.getComponent("block_s").__pointColor+"::"+ this.lineMaps.get(this.preBlock.getComponent("block_s").__pointColor).length)
                    const index =  this.lineMaps.get(this.preBlock.getComponent("block_s").__pointColor).indexOf(this.preBlock);
                    if(index>=0){
                        this.removeLine(this.preBlock.getComponent("block_s").__pointColor,index,0);
                    }
                }

            }else{
                //线尾
                if(this.preBlock.getComponent("block_s").__pointColor!="pure"){
                    if(this.lineMaps.has(this.preBlock.getComponent("block_s").__pointColor)){
                        console.info("has end:"+this.preBlock.getComponent("block_s").__pointColor+"::"+ this.lineMaps.get(this.preBlock.getComponent("block_s").__pointColor).length)
                    }

                }
                //点击空白

            }
        
        }
    },
    onMoveTouch:function(event){
        this.nowBlock = this.getBlock(event.touch); 
        if(this.nowBlock&&this.preBlock){
            if(this.nowBlock === this.preBlock){
                return;
            }
            //步长不够
            let flagStep = false;
            if(g_define.gameConfig.gameType == 1){
                if(this.step>=g_define.getDataScript().quickBattleData.step){
                    flagStep = true;
                }
            }else if(g_define.gameConfig.gameType == 2){
                if(this.step>=g_define.getDataScript().gateBattleData.step){
                    flagStep = true;
                }
            }
            if(flagStep){
                return; 
            }
            //提示过了不能再连了
            if(this.preBlock.getComponent("block_s").haiTipStar==1){
                return; 
            }
            console.info("上一个方块:"+this.preBlock.getComponent("block_s").row+","+this.preBlock.getComponent("block_s").col);
            console.info("划过方块:"+this.nowBlock.getComponent("block_s").row+","+this.nowBlock.getComponent("block_s").col);

            if(this.preBlock.getComponent("block_s").__pointColor=="pure")
            {
                console.info("return2: preBlock is pure");
                return;
            }

            //处理连线
            if(this.nowBlock.getComponent("block_s").__pointColor=="pure"){
                if(this.lineMaps.has(this.preBlock.getComponent("block_s").__pointColor)){
                    if(this.preBlock.getComponent("block_s").start_end!=2){
                        if(this.addLine(this.preBlock,this.nowBlock)){
                            //添加线尾
                            this.nowBlock.getComponent("block_s").__pointColor = this.preBlock.getComponent("block_s").__pointColor;
                            this.addRouteTip(this.nowBlock,this.preBlock.getComponent("block_s").__pointColor);
                            this.lineMaps.get(this.preBlock.getComponent("block_s").__pointColor).push(this.nowBlock);
                            this.preBlock = this.nowBlock;
                        }
                    }
                }else{
                    //返回到了开头
                    if(this.preBlock.getChildByName("point")){
                        //清除这条线
                        if(this.lineMaps.has(this.preBlock.getComponent("block_s").__pointColor)){
                            this.removeLine(this.preBlock.getComponent("block_s").__pointColor,0,0);
                        }
                        //起一条线
                        let arr = new Array;
                        arr.push(this.preBlock);
                        this.preBlock.getComponent("block_s").start_end = 1;
                        this.addRouteTip(this.preBlock,this.preBlock.getChildByName("point").getComponent("point").pointColor);
                        this.lineMaps.set(this.preBlock.getChildByName("point").getComponent("point").pointColor,arr)
        
                    }
                }
            }else{
                if(this.lineMaps.has(this.preBlock.getComponent("block_s").__pointColor)){
                    //是这条线的颜色
                    if(this.nowBlock.getComponent("block_s").__pointColor == this.preBlock.getComponent("block_s").__pointColor){
                        if(this.nowBlock.getComponent("block_s").line == g_define.lineDir.meiyou){
                            if(this.addLine(this.preBlock,this.nowBlock)){
                                //完成一条线
                                this.nowBlock.getComponent("block_s").start_end = 2;
                                this.lineMaps.get(this.preBlock.getComponent("block_s").__pointColor).push(this.nowBlock);
                                this.addRouteTip(this.nowBlock,this.preBlock.getComponent("block_s").__pointColor);

                                this.completeLines.set(this.preBlock.getComponent("block_s").__pointColor,this.lineMaps.get(this.preBlock.getComponent("block_s").__pointColor));
                                this.node.getComponent("audioScript").playEff("line_end");
                                this.step++;
                                //通关检测
                                this.checkPass();

                                this.preBlock = this.nowBlock;
                            }
                        }else{
                            const index =  this.lineMaps.get(this.nowBlock.getComponent("block_s").__pointColor).indexOf(this.nowBlock);
                            if(index>=0){
                                this.removeLine(this.nowBlock.getComponent("block_s").__pointColor,index,0);
                                this.preBlock = this.nowBlock;
                            }
                        }
                    }else{
                        //画到其他线上
                        if(this.preBlock.getComponent("block_s").start_end == 2){
                            return;
                        }
                        if(this.lineMaps.has(this.nowBlock.getComponent("block_s").__pointColor)){
                            if(this.nowBlock.getComponent("block_s").__pointColor!="pure"){

                                let otherLine = this.lineMaps.get(this.nowBlock.getComponent("block_s").__pointColor);
                                console.info(otherLine);

                                let isPoint = false;
                                for(var i = 0;i<this.gameinfo.pointArr.length;i++){
                                    if(this.nowBlock.getComponent("block_s").row==this.gameinfo.pointArr[i].row
                                    &&this.nowBlock.getComponent("block_s").col==this.gameinfo.pointArr[i].col)
                                    {
                                        isPoint = true;
                                        break;
                                    }
                        
                                }

                                if(!isPoint){
                                    console.info("画到其他线上");
                                    //拆开线条
                                    const index =  otherLine.indexOf(this.nowBlock);
                                    if((index-1)>=0){
                                        this.removeLine(this.nowBlock.getComponent("block_s").__pointColor,index-1,0);
                                    }
                                    //添加线条
                                    if(this.addLine(this.preBlock,this.nowBlock)){
                                        this.nowBlock.getComponent("block_s").__pointColor = this.preBlock.getComponent("block_s").__pointColor;
                                        this.addRouteTip(this.nowBlock,this.preBlock.getComponent("block_s").__pointColor);
                                        this.lineMaps.get(this.preBlock.getComponent("block_s").__pointColor).push(this.nowBlock);
                                        this.preBlock = this.nowBlock;
                                    }

                                }else{
                                    //this.preBlock = this.nowBlock;
                                }


                            }
                        }
                    }
                }
            }
               
        }
        
    },
    onCancelTouch:function(event){
        
    },

    //提示
    tip:function(){
        if(this.gameinfo.newplayer){
            //self.newPlayerTip();
            return;
        }
        //步长不够
        if(this.checkStep()){
            return;
        }
        var self = this;
        var commonScript=cc.find("wxNode").getComponent("commonData");
        var _callfunc=function(response){
            if(response.err==0){
                if(response.score>=0){
                    if(g_define.getDataScript().userInfo.gold-response.score>0){
                        myToast.show(1.0,`金币消耗${g_define.getDataScript().userInfo.gold-response.score}`,cc.find("Canvas"));
                    }
                    g_define.getDataScript().userInfo.gold = response.score;
                    if(cc.find("Canvas").getComponent("gameuiScript")){
                        cc.find("Canvas").getComponent("gameuiScript").goldnum.getComponent(cc.Label).string
                        =g_define.getDataScript().userInfo.gold;
                    }
                }
                self.__tip();
            }else{
                if(response.err==1){
                    myToast.show(1.0,"金币不足",cc.find("Canvas"));
                    myToast.showPrefab("prefab/getGold",cc.find("Canvas"));
                }
            }
        }
        commonScript.sendBehavio(3,_callfunc);

    },
    __tip:function(){
        if(this.gameinfo.newplayer){
            //self.newPlayerTip();
            return;
        }
        //步长不够
        if(this.checkStep()){
            return;
        }
        var self = this;
        console.info(this.tiplineMaps);
        try {
            self.tiplineMaps.forEach(function (value, key, map) {
                // value: 指向当前元素的值
                // key: 指向当前索引
                // map: 指向map对象本身
                if(!self.completeLines.has(key)){

                    //先清除
                    if(self.lineMaps.has(key)){
                        self.removeLine(key,0,0);
                    }

                    for (let index = 0; index < value.length-1; index++) {
                        value[index].getComponent("block_s").__pointColor=key;
                        self.addLine(value[index],value[index+1],true)
                    }
                    value[value.length-1].getComponent("block_s").__pointColor = value[value.length-2].getComponent("block_s").__pointColor;
                    self.addTipStar(value[0]);
                    self.addTipStar(value[value.length-1]);
                    self.completeLines.set(key,value);
                    self.tipCompleteLines.set(key,value);
                    self.step++;
                    self.tiplineMaps.delete(key);
                    self.checkPass();

                    throw new Error("get a tip")
                }else{
                   
                }

            });


            self.tiplineMaps.forEach(function (value, key, map) {

                if(self.completeLines.has(key)){
                    let find_error_line = false;
                    if(!find_error_line){
                        let lines =  self.completeLines.get(key);
                        console.info(lines);
                        console.info(value);
                        if(lines.length!=value.length){
                            find_error_line = true;
                        }else{
                            for (let index = 0; index < lines.length; index++) {
                                if(self.compileBlock(lines[0],value[0])){
                                    if(!self.compileBlock(lines[index],value[index])){
                                        find_error_line = true;
                                        break;
                                    }
                                }else if(self.compileBlock(lines[0],value[value.length-1])){
                                    if(!self.compileBlock(lines[index],value[value.length-1-index])){
                                        find_error_line = true;
                                        break;
                                    }
                                }else{
                                    find_error_line = true;
                                    break;
                                }
                            }
                        }
                        
                    }

                    console.info(" find_error_line ???");
                    console.info(find_error_line);
                    if(find_error_line){
                        self.completeLines.delete(key);
                        self.__tip();
                        throw new Error("get a tip")
                    }else{
                        self.checkPass();
                    }
                }

            });
            
        } catch (error) {
            if(error.message!="get a tip"){
                throw error;
            }
        }
    },

    compileBlock:function(blockA,blockB){
       if(blockA.getComponent("block_s").row==blockB.getComponent("block_s").row
        &&blockA.getComponent("block_s").col==blockB.getComponent("block_s").col){
            return true;
        }
        return false;
    },

    removeLastLine:function(){
        var self = this;
        console.info("removeLastLine")
        let count = 0
        
        //删除提示的线
        if(self.lineMaps.size==0&&self.tipCompleteLines.size>0){
            self.tipCompleteLines.forEach(function (value, key, map) {

                if(count==self.tipCompleteLines.size-1){
                     self.removeTipLine(key,0,0);
                }
                count++;
            });
            return;
        }
        count =0;
        self.lineMaps.forEach(function (value, key, map) {
            // value: 指向当前元素的值
            // key: 指向当前索引
            // map: 指向map对象本身

            if(count==self.lineMaps.size-1){
                 self.removeLine(key,0,0);
            }
            count++;
        });
    },

    getBlockXY:function(row,col){
        let result = null;
        for (let index = 0; index < this.blocks.length; index++) {
            const element = this.blocks[index];
            if(row==element.getComponent("block_s").row
            &&col==element.getComponent("block_s").col){
                result = element;
            }
        }
        return result;
    },

    //新手教学
    newPlayerTip:function(){
        if(this.gameinfo.newplayer){
            if(this.node.getChildByName("newPlayerTip")){
                this.node.getChildByName("newPlayerTip").destroy();
            }
            //手
            var node = cc.instantiate(this.hand);
            node.name = "newPlayerTip";
            node.parent = this.node;
            node.active = true;
            node.stopAllActions();

            var self = this;
            try {
                self.tiplineMaps.forEach(function (value, key, map) {
                    // value: 指向当前元素的值
                    // key: 指向当前索引
                    // map: 指向map对象本身
                    if(!self.completeLines.has(key)){
                        var action_arr = new Array();
                        action_arr.push(cc.place(value[0].x, value[0].y));
                        for (let index = 1; index < value.length; index++) {
                            action_arr.push(cc.moveTo(0.3, value[index].x, value[index].y));
                        }
                        var seq = cc.repeatForever(cc.sequence(action_arr));
                        node.runAction(seq);
                        throw new Error("get a tip")
                    }

                });
                
            } catch (error) {
                if(error.message!="get a tip"){
                    throw error;
                }
            }



        }
    }


    // update (dt) {},



});
