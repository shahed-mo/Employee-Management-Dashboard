import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // عدّل المسار لو لزم
import { Auth } from "../../Context/Auth"; // عدّل المسار حسب مكان الـ AuthContext
import Pageheader from "../../Components/Pageheader";
import { HiUsers } from "react-icons/hi2";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import { FiDollarSign, FiBriefcase } from "react-icons/fi";
import { IoMdTrendingUp } from "react-icons/io";
import { RiAwardLine } from "react-icons/ri";
import DashboardBoxDetails from "../../Components/DashboardBoxDetails";
import Charts from "../../Components/Charts";
import ChartDashboard from "./ChartDashboard";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import DepartmentOverview from "./DepartmentOverview";
import RecentHire from "./RecentHire";
import EmployeeDashboard from "./EmployeeDashboard";

import "./dahboard.css";

const Dashboard = () => {
  const { User } = Auth();
  const isAdmin = User?.role === "admin";

  const [employees, setEmployees] = useState([]);
  const [payroll, setPayroll] = useState([]);

  // الأدمن بس هو اللي يحتاج البيانات دي (الـ rules بتمنع الموظف من قراءة payroll الكل)
  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      try {
        const [empSnap, paySnap] = await Promise.all([
          getDocs(collection(db, "employees")),
          getDocs(collection(db, "payroll")),
        ]);
        if (cancelled) return;
        setEmployees(empSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setPayroll(paySnap.docs.map((d) => d.data()));
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const totalEmployee = employees.length;

  const activeEmployee = useMemo(
    () => employees.filter((emp) => emp.status === "Active").length,
    [employees]
  );

  const leaveEmployee = useMemo(
    () => employees.filter((emp) => emp.status === "On Leave").length,
    [employees]
  );

  const monthlyPayroll = useMemo(
    () => payroll.reduce((sum, item) => sum + (Number(item.netSalary) || 0), 0),
    [payroll]
  );

  const formattedPayroll = `$${monthlyPayroll.toLocaleString()}`;

  const cards = [
    { id: 1, title: "Total Employees", icon: <HiUsers />, number: totalEmployee, CardText: "All registered employees", present: "+12%" },
    { id: 2, title: "Active Employees", icon: <FaUserCheck />, number: activeEmployee, CardText: "Currently working", present: "+8%" },
    { id: 3, title: "On Leave", icon: <FaUserTimes />, number: leaveEmployee, CardText: "Employees on leave", present: "+3%" },
    { id: 4, title: "Monthly Payroll", icon: <FiDollarSign />, number: formattedPayroll, CardText: "Total monthly expense", present: "+5%" },
  ];

  const charts = [
    { id: 1, cardtitle: "Department Distribution", icon: <FiBriefcase />, color: "#6366f1", component: <ChartDashboard /> },
    { id: 2, cardtitle: "Hiring Trend", icon: <IoMdTrendingUp />, color: "#10b981", component: <LineChart /> },
    { id: 3, cardtitle: "Salary Distribution", icon: <FiDollarSign />, color: "#f59e0b", component: <BarChart /> },
  ];

  const extraCharts = [
    { id: 1, cardtitle: "Department Overview", icon: <FiBriefcase />, component: <DepartmentOverview /> },
    { id: 2, cardtitle: "Recent Hires", icon: <RiAwardLine />, component: <RecentHire /> },
  ];

  if (User?.role === "employee") {
    return <EmployeeDashboard />;
  }

  return (
    <div className="Dashboard-container dahsh">
      <Pageheader
        header="Dashboard Overview"
        text="Monitor your team performance and key metrics"
      />

      <div className="grid">
        {cards.map((card) => (
          <DashboardBoxDetails key={card.id} {...card} />
        ))}
      </div>

      <div className="grid col3">
        {charts.map((item) => (
          <Charts key={item.id} cardtitle={item.cardtitle} icon={item.icon} color={item.color}>
            {item.component}
          </Charts>
        ))}
      </div>

      <div className="grid col2">
        {extraCharts.map((item) => (
          <Charts key={item.id} cardtitle={item.cardtitle} icon={item.icon}>
            {item.component}
          </Charts>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;