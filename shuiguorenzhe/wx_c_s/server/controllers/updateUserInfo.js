const WXBizDataCrypt = require('./utils/WXBizDataCrypt')
module.exports = async (ctx, next) => {
   // 具体查看：
   console.log(ctx.request.body);

   let returnStr = {};
   let param={};

   if (ctx.request.method == "POST") {
       param = ctx.request.body;
   } else{
       param = ctx.request.query || ctx.request.params; 
   }

   if(param){
        if(param.encryptedData&&param.iv&&param.skey){
            ctx.state = WXBizDataCrypt.decryptData(param.encryptedData,param.iv,param.skey);
            console.info(ctx.state);
            //update
            result = await mysql('cSessionInfo')
            .where('open_id', '=', '100')
            .update({
                uuid: '1',
                skey: 100,
                last_visit_time:new Date(),
                session_key:'',
                user_info:''
            })
            console.log(result);

            returnStr.data = ctx.state;
            returnStr.err=0;
            returnStr.msg = 'ok ';
            ctx.body = returnStr;
        }else{
            returnStr.data = { };
            returnStr.err=1;
            returnStr.msg = 'param:error ';
            ctx.body = returnStr;
        }

   }else{
        returnStr.data = { };
        returnStr.err=1;
        returnStr.msg = 'param:error ';
        ctx.body = returnStr;
   }
}
