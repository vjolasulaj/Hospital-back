const express = require("express");
const Patient = require("../../schemas/Patient");
const router = express.Router();

router.get("/patient-data", async (req, res) => {
  try {
    const data = await Patient.aggregate([{ $group: { _id: "$week", totalPatients: { $sum: 1 } } }, { $sort: { _id: 1 } }]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

module.exports = router;