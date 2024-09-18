const Patient = require("../schemas/Patient");

async function hasPatientLeftHospital(patientId) {
  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new Error("Patient not found!");
    }
    return patient.dischargeDate && patient.dischargeDate < new Date();
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = hasPatientLeftHospital;