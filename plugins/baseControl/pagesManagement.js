//分页

var paging = function(list,start,length){
    var start = Number(start);
    var end = list.length;
    if(start + Number(length) < end){
        end = start + Number(length);
    }
    return list.slice(start,end);
}


//查询
var search = function(list,key,value){
    var results = [];
    for(var index in list){
        if(list[index][key].search(value) !== -1){
            results.push(list[index]);
        }
    }
    return results;

}

exports.paging = paging;
exports.search = search;