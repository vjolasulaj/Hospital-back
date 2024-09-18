const express = require("express");
const router = express.Router();
const Appointment = require("../../schemas/Appointment");
const Doctor = require("../../schemas/Doctor");
const isDoctorAvailable = require("../../controllers/checkAvailbility");

// Get all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

// Get one appointment by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id).populate("doctor").populate("patient");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json("An error occurred");
  }
});

// Post (create) an appointment
router.post("/", async (req, res) => {
  const { patientName, doctorId, date, payment, status, reason, notes } = req.body;

  // Calculate day of the week from the date
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const appointmentDate = new Date(date);
  const dayOfWeek = daysOfWeek[appointmentDate.getDay()]; // Get the day of the week as a string

  try {
    const newAppointment = new Appointment({
      patientName,
      doctorId,
      date: appointmentDate,
      dayOfWeek,
      payment,
      status,
      reason,
      notes,
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: "Error creating appointment" });
  }
});

// Update an appointment

router.put("/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const { date, doctor, patient, status, payment, reason, notes } = req.body;
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      {
        date,
        doctor,
        patient,
        status,
        payment,
        reason,
        notes,
      },
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updatedAppointment);
  } catch (err) {
    console.error(err);
    res.status(500).json("An error occurred");
  }
});

// Delete an appointment
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    await Doctor.findByIdAndUpdate(appointment.doctor, { $pull: { appointment: id } });
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }

  //Schedule an appointment
  router.post("/schedule", async (req, res) => {
    const { patientId, doctorId, date } = req.body;
    try {
      const available = await isDoctorAvailable(doctorId, date);
      if (!available) {
        return res.status(400).json({ message: "Doctor is not available at this time" });
      }
      const appointment = new Appointment({ patientId, doctorId, date });
      await appointment.save();
      res.status(201).json({ message: "Appointment scheduled successfully", appointment });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
});

router.post("/check-availability", async (req, res) => {
  const { doctorId, date } = req.body;
  const selectedDate = new Date(date);

  try {
    const appointments = await Appointment.find({
      doctorId: doctorId,
      date: selectedDate,
    });

    if (appointments.length > 0) {
      return res.json({ available: false });
    } else {
      return res.json({ available: true });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error checking availability" });
  }
});

module.exports = router;
