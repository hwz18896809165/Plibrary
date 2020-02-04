var Base = require("../basicModules/base")
class User extends Base{
    constructor(){
        super("SYS_USER");
        this.userName = this.SetColumn("varchar",100,true)
        this.password = this.SetColumn("varchar",250,true)
        this.passwordKey = this.SetColumn("varchar",50,true)
        this.phoneNumber = this.SetColumn("varchar",30)
        this.email = this.SetColumn("varchar",50)
        this.sex = this.SetColumn("int",2,true)
        this.permission = this.SetColumn("int",2,true)
        this.SetKeys("id",{},{"id":"id"})
    }
}

var user = new User()

class UserDto{
    constructor(userName,password,passwordKey,phoneNumber,email,sex,creationTime,permission){
        this.tableName = "SYS_USER"
        this.userName = userName
        this.password = password
        this.passwordKey = passwordKey
        this.phoneNumber = phoneNumber
        this.email = email
        this.sex = sex
        this.creationTime = creationTime
        this.permission = permission
    }
};

exports.user = user;
exports.userDto = UserDto;
exports.tableName = "SYS_USER";

