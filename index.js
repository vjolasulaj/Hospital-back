const express = require("express");
const { default: mongoose } = require("mongoose");
const isAdmin = require("./middleware/isAdmin");
const app = express();
const cors = require("cors");
app.use(express.json());

const doctorRoute = require("./routes/api/Doctors");
const patientRoute = require("./routes/api/Patient");
const appointmentRoute = require("./routes/api/Appointment");
const paymentRoute = require("./routes/api/Payment");
const medicalReportRoute = require("./routes/api/MedicalRecord");
const covidDataRoute = require("./routes/api/CovidData");
const signupRouter = require("./routes/api/SignUp");
const loginRouter = require("./routes/api/Login");
const statisticsRouter1 = require("./routes/api/StatisticsDoc");
const statisticsRouter2 = require("./routes/api/StatisticsPat");
const statisticsRouter3 = require("./routes/api/StatisticsApp");
const patientGraph = require("./routes/api/PatientGraph");
const changePass = require("./routes/api/ChangePass");
const submission = require("./routes/api/Submission");
const verifyToken = require("./middleware/checkJWT");
const Doctor = require("./schemas/Doctor");
const Patient = require("./schemas/Patient");
const Appointment = require("./schemas/Appointment");
const Payment = require("./schemas/Payment");
const medicalReport = require("./schemas/MedicalRecord");
const covidData = require("./schemas/CovidData");
const User = require("./schemas/User");
const bodyParser = require("body-parser");

const port = 5000;
app.listen(port, () => {
  console.log("Server started at: " + port);
});

mongoose.connect("mongodb://localhost:27017/Hospital");

app.get("/", (req, res) => {
  res.json("Welcome to hospital management.");
});

app.use("/dashboard", isAdmin, (req, res) => {
  res.send("Welcome to the admin dashboard");
});

app.use(cors());
app.use(bodyParser.json());

app.use("/api/doctors", doctorRoute);
app.use("/api/patients", patientRoute);
app.use("/api/appointment", appointmentRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/medicalreport", medicalReportRoute);
app.use("/api/covid-data", covidDataRoute);
app.use("/api/signup", signupRouter);
app.use("/api/login", loginRouter);
app.use("/count/doctors", statisticsRouter1);
app.use("/count/patients", statisticsRouter2);
app.use("/count/appointments", statisticsRouter3);
app.use("/data/patient", patientGraph);
app.use("/admin/pass", changePass);
app.use("/api/email", submission);
app.use("/verify", verifyToken);
