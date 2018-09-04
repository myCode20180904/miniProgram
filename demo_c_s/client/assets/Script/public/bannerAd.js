var plat = require('../plat/platScript')

var bannerAd = cc.Class({
    extends: cc.Component,

    _onLoad: function () {
        this.showBannerAd();
        this._timer = 0;
        this.schedule(this.adupdate, 1.0);
    },
    _onDestroy(){
        this.hideBannerAd();
    },

    showBannerAd:function(){
        console.info(this.name+":showBannerAd");
        if(plat.bannerAd){
            plat.bannerAd.show();
        }
    },
    hideBannerAd:function(){
        console.info(this.name+":hideBannerAd");
        if(plat.bannerAd){
            plat.bannerAd.hide();
        }
    },
    
    destroybannerAd:function(){
        console.info(this.name+":destroybannerAd");
        if(plat.bannerAd){
            plat.bannerAd.destroy();
        }
    },
    adupdate:function (dt) {
        this._timer++;
        if(this._timer>=10){
            this._timer = 0;
            plat.changeBannerAd();
        }
    },
});

module.exports = {
    obj:bannerAd,
};