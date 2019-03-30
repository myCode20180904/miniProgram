import { BaseUI} from "../View/BaseUI";
import { UIManager} from "../Manager/UIManager";
import { Logger } from "../Tool/Logger";
import { LLXManager } from "./LLXManager";
import { LineDir, string2color, CommonHandel } from "../Define/CommonParam";
import { WXManager } from "../Tool/wx/wxApi";
import { UserManager } from "../Manager/UserManager";
import { GameConfig } from "../Define/GameConfig";
import { LoadManager } from "../Manager/LoadManager";
const {ccclass, property} = cc._decorator;

@ccclass
export class LLXLayer extends BaseUI {
    //
    @property(cc.Node)
    bd:cc.Node = null;
    @property(cc.Node)
    gridLine:cc.Node = null;
    @property(cc.Node)
    blockMode:cc.Node = null;
    @property(cc.Node)
    pointMode:cc.Node = null;
    @property(cc.Node)
    lineMode:cc.Node = null;
    @property(cc.Node)
    routeTipMode:cc.Node = null;
    @property(cc.Node)
    tipStar:cc.Node = null;
    @property(cc.Node)
    hand:cc.Node = null;
    @property(cc.Node)
    tipbg:cc.Node = null;
    
    //===========
    private lySize:cc.Size = cc.size(600,600);
    private offset:cc.Vec2 = cc.v2(0,0);
    private step:number = 0;
    private maxLine:number = 0;
    private blocks:Array<cc.Node> = new Array();//方块
    private lineMaps:{ [key: string]: any} = {};//画的线
    private completeLines :{ [key: string]: any} = {};//完成的线
    private tipCompleteLines:{ [key: string]: any} = {};//靠提示完成的线
    private tiplineMaps:{ [key: string]: any} = {};//提示配置

    private preBlock:any = null;
    private nowBlock:any = null;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Logger.info('LLXLayer onLoad');
        
    }

    onDestroy(){
        Logger.info('LLXLayer onDestroy');
    }

    onEnable(){
        Logger.info('LLXLayer onEnable');
    }

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,function(){},this);
        this.offset = this.node.getChildByName('llxNode').getPosition();
        LLXManager.Instance.init();
        this.loadGame();
        this.refreshUI();
    }

    public refreshUI(){
        this.node.getChildByName("level").getComponent(cc.Label).string = '第'+LLXManager.Instance.gateLevel+"关";
        this.node.getChildByName("stepCount").getComponent(cc.Label).string = '步数:'+this.step;
        this.node.getChildByName("gold").getChildByName("num").getComponent(cc.Label).string = UserManager.Instance.getUserInfo().gold.toString();
    }

     /**
     * 菜单
     * @param event 点击事件
     * @param customEventData 用户参数
     */
    menu (event:cc.Event,customEventData:any){
        // Logger.info('touch menu:',customEventData);
        if(customEventData=="back"){
            LLXManager.Instance.exitGame();
        }
        if(customEventData=="delete"){
            //悔一步
            this.removeLastLine();
        }
        if(customEventData=="again"){
            //重来
            LLXManager.Instance.restartGame();
        }
        if(customEventData=="usetip"){
            //使用提示 -50
            if(this.useGold(50)){
                this.tip();
            }
            
        }
        if(customEventData=="lookMv"){
            //看视屏+50
            let count:number = 50;
            WXManager.Instance.createRewardedVideoAd({
                adUnitId:'adunit-f60366d91f6e4092',
                onLoad:function(){

                },
                onClose:function(){
                    let value = cc.sys.localStorage.getItem('rewardLookMvCount');
                    if(value&&value>0){
                        value--;
                        //领取奖励
                        UserManager.Instance.updateGold(count);
                        UIManager.Instance.showToast(`金币 +${count},今日还可通过观看视频获得金币${value}次`,2);
                        cc.sys.localStorage.setItem('rewardLookMvCount',value);
                    }else{
                        UIManager.Instance.showToast("今天获取视频奖励次数已达上限",2);
                    }
                    
                }
            });
        }
        if(customEventData=="sharetip"){
            //分享提示
            this.share();
        }
        if(customEventData=="?????????"){
            //使用提示
            this.tip();
        }
        
      
    }
    /**
     * 分享
     */
    private share(){
        var that = this;
        const handel = new CommonHandel();
        handel.success = function(){
            
        };
        handel.fail = function(){

        };
        handel.complete = function(){

        };
        //弹出微信分享
        WXManager.Instance.share({
            title:'我在挑战更高层，一起来玩吧！',
            imageUrl:GameConfig.imageUrl+'/shareImg1.png',
            query:`sharetype=1&sharekey=${UserManager.Instance.getUserInfo().openid}`
        },handel);

        //分享结果
        let value = cc.sys.localStorage.getItem('rewardShareCount');
        if(value&&value>0){
            value--;
            this.tip();
            UIManager.Instance.showToast(`今日还可通过分享提示${value}次`,2);
            cc.sys.localStorage.setItem('rewardShareCount',value);
        }else{
            UIManager.Instance.showToast("今日通过分享提示的次数已达上限",2);
        }
    }
    /**
     * 消耗金币
     */
    private useGold(count:number):boolean{
        if(UserManager.Instance.getUserInfo().gold>=count){
            UserManager.Instance.updateGold(-count);
            UIManager.Instance.showToast(`金币 -${count}`,2);
            return true;
        }else{
            UIManager.Instance.showToast("抱歉，您的金币不够了！",2);
            return false;
        }
    }

    // update (dt) {}

    public onShow(){
        Logger.info('LLXLayer onShow');
    }
    public onHide(){
        Logger.info('LLXLayer onHide');
        
    }


    //===================================游戏逻辑====================================
    private max_row:number = 0;
    private max_col:number = 0;
    private onedis_h = 0;
    private onedis_w = 0;

    private loadGame(){
        this.lySize = cc.size(LLXManager.Instance.gameinfo.size.width,LLXManager.Instance.gameinfo.size.height);
        this.drawGrid();
        this.step = 0;
        this.maxLine = LLXManager.Instance.gameinfo.pointArr.length/2;

        //触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START,this.onStartTouch, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onMoveTouch, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onCancelTouch, this);

        if(LLXManager.Instance.gameinfo.newplayer){
            this.newPlayerTip();
            // UIManager.Instance.showToast("连线所有的相同颜色的格子，\n所有格子必须都要被填满。");
            this.tipbg.active = true;
        }
    }
    /**
     * 检查通关情况
     */
    private checkPass(){
        let com_block = 0;
        console.info(this.completeLines)
        for (const key in this.completeLines) {
            if (this.completeLines.hasOwnProperty(key)) {
                const element = this.completeLines[key];
                com_block+=element.length;
            }
        }
        
        console.info(com_block);
        if(com_block>=LLXManager.Instance.gameinfo.max_row*LLXManager.Instance.gameinfo.max_col){
            //console.info(this.completeLines);
            console.info("pass game");
            this.node.off(cc.Node.EventType.TOUCH_START,this.onStartTouch, this);
            this.node.off(cc.Node.EventType.TOUCH_MOVE,this.onMoveTouch, this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onCancelTouch, this);

            this.passGame();
           
        }

        if(LLXManager.Instance.gameinfo.newplayer){
            this.newPlayerTip();
        }
        this.refreshUI();
    }
    /**
     * 加步数
     */
    addStep(num:number){
        this.step+=num;
    }
     /**
     * 减步数
     */
    delStep(num:number){
        this.step-=num;
    }

    //通关
    passGame(){
        UIManager.Instance.closeWindow('LLX/LLXLayer');
        LLXManager.Instance.clear();
        LLXManager.Instance.nextLevel();
        UIManager.Instance.openWindow('LLX/LLXLayer');
    }
    //画网格
    private drawGrid(){
        this.max_row = LLXManager.Instance.gameinfo.max_row;
        this.max_col = LLXManager.Instance.gameinfo.max_col;
        this.onedis_h = Math.floor(this.lySize.height/this.max_row);
        this.onedis_w = Math.floor(this.lySize.width/this.max_col);
        console.info("drawGrid",this.onedis_h,":",this.onedis_w);

        for(var i = 0;i<this.max_row+1;i++){
            var node = cc.instantiate(this.gridLine);
            node.parent = this.gridLine.parent;
            node.setPosition(0,-this.lySize.height/2+this.onedis_h*i);
            node.width = this.lySize.width;
            node.active = true;
        }
        for(var i = 0;i<this.max_col+1;i++){
            var node = cc.instantiate(this.gridLine);
            node.parent = this.gridLine.parent;
            node.setPosition(-this.lySize.width/2+this.onedis_w*i,0);
            node.width = this.lySize.height;
            node.rotation = 90;
            node.active = true;
        }

        //block
        for (let index = 0; index < this.max_row; index++) {
            for (let jndex = 0; jndex < this.max_col; jndex++) {
                var node = cc.instantiate(this.blockMode);
                node.parent = this.blockMode.parent;

                node.getComponent("block_s").row = index;
                node.getComponent("block_s").col = jndex;
                node.width = this.onedis_w;
                node.height = this.onedis_h;
                node.setPosition(-this.lySize.width/2+this.onedis_w/2+jndex*this.onedis_w,-this.lySize.height/2+this.onedis_h/2+index*this.onedis_h);
                node.active = true;

                //
                node.getComponent("block_s").__pointColor = "pure";
                node.getComponent("block_s").start_end = 0;
                node.getComponent("block_s").line = LineDir.meiyou;
                node.getComponent("block_s").rectx = node.x - this.onedis_w/2;
                node.getComponent("block_s").recty = node.y - this.onedis_h/2;
                node.getComponent("block_s").rectw = node.width;
                node.getComponent("block_s").recth = node.height;

                this.blocks.push(node);
            }
            
        }

         //point
         for (let index = 0; index < this.blocks.length; index++) {
            const element = this.blocks[index];
            for(var i = 0;i<LLXManager.Instance.gameinfo.pointArr.length;i++){
                if(element.getComponent("block_s").row==LLXManager.Instance.gameinfo.pointArr[i].row
                &&element.getComponent("block_s").col==LLXManager.Instance.gameinfo.pointArr[i].col)
                this.addPoint(element,LLXManager.Instance.gameinfo.pointArr[i].row
                    ,LLXManager.Instance.gameinfo.pointArr[i].col
                    ,LLXManager.Instance.gameinfo.pointArr[i].color);
    
            }
        }

        //init tip
        if(LLXManager.Instance.gameinfo.tip){
            for(var i = 0;i<LLXManager.Instance.gameinfo.tip.length;i++){
                 const element = LLXManager.Instance.gameinfo.tip[i];
                 let blocks = new Array();
                 for (let index = 0; index < element.route.length; index++) {
                     const element1 = element.route[index];
                     if(this.getBlockXY(element1.row,element1.col)){
                        blocks.push(this.getBlockXY(element1.row,element1.col));
                     }
                     
                 }
                this.tiplineMaps[element.color] = blocks;
             }
        }


    }
    //加连线
    private addLine(block1,block2,isTip:boolean = false){
        if(block1.getComponent("block_s").line != LineDir.meiyou){
            return false;
        }
        //
        if(isTip){
            //提示处理，删除路径上错误的线
            if(block2.getComponent("block_s").__pointColor!="pure")
            {
                if(block2.getComponent("block_s").__pointColor!=block1.getComponent("block_s").__pointColor){
                    //清除这条线
                    console.info(this.lineMaps);
                    console.info(block2.getComponent("block_s").__pointColor);
                    if(this.lineMaps[block2.getComponent("block_s").__pointColor]){
                        console.info("has "+block2.getComponent("block_s").__pointColor );
                        this.removeLine(block2.getComponent("block_s").__pointColor,0,0);
                    }
                }
            }
        }
        if(block1.x==block2.x){
            if(block1.y==block2.y+this.onedis_h){
                //bottom
                this._addLine(block1,cc.v2(0,-this.onedis_h/2),0,block1.getComponent("block_s").__pointColor);
                block1.getComponent("block_s").line = LineDir.bottom;
                return true;
            }else if(block1.y+this.onedis_h==block2.y){
                //top
                this._addLine(block1,cc.v2(0,this.onedis_h/2),0,block1.getComponent("block_s").__pointColor);
                block1.getComponent("block_s").line = LineDir.top;
                return true;
            }
        }
        if(block1.y==block2.y){
            if(block1.x+this.onedis_w==block2.x){
                //right
                this._addLine(block1,cc.v2(this.onedis_w/2,0),90,block1.getComponent("block_s").__pointColor);
                block1.getComponent("block_s").line = LineDir.right;
                return true;
            }else if(block1.x==block2.x+this.onedis_w){
                //left
                this._addLine(block1,cc.v2(-this.onedis_w/2,0),90,block1.getComponent("block_s").__pointColor);
                block1.getComponent("block_s").line = LineDir.left;
                return true;
            }
        }
        return false;
    }
            //5 - 128,6 - 106.6,7 - 91,8 - 80,9 - 71,-10 - 64
    private _addLine(parent,pos,roat,color){
        var node = cc.instantiate(this.lineMode);
        parent.addChild(node,10);
        node.setPosition(pos.x,pos.y);
        node.width = this.onedis_w*0.33; 
        node.height = this.onedis_h*1.33;
        node.rotation = roat;
        node.color = string2color(color);
        node.active = true;
        node.getComponent("line").pointColor = color;
        if(this.onedis_w>100){
            node.getComponent(cc.Sprite).spriteFrame = LoadManager.Instance.getSpriteFrame('llx/40x100@2x');
        }else if(this.onedis_w>79){
            node.getComponent(cc.Sprite).spriteFrame = LoadManager.Instance.getSpriteFrame('llx/30x100@2x');
        }else{
            node.getComponent(cc.Sprite).spriteFrame = LoadManager.Instance.getSpriteFrame('llx/20x100@2x');
        }
    }
    //加点
    private addPoint(parent,row,col,color){
        
        var node = cc.instantiate(this.pointMode);
        node.parent = parent;
        node.color = string2color(color);
        node.width = this.onedis_w*0.7;
        node.height = this.onedis_h*0.7;
        node.setPosition(0,0);
        node.getComponent("point").pointColor = color;
        //node.setPosition(-this.lySize.width/2+onedis_w/2+col*onedis_w,-this.lySize.height/2+onedis_h/2+row*onedis_h);
        node.active = true;
    
        if(this.onedis_w>100){
            node.getComponent(cc.Sprite).spriteFrame = LoadManager.Instance.getSpriteFrame('llx/85x85@2x');
        }else if(this.onedis_w>79){
            node.getComponent(cc.Sprite).spriteFrame = LoadManager.Instance.getSpriteFrame('llx/60x60@2x');
        }else{
            node.getComponent(cc.Sprite).spriteFrame = LoadManager.Instance.getSpriteFrame('llx/40x40@2x');
        }
    }
    //浅色路径
    private addRouteTip(parent,color){
        var node = cc.instantiate(this.routeTipMode);
        node.parent = parent;
        node.setPosition(0,0);
        node.width = parent.width; 
        node.height = parent.height;
        node.color = string2color(color);
        node.opacity = 80;
        node.active = true;
    }
    private addTipStar(parent){
        var node = cc.instantiate(this.tipStar);
        parent.parent.addChild(node,1000);
        node.setPosition(parent.x,parent.y);
        node.width = this.onedis_w*0.4; 
        node.height = this.onedis_w*0.4;
        node.active = true;
        parent.getComponent("block_s").haiTipStar = 1;
        parent.getComponent("block_s").TipStar = node;
    }
    private removeLine(color,start,end){
        console.info(color+"//:");
        var index = this.lineMaps[color].length;
        console.info(index+":;"+start);
        let isRemove = false;
        while(index--){
            if(start==0){
                if(index>=start){
                    let element = this.lineMaps[color][index];
                    if(element.getChildByName("line")){
                        element.getChildByName("line").destroy();
                    }
                    if(element.getChildByName("routetip")){
                        element.getChildByName("routetip").destroy();
                    }
                    element.getComponent("block_s").line = LineDir.meiyou;
                    element.getComponent("block_s").start_end = 0;
                    element.getComponent("block_s").__pointColor = "pure";
                    console.info("delete index :"+index);
                    this.lineMaps[color].splice(index,1);
                    isRemove = true;
                }
            }else{
                if(index>=start+1){
                    let element = this.lineMaps[color][index];
                    if(element.getChildByName("line")){
                        element.getChildByName("line").destroy();
                    }
                    if(element.getChildByName("routetip")){
                        element.getChildByName("routetip").destroy();
                    }
                    element.getComponent("block_s").line = LineDir.meiyou;
                    element.getComponent("block_s").start_end = 0;
                    element.getComponent("block_s").__pointColor = "pure";
                    console.info("delete index :"+index);
                    this.lineMaps[color].splice(index,1);
                    isRemove = true;
                }else if(index>=start){
                    let element = this.lineMaps[color][index];
                    if(element.getChildByName("line")){
                        element.getChildByName("line").destroy();
                    }
                    // if(element.getChildByName("routetip")){
                    //     element.getChildByName("routetip").destroy();
                    // }
                    element.getComponent("block_s").line = LineDir.meiyou;
                    element.getComponent("block_s").start_end = 0;
                    //isRemove = true;
                }
            }
        }

        //
        if(isRemove){
            delete this.completeLines[color];
            console.info(this.completeLines);
        }
        
        if(this.lineMaps[color].length<=0){
            delete this.lineMaps[color];
            console.info("delete "+color);
        }else{
            
        }
    }
    private removeTipLine(color){
        console.info(color+"//:removeTipLine");
        let index = this.tipCompleteLines[color].length;
        while(index--){
            let element = this.tipCompleteLines[color][index];
            if(element.getChildByName("line")){
                element.getChildByName("line").destroy();
            }
            if(element.getChildByName("routetip")){
                element.getChildByName("routetip").destroy();
            }
            element.getComponent("block_s").line = LineDir.meiyou;
            element.getComponent("block_s").start_end = 0;
            element.getComponent("block_s").__pointColor = "pure";
            if(element.getComponent("block_s").haiTipStar==1){
                element.getComponent("block_s").haiTipStar = 0;
                if(element.getComponent("block_s").TipStar){
                    element.getComponent("block_s").TipStar.destroy();
                }
            }

        }

        this.tiplineMaps[color] = this.tipCompleteLines[color];
        delete this.tipCompleteLines[color];
        delete this.completeLines[color];
      
    }

    private getBlockXY(row,col):any{
        let result = null;
        for (let index = 0; index < this.blocks.length; index++) {
            const element = this.blocks[index];
            if(row==element.getComponent("block_s").row
            &&col==element.getComponent("block_s").col){
                result = element;
            }
        }
        return result;
    }
    //
    private getBlock(touch){
        let point = cc.v2(0,0);
        point.x = touch._point.x-cc.winSize.width/2-this.offset.x;
        point.y = touch._point.y-cc.winSize.height/2-this.offset.y;
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
    }
    private checkStep(){
        let flagStep = false;
    
        //
        if(flagStep){
           
            UIManager.Instance.showToast("步数不足，无法完成关卡");
        }
        
        return flagStep;
    }


    //
    onStartTouch(event){
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
                if(this.lineMaps[this.preBlock.getComponent("block_s").__pointColor]){
                    this.removeLine(this.preBlock.getComponent("block_s").__pointColor,0,0);
                }

                //起一条线
                let arr = new Array;
                arr.push(this.preBlock);
                this.preBlock.getComponent("block_s").start_end = 1;
                this.addRouteTip(this.preBlock,this.preBlock.getChildByName("point").getComponent("point").pointColor);
                this.lineMaps[this.preBlock.getChildByName("point").getComponent("point").pointColor] = arr;

            }else if(this.preBlock.getChildByName("line")){
                //点击线清除这条线
                if(this.lineMaps[this.preBlock.getComponent("block_s").__pointColor]){
                    console.info("has line:"+this.preBlock.getComponent("block_s").__pointColor+"::"+ this.lineMaps[this.preBlock.getComponent("block_s").__pointColor].length)
                    const index =  this.lineMaps[this.preBlock.getComponent("block_s").__pointColor].indexOf(this.preBlock);
                    if(index>=0){
                        this.removeLine(this.preBlock.getComponent("block_s").__pointColor,index,0);
                    }
                }

            }else{
                //线尾
                if(this.preBlock.getComponent("block_s").__pointColor!="pure"){
                    if(this.lineMaps[this.preBlock.getComponent("block_s").__pointColor]){
                        console.info("has end:"+this.preBlock.getComponent("block_s").__pointColor+"::")
                    }

                }
                //点击空白

            }
        
        }
    }
    onMoveTouch(event){
        this.nowBlock = this.getBlock(event.touch); 
        if(this.nowBlock&&this.preBlock){
            if(this.nowBlock === this.preBlock){
                return;
            }
             //步长不够
           if(this.checkStep()){
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
                if(this.lineMaps[this.preBlock.getComponent("block_s").__pointColor]){
                    if(this.preBlock.getComponent("block_s").start_end!=2){
                        if(this.addLine(this.preBlock,this.nowBlock)){
                            //添加线尾
                            this.nowBlock.getComponent("block_s").__pointColor = this.preBlock.getComponent("block_s").__pointColor;
                            this.addRouteTip(this.nowBlock,this.preBlock.getComponent("block_s").__pointColor);
                            this.lineMaps[this.preBlock.getComponent("block_s").__pointColor].push(this.nowBlock);
                            this.preBlock = this.nowBlock;
                        }
                    }
                }else{
                    //返回到了开头
                    if(this.preBlock.getChildByName("point")){
                        //清除这条线
                        if(this.lineMaps[this.preBlock.getComponent("block_s").__pointColor]){
                            this.removeLine(this.preBlock.getComponent("block_s").__pointColor,0,0);
                        }
                        //起一条线
                        let arr = new Array;
                        arr.push(this.preBlock);
                        this.preBlock.getComponent("block_s").start_end = 1;
                        this.addRouteTip(this.preBlock,this.preBlock.getChildByName("point").getComponent("point").pointColor);
                        this.lineMaps[this.preBlock.getChildByName("point").getComponent("point").pointColor] = arr;
        
                    }
                }
            }else{
                if(this.lineMaps[this.preBlock.getComponent("block_s").__pointColor]){
                    //是这条线的颜色
                    if(this.nowBlock.getComponent("block_s").__pointColor == this.preBlock.getComponent("block_s").__pointColor){
                        if(this.nowBlock.getComponent("block_s").line == LineDir.meiyou){
                            if(this.addLine(this.preBlock,this.nowBlock)){
                                //完成一条线
                                this.nowBlock.getComponent("block_s").start_end = 2;
                                this.lineMaps[this.preBlock.getComponent("block_s").__pointColor].push(this.nowBlock);
                                this.addRouteTip(this.nowBlock,this.preBlock.getComponent("block_s").__pointColor);

                                this.completeLines[this.preBlock.getComponent("block_s").__pointColor] = this.lineMaps[this.preBlock.getComponent("block_s").__pointColor];
                                // this.node.getComponent("audioScript").playEff("line_end");
                                //步数
                                this.addStep(1);
                                 //消耗金币
                                let count = 20;
                                if(UserManager.Instance.getUserInfo().gold>=count){
                                    UserManager.Instance.updateGold(-count);
                                    // UIManager.Instance.showToast(`金币 -${count}`,2);
                                }else{
                                    UIManager.Instance.showToast("抱歉，您的金币不够了！",2);
                                    this.removeLastLine();
                                }
                                //通关检测
                                this.checkPass();

                                this.preBlock = this.nowBlock;
                            }
                        }else{
                            const index =  this.lineMaps[this.nowBlock.getComponent("block_s").__pointColor].indexOf(this.nowBlock);
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
                        if(this.lineMaps[this.nowBlock.getComponent("block_s").__pointColor]){
                            if(this.nowBlock.getComponent("block_s").__pointColor!="pure"){

                                let otherLine = this.lineMaps[this.nowBlock.getComponent("block_s").__pointColor];
                                console.info(otherLine);

                                let isPoint = false;
                                for(var i = 0;i<LLXManager.Instance.gameinfo.pointArr.length;i++){
                                    if(this.nowBlock.getComponent("block_s").row==LLXManager.Instance.gameinfo.pointArr[i].row
                                    &&this.nowBlock.getComponent("block_s").col==LLXManager.Instance.gameinfo.pointArr[i].col)
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
                                        this.lineMaps[this.preBlock.getComponent("block_s").__pointColor].push(this.nowBlock);
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
        
    }
    private onCancelTouch(event){
        
    }


    //提示
    tip(){
        if(LLXManager.Instance.gameinfo.newplayer){
            //self.newPlayerTip();
            return;
        }
        //步长不够
        if(this.checkStep()){
            return;
        }
        this.__tip();

    }
    __tip(){
        if(LLXManager.Instance.gameinfo.newplayer){
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
            for (const key in self.tiplineMaps) {
                if (!self.tiplineMaps.hasOwnProperty(key)) {
                    continue;
                }
                if(!self.completeLines.hasOwnProperty(key)){

                    //先清除
                    if(self.lineMaps.hasOwnProperty(key)){
                        self.removeLine(key,0,0);
                    }
                    let value = self.tiplineMaps[key];
                    for (let index = 0; index < value.length-1; index++) {
                        value[index].getComponent("block_s").__pointColor=key;
                        self.addLine(value[index],value[index+1],true)
                    }
                    value[value.length-1].getComponent("block_s").__pointColor = value[value.length-2].getComponent("block_s").__pointColor;
                    self.addTipStar(value[0]);
                    self.addTipStar(value[value.length-1]);
                    self.completeLines[key]=value;
                    self.tipCompleteLines[key]=value;
                    self.step++;
                    delete self.tiplineMaps[key];
                    self.checkPass();

                    throw new Error("get a tip")
                }else{
                   
                }
            }

            for (const key in self.tiplineMaps) {
                if (!self.tiplineMaps.hasOwnProperty(key)) {
                    continue;
                }
                if(self.completeLines.hasOwnProperty(key)){
                    let find_error_line = false;
                    let value = self.tiplineMaps[key];
                    if(!find_error_line){
                        let lines =  self.completeLines[key];
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
                        delete self.completeLines[key];
                        self.__tip();
                        throw new Error("get a tip")
                    }else{
                        self.checkPass();
                    }
                }
            }
            
            
        } catch (error) {
            if(error.message!="get a tip"){
                throw error;
            }
        }
    }

    compileBlock(blockA,blockB){
       if(blockA.getComponent("block_s").row==blockB.getComponent("block_s").row
        &&blockA.getComponent("block_s").col==blockB.getComponent("block_s").col){
            return true;
        }
        return false;
    }

    removeLastLine(){
        var self = this;
        console.info("removeLastLine")
        let count = 0
        
        //删除提示的线
        if(Object.getOwnPropertyNames(this.lineMaps).length==0&&Object.getOwnPropertyNames(this.tipCompleteLines).length>0){

            for (const key in self.tipCompleteLines) {
                if (!self.tipCompleteLines.hasOwnProperty(key)) {
                    continue;
                }
                if(count==Object.getOwnPropertyNames(self.tipCompleteLines).length-1){
                    self.removeTipLine(key);
               }
               count++;
            }
            return;
        }
        count =0;
        for (const key in self.lineMaps) {
            if (!self.lineMaps.hasOwnProperty(key)) {
                continue;
            }
            if(count==Object.getOwnPropertyNames(self.lineMaps).length-1){
                self.removeLine(key,0,0);
           }
           count++;
        }
       
    }
    //新手教学
    private newPlayerTip(){
        if(LLXManager.Instance.gameinfo.newplayer){
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
                for (const key in self.tiplineMaps) {
                    if (!self.tiplineMaps.hasOwnProperty(key)) {
                        continue;
                    }
                    if(!self.completeLines.hasOwnProperty(key)){
                        let value = self.tiplineMaps[key];
                        var action_arr = new Array();
                        action_arr.push(cc.place(value[0].x, value[0].y));
                        for (let index = 1; index < value.length; index++) {
                            action_arr.push(cc.moveTo(0.3, value[index].x, value[index].y));
                        }
                        var seq = cc.repeatForever(cc.sequence(action_arr));
                        node.runAction(seq);
                        throw new Error("get a tip")
                    }
                }
                
            } catch (error) {
                if(error.message!="get a tip"){
                    throw error;
                }
            }



        }
    }


}
