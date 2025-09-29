const mongoose = require("mongoose");
const Reviews = require("./reviews");
const { coordinates } = require("@maptiler/client");
const { string } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  image: {
    url : {
      type : String
    },
    filename : {
      type : String
    }
  },
  price: {
    type: Number
  },
  location: {
    type: String
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  },
  geometry : {
    type: {
      type : String,
      enum: ['Point'],
      required : true
    },
    coordinates : {
      type : [Number],
      required: true
    }
  },
  category : {
    type : String,
    enum: ['trending', 'iconicCities', 'mountains', 'castles', 'amazingPools', 'camping', 'farms', 'arctic'],
    required: true
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Reviews.deleteMany({_id : {$in : listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing;