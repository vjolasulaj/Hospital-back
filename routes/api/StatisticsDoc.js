const express = require("express");
const Doctor = require("../../schemas/Doctor");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const doctorCount = await Doctor.countDocuments();
    res.json({ count: doctorCount });
    console.log(doctorCount);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor count" });
  }
});



module.exports = router;
