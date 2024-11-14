// server/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Citizen from '../models/Citizen.js'; // Import the Citizen model

dotenv.config();

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // These options are deprecated but should work with newer versions of Mongoose
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected');

    // Log the number of documents in the 'Citizens' collection
    const citizenCount = await Citizen.countDocuments();
    console.log(`There are ${citizenCount} documents in the Citizens collection`);

  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
