const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId, //one to one relation (doctor-appointment)
    ref: "Doctors",
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId, // one to one relation (patient-appointment)
    ref: "Patient",
  },
  date: { type: Date, required: true },
  dayOfWeek: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Scheduled", "Pending", "Canceled"],
    default: "Pending",
  },
  reason: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  payment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// nqs APPOINTMENT = COMPLETED nuk mund te ndryshojme statusin me vone

appointmentSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "Completed") {
    const err = new Error("Completed appointments cannot be pending or canceled.");
    return next(err);
  }
  this.updatedAt = Date.now();
  next();
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
