import { LineDir } from "../Define/CommonParam";

const {ccclass, property} = cc._decorator;

@ccclass
export default class line extends cc.Component {
    @property()
    start_end:number =  0;//1起点，2终点,0 一般
    @property()
    col:number =  0;//
    @property()
    row:number =  0;//
    @property()
    lineDir:number =  LineDir.bottom;//
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
