// import {THREE} from '../Libs/libcode'
// import { Logger } from '../tools/Logger';
// /**
//  * threebox
//  */
// const {ccclass, property} = cc._decorator;
// @ccclass
// export default class threebox  extends cc.Component{

//    private scene = null;
//    private camera = null;
//    private renderer = null;
//    private cube = null;
//    private textureRender = new cc.Texture2D();

//    onLoad(){
//       Logger.info('*******threebox onLoad*******');
//       this.createScene();
//    }




//    /**
//     * 创建场景
//     */
//    createScene(){
//       this.scene = new THREE.Scene();
//       this.camera = new THREE.PerspectiveCamera( 75, this.node.width / this.node.height, 0.1, 1000 );

//       this.renderer = new THREE.WebGLRenderer({alpha:true});
//       this.renderer.autoClear = true;
//       this.renderer.setSize( this.node.width, this.node.height );

//       //cube
//       var geometry = new THREE['BoxGeometry']( 1, 1, 1 );
//       var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
//       this.cube = new THREE.Mesh( geometry, material );
//       this.scene.add( this.cube );

//       this.camera.position.z = 2;
//       // this.camera.lookAt( 0, 0, 0 );
      
//       this.render();

//    }
   
//    render(){
//       if(this.cube){
//          this.cube.rotation.x += 0.01;
//          this.cube.rotation.y += 0.01;
//       }

      
//       this.renderer.render( this.scene, this.camera );
//       this.textureRender.initWithElement(this.renderer.domElement);
//       this.node.getComponent(cc.Sprite).spriteFrame.setTexture(this.textureRender);
//       this.renderer.clear();
      
//    }

//    update(){
//       this.render();
//    }
// }
