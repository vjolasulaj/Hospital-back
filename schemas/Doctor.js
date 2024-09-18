const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema({
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
  speciality: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment", //one to many relation
    },
  ],
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", //one to one relation
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
