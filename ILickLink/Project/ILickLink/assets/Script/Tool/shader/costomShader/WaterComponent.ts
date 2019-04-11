import ShaderComponent from "../ShaderComponent";
import { ShaderType } from "../ShaderManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WaterComponent extends ShaderComponent {
    
    @property({ type: cc.Enum(ShaderType),readonly:true, override:true })
    get shader() { return ShaderType.WateWave; }
    set shader(type) {
        this._shader = type;
        this._applyShader();
    }

    // LIFE-CYCLE CALLBACKS:

    start() {

        this._applyShader();
        this.material.effect.setProperty('iResolution', cc.v2(this.material._texture.width, this.material._texture.height));
    }

}

//shader lab
import ShaderLab, { MVP } from "../ShaderLab";
const renderer = cc.renderer.renderEngine.renderer;

ShaderLab['WateWave'] = {//水波
    init:function(material){
        material.uniform('iResolution',renderer.PARAM_FLOAT2,cc.v2(10, 10));
    },
    vert: MVP,
    frag:
    `
    uniform sampler2D texture;
    uniform vec2 iResolution;
    uniform float time;
    uniform lowp vec4 color;
    varying vec2 uv0;
    #define F cos(x-y)*cos(y),sin(x+y)*sin(y)
    vec2 s(vec2 p)
    {
        float d=time*0.2,x=8.*(p.x+d),y=8.*(p.y+d);
        return vec2(F);
    }
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        // 换成resolution
        vec2 rs = iResolution.xy;
        // 换成纹理坐标v_texCoord.xy
        vec2 uv = fragCoord;
        vec2 q = uv+2./iResolution.x*(s(uv)-s(uv+rs));
        //反转y
        //q.y=1.-q.y;
        fragColor = color * texture2D(texture, q);
    }
    void main()
    {
        mainImage(gl_FragColor, uv0.xy);
    }
    `
}
