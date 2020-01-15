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
    userDto.creationTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    userDto.passwordKey  = "PLibrary"+Math.round(Math.random()*100000);
    userDto.password = globalVariable.cryptoPassFunc(userDto.passwordKey+input.password+userDto.creationTime);
    userDto.userName = input.userName;
    userDto.phoneNumber = input.phoneNumber;
    userDto.email = input.email;
    userDto.sex = input.sex;
    userDto.permission = 1;
    globalVariable.Variables.userInfo.id = 1;
    var insertRes = await sqlControler.insertColumn(userDto);
    if(insertRes.insertId){
        return await {
            type : "SUCCESS",
            message : "注册成功"
        }
    }
    return await{
        type : "ERROR",
        message : "注册失败"
    }
}

exports.userRegister = userRegister;