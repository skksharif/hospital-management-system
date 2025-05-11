const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const Patient = require("../models/Patient");
const cron = require("node-cron");

// Route to add a patient (doctor only)
router.post(
  "/add-patient",
  verifyToken(["doctor", "admin"]),
  async (req, res) => {
    try {
      const {
        name,
        age,
        contact,
        gender,
        treatment,
        medicines,
        notes,
        visitDate,
        nextVisit,
        tips,
        prescribedBy,
        status,
      } = req.body;

      if (!status || !["checked-in", "checked-out"].includes(status)) {
        return res.status(400).json({ message: "Invalid or missing status" });
      }

      const newPatient = new Patient({
        name,
        age,
        contact,
        gender,
        treatment,
        medicines,
        notes,
        visitDate,
        nextVisit,
        tips,
        prescribedBy,
        status,
      });

      await newPatient.save();
      res
        .status(201)
        .json({ message: "Patient added successfully", patient: newPatient });
    } catch (err) {
      console.error("Error adding patient:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PATCH route to update patient by ID
router.patch(
  "/update-patient/:id",
  verifyToken(["doctor", "admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateFields = req.body;

      // If the patient is checked out, set the checkedOutDate
      if (updateFields.status === "checked-out") {
        updateFields.checkedOutDate = new Date(); // Set the current date as checkedOutDate
      }

      const updatedPatient = await Patient.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
      });

      if (!updatedPatient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      res.json({ message: "Patient updated", patient: updatedPatient });
    } catch (err) {
      console.error("Error updating patient:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET all patients or filter by status
router.get("/patients", verifyToken(["doctor", "admin"]), async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};
    if (status) {
      if (!["checked-in", "checked-out"].includes(status)) {
        return res.status(400).json({ message: "Invalid status filter" });
      }
      filter.status = status;
    }

    const patients = await Patient.find(filter).sort({ createdAt: -1 });

    res.json({ patients });
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to delete a patient by ID
router.delete("/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting patient", error });
  }
});

// Run the cleanup task every day at midnight
cron.schedule("0 0 * * *", async () => {
  const retentionPeriodInYears = 2; // Set retention period (e.g., 2 years)
  const retentionPeriodInMillis =
    retentionPeriodInYears * 365 * 24 * 60 * 60 * 1000; // Convert to milliseconds

  try {
    const cutoffDate = new Date(Date.now() - retentionPeriodInMillis);

    // Delete patients who have checked out and whose `checkedOutDate` is older than the retention period
    const result = await Patient.deleteMany({
      status: "checked-out",
      checkedOutDate: { $lte: cutoffDate },
    });

    console.log(
      `${result.deletedCount} patients deleted for exceeding retention period.`
    );
  } catch (err) {
    console.error("Error during retention cleanup:", err);
  }
});

module.exports = router;
