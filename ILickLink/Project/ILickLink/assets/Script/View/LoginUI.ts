import { BaseUI} from "./BaseUI";
import { UIManager} from "../manager/UIManager";
import { Logger } from "../Tool/Logger";
import { MsEngine } from "../Net/protocols/MsEngine";
import { WXManager } from "../Tool/wx/wxApi";
import { CommonHandel } from "../Define/CommonParam";
import { UserManager } from "../manager/UserManager";
import { GameConfig } from "../Define/GameConfig";
import { AudioManager, AudioType } from "../manager/AudioManager";
import { MD5 } from "../Tool/md5";
const {ccclass, property} = cc._decorator;

@ccclass
export class LoginUI extends BaseUI {

    @property(cc.Node)
    loginBtn: cc.Node = null;
    @property(cc.ProgressBar)
    bar: cc.ProgressBar = null;
    @property(cc.Label)
    tip: cc.Label = null;

    //微信授权按钮
    wx_button: any = null;

    loginHandel:CommonHandel = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Logger.info('LoginUI onLoad');
    }

    onDestroy(){
        Logger.info('LoginUI onDestroy');
        this.hideWxInfoButton();
    }

    onEnable(){
        Logger.info('LoginUI onEnable');
    }

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,function(){},this);

    }
    /**
     * 显示登陆按钮
     */
    public showLogin(){
        if(window['wx']){
            this.bar.node.active = false;
            this.tip.string = `点击进入游戏`;
            this.node.getChildByName("background").getComponent(cc.Button).interactable = true;
            this.login();
        }else{
            this.loginBtn.active = true;
            this.bar.node.active = false;
            this.tip.string = `点击进入游戏`;
            this.node.getChildByName("background").getComponent(cc.Button).interactable = true;
        }
        
    }
    /**
     * 显示加载进度
     */
    public showProcess(value:number){
        this.bar.progress = value/100;
        this.tip.string = `资源加载中...    ${value}%`;

    }

    public login(){
        if(window['wx']){
            var that = this;
            //微信登录
            WXManager.Instance.login(new CommonHandel(
                function(res){
                    Logger.info("============ 微信登录成功 =============");

                    //拿到用户名字，性别，头像
                    UserManager.Instance.getUserInfo().nickName = res.userInfo.nickName;
                    UserManager.Instance.getUserInfo().gender = res.userInfo.gender;
                    UserManager.Instance.getUserInfo().avatarUrl = res.userInfo.avatarUrl;

                    UserManager.Instance.isLogin = true;
                    //获取微信openid
                    // WXManager.Instance.getWxOpenID({
                    //     code:UserManager.Instance.getUserInfo().code,
                    //     success:function(wxUserInfo:any){
                    //         Logger.info("获取到的微信用户信息",wxUserInfo);
                    //         UserManager.Instance.getUserInfo().openid = res.openid;
                    //         that.bindOpenIDWithUserID(wxUserInfo.data);
                    //     }
                    // })
                }
            ));
        }else{
            //登录
            MsEngine.Instance.sendLogin();
        }
    }
    /**
     * 绑定微信OpenID 返回用户信息
     * @param wxUserInfo 获取的 openID 信息和 微信的 userInfo
     */
    public bindOpenIDWithUserID(wxUserInfo:any){
        let release_reqUrl = "https://vsuser.matchvs.com/wc6/thirdBind.do?";
        let alpha_reqUrl = "http://alphavsuser.matchvs.com/wc6/thirdBind.do?";

        //sign=md5(appKey&gameID=value1&openID=value2&session=value3&thirdFlag=value4&appSecret)
        let params = GameConfig.MatchvsConfig.AppKey+"&gameID="+GameConfig.MatchvsConfig.GameID+"&openID="+wxUserInfo.openid+"&session="+wxUserInfo.session_key+"&thirdFlag=1&"+GameConfig.MatchvsConfig.AppSecret;
        //计算签名
        let _md5 = new MD5();//MD5 需要自己找方法
        let signstr = _md5.hex_md5(params);//MD5 需要自己找方法
        //重组参数 userID 传0
        //用于post请求，不能使用get请求，如果使用get请求可能会出现签名失败，因为微信session_key有需要url编码的字符
        let jsonParam = {
            userID:0,
            gameID:GameConfig.MatchvsConfig.GameID,
            openID:wxUserInfo.openid,
            session:wxUserInfo.session_key,
            thirdFlag:1,
            sign:signstr
        };
        
        Logger.info("bindOpenIDWithUserID: 签名参数：",jsonParam);
        var request = new XMLHttpRequest();
        request.responseType = "text";
        request.open("POST",alpha_reqUrl);
        request.setRequestHeader("Content-Type", "application/json");
        request.onreadystatechange = function () {
            if(request.readyState === XMLHttpRequest.DONE) {
                if(request.status === 200){
                    let repData = JSON.parse(request.response);
                    console.log("绑定微信结果 repData : ",repData);
                    //绑定成功
                    if( repData.status == 0){
                        //绑定成功就会返回 userID等信息
                        UserManager.Instance.getUserInfo().uid = repData.data.userid;
                        UserManager.Instance.getUserInfo().token = repData.data.token;


                        //绑定成功就可以登录 matchvs
                        MsEngine.Instance.sendLogin();
                    }
                }else{
                    
                }
            }
        };
        request.send(JSON.stringify(jsonParam));
    }


     /**
     * 菜单
     * @param event 点击事件
     * @param customEventData 用户参数
     */
    menu (event:cc.Event,customEventData:any){
        // Logger.info('touch menu:',customEventData);
        if(customEventData=="login"){
            this.login();
        }
      
    }

    /**
     * 关闭
     */
    private close(){
        UIManager.Instance.closeWindow('LoginUI');
    }

    // update (dt) {}

    public onShow(){
        Logger.info('LoginUI onShow');
    }
    public onHide(){
        Logger.info('LoginUI onHide');
        
    }


    /**
     * 隐藏微信授权按钮
     */
    public hideWxInfoButton(){
        if(this.wx_button){
            this.wx_button.hide();
        }
    }
    /**
     * 显示微信授权按钮
     */
    public showWxInfoButton(){
        Logger.info("显示微信授权按钮")
        var that = this;
        //按钮图片
        let url =  GameConfig.imageUrl + "/wxLoginMax.png";

        if(that.wx_button){
            that.wx_button.show();
        }else{
            let wx = window['wx'];
            wx.getSystemInfo({
                success(res){
                    var width = res.screenWidth;
                    var height = res.screenHeight;
                    var btWidth = res.screenWidth; //这里只是简单的认为Dpr 2.2
                    var btHeight = res.screenHeight;

                    that.wx_button = wx.createUserInfoButton({
                        type: "image",
                        image: url,
                        style: {
                            left: width/2 - btWidth/2,
                            top: height/2 - btHeight/2,
                            width: btWidth,
                            height: btHeight,
                        }
                    })

                    that.wx_button.onTap((res1) => {
                        AudioManager.Instance.playEff(AudioType.EFF_Touch);
                        if(!that.loginHandel){
                            Logger.warn("??? loginHandel = null");
                            return
                        }
                        WXManager.Instance.getUserInfo(that.loginHandel);
                        
                    })

                    that.wx_button.show()
                }
            })
        }
    }
}
