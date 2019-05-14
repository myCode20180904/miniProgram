import ShaderManager, { ShaderType } from "./ShaderManager";
import ShaderMaterial from "./ShaderMaterial";
const { ccclass, property, executeInEditMode } = cc._decorator;

const NeedUpdate = [ShaderType.Fluxay, ShaderType.FluxaySuper, ShaderType.Streamer, ShaderType.HighLight
    ,ShaderType.Shutter,ShaderType.SimpleMovingGrass,ShaderType.Dissolve,ShaderType.UVMove,ShaderType.WateWave,
    ShaderType.Transfer,ShaderType.LightRun];

@ccclass
@executeInEditMode
// @requireComponent(cc.Sprite)
export default class ShaderComponent extends cc.Component {

    @property({ type: cc.Enum(ShaderType), visible: false })
    protected _shader: ShaderType = ShaderType.Default;

    @property({ type: cc.Enum(ShaderType) })
    get shader() { return this._shader; }
    set shader(type) {
        this._shader = type;
        this._applyShader();
    }

    private _color = cc.color();
    private _pos = new cc.Vec3(0, 0, 0);
    private _start = 0;
    protected _material: ShaderMaterial;
    get material() { return this._material; }
    onEnable(){
        let rc = this.getComponent(cc.RenderComponent);
        if (rc instanceof cc.Sprite) {
            rc.setState(0);
        }
        /**
         * 开启会使得不是图集的texture被合到一起, 导致在native中shader不起作用, web中默认为false, native中默认为true
         * 如果texture被打包成atlas就没事
         * 查看creator的代码, (!spriteframe._original && dynamicAtlasManager) 会被 dynamicAtlasManager.insertSpriteFrame
         * 如果需要单独控制自行实现
         */
        cc.dynamicAtlasManager.enabled = false;
    }
    protected start() {
        this._applyShader();
    }
    protected update(dt) {
        if (!this._material) return;
        this._setShaderColor();
        this._setShaderTime(dt);
    }
    

    protected _applyShader() {
        console.info('_applyShader',this.shader);
        let shader = this.shader;

        let rc = this.getComponent(cc.RenderComponent);
        let material = ShaderManager.useShader(rc, shader);
        this._material = material;
        this._start = 0;
        let clr = this._color;
        clr.setR(255), clr.setG(255), clr.setB(255), clr.setA(255);
        if (!material) return;
        switch (shader) {
            case ShaderType.Blur:
            case ShaderType.GaussBlur:
                material.setNum(0.02); //0-0.1
                break;
            default:
                break;
        }
        this._setShaderColor();
        // this._setShaderPos();
    }

    protected _setShaderColor() {
        let node = this.node;
        let c0 = node.color;
        let c1 = this._color;
        let r = c0.getR(), g = c0.getG(), b = c0.getB(), a = node.opacity;
        let f = !1;
        if (c1.getR() !== r) { c1.setR(r); f = !0; }
        if (c1.getG() !== g) { c1.setG(g); f = !0; }
        if (c1.getB() !== b) { c1.setB(b); f = !0; }
        if (c1.getA() !== a) { c1.setA(a); f = !0; }
        f && this._material.setColor(r / 255, g / 255, b / 255, a / 255);
    }

    protected _setShaderPos() {
        let node = this.node;
        let x = node.getPosition().x;
        let y = node.getPosition().y;
        let z = 0;
        // let x = 300;
        // let y = 400;
        // let z = 300;
        let f = !1;
        if (x !== this._pos.x) { this._pos.x = x; f = !0; }
        if (y !== this._pos.y) { this._pos.y = y; f = !0; }
        if (z !== this._pos.z) { this._pos.z = z; f = !0; }
        f && this._material.setPos(x, y, z);
    }

    protected _setShaderTime(dt) {
        if (NeedUpdate.indexOf(this.shader) >= 0) {
            let start = this._start;
            if (start > 65535) start = 0;
            start += dt;
            this._material.setTime(start);
            this._start = start;
        }
    }
}
