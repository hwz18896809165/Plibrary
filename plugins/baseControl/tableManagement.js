var sqlControler = require("../sqlControl/sqlControlManagement")
var user = require("../../modules/userManagement/user").user


var createTables = async function(){
    var tables = [];
    tables.push(user)
    for(var table in tables){
        var res = await sqlControler.createTable(tables[table]);
        if(res){
            console.log(tables[table].tableName+"表新建成功!")
        }else{
            console.log(tables[table].tableName+"表已存在!")
        }
    }
}

createTables();