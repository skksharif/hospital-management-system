const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const verifyToken = require("../middleware/auth");

// Add new patient
router.post("/add-patient", verifyToken(["doctor"]), async (req, res) => {
  try {
    console.log(req.body);
    const {
      name,
      age,
      contact,
      aadharId,
      gender,
      treatment,
      prescribedBy,
      tips,
      status,
      visits,
    } = req.body;

    if (!["checked-in", "checked-out", "visited-once"].includes(status)) {
      return res.status(400).json({ message: "Here only or missing status" });
    }

    const patient = new Patient({
      name,
      age,
      contact,
      aadharId,
      gender,
      treatment,
      prescribedBy,
      tips,
      status,
      visits,
    });

    await patient.save();
    res.status(201).json({ message: "Patient added", patient });
  } catch (err) {
    console.error("Add patient error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update patient by ID
router.patch(
  "/update-patient/:id",
  verifyToken(["doctor"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (updates.status === "checked-out") {
        updates.dischargeDate = new Date();
      }
      
      if (updates.$push?.visits) {
        await Patient.findByIdAndUpdate(id, {
          $push: { visits: updates.$push.visits },
        });
        delete updates.$push;
      }

      const updated = await Patient.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!updated)
        return res.status(404).json({ message: "Patient not found" });

      res.json({ message: "Patient updated", patient: updated });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all patients or filter by status
router.get("/patients", verifyToken(["doctor"]), async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) {
      if (!["checked-in", "checked-out", "visited-once"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      filter.status = status;
    }

    const patients = await Patient.find(filter).sort({ createdAt: -1 });
    res.json({ patients });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// New route to get a specific patient by ID
router.get("/get-patient/:id", verifyToken(["doctor"]), async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (err) {
    console.error("Fetch single patient error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

