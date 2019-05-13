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
