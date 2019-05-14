import ShaderLab from "./ShaderLab";
import ShaderMaterial from "./ShaderMaterial";

export enum ShaderType {
    Default = 0,
    Gray,
    GrayScaling = 100,
    Stone,
    Ice,
    Frozen,
    Mirror,
    Poison,
    Banish,
    Vanish,
    Invisible,
    Blur,
    GaussBlur,
    Blur_Edge_Detail,
    Dissolve,
    Fluxay,
    FluxaySuper,
    Streamer,
    HighLight,
    Outline,
    OutGlow,
    InnerGlow,
    RainDot,
    Mosaic,
    MultiTexture,
    Pixel,
    Shutter,
    SimpleMovingGrass,
    UVMove,
    WateWave,
    Emboss,
    FlickOver,
    Rectangle,
    TurnPage,
    Transfer,
    SearchLight,
    LightRun,
    Glass,
    EffectForShaderToy
    
}

export default class ShaderManager {
    static useShader(rc: cc.RenderComponent, shader: ShaderType): ShaderMaterial {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            console.warn('Shader not surpport for canvas');
            return;
        }
        let texture = null;
        if (rc instanceof cc.Sprite) {
            texture = rc.spriteFrame.getTexture();
        } else if (rc instanceof dragonBones.ArmatureDisplay) {
            texture = rc.dragonAtlasAsset && rc.dragonAtlasAsset.texture;
        }else if (rc instanceof sp.Skeleton) {
           
        }
        
        if (!texture) {
            rc['disableRender']();
            return;
        }
        if (shader > ShaderType.Gray) {
            let name = ShaderType[shader];
            let lab = ShaderLab[name];
            if (!lab) {
                console.warn('Shader not defined', name);
                return;
            }
            let __rc = rc as any;
            let material = new ShaderMaterial(name, lab.vert, lab.frag, lab.defines || []);
            material.useColor = false;
            material.setTexture(texture);
            material.updateHash();
            
            if (rc instanceof cc.Sprite && __rc._renderData) {
                __rc._renderData.material = material;
            }
            // __rc._material = material;
            // __rc._state = shader;
            __rc.markForUpdateRenderData(true);
            __rc.markForRender(true);
            __rc._updateMaterial(material);
            if(lab['init']){
                lab['init'](material);
            }
            return material;
        }
        else {
            // texture.setState(<number>(shader));
        }
    }
}
