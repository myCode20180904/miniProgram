import { LoadingUI } from "../view/LoadingUI";

/**
 * 界面管理
 */
export class WindowCode {
	//主界面

}

/**
 * UIModels ui 预置资源管理
 */
export class UIModels {
	private static instance: UIModels;
	public static get Instance(): UIModels {
		if (this.instance == null) {
			this.instance = new UIModels();
		}
		return this.instance;
    }
    
    //加载
    private loading:LoadingUI = null;
    public showLoading(){
        if(this.loading){
            this.loading.show();
        }else{
            this.loading = new LoadingUI('view/Loading');
        }
    }

    public hideLoading(){
        this.loading.hide();
    }
    
    
}