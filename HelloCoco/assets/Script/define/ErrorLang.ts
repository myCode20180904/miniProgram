
export const enum ErrorType {
    COMMON_ERR = 0, // 未知错误
    COMMON_SUCCESS = 1, // 操作成功
    COMMON_NOLOGIN = 2, // 未登录
    COMMON_LOGIN_ERR = 3, // 登录错误
    COMMON_LOGIN_EXPIRED = 4, //登录过期
    COMMON_LOGIN_RELOAD_DATA = 5, //失去连接，重登

    // 用户模块(101-150)
    COMMON_FUNC_CLOSE = 101, // 功能关闭
    COMMON_SAVE_ERR = 102, // 保存失败
    COMMON_LOAD_ERR = 103, // 加载失败
    COMMON_JSON_ERR = 104, // 无效JSON数据
    COMMON_CAPTCHA_ERR = 105, // 无效验证码
    COMMON_WXLOGIN_ERR = 106, // 微信登录失败
}

// 常用定义
export const ErrorLang: any = {};
ErrorLang[ErrorType.COMMON_ERR] = '未知错误';
ErrorLang[ErrorType.COMMON_SUCCESS] = '操作成功';
ErrorLang[ErrorType.COMMON_NOLOGIN] = '登录失效，请重新登录';
ErrorLang[ErrorType.COMMON_LOGIN_ERR] = '登录错误';
ErrorLang[ErrorType.COMMON_LOGIN_EXPIRED] = '登录过期';
ErrorLang[ErrorType.COMMON_LOGIN_RELOAD_DATA] = '失去连接，重登';

// 用户模块(101-150)
ErrorLang[ErrorType.COMMON_FUNC_CLOSE] = '功能关闭';
ErrorLang[ErrorType.COMMON_SAVE_ERR] = '保存失败';
ErrorLang[ErrorType.COMMON_LOAD_ERR] = '加载失败';
ErrorLang[ErrorType.COMMON_JSON_ERR] = '无效JSON数据';
ErrorLang[ErrorType.COMMON_CAPTCHA_ERR] = '无效验证码';
ErrorLang[ErrorType.COMMON_WXLOGIN_ERR] = '微信登录失败';