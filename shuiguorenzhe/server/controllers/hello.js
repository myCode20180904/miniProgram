
const { message: { checkSignature } } = require('../qcloud')
const mysql = require("../qcloud").mysql


/**
	 * 登录接口
	 * 如果已经存在则更新
	 * @param code  （必填）
	 * @param appid (选填) 从其它地方跳转过来的appid
	 * @param sharekey (选填) 如果是打开分享者的卡片，则建立好友关系
	 * @param shareType(选填)
	 * @return ['err'=>1,'msg'=>'param is err']
	 * @return ['err'=>0,'msg'=>'ok','data'=>$data,'config'=>$config]
*/

/**
 * 响应 GET 请求（响应微信配置时的签名检查请求）
 */
async function get (ctx, next) {
    // 具体查看：
    console.log(ctx.request.query);

    let returnStr = {};
    let param={};

    if (ctx.request.method == "POST") {
        param = ctx.request.body;
    } else{
        param = ctx.request.query || ctx.request.params; 
    }
    
    // console.info(param);
    if(param){
        returnStr.data = {
            nickName:param.code,

        };
        returnStr.err=0;
        returnStr.msg = 'param:respond with a resource ';
    }else{
        returnStr.data = { };
        returnStr.err=1;
        returnStr.msg = 'param:error ';
    }
    
    //ctx.response.send(returnStr);
    ctx.body = returnStr;
        
}

async function post (ctx, next) {
     // 具体查看：
     console.log(ctx.request.body);

    //  knex.schema.withSchema([schemaName])
    // 创建新表
    // knex.schema.createTable(tableName, callback)
    var content=null;
    content = await mysql.schema.withSchema('cAuth').createTableIfNotExists('users', function(tabel){
        tabel.increments();
        tabel.string('nickName');
        tabel.integer('age');
        tabel.string('avatarUrl');
        tabel.string('code');
        tabel.string('encryptedData');
        tabel.string('city');
        tabel.timestamps();
        console.info(tabel);
    }).toString();

    await mysql.raw(content).then(res => {
        console.log(content);
        console.log('mysql执行成功')
    }, err => {
        throw new Error(err)
    })

    //--重命名from表为to
    // knex.schema.renameTable('users', 'old_users')
    // --删除表
    // knex.schema.dropTable(tableName)
    // --判断表是否存在，返回布尔值
    // knex.schema.hasTable(tableName)
    // --判断列名是否存在，用法和hasTable类似
    // knex.schema.hasColumn(tableName, columnName)

    var result = null;
    //insert
    result = await mysql('users')
        .returning('id')
        .insert({nickName: "test_name1",age:1,created_at:new Date()})

    console.log(result);

    //select
    result = await mysql.column('*').select().from('users');
    console.log(result);
    //update
    result = await mysql('users')
        .where('age', '<', 100)
        .update({
            nickName: 'test_name1_age<100',
            age: 100,
            updated_at:new Date()
        })
    console.log(result);
    // delete
    // result = await mysql('users')
    //     .where('age', '=',100)
    //     .del()
    // console.log(result);

 
     let returnStr = {};
     let param={};
 
     if (ctx.request.method == "POST") {
         param = ctx.request.body;
     } else{
         param = ctx.request.query || ctx.request.params; 
     }
     
     // console.info(param);
     if(param){
         returnStr.data = {
             nickName:param.code,
 
         };
         returnStr.err=0;
         returnStr.msg = 'param:respond with a resource ';
     }else{
         returnStr.data = { };
         returnStr.err=1;
         returnStr.msg = 'param:error ';
     }
     
     ctx.body = returnStr;
}

module.exports = {
    post,
    get
}
