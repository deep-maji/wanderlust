const mongoose = require("mongoose");
const Listing = require("../modules/listings");
let data = require("./data").data;

const DB_URL = 'mongodb://127.0.0.1:27017/wanderlust';
async function main() {
  await mongoose.connect(DB_URL);
}

main().then((result) => {
  console.log("DB Connected.");
})
.catch((error) => {
  console.log("DB Error - ", error);
})

const init = async () => {
  await Listing.deleteMany({});
  data = data.map(obj => ({...obj, owner : "68cf9bf9e053dd9f96665f87"}));
  await Listing.insertMany(data);
}

init();
