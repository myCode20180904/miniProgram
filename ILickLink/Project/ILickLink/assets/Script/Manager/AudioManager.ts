import { LoadManager } from "./LoadManager";

/**
 * 装备分类
*/
export enum AudioType{
    MUSIC_LoginBG = "login_bg", // 登录背景乐
    MUSIC_FightBG = "fight_bg", // 战斗背景音
    EFF_Touch = "touch",//点击按钮
    EFF_OpenWindow = "open_window",//打开窗口音效
    EFF_CloseWindow = "close_window",//关闭窗口音效

}
/**
 * AudioManager 音效管理
 */
const {ccclass, property} = cc._decorator;

@ccclass
export class AudioManager{
	private static instance: AudioManager;
	public static get Instance(): AudioManager {
		if (this.instance == null) {
			this.instance = new AudioManager();
		}
		return this.instance;
    }
    private current = -1;

    private _music_on:boolean = false;
    private _sound_on:boolean = false;
    get music_on() : boolean {
        return this._music_on;
    }
    set music_on(value : boolean) {
        this._music_on = value;
        cc.sys.localStorage.setItem('music_on',value);
        if(!value){
            this.stopBg();
        }else{
            if(cc.director.getScene()){
                if(cc.director.getScene().name=='FightScene'){
                    this.playBg(AudioType.MUSIC_FightBG);
                }else{
                    this.playBg(AudioType.MUSIC_LoginBG);
                }
            }
        }
    }

    get sound_on() : boolean {
        return this._sound_on;
    }
    set sound_on(value : boolean) {
        this._sound_on = value;
        cc.sys.localStorage.setItem('sound_on',value);
    }
    
    private constructor(){
        //初始声音配置
        let flag = cc.sys.localStorage.getItem('music_on');
        if(flag!=null){
            this.music_on = (flag=="true")?true:false;
        }else{
            cc.sys.localStorage.setItem('music_on',true);
            this.music_on = true;
        }
        flag = cc.sys.localStorage.getItem('sound_on');
        if(flag!=null){
            this.sound_on = (flag=="true")?true:false;
        }else{
            cc.sys.localStorage.setItem('sound_on',true);
            this.sound_on = true;
        }
        
        cc.audioEngine.setMusicVolume(0.5);
        cc.audioEngine.setEffectsVolume(2.0);
    }

    /**
     * 播放音效
     */
    playEff(name){
        if(!this._sound_on){
            return;
        }
        this.current = cc.audioEngine.play(LoadManager.Instance.audios[name], false, 1);
    }
    /**
     * 关闭音效
     */
    stopEff(){
        cc.audioEngine.stop(this.current);
    }

    /**
     * 播放背景音乐
     */
    public playBg(name){
        if(!this._music_on){
            return;
        }
        cc.audioEngine.playMusic(LoadManager.Instance.audios[name],true);
    }
    /**
     * 播放背景音乐
     */
    public stopBg(){
        cc.audioEngine.stopMusic();
    }
    /**
     * pause所有音乐
     */
    public pause(){
        cc.audioEngine.pauseAll();
    }
    /**
     * resume所有音乐
     */
    public resume(){
        cc.audioEngine.resumeAll();
    }
	
}