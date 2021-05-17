const passport = require("passport")
const bcrypt = require("bcrypt")
const LocalStrategy = require("passport-local").Strategy
const User = require("../models/User")


passport.use(new LocalStrategy({
  usernameField: "email"
}, async (email, password, done) => {
  const user = await User.findOne({email})

  if(!user) return done(null, false, { message : "Incorrect email"})

  if(!bcrypt.compareSync(password, user.password)) {
    return done(null, false, { message : "Incorrect password"})
  }

  done(null, user)
})); //       |
//            ----------👇
passport.serializeUser((user, cb) => {
  cb(null, user._id)
}) // |
//    --------------------------👇
passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id)
  cb(null, user) // este callback final, guarda al usuario en la sesion.
})

module.exports = passport
