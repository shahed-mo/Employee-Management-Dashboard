import React, { useMemo } from "react";
import employeesData from "../../../Employee.json";
import "./dahboard.css";

const EmployeeDashboard = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));

  const data = useMemo(() => employeesData, []);

  // 🔹 Attendance للموظف
  const employeeAttendance = data.attendance.filter(
    (item) => item.employeeId == userData.id
  );

  const totalDays = employeeAttendance.length;

  const presentDays = employeeAttendance.filter(
    (day) => day.status === "Present"
  ).length;

  const performance =
    totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  // 🔹 Leaves
  const employeeLeaves = data.leaveRequests.filter(
    (item) => item.employeeId == userData.id
  );

  return (
    <div className="employee-dashboard">
      
      {/* Header */}
      <div className="employee-header">
        <h2>
          Welcome, <span style={{fontWeight:'600'}}>{userData?.name}</span>
        </h2>
      </div>

      <div className="employee-grid">
        
        {/* Main Info */}
        <div className="employee-card">
          <div className="employee-info">
            <span>Position</span>
            <strong>{userData?.position}</strong>
          </div>

          <div className="employee-info">
            <span>Department</span>
            <strong>{userData?.department}</strong>
          </div>

          <div className="employee-info">
            <span>Status</span>
            <strong
              className={
                userData?.status === "Active"
                  ? "status-active"
                  : "status-leave"
              }
            >
              {userData?.status}
            </strong>
          </div>

          <div className="employee-info">
            <span>Salary</span>
            <strong>${userData?.salary}</strong>
          </div>
        </div>

        {/* Side Stats */}
        <div className="employee-stats">

          {/* Attendance */}
          <div className="stat-box">
            <h3>{presentDays}</h3>
            <p>Attendance Days</p>
          </div>

          {/* Leaves */}
          <div className="stat-box">
            <h3>{employeeLeaves.length}</h3>
            <p>Leaves Taken</p>
          </div>

          {/* Performance */}
          <div className="stat-box">
            <h3
              className={
                performance >= 80
                  ? "good"
                  : performance >= 50
                  ? "medium"
                  : "bad"
              }
            >
              {performance}%
            </h3>
            <p>Performance</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default EmployeeDashboard;