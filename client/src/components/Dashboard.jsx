import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import {
  FaUserInjured,
  FaCheckCircle,
  FaSignOutAlt,
  FaUserPlus,
  FaUserMinus,
  FaBars,
} from "react-icons/fa";
import { NavLink, Routes, Route } from "react-router-dom";
import CheckedIn from "./CheckedIn";
import CheckedOut from "./CheckedOut";
import Home from "./Home";
import AddPatient from "./AddPatient";
import DeletePatient from "./DeletePatient";
import "./Dashboard.css";
import BASE_URL from "./config";
import PatientHistory from "./PatientHistory";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard">
      <button className="menu-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <aside className={`sidebar ${sidebarOpen ? "" : "hidden"}`}>
        <div className="sidebar-header">
          <h2>Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard/"
            end
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaUserInjured />
            <span>Patients</span>
          </NavLink>
          <NavLink
            to="/dashboard/checked-in"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaCheckCircle />
            <span>Checked In</span>
          </NavLink>
          <NavLink
            to="/dashboard/checked-out"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaSignOutAlt />
            <span>Checked Out</span>
          </NavLink>
          <NavLink
            to="/dashboard/add-patient"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaUserPlus />
            <span>Add Patient</span>
          </NavLink>
          <NavLink
            to="/dashboard/delete-patient"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaUserMinus />
            <span>Delete Patient</span>
          </NavLink>
        </nav>

        <div className="logout-btn" onClick={handleLogout} title="Logout">
          <CiLogout size={24} />
        </div>
      </aside>

      <main className="dashboard-content">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="patient-history/:id" element={<PatientHistory />} />
          <Route path="checked-in" element={<CheckedIn />} />
          <Route path="checked-out" element={<CheckedOut />} />
          <Route path="add-patient" element={<AddPatient />} />
          <Route path="delete-patient" element={<DeletePatient />} />
        </Routes>
      </main>
    </div>
  );
}
