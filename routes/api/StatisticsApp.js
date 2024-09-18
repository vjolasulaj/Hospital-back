const express = require("express");
const Appointment = require("../../schemas/Appointment");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const appointmentCount = await Appointment.countDocuments();
    res.json({ count: appointmentCount });
    console.log(appointmentCount);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointment count" });
  }
});

module.exports = router;
