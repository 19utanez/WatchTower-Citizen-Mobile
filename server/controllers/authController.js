import Citizen from '../models/Citizen.js';

// Get all citizens (excluding password)
export const getCitizens = async (req, res) => {
  try {
    // Retrieve all citizens excluding password field
    const citizens = await Citizen.find().select('-password');
    res.status(200).json(citizens);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Handle login (updated without JWT)
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

    // If credentials are valid, send a success message
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Register a new citizen
export const registerCitizen = async (req, res) => {
  try {
    const { firstName, lastName, username, password,  mobileNumber, address, profileImage } = req.body;

    const newCitizen = new Citizen({
      firstName,
      lastName,
      username,
      password,
      email: "no data yet",
      mobileNumber,
      address: "no data yet",
      profileImage: "no data yet",
      reports: [],
      role: "citizen",
      status: "offline",
    });

    await newCitizen.save();

    // Increment the totalCitizens count in the overallstat collection
    await OverallStat.updateOne({}, { $inc: { totalCitizens: 1 } });

    res.status(201).json(newCitizen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating citizen' });
  }
};

