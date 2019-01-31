var weixin = require('./wx')
var gf = require('./gf')
var platTarget = "wx"
var start = function(obj){
    let str = "wx"
    if(window.wx){
        str = "wx";
        weixin.start(obj);
    }else{
        str = "gf";
        gf.start(obj);
    }
    return str;
}

var login = function(obj){
    console.info("plat login");
    if(window.wx){
        weixin.login(obj);
    }else{
        gf.login(obj);
    }

}

var loginSuccess = function(obj){
    console.info("plat loginSuccees");
    if(window.wx){
        weixin.loginSuccess(obj);
    }else{
        gf.loginSuccess(obj);
    }
}

var request = function(obj){
    if(window.wx){
        weixin.request(obj);
    }else{
        gf.request(obj);
    }

}

var changeBannerAd = function(obj){
    if(window.wx){
        weixin.changeBannerAd(obj);
    }else{
        gf.changeBannerAd(obj);
    }
}

var bannerAd = function(){
    if(window.wx){
        return weixin.bannerAd;
    }else{
        return gf.bannerAd;
    }
}

var onShare = function(obj,callback){
    if(window.wx){
        return weixin.onShare(obj,callback);
    }else{
        
    }
}

var createRewardedVideoAd = function(obj){
    if(window.wx){
        return weixin.createRewardedVideoAd(obj);
    }else{
        
    }
}

var sendMessageToChild = function(data){
    if(window.wx){
        return weixin.sendMessageToChild(data);
    }else{
        
    }
}
var onJumpOther = function(){
    if(window.wx){
        return weixin.onJumpOther;
    }else{
        
    }
}


var downLoad = function(obj){
    if(window.wx){
        return weixin.downLoad(obj);
    }else{
        return gf.downLoad(obj);
    }
}

/**
 * 创建游戏圈入口
 * @param {*} obj 
 */
var createGameClubButton = function(obj){
    if(window.wx){
        return weixin.createGameClubButton(obj);
    }else{
        
    }
}

module.exports = {
    platTarget:platTarget,
    start:start,
    login:login,
    loginSuccess:loginSuccess,
    request:request,
    changeBannerAd:changeBannerAd,
    bannerAd:bannerAd(),
    onShare:onShare,
    createRewardedVideoAd:createRewardedVideoAd,
    sendMessageToChild:sendMessageToChild,
    onJumpOther:onJumpOther,
    downLoad:downLoad,
    createGameClubButton:createGameClubButton,
};