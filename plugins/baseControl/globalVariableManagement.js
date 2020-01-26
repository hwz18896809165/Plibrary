const crypto = require('crypto');

var cryptoPassFunc = function(password) {
    const md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
};

var Variables = {
    userInfo:{
        id :"",
        userKey : "",
        permission:"",
        userLoginType:false
    }
}


var isEmptyObject = function(obj) {
    for (var key in obj) {
      return false;
    }
    return true;
}

Date.prototype.Format = function(fmt)   
{   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

exports.Variables = Variables;
exports.isEmptyObject = isEmptyObject;
exports.cryptoPassFunc = cryptoPassFunc;