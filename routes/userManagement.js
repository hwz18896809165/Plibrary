var express = require('express');
var router = express.Router();
var userManagementService = require("../modules/userManagement/userManagementService");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(req.headers.host+req.baseUrl+"/getAllUser");
});
router.get('/getAllUser',function(req,res,next){
  var input = {};
  userManagementService.getAllUser(input,function(result){
    res.send(result);
  })
});

module.exports = router;


