var crypto = require('crypto')
var dataScript = require('../dataScript/dataScript')

var decryptData = function (encryptedData, iv,skey) {

  // base64 decode
  var sessionKey = new Buffer(skey, 'base64')
  encryptedData = new Buffer(encryptedData, 'base64')
  iv = new Buffer(iv, 'base64')

  try {
      // 解密
    var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    var decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')
    
    decoded = JSON.parse(decoded)

  } catch (err) {
    throw new Error('Illegal Buffer')
  }

  if (decoded.watermark.appid !== dataScript.common.appId) {
    throw new Error('Illegal Buffer')
  }

  return decoded
}

module.exports = {
  decryptData:decryptData

};