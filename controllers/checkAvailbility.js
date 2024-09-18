const Doctor = require("../schemas/Doctor");
const Appointment = require("../schemas/Appointment");

async function isDoctorAvailable(doctorId, appointmentDate) {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new Error("Doctor not found!");
  }
  const isScheduled = doctor.schedule.some((schedule) => schedule.date.getTime() === new Date(appointmentDate).getTime() && !schedule.available);
  if (!isScheduled) {
    return false;
  }
  const existingAppointment = await Appointment.find({
    doctorId: doctorId,
    date: new Date(appointmentDate),
  });

  if (existingAppointment) {
    return false;
  }
  return true;
}

module.exports = isDoctorAvailable;
