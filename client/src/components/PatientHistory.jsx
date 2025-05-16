import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PatientHistory.css";

export default function PatientHistory() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date)
      ? "N/A"
      : date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  useEffect(() => {
    const fetchPatient = async () => {
      const data = state?.patient;
      setTimeout(() => {
        setPatient(data);
        setLoading(false);
      }, 500); // simulate load time
    };

    fetchPatient();
  }, [state]);

  if (loading) {
    return (
      <div className="history-container">
        <div className="loader"></div>
      </div>
    );
  }

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
      <h2>Patient History</h2>
      <div className="history-card">
        {/* Left section */}
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
            <strong>Aadhar ID:</strong> {patient.aadharId}
          </p>
          <p>
            <strong>Status:</strong> {patient.status}
          </p>
          <p>
            <strong>Joining Date:</strong> {formatDate(patient.joiningDate)}
          </p>
          <p>
            <strong>Discharge Date:</strong>{" "}
            {patient.dischargeDate ? formatDate(patient.dischargeDate) : "N/A"}
          </p>
          <p>
            <strong>Created At:</strong> {formatDate(patient.createdAt)}
          </p>
          <p>
            <strong>Last Visit:</strong>{" "}
            {patient.visits?.length ? formatDate(patient.visits.at(-1)) : "N/A"}
          </p>

          <div className="button-group">
            <button className="visit-btn">+ Add New Visit</button>
            <button className="download-btn">Download</button>
          </div>
        </div>

        {/* Right section */}
        <div className="right-section">
          <p>
            <strong>Treatment:</strong> {patient.treatment || "N/A"}
          </p>
          <p>
            <strong>Visits:</strong>
          </p>
          <ul>
            {patient.visits.length ? (
              patient.visits.map((date, idx) => (
                <li key={idx}>{formatDate(date)}</li>
              ))
            ) : (
              <li>No visits recorded.</li>
            )}
          </ul>
          <p>
            <strong>Tips:</strong>
          </p>
          <ul>
            {Array.isArray(patient.tips) && patient.tips.length ? (
              patient.tips.map((tip, index) => <li key={index}>{tip}</li>)
            ) : (
              <li>No tips provided.</li>
            )}
          </ul>
          <p>
            <strong>Prescribed By:</strong> Dr. {patient.prescribedBy || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
