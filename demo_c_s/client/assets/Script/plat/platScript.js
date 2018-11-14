var weixin = require('./wx')
var gf = require('./gf')

var getPlatType = function(){
    if(window.wx){
        return 1;
    }else{
        return 0;
    }
}

var start = function(obj){
    if(window.wx){
        weixin.start(obj);
    }else{
        gf.start(obj);
    }

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


var downLoad = function(obj){
    if(window.wx){
        return weixin.downLoad(obj);
    }else{
        return gf.downLoad(obj);
    }
}

module.exports = {
    start:start,
    login:login,
    loginSuccess:loginSuccess,
    request:request,
    changeBannerAd:changeBannerAd,
    bannerAd:bannerAd(),
    downLoad:downLoad
};