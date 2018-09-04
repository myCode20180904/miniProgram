
var g_define = require('./g_define');

cc.Class({
    extends: cc.Component,

    properties: {
        //游戏配置
        gameinfo:"",
        gridLine:{
            default:null,
            type:cc.Node,
        },
        pointMode:{
            default:null,
            type:cc.Node,
        },
        addPoint:{
            default:null,
            type:cc.Node,
        },
        addTipLine:{
            default:null,
            type:cc.Node,
        },
        selectColor:{
            default:null,
            type:cc.Node,
        },
        tip:{
            default:null,
            type:cc.Node,
        },
        clear:{
            default:null,
            type:cc.Node,
        },
        complete:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //初始配置
        this.gameinfo = {
            "newplayer":0,
            "size":{
                "width":640,
                "height":640
            },
            "max_row":10,
            "max_col":10
        }
        this.gameinfo.pointArr=new Array();
        this.gameinfo.tip=new Array();



      


       this.selColor = "pure";
       this.selType = "addTipLine";
       this.node.getChildByName("tip").getComponent(cc.Label).string = this.selType+":"+this.selColor;
       this.arrPP = new Array();

       

        this.complete.on(cc.Node.EventType.TOUCH_END,function(event){ 
              //
              for (let index = 0; index < this.gameinfo.tip.length; index++) {
                  const element = this.gameinfo.tip[index];
                  this.addToPointArr(element.route[0].row,element.route[0].col,element.color);
                  this.addToPointArr(element.route[element.route.length-1].row,element.route[element.route.length-1].col,element.color);
                  
              }
            console.info(JSON.stringify(this.gameinfo));
        }, this);

    },

    checkPoint:function(){
        let onedis_h = parseInt(this.gameinfo.size.height/this.gameinfo.max_row);
        let onedis_w = parseInt(this.gameinfo.size.width/this.gameinfo.max_col);
        for (let index = 0; index < this.arrPP.length; index++) {
            const node = this.arrPP[index];
            for (let lineIndex = 0; lineIndex < this.gameinfo.tip.length;lineIndex++) {
                const element = this.gameinfo.tip[lineIndex];
                // 起点
                if(element.route[0].row == node.getComponent("point").row
                &&element.route[0].col==node.getComponent("point").col){
                    node.width = onedis_h*0.8;
                    node.height = onedis_w*0.8;
                }

                //终点
                if(element.route[element.route.length-1].row ==node.getComponent("point").row
                &&element.route[element.route.length-1].col==node.getComponent("point").col ){
                    node.width = onedis_h*0.8;
                    node.height = onedis_w*0.8;
                }
              
            }

        }
    },
    addToPointArr:function(row,col,color){
        var dot = {
            "row":row,
            "col":col,
            "color":color
        }
        var find2 = false;
        for (let index = 0; index < this.gameinfo.pointArr.length; index++) {
            const element = this.gameinfo.pointArr[index];
            if(element.row == dot.row&&element.col == dot.col){
                find2 = true;
            }
            
        }
        if(!find2){
            this.gameinfo.pointArr.push(dot);
        }
    },
    addToTipLine:function(row,col){
        let find_element = null;
        for (let index = 0; index < this.gameinfo.tip.length; index++) {
            const element = this.gameinfo.tip[index];
            if(element.color == this.selColor){
                find_element = element;
            }
            
        }

        if(find_element==null){
            var tiparr = {
                "color":this.selColor
            }
            tiparr.route=new Array();
            var dot = {
                "row":row,
                "col":col,
            }
            tiparr.route.push(dot);

            this.gameinfo.tip.push(tiparr);
        }else{
            var dot = {
                "row":row,
                "col":col,
            }

            var find2 = false;
            for (let index = 0; index < find_element.route.length; index++) {
                const element =find_element.route[index];
                if(element.row == dot.row&&element.col == dot.col){
                    find2 = true;
                }
                
            }
            if(!find2){
                find_element.route.push(dot);
            }
        }
        

    },
    onClear:function(){
        if(this.selType === "addPoint"){
            for (let index = 0; index < this.gameinfo.pointArr.length; index++) {
                const element = this.gameinfo.pointArr[index];
                if(element.row == dot.row&&element.col == dot.col){
                    this.gameinfo.pointArr.splice(index,1);
                }
            }
        }else if(this.selType === "addTipLine"){
            for (let index = 0; index < this.gameinfo.tip.length; index++) {
                const element = this.gameinfo.tip[index];
                if(element.color == this.selColor){

                    for (let j = 0;  j  < this.arrPP.length;  j ++) {
                        const pointNode = this.arrPP[ j ];
                        for (let k = 0; k < element.route.length; k++) {
                            const ddddot = element.route[k];
                             // 
                            if(ddddot.row == pointNode.getComponent("point").row
                            &&ddddot.col==pointNode.getComponent("point").col){
                                pointNode.color = g_define.pointColor.white;
                                let onedis_h = parseInt(this.gameinfo.size.height/this.gameinfo.max_row);
                                let onedis_w = parseInt(this.gameinfo.size.width/this.gameinfo.max_col);
                                pointNode.width = onedis_w-4;
                                pointNode.height = onedis_h-4;
                            }
                        }
                       
                    }


                    this.gameinfo.tip.splice(index,1);
                    break;
                }

            }    
        }
    },

    start () {
        this.addPoint.on(cc.Node.EventType.TOUCH_END,function(event){ 
            this.selType = "addPoint"
            this.node.getChildByName("tip").getComponent(cc.Label).string = this.selType+":"+this.selColor;
        }, this);

        this.addTipLine.on(cc.Node.EventType.TOUCH_END,function(event){ 
            this.selType = "addTipLine"
            this.node.getChildByName("tip").getComponent(cc.Label).string = this.selType+":"+this.selColor;
        }, this);

        this.clear.on(cc.Node.EventType.TOUCH_END,function(event){ 
          this.onClear();
        }, this);

        this.drawGrid();

        //selected
        var selectedColorNode = cc.instantiate(this.selectColor);
        selectedColorNode.parent = this.selectColor.parent;
        selectedColorNode.active = true;
        selectedColorNode.setPosition(0,-380);
        selectedColorNode.getChildByName("Label").getComponent(cc.Label).string = "selected"
        selectedColorNode.color = g_define.pointColor.pure;

        //颜色列表
        for (let index = 0; index < 14; index++) {
            var node = cc.instantiate(this.selectColor);
            node.parent = this.selectColor.parent;
            node.active = true;

            node.setPosition(-300+(index%6)*110,-625+parseInt(index/6)*50);
            node.getComponent("select").pointColor = g_define.pointColor.pure

           
            //
            switch (index) {
                case 0:
                    node.getComponent("select").pointColor = g_define.pointColor.white;
                    break;
                case 1:
                    node.getComponent("select").pointColor = g_define.pointColor.blue;
                    break;
                case 2:
                    node.getComponent("select").pointColor = g_define.pointColor.blue_most;
                    break;
                case 3:
                    node.getComponent("select").pointColor = g_define.pointColor.green;
                    break;
                case 4:
                    node.getComponent("select").pointColor = g_define.pointColor.green_less;
                    break;
                case 5:
                    node.getComponent("select").pointColor = g_define.pointColor.green_most;
                    break;
                case 6:
                    node.getComponent("select").pointColor = g_define.pointColor.orange;
                    break;
                case 7:
                    node.getComponent("select").pointColor = g_define.pointColor.pink;
                    break;
                case 8:
                    node.getComponent("select").pointColor = g_define.pointColor.pure;
                    break;
                case 9:
                    node.getComponent("select").pointColor = g_define.pointColor.purple;
                    break;
                case 10:
                    node.getComponent("select").pointColor = g_define.pointColor.purple_less;
                    break;
                case 11:
                    node.getComponent("select").pointColor = g_define.pointColor.red;
                    break;
                case 12:
                    node.getComponent("select").pointColor = g_define.pointColor.rose;
                    break;
                case 13:
                    node.getComponent("select").pointColor = g_define.pointColor.yellow;
                    break;
            
                default:
                    break;
            }
            node.color = node.getComponent("select").pointColor;
            node.getChildByName("Label").getComponent(cc.Label).string = g_define.color2string(node.getComponent("select").pointColor);

             //添加
             node.on(cc.Node.EventType.TOUCH_END,function(event){
               selectedColorNode.color = event.target.getComponent("select").pointColor;
                this.selColor = g_define.color2string(event.target.getComponent("select").pointColor);
                console.info(this.selColor);
                this.checkPoint();
            }, this);

        }



            

        //点阵
        for (let index = 0; index < this.gameinfo.max_row; index++) {
            for (let jndex = 0; jndex < this.gameinfo.max_col; jndex++) {
                var node = cc.instantiate(this.pointMode);
                node.parent = this.pointMode.parent;
                this.arrPP.push(node);
                node.active = true;
                node.getComponent("point").row = index;
                node.getComponent("point").col = jndex;
                
                let onedis_h = parseInt(this.gameinfo.size.height/this.gameinfo.max_row);
                let onedis_w = parseInt(this.gameinfo.size.width/this.gameinfo.max_col);
                node.width = onedis_w-4;
                node.height = onedis_h-4;
                node.setPosition(-this.gameinfo.size.width/2+onedis_w/2+jndex*onedis_w,-this.gameinfo.size.height/2+onedis_h/2+index*onedis_h+60);


                //添加这给点
                node.on(cc.Node.EventType.TOUCH_END,function(event){
                    if(this.selType === "addPoint"){
                        this.addToPointArr(event.target.getComponent("point").row,event.target.getComponent("point").col,this.selColor);
                        event.target.width = onedis_h*0.8;
                        event.target.height = onedis_w*0.8;
                    }else if(this.selType === "addTipLine"){
                        this.addToTipLine(event.target.getComponent("point").row,event.target.getComponent("point").col);
                    }
                    event.target.color =g_define.string2color(this.selColor);

                }, this);


            }
            
        }

        //

    },

    
    //画网格
    drawGrid:function(){
        console.info("drawGrid");
        let onedis_h = parseInt(this.gameinfo.size.height/this.gameinfo.max_row);
        let onedis_w = parseInt(this.gameinfo.size.width/this.gameinfo.max_col);
        for(var i = 0;i<this.gameinfo.max_row+1;i++){
            var node = cc.instantiate(this.gridLine);
            node.parent = this.gridLine.parent;
            node.setPosition(0,-this.gameinfo.size.height/2+onedis_h*i+60);
            node.width = this.gameinfo.size.width;
            node.active = true;
            //console.info(`${i}":"${node.y}`);
        }
        for(var i = 0;i<this.gameinfo.max_col+1;i++){
            var node = cc.instantiate(this.gridLine);
            node.parent = this.gridLine.parent;
            node.setPosition(-this.gameinfo.size.width/2+onedis_w*i,60);
            node.width = this.gameinfo.size.height;
            node.rotation = 90;
            //console.info(`${i}":"${node.x}`);
            node.active = true;
        }

    },

   
    // update (dt) {},
});
