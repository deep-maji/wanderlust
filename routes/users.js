const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const router = express.Router();
const userController = require("../controllers/user");

router.route("/signup")
  .get(userController.signUpForm)
  .post(wrapAsync(userController.signUp));

router.route("/login")
  .get(userController.loginForm)
  .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(userController.loginSuccess));

router.get("/logout", userController.logout);

module.exports = router;