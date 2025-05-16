import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CheckedIn.css";
import BASE_URL from "./config";
import { useNavigate } from "react-router-dom";

export default function CheckedOut() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch patients on mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token"); // or wherever you're storing it
        const res = await axios.get(
          `${BASE_URL}/api/doctor/patients?status=checked-out`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPatients(res.data.patients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  // Handle checkout
  const handleCheckout = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${BASE_URL}/api/doctor/update-patient/${id}`,
        { status: "checked-out" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPatients((prev) => prev.filter((patient) => patient._id !== id));
    } catch (error) {
      console.error("Error checking out patient:", error);
    }
  };

  // Filtered search
  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.contactNumber}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="checked-in-container">
        <input
          className="search-bar"
          type="text"
          placeholder="Search by Patient Name / Contact no."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <h2 className="checked-in-title">Check In Patients:</h2>
        <div className="patient-grid">
          {filteredPatients.map((patient) => (
            <div key={patient._id} className="patient-card">
              <h3>{patient.name}</h3>
              <p>
                Visited Date:{" "}
                {patient.visits?.[0]
                  ? new Date(patient.visits[0]).toLocaleDateString()
                  : "N/A"}
              </p>

              <p>
                Checkout Date:{" "}
                {patient.dischargeDate
                  ? new Date(patient.dischargeDate).toLocaleDateString()
                  : "N/A"}
              </p>

              <div className="card-buttons">
                <button
                  className="view-btn"
                  onClick={() => {
                    const patientData = patients.find(
                      (p) => p._id === patient._id
                    );
                    navigate(`/dashboard/patient-history/${patient._id}`, {
                      state: { patient: patientData },
                    });
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
