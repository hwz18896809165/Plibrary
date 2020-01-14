var sqlControler = require("../../plugins/sqlControl/sqlControlManagement")
var userDto = require("./user")

class userManagementService{
    constructor(){}
    getAllUser(input,callback){
        sqlControler.getAllColumns(userDto.tableName,callback);
    }
}

module.exports = new userManagementService();