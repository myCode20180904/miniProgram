import BaseUI from "./BaseUI";
import { Logger } from "../tools/Logger";
import HallUI from "./HallUI";
import LoadingUI from "./LoadingUI";
import { WXManager } from "../tools/wx/wxApi";
import { CommonHandel } from "../define/CommonParam";
import { UserManager } from "../manager/UserManager";
import { MsEngine } from "../net/MsEngine";
import { GameConfig, USE_MATCHVS } from "../GameConfig";
import { MD5 } from "../tools/md5";
import { UIManager } from "../manager/UIManager";

/**
 * LoginUI
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginUI extends BaseUI {
    private processBar:cc.ProgressBar;
    private login_bn:cc.Button;

    loginHandel:CommonHandel = null;
    //微信授权按钮
    wx_button: any = null;

    constructor(skin:string){
        super(skin,[{url:'texture/world_map',type:cc.Texture2D}]);

    }

    onLoadProcess(completedCount: number, totalCount: number){
        super.onLoadProcess(completedCount, totalCount);
    }

    onLoadComplete(){
        super.onLoadComplete();
        this.init();
        this.startLoad();
    }

    init(){
        this.enabled = true;
        this.processBar = this.node.getChildByName('processBar').getComponent(cc.ProgressBar);

        this.login_bn = this.node.getChildByName('login_btn').getComponent(cc.Button);
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "LoginUI";//这个是代码文件名
        clickEventHandler.handler = "login";
        clickEventHandler.customEventData = "";
        this.login_bn.clickEvents.push(clickEventHandler);
        
    }
    
    startLoad(){
        var that = this;
        /**
         * 加载base资源
         */
        cc.loader.loadResDir('./base',function(completedCount: number, totalCount: number, item: any){
            that.setProcess(Math.floor(completedCount*100/totalCount));
        },function(error: Error, resource: any){
            that.showLogin();
        });

    
    }

    /**
     * 设置加载进度
     */
    setProcess(process: number) {
        this.processBar.progress = process / 100;
        this.node.getChildByName('tip').getComponent(cc.Label).string = '资源加载中...    '+process + '%'
    }


    /**
     * 
     */
    showLogin(){
        this.login_bn.node.active = true;
        if(window['wx']){
            // this.processBar.node.active = false;
            this.login(null,null);
        }else{
            this.login_bn.node.active = true;
            // this.processBar.node.active = false;

        }
    }

    /**
     * 进入大厅：
     */
    enterHall(){
        Logger.info('进入大厅：');
        this.login_bn.node.active = false;
        new HallUI('view/Hall').call(()=>{
            this.close();
        });
        
    }

    public login(event, customEventData){
        if(window['wx']){
            this.loginHandel = new CommonHandel(
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
            )
            //微信登录
            WXManager.Instance.login(this,this.loginHandel);
        }else{
            //登录
            if(USE_MATCHVS){
                MsEngine.Instance.sendLogin();
            }else{
                this.enterHall();
            }
            
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
                        // AudioManager.Instance.playEff(AudioType.EFF_Touch);
                        if(!that.loginHandel){
                            Logger.warn("??? loginHandel = null");
                            return
                        }
                        WXManager.Instance.getUserInfo(that,that.loginHandel);
                        
                    })

                    that.wx_button.show()
                }
            })
        }
    }

}
