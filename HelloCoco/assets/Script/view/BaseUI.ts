import { Logger } from "../tools/Logger";
import { LoadManager } from "../manager/LoadManager";
import { LoadHandel } from "../define/CommonParam";
import ShaderComponent from "../tools/shader/ShaderComponent";
import { ShaderType } from "../tools/shader/ShaderManager";
import { UIManager } from "../manager/UIManager";

/**
 * BaseUI
 */

export default class BaseUI extends cc.Component {
    private skin:string = '';
    private complete_call:Function = null;
    private isClose:boolean = false;
    constructor(skin, res?: Array<{ url: string, type: typeof cc.Asset }>) {
        super();
        this.name = this['constructor']['name'];
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
         /**
         * 注册到UIManager
         */
        UIManager.Instance.regUI(this.name,this.node.uuid);
        /**
         * 进入动画
         */
        this.playEnterAnim();
    }

    close(){
        this.isClose = true;
        /**
         * 移除注册UIManager
         */
        UIManager.Instance.unRegUI(this.name,this.node.uuid);
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

    private updateFrame:number = 0;
    private frameDt:number = 0;
    update(dt: number) {
        if(this.isClose){
            this.onClose();
            this.node.destroy();
            this.destroy();
        }

        //修正更新
        this.updateFrame++;
        this.frameDt+=dt;
        if(this.updateFrame%2==0){
            this.fixedUpdate(this.frameDt)
            this.frameDt = 0;
        }
        if(this.updateFrame>Number.MAX_VALUE){
            this.updateFrame = 0;
        }
    }

    fixedUpdate(dt){
        
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

        this.clearBlurBg();
    }

    /**
     * 播放进入动画
     */
    playEnterAnim(){
        if(this.node.getComponent(cc.Animation)){
            let name = this.node.getComponent(cc.Animation).defaultClip.name
            this.node.getComponent(cc.Animation).play(name,0);
        }
    }

    //==============================高斯模糊的处理================================== 
    clearBlurBg(){
        if(this.cameraNode){
            this.cutCamera.targetTexture.destroy();
            this.cutCamera.destroy();
            this.cameraNode.removeFromParent();
            this.cameraNode.destroy();
        }
        this.cameraNode = null;
    }
    /**
     * 设置背景  高斯模糊
     */
    blurBg(node:cc.Node){
        this.initCameraCut();
        node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.cutCamera.targetTexture);
        node.active = true;
        node.scaleY = -1;
        if(node.getComponent(ShaderComponent)){
            node.getComponent(ShaderComponent).shader = ShaderType.Blur_Edge_Detail;
        }
    }
    private cameraNode:cc.Node = null;
    private cutCamera:cc.Camera;
    /**
     * 截图
     * @param node 
     * @param mask 
     */
	private initCameraCut(){
        this.clearBlurBg();
        this.cameraNode = new cc.Node();
        this.cameraNode.parent = cc.find('Canvas');

        this.cutCamera = this.cameraNode.addComponent(cc.Camera);
        // 设置你想要的截图内容的 cullingMask
        this.cutCamera.cullingMask = 0xffffffff;
        this.cutCamera.clearFlags = 0;

        // 新建一个 RenderTexture，并且设置 camera 的 targetTexture 为新建的 RenderTexture，这样 camera 的内容将会渲染到新建的 RenderTexture 中。
        let texture = new cc.RenderTexture();
        let gl = cc.game['_renderContext'];
        // 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
        texture.initWithSize(cc.winSize.width, cc.winSize.height, gl.STENCIL_INDEX8);
        this.cutCamera.targetTexture = texture;

        // this.cutCamera.render(this.cameraNode);
        
    }
    //================================================================
     /**
     * 给按钮添加事件
     */
    addButtonEvent(target:cc.Node,fun_name:string,data:any){
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = this.name;//这个是代码文件名
        clickEventHandler.handler = fun_name;
        clickEventHandler.customEventData = data;
        target.getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

}
