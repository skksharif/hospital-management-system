import React, { useState, useEffect } from "react";
import "./Home.css";
import { CiSearch } from "react-icons/ci";
import { MdHistory } from "react-icons/md";
import BASE_URL from "./config";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/doctor/patients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setPatients(data.patients || []);
        console.log(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="patient-list-container">
      <div className="search-container">
        <CiSearch className="search-icon" />
        <input
          className="search-bar"
          type="text"
          placeholder="Search by Patient Name / Contact no."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <h2 className="section-title">Patient Details:</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card-grid">
          {filteredPatients.map((patient, index) => (
            <div className="patient-card" key={index}>
              <h3>{patient.name}</h3>
              <p>Last Visit: {patient.lastVisit}</p>
              <p>Next Visit: {patient.nextVisit}</p>
              <button
                className="history-button"
                onClick={() => {
                  const patientData = patients.find((p) => p._id === patient._id); // Fix find logic
                  navigate(`/dashboard/patient-history/${patient._id}`, {
                    state: { patient: patientData }, // Optional: pass extra data
                  });
                }}
              >
                <span className="clock-icon">
                  <MdHistory />
                </span>
                <span> History</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
