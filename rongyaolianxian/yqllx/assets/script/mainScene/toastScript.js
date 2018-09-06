

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
var show=function(dt,msg,parent,pos){
    if(!parent){
        return;
    }
    if(parent.getChildByName("toast")){
        parent.getChildByName("toast").destroy();
    }
      // 加载 Prefab
    cc.loader.loadRes("prefab/toast", function (err, prefab) {
        var node = cc.instantiate(prefab);
        node.active = true;
        node.name = "toast";
        node.getChildByName("msg").getComponent(cc.RichText).string =msg ;
        node.getChildByName("bg").width = node.getChildByName("msg").width+50;
        node.getChildByName("bg").height = node.getChildByName("msg").height+50;
        node.runAction(cc.sequence(cc.delayTime(dt),cc.fadeOut(0.3),cc.removeSelf()));
        parent.addChild(node,1000);
        if(pos){
            node.setPosition(pos.x,pos.y);
        }
    });

    
}

var showPrefab=function(file,parent,pos,action,_callfunc,zoder,data){
    let file_arr = file.split('/');
    console.info(file+"  ----showPrefab:"+file_arr[file_arr.length-1]);
    //
    if(parent.getChildByName(file_arr[file_arr.length-1])){
        parent.getChildByName(file_arr[file_arr.length-1]).destroy();
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
            //node.parent =parent;
            parent.addChild(node,zoder);
            if(zoder){
                node.zIndex = zoder;
            }
            //
            if(pos){
                node.setPosition(pos.x,pos.y);
            }
            //
            if(action){
                node.runAction(action);
            }else{
                node.scale = 0;
                node.opacity = 0;
                node.runAction(cc.spawn(cc.scaleTo(0.06,1.0),cc.fadeTo(0.06,255)));
            }
            //
            if(_callfunc){
                if(data){
                    _callfunc(data);
                }else{
                    _callfunc();
                }
             }
    
         }
        
    });

    
}

var showHttpLoad=function(vis){
    if(!cc.director.getScene()){
        return;
    }  
    if(vis){
        showPrefab("prefab/ui_section/loading",cc.director.getScene(),cc.v2(cc.winSize.width/2,cc.winSize.height/2),null,function(){},1000);
    }else{
        if(cc.director.getScene().getChildByName("loading")){
            cc.director.getScene().getChildByName("loading").destroy()
        }
    }

}

module.exports = {
    show:show,
    showPrefab:showPrefab,
    showHttpLoad:showHttpLoad
};