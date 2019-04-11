import ShaderComponent from "../ShaderComponent";
import { ShaderType } from "../ShaderManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MultiTextureShader extends ShaderComponent {
    @property({type: cc.Texture2D})
    texture:cc.Texture2D = null;

    @property({ type: cc.Enum(ShaderType),readonly:true, override:true })
    get shader() { return ShaderType.MultiTexture; }
    set shader(type) {
        this._shader = type;
        this._applyShader();
    }
    // LIFE-CYCLE CALLBACKS:

    start() {

        this._applyShader();

        if(this.texture){
            this.setTexture(this.texture,true);
        }
    }

    setTexture(texture,force:boolean = false) {
        if (force||this.texture !== texture) {
            this.texture = texture;
            this._material._effect.setProperty('texture1', texture.getImpl());
            this._material._texIds['texture1'] = texture.getId();
        }
    }
    // update (dt) {}
}

//shader lab
import ShaderLab, { MVP } from "../ShaderLab";
const renderer = cc.renderer.renderEngine.renderer;

ShaderLab['MultiTexture'] = {//
    init:function(material){
        material._mainTech._parameters.push({
            name: 'texture1',
            type: renderer.PARAM_TEXTURE_2D
        });
    },
    vert: MVP,
    frag:
    `
    uniform sampler2D texture;
    uniform sampler2D texture1;
    varying mediump vec2 uv0;
    void main()
    {
        gl_FragColor = texture2D(texture, uv0) + texture2D(texture1, uv0);
    }
    `
}
