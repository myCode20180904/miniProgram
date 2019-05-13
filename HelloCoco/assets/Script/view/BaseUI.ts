import { Logger } from "../tools/Logger";
import { LoadManager } from "../manager/LoadManager";
import { LoadHandel } from "../define/CommonParam";

/**
 * BaseUI
 */

export default class BaseUI extends cc.Component {
    public skin:string = '';
    constructor(skin, res?: Array<{ url: string, type: typeof cc.Asset }>) {
        super();
        this.name = this['__classname__'];
        this.skin = skin;
        Logger.info('constructor', this);

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

    onLoadProcess(completedCount: number, totalCount: number) {
        // Logger.info('onLoadProcess:', this.name, completedCount / totalCount);
    }

    onLoadComplete() {
        Logger.info('onLoadComplete:', this.name);
        if (!cc.loader.getRes(this.skin, cc.Prefab)) {
            Logger.warn('not find prefab ' + this.name);
            return;
        }
        this.node = cc.instantiate(cc.loader.getRes(this.skin, cc.Prefab));
        cc.find('Canvas').addChild(this.node);
    }

    onEnable() {
        Logger.info('onEnable:', this.name);
    }

    onLoad() {
        Logger.info('onLoad:', this.name);
    }

    start() {
        Logger.info('start:', this.name);
    }

    update(dt: number) {
        Logger.info('update:', this.name);
    }

    lateUpdate() {
        Logger.info('lateUpdate:', this.name);
    }

    onDisable() {
        Logger.info('onDisable:', this.name);
    }

    onDestroy() {
        Logger.info('onDestroy:', this.name);
    }

}
