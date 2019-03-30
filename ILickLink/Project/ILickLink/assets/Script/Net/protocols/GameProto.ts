import { HttpHandler } from "../HttpHandel";
import { SC_Packet, CS_Packet,CS_UserLogin,SC_UserLogin, ProtoBase, CS_GetPlayerData, SC_SynPlayerData, SC_GetPlayerData, CS_SynPlayerData, CS_AllRank, SC_AllRank, CS_DayRank, CS_CombatRank, SC_DayRank, SC_CombatRank, SC_CheckRankAward, CS_GetShareAward, SC_GetShareAward } from "../MsgPacket";
import { UserManager } from "../../Manager/UserManager";
import { RankManager } from "../../Manager/RankManager";
import { CS_GetItemList, SC_GetItemList, CS_WearEquip, SC_WearEquip, CS_UpGradeEquip, SC_UpGradeEquip, CS_ShopBuyInfo, SC_ShopBuyInfo, CS_OpenBox, SC_OpenBox } from "../BagPacket";
import { BagManager } from "../../Manager/BagManager";
import { Logger } from "../../Tool/Logger";

export class GameProto extends ProtoBase {
    private static instance: GameProto;
	public static get Instance(): GameProto {
		if (this.instance == null) {
			this.instance = new GameProto();
		}
		return this.instance;
    }

    /**
     * 注册全部协议
     */
    public registerProtocol(): void {
        HttpHandler.Instance.registerProtocol('UserLogin', this);//登陆
        HttpHandler.Instance.registerProtocol('GetPlayerData', this);//获取玩家信息      
        HttpHandler.Instance.registerProtocol('SynPlayerData', this); //同步玩家数据

        HttpHandler.Instance.registerProtocol('AllRank', this);//通关总排行
        HttpHandler.Instance.registerProtocol('DayRank', this);//通关日排行
        HttpHandler.Instance.registerProtocol('CombatRank', this);//战力排行

        HttpHandler.Instance.registerProtocol('CheckRankAward', this);//检测排行榜奖励
        HttpHandler.Instance.registerProtocol('GetShareAward', this);//

        //=================================背包=======================================
        HttpHandler.Instance.registerProtocol('GetItemList', this);//获取背包列表
        HttpHandler.Instance.registerProtocol('WearEquip', this);//穿戴装备
        HttpHandler.Instance.registerProtocol('UpGradeEquip', this);//升级装备
        HttpHandler.Instance.registerProtocol('ShopBuyInfo', this);
        HttpHandler.Instance.registerProtocol('OpenBox', this);
    }


  
    //登陆*****************************************************************
    /**
     * 请求用户登录.  发
     * @param {object} message
     * @return void
     */
    public requestUserLogin(message: CS_UserLogin): void {
        if(window['wx']){
            message.type = 1;
        }else{
            message.type = 0;
        }
        HttpHandler.Instance.sendLoginPostMessage(message);

    }
    /**
     * 返回用户登录.  收
     * @param {SC_UserLogin} message
     * @return void
     */
    public handleUserLogin(message: SC_UserLogin): void {
        Logger.info("收到服务器返回登陆信息：",message);
        UserManager.Instance.setUserInfo(message);

        //登陆完成之后，获取玩家数据  发请求
        let getplayerdata = new CS_GetPlayerData();
        getplayerdata.nickName = UserManager.Instance.getUserInfo().nickName;
        getplayerdata.picUrl = UserManager.Instance.getUserInfo().avatarUrl;
        this.requestGetPlayerData(getplayerdata);

    }





      /**
     * 提交结算信息  同步信息
     * @param message
     */
    public requestSynPlayerData(message: CS_SynPlayerData) {
        UserManager.Instance.getUserInfo().score = message.score;
        UserManager.Instance.getUserInfo().stage = message.stage;
        BagManager.Instance.updateItemAdd(102001,message.gold);
        HttpHandler.Instance.sendGamePostMessage(message);
    }
    /**
     * 结算信息返回
     * @param message 
     */
    public handleSynPlayerData(message: SC_SynPlayerData) {
        Logger.info("保存结算信息成功：", message);
    }



  
    


    /**
     * 请求玩家数据信息
     * @param message 
     */
    public requestGetPlayerData(message:CS_GetPlayerData){
        HttpHandler.Instance.sendGamePostMessage(message);
    }
    /**
     * 返回玩家数据
     * @param message 
     */
    public handleGetPlayerData(message:SC_GetPlayerData){
        Logger.info("收到服务器返回玩家数据：",message);
        UserManager.Instance.updatePlayerData(message);
    }

    


    /**
     * 请求排行信息 总排行榜
     * @param message 
     */
    public requestAllRank(message:CS_AllRank){
        HttpHandler.Instance.sendGamePostMessage(message);
    }
    /**
     * 返回排行信息
     * @param message 
     */
    public handleAllRank(message:SC_AllRank){
        Logger.info("收到服务器返回总排行榜信息：",message);
        // RankManager.Instance.refreshAllRank(message);
    }




    
    /**
     * 请求排行信息 日排行榜
     * @param message 
     */
    public requestDayRank(message:CS_DayRank){
        HttpHandler.Instance.sendGamePostMessage(message);
    }
    /**
     * 返回排行信息
     * @param message 
     */
    public handleDayRank(message:SC_DayRank){
        Logger.info("收到服务器返回日排行榜信息：",message);
        // RankManager.Instance.refreshDayRank(message);
    }



    
    /**
     * 请求排行信息  战力排行榜
     * @param message 
     */
    public requestCombatRank(message:CS_CombatRank){
        HttpHandler.Instance.sendGamePostMessage(message);
    }
    /**
     * 返回排行信息
     * @param message 
     */
    public handleCombatRank(message:SC_CombatRank){
        Logger.info("收到服务器返回战力排行榜信息：",message);
        // RankManager.Instance.refreshCombatRank(message);
    } 


    /**
     * 检测排行榜奖励
     * @param message 
     */
    public handleCheckRankAward(message:SC_CheckRankAward){
        Logger.info("检测排行榜奖励：",message);
        // UIManager.Instance.showToast('恭喜获得钻石x2');
    } 

    /**
     * 视屏分享奖励
     * @param message 
     */
    public requestGetShareAward(message:CS_GetShareAward){
        HttpHandler.Instance.sendGamePostMessage(message);
    }
    public handleGetShareAward(message:SC_GetShareAward){
        Logger.info("视屏分享奖励：",message);
        BagManager.Instance.updateShareAward(message);
    }


    //背包*****************************************************************
    /**
     * 获取背包列表
     * @param message 
     */
    public requestGetItemList(message:CS_GetItemList){
        if(message.uid<=0){
            let test = new SC_GetItemList();
            let item = {111001:{itemAdd:25,lv:1,range:20,shock:10,slowTime:10,soul:20,stage:1}
                        ,111002:{itemAdd:25,lv:1,range:20,shock:10,slowTime:10,soul:20,stage:2}
                        ,112001:{itemAdd:25,lv:1,range:20,shock:10,slowTime:10,soul:20,stage:1}
                        ,112002:{itemAdd:25,lv:1,range:20,shock:10,slowTime:10,soul:20,stage:2}
                        ,113001:{itemAdd:25,lv:1,range:20,shock:10,slowTime:10,soul:20,stage:1}
                        ,114001:{itemAdd:25,lv:1,range:20,shock:10,slowTime:10,soul:20,stage:1}
                        ,115001:{itemAdd:25,lv:1,range:20,shock:10,slowTime:10,soul:20,stage:1}
                        ,canBuy:[111003,113002]
                    }
                let item2 = {
                    canBuy:[121001,121002]
                }
            test.equiplist = {1:item,3:item2};
            test.wearEquiplist = {1:111002};
            test.itemlist = {101001:10000,102001:0,105001:1,105002:0,105003:0,105004:0};
            BagManager.Instance.updateMyBag(test);
        }
        HttpHandler.Instance.sendGamePostMessage(message);
    }
    /**
     * 处理背包列表
     * @param message 
     */
    public handleGetItemList(message:SC_GetItemList){
        Logger.info("收到服务器返回背包列表信息：",message);
        BagManager.Instance.updateMyBag(message);
    } 

    /**
     * 穿戴装备
     * @param message 
     */
    public requestWearEquip(message:CS_WearEquip){
        HttpHandler.Instance.sendGamePostMessage(message);
    }
    /**
     * 处理穿戴装备
     * @param message 
     */
    public handleWearEquip(message:SC_WearEquip){
        Logger.info("收到服务器返回穿戴装备：",message);
        BagManager.Instance.updateWear(message);
    } 

    /**
     * 升级装备
     * @param message 
     */
    public requestUpGradeEquip(message:CS_UpGradeEquip){
        HttpHandler.Instance.sendGamePostMessage(message);
    }
    /**
     * 处理升级装备
     * @param message 
     */
    public handleUpGradeEquip(message:SC_UpGradeEquip){
        Logger.info("收到服务器返回升级装备：",message);
        BagManager.Instance.updateUpGrade(message);
    } 

    /**
     * 玩家购买商城物品
     * @param message 
     */
    public requestShopBuyInfo(message:CS_ShopBuyInfo){
        HttpHandler.Instance.sendGamePostMessage(message);
    }
    /**
     * 处理玩家购买商城物品
     * @param message 
     */
    public handleShopBuyInfo(message:SC_ShopBuyInfo){
        Logger.info("收到服务器返回购买商城物品：",message);
        
    }

    /**
     * 开宝箱
     * @param message 
     */
    public requestOpenBox(message:CS_OpenBox){
        HttpHandler.Instance.sendGamePostMessage(message);
    }
    /**
     * 处理开宝箱
     * @param message 
     */
    public handleOpenBox(message:SC_OpenBox){
        Logger.info("收到服务器返回开宝箱：",message);

        // BagManager.Instance.up(message);
    }



}
