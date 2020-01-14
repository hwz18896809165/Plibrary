var Base = require("../basicModules/base")
class User extends Base{
    constructor(){
        super("SYS_USER");
        this.userName = this.SetColumn("varchar",50,true)
        this.remark = this.SetColumn("varchar",1024)
        this.phoneNumber = this.SetColumn("varchar",30)
        this.email = this.SetColumn("varchar",50)
        this.sex = this.SetColumn("int",2)
        this.limits = this.SetColumn("int",5,true)
        this.score = this.SetColumn("decimal",10,false,5)
        this.SetKeys("id",{},{"id":"id"})
    }
}

var user = new User()
var userDto = {
    tableName : "SYS_USER",
    userName : "",
    remark : "",
    phoneNumber : "",
    email : "",
    sex : 0,
    limits : 0,
    score : 0.0
}

module.exports = userDto