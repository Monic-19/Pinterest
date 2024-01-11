var express = require('express');
var router = express.Router();

const userModel = require('./users')
const postModel = require("./post")

const localStrategy = require('passport-local');
const passport = require('passport');
passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', isloggedin ,function(req, res) {
  res.render('profile');
});

router.get('/login',function(req, res) {
  res.render('login');
});

router.get('/feed',function(req, res) {
  res.render('feed');
});

router.post("/register", function (req, res) {
  var userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
  })

  userModel.register(userData, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      })
    })
})

router.post("/login",passport.authenticate("local",{
  successRedirect : "/profile",
  failureRedirect: "/login"
}), function(req,res){})

router.get("/logout", function(req,res,next){
  req.logOut(function(err){
    if(err) return next(err);
    res.redirect("/")
  })
})

function isloggedin(req,res,next){
  if(req.isAuthenticated()){return next()}
  res.redirect("/login")
}


module.exports = router;
