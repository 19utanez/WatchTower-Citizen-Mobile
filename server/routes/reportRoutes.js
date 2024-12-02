import express from 'express';
import { getReports, getReportById, createReport, deleteReport, updateReport, getImage } from '../controllers/reportController.js';  // Correct import path

import multer from "multer";


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Add `upload.array` to the POST route to handle file uploads
router.post("/", upload.array("disasterImages"), createReport);

// Define Routes
router.get('/', getReports); // Fetch all reports
router.get('/:id', getReportById); // Get a specific report by ID
router.post('/', createReport); // Create a new report
router.delete('/:id', deleteReport); // Delete a report by ID
router.put('/:id', updateReport); // Update a report
router.get('/image/:id', getImage); // Fetch the image

export default router;
