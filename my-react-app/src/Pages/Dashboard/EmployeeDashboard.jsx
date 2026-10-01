import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase"; 
import { Auth } from "../../Context/Auth"; 
import "./dahboard.css";

const EmployeeDashboard = () => {
  const { User } = Auth();
  const employeeId = User?.employeeId;

  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    if (!employeeId) return;
    let cancelled = false;
    (async () => {
      try {
        const [attSnap, leaveSnap] = await Promise.all([
          getDocs(query(collection(db, "attendance"), where("employeeId", "==", employeeId))),
          getDocs(query(collection(db, "leaveRequests"), where("employeeId", "==", employeeId))),
        ]);
        if (cancelled) return;
        setAttendance(attSnap.docs.map((d) => d.data()));
        setLeaves(leaveSnap.docs.map((d) => d.data()));
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [employeeId]);

  const totalDays = attendance.length;
  const presentDays = attendance.filter((day) => day.status === "Present").length;
  const performance = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div className="employee-dashboard">
      <div className="employee-header">
        <h2>
          Welcome, <span style={{ fontWeight: "600" }}>{User?.name}</span>
        </h2>
      </div>

      <div className="employee-grid">
        <div className="employee-card">
          <div className="employee-info">
            <span>Position</span>
            <strong>{User?.position}</strong>
          </div>

          <div className="employee-info">
            <span>Department</span>
            <strong>{User?.department}</strong>
          </div>

          <div className="employee-info">
            <span>Status</span>
            <strong className={User?.status === "Active" ? "status-active" : "status-leave"}>
              {User?.status}
            </strong>
          </div>

          <div className="employee-info">
            <span>Salary</span>
            <strong>${User?.salary}</strong>
          </div>
        </div>

        <div className="employee-stats">
          <div className="stat-box">
            <h3>{presentDays}</h3>
            <p>Attendance Days</p>
          </div>

          <div className="stat-box">
            <h3>{leaves.length}</h3>
            <p>Leaves Taken</p>
          </div>

          <div className="stat-box">
            <h3 className={performance >= 80 ? "good" : performance >= 50 ? "medium" : "bad"}>
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