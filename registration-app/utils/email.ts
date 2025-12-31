// This utility is a no-op on the frontend because nodemailer is a Node.js-only library.
// For a production app, this logic should move to a backend server.

export const sendOtpEmail = async (to: string, otp: string) => {
  console.log(`[DEV] Mock sending OTP ${otp} to ${to}`);
  return { success: true };
};
