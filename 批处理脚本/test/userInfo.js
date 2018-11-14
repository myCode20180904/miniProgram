
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
    inviteFriends:['','',''],
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
    Scan:[
        {index:0,namelb:"普通忍者",name:"<outline color=#ffffff width=1><color=#435168>普通忍者</c></outline>",desc:"执行任务的普通忍者",attribute:{scale:1.0,speed:1.0,fcore:1.0,},tip:"",tipType:0},
        {index:1,namelb:"大蛇丸",name:"<outline color=#ffffff width=2><color=#59BD00>大蛇丸</c></outline>",desc:"给人感觉阴险的传说三人之一",attribute:{scale:1.0,speed:1.05,fcore:1.0,},tip:"5层解锁",tipType:1},
        {index:2,namelb:"鸣人",name:"<outline color=#ffffff width=2><color=#59BD00>鸣人</c></outline>",desc:"为实现梦想，和守护伙伴们的\n羁绊，鸣人不断修炼变强",attribute:{scale:1.0,speed:1.08,fcore:1.0,},tip:"好友助力解锁",tipType:3},
        {index:3,namelb:"李洛克",name:"<outline color=#ffffff width=2><color=#59BD00>李洛克</c></outline>",desc:"我的身体充满无穷能量",attribute:{scale:1.0,speed:1.0,fcore:1.1,},tip:"10层解锁",tipType:1},
        {index:4,namelb:"丁次",name:"<outline color=#ffffff width=2><color=#59BD00>丁次</c></outline>",desc:"秋道家族第十六代继承人",attribute:{scale:1.0,speed:1.0,fcore:1.15,},tip:"好友助力解锁",tipType:3},
        {index:5,namelb:"鼬",name:"<outline color=#ffffff width=2><color=#1A78F7>鼬</c></outline>",desc:"宇智波一族的天才，实力强\n大，天赋更是出类拔萃",attribute:{scale:1.2,speed:1.0,fcore:1.0,},tip:"好友助力解锁",tipType:3},
        {index:6,namelb:"佐助",name:"<outline color=#ffffff width=2><color=#1A78F7>佐助</c></outline>",desc:"佐助是一个具有强大意志的人",attribute:{scale:1.0,speed:1.2,fcore:1.0,},tip:"20层解锁",tipType:1},
        {index:7,namelb:"我爱罗",name:"<outline color=#ffffff width=2><color=#1A78F7>我爱罗</c></outline>",desc:"风之国·砂隐村的第五代风影",attribute:{scale:1.0,speed:1.0,fcore:1.25,},tip:"好友助力解锁",tipType:3},
        {index:8,namelb:"波风水门",name:"<outline color=#ffffff width=2><color=#1A78F7>波风水门</c></outline>",desc:"火之国木叶隐村的四代目火影",attribute:{scale:1.0,speed:1.15,fcore:1.08,},tip:"登陆奖励解锁",tipType:2},
        {index:9,namelb:"卡卡西",name:"<outline color=#ffffff width=2><color=#A800A8>卡卡西</c></outline>",desc:"火之国木叶隐村的精英上忍，\n原木叶暗部成员",attribute:{scale:1.2,speed:1.2,fcore:1.0,},tip:"40层解锁",tipType:1},
        {index:10,namelb:"迪达拉",name:"<outline color=#ffffff width=2><color=#A800A8>迪达拉</c></outline>",desc:"爆炸就是艺术",attribute:{scale:1.0,speed:1.25,fcore:1.25,},tip:"好友助力解锁",tipType:3},
        {index:11,namelb:"猿飞",name:"<outline color=#ffffff width=2><color=#FF8500>猿飞</c></outline>",desc:"火之国木叶隐村的三代目火影",attribute:{scale:1.3,speed:1.0,fcore:1.3,},tip:"60层解锁",tipType:1},
        {index:12,namelb:"自来也",name:"<outline color=#ffffff width=2><color=#FF8500>自来也</c></outline>",desc:"火之国木叶隐村的“三忍”\n之一",attribute:{scale:1.0,speed:1.3,fcore:1.3,},tip:"登陆奖励解锁",tipType:2}
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