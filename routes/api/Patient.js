const express = require("express");
const router = express.Router();
const Patient = require("../../schemas/Patient");
const Appointment = require("../../schemas/Appointment");
const hasPatientLeftHospital = require("../../controllers/hasPatientLeftHospital");

// Get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();  
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

// GET one patient
router.get('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (patient) {
      res.status(200).json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Create (post) a patient

router.post("/", async (req, res) => {
  const { firstName, lastName, age, gender, bloodType, status } = req.body;
  try {
    const newPatient = new Patient({
      firstName,
      lastName,
      age,
      gender,
      bloodType,
      status,
    });
    const patient = await newPatient.save();
    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json("An error occurred");
  }
});

// Update a patient
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, age, gender, bloodType, status } = req.body;
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        age,
        gender,
        bloodType,
        status,
      },
      { new: true }
    );
    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(updatedPatient);
  } catch (err) {
    console.error(err);
    res.status(500).json("An error occurred");
  }
});

// Delete a patient

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }
    await Appointment.findByIdAndUpdate(patient.appointment, { $pull: { patient: id } });
    await Patient.findByIdAndDelete(id);
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
});

//Patient left hospital
router.get("/:id/left", async (req, res) => {
  const { id } = req.params;

  try {
    const hasLeft = await hasPatientLeftHospital(id);
    if (hasLeft) {
      res.status(200).json({ message: "Patient has left hospital." });
    } else {
      res.status(200).json({ message: "Patient is still in hospital" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
