var express = require('express');
var router = express.Router();

const userModel = require('./users')
const postModel = require("./post")

const localStrategy = require('passport-local');
const passport = require('passport');
passport.use(new localStrategy(userModel.authenticate()))

const upload = require("./multer")

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', isloggedin ,async function(req, res) {
  const errorMessage = req.flash('error');
  const user = await userModel.findOne({
    username : req.session.passport.user
  })
  .populate("posts");
  console.log(user)
  res.render('profile', {user, errorMessage});
});

router.get('/login',function(req, res) {
  res.render('login', {error : req.flash("error")});
});

router.get('/feed',function(req, res) {
  res.render('feed');
});

router.post("/upload", isloggedin ,upload.single("file") ,async function(req,res){
  if(!req.file){
    req.flash('error', 'File upload failed. Please try again.');
    return res.redirect('/profile');
  }

  // save post ko user ke me dalo

  const user = await userModel.findOne({username : req.session.passport.user});

  const post = await postModel.create({
    image : req.file.filename,
    imagetext : req.body.filecaption ? req.body.filecaption : " ",
    user : user._id,
  })

  user.posts.push(post._id);
  await user.save();
  req.flash('success', 'File uploaded successfully!');
  res.redirect("/profile");

})

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
  failureRedirect: "/login",
  failureFlash : true,
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
