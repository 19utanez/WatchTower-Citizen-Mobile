import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Ensure mongoose is imported
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js'; // Fixed the import path
import { connectGridFs } from "./utils/gridFsUtils.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Initialize GridFS after database connection
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connected and GridFS initialized.');
  connectGridFs(connection); // Initialize GridFS
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes); // Add the reports routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
