import { Logger } from "../Tool/Logger";
import { Util } from "../Define/Util";

/**
 * three
 */
const {ccclass, property} = cc._decorator;
@ccclass
export default class texture3d extends cc.Component{

    onLoad(){
        this.initThree();

        this.addControl();
    }
    addControl(){
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }
    private removeControl(){
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }
    onDestroy(){
        this.removeControl();
    }

    onTouchMove(event:cc.Event.EventTouch){

        let delta= event.touch.getDelta();
    //    console.info(delta);
    //     this.node.rotationX+=delta.x;
    //     this.node.rotationY+=delta.y;
        this.roate(delta);
    }

    private scene = null;
    private camera = null;
    private mesh = null;
    private container = null;
    private renderer = null;
    private controls = null;
    private material = null;
    private volconfig = null;
    private cmtextures = null;
    /**
     * 创建场景
     */
    initThree(){
        this.scene = new window['THREE'].Scene();
        var that = this;
        // Create renderer
        var canvas = document.createElement( 'canvas' );
        var context = canvas.getContext( 'webgl2' );
        this.renderer = new window['THREE'].WebGLRenderer( { canvas: canvas, context: context } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( this.node.width, this.node.height );
        document.body.appendChild( this.renderer.domElement );

        // Create camera (The volume renderer does not work very well with perspective yet)
        var h = 512; // frustum height
        var aspect = this.node.width / this.node.height;
        this.camera = new window['THREE'].OrthographicCamera( - h * aspect / 2, h * aspect / 2, h / 2, - h / 2, 1, 1000 );
        this.camera.position.set( 0, 0, 128 );
        this.camera.up.set( 0, 0, 1 ); // In our data, z is up

        // Create controls
        this.controls = new window['THREE']['OrbitControls']( this.camera, this.renderer.domElement );
        this.controls.addEventListener( 'change', function(){
            that.render();
        } );
        this.controls.target.set( 64, 64, 128 );
        this.controls.minZoom = 0.5;
        this.controls.maxZoom = 4;
        this.controls.update();

        // scene.add( new window['THREE'].AxesHelper( 128 ) );

        // Lighting is baked into the shader a.t.m.
        // var dirLight = new window['THREE'].DirectionalLight( 0xffffff );

        // The gui for interaction
        this.volconfig = { clim1: 0, clim2: 1, renderstyle: 'iso', isothreshold: 0.15, colormap: 'viridis' };
        var gui = new window['dat'].GUI();
        gui.add( this.volconfig, 'clim1', 0, 1, 0.01 ).onChange( function(){that.updateUniforms}  );
        gui.add( this.volconfig, 'clim2', 0, 1, 0.01 ).onChange( function(){that.updateUniforms} );
        gui.add( this.volconfig, 'colormap', { gray: 'gray', viridis: 'viridis' } ).onChange( function(){that.updateUniforms} );
        gui.add( this.volconfig, 'renderstyle', { mip: 'mip', iso: 'iso' } ).onChange( function(){that.updateUniforms} );
        gui.add( this.volconfig, 'isothreshold', 0, 1, 0.01 ).onChange( function(){that.updateUniforms} );

        // Load the data ...
        
        new window['THREE']['NRRDLoader']().load(Util.getNativeUrl('three/models/nrrd/stent'), function ( volume ) {

            // Texture to hold the volume. We have scalars, so we put our data in the red channel.
            // THREEJS will select R32F (33326) based on the RedFormat and FloatType.
            // Also see https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
            // TODO: look the dtype up in the volume metadata
            var texture = new window['THREE']['DataTexture3D']( volume.data, volume.xLength, volume.yLength, volume.zLength );
            texture.format = window['THREE']['RedFormat'];
            texture.type = window['THREE'].FloatType;
            texture.minFilter = texture.magFilter = window['THREE'].LinearFilter;
            texture.unpackAlignment = 1;
            texture.needsUpdate = true;

            // Colormap textures
            that.cmtextures = {
                viridis: new window['THREE'].TextureLoader().load( Util.getNativeUrl('three/models/cm_viridis'), function(){that.render()} ),
                gray: new window['THREE'].TextureLoader().load( Util.getNativeUrl('three/models/cm_gray'), function(){that.render()} )
            };

            // Material
            var shader = window['THREE']['VolumeRenderShader1'];

            var uniforms = window['THREE'].UniformsUtils.clone( shader.uniforms );

            uniforms[ "u_data" ].value = texture;
            uniforms[ "u_size" ].value.set( volume.xLength, volume.yLength, volume.zLength );
            uniforms[ "u_clim" ].value.set( that.volconfig.clim1, that.volconfig.clim2 );
            uniforms[ "u_renderstyle" ].value = that.volconfig.renderstyle == 'mip' ? 0 : 1; // 0: MIP, 1: ISO
            uniforms[ "u_renderthreshold" ].value = that.volconfig.isothreshold; // For ISO renderstyle
            uniforms[ "u_cmdata" ].value = that.cmtextures[ that.volconfig.colormap ];

            that.material = new window['THREE'].ShaderMaterial( {
                uniforms: uniforms,
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader,
                side: window['THREE']['BackSide'] // The volume shader uses the backface as its "reference point"
            } );

            // Mesh
            var geometry = new window['THREE']['BoxBufferGeometry']( volume.xLength, volume.yLength, volume.zLength );
            geometry.translate( volume.xLength / 2 - 0.5, volume.yLength / 2 - 0.5, volume.zLength / 2 - 0.5 );

            that.mesh = new window['THREE'].Mesh( geometry, that.material );
            that.scene.add( that.mesh );
            
            that.render();

        } );

        window.addEventListener( 'resize', function(){that.onWindowResize()}, false );


        

    }
   
   updateUniforms() {

        this.material.uniforms[ "u_clim" ].value.set( this.volconfig.clim1, this.volconfig.clim2 );
        this.material.uniforms[ "u_renderstyle" ].value = this.volconfig.renderstyle == 'mip' ? 0 : 1; // 0: MIP, 1: ISO
        this.material.uniforms[ "u_renderthreshold" ].value = this.volconfig.isothreshold; // For ISO renderstyle
        this.material.uniforms[ "u_cmdata" ].value = this.cmtextures[ this.volconfig.colormap ];

        this.render();

    }

    onWindowResize() {

        this.renderer.setSize( this.node.width, this.node.height );

        var aspect = this.node.width / this.node.height;

        var frustumHeight = this.camera.top - this.camera.bottom;

        this.camera.left = - frustumHeight * aspect / 2;
        this.camera.right = frustumHeight * aspect / 2;

        this.camera.updateProjectionMatrix();

        this.render();

    }

    render() {
        this.renderer.render( this.scene, this.camera );
        
        let texture = new cc.Texture2D();
        texture.initWithElement(this.renderer.domElement);
        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);

        this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      
    }

    roate(rota:cc.Vec2){
        this.mesh.rotation.y -= rota.y/100; 
        this.mesh.rotation.x += rota.x/100; 
        this.mesh.rotation.z += rota.x/100; 
        this.render();
    }
}
