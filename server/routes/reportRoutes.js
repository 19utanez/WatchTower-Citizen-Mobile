import express from "express";
import {
  getReports,
  getReportById,
  createReport,
  deleteReport,
  updateReport,
  getImage,
} from "../controllers/reportControllers.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get("/", getReports);
router.get("/:id", getReportById);
router.post("/", upload.array("disasterImages"), createReport);
router.delete("/:id", deleteReport);
router.put("/:id", updateReport);
router.get("/image/:id", getImage); // Image retrieval route

export default router;
