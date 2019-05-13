import BaseUI from "../view/BaseUI";
import LoadingUI from "../view/LoadingUI";

/**
 * 界面管理
 */
export class WindowCode {
	//主界面
	public static TYPE_MainUI:string = "MainUI";
	public static TYPE_TopUI:string = "TopUI";

}

/**
 * UIManager ui 预置资源管理
 */
export class UIManager {
	private static instance: UIManager;
	public static get Instance(): UIManager {
		if (this.instance == null) {
			this.instance = new UIManager();
		}
		return this.instance;
    }
    
    
    
    //
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