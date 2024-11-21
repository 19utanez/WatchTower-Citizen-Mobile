import express from "express";
import multer from "multer"; // Import multer
import { getReports, getReportById, createReport, updateReport, getImage  } from "../controllers/reportControllers.js";

const router = express.Router();

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Existing GET route
router.get("/", getReports); // Route to fetch reports

// Add the route to fetch a single report by its ID
router.get("/:id", getReportById);  // Fetch report by ID

// POST route for creating a report
router.post("/", upload.array("disasterImages"), createReport); // Include multer middleware for file uploads

// PATCH route for updating a report by ID
router.patch("/:id", updateReport); // Route to update a report by ID

router.get('/image/:id', getImage); // Add this line to fetch image by ID








export default router;