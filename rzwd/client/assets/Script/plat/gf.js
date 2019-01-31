
var gfStart = function(obj){

    obj.success("gfStart -- succeed");
}

var login = function(obj){
    obj.success({code:"1234567890"});
}

var loginSuccess = function(obj){
    obj.success({msg:"gf   loginSuccess",nickName:"gf123"});
}


var request = function(obj){
    console.info(obj.url)
    console.info("POSTDATA"+JSON.stringify(obj.data))
   
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status === 200){
                var response = xhr.response;
                console.log(response);
                try {
                    let resp_json = JSON.parse(response)
                    obj.success(resp_json);
                } catch (err) {
                    console.info("服务端返回错误的json格式");
                }
                
            }else{
                obj.fail("err");
            }
        }

        // console.info(JSON.stringify(xhr.status)+"///readyState:"+xhr.readyState );
    };
//    xhr.withCredentials = true;
    //注意，服务器端须设置设置response'Access-Control-Allow-Origin'，
    xhr.open("POST", obj.url, true);
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");//缺少这句，后台无法获取参数
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");//缺少这句，后台无法获取参数
    xhr.send(JSON.stringify(obj.data));

    return xhr;
}


var deepCopy = function(_obj){
    var copyObj=null; 
    if(typeof _obj==="object"){
        copyObj={};
        for(var i in _obj){
            if(typeof _obj[i]==="object"||typeof _obj[i]==="array"){
              copyObj[i]=deepCopy(_obj[i]);
            }
            copyObj[i]=_obj[i];
        }
    }else if(typeof _obj==="array"){
          copyObj=[];
          for(var i=0;i<copyObj.length;i++){
              if(typeof _obj[i]==="object"||typeof _obj[i]==="array"){
                  copyObj[i]=deepCopy(_obj[i]);
              }
              copyObj[i]=_obj[i];
          }
    }else{
          copyObj=null;
          copyObj=_obj;
    }
    return copyObj;
}

var bannerAd = null;
var changeBannerAd = function(obj){
    console.info("changeBannerAd");
    // console.info(obj);
}
var downLoad = function(obj){
    
    console.info("downLoad",obj);
}

module.exports = {
    start:gfStart,
    login:login,
    loginSuccess:loginSuccess,
    request:request,
    changeBannerAd:changeBannerAd,
    bannerAd:bannerAd,
    downLoad:downLoad
};