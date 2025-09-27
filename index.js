if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modules/users");

// Routes
const listings = require("./routes/listings");
const reviews = require("./routes/reviews");
const users = require("./routes/users");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// const DB_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const ATLAS_DBURL = process.env.ATLAS_DB_URL;
async function main() {
  await mongoose.connect(ATLAS_DBURL);
}

main()
  .then((result) => {
    console.log("DB Connected.");
  })
  .catch((error) => {
    console.log("DB Error - ", error);
  })

const store = MongoStore.create({
  mongoUrl : ATLAS_DBURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter : 24 * 3600
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expries: Date.now() * 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionOptions));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", ejsMate);

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
})

app.get("/", (req, res) => {
  throw new ExpressError(404, "Page not found!");
})

// Listings
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

// Handel not matched root
app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
})

// Error Handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong." } = err;
  res.status(statusCode).render("error", { message });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})