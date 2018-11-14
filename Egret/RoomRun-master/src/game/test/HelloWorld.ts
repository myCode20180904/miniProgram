class HelloWorld  extends eui.Component  {
	private logo:eui.Group;
	private role:Role;
	private isDrage:boolean = false;
	public constructor() {
		super();
		this.skinName = "resource/assets/exml/helloPage.exml";

	}
	public createChildren():void
	{
		super.createChildren();
		this.init();
	}


	private init(){

		// this.logo.visible = false;
		this.role = new Role();
		this.addChild(this.role);
		this.role.setState(Role.STATE1);
		this.role.x = 200;
		this.role.y = 300;
		this.role.play();

		this.role.touchEnabled = true
		this.role.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.role.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);


		//	动画
		// var data = RES.getRes("abc.json");
		// var txtr:egret.Texture = RES.getRes("abc.png");
		// var mcDataFactory = new  egret.MovieClipDataFactory(data, txtr);
		// var mc1:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData("att")); 
		// mc1.gotoAndPlay(1,3);
		
	}

	private mouseDown(evt:egret.TouchEvent){
        console.log("Mouse Down.");
        this.isDrage = true;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
    }

    private mouseMove(evt:egret.TouchEvent){
        if( this.isDrage ){
            console.log("moving now ! Mouse: [X:"+evt.stageX+",Y:"+evt.stageY+"]");
            this.role.x = evt.stageX;
            this.role.y = evt.stageY;
        }
    }

    private mouseUp(evt:egret.TouchEvent){
        console.log("Mouse Up.");
        this.isDrage = false;
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
    }


}