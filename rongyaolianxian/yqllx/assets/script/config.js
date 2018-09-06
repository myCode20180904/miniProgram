/**
 * 小游戏配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
//var host = 'http://192.168.24.38/index.php';
var host = 'https://rylx.chaosuduokai.com';
//http://192.168.24.89/index.php/index/login?code=081SW3tC1z3ot30hP5rC1RgWsC1SW3tu

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/index/api/login`,
        //用户授权更新用户信息
        updateUserInfo:`${host}/index/api/updateUserInfo`,

        //
        gameStart:`${host}/index/api/gameStart`,
        gameOver:`${host}/index/api/gameOver`,
        signIn:`${host}/index/api/signIn`,
        behavior:`${host}/index/api/behavior`,

        game_img:`${host}/uploads/game_img`,
        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,
        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,
        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`
    },
    nowTime:new Date(),
    isToday:false,//是今天
};

module.exports = config;