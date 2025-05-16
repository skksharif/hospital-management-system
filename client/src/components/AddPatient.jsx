import React, { useState } from "react";
import axios from "axios";
import "./AddPatient.css";
import Swal from "sweetalert2";
import BASE_URL from "./config";

export default function AddPatient() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    aadharId: "",
    gender: "",
    treatment: "",
    visitDate: "",
    tips: "",
    prescribedBy: "",
    status: "checked-in",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const patientPayload = {
      ...formData,
      tips: formData.tips
        ? formData.tips.split(",").map((tip) => tip.trim())
        : [],
      visits: [formData.visitDate],
    };

    delete patientPayload.visitDate;

    try {
      const response = await axios.post(`${BASE_URL}/api/doctor/add-patient`, patientPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Patient added successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      setFormData({
        name: "",
        age: "",
        contact: "",
        aadharId: "",
        gender: "",
        treatment: "",
        visitDate: "",
        tips: "",
        prescribedBy: "",
        status: "checked-in",
      });
    } catch (err) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: err.response?.data?.message || "Failed to add patient.",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-patient-container">
      <h2>Add New Patient</h2>
      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-grid">
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Age
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
              max="120"
            />
          </label>

          <label>
            Contact
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              pattern="[0-9]{10}"
              placeholder="10-digit number"
              required
            />
          </label>

          <label>
            Aadhar ID
            <input
              type="text"
              name="aadharId"
              value={formData.aadharId}
              onChange={handleChange}
              placeholder="12-digit Aadhar number"
              required
            />
          </label>

          <label>
            Gender
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Visit Date
            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Prescribed By
            <input
              type="text"
              name="prescribedBy"
              value={formData.prescribedBy}
              onChange={handleChange}
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="visited-once">Visited Once</option>
            </select>
          </label>

          <label className="full-width">
            Treatment
            <input
              type="text"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
            />
          </label>

          <label className="full-width">
            Tips
            <textarea
              name="tips"
              rows="2"
              placeholder="Comma-separated tips"
              value={formData.tips}
              onChange={handleChange}
            />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Patient"}
        </button>

        {loading && <div className="loader"></div>}
      </form>
    </div>
  );
}
