var express = require('express');
var router = express.Router();
var ssn;
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb+srv://rousbepistola:3te5hrlns2gy@cluster0-1lsui.azure.mongodb.net/test?retryWrites=true&w=majority";
let nodemailer = require('nodemailer');

router.post('/', function(req, res, next) {
    ssn = req.session;
    console.log("password about to generate");

    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        let dbo = db.db("projectOne");
        let myInfoLog = {email:req.body.email};
        

        dbo.collection("userInfo").findOne(myInfoLog, function(err, data){
            try{
                if(data.email){
                    okayToGenerate = true;
                    console.log("data email is existing. about to change pass");
                    ssn.updatePassEmail = req.body.email;
                    
                    function generatePassword() {
                        var length = 8,
                            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                            retVal = "";
                        for (var i = 0, n = charset.length; i < length; ++i) {
                            retVal += charset.charAt(Math.floor(Math.random() * n));
                        }
                        return retVal;
                    }
                    ssn.temporaryPass = generatePassword();
                    console.log(ssn.temporaryPass);
                
                    let transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true, 
                        service: 'gmail',
                        auth: {
                            user: 'test.audreysedgeley@gmail.com',
                            pass: '3te5hrlns2gy'
                        }
                    });
                    console.log("okay til here1")
                    let mailOptions = {
                        from: 'test.audreysedgeley@gmail.com',
                        to: req.body.email,
                        subject: `This is your temporary password`,
                        text: `${ssn.temporaryPass}`
                    };

                    console.log("okay til here")
                    transporter.sendMail(mailOptions, function (error, info) {
                        console.log("Inside sendmail");
                        if (error){
                            console.log("email did not send")
                        } else{
                            console.log("message sent with temporary password")
                            res.render('forgotpass', {yesemail:'check your email for temporary password'})
                        }
                    });

                 }
            } catch (error){
                res.render('forgotpass', {noemail:"The email you entered is not on our system"});
            }
        });
        
          
      });


  });
  module.exports = router;







