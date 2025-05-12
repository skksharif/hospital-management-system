import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CheckedIn.css";

export default function CheckedOut() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch patients on mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token"); // or wherever you're storing it
        const res = await axios.get(
          "http://localhost:5000/api/doctor/patients?status=checked-out",
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
        `http://localhost:5000/api/doctor/update-patient/${id}`,
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
    </>
  );
}
