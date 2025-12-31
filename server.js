const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send OTP endpoint
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for NorkCraft Registration',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1F3A70; margin-bottom: 20px;">Welcome to NorkCraft!</h2>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Your One-Time Password (OTP) for email verification is:
            </p>
            <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #1F3A70; letter-spacing: 5px;">
                ${otp}
              </span>
            </div>
            <p style="color: #666; font-size: 14px;">
              This OTP will expire in 10 minutes. If you did not request this code, please ignore this email.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              NorkCraft Team
            </p>
          </div>
        </div>
      `,
      text: `Your OTP for NorkCraft registration is: ${otp}. This OTP will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'OTP sent successfully to ' + email });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ message: error.message || 'Failed to send OTP email' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});
