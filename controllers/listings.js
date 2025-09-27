const Listing = require("../modules/listings");
const { geocoding, config  } = require("@maptiler/client");

config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
  let listings = await Listing.find();
  res.render("./listings/index", { listings });
};

module.exports.renderCreateForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.createNewListing = async (req, res, next) => {
  const result = await geocoding.forward(req.body.listing.location, {
    limit : 1
  });

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};
  newListing.geometry = result.features[0].geometry;
  let saveed = await Listing.insertOne(newListing);
  req.flash('success', 'New Listing Created!');
  res.redirect("/listings");
}

module.exports.showListings = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
  if (!listing) {
    req.flash("error", "Listing you request it dose not exist!");
    res.redirect("/listings");
  }
  else {
    res.render("./listings/show.ejs", { listing });
  }
}

module.exports.editListingsForm = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you request it dose not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_300/");
  req.flash('success', 'Listing Edited!');
  res.render("listings/edit.ejs", { listing , originalImageUrl});
};

module.exports.updateListings = async (req, res) => {
  const { id } = req.params;
  // console.log(req.body.listing);
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
  }
  req.flash('success', 'Listing Updated!');
  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Listing Deleted!');
  res.redirect("/listings");
};