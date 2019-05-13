import { GameConfig } from "../GameConfig";

export class Util {
    
    /**
     * 格式化日期
     * @param {Date} date
     */
    public static formatDateMonth(date: Date) {
        const month: number = date.getMonth() + 1;
        const day: number = date.getDate();
        return month + '月' + day + '日';
    }
    
    /**
     * 格式化日期(yy-mm-dd HH:MM:SS)
     */
    public static formatDateYmd()  {
        Date.prototype['format'] = function (format) {
            var args = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
                "S": this.getMilliseconds()
            };
            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var i in args) {
                var n = args[i];
                if (new RegExp("(" + i + ")").test(format))
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
            }
            return format;
        };
        return new Date()['format']("yyyy-MM-dd hh:mm:ss")
    };

    /**
     * 安全拷贝对象
     * @param {object} dst 目标
     * @param {object} src 拷贝源
     * @param {string} dstPrefix 目标前缀
     * @param {string} srcPrefix 来源前缀
     * @return {object} values
     */
    public static safeCopy(dst: any, src: any, dstPrefix?: string, srcPrefix?: string) {
        dstPrefix = dstPrefix || '';
        srcPrefix = srcPrefix || '';
        for (let srcName in src) {
            let dstName = dstPrefix + srcName.replace(srcPrefix, '');
            if (!dst.hasOwnProperty(dstName)) {
                continue;
            }
            let type = typeof dst[dstName];
            if (type === 'undefined') {
                continue;
            }
            if (type === 'number') {
                dst[dstName] = parseFloat(src[srcName]);
                continue;
            }
            dst[dstName] = src[srcName];
        }
        return dst;
    };

    /**
     * 安全扩展对象
     * @param {object} dst 目标
     * @param {object} src 拷贝源
     * @return {object} values
     */
    public static safeExtend(dst, src) {
        for (let name in src) {
            
            if(typeof src[name] === 'object') {
                if(src[name] instanceof Array){
                    dst[name] = [];
                    for(var i = 0, len = src[name].length; i < len; i++){
                        dst[name].push(Util.safeExtend({},src[name][i]));
                    }
                }else{
                    dst[name] = Util.safeExtend({},src[name]);
                } 
                continue;
            } 
            dst[name] = src[name];
        }
        return dst;
    };

    /**
     * 获取cocos本地路径
     * @param url 
     */
    public static getNativeUrl(url){
        if(!cc.loader.getRes(url)){
            return;
        }
        if(window['wx']){
            let md5Pipe = cc.loader.md5Pipe;
            if (md5Pipe) {
                return md5Pipe.transformURL(cc.loader.getRes(url).nativeUrl);
            }
            return cc.loader.getRes(url).nativeUrl;
        }
        return cc.loader.getRes(url).nativeUrl;
    }

    /**
     * 获取文件远程路径
     * @param url
     * @param type  文件后缀
     */
    public static getRawUrl(url,type){
        var path = cc.url.raw('resources/'+url);
        if (cc.loader.md5Pipe) {
            path = cc.loader.md5Pipe.transformURL(path);
        }
        return path+type;
    }
    
    public static getAudioRawUrl(url){
        var path = cc.url.raw('resources/'+url);
        if (cc.loader.md5Pipe) {
            path = cc.loader.md5Pipe.transformURL(path);
        }
        return GameConfig.downLoadUrl+'/'+path+'.mp3';
        //https://minigame-1257126548.cos.ap-chengdu.myqcloud.com/stick_client/res/raw-assets/58/58d18357-5f37-4d6c-ab4b-67eeacbe8fd5.a2313.mp3
    }

}