
// 初始化
class InitSdkHandel{
    public success:Function = null;
    public fail:Function = null;
    public constructor(success?:Function,fail?:Function) {
       this.success = success;
       this.fail = fail;
    }
}

/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {

    initSdk(handel:InitSdkHandel): Promise<any>;
    getUserInfo(): Promise<any>;
    login(): Promise<any>;
    setLoadingProgress(process:number): Promise<any>;

}

class DebugPlatform implements Platform {
    async initSdk(handel:InitSdkHandel) { }

    async getUserInfo() {
        return { nickName: "username" }
    }
    async login() { }

    async setLoadingProgress(process:number) { 
        // console.info(process);
    }
}


if (!window.platform) {
    // window.platform = new DebugPlatform();
    window.platform = new FaceBookPlatform();
}



declare let platform: Platform;

declare interface Window {

    platform: Platform
}





