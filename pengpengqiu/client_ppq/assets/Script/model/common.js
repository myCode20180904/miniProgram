
var common = {
    passkey:"74c1f0b7048a0bc927f73bb5c51794fb",
    appId:"wxfdd206c03b158c68",
    AppSecret:"7f74f963c32f8970480bc771a3c99dc0",
    //开关
    open:{
        test:true,

    },
    isLogin:false,
    tunnelStatus:0,
    rank:[0,1,2],
    //微信小程序屏幕
    screenWidth:0,
    screenHeight:0,

    //提前加载的资源
    textureRes:new Map(),
    shareArray:[
        {title:"碰碰球分享标题1",img:"https://goss.veer.com/creative/vcg/veer/800water/veer-142489853.jpg"},
        {title:"碰碰球分享标题2",img:"https://goss.veer.com/creative/vcg/veer/800water/veer-142489853.jpg"},
        {title:"碰碰球分享标题3",img:"https://goss.veer.com/creative/vcg/veer/800water/veer-142489853.jpg"}
    ],
    sharekey:0,

};


module.exports = {
    getData:common
};