class MotionPoint{
    point:egret.Point;
    angle:number;
    /**
     * 
     * !@param _point  坐标
     * !@param _angle  角度
     */
    constructor(_point:egret.Point,_angle:number){
        this.point = _point;
        this.angle = _angle;
    }
}
/*
* !#zh 运动轨迹，用于游戏对象的运动轨迹上实现拖尾渐隐效果。

    示例
    var texture = egret.loader.getRes("texture.png");
    var motionStreak = new MotionStreak(role,texture,64,64);
    motionStreak.distance = 16;
    motionStreak.setPosition(role.width*role.scaleX/2,role.height*role.scaleY/2);
*/
class MotionStreak{	
    /** !#en The fade time to fade.
    !#zh 拖尾的渐隐时间，以豪秒为单位。 */
    fadeTime: number = 200;		
    /** !#en The minimum segment size.
    !#zh 拖尾之间最小距离。 */
    minSeg: number = 1;		
    /** !#en The stroke's width.
    !#zh 拖尾的宽度。 */
    strokeW: number = 64;
    /** !#en The stroke's width.
    !#zh 拖尾的高度。 */
    strokeH: number = 64;	
    /** !#en The stroke's width.
    !#zh 拖尾节间距。 */
    distance: number = 64;	
    	
    /** !#en The texture of the MotionStreak.
    !#zh 拖尾的贴图。 */
    texture: egret.Texture = null;		
    /** !#en The color of the MotionStreak.
    !#zh 拖尾的颜色 */
    color: string = "0xffffff";		

    /**跟随的节点 */
    withNode:egret.Sprite = null;
    /**
     * ！跟随移动坐标的Point
     */
    offSetPoints:egret.Point = new egret.Point(0,0);
    /**
     * !最大跟随数量
     */
    MaxNum:number = 20;
    /**
     * !设置密集（0-默认无效果 1-开启后可设置跟随粒子均匀的间隔距离 --）
     */
    fadeMode:number = 1;

    /**
     * 
     */
    private x:number
    private y:number

    private timer1:egret.Timer
    private timerFade:egret.Timer
    //容器
    private picePanel:egret.Sprite = null;
    //跟随de节点
    private points:Array<MotionPoint> = new Array();	
    private nodes:Array<egret.Sprite> = new Array();	
    private lastPos:egret.Point = new egret.Point(0,0);

    
    /**
     * 
     * !@param withNode  绑定跟随者
     * !@param texture  绑定纹理
     * !@param width 设定宽度
     * !@param height 设定height
     */
    constructor(withNode:egret.Sprite,texture:egret.Texture,width?:number,height?:number){
        this.withNode = withNode;
        this.texture = texture;
        if(width){
            this.strokeW = width;
            this.strokeH = height;
        }
        this.reset();
    }

    
     /**
        !#en Remove all living segments of the ribbon.
        !#zh 删除当前所有的拖尾片段。
    */
    public reset(): void{
        this.points.splice(0,this.points.length);
        this.createNodes(this.MaxNum*20);

        this.timer1 = new egret.Timer(16, 0);
        this.timer1.stop();
        this.timerFade = new egret.Timer(this.fadeTime, 0);
        this.timerFade.stop();
        if(this.withNode.parent){
            if(this.picePanel){
                // this.picePanel.removeSelf();
            }
            this.picePanel = new egret.Sprite();
            this.withNode.parent.addChild(this.picePanel);
            this.picePanel.x = 0;
            this.picePanel.y = 0;
            this.lastPos.x = this.withNode.x+this.x-this.offSetPoints.x;
            this.lastPos.y = this.withNode.y+this.y-this.offSetPoints.y;
            this.withNode.parent.setChildIndex(this.picePanel,this.withNode.parent.getChildIndex(this.withNode)-1);
            

            this.timer1.addEventListener(egret.TimerEvent.TIMER,this._updateMaterial,this);
            this.timer1.addEventListener(egret.TimerEvent.TIMER,this._updateDrawMaterial,this);
            this.timer1.start();
            this.timerFade.addEventListener(egret.TimerEvent.TIMER,this.reduce,this);
            this.timerFade.start();

        }

    }

    /**
     * !销毁
     */
    public destroy():void{
        // this.points.splice(0,this.points.length);
        // for (var index = 0; index < this.nodes.length; index++) {
        //     var element = this.nodes[index];
        //     // element.destroy();
        // }
        // this.nodes.splice(0,this.nodes.length);

        // this.timer1.stop();
        // this.timerFade.stop();
        // if(this.picePanel){
        //     // this.picePanel.removeSelf();
        // }
        // delete this;
    }

    /**
     * ！设置坐标
     */
    public setPosition(x,y):void{
        this.x = x
        this.y = y
    }

    private _updateMaterial():void{
        
        if(this.withNode&&this.picePanel){
            
            let x = this.withNode.x+this.x-this.offSetPoints.x;
            let y = this.withNode.y+this.y-this.offSetPoints.y;
            this.picePanel.x = this.offSetPoints.x;
            this.picePanel.y = this.offSetPoints.y;

            let offx = this.lastPos.x-x;
            let offy = this.lastPos.y-y;
            let dis = Math.sqrt(offx*offx+offy*offy)
            let angel = this.getAngle(new egret.Point(this.lastPos.x,this.lastPos.y),new egret.Point(x,y));
            if(dis<this.distance){
                return;
            }

            if(this.points.length<=this.nodes.length){
                this.points.push(new MotionPoint(new egret.Point(x,y),angel));
                // console.info("--------------------:",x,y);
                //TODO:
                if(this.fadeMode == 1&&dis>this.distance){
                    for (var index = 1 ; index <= Math.floor(dis/this.distance); index++) {
                        let __x = x+offx*(index/Math.floor(dis/this.distance));
                        let __y = y+offy*(index/Math.floor(dis/this.distance));
                        // console.info(":",__x,__y);
                        this.points.push(new MotionPoint(new egret.Point(__x,__y),angel));
                    }
                }
            }else{
                this.points.pop();
                // this.points.push(new egret.Point(x,y));
            }

            //
            this.lastPos.x = x;
            this.lastPos.y = y;

        } 

    }
    private _updateDrawMaterial():void{
        var self = this;
        for (var index = 0; index < this.points.length; index++) {
            var element = this.points[index];
            let node = this.nodes[index];
            try {
                node.anchorOffsetX = this.strokeW/2;
                node.anchorOffsetY = this.strokeH/2;
                node.x = element.point.x;
                node.y = element.point.y;
                node.rotation = element.angle;
                node.alpha = (1/this.points.length)*index;
                this.picePanel.addChild(node);

                let dt = this.fadeTime+this.fadeTime*(1/this.points.length)*index;
                // console.info(dt);
                egret.Tween.get(node).to( {"alpha":0},null)
                .call(function(){
                    self.picePanel.removeChild(node);
                },this);

            } catch (error) {
                console.info(error,node);
            }
            
        }

    }

    private reduce():void{
        if(this.points.length>this.MaxNum){
            this.points.splice(0,this.points.length-this.MaxNum);
        }else{
            this.points.splice(0,1);
        }
    }

    private createNodes(num:number){
        for (var index = 0; index < this.nodes.length; index++) {
            var element = this.nodes[index];
            // element.destroy();
        }
        this.nodes.splice(0,this.nodes.length);

        for (var index = 0; index < num; index++) {
            let node =  new egret.Sprite();
            // node.graphics.drawTexture(this.texture,0,0,this.strokeW,this.strokeH);
            this.nodes.push(node);
        }
    }

    //
    private getAngle(start:egret.Point,end:egret.Point){
        let diff_x = end.x - start.x,
            diff_y = end.y - start.y;
        //返回角度,不是弧度0-360
        let angle = 0;
        if(diff_y>0&&diff_x>0){
            angle = Math.abs(Math.atan(diff_y/diff_x)*(180/Math.PI));
        }else if(diff_y>0&&diff_x<=0){
            angle = 180-Math.abs(Math.atan(diff_y/diff_x)*(180/Math.PI));
        }else if(diff_y<=0&&diff_x<=0){
            angle = 180+Math.abs(Math.atan(diff_y/diff_x)*(180/Math.PI));
        }else{
            angle = 360-Math.abs(Math.atan(diff_y/diff_x)*(180/Math.PI));
        }

        return angle+90;
        
    }


}



