import { connectDB } from '@/utils/mongodb';
import User from '@/models/User';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password will be hashed by the pre-save hook)
    const user = new User({
      email,
      passwordHash: password,
      isVerified: true,
    });

    await user.save();

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
