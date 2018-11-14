/**自定义按钮类 */
class MyButton extends egret.Sprite {
	private _bg:egret.Bitmap;
	private title:egret.Bitmap;
	private onClick:Function;
	private _shape:egret.Shape = null;
	public extData:any;

	public constructor(bgName:string, titleName:string) {
		super();
		this.extData = {};
		this._bg = GameConst.createBitmapFromSheet(bgName, "ui");
		this.addChild(this._bg);

		this.title = GameConst.createBitmapFromSheet(titleName, "ui");
		
		this.title.x = (this._bg.width - this.title.width) >> 1;
		this.title.y = (this._bg.height - this.title.height) >> 1;
		this.addChild(this.title);
	}

	//设置点击触发事件
	public setClick(func:Function):void {
		this.touchEnabled = true;
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickEvent, this);
		this.onClick = func;
	}
	//点击触发的事件
	private onClickEvent(evt:egret.TouchEvent) {
		this.onClick(evt);
	}

	public setTitle(title:string):void {
		this.title = GameConst.CreateBitmapByName(title);
	}

	public get bg() {
		return this._bg;
	}
	public set bg(bg:egret.Bitmap) {
		this._bg = bg;
	}

    //初始化赋值
    private initCDGraphics(): void {
		
        var shape: egret.Shape = this._shape = new egret.Shape();
        shape.x = this._bg.width / 2;
        shape.y = this._bg.height / 2;
        this.addChild(shape);
        
        this._bg.mask = shape;
    }

    //轻触修改属性
    public startCD(): void {
		if(!this._shape){
			this.initCDGraphics();
		}


        var shape: egret.Shape = this._shape;
		var self = this;
        /*** 本示例关键代码段开始 ***/
        var angle:number = 0;
        var i:number = 1;
		
        egret.startTick(onTimer, self);
		function onTimer(timeStamp:number):boolean {
            routeAngle(angle);
            angle += 6/self.extData.cd;
            if (angle > 360) {
                egret.stopTick(onTimer,self);
            }
            return false;
        }

        function routeAngle(angle:number):void {
            shape.graphics.clear();

			// self.fullFront(shape);

            shape.graphics.beginFill(0x00ffff, 1);
            shape.graphics.moveTo(0, 0);
            shape.graphics.lineTo(200, 0);
            shape.graphics.drawArc(0, 0, 200, 0, angle * Math.PI / 180, i == -1);
            shape.graphics.lineTo(0, 0);
            shape.graphics.endFill();
        }
        /*** 本示例关键代码段结束 ***/
    }
	//填充形状
	private fullFront(bgSptite:any):void {
        var bitmap:egret.Bitmap = new egret.Bitmap();
		bitmap.texture  = RES.getRes(`$ui_json.btn_y`);
		bitmap.scrollRect = new egret.Rectangle(0,0,this._bg.width,this._bg.height);
		bitmap.x = 0;
		bitmap.y = 0;
		bgSptite.addChild(bitmap);

    }

}