var plat = require('../plat/platScript')
var bannerAd = require('../public/bannerAd')

cc.Class({
    extends: bannerAd.obj,

    properties: {
        TestRequest: {
            default: null,    
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        console.info("page2 onLoad");
        this._onLoad();

    },
    onDestroy(){
        console.info("page2 onDestroy");
        this._onDestroy();
    },

    start () {
        this.node.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function(event){ this.close()}, this);
        this.node.getChildByName("db").on(cc.Node.EventType.TOUCH_START,function(event){}, this);

        this.TestRequest.on(cc.Node.EventType.TOUCH_START,this.testreq, this);
    },

    // update (dt) {},

    testreq:function(event,customEventData){
        let str = " [ session_key: '6iIg4vZyhbFd4qkcyjWG6A==' ] ";
        this.getKVD(str);

    },

    close:function(){
        this.node.destroy();
    },

    getKVD:function(str){
        let res = {};
        let arr= new Array();

        let flag = true;
        let check = function(t_str){
            if(t_str.substr(0,1)==' '||t_str.substr(t_str.length,1)==' '){
                t_str=t_str.trim();   //删除字符串前后的空格
                flag = true;
            }else if(t_str.substr(0,1)=='['||t_str.substr(0,1)==']'){
                t_str=t_str.slice(1,-1); //前后去一个
                flag = true;
            }else if(t_str.substr(0,1)=='\''||t_str.substr(0,1)=='\''){
                t_str=t_str.slice(1,-1); //前后去一个
                flag = true;
            }else if(t_str.substr(0,1)=='"'||t_str.substr(0,1)=='"'){
                t_str=t_str.slice(1,-1); //前后去一个
                flag = true;
            }else{
                flag = false;
            }
            return t_str;
        }
        while(flag){
            str = check(str);
        }
        flag = true;

        arr = str.split(":");  
        if(arr.length==2){
            while(flag){
                arr[1] = check(arr[1]);
            }
            try {
                res=JSON.parse(`{"${arr[0]}":"${arr[1]}"}`);
            } catch (error) {
                console.error(error);
            }
            
        }else{
            console.error("getKVD err:"+str);
        }
        console.info(res);
        return res;
    }


});
