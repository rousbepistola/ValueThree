var express = require('express');
var router = express.Router();
var ssn;
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb+srv://rousbepistola:3te5hrlns2gy@cluster0-1lsui.azure.mongodb.net/test?retryWrites=true&w=majority";
const bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
    ssn = req.session;
    console.log("This is forgotpass.js");
    res.render('forgotpass');
   
  });


  router.post('/', function(req, res, next) {
    ssn = req.session;
    let hashed = bcrypt.hashSync(req.body.newpass, 10);
    console.log("This is forgotpass.js POST method");

    if((ssn.temporaryPass == req.body.temppass) && (ssn.updatePassEmail == req.body.email)){
        if(req.body.newpass != req.body.confirmpass){
            res.render('forgotpass', {passnomatch: "your new passwords does not match"});
        }
        MongoClient.connect(url, function(err, db){
            if(err) throw err; 
            let dbo = db.db("projectOne");
  
          let myInfo = {email:req.body.email};
                dbo.collection("userInfo").updateOne(myInfo,{$set: {pass: hashed}}, function(err, data){
                  if(err) throw err;
                  console.log("password updated");
                  db.close();
                });

            })
            ssn.errorNumber = 4;
            res.redirect('/');
        } else {
            res.render('forgotpass', {nomatch: "Email or temporary password fields did not match our records"}); //THIS MIGHT CAUSE A PROBLEM AS NO PROPER HANDLER TO EMAIL VALIDATION<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        }
    })

module.exports = router;