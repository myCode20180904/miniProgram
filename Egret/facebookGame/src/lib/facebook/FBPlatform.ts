
class FaceBookPlatform  implements Platform {

	async initSdk(callBack:InitSdkHandel){
		if (typeof FBInstant === 'undefined')
		return;

		this.initializeAsync();

		FBInstant.startGameAsync().then(() => {
          	 callBack.success();
		}).catch((reason) => {
           	 callBack.fail(reason);
		});
	}

	async setLoadingProgress(progress){
		if (typeof FBInstant === 'undefined')
		return;
		// console.log("FBInstant setLoadingProgress ：",progress*100);
		FBInstant.setLoadingProgress(progress*100);
	}

	async getUserInfo() {
        return { nickName: "username" }
    }
    async login() { }

	private initializeAsync(): void {
		if (typeof FBInstant === 'undefined') 
		return;

		console.info("FBInstant:",FBInstant);
        FBInstant.initializeAsync().then(function () {
            console.log("getLocale:", FBInstant.getLocale());
            console.log("getPlatform:", FBInstant.getPlatform());
            console.log("getSDKVersion", FBInstant.getSDKVersion());
            console.log("getSupportedAPIs", FBInstant.getSupportedAPIs());
            console.log("getEntryPointData", FBInstant.getEntryPointData());
        }).catch((reason) => {
           	 console.info(reason);
		});
       
    }
}

 