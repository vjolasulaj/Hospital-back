const mongoose = require("mongoose");

const medicalRecordSchema = mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    unique: true,
    required: true,
  },
  allergies: {
    type: [String],
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

const MedicalReport = mongoose.model("MedicalReport", medicalRecordSchema);
module.exports = MedicalReport;
