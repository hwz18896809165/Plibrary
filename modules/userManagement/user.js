var Base = require("../basicModules/base")
class User extends Base{
    constructor(){
        super("SYS_USER");
        this.userName = this.SetColumn("varchar",50,true)
        this.password = this.SetColumn("varchar",50,true)
        this.passwordKey = this.SetColumn("varchar",250,true)
        this.phoneNumber = this.SetColumn("varchar",30)
        this.email = this.SetColumn("varchar",50)
        this.sex = this.SetColumn("int",2,true)
        this.permission = this.SetColumn("int",2,true)
        this.SetKeys("id",{},{"id":"id"})
    }
}

var user = new User()
var userDto = {
    tableName : "SYS_USER",
    userName : "",
    password : "",
    passwordKey : "",
    phoneNumber : "",
    email : "",
    sex : 0,
    permission : 0
}


exports.user = user;
exports.userDto = userDto;

