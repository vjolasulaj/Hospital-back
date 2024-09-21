const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();

const admins = [{ email: "admin@test1.com", password: "ADMIN2024!@" }];
let verificationCodes = {};

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Login route
router.post("/admin", (req, res) => {
  const { email, password } = req.body;
  const admin = admins.find((admin) => admin.email === email && admin.password === password);

  if (admin) {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = verificationCode;
    sendVerificationEmail(email, verificationCode);
    res.json({ success: true, message: "Verification code sent" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Verification route 
router.post("/verify", (req, res) => {
  const { email, verificationCode } = req.body;
  if (verificationCodes[email] === verificationCode) {
    delete verificationCodes[email]; // Clear the code once used
    const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: "Invalid verification code." });
  }
});
const sendVerificationEmail = (email, verificationCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sulaj.vjolaa@gmail.com",
      pass: "zzvc bftp qcfw tsoj",
    },
  });

  const mailOptions = {
    from: "sulaj.vjolaa@gmail.com",
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = router;
