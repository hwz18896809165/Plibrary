var express = require('express');
var router = express.Router();
var userManagementService = require("../modules/userManagement/userManagementService");

router.get('/', function(req, res, next) {
  res.send(req.headers.host+req.baseUrl+"/userRegister");
});

router.post('/userRegister',async function(req,res,next){
  var result = await userManagementService.userRegister(req.body);
  res.send(result);
})

router.post('/userLogin',async function(req,res,next){
  var result = await userManagementService.userLogin(req.body);
  res.send(result);
})

router.post('/addUser',async function(req,res,next){
  var result = await userManagementService.addUser(req.body);
  res.send(result);
})

router.post('/checkLogin',async function(req,res,next){
  var result = await userManagementService.checkLogin(req.body);
  res.send(result);
})

router.post('/userLogout',async function(req,res,next){
  var result = await userManagementService.userLogout(req.body);
  res.send(result);
})
router.post('/getAllUser',async function(req,res,next){
  var result = await userManagementService.getAllUser(req.body);
  res.send(result);
})

module.exports = router;



