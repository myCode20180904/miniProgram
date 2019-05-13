import ShaderComponent from "../ShaderComponent";
import { ShaderType } from "../ShaderManager";

const {ccclass, property} = cc._decorator;
/**
 * 战争迷雾
 */
@ccclass
export default class SearchLightComponent extends ShaderComponent {
    
    @property({ type: cc.Enum(ShaderType),readonly:true, override:true })
    get shader() { return ShaderType.SearchLight; }
    set shader(type) {
        this._shader = type;
        this._applyShader();
    }

    iResolution:cc.Vec2 = cc.v2(0.0,0.0);
    mouse:cc.Vec2 = cc.v2(0.0,0.0);
    // LIFE-CYCLE CALLBACKS:
    init() {
        this.iResolution.x = ( this.node.getContentSize().width );
        this.iResolution.y = (this.node.getContentSize().height);
        this.mouse.x = 50.;
        this.mouse.y = 40.;
        let self = this;
        // 添加触摸事件包含鼠标事件
        this.node.on(cc.Node.EventType.TOUCH_START, function (event: cc.Event.EventTouch) {
            // 转化为node的局部坐标
            let touchPos = self.node.convertToNodeSpaceAR(event.touch.getLocation());
            self.mouse.x = touchPos.x;
            self.mouse.y = touchPos.y;
            self.updateRander();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event:cc.Event.EventTouch) {
            let touchPos = self.node.convertToNodeSpaceAR(event.touch.getLocation());
            self.mouse.x = touchPos.x;
            self.mouse.y = touchPos.y;
            self.updateRander();
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            // cc.log('touch end');
        }, this);


    }


    start() {

        this._applyShader();

        this.init();
        this.updateRander();
    }


    updateRander() {
        // console.info(this.iResolution,this.mouse);
        if (!this._material) return;
        this._setShaderColor();

        this.material.effect.setProperty('iiResolution', cc.v2(this.iResolution.x, this.iResolution.y));
        this.material.effect.setProperty('mouse', cc.v2(this.mouse.x, this.mouse.y));
    }
    
}

//ShaderLab
import ShaderLab, { MVP } from "../ShaderLab";
const renderer = cc.renderer.renderEngine.renderer;

ShaderLab['SearchLight'] = {//战争迷雾
    init:function(material){
        material.uniform('iResolution',renderer.PARAM_FLOAT2,cc.v2(0, 0));
        material.uniform('mouse',renderer.PARAM_FLOAT2,cc.v2(0, 0));
    },
    vert: MVP,
    frag:
    `
    #ifdef GL_ES
    precision mediump float;
    #endif
    uniform sampler2D texture;
    uniform vec2 iResolution;
    uniform vec2 mouse;
    varying vec2 uv0;

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        // y坐标翻转
        vec2 imouse = vec2(mouse.x, iResolution.y - mouse.y);
        // 纹理坐标
        vec2 uv = uv0.xy ;
        // 纹理采样
        vec4 tex = texture2D(texture, uv);
        // 片元到鼠标点的差向量
        vec2 d = uv*iResolution.xy -imouse.xy ;
        // 光照半径
        vec2 s = 0.15 * iResolution.xy;
        // 点积取比例
        float r = dot(d, d)/dot(s,s);
        fragColor =  tex * (1.08 - r);   
    }
    void main()
    {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
    `
}
