
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

module.exports = {
    ENStr:ENStr,
    loadHttpIcon:loadHttpIcon
};