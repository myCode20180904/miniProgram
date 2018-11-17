const FloatSlerp = function () { };

FloatSlerp.prototype.init = function (begin, end, during) {
    this._begin = begin;
    this._end = end;
    this._during = during;
    this._time = 0;
};

FloatSlerp.prototype.updateNumber = function (dt) {
    this._time += dt;
    let progress = this._time / this._during;

    return this._begin+(this._end-this._begin)* Math.min(1, progress);
};

FloatSlerp.prototype.updateVec2 = function (dt) {
    this._time += dt;
    let progress = this._time / this._during;
    let begin = cc.v2(this._begin.x,this._begin.y)
    let end = cc.v2(this._end.x,this._end.y)

    return begin.addSelf(end.subSelf(begin)* Math.min(1, progress));
};

module.exports = FloatSlerp;