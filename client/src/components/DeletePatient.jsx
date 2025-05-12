import React, { useState, useEffect } from "react";
import "./DeletePatient.css";
import { CiSearch } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

const DeletePatient = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/doctor/patients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setPatients(data.patients || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="delete-patient-container">
      <div className="delete-patient-search">
        <CiSearch className="delete-patient-search-icon" />
        <input
          className="delete-patient-search-bar"
          type="text"
          placeholder="Search by Patient Name / Contact no."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <h2 className="delete-patient-title">Patient Details:</h2>
      <div className="delete-patient-grid">
        {filteredPatients.map((patient, index) => (
          <div className="delete-patient-card" key={index}>
            <h3>{patient.name}</h3>
            <p>Last Visit: {patient.lastVisit}</p>
            <p>Next Visit: {patient.nextVisit}</p>
            <button className="delete-patient-button">
              <MdDeleteForever className="delete-patient-icon" />
              <span>Delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeletePatient;
