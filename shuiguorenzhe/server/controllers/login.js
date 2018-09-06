const dataScript = require('./dataScript/dataScript')
var https = require('https');
const WXBizDataCrypt = require('./utils/WXBizDataCrypt')
const mysql = require("../qcloud").mysql

// 登录授权接口
async function post (ctx, next) {
     // 具体查看：
     console.log(ctx.request.body);

     let returnStr = {};
     let param={};
 
     if (ctx.request.method == "POST") {
         param = ctx.request.body;
     } else{
         param = ctx.request.query || ctx.request.params; 
     }
     
     // console.info(param);
     if(param){
         let sql_result=0;
         if(param.code == "1234567890"){
                 //select
            sql_result = await mysql.column('*').select().from('cSessionInfo');
            console.log(sql_result);
            returnStr.data = { 
                
            };
            returnStr.err=0;
            returnStr.msg = 'test user';
            ctx.body = returnStr;
             return;
         }

        var token = await authorization_code(param);

        if(JSON.parse(token).errcode){
            returnStr.data = JSON.parse(token);
            returnStr.err=1;
            returnStr.msg = 'token error ';
        }else{
            returnStr.data = JSON.parse(token);
            returnStr.err=0;
            returnStr.msg = 'sucess';
        }

        
        ctx.body = returnStr;

     }else{
         returnStr.data = { };
         returnStr.err=1;
         returnStr.msg = 'param:error ';
         ctx.body = returnStr;
     }
     

}

var authorization_code = function(param){
    return  new Promise(function (resolve, reject) {
                //GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
        let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${dataScript.common.appId}&secret=${dataScript.common.AppSecret}&js_code=${param.code}&grant_type=authorization_code`;
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
    post
}
