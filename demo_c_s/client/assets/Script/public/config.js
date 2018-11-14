/**
 * 小游戏配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
//var host = 'http://192.168.24.89/index.php';
// var host = 'https://rylx.chaosuduokai.com';
var host = 'http://localhost:5757';
if(window.wx){
    host = 'https://p2pnowly.qcloud.la';
}
//http://192.168.24.89/index.php/index/login?code=081SW3tC1z3ot30hP5rC1RgWsC1SW3tu

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        apiUrl:`${host}/weapp`,
        imgUrl:`https://lg-3q7kbp58-1257126548.cos.ap-shanghai.myqcloud.com/images/test`,
        downLoadUrl:`https://lg-3q7kbp58-1257126548.cos.ap-shanghai.myqcloud.com/download/`

    }
};

module.exports = config;