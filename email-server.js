const http = require('http');
const nodemailer = require('nodemailer');
const url = require('url');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/auth/send-otp' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { email, otp } = JSON.parse(body);

        if (!email || !otp) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Email and OTP are required' }));
          return;
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
        };

        await transporter.sendMail(mailOptions);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'OTP sent successfully to ' + email }));
      } catch (error) {
        console.error('Email sending error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message || 'Failed to send OTP email' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});
