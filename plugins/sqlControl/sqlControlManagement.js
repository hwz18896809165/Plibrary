var sqlConnection = require('./sqlConnectSetting');

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

var createTable = async function(tableClass) {
    this.sqlParams = "create table "+tableClass.tableName+"(";
    for(var colmun in tableClass){
        if(colmun !== "tableName" && colmun !== "primaryKey" && colmun !== "foreignKey" && colmun !== "index"){
            this.sqlParams += colmun+" ";
            if(tableClass[colmun].type === "datetime" || tableClass[colmun].type === "date"){
                this.sqlParams += tableClass[colmun].type+" ";
                if(tableClass[colmun].autoNumber === true){
                    this.sqlParams += "auto_increment ";
                };
                if(tableClass[colmun].require === true){
                    this.sqlParams += "not null ";
                };
            }
            else if(tableClass[colmun].type === "decimal" || tableClass[colmun].type === "numeric"){
                this.sqlParams += tableClass[colmun].type+"("+tableClass[colmun].length+","+tableClass[colmun].maxDecimalLength+") ";
                if(tableClass[colmun].autoNumber === true){
                    this.sqlParams += "auto_increment ";
                };
                if(tableClass[colmun].require === true){
                    this.sqlParams += "not null ";
                };
            }
            else{
                this.sqlParams += tableClass[colmun].type+"("+tableClass[colmun].length+") ";
                if(tableClass[colmun].autoNumber === true){
                    this.sqlParams += "auto_increment ";
                };
                if(tableClass[colmun].require === true){
                    this.sqlParams += "not null ";
                };
            }
            this.sqlParams += ",";
        }
    }
    if(tableClass.primaryKey !==""){
        this.sqlParams += "primary key ("+tableClass.primaryKey+"),"
    }
    if(tableClass.foreignKey !=={}){
        for(var foreignKey in tableClass.foreignKey){
            this.sqlParams += "foreign key ("+foreignKey+") references "+tableClass.foreignKey[foreignKey][0]+"("+tableClass.foreignKey[foreignKey][1]+") on delete cascade on update cascade,"
        }
    }
    if(tableClass.index !={}){
        for(var index in tableClass.index){
            this.sqlParams += "key "+index+"("+tableClass.index[index]+") ";
        }
    }
    this.sqlParams += ");"
    var res = await commitSql(this.sqlParams);
    return res;
}

var insertColumn = async function(tableClass){
    tableClass.creationTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    tableClass.creatorUserId = 0;
    tableClass.lastUpdateUserId = 0;
    this.sqlParams = "insert into "+tableClass.tableName+" (";
    var sqlParams2 = "values ("
    for(var colmun in tableClass){
        if(colmun !== "tableName"){
            this.sqlParams += colmun+",";
            sqlParams2 += "'"+tableClass[colmun] + "',";
        }
    }
    this.sqlParams = this.sqlParams.substring(0,this.sqlParams.length-1)+") ";
    this.sqlParams += sqlParams2.substring(0,sqlParams2.length-1) + ");";
    var res = await commitSql(this.sqlParams);
    return res;
}

var getColumnById = async function(tableName,id){
    this.sqlParams = "select * from "+tableName+" where id="+id+";";
    var res = await commitSql(this.sqlParams);
    return JSON.parse(res);
}

var getAllColumns = async function(tableName){
    this.sqlParams = "select * from "+tableName+";";
    var res = await commitSql(this.sqlParams);
    return JSON.parse(res);
}

var deleteColumnById = async function(tableName,id){
    this.sqlParams = "delete from "+tableName+" where id="+id+";";
    var res = await commitSql(this.sqlParams);
    return res;
}

var updateColumnById = async function(tableClass){
    tableClass.creationTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    tableClass.creatorUserId = 0;
    tableClass.lastUpdateUserId = 0;
    this.sqlParams = "update "+tableClass.tableName+" set ";
    for(var colmun in tableClass){
        if(colmun !== "tableName" && colmun !== "id"){
            this.sqlParams += colmun+"='"+tableClass[colmun]+"', "
        }
    }
    this.sqlParams = this.sqlParams.substring(0,this.sqlParams.length-2)+" where id='"+tableClass.id+"';";
    var res = await commitSql(this.sqlParams);
    return res;
}

var executeSql = async function(sqlString){
    var res = await commitSql(sqlString);
    return res;
}

var commitSql = function(sqlParams) {
    var promise =  new Promise(function(resolve, reject) {
        sqlConnection.query(sqlParams,function(err,res) {
            if(err){
                if(err.errno === 1050){
                    resolve(null);
                }
            }
            else{
                resolve(JSON.stringify(res));
            }
        })
    })
    return promise
}

exports.createTable = createTable;
exports.insertColumn = insertColumn;
exports.getColumnById = getColumnById;
exports.getAllColumns = getAllColumns;
exports.deleteColumnById = deleteColumnById;
exports.executeSql = executeSql;
exports.updateColumnById = updateColumnById;
