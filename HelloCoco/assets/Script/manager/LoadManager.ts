import { LoadHandel } from "../define/CommonParam";

/**
 * LoadManager  加载资源管理
 */
export class LoadManager {
  private static instance: LoadManager;
  public static get Instance(): LoadManager {
    if (this.instance == null) {
      this.instance = new LoadManager();
    }
    return this.instance;
  }



  /**
   * 加载资源
   */
  public loadResArr(res: Array<{url:string,type:typeof cc.Asset}>, handel: LoadHandel) {
    if (res.length <= 0) {
      return;
    }
    
    var uuids = [];
    for (var i = 0; i < res.length; i++) {
        var item = res[i];
        var assetType = item.type;
        var uuid = cc.loader['_getResUuid'](item.url, assetType);
        if (uuid) {
            uuids.push(uuid);
        }
        else {
          cc.loader['_urlNotFound'](item.url, assetType, handel.complete);
          return;
        }
    }
    cc.loader['_loadResUuids'](uuids, handel.process, handel.complete);
  }



}