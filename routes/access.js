
var router = require('express').Router();
var passport = require('passport');
var Account = require('../models/account_model');

var email = require('emailjs');

var server  = email.server.connect({
    user:    "cuxi.huynh@gmail.com",
    //password:"Cuxi1116",
    password:"bsrxucrmiwizgxdu",
    host:    "smtp.gmail.com",
    ssl:     true
});

router.get('/session', function(req, res) {
    res.status(200).json(req.user);
});

router.post('/register', function(req, res) {
    // only password will be salt
    Account.register(new Account(req.body), req.body.password, function(err, result) {
        if(err) {
            res.status(500).json(err);
        }

        else {
            //console.log(result);
            res.status(200).json({message: "Registered success"});
        }
    });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    var obj = {};
    obj.username = req.user.username;
    obj.email = req.user.email;
    obj.tel = req.user.tel;
    obj._id = req.user._id;
    obj.id = req.user.id;
    //res.status(200).json(req.user);
    res.status(200).json(obj);
});

router.post('/validate', function(req, res) {
    // First send email to verify user's telephone
    var email = req.body.tel + '@tmomail.net, ' + req.body.email;
    var mailOptions = {
        from: 'cuxi.huynh@gmail.com',
        to: email,
        subject: req.body.id,
        text: 'Validation id: ' + req.body.id + ' -> use to continue your registration.'
    };

    server.send(mailOptions, function(err) {
        if (err) res.status(500).json({id: 0});

        else res.status(200).json({id: req.body.id});
    });
});
router.get('/logout', function(req, res) {
    req.logout();

    res.status(200).json({message: 'Logout Successful.'})
});

//bsrxucrmiwizgxdu

module.exports = router;


