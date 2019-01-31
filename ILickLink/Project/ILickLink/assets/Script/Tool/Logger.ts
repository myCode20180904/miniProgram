/**
 * 日志
 */
export const Logger:{info:Function,warn:Function,error:Function} = {
    info:function(message?: any, ...optionalParams: any[]): void{
        console.info(message,...optionalParams);
    },
    warn:function(message?: any, ...optionalParams: any[]): void{
        console.warn(message,...optionalParams);
    },
    error:function(message?: any, ...optionalParams: any[]): void{
        console.error(message,...optionalParams);
    }
};
