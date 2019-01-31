var dataScript = require('../model/dataScript')
var wafer2sdk = require('./wafer2-client-sdk/index.js');
var config = require('../public/config')

var tunnel = 0;
var start = function(obj){
    // 设置登录地址
    wafer2sdk.setLoginUrl(config.service.apiUrl+"/login");
    
    startAtunnel(obj);

    console.info("-------------qcloud start-------------------");
}

var login = function(obj){
    console.info("use -----qcloud login");
    wafer2sdk.login({
        success: function (userInfo) {
            console.log('登录成功', userInfo);
            obj.success(userInfo);
        },
        fail: function (err) {
            console.log('登录失败', err);
            obj.fail(err);
        }
    });
}

var startAtunnel = function(obj){
    console.info("use -----qcloud tunnel");
    if(tunnel){
        closeTunnel();
    }
    // 创建信道，需要给定后台服务地址
    tunnel = new wafer2sdk.Tunnel(config.service.apiUrl+'/tunnel');

    // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
    tunnel.on('connect', () => {
        console.log('WebSocket 信道已连接')
        dataScript.common.tunnelStatus = 'connected'
      });
    tunnel.on('close', () => {
        console.log('WebSocket 信道已断开')
        dataScript.common.tunnelStatus = 'closed'
    });
    tunnel.on('reconnecting', () => console.log('WebSocket 信道正在重连...'));
    tunnel.on('reconnect', () => console.log('WebSocket 信道重连成功'));
    tunnel.on('error', error => console.error('信道发生错误：', error));

    // 监听自定义消息，用户上线下线（服务器进行推送）
    tunnel.on('people', msg => {
        if (msg.online){
            console.log('用户上线,', msg.who.nickName)
        }
        else if (msg.offline){
            console.log('用户下线,', msg.who.nickName)
        }
        else{
            console.log('未识别的消息,', msg)
        }
    })

    // 打开信道
    tunnel.open();

    // 发送消息
    // tunnel.emit('speak', { word: "hello", who: { nickName: "techird" }});
    
}

var closeTunnel = function(){
    // 关闭信道
    if(tunnel){
        tunnel.close();
        dataScript.common.tunnelStatus = 'closed'
    }
}

var getTunnel = function(){
    if(tunnel){
        return tunnel;
    }else{
        startAtunnel();
        return tunnel;
    }
}

var sendMessage = function(cmd, msg) {
    if (!dataScript.common.tunnelStatus || !dataScript.common.tunnelStatus === 'connected'){
        console.log("未连接信道，信道当前状态:", dataScript.common.tunnelStatus)
        return
    }
    // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
    console.log( tunnel.status) 
    if (tunnel && tunnel.isActive()) {
        // 使用信道给服务器推送消息
        console.log("cmd = "+cmd+":"+JSON.stringify(msg))
        tunnel.emit(cmd, msg);
    }
}

var revcMessage = function(cmd, revc) {
    if (!dataScript.common.tunnelStatus || !dataScript.common.tunnelStatus === 'connected'){
        return
    }
    // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
    console.log( tunnel.status) 
    if (tunnel && tunnel.isActive()) {
        // 监听自定义消息
        tunnel.on(cmd,  msg => revc(msg));
    }
  }
  

module.exports = {
    start:start,
    login:login,
    startAtunnel:startAtunnel,
    closeTunnel:closeTunnel,
    sendMessage:sendMessage,
    revcMessage:revcMessage

};