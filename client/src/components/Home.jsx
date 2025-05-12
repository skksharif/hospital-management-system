import React, { useState, useEffect } from "react";
import "./Home.css";
import { CiSearch } from "react-icons/ci";
import { MdHistory } from "react-icons/md";

const Home = () => {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://hospital-management-system-ammf.onrender.com/api/doctor/patients",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setPatients(data.patients || []);
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
              <button className="history-button">
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
