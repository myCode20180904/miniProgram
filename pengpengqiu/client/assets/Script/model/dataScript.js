var common = require('./common')
var userInfo = require('./userInfo')
var tunnelMessage = require('./tunnelMessage')
var gamedata = require('./gamedata')

module.exports = {
    common:common.getData,
    userInfo:userInfo.getData,
    tunnelMessage:tunnelMessage.getData,
    gamedata:gamedata.getData
};