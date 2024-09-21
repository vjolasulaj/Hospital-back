const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Access denied. No token provided.");
  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Invalid token.");
    req.user = decoded;
    next();
  });
};

router.get("/api/dashboard", verifyToken, (req, res) => {
  res.send("Welcome to the dashboard");
});

module.exports = router;
