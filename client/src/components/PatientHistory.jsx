import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PatientHistory.css";

export default function PatientHistory() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const patient = state?.patient;

  if (!patient) {
    return (
      <div className="history-container">
        <h2>Patient data not found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2>Patient History:</h2>
      <div className="history-card">
        {/* Left side */}
        <div className="left-section">
          <h3>{patient.name}</h3>
          <p>
            <strong>Age:</strong> {patient.age}
          </p>
          <p>
            <strong>Gender:</strong> {patient.gender}
          </p>
          <p>
            <strong>Contact Info:</strong> {patient.contact}
          </p>
          <p>
            <strong>Visit Date:</strong> {patient.visitDate}
          </p>

          <div className="button-group">
            <button className="visit-btn">+ Add New Visit</button>
            <button className="download-btn">Download</button>
            <button className="share-btn">Share</button>
          </div>
        </div>

        {/* Right side */}
        <div className="right-section">
          <p>
            <strong>Visit Date:</strong> {patient.visitDate}
          </p>
          <p>
            <strong>Treatment:</strong> {patient.treatment || "N/A"}
          </p>
          <p>
            <strong>Medicines:</strong>{" "}
            {Array.isArray(patient.medicines)
              ? patient.medicines.join(", ")
              : patient.medicines || "N/A"}
          </p>

          <p>
            <strong>Next Visit:</strong> {patient.nextVisit}
          </p>

          <p>
            <strong>Notes:</strong>
          </p>
          <p className="notes">"{patient.notes || "No notes provided."}"</p>

          <p>
            <strong>Suggested Lifestyle Tips:</strong>
          </p>
          <ul>
            {patient.lifestyleTips?.length ? (
              patient.lifestyleTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))
            ) : (
              <li>No lifestyle tips listed.</li>
            )}
          </ul>

          <p>
            <strong>Prescribed By:</strong> Dr. {patient.doctor || "XXXXXXX"}
          </p>
 
        </div>
      </div>
    </div>
  );
}
