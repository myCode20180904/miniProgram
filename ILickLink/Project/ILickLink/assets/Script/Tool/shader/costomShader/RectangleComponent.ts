import ShaderComponent from "../ShaderComponent";
import { ShaderType } from "../ShaderManager";

const { ccclass, property } = cc._decorator;
/**
 * 圆角矩形
 */
@ccclass
export default class RectangleComponent extends ShaderComponent {
    @property({ type: cc.Texture2D })
    texture: cc.Texture2D = null;

    @property({ type: cc.Enum(ShaderType), readonly: true, override:true })
    get shader() { return ShaderType.Rectangle; }
    set shader(type) {
        this._shader = type;
        this._applyShader();
    }

    @property({ type: 'Float', visible: false })
    private _radius:number = 0.1;
    @property({ type: 'Float' })
    get radius() {return this._radius;}
    set radius(val) {
        this._radius = val;
        this._material.effect.setProperty('radius', this.radius);
    }
    @property()
    private BatchRender:boolean = true;
    constructor(){
        super();
        if (false == this.BatchRender) {
            this.name = 'rounded-rectangle' + Math.random().toFixed(6);
        }
    }
    // LIFE-CYCLE CALLBACKS:
    start() {
        this._applyShader();

        this._material.effect.setProperty('w_divide_h', this.node.width / this.node.height);
        this._material.effect.setProperty('radius', this.radius);

    }

    
    
}

//
import ShaderLab, { MVP } from "../ShaderLab";
const renderer = cc.renderer.renderEngine.renderer;
ShaderLab['Rectangle'] = {//圆角矩形
    init:function(material){
        material.uniform('radius',renderer.PARAM_FLOAT,0.1);
        material.uniform('w_divide_h',renderer.PARAM_FLOAT,1.0);
    },
    vert: MVP,
    frag:
    `
    uniform sampler2D texture;
    uniform lowp vec4 color;
    uniform float radius;
    uniform float w_divide_h;
    varying vec2 uv0;
    void main() {
        vec4 c = color * texture2D(texture, uv0);
        vec2 uv = uv0 - vec2(0.5, 0.5);
        float u,v;
        if (w_divide_h >= 1.0) {
            uv *= vec2(w_divide_h, 1.0);
            u = 0.5 * w_divide_h - radius;
            v = 0.5 - radius;
        }else {
            uv *= vec2(1.0, 1.0 / w_divide_h);
            u = 0.5 - radius;
            v = 0.5 / w_divide_h - radius;
        }
        float ax = step(u, abs(uv.x));
        float ay = step(v, abs(uv.y));
        float al = 0.0;
        if (abs(uv.x) >= u && abs(uv.y) >= v) {
            float rx = abs(uv.x) - u;
            float ry = abs(uv.y) - v;
            float len = length(vec2(rx, ry));
            al = step(radius, len);
            float delta = len - radius;
            if (len > radius && delta < 0.005) {
                al = smoothstep(0.0, 0.01, delta);
            }
        }
        float alpha = 1.0 - ax * ay * al;
        gl_FragColor = vec4(c.r, c.g, c.b, c.a * alpha);
    }
    `
}