import { BagManager } from "../Manager/BagManager";
import { CS_Packet, SC_Packet } from "./MsgPacket";


////////////////////////////////////////////////////

/**
 * 获取背包列表
 */
export class CS_GetItemList extends CS_Packet{
	public constructor() {
        super();
        this.pt = "GetItemList";
    }
}
export class SC_GetItemList extends SC_Packet{
    public itemlist = {}; //道具列表
    public equiplist = {}; //装备列表
    public wearEquiplist = {}; //已穿戴装备列表
	public constructor() {
        super();
        this.pt = "GetItemList";
    }
}


/**
 * 穿戴装备
 */
export class CS_WearEquip extends CS_Packet{
    public equipType:number = 0; //类型
    public equipId:number = 0; //id
	public constructor() {
        super();
        this.pt = "WearEquip";
    }
}
export class SC_WearEquip extends SC_Packet{
    public wearEquiplist = {}; //已穿戴装备列表
	public constructor() {
        super();
        this.pt = "WearEquip";
    }
}

/**
 * 升级装备
 */
export class CS_UpGradeEquip extends CS_Packet{
    public equipType:number = 0; //类型
    public equipId:number = 0; //id
	public constructor() {
        super();
        this.pt = "UpGradeEquip";
    }
}
export class SC_UpGradeEquip extends SC_Packet{
    public itemlist = {}; //道具列表
    public equiplist = {}; //装备列表
	public constructor() {
        super();
        this.pt = "UpGradeEquip";
    }
}

/**
 * 玩家购买商城物品
 */
export class CS_ShopBuyInfo extends CS_Packet{
    public Id:number = 0; //购买物品id
    public shopType:number = 0; //商品类型
    public chargeId:number = 0; //计费点
	public constructor() {
        super();
        this.pt = "ShopBuyInfo";
    }
}
export class SC_ShopBuyInfo extends SC_Packet{
    public Id:number = 0; //id
    public shopType:number = 0; //商品类型
    public chargeId:number = 0; //
    public buySuccess:number = 0; //
	public constructor() {
        super();
        this.pt = "ShopBuyInfo";
    }
}

/**
 * 开宝箱
 */
export class CS_OpenBox extends CS_Packet{
    public itemId:number = 0; //
	public constructor() {
        super();
        this.pt = "OpenBox";
    }
}
export class SC_OpenBox extends SC_Packet{
    public randomItemInBox:number = 0; //
	public constructor() {
        super();
        this.pt = "OpenBox";
    }
}