const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_KEY,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      const user = await User.findOne({ googleId: profile.id });
      if (!user) {
        const newUser = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName,
          image: profile.photos[0].value,
        });
        return cb(null, newUser);
      }
      return cb(null, user);
    }
  )
);

// esto recibimos del formulario
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      const user = await User.findOne({ email });

      //done ~ next
      if (!user) return done(null, false, { message: "Incorrect email" });

      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: "Incorrect password" });
      }

      done(null, user);
    }
  )
); //              |
//                  -----👇
passport.serializeUser((user, cb) => {
  cb(null, user._id);
}); //       |
//           -------------------👇
passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id);
  cb(null, user); // este callback final, guarda al usuario en la sesion.
});

module.exports = passport;
