const express = require("express");
const router = express.Router();
const Payment = require("../../schemas/Payment");
const Appointment = require("../../schemas/Appointment");
const { completePayment, requestRefund, processRefund } = require("../../controllers/paymentController");

// Get all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find().populate("appointment").exec();
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurres while fetching payments" });
  }
});

// Get one payment(id)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findById(id).populate("appointment");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found!" });
    }
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching the payment." });
  }
});

// Create a payment (post method)

router.post("/create", async (req, res) => {
  const { patientId, appointmentId, amount, paymentMethod } = req.body;
  try {
    const payment = await createPayment(patientId, appointmentId, amount, paymentMethod);
    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a payment
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { amount, method, status, appointment } = req.body;
  try {
    const updatePayment = await Payment.findByIdAndUpdate(
      id,
      {
        amount,
        method,
        status,
        appointment,
      },
      { new: true }
    );
    if (!updatePayment) {
      return res.status(404).json({ message: "Payment not found!" });
    }
    return res.status(200).json(updatePayment);
  } catch (err) {
    console.error(err);
    res.status(500).json("An error occurred");
  }
});

// Delete a payment
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found!" });
    }
    const appointment = await Appointment.findById(payment.appointment);
    if (appointment) {
      if (Array.isArray(appointment.payments)) {
        await Appointment.findByIdAndUpdate(payment.appointment, { $pull: { payment: id } });
      } else {
        appointment.payment = undefined;
        await appointment.save();
      }
    }
    await Payment.findByIdAndDelete(id);
    res.status(200).json({ message: "Payment deleted and removed from appointment!" });
  } catch (err) {
    console.error(err);
    res.status(500).json("An error occurred!");
  }
});

//Complete a payment

router.post("/complete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await completePayment(id);
    res.status(200).json({ message: "Payment completed successfully", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Refund request
router.post("/refund/request", async (req, res) => {
  const { paymentId, refundAmount } = req.body;
  try {
    const payment = await requestRefund(paymentId, refundAmount);
    res.status(200).json({ message: "Refund requested successfully", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Process a refund
router.post("/refund/process/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await processRefund(id);
    res.status(200).json({ message: "Refund processed successfully", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
