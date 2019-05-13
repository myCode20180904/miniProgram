import { LoadHandel } from "../define/CommonParam";
import { Logger } from "../tools/Logger";

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
    //删减已加载项
    for (let i = 0; i < res.length; i++) {
      if(cc.loader.getRes(res[i].url,res[i].type)){
        res.splice(i,1);
        i--;
      }
      
    }

    //整理并加载
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