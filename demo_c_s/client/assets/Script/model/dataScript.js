var common = require('./common')
var userInfo = require('./userInfo')
var tunnelMessage = require('./tunnelMessage')

module.exports = {
    common:common.getData,
    userInfo:userInfo.getData,
    tunnelMessage:tunnelMessage.getData
};