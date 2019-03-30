import { LOG_DEBUG } from "../Define/GameConfig";

/**
 * 日志
 */
export const Logger:{info:Function,warn:Function,error:Function} = {
    info:function(message?: any, ...optionalParams: any[]): void{
        if(LOG_DEBUG){
            console.info(message,...optionalParams);
        }
    },
    warn:function(message?: any, ...optionalParams: any[]): void{
        console.warn(message,...optionalParams);
    },
    error:function(message?: any, ...optionalParams: any[]): void{
        console.error(message,...optionalParams);
    }
};
