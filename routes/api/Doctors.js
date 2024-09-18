const express = require("express");
const router = express.Router();
const Doctors = require("../../schemas/Doctor");

// GET
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctors.find();
    if (!doctors) throw Error("There are no doctors!");
    res.status(200).json(doctors);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

// GET by ID
router.get("/doctors/:id", async (req, res) => {
  try {
    const doctor = await Doctors.findOne({ id: parseInt(req.params.id) })
      .populate('patients')       
      .populate('appointments');
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// POST
router.post("/", async (req, res) => {
  const { firstName, lastName, speciality, email, yearsOfExperience } = req.body;
  try {
    const newDoctor = new Doctors({
      firstName,
      lastName,
      speciality,
      email,
      yearsOfExperience,
    });
    const doctor = await newDoctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json("An error occurred");
  }
});

// UPDATE by id
router.put("/doctors/:id", async (req, res) => {
  try {
    const doctor = await Doctors.findByIdAndUpdate(req.params.id, req.body);
    if (!doctor) throw Error("Something went wrong while updating a doctor");
    res.status(200).json(doctor);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

// DELETE by id
router.delete("/:id", async (req, res) => {
  try {
    const doctor = await Doctors.findByIdAndDelete(req.params.id);
    if (!doctor) throw Error("Something went wrong while deleting a doctor.");
    res.status(200).json(doctor);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

module.exports = router;
