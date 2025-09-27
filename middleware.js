const Listing = require("./modules/listings");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schemaValidation");
const Review = require("./modules/reviews");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please log in or create an account to add your listing!");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You do not have permission to modify!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.listingValidation = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    // console.log(error.details);
    let errMsg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  else {
    next();
  }
}

module.exports.reviewValidation = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    // console.log(error.details);
    let errMsg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  else {
    next();
  }
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "Only the author of a review can delete it!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}