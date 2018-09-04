var dataScript = require('./dataScript');
var config = require('./config')
//方向
if(typeof lineDir == "undefined"){
    var lineDir = {};
    lineDir.meiyou = -1;
    lineDir.bottom = 0;
    lineDir.right = 1;
    lineDir.top = 2;
    lineDir.left = 3;
　　　　　　　　　　　 
}
//颜色
if(typeof pointColor == "undefined"){
    var pointColor = {};
    pointColor.pure = cc.color(0,0,0,0);
    pointColor.white = cc.color(255,255,255,255);
    pointColor.blue = cc.color(85,192,242,255);
    pointColor.purple_less = cc.color(139,120,229,255);//紫色浅
    pointColor.purple = cc.color(146,72,181,255);//紫色
    pointColor.green = cc.color(125,213,63,255);
    pointColor.yellow = cc.color(255,200,58,255);
    pointColor.orange = cc.color(255,103,69,255);
    pointColor.pink = cc.color(255,113,146,255);//粉
    pointColor.green_most = cc.color(18,207,185,255);//亮绿色
    pointColor.green_less = cc.color(39,215,107,255);//an绿色
    pointColor.rose = cc.color(255,60,93,255);//玫红色
    pointColor.red = cc.color(233,75,126,255);//红色
    pointColor.blue_most = cc.color(12,142,212,255);
　　　　　　　　　　　 
}
//颜色转字符
var string2color = function(name){
    switch (name) {
        case "white":
            return pointColor.white;
            break;
        case "blue":
            return pointColor.blue;
            break;
        case "purple_less":
            return pointColor.purple_less;
            break;
        case "purple":
            return pointColor.purple;
            break;
        case "green":
            return pointColor.green;
            break;
        case "yellow":
            return pointColor.yellow;
            break;
        case "orange":
            return pointColor.orange;
            break;
        case "pink":
            return pointColor.pink;
            break;
        case "green_most":
            return pointColor.green_most;
            break;
        case "green_less":
            return pointColor.green_less;
            break;
        case "rose":
            return pointColor.rose;
            break;
        case "red":
            return pointColor.red;
            break;
        case "blue_most":
            return pointColor.blue_most;
            break;
    
        default:
            return pointColor.pure;
            break;
    }

}

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

//游戏配置
if(typeof gameConfig == "undefined"){
    var gameConfig = {};
    gameConfig.gateLevel = 1;
    gameConfig.gate =110;//玩法2：1-10  ，玩法1： 101-161
    gameConfig.gameType = 0;
　　　　　　　　　　　 
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

var sendHttpRequest = function(type,url,data){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            var response = xhr.responseText;
            console.log(response);
        }
    };
    xhr.open("GET", "https://p2pnowly.qcloud.la/", true);
    xhr.send();
}

//
var getShareData = function(){
    let randnum = parseInt(Math.random()*3);
    let data = {
        title:dataScript.getData().shareArray[randnum].title,
        img:config.service.game_img+"/"+ dataScript.getData().shareArray[randnum].img
    }
    console.info(data);
    return data
}
//

module.exports = {
    lineDir: lineDir,
    pointColor:pointColor,
    string2color:string2color,
    gameConfig:gameConfig,
    loadHttpIcon:loadHttpIcon,
    getDataScript:dataScript.getData,
    ENStr:ENStr,
    sendHttpRequest:sendHttpRequest,
    getShareData:getShareData
};