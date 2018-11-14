
var userInfo = {
    openid:0,
    code:0,
    skey:0,
    uid:0,
    name:0,
    avatarUrl:0,
    sex:0,
    formScene:0,
    score:0,
    maxScore:0,
    isNewPlayer:0,

    //处理数据
    friendList:[],
    inviteFriends:[],
    inviteFriendsReward:[{scan_index:2,get:0},
                        {scan_index:4,get:0},
                        {scan_index:5,get:0},
                        {scan_index:7,get:0},
                        {scan_index:10,get:0}],
    sortFriendListByAge:function(_friendList){

        return _friendList;
    },

    //prop 0复活卡 1保级卡 2雷暴 3水神
    daySign:[
        {prop:0,num:3}
        ,{prop:2,num:1}
        ,{prop:0,num:5}
        ,{prop:1,num:5}
        ,{prop:0,num:8}
        ,{prop:1,num:8}
        ,{prop:3,num:1}
    ],
    isTodayFirst:false,//今天第一次进入
    loginDay:1,//登陆天数
    todaySign:0,
    jiasuka:0,//加速卡
    fuhuoka:0,//复活卡
    baojika:0,//保级卡
    freeLuck:0,//免费抽奖次数
    roleScan:[],
    roleSelScan:0,
    //皮肤
    Scan:[{index:0,name:"普通球",desc:"进入游戏赠送的球球",attribute:{scale:1.0,speed:1.0,fcore:1.0,},tip:"",tipType:0},
        {index:1,name:"高级球",desc:"我很黑，但我吃鸡最厉害",attribute:{scale:1.0,speed:1.05,fcore:1.0,},tip:"5层解锁",tipType:1},
        {index:2,name:"超级球",desc:"球球中的兰博基尼",attribute:{scale:1.0,speed:1.08,fcore:1.0,},tip:"好友助力解锁",tipType:3},
        {index:3,name:"大师球",desc:"我的身体充满无穷能量",attribute:{scale:1.0,speed:1.0,fcore:1.1,},tip:"10层解锁",tipType:1},
        {index:4,name:"火龙",desc:"脾气火爆的上古物种",attribute:{scale:1.0,speed:1.0,fcore:1.15,},tip:"好友助力解锁",tipType:3},
        {index:5,name:"卡卡",desc:"庞大的身躯依旧灵敏",attribute:{scale:1.2,speed:1.0,fcore:1.0,},tip:"好友助力解锁",tipType:3},
        {index:6,name:"水龟",desc:"坚硬的外壳是最有力的武器",attribute:{scale:1.0,speed:1.2,fcore:1.0,},tip:"20层解锁",tipType:1},
        {index:7,name:"种子",desc:"生命力极其顽强",attribute:{scale:1.0,speed:1.0,fcore:1.25,},tip:"好友助力解锁",tipType:3},
        {index:8,name:"雷暴",desc:"破坏力让人瑟瑟发抖",attribute:{scale:1.0,speed:1.15,fcore:1.08,},tip:"登陆奖励解锁",tipType:2},
        {index:9,name:"呆呆",desc:"不要被我的外表蒙蔽",attribute:{scale:1.2,speed:1.2,fcore:1.0,},tip:"40层解锁",tipType:1},
        {index:10,name:"喵喵",desc:"女朋友最爱的宠物",attribute:{scale:1.0,speed:1.25,fcore:1.25,},tip:"好友助力解锁",tipType:3},
        {index:11,name:"火神",desc:"靠近我注定被燃烧",attribute:{scale:1.3,speed:1.0,fcore:1.3,},tip:"60层解锁",tipType:1},
        {index:12,name:"水神",desc:"天地万物皆我管控",attribute:{scale:1.0,speed:1.3,fcore:1.3,},tip:"登陆奖励解锁",tipType:2}
    ],
    
    //更新游戏时间
    refreshDay:function(){
        let date = new Date();
        date.setTime(cc.sys.localStorage.getItem('lastEnterTime'));
        userInfo.isTodayFirst = false;
        let now = new Date();
        if(now.getFullYear()>date.getFullYear()){
            userInfo.isTodayFirst = true;
        }else if(new Date().getMonth()>date.getMonth()){
            userInfo.isTodayFirst = true;
        }else if(new Date().getDate()>date.getDate()){
            userInfo.isTodayFirst = true;
        }
        cc.sys.localStorage.setItem('lastEnterTime',new Date().getTime());

        //今天第一次进入
        if(userInfo.isTodayFirst){
            userInfo.freeLuck = 1;
            cc.sys.localStorage.setItem('freeLuck',1);
            //登陆天数
            if(cc.sys.localStorage.getItem('loginDay')){
                userInfo.loginDay = parseInt(cc.sys.localStorage.getItem('loginDay'));
                if(cc.sys.localStorage.getItem('todaySign')==1){
                    userInfo.loginDay++;
                }
                if(userInfo.loginDay>=7){
                    userInfo.loginDay=7;
                }
                cc.sys.localStorage.setItem('loginDay',userInfo.loginDay)
            }
            userInfo.todaySign = 0;
            cc.sys.localStorage.setItem('todaySign',0);
        }

    },

};

module.exports = {
    getData:userInfo
};