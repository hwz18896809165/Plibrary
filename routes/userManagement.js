var express = require('express');
var router = express.Router();
var userManagementService = require("../modules/userManagement/userManagementService");

router.get('/', function(req, res, next) {
  res.send(req.headers.host+req.baseUrl+"/userRegister");
});

router.get('/userRegister',async function(req,res,next){
  var input = {userName : "hwz",password:"222"}
  var res = await userManagementService.userRegister(input);
  console.log(res)
})

module.exports = router;



