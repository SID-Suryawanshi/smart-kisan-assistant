const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Kisan = require("../models/Kisan");
const Buyer = require("../models/buyer");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRETE,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingKisan = await Kisan.findOne({ googleId: profile.id });
      if (existingKisan) return done(null, existingKisan);

      const newKisan = await new Kisan({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
      }).save();
      done(null, newKisan);
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingBuyer = await Buyer.findOne({ googleId: profile.id });
      if (existingBuyer) return done(null, existingBuyer);

      const newBuyer = await new Buyer({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
      }).save();
      done(null, newBuyer);
    },
  ),
);
