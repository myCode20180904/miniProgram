import { UIManager} from "../manager/UIManager";
import { LoadManager } from "../manager/LoadManager";
import { Logger } from "../Tool/Logger";
import { Monster } from "./Monster";
import { Player } from "./player";

var POOLMAX:number = 5;
/**
 * FighterFactor 战斗角色管理工厂
 */
export class FighterFactor {
	private static instance: FighterFactor;
	public static get Instance(): FighterFactor {
		if (this.instance == null) {
			this.instance = new FighterFactor();
		}
		return this.instance;
    }
    //怪物配置-字典
    private monsterConfig:{ [key: string]: any} = {};
    //怪物包-字典
    private monsterBag:{ [key: string]: any} = {};
    //战斗角色模板
    private fighterModel:cc.Node = null;
    //怪物回收池
    public fighterPool:cc.NodePool = new cc.NodePool();
    //怪物map
    public monsters:{ [key: string]: Monster} = {};
    public monster_count:number = 0;
    //
    public player:Player = null;

	public constructor() {
        this.initMonsterConfig();
        this.initMonsterBagConfig();
        this.init();
    }
    /**
     * 初始化
     */
    public init(){
        this.initFighterModel().then(()=>{
            this.initMonstersPool();
        });
    }
    //构建怪物对象池
    private initMonstersPool(){
        for (let index = 0; index < POOLMAX; index++) {
            let enemy = cc.instantiate(this.fighterModel); // 创建节点
            this.fighterPool.put(enemy)
        }
    }
    /**
     * 初始战斗角色模板
     */
    private async initFighterModel(): Promise<any>{
        var that= this;
        if(!this.fighterModel){
            //加载一个角色模板
            let async_prefab = await UIManager.Instance.loadPrefab('view/fighter/SpineItem').then(prefab=>{
                return prefab;
            }).catch(error=>{
                Logger.info(error)
            })
            //设置模板
            this.fighterModel = async_prefab;
        }

        return new Promise((resolve, reject) => {
            resolve();
        })
    }
    /**
     * 初始怪物配置信息 并存入字典
     */
    private initMonsterConfig(){
        let config = LoadManager.Instance.configs['monster'];
        if(!config){
            Logger.error("读取物配置信息失败");
            return;
        }
        //
        for (let index = 0; index < config.length; index++) {
            const element = config[index];
            this.monsterConfig[element.Id] = element;
        }
    }
    /**
     * 初始怪物包信息 并存入字典
     */
    private initMonsterBagConfig(){
        let config = LoadManager.Instance.configs['monsterbag'];
        if(!config){
            Logger.error("读取怪物包信息失败");
            return;
        }
        //
        for (let index = 0; index < config.length; index++) {
            const element = config[index];
            this.monsterBag[element.Id] = element;
        }
    }
    public clear(){
        this.fighterPool.clear(); // 调用这个方法就可以清空对象池
    }
    
    /**
     * 创建一个对象
     */
    private createObj():cc.Node{
        if(this.fighterPool.size()>0){
            return this.fighterPool.get();
        }
        return null;
    }

    /**
     * 
     */
    public createPlayer(parent:cc.Node):Player{
        let id = 1000;
        let config = this.monsterConfig[id]
        let _player:Player = new Player(config,this.createObj(),parent);
        this.player = _player;
        return _player;
    }

    /**
     * 创建monster
     * @param parent 
     */
    public createMonster(parent:cc.Node):Monster{
        let id = [1001,2001,3001,4001];
        let config = this.monsterConfig[id[Math.floor(Math.random()*4)]]
        let monster:Monster = new Monster(config,this.createObj(),parent);
        if(monster.fighterNode== null){
            monster = null;
            return null;
        }
        this.monster_count++;
        monster.countId = 1000+this.monster_count;
        this.monsters[monster.countId] = monster;
        return monster;
    }
    public removeMonster(count_id:number){
        // this.monsters[count_id].removeFromParent();
        this.fighterPool.put(this.monsters[count_id].fighterNode);
        delete this.monsters[count_id];
        this.monster_count--;
    }
	
}