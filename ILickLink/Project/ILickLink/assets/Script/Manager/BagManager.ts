import { MyBag, EquipmentType, EquipmentTypeName, PropItem, Equipment } from "../Define/BagType";
import { SC_GetItemList, SC_WearEquip, SC_UpGradeEquip } from "../Net/BagPacket";
import { UIManager } from "./UIManager";
import { LoadManager } from "./LoadManager";
import { Util } from "../Define/Util";
import { UserManager } from "./UserManager";
import { SC_GetShareAward } from "../Net/MsgPacket";
import { Logger } from "../Tool/Logger";

export class BagManager {
    private static instance: BagManager;
	public static get Instance(): BagManager {
		if (this.instance == null) {
			this.instance = new BagManager();
		}
		return this.instance;
    }

    private bag:MyBag = new MyBag();
    //装备配置-字典
    private equipConfig:{ [key: string]: any} = {};
    //道具配置-字典
    private itemConfig:{ [key: string]: any} = {};
    constructor(){
        this.initEquipConfig();
        this.initItemConfig();
    }

    /**
     * 初始装备配置信息 并存入字典
     */
    public initEquipConfig(){
        let config = LoadManager.Instance.getJsonConfig('equip');
        if(!config){
            Logger.error("读取装备配置失败");
            return;
        }
        //
        for (let index = 0; index < config.length; index++) {
            const element = config[index];
            this.equipConfig[element.Id] = element;
        }
    }

    /**
     * 初始装备配置信息 并存入字典
     */
    public initItemConfig(){
        let config = LoadManager.Instance.getJsonConfig('item');
        if(!config){
            Logger.error("读取装备配置失败");
            return;
        }
        //
        for (let index = 0; index < config.length; index++) {
            const element = config[index];
            this.itemConfig[element.Id] = element;
        }
    }

    /**
     * 获取背包信息（可修改）
     */
    public getBagInfo(){
        return this.bag;
    }

    /**
     * 获取钻石
     */
    public getDiamonds(){
        if(this.bag.myItems['101001']){
            Logger.info(this.bag.myItems['101001']);
            return this.bag.myItems['101001'].Count;
        }
        return 0;
    }
    /**
     * 获取金币
     */
    public getGold(){
        if(this.bag.myItems['102001']){
            return this.bag.myItems['102001'].Count;
        }
        return 0;
    }
    /**
     * 更新背包道具数量
     */
    public updateItemCount(id:number,count:number){
        if(this.bag.myItems[id]){
            this.bag.myItems[id].Count=count;
            UserManager.Instance.updateAssets();
        }
        
    }
    public updateItemAdd(id:number,add:number){
        if(this.bag.myItems[id]){
            this.bag.myItems[id].Count+=add;
            UserManager.Instance.updateAssets();
        }
    }
    /**
     * 领取分享奖励
     */
    public updateShareAward(message:SC_GetShareAward){
        // this.bag.myItems[message.awardId].Count+=message.awardCount;
        UserManager.Instance.updateAssets();
        UIManager.Instance.showToast('恭喜获得钻石x'+message.awardCount);
    }
    /**
     * 刷新背包信息
     */
    public updateMyBag(message:SC_GetItemList){
        this.dealItemList(message.itemlist);
        this.dealEquipmentList(message.equiplist);
        this.dealWearList(message.wearEquiplist);
        //界面刷新
        
    }

    /**
     * 刷新穿戴信息
     */
    public updateWear(message:SC_WearEquip){
        this.dealWearList(message.wearEquiplist);
        //界面刷新
        
    }

    /**
     * 刷新升级信息
     */
    public updateUpGrade(message:SC_UpGradeEquip){
        this.dealItemList(message.itemlist);
        this.dealEquipmentList(message.equiplist);
        //界面刷新
       
    }

    /**
     * 查找一条装备配置信息
     * @param id 
     */
    public findEquipById(id:number):any{
        return this.equipConfig[id];
    }

    /**
     * 查找一条道具配置信息
     * @param id 
     */
    public findItemById(id:number):any{
        return this.itemConfig[id];
    }

    /**
     * 处理装备信息
     */
    private dealEquipmentList(equiplist:any){
        for (const key in equiplist) {
            if (!equiplist.hasOwnProperty(key)) {
                continue;
            }
            const list = equiplist[key];
            this.bag.myKeepEquipment[EquipmentTypeName[parseInt(key)-1]].setList(list);
        }
        
        
    }

    /**
     * 处理道具列表
     */
    private dealItemList(itemlist:any){
        for (const key in itemlist) {
            if (!itemlist.hasOwnProperty(key)) {
                continue;
            }
            let item_config = this.findItemById(parseInt(key));
            if(!item_config){
                continue;
            }
            const item = itemlist[key];
            let propItem:PropItem = new PropItem(item_config.Typeid,parseInt(key),item_config.Itemname);
            Util.safeCopy(propItem,item_config);
            propItem.Count = item;
            this.bag.myItems[key] = propItem;
        }
        Logger.info(this.bag.myItems);
        UserManager.Instance.updateAssets();
    }

    /**
     * 处理道具列表
     */
    private dealWearList(wearlist:any){
        for (const key in wearlist) {
            if (!wearlist.hasOwnProperty(key)) {
                continue;
            }
            const wearid = wearlist[key];
            let equip:Equipment =  this.bag.myKeepEquipment[EquipmentTypeName[parseInt(key)-1]];
            equip.selectById(wearid);
        }
        
        
    }
    
    
    

}