var express = require('express');
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var router = express.Router();
var User = require('../model/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.location('/');
  res.redirect('/');
});

//show login page
router.get('/login',function (req, res, next) {
    res.render('login', {'title': 'Login'});
  //  console.log('login rendered');
});

//show register page
router.get('/register',function (req, res, next) {
    res.render('register', {'title': 'Register'});
});

//process register form
router.post('/register',function (req, res, next) {
   //get form values
    var username =req.body.username;
    var pass = req.body.pass;
    var cpass = req.body.cpass;
    var email = req.body.email;
    var fname = req.body.fname;
    var dob = req.body.dob;

    //validation
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('pass','Password is required').notEmpty();
    req.checkBody('cpass','Passwords miss matched').equals(pass);
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email not valid').isEmail();

    //errors
    var errors = req.validationErrors();
    if(errors){
        res.render('register', {
            title: 'Register',
            errors: errors,
            username: username,
            pass: pass,
            cpass: cpass,
            email: email,
            fname: fname,
            dob: dob
        });
    } else {
      var newUser = new User({
          username: username,
          pass: pass,
          email: email,
          fullName: fname,
          dob: dob
      });
      //create user
        User.createUser(newUser,function (err,user) {
            if(err){
              console.log(err);
            }
            console.log(user);
        });
        //send flash message
        req.flash('success','You are registered and good to login');
        res.location('/');
        res.redirect('/');

    }
});


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function (username,password,done) {
        User.getUserByUsername(username,function (err,user) {
           if(err) throw err;
           if(!user) {
               console.log('Unknown user');
               return done(null,false,{message: 'Username not found in database'});
           }
           User.comparePassword(password,user.pass,function (err,isMatch) {
              if(err) throw err;
              if(isMatch){
                return done(null,user);
              } else {
                  console.log('Invalid password');
                return done(null,false,{message:'Wrong Password for the username'});
              }
           });
        });
    }
));

router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash: true}), function (req,res) {
  console.log('Authentication OK');
  req.flash('success','You are logged in');
  res.redirect('/');
});

router.get('/logout',function (req, res) {
    req.logout();
    req.flash('success', 'Logout complete')
    res.redirect('/users/login');
});

module.exports = router;
