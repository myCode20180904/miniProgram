
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
