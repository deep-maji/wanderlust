const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  comment : {
    type : String
  },
  rating : {
    type : Number,
    min : 0,
    max : 5
  },
  createAt : {
    type : Date,
    default : Date.now()
  },
  author : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  } 
})

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;