import Report from "../models/Report.js";
import Citizen from "../models/Citizen.js";
import { getGfsBucket } from "../utils/gridFsUtils.js";
import mongoose from "mongoose";

// Get a report by ID
export const getReportById = async (req, res) => {
  try {
    const reportId = req.params.id;
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get an image associated with a report
export const getImage = async (req, res) => {
  const { id } = req.params;
  const gfsBucket = getGfsBucket();

  try {
    // Validate MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid ObjectId:", id);
      return res.status(400).json({ message: "Invalid file ID" });
    }

    // Check if file exists in GridFS
    const files = await gfsBucket.find({ _id: new mongoose.Types.ObjectId(id) }).toArray();
    if (!files || files.length === 0) {
      console.error("File not found:", id);
      return res.status(404).json({ message: "File not found" });
    }

    const file = files[0];
    const downloadStream = gfsBucket.openDownloadStream(file._id);

    // Set appropriate headers for the response
    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", `inline; filename="${file.filename}"`);

    // Pipe the stream to the client
    downloadStream.pipe(res);

    downloadStream.on("error", (err) => {
      console.error("Stream error:", err);
      res.status(500).json({ message: "Error streaming the file" });
    });
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get all reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new report with images (uploaded to GridFS)
export const createReport = async (req, res) => {
  const {
    reporterId,
    reportedBy,
    location,
    disasterInfo,
    disasterCategory,
    disasterStatus,
    priority,
    rescuerId,
    rescuedBy,
  } = req.body;

  const disasterImages = [];
  const gfsBucket = getGfsBucket();

  try {
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const writeStream = gfsBucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });
        writeStream.end(file.buffer);

        await new Promise((resolve, reject) => {
          writeStream.on("finish", () => {
            disasterImages.push(writeStream.id.toString());
            resolve();
          });
          writeStream.on("error", reject);
        });
      }
    }

    const newReport = new Report({
      reporterId,
      reportedBy,
      location,
      disasterInfo,
      disasterCategory,
      disasterImages,
      disasterStatus,
      priority,
      rescuerId,
      rescuedBy,
    });

    await newReport.save();

    const updatedCitizen = await Citizen.findByIdAndUpdate(
      reporterId,
      { $push: { reports: newReport._id } },
      { new: true }
    );

    if (!updatedCitizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    res.status(201).json(newReport);
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




// Delete a report
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReport = await Report.findByIdAndDelete(id);

    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "Failed to delete report" });
  }
};

// Update a report
export const updateReport = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedReport = await Report.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(400).json({ message: error.message });
  }
};
