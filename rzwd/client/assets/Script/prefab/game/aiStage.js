var dataScript = require('../../model/dataScript')

var rundMapPos = cc.v2(0,0);
var getRundMapPos = function(index){
    if(index){
        getRandPos(index);
        return rundMapPos;
    }
    getRandPos();
    return rundMapPos;
}
var getRandPos = function(index){
    try {
        
        let size = dataScript.gamedata.mapArea_safe.size;
        let rand  = parseInt(Math.random()*size);
        // console.info('getRandPos',size,rand)
        if(index){
            let len = dataScript.gamedata.playerList.length;
            rand  = parseInt(size*index/len)+parseInt(Math.random()*size/len);
        }else{
            rand  = parseInt(Math.random()*size);
        }
        let count = 0;
        dataScript.gamedata.mapArea_safe.forEach(function (value, key, map) {
            // value: 指向当前元素的值
            // key: 指向当前索引
            // map: 指向map对象本身
            if(count == rand){
                rundMapPos = value.point;
                throw new Error("getRandPos")
            }
            count++;
        });

    }  catch (error) {
        if(error.message!="getRandPos"){
            throw error;
        }
    }
    

}

var getDir = function(pre,now){
    let __dir = cc.v2(0,0);
    
    if(now.x-pre.x==0){
        if(now.y-pre.y>=0){
            __dir.y = 1;
        }else{
            __dir.y = -1;
        }
    }else if(now.y-pre.y==0){
        if(now.x-pre.x>=0){
            __dir.x = 1;
        }else{
            __dir.x = -1;
        }
    }else{
        __dir.x = now.x-pre.x;
        __dir.y = now.y-pre.y;
    }

    let rate = Math.sqrt(__dir.x*__dir.x+__dir.y*__dir.y)/1;
    if(rate>=1){
        __dir.x = __dir.x/rate;
        __dir.y = __dir.y/rate;
                    
        return __dir;
    }else{
        return null;
    }

}


module.exports = {
    getDir:getDir,
    getRundMapPos:getRundMapPos
};