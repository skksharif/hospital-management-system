import React from "react";

// Example data for checked-in patients
const patients = [
  { id: 1, name: "John Doe", age: 30, room: "101", condition: "Stable" },
  { id: 2, name: "Jane Smith", age: 45, room: "102", condition: "Critical" },
  { id: 3, name: "Emily Johnson", age: 60, room: "103", condition: "Stable" },
  { id: 4, name: "Michael Brown", age: 50, room: "104", condition: "Stable" },
  { id: 5, name: "Linda Davis", age: 35, room: "105", condition: "Critical" },
];

export default function CheckedIn() {
  return (
    <div className="checked-in-container">
      <h2>Checked-In Patients</h2>
      <table className="patients-table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Age</th>
            <th>Room</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.room}</td>
              <td>{patient.condition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
