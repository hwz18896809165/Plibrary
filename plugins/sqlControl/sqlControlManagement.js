var sqlConnection = require('./sqlConnectSetting');
var findUserByUserKey = require("../baseControl/globalVariableManagement").findUserByUserKey

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

var insertColumn = async function(tableClass,userKey = ""){
    tableClass.creationTime = tableClass.creationTime?tableClass.creationTime:new Date().Format("yyyy-MM-dd hh:mm:ss");
    if(userKey !== ""){
        tableClass.creatorUserId = findUserByUserKey(userKey).id;
        tableClass.lastUpdateUserId = findUserByUserKey(userKey).id;
    }
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
    return JSON.parse(res);
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

var deleteColumnById = async function(tableName,id,userKey=""){
    this.sqlParams = "delete from "+tableName+" where id="+id+";";
    var res = await commitSql(this.sqlParams);
    return res;
}

var updateColumnById = async function(tableClass,userKey = ""){
    tableClass.creationTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    if(userKey !== ""){
        tableClass.lastUpdateUserId = findUserByUserKey(userKey).id;
    }
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
                resolve(JSON.stringify(err))
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
