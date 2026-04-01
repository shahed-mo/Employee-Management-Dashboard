import { useMemo } from "react";
import Pageheader from "../../Components/Pageheader";
import employeesData from "../../../Employee.json";
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
  const userData = JSON.parse(localStorage.getItem("userData"));
  const data = useMemo(() => employeesData, []);

  const employees = data.employees || [];
  const payroll = data.payroll || [];

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
    () => payroll.reduce((sum, item) => sum + item.netSalary, 0),
    [payroll]
  );

  const formattedPayroll = `$${monthlyPayroll.toLocaleString()}`;

  // 📦 Cards Data
  const cards = [
    {
      id: 1,
      title: "Total Employees",
      icon: <HiUsers />,
      number: totalEmployee,
      CardText: "All registered employees",
      present: "+12%",
    },
    {
      id: 2,
      title: "Active Employees",
      icon: <FaUserCheck />,
      number: activeEmployee,
      CardText: "Currently working",
      present: "+8%",
    },
    {
      id: 3,
      title: "On Leave",
      icon: <FaUserTimes />,
      number: leaveEmployee,
      CardText: "Employees on leave",
      present: "+3%",
    },
    {
      id: 4,
      title: "Monthly Payroll",
      icon: <FiDollarSign />,
      number: formattedPayroll,
      CardText: "Total monthly expense",
      present: "+5%",
    },
  ];

  // 📈 Charts (3 أعمدة)
  const charts = [
    {
      id: 1,
      cardtitle: "Department Distribution",
      icon: <FiBriefcase />,
      color: "#6366f1",
      component: <ChartDashboard />,
    },
    {
      id: 2,
      cardtitle: "Hiring Trend",
      icon: <IoMdTrendingUp />,
      color: "#10b981",
      component: <LineChart />,
    },
    {
      id: 3,
      cardtitle: "Salary Distribution",
      icon: <FiDollarSign />,
      color: "#f59e0b",
      component: <BarChart />,
    },
  ];

  // 📊 Charts (2 أعمدة)
  const extraCharts = [
    {
      id: 1,
      cardtitle: "Department Overview",
      icon: <FiBriefcase />,
      component: <DepartmentOverview />,
    },
    {
      id: 2,
      cardtitle: "Recent Hires",
      icon: <RiAwardLine />,
      component: <RecentHire />,
    },
  ];
  
if (userData?.role === "employee") {
  return <EmployeeDashboard />;
}
  return (
    <div className="Dashboard-container dahsh">
      <Pageheader
        header="Dashboard Overview"
        text="Monitor your team performance and key metrics"
      />

      {/* 📦 Cards */}
      <div className="grid">
        {cards.map((card) => (
          <DashboardBoxDetails key={card.id} {...card} />
        ))}
      </div>

      {/* 📈 Charts */}
      <div className="grid col3">
        {charts.map((item) => (
          <Charts
            key={item.id}
            cardtitle={item.cardtitle}
            icon={item.icon}
            color={item.color}
          >
            {item.component}
          </Charts>
        ))}
      </div>

      {/* 📊 Extra Charts */}
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