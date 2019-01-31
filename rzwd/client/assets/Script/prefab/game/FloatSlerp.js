const FloatSlerp = function () { };

FloatSlerp.prototype.init = function (begin, end, during) {
    this._begin = begin;
    this._end = end;
    this._during = during;
    this._time = 0;
    this._once = 1;

};

FloatSlerp.prototype.updateNumber = function (dt) {
    this._time += dt;
    let progress = this._time / this._during;
    let num = this._begin+(this._end-this._begin)* Math.min(1, progress)
    return num;
};
//匀加速
FloatSlerp.prototype.acceleration = function(dt,a){
    this._time += dt;
    let finish = (a*this._time)/2*this._time;
    let all = (a*this._during)/2*this._during;
    let process = Math.min(finish/all,1);
	return this._begin+(this._end-this._begin)*process;
}
//匀减速
FloatSlerp.prototype.deceleration = function(dt,a){
    this._time += dt;
    let finish = (a*this._during*2-a*this._time)/2*this._time;
    let all = (a*this._during)/2*this._during;
    let process = Math.min(finish/all,1);
	return this._begin+(this._end-this._begin)*process;
}

module.exports = FloatSlerp;