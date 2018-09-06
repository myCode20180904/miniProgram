
var userInfo = {
    openid:0,
    code:0,
    encryptedData:0,
    iv:0,
    skey:0,
    name:0,
    avatarUrl:0,
    sex:0,
    formScene:0,

     //处理数据
     friendList:[],
     sortFriendListByAge:function(_friendList){
 
         return _friendList;
     }

};

module.exports = {
    getData:userInfo
};