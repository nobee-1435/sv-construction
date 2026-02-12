const mongoose = require("mongoose");

const constructionSchema = new mongoose.Schema({
  fullImage: String,        // main house image
  elevation: String,        // elevation image
  bedRoom: String,
  kitchen: String,
  bathRoom: String,
  otherImage: String,

  location: String,
  cityName: String,

  customerName: String,
  customerNumber: String,

  squareFeetBudget: String,
  totalBudget: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Construction", constructionSchema);
