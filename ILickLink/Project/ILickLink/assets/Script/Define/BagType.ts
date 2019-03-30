import { Util } from "./Util";
import { BagManager } from "../Manager/BagManager";
import { Logger } from "../Tool/Logger";


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
    /**
     * 展示列表 
     * 例如 type = EquipmentType.Weapon
     * | quan            | wuqi_1 | wuqi_2 | wuqi_3 | wuqi_4 |
     * | [111001,111002] |        |        |        |        |
     */
    public list:{ [index: string]: Array<EquipmentItem>} = {};
    public mapList:{ [id: string]: EquipmentItem} = {};
    public selectID:number = -1; // 选择穿戴的
    public showID:number = 0; // 展示穿戴的
    private showIndex:number = 0;
    public maxStage:number = 1;//展示的阶层
    constructor(t_type:EquipmentType){
        this.type = t_type;
    }

    /**
     * 设置展示列表
     */
    public setList(list:any){
        if(!list){
            return;
        }
        this.list = {}; 
        this.mapList = {}; 
        let first_show = 0;
        //
        for (const key in list) {
            if (!list.hasOwnProperty(key)) {
                continue;
            }
            const info = list[key];
            //可购买展示
            if(key=='canBuy'){
                for (let index = 0; index < info.length; index++) {
                    const id = info[index];
                    let config_item = BagManager.Instance.findEquipById(id);
                    if(!config_item){
                        continue;
                    }
                    let item:EquipmentItem = new EquipmentItem(this.type,id,config_item.Name);
                    Util.safeCopy(item,config_item);
                    item.canBuy = true;
                    //
                    let get_index = this.getIndex(item);
                    if(!this.list[get_index]){
                        this.list[get_index] = new Array()
                    }
                    this.list[get_index].push(item);
                    this.mapList[item.Id] = item;
                    if(!first_show){
                        first_show = item.Id;
                    }
                }
                continue;
            }
            
            let config_item = BagManager.Instance.findEquipById(parseInt(key));
            if(!config_item){
                continue;
            }
            let item:EquipmentItem = new EquipmentItem(this.type,parseInt(key),config_item.Name);
            Util.safeCopy(item,config_item);
            //属性
            item.Itemadd = info.itemAdd;
            item.lv = info.lv;
            item.Range = info.range;
            item.Shock = info.shock;
            item.SlowTime = info.slowTime;
            item.Stage = info.stage;
            item.Soul = info.soul;
            // item.Upgradeitem = info.upGradeItem;
            // item.Uptype = info.upType;
            item.canEquip = true;

            //
            let get_index = this.getIndex(item);
            if(!this.list[get_index]){
                this.list[get_index] = new Array()
            }
            this.list[get_index].push(item);
            this.mapList[item.Id] = item;
            if(!first_show){
                first_show = item.Id;
            }
        }
        Logger.info(this.list);

        if(this.showID<=0){
            this.showID = first_show;
        }
        if(this.selectID<=0){
            this.selectID = first_show;
        }
        
    }  
    /**
     * 选择当前展示的
     * @param index 
     */
    public selectByShow(){
        this.selectID = this.showID;
    }
    public selectById(id:number){
        this.selectID = id;
        this.showID = id;
       
    }
    public getSelect():EquipmentItem{
        return this.mapList[this.selectID]
    }

    /**
     * 展示
     * @param index 
     */
    public showNext(stage){
        if(stage<1&&stage>4){
            Logger.warn('错误的等阶！');
            return;
        }
        //
        let size = Object.getOwnPropertyNames(this.list).length;
        this.showIndex++;
        if(this.showIndex>=size){
            this.showIndex = 0;
        }
        //
        let arr:Array<EquipmentItem> = this.findIndex(this.showIndex);
        if(!arr){
            return;
        }
        if(arr.length>0){
            let item:EquipmentItem = this.findIndexStage(stage,arr);
            if(item){
                this.showID = item.Id;
            }
            
        }
    }
    public showStage(stage){
        if(stage<1&&stage>4){
            Logger.warn('错误的等阶！');
            return;
        }
        //
        let arr:Array<EquipmentItem> = this.findIndex(this.showIndex);
        if(!arr){
            return;
        }
        if(arr.length>0){
            let item:EquipmentItem = this.findIndexStage(stage,arr);
            if(item){
                this.showID = item.Id;
            }
            
        }
    }
    public showBack(stage){
        if(stage<1&&stage>4){
            Logger.warn('错误的等阶！');
            return;
        }
        //
        let size = Object.getOwnPropertyNames(this.list).length;
        this.showIndex--;
        if(this.showIndex<0){
            this.showIndex = size-1;
        }
        //
        let arr:Array<EquipmentItem> = this.findIndex(this.showIndex);
        if(!arr){
            return;
        }
        if(arr.length>0){
            let item:EquipmentItem = this.findIndexStage(stage,arr);
            if(item){
                this.showID = item.Id;
            }
            
        }

    }
    public getShow():EquipmentItem{
        return this.mapList[this.showID]
    }
    // public getShowIndex():number{
    //     let is_str = this.showID.toString();
    //     return parseInt(is_str[2]);
    // }
    /**
     * 展示的最高阶
     */
    public getMaxStage():number{
        let arr:Array<EquipmentItem> = this.findIndex(this.showIndex);
        if(arr){
            this.maxStage = 1;
            for (let index = 0; index < arr.length; index++) {
                if(arr[index].Stage>=this.maxStage){
                    this.maxStage = arr[index].Stage;
                }
            }
        }
        return this.maxStage;
    }

    /**
     * 索引 查找当前索引的武器
     * @param idx 
     */
    private findIndex(idx:number):Array<EquipmentItem>{
        let arr:Array<EquipmentItem> = null;
        //查找
        let index = 0;
        for (const key in this.list) {
            if (!this.list.hasOwnProperty(key)) {
                continue;
            }
            if(idx==index){
                arr = this.list[key];
            }
            index++;
        }
        return arr;
    }
    /**
     * stage 查找当前等阶的武器
     * @param idx 
     */
    private findIndexStage(stage:number,arr:Array<EquipmentItem>):EquipmentItem{
        let item:EquipmentItem = null;
        for (let index = 0; index < arr.length; index++) {
            if(stage==arr[index].Stage){
                item = arr[index];
                break;
            }
        }
        return item;
    }
    /**
     * 
     * @param item 
     */
    private getIndex(item:EquipmentItem):number{
        let is_str = item.Id.toString();
        return parseInt(is_str[2]);
    }
    /**
     * 猜测id的规律 《*注意可能出错*》
     * 第二位装备类型，第三位装备序列，最后一位装备等阶
     */
    private guessId(index,stage):number{
        let id:number = 100000+this.type*10000+(index+1)*1000+(stage+1); 
        return id;
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