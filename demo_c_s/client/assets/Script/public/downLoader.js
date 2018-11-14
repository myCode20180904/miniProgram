
var dataScript = require('../model/dataScript')
var COMMON = dataScript.common;
var plat = require('../plat/platScript')
var config = require('./config')
var md5 = require('../utils/md5')

/**
 * loadUrl(针对RemoteRes)
 * @param { url, completeness:function(process){}, complete:function(){}, fail:function(){},cancel:function(){}} option 
 */
var loadUrl = function(option){
    //保存的路径（改成一级目录）
    let savePath = `RemoteRes/${option.url}`;
    let path = savePath.substring(0, savePath.lastIndexOf("/"));
    let file = savePath.substring(savePath.lastIndexOf("/"), savePath.length);
    console.info(path,file);
    path = encodeURI(md5.hex_md5(path));
    savePath = path+file;
    showHttpLoading(10);
    const downloadTask = plat.downLoad({
        url:config.service.downLoadUrl+'RemoteRes/'+option.url,
        path:savePath,
        success:function(res){
            console.info(res)
        },
        save:function(path){
            //加载远程资源
            if(option.type == 'png'){
                COMMON.loadHttpPng(path,function(key){
                    hideHttpLoading();
                    option.complete({
                        key:key,
                        spriteFrame:COMMON.textureRes.get(key)
                    });  
                },true);
            }else{
                option.complete({
                    key:path,
                });
            }

            
        }
    });

    downloadTask.onProgressUpdate((res) => {
        option.completeness(res);
    })

    let callback = function(){
        timeOut(downloadTask,option);
    }
    cc.director.getScheduler().schedule(callback,this,10,1,10);

    return downloadTask;
}

/**
 * loadUrl(针对RemoteRes)
 * @param { url, completeness:function(process){}, complete:function(){}, fail:function(){},cancel:function(){}} option 
 */
var loadUrls = function(option){
    for (let index = 0; index < option.urls.length; index++) {
        option.url = option.urls[index];
        loadUrl(option);
    }
}

var timeOut = function(downloadTask,option){
    downloadTask.abort();
    hideHttpLoading();
    option.cancel("time out.");
}

var showHttpLoading=function(maxtime){
    if(!cc.director.getScene()){
        return;
    }
    if(cc.find("Canvas").getChildByName("httpLoading")){
        hideHttpLoading();
    }
    cc.loader.loadRes("prefab/httpLoading", function (err, prefab) {
        var node = cc.instantiate(prefab);
        node.active = true;
        node.name = "httpLoading";
        cc.find("Canvas").addChild(node,10000);
        node.runAction(cc.sequence(cc.delayTime(maxtime),cc.fadeOut(0.3),cc.removeSelf()));
        node.setPosition(0,0);

    });
     
}


var hideHttpLoading=function(){
    if(cc.find("Canvas").getChildByName("httpLoading")){
        cc.find("Canvas").getChildByName("httpLoading").stopAllActions();
        cc.find("Canvas").getChildByName("httpLoading").removeFromParent();
    }
}


module.exports = {
    loadUrl:loadUrl,
    loadUrls:loadUrls
};