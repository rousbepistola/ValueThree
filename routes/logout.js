let express = require('express');
let router = express.Router();

router.get('/', function(req,res,next){
    req.session.destroy(function(err){
        if (err) {
            console.log(err);
        } else{
            res.redirect('/');
        }
    })
})

module.exports = router;