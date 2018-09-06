
var data = {
    config:{
        shareType:"1",
        version:"1.00",
        quickBattleTime:"2018.07.30-2018.08.06",//连线赢现金的比赛时间
        quickBattleNum:0,
        quickBattleReward:200000,
        txLimite:5,//提现限制
        shareTitle:[],
        //轮播消息
        msgQueen:[
           // {msg:"<color=#ffffff>小猪佩奇刚刚</c><color=f0537e>提现5元红包</color>"}

        ],
        ads:[
            ["bottom_ad_left.png", "wx1ed16b80e62ea916","kzdq"],
            [ "bottom_add_mid.png", "wxb252632771103300","sgfd"] ,
            ["bottom_ad_right.png", "wx70649580109e268e","bpqq"],
            ["top_ad.png", "wx73096fa7c1c93250","latt"]
        ],
    },
    userInfo:{
        id:0,
        name:"",
        avatarurl:"",
        openid:"",
        skey:0,
        gold:200,
        money:0,
        shareKey:0,//分享key
        shareType:0,//0,1加金币 2 加步长
        appid:0,//分享来源appid
        formScene:0,
        hasNewerRedPacket:0,//0表示不能领  =1 表示可以领
        newerRedPacket:0,//新手红包返回money

    },
    //广告 分享
    shareAd:{
        shareType:{

        }

    },
    //连线赢现金
    quickBattleData:{
        step:10,//剩余步数
        maxgate:50,
        gate:1,//1-50
    },
    //闯关模式
    gateBattleData:{
        step:10,//剩余步数
        num:0,//获得红包个数
        gate:2,//当前关卡1-10
        maxgate:10,//关卡数
        pass:0
    },
    //7天签到
    daySignData:[

    ],
    //获取步数配置
    getMoreStepData:{
        //最多邀请人数
        maxInviteNum:18,
        //邀请玩家的图像列表
        inviteFriends:[
            // {
            //     avatarurl:"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epNTEYokLcXCh8MBtX98EHkReWjdHQF4zmHibicibfOD4qg8ult3Rib2elsgLGvuBDFckOIv9iaVuJrz9Q/132",
            //     friend_id:2,
            //     nickname:"ddfas",
            //     reward:0,
            // }
        ]
    },
    //提现记录
    txRecode:[
       // { name:"现金红包",time:"2018-08-13 15:23",money:5.00 }

    ],

    //common
    hasPopDaySign:false,
    passkey:"74c1f0b7048a0bc927f73bb5c51794fb",
    shareArray:[
        {title:"20万现金已准备好，等你来挑战！",img:"share1.png"},
        {title:"谁都拦不住，BOSS要发钱！",img:"share2.png"},
        {title:"最近大家都在这里偷偷的抢红包！",img:"share3.png"}
    ],
    open:{
        lookMv:true,

    },
    isHelp:{
        tip:0,
        name:0,
        avatarurl:0
    },
    lastXSHBreward:0,
    longScene:false,//长宽比》2.0 长屏幕

};

var getData=function(){
    return data;
}


module.exports = {
    getData:getData
};