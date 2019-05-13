
import { Logger } from "../Logger";
import { Util } from "../Util";
const audio_max_play = 10;

/**
 * 我的背包
 */
export class WXAudio{
    public audio:any = null;
    constructor(audio){
        this.audio = audio;
        this.audio.autoplay = false;
    }
    onEnded(){
        var that = this;
        var callback = function(){
            if(WXAudioEngie.Instance.effpool.length<audio_max_play){
                that.audio.stop();
                that.audio.src = null;
                that.audio.offEnded(callback);
                WXAudioEngie.Instance.effpool.push(that);
            }else{
                that.audio.destroy();
            }
        }
        this.audio.onEnded(callback);
    }
}
/**
 * WXAudioEngie 音效管理
 */
const {ccclass, property} = cc._decorator;
@ccclass
export class WXAudioEngie{
	private static instance: WXAudioEngie;
	public static get Instance(): WXAudioEngie {
		if (this.instance == null) {
			this.instance = new WXAudioEngie();
		}
		return this.instance;
    }
    private current = -1;
    private musicVolume = 1;
    private effectVolume = 1;
    private _isPause:boolean = false;
    
    public effpool:Array<WXAudio> = [];
    // public cache_audio:{ [key: string]: any} = {};
    private bgm:any = null;
    
    private constructor(){
        this.clear();
        this.init();
    }
    init(){
        for (let index = 0; index < audio_max_play; index++) {
            
            let audio = new WXAudio(window['wx'].createInnerAudioContext());
            this.effpool.push(audio);
        }
    }
    clear(){
        for (let index = 0; index < this.effpool.length; index++) {
            this.effpool[index].audio.destroy();
            this.effpool[index] = null;
            delete this.effpool[index];
        }
        this.effpool.splice(0,this.effpool.length);

    }

    setMusicVolume(value:number){
        this.musicVolume = value;
    }
    setEffectsVolume(value:number){
        this.effectVolume = value;
    }

    /**
     * 播放音效
     */
    playEffect(file,loop){
        file = 'audio/'+file;
        let audio_res = cc.loader.getRes(file);
        if(audio_res){
            // file = window['wx'].env.USER_DATA_PATH+'/'+Util.getNativeUrl(audio_res);
            file = audio_res._audio.src
            Logger.info(' audio.src audio_res: ',file,audio_res)
        }else{
            //加载到本地
            cc.loader.loadRes(file,cc.Asset,function(err,res){
                if(err){
                    return;
                }
            });
            file = Util.getAudioRawUrl(file);
        }
        if(!file){
            Logger.warn(' audio.src null: ',file)
            return;
        }
        
        let wxaudio:WXAudio = null;
        if(this.effpool.length<=0){
            wxaudio = new WXAudio(window['wx'].createInnerAudioContext());
            this.effpool.push(wxaudio);
            wxaudio.audio.loop = loop;
            wxaudio.audio.volume = this.effectVolume;
            wxaudio.audio.src = file;
            wxaudio.audio.play();
            //监听
            wxaudio.onEnded();
            return;
        }
        
        wxaudio = this.effpool.pop();
        wxaudio.audio.loop = loop;
        wxaudio.audio.volume = this.effectVolume;
        wxaudio.audio.src = file;
        wxaudio.audio.play();
        //监听
        wxaudio.onEnded();
    }
  
    /**
     * 关闭音效
     */
    stopEffect(){
        
    }

    /**
     * 播放背景音乐
     */
    public playMusic(file,loop){
        let filepath = Util.getAudioRawUrl('audio/'+file);
        if(!filepath){
            return;
        }
        if(this.bgm){
            this.bgm.loop = loop;
            this.bgm.volume = this.musicVolume;
            // this.bgm.src = window['wx'].env.USER_DATA_PATH+'/'+filepath;
            this.bgm.src = filepath;
            this.bgm.play();
        }else{
            this.bgm = window['wx'].createInnerAudioContext();
            this.bgm.loop = loop;
            this.bgm.autoplay = true;
            this.bgm.volume = this.musicVolume;
            this.bgm.src = filepath;
            this.bgm.play();
        }
        Logger.info('播放背景音乐',filepath,this.bgm);
    }
    public playBGM(){
        if(!this.bgm){
            return;
        }
        this.bgm.play();
    }
    /**
     * 播放背景音乐
     * @param flag //是否删除音效对象缓存
     */
    public stopMusic(flag:boolean){
        if(!this.bgm){
            return;
        }
        this.bgm.stop()
        if(flag){
            this.bgm.destroy();
            this.bgm = null;
        }
    }
    /**
     * 暂停音乐
     */
    public set isPause(value){
        this._isPause = value;
        if(this.bgm){
            this.bgm.paused  = value;
        }

    }
    public get isPause():boolean{
        return this._isPause;
    }

	
}