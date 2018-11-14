var plat = require('../plat/platScript')

var bannerAd = cc.Class({
    extends: cc.Component,

    properties: {
        _bannerAd:null,
    },

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
        if(this._bannerAd){
            this._bannerAd.show();
        }
    },
    hideBannerAd:function(){
        console.info(this.name+":hideBannerAd");
        if(this._bannerAd){
            this._bannerAd.hide();
        }
    },
    
    destroybannerAd:function(){
        console.info(this.name+":destroybannerAd");
        if(this._bannerAd){
            this._bannerAd.destroy();
        }
    },
    adupdate:function (dt) {
        this._timer++;
        if(this._timer>=10){
            this._timer = 0;
            var that = this;
            plat.target.createBannerAd({
                success:function(res){
                    that._bannerAd = res;
                }
            });
        }
    },
});

module.exports = {
    obj:bannerAd,
};