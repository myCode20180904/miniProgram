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

}