var sqlControler = require("../../plugins/sqlControl/sqlControlManagement");
var userDto = require("./user").userDto;
var userTableName = require("./user").tableName;
var globalVariable = require("../../plugins/baseControl/globalVariableManagement");
var mailManagement = require("../../plugins/baseControl/mailManagement");
var pageManagement = require("../../plugins/baseControl/pagesManagement");

var userRegister = async function(input){
    if(globalVariable.isEmptyObject(input) || input.userName === "" || input.password === "" || input.email === ""){
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
    var connectingKey = globalVariable.cryptoPassFunc(new Date().Format("yyyy-MM-dd hh:mm:ss")+input.userName);
    var connectingValue = Math.round(Math.random()*10000);
    globalVariable.User.connectingUsers[connectingKey] = {
        connectingValue : connectingValue,
    }
    globalVariable.User.connectingUsers[connectingKey].userDto = new userDto(input.userName,input.password,"PLibrary"+Math.round(Math.random()*100000),input.phoneNumber,input.email,input.sex == "男" ? 0 : 1,new Date().Format("yyyy-MM-dd hh:mm:ss"),9);
    mailManagement.sendRegisterInfo({
        email : input.email,
        code : connectingValue
    })
    return await{
        type : "CONNECTING",
        message : "邮件已发送",
        connectingKey : connectingKey
    }
}
var addUser = async function(input){
    if(input.checkUserCode == globalVariable.User.connectingUsers[input.connectingKey].connectingValue){
        var userDto = globalVariable.User.connectingUsers[input.connectingKey].userDto;
        delete  globalVariable.User.connectingUsers[input.connectingKey];
        userDto.password = globalVariable.cryptoPassFunc(userDto.passwordKey+userDto.password+userDto.creationTime);
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
    return await{
        type : "ERROR",
        message : "验证码不正确，注册失败"
    }
}

var userLogin = async function(input){
    if(globalVariable.isEmptyObject(input) || input.userName === "" || input.password === ""){
        return await {
            type : "ERROR",
            message:"请求条件不能为空"
        };
    }
    if(input.userName in globalVariable.User.users && globalVariable.User.users[input.userName].userLoginType == true){
        return await{
            type:"ERROR",
            message:"当前用户已登录"
        }
    }
    var users = await sqlControler.getAllColumns(userTableName);
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
        var loginKey = globalVariable.cryptoPassFunc(userInfo.userName+userInfo.password+new Date().Format("yyyy-MM-dd hh:mm:ss"));
        globalVariable.User.users[input.userName] = {};
        globalVariable.User.users[input.userName].userId= userInfo.id;
        globalVariable.User.users[input.userName].userKey = loginKey;
        globalVariable.User.users[input.userName].permission = userInfo.permission;
        globalVariable.User.users[input.userName].userLoginType = true;
        //mailManagement.sendLoginInfo(userInfo.email);
        return await{
            type:"SUCCESS",
            message:"登录成功",
            userKey:loginKey,
            userName:userInfo.userName
        }
    }
    return await{
        type:"ERROR",
        message:"密码错误"
    }
}

var checkLogin = async function(input){
    var loginType = false;
    if(input.userName !== ""){
        if(input.userName in globalVariable.User.users && globalVariable.User.users[input.userName].userKey == input.userKey && globalVariable.User.users[input.userName].userLoginType == true){
            loginType = true;
        }
    }
    return await{
        type : "SUCCESS",
        message :"",
        userLoginType : loginType
    }
}

var userLogout = async function(input){
    var checkUser= await checkLogin(input);
    if(checkUser.userLoginType === true){
        globalVariable.User.users[input.userName].userLoginType = false;
    }
    return await{
        type:"SUCCESS",
        message :{
            userLoginType : false
        }
    }
}


var getAllUser = async function(input){
    console.log(input)
    var userInfo = globalVariable.findUserByName(input.userName);
    if(userInfo.permission !== 1){
        return await{
            type : "FAILED",
            message : "您没有该权限",
            draw :Number(input.draw),
            recordsTotal : 0,
            recordsFiltered :0 ,
            data : []
        }
    }
    if(userInfo.userKey !== input.userKey){
        return await{
            type : "FAILED",
            message : "获取失败！",
            draw :Number(input.draw),
            recordsTotal : 0,
            recordsFiltered :0 ,
            data : []
        }
    }
    var users = await sqlControler.getAllColumns(userTableName);
    console.log(users)
    var userInfos = []
    if(users.length>0){
        for(var userIndex in users){
            var userDto = {};
            userDto.userId = users[userIndex].id;
            userDto.userName = users[userIndex].userName;
            userDto.sex = users[userIndex].sex == 0 ? "男" : "女";
            userDto.phoneNumber = users[userIndex].phoneNumber;
            userDto.email = users[userIndex].email;
            switch(users[userIndex].permission)
            {
                case 1 : userDto.identity = "系统管理员";
                break;
                case 2 : userDto.identity = "普通管理员";
                break;
                case 3 : userDto.identity = "教师";
                break;
                case 4 : userDto.identity = "学生";
                break;
                default : userDto.identity = "游客";
                break;
            }
            userDto.creationTime = users[userIndex].creationTime;
            userInfos.push(userDto);
        }
    }
    console.log(userInfos)
    userInfos.sort(function(a,b){
        return Number(new Date(a.creationTime)) - Number(new Date(b.creationTime))
    })
    if(input['search[userName]'] !== ""){
        userInfos = pageManagement.search(userInfos,'userName',input['search[userName]']);
    }
    if(input['search[identity]'] !== ""){
        userInfos = pageManagement.search(userInfos,'identity',input['search[identity]']);
    }
    var results  =pageManagement.paging(userInfos,input.start,input.length);
    return await{
        type : "SUCCESS",
        message : "获取成功",
        draw :Number(input.draw),
        recordsTotal : userInfos.length,
        recordsFiltered :userInfos.length,
        data : results
    }

}

exports.userRegister = userRegister;
exports.userLogin = userLogin;
exports.addUser = addUser;
exports.checkLogin = checkLogin;
exports.userLogout = userLogout;
exports.getAllUser = getAllUser;