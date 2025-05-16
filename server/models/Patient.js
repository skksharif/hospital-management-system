const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, default: null },
  contact: { type: String, required: true },
  aadharId: { type: String, required: true, unique: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
  treatment: { type: String, default: "" },
  joiningDate: { type: Date, default: Date.now },
  visits: { type: [Date], default: [] },
  status: { type: String, enum: ["checked-in", "checked-out", "visited-once"], required: true },
  dischargeDate: { type: Date },
  prescribedBy: { type: String, default: "" },
  tips: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Patient", patientSchema);
