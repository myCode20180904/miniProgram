import { Logger } from "../tools/Logger";
import { LoadManager } from "../manager/LoadManager";
import { LoadHandel } from "../define/CommonParam";

/**
 * BaseUI
 */

export default class BaseUI extends cc.Component {
    private skin:string = '';
    private complete_call:Function = null;
    private isClose:boolean = false;
    constructor(skin, res?: Array<{ url: string, type: typeof cc.Asset }>) {
        super();
        this.name = this['__classname__'];
        if(skin){
            this.skin = skin;
            res.push({ url: skin, type:cc.Prefab});
        }

        Logger.info(this.name+'  constructor：', this);

        if (res.length > 0) {
            var that = this;
            LoadManager.Instance.loadResArr(res, new LoadHandel(
                function (completedCount: number, totalCount: number, item: any) {
                    that.onLoadProcess(completedCount, totalCount);
                },
                function (error: Error, resource: any) {
                    if (error) {
                        Logger.error(error);
                        return;
                    }
                    //
                    that.onLoadComplete()
                }
            ));
        } else {
            this.onLoadComplete()
        }
        
    }

    call(call:Function){
        this.complete_call = call;
    }

    onLoadProcess(completedCount: number, totalCount: number) {
        // Logger.info('onLoadProcess:', this.name, completedCount / totalCount);
    }

    onLoadComplete() {
        Logger.info('onLoadComplete:', this.name);
        if (!cc.loader.getRes(this.skin, cc.Prefab)) {
            Logger.warn('not find prefab ' + this.name);
            return;
        }
        /**
         * 绑定节点
         */
        this.node = cc.instantiate(cc.loader.getRes(this.skin, cc.Prefab));
        cc.find('Canvas').addChild(this.node);
        this.node['_components'].push(this);
        /**
         * 激活组件
         */
        cc.director['_nodeActivator'].activateComp(this);

        this.complete_call&&this.complete_call();
    }

    close(){
        this.isClose = true;
    }

    onClose(){
        Logger.info(this.name+'  onClose:');
    }

    onLoad() {
        Logger.info(this.name+'  onLoad:');
    }

    onEnable() {
        Logger.info(this.name+'  onEnable:');
    }

    start() {
        Logger.info(this.name+'  start:');
    }

    update(dt: number) {
        if(this.isClose){
            this.onClose();
            this.node.destroy();
            this.destroy();
        }
    }

    lateUpdate() {
    }

    onDisable() {
        Logger.info(this.name+'  onDisable:');
    }

    onDestroy() {
        Logger.info(this.name+'  onDestroy:');
        this.skin = '';
        this.complete_call = null;
    }

}
