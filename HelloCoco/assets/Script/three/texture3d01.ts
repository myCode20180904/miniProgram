import { THREE } from "../mylibs/libcode";
import { Util } from "../tools/Util";

/**
 * three
 */
const {ccclass, property} = cc._decorator;
@ccclass
export default class texture3d01 extends cc.Component{

   onLoad(){
      this.initThree();

   }
   addControl(){
      this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
   }
   private removeControl(){
      this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
   }

   onDestroy(){
      this.removeControl();


      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.Earth = null;
      this.satellites = [];
      this.textureRender.destroy();
      this.spriteFrame.destroy();
   }

   onTouchMove(event:cc.Event.EventTouch){

      let delta= event.touch.getDelta();
   }

   private scene = null;
   private camera = null;
   private renderer = null;
   private Earth  = null;
   private satellites = [];//地球，卫星（数组）  
   private textureRender = new cc.Texture2D();
   private spriteFrame = new cc.SpriteFrame();
    /**
     * 创建场景
     */
    initThree(){
      this.scene = new THREE.Scene();
      var that = this;
      // Create renderer
      var canvas = document.createElement( 'canvas' );
      var context = canvas.getContext( 'webgl2' );

      // Create camera
      this.camera = new THREE.PerspectiveCamera(20,this.node.width/this.node.height, 1, 1000); 
      this.camera.position.set( 0, 0, 400 );//设置相机位置  

      this.renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( this.node.width, this.node.height );
      this.renderer.autoClear = true;
      document.body.appendChild( this.renderer.domElement );
      var sunTexture = THREE.ImageUtils.loadTexture(Util.getNativeUrl('three/img/world_map'), 0, function () {  
         // that.renderer.render(that.scene, that.camera);  
      });  
        

      //地球  
      this.Earth = new THREE.Mesh(new THREE.SphereGeometry(20, 30, 30), new THREE.MeshBasicMaterial({  
            map: sunTexture  
      })); //材质设定  

      var satellite = new THREE.Sprite(new THREE.SpriteMaterial({  
            map: new THREE['CanvasTexture'](this.generateSprite('196,233,255')),  
            blending: THREE.AdditiveBlending  
      }));  
      satellite.scale.x = satellite.scale.y = satellite.scale.z = 60;  
      this.scene.add(satellite);//添加发光,让地球有发光的样式  
      this.scene.add(this.Earth);  

      //添加卫星  
      this.satellites.push(this.initSatellite(5, 28, {x: -Math.PI * 0.35, y: Math.PI * 0.25, z: 0}, 0.021, this.scene));  
      this.satellites.push(this.initSatellite(5, 25, {x: -Math.PI * 0.35, y: -Math.PI * 0.2, z: 0}, 0.022, this.scene));  
      this.satellites.push(this.initSatellite(5, 29, {x: -Math.PI * 0.35, y: Math.PI * 0.05, z: 0}, 0.023, this.scene));  

    }
   
   /**  
     * 返回一个卫星和轨道的组合体  
     * @param satelliteSize 卫星的大小  
     * @param satelliteRadius 卫星的旋转半径  
     * @param rotation 组合体的x,y,z三个方向的旋转角度  
     * @param speed 卫星运动速度  
     * @param scene 场景  
     * @returns {{satellite: THREE.Mesh, speed: *}} 卫星组合对象;速度  
     */  
   initSatellite (satelliteSize, satelliteRadius, rotation, speed, scene) {  
  
      var track = new THREE.Mesh(new THREE['RingGeometry'](satelliteRadius, satelliteRadius + 0.05, 50, 1), new THREE.MeshBasicMaterial());  
      var centerMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 1, 1), new THREE.MeshLambertMaterial()); //材质设定  
      var satellite = new THREE.Sprite(new THREE.SpriteMaterial({
          map: new THREE['CanvasTexture'](this.generateSprite('196,233,255')),  
          blending: THREE.AdditiveBlending  
      }));  
      satellite.scale.x = satellite.scale.y = satellite.scale.z = satelliteSize;  
      satellite.position.set(satelliteRadius, 0, 0);  

      var pivotPoint = new THREE.Object3D();  
      pivotPoint.add(satellite);  
      pivotPoint.add(track);  
      centerMesh.add(pivotPoint);  
      centerMesh.rotation.set(rotation.x, rotation.y, rotation.z);  
      scene.add(centerMesh);  
      return {satellite: centerMesh, speed: speed};  
   }

   /**  
   * 实现发光星星  
   * @param color 颜色的r,g和b值,比如：“123,123,123”;  
   * @returns {Element} 返回canvas对象  
    */  
   generateSprite (color) {  
      var canvas = document.createElement('canvas');  
      canvas.width = 16;  
      canvas.height = 16;  
      var context = canvas.getContext('2d');  
      var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);  
      gradient.addColorStop(0, 'rgba(' + color + ',1)');  
      gradient.addColorStop(0.2, 'rgba(' + color + ',1)');  
      gradient.addColorStop(0.4, 'rgba(' + color + ',.6)');  
      gradient.addColorStop(1, 'rgba(0,0,0,0)');  
      context.fillStyle = gradient;  
      context.fillRect(0, 0, canvas.width, canvas.height);  
      return canvas;  
   } 
    
   render() {
      this.renderer.render( this.scene, this.camera );
      //
      this.Earth.rotation.y -= 0.01;  
      for (var i = 0; i < this.satellites.length; i++) {  
         this.satellites[i].satellite.rotation.z -= this.satellites[i].speed;  
      }  

      //
      this.textureRender.initWithElement(this.renderer.domElement);
      this.spriteFrame.setTexture(this.textureRender); 
      this.node.getComponent(cc.Sprite).spriteFrame = this.spriteFrame;
      this.renderer.clear();
   }

   update(dt){
      this.render();
   }

}
