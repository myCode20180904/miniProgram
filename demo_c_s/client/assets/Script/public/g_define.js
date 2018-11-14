var config = require('../public/config')
var plat = require('../plat/platScript')
var dataScript = require('../model/dataScript')
 //精灵动态加载网络图片
var loadHttpIcon =function(container,_iconUrl,_callfunc){
    if(!_iconUrl||_iconUrl==""){
        _iconUrl="http://thirdwx.qlogo.cn/mmopen/vi_32/opmkDJhG2jpF8X8AfFQfTauRlpBc7VeFicJevZ9IiajEl5g4ia75opNSZOb0FvDV87BvpUN1rsyctibGnicP7uibsMtw/132"
    }
    cc.loader.load({url: _iconUrl, type: 'png'}, function (err, tex) {
        var spriteFrame=new cc.SpriteFrame(tex)
        container.getComponent(cc.Sprite).spriteFrame=spriteFrame;
        if(_callfunc){
            _callfunc()
        }
        console.info('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
    });
}

//加密解密字符串
var ENStr = function(str,key){
    let last = "";
    for (let index = 0; index < str.length; index++) {
        let x = String.fromCharCode(str.charCodeAt(index)^key.charCodeAt(index%key.length));
        last+=x;
    }
     return last
}

/**
 * loadHttpFont
 */
var loadHttpFont=function(obj){
    if(window.wx){
        if(!wx.loadFont(`${wx.env.USER_DATA_PATH}/${obj.path}`)){
            plat.downLoad({
                url:obj.url,
                path:obj.path,
                success:function(res){
                    console.info(res)
                    let fontname = wx.loadFont(res.tempFilePath)
                    console.info("临时加载font :",fontname)
                    if(fontname){
                        dataScript.common.myFontList.push(fontname);
                        obj.success();
                    }
                },
                save:function(res){
                    console.info("保存font到缓存 :",wx.loadFont(res))
                }
            });
        }else{
            let fontname = wx.loadFont(`${wx.env.USER_DATA_PATH}/${obj.path}`)
            console.info("缓存加载font:",fontname)
            if(fontname){
                dataScript.common.myFontList.push(fontname);
                obj.success();
            }
        }

    }
}

module.exports = {
    ENStr:ENStr,
    loadHttpIcon:loadHttpIcon,
    loadHttpFont:loadHttpFont
};