/**
 * 批量修改文件名称并添加废弃代码
 * 1.遍历文件目录
 * 2.修改文件名 自定义+filename
 * 3.文件末尾添加代码
 * ‘注意：所有和文件名相同的引用需要查找替换’
 */


var fs = require('fs');

var PATH = './test'; // 你的目录
var confusion_word = "confusion_" //自定义混淆单词（文件名前缀，类名前缀）

//添加废弃代码到末尾
var addcode = `
function ${confusion_word}fun1(path, callback) {
    var files = path+"";

    //这里是注释，跟著需要修改
    callback(files);
}

function ${confusion_word}fun2(path, callback) {
    var files = path+"";

    //?????????
    callback(files);
}

function ${confusion_word}fun3(path, callback) {
    var files = path+"";

    //?????????
    callback(files);
}
`






//  遍历目录得到文件信息
function walk(path, callback) {
    var files = fs.readdirSync(path);
 
    files.forEach(function(file){
        if (fs.statSync(path + '/' + file).isFile()) {
            callback(path, file);
        }
    });
}

// 修改文件名称
function rename (oldPath, newPath) {
    fs.rename(oldPath, newPath, function(err) {
        if (err) {
            console.info(err);
            throw err;
        }

        recode(newPath);
    });
}

//修改文件类容
function recode (path, newPath) {
    /**
     * filename, 必选参数，文件名
     * [options],可选参数，可指定flag（文件操作选项，如r+ 读写；w+ 读写，文件不存在则创建）及encoding属性
     * callback 读取文件后的回调函数，参数默认第一个err,第二个data 数据
     */

    fs.readFile(path, {flag: 'r+', encoding: 'utf8'}, function (err, data) {
        if(err) {
            console.info(err);
            throw err;
        }
        console.log(data);
        //追加文件
        fs.appendFile(path, addcode, function () {
            console.log('追加内容完成');
        });
    });
}

// 运行
walk(PATH, function (path, fileName) {
    console.info("walk:",PATH);
    var oldPath = path + '/' + fileName, // 源文件路径
        newPath = path + '/'+ confusion_word+fileName

    if(oldPath.indexOf(confusion_word)>=0){
        recode(oldPath);
        return;
    }
    rename(oldPath, newPath);
});



// 作者：RoamIn
// 链接：https://www.jianshu.com/p/4d823a522ccc
// 來源：简书
// 简书著作权归作者所有，任何形式的转载都请联系作者获得授权并注明出处。