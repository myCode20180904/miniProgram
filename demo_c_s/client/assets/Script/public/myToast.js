
var show=function(dt,msg){
    if(!cc.director.getScene()){
        return;
    }
    if(cc.find("Canvas").getChildByName("toast")){
        cc.find("Canvas").getChildByName("toast").stopAllActions();
        cc.find("Canvas").getChildByName("toast").getChildByName("msg").getComponent(cc.RichText).string =msg ;
        cc.find("Canvas").getChildByName("toast").getChildByName("bg").width = cc.find("Canvas").getChildByName("toast").getChildByName("msg").width+50;
        cc.find("Canvas").getChildByName("toast").getChildByName("bg").height = cc.find("Canvas").getChildByName("toast").getChildByName("msg").height+50;
        cc.find("Canvas").getChildByName("toast").runAction(cc.sequence(cc.delayTime(dt),cc.fadeOut(0.3),cc.removeSelf()));
    }else{

        cc.loader.loadRes("prefab/toast", function (err, prefab) {
            var node = cc.instantiate(prefab);
            node.active = true;
            node.name = "toast";
            node.getChildByName("msg").getComponent(cc.RichText).string =msg ;
            node.getChildByName("bg").width = node.getChildByName("msg").width+50;
            node.getChildByName("bg").height = node.getChildByName("msg").height+50;
            cc.find("Canvas").addChild(node,10000);
            node.runAction(cc.sequence(cc.delayTime(dt),cc.fadeOut(0.3),cc.removeSelf()));
            node.setPosition(0,0);

        });
    }
   

    
}


var showPrefab=function(file,_callfunc,extInfo,zoder){
    if(!cc.director.getScene()){
        return;
    }
    let file_arr = file.split('/');
    console.info(file+"--showPrefab:"+file_arr[file_arr.length-1]);
    //
    if(cc.find("Canvas").getChildByName(file_arr[file_arr.length-1])){
        cc.find("Canvas").getChildByName(file_arr[file_arr.length-1]).destroy();
    }
    // 加载 Prefab
    cc.loader.loadRes(file, function (err, prefab) {
        if(err){
            console.info(err);
            return;
         }else{
            var node = cc.instantiate(prefab);
            node.active = true;
            node.name = file_arr[file_arr.length-1];
            node.setPosition(0,0);
            if(zoder){
                cc.find("Canvas").addChild(node,zoder);
                node.zIndex = zoder;
            }else{
                cc.find("Canvas").addChild(node);
            }
            //
            if(_callfunc){
                if(extInfo){
                    _callfunc(node,extInfo);
                }else{
                    _callfunc(node);
                }
             }

         }
        
    });
}

/**
 * 
 * @param {*} url 
 * @param {*} _callfunc 
 * @param {*} extInfo 
 * @param {*} zoder 
 */
var loadPrefabUrl=function(url,_callfunc,extInfo,zoder){
    if(!cc.director.getScene()){
        return;
    }
    let file_arr = file.split('/');
    console.info(file+"--showPrefab:"+file_arr[file_arr.length-1]);
    //
    if(cc.find("Canvas").getChildByName(file_arr[file_arr.length-1])){
        cc.find("Canvas").getChildByName(file_arr[file_arr.length-1]).destroy();
    }
    // 加载 Prefab
    cc.loader.loadRes(file, function (err, prefab) {
        if(err){
            console.info(err);
            return;
         }else{
            var node = cc.instantiate(prefab);
            node.active = true;
            node.name = file_arr[file_arr.length-1];
            node.setPosition(0,0);
            if(zoder){
                cc.find("Canvas").addChild(node,zoder);
                node.zIndex = zoder;
            }else{
                cc.find("Canvas").addChild(node);
            }
            //
            if(_callfunc){
                if(extInfo){
                    _callfunc(node,extInfo);
                }else{
                    _callfunc(node);
                }
             }

         }
        
    });
}




module.exports = {
    show:show,
    showPrefab:showPrefab,
    loadPrefabUrl:loadPrefabUrl
};