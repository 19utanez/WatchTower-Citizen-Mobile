import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js'; // Ensure correct import path
import { connectGridFs } from './utils/gridFsUtils.js';  // GridFS utilities

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // Allow requests from all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json()); // Parse JSON bodies

// Initialize GridFS after MongoDB connection
mongoose.connection.once("open", () => {
  console.log("MongoDB connected and GridFS initialized.");
  connectGridFs(mongoose.connection);
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes); // Ensure correct routes are included

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
