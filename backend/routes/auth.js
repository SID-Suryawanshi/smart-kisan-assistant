const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: req.query.role,
  }),
  authenticator(req, res, next),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login.html" }),
  (req, res) => {
    const user = req.user;
    const role = user.role; // Assume you saved this in the DB
    const id = user._id;

    // Redirect back to your frontend with info (or a token)
    res.redirect(
      `http://localhost:3000/auth-success.html?id=${id}&role=${role}`,
    );
  },
);
