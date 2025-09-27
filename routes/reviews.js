const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams: true });
const { reviewValidation, isLoggedIn,isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews");

// Post Review Route
router.post("/",isLoggedIn, reviewValidation, wrapAsync(reviewController.postReview))

// Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destoryReview))

module.exports = router;