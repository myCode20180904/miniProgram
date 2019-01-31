var config = require('../public/config')
var userInfo = require('./userInfo')
var gamedata = {
    gameType:0,
    gameConf:"",
    playerList:[],
    pre_map_index:0,
    map_index:0,
    mapArea_10:new Map(),
    mapArea_safe:new Map(),
    tomapkey:function(pos){
        return pos.x*1000000+pos.y;
    },
    map_cell:20,//按50像素划分
    map_reduce:0,//缩减
    myrank:100,
    leftPeoPle:0,
    haveFuHuo:1,
    haveBaoJi:1,
    imageUrlList:[

    ],
    RESUMEACTION_TAG:10,//撞击-回复移动速度力量动作tag
    RESUMEACTION_TAG2:11,//技能-回复移动速度力量动作tag
    //eff
    dieEffcet:"prefab/farmeAnim/shuihua",
    
    startGame:function(){
        gamedata.gameType = 0;
        gamedata.playerList = new Array();
        gamedata.mapArea_10 = new Map();
        gamedata.mapArea_safe = new Map();
        gamedata.leftPeoPle = 0;
        let len = 8 + parseInt(Math.random()*2);
        for (let index = 0; index < len; index++) {
            let selScan = parseInt(Math.random()*13);
            let scan = userInfo.getData.Scan[selScan];
            let myscan = userInfo.getData.Scan[userInfo.getData.roleSelScan];
            let one_player = {
                startSpeed:(index == 0)?gamedata.gameConf.baseSpeed*myscan.attribute.speed:gamedata.gameConf.baseSpeed*0.6*scan.attribute.speed,
                startScale:(index == 0)?myscan.attribute.scale*0.4:scan.attribute.scale*0.4,
                startForce:(index == 0)?myscan.attribute.fcore:scan.attribute.fcore,//出生的力量
                speed:(index == 0)?gamedata.gameConf.baseSpeed*myscan.attribute.speed:gamedata.gameConf.baseSpeed*0.6*scan.attribute.speed,
                force:(index == 0)?myscan.attribute.fcore:scan.attribute.fcore,
                getForce:1,
                rotateSpeed:0.4,
                dir:cc.v2(0,0),
                level:1,
                name:(index == 0)?userInfo.getData.name:scan.namelb,
                scan:(index == 0)?myscan.index:scan.index,
                pos:cc.v2(0,0),
                killner:-1,//最后一个撞击着
                killed:0,
                die:false,
            };
            gamedata.playerList.push(one_player);
        }
        console.info(gamedata.playerList);
        cc.director.loadScene("gameScene");
    },
    //限时挑战
    startGame2:function(){
        gamedata.gameType = 2;
        gamedata.playerList = new Array();
        gamedata.mapArea_10 = new Map();
        gamedata.mapArea_safe = new Map();
        gamedata.leftPeoPle = 0;
        let len = 6;
        for (let index = 0; index < len; index++) {
            let selScan = parseInt(Math.random()*13);
            let scan = userInfo.getData.Scan[0];
            let myscan = userInfo.getData.Scan[userInfo.getData.roleSelScan];
            let one_player = {
                startSpeed:(index == 0)?gamedata.gameConf.baseSpeed*myscan.attribute.speed:gamedata.gameConf.baseSpeed*0.6*scan.attribute.speed,
                startScale:(index == 0)?myscan.attribute.scale*0.4:scan.attribute.scale*0.4,
                startForce:(index == 0)?myscan.attribute.fcore:scan.attribute.fcore,//出生的力量
                speed:(index == 0)?gamedata.gameConf.baseSpeed*myscan.attribute.speed:gamedata.gameConf.baseSpeed*0.6*scan.attribute.speed,
                force:(index == 0)?myscan.attribute.fcore:scan.attribute.fcore,
                getForce:1,
                rotateSpeed:0.4,
                dir:cc.v2(0,0),
                level:1,
                name:(index == 0)?userInfo.getData.name:scan.namelb,
                scan:(index == 0)?myscan.index:scan.index,
                pos:cc.v2(0,0),
                killner:-1,//最后一个撞击着
                killed:0,
                die:false,
            };
            gamedata.playerList.push(one_player);
        }
        console.info(gamedata.playerList);
        cc.director.loadScene("gameScene");
    },

};

module.exports = {
    getData:gamedata
};