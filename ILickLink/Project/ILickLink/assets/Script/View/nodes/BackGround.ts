
const {ccclass, property} = cc._decorator;

@ccclass
export default class BackGround extends cc.Component {

    @property(cc.Node)
    icon_item: cc.Node = null;

    @property
    speed: cc.Vec2 = cc.v2(0,0);
    @property
    maxSize: number = 20;
    @property
    col: number = 4;
    @property()
    one_width: number = 200;
    @property()
    one_height:number = 200;

    private icons:Array<cc.Node> = [];
    //回收池
    private iconPool:cc.NodePool = new cc.NodePool();
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initIconPool();
        this.playSlowFlow();
    }

    private initIconPool(){
        for (let index = 0; index < this.maxSize; index++) {
            let item = cc.instantiate(this.icon_item); // 创建节点
            this.iconPool.put(item)
        }
    }

    /**
     * 播放缓慢流动
     */
    playSlowFlow(){
        //clear
        for (let index = 0; index < this.icons.length; index++) {
            this.iconPool.put(this.icons[index]);
            this.icons.splice(index,1);
            index--;
        }
        //init
        for (let index = 0; index < this.maxSize; index++) {
            let x = -cc.winSize.width/2+(index%this.col)*this.one_width;
            let y = -cc.winSize.height/2+Math.floor(index/this.col)*this.one_height;
            this.createIcon(cc.v2(x,y));
        }
    }

    private createIcon(pos:cc.Vec2){
        if(this.iconPool.size()>0){
            let item:cc.Node = this.iconPool.get();
            this.node.addChild(item);
            item.setPosition(pos);
            item.active = true;
            this.icons.push(item)
        }else{

        }
    }

    update (dt) {
        for (let index = 0; index < this.icons.length; index++) {
            let item = this.icons[index]
            item.x-=dt*this.speed.x;
            item.y-=dt*this.speed.y;
            if(item.x<-cc.winSize.width/2-this.one_width/2){
                item.x = -cc.winSize.width/2+(this.col-0.5)*this.one_width;
            }
            if(item.y<-cc.winSize.height/2-this.one_height/2){
                item.y = -cc.winSize.height/2+(Math.floor(this.maxSize/this.col)-0.5)*this.one_height;
            }
        }
    }
}
