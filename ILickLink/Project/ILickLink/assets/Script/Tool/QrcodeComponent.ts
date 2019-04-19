
// /// <reference path="../Libs/libcode.d.ts" />

import {_libcode,QRCode} from '../Libs/libcode'
import { Logger } from "./Logger";
/**
 * 二维码组件
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class QrcodeComponent extends cc.Component {
    @property({ visible: false })
    protected _text: string = 'http://www.cocos.com/';

    @property()
    get text() { return this._text; }
    set text(value) {
        this._text = value;
        this._applyText();
    }


    private qrcode:any = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.updateQrCode();
    }

    start () {
        
    }
    _applyText(){
        this.updateQrCode();
    }

    onDestroy(){

    }

    updateQrCode(){
        if(this.qrcode){
            this.qrcode.clear(); // clear the code.
            this.qrcode.makeCode(this.text); // make another code.
        }else{
            var that = this;
            var div = document.createElement("div");
            Logger.info('updateQrCode:', div);
            // this.qrcode = new QRCode(div, {
            //     text:this.text,
            //     width: this.node.width,
            //     height:this.node.height,
            //     colorDark : "#000000",
            //     colorLight : "#ffffff",
            //     correctLevel : 2
            // });
            this.qrcode = new QRCode['QRCode'](div, this.text);
            let img  = div.children[1];
            img['onload'] = () => {
                let texture = new cc.Texture2D();
                texture.initWithElement(<any>img);
                texture.handleLoadedTexture();
                let spriteFrame = new cc.SpriteFrame(texture);
                this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
            
        }
        
    }

    

    // update (dt) {}
}
