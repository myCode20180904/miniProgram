

/**
 * 抖动
 * 
 */

//
const {ccclass, property} = cc._decorator;

@ccclass
export class Shake extends cc.ActionInterval {

    private _initial_x:number = 0;
    private _initial_y:number = 0;
    private _strength_x:number = 0;
    private _strength_y:number = 0;
    // LIFE-CYCLE CALLBACKS:
    public constructor(duration:number,strength_x:number,strength_y:number) {
        super();
        this.setDuration(duration);
        this.initWithDuration(duration,strength_x,strength_y);
    }
    
    private initWithDuration(duration,strength_x,strength_y) {
        cc.ActionInterval.prototype['initWithDuration'].call(this, duration)
        this._strength_x = strength_x;
        this._strength_y = strength_y;
        return true;
    }

    update (dt) {
        let randx = Math.floor(-this._strength_x+Math.random()*this._strength_x*2)
        let randy = Math.floor(-this._strength_y+Math.random()*this._strength_y*2)
        this.getTarget().setPosition(randx + this._initial_x,randy + this._initial_y);
    }

    startWithTarget(target)
    {
        cc.ActionInterval.prototype['startWithTarget'].call(this, target);
        this._initial_x = target.x;
        this._initial_y = target.y;
        this.getTarget().setPosition(new cc.Vec2(this._initial_x,this._initial_y));
    }
    stop()
    {
        this.getTarget().setPosition(new cc.Vec2(this._initial_x,this._initial_y));
    }
}

/**
 * 自定义抖动动作
 * @param {float}duration 抖动时间
 * @param {number}shakeStrengthX X轴抖动幅度
 * @param {number}shakeStrengthY Y轴抖动幅度
 * @returns {Shake}
 */
cc["Shake"] = function (duration:number,strength_x:number,strength_y:number) {
    return new Shake(duration,strength_x,strength_y);
};


/**
 * 相机缩放
 * 
 */

//this.camera.getComponent(cc.Camera).zoomRatio = 
@ccclass
export class CameraScaleTo extends cc.ActionInterval {

    private _initial:number = 0;
    private _zoomRatio:number = 0;
    // LIFE-CYCLE CALLBACKS:
    public constructor(duration:number,scale:number) {
        super();
        this.setDuration(duration);
        this.initWithDuration(duration,scale);
    }
    
    private initWithDuration(duration,scale) {
        cc.ActionInterval.prototype['initWithDuration'].call(this, duration)
        this._zoomRatio = scale;

        return true;
    }

    update (dt) {

        this.getTarget().getComponent(cc.Camera).zoomRatio = this._zoomRatio;
    }

    startWithTarget(target)
    {
        cc.ActionInterval.prototype['startWithTarget'].call(this, target);
        this._initial = target.getComponent(cc.Camera).zoomRatio;
        this.getTarget().getComponent(cc.Camera).zoomRatio = this._initial;
    }
    stop()
    {
        this.getTarget().getComponent(cc.Camera).zoomRatio = this._zoomRatio;
    }
}

/**
 * 自定义抖动动作
 * @param {float}duration 抖动时间
 * @param {number}shakeStrengthX X轴抖动幅度
 * @param {number}shakeStrengthY Y轴抖动幅度
 * @returns {CameraScaleTo}
 */
cc["CameraScaleTo"] = function (duration:number,scale_x:number) {
    return new CameraScaleTo(duration,scale_x);
};