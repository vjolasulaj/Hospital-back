const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "medinsight13@gmail.com", 
    pass: "avlh xjdz hmpp buts",  
  },
});

router.post("/send-email", (req, res) => {
  const { name, email, phone, details } = req.body;

  const mailOptions = {
    from: "Med Insight",  
    to: email, 
    subject: "Contact Form Submission",
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Details: ${details}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email");
    }
    console.log("Email sent:", info.response);
    res.status(200).send("Email sent successfully");
  });
});

module.exports = router;
 