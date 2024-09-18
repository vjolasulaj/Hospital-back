const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "Cash", "Insurance"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed", "Refunded"],
    default: "Pending",
  },
  paymentDate: { type: Date, default: Date.now },
  referenceNumber: { type: String, unique: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },

  // Refund-related fields
  refundAmount: { type: Number, default: 0 },
  refundDate: { type: Date },
  refundStatus: { type: String, enum: ['none', 'requested', 'processed', 'failed'], default: 'none' },

  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
