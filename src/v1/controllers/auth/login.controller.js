const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../../../utils/asyncHandler');
const prisma = require('../../../utils/prisma');

const loginService = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if the user exists
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token with 30-day expiry
    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: '30d' } // Token expiration set to 30 days
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
      },
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = loginService;
