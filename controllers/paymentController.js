const Payment = require("../schemas/Payment");

async function createPayment(patientId, appointmentId, amount, paymentMethod) {
  try {
    const payment = new Payment({
      patientId,
      appointmentId,
      amount,
      paymentMethod,
      status: "Pending",
      referenceNumber: generateReferenceNumber(),
    });
    await payment.save();
    return payment;
  } catch (error) {
    throw new Error("Error creating payment" + error.message);
  }
}

async function completePayment(paymentId) {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found!");
    }
    payment.status = "Completed";
    await payment.save();
    return payment;
  } catch (error) {
    throw new Error("Error completing payment" + error.message);
  }
}

async function requestRefund(paymentId, refundAmount) {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found!");
    }
    if (payment.status !== "Completed") {
      throw new Error("Refund can only be requested for completed payments");
    }
    if (payment.refundStatus !== "none") {
      throw new Error("Refund has already been requested or processed");
    }
    if (refundAmount > payment.amount) {
      throw new Error("Refund amount cannot exceed the original payment amount");
    }
    payment.refundAmount = refundAmount;
    payment.refundStatus = "requested";

    await payment.save();
    return payment;
  } catch (error) {
    throw new Error("Error requesting refund: " + error.message);
  }
}

async function processRefund(paymentId) {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    if (payment.refundStatus !== "requested") {
      throw new Error("Refund has not been requested");
    }
    payment.refundStatus = "processed";
    payment.refundDate = new Date();
    payment.status = "refunded";

    await payment.save();
    return payment;
  } catch (error) {
    throw new Error("Error processing refund: " + error.message);
  }
}


function generateReferenceNumber() {
  return "PAY-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
}

module.exports = { createPayment, completePayment, requestRefund, processRefund };
