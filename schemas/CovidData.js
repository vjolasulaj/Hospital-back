const mongoose = require("mongoose");

// THIRD PARTY
const covidDataSchema = new mongoose.Schema({
  country: String,
  cases: Number,
  deaths: Number,
  recovered: Number,
  updatedAt: Date,
});

const covidData = mongoose.model("CovidData", covidDataSchema);
module.exports = covidData;
