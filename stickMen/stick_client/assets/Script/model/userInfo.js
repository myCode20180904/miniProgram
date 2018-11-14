
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
    isTodayFirst:false,//今天第一次进入

    //处理数据
    friendList:[],
    sortFriendListByAge:function(_friendList){

        return _friendList;
    },
    

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
            
        }

    },

};

module.exports = userInfo