var express = require('express');
var router = express.Router();
var ssn;
let nodemailer = require('nodemailer');


router.post('/', function(req, res, next){
    try {
        console.log("entered Mailer")
    ssn = req.session;
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;

    console.log(name,email,message)

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
    let mailOptions = {
        from:process.env.NODEMAILER_EMAIL,
        to: email,
        subject: 'Thank you for contacting Vallue Three!',
        text: `Hi ${name}!, we received your message: "${message}"  We will respond to you as soon as we can!`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error){
            console.log("some fields missing", error)
            let contactSuccess = "please populate all fields";
            res.render('contact', {mailer: contactSuccess});
            
          } else{
            console.log("message sent")
            let contactSuccess = "Thank you for contacting us! We will respond as soon as we can";
            res.render('contact', {mailer: contactSuccess});
          }
    });
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
    
});

module.exports = router;

