import jwt from 'jsonwebtoken';
import Citizen from '../models/Citizen.js';

// Handle login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the citizen exists
    const citizen = await Citizen.findOne({ username });
    if (!citizen) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare password directly
    if (citizen.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: citizen._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
