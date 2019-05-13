
//装备分类和属性(可配置)
export const EquipmentTypeName = ['weapon','mask','hat','armband','clothes','action'];

/**
 * 装备分类
*/
export enum PropType{
    None = -1,
    Diamond = 1,    
    SoulStone = 2,//    
    Rune = 3,   //装备升级的符石
    Chest = 4,    //宝箱
    Equip = 5   //装备

}
/**
 * 道具 属性 item
 */
export class PropItem{
    //表格一致
    public Id:number = 0;//物品id
    public Itemname:string = '';//名称
    public Desc:string = '';//描述
    public Typeid:PropType = PropType.None;//类型
    public Bagtype:number = 0;//背包类型
    public Icon:string = '';//图标
    public Count:number = 0;//堆叠数量
    public Price:number = 0;//购买价格

    //自定义
    constructor(type:PropType,id:number,name:string){
        this.Typeid = type;
        this.Itemname = name;
        this.Id = id;
    }
}

/**
 * 装备分类
*/
export enum EquipmentType{
    None = -1,
    Weapon = 1, // 武器
    Mask = 2,//面具
    Hat = 3,//帽子
    Armband = 4,//臂章
    Clothes = 5,//衣服
    Action = 6//动作
}

/**
 * 装备 属性 item
 */
export class EquipmentItem{
    //表格一致
    public Id:number = 0;//装备ID
    public Name:string = '';//名称
    public Desc:string = '';//描述
    public Itemtype:EquipmentType = EquipmentType.None;//道具类型
    public Stage:number = 0;//等阶
    public Modelid:string = '';//采用的模型名称
    public Upgradeitem:number = 0;//升级道具
    public Uptype:number = 0;//升级类型
    public Range:number = 0;//攻击距离
    public Rangeweight:number = 0;//攻击权重
    public Soul:number = 0;//获取魂魄
    public Soulweight:number = 0;//魂魄权重
    public Itemadd:number = 0;//道具加成
    public Shock:number = 0;//冲击？？？
    public Shockweight:number = 0;//冲击权重
    public SlowTime:number = 0;//时间减缓
    public STweight:number = 0;//时间减缓权重
    public Defense:number = 0;//防御
    public Defenseweight:number = 0;//防御权重
    public Recovery:number = 0;//格挡
    public Recoveryweight:number = 0;//格挡权重
    public Luck:number = 0;//幸运
    public Luckweight:number = 0;//幸运权重
    //自定义
    public lv:number = 1;//升级
    public canBuy:boolean = false;//可以购买
    public canEquip:boolean = false;//可以装备
    
    constructor(type:EquipmentType,id:number,name:string){
        this.Itemtype = type;
        this.Name = name;
        this.Id = id;
    }
}
/**
 * 装备
 */
export class Equipment{
    public type:EquipmentType = EquipmentType.None;//类型
    constructor(t_type:EquipmentType){
        this.type = t_type;
    }

   
}

/**
 * 装备栏
 */
export class KeepEquipment{
    public weapon:Equipment = new Equipment(EquipmentType.Weapon);//武器
    public hat:Equipment = new Equipment(EquipmentType.Hat);//帽子
    public armband:Equipment = new Equipment(EquipmentType.Armband);//臂章
    public clothes:Equipment = new Equipment(EquipmentType.Clothes);//衣服
    public mask:Equipment = new Equipment(EquipmentType.Mask);//面具
    public action:Equipment = new Equipment(EquipmentType.Action);//动作

}

/**
 * 我的背包
 */
export class MyBag{
    //钻石
    public diamonds;
    //金币
    public gold;
    //我的道具
    public myItems:{ [key: string]: PropItem} = {};
    //我的装备
    public myKeepEquipment:KeepEquipment = new KeepEquipment();
}