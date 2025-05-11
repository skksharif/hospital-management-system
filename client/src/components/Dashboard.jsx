import React from "react";
import { CiLogout } from "react-icons/ci";
import { FaUserInjured, FaCheckCircle, FaSignOutAlt, FaUserPlus, FaUserMinus } from "react-icons/fa";
import { NavLink, Routes, Route } from "react-router-dom";
import CheckedIn from "./CheckedIn";
import CheckedOut from "./CheckedOut";
import Home from "./Home";
import AddPatient from "./AddPatient";
import DeletePatient from "./DeletePatient";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard/"
            end
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <FaUserInjured />
            <span>Patients</span>
          </NavLink>
          <NavLink
            to="/dashboard/checked-in"
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <FaCheckCircle />
            <span>Checked In</span>
          </NavLink>
          <NavLink
            to="/dashboard/checked-out"
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <FaSignOutAlt />
            <span>Checked Out</span>
          </NavLink>
          <NavLink
            to="/dashboard/add-patient"
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <FaUserPlus />
            <span>Add Patient</span>
          </NavLink>
          <NavLink
            to="/dashboard/delete-patient"
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <FaUserMinus />
            <span>Delete Patient</span>
          </NavLink>
        </nav>
        <div className="logout-btn">
          <CiLogout size={24} />
        </div>
      </aside>

      <main className="dashboard-content">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="checked-in" element={<CheckedIn />} />
          <Route path="checked-out" element={<CheckedOut />} />
          <Route path="add-patient" element={<AddPatient />} />
          <Route path="delete-patient" element={<DeletePatient />} />
        </Routes>
      </main>
    </div>
  );
}
