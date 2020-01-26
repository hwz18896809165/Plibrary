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
    userDto.sex = input.sex == "男" ? 0 : 1 ;
    userDto.permission = 1;
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

var userLogin = async function(input){
    if(globalVariable.isEmptyObject(input) || input.userName === "" || input.password === ""){
        return await {
            type : "ERROR",
            message:"请求条件不能为空"
        };
    }
    if(globalVariable.Variables.userInfo.userLoginType === true){
        return await{
            type:"ERROR",
            message:"当前用户已登录"
        }
    }
    var users = await sqlControler.getAllColumns(userDto.tableName);
    var userInfo = {};
    var findUser = false;
    for(var userIndex in users){
        if(users[userIndex].userName === input.userName){
            findUser = true;
            userInfo = users[userIndex];
            break;
        }
    }
    if(findUser === false){
        return await {
            type : "ERROR",
            message : "该用户不存在"
        };
    }
    var alterPassword = globalVariable.cryptoPassFunc(userInfo.passwordKey+input.password+new Date(userInfo.creationTime).Format("yyyy-MM-dd hh:mm:ss"));
    if(alterPassword === userInfo.password){
        globalVariable.Variables.userInfo.id = userInfo.id;
        globalVariable.Variables.userInfo.permission = userInfo.permission;
        globalVariable.Variables.userInfo.userKey = globalVariable.cryptoPassFunc(userInfo.userName+userInfo.password+new Date().Format("yyyy-MM-dd hh:mm:ss"));
        globalVariable.Variables.userInfo.userLoginType = true
        return await{
            type:"SUCCESS",
            message:"登录成功",
            userKey:globalVariable.Variables.userInfo.userKey
        }
    }
    return await{
        type:"ERROR",
        message:"密码错误"
    }
}

exports.userRegister = userRegister;
exports.userLogin = userLogin;