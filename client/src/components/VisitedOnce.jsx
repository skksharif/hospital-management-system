import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CheckedIn.css"; // Reuse the same CSS
import Swal from "sweetalert2";
import BASE_URL from "./config";

export default function VisitedOnce() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVisitedPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${BASE_URL}/api/doctor/patients?status=visited-once`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPatients(res.data.patients);
      } catch (error) {
        console.error("Error fetching visited-once patients:", error);
      }
    };

    fetchVisitedPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.contactNumber}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="checked-in-container">
      <input
        className="search-bar"
        type="text"
        placeholder="Search by Patient Name / Contact no."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <h2 className="checked-in-title">Visited Once Patients:</h2>
      <div className="patient-grid">
        {filteredPatients.map((patient) => (
          <div key={patient._id} className="patient-card">
            <h3>{patient.name}</h3>
            <p>
              Visiting Date:{" "}
              {new Date(patient.visitDate).toLocaleDateString()}
            </p>
            <p>
              Recommended Stay:{" "}
              {new Date(patient.recommendedStayDate).toLocaleDateString()}
            </p>
            <div className="card-buttons">
              <button className="view-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
