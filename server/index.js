const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVICE_USER || 'examples@gmail.com',
    pass: process.env.EMAIL_SERVICE_PASS,
  },
});

app.post('/send-otp', async (req, res) => {
  const { to, otp } = req.body;

  try {
    await transporter.sendMail({
      from: `"NorkCraft Auth" <${process.env.EMAIL_SERVICE_USER || 'examples@gmail.com'}>`,
      to,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${otp}`,
      html: `<b>Your verification code is: ${otp}</b>`,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
