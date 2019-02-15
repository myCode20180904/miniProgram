
/**
 * CommonParam
 */



/**
 * commonHandel
 */
export class CommonHandel{
	public success:Function = null;
	public fail:Function = null;
	public complete:Function = null;
	public constructor(success?:Function,fail?:Function,complete?:Function) {
		this.success = success;
		this.fail = fail;
		this.complete = complete;
	}
}

/**
 * 加载用
 */
export class LoadHandel{
	public process:Function = null;
	public complete:Function = null;
	public constructor(process?:Function,complete?:Function) {
		this.process = process;
		this.complete = complete;
	}
}


/**
 * 动作列表
 */
export class FighterAnim{
	public type:string = "idle";
    public name:Array<string> = [];
	public priority:number = 0;
    public constructor(_name:Array<string>,_priority:number,_type:string) {
        this.name = _name;
		this.priority = _priority;
		this.type = _type;
    }
}
export class FighterAnims{
    public idle:FighterAnim = new FighterAnim([],0,"idle");
    public walk:FighterAnim = new FighterAnim([],1,"walk");
    public run:FighterAnim = new FighterAnim([],2,"run");
    public atk:FighterAnim = new FighterAnim([],4,"atk");
    public block:FighterAnim = new FighterAnim([],14,"block");
    public hurt:FighterAnim = new FighterAnim([],20,"hurt");
    public death:FighterAnim = new FighterAnim([],21,"death");
    public constructor() {
		
	}
	public reset(){
		this.idle.name.splice(0,this.idle.name.length);
		this.walk.name.splice(0,this.idle.name.length);
		this.run.name.splice(0,this.idle.name.length);
		this.atk.name.splice(0,this.idle.name.length);
		this.block.name.splice(0,this.idle.name.length);
		this.hurt.name.splice(0,this.idle.name.length);
		this.death.name.splice(0,this.idle.name.length);
	}
}

export function GenerateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}



//
export enum LineDir{
    meiyou = -1,
    bottom = 0,    
    right = 1,//    
    top = 2, 
    left = 3, 

}

//颜色
if(typeof pointColor == "undefined"){
    var pointColor:any = {};
    pointColor.pure = cc.color(0,0,0,0);
    pointColor.white = cc.color(255,255,255,255);
    pointColor.blue = cc.color(85,192,242,255);
    pointColor.purple_less = cc.color(139,120,229,255);//紫色浅
    pointColor.purple = cc.color(146,72,181,255);//紫色
    pointColor.green = cc.color(125,213,63,255);
    pointColor.yellow = cc.color(255,200,58,255);
    pointColor.orange = cc.color(255,103,69,255);
    pointColor.pink = cc.color(255,113,146,255);//粉
    pointColor.green_most = cc.color(18,207,185,255);//亮绿色
    pointColor.green_less = cc.color(39,215,107,255);//an绿色
    pointColor.rose = cc.color(255,60,93,255);//玫红色
    pointColor.red = cc.color(233,75,126,255);//红色
    pointColor.blue_most = cc.color(12,142,212,255);
　　　　　　　　　　　 
}
export const PointColor: any = pointColor;
//颜色转字符
export const string2color = function(name){
    switch (name) {
        case "white":
            return pointColor.white;
            break;
        case "blue":
            return pointColor.blue;
            break;
        case "purple_less":
            return pointColor.purple_less;
            break;
        case "purple":
            return pointColor.purple;
            break;
        case "green":
            return pointColor.green;
            break;
        case "yellow":
            return pointColor.yellow;
            break;
        case "orange":
            return pointColor.orange;
            break;
        case "pink":
            return pointColor.pink;
            break;
        case "green_most":
            return pointColor.green_most;
            break;
        case "green_less":
            return pointColor.green_less;
            break;
        case "rose":
            return pointColor.rose;
            break;
        case "red":
            return pointColor.red;
            break;
        case "blue_most":
            return pointColor.blue_most;
            break;
    
        default:
            return pointColor.pure;
            break;
    }

}
