const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, default: null },
  contact: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
  treatment: { type: String, default: "" },
  medicines: { type: String, default: "" },
  notes: { type: String, default: "" },
  visitDate: { type: Date, default: Date.now },
  nextVisit: { type: Date },
  tips: { type: [String], default: [] },
  status: { type: String, enum: ["checked-in", "checked-out"], required: true },
  prescribedBy: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  checkedOutDate: { type: Date, default: null } // New field to track the checkout date
});

module.exports = mongoose.model("Patient", patientSchema);
