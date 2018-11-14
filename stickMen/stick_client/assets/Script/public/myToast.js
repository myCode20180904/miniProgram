var plat = require('../plat/platScript')

/**
 * showMsg 消息提示
 * @param {*} msg 
 * @param {*} dt 
 */
var showMsg = function(msg,dt,call){
    showPrefab("view/toastView",
        function(node,extinfo){
            node.getComponent("toastView").addMsg(msg,dt);
            if(call){
                call();
            }
        },
        {

        },
        1000
    );
}

/**
 * 加载一个view,同一个view不重复添加
 * @param {*} file 
 * @param {*} _callfunc 回调函数
 * @param {*} extInfo 加载完回传信息
 * @param {*} zoder 
 */
var showPrefab=function(file,_callfunc,extInfo,zoder){
    if(!cc.director.getScene()){
        return;
    }
    let file_arr = file.split('/');
    console.info(file+"--showPrefab:"+file_arr[file_arr.length-1]);
   
    // 加载 Prefab
    cc.loader.loadRes(file, function (err, prefab) {
        if(err){
            console.info(err);
            return;
         }else{
             let name = file_arr[file_arr.length-1];
            //已经存在
            if(getPrefabNode(name)){
                var node = getPrefabNode(name);
                node.active = true;
                //
                if(_callfunc){
                    if(extInfo){
                        _callfunc(node,extInfo);
                    }else{
                        _callfunc(node);
                    }
                }
                return;
            }

            var node = cc.instantiate(prefab);
            node.active = true;
            node.name = name;
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
 * 关掉一个view
 * @param {*} name 
 */
var hidePrefab = function(name){
    if(cc.find("Canvas").getChildByName(name)){
        cc.find("Canvas").getChildByName(name).destroy();
    }
}

/**
 * 获取一个view节点
 * @param {*} name 
 */
var getPrefabNode = function(name){
    if(cc.find("Canvas").getChildByName(name)){
        return cc.find("Canvas").getChildByName(name);
    }
}


module.exports = {
    showPrefab:showPrefab,
    hidePrefab:hidePrefab,
    getPrefabNode:getPrefabNode,
    showMsg:showMsg
};