import express from 'express';
import { getReports, getReportById, createReport, deleteReport, updateReport, getImage } from '../controllers/reportController.js';  // Correct import path

const router = express.Router();

// Define Routes
router.get('/', getReports); // Fetch all reports
router.get('/:id', getReportById); // Get a specific report by ID
router.post('/', createReport); // Create a new report
router.delete('/:id', deleteReport); // Delete a report by ID
router.put('/:id', updateReport); // Update a report
router.get('/image/:id', getImage); // Fetch the image

export default router;
