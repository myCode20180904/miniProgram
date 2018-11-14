
var target = null;
if(window.wx){
    target = require('./wxApi');
}else{
    target = require('./gfApi');
}
/**
 * 初始化
 * @param {*} obj 
 */
var init = function(obj){
    let res = {};
    if(window.wx){
        target.wxApiInit(obj);
    }else{
        target.gfApiInit(obj);
    }

    obj.success(res);
    return target;
}




module.exports = {
    target:target,
    init:init
};