const express = require("express");
const Patient = require("../../schemas/Patient");
const router = express.Router();

// Get total number of patients
router.get("/", async (req, res) => {
  try {
    const patientCount = await Patient.countDocuments();
    res.json({ count: patientCount });
    console.log(patientCount);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient count" });
  }
});

module.exports = router