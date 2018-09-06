
//颜色
if(typeof pointColor == "undefined"){
    var pointColor = {};
    pointColor.pure = cc.color(0,0,0,255);
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

//颜色转字符
var color2string = function(color){
    switch (color) {
        case pointColor.white:
            return "white";
            break;
        case pointColor.blue:
            return "blue";
            break;
        case pointColor.purple_less:
            return "purple_less";
            break;
        case pointColor.purple:
            return "purple";
            break;
        case pointColor.green:
            return "green";
            break;
        case pointColor.yellow:
            return "yellow";
            break;
        case pointColor.orange:
            return "orange";
            break;
        case pointColor.pink:
            return "pink";
            break;
        case pointColor.green_most:
            return "green_most";
            break;
        case pointColor.green_less:
            return "green_less";
            break;
        case pointColor.rose:
            return "rose";
            break;
        case pointColor.red:
            return "red";
            break;
        case pointColor.blue_most:
            return "blue_most";
            break;
    
        default:
            return "pure";
            break;
    }

}

var saveFile = function(name,data){


}

//游戏配置
if(typeof gameConfig == "undefined"){
    var gameConfig = {};
    gameConfig.gateLevel = 1;
　　　　　　　　　　　 
}

module.exports = {
    pointColor:pointColor,
    string2color:string2color,
    color2string:color2string,
    gameConfig:gameConfig,
    saveFile:saveFile
};