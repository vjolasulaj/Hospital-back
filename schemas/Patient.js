const mongoose = require("mongoose");

const patientSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    unique: true,
  },
  lastName: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  bloodType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  doctor:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Patient = mongoose.model("Patients", patientSchema);
module.exports = Patient;
