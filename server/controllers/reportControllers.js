import Report from "../models/Report.js";
import { getGfsBucket } from "../utils/gridFsUtils.js";
import mongoose from 'mongoose';


export const getReportById = async (req, res) => {
  try {
    const reportId = req.params.id; // Get the ID from the URL parameters
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(report); // Return the report data
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getImage = async (req, res) => {
  const { id } = req.params;
  const gfsBucket = getGfsBucket();

  try {
      const file = await gfsBucket.find({ _id: mongoose.Types.ObjectId(id) }).toArray();
      if (!file || file.length === 0) {
          return res.status(404).send('File not found');
      }

      gfsBucket.openDownloadStream(file[0]._id).pipe(res);
  } catch (error) {
      console.error("Error retrieving image:", error);
      res.status(500).send("Error retrieving image");
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

// Create a new report with image uploads to GridFS
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
    // Upload files to GridFS if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const writeStream = gfsBucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });
        writeStream.end(file.buffer);

        await new Promise((resolve, reject) => {
          writeStream.on("finish", () => {
            disasterImages.push(writeStream.id.toString()); // Store GridFS file ID
            resolve();
          });
          writeStream.on("error", reject);
        });
      }
    }

    // Create the report entry in MongoDB
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

    // Update the citizen's reports array
    const updatedCitizen = await Citizen.findByIdAndUpdate(
      reporterId,
      { $push: { reports: newReport._id } }, // Add the report ID to the citizen's reports array
      { new: true } // Return the updated document
    );

    if (!updatedCitizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    res.status(201).json(newReport); // Return the newly created report
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(400).json({ message: error.message });
  }
};
// Delete a report
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReport = await Report.findByIdAndDelete(id);

    if (!deletedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: 'Failed to delete report' });
  }
};

// Update a report
export const updateReport = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedReport = await Report.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(400).json({ message: error.message });
  }
};


