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
            dst[name] = src[name];
        }
        return dst;
    };

    /**
     * 精灵动态加载网络图片
     * @param container 
     * @param _iconUrl 
     * @param _callfunc 
     */
    public static loadHttpIcon(container, _iconUrl, _callfunc) {
        if (!_iconUrl || _iconUrl == "") {
            _iconUrl = "http://thirdwx.qlogo.cn/mmopen/vi_32/opmkDJhG2jpF8X8AfFQfTauRlpBc7VeFicJevZ9IiajEl5g4ia75opNSZOb0FvDV87BvpUN1rsyctibGnicP7uibsMtw/132"
        }
        cc.loader.load({ url: _iconUrl, type: 'png' }, function (err, tex) {
            var spriteFrame = new cc.SpriteFrame(tex)
            container.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            if (_callfunc) {
                _callfunc()
            }
            // Logger.info('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
        });
    }


}