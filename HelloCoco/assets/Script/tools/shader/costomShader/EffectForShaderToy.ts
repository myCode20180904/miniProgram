import ShaderComponent from "../ShaderComponent";
import { ShaderType } from "../ShaderManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EffectForShaderToy extends ShaderComponent {
    
    @property({ type: cc.Enum(ShaderType),readonly:true, override:true })
    get shader() { return ShaderType.EffectForShaderToy; }
    set shader(type) {
        this._shader = type;
        this._applyShader();
    }

    // LIFE-CYCLE CALLBACKS:

    start() {

        this._applyShader();
        this.material.effect.setProperty('iResolution', cc.v2(this.material._texture.width, this.material._texture.height));
    }

    protected update(dt) {
        if (!this._material) return;
        this._setShaderColor();
        this._setShaderTime(dt);
        
    }
}

//shader lab
import ShaderLab, { MVP } from "../ShaderLab";
const renderer = cc.renderer.renderEngine.renderer;

ShaderLab['EffectForShaderToy'] = {//水波
    init:function(material){
        material.uniform('iResolution',renderer.PARAM_FLOAT2,cc.v2(material._texture.width, material._texture.height));
    },
    vert: MVP,
    frag:
    `
    uniform sampler2D texture;
    uniform vec2 iResolution;
    uniform float time;
    uniform lowp vec4 color;
    varying vec2 uv0;

    uniform vec2 resolution;

    #define time time+sin(gl_FragCoord.x/100.+sin(time+gl_FragCoord.y/700.)*3.)+cos(gl_FragCoord.y/100.+cos(time*0.7+gl_FragCoord.x/900.)*3.)
    void main()
    {
        vec2 position = ( gl_FragCoord.xy / resolution.xy*8.0 )*10.0;

        float color = 0.0;
        color += sin( position.x * time  + sin(time)*8.*cos(time*3.5)) * cos( position.y * 6.0  + sqrt(time)*4.*cos(time*1.75) );
        gl_FragColor = vec4( floor(vec3( color * 0.2, color * 0.3, color * 0.6 ) *16. ) / 8., 1.0 );
    }
    `
}
