const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")
const passport = require("../config/passport")

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res) => {
  res.render("auth/signup")
})

router.post('/signup', async (req, res) => {
  const {email, username, password} = req.body

  const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(12))

  await User.create({
    email,
    username,
    password: hashPass
  })

  res.redirect("/signin")
})

router.get("/signin", (req, res) => {
  res.render("auth/signin")
})

router.post("/signin", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/signin"
}));

router.get('/secret', isAuth, (req, res) => {
  res.send("Permitido")
})

function isAuth(req, res, next){
  if(req.isAuthenticated()){
    next()
  }else{
    res.send("Prohibido")
  }
}

module.exports = router;
