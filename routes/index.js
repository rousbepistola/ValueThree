var express = require('express');
var router = express.Router();
var ssn;
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb+srv://rousbepistola:3te5hrlns2gy@cluster0-1lsui.azure.mongodb.net/test?retryWrites=true&w=majority";



/* GET home page. */
router.get('/', function(req, res, next) {
  ssn = req.session;
  console.log("This is index.js");
 
// Error handler for different king of login/signup errors
  switch (ssn.errorNumber) {
    case 1:
      res.render('index', { 
        loginError: ssn.signUpError
      });
      break;
    case 2:
      res.render('index', { 
        loginError: ssn.loginfirst 
      });
      break;
    case 3:
      res.render('index', { 
        loginError: ssn.loginError
      });
      break;  
    case 4:
      res.render('index', { 
        loginError: "Login with your new password"
      });
      break;  
    default:
      res.render('index');

  }
  




});

module.exports = router;
