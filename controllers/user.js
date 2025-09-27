const User = require("../modules/users");

module.exports.signUpForm = (req, res) => {
  res.render("./users/signup");
};

module.exports.signUp = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    let user = new User({
      email,
      username,
    });
    let registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User was registered!");
      res.redirect('/listings');
    })

  } catch (error) {
    // console.dir(error);
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("./users/login");
};

module.exports.loginSuccess = async (req, res) => {
  req.flash("success", "Welcome back to WanderLust!");
  let redirectUrl = res.locals.redirectUrl || '/listings';
  res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', "Log-out Done!");
    res.redirect("/listings");
  });
};