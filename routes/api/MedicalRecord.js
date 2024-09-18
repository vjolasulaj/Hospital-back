const express = require("express");
const router = express.Router();
const MedicalRecord = require("../../schemas/MedicalRecord");

router.get("/", async (req, res) => {
  try {
    const record = await MedicalRecord.find({}).populate("patient");
    if (!record) {
      return res.status(404).json({ message: "Medical record not found." });
    }
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch medical record." });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const record = await MedicalRecord.findById({ patient: id }).populate("patient");
    if (!record) {
      return res.status(404).json({ message: "Medical record not found." });
    }
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch medical record." });
  }
});

router.post("/", async (req, res) => {
  const { patient, allergies } = req.body;
  try {
    const newRecord = new MedicalRecord({
      patient,
      allergies,
    });
    const record = await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create medical record." });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {allergies } = req.body;
  try {
    const updatedRecord = await MedicalRecord.findOneAndUpdate({ patient: id }, { allergies, updatedAt: Date.now() }, { new: true });
    if (!updatedRecord) {
      return res.status(404).json({ message: "Medical record not found." });
    }
    res.json(updatedRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update medical record." });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRecord = await MedicalRecord.findOneAndDelete({ patient: id });
    if (!deletedRecord) {
      return res.status(404).json({ message: "Medical record not found." });
    }
    res.json({ message: "Medical record deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete medical record." });
  }
});

module.exports = router;
