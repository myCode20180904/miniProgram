import ShaderComponent from "../ShaderComponent";
import { ShaderType } from "../ShaderManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DissolveComponent extends ShaderComponent {
    @property({ type: cc.Texture2D })
    texture: cc.Texture2D = null;

    @property({ type: cc.Enum(ShaderType), readonly: true, override:true })
    get shader() { return ShaderType.Dissolve; }
    set shader(type) {
        this._shader = type;
        this._applyShader();
    }
    private range:number = 0;
    private forward: boolean = true;
    // LIFE-CYCLE CALLBACKS:

    start() {

        this._applyShader();

        if (this.texture) {
            this.setTexture(this.texture, true);
        }
    }

    setTexture(texture, force: boolean = false) {
        if (force || this.texture !== texture) {
            this.texture = texture;
            this._material._effect.setProperty('texture1', texture.getImpl());
            this._material._texIds['texture1'] = texture.getId();
        }

        this._material.effect.setProperty('range', this.range);
    }
    protected update(dt) {
        if (!this._material) return;
        this._setShaderColor();
        this._setShaderTime(dt);
        //
        if (this.forward) {
            this.range += 0.005;
            if (this.range >= 1.0) {
                this.forward = false;
            }
        }else {
            this.range -= 0.005;
            if (this.range <= 0.0) {
                this.forward = true;
            }
        }
        this._material.effect.setProperty('range', this.range);

    }
}

//shader lab
import ShaderLab, { MVP } from "../ShaderLab";
const renderer = cc.renderer.renderEngine.renderer;

ShaderLab['Dissolve'] = {
    init:function(material){
        material._mainTech._parameters.push({
            name: 'texture1',
            type: renderer.PARAM_TEXTURE_2D
        });

        material.uniform('range',renderer.PARAM_FLOAT,0);
    },
    vert: MVP,
    frag: 
    `
    #ifdef GL_ES
    precision lowp float;
    #endif
    uniform sampler2D texture;
    uniform sampler2D texture1;
    varying mediump vec2 uv0;
    uniform float range;

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec4 noise = texture2D(texture1, fragCoord);
        float height = (noise.r + noise.g + noise.b) / 3.0;
        vec4 color = texture2D(texture, fragCoord);
        
        if (range > height) {
            // discard;
            fragColor = vec4(0);
        }else {
            if (range + 0.05 > height) {
                color = vec4(0.9, 0.6, 0.3, color.a);
            }
            fragColor = color;
        }
    }

    void main() {
        mainImage(gl_FragColor, uv0);
    }
    `
}
