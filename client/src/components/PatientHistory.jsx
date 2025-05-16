import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "./config";
import "./PatientHistory.css";

export default function PatientHistory() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

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

  const fetchPatientFromDB = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/doctor/get-patient/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatient(res.data);
    } catch (error) {
      console.error("Error fetching patient:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNextVisit = async () => {
    if (!selectedDate) return alert("Please select a date");
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching....");
      await axios.patch(
        `${BASE_URL}/api/doctor/update-patient/${patient._id}`,
        {
          $push: { visits: [selectedDate] },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPatientFromDB(patient._id);

      setShowDatePicker(false);
      setSelectedDate("");
    } catch (error) {
      console.error("Error adding next visit:", error);
    }
  };

  useEffect(() => {
    const patientData = state?.patient;
    if (patientData?._id) {
      fetchPatientFromDB(patientData._id);
    } else {
      setLoading(false);
    }
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

  const visits = patient.visits || [];
  const nextVisit = visits.length ? visits[visits.length - 1] : null;
  const previousVisits = visits.length > 1 ? visits.slice(0, -1) : [];

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
            Next Visit:{" "}
            {patient.dischargeDate
              ? "Discharged"
              : patient.visits?.length > 1 &&
                new Date(
                  patient.visits[patient.visits.length - 1]
                ).toDateString() !==
                  new Date(patient.joiningDate).toDateString()
              ? formatDate(patient.visits[patient.visits.length - 1])
              : "Not Decided"}
          </p>

          <div className="button-group">
            {patient.dischargeDate || patient.status === "visited-once" ? (
              <button className="next-visit-btn" disabled>
                {patient.dischargeDate ? "Discharged" : "Visited Once"}
              </button>
            ) : showDatePicker ? (
              <div className="date-picker-wrapper">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <button className="confirm-btn" onClick={handleAddNextVisit}>
                  Confirm
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setShowDatePicker(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="next-visit-btn"
                onClick={() => setShowDatePicker(true)}
              >
                Add Next Visit
              </button>
            )}

            <button className="download-btn">Download</button>
          </div>
        </div>

        {/* Right section */}
        <div className="right-section">
          <p>
            <strong>Treatment:</strong> {patient.treatment || "N/A"}
          </p>
          <p>
            <strong>Previous Visits:</strong>
          </p>
          <ul>
            {previousVisits.length ? (
              previousVisits.map((date, idx) => (
                <li key={idx}>{formatDate(date)}</li>
              ))
            ) : (
              <li>No earlier visits recorded.</li>
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
