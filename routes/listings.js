const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const { isLoggedIn, isOwner, listingValidation } = require("../middleware");
const listingController = require("../controllers/listings");
const multer  = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({ storage })

router.route("/")
  // Index Route
  .get(wrapAsync(listingController.index))
  // Create Route
  .post(isLoggedIn, listingValidation, upload.single('listing[image]'), wrapAsync(listingController.createNewListing));

// New Route
router.get("/new", isLoggedIn, listingController.renderCreateForm);

router.route('/:id')
  // Show Route
  .get(wrapAsync(listingController.showListings))
  // Update Route
  .put(isLoggedIn, isOwner, listingValidation, upload.single('listing[image]'), wrapAsync(listingController.updateListings))
  // Delete Route 
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListingsForm));

module.exports = router;