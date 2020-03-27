var express = require('express');
var router = express.Router();
var ssn;
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb+srv://rousbepistola:3te5hrlns2gy@cluster0-1lsui.azure.mongodb.net/test?retryWrites=true&w=majority";

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Signup' });
});

// good



module.exports = router;
