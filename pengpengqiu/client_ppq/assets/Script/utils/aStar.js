var dataScript = require('../model/dataScript')

var mapArr = new Map();

//这里较耗时
var setMap = function(map){
    mapArr = map;
    // for (let i = 0; i < 5; i++) {
    //     for (let j = 0; j < 5; j++) {
    //         mapArr.set(tomapkey(cc.v2(i,j)),{
    //             point:cc.v2(i,j),
    //             type:0
    //         })
    //     }
    // }

    // console.info(mapArr)
}

// startPos:起始位置
// endpos:目标位置
// out:输出结果
var findRote = function(startPos,endPos,out){
    // let start_time = new Date().getTime();//起始时间
    // 一个记录下所有被考虑来寻找最短路径的方块（称为open 列表）
    // 一个记录下不会再被考虑的方块（成为closed列表）
    let closed = new Array();
    let open  = new Array();
    let closedMap = new Map();

    if(!mapArr.has(dataScript.gamedata.tomapkey(startPos))){
        console.info("startPos不是有效的寻路",startPos);
        return closed;
    }
    if(!mapArr.has(dataScript.gamedata.tomapkey(endPos))){
        console.info("endPos不是有效的寻路",endPos);
        return closed;
    }

    // console.info("开始寻路");
    let count = 0;
    closed.push(startPos);
    closedMap.set(dataScript.gamedata.tomapkey(cc.v2(startPos.x,startPos.y)),cc.v2(startPos.x,startPos.y));
    while(!((closed[closed.length-1].x==endPos.x)&&(closed[closed.length-1].y==endPos.y))){
        let now_find = closed[closed.length-1];
        open = new Array();
        setOpen(open,now_find,closedMap);
        count++;
        if(count>2000){
            console.info("太远了或发生错误-寻路中断");
            break;
        }
        if(open.length>0){
            let F = 999999999;
            closed.push(open[0]);
            for (let index = 0; index < open.length; index++) {
                const element = open[index];
                // G是从开始点A到当前方块的移动量。所以从开始点A到相邻小方块的移动量为1，该值会随着离开始点越来越远而增大。
                // H是从当前方块到目标点（我们把它称为点B，代表骨头！）的移动量估算值。这个常被称为探视，因为我们不确定移动量是多少 – 仅仅是一个估算值。
                let G = Math.sqrt((now_find.x-element.x)*(now_find.x-element.x)+(now_find.y-element.y)*(now_find.y-element.y));
                let H = Math.sqrt((element.x-endPos.x)*(element.x-endPos.x)+(element.y-endPos.y)*(element.y-endPos.y));

                let Gx = Math.abs(now_find.x-element.x);
                let Gy = Math.abs(now_find.y-element.y);
                let Hx = Math.abs(element.x-endPos.x);
                let Hy = Math.abs(element.y-endPos.y);

                let nowF = Gx+Gy+Hx+Hy;
                if(nowF<F){
                    F = nowF;
                    closed.pop();
                    closed.push(element);
                    closedMap.set(dataScript.gamedata.tomapkey(cc.v2(element.x,element.y)),cc.v2(element.x,element.y));
                }
                //取最短
                if(G+H<F){
                    F = G+H;
                    closed.pop();
                    closed.push(element);
                }
            }
        }else{
            console.info("寻路中断");
            break;
        }
    }
    //
    closedMap.clear();
     out = closed;
    //  let end_time =new Date().getTime();//接受时间
    //  let use_time = end_time- start_time;
    //  console.info("找到目标，用时"+use_time+"ms");//返回函数执行需要时间
     return out;
}

var setOpen = function(open,pos,except_map){
    let arr = new Array();
    arr.push(cc.v2(pos.x-1,pos.y-1));
    arr.push(cc.v2(pos.x-1,pos.y));
    arr.push(cc.v2(pos.x-1,pos.y+1));

    arr.push(cc.v2(pos.x,pos.y-1));
    arr.push(cc.v2(pos.x,pos.y+1));

    arr.push(cc.v2(pos.x+1,pos.y-1));
    arr.push(cc.v2(pos.x+1,pos.y));
    arr.push(cc.v2(pos.x+1,pos.y+1));

    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if(except_map.has(dataScript.gamedata.tomapkey(element))){
            continue;
        }
        if(mapArr.has(dataScript.gamedata.tomapkey(element))){
            open.push(element);
        }
    }

}

module.exports = {
    findRote:findRote,
    setMap:setMap
};