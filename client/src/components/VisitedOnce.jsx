import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CheckedIn.css"; // Reuse the same CSS
import Swal from "sweetalert2";
import BASE_URL from "./config";
import { useNavigate } from "react-router-dom";

export default function VisitedOnce() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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
        console.log(res.data.patients);
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
              {patient.visits?.[0]
                ? new Date(patient.visits[0]).toLocaleDateString()
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
                }} disable
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
