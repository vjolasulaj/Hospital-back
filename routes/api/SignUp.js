const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../schemas/User");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin account already exists!" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin account created successfully!" });
  } catch (err) {
    console.error("Error details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
