// const dataScript = require('./dataScript/dataScript')
var https = require('https');
// const mysql = require("../qcloud").mysql
const config = require('../config')
// const util = require('./utils/util')

// 登录授权接口
async function get (ctx, next) {
     // 具体查看：
     console.log(ctx.request.body);

     if (ctx.state.$wxInfo.loginState) {
        ctx.state.data = ctx.state.$wxInfo.userinfo
        console.info(ctx.state.data);
    }
    // //

    //  let returnStr = {};
    //  let param={};
 
    //  if (ctx.request.method == "POST") {
    //      param = ctx.request.body;
    //  } else{
    //      param = ctx.request.query || ctx.request.params; 
    //  }

    //  // console.info(param);
    //  if(param){
    //      if(param.code == "1234567890"){
    //          //select
    //         await mysql
    //         .column('session_key','user_info')
    //         .select()
    //         .from('cSessionInfo')
    //         .limit('1')
    //         .then(res => {
    //             ctx.state.userinfo = res;
    //         });

    //         console.info(ctx.state.userinfo[0].session_key);
    //         console.info(ctx.state.userinfo[0].user_info);
    //         let userinfo = JSON.parse(ctx.state.userinfo[0].user_info);
    //         returnStr.data ={ 
    //             openid:userinfo.openId,
    //             session_key:ctx.state.userinfo[0].session_key,
    //             nickName:userinfo.nickName,
    //             avatarUrl:userinfo.avatarUrl,
    //             gender:userinfo.gender
                
    //         };
          
    //         returnStr.err=0;
    //         returnStr.msg = 'test user';
    //         ctx.body = returnStr;
    //          return;
    //      }

    //     var token = await authorization_code(param);

    //     if(JSON.parse(token).errcode){
    //         returnStr.data = JSON.parse(token);
    //         returnStr.err=1;
    //         returnStr.msg = 'token error ';
    //     }else{
    //         returnStr.data = JSON.parse(token);
    //         returnStr.err=0;
    //         returnStr.msg = 'sucess';
    //     }

        
    //     ctx.body = returnStr;

    //  }else{
    //      returnStr.data = { };
    //      returnStr.err=1;
    //      returnStr.msg = 'param:error ';
    //      ctx.body = returnStr;
    //  }
     

}

var authorization_code = function(param){
    return  new Promise(function (resolve, reject) {
                //GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
        let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.appId}&secret=${config.appSecret}&js_code=${param.code}&grant_type=authorization_code`;
        https.get(url, (resp) => {
           var data="";
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                resolve(data);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    })
}

module.exports = {
    get
}
