var config = require('../public/config')
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
    GameClubBn:0,

    
    //自定义字体
    myFontList:new Array(),
    
    //加载的资源缓存 <key:name(path),value:file(cc.SpriteFrame)>
    textureRes:new Map(),

    /**
     * loadHttpPng
     * 加载网络图片
     * @param {*} _filePath 路径
     * @param {*} _callfunc 回调（cc.SpriteFrame）
     * @param {*} _is_absolute 绝对路径
     */
    loadHttpPng:function(_filePath,_callfunc,_is_absolute){
        let _iconUrl = config.service.imgUrl + _filePath;
        if(!_filePath||_filePath==""){
            _iconUrl="https://lg-3q7kbp58-1257126548.cos.ap-shanghai.myqcloud.com/images/test/ball.png"
        }
        if(_is_absolute == true){
            _iconUrl = _filePath;
            let file_arr = _filePath.split('/');
            _filePath = "is_absolute/"+file_arr[file_arr.length-1]
        }else{
            _filePath.replace(/'\/'/g,"_")//替换/ 为 _
            _filePath.replace(/'.'/g,"_")//替换/ 为 _
        }

        console.info("loadHttpPng:",_filePath);
        if(common.textureRes.has(_filePath)){
            if(_callfunc){
                _callfunc(common.textureRes.get(_filePath))
            }
            return;
        }

        cc.loader.load({url: _iconUrl, type: 'png'}, function (err, tex) {
            if(err){
                console.info("loadHttpPng:",err);
                return;
            }
            common.textureRes.set(_filePath,new cc.SpriteFrame(tex)); 
            if(_callfunc){
                _callfunc(common.textureRes.get(_filePath))
            }
        });
    },

    shareArray:[
        {title:"忍者无敌分享标题1",img:"https://goss.veer.com/creative/vcg/veer/800water/veer-142489853.jpg"},
        {title:"忍者无敌分享标题2",img:"https://goss.veer.com/creative/vcg/veer/800water/veer-142489853.jpg"},
        {title:"忍者无敌分享标题3",img:"https://goss.veer.com/creative/vcg/veer/800water/veer-142489853.jpg"}
    ],
    sharekey:0,

};


module.exports = {
    getData:common
};