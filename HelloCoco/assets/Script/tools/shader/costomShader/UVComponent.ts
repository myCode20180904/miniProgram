import ShaderComponent from "../ShaderComponent";
import { ShaderType } from "../ShaderManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UVComponent extends ShaderComponent {
    
    @property({ type: cc.Enum(ShaderType),readonly:true, override:true })
    get shader() { return ShaderType.UVMove; }
    set shader(type) {
        this._shader = type;
        this._applyShader();
    }

    @property({ type: cc.Vec2, visible: false })
    private _offset:cc.Vec2 = cc.v2(0.1, 0.0);
    @property({ type: cc.Vec2 })
    get offset() {return this._offset;}
    set offset(val) {
        this._offset.x = val.x;
        this._offset.y = val.y;
    }

    private _uvOffset:cc.Vec2 = cc.v2(0.0, 0.0);
    private _uvTiling:cc.Vec2 = cc.v2(1.0, 1.0);
    @property({ type: cc.Vec2 })
    get tiling() {return this._uvTiling;}
    set tiling(val) {
        this._uvTiling.x = val.x;
        this._uvTiling.y = val.y;
    }

    // LIFE-CYCLE CALLBACKS:

    start() {

        this._applyShader();

    }

    
    protected update(dt) {
        if (!this._material) return;
        this._setShaderColor();
        this._setShaderTime(dt);
        this._uvOffset = cc.v2(this._uvOffset.x + this.offset.x, this._uvOffset.y+ this.offset.y);
        this._material._effect.setProperty('u_offset', this._uvOffset);
        this._material._effect.setProperty('u_offset_tiling', this._uvTiling);
    }
}

//shader lab
import ShaderLab, { MVP } from "../ShaderLab";
const renderer = cc.renderer.renderEngine.renderer;

ShaderLab['UVMove'] = {//交替移动（适合背景跟随）
    init:function(material){
        material.uniform('u_offset',renderer.PARAM_FLOAT2,cc.Vec2.ZERO);
        material.uniform('u_offset_tiling',renderer.PARAM_FLOAT2,cc.Vec2.ONE);
    },
    vert: MVP,
    frag:
    `
    precision lowp float;
    uniform sampler2D texture;
    varying mediump vec2 uv0;
    uniform lowp vec4 color;
    uniform vec2 u_offset;
    uniform vec2 u_offset_tiling;
    void main()
    {
        vec2 uv = uv0;
        uv = uv * u_offset_tiling + u_offset;
        uv = fract(uv);
        gl_FragColor = color * texture2D(texture, uv);
    }
    `
}
