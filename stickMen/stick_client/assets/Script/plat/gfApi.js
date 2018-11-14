var common = require('../model/common')

/**
 * gfApiInit
 * @param {*} obj 
 */
var gfApiInit = function(obj){
    obj.success({});
}

var getName = function(){
    return "gf"
}

/**
 * downLoad
 * @param {url:string ,path:string,success:function,save:function} obj 
 */
var downLoad = function(obj){
    

}

/**
 * 
 * @param {success:function ,file:function} obj 
 */
var login = function(obj){
    obj.success({code:common.appId});
}

/**
 * 
 * @param {*} obj 
 */
var request = function(obj){
    console.info("POSTDATA",obj)
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status === 200){
                var response = xhr.response;
                console.log(response);
                try {
                    let resp_json = JSON.parse(response)
                    obj.success(resp_json);
                } catch (err) {
                    console.info("服务端返回错误的json格式");
                }
                
            }else{
                obj.fail("err");
            }
        }

        // console.info(JSON.stringify(xhr.status)+"///readyState:"+xhr.readyState );
    };
//    xhr.withCredentials = true;
    //注意，服务器端须设置设置response'Access-Control-Allow-Origin'，
    xhr.open("POST", obj.url, true);
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");//缺少这句，后台无法获取参数
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");//缺少这句，后台无法获取参数
    xhr.send(JSON.stringify(obj.data));

    return xhr;
}

var createRewardedVideoAd = function(obj){

}

var createBannerAd = function(obj){

}


var onShare = function(obj){

}


var sendMessageToChild = function(obj){

}


var onJumpOther = function(obj){

}


module.exports = {
    gfApiInit:gfApiInit,
    getName:getName,
    downLoad:downLoad,
    login:login,
    request:request,

    createRewardedVideoAd:createRewardedVideoAd,
    createBannerAd:createBannerAd,
    onShare:onShare,
    sendMessageToChild:sendMessageToChild,
    onJumpOther:onJumpOther
};