
var self = this; 
var maxRow = 10;
var maxCol = 10;

var findLines = function(begin,end){
    if(begin.row==end.row&&begin.col==end.col){
        return false;
    }
    let lines = new Array();
    let line = new Array();
    line.push(begin);

    let flag = true;
    while(flag){
        flag =  self.__findLines(lines,line,begin,end);
    }
    
    
    return lines;
}

var __findLines = function(lines,line,begin,end){
    if(self.findNexts(begin,line).length<=0){
        return false;
    }
    for (let index = 0; index < self.findNexts(begin,line).length; index++) {
        const element = array[index];
        //终点
        if(element == end){
            line.push(end);
            lines.push(line);
            continue;
        }
        //继续走
        line.push(element);
       
    }

}

var findNexts = function(begin,line){
    let blocks = new Array();
    if(begin.row==0){
        if(begin.col==0){
            if(getPointByLine(begin.row+1,begin.col,line)){
                blocks.push(getPointByLine(begin.row+1,begin.col,line));
            }
            if(blocks.push(getPointByLine(begin.row,begin.col+1,line))){
                blocks.push(getPointByLine(begin.row,begin.col+1,line));
            }
        }else if(begin.col==maxCol){
            if(blocks.push(getPointByLine(begin.row+1,begin.col,line))){
                blocks.push(getPointByLine(begin.row+1,begin.col,line));
            }

            if(blocks.push(getPointByLine(begin.row,begin.col-1,line))){
                blocks.push(getPointByLine(begin.row,begin.col-1,line));
            }
        } else{
            if (blocks.push(getPointByLine(begin.row+1,begin.col,line))) {
                blocks.push(getPointByLine(begin.row+1,begin.col,line));
            }
            if (blocks.push(getPointByLine(begin.row,begin.col+1,line))) {
                blocks.push(getPointByLine(begin.row,begin.col+1,line));
            }
            if ( blocks.push(getPointByLine(begin.row,begin.col-1,line))) {
                blocks.push(getPointByLine(begin.row,begin.col-1,line));
            }
        }
    }else if(begin.row ==maxRow){
        if(begin.col==0){
            if (blocks.push(getPointByLine(begin.row-1,begin.col,line))) {
                blocks.push(getPointByLine(begin.row-1,begin.col,line));
            }
            if(blocks.push(getPointByLine(begin.row,begin.col+1,line))){
                blocks.push(getPointByLine(begin.row,begin.col+1,line));
            }
            
        }else if(begin.col==maxCol){
            if (blocks.push(getPointByLine(begin.row-1,begin.col,line))) {
                blocks.push(getPointByLine(begin.row-1,begin.col,line));
            }
            if(blocks.push(getPointByLine(begin.row,begin.col-1,line))){
                blocks.push(getPointByLine(begin.row,begin.col-1,line));
            }
            
        } else{
            if(blocks.push(getPointByLine(begin.row-1,begin.col,line))){
                blocks.push(getPointByLine(begin.row-1,begin.col,line));
            }
            if (blocks.push(getPointByLine(begin.row,begin.col+1,line))) {
                blocks.push(getPointByLine(begin.row,begin.col+1,line));
            }
            if (blocks.push(getPointByLine(begin.row,begin.col-1,line))) {
                blocks.push(getPointByLine(begin.row,begin.col-1,line));
            }
            
        }
    }else{
        if(begin.col==0){
            if(blocks.push(getPointByLine(begin.row-1,begin.col,line))){
                blocks.push(getPointByLine(begin.row-1,begin.col,line));
            }
            if (blocks.push(getPointByLine(begin.row+1,begin.col,line))) {
                blocks.push(getPointByLine(begin.row+1,begin.col,line));
            }
            if (blocks.push(getPointByLine(begin.row,begin.col+1,line))) {
                blocks.push(getPointByLine(begin.row,begin.col+1,line));
            }
        }else if(begin.col==maxCol){
            if(blocks.push(getPointByLine(begin.row-1,begin.col,line))){
                blocks.push(getPointByLine(begin.row-1,begin.col,line));
            }
            if (blocks.push(getPointByLine(begin.row+1,begin.col,line))) {
                blocks.push(getPointByLine(begin.row+1,begin.col,line));
            }
            if(blocks.push(getPointByLine(begin.row,begin.col-1,line))){
                blocks.push(getPointByLine(begin.row,begin.col-1,line));
            }
        } else{
            if(blocks.push(getPointByLine(begin.row-1,begin.col,line))){
                blocks.push(getPointByLine(begin.row-1,begin.col,line));
            }
            if (blocks.push(getPointByLine(begin.row+1,begin.col,line))) {
                blocks.push(getPointByLine(begin.row+1,begin.col,line));
            }
            if (blocks.push(getPointByLine(begin.row,begin.col+1,line))) {
                blocks.push(getPointByLine(begin.row,begin.col+1,line));
            }
            if(blocks.push(getPointByLine(begin.row,begin.col-1,line))){
                blocks.push(getPointByLine(begin.row,begin.col-1,line));
            }
        }
    }
}

var getPointByLine = function(row,col,line){

    let point;
    //是障碍点
    if(point.haspoint){
        return null
    }
     //是走过的点
     if(line.indexOf(point)!=-1){
        return null;
    }
    return point;
}