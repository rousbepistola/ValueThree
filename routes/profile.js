var express = require('express');
var router = express.Router();
var ssn;
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb+srv://rousbepistola:3te5hrlns2gy@cluster0-1lsui.azure.mongodb.net/test?retryWrites=true&w=majority";
const bcrypt = require('bcrypt');


/* GET home page. */
router.get('/', function(req, res, next) {
  ssn=req.session;
  if(ssn.firstName){
    ssn.loginfirst = "";
    res.render('profile', {
      name: ssn.firstName, 
      mail: ssn.userEmail
    });
  } else {
    ssn.loginfirst = "Please Login/Signup";
    ssn.errorNumber = 2;
    res.redirect('/')
  }
  
});



router.post('/', function(req, res, next){
  console.log("inside post method profile")
  ssn=req.session;
  ssn.firstName = req.body.fname;
  ssn.lastName = req.body.lname;
  ssn.userEmail = req.body.email;
  ssn.userPass = req.body.pass;
  let userExists;


  // Hashing password
  let hashed = bcrypt.hashSync(ssn.userPass, 10);

  // hasing password end

  MongoClient.connect(url, function(err, db){
    if(err) throw err;
    let dbo = db.db("projectOne");
    let myInfoLog = {email:ssn.userEmail};
    
                  // CODE BLOCK USER AUTHENTICATION
    dbo.collection("userInfo").findOne(myInfoLog, function(err, data){
      // This block checks if a user is already existing. if it exists, userExist variable is set to true 
      // and the if statement(userExist==false) below wouldn't run thus preventing existing user from signing up again
      try {
        if(data.email){
          userExists = true;
          ssn.signUpError = "User email already exists";
          ssn.errorNumber = 1;
          console.log("data returns an active email");
          db.close();
          ssn.firstName = false;
          res.redirect('/');
      }
      } catch (error) {
        console.log("email does not exists");
        MongoClient.connect(url, function(err, db){
          if(err) throw err;
          let dbo = db.db("projectOne");

        let myInfo = {fname:ssn.firstName, lname:ssn.lastName, email:ssn.userEmail, pass:hashed};
              dbo.collection("userInfo").insertOne(myInfo, function(err, data){
                if(err) throw err;
                console.log("collection inserted");

                ssn.firstName = data.ops[0].fname;
                ssn.lastName = data.ops[0].lname;
                ssn.userEmail = data.ops[0].email;
                ssn.userPass = data.ops[0].pass;
                console.log("welcome! " + ssn.firstName + " " + ssn.lastName)

                db.close();
              });

              res.redirect('/profile');

        });
        // CODE BLOCK USER AUTHENTICATION ENDS
      }
      
  });
  });
  

  // if(userExists == false){
  //       MongoClient.connect(url, function(err, db){
  //         if(err) throw err;
  //         let dbo = db.db("projectOne");
  //         let myInfoLog = {email:ssn.userEmail, pass:ssn.userPass};

  //       let myInfo = {fname:ssn.firstName, lname:ssn.lastName, email:ssn.userEmail, pass:hashed};
  //             dbo.collection("userInfo").insertOne(myInfo, function(err, data){
  //               if(err) throw err;
  //               console.log("collection inserted");

  //               ssn.firstName = data.ops[0].fname;
  //               ssn.lastName = data.ops[0].lname;
  //               ssn.userEmail = data.ops[0].email;
  //               ssn.userPass = data.ops[0].pass;
  //               console.log("welcome! " + ssn.firstName + " " + ssn.lastName)

  //               db.close();
  //             });

  //             res.redirect('/profile');

  //       });
  //       // CODE BLOCK USER AUTHENTICATION ENDS
  // }

});

module.exports = router;
