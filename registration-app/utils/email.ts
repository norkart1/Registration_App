export const sendOtpEmail = async (to: string, otp: string) => {
  try {
    // In Replit, the backend is on a different port but shared domain
    // We use the proxy URL for the backend
    const response = await fetch('http://localhost:3001/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, otp }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Error sending OTP through backend:', error);
    // Fallback to mock for development if backend fails
    console.log(`[DEV FALLBACK] OTP ${otp} for ${to}`);
    return { success: false, error: error.message || 'Unknown error' };
  }
};
