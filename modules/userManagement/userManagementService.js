var sqlControler = require("../../plugins/sqlControl/sqlControlManagement")
var userDto = require("./user").userDto
var globalVariable = require("../../plugins/baseControl/globalVariableManagement")

var userRegister = async function(input){
    if(globalVariable.isEmptyObject(input) || input.userName === "" || input.password === ""){
        return await {
            type : "ERROR",
            message:"请求条件不能为空"
        };
    }
    var userInfo = await sqlControler.getAllColumns(userDto.tableName);
    var findUser = false;
    for(var userIndex in userInfo){
        if(userInfo[userIndex].userName === input.userName){
            findUser = true;
            break;
        }
    }
    if(findUser === true){
        return await {
            type : "ERROR",
            message : "用户名已存在"
        };
    }
}

exports.userRegister = userRegister;