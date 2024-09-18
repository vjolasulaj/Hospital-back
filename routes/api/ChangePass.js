const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../../schemas/User');
const router = express.Router();

router.post('/change-pass', async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    try {
        // Find the admin by email
        const admin = await User.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Log the current stored password hash for debugging
        console.log('Stored hashed password:', admin.password);

        // Compare current password with the stored hashed password
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        console.log('Password comparison result:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        sendPasswordChangeEmail(email);
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Email sending logic remains the same
const sendPasswordChangeEmail = (email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "sulaj.vjolaa@gmail.com" ,
            pass: "zzvc bftp qcfw tsoj", 
        },
    });

    const mailOptions = {
        from: 'sulaj.vjolaa@gmail.com', 
        to: email, 
        subject: 'Password Changed Successfully',
        text: `Hello,

Your password has been changed successfully.

If you did not request this change, please contact support immediately.

Best regards,
Your Company`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email', error);
        } else {
            console.log('Password change email sent: ' + info.response);
        }
    });
};

module.exports = router;
