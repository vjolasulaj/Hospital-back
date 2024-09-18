const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(201).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, "secret");
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denies" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400), json({ message: "Token is not valid" });
  }
};

module.exports = adminAuth;
