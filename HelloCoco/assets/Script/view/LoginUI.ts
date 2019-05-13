import BaseUI from "./BaseUI";

/**
 * LoginUI
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginUI extends BaseUI {

    constructor(skin:string){
        super(skin,[{url:'view/Login',type:cc.Prefab}]);

    }

    onLoadComplete(){
        super.onLoadComplete();

    }
}
